'use client';

import { serialPortConfigStorage } from '@/services/serialPortConfigService';

const DEBUG_SERIAL =
  typeof process !== 'undefined' && process.env.NODE_ENV === 'development';

/** Velocidades habituales en balanzas industriales / RS-232 */
export const SERIAL_BAUD_RATES = [1200, 2400, 4800, 9600, 19200, 38400, 57600, 115200] as const;

/** Bits de datos (muchas balanzas RS-232 usan 7) */
export const SERIAL_DATA_BITS = [7, 8] as const;

export type SerialRawSample = {
  byteLength: number;
  hex: string;
  text: string;
  receivedAt: number;
};

function logSerialChunk(bytes: Uint8Array, text: string): void {
  if (!DEBUG_SERIAL) return;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join(' ');
  console.log('[Balanza serial] trama cruda', {
    byteLength: bytes.length,
    hex,
    texto: text,
    textoJSON: JSON.stringify(text),
  });
}

/**
 * Servicio para comunicación con la balanza vía puerto serial
 * Nota: Serial API solo funciona en contextos seguros (HTTPS o localhost)
 */
export class SerialPortService {
  private port: any | null = null;
  private reader: ReadableStreamDefaultReader<Uint8Array> | null = null;
  private isConnected = false;
  private lastWeight: number | null = null;
  private lastRawSample: SerialRawSample | null = null;
  private bytesReceivedTotal = 0;
  private connectionLostMessage: string | null = null;

  getLastRawSample(): SerialRawSample | null {
    return this.lastRawSample;
  }

  getBytesReceivedTotal(): number {
    return this.bytesReceivedTotal;
  }

  getConnectionLostMessage(): string | null {
    return this.connectionLostMessage;
  }

  getConfiguredBaudRate(): number {
    const cfg = serialPortConfigStorage.getConfig();
    const n = cfg?.baudRate;
    return typeof n === 'number' && n > 0 ? n : 9600;
  }

  getConfiguredDataBits(): 7 | 8 {
    const cfg = serialPortConfigStorage.getConfig();
    const d = cfg?.dataBits;
    return d === 7 || d === 8 ? d : 7;
  }

  getConfiguredParity(): 'none' | 'even' | 'odd' {
    const cfg = serialPortConfigStorage.getConfig();
    const p = cfg?.parity;
    if (p === 'even' || p === 'odd') {
      return p;
    }
    return 'none';
  }

  private getOpenOptions() {
    const baudRate = this.getConfiguredBaudRate();
    const dataBits = this.getConfiguredDataBits();
    const parity = this.getConfiguredParity();
    return {
      baudRate,
      dataBits,
      stopBits: 1,
      parity,
      flowControl: 'none' as const,
      bufferSize: 4096,
    };
  }

  private resetSessionStats(): void {
    this.bytesReceivedTotal = 0;
    this.lastRawSample = null;
    this.lastWeight = null;
    this.connectionLostMessage = null;
  }

  /**
   * Lectura terminó pero el puerto seguía “conectado”: cerrar y dejar mensaje para la UI.
   */
  private async shutdownDueToReadEnd(message: string): Promise<void> {
    if (!this.isConnected) {
      return;
    }
    this.connectionLostMessage = message;
    await this.disconnect(false);
  }

  private assertReadableAfterOpen(): boolean {
    if (!this.port?.readable) {
      console.error(
        '[Serial] Puerto abierto sin flujo de lectura (readable). Suele ser cable adaptador o dispositivo incorrecto.',
      );
      return false;
    }
    return true;
  }

  private recordRawSample(bytes: Uint8Array, text: string): void {
    this.bytesReceivedTotal += bytes.length;
    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join(' ');
    this.lastRawSample = {
      byteLength: bytes.length,
      hex,
      text,
      receivedAt: Date.now(),
    };
    logSerialChunk(bytes, text);
  }

  /**
   * Verificar si la Serial API está disponible
   */
  isAvailable(): boolean {
    if (typeof window === 'undefined') return false;
    return 'serial' in navigator;
  }

  /**
   * Conectar a un puerto serial específico
   */
  async connect(portName?: string): Promise<boolean> {
    try {
      if (!this.isAvailable()) {
        console.warn('Serial API no está disponible en este navegador');
        return false;
      }

      // Si no se especifica puerto, solicitar al usuario
      if (!portName) {
        const ports = await (navigator as any).serial.getPorts();
        if (ports.length === 0) {
          this.port = await (navigator as any).serial.requestPort();
        } else {
          this.port = ports[0]; // Usar el primer puerto disponible
        }
      }

      if (!this.port) {
        throw new Error('No se seleccionó puerto');
      }

      await this.port.open(this.getOpenOptions());

      if (!this.assertReadableAfterOpen()) {
        await this.port.close().catch(() => {});
        this.port = null;
        this.isConnected = false;
        this.connectionLostMessage =
          'Este puerto no permite leer datos (sin “readable”). Pruebe otro puerto USB/COM o otro cable.';
        return false;
      }

      this.resetSessionStats();
      this.isConnected = true;
      void this.startReading();
      return true;
    } catch (error) {
      console.warn('Error conectando a puerto serial:', error);
      this.isConnected = false;
      return false;
    }
  }

