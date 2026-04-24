(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/paddy/cargo/src/services/serialPortConfigService.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "serialPortConfigStorage",
    ()=>serialPortConfigStorage
]);
const SERIAL_CONFIG_KEY = 'paddy_serial_config';
const serialPortConfigStorage = {
    // Obtener configuración guardada
    getConfig () {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        try {
            const stored = localStorage.getItem(SERIAL_CONFIG_KEY);
            return stored ? JSON.parse(stored) : null;
        } catch (error) {
            return null;
        }
    },
    // Guardar configuración
    saveConfig (config) {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        try {
            config.lastUsed = new Date().toISOString();
            localStorage.setItem(SERIAL_CONFIG_KEY, JSON.stringify(config));
        } catch (error) {
        // Error guardando
        }
    },
    // Obtener puerto guardado
    getLastPort () {
        const config = this.getConfig();
        return config?.port || null;
    },
    // Limpiar configuración
    clearConfig () {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        try {
            localStorage.removeItem(SERIAL_CONFIG_KEY);
        } catch (error) {
        // Error limpiando
        }
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/paddy/cargo/src/services/serialPort.service.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SERIAL_BAUD_RATES",
    ()=>SERIAL_BAUD_RATES,
    "SERIAL_DATA_BITS",
    ()=>SERIAL_DATA_BITS,
    "SerialPortService",
    ()=>SerialPortService,
    "serialPortService",
    ()=>serialPortService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/paddy/cargo/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$services$2f$serialPortConfigService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/src/services/serialPortConfigService.ts [app-client] (ecmascript)");
'use client';
;
const DEBUG_SERIAL = typeof __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"] !== 'undefined' && ("TURBOPACK compile-time value", "development") === 'development';
const SERIAL_BAUD_RATES = [
    1200,
    2400,
    4800,
    9600,
    19200,
    38400,
    57600,
    115200
];
const SERIAL_DATA_BITS = [
    7,
    8
];
function logSerialChunk(bytes, text) {
    if (!DEBUG_SERIAL) return;
    const hex = Array.from(bytes, (b)=>b.toString(16).padStart(2, '0')).join(' ');
    console.log('[Balanza serial] trama cruda', {
        byteLength: bytes.length,
        hex,
        texto: text,
        textoJSON: JSON.stringify(text)
    });
}
class SerialPortService {
    port = null;
    reader = null;
    isConnected = false;
    lastWeight = null;
    lastRawSample = null;
    bytesReceivedTotal = 0;
    connectionLostMessage = null;
    getLastRawSample() {
        return this.lastRawSample;
    }
    getBytesReceivedTotal() {
        return this.bytesReceivedTotal;
    }
    getConnectionLostMessage() {
        return this.connectionLostMessage;
    }
    getConfiguredBaudRate() {
        const cfg = __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$services$2f$serialPortConfigService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serialPortConfigStorage"].getConfig();
        const n = cfg?.baudRate;
        return typeof n === 'number' && n > 0 ? n : 9600;
    }
    getConfiguredDataBits() {
        const cfg = __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$services$2f$serialPortConfigService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serialPortConfigStorage"].getConfig();
        const d = cfg?.dataBits;
        return d === 7 || d === 8 ? d : 7;
    }
    getConfiguredParity() {
        const cfg = __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$services$2f$serialPortConfigService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serialPortConfigStorage"].getConfig();
        const p = cfg?.parity;
        if (p === 'even' || p === 'odd') {
            return p;
        }
        return 'none';
    }
    getOpenOptions() {
        const baudRate = this.getConfiguredBaudRate();
        const dataBits = this.getConfiguredDataBits();
        const parity = this.getConfiguredParity();
        return {
            baudRate,
            dataBits,
            stopBits: 1,
            parity,
            flowControl: 'none',
            bufferSize: 4096
        };
    }
    resetSessionStats() {
        this.bytesReceivedTotal = 0;
        this.lastRawSample = null;
        this.lastWeight = null;
        this.connectionLostMessage = null;
    }
    /**
   * Lectura terminó pero el puerto seguía “conectado”: cerrar y dejar mensaje para la UI.
   */ async shutdownDueToReadEnd(message) {
        if (!this.isConnected) {
            return;
        }
        this.connectionLostMessage = message;
        await this.disconnect(false);
    }
    assertReadableAfterOpen() {
        if (!this.port?.readable) {
            console.error('[Serial] Puerto abierto sin flujo de lectura (readable). Suele ser cable adaptador o dispositivo incorrecto.');
            return false;
        }
        return true;
    }
    recordRawSample(bytes, text) {
        this.bytesReceivedTotal += bytes.length;
        const hex = Array.from(bytes, (b)=>b.toString(16).padStart(2, '0')).join(' ');
        this.lastRawSample = {
            byteLength: bytes.length,
            hex,
            text,
            receivedAt: Date.now()
        };
        logSerialChunk(bytes, text);
    }
    /**
   * Verificar si la Serial API está disponible
   */ isAvailable() {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        return 'serial' in navigator;
    }
    /**
   * Conectar a un puerto serial específico
   */ async connect(portName) {
        try {
            if (!this.isAvailable()) {
                console.warn('Serial API no está disponible en este navegador');
                return false;
            }
            // Si no se especifica puerto, solicitar al usuario
            if (!portName) {
                const ports = await navigator.serial.getPorts();
                if (ports.length === 0) {
                    this.port = await navigator.serial.requestPort();
                } else {
                    this.port = ports[0]; // Usar el primer puerto disponible
                }
            }
            if (!this.port) {
                throw new Error('No se seleccionó puerto');
            }
            await this.port.open(this.getOpenOptions());
            if (!this.assertReadableAfterOpen()) {
                await this.port.close().catch(()=>{});
                this.port = null;
                this.isConnected = false;
                this.connectionLostMessage = 'Este puerto no permite leer datos (sin “readable”). Pruebe otro puerto USB/COM o otro cable.';
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
   */ async connectChoosingPort() {
        try {
            if (!this.isAvailable()) {
                return false;
            }
            await this.disconnect();
            this.port = await navigator.serial.requestPort();
            if (!this.port) {
                return false;
            }
            await this.port.open(this.getOpenOptions());
            if (!this.assertReadableAfterOpen()) {
                await this.port.close().catch(()=>{});
                this.port = null;
                this.isConnected = false;
                this.connectionLostMessage = 'Este puerto no permite leer datos (sin “readable”). Pruebe otro puerto USB/COM o otro cable.';
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
   */ async startReading() {
        if (!this.port?.readable) {
            await this.shutdownDueToReadEnd('No hay flujo de lectura en el puerto.');
            return;
        }
        try {
            this.reader = this.port.readable.getReader();
        } catch (error) {
            console.warn('Error obteniendo lector del puerto serial:', error);
            await this.shutdownDueToReadEnd('No se pudo iniciar la lectura del puerto. Desconecte y vuelva a elegir el dispositivo.');
            return;
        }
        try {
            while(this.isConnected && this.reader){
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
        } finally{
            if (this.reader) {
                try {
                    this.reader.releaseLock();
                } catch  {
                // lock ya liberado
                }
                this.reader = null;
            }
        }
        if (this.isConnected) {
            await this.shutdownDueToReadEnd('Se dejó de leer el puerto serie (el dispositivo cerró el flujo o hubo un error). Si no llegaba ningún dato antes, pruebe otro baud rate en el diálogo de configuración, otro cable USB o confirme que la balanza envía en continuo.');
        }
    }
    /**
   * Procesar y extraer peso de los datos recibidos
   * Asume que la balanza envía formato: "PESO: XXX.XX kg\n"
   */ processWeight(text) {
        try {
            const match = text.match(/(\d+\.?\d*)/);
            const weight = match ? parseFloat(match[0]) : NaN;
            const accepted = !isNaN(weight) && weight > 0;
            if (DEBUG_SERIAL) {
                console.log('[Balanza serial] parseo', {
                    primerNumero: match?.[0] ?? null,
                    peso: Number.isFinite(weight) ? weight : null,
                    guardadoEnLastWeight: accepted,
                    nota: !match ? 'No hay dígitos; revise el protocolo de la balanza.' : !accepted ? 'El código solo guarda peso > 0 (0 queda fuera).' : 'OK'
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
   */ getLastWeight() {
        return this.lastWeight;
    }
    /**
   * Leer peso de forma síncrona (último valor capturado)
   */ readWeight() {
        return this.lastWeight;
    }
    /**
   * Enviar comando a la balanza
   */ async sendCommand(command) {
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
   */ getIsConnected() {
        return this.isConnected;
    }
    /**
   * Identificador legible del puerto actual (USB vendor/product si aplica).
   */ getPortFingerprint() {
        if (!this.port || typeof this.port.getInfo !== 'function') {
            return null;
        }
        try {
            const info = this.port.getInfo();
            if (info.usbVendorId != null && info.usbProductId != null) {
                return `USB ${info.usbVendorId.toString(16)}:${info.usbProductId.toString(16)}`;
            }
        } catch  {
        // ignore
        }
        return 'Puerto serial (Web Serial)';
    }
    /**
   * Desconectar del puerto serial
   */ async disconnect(clearLostMessage = true) {
        try {
            this.isConnected = false;
            this.lastRawSample = null;
            if (clearLostMessage) {
                this.connectionLostMessage = null;
            }
            if (this.reader) {
                try {
                    await this.reader.cancel();
                } catch  {
                // ignore
                }
                try {
                    this.reader.releaseLock();
                } catch  {
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
   */ async listAvailablePorts() {
        try {
            if (!this.isAvailable()) return [];
            return await navigator.serial.getPorts();
        } catch (error) {
            console.warn('Error listando puertos:', error);
            return [];
        }
    }
}
const serialPortService = new SerialPortService();
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/paddy/cargo/src/hooks/useSerialPort.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useSerialPort",
    ()=>useSerialPort
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$services$2f$serialPort$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/src/services/serialPort.service.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$services$2f$serialPortConfigService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/src/services/serialPortConfigService.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function persistSerialConfig() {
    const fp = __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$services$2f$serialPort$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serialPortService"].getPortFingerprint();
    const prev = __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$services$2f$serialPortConfigService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serialPortConfigStorage"].getConfig();
    __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$services$2f$serialPortConfigService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serialPortConfigStorage"].saveConfig({
        port: fp || 'serial',
        baudRate: prev?.baudRate ?? 9600,
        dataBits: prev?.dataBits === 8 ? 8 : 7,
        stopBits: 1,
        parity: prev?.parity === 'even' || prev?.parity === 'odd' ? prev.parity : 'none',
        lastUsed: new Date().toISOString()
    });
}
function useSerialPort(enabled = false) {
    _s();
    const [isConnected, setIsConnected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isConnecting, setIsConnecting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [lastWeight, setLastWeight] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [lastRawSample, setLastRawSample] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [bytesReceivedTotal, setBytesReceivedTotal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const pollingIntervalRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const isConnectedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    /** Evita que el efecto de auto-conexión vuelva a conectar tras un Desconectar explícito */ const suppressAutoConnectRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useSerialPort.useEffect": ()=>{
            isConnectedRef.current = isConnected;
        }
    }["useSerialPort.useEffect"], [
        isConnected
    ]);
    // Verificar disponibilidad de Serial API
    const isAvailable = __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$services$2f$serialPort$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serialPortService"].isAvailable();
    const configuredBaudRate = __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$services$2f$serialPort$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serialPortService"].getConfiguredBaudRate();
    const configuredDataBits = __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$services$2f$serialPort$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serialPortService"].getConfiguredDataBits();
    const configuredParity = __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$services$2f$serialPort$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serialPortService"].getConfiguredParity();
    // Conectar
    const connect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSerialPort.useCallback[connect]": async ()=>{
            if (!isAvailable) {
                setError('Serial API no está disponible en este navegador');
                return;
            }
            if (isConnected) {
                return;
            }
            setIsConnecting(true);
            setError(null);
            try {
                const success = await __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$services$2f$serialPort$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serialPortService"].connect();
                if (success) {
                    suppressAutoConnectRef.current = false;
                    setIsConnected(true);
                    persistSerialConfig();
                    const interval = setInterval({
                        "useSerialPort.useCallback[connect].interval": ()=>{
                            if (!__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$services$2f$serialPort$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serialPortService"].getIsConnected() && isConnectedRef.current) {
                                isConnectedRef.current = false;
                                suppressAutoConnectRef.current = true;
                                setIsConnected(false);
                                const lost = __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$services$2f$serialPort$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serialPortService"].getConnectionLostMessage();
                                if (lost) {
                                    setError(lost);
                                }
                                if (pollingIntervalRef.current) {
                                    clearInterval(pollingIntervalRef.current);
                                    pollingIntervalRef.current = null;
                                }
                                return;
                            }
                            const weight = __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$services$2f$serialPort$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serialPortService"].readWeight();
                            if (weight !== null) {
                                setLastWeight(weight);
                            }
                            setLastRawSample(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$services$2f$serialPort$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serialPortService"].getLastRawSample());
                            setBytesReceivedTotal(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$services$2f$serialPort$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serialPortService"].getBytesReceivedTotal());
                        }
                    }["useSerialPort.useCallback[connect].interval"], 100);
                    pollingIntervalRef.current = interval;
                } else {
                    suppressAutoConnectRef.current = true;
                    setError(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$services$2f$serialPort$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serialPortService"].getConnectionLostMessage() || 'No se pudo conectar al puerto serial');
                }
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
                setError(`Error conectando: ${errorMessage}`);
            } finally{
                setIsConnecting(false);
            }
        }
    }["useSerialPort.useCallback[connect]"], [
        isConnected,
        isAvailable
    ]);
    const connectChoosingPort = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSerialPort.useCallback[connectChoosingPort]": async ()=>{
            if (!isAvailable) {
                setError('Serial API no está disponible en este navegador');
                return;
            }
            setIsConnecting(true);
            setError(null);
            try {
                if (pollingIntervalRef.current) {
                    clearInterval(pollingIntervalRef.current);
                    pollingIntervalRef.current = null;
                }
                const success = await __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$services$2f$serialPort$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serialPortService"].connectChoosingPort();
                if (success) {
                    suppressAutoConnectRef.current = false;
                    setIsConnected(true);
                    persistSerialConfig();
                    const interval = setInterval({
                        "useSerialPort.useCallback[connectChoosingPort].interval": ()=>{
                            if (!__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$services$2f$serialPort$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serialPortService"].getIsConnected() && isConnectedRef.current) {
                                isConnectedRef.current = false;
                                suppressAutoConnectRef.current = true;
                                setIsConnected(false);
                                const lost = __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$services$2f$serialPort$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serialPortService"].getConnectionLostMessage();
                                if (lost) {
                                    setError(lost);
                                }
                                if (pollingIntervalRef.current) {
                                    clearInterval(pollingIntervalRef.current);
                                    pollingIntervalRef.current = null;
                                }
                                return;
                            }
                            const weight = __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$services$2f$serialPort$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serialPortService"].readWeight();
                            if (weight !== null) {
                                setLastWeight(weight);
                            }
                            setLastRawSample(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$services$2f$serialPort$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serialPortService"].getLastRawSample());
                            setBytesReceivedTotal(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$services$2f$serialPort$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serialPortService"].getBytesReceivedTotal());
                        }
                    }["useSerialPort.useCallback[connectChoosingPort].interval"], 100);
                    pollingIntervalRef.current = interval;
                } else {
                    setIsConnected(false);
                    suppressAutoConnectRef.current = true;
                    setError(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$services$2f$serialPort$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serialPortService"].getConnectionLostMessage() || 'No se pudo conectar o se canceló la selección del puerto');
                }
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
                setError(`Error: ${errorMessage}`);
                setIsConnected(false);
            } finally{
                setIsConnecting(false);
            }
        }
    }["useSerialPort.useCallback[connectChoosingPort]"], [
        isAvailable
    ]);
    // Desconectar
    const disconnect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSerialPort.useCallback[disconnect]": async ()=>{
            try {
                suppressAutoConnectRef.current = true;
                if (pollingIntervalRef.current) {
                    clearInterval(pollingIntervalRef.current);
                    pollingIntervalRef.current = null;
                }
                await __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$services$2f$serialPort$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serialPortService"].disconnect();
                setIsConnected(false);
                setLastWeight(null);
                setLastRawSample(null);
                setBytesReceivedTotal(0);
                setError(null);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
                setError(`Error desconectando: ${errorMessage}`);
            }
        }
    }["useSerialPort.useCallback[disconnect]"], []);
    // Leer peso
    const readWeight = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSerialPort.useCallback[readWeight]": ()=>{
            const weight = __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$services$2f$serialPort$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serialPortService"].readWeight();
            if (weight !== null) {
                setLastWeight(weight);
            }
            return weight;
        }
    }["useSerialPort.useCallback[readWeight]"], []);
    // Enviar comando
    const sendCommand = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSerialPort.useCallback[sendCommand]": async (command)=>{
            return await __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$services$2f$serialPort$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serialPortService"].sendCommand(command);
        }
    }["useSerialPort.useCallback[sendCommand]"], []);
    // Auto-conectar si enabled es true (no tras desconectar manualmente en esta sesión)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useSerialPort.useEffect": ()=>{
            if (enabled && isAvailable && !isConnected && !suppressAutoConnectRef.current) {
                connect();
            }
        }
    }["useSerialPort.useEffect"], [
        enabled,
        isAvailable,
        isConnected,
        connect
    ]);
    // Cleanup al desmontar
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useSerialPort.useEffect": ()=>{
            return ({
                "useSerialPort.useEffect": ()=>{
                    if (pollingIntervalRef.current) {
                        clearInterval(pollingIntervalRef.current);
                    }
                }
            })["useSerialPort.useEffect"];
        }
    }["useSerialPort.useEffect"], []);
    return {
        isConnected,
        isAvailable,
        isConnecting,
        error,
        lastWeight,
        lastRawSample,
        bytesReceivedTotal,
        configuredBaudRate,
        configuredDataBits,
        configuredParity,
        connect,
        connectChoosingPort,
        disconnect,
        readWeight,
        sendCommand
    };
}
_s(useSerialPort, "E83o3o/Pd+MVj+lh8jRWHvfXRDI=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/paddy/cargo/src/shared/components/ui/Button/Button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
const variantClasses = {
    primary: "btn-contained-primary cursor-pointer",
    secondary: "btn-contained-secondary cursor-pointer",
    outlined: "btn-outlined cursor-pointer",
    outlinedSecondary: "btn-outlined-secondary cursor-pointer",
    text: "btn-text cursor-pointer",
    danger: "btn-contained-danger cursor-pointer"
};
const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg"
};
const disabledClasses = {
    primary: "btn-contained-primary opacity-50 cursor-not-allowed",
    secondary: "btn-contained-secondary opacity-50 cursor-not-allowed",
    outlined: "btn-outlined opacity-50 cursor-not-allowed",
    outlinedSecondary: "btn-outlined-secondary opacity-50 cursor-not-allowed",
    text: "btn-text opacity-50 cursor-not-allowed",
    danger: "btn-contained-danger opacity-50 cursor-not-allowed"
};
const Button = ({ children, variant = "primary", size = "md", className = "", disabled = false, loading = false, ...props })=>{
    const baseClasses = disabled || loading ? disabledClasses[variant] || disabledClasses.primary : variantClasses[variant] || variantClasses.primary;
    const sizeClass = sizeClasses[size] || sizeClasses.md;
    const buttonClasses = `${baseClasses} ${sizeClass} ${className}`;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        className: buttonClasses,
        "data-test-id": "button-root",
        disabled: disabled || loading,
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center gap-2",
            children: [
                loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    className: "animate-spin h-4 w-4 text-current",
                    xmlns: "http://www.w3.org/2000/svg",
                    fill: "none",
                    viewBox: "0 0 24 24",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                            className: "opacity-25",
                            cx: "12",
                            cy: "12",
                            r: "10",
                            stroke: "currentColor",
                            strokeWidth: "4"
                        }, void 0, false, {
                            fileName: "[project]/paddy/cargo/src/shared/components/ui/Button/Button.tsx",
                            lineNumber: 65,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            className: "opacity-75",
                            fill: "currentColor",
                            d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        }, void 0, false, {
                            fileName: "[project]/paddy/cargo/src/shared/components/ui/Button/Button.tsx",
                            lineNumber: 66,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/paddy/cargo/src/shared/components/ui/Button/Button.tsx",
                    lineNumber: 64,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0)),
                children
            ]
        }, void 0, true, {
            fileName: "[project]/paddy/cargo/src/shared/components/ui/Button/Button.tsx",
            lineNumber: 62,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/paddy/cargo/src/shared/components/ui/Button/Button.tsx",
        lineNumber: 56,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = Button;
var _c;
__turbopack_context__.k.register(_c, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/paddy/cargo/src/shared/components/ui/Dialog/Dialog.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$shared$2f$components$2f$ui$2f$Button$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/src/shared/components/ui/Button/Button.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
// Preset widths (in pixels) for each size at each breakpoint
const dialogSizePresets = {
    xs: {
        xs: 280,
        sm: 320,
        md: 420,
        lg: 420,
        xl: 420
    },
    sm: {
        xs: 320,
        sm: 420,
        md: 520,
        lg: 640,
        xl: 640
    },
    md: {
        xs: 360,
        sm: 520,
        md: 640,
        lg: 800,
        xl: 800
    },
    lg: {
        xs: 400,
        sm: 640,
        md: 800,
        lg: 900,
        xl: 900
    },
    xl: {
        xs: 450,
        sm: 800,
        md: 900,
        lg: 1000,
        xl: 1024
    },
    xxl: {
        xs: 585,
        sm: 1040,
        md: 1170,
        lg: 1300,
        xl: 1331
    }
};
const Dialog = ({ open, onClose, title, children, size = 'md', customSize, maxWidth, fullWidth = false, minWidth, scroll = 'body', height, maxHeight, minHeight, animationDuration = 200, overflowBehavior = 'auto', zIndex = 50, disableBackdropClick = false, persistent = false, className = '', headerClassName = '', titleClassName = '', bodyClassName = '', contentStyle, actions, hideActions = false, showCloseButton = false, closeButtonText = 'cerrar', onCloseButtonClick, 'data-test-id': dataTestId })=>{
    _s();
    const [isVisible, setIsVisible] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [shouldRender, setShouldRender] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Dialog.useEffect": ()=>{
            setMounted(true);
        }
    }["Dialog.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Dialog.useEffect": ()=>{
            if (open) {
                setShouldRender(true);
                setTimeout({
                    "Dialog.useEffect": ()=>setIsVisible(true)
                }["Dialog.useEffect"], 10);
            } else {
                setIsVisible(false);
                setTimeout({
                    "Dialog.useEffect": ()=>setShouldRender(false)
                }["Dialog.useEffect"], animationDuration);
            }
        }
    }["Dialog.useEffect"], [
        open,
        animationDuration
    ]);
    // Bloquear/restaurar scroll del body cuando el dialog se abre/cierra
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Dialog.useEffect": ()=>{
            if (open) {
                // Guardar el overflow original del body
                const originalOverflow = document.body.style.overflow;
                document.body.style.overflow = 'hidden';
                // Restaurar al desmontar o cerrar
                return ({
                    "Dialog.useEffect": ()=>{
                        document.body.style.overflow = originalOverflow;
                    }
                })["Dialog.useEffect"];
            }
        }
    }["Dialog.useEffect"], [
        open
    ]);
    // Handle ESC key
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Dialog.useEffect": ()=>{
            if (!open || persistent) return;
            const handleKeyDown = {
                "Dialog.useEffect.handleKeyDown": (event)=>{
                    if (event.key === 'Escape') {
                        onClose();
                    }
                }
            }["Dialog.useEffect.handleKeyDown"];
            document.addEventListener('keydown', handleKeyDown);
            return ({
                "Dialog.useEffect": ()=>document.removeEventListener('keydown', handleKeyDown)
            })["Dialog.useEffect"];
        }
    }["Dialog.useEffect"], [
        open,
        onClose,
        persistent
    ]);
    // Build width style based on size or customSize
    const buildWidthStyle = ()=>{
        const breakpoints = [
            'xs',
            'sm',
            'md',
            'lg',
            'xl'
        ];
        // For custom size, use 'md' as base or customSize if provided
        const baseSize = size === 'custom' ? 'md' : size;
        const baseWidths = dialogSizePresets[baseSize];
        const widths = customSize ? {
            ...baseWidths,
            ...customSize
        } : baseWidths;
        // Get width for current breakpoint (this is a simplification - real implementation would use useMediaQuery)
        // For now, we'll use the lg width as default and let CSS handle responsive
        const defaultWidth = widths['lg'] || widths['md'] || widths['sm'] || widths['xs'] || 600;
        return {
            width: fullWidth ? '100%' : `${defaultWidth}px`
        };
    };
    const rootScrollClasses = `flex justify-center min-h-screen ${scroll === 'body' ? 'items-start overflow-y-auto pt-24 pb-12' : 'items-center'}`;
    const widthStyle = buildWidthStyle();
    const marginClasses = fullWidth ? 'mx-4 sm:mx-4 md:mx-4' : 'mx-4 sm:mx-8 md:mx-12';
    const contentClass = [
        'bg-white rounded-lg shadow-lg',
        'p-0 overflow-hidden',
        marginClasses,
        'relative',
        scroll === 'body' ? 'max-h-none' : 'flex flex-col max-h-[90vh]',
        'transition-all',
        isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0',
        className
    ].filter(Boolean).join(' ');
    const contentWrapperStyle = {
        ...widthStyle,
        maxWidth: size === 'custom' && maxWidth ? typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth : undefined,
        minWidth: minWidth ? typeof minWidth === 'number' ? `${minWidth}px` : minWidth : undefined,
        height: height ? typeof height === 'number' ? `${height}px` : height : undefined,
        maxHeight: maxHeight ? typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight : undefined,
        minHeight: minHeight ? typeof minHeight === 'number' ? `${minHeight}px` : minHeight : undefined,
        overflow: overflowBehavior,
        transitionDuration: `${animationDuration}ms`,
        ...contentStyle
    };
    const backdropStyle = {
        zIndex,
        transitionDuration: `${animationDuration}ms`
    };
    const handleCloseButtonClick = ()=>{
        if (onCloseButtonClick) {
            onCloseButtonClick();
        }
        onClose();
    };
    const handleBackdropClick = (e)=>{
        if (e.target === e.currentTarget && !disableBackdropClick && !persistent) {
            onClose();
        }
    };
    if (!shouldRender || !mounted) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPortal"])(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        role: "dialog",
        "aria-modal": "true",
        "aria-label": typeof title === 'string' ? title || 'Dialog' : 'Dialog',
        className: `fixed inset-0 transition-all bg-black/70 ${isVisible ? 'opacity-100' : 'opacity-0'} ${rootScrollClasses}`,
        style: backdropStyle,
        onClick: handleBackdropClick,
        "data-test-id": "dialog-root",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: contentClass,
            style: contentWrapperStyle,
            onClick: (e)=>e.stopPropagation(),
            "data-test-id": dataTestId || 'dialog-content',
            children: [
                title != null && title !== '' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `flex items-center mb-2 p-4 pb-0 ${headerClassName}`.trim(),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: `title p-1 flex-1 ${titleClassName}`.trim(),
                            "data-test-id": "dialog-title",
                            children: title
                        }, void 0, false, {
                            fileName: "[project]/paddy/cargo/src/shared/components/ui/Dialog/Dialog.tsx",
                            lineNumber: 278,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        showCloseButton && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-end w-auto",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$shared$2f$components$2f$ui$2f$Button$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "outlined",
                                size: "sm",
                                onClick: handleCloseButtonClick,
                                className: "ml-2",
                                children: closeButtonText
                            }, void 0, false, {
                                fileName: "[project]/paddy/cargo/src/shared/components/ui/Dialog/Dialog.tsx",
                                lineNumber: 283,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/paddy/cargo/src/shared/components/ui/Dialog/Dialog.tsx",
                            lineNumber: 282,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/paddy/cargo/src/shared/components/ui/Dialog/Dialog.tsx",
                    lineNumber: 277,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `w-full ${title && title !== '' ? 'pt-2 px-4 pb-4' : 'pt-0'} ${scroll === 'paper' ? 'flex-1 overflow-y-auto' : ''} ${bodyClassName}`.trim(),
                    "data-test-id": "dialog-body",
                    children: children
                }, void 0, false, {
                    fileName: "[project]/paddy/cargo/src/shared/components/ui/Dialog/Dialog.tsx",
                    lineNumber: 296,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                !hideActions && actions && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-full shrink-0 border-t border-gray-200 bg-white px-6 py-4",
                    "data-test-id": "dialog-actions",
                    children: actions
                }, void 0, false, {
                    fileName: "[project]/paddy/cargo/src/shared/components/ui/Dialog/Dialog.tsx",
                    lineNumber: 305,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/paddy/cargo/src/shared/components/ui/Dialog/Dialog.tsx",
            lineNumber: 270,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/paddy/cargo/src/shared/components/ui/Dialog/Dialog.tsx",
        lineNumber: 261,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0)), document.body);
};
_s(Dialog, "gLn1DrbX6vCgTWHKFhK3tByGRMI=");
_c = Dialog;
const __TURBOPACK__default__export__ = Dialog;
var _c;
__turbopack_context__.k.register(_c, "Dialog");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/paddy/cargo/src/shared/components/ui/DropdownList/DropdownList.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "dropdownOptionClass",
    ()=>dropdownOptionClass
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
const dropdownOptionClass = "dropdown-option";
const DropdownList = ({ open, children, className = "", style, testId, dropUp = false, highlightedIndex = -1, onHoverChange, anchorRef, usePortal = false })=>{
    _s();
    const [hoveredIndex, setHoveredIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(-1);
    const [position, setPosition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const dropdownRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Handle client-side mounting for portal
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DropdownList.useEffect": ()=>{
            setMounted(true);
        }
    }["DropdownList.useEffect"], []);
    // Calculate position when using portal mode
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DropdownList.useEffect": ()=>{
            if (!usePortal || !open || !anchorRef?.current) {
                setPosition(null);
                return;
            }
            const updatePosition = {
                "DropdownList.useEffect.updatePosition": ()=>{
                    if (!anchorRef.current) return;
                    const rect = anchorRef.current.getBoundingClientRect();
                    const dropdownHeight = dropdownRef.current?.offsetHeight || 224; // max-h-56 = 224px
                    const viewportHeight = window.innerHeight;
                    // Check if dropdown would overflow bottom of viewport
                    const spaceBelow = viewportHeight - rect.bottom;
                    const spaceAbove = rect.top;
                    const shouldDropUp = dropUp || spaceBelow < dropdownHeight && spaceAbove > spaceBelow;
                    setPosition({
                        top: shouldDropUp ? rect.top - dropdownHeight - 4 : rect.bottom + 4,
                        left: rect.left,
                        width: rect.width
                    });
                }
            }["DropdownList.useEffect.updatePosition"];
            updatePosition();
            // Update position on scroll or resize
            window.addEventListener('scroll', updatePosition, true);
            window.addEventListener('resize', updatePosition);
            return ({
                "DropdownList.useEffect": ()=>{
                    window.removeEventListener('scroll', updatePosition, true);
                    window.removeEventListener('resize', updatePosition);
                }
            })["DropdownList.useEffect"];
        }
    }["DropdownList.useEffect"], [
        open,
        usePortal,
        anchorRef,
        dropUp
    ]);
    if (!open) return null;
    const handleMouseEnter = (index)=>{
        setHoveredIndex(index);
        onHoverChange?.(index);
    };
    const handleMouseLeave = ()=>{
        setHoveredIndex(-1);
        onHoverChange?.(-1);
    };
    // If children are provided, render them with hover management
    const childrenArray = __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Children.toArray(children);
    const childrenWithHover = children ? childrenArray.map((child, idx)=>{
        if (/*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].isValidElement(child)) {
            const currentClassName = child.props.className || '';
            const hoverClass = highlightedIndex === idx ? 'bg-secondary-30' : hoveredIndex === idx ? 'bg-secondary-20' : '';
            // Get total children count for first/last detection
            const isFirst = idx === 0;
            const isLast = idx === childrenArray.length - 1;
            const roundedClass = isFirst ? 'rounded-t' : isLast ? 'rounded-b' : '';
            return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].cloneElement(child, {
                key: child.key ?? idx,
                className: `${currentClassName} ${hoverClass} ${roundedClass}`.trim(),
                onMouseEnter: ()=>handleMouseEnter(idx),
                onMouseLeave: ()=>handleMouseLeave()
            });
        }
        return child;
    }) : children;
    // Base styles for non-portal mode
    const dropStyle = dropUp ? {
        bottom: '100%',
        top: 'auto',
        marginBottom: '0.25rem',
        marginTop: 0
    } : {
        marginTop: '0.25rem'
    };
    // Portal styles (fixed positioning)
    const portalStyle = position ? {
        position: 'fixed',
        top: position.top,
        left: position.left,
        width: position.width,
        zIndex: 9999
    } : {};
    const dropdownElement = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
        ref: dropdownRef,
        className: `dropdown-list ${usePortal ? 'dropdown-list-portal' : ''} ${className}`,
        style: usePortal && position ? {
            ...portalStyle,
            ...style
        } : dropUp || Object.keys(style || {}).length > 0 ? {
            ...dropStyle,
            ...style
        } : {
            ...dropStyle
        },
        "data-test-id": testId || "dropdown-list",
        children: childrenWithHover
    }, void 0, false, {
        fileName: "[project]/paddy/cargo/src/shared/components/ui/DropdownList/DropdownList.tsx",
        lineNumber: 141,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
    // Use portal for rendering outside the DOM hierarchy
    if (usePortal && mounted) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPortal"])(dropdownElement, document.body);
    }
    return dropdownElement;
};
_s(DropdownList, "UBiuSQNK4Ix8Ujuo9/Z/tmOrwpc=");
_c = DropdownList;
const __TURBOPACK__default__export__ = DropdownList;
var _c;
__turbopack_context__.k.register(_c, "DropdownList");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/paddy/cargo/src/shared/components/ui/IconButton/IconButton.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
const variantClasses = {
    containedPrimary: "icon-button-contained-primary",
    containedSecondary: "icon-button-contained-secondary",
    text: "icon-button-text",
    basic: "icon-button-basic",
    basicSecondary: "icon-button-basic-secondary",
    outlined: "icon-button-outlined",
    ghost: "icon-button-ghost"
};
const sizeMap = {
    xs: 'icon-size-xs w-5 h-5',
    sm: 'icon-size-sm w-7 h-7',
    md: 'icon-size-md w-10 h-10',
    lg: 'icon-size-lg w-12 h-12',
    xl: 'icon-size-xl w-14 h-14'
};
const IconButton = ({ icon, variant = "containedPrimary", size = 'md', disabled = false, isLoading = false, className = "", onClick, ariaLabel, ...props })=>{
    const sizeClass = typeof size === 'number' ? `w-[${size + 16}px] h-[${size + 16}px]` : sizeMap[size] || sizeMap['md'];
    const iconSizeClass = typeof size === 'number' ? '' : `icon-size-${size}`;
    const effectiveDisabled = disabled || isLoading;
    const disabledClass = effectiveDisabled ? 'icon-button-disabled' : '';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "button",
        className: `${variantClasses[variant] || variantClasses["containedPrimary"]} ${disabledClass} ${className} ${sizeClass}`,
        "data-test-id": "icon-button-root",
        onClick: onClick,
        "aria-label": ariaLabel,
        disabled: effectiveDisabled,
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: `material-symbols-outlined select-none ${iconSizeClass} ${isLoading ? 'animate-spin' : ''}`,
            "aria-hidden": true,
            children: isLoading ? 'progress_activity' : icon
        }, void 0, false, {
            fileName: "[project]/paddy/cargo/src/shared/components/ui/IconButton/IconButton.tsx",
            lineNumber: 51,
            columnNumber: 4
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/paddy/cargo/src/shared/components/ui/IconButton/IconButton.tsx",
        lineNumber: 42,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
};
_c = IconButton;
const __TURBOPACK__default__export__ = IconButton;
var _c;
__turbopack_context__.k.register(_c, "IconButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/paddy/cargo/src/lib/formatChileanRut.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Formato visual RUT chileno (misma regla que TextField type="dni"):
 * • 12.222.222-4  (8 dígitos + DV)
 * • 3.444.444-3   (7 dígitos + DV)
 * • …-k cuando el dígito verificador es K
 */ __turbopack_context__.s([
    "formatChileanRut",
    ()=>formatChileanRut
]);
function formatChileanRut(value) {
    let cleanValue = value.replace(/[^0-9kK]/g, '');
    cleanValue = cleanValue.toLowerCase();
    if (cleanValue.length === 0) return '';
    if (cleanValue.length === 1) return cleanValue;
    if (cleanValue.length === 9 && !cleanValue.includes('k')) {
        const numbers = cleanValue.slice(0, 8);
        const dv = cleanValue.slice(8);
        return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5)}-${dv}`;
    }
    if (cleanValue.length === 8 && !cleanValue.includes('k')) {
        const numbers = cleanValue.slice(0, 7);
        const dv = cleanValue.slice(7);
        return `${numbers.slice(0, 1)}.${numbers.slice(1, 4)}.${numbers.slice(4)}-${dv}`;
    }
    if (cleanValue.length === 9 && cleanValue.endsWith('k')) {
        const numbers = cleanValue.slice(0, 8);
        return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5)}-k`;
    }
    if (cleanValue.length === 8 && cleanValue.endsWith('k')) {
        const numbers = cleanValue.slice(0, 7);
        return `${numbers.slice(0, 1)}.${numbers.slice(1, 4)}.${numbers.slice(4)}-k`;
    }
    return cleanValue;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/paddy/cargo/src/shared/components/ui/TextField/TextField.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TextField",
    ()=>TextField
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$lib$2f$formatChileanRut$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/src/lib/formatChileanRut.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
const TextField = ({ id, label, labelAlwaysVisible = false, value, onChange, onKeyDown, onFocus, onBlur, selectAllOnFocus = false, compact = false, type = "text", name, placeholder, startIcon, startAdornment, endIcon, className = "", variante = "normal", rows, required = false, readOnly = false, disabled = false, labelStyle, placeholderColor, currencySymbol = "$", allowDecimalComma = false, currencyField, currencies, phonePrefix, allowLetters = false, passwordVisibilityToggle = true, autoComplete, ...props })=>{
    _s();
    const [focused, setFocused] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const inputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [showPassword, setShowPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [currencyRawValue, setCurrencyRawValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(value);
    const passwordToggleLabel = showPassword ? "Ocultar contraseña" : "Mostrar contraseña";
    // Sincronizar currencyRawValue con value cuando este cambie externamente
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TextField.useEffect": ()=>{
            if (type === 'currency') {
                setCurrencyRawValue(value);
            }
        }
    }["TextField.useEffect"], [
        value,
        type
    ]);
    // Determinar si el campo está efectivamente deshabilitado
    const isDisabled = disabled || readOnly;
    // Controlador de cambios que respeta el estado disabled
    const handleChange = (e)=>{
        if (isDisabled) return;
        // Si es teléfono, filtrar letras si no se permite
        if (type === 'tel' && !allowLetters) {
            let rawValue = e.target.value;
            // Remover letras (solo números y prefijo)
            rawValue = rawValue.replace(/[^\d+]/g, '');
            // Mantener el prefijo si existe
            if (phonePrefix && rawValue.startsWith(phonePrefix)) {
            // Ok
            } else if (phonePrefix) {
                rawValue = phonePrefix + rawValue.replace(/[^\d]/g, '');
            }
            // Crear evento sintético
            const syntheticEvent = {
                ...e,
                target: {
                    ...e.target,
                    value: rawValue
                }
            };
            onChange(syntheticEvent);
            return;
        }
        onChange(e);
    };
    // Función para formatear moneda con símbolo configurable
    const formatCurrency = (raw, symbol = "$")=>{
        if (!raw) return '';
        if (allowDecimalComma) {
            const sanitized = raw.replace(/[^0-9,]/g, '');
            const hasComma = sanitized.includes(',');
            const endsWithComma = sanitized.endsWith(',');
            const [integerPartRaw = '', decimalPartRaw = ''] = sanitized.split(',');
            const integerDigits = integerPartRaw.replace(/\D/g, '');
            const formattedInteger = integerDigits ? Number(integerDigits).toLocaleString('es-CL') : hasComma ? '0' : '';
            if (!formattedInteger) {
                return '';
            }
            let result = `${symbol} ${formattedInteger}`;
            if (hasComma) {
                const cleanDecimals = decimalPartRaw.replace(/\D/g, '').slice(0, 2);
                if (cleanDecimals.length > 0) {
                    result += `,${cleanDecimals}`;
                } else if (endsWithComma) {
                    result += ',';
                }
            }
            return result;
        }
        const digitsOnly = raw.replace(/\D/g, '');
        if (!digitsOnly) return '';
        const formattedInteger = Number(digitsOnly).toLocaleString('es-CL');
        return `${symbol} ${formattedInteger}`;
    };
    const handleDNIChange = (e)=>{
        if (isDisabled) return; // No procesar si está disabled
        const rawValue = e.target.value;
        const formattedValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$lib$2f$formatChileanRut$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatChileanRut"])(rawValue);
        // Crear un evento sintético con el valor formateado
        const syntheticEvent = {
            ...e,
            target: {
                ...e.target,
                value: formattedValue
            }
        };
        onChange(syntheticEvent);
    };
    const handleCurrencyChange = (e)=>{
        if (isDisabled) return;
        const inputValue = e.target.value ?? '';
        const sanitizedInput = inputValue.replace(new RegExp(`\\${currencySymbol}\\s?`, 'g'), '').replace(/\s+/g, '');
        if (allowDecimalComma) {
            const decimalFriendly = sanitizedInput.replace(/\./g, ',');
            const cleaned = decimalFriendly.replace(/[^0-9,]/g, '');
            const endsWithComma = cleaned.endsWith(',');
            const segments = cleaned.split(',');
            const integerDigits = (segments[0] ?? '').replace(/\D/g, '');
            const decimalDigits = segments.slice(1).join('').replace(/\D/g, '').slice(0, 2);
            let normalized = integerDigits;
            if (normalized.length === 0 && (decimalDigits.length > 0 || endsWithComma)) {
                normalized = '0';
            }
            if (decimalDigits.length > 0) {
                normalized = `${normalized},${decimalDigits}`;
            } else if (endsWithComma && normalized.length > 0) {
                normalized = `${normalized},`;
            } else if (normalized === '0' && !endsWithComma) {
                normalized = '';
            }
            setCurrencyRawValue(normalized);
            const syntheticEvent = {
                ...e,
                target: {
                    ...e.target,
                    value: normalized
                }
            };
            onChange(syntheticEvent);
            return;
        }
        const digitsOnly = sanitizedInput.replace(/[^\d]/g, '');
        setCurrencyRawValue(digitsOnly);
        const syntheticEvent = {
            ...e,
            target: {
                ...e.target,
                value: digitsOnly
            }
        };
        onChange(syntheticEvent);
    };
    // Formatear el valor para mostrar en currency o teléfono
    // Formateo visual para teléfono: prefijo + espacio cada 3 dígitos
    const formatPhone = (value, prefix)=>{
        let num = value;
        // Remover prefijo para formatear solo el número
        if (prefix && num.startsWith(prefix)) {
            num = num.slice(prefix.length);
        }
        // Remover espacios
        num = num.replace(/\s+/g, '');
        // Insertar espacio cada 3 dígitos
        let formatted = '';
        for(let i = 0; i < num.length; i += 3){
            formatted += num.slice(i, i + 3) + (i + 3 < num.length ? ' ' : '');
        }
        // Renderizar igual que currency: prefijo + espacio + número formateado
        return (prefix ? prefix + ' ' : '') + formatted.trim();
    };
    const getDisplayValue = ()=>{
        if (type === 'currency') {
            if (!currencyRawValue) {
                return '';
            }
            return formatCurrency(currencyRawValue, currencySymbol);
        }
        if (type === 'tel' && value) {
            return formatPhone(value, phonePrefix);
        }
        return value || '';
    };
    const displayValue = getDisplayValue();
    const shouldAlwaysShowLabel = labelAlwaysVisible || type === 'date';
    const shrink = shouldAlwaysShowLabel || focused || displayValue && displayValue.length > 0;
    const [showPlaceholder, setShowPlaceholder] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(shouldAlwaysShowLabel ? false : !shrink);
    const compactInputClasses = compact ? 'px-2.5 py-1.5 text-xs font-normal' : '';
    const compactLabelClasses = compact ? 'left-2.5 -top-1 text-[10px]' : 'left-3 -top-1 text-xs';
    const compactPlaceholderClasses = compact ? 'text-xs font-normal' : 'text-sm font-medium';
    const computedPlaceholder = type === "datePicker" ? `Ej: ${new Date().getFullYear()}` : shouldAlwaysShowLabel ? placeholder ?? "" : required ? "" : shrink || !showPlaceholder ? "" : placeholder ?? label;
    // Unique class for placeholder styling when placeholderColor is provided
    const placeholderClassRef = __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useRef(null);
    if (placeholderColor && !placeholderClassRef.current) {
        placeholderClassRef.current = `tf-ph-${Math.random().toString(36).slice(2, 9)}`;
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TextField.useEffect": ()=>{
            if (shouldAlwaysShowLabel) {
                setShowPlaceholder(false);
                return;
            }
            if (!shrink) {
                const timeout = setTimeout({
                    "TextField.useEffect.timeout": ()=>setShowPlaceholder(true)
                }["TextField.useEffect.timeout"], 250);
                return ({
                    "TextField.useEffect": ()=>clearTimeout(timeout)
                })["TextField.useEffect"];
            }
            setShowPlaceholder(false);
        }
    }["TextField.useEffect"], [
        shrink,
        shouldAlwaysShowLabel
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TextField.useEffect": ()=>{
            if (type === 'currency') {
                if (value !== currencyRawValue) {
                    setCurrencyRawValue(value);
                }
            }
        }
    }["TextField.useEffect"], [
        value,
        type,
        currencyRawValue
    ]);
    // Estilos para variantes
    const variantInput = variante === "contrast" ? "border-background text-background focus:border-primary bg-transparent" : variante === "autocomplete" ? "border-none focus:border-none focus:ring-0 bg-transparent" : "text-foreground border-border focus:border-primary bg-transparent";
    const contrastLabel = variante === "contrast" ? "bg-foreground text-background" : "bg-background text-foreground";
    // Estilos para estado disabled
    const disabledStyles = isDisabled ? "opacity-50 cursor-not-allowed bg-muted" : "";
    const isTextArea = type === "textarea" || typeof rows === "number";
    const handleInputFocus = (e)=>{
        setFocused(true);
        if (selectAllOnFocus) {
            e.currentTarget.select();
        }
        onFocus?.(e);
    };
    const handleTextareaFocus = (e)=>{
        setFocused(true);
        if (selectAllOnFocus) {
            e.currentTarget.select();
        }
        onFocus?.(e);
    };
    const handleInputBlur = (e)=>{
        setFocused(false);
        onBlur?.(e);
    };
    const handleTextareaBlur = (e)=>{
        setFocused(false);
        onBlur?.(e);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: compact || variante === "autocomplete" ? "relative w-full" : "input-container",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: `relative ${className}`,
            "data-test-id": "text-field-root",
            children: [
                typeof startIcon === 'string' && startIcon.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: `input-icon material-symbols-outlined ${isDisabled ? 'text-muted-foreground opacity-50' : 'text-secondary'}`,
                    style: {
                        fontSize: 20,
                        width: 20,
                        height: 20,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    },
                    children: startIcon
                }, void 0, false, {
                    fileName: "[project]/paddy/cargo/src/shared/components/ui/TextField/TextField.tsx",
                    lineNumber: 369,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                startIcon === undefined && startAdornment && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: `input-icon ${isDisabled ? 'text-muted-foreground opacity-50' : 'text-secondary'}`,
                    style: {
                        fontSize: 14,
                        width: 'auto',
                        minWidth: 16,
                        height: 20,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingRight: 4
                    },
                    children: startAdornment
                }, void 0, false, {
                    fileName: "[project]/paddy/cargo/src/shared/components/ui/TextField/TextField.tsx",
                    lineNumber: 378,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                isTextArea ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                    id: id,
                    name: name,
                    value: value,
                    rows: rows,
                    onFocus: handleTextareaFocus,
                    onBlur: handleTextareaBlur,
                    onChange: handleChange,
                    onKeyDown: onKeyDown,
                    className: `${placeholderClassRef.current ?? ''} input-base block min-w-[20px] pr-4 ${typeof startIcon === 'string' && startIcon.length > 0 || startAdornment ? " pl-9" : ""} ${compactInputClasses} ${variantInput} ${disabledStyles} z-0`,
                    placeholder: computedPlaceholder,
                    required: required,
                    readOnly: readOnly,
                    disabled: disabled,
                    autoComplete: autoComplete || "off",
                    style: {
                        resize: 'none',
                        paddingTop: compact ? '0.625rem' : '0.75rem',
                        ...props.style || {}
                    },
                    "data-test-id": props["data-test-id"],
                    ...props
                }, void 0, false, {
                    fileName: "[project]/paddy/cargo/src/shared/components/ui/TextField/TextField.tsx",
                    lineNumber: 386,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            ref: inputRef,
                            id: id,
                            type: type === "password" ? showPassword ? "text" : "password" : type === "datePicker" ? "number" : type === "dni" || type === "currency" ? "text" : type,
                            name: name,
                            value: displayValue,
                            onFocus: handleInputFocus,
                            onBlur: handleInputBlur,
                            onChange: type === "dni" ? handleDNIChange : type === "currency" ? handleCurrencyChange : handleChange,
                            onKeyDown: onKeyDown,
                            className: `${placeholderClassRef.current ?? ''} input-base block min-w-[20px] ${typeof startIcon === 'string' && startIcon.length > 0 || startAdornment ? " pl-9" : ""} ${endIcon || type === "password" && passwordVisibilityToggle ? " pr-10" : " pr-3"} ${compactInputClasses} ${variantInput} ${disabledStyles} z-0`,
                            placeholder: computedPlaceholder,
                            required: required,
                            readOnly: readOnly,
                            disabled: disabled,
                            autoComplete: autoComplete || "off",
                            min: type === "datePicker" ? "1800" : undefined,
                            max: type === "datePicker" ? new Date().getFullYear().toString() : undefined,
                            maxLength: type === "dni" ? 12 : type === "datePicker" ? 4 : undefined,
                            "data-test-id": props["data-test-id"],
                            ...type === "dni" || type === "currency" || type === "datePicker" || type === "tel" ? {} : props
                        }, void 0, false, {
                            fileName: "[project]/paddy/cargo/src/shared/components/ui/TextField/TextField.tsx",
                            lineNumber: 411,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        type === "password" && passwordVisibilityToggle && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            disabled: isDisabled,
                            className: `password-toggle-button inline-flex ${compact ? 'h-7 w-7' : 'h-8 w-8'} items-center justify-center rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 hover:bg-primary/10 active:scale-95 ${focused ? "text-primary" : "text-secondary"} ${showPassword ? "bg-primary/10 text-primary" : "bg-transparent"} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`,
                            style: {
                                padding: 0
                            },
                            onMouseDown: (event)=>{
                                if (isDisabled) return;
                                event.preventDefault();
                            },
                            onClick: ()=>{
                                if (isDisabled) return;
                                setShowPassword((prev)=>!prev);
                                inputRef.current?.focus();
                            },
                            "aria-label": passwordToggleLabel,
                            "aria-pressed": showPassword,
                            "data-test-id": "password-visibility-toggle",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "material-symbols-outlined",
                                style: {
                                    fontSize: 20,
                                    width: 20,
                                    height: 20,
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                },
                                "aria-hidden": true,
                                children: showPassword ? "visibility_off" : "visibility"
                            }, void 0, false, {
                                fileName: "[project]/paddy/cargo/src/shared/components/ui/TextField/TextField.tsx",
                                lineNumber: 456,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/paddy/cargo/src/shared/components/ui/TextField/TextField.tsx",
                            lineNumber: 438,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/paddy/cargo/src/shared/components/ui/TextField/TextField.tsx",
                    lineNumber: 410,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                required && !shrink && showPlaceholder && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `absolute pointer-events-none ${compactPlaceholderClasses} text-gray-400 transition-opacity duration-300 ${shrink ? 'opacity-0' : 'opacity-100'}`,
                    style: {
                        backgroundColor: "var(--color-background)",
                        left: typeof startIcon === 'string' && startIcon.length > 0 || startAdornment ? '36px' : compact ? '10px' : '12px',
                        paddingRight: endIcon || type === "password" && passwordVisibilityToggle ? '40px' : compact ? '10px' : '12px',
                        top: isTextArea ? '1.25rem' : '50%',
                        transform: isTextArea ? 'none' : 'translateY(-50%)'
                    },
                    onClick: ()=>inputRef.current?.focus(),
                    children: [
                        type === "datePicker" ? `Ej: ${new Date().getFullYear()}` : placeholder ?? label,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-red-500 ml-1",
                            children: "*"
                        }, void 0, false, {
                            fileName: "[project]/paddy/cargo/src/shared/components/ui/TextField/TextField.tsx",
                            lineNumber: 481,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/paddy/cargo/src/shared/components/ui/TextField/TextField.tsx",
                    lineNumber: 469,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                placeholderColor && placeholderClassRef.current && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                    children: `input.${placeholderClassRef.current}::placeholder, textarea.${placeholderClassRef.current}::placeholder { color: ${placeholderColor} }`
                }, void 0, false, {
                    fileName: "[project]/paddy/cargo/src/shared/components/ui/TextField/TextField.tsx",
                    lineNumber: 486,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                    children: `
        textarea::placeholder {
          line-height: 1.5rem;
          text-align: left;
          color: ${placeholderColor || 'var(--color-muted)'};
        }
      `
                }, void 0, false, {
                    fileName: "[project]/paddy/cargo/src/shared/components/ui/TextField/TextField.tsx",
                    lineNumber: 488,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                    className: `absolute pointer-events-none transition-all duration-300 ease-in-out px-1 font-medium text-foreground rounded-md bg-background ${compactLabelClasses}` + (shrink ? " -translate-y-1 scale-90 opacity-100" : " opacity-0"),
                    onClick: ()=>inputRef.current?.focus(),
                    "data-test-id": "text-field-label",
                    children: [
                        label,
                        required && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-red-500 ml-1",
                            children: "*"
                        }, void 0, false, {
                            fileName: "[project]/paddy/cargo/src/shared/components/ui/TextField/TextField.tsx",
                            lineNumber: 502,
                            columnNumber: 22
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/paddy/cargo/src/shared/components/ui/TextField/TextField.tsx",
                    lineNumber: 495,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
                typeof endIcon === 'string' && endIcon.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: `input-icon-right material-symbols-outlined ${isDisabled ? 'text-muted-foreground opacity-50' : 'text-secondary'}`,
                    style: {
                        fontSize: 20,
                        width: 20,
                        height: 20,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    },
                    children: endIcon
                }, void 0, false, {
                    fileName: "[project]/paddy/cargo/src/shared/components/ui/TextField/TextField.tsx",
                    lineNumber: 505,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/paddy/cargo/src/shared/components/ui/TextField/TextField.tsx",
            lineNumber: 367,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/paddy/cargo/src/shared/components/ui/TextField/TextField.tsx",
        lineNumber: 366,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(TextField, "F/3tw3ayEiUUbA4YEueeXo1WvNM=");
_c = TextField;
var _c;
__turbopack_context__.k.register(_c, "TextField");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/paddy/cargo/src/shared/components/ui/Select/Select.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$shared$2f$components$2f$ui$2f$DropdownList$2f$DropdownList$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/src/shared/components/ui/DropdownList/DropdownList.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$shared$2f$components$2f$ui$2f$IconButton$2f$IconButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/src/shared/components/ui/IconButton/IconButton.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$shared$2f$components$2f$ui$2f$TextField$2f$TextField$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/src/shared/components/ui/TextField/TextField.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
const Select = ({ label, options, placeholder, value = null, onChange, required = false, name, variant = 'default', compact = false, allowClear = false, disabled = false, className = '', ...props })=>{
    _s();
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [focused, setFocused] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isSelecting, setIsSelecting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [highlightedIndex, setHighlightedIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(-1);
    const selected = options.find((opt)=>opt.id === value);
    const shrink = focused || selected;
    const onChangeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(onChange);
    const triggerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Update ref when onChange changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Select.useEffect": ()=>{
            onChangeRef.current = onChange;
        }
    }["Select.useEffect"], [
        onChange
    ]);
    // Handle form validation
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Select.useEffect": ()=>{
            if (required) {
                const hiddenInput = document.querySelector(`input[name="${name || 'select-validation'}"]`);
                if (hiddenInput) {
                    if (value === null || value === undefined) {
                        hiddenInput.setCustomValidity('Este campo es requerido');
                    } else {
                        hiddenInput.setCustomValidity('');
                    }
                }
            }
        }
    }["Select.useEffect"], [
        value,
        required,
        name
    ]);
    // Manejo global de teclado para mejor compatibilidad con dialogs
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Select.useEffect": ()=>{
            const handleKeyDown = {
                "Select.useEffect.handleKeyDown": (e)=>{
                    if (!focused) return;
                    if (!open && [
                        "ArrowDown",
                        "ArrowUp",
                        "Enter"
                    ].includes(e.key)) {
                        e.preventDefault();
                        setOpen(true);
                        setHighlightedIndex(e.key === "ArrowUp" ? options.length - 1 : 0);
                        return;
                    }
                    if (!open) return;
                    if (e.key === "ArrowDown") {
                        e.preventDefault();
                        setHighlightedIndex({
                            "Select.useEffect.handleKeyDown": (i)=>i < options.length - 1 ? i + 1 : 0
                        }["Select.useEffect.handleKeyDown"]);
                    } else if (e.key === "ArrowUp") {
                        e.preventDefault();
                        setHighlightedIndex({
                            "Select.useEffect.handleKeyDown": (i)=>i > 0 ? i - 1 : options.length - 1
                        }["Select.useEffect.handleKeyDown"]);
                    } else if (e.key === "Enter" && highlightedIndex >= 0) {
                        e.preventDefault();
                        onChangeRef.current?.(options[highlightedIndex].id);
                        setOpen(false);
                        setHighlightedIndex(-1);
                    } else if (e.key === "Escape") {
                        e.preventDefault();
                        setOpen(false);
                        setHighlightedIndex(-1);
                    }
                }
            }["Select.useEffect.handleKeyDown"];
            if (focused) {
                document.addEventListener('keydown', handleKeyDown);
            }
            return ({
                "Select.useEffect": ()=>{
                    document.removeEventListener('keydown', handleKeyDown);
                }
            })["Select.useEffect"];
        }
    }["Select.useEffect"], [
        focused,
        open,
        options,
        highlightedIndex
    ]);
    // Ref array for options
    const optionRefs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])([]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Select.useEffect": ()=>{
            if (open && highlightedIndex >= 0 && optionRefs.current[highlightedIndex]) {
                optionRefs.current[highlightedIndex]?.scrollIntoView({
                    block: 'nearest'
                });
            }
        }
    }["Select.useEffect"], [
        highlightedIndex,
        open
    ]);
    const hasValue = value !== null && value !== undefined;
    const hasClear = allowClear && hasValue;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "select-container",
        children: variant === 'minimal' ? // Variante Minimal: Contenedor compacto con icono de despliegue
        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            ref: triggerRef,
            className: `relative w-full cursor-pointer select-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`.trim(),
            onFocus: ()=>!disabled && setFocused(true),
            onBlur: ()=>{
                if (!isSelecting) {
                    setTimeout(()=>setOpen(false), 150);
                }
                setFocused(false);
            },
            onClick: ()=>!disabled && setOpen(!open),
            tabIndex: disabled ? -1 : 0,
            "data-test-id": props["data-test-id"] || "select-root",
            "data-has-options": options.length > 0 ? 'true' : 'false',
            role: "combobox",
            "aria-expanded": open,
            "aria-required": required,
            "aria-invalid": required && (value === null || value === undefined),
            "aria-controls": "select-list",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    type: "text",
                    value: value !== null && value !== undefined ? value.toString() : '',
                    required: required,
                    onChange: ()=>{},
                    name: name || "select-validation",
                    className: "absolute opacity-0 pointer-events-none -z-10",
                    tabIndex: -1,
                    "aria-hidden": "true"
                }, void 0, false, {
                    fileName: "[project]/paddy/cargo/src/shared/components/ui/Select/Select.tsx",
                    lineNumber: 135,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `flex items-center rounded-md border border-border bg-background ${compact ? 'py-1.5 text-xs' : 'py-2 text-sm'} transition-colors ${focused ? 'border-primary ring-2 ring-primary/20' : 'hover:border-border/80'} ${disabled ? 'bg-muted text-muted-foreground' : ''} ${hasClear ? compact ? 'pr-10 pl-2.5' : 'pr-12 pl-3' : compact ? 'pr-7 pl-2.5' : 'pr-8 pl-3'}`.trim(),
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: `flex-1 truncate ${compact ? 'text-xs' : 'text-sm'} font-light ${hasValue ? 'text-foreground' : 'text-muted-foreground'}`,
                        style: hasValue ? {
                            color: 'var(--color-foreground)'
                        } : undefined,
                        children: selected ? selected.label : placeholder ?? 'Selecciona'
                    }, void 0, false, {
                        fileName: "[project]/paddy/cargo/src/shared/components/ui/Select/Select.tsx",
                        lineNumber: 151,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/paddy/cargo/src/shared/components/ui/Select/Select.tsx",
                    lineNumber: 146,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0)),
                allowClear && value !== null && value !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$shared$2f$components$2f$ui$2f$IconButton$2f$IconButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    icon: "close_small",
                    variant: "text",
                    size: compact ? 'xs' : 'md',
                    className: `absolute right-10 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center z-20 ${focused ? 'text-primary' : 'text-secondary'}`,
                    onClick: ()=>onChange?.(null),
                    "aria-label": "Limpiar selección",
                    "data-test-id": "select-clear-btn",
                    tabIndex: -1,
                    disabled: disabled
                }, void 0, false, {
                    fileName: "[project]/paddy/cargo/src/shared/components/ui/Select/Select.tsx",
                    lineNumber: 162,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: `material-symbols-outlined pointer-events-none absolute ${hasClear ? 'right-3.5' : 'right-3'} top-1/2 -translate-y-1/2 text-base transition-colors ${focused ? 'text-primary' : 'text-secondary'}`,
                    "aria-hidden": "true",
                    children: "expand_more"
                }, void 0, false, {
                    fileName: "[project]/paddy/cargo/src/shared/components/ui/Select/Select.tsx",
                    lineNumber: 175,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$shared$2f$components$2f$ui$2f$DropdownList$2f$DropdownList$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    open: open,
                    testId: "select-list",
                    highlightedIndex: highlightedIndex,
                    onHoverChange: (idx)=>{},
                    usePortal: true,
                    anchorRef: triggerRef,
                    children: options.map((opt, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                            ref: (el)=>{
                                optionRefs.current[idx] = el;
                            },
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$shared$2f$components$2f$ui$2f$DropdownList$2f$DropdownList$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dropdownOptionClass"],
                            onMouseDown: ()=>{
                                setIsSelecting(true);
                                onChange?.(opt.id);
                                setOpen(false);
                                setTimeout(()=>setIsSelecting(false), 200);
                                setTimeout(()=>{
                                    const hiddenInput = document.querySelector(`input[name="${name || 'select-validation'}"]`);
                                    if (hiddenInput && required) {
                                        hiddenInput.setCustomValidity('');
                                        const form = hiddenInput.closest('form');
                                        if (form) {
                                            hiddenInput.dispatchEvent(new Event('input', {
                                                bubbles: true
                                            }));
                                        }
                                    }
                                }, 10);
                            },
                            onMouseEnter: ()=>{
                                setHighlightedIndex(idx);
                            },
                            "data-test-id": `select-option-${opt.id}`,
                            children: opt.label
                        }, opt.id, false, {
                            fileName: "[project]/paddy/cargo/src/shared/components/ui/Select/Select.tsx",
                            lineNumber: 193,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0)))
                }, void 0, false, {
                    fileName: "[project]/paddy/cargo/src/shared/components/ui/Select/Select.tsx",
                    lineNumber: 184,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/paddy/cargo/src/shared/components/ui/Select/Select.tsx",
            lineNumber: 114,
            columnNumber: 9
        }, ("TURBOPACK compile-time value", void 0)) : // Variante Default: Con iconos
        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            ref: triggerRef,
            className: `relative w-full border border-border rounded-md focus-within:border-primary ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`.trim(),
            onFocus: ()=>!disabled && setFocused(true),
            onBlur: ()=>{
                if (!isSelecting) {
                    setTimeout(()=>setOpen(false), 150);
                }
                setFocused(false);
            },
            onClick: ()=>!disabled && setOpen(!open),
            tabIndex: disabled ? -1 : 0,
            "data-test-id": props["data-test-id"] || "select-root",
            "data-has-options": options.length > 0 ? 'true' : 'false',
            role: "combobox",
            "aria-expanded": open,
            "aria-required": required,
            "aria-invalid": required && (value === null || value === undefined),
            "aria-controls": "select-list",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    type: "text",
                    value: value !== null && value !== undefined ? value.toString() : '',
                    required: required,
                    onChange: ()=>{},
                    name: name || "select-validation",
                    className: "absolute opacity-0 pointer-events-none -z-10",
                    tabIndex: -1,
                    "aria-hidden": "true"
                }, void 0, false, {
                    fileName: "[project]/paddy/cargo/src/shared/components/ui/Select/Select.tsx",
                    lineNumber: 247,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$shared$2f$components$2f$ui$2f$TextField$2f$TextField$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextField"], {
                    label: label || placeholder || "",
                    value: selected ? selected.label : "",
                    onChange: ()=>{},
                    placeholder: placeholder,
                    name: name,
                    required: required,
                    "data-test-id": "select-input",
                    className: compact ? 'pr-14' : 'pr-20',
                    compact: compact,
                    variante: "autocomplete",
                    readOnly: true,
                    disabled: disabled,
                    tabIndex: -1
                }, void 0, false, {
                    fileName: "[project]/paddy/cargo/src/shared/components/ui/Select/Select.tsx",
                    lineNumber: 258,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0)),
                allowClear && value !== null && value !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$shared$2f$components$2f$ui$2f$IconButton$2f$IconButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    icon: "close_small",
                    variant: "text",
                    size: compact ? 'xs' : 'md',
                    className: `absolute right-10 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center z-20 ${focused ? 'text-primary' : 'text-secondary'}`,
                    onClick: ()=>onChange?.(null),
                    "aria-label": "Limpiar selección",
                    "data-test-id": "select-clear-btn",
                    tabIndex: -1,
                    disabled: disabled
                }, void 0, false, {
                    fileName: "[project]/paddy/cargo/src/shared/components/ui/Select/Select.tsx",
                    lineNumber: 275,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$shared$2f$components$2f$ui$2f$IconButton$2f$IconButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    icon: "arrow_drop_down",
                    variant: "text",
                    size: compact ? 'xs' : 'md',
                    className: `absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center ${focused ? 'text-primary' : 'text-secondary'}`,
                    tabIndex: -1,
                    "aria-label": "Desplegar opciones",
                    onClick: (e)=>{
                        e.stopPropagation();
                        !disabled && setOpen(!open);
                    },
                    "data-test-id": "select-dropdown-icon",
                    disabled: disabled
                }, void 0, false, {
                    fileName: "[project]/paddy/cargo/src/shared/components/ui/Select/Select.tsx",
                    lineNumber: 288,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$shared$2f$components$2f$ui$2f$DropdownList$2f$DropdownList$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    open: open,
                    testId: "select-list",
                    highlightedIndex: highlightedIndex,
                    onHoverChange: (idx)=>{},
                    usePortal: true,
                    anchorRef: triggerRef,
                    children: options.map((opt, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                            ref: (el)=>{
                                optionRefs.current[idx] = el;
                            },
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$shared$2f$components$2f$ui$2f$DropdownList$2f$DropdownList$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dropdownOptionClass"],
                            onMouseDown: ()=>{
                                setIsSelecting(true);
                                onChange?.(opt.id);
                                setOpen(false);
                                setTimeout(()=>setIsSelecting(false), 200);
                                setTimeout(()=>{
                                    const hiddenInput = document.querySelector(`input[name="${name || 'select-validation'}"]`);
                                    if (hiddenInput && required) {
                                        hiddenInput.setCustomValidity('');
                                        const form = hiddenInput.closest('form');
                                        if (form) {
                                            hiddenInput.dispatchEvent(new Event('input', {
                                                bubbles: true
                                            }));
                                        }
                                    }
                                }, 10);
                            },
                            onMouseEnter: ()=>{
                                setHighlightedIndex(idx);
                            },
                            "data-test-id": `select-option-${opt.id}`,
                            children: opt.label
                        }, opt.id, false, {
                            fileName: "[project]/paddy/cargo/src/shared/components/ui/Select/Select.tsx",
                            lineNumber: 309,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0)))
                }, void 0, false, {
                    fileName: "[project]/paddy/cargo/src/shared/components/ui/Select/Select.tsx",
                    lineNumber: 300,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/paddy/cargo/src/shared/components/ui/Select/Select.tsx",
            lineNumber: 226,
            columnNumber: 9
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/paddy/cargo/src/shared/components/ui/Select/Select.tsx",
        lineNumber: 111,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(Select, "0+M7oLd57DFUMco1/42BnoqCbDw=");
_c = Select;
const __TURBOPACK__default__export__ = Select;
var _c;
__turbopack_context__.k.register(_c, "Select");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/paddy/cargo/src/components/weighing/SerialPortConfigDialog.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SerialPortConfigDialog",
    ()=>SerialPortConfigDialog
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$shared$2f$components$2f$ui$2f$Dialog$2f$Dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/src/shared/components/ui/Dialog/Dialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$shared$2f$components$2f$ui$2f$Button$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/src/shared/components/ui/Button/Button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$shared$2f$components$2f$ui$2f$Select$2f$Select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/src/shared/components/ui/Select/Select.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$services$2f$serialPort$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/src/services/serialPort.service.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$services$2f$serialPortConfigService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/src/services/serialPortConfigService.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
const BAUD_SELECT_OPTIONS = __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$services$2f$serialPort$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SERIAL_BAUD_RATES"].map(_c = (r)=>({
        id: r,
        label: String(r)
    }));
