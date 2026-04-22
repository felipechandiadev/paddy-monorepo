'use client';

/**
 * Servicio para comunicación con la balanza vía puerto serial
 * Nota: Serial API solo funciona en contextos seguros (HTTPS o localhost)
 */
export class SerialPortService {
  private port: SerialPort | null = null;
  private reader: ReadableStreamDefaultReader<Uint8Array> | null = null;
  private isConnected = false;
  private lastWeight: number | null = null;

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

      // Abrir puerto con configuración estándar para balanzas (9600, 8N1)
      await this.port.open({
        baudRate: 9600,
        dataBits: 8,
        stopBits: 1,
        parity: 'none',
      });

      this.isConnected = true;
      this.startReading();
      console.log('Puerto serial conectado exitosamente');
      return true;
    } catch (error) {
      console.warn('Error conectando a puerto serial:', error);
      this.isConnected = false;
      return false;
    }
  }

  /**
   * Iniciar lectura continua desde el puerto
   */
  private async startReading(): Promise<void> {
    if (!this.port) return;

    try {
      this.reader = this.port.readable.getReader();

      while (this.isConnected && this.reader) {
        try {
          const { value, done } = await this.reader.read();

          if (done) {
            break;
          }

          // Procesar datos recibidos
          const text = new TextDecoder().decode(value);
          this.processWeight(text);
        } catch (error) {
          if ((error as any).name !== 'TypeError') {
            console.warn('Error leyendo puerto serial:', error);
          }
          break;
        }
      }
    } catch (error) {
      console.warn('Error en lectura de puerto serial:', error);
    } finally {
      if (this.reader) {
        this.reader.releaseLock();
        this.reader = null;
      }
    }
  }

  /**
   * Procesar y extraer peso de los datos recibidos
   * Asume que la balanza envía formato: "PESO: XXX.XX kg\n"
   */
  private processWeight(text: string): void {
    try {
      const match = text.match(/(\d+\.?\d*)/);
      if (match) {
        const weight = parseFloat(match[0]);
        if (!isNaN(weight) && weight > 0) {
          this.lastWeight = weight;
        }
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
   * Desconectar del puerto serial
   */
  async disconnect(): Promise<void> {
    try {
      this.isConnected = false;

      if (this.reader) {
        this.reader.cancel();
        this.reader.releaseLock();
        this.reader = null;
      }

      if (this.port) {
        await this.port.close();
        this.port = null;
      }

      console.log('Puerto serial desconectado');
    } catch (error) {
      console.warn('Error desconectando puerto serial:', error);
    }
  }

  /**
   * Listar puertos seriales disponibles
   */
  async listAvailablePorts(): Promise<SerialPort[]> {
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