  /**
   * Abre el selector del sistema para elegir otro puerto (Web Serial API).
   * Cierra la conexión actual si existía.
   */
  async connectChoosingPort(): Promise<boolean> {
    try {
      if (!this.isAvailable()) {
        return false;
      }
      await this.disconnect();
      this.port = await (navigator as any).serial.requestPort();
      if (!this.port) {
        return false;
      }
      await this.port.open(this.getOpenOptions());

      if (!this.assertReadableAfterOpen()) {
        await this.port.close().catch(() => {});
        this.port = null;
        this.isConnected = false;
        this.connectionLostMessage =
          'Este puerto no permite leer datos (sin “readable”). Pruebe otro puerto USB/COM o otro cable.';
        return false;
      }

      this.resetSessionStats();
      this.isConnected = true;
      void this.startReading();
      return true;
    } catch (error) {
      this.isConnected = false;
      return false;
    }
  }

  /**
   * Iniciar lectura continua desde el puerto
   */
  private async startReading(): Promise<void> {
    if (!this.port?.readable) {
      await this.shutdownDueToReadEnd('No hay flujo de lectura en el puerto.');
      return;
    }

    try {
      this.reader = this.port.readable.getReader();
    } catch (error) {
      console.warn('Error obteniendo lector del puerto serial:', error);
      await this.shutdownDueToReadEnd(
        'No se pudo iniciar la lectura del puerto. Desconecte y vuelva a elegir el dispositivo.',
      );
      return;
    }

    try {
      while (this.isConnected && this.reader) {
        try {
          const { value, done } = await this.reader.read();

          if (done) {
            break;
          }

          const chunk = value ?? new Uint8Array(0);
          const text = new TextDecoder().decode(chunk);
          this.recordRawSample(chunk, text);
          this.processWeight(text);
        } catch (error) {
          const name = error instanceof Error ? error.name : '';
          if (!this.isConnected || name === 'AbortError') {
            break;
          }
          console.warn('Error leyendo puerto serial:', error);
          break;
        }
      }
    } finally {
      if (this.reader) {
        try {
          this.reader.releaseLock();
        } catch {
          // lock ya liberado
        }
        this.reader = null;
      }
    }

    if (this.isConnected) {
      await this.shutdownDueToReadEnd(
        'Se dejó de leer el puerto serie (el dispositivo cerró el flujo o hubo un error). Si no llegaba ningún dato antes, pruebe otro baud rate en el diálogo de configuración, otro cable USB o confirme que la balanza envía en continuo.',
      );
    }
  }

  /**
   * Procesar y extraer peso de los datos recibidos
   * Asume que la balanza envía formato: "PESO: XXX.XX kg\n"
   */
  private processWeight(text: string): void {
    try {
      const match = text.match(/(\d+\.?\d*)/);
      const weight = match ? parseFloat(match[0]) : NaN;
      const accepted = !isNaN(weight) && weight > 0;

      if (DEBUG_SERIAL) {
        console.log('[Balanza serial] parseo', {
          primerNumero: match?.[0] ?? null,
          peso: Number.isFinite(weight) ? weight : null,
          guardadoEnLastWeight: accepted,
          nota: !match
            ? 'No hay dígitos; revise el protocolo de la balanza.'
            : !accepted
              ? 'El código solo guarda peso > 0 (0 queda fuera).'
              : 'OK',
        });
      }

      if (accepted) {
        this.lastWeight = weight;
      }
    } catch (error) {
      console.warn('Error procesando peso:', error);
    }
  }

  /**
   * Obtener último peso leído de la balanza
   */
  getLastWeight(): number | null {
    return this.lastWeight;
  }

  /**
   * Leer peso de forma síncrona (último valor capturado)
   */
  readWeight(): number | null {
    return this.lastWeight;
  }

  /**
   * Enviar comando a la balanza
   */
  async sendCommand(command: string): Promise<boolean> {
    if (!this.port || !this.isConnected) {
      console.warn('Puerto serial no conectado');
      return false;
    }

    try {
      const writer = this.port.writable.getWriter();
      const encoder = new TextEncoder();
      await writer.write(encoder.encode(command + '\n'));
      writer.releaseLock();
      return true;
    } catch (error) {
      console.warn('Error enviando comando:', error);
      return false;
    }
  }

  /**
   * Verificar si está conectado
   */
  getIsConnected(): boolean {
    return this.isConnected;
  }

  /**
   * Identificador legible del puerto actual (USB vendor/product si aplica).
   */
  getPortFingerprint(): string | null {
    if (!this.port || typeof this.port.getInfo !== 'function') {
      return null;
    }
    try {
      const info = this.port.getInfo() as { usbVendorId?: number; usbProductId?: number };
      if (info.usbVendorId != null && info.usbProductId != null) {
        return `USB ${info.usbVendorId.toString(16)}:${info.usbProductId.toString(16)}`;
      }
    } catch {
      // ignore
    }
    return 'Puerto serial (Web Serial)';
  }

  /**
   * Desconectar del puerto serial
   */
  async disconnect(clearLostMessage: boolean = true): Promise<void> {
    try {
      this.isConnected = false;
      this.lastRawSample = null;
      if (clearLostMessage) {
        this.connectionLostMessage = null;
      }

      if (this.reader) {
        try {
          await this.reader.cancel();
        } catch {
          // ignore
        }
        try {
          this.reader.releaseLock();
        } catch {
          // ignore
        }
        this.reader = null;
      }

      if (this.port) {
        await this.port.close();
        this.port = null;
      }
    } catch (error) {
      console.warn('Error desconectando puerto serial:', error);
    }
  }

  /**
   * Listar puertos seriales disponibles
   */
  async listAvailablePorts(): Promise<any[]> {
    try {
      if (!this.isAvailable()) return [];
      return await (navigator as any).serial.getPorts();
    } catch (error) {
      console.warn('Error listando puertos:', error);
      return [];
    }
  }
}

// Exportar instancia singleton
export const serialPortService = new SerialPortService();