_c1 = BAUD_SELECT_OPTIONS;
const DATA_BITS_SELECT_OPTIONS = __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$services$2f$serialPort$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SERIAL_DATA_BITS"].map(_c2 = (b)=>({
        id: b,
        label: `${b} bits`
    }));
_c3 = DATA_BITS_SELECT_OPTIONS;
const PARITY_SELECT_OPTIONS = [
    {
        id: 'none',
        label: 'Ninguna (N)'
    },
    {
        id: 'even',
        label: 'Par (E)'
    },
    {
        id: 'odd',
        label: 'Impar (O)'
    }
];
const SerialPortConfigDialog = ({ open, onClose, isConnected, isAvailable, isConnecting, dialogError, onChoosePort, onDisconnect })=>{
    _s();
    const [savedPortLabel, setSavedPortLabel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [baudRate, setBaudRate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(9600);
    const [dataBits, setDataBits] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(7);
    const [parity, setParity] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('none');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SerialPortConfigDialog.useEffect": ()=>{
            if (open) {
                const cfg = __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$services$2f$serialPortConfigService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serialPortConfigStorage"].getConfig();
                setSavedPortLabel(cfg?.port ?? null);
                setBaudRate(cfg?.baudRate && cfg.baudRate > 0 ? cfg.baudRate : 9600);
                setDataBits(cfg?.dataBits === 8 ? 8 : 7);
                setParity(cfg?.parity === 'even' || cfg?.parity === 'odd' ? cfg.parity : 'none');
            }
        }
    }["SerialPortConfigDialog.useEffect"], [
        open
    ]);
    const persistLineSettings = (patch)=>{
        const prev = __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$services$2f$serialPortConfigService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serialPortConfigStorage"].getConfig();
        const rate = patch.baudRate ?? prev?.baudRate ?? 9600;
        const bits = patch.dataBits ?? (prev?.dataBits === 8 ? 8 : 7);
        const par = patch.parity ?? (prev?.parity === 'even' || prev?.parity === 'odd' ? prev.parity : 'none');
        __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$services$2f$serialPortConfigService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serialPortConfigStorage"].saveConfig({
            port: prev?.port ?? 'serial',
            baudRate: rate,
            dataBits: bits,
            stopBits: 1,
            parity: par,
            lastUsed: new Date().toISOString()
        });
    };
    const currentLabel = isConnected ? __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$services$2f$serialPort$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serialPortService"].getPortFingerprint() : null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$shared$2f$components$2f$ui$2f$Dialog$2f$Dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        open: open,
        onClose: onClose,
        title: "Puerto serial — Balanza",
        size: "sm",
        showCloseButton: true,
        closeButtonText: "Cerrar",
        hideActions: true,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-4 text-sm text-foreground",
            children: [
                !isAvailable && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-muted-foreground",
                    children: "Tu navegador no soporta Web Serial API. Usa Chrome o Edge en HTTPS o localhost."
                }, void 0, false, {
                    fileName: "[project]/paddy/cargo/src/components/weighing/SerialPortConfigDialog.tsx",
                    lineNumber: 87,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0)),
                isAvailable && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs font-medium text-muted-foreground mb-1",
                                    children: "Estado"
                                }, void 0, false, {
                                    fileName: "[project]/paddy/cargo/src/components/weighing/SerialPortConfigDialog.tsx",
                                    lineNumber: 95,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "font-medium",
                                    children: isConnected ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-success",
                                        children: "Conectado"
                                    }, void 0, false, {
                                        fileName: "[project]/paddy/cargo/src/components/weighing/SerialPortConfigDialog.tsx",
                                        lineNumber: 98,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-red-400",
                                        children: "Sin conexión"
                                    }, void 0, false, {
                                        fileName: "[project]/paddy/cargo/src/components/weighing/SerialPortConfigDialog.tsx",
                                        lineNumber: 100,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/paddy/cargo/src/components/weighing/SerialPortConfigDialog.tsx",
                                    lineNumber: 96,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/paddy/cargo/src/components/weighing/SerialPortConfigDialog.tsx",
                            lineNumber: 94,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        currentLabel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs font-medium text-muted-foreground mb-1",
                                    children: "Puerto actual"
                                }, void 0, false, {
                                    fileName: "[project]/paddy/cargo/src/components/weighing/SerialPortConfigDialog.tsx",
                                    lineNumber: 107,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "font-mono text-xs break-all",
                                    children: currentLabel
                                }, void 0, false, {
                                    fileName: "[project]/paddy/cargo/src/components/weighing/SerialPortConfigDialog.tsx",
                                    lineNumber: 108,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/paddy/cargo/src/components/weighing/SerialPortConfigDialog.tsx",
                            lineNumber: 106,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0)),
                        savedPortLabel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs font-medium text-muted-foreground mb-1",
                                    children: "Último guardado (local)"
                                }, void 0, false, {
                                    fileName: "[project]/paddy/cargo/src/components/weighing/SerialPortConfigDialog.tsx",
                                    lineNumber: 114,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "font-mono text-xs break-all",
                                    children: savedPortLabel
                                }, void 0, false, {
                                    fileName: "[project]/paddy/cargo/src/components/weighing/SerialPortConfigDialog.tsx",
                                    lineNumber: 115,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/paddy/cargo/src/components/weighing/SerialPortConfigDialog.tsx",
                            lineNumber: 113,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$shared$2f$components$2f$ui$2f$Select$2f$Select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    label: "Velocidad (baud rate)",
                                    name: "serial-baud",
                                    options: BAUD_SELECT_OPTIONS,
                                    value: baudRate,
                                    onChange: (id)=>{
                                        const rate = typeof id === 'number' ? id : Number(id);
                                        if (!Number.isFinite(rate)) return;
                                        setBaudRate(rate);
                                        persistLineSettings({
                                            baudRate: rate
                                        });
                                    },
                                    "data-test-id": "serial-baud-select"
                                }, void 0, false, {
                                    fileName: "[project]/paddy/cargo/src/components/weighing/SerialPortConfigDialog.tsx",
                                    lineNumber: 120,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-muted-foreground mt-1",
                                    children: "Balanza 9600 / 7 bits: deje 9600 y 7 abajo. Tras cambiar línea serie, desconecte y vuelva a elegir el puerto."
                                }, void 0, false, {
                                    fileName: "[project]/paddy/cargo/src/components/weighing/SerialPortConfigDialog.tsx",
                                    lineNumber: 133,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/paddy/cargo/src/components/weighing/SerialPortConfigDialog.tsx",
                            lineNumber: 119,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$shared$2f$components$2f$ui$2f$Select$2f$Select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                label: "Bits de datos",
                                name: "serial-databits",
                                options: DATA_BITS_SELECT_OPTIONS,
                                value: dataBits,
                                onChange: (id)=>{
                                    const n = typeof id === 'number' ? id : Number(id);
                                    const bits = n === 8 ? 8 : 7;
                                    setDataBits(bits);
                                    persistLineSettings({
                                        dataBits: bits
                                    });
                                },
                                "data-test-id": "serial-databits-select"
                            }, void 0, false, {
                                fileName: "[project]/paddy/cargo/src/components/weighing/SerialPortConfigDialog.tsx",
                                lineNumber: 140,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/paddy/cargo/src/components/weighing/SerialPortConfigDialog.tsx",
                            lineNumber: 139,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$shared$2f$components$2f$ui$2f$Select$2f$Select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    label: "Paridad",
                                    name: "serial-parity",
                                    options: PARITY_SELECT_OPTIONS,
                                    value: parity,
                                    onChange: (id)=>{
                                        const v = id === null || id === undefined ? 'none' : String(id);
                                        const p = v === 'even' || v === 'odd' ? v : 'none';
                                        setParity(p);
                                        persistLineSettings({
                                            parity: p
                                        });
                                    },
                                    "data-test-id": "serial-parity-select"
                                }, void 0, false, {
                                    fileName: "[project]/paddy/cargo/src/components/weighing/SerialPortConfigDialog.tsx",
                                    lineNumber: 156,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-muted-foreground mt-1",
                                    children: "Si el texto llega corrupto con 7 bits, pruebe paridad par (7E1 es habitual en RS-232)."
                                }, void 0, false, {
                                    fileName: "[project]/paddy/cargo/src/components/weighing/SerialPortConfigDialog.tsx",
                                    lineNumber: 169,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/paddy/cargo/src/components/weighing/SerialPortConfigDialog.tsx",
                            lineNumber: 155,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs text-muted-foreground",
                            children: "El navegador pedirá permiso para el puerto. Puedes elegir otro dispositivo en cualquier momento."
                        }, void 0, false, {
                            fileName: "[project]/paddy/cargo/src/components/weighing/SerialPortConfigDialog.tsx",
                            lineNumber: 174,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        dialogError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs text-red-600 bg-red-50 border border-red-100 rounded-md p-2",
                            children: dialogError
                        }, void 0, false, {
                            fileName: "[project]/paddy/cargo/src/components/weighing/SerialPortConfigDialog.tsx",
                            lineNumber: 180,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col sm:flex-row gap-2 pt-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$shared$2f$components$2f$ui$2f$Button$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "primary",
                                    className: "flex-1",
                                    disabled: !isAvailable || isConnecting,
                                    onClick: async ()=>{
                                        await onChoosePort();
                                    },
                                    children: isConnecting ? 'Conectando…' : isConnected ? 'Cambiar puerto' : 'Elegir puerto'
                                }, void 0, false, {
                                    fileName: "[project]/paddy/cargo/src/components/weighing/SerialPortConfigDialog.tsx",
                                    lineNumber: 186,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$shared$2f$components$2f$ui$2f$Button$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "outlined",
                                    className: "flex-1",
                                    disabled: !isConnected || isConnecting,
                                    onClick: async ()=>{
                                        await onDisconnect();
                                    },
                                    children: "Desconectar"
                                }, void 0, false, {
                                    fileName: "[project]/paddy/cargo/src/components/weighing/SerialPortConfigDialog.tsx",
                                    lineNumber: 196,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/paddy/cargo/src/components/weighing/SerialPortConfigDialog.tsx",
                            lineNumber: 185,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true)
            ]
        }, void 0, true, {
            fileName: "[project]/paddy/cargo/src/components/weighing/SerialPortConfigDialog.tsx",
            lineNumber: 85,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/paddy/cargo/src/components/weighing/SerialPortConfigDialog.tsx",
        lineNumber: 76,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(SerialPortConfigDialog, "UWVRhPKjqMAjz3xnUMo/C2SmN0Y=");
_c4 = SerialPortConfigDialog;
var _c, _c1, _c2, _c3, _c4;
__turbopack_context__.k.register(_c, "BAUD_SELECT_OPTIONS$SERIAL_BAUD_RATES.map");
__turbopack_context__.k.register(_c1, "BAUD_SELECT_OPTIONS");
__turbopack_context__.k.register(_c2, "DATA_BITS_SELECT_OPTIONS$SERIAL_DATA_BITS.map");
__turbopack_context__.k.register(_c3, "DATA_BITS_SELECT_OPTIONS");
__turbopack_context__.k.register(_c4, "SerialPortConfigDialog");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/paddy/cargo/src/components/layout/TmsAppLayout.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TmsAppLayout",
    ()=>TmsAppLayout,
    "useTmsSerialPort",
    ()=>useTmsSerialPort
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/paddy/cargo/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/node_modules/next-auth/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$hooks$2f$useSerialPort$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/src/hooks/useSerialPort.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$components$2f$weighing$2f$SerialPortConfigDialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/src/components/weighing/SerialPortConfigDialog.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
const TmsSerialPortContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
function useTmsSerialPort() {
    _s();
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(TmsSerialPortContext);
    if (!ctx) {
        throw new Error('useTmsSerialPort must be used within TmsAppLayout');
    }
    return ctx;
}
_s(useTmsSerialPort, "/dMy7t63NXD4eYACoT93CePwGrg=");
/** Pesaje en otra app/puerto (sobrescribir con NEXT_PUBLIC_WEIGHING_APP_URL). */ const WEIGHING_APP_URL = __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_WEIGHING_APP_URL || 'http://localhost:3002/weighing';
const TmsAppLayout = ({ children, serialEnabled = false })=>{
    _s1();
    const serial = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$hooks$2f$useSerialPort$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSerialPort"])(serialEnabled);
    const { data: session } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSession"])();
    const { isConnected: serialConnected, isAvailable: serialAvailable, isConnecting: serialConnecting, error: serialError, connectChoosingPort, disconnect: disconnectSerial } = serial;
    const [serialDialogOpen, setSerialDialogOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const handleLogout = async ()=>{
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signOut"])({
            redirect: false
        });
        window.location.href = '/';
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TmsSerialPortContext.Provider, {
        value: serial,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-background flex flex-col",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                    className: "bg-background border-b border-border px-6 py-4 shadow-sm",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/weighing",
                                className: "flex items-center gap-4 hover:opacity-90 transition-opacity",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                        src: "/logo.svg",
                                        alt: "Paddy AyG",
                                        className: "h-8 w-auto"
                                    }, void 0, false, {
                                        fileName: "[project]/paddy/cargo/src/components/layout/TmsAppLayout.tsx",
                                        lineNumber: 59,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-col",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-3xl font-bold text-primary",
                                                children: "Paddy AyG"
                                            }, void 0, false, {
                                                fileName: "[project]/paddy/cargo/src/components/layout/TmsAppLayout.tsx",
                                                lineNumber: 61,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs text-muted-foreground -mt-1",
                                                children: "Recepción y despacho de carga"
                                            }, void 0, false, {
                                                fileName: "[project]/paddy/cargo/src/components/layout/TmsAppLayout.tsx",
                                                lineNumber: 62,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/paddy/cargo/src/components/layout/TmsAppLayout.tsx",
                                        lineNumber: 60,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/paddy/cargo/src/components/layout/TmsAppLayout.tsx",
                                lineNumber: 58,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm text-muted-foreground",
                                        children: session?.user?.email
                                    }, void 0, false, {
                                        fileName: "[project]/paddy/cargo/src/components/layout/TmsAppLayout.tsx",
                                        lineNumber: 67,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        className: `p-2 rounded-full transition-all duration-200 ${serialConnected ? 'bg-success/20 hover:bg-success/30' : 'bg-destructive/20 hover:bg-destructive/30'}`,
                                        title: serialConnected ? 'Balanza conectada - Clic para configurar' : 'Sin conexión - Clic para configurar',
                                        onClick: ()=>setSerialDialogOpen(true),
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            className: `w-5 h-5 transition-colors ${serialConnected ? 'text-success' : 'text-red-300'}`,
                                            fill: "none",
                                            stroke: "currentColor",
                                            viewBox: "0 0 24 24",
                                            strokeWidth: "2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                    x: "2",
                                                    y: "6",
                                                    width: "20",
                                                    height: "12",
                                                    rx: "1"
                                                }, void 0, false, {
                                                    fileName: "[project]/paddy/cargo/src/components/layout/TmsAppLayout.tsx",
                                                    lineNumber: 92,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M6 18v2m3 0v-2m3 0v2m3 0v-2m3 0v2"
                                                }, void 0, false, {
                                                    fileName: "[project]/paddy/cargo/src/components/layout/TmsAppLayout.tsx",
                                                    lineNumber: 93,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                    x1: "6",
                                                    y1: "10",
                                                    x2: "6",
                                                    y2: "14"
                                                }, void 0, false, {
                                                    fileName: "[project]/paddy/cargo/src/components/layout/TmsAppLayout.tsx",
                                                    lineNumber: 94,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                    x1: "9",
                                                    y1: "10",
                                                    x2: "9",
                                                    y2: "14"
                                                }, void 0, false, {
                                                    fileName: "[project]/paddy/cargo/src/components/layout/TmsAppLayout.tsx",
                                                    lineNumber: 95,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                    x1: "12",
                                                    y1: "10",
                                                    x2: "12",
                                                    y2: "14"
                                                }, void 0, false, {
                                                    fileName: "[project]/paddy/cargo/src/components/layout/TmsAppLayout.tsx",
                                                    lineNumber: 96,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                    x1: "15",
                                                    y1: "10",
                                                    x2: "15",
                                                    y2: "14"
                                                }, void 0, false, {
                                                    fileName: "[project]/paddy/cargo/src/components/layout/TmsAppLayout.tsx",
                                                    lineNumber: 97,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                    x1: "18",
                                                    y1: "10",
                                                    x2: "18",
                                                    y2: "14"
                                                }, void 0, false, {
                                                    fileName: "[project]/paddy/cargo/src/components/layout/TmsAppLayout.tsx",
                                                    lineNumber: 98,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/paddy/cargo/src/components/layout/TmsAppLayout.tsx",
                                            lineNumber: 83,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/paddy/cargo/src/components/layout/TmsAppLayout.tsx",
                                        lineNumber: 69,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: WEIGHING_APP_URL,
                                        className: "group p-2 rounded-lg hover:bg-muted/60 transition-colors duration-200 inline-flex items-center justify-center",
                                        title: "Ir a recepción y pesaje",
                                        "aria-label": "Ir a recepción y pesaje",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "material-symbols-outlined text-[22px] leading-none text-foreground group-hover:text-primary transition-colors",
                                            children: "local_shipping"
                                        }, void 0, false, {
                                            fileName: "[project]/paddy/cargo/src/components/layout/TmsAppLayout.tsx",
                                            lineNumber: 108,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/paddy/cargo/src/components/layout/TmsAppLayout.tsx",
                                        lineNumber: 102,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: "/despachos",
                                        className: "group p-2 rounded-lg hover:bg-muted/60 transition-colors duration-200 inline-flex items-center justify-center",
                                        title: "Despacho",
                                        "aria-label": "Ir a despacho",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "material-symbols-outlined text-[22px] leading-none text-foreground group-hover:text-primary transition-colors",
                                            children: "outbox"
                                        }, void 0, false, {
                                            fileName: "[project]/paddy/cargo/src/components/layout/TmsAppLayout.tsx",
                                            lineNumber: 119,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/paddy/cargo/src/components/layout/TmsAppLayout.tsx",
                                        lineNumber: 113,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        className: "p-2 rounded-lg hover:bg-muted/60 transition-colors duration-200",
                                        title: "Cerrar sesión",
                                        onClick: handleLogout,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            className: "w-5 h-5 text-foreground hover:text-primary transition-colors",
                                            fill: "none",
                                            stroke: "currentColor",
                                            viewBox: "0 0 24 24",
                                            strokeWidth: "2",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                            }, void 0, false, {
                                                fileName: "[project]/paddy/cargo/src/components/layout/TmsAppLayout.tsx",
                                                lineNumber: 137,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/paddy/cargo/src/components/layout/TmsAppLayout.tsx",
                                            lineNumber: 130,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/paddy/cargo/src/components/layout/TmsAppLayout.tsx",
                                        lineNumber: 124,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/paddy/cargo/src/components/layout/TmsAppLayout.tsx",
                                lineNumber: 66,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/paddy/cargo/src/components/layout/TmsAppLayout.tsx",
                        lineNumber: 57,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/paddy/cargo/src/components/layout/TmsAppLayout.tsx",
                    lineNumber: 56,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$components$2f$weighing$2f$SerialPortConfigDialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SerialPortConfigDialog"], {
                    open: serialDialogOpen,
                    onClose: ()=>setSerialDialogOpen(false),
                    isConnected: serialConnected,
                    isAvailable: serialAvailable,
                    isConnecting: serialConnecting,
                    dialogError: serialError,
                    onChoosePort: connectChoosingPort,
                    onDisconnect: disconnectSerial
                }, void 0, false, {
                    fileName: "[project]/paddy/cargo/src/components/layout/TmsAppLayout.tsx",
                    lineNumber: 144,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                children
            ]
        }, void 0, true, {
            fileName: "[project]/paddy/cargo/src/components/layout/TmsAppLayout.tsx",
            lineNumber: 55,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/paddy/cargo/src/components/layout/TmsAppLayout.tsx",
        lineNumber: 54,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s1(TmsAppLayout, "jJTN90QMKOryIpgK7ZfWeFdQqro=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$hooks$2f$useSerialPort$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSerialPort"],
        __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSession"]
    ];
});
_c = TmsAppLayout;
var _c;
__turbopack_context__.k.register(_c, "TmsAppLayout");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/paddy/cargo/src/actions/data:9efbd1 [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getDispatchesWeighingQueueTodayAction",
    ()=>$$RSC_SERVER_ACTION_0
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
/* __next_internal_action_entry_do_not_use__ [{"003735e412ed2deddc1fdbcf1fe861a020f9c8c491":"getDispatchesWeighingQueueTodayAction"},"paddy/cargo/src/actions/truckDispatchActions.ts",""] */ "use turbopack no side effects";
;
const $$RSC_SERVER_ACTION_0 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("003735e412ed2deddc1fdbcf1fe861a020f9c8c491", __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "getDispatchesWeighingQueueTodayAction");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
 //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vdHJ1Y2tEaXNwYXRjaEFjdGlvbnMudHMiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzZXJ2ZXInO1xuXG5pbXBvcnQgeyBnZXRTZXJ2ZXJTZXNzaW9uIH0gZnJvbSAnbmV4dC1hdXRoJztcbmltcG9ydCB7IGF1dGhPcHRpb25zIH0gZnJvbSAnQC9saWIvYXV0aC5jb25maWcnO1xuaW1wb3J0IHR5cGUgeyBMb2dpc3RpY3NQcm9kdWN0Q29kZSB9IGZyb20gJ0AvbGliL2xvZ2lzdGljc1Byb2R1Y3QnO1xuXG5jb25zdCBBUElfVVJMID0gcHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfQVBJX1VSTCB8fCAnaHR0cDovL2xvY2FsaG9zdDozMDAwL2FwaS92MSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgVHJ1Y2tEaXNwYXRjaFByb2R1Y2VyUmVmIHtcbiAgaWQ/OiBudW1iZXI7XG4gIHJ1dDogc3RyaW5nO1xuICBuYW1lOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgVHJ1Y2tEaXNwYXRjaCB7XG4gIGlkOiBudW1iZXI7XG4gIG51bWVyb190dXJubzogbnVtYmVyIHwgbnVsbDtcbiAgc3RhdHVzOiAnRVNQRVJBJyB8ICdGSU5JU0hFRCc7XG4gIHByb2R1Y2VyX2lkOiBudW1iZXI7XG4gIHByb2R1Y3Q/OiBMb2dpc3RpY3NQcm9kdWN0Q29kZTtcbiAgcHJvZHVjZXI/OiBUcnVja0Rpc3BhdGNoUHJvZHVjZXJSZWY7XG4gIGxpY2Vuc2VfcGxhdGU6IHN0cmluZztcbiAgZHJpdmVyX25hbWU/OiBzdHJpbmcgfCBudWxsO1xuICBjYXJyaWVyX2NvbXBhbnk/OiBzdHJpbmc7XG4gIGRpc3BhdGNoX2d1aWRlPzogc3RyaW5nO1xuICBncm9zc193ZWlnaHQ/OiBudW1iZXI7XG4gIHRhcmVfd2VpZ2h0PzogbnVtYmVyO1xuICBuZXRfd2VpZ2h0PzogbnVtYmVyO1xuICBlbnRyeV9hdDogRGF0ZTtcbiAgZmluaXNoZWRfYXQ/OiBEYXRlO1xuICBjcmVhdGVkX2J5Pzogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIENyZWF0ZVRydWNrRGlzcGF0Y2hXaXRoVGFyZVBheWxvYWQge1xuICBwcm9kdWNlcl9pZDogbnVtYmVyO1xuICBsaWNlbnNlX3BsYXRlOiBzdHJpbmc7XG4gIGRyaXZlcl9uYW1lPzogc3RyaW5nO1xuICBjYXJyaWVyX2NvbXBhbnk/OiBzdHJpbmc7XG4gIGRpc3BhdGNoX2d1aWRlPzogc3RyaW5nO1xuICB0YXJlX3dlaWdodDogbnVtYmVyO1xuICBwcm9kdWN0OiBMb2dpc3RpY3NQcm9kdWN0Q29kZTtcbiAgY3JlYXRlZF9ieT86IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBSZWdpc3RlckRpc3BhdGNoR3Jvc3NXZWlnaHRQYXlsb2FkIHtcbiAgdHJ1Y2tfZGlzcGF0Y2hfaWQ6IG51bWJlcjtcbiAgZ3Jvc3Nfd2VpZ2h0OiBudW1iZXI7XG4gIHN0YXR1cz86ICdGSU5JU0hFRCc7XG4gIGNyZWF0ZWRfYnk/OiBzdHJpbmc7XG59XG5cbmZ1bmN0aW9uIHBhcnNlRGlzcGF0Y2hGcm9tQXBpKHJhdzogUmVjb3JkPHN0cmluZywgdW5rbm93bj4pOiBUcnVja0Rpc3BhdGNoIHtcbiAgY29uc3QgcHJvZHVjZXIgPSByYXcucHJvZHVjZXIgYXMgVHJ1Y2tEaXNwYXRjaFByb2R1Y2VyUmVmIHwgdW5kZWZpbmVkO1xuICBjb25zdCBzdCA9IFN0cmluZyhyYXcuc3RhdHVzID8/ICcnKS50cmltKCkudG9VcHBlckNhc2UoKTtcbiAgY29uc3Qgc3RhdHVzOiBUcnVja0Rpc3BhdGNoWydzdGF0dXMnXSA9IHN0ID09PSAnRklOSVNIRUQnID8gJ0ZJTklTSEVEJyA6ICdFU1BFUkEnO1xuICBjb25zdCBwcm9kdWN0ID0gcmF3LnByb2R1Y3QgIT0gbnVsbCA/IFN0cmluZyhyYXcucHJvZHVjdCkgOiB1bmRlZmluZWQ7XG4gIGNvbnN0IHAgPVxuICAgIHByb2R1Y3QgPT09ICdDQVNDQVJJTExBJyB8fCBwcm9kdWN0ID09PSAnQVJST1pfUEFERFknXG4gICAgICA/IChwcm9kdWN0IGFzIExvZ2lzdGljc1Byb2R1Y3RDb2RlKVxuICAgICAgOiB1bmRlZmluZWQ7XG5cbiAgcmV0dXJuIHtcbiAgICBpZDogTnVtYmVyKHJhdy5pZCksXG4gICAgbnVtZXJvX3R1cm5vOlxuICAgICAgcmF3Lm51bWVyb190dXJubyAhPSBudWxsICYmICFOdW1iZXIuaXNOYU4oTnVtYmVyKHJhdy5udW1lcm9fdHVybm8pKVxuICAgICAgICA/IE51bWJlcihyYXcubnVtZXJvX3R1cm5vKVxuICAgICAgICA6IG51bGwsXG4gICAgc3RhdHVzLFxuICAgIHByb2R1Y2VyX2lkOiBOdW1iZXIocmF3LnByb2R1Y2VyX2lkID8/IDApLFxuICAgIHByb2R1Y3Q6IHAsXG4gICAgcHJvZHVjZXIsXG4gICAgbGljZW5zZV9wbGF0ZTogU3RyaW5nKHJhdy5saWNlbnNlX3BsYXRlID8/ICcnKSxcbiAgICBkcml2ZXJfbmFtZTogcmF3LmRyaXZlcl9uYW1lICE9IG51bGwgPyBTdHJpbmcocmF3LmRyaXZlcl9uYW1lKSA6IG51bGwsXG4gICAgY2Fycmllcl9jb21wYW55OlxuICAgICAgcmF3LmNhcnJpZXJfY29tcGFueSAhPSBudWxsID8gU3RyaW5nKHJhdy5jYXJyaWVyX2NvbXBhbnkpIDogdW5kZWZpbmVkLFxuICAgIGRpc3BhdGNoX2d1aWRlOlxuICAgICAgcmF3LmRpc3BhdGNoX2d1aWRlICE9IG51bGwgPyBTdHJpbmcocmF3LmRpc3BhdGNoX2d1aWRlKSA6IHVuZGVmaW5lZCxcbiAgICBncm9zc193ZWlnaHQ6XG4gICAgICByYXcuZ3Jvc3Nfd2VpZ2h0ICE9IG51bGwgPyBOdW1iZXIocmF3Lmdyb3NzX3dlaWdodCkgOiB1bmRlZmluZWQsXG4gICAgdGFyZV93ZWlnaHQ6IHJhdy50YXJlX3dlaWdodCAhPSBudWxsID8gTnVtYmVyKHJhdy50YXJlX3dlaWdodCkgOiB1bmRlZmluZWQsXG4gICAgbmV0X3dlaWdodDogcmF3Lm5ldF93ZWlnaHQgIT0gbnVsbCA/IE51bWJlcihyYXcubmV0X3dlaWdodCkgOiB1bmRlZmluZWQsXG4gICAgZW50cnlfYXQ6IG5ldyBEYXRlKFN0cmluZyhyYXcuZW50cnlfYXQgPz8gRGF0ZS5ub3coKSkpLFxuICAgIGZpbmlzaGVkX2F0OiByYXcuZmluaXNoZWRfYXQgPyBuZXcgRGF0ZShTdHJpbmcocmF3LmZpbmlzaGVkX2F0KSkgOiB1bmRlZmluZWQsXG4gICAgY3JlYXRlZF9ieTogcmF3LmNyZWF0ZWRfYnkgIT0gbnVsbCA/IFN0cmluZyhyYXcuY3JlYXRlZF9ieSkgOiB1bmRlZmluZWQsXG4gIH07XG59XG5cbi8qKiBDb2xhIGRlIHBlc2FqZTogRVNQRVJBIGNvbiB0YXJhIHkgc2luIGJydXRvIChob3kpLiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldERpc3BhdGNoZXNXZWlnaGluZ1F1ZXVlVG9kYXlBY3Rpb24oKTogUHJvbWlzZTxcbiAgVHJ1Y2tEaXNwYXRjaFtdXG4+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBzZXNzaW9uID0gYXdhaXQgZ2V0U2VydmVyU2Vzc2lvbihhdXRoT3B0aW9ucyk7XG5cbiAgICBpZiAoIXNlc3Npb24/LnVzZXI/LmFjY2Vzc1Rva2VuKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgJHtBUElfVVJMfS9sb2dpc3RpY3MvdHVybm9zL2Rpc3BhdGNoZXMvdG9kYXlgLCB7XG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgIEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHtzZXNzaW9uLnVzZXIuYWNjZXNzVG9rZW59YCxcbiAgICAgIH0sXG4gICAgICBjYWNoZTogJ25vLXN0b3JlJyxcbiAgICB9KTtcblxuICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgY29uc3QgZGF0YUFycmF5ID0gKHJlc3VsdC5kYXRhIHx8IFtdKSBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPltdO1xuICAgIHJldHVybiBkYXRhQXJyYXkubWFwKHBhcnNlRGlzcGF0Y2hGcm9tQXBpKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdFcnJvciBvYnRlbmllbmRvIGNvbGEgZGVzcGFjaG86JywgZXJyb3IpO1xuICAgIHJldHVybiBbXTtcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlVHJ1Y2tEaXNwYXRjaFdpdGhUYXJlQWN0aW9uKFxuICBwYXlsb2FkOiBDcmVhdGVUcnVja0Rpc3BhdGNoV2l0aFRhcmVQYXlsb2FkLFxuKTogUHJvbWlzZTxUcnVja0Rpc3BhdGNoPiB7XG4gIGNvbnN0IHNlc3Npb24gPSBhd2FpdCBnZXRTZXJ2ZXJTZXNzaW9uKGF1dGhPcHRpb25zKTtcblxuICBpZiAoIXNlc3Npb24/LnVzZXI/LmFjY2Vzc1Rva2VuKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdObyBhdXRlbnRpY2FkbycpO1xuICB9XG5cbiAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgJHtBUElfVVJMfS9sb2dpc3RpY3MvdHJ1Y2stZGlzcGF0Y2hlcy93aXRoLXRhcmVgLCB7XG4gICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgaGVhZGVyczoge1xuICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgIEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHtzZXNzaW9uLnVzZXIuYWNjZXNzVG9rZW59YCxcbiAgICB9LFxuICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgIHByb2R1Y2VyX2lkOiBwYXlsb2FkLnByb2R1Y2VyX2lkLFxuICAgICAgbGljZW5zZV9wbGF0ZTogcGF5bG9hZC5saWNlbnNlX3BsYXRlLFxuICAgICAgZHJpdmVyX25hbWU6IHBheWxvYWQuZHJpdmVyX25hbWUsXG4gICAgICBjYXJyaWVyX2NvbXBhbnk6IHBheWxvYWQuY2Fycmllcl9jb21wYW55LFxuICAgICAgZGlzcGF0Y2hfZ3VpZGU6IHBheWxvYWQuZGlzcGF0Y2hfZ3VpZGUsXG4gICAgICB0YXJlX3dlaWdodDogcGF5bG9hZC50YXJlX3dlaWdodCxcbiAgICAgIHByb2R1Y3Q6IHBheWxvYWQucHJvZHVjdCxcbiAgICAgIGNyZWF0ZWRfYnk6IHBheWxvYWQuY3JlYXRlZF9ieSxcbiAgICB9KSxcbiAgfSk7XG5cbiAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgIGxldCBtc2cgPSBgSFRUUCAke3Jlc3BvbnNlLnN0YXR1c31gO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBlcnIgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICBpZiAodHlwZW9mIGVycj8ubWVzc2FnZSA9PT0gJ3N0cmluZycpIG1zZyA9IGVyci5tZXNzYWdlO1xuICAgICAgZWxzZSBpZiAoQXJyYXkuaXNBcnJheShlcnI/Lm1lc3NhZ2UpKSBtc2cgPSBlcnIubWVzc2FnZS5qb2luKCcuICcpO1xuICAgIH0gY2F0Y2gge1xuICAgICAgLyogaWdub3JlICovXG4gICAgfVxuICAgIHRocm93IG5ldyBFcnJvcihtc2cpO1xuICB9XG5cbiAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICByZXR1cm4gcGFyc2VEaXNwYXRjaEZyb21BcGkocmVzdWx0LmRhdGEgYXMgUmVjb3JkPHN0cmluZywgdW5rbm93bj4pO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVnaXN0ZXJEaXNwYXRjaEdyb3NzV2VpZ2h0QWN0aW9uKFxuICBwYXlsb2FkOiBSZWdpc3RlckRpc3BhdGNoR3Jvc3NXZWlnaHRQYXlsb2FkLFxuKTogUHJvbWlzZTxUcnVja0Rpc3BhdGNoPiB7XG4gIGNvbnN0IHNlc3Npb24gPSBhd2FpdCBnZXRTZXJ2ZXJTZXNzaW9uKGF1dGhPcHRpb25zKTtcblxuICBpZiAoIXNlc3Npb24/LnVzZXI/LmFjY2Vzc1Rva2VuKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdObyBhdXRlbnRpY2FkbycpO1xuICB9XG5cbiAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgJHtBUElfVVJMfS9sb2dpc3RpY3Mvd2VpZ2hpbmdzL2Rpc3BhdGNoLWdyb3NzYCwge1xuICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgIGhlYWRlcnM6IHtcbiAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7c2Vzc2lvbi51c2VyLmFjY2Vzc1Rva2VufWAsXG4gICAgfSxcbiAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICB0cnVja19kaXNwYXRjaF9pZDogcGF5bG9hZC50cnVja19kaXNwYXRjaF9pZCxcbiAgICAgIGdyb3NzX3dlaWdodDogcGF5bG9hZC5ncm9zc193ZWlnaHQsXG4gICAgICBzdGF0dXM6IHBheWxvYWQuc3RhdHVzID8/ICdGSU5JU0hFRCcsXG4gICAgICBjcmVhdGVkX2J5OiBwYXlsb2FkLmNyZWF0ZWRfYnksXG4gICAgfSksXG4gIH0pO1xuXG4gIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICBsZXQgbXNnID0gYEhUVFAgJHtyZXNwb25zZS5zdGF0dXN9YDtcbiAgICB0cnkge1xuICAgICAgY29uc3QgZXJyID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgaWYgKHR5cGVvZiBlcnI/Lm1lc3NhZ2UgPT09ICdzdHJpbmcnKSBtc2cgPSBlcnIubWVzc2FnZTtcbiAgICAgIGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoZXJyPy5tZXNzYWdlKSkgbXNnID0gZXJyLm1lc3NhZ2Uuam9pbignLiAnKTtcbiAgICB9IGNhdGNoIHtcbiAgICAgIC8qIGlnbm9yZSAqL1xuICAgIH1cbiAgICB0aHJvdyBuZXcgRXJyb3IobXNnKTtcbiAgfVxuXG4gIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgcmV0dXJuIHBhcnNlRGlzcGF0Y2hGcm9tQXBpKHJlc3VsdC5kYXRhIGFzIFJlY29yZDxzdHJpbmcsIHVua25vd24+KTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBVcGRhdGVUcnVja0Rpc3BhdGNoUGF5bG9hZCB7XG4gIHByb2R1Y2VyX2lkPzogbnVtYmVyO1xuICBsaWNlbnNlX3BsYXRlPzogc3RyaW5nO1xuICBkcml2ZXJfbmFtZT86IHN0cmluZyB8IG51bGw7XG4gIGNhcnJpZXJfY29tcGFueT86IHN0cmluZztcbiAgZGlzcGF0Y2hfZ3VpZGU/OiBzdHJpbmc7XG4gIGdyb3NzX3dlaWdodD86IG51bWJlcjtcbiAgdGFyZV93ZWlnaHQ/OiBudW1iZXI7XG4gIHByb2R1Y3Q/OiBMb2dpc3RpY3NQcm9kdWN0Q29kZTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFRydWNrRGlzcGF0Y2hCeUlkQWN0aW9uKGlkOiBudW1iZXIpOiBQcm9taXNlPFRydWNrRGlzcGF0Y2ggfCBudWxsPiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IGdldFNlcnZlclNlc3Npb24oYXV0aE9wdGlvbnMpO1xuXG4gICAgaWYgKCFzZXNzaW9uPy51c2VyPy5hY2Nlc3NUb2tlbikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBhdXRlbnRpY2FkbycpO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYCR7QVBJX1VSTH0vbG9naXN0aWNzL3RydWNrLWRpc3BhdGNoZXMvJHtpZH1gLCB7XG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgIEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHtzZXNzaW9uLnVzZXIuYWNjZXNzVG9rZW59YCxcbiAgICAgIH0sXG4gICAgICBjYWNoZTogJ25vLXN0b3JlJyxcbiAgICB9KTtcblxuICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICByZXR1cm4gcGFyc2VEaXNwYXRjaEZyb21BcGkocmVzdWx0LmRhdGEgYXMgUmVjb3JkPHN0cmluZywgdW5rbm93bj4pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIG9idGVuaWVuZG8gZGVzcGFjaG86JywgZXJyb3IpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGRhdGVUcnVja0Rpc3BhdGNoQWN0aW9uKFxuICBpZDogbnVtYmVyLFxuICBwYXlsb2FkOiBVcGRhdGVUcnVja0Rpc3BhdGNoUGF5bG9hZCxcbik6IFByb21pc2U8VHJ1Y2tEaXNwYXRjaD4ge1xuICBjb25zdCBzZXNzaW9uID0gYXdhaXQgZ2V0U2VydmVyU2Vzc2lvbihhdXRoT3B0aW9ucyk7XG5cbiAgaWYgKCFzZXNzaW9uPy51c2VyPy5hY2Nlc3NUb2tlbikge1xuICAgIHRocm93IG5ldyBFcnJvcignTm8gYXV0ZW50aWNhZG8nKTtcbiAgfVxuXG4gIGNvbnN0IGJvZHkgPSBPYmplY3QuZnJvbUVudHJpZXMoXG4gICAgT2JqZWN0LmVudHJpZXMocGF5bG9hZCkuZmlsdGVyKChbLCB2XSkgPT4gdiAhPT0gdW5kZWZpbmVkKSxcbiAgKTtcblxuICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAke0FQSV9VUkx9L2xvZ2lzdGljcy90cnVjay1kaXNwYXRjaGVzLyR7aWR9YCwge1xuICAgIG1ldGhvZDogJ1BVVCcsXG4gICAgaGVhZGVyczoge1xuICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgIEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHtzZXNzaW9uLnVzZXIuYWNjZXNzVG9rZW59YCxcbiAgICB9LFxuICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGJvZHkpLFxuICB9KTtcblxuICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgbGV0IG1zZyA9IGBIVFRQICR7cmVzcG9uc2Uuc3RhdHVzfWA7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGVyciA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgIGlmICh0eXBlb2YgZXJyPy5tZXNzYWdlID09PSAnc3RyaW5nJykgbXNnID0gZXJyLm1lc3NhZ2U7XG4gICAgICBlbHNlIGlmIChBcnJheS5pc0FycmF5KGVycj8ubWVzc2FnZSkpIG1zZyA9IGVyci5tZXNzYWdlLmpvaW4oJy4gJyk7XG4gICAgfSBjYXRjaCB7XG4gICAgICAvKiBpZ25vcmUgKi9cbiAgICB9XG4gICAgdGhyb3cgbmV3IEVycm9yKG1zZyk7XG4gIH1cblxuICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gIHJldHVybiBwYXJzZURpc3BhdGNoRnJvbUFwaShyZXN1bHQuZGF0YSBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPik7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkZWxldGVUcnVja0Rpc3BhdGNoQWN0aW9uKGlkOiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IGdldFNlcnZlclNlc3Npb24oYXV0aE9wdGlvbnMpO1xuXG4gIGlmICghc2Vzc2lvbj8udXNlcj8uYWNjZXNzVG9rZW4pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIGF1dGVudGljYWRvJyk7XG4gIH1cblxuICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAke0FQSV9VUkx9L2xvZ2lzdGljcy90cnVjay1kaXNwYXRjaGVzLyR7aWR9YCwge1xuICAgIG1ldGhvZDogJ0RFTEVURScsXG4gICAgaGVhZGVyczoge1xuICAgICAgQXV0aG9yaXphdGlvbjogYEJlYXJlciAke3Nlc3Npb24udXNlci5hY2Nlc3NUb2tlbn1gLFxuICAgIH0sXG4gIH0pO1xuXG4gIGNvbnN0IHJlc3BvbnNlUGF5bG9hZCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKS5jYXRjaCgoKSA9PiBudWxsKTtcblxuICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgY29uc3QgcmF3ID0gKHJlc3BvbnNlUGF5bG9hZCBhcyB7IG1lc3NhZ2U/OiB1bmtub3duIH0pPy5tZXNzYWdlO1xuICAgIGNvbnN0IG1zZyA9XG4gICAgICB0eXBlb2YgcmF3ID09PSAnc3RyaW5nJ1xuICAgICAgICA/IHJhd1xuICAgICAgICA6IEFycmF5LmlzQXJyYXkocmF3KVxuICAgICAgICAgID8gcmF3LmpvaW4oJy4gJylcbiAgICAgICAgICA6IGBIVFRQICR7cmVzcG9uc2Uuc3RhdHVzfWA7XG4gICAgdGhyb3cgbmV3IEVycm9yKG1zZyk7XG4gIH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBUcnVja0Rpc3BhdGNoR3JpZFJvdyB7XG4gIGlkOiBudW1iZXI7XG4gIHN0YXR1czogc3RyaW5nO1xuICBwcm9kdWN0Pzogc3RyaW5nO1xuICBwcm9kdWNlcl9pZD86IG51bWJlcjtcbiAgbGljZW5zZV9wbGF0ZTogc3RyaW5nO1xuICBkcml2ZXJfbmFtZTogc3RyaW5nO1xuICBjYXJyaWVyX2NvbXBhbnk/OiBzdHJpbmcgfCBudWxsO1xuICBkaXNwYXRjaF9ndWlkZT86IHN0cmluZyB8IG51bGw7XG4gIGdyb3NzX3dlaWdodDogc3RyaW5nIHwgbnVtYmVyIHwgbnVsbDtcbiAgdGFyZV93ZWlnaHQ6IHN0cmluZyB8IG51bWJlciB8IG51bGw7XG4gIG5ldF93ZWlnaHQ6IHN0cmluZyB8IG51bWJlciB8IG51bGw7XG4gIGVudHJ5X2F0OiBzdHJpbmc7XG4gIGZpbmlzaGVkX2F0Pzogc3RyaW5nIHwgbnVsbDtcbiAgcHJvZHVjZXJfbmFtZTogc3RyaW5nO1xuICBwcm9kdWNlcl9ydXQ6IHN0cmluZztcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFRydWNrRGlzcGF0Y2hlc0dyaWRBY3Rpb24ocGFyYW1zOiB7XG4gIGxpbWl0PzogbnVtYmVyO1xuICBvZmZzZXQ/OiBudW1iZXI7XG4gIHNlYXJjaD86IHN0cmluZztcbiAgZmlsdGVycz86IHN0cmluZztcbiAgc29ydD86IHN0cmluZztcbiAgc29ydEZpZWxkPzogc3RyaW5nO1xufSk6IFByb21pc2U8eyByb3dzOiBUcnVja0Rpc3BhdGNoR3JpZFJvd1tdOyB0b3RhbDogbnVtYmVyIH0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBzZXNzaW9uID0gYXdhaXQgZ2V0U2VydmVyU2Vzc2lvbihhdXRoT3B0aW9ucyk7XG5cbiAgICBpZiAoIXNlc3Npb24/LnVzZXI/LmFjY2Vzc1Rva2VuKSB7XG4gICAgICByZXR1cm4geyByb3dzOiBbXSwgdG90YWw6IDAgfTtcbiAgICB9XG5cbiAgICBjb25zdCBsaW1pdCA9IE1hdGgubWluKE1hdGgubWF4KHBhcmFtcy5saW1pdCA/PyAyNSwgMSksIDUwMCk7XG4gICAgY29uc3Qgb2Zmc2V0ID0gTWF0aC5tYXgocGFyYW1zLm9mZnNldCA/PyAwLCAwKTtcblxuICAgIGNvbnN0IHFzID0gbmV3IFVSTFNlYXJjaFBhcmFtcygpO1xuICAgIHFzLnNldCgnbGltaXQnLCBTdHJpbmcobGltaXQpKTtcbiAgICBxcy5zZXQoJ29mZnNldCcsIFN0cmluZyhvZmZzZXQpKTtcbiAgICBpZiAocGFyYW1zLnNlYXJjaD8udHJpbSgpKSB7XG4gICAgICBxcy5zZXQoJ3NlYXJjaCcsIHBhcmFtcy5zZWFyY2gudHJpbSgpKTtcbiAgICB9XG4gICAgaWYgKHBhcmFtcy5maWx0ZXJzPy50cmltKCkpIHtcbiAgICAgIHFzLnNldCgnZmlsdGVycycsIHBhcmFtcy5maWx0ZXJzLnRyaW0oKSk7XG4gICAgfVxuICAgIGlmIChwYXJhbXMuc29ydD8udHJpbSgpKSB7XG4gICAgICBxcy5zZXQoJ3NvcnQnLCBwYXJhbXMuc29ydC50cmltKCkpO1xuICAgIH1cbiAgICBpZiAocGFyYW1zLnNvcnRGaWVsZD8udHJpbSgpKSB7XG4gICAgICBxcy5zZXQoJ3NvcnRGaWVsZCcsIHBhcmFtcy5zb3J0RmllbGQudHJpbSgpKTtcbiAgICB9XG5cbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFxuICAgICAgYCR7QVBJX1VSTH0vbG9naXN0aWNzL3RydWNrLWRpc3BhdGNoZXMvZ3JpZD8ke3FzLnRvU3RyaW5nKCl9YCxcbiAgICAgIHtcbiAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgIEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHtzZXNzaW9uLnVzZXIuYWNjZXNzVG9rZW59YCxcbiAgICAgICAgfSxcbiAgICAgICAgY2FjaGU6ICduby1zdG9yZScsXG4gICAgICB9LFxuICAgICk7XG5cbiAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICByZXR1cm4geyByb3dzOiBbXSwgdG90YWw6IDAgfTtcbiAgICB9XG5cbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgY29uc3QgcGF5bG9hZCA9IHJlc3VsdC5kYXRhIGFzIHsgZGF0YTogdW5rbm93bltdOyB0b3RhbDogbnVtYmVyIH0gfCB1bmRlZmluZWQ7XG4gICAgY29uc3QgcmF3ID0gKHBheWxvYWQ/LmRhdGEgPz8gW10pIGFzIFJlY29yZDxzdHJpbmcsIHVua25vd24+W107XG4gICAgY29uc3QgdG90YWwgPSB0eXBlb2YgcGF5bG9hZD8udG90YWwgPT09ICdudW1iZXInID8gcGF5bG9hZC50b3RhbCA6IHJhdy5sZW5ndGg7XG5cbiAgICBjb25zdCByb3dzOiBUcnVja0Rpc3BhdGNoR3JpZFJvd1tdID0gcmF3Lm1hcCgocikgPT4ge1xuICAgICAgY29uc3QgcHJvZHVjZXIgPSByLnByb2R1Y2VyIGFzIHsgbmFtZT86IHN0cmluZzsgcnV0Pzogc3RyaW5nIH0gfCB1bmRlZmluZWQ7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBpZDogTnVtYmVyKHIuaWQpLFxuICAgICAgICBzdGF0dXM6IFN0cmluZyhyLnN0YXR1cyA/PyAnJyksXG4gICAgICAgIHByb2R1Y3Q6IHIucHJvZHVjdCAhPSBudWxsID8gU3RyaW5nKHIucHJvZHVjdCkgOiB1bmRlZmluZWQsXG4gICAgICAgIHByb2R1Y2VyX2lkOlxuICAgICAgICAgIHIucHJvZHVjZXJfaWQgIT0gbnVsbCA/IE51bWJlcihyLnByb2R1Y2VyX2lkKSA6IHVuZGVmaW5lZCxcbiAgICAgICAgbGljZW5zZV9wbGF0ZTogU3RyaW5nKHIubGljZW5zZV9wbGF0ZSA/PyAnJyksXG4gICAgICAgIGRyaXZlcl9uYW1lOiBTdHJpbmcoci5kcml2ZXJfbmFtZSA/PyAnJyksXG4gICAgICAgIGNhcnJpZXJfY29tcGFueTpcbiAgICAgICAgICByLmNhcnJpZXJfY29tcGFueSAhPSBudWxsID8gU3RyaW5nKHIuY2Fycmllcl9jb21wYW55KSA6IG51bGwsXG4gICAgICAgIGRpc3BhdGNoX2d1aWRlOlxuICAgICAgICAgIHIuZGlzcGF0Y2hfZ3VpZGUgIT0gbnVsbCA/IFN0cmluZyhyLmRpc3BhdGNoX2d1aWRlKSA6IG51bGwsXG4gICAgICAgIGdyb3NzX3dlaWdodDogci5ncm9zc193ZWlnaHQgYXMgc3RyaW5nIHwgbnVtYmVyIHwgbnVsbCxcbiAgICAgICAgdGFyZV93ZWlnaHQ6IHIudGFyZV93ZWlnaHQgYXMgc3RyaW5nIHwgbnVtYmVyIHwgbnVsbCxcbiAgICAgICAgbmV0X3dlaWdodDogci5uZXRfd2VpZ2h0IGFzIHN0cmluZyB8IG51bWJlciB8IG51bGwsXG4gICAgICAgIGVudHJ5X2F0OiBTdHJpbmcoci5lbnRyeV9hdCA/PyAnJyksXG4gICAgICAgIGZpbmlzaGVkX2F0OiByLmZpbmlzaGVkX2F0ICE9IG51bGwgPyBTdHJpbmcoci5maW5pc2hlZF9hdCkgOiBudWxsLFxuICAgICAgICBwcm9kdWNlcl9uYW1lOiBwcm9kdWNlcj8ubmFtZSA/PyAnJyxcbiAgICAgICAgcHJvZHVjZXJfcnV0OiBwcm9kdWNlcj8ucnV0ID8/ICcnLFxuICAgICAgfTtcbiAgICB9KTtcblxuICAgIHJldHVybiB7IHJvd3MsIHRvdGFsIH07XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcignRXJyb3IgZ3JpZCBkZXNwYWNob3M6JywgZXJyb3IpO1xuICAgIHJldHVybiB7IHJvd3M6IFtdLCB0b3RhbDogMCB9O1xuICB9XG59XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6InlVQXdGc0Isa05BQUEifQ==
}),
"[project]/paddy/cargo/src/providers/DispatchWeighingPageProvider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DispatchWeighingPageProvider",
    ()=>DispatchWeighingPageProvider,
    "useDispatchWeighingPage",
    ()=>useDispatchWeighingPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$actions$2f$data$3a$9efbd1__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/paddy/cargo/src/actions/data:9efbd1 [app-client] (ecmascript) <text/javascript>");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
const DispatchWeighingPageContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const DispatchWeighingPageProvider = ({ children })=>{
    _s();
    const [dispatches, setDispatches] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedDispatchId, setSelectedDispatchId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const loadDispatchesToday = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "DispatchWeighingPageProvider.useCallback[loadDispatchesToday]": async ()=>{
            setIsLoading(true);
            setError(null);
            try {
                const rows = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$actions$2f$data$3a$9efbd1__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["getDispatchesWeighingQueueTodayAction"])();
                setDispatches(rows);
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Error desconocido';
                setError(`Error cargando despachos: ${message}`);
            } finally{
                setIsLoading(false);
            }
        }
    }["DispatchWeighingPageProvider.useCallback[loadDispatchesToday]"], []);
    const selectDispatch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "DispatchWeighingPageProvider.useCallback[selectDispatch]": (id)=>{
            setSelectedDispatchId(id);
        }
    }["DispatchWeighingPageProvider.useCallback[selectDispatch]"], []);
    const addDispatch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "DispatchWeighingPageProvider.useCallback[addDispatch]": (d)=>{
            setDispatches({
                "DispatchWeighingPageProvider.useCallback[addDispatch]": (prev)=>[
                        d,
                        ...prev
                    ]
            }["DispatchWeighingPageProvider.useCallback[addDispatch]"]);
        }
    }["DispatchWeighingPageProvider.useCallback[addDispatch]"], []);
    const updateDispatch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "DispatchWeighingPageProvider.useCallback[updateDispatch]": (d)=>{
            setDispatches({
                "DispatchWeighingPageProvider.useCallback[updateDispatch]": (prev)=>prev.filter({
                        "DispatchWeighingPageProvider.useCallback[updateDispatch]": (x)=>x.id !== d.id
                    }["DispatchWeighingPageProvider.useCallback[updateDispatch]"])
            }["DispatchWeighingPageProvider.useCallback[updateDispatch]"]);
            setSelectedDispatchId({
                "DispatchWeighingPageProvider.useCallback[updateDispatch]": (cur)=>cur === d.id ? null : cur
            }["DispatchWeighingPageProvider.useCallback[updateDispatch]"]);
        }
    }["DispatchWeighingPageProvider.useCallback[updateDispatch]"], []);
    const clearError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "DispatchWeighingPageProvider.useCallback[clearError]": ()=>{
            setError(null);
        }
    }["DispatchWeighingPageProvider.useCallback[clearError]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DispatchWeighingPageProvider.useEffect": ()=>{
            void loadDispatchesToday();
        }
    }["DispatchWeighingPageProvider.useEffect"], [
        loadDispatchesToday
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DispatchWeighingPageProvider.useEffect": ()=>{
            const id = setInterval({
                "DispatchWeighingPageProvider.useEffect.id": ()=>{
                    void loadDispatchesToday();
                }
            }["DispatchWeighingPageProvider.useEffect.id"], 30000);
            return ({
                "DispatchWeighingPageProvider.useEffect": ()=>clearInterval(id)
            })["DispatchWeighingPageProvider.useEffect"];
        }
    }["DispatchWeighingPageProvider.useEffect"], [
        loadDispatchesToday
    ]);
    const value = {
        dispatches,
        selectedDispatchId,
        isLoading,
        error,
        loadDispatchesToday,
        selectDispatch,
        addDispatch,
        updateDispatch,
        clearError
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DispatchWeighingPageContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/paddy/cargo/src/providers/DispatchWeighingPageProvider.tsx",
        lineNumber: 88,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(DispatchWeighingPageProvider, "zfDgYyHlnshm6ZprzWjY8vfv5Ys=");
_c = DispatchWeighingPageProvider;
const useDispatchWeighingPage = ()=>{
    _s1();
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(DispatchWeighingPageContext);
    if (!ctx) {
        throw new Error('useDispatchWeighingPage debe usarse dentro de DispatchWeighingPageProvider');
    }
    return ctx;
};
_s1(useDispatchWeighingPage, "/dMy7t63NXD4eYACoT93CePwGrg=");
var _c;
__turbopack_context__.k.register(_c, "DispatchWeighingPageProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/paddy/cargo/src/shared/components/ui/Alert/Alert.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
const variantStyles = {
    success: "alert-success",
    info: "alert-info",
    warning: "alert-warning",
    error: "alert-error"
};
const Alert = ({ variant = "info", children, className = "", ...props })=>{
    const dataTestId = props["data-test-id"];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative w-full",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 bg-white/70 rounded z-0 pointer-events-none"
            }, void 0, false, {
                fileName: "[project]/paddy/cargo/src/shared/components/ui/Alert/Alert.tsx",
                lineNumber: 24,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `relative w-full px-4 py-2 rounded border font-light flex items-center gap-2 ${variantStyles[variant]} ${className}`,
                role: "alert",
                "data-test-id": dataTestId || `alert-${variant}`,
                children: children
            }, void 0, false, {
                fileName: "[project]/paddy/cargo/src/shared/components/ui/Alert/Alert.tsx",
                lineNumber: 25,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/paddy/cargo/src/shared/components/ui/Alert/Alert.tsx",
        lineNumber: 22,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = Alert;
const __TURBOPACK__default__export__ = Alert;
var _c;
__turbopack_context__.k.register(_c, "Alert");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/paddy/cargo/src/shared/components/ui/AutoComplete/AutoComplete.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$shared$2f$components$2f$ui$2f$DropdownList$2f$DropdownList$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/src/shared/components/ui/DropdownList/DropdownList.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$shared$2f$components$2f$ui$2f$IconButton$2f$IconButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/src/shared/components/ui/IconButton/IconButton.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$shared$2f$components$2f$ui$2f$TextField$2f$TextField$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/src/shared/components/ui/TextField/TextField.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
// Ref map para tracking de items renderizados
const itemRefs = new Map();
const AutoComplete = ({ options, label, labelAlwaysVisible = false, placeholder, value = null, onChange, onInputChange, name, required, compact = false, getOptionLabel, getOptionValue, filterOption, inputRef: externalInputRef, ...props })=>{
    _s();
    // Helper functions with defaults for backward compatibility
    const defaultGetOptionLabel = (option)=>{
        if (typeof option === 'string') return option;
        if (option && typeof option === 'object' && 'label' in option) {
            return option.label;
        }
        return String(option);
    };
    const defaultGetOptionValue = (option)=>{
        if (typeof option === 'string') return option;
        if (option && typeof option === 'object' && 'id' in option) {
            return option.id;
        }
        return option;
    };
    const getLabel = getOptionLabel || defaultGetOptionLabel;
    const getValue = getOptionValue || defaultGetOptionValue;
    const [highlightedIndex, setHighlightedIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(-1);
    const [inputValue, setInputValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(value ? getLabel(value) : "");
    const [focused, setFocused] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isNavigating, setIsNavigating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [validationTriggered, setValidationTriggered] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const inputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const disabled = props.disabled;
    // Buscar y vincular el input interno del TextField al ref externo
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AutoComplete.useEffect": ()=>{
            // Buscar el input dentro del contenedor del AutoComplete
            const textFieldInput = containerRef.current?.querySelector('input[type="text"], input[placeholder*="Buscar"]');
            if (textFieldInput && !inputRef.current) {
                inputRef.current = textFieldInput;
                console.log('[AutoComplete] Input del TextField vinculado al ref interno');
            }
        }
    }["AutoComplete.useEffect"], []);
    // Vincular el ref interno con el ref externo
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AutoComplete.useEffect": ()=>{
            if (externalInputRef && inputRef.current) {
                if (externalInputRef.current !== inputRef.current) {
                    externalInputRef.current = inputRef.current;
                    console.log('[AutoComplete] Ref externo vinculado al ref interno');
                }
            }
        }
    }["AutoComplete.useEffect"], [
        externalInputRef,
        inputRef
    ]);
    // Sync inputValue with value prop
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AutoComplete.useEffect": ()=>{
            setInputValue(value ? getLabel(value) : "");
        }
    }["AutoComplete.useEffect"], [
        value
    ]);
    const shrink = focused || inputValue.length > 0;
    const filteredOptions = options.filter((opt)=>{
        if (typeof filterOption === 'function') {
            return filterOption(opt, inputValue);
        }
        return getLabel(opt).toLowerCase().includes(inputValue.toLowerCase());
    });
    // Mantener el índice destacado sincronizado con la lista filtrada.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AutoComplete.useEffect": ()=>{
            if (!open) return;
            if (filteredOptions.length === 0) {
                if (highlightedIndex !== -1) {
                    setHighlightedIndex(-1);
                }
                return;
            }
            if (highlightedIndex >= filteredOptions.length) {
                setHighlightedIndex(filteredOptions.length - 1);
            }
        }
    }["AutoComplete.useEffect"], [
        open,
        filteredOptions.length,
        highlightedIndex
    ]);
    // Scroll automático al item destacado
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AutoComplete.useEffect": ()=>{
            if (highlightedIndex < 0 || !open) {
                return;
            }
            const highlightedOption = filteredOptions[highlightedIndex];
            if (!highlightedOption) {
                return;
            }
            const highlightedKey = getValue(highlightedOption);
            const element = itemRefs.get(highlightedKey);
            if (element) {
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });
            }
        }
    }["AutoComplete.useEffect"], [
        highlightedIndex,
        open,
        filteredOptions
    ]);
    // Handle keyboard navigation on TextField input
    const handleKeyDown = (e)=>{
        if (!focused || disabled) return;
        if (!open && [
            "ArrowDown",
            "ArrowUp",
            "Enter"
        ].includes(e.key)) {
            e.preventDefault();
            setOpen(true);
            setHighlightedIndex(e.key === "ArrowUp" ? filteredOptions.length - 1 : 0);
            return;
        }
        if (!open || filteredOptions.length === 0) return;
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setIsNavigating(true);
            setHighlightedIndex((i)=>i < filteredOptions.length - 1 ? i + 1 : 0);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setIsNavigating(true);
            setHighlightedIndex((i)=>i > 0 ? i - 1 : filteredOptions.length - 1);
        } else if (e.key === "Enter" && highlightedIndex >= 0) {
            e.preventDefault();
            const highlightedOption = filteredOptions[highlightedIndex];
            if (highlightedOption) {
                handleSelect(highlightedOption);
            }
        } else if (e.key === "Escape") {
            e.preventDefault();
            setOpen(false);
            setIsNavigating(false);
            setHighlightedIndex(-1);
        }
    };
    const handleSelect = (option)=>{
        setInputValue(getLabel(option));
        setOpen(false);
        setIsNavigating(false);
        onChange?.(option);
    };
    const handleClear = ()=>{
        setInputValue(""); // Clear the input text
        setOpen(false); // Close the dropdown
        setHighlightedIndex(-1); // Reset the highlighted index
        onInputChange?.("");
        onChange?.(null); // Clear the selected option
    };
    const handleValidation = ()=>{
        if (required && (!value || inputValue && !value)) {
            setValidationTriggered(true);
            setOpen(false); // Prevent dropdown from opening when validation fails
        } else {
            setValidationTriggered(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "autocomplete-container",
        ref: containerRef,
        "data-test-id": props["data-test-id"] || "auto-complete-root",
        "data-has-options": options.length > 0 ? "true" : "false",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative w-full border border-border rounded-md focus-within:border-primary",
                onFocus: ()=>{
                    setFocused(true);
                    setOpen(true);
                    setIsNavigating(false);
                },
                onBlur: ()=>{
                    setFocused(false);
                    handleValidation();
                    if (!isNavigating) {
                        setTimeout(()=>setOpen(false), 150);
                    }
                    setHighlightedIndex(-1);
                },
                tabIndex: -1,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$shared$2f$components$2f$ui$2f$TextField$2f$TextField$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextField"], {
                        label: label || "",
                        labelAlwaysVisible: labelAlwaysVisible,
                        value: inputValue,
                        onChange: (e)=>{
                            const newValue = e.target.value;
                            setInputValue(newValue);
                            onInputChange?.(newValue);
                            setOpen(true);
                            setHighlightedIndex(-1);
                        },
                        onKeyDown: handleKeyDown,
                        placeholder: placeholder,
                        name: name,
                        required: required,
                        "data-test-id": "auto-complete-input",
                        className: compact ? 'pr-14' : 'pr-20',
                        compact: compact,
                        variante: "autocomplete",
                        disabled: disabled
                    }, void 0, false, {
                        fileName: "[project]/paddy/cargo/src/shared/components/ui/AutoComplete/AutoComplete.tsx",
                        lineNumber: 223,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    value && !disabled && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$shared$2f$components$2f$ui$2f$IconButton$2f$IconButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        icon: "close_small",
                        variant: "text",
                        size: compact ? 'xs' : 'md',
                        className: `absolute right-10 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center z-20 ${focused ? 'text-primary' : 'text-secondary'}`,
                        onClick: handleClear,
                        "aria-label": "Limpiar selección",
                        "data-test-id": "auto-complete-clear-icon",
                        tabIndex: -1
                    }, void 0, false, {
                        fileName: "[project]/paddy/cargo/src/shared/components/ui/AutoComplete/AutoComplete.tsx",
                        lineNumber: 246,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    !disabled && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$shared$2f$components$2f$ui$2f$IconButton$2f$IconButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        icon: "arrow_drop_down",
                        variant: "text",
                        size: compact ? 'xs' : 'md',
                        className: `absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center z-20 ${focused ? 'text-primary' : 'text-secondary'}`,
                        tabIndex: -1,
                        "aria-label": "Desplegar opciones",
                        onClick: ()=>{
                            if (!open) setOpen(true);
                        // Focus will be handled by the wrapper div
                        },
                        "data-test-id": "auto-complete-dropdown-icon"
                    }, void 0, false, {
                        fileName: "[project]/paddy/cargo/src/shared/components/ui/AutoComplete/AutoComplete.tsx",
                        lineNumber: 259,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/paddy/cargo/src/shared/components/ui/AutoComplete/AutoComplete.tsx",
                lineNumber: 210,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$shared$2f$components$2f$ui$2f$DropdownList$2f$DropdownList$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                open: open && filteredOptions.length > 0,
                testId: "auto-complete-list",
                highlightedIndex: highlightedIndex,
                onHoverChange: (idx)=>{
                // DropdownList now handles hover, we just track it if needed
                },
                usePortal: true,
                anchorRef: containerRef,
                children: filteredOptions.map((opt, idx)=>{
                    const optValue = getValue(opt);
                    const isHighlighted = highlightedIndex === idx;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        ref: (el)=>{
                            if (el) itemRefs.set(optValue, el);
                            else itemRefs.delete(optValue);
                        },
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$shared$2f$components$2f$ui$2f$DropdownList$2f$DropdownList$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dropdownOptionClass"],
                        onMouseDown: ()=>handleSelect(opt),
                        onMouseEnter: ()=>{
                            setHighlightedIndex(idx);
                        },
                        onClick: ()=>handleSelect(opt),
                        role: "option",
                        "aria-selected": isHighlighted,
                        "data-test-id": `auto-complete-option-${optValue}`,
                        children: getLabel(opt)
                    }, optValue, false, {
                        fileName: "[project]/paddy/cargo/src/shared/components/ui/AutoComplete/AutoComplete.tsx",
                        lineNumber: 288,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0));
                })
            }, void 0, false, {
                fileName: "[project]/paddy/cargo/src/shared/components/ui/AutoComplete/AutoComplete.tsx",
                lineNumber: 274,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/paddy/cargo/src/shared/components/ui/AutoComplete/AutoComplete.tsx",
        lineNumber: 209,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(AutoComplete, "3TLqUzccZz8wHFIXrqWyU+I17UA=");
_c = AutoComplete;
const __TURBOPACK__default__export__ = AutoComplete;
var _c;
__turbopack_context__.k.register(_c, "AutoComplete");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/paddy/cargo/src/actions/data:a7e884 [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fetchProducersAction",
    ()=>$$RSC_SERVER_ACTION_0
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
/* __next_internal_action_entry_do_not_use__ [{"403780f9f3cbf4ac7c6190415e81ad5b3abe649d0d":"fetchProducersAction"},"paddy/cargo/src/actions/fetchProducersAction.ts",""] */ "use turbopack no side effects";
;
const $$RSC_SERVER_ACTION_0 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("403780f9f3cbf4ac7c6190415e81ad5b3abe649d0d", __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "fetchProducersAction");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
 //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vZmV0Y2hQcm9kdWNlcnNBY3Rpb24udHMiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzZXJ2ZXInO1xuXG5pbXBvcnQgeyBnZXRTZXJ2ZXJTZXNzaW9uIH0gZnJvbSAnbmV4dC1hdXRoJztcbmltcG9ydCB7IGF1dGhPcHRpb25zIH0gZnJvbSAnQC9saWIvYXV0aC5jb25maWcnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFByb2R1Y2VyT3B0aW9uIHtcbiAgaWQ6IG51bWJlcjtcbiAgbmFtZTogc3RyaW5nO1xuICBydXQ6IHN0cmluZztcbiAgZW1haWw/OiBzdHJpbmc7XG4gIGNpdHk/OiBzdHJpbmc7XG59XG5cbmludGVyZmFjZSBGZXRjaFByb2R1Y2Vyc1BhcmFtcyB7XG4gIHBhZ2U/OiBudW1iZXI7XG4gIGxpbWl0PzogbnVtYmVyO1xuICBzZWFyY2g/OiBzdHJpbmc7XG4gIHNvcnRGaWVsZD86IHN0cmluZztcbiAgc29ydD86ICdBU0MnIHwgJ0RFU0MnO1xufVxuXG5pbnRlcmZhY2UgRmV0Y2hQcm9kdWNlcnNSZXN1bHQge1xuICBkYXRhOiBQcm9kdWNlck9wdGlvbltdO1xuICB0b3RhbDogbnVtYmVyO1xuICBwYWdlOiBudW1iZXI7XG4gIGxpbWl0OiBudW1iZXI7XG59XG5cbi8qKlxuICogU2VydmVyIGFjdGlvbiBwYXJhIGNhcmdhciBwcm9kdWN0b3JlcyBkZXNkZSBlbCBiYWNrZW5kXG4gKiBTaW1pbGFyIGEgZmV0Y2hQcm9kdWNlcnNBY3Rpb24gZGVsIGZyb250ZW5kIHByaW5jaXBhbFxuICogVXRpbGl6YSBOZXh0QXV0aCBwYXJhIG9idGVuZXIgZWwgdG9rZW4gZGVsIHNlcnZpZG9yXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmZXRjaFByb2R1Y2Vyc0FjdGlvbihcbiAgcGFyYW1zPzogRmV0Y2hQcm9kdWNlcnNQYXJhbXMsXG4pOiBQcm9taXNlPEZldGNoUHJvZHVjZXJzUmVzdWx0PiB7XG4gIHRyeSB7XG4gICAgLy8gT2J0ZW5lciBsYSBzZXNpw7NuIGRlbCBzZXJ2aWRvciB1c2FuZG8gTmV4dEF1dGhcbiAgICBjb25zdCBzZXNzaW9uID0gYXdhaXQgZ2V0U2VydmVyU2Vzc2lvbihhdXRoT3B0aW9ucyk7XG4gICAgXG4gICAgaWYgKCFzZXNzaW9uPy51c2VyPy5hY2Nlc3NUb2tlbikge1xuICAgICAgY29uc29sZS53YXJuKCdObyBhY2Nlc3MgdG9rZW4gYXZhaWxhYmxlIGluIHNlcnZlciBzZXNzaW9uJyk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBkYXRhOiBbXSxcbiAgICAgICAgdG90YWw6IDAsXG4gICAgICAgIHBhZ2U6IDEsXG4gICAgICAgIGxpbWl0OiA1MDAwLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICBjb25zdCBBUElfQkFTRV9VUkwgPSBgJHtwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19BUElfVVJMfS9wcm9kdWNlcnNgO1xuXG4gICAgY29uc3QgaGVhZGVyczogSGVhZGVyc0luaXQgPSB7XG4gICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgJ0F1dGhvcml6YXRpb24nOiBgQmVhcmVyICR7c2Vzc2lvbi51c2VyLmFjY2Vzc1Rva2VufWAsXG4gICAgfTtcblxuICAgIC8vIEZldGNoIGRlc2RlIGVsIGJhY2tlbmRcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKEFQSV9CQVNFX1VSTCwge1xuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIGhlYWRlcnMsXG4gICAgICBjYWNoZTogJ25vLXN0b3JlJyxcbiAgICB9KTtcblxuICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgSFRUUCAke3Jlc3BvbnNlLnN0YXR1c306ICR7cmVzcG9uc2Uuc3RhdHVzVGV4dH1gKTtcbiAgICB9XG5cbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG5cbiAgICAvLyBOb3JtYWxpemFyIGRhdG9zXG4gICAgY29uc3Qgbm9ybWFsaXplZERhdGEgPSAocmVzdWx0LmRhdGEgfHwgcmVzdWx0IHx8IFtdKS5tYXAoKHByb2R1Y2VyOiBhbnkpID0+ICh7XG4gICAgICBpZDogcHJvZHVjZXIuaWQsXG4gICAgICBuYW1lOiBwcm9kdWNlci5uYW1lIHx8ICcnLFxuICAgICAgcnV0OiBwcm9kdWNlci5ydXQgfHwgJycsXG4gICAgICBlbWFpbDogcHJvZHVjZXIuZW1haWwsXG4gICAgICBjaXR5OiBwcm9kdWNlci5jaXR5LFxuICAgIH0pKTtcblxuICAgIC8vIEZpbHRyYWRvIGVuIGNsaWVudGVcbiAgICBsZXQgZmlsdGVyZWQgPSBub3JtYWxpemVkRGF0YTtcblxuICAgIGlmIChwYXJhbXM/LnNlYXJjaCkge1xuICAgICAgY29uc3Qgc2VhcmNoTG93ZXIgPSBwYXJhbXMuc2VhcmNoLnRvTG93ZXJDYXNlKCk7XG4gICAgICBmaWx0ZXJlZCA9IGZpbHRlcmVkLmZpbHRlcigocDogUHJvZHVjZXJPcHRpb24pID0+XG4gICAgICAgIHAubmFtZS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHNlYXJjaExvd2VyKSB8fFxuICAgICAgICBwLnJ1dC50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHNlYXJjaExvd2VyKSB8fFxuICAgICAgICBwLmVtYWlsPy50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHNlYXJjaExvd2VyKSB8fFxuICAgICAgICBwLmNpdHk/LnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoc2VhcmNoTG93ZXIpXG4gICAgICApO1xuICAgIH1cblxuICAgIC8vIE9yZGVuYW1pZW50byAocG9yIGRlZmVjdG86IG5vbWJyZSBhc2NlbmRlbnRlLCBwYXJhIGF1dG9jb21wbGV0YWRvIGVuIGLDoXNjdWxhKVxuICAgIGlmIChwYXJhbXM/LnNvcnRGaWVsZCkge1xuICAgICAgY29uc3QgZmllbGQgPSBwYXJhbXMuc29ydEZpZWxkIGFzIGtleW9mIFByb2R1Y2VyT3B0aW9uO1xuICAgICAgY29uc3QgaXNBc2MgPSBwYXJhbXMuc29ydCA9PT0gJ0FTQyc7XG4gICAgICBmaWx0ZXJlZC5zb3J0KChhOiBQcm9kdWNlck9wdGlvbiwgYjogUHJvZHVjZXJPcHRpb24pID0+IHtcbiAgICAgICAgY29uc3QgYVZhbCA9IGFbZmllbGRdIHx8ICcnO1xuICAgICAgICBjb25zdCBiVmFsID0gYltmaWVsZF0gfHwgJyc7XG4gICAgICAgIGNvbnN0IGNvbXBhcmlzb24gPSBTdHJpbmcoYVZhbCkubG9jYWxlQ29tcGFyZShTdHJpbmcoYlZhbCksICdlcycpO1xuICAgICAgICByZXR1cm4gaXNBc2MgPyBjb21wYXJpc29uIDogLWNvbXBhcmlzb247XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgZmlsdGVyZWQuc29ydCgoYTogUHJvZHVjZXJPcHRpb24sIGI6IFByb2R1Y2VyT3B0aW9uKSA9PlxuICAgICAgICBhLm5hbWUubG9jYWxlQ29tcGFyZShiLm5hbWUsICdlcycsIHsgc2Vuc2l0aXZpdHk6ICdiYXNlJyB9KSxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gUGFnaW5hY2nDs24gKGzDrW1pdGUgYWx0byBwb3IgZGVmZWN0byBwYXJhIGNhcmdhciBjYXTDoWxvZ28gY29tcGxldG8gZW4gVE1TKVxuICAgIGNvbnN0IHBhZ2UgPSBwYXJhbXM/LnBhZ2UgfHwgMTtcbiAgICBjb25zdCBsaW1pdCA9IHBhcmFtcz8ubGltaXQgPz8gNTAwMDtcbiAgICBjb25zdCBzdGFydCA9IChwYWdlIC0gMSkgKiBsaW1pdDtcbiAgICBjb25zdCBwYWdpbmF0ZWREYXRhID0gZmlsdGVyZWQuc2xpY2Uoc3RhcnQsIHN0YXJ0ICsgbGltaXQpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGRhdGE6IHBhZ2luYXRlZERhdGEsXG4gICAgICB0b3RhbDogZmlsdGVyZWQubGVuZ3RoLFxuICAgICAgcGFnZSxcbiAgICAgIGxpbWl0LFxuICAgIH07XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcignRXJyb3IgZW4gZmV0Y2hQcm9kdWNlcnNBY3Rpb246JywgZXJyb3IpO1xuICAgIHJldHVybiB7XG4gICAgICBkYXRhOiBbXSxcbiAgICAgIHRvdGFsOiAwLFxuICAgICAgcGFnZTogMSxcbiAgICAgIGxpbWl0OiA1MDAwLFxuICAgIH07XG4gIH1cbn1cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoid1RBaUNzQixpTUFBQSJ9
}),
"[project]/paddy/cargo/src/actions/data:f40ce5 [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createTruckDispatchWithTareAction",
    ()=>$$RSC_SERVER_ACTION_1
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
/* __next_internal_action_entry_do_not_use__ [{"40066322b36835c0bbffebf9cb55530e9049b126e0":"createTruckDispatchWithTareAction"},"paddy/cargo/src/actions/truckDispatchActions.ts",""] */ "use turbopack no side effects";
;
const $$RSC_SERVER_ACTION_1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("40066322b36835c0bbffebf9cb55530e9049b126e0", __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "createTruckDispatchWithTareAction");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
 //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vdHJ1Y2tEaXNwYXRjaEFjdGlvbnMudHMiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzZXJ2ZXInO1xuXG5pbXBvcnQgeyBnZXRTZXJ2ZXJTZXNzaW9uIH0gZnJvbSAnbmV4dC1hdXRoJztcbmltcG9ydCB7IGF1dGhPcHRpb25zIH0gZnJvbSAnQC9saWIvYXV0aC5jb25maWcnO1xuaW1wb3J0IHR5cGUgeyBMb2dpc3RpY3NQcm9kdWN0Q29kZSB9IGZyb20gJ0AvbGliL2xvZ2lzdGljc1Byb2R1Y3QnO1xuXG5jb25zdCBBUElfVVJMID0gcHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfQVBJX1VSTCB8fCAnaHR0cDovL2xvY2FsaG9zdDozMDAwL2FwaS92MSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgVHJ1Y2tEaXNwYXRjaFByb2R1Y2VyUmVmIHtcbiAgaWQ/OiBudW1iZXI7XG4gIHJ1dDogc3RyaW5nO1xuICBuYW1lOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgVHJ1Y2tEaXNwYXRjaCB7XG4gIGlkOiBudW1iZXI7XG4gIG51bWVyb190dXJubzogbnVtYmVyIHwgbnVsbDtcbiAgc3RhdHVzOiAnRVNQRVJBJyB8ICdGSU5JU0hFRCc7XG4gIHByb2R1Y2VyX2lkOiBudW1iZXI7XG4gIHByb2R1Y3Q/OiBMb2dpc3RpY3NQcm9kdWN0Q29kZTtcbiAgcHJvZHVjZXI/OiBUcnVja0Rpc3BhdGNoUHJvZHVjZXJSZWY7XG4gIGxpY2Vuc2VfcGxhdGU6IHN0cmluZztcbiAgZHJpdmVyX25hbWU/OiBzdHJpbmcgfCBudWxsO1xuICBjYXJyaWVyX2NvbXBhbnk/OiBzdHJpbmc7XG4gIGRpc3BhdGNoX2d1aWRlPzogc3RyaW5nO1xuICBncm9zc193ZWlnaHQ/OiBudW1iZXI7XG4gIHRhcmVfd2VpZ2h0PzogbnVtYmVyO1xuICBuZXRfd2VpZ2h0PzogbnVtYmVyO1xuICBlbnRyeV9hdDogRGF0ZTtcbiAgZmluaXNoZWRfYXQ/OiBEYXRlO1xuICBjcmVhdGVkX2J5Pzogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIENyZWF0ZVRydWNrRGlzcGF0Y2hXaXRoVGFyZVBheWxvYWQge1xuICBwcm9kdWNlcl9pZDogbnVtYmVyO1xuICBsaWNlbnNlX3BsYXRlOiBzdHJpbmc7XG4gIGRyaXZlcl9uYW1lPzogc3RyaW5nO1xuICBjYXJyaWVyX2NvbXBhbnk/OiBzdHJpbmc7XG4gIGRpc3BhdGNoX2d1aWRlPzogc3RyaW5nO1xuICB0YXJlX3dlaWdodDogbnVtYmVyO1xuICBwcm9kdWN0OiBMb2dpc3RpY3NQcm9kdWN0Q29kZTtcbiAgY3JlYXRlZF9ieT86IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBSZWdpc3RlckRpc3BhdGNoR3Jvc3NXZWlnaHRQYXlsb2FkIHtcbiAgdHJ1Y2tfZGlzcGF0Y2hfaWQ6IG51bWJlcjtcbiAgZ3Jvc3Nfd2VpZ2h0OiBudW1iZXI7XG4gIHN0YXR1cz86ICdGSU5JU0hFRCc7XG4gIGNyZWF0ZWRfYnk/OiBzdHJpbmc7XG59XG5cbmZ1bmN0aW9uIHBhcnNlRGlzcGF0Y2hGcm9tQXBpKHJhdzogUmVjb3JkPHN0cmluZywgdW5rbm93bj4pOiBUcnVja0Rpc3BhdGNoIHtcbiAgY29uc3QgcHJvZHVjZXIgPSByYXcucHJvZHVjZXIgYXMgVHJ1Y2tEaXNwYXRjaFByb2R1Y2VyUmVmIHwgdW5kZWZpbmVkO1xuICBjb25zdCBzdCA9IFN0cmluZyhyYXcuc3RhdHVzID8/ICcnKS50cmltKCkudG9VcHBlckNhc2UoKTtcbiAgY29uc3Qgc3RhdHVzOiBUcnVja0Rpc3BhdGNoWydzdGF0dXMnXSA9IHN0ID09PSAnRklOSVNIRUQnID8gJ0ZJTklTSEVEJyA6ICdFU1BFUkEnO1xuICBjb25zdCBwcm9kdWN0ID0gcmF3LnByb2R1Y3QgIT0gbnVsbCA/IFN0cmluZyhyYXcucHJvZHVjdCkgOiB1bmRlZmluZWQ7XG4gIGNvbnN0IHAgPVxuICAgIHByb2R1Y3QgPT09ICdDQVNDQVJJTExBJyB8fCBwcm9kdWN0ID09PSAnQVJST1pfUEFERFknXG4gICAgICA/IChwcm9kdWN0IGFzIExvZ2lzdGljc1Byb2R1Y3RDb2RlKVxuICAgICAgOiB1bmRlZmluZWQ7XG5cbiAgcmV0dXJuIHtcbiAgICBpZDogTnVtYmVyKHJhdy5pZCksXG4gICAgbnVtZXJvX3R1cm5vOlxuICAgICAgcmF3Lm51bWVyb190dXJubyAhPSBudWxsICYmICFOdW1iZXIuaXNOYU4oTnVtYmVyKHJhdy5udW1lcm9fdHVybm8pKVxuICAgICAgICA/IE51bWJlcihyYXcubnVtZXJvX3R1cm5vKVxuICAgICAgICA6IG51bGwsXG4gICAgc3RhdHVzLFxuICAgIHByb2R1Y2VyX2lkOiBOdW1iZXIocmF3LnByb2R1Y2VyX2lkID8/IDApLFxuICAgIHByb2R1Y3Q6IHAsXG4gICAgcHJvZHVjZXIsXG4gICAgbGljZW5zZV9wbGF0ZTogU3RyaW5nKHJhdy5saWNlbnNlX3BsYXRlID8/ICcnKSxcbiAgICBkcml2ZXJfbmFtZTogcmF3LmRyaXZlcl9uYW1lICE9IG51bGwgPyBTdHJpbmcocmF3LmRyaXZlcl9uYW1lKSA6IG51bGwsXG4gICAgY2Fycmllcl9jb21wYW55OlxuICAgICAgcmF3LmNhcnJpZXJfY29tcGFueSAhPSBudWxsID8gU3RyaW5nKHJhdy5jYXJyaWVyX2NvbXBhbnkpIDogdW5kZWZpbmVkLFxuICAgIGRpc3BhdGNoX2d1aWRlOlxuICAgICAgcmF3LmRpc3BhdGNoX2d1aWRlICE9IG51bGwgPyBTdHJpbmcocmF3LmRpc3BhdGNoX2d1aWRlKSA6IHVuZGVmaW5lZCxcbiAgICBncm9zc193ZWlnaHQ6XG4gICAgICByYXcuZ3Jvc3Nfd2VpZ2h0ICE9IG51bGwgPyBOdW1iZXIocmF3Lmdyb3NzX3dlaWdodCkgOiB1bmRlZmluZWQsXG4gICAgdGFyZV93ZWlnaHQ6IHJhdy50YXJlX3dlaWdodCAhPSBudWxsID8gTnVtYmVyKHJhdy50YXJlX3dlaWdodCkgOiB1bmRlZmluZWQsXG4gICAgbmV0X3dlaWdodDogcmF3Lm5ldF93ZWlnaHQgIT0gbnVsbCA/IE51bWJlcihyYXcubmV0X3dlaWdodCkgOiB1bmRlZmluZWQsXG4gICAgZW50cnlfYXQ6IG5ldyBEYXRlKFN0cmluZyhyYXcuZW50cnlfYXQgPz8gRGF0ZS5ub3coKSkpLFxuICAgIGZpbmlzaGVkX2F0OiByYXcuZmluaXNoZWRfYXQgPyBuZXcgRGF0ZShTdHJpbmcocmF3LmZpbmlzaGVkX2F0KSkgOiB1bmRlZmluZWQsXG4gICAgY3JlYXRlZF9ieTogcmF3LmNyZWF0ZWRfYnkgIT0gbnVsbCA/IFN0cmluZyhyYXcuY3JlYXRlZF9ieSkgOiB1bmRlZmluZWQsXG4gIH07XG59XG5cbi8qKiBDb2xhIGRlIHBlc2FqZTogRVNQRVJBIGNvbiB0YXJhIHkgc2luIGJydXRvIChob3kpLiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldERpc3BhdGNoZXNXZWlnaGluZ1F1ZXVlVG9kYXlBY3Rpb24oKTogUHJvbWlzZTxcbiAgVHJ1Y2tEaXNwYXRjaFtdXG4+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBzZXNzaW9uID0gYXdhaXQgZ2V0U2VydmVyU2Vzc2lvbihhdXRoT3B0aW9ucyk7XG5cbiAgICBpZiAoIXNlc3Npb24/LnVzZXI/LmFjY2Vzc1Rva2VuKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgJHtBUElfVVJMfS9sb2dpc3RpY3MvdHVybm9zL2Rpc3BhdGNoZXMvdG9kYXlgLCB7XG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgIEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHtzZXNzaW9uLnVzZXIuYWNjZXNzVG9rZW59YCxcbiAgICAgIH0sXG4gICAgICBjYWNoZTogJ25vLXN0b3JlJyxcbiAgICB9KTtcblxuICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgY29uc3QgZGF0YUFycmF5ID0gKHJlc3VsdC5kYXRhIHx8IFtdKSBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPltdO1xuICAgIHJldHVybiBkYXRhQXJyYXkubWFwKHBhcnNlRGlzcGF0Y2hGcm9tQXBpKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdFcnJvciBvYnRlbmllbmRvIGNvbGEgZGVzcGFjaG86JywgZXJyb3IpO1xuICAgIHJldHVybiBbXTtcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlVHJ1Y2tEaXNwYXRjaFdpdGhUYXJlQWN0aW9uKFxuICBwYXlsb2FkOiBDcmVhdGVUcnVja0Rpc3BhdGNoV2l0aFRhcmVQYXlsb2FkLFxuKTogUHJvbWlzZTxUcnVja0Rpc3BhdGNoPiB7XG4gIGNvbnN0IHNlc3Npb24gPSBhd2FpdCBnZXRTZXJ2ZXJTZXNzaW9uKGF1dGhPcHRpb25zKTtcblxuICBpZiAoIXNlc3Npb24/LnVzZXI/LmFjY2Vzc1Rva2VuKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdObyBhdXRlbnRpY2FkbycpO1xuICB9XG5cbiAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgJHtBUElfVVJMfS9sb2dpc3RpY3MvdHJ1Y2stZGlzcGF0Y2hlcy93aXRoLXRhcmVgLCB7XG4gICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgaGVhZGVyczoge1xuICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgIEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHtzZXNzaW9uLnVzZXIuYWNjZXNzVG9rZW59YCxcbiAgICB9LFxuICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgIHByb2R1Y2VyX2lkOiBwYXlsb2FkLnByb2R1Y2VyX2lkLFxuICAgICAgbGljZW5zZV9wbGF0ZTogcGF5bG9hZC5saWNlbnNlX3BsYXRlLFxuICAgICAgZHJpdmVyX25hbWU6IHBheWxvYWQuZHJpdmVyX25hbWUsXG4gICAgICBjYXJyaWVyX2NvbXBhbnk6IHBheWxvYWQuY2Fycmllcl9jb21wYW55LFxuICAgICAgZGlzcGF0Y2hfZ3VpZGU6IHBheWxvYWQuZGlzcGF0Y2hfZ3VpZGUsXG4gICAgICB0YXJlX3dlaWdodDogcGF5bG9hZC50YXJlX3dlaWdodCxcbiAgICAgIHByb2R1Y3Q6IHBheWxvYWQucHJvZHVjdCxcbiAgICAgIGNyZWF0ZWRfYnk6IHBheWxvYWQuY3JlYXRlZF9ieSxcbiAgICB9KSxcbiAgfSk7XG5cbiAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgIGxldCBtc2cgPSBgSFRUUCAke3Jlc3BvbnNlLnN0YXR1c31gO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBlcnIgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICBpZiAodHlwZW9mIGVycj8ubWVzc2FnZSA9PT0gJ3N0cmluZycpIG1zZyA9IGVyci5tZXNzYWdlO1xuICAgICAgZWxzZSBpZiAoQXJyYXkuaXNBcnJheShlcnI/Lm1lc3NhZ2UpKSBtc2cgPSBlcnIubWVzc2FnZS5qb2luKCcuICcpO1xuICAgIH0gY2F0Y2gge1xuICAgICAgLyogaWdub3JlICovXG4gICAgfVxuICAgIHRocm93IG5ldyBFcnJvcihtc2cpO1xuICB9XG5cbiAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICByZXR1cm4gcGFyc2VEaXNwYXRjaEZyb21BcGkocmVzdWx0LmRhdGEgYXMgUmVjb3JkPHN0cmluZywgdW5rbm93bj4pO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVnaXN0ZXJEaXNwYXRjaEdyb3NzV2VpZ2h0QWN0aW9uKFxuICBwYXlsb2FkOiBSZWdpc3RlckRpc3BhdGNoR3Jvc3NXZWlnaHRQYXlsb2FkLFxuKTogUHJvbWlzZTxUcnVja0Rpc3BhdGNoPiB7XG4gIGNvbnN0IHNlc3Npb24gPSBhd2FpdCBnZXRTZXJ2ZXJTZXNzaW9uKGF1dGhPcHRpb25zKTtcblxuICBpZiAoIXNlc3Npb24/LnVzZXI/LmFjY2Vzc1Rva2VuKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdObyBhdXRlbnRpY2FkbycpO1xuICB9XG5cbiAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgJHtBUElfVVJMfS9sb2dpc3RpY3Mvd2VpZ2hpbmdzL2Rpc3BhdGNoLWdyb3NzYCwge1xuICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgIGhlYWRlcnM6IHtcbiAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7c2Vzc2lvbi51c2VyLmFjY2Vzc1Rva2VufWAsXG4gICAgfSxcbiAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICB0cnVja19kaXNwYXRjaF9pZDogcGF5bG9hZC50cnVja19kaXNwYXRjaF9pZCxcbiAgICAgIGdyb3NzX3dlaWdodDogcGF5bG9hZC5ncm9zc193ZWlnaHQsXG4gICAgICBzdGF0dXM6IHBheWxvYWQuc3RhdHVzID8/ICdGSU5JU0hFRCcsXG4gICAgICBjcmVhdGVkX2J5OiBwYXlsb2FkLmNyZWF0ZWRfYnksXG4gICAgfSksXG4gIH0pO1xuXG4gIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICBsZXQgbXNnID0gYEhUVFAgJHtyZXNwb25zZS5zdGF0dXN9YDtcbiAgICB0cnkge1xuICAgICAgY29uc3QgZXJyID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgaWYgKHR5cGVvZiBlcnI/Lm1lc3NhZ2UgPT09ICdzdHJpbmcnKSBtc2cgPSBlcnIubWVzc2FnZTtcbiAgICAgIGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoZXJyPy5tZXNzYWdlKSkgbXNnID0gZXJyLm1lc3NhZ2Uuam9pbignLiAnKTtcbiAgICB9IGNhdGNoIHtcbiAgICAgIC8qIGlnbm9yZSAqL1xuICAgIH1cbiAgICB0aHJvdyBuZXcgRXJyb3IobXNnKTtcbiAgfVxuXG4gIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgcmV0dXJuIHBhcnNlRGlzcGF0Y2hGcm9tQXBpKHJlc3VsdC5kYXRhIGFzIFJlY29yZDxzdHJpbmcsIHVua25vd24+KTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBVcGRhdGVUcnVja0Rpc3BhdGNoUGF5bG9hZCB7XG4gIHByb2R1Y2VyX2lkPzogbnVtYmVyO1xuICBsaWNlbnNlX3BsYXRlPzogc3RyaW5nO1xuICBkcml2ZXJfbmFtZT86IHN0cmluZyB8IG51bGw7XG4gIGNhcnJpZXJfY29tcGFueT86IHN0cmluZztcbiAgZGlzcGF0Y2hfZ3VpZGU/OiBzdHJpbmc7XG4gIGdyb3NzX3dlaWdodD86IG51bWJlcjtcbiAgdGFyZV93ZWlnaHQ/OiBudW1iZXI7XG4gIHByb2R1Y3Q/OiBMb2dpc3RpY3NQcm9kdWN0Q29kZTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFRydWNrRGlzcGF0Y2hCeUlkQWN0aW9uKGlkOiBudW1iZXIpOiBQcm9taXNlPFRydWNrRGlzcGF0Y2ggfCBudWxsPiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IGdldFNlcnZlclNlc3Npb24oYXV0aE9wdGlvbnMpO1xuXG4gICAgaWYgKCFzZXNzaW9uPy51c2VyPy5hY2Nlc3NUb2tlbikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBhdXRlbnRpY2FkbycpO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYCR7QVBJX1VSTH0vbG9naXN0aWNzL3RydWNrLWRpc3BhdGNoZXMvJHtpZH1gLCB7XG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgIEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHtzZXNzaW9uLnVzZXIuYWNjZXNzVG9rZW59YCxcbiAgICAgIH0sXG4gICAgICBjYWNoZTogJ25vLXN0b3JlJyxcbiAgICB9KTtcblxuICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICByZXR1cm4gcGFyc2VEaXNwYXRjaEZyb21BcGkocmVzdWx0LmRhdGEgYXMgUmVjb3JkPHN0cmluZywgdW5rbm93bj4pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIG9idGVuaWVuZG8gZGVzcGFjaG86JywgZXJyb3IpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGRhdGVUcnVja0Rpc3BhdGNoQWN0aW9uKFxuICBpZDogbnVtYmVyLFxuICBwYXlsb2FkOiBVcGRhdGVUcnVja0Rpc3BhdGNoUGF5bG9hZCxcbik6IFByb21pc2U8VHJ1Y2tEaXNwYXRjaD4ge1xuICBjb25zdCBzZXNzaW9uID0gYXdhaXQgZ2V0U2VydmVyU2Vzc2lvbihhdXRoT3B0aW9ucyk7XG5cbiAgaWYgKCFzZXNzaW9uPy51c2VyPy5hY2Nlc3NUb2tlbikge1xuICAgIHRocm93IG5ldyBFcnJvcignTm8gYXV0ZW50aWNhZG8nKTtcbiAgfVxuXG4gIGNvbnN0IGJvZHkgPSBPYmplY3QuZnJvbUVudHJpZXMoXG4gICAgT2JqZWN0LmVudHJpZXMocGF5bG9hZCkuZmlsdGVyKChbLCB2XSkgPT4gdiAhPT0gdW5kZWZpbmVkKSxcbiAgKTtcblxuICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAke0FQSV9VUkx9L2xvZ2lzdGljcy90cnVjay1kaXNwYXRjaGVzLyR7aWR9YCwge1xuICAgIG1ldGhvZDogJ1BVVCcsXG4gICAgaGVhZGVyczoge1xuICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgIEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHtzZXNzaW9uLnVzZXIuYWNjZXNzVG9rZW59YCxcbiAgICB9LFxuICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGJvZHkpLFxuICB9KTtcblxuICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgbGV0IG1zZyA9IGBIVFRQICR7cmVzcG9uc2Uuc3RhdHVzfWA7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGVyciA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgIGlmICh0eXBlb2YgZXJyPy5tZXNzYWdlID09PSAnc3RyaW5nJykgbXNnID0gZXJyLm1lc3NhZ2U7XG4gICAgICBlbHNlIGlmIChBcnJheS5pc0FycmF5KGVycj8ubWVzc2FnZSkpIG1zZyA9IGVyci5tZXNzYWdlLmpvaW4oJy4gJyk7XG4gICAgfSBjYXRjaCB7XG4gICAgICAvKiBpZ25vcmUgKi9cbiAgICB9XG4gICAgdGhyb3cgbmV3IEVycm9yKG1zZyk7XG4gIH1cblxuICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gIHJldHVybiBwYXJzZURpc3BhdGNoRnJvbUFwaShyZXN1bHQuZGF0YSBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPik7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkZWxldGVUcnVja0Rpc3BhdGNoQWN0aW9uKGlkOiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IGdldFNlcnZlclNlc3Npb24oYXV0aE9wdGlvbnMpO1xuXG4gIGlmICghc2Vzc2lvbj8udXNlcj8uYWNjZXNzVG9rZW4pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIGF1dGVudGljYWRvJyk7XG4gIH1cblxuICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAke0FQSV9VUkx9L2xvZ2lzdGljcy90cnVjay1kaXNwYXRjaGVzLyR7aWR9YCwge1xuICAgIG1ldGhvZDogJ0RFTEVURScsXG4gICAgaGVhZGVyczoge1xuICAgICAgQXV0aG9yaXphdGlvbjogYEJlYXJlciAke3Nlc3Npb24udXNlci5hY2Nlc3NUb2tlbn1gLFxuICAgIH0sXG4gIH0pO1xuXG4gIGNvbnN0IHJlc3BvbnNlUGF5bG9hZCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKS5jYXRjaCgoKSA9PiBudWxsKTtcblxuICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgY29uc3QgcmF3ID0gKHJlc3BvbnNlUGF5bG9hZCBhcyB7IG1lc3NhZ2U/OiB1bmtub3duIH0pPy5tZXNzYWdlO1xuICAgIGNvbnN0IG1zZyA9XG4gICAgICB0eXBlb2YgcmF3ID09PSAnc3RyaW5nJ1xuICAgICAgICA/IHJhd1xuICAgICAgICA6IEFycmF5LmlzQXJyYXkocmF3KVxuICAgICAgICAgID8gcmF3LmpvaW4oJy4gJylcbiAgICAgICAgICA6IGBIVFRQICR7cmVzcG9uc2Uuc3RhdHVzfWA7XG4gICAgdGhyb3cgbmV3IEVycm9yKG1zZyk7XG4gIH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBUcnVja0Rpc3BhdGNoR3JpZFJvdyB7XG4gIGlkOiBudW1iZXI7XG4gIHN0YXR1czogc3RyaW5nO1xuICBwcm9kdWN0Pzogc3RyaW5nO1xuICBwcm9kdWNlcl9pZD86IG51bWJlcjtcbiAgbGljZW5zZV9wbGF0ZTogc3RyaW5nO1xuICBkcml2ZXJfbmFtZTogc3RyaW5nO1xuICBjYXJyaWVyX2NvbXBhbnk/OiBzdHJpbmcgfCBudWxsO1xuICBkaXNwYXRjaF9ndWlkZT86IHN0cmluZyB8IG51bGw7XG4gIGdyb3NzX3dlaWdodDogc3RyaW5nIHwgbnVtYmVyIHwgbnVsbDtcbiAgdGFyZV93ZWlnaHQ6IHN0cmluZyB8IG51bWJlciB8IG51bGw7XG4gIG5ldF93ZWlnaHQ6IHN0cmluZyB8IG51bWJlciB8IG51bGw7XG4gIGVudHJ5X2F0OiBzdHJpbmc7XG4gIGZpbmlzaGVkX2F0Pzogc3RyaW5nIHwgbnVsbDtcbiAgcHJvZHVjZXJfbmFtZTogc3RyaW5nO1xuICBwcm9kdWNlcl9ydXQ6IHN0cmluZztcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFRydWNrRGlzcGF0Y2hlc0dyaWRBY3Rpb24ocGFyYW1zOiB7XG4gIGxpbWl0PzogbnVtYmVyO1xuICBvZmZzZXQ/OiBudW1iZXI7XG4gIHNlYXJjaD86IHN0cmluZztcbiAgZmlsdGVycz86IHN0cmluZztcbiAgc29ydD86IHN0cmluZztcbiAgc29ydEZpZWxkPzogc3RyaW5nO1xufSk6IFByb21pc2U8eyByb3dzOiBUcnVja0Rpc3BhdGNoR3JpZFJvd1tdOyB0b3RhbDogbnVtYmVyIH0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBzZXNzaW9uID0gYXdhaXQgZ2V0U2VydmVyU2Vzc2lvbihhdXRoT3B0aW9ucyk7XG5cbiAgICBpZiAoIXNlc3Npb24/LnVzZXI/LmFjY2Vzc1Rva2VuKSB7XG4gICAgICByZXR1cm4geyByb3dzOiBbXSwgdG90YWw6IDAgfTtcbiAgICB9XG5cbiAgICBjb25zdCBsaW1pdCA9IE1hdGgubWluKE1hdGgubWF4KHBhcmFtcy5saW1pdCA/PyAyNSwgMSksIDUwMCk7XG4gICAgY29uc3Qgb2Zmc2V0ID0gTWF0aC5tYXgocGFyYW1zLm9mZnNldCA/PyAwLCAwKTtcblxuICAgIGNvbnN0IHFzID0gbmV3IFVSTFNlYXJjaFBhcmFtcygpO1xuICAgIHFzLnNldCgnbGltaXQnLCBTdHJpbmcobGltaXQpKTtcbiAgICBxcy5zZXQoJ29mZnNldCcsIFN0cmluZyhvZmZzZXQpKTtcbiAgICBpZiAocGFyYW1zLnNlYXJjaD8udHJpbSgpKSB7XG4gICAgICBxcy5zZXQoJ3NlYXJjaCcsIHBhcmFtcy5zZWFyY2gudHJpbSgpKTtcbiAgICB9XG4gICAgaWYgKHBhcmFtcy5maWx0ZXJzPy50cmltKCkpIHtcbiAgICAgIHFzLnNldCgnZmlsdGVycycsIHBhcmFtcy5maWx0ZXJzLnRyaW0oKSk7XG4gICAgfVxuICAgIGlmIChwYXJhbXMuc29ydD8udHJpbSgpKSB7XG4gICAgICBxcy5zZXQoJ3NvcnQnLCBwYXJhbXMuc29ydC50cmltKCkpO1xuICAgIH1cbiAgICBpZiAocGFyYW1zLnNvcnRGaWVsZD8udHJpbSgpKSB7XG4gICAgICBxcy5zZXQoJ3NvcnRGaWVsZCcsIHBhcmFtcy5zb3J0RmllbGQudHJpbSgpKTtcbiAgICB9XG5cbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFxuICAgICAgYCR7QVBJX1VSTH0vbG9naXN0aWNzL3RydWNrLWRpc3BhdGNoZXMvZ3JpZD8ke3FzLnRvU3RyaW5nKCl9YCxcbiAgICAgIHtcbiAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgIEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHtzZXNzaW9uLnVzZXIuYWNjZXNzVG9rZW59YCxcbiAgICAgICAgfSxcbiAgICAgICAgY2FjaGU6ICduby1zdG9yZScsXG4gICAgICB9LFxuICAgICk7XG5cbiAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICByZXR1cm4geyByb3dzOiBbXSwgdG90YWw6IDAgfTtcbiAgICB9XG5cbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgY29uc3QgcGF5bG9hZCA9IHJlc3VsdC5kYXRhIGFzIHsgZGF0YTogdW5rbm93bltdOyB0b3RhbDogbnVtYmVyIH0gfCB1bmRlZmluZWQ7XG4gICAgY29uc3QgcmF3ID0gKHBheWxvYWQ/LmRhdGEgPz8gW10pIGFzIFJlY29yZDxzdHJpbmcsIHVua25vd24+W107XG4gICAgY29uc3QgdG90YWwgPSB0eXBlb2YgcGF5bG9hZD8udG90YWwgPT09ICdudW1iZXInID8gcGF5bG9hZC50b3RhbCA6IHJhdy5sZW5ndGg7XG5cbiAgICBjb25zdCByb3dzOiBUcnVja0Rpc3BhdGNoR3JpZFJvd1tdID0gcmF3Lm1hcCgocikgPT4ge1xuICAgICAgY29uc3QgcHJvZHVjZXIgPSByLnByb2R1Y2VyIGFzIHsgbmFtZT86IHN0cmluZzsgcnV0Pzogc3RyaW5nIH0gfCB1bmRlZmluZWQ7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBpZDogTnVtYmVyKHIuaWQpLFxuICAgICAgICBzdGF0dXM6IFN0cmluZyhyLnN0YXR1cyA/PyAnJyksXG4gICAgICAgIHByb2R1Y3Q6IHIucHJvZHVjdCAhPSBudWxsID8gU3RyaW5nKHIucHJvZHVjdCkgOiB1bmRlZmluZWQsXG4gICAgICAgIHByb2R1Y2VyX2lkOlxuICAgICAgICAgIHIucHJvZHVjZXJfaWQgIT0gbnVsbCA/IE51bWJlcihyLnByb2R1Y2VyX2lkKSA6IHVuZGVmaW5lZCxcbiAgICAgICAgbGljZW5zZV9wbGF0ZTogU3RyaW5nKHIubGljZW5zZV9wbGF0ZSA/PyAnJyksXG4gICAgICAgIGRyaXZlcl9uYW1lOiBTdHJpbmcoci5kcml2ZXJfbmFtZSA/PyAnJyksXG4gICAgICAgIGNhcnJpZXJfY29tcGFueTpcbiAgICAgICAgICByLmNhcnJpZXJfY29tcGFueSAhPSBudWxsID8gU3RyaW5nKHIuY2Fycmllcl9jb21wYW55KSA6IG51bGwsXG4gICAgICAgIGRpc3BhdGNoX2d1aWRlOlxuICAgICAgICAgIHIuZGlzcGF0Y2hfZ3VpZGUgIT0gbnVsbCA/IFN0cmluZyhyLmRpc3BhdGNoX2d1aWRlKSA6IG51bGwsXG4gICAgICAgIGdyb3NzX3dlaWdodDogci5ncm9zc193ZWlnaHQgYXMgc3RyaW5nIHwgbnVtYmVyIHwgbnVsbCxcbiAgICAgICAgdGFyZV93ZWlnaHQ6IHIudGFyZV93ZWlnaHQgYXMgc3RyaW5nIHwgbnVtYmVyIHwgbnVsbCxcbiAgICAgICAgbmV0X3dlaWdodDogci5uZXRfd2VpZ2h0IGFzIHN0cmluZyB8IG51bWJlciB8IG51bGwsXG4gICAgICAgIGVudHJ5X2F0OiBTdHJpbmcoci5lbnRyeV9hdCA/PyAnJyksXG4gICAgICAgIGZpbmlzaGVkX2F0OiByLmZpbmlzaGVkX2F0ICE9IG51bGwgPyBTdHJpbmcoci5maW5pc2hlZF9hdCkgOiBudWxsLFxuICAgICAgICBwcm9kdWNlcl9uYW1lOiBwcm9kdWNlcj8ubmFtZSA/PyAnJyxcbiAgICAgICAgcHJvZHVjZXJfcnV0OiBwcm9kdWNlcj8ucnV0ID8/ICcnLFxuICAgICAgfTtcbiAgICB9KTtcblxuICAgIHJldHVybiB7IHJvd3MsIHRvdGFsIH07XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcignRXJyb3IgZ3JpZCBkZXNwYWNob3M6JywgZXJyb3IpO1xuICAgIHJldHVybiB7IHJvd3M6IFtdLCB0b3RhbDogMCB9O1xuICB9XG59XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6InFVQXNIc0IsOE1BQUEifQ==
}),
"[project]/paddy/cargo/src/actions/data:ad9331 [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "registerDispatchGrossWeightAction",
    ()=>$$RSC_SERVER_ACTION_2
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
/* __next_internal_action_entry_do_not_use__ [{"40baef2a9abe8f6f058d6c9010b4f2bd203b4b3ba2":"registerDispatchGrossWeightAction"},"paddy/cargo/src/actions/truckDispatchActions.ts",""] */ "use turbopack no side effects";
;
const $$RSC_SERVER_ACTION_2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("40baef2a9abe8f6f058d6c9010b4f2bd203b4b3ba2", __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "registerDispatchGrossWeightAction");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
 //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vdHJ1Y2tEaXNwYXRjaEFjdGlvbnMudHMiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzZXJ2ZXInO1xuXG5pbXBvcnQgeyBnZXRTZXJ2ZXJTZXNzaW9uIH0gZnJvbSAnbmV4dC1hdXRoJztcbmltcG9ydCB7IGF1dGhPcHRpb25zIH0gZnJvbSAnQC9saWIvYXV0aC5jb25maWcnO1xuaW1wb3J0IHR5cGUgeyBMb2dpc3RpY3NQcm9kdWN0Q29kZSB9IGZyb20gJ0AvbGliL2xvZ2lzdGljc1Byb2R1Y3QnO1xuXG5jb25zdCBBUElfVVJMID0gcHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfQVBJX1VSTCB8fCAnaHR0cDovL2xvY2FsaG9zdDozMDAwL2FwaS92MSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgVHJ1Y2tEaXNwYXRjaFByb2R1Y2VyUmVmIHtcbiAgaWQ/OiBudW1iZXI7XG4gIHJ1dDogc3RyaW5nO1xuICBuYW1lOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgVHJ1Y2tEaXNwYXRjaCB7XG4gIGlkOiBudW1iZXI7XG4gIG51bWVyb190dXJubzogbnVtYmVyIHwgbnVsbDtcbiAgc3RhdHVzOiAnRVNQRVJBJyB8ICdGSU5JU0hFRCc7XG4gIHByb2R1Y2VyX2lkOiBudW1iZXI7XG4gIHByb2R1Y3Q/OiBMb2dpc3RpY3NQcm9kdWN0Q29kZTtcbiAgcHJvZHVjZXI/OiBUcnVja0Rpc3BhdGNoUHJvZHVjZXJSZWY7XG4gIGxpY2Vuc2VfcGxhdGU6IHN0cmluZztcbiAgZHJpdmVyX25hbWU/OiBzdHJpbmcgfCBudWxsO1xuICBjYXJyaWVyX2NvbXBhbnk/OiBzdHJpbmc7XG4gIGRpc3BhdGNoX2d1aWRlPzogc3RyaW5nO1xuICBncm9zc193ZWlnaHQ/OiBudW1iZXI7XG4gIHRhcmVfd2VpZ2h0PzogbnVtYmVyO1xuICBuZXRfd2VpZ2h0PzogbnVtYmVyO1xuICBlbnRyeV9hdDogRGF0ZTtcbiAgZmluaXNoZWRfYXQ/OiBEYXRlO1xuICBjcmVhdGVkX2J5Pzogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIENyZWF0ZVRydWNrRGlzcGF0Y2hXaXRoVGFyZVBheWxvYWQge1xuICBwcm9kdWNlcl9pZDogbnVtYmVyO1xuICBsaWNlbnNlX3BsYXRlOiBzdHJpbmc7XG4gIGRyaXZlcl9uYW1lPzogc3RyaW5nO1xuICBjYXJyaWVyX2NvbXBhbnk/OiBzdHJpbmc7XG4gIGRpc3BhdGNoX2d1aWRlPzogc3RyaW5nO1xuICB0YXJlX3dlaWdodDogbnVtYmVyO1xuICBwcm9kdWN0OiBMb2dpc3RpY3NQcm9kdWN0Q29kZTtcbiAgY3JlYXRlZF9ieT86IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBSZWdpc3RlckRpc3BhdGNoR3Jvc3NXZWlnaHRQYXlsb2FkIHtcbiAgdHJ1Y2tfZGlzcGF0Y2hfaWQ6IG51bWJlcjtcbiAgZ3Jvc3Nfd2VpZ2h0OiBudW1iZXI7XG4gIHN0YXR1cz86ICdGSU5JU0hFRCc7XG4gIGNyZWF0ZWRfYnk/OiBzdHJpbmc7XG59XG5cbmZ1bmN0aW9uIHBhcnNlRGlzcGF0Y2hGcm9tQXBpKHJhdzogUmVjb3JkPHN0cmluZywgdW5rbm93bj4pOiBUcnVja0Rpc3BhdGNoIHtcbiAgY29uc3QgcHJvZHVjZXIgPSByYXcucHJvZHVjZXIgYXMgVHJ1Y2tEaXNwYXRjaFByb2R1Y2VyUmVmIHwgdW5kZWZpbmVkO1xuICBjb25zdCBzdCA9IFN0cmluZyhyYXcuc3RhdHVzID8/ICcnKS50cmltKCkudG9VcHBlckNhc2UoKTtcbiAgY29uc3Qgc3RhdHVzOiBUcnVja0Rpc3BhdGNoWydzdGF0dXMnXSA9IHN0ID09PSAnRklOSVNIRUQnID8gJ0ZJTklTSEVEJyA6ICdFU1BFUkEnO1xuICBjb25zdCBwcm9kdWN0ID0gcmF3LnByb2R1Y3QgIT0gbnVsbCA/IFN0cmluZyhyYXcucHJvZHVjdCkgOiB1bmRlZmluZWQ7XG4gIGNvbnN0IHAgPVxuICAgIHByb2R1Y3QgPT09ICdDQVNDQVJJTExBJyB8fCBwcm9kdWN0ID09PSAnQVJST1pfUEFERFknXG4gICAgICA/IChwcm9kdWN0IGFzIExvZ2lzdGljc1Byb2R1Y3RDb2RlKVxuICAgICAgOiB1bmRlZmluZWQ7XG5cbiAgcmV0dXJuIHtcbiAgICBpZDogTnVtYmVyKHJhdy5pZCksXG4gICAgbnVtZXJvX3R1cm5vOlxuICAgICAgcmF3Lm51bWVyb190dXJubyAhPSBudWxsICYmICFOdW1iZXIuaXNOYU4oTnVtYmVyKHJhdy5udW1lcm9fdHVybm8pKVxuICAgICAgICA/IE51bWJlcihyYXcubnVtZXJvX3R1cm5vKVxuICAgICAgICA6IG51bGwsXG4gICAgc3RhdHVzLFxuICAgIHByb2R1Y2VyX2lkOiBOdW1iZXIocmF3LnByb2R1Y2VyX2lkID8/IDApLFxuICAgIHByb2R1Y3Q6IHAsXG4gICAgcHJvZHVjZXIsXG4gICAgbGljZW5zZV9wbGF0ZTogU3RyaW5nKHJhdy5saWNlbnNlX3BsYXRlID8/ICcnKSxcbiAgICBkcml2ZXJfbmFtZTogcmF3LmRyaXZlcl9uYW1lICE9IG51bGwgPyBTdHJpbmcocmF3LmRyaXZlcl9uYW1lKSA6IG51bGwsXG4gICAgY2Fycmllcl9jb21wYW55OlxuICAgICAgcmF3LmNhcnJpZXJfY29tcGFueSAhPSBudWxsID8gU3RyaW5nKHJhdy5jYXJyaWVyX2NvbXBhbnkpIDogdW5kZWZpbmVkLFxuICAgIGRpc3BhdGNoX2d1aWRlOlxuICAgICAgcmF3LmRpc3BhdGNoX2d1aWRlICE9IG51bGwgPyBTdHJpbmcocmF3LmRpc3BhdGNoX2d1aWRlKSA6IHVuZGVmaW5lZCxcbiAgICBncm9zc193ZWlnaHQ6XG4gICAgICByYXcuZ3Jvc3Nfd2VpZ2h0ICE9IG51bGwgPyBOdW1iZXIocmF3Lmdyb3NzX3dlaWdodCkgOiB1bmRlZmluZWQsXG4gICAgdGFyZV93ZWlnaHQ6IHJhdy50YXJlX3dlaWdodCAhPSBudWxsID8gTnVtYmVyKHJhdy50YXJlX3dlaWdodCkgOiB1bmRlZmluZWQsXG4gICAgbmV0X3dlaWdodDogcmF3Lm5ldF93ZWlnaHQgIT0gbnVsbCA/IE51bWJlcihyYXcubmV0X3dlaWdodCkgOiB1bmRlZmluZWQsXG4gICAgZW50cnlfYXQ6IG5ldyBEYXRlKFN0cmluZyhyYXcuZW50cnlfYXQgPz8gRGF0ZS5ub3coKSkpLFxuICAgIGZpbmlzaGVkX2F0OiByYXcuZmluaXNoZWRfYXQgPyBuZXcgRGF0ZShTdHJpbmcocmF3LmZpbmlzaGVkX2F0KSkgOiB1bmRlZmluZWQsXG4gICAgY3JlYXRlZF9ieTogcmF3LmNyZWF0ZWRfYnkgIT0gbnVsbCA/IFN0cmluZyhyYXcuY3JlYXRlZF9ieSkgOiB1bmRlZmluZWQsXG4gIH07XG59XG5cbi8qKiBDb2xhIGRlIHBlc2FqZTogRVNQRVJBIGNvbiB0YXJhIHkgc2luIGJydXRvIChob3kpLiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldERpc3BhdGNoZXNXZWlnaGluZ1F1ZXVlVG9kYXlBY3Rpb24oKTogUHJvbWlzZTxcbiAgVHJ1Y2tEaXNwYXRjaFtdXG4+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBzZXNzaW9uID0gYXdhaXQgZ2V0U2VydmVyU2Vzc2lvbihhdXRoT3B0aW9ucyk7XG5cbiAgICBpZiAoIXNlc3Npb24/LnVzZXI/LmFjY2Vzc1Rva2VuKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgJHtBUElfVVJMfS9sb2dpc3RpY3MvdHVybm9zL2Rpc3BhdGNoZXMvdG9kYXlgLCB7XG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgIEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHtzZXNzaW9uLnVzZXIuYWNjZXNzVG9rZW59YCxcbiAgICAgIH0sXG4gICAgICBjYWNoZTogJ25vLXN0b3JlJyxcbiAgICB9KTtcblxuICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgY29uc3QgZGF0YUFycmF5ID0gKHJlc3VsdC5kYXRhIHx8IFtdKSBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPltdO1xuICAgIHJldHVybiBkYXRhQXJyYXkubWFwKHBhcnNlRGlzcGF0Y2hGcm9tQXBpKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdFcnJvciBvYnRlbmllbmRvIGNvbGEgZGVzcGFjaG86JywgZXJyb3IpO1xuICAgIHJldHVybiBbXTtcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlVHJ1Y2tEaXNwYXRjaFdpdGhUYXJlQWN0aW9uKFxuICBwYXlsb2FkOiBDcmVhdGVUcnVja0Rpc3BhdGNoV2l0aFRhcmVQYXlsb2FkLFxuKTogUHJvbWlzZTxUcnVja0Rpc3BhdGNoPiB7XG4gIGNvbnN0IHNlc3Npb24gPSBhd2FpdCBnZXRTZXJ2ZXJTZXNzaW9uKGF1dGhPcHRpb25zKTtcblxuICBpZiAoIXNlc3Npb24/LnVzZXI/LmFjY2Vzc1Rva2VuKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdObyBhdXRlbnRpY2FkbycpO1xuICB9XG5cbiAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgJHtBUElfVVJMfS9sb2dpc3RpY3MvdHJ1Y2stZGlzcGF0Y2hlcy93aXRoLXRhcmVgLCB7XG4gICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgaGVhZGVyczoge1xuICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgIEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHtzZXNzaW9uLnVzZXIuYWNjZXNzVG9rZW59YCxcbiAgICB9LFxuICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgIHByb2R1Y2VyX2lkOiBwYXlsb2FkLnByb2R1Y2VyX2lkLFxuICAgICAgbGljZW5zZV9wbGF0ZTogcGF5bG9hZC5saWNlbnNlX3BsYXRlLFxuICAgICAgZHJpdmVyX25hbWU6IHBheWxvYWQuZHJpdmVyX25hbWUsXG4gICAgICBjYXJyaWVyX2NvbXBhbnk6IHBheWxvYWQuY2Fycmllcl9jb21wYW55LFxuICAgICAgZGlzcGF0Y2hfZ3VpZGU6IHBheWxvYWQuZGlzcGF0Y2hfZ3VpZGUsXG4gICAgICB0YXJlX3dlaWdodDogcGF5bG9hZC50YXJlX3dlaWdodCxcbiAgICAgIHByb2R1Y3Q6IHBheWxvYWQucHJvZHVjdCxcbiAgICAgIGNyZWF0ZWRfYnk6IHBheWxvYWQuY3JlYXRlZF9ieSxcbiAgICB9KSxcbiAgfSk7XG5cbiAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgIGxldCBtc2cgPSBgSFRUUCAke3Jlc3BvbnNlLnN0YXR1c31gO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBlcnIgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICBpZiAodHlwZW9mIGVycj8ubWVzc2FnZSA9PT0gJ3N0cmluZycpIG1zZyA9IGVyci5tZXNzYWdlO1xuICAgICAgZWxzZSBpZiAoQXJyYXkuaXNBcnJheShlcnI/Lm1lc3NhZ2UpKSBtc2cgPSBlcnIubWVzc2FnZS5qb2luKCcuICcpO1xuICAgIH0gY2F0Y2gge1xuICAgICAgLyogaWdub3JlICovXG4gICAgfVxuICAgIHRocm93IG5ldyBFcnJvcihtc2cpO1xuICB9XG5cbiAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICByZXR1cm4gcGFyc2VEaXNwYXRjaEZyb21BcGkocmVzdWx0LmRhdGEgYXMgUmVjb3JkPHN0cmluZywgdW5rbm93bj4pO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVnaXN0ZXJEaXNwYXRjaEdyb3NzV2VpZ2h0QWN0aW9uKFxuICBwYXlsb2FkOiBSZWdpc3RlckRpc3BhdGNoR3Jvc3NXZWlnaHRQYXlsb2FkLFxuKTogUHJvbWlzZTxUcnVja0Rpc3BhdGNoPiB7XG4gIGNvbnN0IHNlc3Npb24gPSBhd2FpdCBnZXRTZXJ2ZXJTZXNzaW9uKGF1dGhPcHRpb25zKTtcblxuICBpZiAoIXNlc3Npb24/LnVzZXI/LmFjY2Vzc1Rva2VuKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdObyBhdXRlbnRpY2FkbycpO1xuICB9XG5cbiAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgJHtBUElfVVJMfS9sb2dpc3RpY3Mvd2VpZ2hpbmdzL2Rpc3BhdGNoLWdyb3NzYCwge1xuICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgIGhlYWRlcnM6IHtcbiAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7c2Vzc2lvbi51c2VyLmFjY2Vzc1Rva2VufWAsXG4gICAgfSxcbiAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICB0cnVja19kaXNwYXRjaF9pZDogcGF5bG9hZC50cnVja19kaXNwYXRjaF9pZCxcbiAgICAgIGdyb3NzX3dlaWdodDogcGF5bG9hZC5ncm9zc193ZWlnaHQsXG4gICAgICBzdGF0dXM6IHBheWxvYWQuc3RhdHVzID8/ICdGSU5JU0hFRCcsXG4gICAgICBjcmVhdGVkX2J5OiBwYXlsb2FkLmNyZWF0ZWRfYnksXG4gICAgfSksXG4gIH0pO1xuXG4gIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICBsZXQgbXNnID0gYEhUVFAgJHtyZXNwb25zZS5zdGF0dXN9YDtcbiAgICB0cnkge1xuICAgICAgY29uc3QgZXJyID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgaWYgKHR5cGVvZiBlcnI/Lm1lc3NhZ2UgPT09ICdzdHJpbmcnKSBtc2cgPSBlcnIubWVzc2FnZTtcbiAgICAgIGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoZXJyPy5tZXNzYWdlKSkgbXNnID0gZXJyLm1lc3NhZ2Uuam9pbignLiAnKTtcbiAgICB9IGNhdGNoIHtcbiAgICAgIC8qIGlnbm9yZSAqL1xuICAgIH1cbiAgICB0aHJvdyBuZXcgRXJyb3IobXNnKTtcbiAgfVxuXG4gIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgcmV0dXJuIHBhcnNlRGlzcGF0Y2hGcm9tQXBpKHJlc3VsdC5kYXRhIGFzIFJlY29yZDxzdHJpbmcsIHVua25vd24+KTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBVcGRhdGVUcnVja0Rpc3BhdGNoUGF5bG9hZCB7XG4gIHByb2R1Y2VyX2lkPzogbnVtYmVyO1xuICBsaWNlbnNlX3BsYXRlPzogc3RyaW5nO1xuICBkcml2ZXJfbmFtZT86IHN0cmluZyB8IG51bGw7XG4gIGNhcnJpZXJfY29tcGFueT86IHN0cmluZztcbiAgZGlzcGF0Y2hfZ3VpZGU/OiBzdHJpbmc7XG4gIGdyb3NzX3dlaWdodD86IG51bWJlcjtcbiAgdGFyZV93ZWlnaHQ/OiBudW1iZXI7XG4gIHByb2R1Y3Q/OiBMb2dpc3RpY3NQcm9kdWN0Q29kZTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFRydWNrRGlzcGF0Y2hCeUlkQWN0aW9uKGlkOiBudW1iZXIpOiBQcm9taXNlPFRydWNrRGlzcGF0Y2ggfCBudWxsPiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IGdldFNlcnZlclNlc3Npb24oYXV0aE9wdGlvbnMpO1xuXG4gICAgaWYgKCFzZXNzaW9uPy51c2VyPy5hY2Nlc3NUb2tlbikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBhdXRlbnRpY2FkbycpO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYCR7QVBJX1VSTH0vbG9naXN0aWNzL3RydWNrLWRpc3BhdGNoZXMvJHtpZH1gLCB7XG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgIEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHtzZXNzaW9uLnVzZXIuYWNjZXNzVG9rZW59YCxcbiAgICAgIH0sXG4gICAgICBjYWNoZTogJ25vLXN0b3JlJyxcbiAgICB9KTtcblxuICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICByZXR1cm4gcGFyc2VEaXNwYXRjaEZyb21BcGkocmVzdWx0LmRhdGEgYXMgUmVjb3JkPHN0cmluZywgdW5rbm93bj4pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIG9idGVuaWVuZG8gZGVzcGFjaG86JywgZXJyb3IpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGRhdGVUcnVja0Rpc3BhdGNoQWN0aW9uKFxuICBpZDogbnVtYmVyLFxuICBwYXlsb2FkOiBVcGRhdGVUcnVja0Rpc3BhdGNoUGF5bG9hZCxcbik6IFByb21pc2U8VHJ1Y2tEaXNwYXRjaD4ge1xuICBjb25zdCBzZXNzaW9uID0gYXdhaXQgZ2V0U2VydmVyU2Vzc2lvbihhdXRoT3B0aW9ucyk7XG5cbiAgaWYgKCFzZXNzaW9uPy51c2VyPy5hY2Nlc3NUb2tlbikge1xuICAgIHRocm93IG5ldyBFcnJvcignTm8gYXV0ZW50aWNhZG8nKTtcbiAgfVxuXG4gIGNvbnN0IGJvZHkgPSBPYmplY3QuZnJvbUVudHJpZXMoXG4gICAgT2JqZWN0LmVudHJpZXMocGF5bG9hZCkuZmlsdGVyKChbLCB2XSkgPT4gdiAhPT0gdW5kZWZpbmVkKSxcbiAgKTtcblxuICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAke0FQSV9VUkx9L2xvZ2lzdGljcy90cnVjay1kaXNwYXRjaGVzLyR7aWR9YCwge1xuICAgIG1ldGhvZDogJ1BVVCcsXG4gICAgaGVhZGVyczoge1xuICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgIEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHtzZXNzaW9uLnVzZXIuYWNjZXNzVG9rZW59YCxcbiAgICB9LFxuICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGJvZHkpLFxuICB9KTtcblxuICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgbGV0IG1zZyA9IGBIVFRQICR7cmVzcG9uc2Uuc3RhdHVzfWA7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGVyciA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgIGlmICh0eXBlb2YgZXJyPy5tZXNzYWdlID09PSAnc3RyaW5nJykgbXNnID0gZXJyLm1lc3NhZ2U7XG4gICAgICBlbHNlIGlmIChBcnJheS5pc0FycmF5KGVycj8ubWVzc2FnZSkpIG1zZyA9IGVyci5tZXNzYWdlLmpvaW4oJy4gJyk7XG4gICAgfSBjYXRjaCB7XG4gICAgICAvKiBpZ25vcmUgKi9cbiAgICB9XG4gICAgdGhyb3cgbmV3IEVycm9yKG1zZyk7XG4gIH1cblxuICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gIHJldHVybiBwYXJzZURpc3BhdGNoRnJvbUFwaShyZXN1bHQuZGF0YSBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPik7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkZWxldGVUcnVja0Rpc3BhdGNoQWN0aW9uKGlkOiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IGdldFNlcnZlclNlc3Npb24oYXV0aE9wdGlvbnMpO1xuXG4gIGlmICghc2Vzc2lvbj8udXNlcj8uYWNjZXNzVG9rZW4pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIGF1dGVudGljYWRvJyk7XG4gIH1cblxuICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAke0FQSV9VUkx9L2xvZ2lzdGljcy90cnVjay1kaXNwYXRjaGVzLyR7aWR9YCwge1xuICAgIG1ldGhvZDogJ0RFTEVURScsXG4gICAgaGVhZGVyczoge1xuICAgICAgQXV0aG9yaXphdGlvbjogYEJlYXJlciAke3Nlc3Npb24udXNlci5hY2Nlc3NUb2tlbn1gLFxuICAgIH0sXG4gIH0pO1xuXG4gIGNvbnN0IHJlc3BvbnNlUGF5bG9hZCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKS5jYXRjaCgoKSA9PiBudWxsKTtcblxuICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgY29uc3QgcmF3ID0gKHJlc3BvbnNlUGF5bG9hZCBhcyB7IG1lc3NhZ2U/OiB1bmtub3duIH0pPy5tZXNzYWdlO1xuICAgIGNvbnN0IG1zZyA9XG4gICAgICB0eXBlb2YgcmF3ID09PSAnc3RyaW5nJ1xuICAgICAgICA/IHJhd1xuICAgICAgICA6IEFycmF5LmlzQXJyYXkocmF3KVxuICAgICAgICAgID8gcmF3LmpvaW4oJy4gJylcbiAgICAgICAgICA6IGBIVFRQICR7cmVzcG9uc2Uuc3RhdHVzfWA7XG4gICAgdGhyb3cgbmV3IEVycm9yKG1zZyk7XG4gIH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBUcnVja0Rpc3BhdGNoR3JpZFJvdyB7XG4gIGlkOiBudW1iZXI7XG4gIHN0YXR1czogc3RyaW5nO1xuICBwcm9kdWN0Pzogc3RyaW5nO1xuICBwcm9kdWNlcl9pZD86IG51bWJlcjtcbiAgbGljZW5zZV9wbGF0ZTogc3RyaW5nO1xuICBkcml2ZXJfbmFtZTogc3RyaW5nO1xuICBjYXJyaWVyX2NvbXBhbnk/OiBzdHJpbmcgfCBudWxsO1xuICBkaXNwYXRjaF9ndWlkZT86IHN0cmluZyB8IG51bGw7XG4gIGdyb3NzX3dlaWdodDogc3RyaW5nIHwgbnVtYmVyIHwgbnVsbDtcbiAgdGFyZV93ZWlnaHQ6IHN0cmluZyB8IG51bWJlciB8IG51bGw7XG4gIG5ldF93ZWlnaHQ6IHN0cmluZyB8IG51bWJlciB8IG51bGw7XG4gIGVudHJ5X2F0OiBzdHJpbmc7XG4gIGZpbmlzaGVkX2F0Pzogc3RyaW5nIHwgbnVsbDtcbiAgcHJvZHVjZXJfbmFtZTogc3RyaW5nO1xuICBwcm9kdWNlcl9ydXQ6IHN0cmluZztcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFRydWNrRGlzcGF0Y2hlc0dyaWRBY3Rpb24ocGFyYW1zOiB7XG4gIGxpbWl0PzogbnVtYmVyO1xuICBvZmZzZXQ/OiBudW1iZXI7XG4gIHNlYXJjaD86IHN0cmluZztcbiAgZmlsdGVycz86IHN0cmluZztcbiAgc29ydD86IHN0cmluZztcbiAgc29ydEZpZWxkPzogc3RyaW5nO1xufSk6IFByb21pc2U8eyByb3dzOiBUcnVja0Rpc3BhdGNoR3JpZFJvd1tdOyB0b3RhbDogbnVtYmVyIH0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBzZXNzaW9uID0gYXdhaXQgZ2V0U2VydmVyU2Vzc2lvbihhdXRoT3B0aW9ucyk7XG5cbiAgICBpZiAoIXNlc3Npb24/LnVzZXI/LmFjY2Vzc1Rva2VuKSB7XG4gICAgICByZXR1cm4geyByb3dzOiBbXSwgdG90YWw6IDAgfTtcbiAgICB9XG5cbiAgICBjb25zdCBsaW1pdCA9IE1hdGgubWluKE1hdGgubWF4KHBhcmFtcy5saW1pdCA/PyAyNSwgMSksIDUwMCk7XG4gICAgY29uc3Qgb2Zmc2V0ID0gTWF0aC5tYXgocGFyYW1zLm9mZnNldCA/PyAwLCAwKTtcblxuICAgIGNvbnN0IHFzID0gbmV3IFVSTFNlYXJjaFBhcmFtcygpO1xuICAgIHFzLnNldCgnbGltaXQnLCBTdHJpbmcobGltaXQpKTtcbiAgICBxcy5zZXQoJ29mZnNldCcsIFN0cmluZyhvZmZzZXQpKTtcbiAgICBpZiAocGFyYW1zLnNlYXJjaD8udHJpbSgpKSB7XG4gICAgICBxcy5zZXQoJ3NlYXJjaCcsIHBhcmFtcy5zZWFyY2gudHJpbSgpKTtcbiAgICB9XG4gICAgaWYgKHBhcmFtcy5maWx0ZXJzPy50cmltKCkpIHtcbiAgICAgIHFzLnNldCgnZmlsdGVycycsIHBhcmFtcy5maWx0ZXJzLnRyaW0oKSk7XG4gICAgfVxuICAgIGlmIChwYXJhbXMuc29ydD8udHJpbSgpKSB7XG4gICAgICBxcy5zZXQoJ3NvcnQnLCBwYXJhbXMuc29ydC50cmltKCkpO1xuICAgIH1cbiAgICBpZiAocGFyYW1zLnNvcnRGaWVsZD8udHJpbSgpKSB7XG4gICAgICBxcy5zZXQoJ3NvcnRGaWVsZCcsIHBhcmFtcy5zb3J0RmllbGQudHJpbSgpKTtcbiAgICB9XG5cbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFxuICAgICAgYCR7QVBJX1VSTH0vbG9naXN0aWNzL3RydWNrLWRpc3BhdGNoZXMvZ3JpZD8ke3FzLnRvU3RyaW5nKCl9YCxcbiAgICAgIHtcbiAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgIEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHtzZXNzaW9uLnVzZXIuYWNjZXNzVG9rZW59YCxcbiAgICAgICAgfSxcbiAgICAgICAgY2FjaGU6ICduby1zdG9yZScsXG4gICAgICB9LFxuICAgICk7XG5cbiAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICByZXR1cm4geyByb3dzOiBbXSwgdG90YWw6IDAgfTtcbiAgICB9XG5cbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgY29uc3QgcGF5bG9hZCA9IHJlc3VsdC5kYXRhIGFzIHsgZGF0YTogdW5rbm93bltdOyB0b3RhbDogbnVtYmVyIH0gfCB1bmRlZmluZWQ7XG4gICAgY29uc3QgcmF3ID0gKHBheWxvYWQ/LmRhdGEgPz8gW10pIGFzIFJlY29yZDxzdHJpbmcsIHVua25vd24+W107XG4gICAgY29uc3QgdG90YWwgPSB0eXBlb2YgcGF5bG9hZD8udG90YWwgPT09ICdudW1iZXInID8gcGF5bG9hZC50b3RhbCA6IHJhdy5sZW5ndGg7XG5cbiAgICBjb25zdCByb3dzOiBUcnVja0Rpc3BhdGNoR3JpZFJvd1tdID0gcmF3Lm1hcCgocikgPT4ge1xuICAgICAgY29uc3QgcHJvZHVjZXIgPSByLnByb2R1Y2VyIGFzIHsgbmFtZT86IHN0cmluZzsgcnV0Pzogc3RyaW5nIH0gfCB1bmRlZmluZWQ7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBpZDogTnVtYmVyKHIuaWQpLFxuICAgICAgICBzdGF0dXM6IFN0cmluZyhyLnN0YXR1cyA/PyAnJyksXG4gICAgICAgIHByb2R1Y3Q6IHIucHJvZHVjdCAhPSBudWxsID8gU3RyaW5nKHIucHJvZHVjdCkgOiB1bmRlZmluZWQsXG4gICAgICAgIHByb2R1Y2VyX2lkOlxuICAgICAgICAgIHIucHJvZHVjZXJfaWQgIT0gbnVsbCA/IE51bWJlcihyLnByb2R1Y2VyX2lkKSA6IHVuZGVmaW5lZCxcbiAgICAgICAgbGljZW5zZV9wbGF0ZTogU3RyaW5nKHIubGljZW5zZV9wbGF0ZSA/PyAnJyksXG4gICAgICAgIGRyaXZlcl9uYW1lOiBTdHJpbmcoci5kcml2ZXJfbmFtZSA/PyAnJyksXG4gICAgICAgIGNhcnJpZXJfY29tcGFueTpcbiAgICAgICAgICByLmNhcnJpZXJfY29tcGFueSAhPSBudWxsID8gU3RyaW5nKHIuY2Fycmllcl9jb21wYW55KSA6IG51bGwsXG4gICAgICAgIGRpc3BhdGNoX2d1aWRlOlxuICAgICAgICAgIHIuZGlzcGF0Y2hfZ3VpZGUgIT0gbnVsbCA/IFN0cmluZyhyLmRpc3BhdGNoX2d1aWRlKSA6IG51bGwsXG4gICAgICAgIGdyb3NzX3dlaWdodDogci5ncm9zc193ZWlnaHQgYXMgc3RyaW5nIHwgbnVtYmVyIHwgbnVsbCxcbiAgICAgICAgdGFyZV93ZWlnaHQ6IHIudGFyZV93ZWlnaHQgYXMgc3RyaW5nIHwgbnVtYmVyIHwgbnVsbCxcbiAgICAgICAgbmV0X3dlaWdodDogci5uZXRfd2VpZ2h0IGFzIHN0cmluZyB8IG51bWJlciB8IG51bGwsXG4gICAgICAgIGVudHJ5X2F0OiBTdHJpbmcoci5lbnRyeV9hdCA/PyAnJyksXG4gICAgICAgIGZpbmlzaGVkX2F0OiByLmZpbmlzaGVkX2F0ICE9IG51bGwgPyBTdHJpbmcoci5maW5pc2hlZF9hdCkgOiBudWxsLFxuICAgICAgICBwcm9kdWNlcl9uYW1lOiBwcm9kdWNlcj8ubmFtZSA/PyAnJyxcbiAgICAgICAgcHJvZHVjZXJfcnV0OiBwcm9kdWNlcj8ucnV0ID8/ICcnLFxuICAgICAgfTtcbiAgICB9KTtcblxuICAgIHJldHVybiB7IHJvd3MsIHRvdGFsIH07XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcignRXJyb3IgZ3JpZCBkZXNwYWNob3M6JywgZXJyb3IpO1xuICAgIHJldHVybiB7IHJvd3M6IFtdLCB0b3RhbDogMCB9O1xuICB9XG59XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6InFVQWlLc0IsOE1BQUEifQ==
}),
"[project]/paddy/cargo/src/lib/logisticsProduct.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Producto logístico (recepción / despacho). Alineado con `LogisticsProduct` en el backend.
 * Vive fuera de `actions/*` para poder importarlo en componentes cliente sin `'use server'`.
 */ __turbopack_context__.s([
    "LOGISTICS_PRODUCT_OPTIONS",
    ()=>LOGISTICS_PRODUCT_OPTIONS,
    "formatLogisticsProductLabel",
    ()=>formatLogisticsProductLabel
]);
const LOGISTICS_PRODUCT_OPTIONS = [
    {
        value: 'ARROZ_PADDY',
        label: 'Arroz paddy'
    },
    {
        value: 'CASCARILLA',
        label: 'Cascarilla'
    }
];
function formatLogisticsProductLabel(code) {
    if (code === 'CASCARILLA') {
        return 'Cascarilla';
    }
    return 'Arroz paddy';
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/paddy/cargo/src/actions/data:d24464 [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createProducerAction",
    ()=>$$RSC_SERVER_ACTION_0
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
/* __next_internal_action_entry_do_not_use__ [{"40f41787a47c7a56994ff86127b4aacb76e346a429":"createProducerAction"},"paddy/cargo/src/actions/producerActions.ts",""] */ "use turbopack no side effects";
;
const $$RSC_SERVER_ACTION_0 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("40f41787a47c7a56994ff86127b4aacb76e346a429", __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "createProducerAction");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
 //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vcHJvZHVjZXJBY3Rpb25zLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc2VydmVyJztcblxuaW1wb3J0IHsgZ2V0U2VydmVyU2Vzc2lvbiB9IGZyb20gJ25leHQtYXV0aCc7XG5pbXBvcnQgeyBhdXRoT3B0aW9ucyB9IGZyb20gJ0AvbGliL2F1dGguY29uZmlnJztcblxuY29uc3QgQVBJX0JBU0VfVVJMID0gYCR7cHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfQVBJX1VSTH0vcHJvZHVjZXJzYDtcblxuZXhwb3J0IGludGVyZmFjZSBDcmVhdGVQcm9kdWNlclBheWxvYWQge1xuICBydXQ6IHN0cmluZztcbiAgbmFtZTogc3RyaW5nO1xuICBhZGRyZXNzOiBzdHJpbmc7XG4gIGNpdHk6IHN0cmluZztcbiAgZW1haWw6IHN0cmluZztcbiAgcGhvbmU6IHN0cmluZztcbiAgY29udGFjdFBlcnNvbjogc3RyaW5nO1xuICBpc0FjdGl2ZT86IGJvb2xlYW47XG4gIGJhbmtBY2NvdW50cz86IHVua25vd25bXTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBDcmVhdGVkUHJvZHVjZXIge1xuICBpZDogbnVtYmVyO1xuICBydXQ6IHN0cmluZztcbiAgbmFtZTogc3RyaW5nO1xuICBhZGRyZXNzPzogc3RyaW5nO1xuICBjaXR5Pzogc3RyaW5nO1xuICBlbWFpbD86IHN0cmluZztcbiAgcGhvbmU/OiBzdHJpbmc7XG4gIGNvbnRhY3RQZXJzb24/OiBzdHJpbmc7XG4gIGlzQWN0aXZlPzogYm9vbGVhbjtcbn1cblxuZnVuY3Rpb24gZXh0cmFjdEJhY2tlbmRFcnJvck1lc3NhZ2UoZXJyb3JEYXRhOiB1bmtub3duLCBmYWxsYmFjazogc3RyaW5nKTogc3RyaW5nIHtcbiAgY29uc3QgcGFyc2VNZXNzYWdlID0gKHZhbHVlOiB1bmtub3duKTogc3RyaW5nIHwgbnVsbCA9PiB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICBjb25zdCBwYXJzZWQgPSB2YWx1ZVxuICAgICAgICAubWFwKChlbnRyeSkgPT4ge1xuICAgICAgICAgIGlmICh0eXBlb2YgZW50cnkgPT09ICdzdHJpbmcnKSByZXR1cm4gZW50cnk7XG4gICAgICAgICAgaWYgKGVudHJ5ICYmIHR5cGVvZiBlbnRyeSA9PT0gJ29iamVjdCcgJiYgJ21lc3NhZ2UnIGluIGVudHJ5KSB7XG4gICAgICAgICAgICBjb25zdCBuZXN0ZWQgPSAoZW50cnkgYXMgeyBtZXNzYWdlPzogdW5rbm93biB9KS5tZXNzYWdlO1xuICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiBuZXN0ZWQgPT09ICdzdHJpbmcnID8gbmVzdGVkIDogU3RyaW5nKG5lc3RlZCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBTdHJpbmcoZW50cnkpO1xuICAgICAgICB9KVxuICAgICAgICAuZmlsdGVyKChlbnRyeSkgPT4gZW50cnkudHJpbSgpLmxlbmd0aCA+IDApO1xuICAgICAgcmV0dXJuIHBhcnNlZC5sZW5ndGggPiAwID8gcGFyc2VkLmpvaW4oJywgJykgOiBudWxsO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyAmJiB2YWx1ZS50cmltKCkubGVuZ3RoID4gMCkgcmV0dXJuIHZhbHVlO1xuICAgIHJldHVybiBudWxsO1xuICB9O1xuXG4gIGlmICghZXJyb3JEYXRhIHx8IHR5cGVvZiBlcnJvckRhdGEgIT09ICdvYmplY3QnKSByZXR1cm4gZmFsbGJhY2s7XG4gIGNvbnN0IGUgPSBlcnJvckRhdGEgYXMgUmVjb3JkPHN0cmluZywgdW5rbm93bj47XG4gIHJldHVybiAoXG4gICAgcGFyc2VNZXNzYWdlKGUubWVzc2FnZSkgfHxcbiAgICBwYXJzZU1lc3NhZ2UoKGUuZGF0YSBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPik/Lm1lc3NhZ2UpIHx8XG4gICAgcGFyc2VNZXNzYWdlKGUuZXJyb3IpIHx8XG4gICAgZmFsbGJhY2tcbiAgKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZVByb2R1Y2VyQWN0aW9uKFxuICBkYXRhOiBDcmVhdGVQcm9kdWNlclBheWxvYWQsXG4pOiBQcm9taXNlPHsgc3VjY2VzczogYm9vbGVhbjsgZGF0YT86IENyZWF0ZWRQcm9kdWNlcjsgZXJyb3I/OiBzdHJpbmcgfT4ge1xuICB0cnkge1xuICAgIGNvbnN0IHNlc3Npb24gPSBhd2FpdCBnZXRTZXJ2ZXJTZXNzaW9uKGF1dGhPcHRpb25zKTtcbiAgICBjb25zdCB0b2tlbiA9IHNlc3Npb24/LnVzZXI/LmFjY2Vzc1Rva2VuO1xuXG4gICAgaWYgKCF0b2tlbikge1xuICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAnTm8gaGF5IHNlc2nDs24gYWN0aXZhJyB9O1xuICAgIH1cblxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goQVBJX0JBU0VfVVJMLCB7XG4gICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgQXV0aG9yaXphdGlvbjogYEJlYXJlciAke3Rva2VufWAsXG4gICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICB9LFxuICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZGF0YSksXG4gICAgfSk7XG5cbiAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICBjb25zdCBlcnJvckRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCkuY2F0Y2goKCkgPT4gKHt9KSk7XG4gICAgICBjb25zdCBlcnJvck1lc3NhZ2UgPSBleHRyYWN0QmFja2VuZEVycm9yTWVzc2FnZShcbiAgICAgICAgZXJyb3JEYXRhLFxuICAgICAgICBgRXJyb3IgYWwgY3JlYXIgcHJvZHVjdG9yICgke3Jlc3BvbnNlLnN0YXR1c30pYCxcbiAgICAgICk7XG4gICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGVycm9yTWVzc2FnZSB9O1xuICAgIH1cblxuICAgIGNvbnN0IHJlc3BvbnNlRGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICBjb25zdCBwcm9kdWNlckRhdGEgPSByZXNwb25zZURhdGEuZGF0YSA/PyByZXNwb25zZURhdGE7XG4gICAgY29uc3QgaWQgPVxuICAgICAgdHlwZW9mIHByb2R1Y2VyRGF0YS5pZCA9PT0gJ3N0cmluZycgPyBwYXJzZUludChwcm9kdWNlckRhdGEuaWQsIDEwKSA6IE51bWJlcihwcm9kdWNlckRhdGEuaWQpO1xuXG4gICAgY29uc3Qgbm9ybWFsaXplZDogQ3JlYXRlZFByb2R1Y2VyID0ge1xuICAgICAgaWQsXG4gICAgICBydXQ6IFN0cmluZyhwcm9kdWNlckRhdGEucnV0ID8/ICcnKSxcbiAgICAgIG5hbWU6IFN0cmluZyhwcm9kdWNlckRhdGEubmFtZSA/PyAnJyksXG4gICAgICBhZGRyZXNzOiBwcm9kdWNlckRhdGEuYWRkcmVzcyAhPSBudWxsID8gU3RyaW5nKHByb2R1Y2VyRGF0YS5hZGRyZXNzKSA6IHVuZGVmaW5lZCxcbiAgICAgIGNpdHk6IHByb2R1Y2VyRGF0YS5jaXR5ICE9IG51bGwgPyBTdHJpbmcocHJvZHVjZXJEYXRhLmNpdHkpIDogdW5kZWZpbmVkLFxuICAgICAgZW1haWw6IHByb2R1Y2VyRGF0YS5lbWFpbCAhPSBudWxsID8gU3RyaW5nKHByb2R1Y2VyRGF0YS5lbWFpbCkgOiB1bmRlZmluZWQsXG4gICAgICBwaG9uZTogcHJvZHVjZXJEYXRhLnBob25lICE9IG51bGwgPyBTdHJpbmcocHJvZHVjZXJEYXRhLnBob25lKSA6IHVuZGVmaW5lZCxcbiAgICAgIGNvbnRhY3RQZXJzb246XG4gICAgICAgIHByb2R1Y2VyRGF0YS5jb250YWN0UGVyc29uICE9IG51bGwgPyBTdHJpbmcocHJvZHVjZXJEYXRhLmNvbnRhY3RQZXJzb24pIDogdW5kZWZpbmVkLFxuICAgICAgaXNBY3RpdmU6IEJvb2xlYW4ocHJvZHVjZXJEYXRhLmlzQWN0aXZlKSxcbiAgICB9O1xuXG4gICAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSwgZGF0YTogbm9ybWFsaXplZCB9O1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnN0IG1lc3NhZ2UgPSBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6ICdFcnJvciBkZXNjb25vY2lkbyc7XG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBtZXNzYWdlIH07XG4gIH1cbn1cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoibVRBNERzQixpTUFBQSJ9
}),
"[project]/paddy/cargo/src/shared/components/ui/Switch/Switch.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
const Switch = ({ checked = false, onChange, label, labelPosition = 'left', disabled = false, ...props })=>{
    _s();
    const [isChecked, setIsChecked] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(checked);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Switch.useEffect": ()=>{
            setIsChecked(checked);
        }
    }["Switch.useEffect"], [
        checked
    ]);
    const handleToggle = ()=>{
        if (disabled) {
            return;
        }
        setIsChecked(!isChecked);
        onChange?.(!isChecked);
    };
    const handleKeyDown = (event)=>{
        if (disabled) {
            return;
        }
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleToggle();
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
        className: `flex items-center gap-2 select-none mt-1 ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`,
        "data-test-id": props["data-test-id"] || "switch-root",
        children: [
            labelPosition === 'left' && label && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-sm font-light",
                children: label
            }, void 0, false, {
                fileName: "[project]/paddy/cargo/src/shared/components/ui/Switch/Switch.tsx",
                lineNumber: 46,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: `relative w-10 h-6 flex items-center rounded-full transition-colors duration-200 group ${disabled ? 'pointer-events-none' : ''}`,
                style: {
                    boxShadow: 'inset 0 0 0 4px color-mix(in srgb, var(--color-border) 70%, transparent)',
                    background: 'var(--color-background)'
                },
                onClick: handleToggle,
                role: "switch",
                "aria-checked": isChecked,
                "aria-disabled": disabled,
                tabIndex: disabled ? -1 : 0,
                onKeyDown: handleKeyDown,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: `absolute left-1 top-1 w-4 h-4 rounded-full transition-transform duration-200${isChecked ? ' translate-x-4' : ' border bg-background group-hover:bg-accent/60'}`,
                    style: isChecked ? {
                        borderColor: 'var(--color-primary)',
                        borderWidth: '1px',
                        backgroundColor: 'var(--color-primary)'
                    } : {
                        borderColor: 'var(--color-secondary)',
                        borderWidth: '1px'
                    }
                }, void 0, false, {
                    fileName: "[project]/paddy/cargo/src/shared/components/ui/Switch/Switch.tsx",
                    lineNumber: 58,
                    columnNumber: 5
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/paddy/cargo/src/shared/components/ui/Switch/Switch.tsx",
                lineNumber: 48,
                columnNumber: 3
            }, ("TURBOPACK compile-time value", void 0)),
            labelPosition === 'right' && label && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-sm font-light",
                children: label
            }, void 0, false, {
                fileName: "[project]/paddy/cargo/src/shared/components/ui/Switch/Switch.tsx",
                lineNumber: 64,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/paddy/cargo/src/shared/components/ui/Switch/Switch.tsx",
        lineNumber: 41,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(Switch, "shl+4nLSukS+PeKy4ilEAHsC4Ew=");
_c = Switch;
const __TURBOPACK__default__export__ = Switch;
var _c;
__turbopack_context__.k.register(_c, "Switch");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/paddy/cargo/src/components/producers/CreateProducerDialog.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CreateProducerDialog
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$actions$2f$data$3a$d24464__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/paddy/cargo/src/actions/data:d24464 [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$shared$2f$components$2f$ui$2f$Alert$2f$Alert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/src/shared/components/ui/Alert/Alert.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$shared$2f$components$2f$ui$2f$Button$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/src/shared/components/ui/Button/Button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$shared$2f$components$2f$ui$2f$TextField$2f$TextField$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/src/shared/components/ui/TextField/TextField.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$shared$2f$components$2f$ui$2f$Switch$2f$Switch$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/src/shared/components/ui/Switch/Switch.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
function normalizeRut(rawRut) {
    return rawRut.replace(/\./g, '').replace(/-/g, '').trim().toUpperCase();
}
function hasValidRutVerifier(rut) {
    const normalizedRut = normalizeRut(rut);
    if (!/^\d{7,8}[\dK]$/.test(normalizedRut)) {
        return false;
    }
    const body = normalizedRut.slice(0, -1);
    const verifier = normalizedRut.slice(-1);
    let sum = 0;
    let multiplier = 2;
    for(let index = body.length - 1; index >= 0; index -= 1){
        sum += Number(body[index]) * multiplier;
        multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }
    const remainder = 11 - sum % 11;
    const expectedVerifier = remainder === 11 ? '0' : remainder === 10 ? 'K' : String(remainder);
    return verifier === expectedVerifier;
}
function CreateProducerDialog({ open, onClose, onSuccess }) {
    _s();
    const [isMounted, setIsMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        rut: '',
        name: '',
        address: '',
        city: '',
        email: '',
        phone: '',
        contactPerson: '',
        isActive: true,
        bankAccounts: []
    });
    const fieldIds = {
        rut: 'tms-producer-rut',
        name: 'tms-producer-name',
        email: 'tms-producer-email',
        phone: 'tms-producer-phone',
        address: 'tms-producer-address',
        city: 'tms-producer-city',
        contactPerson: 'tms-producer-contact',
        submitBtn: 'tms-producer-submit-btn'
    };
    const tabOrder = [
        fieldIds.rut,
        fieldIds.name,
        fieldIds.email,
        fieldIds.phone,
        fieldIds.address,
        fieldIds.city,
        fieldIds.contactPerson,
        fieldIds.submitBtn
    ];
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CreateProducerDialog.useEffect": ()=>{
            setIsMounted(true);
            return ({
                "CreateProducerDialog.useEffect": ()=>{
                    setIsMounted(false);
                }
            })["CreateProducerDialog.useEffect"];
        }
    }["CreateProducerDialog.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CreateProducerDialog.useEffect": ()=>{
            if (!open) {
                setFormData({
                    rut: '',
                    name: '',
                    address: '',
                    city: '',
                    email: '',
                    phone: '',
                    contactPerson: '',
                    isActive: true,
                    bankAccounts: []
                });
                setError('');
            }
        }
    }["CreateProducerDialog.useEffect"], [
        open
    ]);
    const handleSubmit = async (e)=>{
        e?.preventDefault();
        e?.stopPropagation();
        setError('');
        setIsLoading(true);
        if (!formData.rut.trim()) {
            setError('RUT es requerido');
            setIsLoading(false);
            return;
        }
        if (!formData.name.trim()) {
            setError('Nombre es requerido');
            setIsLoading(false);
            return;
        }
        if (!hasValidRutVerifier(formData.rut)) {
            setError('RUT tiene dígito verificador inválido');
            setIsLoading(false);
            return;
        }
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$actions$2f$data$3a$d24464__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["createProducerAction"])(formData);
        if (result.success && result.data) {
            onSuccess?.(result.data);
            onClose();
        } else {
            setError(result.error || 'Error al crear productor');
        }
        setIsLoading(false);
    };
    const handleKeyDown = (e, fieldId)=>{
        if (e.key === 'Enter') {
            e.preventDefault();
            const currentIndex = tabOrder.indexOf(fieldId);
            if (currentIndex === -1) return;
            const nextFieldId = tabOrder[currentIndex + 1];
            if (nextFieldId) {
                const nextElement = document.getElementById(nextFieldId);
                if (nextElement) nextElement.focus();
            }
        }
    };
    if (!open || !isMounted) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPortal"])(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mx-4 max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg border border-border bg-background shadow-xl",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "border-b border-border px-6 py-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-lg font-bold text-foreground",
                        children: "Crear Productor"
                    }, void 0, false, {
                        fileName: "[project]/paddy/cargo/src/components/producers/CreateProducerDialog.tsx",
                        lineNumber: 169,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/paddy/cargo/src/components/producers/CreateProducerDialog.tsx",
                    lineNumber: 168,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                    onSubmit: handleSubmit,
                    className: "space-y-4 px-6 py-4",
                    children: [
                        error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$shared$2f$components$2f$ui$2f$Alert$2f$Alert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            variant: "error",
                            children: error
                        }, void 0, false, {
                            fileName: "[project]/paddy/cargo/src/components/producers/CreateProducerDialog.tsx",
                            lineNumber: 173,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$shared$2f$components$2f$ui$2f$TextField$2f$TextField$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextField"], {
                            id: fieldIds.rut,
                            label: "RUT *",
                            type: "dni",
                            value: formData.rut,
                            onChange: (e)=>setFormData((prev)=>({
                                        ...prev,
                                        rut: e.target.value
                                    })),
                            onKeyDown: (e)=>handleKeyDown(e, fieldIds.rut),
                            placeholder: "12.345.678-9",
                            required: true,
                            labelAlwaysVisible: true
                        }, void 0, false, {
                            fileName: "[project]/paddy/cargo/src/components/producers/CreateProducerDialog.tsx",
                            lineNumber: 175,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$shared$2f$components$2f$ui$2f$TextField$2f$TextField$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextField"], {
                            id: fieldIds.name,
                            label: "Nombre *",
                            type: "text",
                            value: formData.name,
                            onChange: (e)=>setFormData((prev)=>({
                                        ...prev,
                                        name: e.target.value
                                    })),
                            onKeyDown: (e)=>handleKeyDown(e, fieldIds.name),
                            placeholder: "Nombre del productor",
                            required: true,
                            labelAlwaysVisible: true
                        }, void 0, false, {
                            fileName: "[project]/paddy/cargo/src/components/producers/CreateProducerDialog.tsx",
                            lineNumber: 187,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$shared$2f$components$2f$ui$2f$TextField$2f$TextField$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextField"], {
                            id: fieldIds.email,
                            label: "Email",
                            type: "email",
                            value: formData.email,
                            onChange: (e)=>setFormData((prev)=>({
                                        ...prev,
                                        email: e.target.value
                                    })),
                            onKeyDown: (e)=>handleKeyDown(e, fieldIds.email),
                            placeholder: "correo@ejemplo.com",
                            labelAlwaysVisible: true
                        }, void 0, false, {
                            fileName: "[project]/paddy/cargo/src/components/producers/CreateProducerDialog.tsx",
                            lineNumber: 199,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$shared$2f$components$2f$ui$2f$TextField$2f$TextField$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextField"], {
                            id: fieldIds.phone,
                            label: "Teléfono",
                            type: "tel",
                            value: formData.phone,
                            onChange: (e)=>setFormData((prev)=>({
                                        ...prev,
                                        phone: e.target.value
                                    })),
                            onKeyDown: (e)=>handleKeyDown(e, fieldIds.phone),
                            placeholder: "+56912345678",
                            phonePrefix: "+56",
                            labelAlwaysVisible: true
                        }, void 0, false, {
                            fileName: "[project]/paddy/cargo/src/components/producers/CreateProducerDialog.tsx",
                            lineNumber: 210,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$shared$2f$components$2f$ui$2f$TextField$2f$TextField$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextField"], {
                            id: fieldIds.address,
                            label: "Dirección",
                            type: "text",
                            value: formData.address,
                            onChange: (e)=>setFormData((prev)=>({
                                        ...prev,
                                        address: e.target.value
                                    })),
                            onKeyDown: (e)=>handleKeyDown(e, fieldIds.address),
                            placeholder: "Calle Principal 123",
                            labelAlwaysVisible: true
                        }, void 0, false, {
                            fileName: "[project]/paddy/cargo/src/components/producers/CreateProducerDialog.tsx",
                            lineNumber: 222,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$shared$2f$components$2f$ui$2f$TextField$2f$TextField$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextField"], {
                            id: fieldIds.city,
                            label: "Ciudad",
                            type: "text",
                            value: formData.city,
                            onChange: (e)=>setFormData((prev)=>({
                                        ...prev,
                                        city: e.target.value
                                    })),
                            onKeyDown: (e)=>handleKeyDown(e, fieldIds.city),
                            placeholder: "Parral",
                            labelAlwaysVisible: true
                        }, void 0, false, {
                            fileName: "[project]/paddy/cargo/src/components/producers/CreateProducerDialog.tsx",
                            lineNumber: 233,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$shared$2f$components$2f$ui$2f$TextField$2f$TextField$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextField"], {
                            id: fieldIds.contactPerson,
                            label: "Persona de Contacto",
                            type: "text",
                            value: formData.contactPerson,
                            onChange: (e)=>setFormData((prev)=>({
                                        ...prev,
                                        contactPerson: e.target.value
                                    })),
                            onKeyDown: (e)=>handleKeyDown(e, fieldIds.contactPerson),
                            placeholder: "Nombre del contacto",
                            labelAlwaysVisible: true
                        }, void 0, false, {
                            fileName: "[project]/paddy/cargo/src/components/producers/CreateProducerDialog.tsx",
                            lineNumber: 244,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "pt-2",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$shared$2f$components$2f$ui$2f$Switch$2f$Switch$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                label: "Activo",
                                checked: formData.isActive ?? true,
                                onChange: (checked)=>setFormData((prev)=>({
                                            ...prev,
                                            isActive: checked
                                        })),
                                labelPosition: "right"
                            }, void 0, false, {
                                fileName: "[project]/paddy/cargo/src/components/producers/CreateProducerDialog.tsx",
                                lineNumber: 256,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/paddy/cargo/src/components/producers/CreateProducerDialog.tsx",
                            lineNumber: 255,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-between gap-3 border-t border-border pt-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$shared$2f$components$2f$ui$2f$Button$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    type: "button",
                                    onClick: onClose,
                                    variant: "outlined",
                                    disabled: isLoading,
                                    children: "Cancelar"
                                }, void 0, false, {
                                    fileName: "[project]/paddy/cargo/src/components/producers/CreateProducerDialog.tsx",
                                    lineNumber: 265,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$shared$2f$components$2f$ui$2f$Button$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    id: fieldIds.submitBtn,
                                    type: "submit",
                                    variant: "primary",
                                    loading: isLoading,
                                    disabled: isLoading,
                                    onKeyDown: (e)=>{
                                        if (e.key === 'Enter') void handleSubmit();
                                    },
                                    children: "Crear"
                                }, void 0, false, {
                                    fileName: "[project]/paddy/cargo/src/components/producers/CreateProducerDialog.tsx",
                                    lineNumber: 268,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/paddy/cargo/src/components/producers/CreateProducerDialog.tsx",
                            lineNumber: 264,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/paddy/cargo/src/components/producers/CreateProducerDialog.tsx",
                    lineNumber: 172,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/paddy/cargo/src/components/producers/CreateProducerDialog.tsx",
            lineNumber: 167,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/paddy/cargo/src/components/producers/CreateProducerDialog.tsx",
        lineNumber: 166,
        columnNumber: 5
    }, this), document.body);
}
_s(CreateProducerDialog, "m04DBwX3p/8nQawX0jSXV21j55I=");
_c = CreateProducerDialog;
var _c;
__turbopack_context__.k.register(_c, "CreateProducerDialog");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/paddy/cargo/src/components/weighing/TruckDispatchForm.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TruckDispatchForm",
    ()=>TruckDispatchForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$shared$2f$components$2f$ui$2f$TextField$2f$TextField$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/src/shared/components/ui/TextField/TextField.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$shared$2f$components$2f$ui$2f$AutoComplete$2f$AutoComplete$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/src/shared/components/ui/AutoComplete/AutoComplete.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$shared$2f$components$2f$ui$2f$Button$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/src/shared/components/ui/Button/Button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$shared$2f$components$2f$ui$2f$Alert$2f$Alert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/src/shared/components/ui/Alert/Alert.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$shared$2f$components$2f$ui$2f$Select$2f$Select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/src/shared/components/ui/Select/Select.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$actions$2f$data$3a$a7e884__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/paddy/cargo/src/actions/data:a7e884 [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$actions$2f$data$3a$f40ce5__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/paddy/cargo/src/actions/data:f40ce5 [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$actions$2f$data$3a$ad9331__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/paddy/cargo/src/actions/data:ad9331 [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$lib$2f$logisticsProduct$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/src/lib/logisticsProduct.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$providers$2f$DispatchWeighingPageProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/src/providers/DispatchWeighingPageProvider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$components$2f$producers$2f$CreateProducerDialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/src/components/producers/CreateProducerDialog.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
;
;
;
const CREATE_PRODUCER_OPTION_ID = '__create_new_producer__';
function isCreateProducerOption(option) {
    return Boolean(option && 'isCreateOption' in option && option.isCreateOption);
}
const TruckDispatchForm = ({ mode, selected, serialWeight, isSerialConnected, onDispatchCreated, onGrossFinalized, onCancel })=>{
    _s();
    const { addDispatch, loadDispatchesToday, updateDispatch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$providers$2f$DispatchWeighingPageProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDispatchWeighingPage"])();
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        producer_id: null,
        product: 'ARROZ_PADDY',
        license_plate: '',
        driver_name: '',
        carrier_company: '',
        dispatch_guide: '',
        tare_weight: '',
        gross_weight: ''
    });
    const [producers, setProducers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [producerSearch, setProducerSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [createProducerDialogOpen, setCreateProducerDialogOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [producerAutocompleteResetKey, setProducerAutocompleteResetKey] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [successMessage, setSuccessMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const loadProducers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "TruckDispatchForm.useCallback[loadProducers]": async ()=>{
            try {
                const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$actions$2f$data$3a$a7e884__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["fetchProducersAction"])({
                    page: 1,
                    limit: 5000,
                    sortField: 'name',
                    sort: 'ASC'
                });
                setProducers(result.data);
            } catch (err) {
                console.error('Error cargando productores:', err);
            }
        }
    }["TruckDispatchForm.useCallback[loadProducers]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TruckDispatchForm.useEffect": ()=>{
            void loadProducers();
        }
    }["TruckDispatchForm.useEffect"], [
        loadProducers
    ]);
    const producerAutocompleteOptions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "TruckDispatchForm.useMemo[producerAutocompleteOptions]": ()=>{
            const normalizedQuery = producerSearch.trim().toLowerCase();
            if (!normalizedQuery) {
                return producers;
            }
            const hasMatches = producers.some({
                "TruckDispatchForm.useMemo[producerAutocompleteOptions].hasMatches": (producer)=>producer.name.toLowerCase().includes(normalizedQuery) || producer.rut.toLowerCase().includes(normalizedQuery) || (producer.city || '').toLowerCase().includes(normalizedQuery) || (producer.email || '').toLowerCase().includes(normalizedQuery)
            }["TruckDispatchForm.useMemo[producerAutocompleteOptions].hasMatches"]);
            if (hasMatches) {
                return producers;
            }
            return [
                ...producers,
                {
                    id: CREATE_PRODUCER_OPTION_ID,
                    query: producerSearch.trim(),
                    isCreateOption: true
                }
            ];
        }
    }["TruckDispatchForm.useMemo[producerAutocompleteOptions]"], [
        producers,
        producerSearch
    ]);
    const productSelectOptions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "TruckDispatchForm.useMemo[productSelectOptions]": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$lib$2f$logisticsProduct$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LOGISTICS_PRODUCT_OPTIONS"].map({
                "TruckDispatchForm.useMemo[productSelectOptions]": (o)=>({
                        id: o.value,
                        label: o.label
                    })
            }["TruckDispatchForm.useMemo[productSelectOptions]"])
    }["TruckDispatchForm.useMemo[productSelectOptions]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TruckDispatchForm.useEffect": ()=>{
            setError(null);
            setSuccessMessage(null);
            if (mode === 'create') {
                setFormData({
                    producer_id: null,
                    product: 'ARROZ_PADDY',
                    license_plate: '',
                    driver_name: '',
                    carrier_company: '',
                    dispatch_guide: '',
                    tare_weight: '',
                    gross_weight: ''
                });
            }
        }
    }["TruckDispatchForm.useEffect"], [
        mode
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TruckDispatchForm.useEffect": ()=>{
            if (mode === 'gross' && selected?.id != null) {
                setFormData({
                    "TruckDispatchForm.useEffect": (prev)=>({
                            ...prev,
                            gross_weight: ''
                        })
                }["TruckDispatchForm.useEffect"]);
            }
        }
    }["TruckDispatchForm.useEffect"], [
        mode,
        selected?.id
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TruckDispatchForm.useEffect": ()=>{
            if (!isSerialConnected || serialWeight == null || !Number.isFinite(serialWeight)) {
                return;
            }
            const value = String(serialWeight);
            if (mode === 'create') {
                setFormData({
                    "TruckDispatchForm.useEffect": (prev)=>({
                            ...prev,
                            tare_weight: value
                        })
                }["TruckDispatchForm.useEffect"]);
            } else if (mode === 'gross') {
                setFormData({
                    "TruckDispatchForm.useEffect": (prev)=>({
                            ...prev,
                            gross_weight: value
                        })
                }["TruckDispatchForm.useEffect"]);
            }
        }
    }["TruckDispatchForm.useEffect"], [
        serialWeight,
        isSerialConnected,
        mode
    ]);
    const handleProducerCreated = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "TruckDispatchForm.useCallback[handleProducerCreated]": (producer)=>{
            const normalized = {
                id: producer.id,
                name: producer.name || '',
                rut: producer.rut || '',
                email: producer.email,
                city: producer.city
            };
            setFormData({
                "TruckDispatchForm.useCallback[handleProducerCreated]": (prev)=>({
                        ...prev,
                        producer_id: normalized.id
                    })
            }["TruckDispatchForm.useCallback[handleProducerCreated]"]);
            setProducers({
                "TruckDispatchForm.useCallback[handleProducerCreated]": (current)=>{
                    const next = [
                        normalized,
                        ...current.filter({
                            "TruckDispatchForm.useCallback[handleProducerCreated]": (p)=>p.id !== normalized.id
                        }["TruckDispatchForm.useCallback[handleProducerCreated]"])
                    ];
                    return next.sort({
                        "TruckDispatchForm.useCallback[handleProducerCreated]": (a, b)=>a.name.localeCompare(b.name, 'es', {
                                sensitivity: 'base'
                            })
                    }["TruckDispatchForm.useCallback[handleProducerCreated]"]);
                }
            }["TruckDispatchForm.useCallback[handleProducerCreated]"]);
            setProducerSearch('');
            setProducerAutocompleteResetKey({
                "TruckDispatchForm.useCallback[handleProducerCreated]": (k)=>k + 1
            }["TruckDispatchForm.useCallback[handleProducerCreated]"]);
        }
    }["TruckDispatchForm.useCallback[handleProducerCreated]"], []);
    const netPreview = mode === 'gross' && selected?.tare_weight != null && formData.gross_weight ? Number(formData.gross_weight) - Number(selected.tare_weight) : null;
    const handleCreateSubmit = async (e)=>{
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        if (!formData.producer_id) {
            setError('Selecciona un productor');
            return;
        }
        if (!formData.license_plate.trim()) {
            setError('La patente es requerida');
            return;
        }
        const tw = Number(formData.tare_weight);
        if (!tw || tw <= 0) {
            setError('El peso tara debe ser mayor a 0');
            return;
        }
        setIsLoading(true);
        try {
            const driverTrim = formData.driver_name.trim();
            const created = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$actions$2f$data$3a$f40ce5__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["createTruckDispatchWithTareAction"])({
                producer_id: formData.producer_id,
                license_plate: formData.license_plate.trim(),
                ...driverTrim ? {
                    driver_name: driverTrim
                } : {},
                carrier_company: formData.carrier_company.trim() || undefined,
                dispatch_guide: formData.dispatch_guide.trim() || undefined,
                tare_weight: tw,
                product: formData.product
            });
            addDispatch(created);
            await loadDispatchesToday();
            setSuccessMessage(`Despacho #${created.id} creado con tara.`);
            setFormData({
                producer_id: null,
                product: 'ARROZ_PADDY',
                license_plate: '',
                driver_name: '',
                carrier_company: '',
                dispatch_guide: '',
                tare_weight: '',
                gross_weight: ''
            });
            setProducerSearch('');
            setProducerAutocompleteResetKey((k)=>k + 1);
            onDispatchCreated?.(created);
            void loadProducers();
            setTimeout(()=>setSuccessMessage(null), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al crear despacho');
        } finally{
            setIsLoading(false);
        }
    };
    const handleGrossSubmit = async (e)=>{
        e.preventDefault();
        setError(null);
        if (!selected) {
            setError('No hay despacho seleccionado');
            return;
        }
        const gw = Number(formData.gross_weight);
        if (!gw || gw <= 0) {
            setError('El peso bruto debe ser mayor a 0');
            return;
        }
        const tw = Number(selected.tare_weight ?? 0);
        if (gw <= tw) {
            setError('El peso bruto debe ser mayor que la tara');
            return;
        }
        setIsLoading(true);
        try {
            const updated = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$actions$2f$data$3a$ad9331__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["registerDispatchGrossWeightAction"])({
                truck_dispatch_id: selected.id,
                gross_weight: gw,
                status: 'FINISHED'
            });
            updateDispatch(updated);
            setFormData((prev)=>({
                    ...prev,
                    gross_weight: ''
                }));
            setSuccessMessage('Despacho finalizado correctamente');
            onGrossFinalized?.(updated);
            setTimeout(()=>onCancel?.(), 1200);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al registrar bruto');
        } finally{
            setIsLoading(false);
        }
    };
    if (mode === 'create') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-background rounded-lg border border-border p-6 h-full overflow-y-auto",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-xl font-bold text-foreground mb-2",
                            children: "Nuevo despacho (tara)"
                        }, void 0, false, {
                            fileName: "[project]/paddy/cargo/src/components/weighing/TruckDispatchForm.tsx",
                            lineNumber: 285,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            onSubmit: handleCreateSubmit,
                            className: "space-y-4",
                            children: [
                                successMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$shared$2f$components$2f$ui$2f$Alert$2f$Alert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    variant: "success",
                                    className: "mb-4",
                                    children: successMessage
                                }, void 0, false, {
                                    fileName: "[project]/paddy/cargo/src/components/weighing/TruckDispatchForm.tsx",
                                    lineNumber: 288,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$shared$2f$components$2f$ui$2f$Alert$2f$Alert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    variant: "error",
                                    className: "mb-4",
                                    children: error
                                }, void 0, false, {
                                    fileName: "[project]/paddy/cargo/src/components/weighing/TruckDispatchForm.tsx",
                                    lineNumber: 293,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$shared$2f$components$2f$ui$2f$AutoComplete$2f$AutoComplete$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    options: producerAutocompleteOptions,
                                    value: producers.find((p)=>p.id === formData.producer_id) || null,
                                    onChange: (option)=>{
                                        if (!option) {
                                            setFormData((prev)=>({
                                                    ...prev,
                                                    producer_id: null
                                                }));
                                            return;
                                        }
                                        if (isCreateProducerOption(option)) {
                                            setCreateProducerDialogOpen(true);
                                            setProducerAutocompleteResetKey((k)=>k + 1);
                                            return;
                                        }
                                        setFormData((prev)=>({
                                                ...prev,
                                                producer_id: option.id
                                            }));
                                    },
                                    onInputChange: setProducerSearch,
                                    getOptionLabel: (option)=>isCreateProducerOption(option) ? `+ Nuevo productor "${option.query}"` : `${option.name} · ${option.rut}`,
                                    getOptionValue: (option)=>option.id,
                                    filterOption: (option, searchValue)=>{
                                        if (isCreateProducerOption(option)) {
                                            return true;
                                        }
                                        const q = searchValue.trim().toLowerCase();
                                        if (!q) {
                                            return true;
                                        }
                                        return option.name.toLowerCase().includes(q) || option.rut.toLowerCase().includes(q) || (option.email || '').toLowerCase().includes(q) || (option.city || '').toLowerCase().includes(q);
                                    },
                                    placeholder: "Buscar por nombre o RUT",
                                    disabled: isLoading,
                                    label: "Productor",
                                    labelAlwaysVisible: true
                                }, producerAutocompleteResetKey, false, {
                                    fileName: "[project]/paddy/cargo/src/components/weighing/TruckDispatchForm.tsx",
                                    lineNumber: 298,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$shared$2f$components$2f$ui$2f$Select$2f$Select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    label: "Producto",
                                    name: "dispatch-product",
                                    placeholder: "Selecciona producto",
                                    options: productSelectOptions,
                                    value: formData.product,
                                    onChange: (id)=>{
                                        if (id !== null && id !== undefined) {
                                            setFormData((prev)=>({
                                                    ...prev,
                                                    product: id
                                                }));
                                        }
                                    },
                                    required: true,
                                    disabled: isLoading,
                                    "data-test-id": "dispatch-product"
                                }, void 0, false, {
                                    fileName: "[project]/paddy/cargo/src/components/weighing/TruckDispatchForm.tsx",
                                    lineNumber: 342,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$shared$2f$components$2f$ui$2f$TextField$2f$TextField$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextField"], {
                                    label: "Patente *",
                                    value: formData.license_plate,
                                    onChange: (e)=>setFormData((prev)=>({
                                                ...prev,
                                                license_plate: e.target.value
                                            })),
                                    disabled: isLoading,
                                    labelAlwaysVisible: true
                                }, void 0, false, {
                                    fileName: "[project]/paddy/cargo/src/components/weighing/TruckDispatchForm.tsx",
                                    lineNumber: 358,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$shared$2f$components$2f$ui$2f$TextField$2f$TextField$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextField"], {
                                    label: "Chofer",
                                    value: formData.driver_name,
                                    onChange: (e)=>setFormData((prev)=>({
                                                ...prev,
                                                driver_name: e.target.value
                                            })),
                                    disabled: isLoading,
                                    labelAlwaysVisible: true
                                }, void 0, false, {
                                    fileName: "[project]/paddy/cargo/src/components/weighing/TruckDispatchForm.tsx",
                                    lineNumber: 368,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$shared$2f$components$2f$ui$2f$TextField$2f$TextField$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextField"], {
                                    label: "Empresa transporte",
                                    value: formData.carrier_company,
                                    onChange: (e)=>setFormData((prev)=>({
                                                ...prev,
                                                carrier_company: e.target.value
                                            })),
                                    disabled: isLoading,
                                    labelAlwaysVisible: true
                                }, void 0, false, {
                                    fileName: "[project]/paddy/cargo/src/components/weighing/TruckDispatchForm.tsx",
                                    lineNumber: 378,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$shared$2f$components$2f$ui$2f$TextField$2f$TextField$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextField"], {
                                    label: "Guía de despacho",
                                    value: formData.dispatch_guide,
                                    onChange: (e)=>setFormData((prev)=>({
                                                ...prev,
                                                dispatch_guide: e.target.value
                                            })),
                                    disabled: isLoading,
                                    labelAlwaysVisible: true
                                }, void 0, false, {
                                    fileName: "[project]/paddy/cargo/src/components/weighing/TruckDispatchForm.tsx",
                                    lineNumber: 388,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$shared$2f$components$2f$ui$2f$TextField$2f$TextField$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextField"], {
                                    label: "Peso tara (kg) *",
                                    type: "number",
                                    value: formData.tare_weight,
                                    onChange: (e)=>setFormData((prev)=>({
                                                ...prev,
                                                tare_weight: e.target.value
                                            })),
                                    disabled: isLoading,
                                    min: "0",
                                    step: "0.01",
                                    labelAlwaysVisible: true
                                }, void 0, false, {
                                    fileName: "[project]/paddy/cargo/src/components/weighing/TruckDispatchForm.tsx",
                                    lineNumber: 398,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$shared$2f$components$2f$ui$2f$Button$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    type: "submit",
                                    variant: "primary",
                                    className: "w-full mt-6",
                                    disabled: isLoading,
                                    children: isLoading ? 'Guardando...' : 'Guardar despacho'
                                }, void 0, false, {
                                    fileName: "[project]/paddy/cargo/src/components/weighing/TruckDispatchForm.tsx",
                                    lineNumber: 411,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/paddy/cargo/src/components/weighing/TruckDispatchForm.tsx",
                            lineNumber: 286,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/paddy/cargo/src/components/weighing/TruckDispatchForm.tsx",
                    lineNumber: 284,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$components$2f$producers$2f$CreateProducerDialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    open: createProducerDialogOpen,
                    onClose: ()=>setCreateProducerDialogOpen(false),
                    onSuccess: handleProducerCreated
                }, void 0, false, {
                    fileName: "[project]/paddy/cargo/src/components/weighing/TruckDispatchForm.tsx",
                    lineNumber: 417,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true);
    }
    if (mode === 'gross' && selected) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-background rounded-lg border border-border p-6 h-full overflow-y-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "text-lg font-bold text-foreground mb-2",
                    children: "Registrar peso bruto"
                }, void 0, false, {
                    fileName: "[project]/paddy/cargo/src/components/weighing/TruckDispatchForm.tsx",
                    lineNumber: 429,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-2 gap-3 mb-6 p-4 bg-neutral/5 rounded-lg",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "col-span-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "text-xs font-medium text-muted-foreground",
                                    children: "ID despacho"
                                }, void 0, false, {
                                    fileName: "[project]/paddy/cargo/src/components/weighing/TruckDispatchForm.tsx",
                                    lineNumber: 432,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-lg font-semibold text-foreground",
                                    children: [
                                        "#",
                                        selected.id
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/paddy/cargo/src/components/weighing/TruckDispatchForm.tsx",
                                    lineNumber: 433,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/paddy/cargo/src/components/weighing/TruckDispatchForm.tsx",
                            lineNumber: 431,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "text-xs font-medium text-muted-foreground",
                                    children: "Patente"
                                }, void 0, false, {
                                    fileName: "[project]/paddy/cargo/src/components/weighing/TruckDispatchForm.tsx",
                                    lineNumber: 436,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm font-semibold text-foreground",
                                    children: selected.license_plate
                                }, void 0, false, {
                                    fileName: "[project]/paddy/cargo/src/components/weighing/TruckDispatchForm.tsx",
                                    lineNumber: 437,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/paddy/cargo/src/components/weighing/TruckDispatchForm.tsx",
                            lineNumber: 435,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "col-span-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "text-xs font-medium text-muted-foreground",
                                    children: "Producto"
                                }, void 0, false, {
                                    fileName: "[project]/paddy/cargo/src/components/weighing/TruckDispatchForm.tsx",
                                    lineNumber: 440,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm font-semibold text-foreground",
                                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$lib$2f$logisticsProduct$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatLogisticsProductLabel"])(selected.product)
                                }, void 0, false, {
                                    fileName: "[project]/paddy/cargo/src/components/weighing/TruckDispatchForm.tsx",
                                    lineNumber: 441,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/paddy/cargo/src/components/weighing/TruckDispatchForm.tsx",
                            lineNumber: 439,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/paddy/cargo/src/components/weighing/TruckDispatchForm.tsx",
                    lineNumber: 430,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-3 mb-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1 bg-neutral/10 rounded-lg p-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "text-xs text-muted-foreground",
                                    children: "Tara"
                                }, void 0, false, {
                                    fileName: "[project]/paddy/cargo/src/components/weighing/TruckDispatchForm.tsx",
                                    lineNumber: 449,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-lg font-bold text-foreground",
                                    children: [
                                        selected.tare_weight != null ? Number(selected.tare_weight).toLocaleString('es-CL', {
                                            maximumFractionDigits: 2
                                        }) : '—',
                                        ' ',
                                        "kg"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/paddy/cargo/src/components/weighing/TruckDispatchForm.tsx",
                                    lineNumber: 450,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/paddy/cargo/src/components/weighing/TruckDispatchForm.tsx",
                            lineNumber: 448,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1 bg-neutral/10 rounded-lg p-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "text-xs text-muted-foreground",
                                    children: "Bruto"
                                }, void 0, false, {
                                    fileName: "[project]/paddy/cargo/src/components/weighing/TruckDispatchForm.tsx",
                                    lineNumber: 460,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-lg font-bold text-foreground",
                                    children: [
                                        formData.gross_weight ? Number(formData.gross_weight).toLocaleString('es-CL', {
                                            maximumFractionDigits: 2
                                        }) : '—',
                                        ' ',
                                        "kg"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/paddy/cargo/src/components/weighing/TruckDispatchForm.tsx",
                                    lineNumber: 461,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/paddy/cargo/src/components/weighing/TruckDispatchForm.tsx",
                            lineNumber: 459,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1 bg-primary/10 rounded-lg p-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "text-xs text-primary",
                                    children: "Neto"
                                }, void 0, false, {
                                    fileName: "[project]/paddy/cargo/src/components/weighing/TruckDispatchForm.tsx",
                                    lineNumber: 471,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-lg font-bold text-primary",
                                    children: [
                                        netPreview != null && Number.isFinite(netPreview) ? netPreview.toLocaleString('es-CL', {
                                            maximumFractionDigits: 2
                                        }) : '—',
                                        ' ',
                                        "kg"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/paddy/cargo/src/components/weighing/TruckDispatchForm.tsx",
                                    lineNumber: 472,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/paddy/cargo/src/components/weighing/TruckDispatchForm.tsx",
                            lineNumber: 470,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/paddy/cargo/src/components/weighing/TruckDispatchForm.tsx",
                    lineNumber: 447,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                    onSubmit: handleGrossSubmit,
                    className: "space-y-4",
                    children: [
                        successMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$shared$2f$components$2f$ui$2f$Alert$2f$Alert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            variant: "success",
                            className: "mb-4",
                            children: successMessage
                        }, void 0, false, {
                            fileName: "[project]/paddy/cargo/src/components/weighing/TruckDispatchForm.tsx",
                            lineNumber: 483,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$shared$2f$components$2f$ui$2f$Alert$2f$Alert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            variant: "error",
                            className: "mb-4",
                            children: error
                        }, void 0, false, {
                            fileName: "[project]/paddy/cargo/src/components/weighing/TruckDispatchForm.tsx",
                            lineNumber: 488,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$shared$2f$components$2f$ui$2f$TextField$2f$TextField$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextField"], {
                            label: "Peso bruto (kg) *",
                            type: "number",
                            value: formData.gross_weight,
                            onChange: (e)=>setFormData((prev)=>({
                                        ...prev,
                                        gross_weight: e.target.value
                                    })),
                            disabled: isLoading,
                            min: "0",
                            step: "0.01",
                            labelAlwaysVisible: true
                        }, void 0, false, {
                            fileName: "[project]/paddy/cargo/src/components/weighing/TruckDispatchForm.tsx",
                            lineNumber: 493,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$shared$2f$components$2f$ui$2f$Button$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            type: "submit",
                            variant: "primary",
                            className: "w-full",
                            disabled: isLoading,
                            children: isLoading ? 'Finalizando...' : 'Finalizar despacho'
                        }, void 0, false, {
                            fileName: "[project]/paddy/cargo/src/components/weighing/TruckDispatchForm.tsx",
                            lineNumber: 506,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$shared$2f$components$2f$ui$2f$Button$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            type: "button",
                            variant: "outlined",
                            className: "w-full",
                            disabled: isLoading,
                            onClick: ()=>onCancel?.(),
                            children: "Cancelar"
                        }, void 0, false, {
                            fileName: "[project]/paddy/cargo/src/components/weighing/TruckDispatchForm.tsx",
                            lineNumber: 509,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/paddy/cargo/src/components/weighing/TruckDispatchForm.tsx",
                    lineNumber: 481,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/paddy/cargo/src/components/weighing/TruckDispatchForm.tsx",
            lineNumber: 428,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-background rounded-lg border border-border p-6 h-full flex items-center justify-center",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-muted-foreground text-center text-sm",
            children: "Selecciona un despacho para registrar el bruto"
        }, void 0, false, {
            fileName: "[project]/paddy/cargo/src/components/weighing/TruckDispatchForm.tsx",
            lineNumber: 525,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/paddy/cargo/src/components/weighing/TruckDispatchForm.tsx",
        lineNumber: 524,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(TruckDispatchForm, "RXXj0b5vtqOIClTs3879nW4jYxI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$providers$2f$DispatchWeighingPageProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDispatchWeighingPage"]
    ];
});
_c = TruckDispatchForm;
var _c;
__turbopack_context__.k.register(_c, "TruckDispatchForm");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/paddy/cargo/src/shared/components/ui/Badge/Badge.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
const variantStyles = {
    primary: 'bg-primary text-white',
    secondary: 'bg-secondary text-white',
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    warning: 'bg-yellow-500 text-white',
    info: 'bg-blue-500 text-white',
    'primary-outlined': 'border border-primary text-primary bg-transparent',
    'secondary-outlined': 'border border-secondary text-secondary bg-transparent',
    'success-outlined': 'border border-green-500 text-green-500 bg-transparent',
    'error-outlined': 'border border-red-500 text-red-500 bg-transparent',
    'warning-outlined': 'border border-yellow-500 text-yellow-500 bg-transparent',
    'info-outlined': 'border border-blue-500 text-blue-500 bg-transparent'
};
const Badge = ({ children, variant = 'primary', className = '' })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantStyles[variant]} ${className}`,
        children: children
    }, void 0, false, {
        fileName: "[project]/paddy/cargo/src/shared/components/ui/Badge/Badge.tsx",
        lineNumber: 28,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = Badge;
const __TURBOPACK__default__export__ = Badge;
var _c;
__turbopack_context__.k.register(_c, "Badge");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/paddy/cargo/src/components/weighing/DispatchTruckList.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DispatchTruckList",
    ()=>DispatchTruckList
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$lib$2f$logisticsProduct$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/src/lib/logisticsProduct.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$shared$2f$components$2f$ui$2f$Badge$2f$Badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/src/shared/components/ui/Badge/Badge.tsx [app-client] (ecmascript)");
'use client';
;
;
;
const DispatchTruckList = ({ dispatches, selectedId, onSelect })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-background rounded-lg border border-border p-4 h-full overflow-y-auto",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between mb-6 gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-lg font-bold text-foreground",
                        children: "En espera (registrar bruto)"
                    }, void 0, false, {
                        fileName: "[project]/paddy/cargo/src/components/weighing/DispatchTruckList.tsx",
                        lineNumber: 22,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$shared$2f$components$2f$ui$2f$Badge$2f$Badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        variant: "secondary",
                        className: "text-sm",
                        children: dispatches.length
                    }, void 0, false, {
                        fileName: "[project]/paddy/cargo/src/components/weighing/DispatchTruckList.tsx",
                        lineNumber: 23,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/paddy/cargo/src/components/weighing/DispatchTruckList.tsx",
                lineNumber: 21,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-xs text-muted-foreground mb-3",
                children: "Selecciona un despacho para pesar el bruto y finalizar."
            }, void 0, false, {
                fileName: "[project]/paddy/cargo/src/components/weighing/DispatchTruckList.tsx",
                lineNumber: 28,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-3",
                children: dispatches.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-center py-12",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-muted-foreground",
                        children: "Sin despachos pendientes"
                    }, void 0, false, {
                        fileName: "[project]/paddy/cargo/src/components/weighing/DispatchTruckList.tsx",
                        lineNumber: 35,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/paddy/cargo/src/components/weighing/DispatchTruckList.tsx",
                    lineNumber: 34,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0)) : dispatches.map((d)=>{
                    const isSelected = selectedId === d.id;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>onSelect(d.id),
                        className: [
                            'w-full text-left rounded-lg border-2 p-4 transition-all',
                            isSelected ? 'border-primary bg-primary/10 ring-2 ring-primary shadow-md' : 'border-border bg-card hover:border-primary/40'
                        ].join(' '),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-start justify-between gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-muted-foreground",
                                                children: "Folio"
                                            }, void 0, false, {
                                                fileName: "[project]/paddy/cargo/src/components/weighing/DispatchTruckList.tsx",
                                                lineNumber: 54,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-lg font-bold text-foreground",
                                                children: [
                                                    "#",
                                                    d.id
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/paddy/cargo/src/components/weighing/DispatchTruckList.tsx",
                                                lineNumber: 55,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/paddy/cargo/src/components/weighing/DispatchTruckList.tsx",
                                        lineNumber: 53,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$shared$2f$components$2f$ui$2f$Badge$2f$Badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        variant: "secondary",
                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$lib$2f$logisticsProduct$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatLogisticsProductLabel"])(d.product)
                                    }, void 0, false, {
                                        fileName: "[project]/paddy/cargo/src/components/weighing/DispatchTruckList.tsx",
                                        lineNumber: 57,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/paddy/cargo/src/components/weighing/DispatchTruckList.tsx",
                                lineNumber: 52,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-2 font-mono text-sm font-semibold",
                                children: d.license_plate
                            }, void 0, false, {
                                fileName: "[project]/paddy/cargo/src/components/weighing/DispatchTruckList.tsx",
                                lineNumber: 59,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0)),
                            d.producer && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-muted-foreground mt-1",
                                children: [
                                    d.producer.name,
                                    " · ",
                                    d.producer.rut
                                ]
                            }, void 0, true, {
                                fileName: "[project]/paddy/cargo/src/components/weighing/DispatchTruckList.tsx",
                                lineNumber: 61,
                                columnNumber: 19
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-3 flex gap-4 text-sm",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-muted-foreground",
                                            children: "Tara: "
                                        }, void 0, false, {
                                            fileName: "[project]/paddy/cargo/src/components/weighing/DispatchTruckList.tsx",
                                            lineNumber: 67,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-semibold",
                                            children: [
                                                d.tare_weight != null ? Number(d.tare_weight).toLocaleString('es-CL', {
                                                    maximumFractionDigits: 2
                                                }) : '—',
                                                ' ',
                                                "kg"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/paddy/cargo/src/components/weighing/DispatchTruckList.tsx",
                                            lineNumber: 68,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/paddy/cargo/src/components/weighing/DispatchTruckList.tsx",
                                    lineNumber: 66,
                                    columnNumber: 19
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/paddy/cargo/src/components/weighing/DispatchTruckList.tsx",
                                lineNumber: 65,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, d.id, true, {
                        fileName: "[project]/paddy/cargo/src/components/weighing/DispatchTruckList.tsx",
                        lineNumber: 41,
                        columnNumber: 15
                    }, ("TURBOPACK compile-time value", void 0));
                })
            }, void 0, false, {
                fileName: "[project]/paddy/cargo/src/components/weighing/DispatchTruckList.tsx",
                lineNumber: 32,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/paddy/cargo/src/components/weighing/DispatchTruckList.tsx",
        lineNumber: 20,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = DispatchTruckList;
var _c;
__turbopack_context__.k.register(_c, "DispatchTruckList");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/paddy/cargo/src/app/despachos/ui/DespachoWeighingClient.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DespachoWeighingClient",
    ()=>DespachoWeighingClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$shared$2f$components$2f$ui$2f$Alert$2f$Alert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/src/shared/components/ui/Alert/Alert.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$components$2f$layout$2f$TmsAppLayout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/src/components/layout/TmsAppLayout.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$providers$2f$DispatchWeighingPageProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/src/providers/DispatchWeighingPageProvider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$components$2f$weighing$2f$TruckDispatchForm$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/src/components/weighing/TruckDispatchForm.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$components$2f$weighing$2f$DispatchTruckList$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/src/components/weighing/DispatchTruckList.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
const DespachoWeighingClient = ()=>{
    _s();
    const { dispatches, selectedDispatchId, error, selectDispatch, clearError, loadDispatchesToday } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$providers$2f$DispatchWeighingPageProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDispatchWeighingPage"])();
    const { isConnected: serialConnected, lastWeight } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$components$2f$layout$2f$TmsAppLayout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTmsSerialPort"])();
    const selected = dispatches.find((d)=>d.id === selectedDispatchId) ?? null;
    const formMode = selectedDispatchId ? 'gross' : 'create';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "flex-1 p-6 overflow-hidden",
        children: [
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$shared$2f$components$2f$ui$2f$Alert$2f$Alert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                variant: "error",
                className: "mb-4",
                children: [
                    error,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: clearError,
                        className: "ml-2 underline text-sm",
                        children: "Cerrar"
                    }, void 0, false, {
                        fileName: "[project]/paddy/cargo/src/app/despachos/ui/DespachoWeighingClient.tsx",
                        lineNumber: 31,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/paddy/cargo/src/app/despachos/ui/DespachoWeighingClient.tsx",
                lineNumber: 29,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-2xl font-bold text-foreground tracking-tight",
                        children: "Despacho de carga"
                    }, void 0, false, {
                        fileName: "[project]/paddy/cargo/src/app/despachos/ui/DespachoWeighingClient.tsx",
                        lineNumber: 38,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/despachos/lista",
                        className: "btn-text cursor-pointer px-4 py-2 text-sm inline-flex items-center justify-center rounded-md",
                        children: "Lista de despachos"
                    }, void 0, false, {
                        fileName: "[project]/paddy/cargo/src/app/despachos/ui/DespachoWeighingClient.tsx",
                        lineNumber: 39,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/paddy/cargo/src/app/despachos/ui/DespachoWeighingClient.tsx",
                lineNumber: 37,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-220px)]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "lg:col-span-1 overflow-auto",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$components$2f$weighing$2f$TruckDispatchForm$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TruckDispatchForm"], {
                            mode: formMode,
                            selected: selected,
                            serialWeight: lastWeight,
                            isSerialConnected: serialConnected,
                            onCancel: ()=>selectDispatch(null),
                            onGrossFinalized: ()=>{
                                void loadDispatchesToday();
                            }
                        }, void 0, false, {
                            fileName: "[project]/paddy/cargo/src/app/despachos/ui/DespachoWeighingClient.tsx",
                            lineNumber: 49,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/paddy/cargo/src/app/despachos/ui/DespachoWeighingClient.tsx",
                        lineNumber: 48,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "lg:col-span-1 overflow-auto",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$components$2f$weighing$2f$DispatchTruckList$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DispatchTruckList"], {
                            dispatches: dispatches,
                            selectedId: selectedDispatchId,
                            onSelect: (id)=>selectDispatch(id)
                        }, void 0, false, {
                            fileName: "[project]/paddy/cargo/src/app/despachos/ui/DespachoWeighingClient.tsx",
                            lineNumber: 61,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/paddy/cargo/src/app/despachos/ui/DespachoWeighingClient.tsx",
                        lineNumber: 60,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/paddy/cargo/src/app/despachos/ui/DespachoWeighingClient.tsx",
                lineNumber: 47,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/paddy/cargo/src/app/despachos/ui/DespachoWeighingClient.tsx",
        lineNumber: 27,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(DespachoWeighingClient, "AQb+phbFfk4bsjfXGp+GEzqKYec=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$providers$2f$DispatchWeighingPageProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDispatchWeighingPage"],
        __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$components$2f$layout$2f$TmsAppLayout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTmsSerialPort"]
    ];
});
_c = DespachoWeighingClient;
var _c;
__turbopack_context__.k.register(_c, "DespachoWeighingClient");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=paddy_cargo_src_2bdeae7e._.js.map