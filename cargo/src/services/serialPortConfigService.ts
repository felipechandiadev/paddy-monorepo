interface SerialPortConfig {
  port: string; // ej: 'COM3', '/dev/ttyUSB0'
  baudRate: number; // ej: 9600
  dataBits: number; // ej: 8
  stopBits: number; // ej: 1
  parity: 'none' | 'even' | 'odd'; // ej: 'none'
  lastUsed: string; // ISO timestamp
}

const SERIAL_CONFIG_KEY = 'paddy_serial_config';

export const serialPortConfigStorage = {
  // Obtener configuración guardada
  getConfig(): SerialPortConfig | null {
    if (typeof window === 'undefined') {
      return null;
    }

    try {
      const stored = localStorage.getItem(SERIAL_CONFIG_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      return null;
    }
  },

  // Guardar configuración
  saveConfig(config: SerialPortConfig): void {
    if (typeof window === 'undefined') return;

    try {
      config.lastUsed = new Date().toISOString();
      localStorage.setItem(SERIAL_CONFIG_KEY, JSON.stringify(config));
    } catch (error) {
      // Error guardando
    }
  },

  // Obtener puerto guardado
  getLastPort(): string | null {
    const config = this.getConfig();
    return config?.port || null;
  },

  // Limpiar configuración
  clearConfig(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(SERIAL_CONFIG_KEY);
    } catch (error) {
      // Error limpiando
    }
  },
};
