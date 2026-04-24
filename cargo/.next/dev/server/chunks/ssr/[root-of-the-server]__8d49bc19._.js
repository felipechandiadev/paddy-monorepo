module.exports = [
"[project]/paddy/paddy-tms/src/services/serialPortConfigService.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "serialPortConfigStorage",
    ()=>serialPortConfigStorage
]);
const SERIAL_CONFIG_KEY = 'paddy_serial_config';
const serialPortConfigStorage = {
    // Obtener configuración guardada
    getConfig () {
        if ("TURBOPACK compile-time truthy", 1) {
            return null;
        }
        //TURBOPACK unreachable
        ;
    },
    // Guardar configuración
    saveConfig (config) {
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
    },
    // Obtener puerto guardado
    getLastPort () {
        const config = this.getConfig();
        return config?.port || null;
    },
    // Limpiar configuración
    clearConfig () {
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
    }
};
}),
"[project]/paddy/paddy-tms/src/services/serialPort.service.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$serialPortConfigService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/services/serialPortConfigService.ts [app-ssr] (ecmascript)");
'use client';
;
const DEBUG_SERIAL = typeof process !== 'undefined' && ("TURBOPACK compile-time value", "development") === 'development';
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
        const cfg = __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$serialPortConfigService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serialPortConfigStorage"].getConfig();
        const n = cfg?.baudRate;
        return typeof n === 'number' && n > 0 ? n : 9600;
    }
    getConfiguredDataBits() {
        const cfg = __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$serialPortConfigService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serialPortConfigStorage"].getConfig();
        const d = cfg?.dataBits;
        return d === 7 || d === 8 ? d : 7;
    }
    getConfiguredParity() {
        const cfg = __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$serialPortConfigService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serialPortConfigStorage"].getConfig();
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
        if ("TURBOPACK compile-time truthy", 1) return false;
        //TURBOPACK unreachable
        ;
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
}),
"[project]/paddy/paddy-tms/src/hooks/useSerialPort.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useSerialPort",
    ()=>useSerialPort
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$serialPort$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/services/serialPort.service.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$serialPortConfigService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/services/serialPortConfigService.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
function persistSerialConfig() {
    const fp = __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$serialPort$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serialPortService"].getPortFingerprint();
    const prev = __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$serialPortConfigService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serialPortConfigStorage"].getConfig();
    __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$serialPortConfigService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serialPortConfigStorage"].saveConfig({
        port: fp || 'serial',
        baudRate: prev?.baudRate ?? 9600,
        dataBits: prev?.dataBits === 8 ? 8 : 7,
        stopBits: 1,
        parity: prev?.parity === 'even' || prev?.parity === 'odd' ? prev.parity : 'none',
        lastUsed: new Date().toISOString()
    });
}
function useSerialPort(enabled = false) {
    const [isConnected, setIsConnected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isConnecting, setIsConnecting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [lastWeight, setLastWeight] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [lastRawSample, setLastRawSample] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [bytesReceivedTotal, setBytesReceivedTotal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const pollingIntervalRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const isConnectedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    /** Evita que el efecto de auto-conexión vuelva a conectar tras un Desconectar explícito */ const suppressAutoConnectRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        isConnectedRef.current = isConnected;
    }, [
        isConnected
    ]);
    // Verificar disponibilidad de Serial API
    const isAvailable = __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$serialPort$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serialPortService"].isAvailable();
    const configuredBaudRate = __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$serialPort$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serialPortService"].getConfiguredBaudRate();
    const configuredDataBits = __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$serialPort$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serialPortService"].getConfiguredDataBits();
    const configuredParity = __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$serialPort$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serialPortService"].getConfiguredParity();
    // Conectar
    const connect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
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
            const success = await __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$serialPort$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serialPortService"].connect();
            if (success) {
                suppressAutoConnectRef.current = false;
                setIsConnected(true);
                persistSerialConfig();
                const interval = setInterval(()=>{
                    if (!__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$serialPort$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serialPortService"].getIsConnected() && isConnectedRef.current) {
                        isConnectedRef.current = false;
                        suppressAutoConnectRef.current = true;
                        setIsConnected(false);
                        const lost = __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$serialPort$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serialPortService"].getConnectionLostMessage();
                        if (lost) {
                            setError(lost);
                        }
                        if (pollingIntervalRef.current) {
                            clearInterval(pollingIntervalRef.current);
                            pollingIntervalRef.current = null;
                        }
                        return;
                    }
                    const weight = __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$serialPort$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serialPortService"].readWeight();
                    if (weight !== null) {
                        setLastWeight(weight);
                    }
                    setLastRawSample(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$serialPort$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serialPortService"].getLastRawSample());
                    setBytesReceivedTotal(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$serialPort$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serialPortService"].getBytesReceivedTotal());
                }, 100);
                pollingIntervalRef.current = interval;
            } else {
                suppressAutoConnectRef.current = true;
                setError(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$serialPort$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serialPortService"].getConnectionLostMessage() || 'No se pudo conectar al puerto serial');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            setError(`Error conectando: ${errorMessage}`);
        } finally{
            setIsConnecting(false);
        }
    }, [
        isConnected,
        isAvailable
    ]);
    const connectChoosingPort = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
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
            const success = await __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$serialPort$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serialPortService"].connectChoosingPort();
            if (success) {
                suppressAutoConnectRef.current = false;
                setIsConnected(true);
                persistSerialConfig();
                const interval = setInterval(()=>{
                    if (!__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$serialPort$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serialPortService"].getIsConnected() && isConnectedRef.current) {
                        isConnectedRef.current = false;
                        suppressAutoConnectRef.current = true;
                        setIsConnected(false);
                        const lost = __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$serialPort$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serialPortService"].getConnectionLostMessage();
                        if (lost) {
                            setError(lost);
                        }
                        if (pollingIntervalRef.current) {
                            clearInterval(pollingIntervalRef.current);
                            pollingIntervalRef.current = null;
                        }
                        return;
                    }
                    const weight = __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$serialPort$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serialPortService"].readWeight();
                    if (weight !== null) {
                        setLastWeight(weight);
                    }
                    setLastRawSample(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$serialPort$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serialPortService"].getLastRawSample());
                    setBytesReceivedTotal(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$serialPort$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serialPortService"].getBytesReceivedTotal());
                }, 100);
                pollingIntervalRef.current = interval;
            } else {
                setIsConnected(false);
                suppressAutoConnectRef.current = true;
                setError(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$serialPort$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serialPortService"].getConnectionLostMessage() || 'No se pudo conectar o se canceló la selección del puerto');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            setError(`Error: ${errorMessage}`);
            setIsConnected(false);
        } finally{
            setIsConnecting(false);
        }
    }, [
        isAvailable
    ]);
    // Desconectar
    const disconnect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        try {
            suppressAutoConnectRef.current = true;
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
                pollingIntervalRef.current = null;
            }
            await __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$serialPort$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serialPortService"].disconnect();
            setIsConnected(false);
            setLastWeight(null);
            setLastRawSample(null);
            setBytesReceivedTotal(0);
            setError(null);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            setError(`Error desconectando: ${errorMessage}`);
        }
    }, []);
    // Leer peso
    const readWeight = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        const weight = __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$serialPort$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serialPortService"].readWeight();
        if (weight !== null) {
            setLastWeight(weight);
        }
        return weight;
    }, []);
    // Enviar comando
    const sendCommand = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (command)=>{
        return await __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$serialPort$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serialPortService"].sendCommand(command);
    }, []);
    // Auto-conectar si enabled es true (no tras desconectar manualmente en esta sesión)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (enabled && isAvailable && !isConnected && !suppressAutoConnectRef.current) {
            connect();
        }
    }, [
        enabled,
        isAvailable,
        isConnected,
        connect
    ]);
    // Cleanup al desmontar
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        return ()=>{
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
            }
        };
    }, []);
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
}),
"[project]/paddy/paddy-tms/src/shared/components/ui/Button/Button.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        className: buttonClasses,
        "data-test-id": "button-root",
        disabled: disabled || loading,
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center gap-2",
            children: [
                loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    className: "animate-spin h-4 w-4 text-current",
                    xmlns: "http://www.w3.org/2000/svg",
                    fill: "none",
                    viewBox: "0 0 24 24",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                            className: "opacity-25",
                            cx: "12",
                            cy: "12",
                            r: "10",
                            stroke: "currentColor",
                            strokeWidth: "4"
                        }, void 0, false, {
                            fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/Button/Button.tsx",
                            lineNumber: 65,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            className: "opacity-75",
                            fill: "currentColor",
                            d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        }, void 0, false, {
                            fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/Button/Button.tsx",
                            lineNumber: 66,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/Button/Button.tsx",
                    lineNumber: 64,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0)),
                children
            ]
        }, void 0, true, {
            fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/Button/Button.tsx",
            lineNumber: 62,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/Button/Button.tsx",
        lineNumber: 56,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/paddy/paddy-tms/src/shared/components/ui/Dialog/Dialog.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-dom.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$Button$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/shared/components/ui/Button/Button.tsx [app-ssr] (ecmascript)");
;
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
    const [isVisible, setIsVisible] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [shouldRender, setShouldRender] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setMounted(true);
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (open) {
            setShouldRender(true);
            setTimeout(()=>setIsVisible(true), 10);
        } else {
            setIsVisible(false);
            setTimeout(()=>setShouldRender(false), animationDuration);
        }
    }, [
        open,
        animationDuration
    ]);
    // Bloquear/restaurar scroll del body cuando el dialog se abre/cierra
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (open) {
            // Guardar el overflow original del body
            const originalOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            // Restaurar al desmontar o cerrar
            return ()=>{
                document.body.style.overflow = originalOverflow;
            };
        }
    }, [
        open
    ]);
    // Handle ESC key
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!open || persistent) return;
        const handleKeyDown = (event)=>{
            if (event.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return ()=>document.removeEventListener('keydown', handleKeyDown);
    }, [
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createPortal"])(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        role: "dialog",
        "aria-modal": "true",
        "aria-label": typeof title === 'string' ? title || 'Dialog' : 'Dialog',
        className: `fixed inset-0 transition-all bg-black/70 ${isVisible ? 'opacity-100' : 'opacity-0'} ${rootScrollClasses}`,
        style: backdropStyle,
        onClick: handleBackdropClick,
        "data-test-id": "dialog-root",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: contentClass,
            style: contentWrapperStyle,
            onClick: (e)=>e.stopPropagation(),
            "data-test-id": dataTestId || 'dialog-content',
            children: [
                title != null && title !== '' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `flex items-center mb-2 p-4 pb-0 ${headerClassName}`.trim(),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: `title p-1 flex-1 ${titleClassName}`.trim(),
                            "data-test-id": "dialog-title",
                            children: title
                        }, void 0, false, {
                            fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/Dialog/Dialog.tsx",
                            lineNumber: 278,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        showCloseButton && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-end w-auto",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$Button$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "outlined",
                                size: "sm",
                                onClick: handleCloseButtonClick,
                                className: "ml-2",
                                children: closeButtonText
                            }, void 0, false, {
                                fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/Dialog/Dialog.tsx",
                                lineNumber: 283,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/Dialog/Dialog.tsx",
                            lineNumber: 282,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/Dialog/Dialog.tsx",
                    lineNumber: 277,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `w-full ${title && title !== '' ? 'pt-2 px-4 pb-4' : 'pt-0'} ${scroll === 'paper' ? 'flex-1 overflow-y-auto' : ''} ${bodyClassName}`.trim(),
                    "data-test-id": "dialog-body",
                    children: children
                }, void 0, false, {
                    fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/Dialog/Dialog.tsx",
                    lineNumber: 296,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                !hideActions && actions && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-full shrink-0 border-t border-gray-200 bg-white px-6 py-4",
                    "data-test-id": "dialog-actions",
                    children: actions
                }, void 0, false, {
                    fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/Dialog/Dialog.tsx",
                    lineNumber: 305,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/Dialog/Dialog.tsx",
            lineNumber: 270,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/Dialog/Dialog.tsx",
        lineNumber: 261,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0)), document.body);
};
const __TURBOPACK__default__export__ = Dialog;
}),
"[project]/paddy/paddy-tms/src/components/weighing/SerialPortConfigDialog.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SerialPortConfigDialog",
    ()=>SerialPortConfigDialog
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$Dialog$2f$Dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/shared/components/ui/Dialog/Dialog.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$Button$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/shared/components/ui/Button/Button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$serialPort$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/services/serialPort.service.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$serialPortConfigService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/services/serialPortConfigService.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
const SerialPortConfigDialog = ({ open, onClose, isConnected, isAvailable, isConnecting, dialogError, onChoosePort, onDisconnect })=>{
    const [savedPortLabel, setSavedPortLabel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [baudRate, setBaudRate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(9600);
    const [dataBits, setDataBits] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(7);
    const [parity, setParity] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('none');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (open) {
            const cfg = __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$serialPortConfigService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serialPortConfigStorage"].getConfig();
            setSavedPortLabel(cfg?.port ?? null);
            setBaudRate(cfg?.baudRate && cfg.baudRate > 0 ? cfg.baudRate : 9600);
            setDataBits(cfg?.dataBits === 8 ? 8 : 7);
            setParity(cfg?.parity === 'even' || cfg?.parity === 'odd' ? cfg.parity : 'none');
        }
    }, [
        open
    ]);
    const persistLineSettings = (patch)=>{
        const prev = __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$serialPortConfigService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serialPortConfigStorage"].getConfig();
        const rate = patch.baudRate ?? prev?.baudRate ?? 9600;
        const bits = patch.dataBits ?? (prev?.dataBits === 8 ? 8 : 7);
        const par = patch.parity ?? (prev?.parity === 'even' || prev?.parity === 'odd' ? prev.parity : 'none');
        __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$serialPortConfigService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serialPortConfigStorage"].saveConfig({
            port: prev?.port ?? 'serial',
            baudRate: rate,
            dataBits: bits,
            stopBits: 1,
            parity: par,
            lastUsed: new Date().toISOString()
        });
    };
    const currentLabel = isConnected ? __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$serialPort$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serialPortService"].getPortFingerprint() : null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$Dialog$2f$Dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
        open: open,
        onClose: onClose,
        title: "Puerto serial — Balanza",
        size: "sm",
        showCloseButton: true,
        closeButtonText: "Cerrar",
        hideActions: true,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-4 text-sm text-foreground",
            children: [
                !isAvailable && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-muted-foreground",
                    children: "Tu navegador no soporta Web Serial API. Usa Chrome o Edge en HTTPS o localhost."
                }, void 0, false, {
                    fileName: "[project]/paddy/paddy-tms/src/components/weighing/SerialPortConfigDialog.tsx",
                    lineNumber: 78,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0)),
                isAvailable && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs font-medium text-muted-foreground mb-1",
                                    children: "Estado"
                                }, void 0, false, {
                                    fileName: "[project]/paddy/paddy-tms/src/components/weighing/SerialPortConfigDialog.tsx",
                                    lineNumber: 86,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "font-medium",
                                    children: isConnected ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-success",
                                        children: "Conectado"
                                    }, void 0, false, {
                                        fileName: "[project]/paddy/paddy-tms/src/components/weighing/SerialPortConfigDialog.tsx",
                                        lineNumber: 89,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-red-400",
                                        children: "Sin conexión"
                                    }, void 0, false, {
                                        fileName: "[project]/paddy/paddy-tms/src/components/weighing/SerialPortConfigDialog.tsx",
                                        lineNumber: 91,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/paddy/paddy-tms/src/components/weighing/SerialPortConfigDialog.tsx",
                                    lineNumber: 87,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/paddy/paddy-tms/src/components/weighing/SerialPortConfigDialog.tsx",
                            lineNumber: 85,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        currentLabel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs font-medium text-muted-foreground mb-1",
                                    children: "Puerto actual"
                                }, void 0, false, {
                                    fileName: "[project]/paddy/paddy-tms/src/components/weighing/SerialPortConfigDialog.tsx",
                                    lineNumber: 98,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "font-mono text-xs break-all",
                                    children: currentLabel
                                }, void 0, false, {
                                    fileName: "[project]/paddy/paddy-tms/src/components/weighing/SerialPortConfigDialog.tsx",
                                    lineNumber: 99,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/paddy/paddy-tms/src/components/weighing/SerialPortConfigDialog.tsx",
                            lineNumber: 97,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0)),
                        savedPortLabel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs font-medium text-muted-foreground mb-1",
                                    children: "Último guardado (local)"
                                }, void 0, false, {
                                    fileName: "[project]/paddy/paddy-tms/src/components/weighing/SerialPortConfigDialog.tsx",
                                    lineNumber: 105,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "font-mono text-xs break-all",
                                    children: savedPortLabel
                                }, void 0, false, {
                                    fileName: "[project]/paddy/paddy-tms/src/components/weighing/SerialPortConfigDialog.tsx",
                                    lineNumber: 106,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/paddy/paddy-tms/src/components/weighing/SerialPortConfigDialog.tsx",
                            lineNumber: 104,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    htmlFor: "serial-baud",
                                    className: "text-xs font-medium text-muted-foreground block mb-1",
                                    children: "Velocidad (baud rate)"
                                }, void 0, false, {
                                    fileName: "[project]/paddy/paddy-tms/src/components/weighing/SerialPortConfigDialog.tsx",
                                    lineNumber: 111,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    id: "serial-baud",
                                    className: "w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm",
                                    value: baudRate,
                                    onChange: (e)=>{
                                        const rate = Number(e.target.value);
                                        setBaudRate(rate);
                                        persistLineSettings({
                                            baudRate: rate
                                        });
                                    },
                                    children: __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$serialPort$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SERIAL_BAUD_RATES"].map((r)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: r,
                                            children: r
                                        }, r, false, {
                                            fileName: "[project]/paddy/paddy-tms/src/components/weighing/SerialPortConfigDialog.tsx",
                                            lineNumber: 125,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)))
                                }, void 0, false, {
                                    fileName: "[project]/paddy/paddy-tms/src/components/weighing/SerialPortConfigDialog.tsx",
                                    lineNumber: 114,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-muted-foreground mt-1",
                                    children: "Balanza 9600 / 7 bits: deje 9600 y 7 abajo. Tras cambiar línea serie, desconecte y vuelva a elegir el puerto."
                                }, void 0, false, {
                                    fileName: "[project]/paddy/paddy-tms/src/components/weighing/SerialPortConfigDialog.tsx",
                                    lineNumber: 130,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/paddy/paddy-tms/src/components/weighing/SerialPortConfigDialog.tsx",
                            lineNumber: 110,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    htmlFor: "serial-databits",
                                    className: "text-xs font-medium text-muted-foreground block mb-1",
                                    children: "Bits de datos"
                                }, void 0, false, {
                                    fileName: "[project]/paddy/paddy-tms/src/components/weighing/SerialPortConfigDialog.tsx",
                                    lineNumber: 137,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    id: "serial-databits",
                                    className: "w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm",
                                    value: dataBits,
                                    onChange: (e)=>{
                                        const bits = Number(e.target.value) === 8 ? 8 : 7;
                                        setDataBits(bits);
                                        persistLineSettings({
                                            dataBits: bits
                                        });
                                    },
                                    children: __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$serialPort$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SERIAL_DATA_BITS"].map((b)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: b,
                                            children: [
                                                b,
                                                " bits"
                                            ]
                                        }, b, true, {
                                            fileName: "[project]/paddy/paddy-tms/src/components/weighing/SerialPortConfigDialog.tsx",
                                            lineNumber: 151,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)))
                                }, void 0, false, {
                                    fileName: "[project]/paddy/paddy-tms/src/components/weighing/SerialPortConfigDialog.tsx",
                                    lineNumber: 140,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/paddy/paddy-tms/src/components/weighing/SerialPortConfigDialog.tsx",
                            lineNumber: 136,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    htmlFor: "serial-parity",
                                    className: "text-xs font-medium text-muted-foreground block mb-1",
                                    children: "Paridad"
                                }, void 0, false, {
                                    fileName: "[project]/paddy/paddy-tms/src/components/weighing/SerialPortConfigDialog.tsx",
                                    lineNumber: 159,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    id: "serial-parity",
                                    className: "w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm",
                                    value: parity,
                                    onChange: (e)=>{
                                        const v = e.target.value;
                                        const p = v === 'even' || v === 'odd' ? v : 'none';
                                        setParity(p);
                                        persistLineSettings({
                                            parity: p
                                        });
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "none",
                                            children: "Ninguna (N)"
                                        }, void 0, false, {
                                            fileName: "[project]/paddy/paddy-tms/src/components/weighing/SerialPortConfigDialog.tsx",
                                            lineNumber: 173,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "even",
                                            children: "Par (E)"
                                        }, void 0, false, {
                                            fileName: "[project]/paddy/paddy-tms/src/components/weighing/SerialPortConfigDialog.tsx",
                                            lineNumber: 174,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "odd",
                                            children: "Impar (O)"
                                        }, void 0, false, {
                                            fileName: "[project]/paddy/paddy-tms/src/components/weighing/SerialPortConfigDialog.tsx",
                                            lineNumber: 175,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/paddy/paddy-tms/src/components/weighing/SerialPortConfigDialog.tsx",
                                    lineNumber: 162,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-muted-foreground mt-1",
                                    children: "Si el texto llega corrupto con 7 bits, pruebe paridad par (7E1 es habitual en RS-232)."
                                }, void 0, false, {
                                    fileName: "[project]/paddy/paddy-tms/src/components/weighing/SerialPortConfigDialog.tsx",
                                    lineNumber: 177,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/paddy/paddy-tms/src/components/weighing/SerialPortConfigDialog.tsx",
                            lineNumber: 158,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs text-muted-foreground",
                            children: "El navegador pedirá permiso para el puerto. Puedes elegir otro dispositivo en cualquier momento."
                        }, void 0, false, {
                            fileName: "[project]/paddy/paddy-tms/src/components/weighing/SerialPortConfigDialog.tsx",
                            lineNumber: 182,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        dialogError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs text-red-600 bg-red-50 border border-red-100 rounded-md p-2",
                            children: dialogError
                        }, void 0, false, {
                            fileName: "[project]/paddy/paddy-tms/src/components/weighing/SerialPortConfigDialog.tsx",
                            lineNumber: 188,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col sm:flex-row gap-2 pt-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$Button$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "primary",
                                    className: "flex-1",
                                    disabled: !isAvailable || isConnecting,
                                    onClick: async ()=>{
                                        await onChoosePort();
                                    },
                                    children: isConnecting ? 'Conectando…' : isConnected ? 'Cambiar puerto' : 'Elegir puerto'
                                }, void 0, false, {
                                    fileName: "[project]/paddy/paddy-tms/src/components/weighing/SerialPortConfigDialog.tsx",
                                    lineNumber: 194,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$Button$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "outlined",
                                    className: "flex-1",
                                    disabled: !isConnected || isConnecting,
                                    onClick: async ()=>{
                                        await onDisconnect();
                                    },
                                    children: "Desconectar"
                                }, void 0, false, {
                                    fileName: "[project]/paddy/paddy-tms/src/components/weighing/SerialPortConfigDialog.tsx",
                                    lineNumber: 204,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/paddy/paddy-tms/src/components/weighing/SerialPortConfigDialog.tsx",
                            lineNumber: 193,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true)
            ]
        }, void 0, true, {
            fileName: "[project]/paddy/paddy-tms/src/components/weighing/SerialPortConfigDialog.tsx",
            lineNumber: 76,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/paddy/paddy-tms/src/components/weighing/SerialPortConfigDialog.tsx",
        lineNumber: 67,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/paddy/paddy-tms/src/components/layout/TmsAppLayout.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TmsAppLayout",
    ()=>TmsAppLayout,
    "useTmsSerialPort",
    ()=>useTmsSerialPort
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next-auth/react/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$hooks$2f$useSerialPort$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/hooks/useSerialPort.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$components$2f$weighing$2f$SerialPortConfigDialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/components/weighing/SerialPortConfigDialog.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
const TmsSerialPortContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(null);
function useTmsSerialPort() {
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(TmsSerialPortContext);
    if (!ctx) {
        throw new Error('useTmsSerialPort must be used within TmsAppLayout');
    }
    return ctx;
}
/** Pesaje en otra app/puerto (sobrescribir con NEXT_PUBLIC_WEIGHING_APP_URL). */ const WEIGHING_APP_URL = process.env.NEXT_PUBLIC_WEIGHING_APP_URL || 'http://localhost:3002/weighing';
const TmsAppLayout = ({ children, serialEnabled = false })=>{
    const serial = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$hooks$2f$useSerialPort$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSerialPort"])(serialEnabled);
    const { data: session } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSession"])();
    const { isConnected: serialConnected, isAvailable: serialAvailable, isConnecting: serialConnecting, error: serialError, connectChoosingPort, disconnect: disconnectSerial } = serial;
    const [serialDialogOpen, setSerialDialogOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const handleLogout = async ()=>{
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["signOut"])({
            redirect: false
        });
        window.location.href = '/';
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(TmsSerialPortContext.Provider, {
        value: serial,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-background flex flex-col",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                    className: "bg-background border-b border-border px-6 py-4 shadow-sm",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: "/weighing",
                                className: "flex items-center gap-4 hover:opacity-90 transition-opacity",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                        src: "/logo.svg",
                                        alt: "Paddy AyG",
                                        className: "h-8 w-auto"
                                    }, void 0, false, {
                                        fileName: "[project]/paddy/paddy-tms/src/components/layout/TmsAppLayout.tsx",
                                        lineNumber: 59,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-col",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-3xl font-bold text-primary",
                                                children: "Paddy AyG"
                                            }, void 0, false, {
                                                fileName: "[project]/paddy/paddy-tms/src/components/layout/TmsAppLayout.tsx",
                                                lineNumber: 61,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs text-muted-foreground -mt-1",
                                                children: "Recepción y despacho de carga"
                                            }, void 0, false, {
                                                fileName: "[project]/paddy/paddy-tms/src/components/layout/TmsAppLayout.tsx",
                                                lineNumber: 62,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/paddy/paddy-tms/src/components/layout/TmsAppLayout.tsx",
                                        lineNumber: 60,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/paddy/paddy-tms/src/components/layout/TmsAppLayout.tsx",
                                lineNumber: 58,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm text-muted-foreground",
                                        children: session?.user?.email
                                    }, void 0, false, {
                                        fileName: "[project]/paddy/paddy-tms/src/components/layout/TmsAppLayout.tsx",
                                        lineNumber: 67,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        className: `p-2 rounded-full transition-all duration-200 ${serialConnected ? 'bg-success/20 hover:bg-success/30' : 'bg-destructive/20 hover:bg-destructive/30'}`,
                                        title: serialConnected ? 'Balanza conectada - Clic para configurar' : 'Sin conexión - Clic para configurar',
                                        onClick: ()=>setSerialDialogOpen(true),
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            className: `w-5 h-5 transition-colors ${serialConnected ? 'text-success' : 'text-red-300'}`,
                                            fill: "none",
                                            stroke: "currentColor",
                                            viewBox: "0 0 24 24",
                                            strokeWidth: "2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                    x: "2",
                                                    y: "6",
                                                    width: "20",
                                                    height: "12",
                                                    rx: "1"
                                                }, void 0, false, {
                                                    fileName: "[project]/paddy/paddy-tms/src/components/layout/TmsAppLayout.tsx",
                                                    lineNumber: 92,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M6 18v2m3 0v-2m3 0v2m3 0v-2m3 0v2"
                                                }, void 0, false, {
                                                    fileName: "[project]/paddy/paddy-tms/src/components/layout/TmsAppLayout.tsx",
                                                    lineNumber: 93,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                    x1: "6",
                                                    y1: "10",
                                                    x2: "6",
                                                    y2: "14"
                                                }, void 0, false, {
                                                    fileName: "[project]/paddy/paddy-tms/src/components/layout/TmsAppLayout.tsx",
                                                    lineNumber: 94,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                    x1: "9",
                                                    y1: "10",
                                                    x2: "9",
                                                    y2: "14"
                                                }, void 0, false, {
                                                    fileName: "[project]/paddy/paddy-tms/src/components/layout/TmsAppLayout.tsx",
                                                    lineNumber: 95,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                    x1: "12",
                                                    y1: "10",
                                                    x2: "12",
                                                    y2: "14"
                                                }, void 0, false, {
                                                    fileName: "[project]/paddy/paddy-tms/src/components/layout/TmsAppLayout.tsx",
                                                    lineNumber: 96,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                    x1: "15",
                                                    y1: "10",
                                                    x2: "15",
                                                    y2: "14"
                                                }, void 0, false, {
                                                    fileName: "[project]/paddy/paddy-tms/src/components/layout/TmsAppLayout.tsx",
                                                    lineNumber: 97,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                    x1: "18",
                                                    y1: "10",
                                                    x2: "18",
                                                    y2: "14"
                                                }, void 0, false, {
                                                    fileName: "[project]/paddy/paddy-tms/src/components/layout/TmsAppLayout.tsx",
                                                    lineNumber: 98,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/paddy/paddy-tms/src/components/layout/TmsAppLayout.tsx",
                                            lineNumber: 83,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/paddy/paddy-tms/src/components/layout/TmsAppLayout.tsx",
                                        lineNumber: 69,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: WEIGHING_APP_URL,
                                        className: "group p-2 rounded-lg hover:bg-muted/60 transition-colors duration-200 inline-flex items-center justify-center",
                                        title: "Ir a recepción y pesaje",
                                        "aria-label": "Ir a recepción y pesaje",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "material-symbols-outlined text-[22px] leading-none text-foreground group-hover:text-primary transition-colors",
                                            children: "local_shipping"
                                        }, void 0, false, {
                                            fileName: "[project]/paddy/paddy-tms/src/components/layout/TmsAppLayout.tsx",
                                            lineNumber: 108,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/paddy/paddy-tms/src/components/layout/TmsAppLayout.tsx",
                                        lineNumber: 102,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        href: "/despachos",
                                        className: "group p-2 rounded-lg hover:bg-muted/60 transition-colors duration-200 inline-flex items-center justify-center",
                                        title: "Despacho",
                                        "aria-label": "Ir a despacho",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "material-symbols-outlined text-[22px] leading-none text-foreground group-hover:text-primary transition-colors",
                                            children: "outbox"
                                        }, void 0, false, {
                                            fileName: "[project]/paddy/paddy-tms/src/components/layout/TmsAppLayout.tsx",
                                            lineNumber: 119,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/paddy/paddy-tms/src/components/layout/TmsAppLayout.tsx",
                                        lineNumber: 113,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        className: "p-2 rounded-lg hover:bg-muted/60 transition-colors duration-200",
                                        title: "Cerrar sesión",
                                        onClick: handleLogout,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            className: "w-5 h-5 text-foreground hover:text-primary transition-colors",
                                            fill: "none",
                                            stroke: "currentColor",
                                            viewBox: "0 0 24 24",
                                            strokeWidth: "2",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                            }, void 0, false, {
                                                fileName: "[project]/paddy/paddy-tms/src/components/layout/TmsAppLayout.tsx",
                                                lineNumber: 137,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/paddy/paddy-tms/src/components/layout/TmsAppLayout.tsx",
                                            lineNumber: 130,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/paddy/paddy-tms/src/components/layout/TmsAppLayout.tsx",
                                        lineNumber: 124,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/paddy/paddy-tms/src/components/layout/TmsAppLayout.tsx",
                                lineNumber: 66,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/paddy/paddy-tms/src/components/layout/TmsAppLayout.tsx",
                        lineNumber: 57,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/paddy/paddy-tms/src/components/layout/TmsAppLayout.tsx",
                    lineNumber: 56,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$components$2f$weighing$2f$SerialPortConfigDialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SerialPortConfigDialog"], {
                    open: serialDialogOpen,
                    onClose: ()=>setSerialDialogOpen(false),
                    isConnected: serialConnected,
                    isAvailable: serialAvailable,
                    isConnecting: serialConnecting,
                    dialogError: serialError,
                    onChoosePort: connectChoosingPort,
                    onDisconnect: disconnectSerial
                }, void 0, false, {
                    fileName: "[project]/paddy/paddy-tms/src/components/layout/TmsAppLayout.tsx",
                    lineNumber: 144,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                children
            ]
        }, void 0, true, {
            fileName: "[project]/paddy/paddy-tms/src/components/layout/TmsAppLayout.tsx",
            lineNumber: 55,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/paddy/paddy-tms/src/components/layout/TmsAppLayout.tsx",
        lineNumber: 54,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/DataGridWrapper.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/shared/lib/app-dynamic.js [app-ssr] (ecmascript)");
;
'use client';
;
;
;
const DataGrid = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(async ()=>{}, {
    loadableGenerated: {
        modules: [
            "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/DataGrid.tsx [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false,
    loading: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center h-64 text-sm text-muted-foreground",
            children: "Cargando tabla…"
        }, void 0, false, {
            fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/DataGridWrapper.tsx",
            lineNumber: 10,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
});
const DataGridWrapper = (props)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Suspense"], {
        fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center h-64 text-sm text-muted-foreground",
            children: "Cargando tabla…"
        }, void 0, false, {
            fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/DataGridWrapper.tsx",
            lineNumber: 18,
            columnNumber: 9
        }, void 0),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(DataGrid, {
            ...props
        }, void 0, false, {
            fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/DataGridWrapper.tsx",
            lineNumber: 21,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/DataGridWrapper.tsx",
        lineNumber: 16,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = DataGridWrapper;
}),
"[project]/paddy/paddy-tms/src/shared/components/ui/IconButton/IconButton.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "button",
        className: `${variantClasses[variant] || variantClasses["containedPrimary"]} ${disabledClass} ${className} ${sizeClass}`,
        "data-test-id": "icon-button-root",
        onClick: onClick,
        "aria-label": ariaLabel,
        disabled: effectiveDisabled,
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: `material-symbols-outlined select-none ${iconSizeClass} ${isLoading ? 'animate-spin' : ''}`,
            "aria-hidden": true,
            children: isLoading ? 'progress_activity' : icon
        }, void 0, false, {
            fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/IconButton/IconButton.tsx",
            lineNumber: 51,
            columnNumber: 4
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/IconButton/IconButton.tsx",
        lineNumber: 42,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = IconButton;
}),
"[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/RowActions.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RowActions",
    ()=>RowActions,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$IconButton$2f$IconButton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/shared/components/ui/IconButton/IconButton.tsx [app-ssr] (ecmascript)");
'use client';
;
;
const RowActions = ({ row, column })=>{
    const handleEdit = ()=>{
        console.log('Editar fila:', row);
    // Aquí puedes implementar la lógica de edición
    // Por ejemplo: abrir un modal, navegar a una página de edición, etc.
    };
    const handleDelete = ()=>{
        console.log('Eliminar fila:', row);
    // Aquí puedes implementar la lógica de eliminación
    // Por ejemplo: mostrar confirmación, llamar a una API, etc.
    };
    const handleView = ()=>{
        console.log('Ver detalles de fila:', row);
    // Aquí puedes implementar la lógica de vista de detalles
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center gap-1 justify-center",
        "data-test-id": `data-grid-row-actions-${row.id ?? row._id ?? row.key ?? row.index}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$IconButton$2f$IconButton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                icon: "visibility",
                variant: "text",
                size: "sm",
                title: "Ver detalles",
                onClick: handleView,
                className: "text-blue-600 hover:text-blue-800"
            }, void 0, false, {
                fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/RowActions.tsx",
                lineNumber: 32,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$IconButton$2f$IconButton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                icon: "edit",
                variant: "text",
                size: "sm",
                title: "Editar",
                onClick: handleEdit,
                className: "text-green-600 hover:text-green-800"
            }, void 0, false, {
                fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/RowActions.tsx",
                lineNumber: 40,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$IconButton$2f$IconButton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                icon: "delete",
                variant: "text",
                size: "sm",
                title: "Eliminar",
                onClick: handleDelete,
                className: "text-red-600 hover:text-red-800"
            }, void 0, false, {
                fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/RowActions.tsx",
                lineNumber: 48,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/RowActions.tsx",
        lineNumber: 31,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = RowActions;
}),
"[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$DataGrid$2f$DataGridWrapper$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/DataGridWrapper.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$DataGrid$2f$components$2f$RowActions$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/RowActions.tsx [app-ssr] (ecmascript)");
;
;
}),
"[project]/paddy/paddy-tms/src/actions/data:383e40 [app-ssr] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "deleteTruckDispatchAction",
    ()=>$$RSC_SERVER_ACTION_5
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-ssr] (ecmascript)");
/* __next_internal_action_entry_do_not_use__ [{"4008740128d2b7217abdaaf674da3a0715df844cde":"deleteTruckDispatchAction"},"paddy/paddy-tms/src/actions/truckDispatchActions.ts",""] */ "use turbopack no side effects";
;
const $$RSC_SERVER_ACTION_5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createServerReference"])("4008740128d2b7217abdaaf674da3a0715df844cde", __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findSourceMapURL"], "deleteTruckDispatchAction");
;
 //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vdHJ1Y2tEaXNwYXRjaEFjdGlvbnMudHMiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzZXJ2ZXInO1xuXG5pbXBvcnQgeyBnZXRTZXJ2ZXJTZXNzaW9uIH0gZnJvbSAnbmV4dC1hdXRoJztcbmltcG9ydCB7IGF1dGhPcHRpb25zIH0gZnJvbSAnQC9saWIvYXV0aC5jb25maWcnO1xuaW1wb3J0IHR5cGUgeyBMb2dpc3RpY3NQcm9kdWN0Q29kZSB9IGZyb20gJ0AvbGliL2xvZ2lzdGljc1Byb2R1Y3QnO1xuXG5jb25zdCBBUElfVVJMID0gcHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfQVBJX1VSTCB8fCAnaHR0cDovL2xvY2FsaG9zdDozMDAwL2FwaS92MSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgVHJ1Y2tEaXNwYXRjaFByb2R1Y2VyUmVmIHtcbiAgaWQ/OiBudW1iZXI7XG4gIHJ1dDogc3RyaW5nO1xuICBuYW1lOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgVHJ1Y2tEaXNwYXRjaCB7XG4gIGlkOiBudW1iZXI7XG4gIG51bWVyb190dXJubzogbnVtYmVyIHwgbnVsbDtcbiAgc3RhdHVzOiAnRVNQRVJBJyB8ICdGSU5JU0hFRCc7XG4gIHByb2R1Y2VyX2lkOiBudW1iZXI7XG4gIHByb2R1Y3Q/OiBMb2dpc3RpY3NQcm9kdWN0Q29kZTtcbiAgcHJvZHVjZXI/OiBUcnVja0Rpc3BhdGNoUHJvZHVjZXJSZWY7XG4gIGxpY2Vuc2VfcGxhdGU6IHN0cmluZztcbiAgZHJpdmVyX25hbWU/OiBzdHJpbmcgfCBudWxsO1xuICBjYXJyaWVyX2NvbXBhbnk/OiBzdHJpbmc7XG4gIGRpc3BhdGNoX2d1aWRlPzogc3RyaW5nO1xuICBncm9zc193ZWlnaHQ/OiBudW1iZXI7XG4gIHRhcmVfd2VpZ2h0PzogbnVtYmVyO1xuICBuZXRfd2VpZ2h0PzogbnVtYmVyO1xuICBlbnRyeV9hdDogRGF0ZTtcbiAgZmluaXNoZWRfYXQ/OiBEYXRlO1xuICBjcmVhdGVkX2J5Pzogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIENyZWF0ZVRydWNrRGlzcGF0Y2hXaXRoVGFyZVBheWxvYWQge1xuICBwcm9kdWNlcl9pZDogbnVtYmVyO1xuICBsaWNlbnNlX3BsYXRlOiBzdHJpbmc7XG4gIGRyaXZlcl9uYW1lPzogc3RyaW5nO1xuICBjYXJyaWVyX2NvbXBhbnk/OiBzdHJpbmc7XG4gIGRpc3BhdGNoX2d1aWRlPzogc3RyaW5nO1xuICB0YXJlX3dlaWdodDogbnVtYmVyO1xuICBwcm9kdWN0OiBMb2dpc3RpY3NQcm9kdWN0Q29kZTtcbiAgY3JlYXRlZF9ieT86IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBSZWdpc3RlckRpc3BhdGNoR3Jvc3NXZWlnaHRQYXlsb2FkIHtcbiAgdHJ1Y2tfZGlzcGF0Y2hfaWQ6IG51bWJlcjtcbiAgZ3Jvc3Nfd2VpZ2h0OiBudW1iZXI7XG4gIHN0YXR1cz86ICdGSU5JU0hFRCc7XG4gIGNyZWF0ZWRfYnk/OiBzdHJpbmc7XG59XG5cbmZ1bmN0aW9uIHBhcnNlRGlzcGF0Y2hGcm9tQXBpKHJhdzogUmVjb3JkPHN0cmluZywgdW5rbm93bj4pOiBUcnVja0Rpc3BhdGNoIHtcbiAgY29uc3QgcHJvZHVjZXIgPSByYXcucHJvZHVjZXIgYXMgVHJ1Y2tEaXNwYXRjaFByb2R1Y2VyUmVmIHwgdW5kZWZpbmVkO1xuICBjb25zdCBzdCA9IFN0cmluZyhyYXcuc3RhdHVzID8/ICcnKS50cmltKCkudG9VcHBlckNhc2UoKTtcbiAgY29uc3Qgc3RhdHVzOiBUcnVja0Rpc3BhdGNoWydzdGF0dXMnXSA9IHN0ID09PSAnRklOSVNIRUQnID8gJ0ZJTklTSEVEJyA6ICdFU1BFUkEnO1xuICBjb25zdCBwcm9kdWN0ID0gcmF3LnByb2R1Y3QgIT0gbnVsbCA/IFN0cmluZyhyYXcucHJvZHVjdCkgOiB1bmRlZmluZWQ7XG4gIGNvbnN0IHAgPVxuICAgIHByb2R1Y3QgPT09ICdDQVNDQVJJTExBJyB8fCBwcm9kdWN0ID09PSAnQVJST1pfUEFERFknXG4gICAgICA/IChwcm9kdWN0IGFzIExvZ2lzdGljc1Byb2R1Y3RDb2RlKVxuICAgICAgOiB1bmRlZmluZWQ7XG5cbiAgcmV0dXJuIHtcbiAgICBpZDogTnVtYmVyKHJhdy5pZCksXG4gICAgbnVtZXJvX3R1cm5vOlxuICAgICAgcmF3Lm51bWVyb190dXJubyAhPSBudWxsICYmICFOdW1iZXIuaXNOYU4oTnVtYmVyKHJhdy5udW1lcm9fdHVybm8pKVxuICAgICAgICA/IE51bWJlcihyYXcubnVtZXJvX3R1cm5vKVxuICAgICAgICA6IG51bGwsXG4gICAgc3RhdHVzLFxuICAgIHByb2R1Y2VyX2lkOiBOdW1iZXIocmF3LnByb2R1Y2VyX2lkID8/IDApLFxuICAgIHByb2R1Y3Q6IHAsXG4gICAgcHJvZHVjZXIsXG4gICAgbGljZW5zZV9wbGF0ZTogU3RyaW5nKHJhdy5saWNlbnNlX3BsYXRlID8/ICcnKSxcbiAgICBkcml2ZXJfbmFtZTogcmF3LmRyaXZlcl9uYW1lICE9IG51bGwgPyBTdHJpbmcocmF3LmRyaXZlcl9uYW1lKSA6IG51bGwsXG4gICAgY2Fycmllcl9jb21wYW55OlxuICAgICAgcmF3LmNhcnJpZXJfY29tcGFueSAhPSBudWxsID8gU3RyaW5nKHJhdy5jYXJyaWVyX2NvbXBhbnkpIDogdW5kZWZpbmVkLFxuICAgIGRpc3BhdGNoX2d1aWRlOlxuICAgICAgcmF3LmRpc3BhdGNoX2d1aWRlICE9IG51bGwgPyBTdHJpbmcocmF3LmRpc3BhdGNoX2d1aWRlKSA6IHVuZGVmaW5lZCxcbiAgICBncm9zc193ZWlnaHQ6XG4gICAgICByYXcuZ3Jvc3Nfd2VpZ2h0ICE9IG51bGwgPyBOdW1iZXIocmF3Lmdyb3NzX3dlaWdodCkgOiB1bmRlZmluZWQsXG4gICAgdGFyZV93ZWlnaHQ6IHJhdy50YXJlX3dlaWdodCAhPSBudWxsID8gTnVtYmVyKHJhdy50YXJlX3dlaWdodCkgOiB1bmRlZmluZWQsXG4gICAgbmV0X3dlaWdodDogcmF3Lm5ldF93ZWlnaHQgIT0gbnVsbCA/IE51bWJlcihyYXcubmV0X3dlaWdodCkgOiB1bmRlZmluZWQsXG4gICAgZW50cnlfYXQ6IG5ldyBEYXRlKFN0cmluZyhyYXcuZW50cnlfYXQgPz8gRGF0ZS5ub3coKSkpLFxuICAgIGZpbmlzaGVkX2F0OiByYXcuZmluaXNoZWRfYXQgPyBuZXcgRGF0ZShTdHJpbmcocmF3LmZpbmlzaGVkX2F0KSkgOiB1bmRlZmluZWQsXG4gICAgY3JlYXRlZF9ieTogcmF3LmNyZWF0ZWRfYnkgIT0gbnVsbCA/IFN0cmluZyhyYXcuY3JlYXRlZF9ieSkgOiB1bmRlZmluZWQsXG4gIH07XG59XG5cbi8qKiBDb2xhIGRlIHBlc2FqZTogRVNQRVJBIGNvbiB0YXJhIHkgc2luIGJydXRvIChob3kpLiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldERpc3BhdGNoZXNXZWlnaGluZ1F1ZXVlVG9kYXlBY3Rpb24oKTogUHJvbWlzZTxcbiAgVHJ1Y2tEaXNwYXRjaFtdXG4+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBzZXNzaW9uID0gYXdhaXQgZ2V0U2VydmVyU2Vzc2lvbihhdXRoT3B0aW9ucyk7XG5cbiAgICBpZiAoIXNlc3Npb24/LnVzZXI/LmFjY2Vzc1Rva2VuKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgJHtBUElfVVJMfS9sb2dpc3RpY3MvdHVybm9zL2Rpc3BhdGNoZXMvdG9kYXlgLCB7XG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgIEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHtzZXNzaW9uLnVzZXIuYWNjZXNzVG9rZW59YCxcbiAgICAgIH0sXG4gICAgICBjYWNoZTogJ25vLXN0b3JlJyxcbiAgICB9KTtcblxuICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgY29uc3QgZGF0YUFycmF5ID0gKHJlc3VsdC5kYXRhIHx8IFtdKSBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPltdO1xuICAgIHJldHVybiBkYXRhQXJyYXkubWFwKHBhcnNlRGlzcGF0Y2hGcm9tQXBpKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdFcnJvciBvYnRlbmllbmRvIGNvbGEgZGVzcGFjaG86JywgZXJyb3IpO1xuICAgIHJldHVybiBbXTtcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlVHJ1Y2tEaXNwYXRjaFdpdGhUYXJlQWN0aW9uKFxuICBwYXlsb2FkOiBDcmVhdGVUcnVja0Rpc3BhdGNoV2l0aFRhcmVQYXlsb2FkLFxuKTogUHJvbWlzZTxUcnVja0Rpc3BhdGNoPiB7XG4gIGNvbnN0IHNlc3Npb24gPSBhd2FpdCBnZXRTZXJ2ZXJTZXNzaW9uKGF1dGhPcHRpb25zKTtcblxuICBpZiAoIXNlc3Npb24/LnVzZXI/LmFjY2Vzc1Rva2VuKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdObyBhdXRlbnRpY2FkbycpO1xuICB9XG5cbiAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgJHtBUElfVVJMfS9sb2dpc3RpY3MvdHJ1Y2stZGlzcGF0Y2hlcy93aXRoLXRhcmVgLCB7XG4gICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgaGVhZGVyczoge1xuICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgIEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHtzZXNzaW9uLnVzZXIuYWNjZXNzVG9rZW59YCxcbiAgICB9LFxuICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgIHByb2R1Y2VyX2lkOiBwYXlsb2FkLnByb2R1Y2VyX2lkLFxuICAgICAgbGljZW5zZV9wbGF0ZTogcGF5bG9hZC5saWNlbnNlX3BsYXRlLFxuICAgICAgZHJpdmVyX25hbWU6IHBheWxvYWQuZHJpdmVyX25hbWUsXG4gICAgICBjYXJyaWVyX2NvbXBhbnk6IHBheWxvYWQuY2Fycmllcl9jb21wYW55LFxuICAgICAgZGlzcGF0Y2hfZ3VpZGU6IHBheWxvYWQuZGlzcGF0Y2hfZ3VpZGUsXG4gICAgICB0YXJlX3dlaWdodDogcGF5bG9hZC50YXJlX3dlaWdodCxcbiAgICAgIHByb2R1Y3Q6IHBheWxvYWQucHJvZHVjdCxcbiAgICAgIGNyZWF0ZWRfYnk6IHBheWxvYWQuY3JlYXRlZF9ieSxcbiAgICB9KSxcbiAgfSk7XG5cbiAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgIGxldCBtc2cgPSBgSFRUUCAke3Jlc3BvbnNlLnN0YXR1c31gO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBlcnIgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICBpZiAodHlwZW9mIGVycj8ubWVzc2FnZSA9PT0gJ3N0cmluZycpIG1zZyA9IGVyci5tZXNzYWdlO1xuICAgICAgZWxzZSBpZiAoQXJyYXkuaXNBcnJheShlcnI/Lm1lc3NhZ2UpKSBtc2cgPSBlcnIubWVzc2FnZS5qb2luKCcuICcpO1xuICAgIH0gY2F0Y2gge1xuICAgICAgLyogaWdub3JlICovXG4gICAgfVxuICAgIHRocm93IG5ldyBFcnJvcihtc2cpO1xuICB9XG5cbiAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICByZXR1cm4gcGFyc2VEaXNwYXRjaEZyb21BcGkocmVzdWx0LmRhdGEgYXMgUmVjb3JkPHN0cmluZywgdW5rbm93bj4pO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVnaXN0ZXJEaXNwYXRjaEdyb3NzV2VpZ2h0QWN0aW9uKFxuICBwYXlsb2FkOiBSZWdpc3RlckRpc3BhdGNoR3Jvc3NXZWlnaHRQYXlsb2FkLFxuKTogUHJvbWlzZTxUcnVja0Rpc3BhdGNoPiB7XG4gIGNvbnN0IHNlc3Npb24gPSBhd2FpdCBnZXRTZXJ2ZXJTZXNzaW9uKGF1dGhPcHRpb25zKTtcblxuICBpZiAoIXNlc3Npb24/LnVzZXI/LmFjY2Vzc1Rva2VuKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdObyBhdXRlbnRpY2FkbycpO1xuICB9XG5cbiAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgJHtBUElfVVJMfS9sb2dpc3RpY3Mvd2VpZ2hpbmdzL2Rpc3BhdGNoLWdyb3NzYCwge1xuICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgIGhlYWRlcnM6IHtcbiAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7c2Vzc2lvbi51c2VyLmFjY2Vzc1Rva2VufWAsXG4gICAgfSxcbiAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICB0cnVja19kaXNwYXRjaF9pZDogcGF5bG9hZC50cnVja19kaXNwYXRjaF9pZCxcbiAgICAgIGdyb3NzX3dlaWdodDogcGF5bG9hZC5ncm9zc193ZWlnaHQsXG4gICAgICBzdGF0dXM6IHBheWxvYWQuc3RhdHVzID8/ICdGSU5JU0hFRCcsXG4gICAgICBjcmVhdGVkX2J5OiBwYXlsb2FkLmNyZWF0ZWRfYnksXG4gICAgfSksXG4gIH0pO1xuXG4gIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICBsZXQgbXNnID0gYEhUVFAgJHtyZXNwb25zZS5zdGF0dXN9YDtcbiAgICB0cnkge1xuICAgICAgY29uc3QgZXJyID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgaWYgKHR5cGVvZiBlcnI/Lm1lc3NhZ2UgPT09ICdzdHJpbmcnKSBtc2cgPSBlcnIubWVzc2FnZTtcbiAgICAgIGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoZXJyPy5tZXNzYWdlKSkgbXNnID0gZXJyLm1lc3NhZ2Uuam9pbignLiAnKTtcbiAgICB9IGNhdGNoIHtcbiAgICAgIC8qIGlnbm9yZSAqL1xuICAgIH1cbiAgICB0aHJvdyBuZXcgRXJyb3IobXNnKTtcbiAgfVxuXG4gIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgcmV0dXJuIHBhcnNlRGlzcGF0Y2hGcm9tQXBpKHJlc3VsdC5kYXRhIGFzIFJlY29yZDxzdHJpbmcsIHVua25vd24+KTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBVcGRhdGVUcnVja0Rpc3BhdGNoUGF5bG9hZCB7XG4gIHByb2R1Y2VyX2lkPzogbnVtYmVyO1xuICBsaWNlbnNlX3BsYXRlPzogc3RyaW5nO1xuICBkcml2ZXJfbmFtZT86IHN0cmluZyB8IG51bGw7XG4gIGNhcnJpZXJfY29tcGFueT86IHN0cmluZztcbiAgZGlzcGF0Y2hfZ3VpZGU/OiBzdHJpbmc7XG4gIGdyb3NzX3dlaWdodD86IG51bWJlcjtcbiAgdGFyZV93ZWlnaHQ/OiBudW1iZXI7XG4gIHByb2R1Y3Q/OiBMb2dpc3RpY3NQcm9kdWN0Q29kZTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFRydWNrRGlzcGF0Y2hCeUlkQWN0aW9uKGlkOiBudW1iZXIpOiBQcm9taXNlPFRydWNrRGlzcGF0Y2ggfCBudWxsPiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IGdldFNlcnZlclNlc3Npb24oYXV0aE9wdGlvbnMpO1xuXG4gICAgaWYgKCFzZXNzaW9uPy51c2VyPy5hY2Nlc3NUb2tlbikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBhdXRlbnRpY2FkbycpO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYCR7QVBJX1VSTH0vbG9naXN0aWNzL3RydWNrLWRpc3BhdGNoZXMvJHtpZH1gLCB7XG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgIEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHtzZXNzaW9uLnVzZXIuYWNjZXNzVG9rZW59YCxcbiAgICAgIH0sXG4gICAgICBjYWNoZTogJ25vLXN0b3JlJyxcbiAgICB9KTtcblxuICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICByZXR1cm4gcGFyc2VEaXNwYXRjaEZyb21BcGkocmVzdWx0LmRhdGEgYXMgUmVjb3JkPHN0cmluZywgdW5rbm93bj4pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIG9idGVuaWVuZG8gZGVzcGFjaG86JywgZXJyb3IpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGRhdGVUcnVja0Rpc3BhdGNoQWN0aW9uKFxuICBpZDogbnVtYmVyLFxuICBwYXlsb2FkOiBVcGRhdGVUcnVja0Rpc3BhdGNoUGF5bG9hZCxcbik6IFByb21pc2U8VHJ1Y2tEaXNwYXRjaD4ge1xuICBjb25zdCBzZXNzaW9uID0gYXdhaXQgZ2V0U2VydmVyU2Vzc2lvbihhdXRoT3B0aW9ucyk7XG5cbiAgaWYgKCFzZXNzaW9uPy51c2VyPy5hY2Nlc3NUb2tlbikge1xuICAgIHRocm93IG5ldyBFcnJvcignTm8gYXV0ZW50aWNhZG8nKTtcbiAgfVxuXG4gIGNvbnN0IGJvZHkgPSBPYmplY3QuZnJvbUVudHJpZXMoXG4gICAgT2JqZWN0LmVudHJpZXMocGF5bG9hZCkuZmlsdGVyKChbLCB2XSkgPT4gdiAhPT0gdW5kZWZpbmVkKSxcbiAgKTtcblxuICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAke0FQSV9VUkx9L2xvZ2lzdGljcy90cnVjay1kaXNwYXRjaGVzLyR7aWR9YCwge1xuICAgIG1ldGhvZDogJ1BVVCcsXG4gICAgaGVhZGVyczoge1xuICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgIEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHtzZXNzaW9uLnVzZXIuYWNjZXNzVG9rZW59YCxcbiAgICB9LFxuICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGJvZHkpLFxuICB9KTtcblxuICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgbGV0IG1zZyA9IGBIVFRQICR7cmVzcG9uc2Uuc3RhdHVzfWA7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGVyciA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgIGlmICh0eXBlb2YgZXJyPy5tZXNzYWdlID09PSAnc3RyaW5nJykgbXNnID0gZXJyLm1lc3NhZ2U7XG4gICAgICBlbHNlIGlmIChBcnJheS5pc0FycmF5KGVycj8ubWVzc2FnZSkpIG1zZyA9IGVyci5tZXNzYWdlLmpvaW4oJy4gJyk7XG4gICAgfSBjYXRjaCB7XG4gICAgICAvKiBpZ25vcmUgKi9cbiAgICB9XG4gICAgdGhyb3cgbmV3IEVycm9yKG1zZyk7XG4gIH1cblxuICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gIHJldHVybiBwYXJzZURpc3BhdGNoRnJvbUFwaShyZXN1bHQuZGF0YSBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPik7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkZWxldGVUcnVja0Rpc3BhdGNoQWN0aW9uKGlkOiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IGdldFNlcnZlclNlc3Npb24oYXV0aE9wdGlvbnMpO1xuXG4gIGlmICghc2Vzc2lvbj8udXNlcj8uYWNjZXNzVG9rZW4pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIGF1dGVudGljYWRvJyk7XG4gIH1cblxuICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAke0FQSV9VUkx9L2xvZ2lzdGljcy90cnVjay1kaXNwYXRjaGVzLyR7aWR9YCwge1xuICAgIG1ldGhvZDogJ0RFTEVURScsXG4gICAgaGVhZGVyczoge1xuICAgICAgQXV0aG9yaXphdGlvbjogYEJlYXJlciAke3Nlc3Npb24udXNlci5hY2Nlc3NUb2tlbn1gLFxuICAgIH0sXG4gIH0pO1xuXG4gIGNvbnN0IHJlc3BvbnNlUGF5bG9hZCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKS5jYXRjaCgoKSA9PiBudWxsKTtcblxuICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgY29uc3QgcmF3ID0gKHJlc3BvbnNlUGF5bG9hZCBhcyB7IG1lc3NhZ2U/OiB1bmtub3duIH0pPy5tZXNzYWdlO1xuICAgIGNvbnN0IG1zZyA9XG4gICAgICB0eXBlb2YgcmF3ID09PSAnc3RyaW5nJ1xuICAgICAgICA/IHJhd1xuICAgICAgICA6IEFycmF5LmlzQXJyYXkocmF3KVxuICAgICAgICAgID8gcmF3LmpvaW4oJy4gJylcbiAgICAgICAgICA6IGBIVFRQICR7cmVzcG9uc2Uuc3RhdHVzfWA7XG4gICAgdGhyb3cgbmV3IEVycm9yKG1zZyk7XG4gIH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBUcnVja0Rpc3BhdGNoR3JpZFJvdyB7XG4gIGlkOiBudW1iZXI7XG4gIHN0YXR1czogc3RyaW5nO1xuICBwcm9kdWN0Pzogc3RyaW5nO1xuICBwcm9kdWNlcl9pZD86IG51bWJlcjtcbiAgbGljZW5zZV9wbGF0ZTogc3RyaW5nO1xuICBkcml2ZXJfbmFtZTogc3RyaW5nO1xuICBjYXJyaWVyX2NvbXBhbnk/OiBzdHJpbmcgfCBudWxsO1xuICBkaXNwYXRjaF9ndWlkZT86IHN0cmluZyB8IG51bGw7XG4gIGdyb3NzX3dlaWdodDogc3RyaW5nIHwgbnVtYmVyIHwgbnVsbDtcbiAgdGFyZV93ZWlnaHQ6IHN0cmluZyB8IG51bWJlciB8IG51bGw7XG4gIG5ldF93ZWlnaHQ6IHN0cmluZyB8IG51bWJlciB8IG51bGw7XG4gIGVudHJ5X2F0OiBzdHJpbmc7XG4gIGZpbmlzaGVkX2F0Pzogc3RyaW5nIHwgbnVsbDtcbiAgcHJvZHVjZXJfbmFtZTogc3RyaW5nO1xuICBwcm9kdWNlcl9ydXQ6IHN0cmluZztcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFRydWNrRGlzcGF0Y2hlc0dyaWRBY3Rpb24ocGFyYW1zOiB7XG4gIGxpbWl0PzogbnVtYmVyO1xuICBvZmZzZXQ/OiBudW1iZXI7XG4gIHNlYXJjaD86IHN0cmluZztcbiAgZmlsdGVycz86IHN0cmluZztcbiAgc29ydD86IHN0cmluZztcbiAgc29ydEZpZWxkPzogc3RyaW5nO1xufSk6IFByb21pc2U8eyByb3dzOiBUcnVja0Rpc3BhdGNoR3JpZFJvd1tdOyB0b3RhbDogbnVtYmVyIH0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBzZXNzaW9uID0gYXdhaXQgZ2V0U2VydmVyU2Vzc2lvbihhdXRoT3B0aW9ucyk7XG5cbiAgICBpZiAoIXNlc3Npb24/LnVzZXI/LmFjY2Vzc1Rva2VuKSB7XG4gICAgICByZXR1cm4geyByb3dzOiBbXSwgdG90YWw6IDAgfTtcbiAgICB9XG5cbiAgICBjb25zdCBsaW1pdCA9IE1hdGgubWluKE1hdGgubWF4KHBhcmFtcy5saW1pdCA/PyAyNSwgMSksIDUwMCk7XG4gICAgY29uc3Qgb2Zmc2V0ID0gTWF0aC5tYXgocGFyYW1zLm9mZnNldCA/PyAwLCAwKTtcblxuICAgIGNvbnN0IHFzID0gbmV3IFVSTFNlYXJjaFBhcmFtcygpO1xuICAgIHFzLnNldCgnbGltaXQnLCBTdHJpbmcobGltaXQpKTtcbiAgICBxcy5zZXQoJ29mZnNldCcsIFN0cmluZyhvZmZzZXQpKTtcbiAgICBpZiAocGFyYW1zLnNlYXJjaD8udHJpbSgpKSB7XG4gICAgICBxcy5zZXQoJ3NlYXJjaCcsIHBhcmFtcy5zZWFyY2gudHJpbSgpKTtcbiAgICB9XG4gICAgaWYgKHBhcmFtcy5maWx0ZXJzPy50cmltKCkpIHtcbiAgICAgIHFzLnNldCgnZmlsdGVycycsIHBhcmFtcy5maWx0ZXJzLnRyaW0oKSk7XG4gICAgfVxuICAgIGlmIChwYXJhbXMuc29ydD8udHJpbSgpKSB7XG4gICAgICBxcy5zZXQoJ3NvcnQnLCBwYXJhbXMuc29ydC50cmltKCkpO1xuICAgIH1cbiAgICBpZiAocGFyYW1zLnNvcnRGaWVsZD8udHJpbSgpKSB7XG4gICAgICBxcy5zZXQoJ3NvcnRGaWVsZCcsIHBhcmFtcy5zb3J0RmllbGQudHJpbSgpKTtcbiAgICB9XG5cbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFxuICAgICAgYCR7QVBJX1VSTH0vbG9naXN0aWNzL3RydWNrLWRpc3BhdGNoZXMvZ3JpZD8ke3FzLnRvU3RyaW5nKCl9YCxcbiAgICAgIHtcbiAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgIEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHtzZXNzaW9uLnVzZXIuYWNjZXNzVG9rZW59YCxcbiAgICAgICAgfSxcbiAgICAgICAgY2FjaGU6ICduby1zdG9yZScsXG4gICAgICB9LFxuICAgICk7XG5cbiAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICByZXR1cm4geyByb3dzOiBbXSwgdG90YWw6IDAgfTtcbiAgICB9XG5cbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgY29uc3QgcGF5bG9hZCA9IHJlc3VsdC5kYXRhIGFzIHsgZGF0YTogdW5rbm93bltdOyB0b3RhbDogbnVtYmVyIH0gfCB1bmRlZmluZWQ7XG4gICAgY29uc3QgcmF3ID0gKHBheWxvYWQ/LmRhdGEgPz8gW10pIGFzIFJlY29yZDxzdHJpbmcsIHVua25vd24+W107XG4gICAgY29uc3QgdG90YWwgPSB0eXBlb2YgcGF5bG9hZD8udG90YWwgPT09ICdudW1iZXInID8gcGF5bG9hZC50b3RhbCA6IHJhdy5sZW5ndGg7XG5cbiAgICBjb25zdCByb3dzOiBUcnVja0Rpc3BhdGNoR3JpZFJvd1tdID0gcmF3Lm1hcCgocikgPT4ge1xuICAgICAgY29uc3QgcHJvZHVjZXIgPSByLnByb2R1Y2VyIGFzIHsgbmFtZT86IHN0cmluZzsgcnV0Pzogc3RyaW5nIH0gfCB1bmRlZmluZWQ7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBpZDogTnVtYmVyKHIuaWQpLFxuICAgICAgICBzdGF0dXM6IFN0cmluZyhyLnN0YXR1cyA/PyAnJyksXG4gICAgICAgIHByb2R1Y3Q6IHIucHJvZHVjdCAhPSBudWxsID8gU3RyaW5nKHIucHJvZHVjdCkgOiB1bmRlZmluZWQsXG4gICAgICAgIHByb2R1Y2VyX2lkOlxuICAgICAgICAgIHIucHJvZHVjZXJfaWQgIT0gbnVsbCA/IE51bWJlcihyLnByb2R1Y2VyX2lkKSA6IHVuZGVmaW5lZCxcbiAgICAgICAgbGljZW5zZV9wbGF0ZTogU3RyaW5nKHIubGljZW5zZV9wbGF0ZSA/PyAnJyksXG4gICAgICAgIGRyaXZlcl9uYW1lOiBTdHJpbmcoci5kcml2ZXJfbmFtZSA/PyAnJyksXG4gICAgICAgIGNhcnJpZXJfY29tcGFueTpcbiAgICAgICAgICByLmNhcnJpZXJfY29tcGFueSAhPSBudWxsID8gU3RyaW5nKHIuY2Fycmllcl9jb21wYW55KSA6IG51bGwsXG4gICAgICAgIGRpc3BhdGNoX2d1aWRlOlxuICAgICAgICAgIHIuZGlzcGF0Y2hfZ3VpZGUgIT0gbnVsbCA/IFN0cmluZyhyLmRpc3BhdGNoX2d1aWRlKSA6IG51bGwsXG4gICAgICAgIGdyb3NzX3dlaWdodDogci5ncm9zc193ZWlnaHQgYXMgc3RyaW5nIHwgbnVtYmVyIHwgbnVsbCxcbiAgICAgICAgdGFyZV93ZWlnaHQ6IHIudGFyZV93ZWlnaHQgYXMgc3RyaW5nIHwgbnVtYmVyIHwgbnVsbCxcbiAgICAgICAgbmV0X3dlaWdodDogci5uZXRfd2VpZ2h0IGFzIHN0cmluZyB8IG51bWJlciB8IG51bGwsXG4gICAgICAgIGVudHJ5X2F0OiBTdHJpbmcoci5lbnRyeV9hdCA/PyAnJyksXG4gICAgICAgIGZpbmlzaGVkX2F0OiByLmZpbmlzaGVkX2F0ICE9IG51bGwgPyBTdHJpbmcoci5maW5pc2hlZF9hdCkgOiBudWxsLFxuICAgICAgICBwcm9kdWNlcl9uYW1lOiBwcm9kdWNlcj8ubmFtZSA/PyAnJyxcbiAgICAgICAgcHJvZHVjZXJfcnV0OiBwcm9kdWNlcj8ucnV0ID8/ICcnLFxuICAgICAgfTtcbiAgICB9KTtcblxuICAgIHJldHVybiB7IHJvd3MsIHRvdGFsIH07XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcignRXJyb3IgZ3JpZCBkZXNwYWNob3M6JywgZXJyb3IpO1xuICAgIHJldHVybiB7IHJvd3M6IFtdLCB0b3RhbDogMCB9O1xuICB9XG59XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6ImlVQXFSc0Isc01BQUEifQ==
}),
"[project]/paddy/paddy-tms/src/actions/data:3f23d9 [app-ssr] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getTruckDispatchByIdAction",
    ()=>$$RSC_SERVER_ACTION_3
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-ssr] (ecmascript)");
/* __next_internal_action_entry_do_not_use__ [{"40a9d3691ded5b3e0665c26f95ebadba3262b12767":"getTruckDispatchByIdAction"},"paddy/paddy-tms/src/actions/truckDispatchActions.ts",""] */ "use turbopack no side effects";
;
const $$RSC_SERVER_ACTION_3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createServerReference"])("40a9d3691ded5b3e0665c26f95ebadba3262b12767", __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findSourceMapURL"], "getTruckDispatchByIdAction");
;
 //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vdHJ1Y2tEaXNwYXRjaEFjdGlvbnMudHMiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzZXJ2ZXInO1xuXG5pbXBvcnQgeyBnZXRTZXJ2ZXJTZXNzaW9uIH0gZnJvbSAnbmV4dC1hdXRoJztcbmltcG9ydCB7IGF1dGhPcHRpb25zIH0gZnJvbSAnQC9saWIvYXV0aC5jb25maWcnO1xuaW1wb3J0IHR5cGUgeyBMb2dpc3RpY3NQcm9kdWN0Q29kZSB9IGZyb20gJ0AvbGliL2xvZ2lzdGljc1Byb2R1Y3QnO1xuXG5jb25zdCBBUElfVVJMID0gcHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfQVBJX1VSTCB8fCAnaHR0cDovL2xvY2FsaG9zdDozMDAwL2FwaS92MSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgVHJ1Y2tEaXNwYXRjaFByb2R1Y2VyUmVmIHtcbiAgaWQ/OiBudW1iZXI7XG4gIHJ1dDogc3RyaW5nO1xuICBuYW1lOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgVHJ1Y2tEaXNwYXRjaCB7XG4gIGlkOiBudW1iZXI7XG4gIG51bWVyb190dXJubzogbnVtYmVyIHwgbnVsbDtcbiAgc3RhdHVzOiAnRVNQRVJBJyB8ICdGSU5JU0hFRCc7XG4gIHByb2R1Y2VyX2lkOiBudW1iZXI7XG4gIHByb2R1Y3Q/OiBMb2dpc3RpY3NQcm9kdWN0Q29kZTtcbiAgcHJvZHVjZXI/OiBUcnVja0Rpc3BhdGNoUHJvZHVjZXJSZWY7XG4gIGxpY2Vuc2VfcGxhdGU6IHN0cmluZztcbiAgZHJpdmVyX25hbWU/OiBzdHJpbmcgfCBudWxsO1xuICBjYXJyaWVyX2NvbXBhbnk/OiBzdHJpbmc7XG4gIGRpc3BhdGNoX2d1aWRlPzogc3RyaW5nO1xuICBncm9zc193ZWlnaHQ/OiBudW1iZXI7XG4gIHRhcmVfd2VpZ2h0PzogbnVtYmVyO1xuICBuZXRfd2VpZ2h0PzogbnVtYmVyO1xuICBlbnRyeV9hdDogRGF0ZTtcbiAgZmluaXNoZWRfYXQ/OiBEYXRlO1xuICBjcmVhdGVkX2J5Pzogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIENyZWF0ZVRydWNrRGlzcGF0Y2hXaXRoVGFyZVBheWxvYWQge1xuICBwcm9kdWNlcl9pZDogbnVtYmVyO1xuICBsaWNlbnNlX3BsYXRlOiBzdHJpbmc7XG4gIGRyaXZlcl9uYW1lPzogc3RyaW5nO1xuICBjYXJyaWVyX2NvbXBhbnk/OiBzdHJpbmc7XG4gIGRpc3BhdGNoX2d1aWRlPzogc3RyaW5nO1xuICB0YXJlX3dlaWdodDogbnVtYmVyO1xuICBwcm9kdWN0OiBMb2dpc3RpY3NQcm9kdWN0Q29kZTtcbiAgY3JlYXRlZF9ieT86IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBSZWdpc3RlckRpc3BhdGNoR3Jvc3NXZWlnaHRQYXlsb2FkIHtcbiAgdHJ1Y2tfZGlzcGF0Y2hfaWQ6IG51bWJlcjtcbiAgZ3Jvc3Nfd2VpZ2h0OiBudW1iZXI7XG4gIHN0YXR1cz86ICdGSU5JU0hFRCc7XG4gIGNyZWF0ZWRfYnk/OiBzdHJpbmc7XG59XG5cbmZ1bmN0aW9uIHBhcnNlRGlzcGF0Y2hGcm9tQXBpKHJhdzogUmVjb3JkPHN0cmluZywgdW5rbm93bj4pOiBUcnVja0Rpc3BhdGNoIHtcbiAgY29uc3QgcHJvZHVjZXIgPSByYXcucHJvZHVjZXIgYXMgVHJ1Y2tEaXNwYXRjaFByb2R1Y2VyUmVmIHwgdW5kZWZpbmVkO1xuICBjb25zdCBzdCA9IFN0cmluZyhyYXcuc3RhdHVzID8/ICcnKS50cmltKCkudG9VcHBlckNhc2UoKTtcbiAgY29uc3Qgc3RhdHVzOiBUcnVja0Rpc3BhdGNoWydzdGF0dXMnXSA9IHN0ID09PSAnRklOSVNIRUQnID8gJ0ZJTklTSEVEJyA6ICdFU1BFUkEnO1xuICBjb25zdCBwcm9kdWN0ID0gcmF3LnByb2R1Y3QgIT0gbnVsbCA/IFN0cmluZyhyYXcucHJvZHVjdCkgOiB1bmRlZmluZWQ7XG4gIGNvbnN0IHAgPVxuICAgIHByb2R1Y3QgPT09ICdDQVNDQVJJTExBJyB8fCBwcm9kdWN0ID09PSAnQVJST1pfUEFERFknXG4gICAgICA/IChwcm9kdWN0IGFzIExvZ2lzdGljc1Byb2R1Y3RDb2RlKVxuICAgICAgOiB1bmRlZmluZWQ7XG5cbiAgcmV0dXJuIHtcbiAgICBpZDogTnVtYmVyKHJhdy5pZCksXG4gICAgbnVtZXJvX3R1cm5vOlxuICAgICAgcmF3Lm51bWVyb190dXJubyAhPSBudWxsICYmICFOdW1iZXIuaXNOYU4oTnVtYmVyKHJhdy5udW1lcm9fdHVybm8pKVxuICAgICAgICA/IE51bWJlcihyYXcubnVtZXJvX3R1cm5vKVxuICAgICAgICA6IG51bGwsXG4gICAgc3RhdHVzLFxuICAgIHByb2R1Y2VyX2lkOiBOdW1iZXIocmF3LnByb2R1Y2VyX2lkID8/IDApLFxuICAgIHByb2R1Y3Q6IHAsXG4gICAgcHJvZHVjZXIsXG4gICAgbGljZW5zZV9wbGF0ZTogU3RyaW5nKHJhdy5saWNlbnNlX3BsYXRlID8/ICcnKSxcbiAgICBkcml2ZXJfbmFtZTogcmF3LmRyaXZlcl9uYW1lICE9IG51bGwgPyBTdHJpbmcocmF3LmRyaXZlcl9uYW1lKSA6IG51bGwsXG4gICAgY2Fycmllcl9jb21wYW55OlxuICAgICAgcmF3LmNhcnJpZXJfY29tcGFueSAhPSBudWxsID8gU3RyaW5nKHJhdy5jYXJyaWVyX2NvbXBhbnkpIDogdW5kZWZpbmVkLFxuICAgIGRpc3BhdGNoX2d1aWRlOlxuICAgICAgcmF3LmRpc3BhdGNoX2d1aWRlICE9IG51bGwgPyBTdHJpbmcocmF3LmRpc3BhdGNoX2d1aWRlKSA6IHVuZGVmaW5lZCxcbiAgICBncm9zc193ZWlnaHQ6XG4gICAgICByYXcuZ3Jvc3Nfd2VpZ2h0ICE9IG51bGwgPyBOdW1iZXIocmF3Lmdyb3NzX3dlaWdodCkgOiB1bmRlZmluZWQsXG4gICAgdGFyZV93ZWlnaHQ6IHJhdy50YXJlX3dlaWdodCAhPSBudWxsID8gTnVtYmVyKHJhdy50YXJlX3dlaWdodCkgOiB1bmRlZmluZWQsXG4gICAgbmV0X3dlaWdodDogcmF3Lm5ldF93ZWlnaHQgIT0gbnVsbCA/IE51bWJlcihyYXcubmV0X3dlaWdodCkgOiB1bmRlZmluZWQsXG4gICAgZW50cnlfYXQ6IG5ldyBEYXRlKFN0cmluZyhyYXcuZW50cnlfYXQgPz8gRGF0ZS5ub3coKSkpLFxuICAgIGZpbmlzaGVkX2F0OiByYXcuZmluaXNoZWRfYXQgPyBuZXcgRGF0ZShTdHJpbmcocmF3LmZpbmlzaGVkX2F0KSkgOiB1bmRlZmluZWQsXG4gICAgY3JlYXRlZF9ieTogcmF3LmNyZWF0ZWRfYnkgIT0gbnVsbCA/IFN0cmluZyhyYXcuY3JlYXRlZF9ieSkgOiB1bmRlZmluZWQsXG4gIH07XG59XG5cbi8qKiBDb2xhIGRlIHBlc2FqZTogRVNQRVJBIGNvbiB0YXJhIHkgc2luIGJydXRvIChob3kpLiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldERpc3BhdGNoZXNXZWlnaGluZ1F1ZXVlVG9kYXlBY3Rpb24oKTogUHJvbWlzZTxcbiAgVHJ1Y2tEaXNwYXRjaFtdXG4+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBzZXNzaW9uID0gYXdhaXQgZ2V0U2VydmVyU2Vzc2lvbihhdXRoT3B0aW9ucyk7XG5cbiAgICBpZiAoIXNlc3Npb24/LnVzZXI/LmFjY2Vzc1Rva2VuKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgJHtBUElfVVJMfS9sb2dpc3RpY3MvdHVybm9zL2Rpc3BhdGNoZXMvdG9kYXlgLCB7XG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgIEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHtzZXNzaW9uLnVzZXIuYWNjZXNzVG9rZW59YCxcbiAgICAgIH0sXG4gICAgICBjYWNoZTogJ25vLXN0b3JlJyxcbiAgICB9KTtcblxuICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgY29uc3QgZGF0YUFycmF5ID0gKHJlc3VsdC5kYXRhIHx8IFtdKSBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPltdO1xuICAgIHJldHVybiBkYXRhQXJyYXkubWFwKHBhcnNlRGlzcGF0Y2hGcm9tQXBpKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdFcnJvciBvYnRlbmllbmRvIGNvbGEgZGVzcGFjaG86JywgZXJyb3IpO1xuICAgIHJldHVybiBbXTtcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlVHJ1Y2tEaXNwYXRjaFdpdGhUYXJlQWN0aW9uKFxuICBwYXlsb2FkOiBDcmVhdGVUcnVja0Rpc3BhdGNoV2l0aFRhcmVQYXlsb2FkLFxuKTogUHJvbWlzZTxUcnVja0Rpc3BhdGNoPiB7XG4gIGNvbnN0IHNlc3Npb24gPSBhd2FpdCBnZXRTZXJ2ZXJTZXNzaW9uKGF1dGhPcHRpb25zKTtcblxuICBpZiAoIXNlc3Npb24/LnVzZXI/LmFjY2Vzc1Rva2VuKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdObyBhdXRlbnRpY2FkbycpO1xuICB9XG5cbiAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgJHtBUElfVVJMfS9sb2dpc3RpY3MvdHJ1Y2stZGlzcGF0Y2hlcy93aXRoLXRhcmVgLCB7XG4gICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgaGVhZGVyczoge1xuICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgIEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHtzZXNzaW9uLnVzZXIuYWNjZXNzVG9rZW59YCxcbiAgICB9LFxuICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgIHByb2R1Y2VyX2lkOiBwYXlsb2FkLnByb2R1Y2VyX2lkLFxuICAgICAgbGljZW5zZV9wbGF0ZTogcGF5bG9hZC5saWNlbnNlX3BsYXRlLFxuICAgICAgZHJpdmVyX25hbWU6IHBheWxvYWQuZHJpdmVyX25hbWUsXG4gICAgICBjYXJyaWVyX2NvbXBhbnk6IHBheWxvYWQuY2Fycmllcl9jb21wYW55LFxuICAgICAgZGlzcGF0Y2hfZ3VpZGU6IHBheWxvYWQuZGlzcGF0Y2hfZ3VpZGUsXG4gICAgICB0YXJlX3dlaWdodDogcGF5bG9hZC50YXJlX3dlaWdodCxcbiAgICAgIHByb2R1Y3Q6IHBheWxvYWQucHJvZHVjdCxcbiAgICAgIGNyZWF0ZWRfYnk6IHBheWxvYWQuY3JlYXRlZF9ieSxcbiAgICB9KSxcbiAgfSk7XG5cbiAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgIGxldCBtc2cgPSBgSFRUUCAke3Jlc3BvbnNlLnN0YXR1c31gO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBlcnIgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICBpZiAodHlwZW9mIGVycj8ubWVzc2FnZSA9PT0gJ3N0cmluZycpIG1zZyA9IGVyci5tZXNzYWdlO1xuICAgICAgZWxzZSBpZiAoQXJyYXkuaXNBcnJheShlcnI/Lm1lc3NhZ2UpKSBtc2cgPSBlcnIubWVzc2FnZS5qb2luKCcuICcpO1xuICAgIH0gY2F0Y2gge1xuICAgICAgLyogaWdub3JlICovXG4gICAgfVxuICAgIHRocm93IG5ldyBFcnJvcihtc2cpO1xuICB9XG5cbiAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICByZXR1cm4gcGFyc2VEaXNwYXRjaEZyb21BcGkocmVzdWx0LmRhdGEgYXMgUmVjb3JkPHN0cmluZywgdW5rbm93bj4pO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVnaXN0ZXJEaXNwYXRjaEdyb3NzV2VpZ2h0QWN0aW9uKFxuICBwYXlsb2FkOiBSZWdpc3RlckRpc3BhdGNoR3Jvc3NXZWlnaHRQYXlsb2FkLFxuKTogUHJvbWlzZTxUcnVja0Rpc3BhdGNoPiB7XG4gIGNvbnN0IHNlc3Npb24gPSBhd2FpdCBnZXRTZXJ2ZXJTZXNzaW9uKGF1dGhPcHRpb25zKTtcblxuICBpZiAoIXNlc3Npb24/LnVzZXI/LmFjY2Vzc1Rva2VuKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdObyBhdXRlbnRpY2FkbycpO1xuICB9XG5cbiAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgJHtBUElfVVJMfS9sb2dpc3RpY3Mvd2VpZ2hpbmdzL2Rpc3BhdGNoLWdyb3NzYCwge1xuICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgIGhlYWRlcnM6IHtcbiAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7c2Vzc2lvbi51c2VyLmFjY2Vzc1Rva2VufWAsXG4gICAgfSxcbiAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICB0cnVja19kaXNwYXRjaF9pZDogcGF5bG9hZC50cnVja19kaXNwYXRjaF9pZCxcbiAgICAgIGdyb3NzX3dlaWdodDogcGF5bG9hZC5ncm9zc193ZWlnaHQsXG4gICAgICBzdGF0dXM6IHBheWxvYWQuc3RhdHVzID8/ICdGSU5JU0hFRCcsXG4gICAgICBjcmVhdGVkX2J5OiBwYXlsb2FkLmNyZWF0ZWRfYnksXG4gICAgfSksXG4gIH0pO1xuXG4gIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICBsZXQgbXNnID0gYEhUVFAgJHtyZXNwb25zZS5zdGF0dXN9YDtcbiAgICB0cnkge1xuICAgICAgY29uc3QgZXJyID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgaWYgKHR5cGVvZiBlcnI/Lm1lc3NhZ2UgPT09ICdzdHJpbmcnKSBtc2cgPSBlcnIubWVzc2FnZTtcbiAgICAgIGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoZXJyPy5tZXNzYWdlKSkgbXNnID0gZXJyLm1lc3NhZ2Uuam9pbignLiAnKTtcbiAgICB9IGNhdGNoIHtcbiAgICAgIC8qIGlnbm9yZSAqL1xuICAgIH1cbiAgICB0aHJvdyBuZXcgRXJyb3IobXNnKTtcbiAgfVxuXG4gIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgcmV0dXJuIHBhcnNlRGlzcGF0Y2hGcm9tQXBpKHJlc3VsdC5kYXRhIGFzIFJlY29yZDxzdHJpbmcsIHVua25vd24+KTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBVcGRhdGVUcnVja0Rpc3BhdGNoUGF5bG9hZCB7XG4gIHByb2R1Y2VyX2lkPzogbnVtYmVyO1xuICBsaWNlbnNlX3BsYXRlPzogc3RyaW5nO1xuICBkcml2ZXJfbmFtZT86IHN0cmluZyB8IG51bGw7XG4gIGNhcnJpZXJfY29tcGFueT86IHN0cmluZztcbiAgZGlzcGF0Y2hfZ3VpZGU/OiBzdHJpbmc7XG4gIGdyb3NzX3dlaWdodD86IG51bWJlcjtcbiAgdGFyZV93ZWlnaHQ/OiBudW1iZXI7XG4gIHByb2R1Y3Q/OiBMb2dpc3RpY3NQcm9kdWN0Q29kZTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFRydWNrRGlzcGF0Y2hCeUlkQWN0aW9uKGlkOiBudW1iZXIpOiBQcm9taXNlPFRydWNrRGlzcGF0Y2ggfCBudWxsPiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IGdldFNlcnZlclNlc3Npb24oYXV0aE9wdGlvbnMpO1xuXG4gICAgaWYgKCFzZXNzaW9uPy51c2VyPy5hY2Nlc3NUb2tlbikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBhdXRlbnRpY2FkbycpO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYCR7QVBJX1VSTH0vbG9naXN0aWNzL3RydWNrLWRpc3BhdGNoZXMvJHtpZH1gLCB7XG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgIEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHtzZXNzaW9uLnVzZXIuYWNjZXNzVG9rZW59YCxcbiAgICAgIH0sXG4gICAgICBjYWNoZTogJ25vLXN0b3JlJyxcbiAgICB9KTtcblxuICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICByZXR1cm4gcGFyc2VEaXNwYXRjaEZyb21BcGkocmVzdWx0LmRhdGEgYXMgUmVjb3JkPHN0cmluZywgdW5rbm93bj4pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIG9idGVuaWVuZG8gZGVzcGFjaG86JywgZXJyb3IpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGRhdGVUcnVja0Rpc3BhdGNoQWN0aW9uKFxuICBpZDogbnVtYmVyLFxuICBwYXlsb2FkOiBVcGRhdGVUcnVja0Rpc3BhdGNoUGF5bG9hZCxcbik6IFByb21pc2U8VHJ1Y2tEaXNwYXRjaD4ge1xuICBjb25zdCBzZXNzaW9uID0gYXdhaXQgZ2V0U2VydmVyU2Vzc2lvbihhdXRoT3B0aW9ucyk7XG5cbiAgaWYgKCFzZXNzaW9uPy51c2VyPy5hY2Nlc3NUb2tlbikge1xuICAgIHRocm93IG5ldyBFcnJvcignTm8gYXV0ZW50aWNhZG8nKTtcbiAgfVxuXG4gIGNvbnN0IGJvZHkgPSBPYmplY3QuZnJvbUVudHJpZXMoXG4gICAgT2JqZWN0LmVudHJpZXMocGF5bG9hZCkuZmlsdGVyKChbLCB2XSkgPT4gdiAhPT0gdW5kZWZpbmVkKSxcbiAgKTtcblxuICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAke0FQSV9VUkx9L2xvZ2lzdGljcy90cnVjay1kaXNwYXRjaGVzLyR7aWR9YCwge1xuICAgIG1ldGhvZDogJ1BVVCcsXG4gICAgaGVhZGVyczoge1xuICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgIEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHtzZXNzaW9uLnVzZXIuYWNjZXNzVG9rZW59YCxcbiAgICB9LFxuICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGJvZHkpLFxuICB9KTtcblxuICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgbGV0IG1zZyA9IGBIVFRQICR7cmVzcG9uc2Uuc3RhdHVzfWA7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGVyciA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgIGlmICh0eXBlb2YgZXJyPy5tZXNzYWdlID09PSAnc3RyaW5nJykgbXNnID0gZXJyLm1lc3NhZ2U7XG4gICAgICBlbHNlIGlmIChBcnJheS5pc0FycmF5KGVycj8ubWVzc2FnZSkpIG1zZyA9IGVyci5tZXNzYWdlLmpvaW4oJy4gJyk7XG4gICAgfSBjYXRjaCB7XG4gICAgICAvKiBpZ25vcmUgKi9cbiAgICB9XG4gICAgdGhyb3cgbmV3IEVycm9yKG1zZyk7XG4gIH1cblxuICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gIHJldHVybiBwYXJzZURpc3BhdGNoRnJvbUFwaShyZXN1bHQuZGF0YSBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPik7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkZWxldGVUcnVja0Rpc3BhdGNoQWN0aW9uKGlkOiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IGdldFNlcnZlclNlc3Npb24oYXV0aE9wdGlvbnMpO1xuXG4gIGlmICghc2Vzc2lvbj8udXNlcj8uYWNjZXNzVG9rZW4pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIGF1dGVudGljYWRvJyk7XG4gIH1cblxuICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAke0FQSV9VUkx9L2xvZ2lzdGljcy90cnVjay1kaXNwYXRjaGVzLyR7aWR9YCwge1xuICAgIG1ldGhvZDogJ0RFTEVURScsXG4gICAgaGVhZGVyczoge1xuICAgICAgQXV0aG9yaXphdGlvbjogYEJlYXJlciAke3Nlc3Npb24udXNlci5hY2Nlc3NUb2tlbn1gLFxuICAgIH0sXG4gIH0pO1xuXG4gIGNvbnN0IHJlc3BvbnNlUGF5bG9hZCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKS5jYXRjaCgoKSA9PiBudWxsKTtcblxuICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgY29uc3QgcmF3ID0gKHJlc3BvbnNlUGF5bG9hZCBhcyB7IG1lc3NhZ2U/OiB1bmtub3duIH0pPy5tZXNzYWdlO1xuICAgIGNvbnN0IG1zZyA9XG4gICAgICB0eXBlb2YgcmF3ID09PSAnc3RyaW5nJ1xuICAgICAgICA/IHJhd1xuICAgICAgICA6IEFycmF5LmlzQXJyYXkocmF3KVxuICAgICAgICAgID8gcmF3LmpvaW4oJy4gJylcbiAgICAgICAgICA6IGBIVFRQICR7cmVzcG9uc2Uuc3RhdHVzfWA7XG4gICAgdGhyb3cgbmV3IEVycm9yKG1zZyk7XG4gIH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBUcnVja0Rpc3BhdGNoR3JpZFJvdyB7XG4gIGlkOiBudW1iZXI7XG4gIHN0YXR1czogc3RyaW5nO1xuICBwcm9kdWN0Pzogc3RyaW5nO1xuICBwcm9kdWNlcl9pZD86IG51bWJlcjtcbiAgbGljZW5zZV9wbGF0ZTogc3RyaW5nO1xuICBkcml2ZXJfbmFtZTogc3RyaW5nO1xuICBjYXJyaWVyX2NvbXBhbnk/OiBzdHJpbmcgfCBudWxsO1xuICBkaXNwYXRjaF9ndWlkZT86IHN0cmluZyB8IG51bGw7XG4gIGdyb3NzX3dlaWdodDogc3RyaW5nIHwgbnVtYmVyIHwgbnVsbDtcbiAgdGFyZV93ZWlnaHQ6IHN0cmluZyB8IG51bWJlciB8IG51bGw7XG4gIG5ldF93ZWlnaHQ6IHN0cmluZyB8IG51bWJlciB8IG51bGw7XG4gIGVudHJ5X2F0OiBzdHJpbmc7XG4gIGZpbmlzaGVkX2F0Pzogc3RyaW5nIHwgbnVsbDtcbiAgcHJvZHVjZXJfbmFtZTogc3RyaW5nO1xuICBwcm9kdWNlcl9ydXQ6IHN0cmluZztcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFRydWNrRGlzcGF0Y2hlc0dyaWRBY3Rpb24ocGFyYW1zOiB7XG4gIGxpbWl0PzogbnVtYmVyO1xuICBvZmZzZXQ/OiBudW1iZXI7XG4gIHNlYXJjaD86IHN0cmluZztcbiAgZmlsdGVycz86IHN0cmluZztcbiAgc29ydD86IHN0cmluZztcbiAgc29ydEZpZWxkPzogc3RyaW5nO1xufSk6IFByb21pc2U8eyByb3dzOiBUcnVja0Rpc3BhdGNoR3JpZFJvd1tdOyB0b3RhbDogbnVtYmVyIH0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBzZXNzaW9uID0gYXdhaXQgZ2V0U2VydmVyU2Vzc2lvbihhdXRoT3B0aW9ucyk7XG5cbiAgICBpZiAoIXNlc3Npb24/LnVzZXI/LmFjY2Vzc1Rva2VuKSB7XG4gICAgICByZXR1cm4geyByb3dzOiBbXSwgdG90YWw6IDAgfTtcbiAgICB9XG5cbiAgICBjb25zdCBsaW1pdCA9IE1hdGgubWluKE1hdGgubWF4KHBhcmFtcy5saW1pdCA/PyAyNSwgMSksIDUwMCk7XG4gICAgY29uc3Qgb2Zmc2V0ID0gTWF0aC5tYXgocGFyYW1zLm9mZnNldCA/PyAwLCAwKTtcblxuICAgIGNvbnN0IHFzID0gbmV3IFVSTFNlYXJjaFBhcmFtcygpO1xuICAgIHFzLnNldCgnbGltaXQnLCBTdHJpbmcobGltaXQpKTtcbiAgICBxcy5zZXQoJ29mZnNldCcsIFN0cmluZyhvZmZzZXQpKTtcbiAgICBpZiAocGFyYW1zLnNlYXJjaD8udHJpbSgpKSB7XG4gICAgICBxcy5zZXQoJ3NlYXJjaCcsIHBhcmFtcy5zZWFyY2gudHJpbSgpKTtcbiAgICB9XG4gICAgaWYgKHBhcmFtcy5maWx0ZXJzPy50cmltKCkpIHtcbiAgICAgIHFzLnNldCgnZmlsdGVycycsIHBhcmFtcy5maWx0ZXJzLnRyaW0oKSk7XG4gICAgfVxuICAgIGlmIChwYXJhbXMuc29ydD8udHJpbSgpKSB7XG4gICAgICBxcy5zZXQoJ3NvcnQnLCBwYXJhbXMuc29ydC50cmltKCkpO1xuICAgIH1cbiAgICBpZiAocGFyYW1zLnNvcnRGaWVsZD8udHJpbSgpKSB7XG4gICAgICBxcy5zZXQoJ3NvcnRGaWVsZCcsIHBhcmFtcy5zb3J0RmllbGQudHJpbSgpKTtcbiAgICB9XG5cbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFxuICAgICAgYCR7QVBJX1VSTH0vbG9naXN0aWNzL3RydWNrLWRpc3BhdGNoZXMvZ3JpZD8ke3FzLnRvU3RyaW5nKCl9YCxcbiAgICAgIHtcbiAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgIEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHtzZXNzaW9uLnVzZXIuYWNjZXNzVG9rZW59YCxcbiAgICAgICAgfSxcbiAgICAgICAgY2FjaGU6ICduby1zdG9yZScsXG4gICAgICB9LFxuICAgICk7XG5cbiAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICByZXR1cm4geyByb3dzOiBbXSwgdG90YWw6IDAgfTtcbiAgICB9XG5cbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgY29uc3QgcGF5bG9hZCA9IHJlc3VsdC5kYXRhIGFzIHsgZGF0YTogdW5rbm93bltdOyB0b3RhbDogbnVtYmVyIH0gfCB1bmRlZmluZWQ7XG4gICAgY29uc3QgcmF3ID0gKHBheWxvYWQ/LmRhdGEgPz8gW10pIGFzIFJlY29yZDxzdHJpbmcsIHVua25vd24+W107XG4gICAgY29uc3QgdG90YWwgPSB0eXBlb2YgcGF5bG9hZD8udG90YWwgPT09ICdudW1iZXInID8gcGF5bG9hZC50b3RhbCA6IHJhdy5sZW5ndGg7XG5cbiAgICBjb25zdCByb3dzOiBUcnVja0Rpc3BhdGNoR3JpZFJvd1tdID0gcmF3Lm1hcCgocikgPT4ge1xuICAgICAgY29uc3QgcHJvZHVjZXIgPSByLnByb2R1Y2VyIGFzIHsgbmFtZT86IHN0cmluZzsgcnV0Pzogc3RyaW5nIH0gfCB1bmRlZmluZWQ7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBpZDogTnVtYmVyKHIuaWQpLFxuICAgICAgICBzdGF0dXM6IFN0cmluZyhyLnN0YXR1cyA/PyAnJyksXG4gICAgICAgIHByb2R1Y3Q6IHIucHJvZHVjdCAhPSBudWxsID8gU3RyaW5nKHIucHJvZHVjdCkgOiB1bmRlZmluZWQsXG4gICAgICAgIHByb2R1Y2VyX2lkOlxuICAgICAgICAgIHIucHJvZHVjZXJfaWQgIT0gbnVsbCA/IE51bWJlcihyLnByb2R1Y2VyX2lkKSA6IHVuZGVmaW5lZCxcbiAgICAgICAgbGljZW5zZV9wbGF0ZTogU3RyaW5nKHIubGljZW5zZV9wbGF0ZSA/PyAnJyksXG4gICAgICAgIGRyaXZlcl9uYW1lOiBTdHJpbmcoci5kcml2ZXJfbmFtZSA/PyAnJyksXG4gICAgICAgIGNhcnJpZXJfY29tcGFueTpcbiAgICAgICAgICByLmNhcnJpZXJfY29tcGFueSAhPSBudWxsID8gU3RyaW5nKHIuY2Fycmllcl9jb21wYW55KSA6IG51bGwsXG4gICAgICAgIGRpc3BhdGNoX2d1aWRlOlxuICAgICAgICAgIHIuZGlzcGF0Y2hfZ3VpZGUgIT0gbnVsbCA/IFN0cmluZyhyLmRpc3BhdGNoX2d1aWRlKSA6IG51bGwsXG4gICAgICAgIGdyb3NzX3dlaWdodDogci5ncm9zc193ZWlnaHQgYXMgc3RyaW5nIHwgbnVtYmVyIHwgbnVsbCxcbiAgICAgICAgdGFyZV93ZWlnaHQ6IHIudGFyZV93ZWlnaHQgYXMgc3RyaW5nIHwgbnVtYmVyIHwgbnVsbCxcbiAgICAgICAgbmV0X3dlaWdodDogci5uZXRfd2VpZ2h0IGFzIHN0cmluZyB8IG51bWJlciB8IG51bGwsXG4gICAgICAgIGVudHJ5X2F0OiBTdHJpbmcoci5lbnRyeV9hdCA/PyAnJyksXG4gICAgICAgIGZpbmlzaGVkX2F0OiByLmZpbmlzaGVkX2F0ICE9IG51bGwgPyBTdHJpbmcoci5maW5pc2hlZF9hdCkgOiBudWxsLFxuICAgICAgICBwcm9kdWNlcl9uYW1lOiBwcm9kdWNlcj8ubmFtZSA/PyAnJyxcbiAgICAgICAgcHJvZHVjZXJfcnV0OiBwcm9kdWNlcj8ucnV0ID8/ICcnLFxuICAgICAgfTtcbiAgICB9KTtcblxuICAgIHJldHVybiB7IHJvd3MsIHRvdGFsIH07XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcignRXJyb3IgZ3JpZCBkZXNwYWNob3M6JywgZXJyb3IpO1xuICAgIHJldHVybiB7IHJvd3M6IFtdLCB0b3RhbDogMCB9O1xuICB9XG59XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6ImtVQW1Oc0IsdU1BQUEifQ==
}),
"[project]/paddy/paddy-tms/src/shared/components/ui/Dialog/DialogToPrint.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-dom.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$Dialog$2f$Dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/shared/components/ui/Dialog/Dialog.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$Button$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/shared/components/ui/Button/Button.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
const DialogToPrint = ({ open, onClose, title, children, size = 'lg', printLabel = 'Imprimir', closeLabel = 'Cerrar', contentClassName = '', onBeforePrint, onAfterPrint, zIndex = 50, portalContainer, preferBrowserPrint = false, scroll = 'paper', printStyles })=>{
    const printableRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [defaultPortalElement, setDefaultPortalElement] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const isBrowser = ("TURBOPACK compile-time value", "undefined") !== 'undefined';
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) {
            setDefaultPortalElement(null);
            return;
        }
        //TURBOPACK unreachable
        ;
        const element = undefined;
    }, [
        isBrowser,
        portalContainer
    ]);
    const portalTarget = portalContainer ?? defaultPortalElement;
    const buildPrintableHtml = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        const content = printableRef.current;
        if (!content) {
            return null;
        }
        const headNodes = document.querySelectorAll('link[rel="stylesheet"], style');
        const styles = Array.from(headNodes).map((node)=>node.outerHTML).join('\n');
        const baseHref = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : '/';
        const inlinePrintStyles = `
@media print {
  body {
    margin: 0;
    padding: 0;
  }
}
${printStyles ?? ''}`;
        return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charSet="utf-8" />
<title>${title ?? 'Documento'}</title>
<base href="${baseHref}" />
${styles}
<style>
${inlinePrintStyles}
</style>
</head>
<body>
<div id="print-root">${content.innerHTML}</div>
</body>
</html>`;
    }, [
        title
    ]);
    const printWithIframe = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((html, skipBeforeHook = false)=>{
        if (!skipBeforeHook) {
            onBeforePrint?.();
        }
        const iframe = document.createElement('iframe');
        iframe.style.position = 'fixed';
        iframe.style.right = '0';
        iframe.style.bottom = '0';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = '0';
        iframe.setAttribute('aria-hidden', 'true');
        document.body.appendChild(iframe);
        const cleanup = ()=>{
            iframe.parentNode?.removeChild(iframe);
            onAfterPrint?.();
        };
        const iframeWindow = iframe.contentWindow;
        if (!iframeWindow) {
            cleanup();
            return;
        }
        iframe.onload = ()=>{
            iframeWindow.onafterprint = ()=>{
                cleanup();
                iframeWindow.onafterprint = null;
            };
            requestAnimationFrame(()=>{
                requestAnimationFrame(()=>{
                    try {
                        iframeWindow.focus();
                        iframeWindow.print();
                    } catch (error) {
                        cleanup();
                    }
                });
            });
        };
        iframe.srcdoc = html;
    }, [
        onAfterPrint,
        onBeforePrint
    ]);
    const handlePrint = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        const printableHtml = buildPrintableHtml();
        if (!printableHtml) {
            return;
        }
        const electronAPI = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : undefined;
        if (preferBrowserPrint) {
            printWithIframe(printableHtml);
            return;
        }
        if (electronAPI?.printHtml) {
            onBeforePrint?.();
            try {
                const result = await electronAPI.printHtml({
                    html: printableHtml,
                    title: title ?? 'Documento',
                    printBackground: true
                });
                if (!result?.success) {
                    console.warn('[DialogToPrint] Silent print falló, usando método alternativo:', result?.error);
                    printWithIframe(printableHtml, true);
                } else {
                    onAfterPrint?.();
                }
                return;
            } catch (error) {
                console.error('[DialogToPrint] Error en impresión silenciosa, usando fallback:', error);
                printWithIframe(printableHtml, true);
                return;
            }
        }
        printWithIframe(printableHtml);
    }, [
        buildPrintableHtml,
        onAfterPrint,
        onBeforePrint,
        printWithIframe,
        title
    ]);
    const dialogContent = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$Dialog$2f$Dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
        open: open,
        onClose: onClose,
        title: title,
        size: size,
        hideActions: true,
        scroll: scroll,
        zIndex: zIndex,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: printableRef,
                className: `print-dialog-content ${contentClassName}`.trim(),
                "data-test-id": "print-dialog-content",
                children: children
            }, void 0, false, {
                fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/Dialog/DialogToPrint.tsx",
                lineNumber: 233,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-6 flex justify-end gap-3",
                "data-test-id": "print-dialog-actions",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$Button$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                        variant: "outlined",
                        onClick: onClose,
                        children: closeLabel
                    }, void 0, false, {
                        fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/Dialog/DialogToPrint.tsx",
                        lineNumber: 242,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$Button$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                        variant: "primary",
                        onClick: handlePrint,
                        children: printLabel
                    }, void 0, false, {
                        fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/Dialog/DialogToPrint.tsx",
                        lineNumber: 245,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/Dialog/DialogToPrint.tsx",
                lineNumber: 241,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/Dialog/DialogToPrint.tsx",
        lineNumber: 224,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
    if ("TURBOPACK compile-time truthy", 1) {
        return null;
    }
    //TURBOPACK unreachable
    ;
};
const __TURBOPACK__default__export__ = DialogToPrint;
}),
"[project]/paddy/paddy-tms/src/lib/logisticsProduct.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/paddy/paddy-tms/src/lib/formatChileanRut.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/paddy/paddy-tms/src/components/weighing/TruckWeighingTicketToPrint.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "blockRow": "TruckWeighingTicketToPrint-module__J3d6lq__blockRow",
  "companyAddress": "TruckWeighingTicketToPrint-module__J3d6lq__companyAddress",
  "companyHeader": "TruckWeighingTicketToPrint-module__J3d6lq__companyHeader",
  "companyKicker": "TruckWeighingTicketToPrint-module__J3d6lq__companyKicker",
  "companyName": "TruckWeighingTicketToPrint-module__J3d6lq__companyName",
  "datetimeRow": "TruckWeighingTicketToPrint-module__J3d6lq__datetimeRow",
  "documentDate": "TruckWeighingTicketToPrint-module__J3d6lq__documentDate",
  "documentMeta": "TruckWeighingTicketToPrint-module__J3d6lq__documentMeta",
  "documentSubtitle": "TruckWeighingTicketToPrint-module__J3d6lq__documentSubtitle",
  "label": "TruckWeighingTicketToPrint-module__J3d6lq__label",
  "obsBody": "TruckWeighingTicketToPrint-module__J3d6lq__obsBody",
  "obsBox": "TruckWeighingTicketToPrint-module__J3d6lq__obsBox",
  "obsLabel": "TruckWeighingTicketToPrint-module__J3d6lq__obsLabel",
  "plateGuideItem": "TruckWeighingTicketToPrint-module__J3d6lq__plateGuideItem",
  "plateGuideLabel": "TruckWeighingTicketToPrint-module__J3d6lq__plateGuideLabel",
  "plateGuideRow": "TruckWeighingTicketToPrint-module__J3d6lq__plateGuideRow",
  "plateGuideValue": "TruckWeighingTicketToPrint-module__J3d6lq__plateGuideValue",
  "plateGuideValuePlate": "TruckWeighingTicketToPrint-module__J3d6lq__plateGuideValuePlate",
  "separator": "TruckWeighingTicketToPrint-module__J3d6lq__separator",
  "sheet": "TruckWeighingTicketToPrint-module__J3d6lq__sheet",
  "ticketBox": "TruckWeighingTicketToPrint-module__J3d6lq__ticketBox",
  "ticketBoxTitle": "TruckWeighingTicketToPrint-module__J3d6lq__ticketBoxTitle",
  "ticketGeneral": "TruckWeighingTicketToPrint-module__J3d6lq__ticketGeneral",
  "ticketNumber": "TruckWeighingTicketToPrint-module__J3d6lq__ticketNumber",
  "ticketTitle": "TruckWeighingTicketToPrint-module__J3d6lq__ticketTitle",
  "twoColRow": "TruckWeighingTicketToPrint-module__J3d6lq__twoColRow",
  "value": "TruckWeighingTicketToPrint-module__J3d6lq__value",
  "weightTable": "TruckWeighingTicketToPrint-module__J3d6lq__weightTable",
});
}),
"[project]/paddy/paddy-tms/src/components/weighing/TruckWeighingTicketToPrint.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TruckWeighingTicketToPrint",
    ()=>TruckWeighingTicketToPrint,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$lib$2f$logisticsProduct$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/lib/logisticsProduct.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$lib$2f$formatChileanRut$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/lib/formatChileanRut.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$components$2f$weighing$2f$TruckWeighingTicketToPrint$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/components/weighing/TruckWeighingTicketToPrint.module.css [app-ssr] (css module)");
'use client';
;
;
;
;
function toDate(value) {
    if (value == null) return null;
    const d = value instanceof Date ? value : new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
}
/** dd-mm-aaaa */ function formatDateDash(d) {
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
}
function formatTimeCl(d) {
    return d.toLocaleTimeString('es-CL', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
}
/** dd-mm-aaaa hh:mm:ss */ function formatDateTimeLine(d) {
    return `${formatDateDash(d)} ${formatTimeCl(d)}`;
}
/** Enteros; miles con punto (p. ej. 47.080 kg). */ function formatKgTicket(value) {
    if (value === undefined || value === null || value === '') return '—';
    const n = typeof value === 'string' ? parseFloat(value) : value;
    if (!Number.isFinite(n)) return '—';
    const rounded = Math.round(n);
    return `${rounded.toLocaleString('de-DE')} kg`;
}
const TruckWeighingTicketToPrint = ({ truck, variant = 'reception', observations })=>{
    const entry = toDate(truck.entry_at);
    const exit = toDate(truck.finished_at);
    const producerRut = truck.producer?.rut ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$lib$2f$formatChileanRut$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatChileanRut"])(String(truck.producer.rut)) : '—';
    const producerName = truck.producer?.name ?? '—';
    const productorLine = `${producerRut} ${producerName}`.trim();
    const isDispatch = variant === 'dispatch';
    const folioFormatted = Number(truck.id).toLocaleString('es-CL');
    const numberLine = isDispatch ? folioFormatted : truck.numero_turno != null ? Number(truck.numero_turno).toLocaleString('es-CL') : folioFormatted;
    const operationSubtitle = isDispatch ? 'Despacho de Carga' : 'Recepción de Carga';
    const guia = truck.dispatch_guide?.trim() || '—';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$components$2f$weighing$2f$TruckWeighingTicketToPrint$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].sheet,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$components$2f$weighing$2f$TruckWeighingTicketToPrint$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].companyHeader,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$components$2f$weighing$2f$TruckWeighingTicketToPrint$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].companyKicker,
                                children: "Sociedad Comercial e Industrial"
                            }, void 0, false, {
                                fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckWeighingTicketToPrint.tsx",
                                lineNumber: 88,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$components$2f$weighing$2f$TruckWeighingTicketToPrint$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].companyName,
                                children: "Aparicio y Garcia Ltda"
                            }, void 0, false, {
                                fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckWeighingTicketToPrint.tsx",
                                lineNumber: 89,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$components$2f$weighing$2f$TruckWeighingTicketToPrint$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].companyAddress,
                                children: "Panamericana Sur km 342"
                            }, void 0, false, {
                                fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckWeighingTicketToPrint.tsx",
                                lineNumber: 90,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$components$2f$weighing$2f$TruckWeighingTicketToPrint$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].companyAddress,
                                children: "Parral, Chile"
                            }, void 0, false, {
                                fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckWeighingTicketToPrint.tsx",
                                lineNumber: 91,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckWeighingTicketToPrint.tsx",
                        lineNumber: 87,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$components$2f$weighing$2f$TruckWeighingTicketToPrint$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].documentMeta,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$components$2f$weighing$2f$TruckWeighingTicketToPrint$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].ticketTitle,
                                children: "TICKET DE PESAJE"
                            }, void 0, false, {
                                fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckWeighingTicketToPrint.tsx",
                                lineNumber: 94,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$components$2f$weighing$2f$TruckWeighingTicketToPrint$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].ticketNumber,
                                children: isDispatch ? `Folio Nº ${numberLine}` : `Nº ${numberLine}`
                            }, void 0, false, {
                                fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckWeighingTicketToPrint.tsx",
                                lineNumber: 95,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$components$2f$weighing$2f$TruckWeighingTicketToPrint$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].documentSubtitle,
                                children: operationSubtitle
                            }, void 0, false, {
                                fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckWeighingTicketToPrint.tsx",
                                lineNumber: 98,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            exit && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$components$2f$weighing$2f$TruckWeighingTicketToPrint$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].documentDate,
                                suppressHydrationWarning: true,
                                children: [
                                    "Fecha: ",
                                    formatDateDash(exit)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckWeighingTicketToPrint.tsx",
                                lineNumber: 100,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckWeighingTicketToPrint.tsx",
                        lineNumber: 93,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckWeighingTicketToPrint.tsx",
                lineNumber: 86,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$components$2f$weighing$2f$TruckWeighingTicketToPrint$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].separator
            }, void 0, false, {
                fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckWeighingTicketToPrint.tsx",
                lineNumber: 107,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$components$2f$weighing$2f$TruckWeighingTicketToPrint$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].ticketGeneral,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$components$2f$weighing$2f$TruckWeighingTicketToPrint$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].plateGuideRow,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$components$2f$weighing$2f$TruckWeighingTicketToPrint$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].plateGuideItem,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$components$2f$weighing$2f$TruckWeighingTicketToPrint$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].plateGuideLabel,
                                        children: "Patente"
                                    }, void 0, false, {
                                        fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckWeighingTicketToPrint.tsx",
                                        lineNumber: 112,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$components$2f$weighing$2f$TruckWeighingTicketToPrint$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].plateGuideValue} ${__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$components$2f$weighing$2f$TruckWeighingTicketToPrint$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].plateGuideValuePlate}`,
                                        children: truck.license_plate
                                    }, void 0, false, {
                                        fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckWeighingTicketToPrint.tsx",
                                        lineNumber: 113,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckWeighingTicketToPrint.tsx",
                                lineNumber: 111,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$components$2f$weighing$2f$TruckWeighingTicketToPrint$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].plateGuideItem,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$components$2f$weighing$2f$TruckWeighingTicketToPrint$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].plateGuideLabel,
                                        children: "Nº Guía de Despacho"
                                    }, void 0, false, {
                                        fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckWeighingTicketToPrint.tsx",
                                        lineNumber: 118,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$components$2f$weighing$2f$TruckWeighingTicketToPrint$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].plateGuideValue,
                                        children: guia
                                    }, void 0, false, {
                                        fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckWeighingTicketToPrint.tsx",
                                        lineNumber: 119,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckWeighingTicketToPrint.tsx",
                                lineNumber: 117,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckWeighingTicketToPrint.tsx",
                        lineNumber: 110,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$components$2f$weighing$2f$TruckWeighingTicketToPrint$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].blockRow,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$components$2f$weighing$2f$TruckWeighingTicketToPrint$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].label,
                                children: "Productor:"
                            }, void 0, false, {
                                fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckWeighingTicketToPrint.tsx",
                                lineNumber: 124,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$components$2f$weighing$2f$TruckWeighingTicketToPrint$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].value,
                                children: productorLine
                            }, void 0, false, {
                                fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckWeighingTicketToPrint.tsx",
                                lineNumber: 125,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckWeighingTicketToPrint.tsx",
                        lineNumber: 123,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$components$2f$weighing$2f$TruckWeighingTicketToPrint$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].blockRow,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$components$2f$weighing$2f$TruckWeighingTicketToPrint$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].label,
                                children: "Producto:"
                            }, void 0, false, {
                                fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckWeighingTicketToPrint.tsx",
                                lineNumber: 128,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$components$2f$weighing$2f$TruckWeighingTicketToPrint$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].value,
                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$lib$2f$logisticsProduct$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatLogisticsProductLabel"])(truck.product)
                            }, void 0, false, {
                                fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckWeighingTicketToPrint.tsx",
                                lineNumber: 129,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckWeighingTicketToPrint.tsx",
                        lineNumber: 127,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$components$2f$weighing$2f$TruckWeighingTicketToPrint$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].datetimeRow,
                        children: [
                            entry && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$components$2f$weighing$2f$TruckWeighingTicketToPrint$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].blockRow,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$components$2f$weighing$2f$TruckWeighingTicketToPrint$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].label,
                                        children: "Entrada:"
                                    }, void 0, false, {
                                        fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckWeighingTicketToPrint.tsx",
                                        lineNumber: 135,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$components$2f$weighing$2f$TruckWeighingTicketToPrint$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].value,
                                        children: formatDateTimeLine(entry)
                                    }, void 0, false, {
                                        fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckWeighingTicketToPrint.tsx",
                                        lineNumber: 136,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckWeighingTicketToPrint.tsx",
                                lineNumber: 134,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            exit && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$components$2f$weighing$2f$TruckWeighingTicketToPrint$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].blockRow,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$components$2f$weighing$2f$TruckWeighingTicketToPrint$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].label,
                                        children: "Salida:"
                                    }, void 0, false, {
                                        fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckWeighingTicketToPrint.tsx",
                                        lineNumber: 141,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$components$2f$weighing$2f$TruckWeighingTicketToPrint$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].value,
                                        children: formatDateTimeLine(exit)
                                    }, void 0, false, {
                                        fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckWeighingTicketToPrint.tsx",
                                        lineNumber: 142,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckWeighingTicketToPrint.tsx",
                                lineNumber: 140,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckWeighingTicketToPrint.tsx",
                        lineNumber: 132,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckWeighingTicketToPrint.tsx",
                lineNumber: 109,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$components$2f$weighing$2f$TruckWeighingTicketToPrint$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].ticketBox,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$components$2f$weighing$2f$TruckWeighingTicketToPrint$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].weightTable,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        children: "Peso Bruto:"
                                    }, void 0, false, {
                                        fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckWeighingTicketToPrint.tsx",
                                        lineNumber: 152,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        children: formatKgTicket(truck.gross_weight)
                                    }, void 0, false, {
                                        fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckWeighingTicketToPrint.tsx",
                                        lineNumber: 153,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckWeighingTicketToPrint.tsx",
                                lineNumber: 151,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        children: "Peso Tara:"
                                    }, void 0, false, {
                                        fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckWeighingTicketToPrint.tsx",
                                        lineNumber: 156,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        children: formatKgTicket(truck.tare_weight)
                                    }, void 0, false, {
                                        fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckWeighingTicketToPrint.tsx",
                                        lineNumber: 157,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckWeighingTicketToPrint.tsx",
                                lineNumber: 155,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        children: "Peso Neto:"
                                    }, void 0, false, {
                                        fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckWeighingTicketToPrint.tsx",
                                        lineNumber: 160,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        children: formatKgTicket(truck.net_weight)
                                    }, void 0, false, {
                                        fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckWeighingTicketToPrint.tsx",
                                        lineNumber: 161,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckWeighingTicketToPrint.tsx",
                                lineNumber: 159,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckWeighingTicketToPrint.tsx",
                        lineNumber: 150,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckWeighingTicketToPrint.tsx",
                    lineNumber: 149,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckWeighingTicketToPrint.tsx",
                lineNumber: 148,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$components$2f$weighing$2f$TruckWeighingTicketToPrint$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].obsBox,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$components$2f$weighing$2f$TruckWeighingTicketToPrint$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].obsLabel,
                        children: "Observaciones:"
                    }, void 0, false, {
                        fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckWeighingTicketToPrint.tsx",
                        lineNumber: 168,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$components$2f$weighing$2f$TruckWeighingTicketToPrint$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].obsBody,
                        children: observations?.trim() || '\u00A0'
                    }, void 0, false, {
                        fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckWeighingTicketToPrint.tsx",
                        lineNumber: 169,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckWeighingTicketToPrint.tsx",
                lineNumber: 167,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckWeighingTicketToPrint.tsx",
        lineNumber: 85,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = TruckWeighingTicketToPrint;
}),
"[project]/paddy/paddy-tms/src/shared/components/ui/TextField/TextField.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TextField",
    ()=>TextField
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$lib$2f$formatChileanRut$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/lib/formatChileanRut.ts [app-ssr] (ecmascript)");
;
;
;
const TextField = ({ id, label, labelAlwaysVisible = false, value, onChange, onKeyDown, onFocus, onBlur, selectAllOnFocus = false, compact = false, type = "text", name, placeholder, startIcon, startAdornment, endIcon, className = "", variante = "normal", rows, required = false, readOnly = false, disabled = false, labelStyle, placeholderColor, currencySymbol = "$", allowDecimalComma = false, currencyField, currencies, phonePrefix, allowLetters = false, passwordVisibilityToggle = true, autoComplete, ...props })=>{
    const [focused, setFocused] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const inputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [showPassword, setShowPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [currencyRawValue, setCurrencyRawValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(value);
    const passwordToggleLabel = showPassword ? "Ocultar contraseña" : "Mostrar contraseña";
    // Sincronizar currencyRawValue con value cuando este cambie externamente
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (type === 'currency') {
            setCurrencyRawValue(value);
        }
    }, [
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
        const formattedValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$lib$2f$formatChileanRut$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatChileanRut"])(rawValue);
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
    const [showPlaceholder, setShowPlaceholder] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(shouldAlwaysShowLabel ? false : !shrink);
    const compactInputClasses = compact ? 'px-2.5 py-1.5 text-xs font-normal' : '';
    const compactLabelClasses = compact ? 'left-2.5 -top-1 text-[10px]' : 'left-3 -top-1 text-xs';
    const compactPlaceholderClasses = compact ? 'text-xs font-normal' : 'text-sm font-medium';
    const computedPlaceholder = type === "datePicker" ? `Ej: ${new Date().getFullYear()}` : shouldAlwaysShowLabel ? placeholder ?? "" : required ? "" : shrink || !showPlaceholder ? "" : placeholder ?? label;
    // Unique class for placeholder styling when placeholderColor is provided
    const placeholderClassRef = __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useRef(null);
    if (placeholderColor && !placeholderClassRef.current) {
        placeholderClassRef.current = `tf-ph-${Math.random().toString(36).slice(2, 9)}`;
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (shouldAlwaysShowLabel) {
            setShowPlaceholder(false);
            return;
        }
        if (!shrink) {
            const timeout = setTimeout(()=>setShowPlaceholder(true), 250);
            return ()=>clearTimeout(timeout);
        }
        setShowPlaceholder(false);
    }, [
        shrink,
        shouldAlwaysShowLabel
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (type === 'currency') {
            if (value !== currencyRawValue) {
                setCurrencyRawValue(value);
            }
        }
    }, [
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: compact || variante === "autocomplete" ? "relative w-full" : "input-container",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: `relative ${className}`,
            "data-test-id": "text-field-root",
            children: [
                typeof startIcon === 'string' && startIcon.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                    fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/TextField/TextField.tsx",
                    lineNumber: 369,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                startIcon === undefined && startAdornment && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                    fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/TextField/TextField.tsx",
                    lineNumber: 378,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                isTextArea ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
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
                    fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/TextField/TextField.tsx",
                    lineNumber: 386,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                            fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/TextField/TextField.tsx",
                            lineNumber: 411,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        type === "password" && passwordVisibilityToggle && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                                fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/TextField/TextField.tsx",
                                lineNumber: 456,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/TextField/TextField.tsx",
                            lineNumber: 438,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/TextField/TextField.tsx",
                    lineNumber: 410,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                required && !shrink && showPlaceholder && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-red-500 ml-1",
                            children: "*"
                        }, void 0, false, {
                            fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/TextField/TextField.tsx",
                            lineNumber: 481,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/TextField/TextField.tsx",
                    lineNumber: 469,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                placeholderColor && placeholderClassRef.current && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                    children: `input.${placeholderClassRef.current}::placeholder, textarea.${placeholderClassRef.current}::placeholder { color: ${placeholderColor} }`
                }, void 0, false, {
                    fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/TextField/TextField.tsx",
                    lineNumber: 486,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                    children: `
        textarea::placeholder {
          line-height: 1.5rem;
          text-align: left;
          color: ${placeholderColor || 'var(--color-muted)'};
        }
      `
                }, void 0, false, {
                    fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/TextField/TextField.tsx",
                    lineNumber: 488,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                    className: `absolute pointer-events-none transition-all duration-300 ease-in-out px-1 font-medium text-foreground rounded-md bg-background ${compactLabelClasses}` + (shrink ? " -translate-y-1 scale-90 opacity-100" : " opacity-0"),
                    onClick: ()=>inputRef.current?.focus(),
                    "data-test-id": "text-field-label",
                    children: [
                        label,
                        required && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-red-500 ml-1",
                            children: "*"
                        }, void 0, false, {
                            fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/TextField/TextField.tsx",
                            lineNumber: 502,
                            columnNumber: 22
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/TextField/TextField.tsx",
                    lineNumber: 495,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
                typeof endIcon === 'string' && endIcon.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                    fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/TextField/TextField.tsx",
                    lineNumber: 505,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/TextField/TextField.tsx",
            lineNumber: 367,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/TextField/TextField.tsx",
        lineNumber: 366,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/paddy/paddy-tms/src/shared/components/ui/DropdownList/DropdownList.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "dropdownOptionClass",
    ()=>dropdownOptionClass
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-dom.js [app-ssr] (ecmascript)");
;
;
;
const dropdownOptionClass = "dropdown-option";
const DropdownList = ({ open, children, className = "", style, testId, dropUp = false, highlightedIndex = -1, onHoverChange, anchorRef, usePortal = false })=>{
    const [hoveredIndex, setHoveredIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(-1);
    const [position, setPosition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const dropdownRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Handle client-side mounting for portal
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setMounted(true);
    }, []);
    // Calculate position when using portal mode
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!usePortal || !open || !anchorRef?.current) {
            setPosition(null);
            return;
        }
        const updatePosition = ()=>{
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
        };
        updatePosition();
        // Update position on scroll or resize
        window.addEventListener('scroll', updatePosition, true);
        window.addEventListener('resize', updatePosition);
        return ()=>{
            window.removeEventListener('scroll', updatePosition, true);
            window.removeEventListener('resize', updatePosition);
        };
    }, [
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
    const childrenArray = __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].Children.toArray(children);
    const childrenWithHover = children ? childrenArray.map((child, idx)=>{
        if (/*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].isValidElement(child)) {
            const currentClassName = child.props.className || '';
            const hoverClass = highlightedIndex === idx ? 'bg-secondary-30' : hoveredIndex === idx ? 'bg-secondary-20' : '';
            // Get total children count for first/last detection
            const isFirst = idx === 0;
            const isLast = idx === childrenArray.length - 1;
            const roundedClass = isFirst ? 'rounded-t' : isLast ? 'rounded-b' : '';
            return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].cloneElement(child, {
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
    const dropdownElement = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
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
        fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DropdownList/DropdownList.tsx",
        lineNumber: 141,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
    // Use portal for rendering outside the DOM hierarchy
    if (usePortal && mounted) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createPortal"])(dropdownElement, document.body);
    }
    return dropdownElement;
};
const __TURBOPACK__default__export__ = DropdownList;
}),
"[project]/paddy/paddy-tms/src/shared/components/ui/AutoComplete/AutoComplete.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$DropdownList$2f$DropdownList$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/shared/components/ui/DropdownList/DropdownList.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$IconButton$2f$IconButton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/shared/components/ui/IconButton/IconButton.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$TextField$2f$TextField$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/shared/components/ui/TextField/TextField.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
// Ref map para tracking de items renderizados
const itemRefs = new Map();
const AutoComplete = ({ options, label, labelAlwaysVisible = false, placeholder, value = null, onChange, onInputChange, name, required, compact = false, getOptionLabel, getOptionValue, filterOption, inputRef: externalInputRef, ...props })=>{
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
    const [highlightedIndex, setHighlightedIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(-1);
    const [inputValue, setInputValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(value ? getLabel(value) : "");
    const [focused, setFocused] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isNavigating, setIsNavigating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [validationTriggered, setValidationTriggered] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const inputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const disabled = props.disabled;
    // Buscar y vincular el input interno del TextField al ref externo
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Buscar el input dentro del contenedor del AutoComplete
        const textFieldInput = containerRef.current?.querySelector('input[type="text"], input[placeholder*="Buscar"]');
        if (textFieldInput && !inputRef.current) {
            inputRef.current = textFieldInput;
            console.log('[AutoComplete] Input del TextField vinculado al ref interno');
        }
    }, []);
    // Vincular el ref interno con el ref externo
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (externalInputRef && inputRef.current) {
            if (externalInputRef.current !== inputRef.current) {
                externalInputRef.current = inputRef.current;
                console.log('[AutoComplete] Ref externo vinculado al ref interno');
            }
        }
    }, [
        externalInputRef,
        inputRef
    ]);
    // Sync inputValue with value prop
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setInputValue(value ? getLabel(value) : "");
    }, [
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
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
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
    }, [
        open,
        filteredOptions.length,
        highlightedIndex
    ]);
    // Scroll automático al item destacado
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
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
    }, [
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "autocomplete-container",
        ref: containerRef,
        "data-test-id": props["data-test-id"] || "auto-complete-root",
        "data-has-options": options.length > 0 ? "true" : "false",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$TextField$2f$TextField$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TextField"], {
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
                        fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/AutoComplete/AutoComplete.tsx",
                        lineNumber: 223,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    value && !disabled && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$IconButton$2f$IconButton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        icon: "close_small",
                        variant: "text",
                        size: compact ? 'xs' : 'md',
                        className: `absolute right-10 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center z-20 ${focused ? 'text-primary' : 'text-secondary'}`,
                        onClick: handleClear,
                        "aria-label": "Limpiar selección",
                        "data-test-id": "auto-complete-clear-icon",
                        tabIndex: -1
                    }, void 0, false, {
                        fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/AutoComplete/AutoComplete.tsx",
                        lineNumber: 246,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    !disabled && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$IconButton$2f$IconButton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
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
                        fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/AutoComplete/AutoComplete.tsx",
                        lineNumber: 259,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/AutoComplete/AutoComplete.tsx",
                lineNumber: 210,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$DropdownList$2f$DropdownList$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
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
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        ref: (el)=>{
                            if (el) itemRefs.set(optValue, el);
                            else itemRefs.delete(optValue);
                        },
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$DropdownList$2f$DropdownList$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["dropdownOptionClass"],
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
                        fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/AutoComplete/AutoComplete.tsx",
                        lineNumber: 288,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0));
                })
            }, void 0, false, {
                fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/AutoComplete/AutoComplete.tsx",
                lineNumber: 274,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/AutoComplete/AutoComplete.tsx",
        lineNumber: 209,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = AutoComplete;
}),
"[project]/paddy/paddy-tms/src/shared/components/ui/Alert/Alert.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
;
const variantStyles = {
    success: "alert-success",
    info: "alert-info",
    warning: "alert-warning",
    error: "alert-error"
};
const Alert = ({ variant = "info", children, className = "", ...props })=>{
    const dataTestId = props["data-test-id"];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative w-full",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 bg-white/70 rounded z-0 pointer-events-none"
            }, void 0, false, {
                fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/Alert/Alert.tsx",
                lineNumber: 24,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `relative w-full px-4 py-2 rounded border font-light flex items-center gap-2 ${variantStyles[variant]} ${className}`,
                role: "alert",
                "data-test-id": dataTestId || `alert-${variant}`,
                children: children
            }, void 0, false, {
                fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/Alert/Alert.tsx",
                lineNumber: 25,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/Alert/Alert.tsx",
        lineNumber: 22,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = Alert;
}),
"[project]/paddy/paddy-tms/src/shared/components/ui/Select/Select.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$DropdownList$2f$DropdownList$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/shared/components/ui/DropdownList/DropdownList.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$IconButton$2f$IconButton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/shared/components/ui/IconButton/IconButton.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$TextField$2f$TextField$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/shared/components/ui/TextField/TextField.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
const Select = ({ label, options, placeholder, value = null, onChange, required = false, name, variant = 'default', compact = false, allowClear = false, disabled = false, className = '', ...props })=>{
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [focused, setFocused] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isSelecting, setIsSelecting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [highlightedIndex, setHighlightedIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(-1);
    const selected = options.find((opt)=>opt.id === value);
    const shrink = focused || selected;
    const onChangeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(onChange);
    const triggerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Update ref when onChange changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        onChangeRef.current = onChange;
    }, [
        onChange
    ]);
    // Handle form validation
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
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
    }, [
        value,
        required,
        name
    ]);
    // Manejo global de teclado para mejor compatibilidad con dialogs
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const handleKeyDown = (e)=>{
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
                setHighlightedIndex((i)=>i < options.length - 1 ? i + 1 : 0);
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setHighlightedIndex((i)=>i > 0 ? i - 1 : options.length - 1);
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
        };
        if (focused) {
            document.addEventListener('keydown', handleKeyDown);
        }
        return ()=>{
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [
        focused,
        open,
        options,
        highlightedIndex
    ]);
    // Ref array for options
    const optionRefs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])([]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (open && highlightedIndex >= 0 && optionRefs.current[highlightedIndex]) {
            optionRefs.current[highlightedIndex]?.scrollIntoView({
                block: 'nearest'
            });
        }
    }, [
        highlightedIndex,
        open
    ]);
    const hasValue = value !== null && value !== undefined;
    const hasClear = allowClear && hasValue;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "select-container",
        children: variant === 'minimal' ? // Variante Minimal: Contenedor compacto con icono de despliegue
        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    type: "text",
                    value: value !== null && value !== undefined ? value.toString() : '',
                    required: required,
                    onChange: ()=>{},
                    name: name || "select-validation",
                    className: "absolute opacity-0 pointer-events-none -z-10",
                    tabIndex: -1,
                    "aria-hidden": "true"
                }, void 0, false, {
                    fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/Select/Select.tsx",
                    lineNumber: 135,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `flex items-center rounded-md border border-border bg-background ${compact ? 'py-1.5 text-xs' : 'py-2 text-sm'} transition-colors ${focused ? 'border-primary ring-2 ring-primary/20' : 'hover:border-border/80'} ${disabled ? 'bg-muted text-muted-foreground' : ''} ${hasClear ? compact ? 'pr-10 pl-2.5' : 'pr-12 pl-3' : compact ? 'pr-7 pl-2.5' : 'pr-8 pl-3'}`.trim(),
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: `flex-1 truncate ${compact ? 'text-xs' : 'text-sm'} font-light ${hasValue ? 'text-foreground' : 'text-muted-foreground'}`,
                        style: hasValue ? {
                            color: 'var(--color-foreground)'
                        } : undefined,
                        children: selected ? selected.label : placeholder ?? 'Selecciona'
                    }, void 0, false, {
                        fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/Select/Select.tsx",
                        lineNumber: 151,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/Select/Select.tsx",
                    lineNumber: 146,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0)),
                allowClear && value !== null && value !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$IconButton$2f$IconButton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
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
                    fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/Select/Select.tsx",
                    lineNumber: 162,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: `material-symbols-outlined pointer-events-none absolute ${hasClear ? 'right-3.5' : 'right-3'} top-1/2 -translate-y-1/2 text-base transition-colors ${focused ? 'text-primary' : 'text-secondary'}`,
                    "aria-hidden": "true",
                    children: "expand_more"
                }, void 0, false, {
                    fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/Select/Select.tsx",
                    lineNumber: 175,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$DropdownList$2f$DropdownList$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    open: open,
                    testId: "select-list",
                    highlightedIndex: highlightedIndex,
                    onHoverChange: (idx)=>{},
                    usePortal: true,
                    anchorRef: triggerRef,
                    children: options.map((opt, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                            ref: (el)=>{
                                optionRefs.current[idx] = el;
                            },
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$DropdownList$2f$DropdownList$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["dropdownOptionClass"],
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
                            fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/Select/Select.tsx",
                            lineNumber: 193,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0)))
                }, void 0, false, {
                    fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/Select/Select.tsx",
                    lineNumber: 184,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/Select/Select.tsx",
            lineNumber: 114,
            columnNumber: 9
        }, ("TURBOPACK compile-time value", void 0)) : // Variante Default: Con iconos
        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    type: "text",
                    value: value !== null && value !== undefined ? value.toString() : '',
                    required: required,
                    onChange: ()=>{},
                    name: name || "select-validation",
                    className: "absolute opacity-0 pointer-events-none -z-10",
                    tabIndex: -1,
                    "aria-hidden": "true"
                }, void 0, false, {
                    fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/Select/Select.tsx",
                    lineNumber: 247,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$TextField$2f$TextField$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TextField"], {
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
                    fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/Select/Select.tsx",
                    lineNumber: 258,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0)),
                allowClear && value !== null && value !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$IconButton$2f$IconButton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
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
                    fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/Select/Select.tsx",
                    lineNumber: 275,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$IconButton$2f$IconButton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
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
                    fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/Select/Select.tsx",
                    lineNumber: 288,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$DropdownList$2f$DropdownList$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    open: open,
                    testId: "select-list",
                    highlightedIndex: highlightedIndex,
                    onHoverChange: (idx)=>{},
                    usePortal: true,
                    anchorRef: triggerRef,
                    children: options.map((opt, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                            ref: (el)=>{
                                optionRefs.current[idx] = el;
                            },
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$DropdownList$2f$DropdownList$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["dropdownOptionClass"],
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
                            fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/Select/Select.tsx",
                            lineNumber: 309,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0)))
                }, void 0, false, {
                    fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/Select/Select.tsx",
                    lineNumber: 300,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/Select/Select.tsx",
            lineNumber: 226,
            columnNumber: 9
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/Select/Select.tsx",
        lineNumber: 111,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = Select;
}),
"[project]/paddy/paddy-tms/src/actions/data:dc0b45 [app-ssr] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fetchProducersAction",
    ()=>$$RSC_SERVER_ACTION_0
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-ssr] (ecmascript)");
/* __next_internal_action_entry_do_not_use__ [{"401bab28b0299646f861535a0f8397c9b5b1018ac3":"fetchProducersAction"},"paddy/paddy-tms/src/actions/fetchProducersAction.ts",""] */ "use turbopack no side effects";
;
const $$RSC_SERVER_ACTION_0 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createServerReference"])("401bab28b0299646f861535a0f8397c9b5b1018ac3", __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findSourceMapURL"], "fetchProducersAction");
;
 //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vZmV0Y2hQcm9kdWNlcnNBY3Rpb24udHMiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzZXJ2ZXInO1xuXG5pbXBvcnQgeyBnZXRTZXJ2ZXJTZXNzaW9uIH0gZnJvbSAnbmV4dC1hdXRoJztcbmltcG9ydCB7IGF1dGhPcHRpb25zIH0gZnJvbSAnQC9saWIvYXV0aC5jb25maWcnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFByb2R1Y2VyT3B0aW9uIHtcbiAgaWQ6IG51bWJlcjtcbiAgbmFtZTogc3RyaW5nO1xuICBydXQ6IHN0cmluZztcbiAgZW1haWw/OiBzdHJpbmc7XG4gIGNpdHk/OiBzdHJpbmc7XG59XG5cbmludGVyZmFjZSBGZXRjaFByb2R1Y2Vyc1BhcmFtcyB7XG4gIHBhZ2U/OiBudW1iZXI7XG4gIGxpbWl0PzogbnVtYmVyO1xuICBzZWFyY2g/OiBzdHJpbmc7XG4gIHNvcnRGaWVsZD86IHN0cmluZztcbiAgc29ydD86ICdBU0MnIHwgJ0RFU0MnO1xufVxuXG5pbnRlcmZhY2UgRmV0Y2hQcm9kdWNlcnNSZXN1bHQge1xuICBkYXRhOiBQcm9kdWNlck9wdGlvbltdO1xuICB0b3RhbDogbnVtYmVyO1xuICBwYWdlOiBudW1iZXI7XG4gIGxpbWl0OiBudW1iZXI7XG59XG5cbi8qKlxuICogU2VydmVyIGFjdGlvbiBwYXJhIGNhcmdhciBwcm9kdWN0b3JlcyBkZXNkZSBlbCBiYWNrZW5kXG4gKiBTaW1pbGFyIGEgZmV0Y2hQcm9kdWNlcnNBY3Rpb24gZGVsIGZyb250ZW5kIHByaW5jaXBhbFxuICogVXRpbGl6YSBOZXh0QXV0aCBwYXJhIG9idGVuZXIgZWwgdG9rZW4gZGVsIHNlcnZpZG9yXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmZXRjaFByb2R1Y2Vyc0FjdGlvbihcbiAgcGFyYW1zPzogRmV0Y2hQcm9kdWNlcnNQYXJhbXMsXG4pOiBQcm9taXNlPEZldGNoUHJvZHVjZXJzUmVzdWx0PiB7XG4gIHRyeSB7XG4gICAgLy8gT2J0ZW5lciBsYSBzZXNpw7NuIGRlbCBzZXJ2aWRvciB1c2FuZG8gTmV4dEF1dGhcbiAgICBjb25zdCBzZXNzaW9uID0gYXdhaXQgZ2V0U2VydmVyU2Vzc2lvbihhdXRoT3B0aW9ucyk7XG4gICAgXG4gICAgaWYgKCFzZXNzaW9uPy51c2VyPy5hY2Nlc3NUb2tlbikge1xuICAgICAgY29uc29sZS53YXJuKCdObyBhY2Nlc3MgdG9rZW4gYXZhaWxhYmxlIGluIHNlcnZlciBzZXNzaW9uJyk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBkYXRhOiBbXSxcbiAgICAgICAgdG90YWw6IDAsXG4gICAgICAgIHBhZ2U6IDEsXG4gICAgICAgIGxpbWl0OiA1MDAwLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICBjb25zdCBBUElfQkFTRV9VUkwgPSBgJHtwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19BUElfVVJMfS9wcm9kdWNlcnNgO1xuXG4gICAgY29uc3QgaGVhZGVyczogSGVhZGVyc0luaXQgPSB7XG4gICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgJ0F1dGhvcml6YXRpb24nOiBgQmVhcmVyICR7c2Vzc2lvbi51c2VyLmFjY2Vzc1Rva2VufWAsXG4gICAgfTtcblxuICAgIC8vIEZldGNoIGRlc2RlIGVsIGJhY2tlbmRcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKEFQSV9CQVNFX1VSTCwge1xuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIGhlYWRlcnMsXG4gICAgICBjYWNoZTogJ25vLXN0b3JlJyxcbiAgICB9KTtcblxuICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgSFRUUCAke3Jlc3BvbnNlLnN0YXR1c306ICR7cmVzcG9uc2Uuc3RhdHVzVGV4dH1gKTtcbiAgICB9XG5cbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG5cbiAgICAvLyBOb3JtYWxpemFyIGRhdG9zXG4gICAgY29uc3Qgbm9ybWFsaXplZERhdGEgPSAocmVzdWx0LmRhdGEgfHwgcmVzdWx0IHx8IFtdKS5tYXAoKHByb2R1Y2VyOiBhbnkpID0+ICh7XG4gICAgICBpZDogcHJvZHVjZXIuaWQsXG4gICAgICBuYW1lOiBwcm9kdWNlci5uYW1lIHx8ICcnLFxuICAgICAgcnV0OiBwcm9kdWNlci5ydXQgfHwgJycsXG4gICAgICBlbWFpbDogcHJvZHVjZXIuZW1haWwsXG4gICAgICBjaXR5OiBwcm9kdWNlci5jaXR5LFxuICAgIH0pKTtcblxuICAgIC8vIEZpbHRyYWRvIGVuIGNsaWVudGVcbiAgICBsZXQgZmlsdGVyZWQgPSBub3JtYWxpemVkRGF0YTtcblxuICAgIGlmIChwYXJhbXM/LnNlYXJjaCkge1xuICAgICAgY29uc3Qgc2VhcmNoTG93ZXIgPSBwYXJhbXMuc2VhcmNoLnRvTG93ZXJDYXNlKCk7XG4gICAgICBmaWx0ZXJlZCA9IGZpbHRlcmVkLmZpbHRlcigocDogUHJvZHVjZXJPcHRpb24pID0+XG4gICAgICAgIHAubmFtZS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHNlYXJjaExvd2VyKSB8fFxuICAgICAgICBwLnJ1dC50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHNlYXJjaExvd2VyKSB8fFxuICAgICAgICBwLmVtYWlsPy50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHNlYXJjaExvd2VyKSB8fFxuICAgICAgICBwLmNpdHk/LnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoc2VhcmNoTG93ZXIpXG4gICAgICApO1xuICAgIH1cblxuICAgIC8vIE9yZGVuYW1pZW50byAocG9yIGRlZmVjdG86IG5vbWJyZSBhc2NlbmRlbnRlLCBwYXJhIGF1dG9jb21wbGV0YWRvIGVuIGLDoXNjdWxhKVxuICAgIGlmIChwYXJhbXM/LnNvcnRGaWVsZCkge1xuICAgICAgY29uc3QgZmllbGQgPSBwYXJhbXMuc29ydEZpZWxkIGFzIGtleW9mIFByb2R1Y2VyT3B0aW9uO1xuICAgICAgY29uc3QgaXNBc2MgPSBwYXJhbXMuc29ydCA9PT0gJ0FTQyc7XG4gICAgICBmaWx0ZXJlZC5zb3J0KChhOiBQcm9kdWNlck9wdGlvbiwgYjogUHJvZHVjZXJPcHRpb24pID0+IHtcbiAgICAgICAgY29uc3QgYVZhbCA9IGFbZmllbGRdIHx8ICcnO1xuICAgICAgICBjb25zdCBiVmFsID0gYltmaWVsZF0gfHwgJyc7XG4gICAgICAgIGNvbnN0IGNvbXBhcmlzb24gPSBTdHJpbmcoYVZhbCkubG9jYWxlQ29tcGFyZShTdHJpbmcoYlZhbCksICdlcycpO1xuICAgICAgICByZXR1cm4gaXNBc2MgPyBjb21wYXJpc29uIDogLWNvbXBhcmlzb247XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgZmlsdGVyZWQuc29ydCgoYTogUHJvZHVjZXJPcHRpb24sIGI6IFByb2R1Y2VyT3B0aW9uKSA9PlxuICAgICAgICBhLm5hbWUubG9jYWxlQ29tcGFyZShiLm5hbWUsICdlcycsIHsgc2Vuc2l0aXZpdHk6ICdiYXNlJyB9KSxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gUGFnaW5hY2nDs24gKGzDrW1pdGUgYWx0byBwb3IgZGVmZWN0byBwYXJhIGNhcmdhciBjYXTDoWxvZ28gY29tcGxldG8gZW4gVE1TKVxuICAgIGNvbnN0IHBhZ2UgPSBwYXJhbXM/LnBhZ2UgfHwgMTtcbiAgICBjb25zdCBsaW1pdCA9IHBhcmFtcz8ubGltaXQgPz8gNTAwMDtcbiAgICBjb25zdCBzdGFydCA9IChwYWdlIC0gMSkgKiBsaW1pdDtcbiAgICBjb25zdCBwYWdpbmF0ZWREYXRhID0gZmlsdGVyZWQuc2xpY2Uoc3RhcnQsIHN0YXJ0ICsgbGltaXQpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGRhdGE6IHBhZ2luYXRlZERhdGEsXG4gICAgICB0b3RhbDogZmlsdGVyZWQubGVuZ3RoLFxuICAgICAgcGFnZSxcbiAgICAgIGxpbWl0LFxuICAgIH07XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcignRXJyb3IgZW4gZmV0Y2hQcm9kdWNlcnNBY3Rpb246JywgZXJyb3IpO1xuICAgIHJldHVybiB7XG4gICAgICBkYXRhOiBbXSxcbiAgICAgIHRvdGFsOiAwLFxuICAgICAgcGFnZTogMSxcbiAgICAgIGxpbWl0OiA1MDAwLFxuICAgIH07XG4gIH1cbn1cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiNFRBaUNzQixpTUFBQSJ9
}),
"[project]/paddy/paddy-tms/src/actions/data:840283 [app-ssr] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createTruckDispatchWithTareAction",
    ()=>$$RSC_SERVER_ACTION_1
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-ssr] (ecmascript)");
/* __next_internal_action_entry_do_not_use__ [{"401145f9088a1dcb94d723de2ced4ed768b608da4e":"createTruckDispatchWithTareAction"},"paddy/paddy-tms/src/actions/truckDispatchActions.ts",""] */ "use turbopack no side effects";
;
const $$RSC_SERVER_ACTION_1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createServerReference"])("401145f9088a1dcb94d723de2ced4ed768b608da4e", __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findSourceMapURL"], "createTruckDispatchWithTareAction");
;
 //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vdHJ1Y2tEaXNwYXRjaEFjdGlvbnMudHMiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzZXJ2ZXInO1xuXG5pbXBvcnQgeyBnZXRTZXJ2ZXJTZXNzaW9uIH0gZnJvbSAnbmV4dC1hdXRoJztcbmltcG9ydCB7IGF1dGhPcHRpb25zIH0gZnJvbSAnQC9saWIvYXV0aC5jb25maWcnO1xuaW1wb3J0IHR5cGUgeyBMb2dpc3RpY3NQcm9kdWN0Q29kZSB9IGZyb20gJ0AvbGliL2xvZ2lzdGljc1Byb2R1Y3QnO1xuXG5jb25zdCBBUElfVVJMID0gcHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfQVBJX1VSTCB8fCAnaHR0cDovL2xvY2FsaG9zdDozMDAwL2FwaS92MSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgVHJ1Y2tEaXNwYXRjaFByb2R1Y2VyUmVmIHtcbiAgaWQ/OiBudW1iZXI7XG4gIHJ1dDogc3RyaW5nO1xuICBuYW1lOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgVHJ1Y2tEaXNwYXRjaCB7XG4gIGlkOiBudW1iZXI7XG4gIG51bWVyb190dXJubzogbnVtYmVyIHwgbnVsbDtcbiAgc3RhdHVzOiAnRVNQRVJBJyB8ICdGSU5JU0hFRCc7XG4gIHByb2R1Y2VyX2lkOiBudW1iZXI7XG4gIHByb2R1Y3Q/OiBMb2dpc3RpY3NQcm9kdWN0Q29kZTtcbiAgcHJvZHVjZXI/OiBUcnVja0Rpc3BhdGNoUHJvZHVjZXJSZWY7XG4gIGxpY2Vuc2VfcGxhdGU6IHN0cmluZztcbiAgZHJpdmVyX25hbWU/OiBzdHJpbmcgfCBudWxsO1xuICBjYXJyaWVyX2NvbXBhbnk/OiBzdHJpbmc7XG4gIGRpc3BhdGNoX2d1aWRlPzogc3RyaW5nO1xuICBncm9zc193ZWlnaHQ/OiBudW1iZXI7XG4gIHRhcmVfd2VpZ2h0PzogbnVtYmVyO1xuICBuZXRfd2VpZ2h0PzogbnVtYmVyO1xuICBlbnRyeV9hdDogRGF0ZTtcbiAgZmluaXNoZWRfYXQ/OiBEYXRlO1xuICBjcmVhdGVkX2J5Pzogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIENyZWF0ZVRydWNrRGlzcGF0Y2hXaXRoVGFyZVBheWxvYWQge1xuICBwcm9kdWNlcl9pZDogbnVtYmVyO1xuICBsaWNlbnNlX3BsYXRlOiBzdHJpbmc7XG4gIGRyaXZlcl9uYW1lPzogc3RyaW5nO1xuICBjYXJyaWVyX2NvbXBhbnk/OiBzdHJpbmc7XG4gIGRpc3BhdGNoX2d1aWRlPzogc3RyaW5nO1xuICB0YXJlX3dlaWdodDogbnVtYmVyO1xuICBwcm9kdWN0OiBMb2dpc3RpY3NQcm9kdWN0Q29kZTtcbiAgY3JlYXRlZF9ieT86IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBSZWdpc3RlckRpc3BhdGNoR3Jvc3NXZWlnaHRQYXlsb2FkIHtcbiAgdHJ1Y2tfZGlzcGF0Y2hfaWQ6IG51bWJlcjtcbiAgZ3Jvc3Nfd2VpZ2h0OiBudW1iZXI7XG4gIHN0YXR1cz86ICdGSU5JU0hFRCc7XG4gIGNyZWF0ZWRfYnk/OiBzdHJpbmc7XG59XG5cbmZ1bmN0aW9uIHBhcnNlRGlzcGF0Y2hGcm9tQXBpKHJhdzogUmVjb3JkPHN0cmluZywgdW5rbm93bj4pOiBUcnVja0Rpc3BhdGNoIHtcbiAgY29uc3QgcHJvZHVjZXIgPSByYXcucHJvZHVjZXIgYXMgVHJ1Y2tEaXNwYXRjaFByb2R1Y2VyUmVmIHwgdW5kZWZpbmVkO1xuICBjb25zdCBzdCA9IFN0cmluZyhyYXcuc3RhdHVzID8/ICcnKS50cmltKCkudG9VcHBlckNhc2UoKTtcbiAgY29uc3Qgc3RhdHVzOiBUcnVja0Rpc3BhdGNoWydzdGF0dXMnXSA9IHN0ID09PSAnRklOSVNIRUQnID8gJ0ZJTklTSEVEJyA6ICdFU1BFUkEnO1xuICBjb25zdCBwcm9kdWN0ID0gcmF3LnByb2R1Y3QgIT0gbnVsbCA/IFN0cmluZyhyYXcucHJvZHVjdCkgOiB1bmRlZmluZWQ7XG4gIGNvbnN0IHAgPVxuICAgIHByb2R1Y3QgPT09ICdDQVNDQVJJTExBJyB8fCBwcm9kdWN0ID09PSAnQVJST1pfUEFERFknXG4gICAgICA/IChwcm9kdWN0IGFzIExvZ2lzdGljc1Byb2R1Y3RDb2RlKVxuICAgICAgOiB1bmRlZmluZWQ7XG5cbiAgcmV0dXJuIHtcbiAgICBpZDogTnVtYmVyKHJhdy5pZCksXG4gICAgbnVtZXJvX3R1cm5vOlxuICAgICAgcmF3Lm51bWVyb190dXJubyAhPSBudWxsICYmICFOdW1iZXIuaXNOYU4oTnVtYmVyKHJhdy5udW1lcm9fdHVybm8pKVxuICAgICAgICA/IE51bWJlcihyYXcubnVtZXJvX3R1cm5vKVxuICAgICAgICA6IG51bGwsXG4gICAgc3RhdHVzLFxuICAgIHByb2R1Y2VyX2lkOiBOdW1iZXIocmF3LnByb2R1Y2VyX2lkID8/IDApLFxuICAgIHByb2R1Y3Q6IHAsXG4gICAgcHJvZHVjZXIsXG4gICAgbGljZW5zZV9wbGF0ZTogU3RyaW5nKHJhdy5saWNlbnNlX3BsYXRlID8/ICcnKSxcbiAgICBkcml2ZXJfbmFtZTogcmF3LmRyaXZlcl9uYW1lICE9IG51bGwgPyBTdHJpbmcocmF3LmRyaXZlcl9uYW1lKSA6IG51bGwsXG4gICAgY2Fycmllcl9jb21wYW55OlxuICAgICAgcmF3LmNhcnJpZXJfY29tcGFueSAhPSBudWxsID8gU3RyaW5nKHJhdy5jYXJyaWVyX2NvbXBhbnkpIDogdW5kZWZpbmVkLFxuICAgIGRpc3BhdGNoX2d1aWRlOlxuICAgICAgcmF3LmRpc3BhdGNoX2d1aWRlICE9IG51bGwgPyBTdHJpbmcocmF3LmRpc3BhdGNoX2d1aWRlKSA6IHVuZGVmaW5lZCxcbiAgICBncm9zc193ZWlnaHQ6XG4gICAgICByYXcuZ3Jvc3Nfd2VpZ2h0ICE9IG51bGwgPyBOdW1iZXIocmF3Lmdyb3NzX3dlaWdodCkgOiB1bmRlZmluZWQsXG4gICAgdGFyZV93ZWlnaHQ6IHJhdy50YXJlX3dlaWdodCAhPSBudWxsID8gTnVtYmVyKHJhdy50YXJlX3dlaWdodCkgOiB1bmRlZmluZWQsXG4gICAgbmV0X3dlaWdodDogcmF3Lm5ldF93ZWlnaHQgIT0gbnVsbCA/IE51bWJlcihyYXcubmV0X3dlaWdodCkgOiB1bmRlZmluZWQsXG4gICAgZW50cnlfYXQ6IG5ldyBEYXRlKFN0cmluZyhyYXcuZW50cnlfYXQgPz8gRGF0ZS5ub3coKSkpLFxuICAgIGZpbmlzaGVkX2F0OiByYXcuZmluaXNoZWRfYXQgPyBuZXcgRGF0ZShTdHJpbmcocmF3LmZpbmlzaGVkX2F0KSkgOiB1bmRlZmluZWQsXG4gICAgY3JlYXRlZF9ieTogcmF3LmNyZWF0ZWRfYnkgIT0gbnVsbCA/IFN0cmluZyhyYXcuY3JlYXRlZF9ieSkgOiB1bmRlZmluZWQsXG4gIH07XG59XG5cbi8qKiBDb2xhIGRlIHBlc2FqZTogRVNQRVJBIGNvbiB0YXJhIHkgc2luIGJydXRvIChob3kpLiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldERpc3BhdGNoZXNXZWlnaGluZ1F1ZXVlVG9kYXlBY3Rpb24oKTogUHJvbWlzZTxcbiAgVHJ1Y2tEaXNwYXRjaFtdXG4+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBzZXNzaW9uID0gYXdhaXQgZ2V0U2VydmVyU2Vzc2lvbihhdXRoT3B0aW9ucyk7XG5cbiAgICBpZiAoIXNlc3Npb24/LnVzZXI/LmFjY2Vzc1Rva2VuKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgJHtBUElfVVJMfS9sb2dpc3RpY3MvdHVybm9zL2Rpc3BhdGNoZXMvdG9kYXlgLCB7XG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgIEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHtzZXNzaW9uLnVzZXIuYWNjZXNzVG9rZW59YCxcbiAgICAgIH0sXG4gICAgICBjYWNoZTogJ25vLXN0b3JlJyxcbiAgICB9KTtcblxuICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgY29uc3QgZGF0YUFycmF5ID0gKHJlc3VsdC5kYXRhIHx8IFtdKSBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPltdO1xuICAgIHJldHVybiBkYXRhQXJyYXkubWFwKHBhcnNlRGlzcGF0Y2hGcm9tQXBpKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdFcnJvciBvYnRlbmllbmRvIGNvbGEgZGVzcGFjaG86JywgZXJyb3IpO1xuICAgIHJldHVybiBbXTtcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlVHJ1Y2tEaXNwYXRjaFdpdGhUYXJlQWN0aW9uKFxuICBwYXlsb2FkOiBDcmVhdGVUcnVja0Rpc3BhdGNoV2l0aFRhcmVQYXlsb2FkLFxuKTogUHJvbWlzZTxUcnVja0Rpc3BhdGNoPiB7XG4gIGNvbnN0IHNlc3Npb24gPSBhd2FpdCBnZXRTZXJ2ZXJTZXNzaW9uKGF1dGhPcHRpb25zKTtcblxuICBpZiAoIXNlc3Npb24/LnVzZXI/LmFjY2Vzc1Rva2VuKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdObyBhdXRlbnRpY2FkbycpO1xuICB9XG5cbiAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgJHtBUElfVVJMfS9sb2dpc3RpY3MvdHJ1Y2stZGlzcGF0Y2hlcy93aXRoLXRhcmVgLCB7XG4gICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgaGVhZGVyczoge1xuICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgIEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHtzZXNzaW9uLnVzZXIuYWNjZXNzVG9rZW59YCxcbiAgICB9LFxuICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgIHByb2R1Y2VyX2lkOiBwYXlsb2FkLnByb2R1Y2VyX2lkLFxuICAgICAgbGljZW5zZV9wbGF0ZTogcGF5bG9hZC5saWNlbnNlX3BsYXRlLFxuICAgICAgZHJpdmVyX25hbWU6IHBheWxvYWQuZHJpdmVyX25hbWUsXG4gICAgICBjYXJyaWVyX2NvbXBhbnk6IHBheWxvYWQuY2Fycmllcl9jb21wYW55LFxuICAgICAgZGlzcGF0Y2hfZ3VpZGU6IHBheWxvYWQuZGlzcGF0Y2hfZ3VpZGUsXG4gICAgICB0YXJlX3dlaWdodDogcGF5bG9hZC50YXJlX3dlaWdodCxcbiAgICAgIHByb2R1Y3Q6IHBheWxvYWQucHJvZHVjdCxcbiAgICAgIGNyZWF0ZWRfYnk6IHBheWxvYWQuY3JlYXRlZF9ieSxcbiAgICB9KSxcbiAgfSk7XG5cbiAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgIGxldCBtc2cgPSBgSFRUUCAke3Jlc3BvbnNlLnN0YXR1c31gO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBlcnIgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICBpZiAodHlwZW9mIGVycj8ubWVzc2FnZSA9PT0gJ3N0cmluZycpIG1zZyA9IGVyci5tZXNzYWdlO1xuICAgICAgZWxzZSBpZiAoQXJyYXkuaXNBcnJheShlcnI/Lm1lc3NhZ2UpKSBtc2cgPSBlcnIubWVzc2FnZS5qb2luKCcuICcpO1xuICAgIH0gY2F0Y2gge1xuICAgICAgLyogaWdub3JlICovXG4gICAgfVxuICAgIHRocm93IG5ldyBFcnJvcihtc2cpO1xuICB9XG5cbiAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICByZXR1cm4gcGFyc2VEaXNwYXRjaEZyb21BcGkocmVzdWx0LmRhdGEgYXMgUmVjb3JkPHN0cmluZywgdW5rbm93bj4pO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVnaXN0ZXJEaXNwYXRjaEdyb3NzV2VpZ2h0QWN0aW9uKFxuICBwYXlsb2FkOiBSZWdpc3RlckRpc3BhdGNoR3Jvc3NXZWlnaHRQYXlsb2FkLFxuKTogUHJvbWlzZTxUcnVja0Rpc3BhdGNoPiB7XG4gIGNvbnN0IHNlc3Npb24gPSBhd2FpdCBnZXRTZXJ2ZXJTZXNzaW9uKGF1dGhPcHRpb25zKTtcblxuICBpZiAoIXNlc3Npb24/LnVzZXI/LmFjY2Vzc1Rva2VuKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdObyBhdXRlbnRpY2FkbycpO1xuICB9XG5cbiAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgJHtBUElfVVJMfS9sb2dpc3RpY3Mvd2VpZ2hpbmdzL2Rpc3BhdGNoLWdyb3NzYCwge1xuICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgIGhlYWRlcnM6IHtcbiAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7c2Vzc2lvbi51c2VyLmFjY2Vzc1Rva2VufWAsXG4gICAgfSxcbiAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICB0cnVja19kaXNwYXRjaF9pZDogcGF5bG9hZC50cnVja19kaXNwYXRjaF9pZCxcbiAgICAgIGdyb3NzX3dlaWdodDogcGF5bG9hZC5ncm9zc193ZWlnaHQsXG4gICAgICBzdGF0dXM6IHBheWxvYWQuc3RhdHVzID8/ICdGSU5JU0hFRCcsXG4gICAgICBjcmVhdGVkX2J5OiBwYXlsb2FkLmNyZWF0ZWRfYnksXG4gICAgfSksXG4gIH0pO1xuXG4gIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICBsZXQgbXNnID0gYEhUVFAgJHtyZXNwb25zZS5zdGF0dXN9YDtcbiAgICB0cnkge1xuICAgICAgY29uc3QgZXJyID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgaWYgKHR5cGVvZiBlcnI/Lm1lc3NhZ2UgPT09ICdzdHJpbmcnKSBtc2cgPSBlcnIubWVzc2FnZTtcbiAgICAgIGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoZXJyPy5tZXNzYWdlKSkgbXNnID0gZXJyLm1lc3NhZ2Uuam9pbignLiAnKTtcbiAgICB9IGNhdGNoIHtcbiAgICAgIC8qIGlnbm9yZSAqL1xuICAgIH1cbiAgICB0aHJvdyBuZXcgRXJyb3IobXNnKTtcbiAgfVxuXG4gIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgcmV0dXJuIHBhcnNlRGlzcGF0Y2hGcm9tQXBpKHJlc3VsdC5kYXRhIGFzIFJlY29yZDxzdHJpbmcsIHVua25vd24+KTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBVcGRhdGVUcnVja0Rpc3BhdGNoUGF5bG9hZCB7XG4gIHByb2R1Y2VyX2lkPzogbnVtYmVyO1xuICBsaWNlbnNlX3BsYXRlPzogc3RyaW5nO1xuICBkcml2ZXJfbmFtZT86IHN0cmluZyB8IG51bGw7XG4gIGNhcnJpZXJfY29tcGFueT86IHN0cmluZztcbiAgZGlzcGF0Y2hfZ3VpZGU/OiBzdHJpbmc7XG4gIGdyb3NzX3dlaWdodD86IG51bWJlcjtcbiAgdGFyZV93ZWlnaHQ/OiBudW1iZXI7XG4gIHByb2R1Y3Q/OiBMb2dpc3RpY3NQcm9kdWN0Q29kZTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFRydWNrRGlzcGF0Y2hCeUlkQWN0aW9uKGlkOiBudW1iZXIpOiBQcm9taXNlPFRydWNrRGlzcGF0Y2ggfCBudWxsPiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IGdldFNlcnZlclNlc3Npb24oYXV0aE9wdGlvbnMpO1xuXG4gICAgaWYgKCFzZXNzaW9uPy51c2VyPy5hY2Nlc3NUb2tlbikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBhdXRlbnRpY2FkbycpO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYCR7QVBJX1VSTH0vbG9naXN0aWNzL3RydWNrLWRpc3BhdGNoZXMvJHtpZH1gLCB7XG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgIEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHtzZXNzaW9uLnVzZXIuYWNjZXNzVG9rZW59YCxcbiAgICAgIH0sXG4gICAgICBjYWNoZTogJ25vLXN0b3JlJyxcbiAgICB9KTtcblxuICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICByZXR1cm4gcGFyc2VEaXNwYXRjaEZyb21BcGkocmVzdWx0LmRhdGEgYXMgUmVjb3JkPHN0cmluZywgdW5rbm93bj4pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIG9idGVuaWVuZG8gZGVzcGFjaG86JywgZXJyb3IpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGRhdGVUcnVja0Rpc3BhdGNoQWN0aW9uKFxuICBpZDogbnVtYmVyLFxuICBwYXlsb2FkOiBVcGRhdGVUcnVja0Rpc3BhdGNoUGF5bG9hZCxcbik6IFByb21pc2U8VHJ1Y2tEaXNwYXRjaD4ge1xuICBjb25zdCBzZXNzaW9uID0gYXdhaXQgZ2V0U2VydmVyU2Vzc2lvbihhdXRoT3B0aW9ucyk7XG5cbiAgaWYgKCFzZXNzaW9uPy51c2VyPy5hY2Nlc3NUb2tlbikge1xuICAgIHRocm93IG5ldyBFcnJvcignTm8gYXV0ZW50aWNhZG8nKTtcbiAgfVxuXG4gIGNvbnN0IGJvZHkgPSBPYmplY3QuZnJvbUVudHJpZXMoXG4gICAgT2JqZWN0LmVudHJpZXMocGF5bG9hZCkuZmlsdGVyKChbLCB2XSkgPT4gdiAhPT0gdW5kZWZpbmVkKSxcbiAgKTtcblxuICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAke0FQSV9VUkx9L2xvZ2lzdGljcy90cnVjay1kaXNwYXRjaGVzLyR7aWR9YCwge1xuICAgIG1ldGhvZDogJ1BVVCcsXG4gICAgaGVhZGVyczoge1xuICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgIEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHtzZXNzaW9uLnVzZXIuYWNjZXNzVG9rZW59YCxcbiAgICB9LFxuICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGJvZHkpLFxuICB9KTtcblxuICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgbGV0IG1zZyA9IGBIVFRQICR7cmVzcG9uc2Uuc3RhdHVzfWA7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGVyciA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgIGlmICh0eXBlb2YgZXJyPy5tZXNzYWdlID09PSAnc3RyaW5nJykgbXNnID0gZXJyLm1lc3NhZ2U7XG4gICAgICBlbHNlIGlmIChBcnJheS5pc0FycmF5KGVycj8ubWVzc2FnZSkpIG1zZyA9IGVyci5tZXNzYWdlLmpvaW4oJy4gJyk7XG4gICAgfSBjYXRjaCB7XG4gICAgICAvKiBpZ25vcmUgKi9cbiAgICB9XG4gICAgdGhyb3cgbmV3IEVycm9yKG1zZyk7XG4gIH1cblxuICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gIHJldHVybiBwYXJzZURpc3BhdGNoRnJvbUFwaShyZXN1bHQuZGF0YSBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPik7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkZWxldGVUcnVja0Rpc3BhdGNoQWN0aW9uKGlkOiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IGdldFNlcnZlclNlc3Npb24oYXV0aE9wdGlvbnMpO1xuXG4gIGlmICghc2Vzc2lvbj8udXNlcj8uYWNjZXNzVG9rZW4pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIGF1dGVudGljYWRvJyk7XG4gIH1cblxuICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAke0FQSV9VUkx9L2xvZ2lzdGljcy90cnVjay1kaXNwYXRjaGVzLyR7aWR9YCwge1xuICAgIG1ldGhvZDogJ0RFTEVURScsXG4gICAgaGVhZGVyczoge1xuICAgICAgQXV0aG9yaXphdGlvbjogYEJlYXJlciAke3Nlc3Npb24udXNlci5hY2Nlc3NUb2tlbn1gLFxuICAgIH0sXG4gIH0pO1xuXG4gIGNvbnN0IHJlc3BvbnNlUGF5bG9hZCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKS5jYXRjaCgoKSA9PiBudWxsKTtcblxuICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgY29uc3QgcmF3ID0gKHJlc3BvbnNlUGF5bG9hZCBhcyB7IG1lc3NhZ2U/OiB1bmtub3duIH0pPy5tZXNzYWdlO1xuICAgIGNvbnN0IG1zZyA9XG4gICAgICB0eXBlb2YgcmF3ID09PSAnc3RyaW5nJ1xuICAgICAgICA/IHJhd1xuICAgICAgICA6IEFycmF5LmlzQXJyYXkocmF3KVxuICAgICAgICAgID8gcmF3LmpvaW4oJy4gJylcbiAgICAgICAgICA6IGBIVFRQICR7cmVzcG9uc2Uuc3RhdHVzfWA7XG4gICAgdGhyb3cgbmV3IEVycm9yKG1zZyk7XG4gIH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBUcnVja0Rpc3BhdGNoR3JpZFJvdyB7XG4gIGlkOiBudW1iZXI7XG4gIHN0YXR1czogc3RyaW5nO1xuICBwcm9kdWN0Pzogc3RyaW5nO1xuICBwcm9kdWNlcl9pZD86IG51bWJlcjtcbiAgbGljZW5zZV9wbGF0ZTogc3RyaW5nO1xuICBkcml2ZXJfbmFtZTogc3RyaW5nO1xuICBjYXJyaWVyX2NvbXBhbnk/OiBzdHJpbmcgfCBudWxsO1xuICBkaXNwYXRjaF9ndWlkZT86IHN0cmluZyB8IG51bGw7XG4gIGdyb3NzX3dlaWdodDogc3RyaW5nIHwgbnVtYmVyIHwgbnVsbDtcbiAgdGFyZV93ZWlnaHQ6IHN0cmluZyB8IG51bWJlciB8IG51bGw7XG4gIG5ldF93ZWlnaHQ6IHN0cmluZyB8IG51bWJlciB8IG51bGw7XG4gIGVudHJ5X2F0OiBzdHJpbmc7XG4gIGZpbmlzaGVkX2F0Pzogc3RyaW5nIHwgbnVsbDtcbiAgcHJvZHVjZXJfbmFtZTogc3RyaW5nO1xuICBwcm9kdWNlcl9ydXQ6IHN0cmluZztcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFRydWNrRGlzcGF0Y2hlc0dyaWRBY3Rpb24ocGFyYW1zOiB7XG4gIGxpbWl0PzogbnVtYmVyO1xuICBvZmZzZXQ/OiBudW1iZXI7XG4gIHNlYXJjaD86IHN0cmluZztcbiAgZmlsdGVycz86IHN0cmluZztcbiAgc29ydD86IHN0cmluZztcbiAgc29ydEZpZWxkPzogc3RyaW5nO1xufSk6IFByb21pc2U8eyByb3dzOiBUcnVja0Rpc3BhdGNoR3JpZFJvd1tdOyB0b3RhbDogbnVtYmVyIH0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBzZXNzaW9uID0gYXdhaXQgZ2V0U2VydmVyU2Vzc2lvbihhdXRoT3B0aW9ucyk7XG5cbiAgICBpZiAoIXNlc3Npb24/LnVzZXI/LmFjY2Vzc1Rva2VuKSB7XG4gICAgICByZXR1cm4geyByb3dzOiBbXSwgdG90YWw6IDAgfTtcbiAgICB9XG5cbiAgICBjb25zdCBsaW1pdCA9IE1hdGgubWluKE1hdGgubWF4KHBhcmFtcy5saW1pdCA/PyAyNSwgMSksIDUwMCk7XG4gICAgY29uc3Qgb2Zmc2V0ID0gTWF0aC5tYXgocGFyYW1zLm9mZnNldCA/PyAwLCAwKTtcblxuICAgIGNvbnN0IHFzID0gbmV3IFVSTFNlYXJjaFBhcmFtcygpO1xuICAgIHFzLnNldCgnbGltaXQnLCBTdHJpbmcobGltaXQpKTtcbiAgICBxcy5zZXQoJ29mZnNldCcsIFN0cmluZyhvZmZzZXQpKTtcbiAgICBpZiAocGFyYW1zLnNlYXJjaD8udHJpbSgpKSB7XG4gICAgICBxcy5zZXQoJ3NlYXJjaCcsIHBhcmFtcy5zZWFyY2gudHJpbSgpKTtcbiAgICB9XG4gICAgaWYgKHBhcmFtcy5maWx0ZXJzPy50cmltKCkpIHtcbiAgICAgIHFzLnNldCgnZmlsdGVycycsIHBhcmFtcy5maWx0ZXJzLnRyaW0oKSk7XG4gICAgfVxuICAgIGlmIChwYXJhbXMuc29ydD8udHJpbSgpKSB7XG4gICAgICBxcy5zZXQoJ3NvcnQnLCBwYXJhbXMuc29ydC50cmltKCkpO1xuICAgIH1cbiAgICBpZiAocGFyYW1zLnNvcnRGaWVsZD8udHJpbSgpKSB7XG4gICAgICBxcy5zZXQoJ3NvcnRGaWVsZCcsIHBhcmFtcy5zb3J0RmllbGQudHJpbSgpKTtcbiAgICB9XG5cbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFxuICAgICAgYCR7QVBJX1VSTH0vbG9naXN0aWNzL3RydWNrLWRpc3BhdGNoZXMvZ3JpZD8ke3FzLnRvU3RyaW5nKCl9YCxcbiAgICAgIHtcbiAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgIEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHtzZXNzaW9uLnVzZXIuYWNjZXNzVG9rZW59YCxcbiAgICAgICAgfSxcbiAgICAgICAgY2FjaGU6ICduby1zdG9yZScsXG4gICAgICB9LFxuICAgICk7XG5cbiAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICByZXR1cm4geyByb3dzOiBbXSwgdG90YWw6IDAgfTtcbiAgICB9XG5cbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgY29uc3QgcGF5bG9hZCA9IHJlc3VsdC5kYXRhIGFzIHsgZGF0YTogdW5rbm93bltdOyB0b3RhbDogbnVtYmVyIH0gfCB1bmRlZmluZWQ7XG4gICAgY29uc3QgcmF3ID0gKHBheWxvYWQ/LmRhdGEgPz8gW10pIGFzIFJlY29yZDxzdHJpbmcsIHVua25vd24+W107XG4gICAgY29uc3QgdG90YWwgPSB0eXBlb2YgcGF5bG9hZD8udG90YWwgPT09ICdudW1iZXInID8gcGF5bG9hZC50b3RhbCA6IHJhdy5sZW5ndGg7XG5cbiAgICBjb25zdCByb3dzOiBUcnVja0Rpc3BhdGNoR3JpZFJvd1tdID0gcmF3Lm1hcCgocikgPT4ge1xuICAgICAgY29uc3QgcHJvZHVjZXIgPSByLnByb2R1Y2VyIGFzIHsgbmFtZT86IHN0cmluZzsgcnV0Pzogc3RyaW5nIH0gfCB1bmRlZmluZWQ7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBpZDogTnVtYmVyKHIuaWQpLFxuICAgICAgICBzdGF0dXM6IFN0cmluZyhyLnN0YXR1cyA/PyAnJyksXG4gICAgICAgIHByb2R1Y3Q6IHIucHJvZHVjdCAhPSBudWxsID8gU3RyaW5nKHIucHJvZHVjdCkgOiB1bmRlZmluZWQsXG4gICAgICAgIHByb2R1Y2VyX2lkOlxuICAgICAgICAgIHIucHJvZHVjZXJfaWQgIT0gbnVsbCA/IE51bWJlcihyLnByb2R1Y2VyX2lkKSA6IHVuZGVmaW5lZCxcbiAgICAgICAgbGljZW5zZV9wbGF0ZTogU3RyaW5nKHIubGljZW5zZV9wbGF0ZSA/PyAnJyksXG4gICAgICAgIGRyaXZlcl9uYW1lOiBTdHJpbmcoci5kcml2ZXJfbmFtZSA/PyAnJyksXG4gICAgICAgIGNhcnJpZXJfY29tcGFueTpcbiAgICAgICAgICByLmNhcnJpZXJfY29tcGFueSAhPSBudWxsID8gU3RyaW5nKHIuY2Fycmllcl9jb21wYW55KSA6IG51bGwsXG4gICAgICAgIGRpc3BhdGNoX2d1aWRlOlxuICAgICAgICAgIHIuZGlzcGF0Y2hfZ3VpZGUgIT0gbnVsbCA/IFN0cmluZyhyLmRpc3BhdGNoX2d1aWRlKSA6IG51bGwsXG4gICAgICAgIGdyb3NzX3dlaWdodDogci5ncm9zc193ZWlnaHQgYXMgc3RyaW5nIHwgbnVtYmVyIHwgbnVsbCxcbiAgICAgICAgdGFyZV93ZWlnaHQ6IHIudGFyZV93ZWlnaHQgYXMgc3RyaW5nIHwgbnVtYmVyIHwgbnVsbCxcbiAgICAgICAgbmV0X3dlaWdodDogci5uZXRfd2VpZ2h0IGFzIHN0cmluZyB8IG51bWJlciB8IG51bGwsXG4gICAgICAgIGVudHJ5X2F0OiBTdHJpbmcoci5lbnRyeV9hdCA/PyAnJyksXG4gICAgICAgIGZpbmlzaGVkX2F0OiByLmZpbmlzaGVkX2F0ICE9IG51bGwgPyBTdHJpbmcoci5maW5pc2hlZF9hdCkgOiBudWxsLFxuICAgICAgICBwcm9kdWNlcl9uYW1lOiBwcm9kdWNlcj8ubmFtZSA/PyAnJyxcbiAgICAgICAgcHJvZHVjZXJfcnV0OiBwcm9kdWNlcj8ucnV0ID8/ICcnLFxuICAgICAgfTtcbiAgICB9KTtcblxuICAgIHJldHVybiB7IHJvd3MsIHRvdGFsIH07XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcignRXJyb3IgZ3JpZCBkZXNwYWNob3M6JywgZXJyb3IpO1xuICAgIHJldHVybiB7IHJvd3M6IFtdLCB0b3RhbDogMCB9O1xuICB9XG59XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6InlVQXNIc0IsOE1BQUEifQ==
}),
"[project]/paddy/paddy-tms/src/actions/data:043894 [app-ssr] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "registerDispatchGrossWeightAction",
    ()=>$$RSC_SERVER_ACTION_2
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-ssr] (ecmascript)");
/* __next_internal_action_entry_do_not_use__ [{"406da13ef1393d4256529ebb141a8e24c9e1150b8e":"registerDispatchGrossWeightAction"},"paddy/paddy-tms/src/actions/truckDispatchActions.ts",""] */ "use turbopack no side effects";
;
const $$RSC_SERVER_ACTION_2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createServerReference"])("406da13ef1393d4256529ebb141a8e24c9e1150b8e", __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findSourceMapURL"], "registerDispatchGrossWeightAction");
;
 //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vdHJ1Y2tEaXNwYXRjaEFjdGlvbnMudHMiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzZXJ2ZXInO1xuXG5pbXBvcnQgeyBnZXRTZXJ2ZXJTZXNzaW9uIH0gZnJvbSAnbmV4dC1hdXRoJztcbmltcG9ydCB7IGF1dGhPcHRpb25zIH0gZnJvbSAnQC9saWIvYXV0aC5jb25maWcnO1xuaW1wb3J0IHR5cGUgeyBMb2dpc3RpY3NQcm9kdWN0Q29kZSB9IGZyb20gJ0AvbGliL2xvZ2lzdGljc1Byb2R1Y3QnO1xuXG5jb25zdCBBUElfVVJMID0gcHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfQVBJX1VSTCB8fCAnaHR0cDovL2xvY2FsaG9zdDozMDAwL2FwaS92MSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgVHJ1Y2tEaXNwYXRjaFByb2R1Y2VyUmVmIHtcbiAgaWQ/OiBudW1iZXI7XG4gIHJ1dDogc3RyaW5nO1xuICBuYW1lOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgVHJ1Y2tEaXNwYXRjaCB7XG4gIGlkOiBudW1iZXI7XG4gIG51bWVyb190dXJubzogbnVtYmVyIHwgbnVsbDtcbiAgc3RhdHVzOiAnRVNQRVJBJyB8ICdGSU5JU0hFRCc7XG4gIHByb2R1Y2VyX2lkOiBudW1iZXI7XG4gIHByb2R1Y3Q/OiBMb2dpc3RpY3NQcm9kdWN0Q29kZTtcbiAgcHJvZHVjZXI/OiBUcnVja0Rpc3BhdGNoUHJvZHVjZXJSZWY7XG4gIGxpY2Vuc2VfcGxhdGU6IHN0cmluZztcbiAgZHJpdmVyX25hbWU/OiBzdHJpbmcgfCBudWxsO1xuICBjYXJyaWVyX2NvbXBhbnk/OiBzdHJpbmc7XG4gIGRpc3BhdGNoX2d1aWRlPzogc3RyaW5nO1xuICBncm9zc193ZWlnaHQ/OiBudW1iZXI7XG4gIHRhcmVfd2VpZ2h0PzogbnVtYmVyO1xuICBuZXRfd2VpZ2h0PzogbnVtYmVyO1xuICBlbnRyeV9hdDogRGF0ZTtcbiAgZmluaXNoZWRfYXQ/OiBEYXRlO1xuICBjcmVhdGVkX2J5Pzogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIENyZWF0ZVRydWNrRGlzcGF0Y2hXaXRoVGFyZVBheWxvYWQge1xuICBwcm9kdWNlcl9pZDogbnVtYmVyO1xuICBsaWNlbnNlX3BsYXRlOiBzdHJpbmc7XG4gIGRyaXZlcl9uYW1lPzogc3RyaW5nO1xuICBjYXJyaWVyX2NvbXBhbnk/OiBzdHJpbmc7XG4gIGRpc3BhdGNoX2d1aWRlPzogc3RyaW5nO1xuICB0YXJlX3dlaWdodDogbnVtYmVyO1xuICBwcm9kdWN0OiBMb2dpc3RpY3NQcm9kdWN0Q29kZTtcbiAgY3JlYXRlZF9ieT86IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBSZWdpc3RlckRpc3BhdGNoR3Jvc3NXZWlnaHRQYXlsb2FkIHtcbiAgdHJ1Y2tfZGlzcGF0Y2hfaWQ6IG51bWJlcjtcbiAgZ3Jvc3Nfd2VpZ2h0OiBudW1iZXI7XG4gIHN0YXR1cz86ICdGSU5JU0hFRCc7XG4gIGNyZWF0ZWRfYnk/OiBzdHJpbmc7XG59XG5cbmZ1bmN0aW9uIHBhcnNlRGlzcGF0Y2hGcm9tQXBpKHJhdzogUmVjb3JkPHN0cmluZywgdW5rbm93bj4pOiBUcnVja0Rpc3BhdGNoIHtcbiAgY29uc3QgcHJvZHVjZXIgPSByYXcucHJvZHVjZXIgYXMgVHJ1Y2tEaXNwYXRjaFByb2R1Y2VyUmVmIHwgdW5kZWZpbmVkO1xuICBjb25zdCBzdCA9IFN0cmluZyhyYXcuc3RhdHVzID8/ICcnKS50cmltKCkudG9VcHBlckNhc2UoKTtcbiAgY29uc3Qgc3RhdHVzOiBUcnVja0Rpc3BhdGNoWydzdGF0dXMnXSA9IHN0ID09PSAnRklOSVNIRUQnID8gJ0ZJTklTSEVEJyA6ICdFU1BFUkEnO1xuICBjb25zdCBwcm9kdWN0ID0gcmF3LnByb2R1Y3QgIT0gbnVsbCA/IFN0cmluZyhyYXcucHJvZHVjdCkgOiB1bmRlZmluZWQ7XG4gIGNvbnN0IHAgPVxuICAgIHByb2R1Y3QgPT09ICdDQVNDQVJJTExBJyB8fCBwcm9kdWN0ID09PSAnQVJST1pfUEFERFknXG4gICAgICA/IChwcm9kdWN0IGFzIExvZ2lzdGljc1Byb2R1Y3RDb2RlKVxuICAgICAgOiB1bmRlZmluZWQ7XG5cbiAgcmV0dXJuIHtcbiAgICBpZDogTnVtYmVyKHJhdy5pZCksXG4gICAgbnVtZXJvX3R1cm5vOlxuICAgICAgcmF3Lm51bWVyb190dXJubyAhPSBudWxsICYmICFOdW1iZXIuaXNOYU4oTnVtYmVyKHJhdy5udW1lcm9fdHVybm8pKVxuICAgICAgICA/IE51bWJlcihyYXcubnVtZXJvX3R1cm5vKVxuICAgICAgICA6IG51bGwsXG4gICAgc3RhdHVzLFxuICAgIHByb2R1Y2VyX2lkOiBOdW1iZXIocmF3LnByb2R1Y2VyX2lkID8/IDApLFxuICAgIHByb2R1Y3Q6IHAsXG4gICAgcHJvZHVjZXIsXG4gICAgbGljZW5zZV9wbGF0ZTogU3RyaW5nKHJhdy5saWNlbnNlX3BsYXRlID8/ICcnKSxcbiAgICBkcml2ZXJfbmFtZTogcmF3LmRyaXZlcl9uYW1lICE9IG51bGwgPyBTdHJpbmcocmF3LmRyaXZlcl9uYW1lKSA6IG51bGwsXG4gICAgY2Fycmllcl9jb21wYW55OlxuICAgICAgcmF3LmNhcnJpZXJfY29tcGFueSAhPSBudWxsID8gU3RyaW5nKHJhdy5jYXJyaWVyX2NvbXBhbnkpIDogdW5kZWZpbmVkLFxuICAgIGRpc3BhdGNoX2d1aWRlOlxuICAgICAgcmF3LmRpc3BhdGNoX2d1aWRlICE9IG51bGwgPyBTdHJpbmcocmF3LmRpc3BhdGNoX2d1aWRlKSA6IHVuZGVmaW5lZCxcbiAgICBncm9zc193ZWlnaHQ6XG4gICAgICByYXcuZ3Jvc3Nfd2VpZ2h0ICE9IG51bGwgPyBOdW1iZXIocmF3Lmdyb3NzX3dlaWdodCkgOiB1bmRlZmluZWQsXG4gICAgdGFyZV93ZWlnaHQ6IHJhdy50YXJlX3dlaWdodCAhPSBudWxsID8gTnVtYmVyKHJhdy50YXJlX3dlaWdodCkgOiB1bmRlZmluZWQsXG4gICAgbmV0X3dlaWdodDogcmF3Lm5ldF93ZWlnaHQgIT0gbnVsbCA/IE51bWJlcihyYXcubmV0X3dlaWdodCkgOiB1bmRlZmluZWQsXG4gICAgZW50cnlfYXQ6IG5ldyBEYXRlKFN0cmluZyhyYXcuZW50cnlfYXQgPz8gRGF0ZS5ub3coKSkpLFxuICAgIGZpbmlzaGVkX2F0OiByYXcuZmluaXNoZWRfYXQgPyBuZXcgRGF0ZShTdHJpbmcocmF3LmZpbmlzaGVkX2F0KSkgOiB1bmRlZmluZWQsXG4gICAgY3JlYXRlZF9ieTogcmF3LmNyZWF0ZWRfYnkgIT0gbnVsbCA/IFN0cmluZyhyYXcuY3JlYXRlZF9ieSkgOiB1bmRlZmluZWQsXG4gIH07XG59XG5cbi8qKiBDb2xhIGRlIHBlc2FqZTogRVNQRVJBIGNvbiB0YXJhIHkgc2luIGJydXRvIChob3kpLiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldERpc3BhdGNoZXNXZWlnaGluZ1F1ZXVlVG9kYXlBY3Rpb24oKTogUHJvbWlzZTxcbiAgVHJ1Y2tEaXNwYXRjaFtdXG4+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBzZXNzaW9uID0gYXdhaXQgZ2V0U2VydmVyU2Vzc2lvbihhdXRoT3B0aW9ucyk7XG5cbiAgICBpZiAoIXNlc3Npb24/LnVzZXI/LmFjY2Vzc1Rva2VuKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgJHtBUElfVVJMfS9sb2dpc3RpY3MvdHVybm9zL2Rpc3BhdGNoZXMvdG9kYXlgLCB7XG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgIEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHtzZXNzaW9uLnVzZXIuYWNjZXNzVG9rZW59YCxcbiAgICAgIH0sXG4gICAgICBjYWNoZTogJ25vLXN0b3JlJyxcbiAgICB9KTtcblxuICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgY29uc3QgZGF0YUFycmF5ID0gKHJlc3VsdC5kYXRhIHx8IFtdKSBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPltdO1xuICAgIHJldHVybiBkYXRhQXJyYXkubWFwKHBhcnNlRGlzcGF0Y2hGcm9tQXBpKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdFcnJvciBvYnRlbmllbmRvIGNvbGEgZGVzcGFjaG86JywgZXJyb3IpO1xuICAgIHJldHVybiBbXTtcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlVHJ1Y2tEaXNwYXRjaFdpdGhUYXJlQWN0aW9uKFxuICBwYXlsb2FkOiBDcmVhdGVUcnVja0Rpc3BhdGNoV2l0aFRhcmVQYXlsb2FkLFxuKTogUHJvbWlzZTxUcnVja0Rpc3BhdGNoPiB7XG4gIGNvbnN0IHNlc3Npb24gPSBhd2FpdCBnZXRTZXJ2ZXJTZXNzaW9uKGF1dGhPcHRpb25zKTtcblxuICBpZiAoIXNlc3Npb24/LnVzZXI/LmFjY2Vzc1Rva2VuKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdObyBhdXRlbnRpY2FkbycpO1xuICB9XG5cbiAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgJHtBUElfVVJMfS9sb2dpc3RpY3MvdHJ1Y2stZGlzcGF0Y2hlcy93aXRoLXRhcmVgLCB7XG4gICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgaGVhZGVyczoge1xuICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgIEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHtzZXNzaW9uLnVzZXIuYWNjZXNzVG9rZW59YCxcbiAgICB9LFxuICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgIHByb2R1Y2VyX2lkOiBwYXlsb2FkLnByb2R1Y2VyX2lkLFxuICAgICAgbGljZW5zZV9wbGF0ZTogcGF5bG9hZC5saWNlbnNlX3BsYXRlLFxuICAgICAgZHJpdmVyX25hbWU6IHBheWxvYWQuZHJpdmVyX25hbWUsXG4gICAgICBjYXJyaWVyX2NvbXBhbnk6IHBheWxvYWQuY2Fycmllcl9jb21wYW55LFxuICAgICAgZGlzcGF0Y2hfZ3VpZGU6IHBheWxvYWQuZGlzcGF0Y2hfZ3VpZGUsXG4gICAgICB0YXJlX3dlaWdodDogcGF5bG9hZC50YXJlX3dlaWdodCxcbiAgICAgIHByb2R1Y3Q6IHBheWxvYWQucHJvZHVjdCxcbiAgICAgIGNyZWF0ZWRfYnk6IHBheWxvYWQuY3JlYXRlZF9ieSxcbiAgICB9KSxcbiAgfSk7XG5cbiAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgIGxldCBtc2cgPSBgSFRUUCAke3Jlc3BvbnNlLnN0YXR1c31gO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBlcnIgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICBpZiAodHlwZW9mIGVycj8ubWVzc2FnZSA9PT0gJ3N0cmluZycpIG1zZyA9IGVyci5tZXNzYWdlO1xuICAgICAgZWxzZSBpZiAoQXJyYXkuaXNBcnJheShlcnI/Lm1lc3NhZ2UpKSBtc2cgPSBlcnIubWVzc2FnZS5qb2luKCcuICcpO1xuICAgIH0gY2F0Y2gge1xuICAgICAgLyogaWdub3JlICovXG4gICAgfVxuICAgIHRocm93IG5ldyBFcnJvcihtc2cpO1xuICB9XG5cbiAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICByZXR1cm4gcGFyc2VEaXNwYXRjaEZyb21BcGkocmVzdWx0LmRhdGEgYXMgUmVjb3JkPHN0cmluZywgdW5rbm93bj4pO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVnaXN0ZXJEaXNwYXRjaEdyb3NzV2VpZ2h0QWN0aW9uKFxuICBwYXlsb2FkOiBSZWdpc3RlckRpc3BhdGNoR3Jvc3NXZWlnaHRQYXlsb2FkLFxuKTogUHJvbWlzZTxUcnVja0Rpc3BhdGNoPiB7XG4gIGNvbnN0IHNlc3Npb24gPSBhd2FpdCBnZXRTZXJ2ZXJTZXNzaW9uKGF1dGhPcHRpb25zKTtcblxuICBpZiAoIXNlc3Npb24/LnVzZXI/LmFjY2Vzc1Rva2VuKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdObyBhdXRlbnRpY2FkbycpO1xuICB9XG5cbiAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgJHtBUElfVVJMfS9sb2dpc3RpY3Mvd2VpZ2hpbmdzL2Rpc3BhdGNoLWdyb3NzYCwge1xuICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgIGhlYWRlcnM6IHtcbiAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7c2Vzc2lvbi51c2VyLmFjY2Vzc1Rva2VufWAsXG4gICAgfSxcbiAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICB0cnVja19kaXNwYXRjaF9pZDogcGF5bG9hZC50cnVja19kaXNwYXRjaF9pZCxcbiAgICAgIGdyb3NzX3dlaWdodDogcGF5bG9hZC5ncm9zc193ZWlnaHQsXG4gICAgICBzdGF0dXM6IHBheWxvYWQuc3RhdHVzID8/ICdGSU5JU0hFRCcsXG4gICAgICBjcmVhdGVkX2J5OiBwYXlsb2FkLmNyZWF0ZWRfYnksXG4gICAgfSksXG4gIH0pO1xuXG4gIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICBsZXQgbXNnID0gYEhUVFAgJHtyZXNwb25zZS5zdGF0dXN9YDtcbiAgICB0cnkge1xuICAgICAgY29uc3QgZXJyID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgaWYgKHR5cGVvZiBlcnI/Lm1lc3NhZ2UgPT09ICdzdHJpbmcnKSBtc2cgPSBlcnIubWVzc2FnZTtcbiAgICAgIGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoZXJyPy5tZXNzYWdlKSkgbXNnID0gZXJyLm1lc3NhZ2Uuam9pbignLiAnKTtcbiAgICB9IGNhdGNoIHtcbiAgICAgIC8qIGlnbm9yZSAqL1xuICAgIH1cbiAgICB0aHJvdyBuZXcgRXJyb3IobXNnKTtcbiAgfVxuXG4gIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgcmV0dXJuIHBhcnNlRGlzcGF0Y2hGcm9tQXBpKHJlc3VsdC5kYXRhIGFzIFJlY29yZDxzdHJpbmcsIHVua25vd24+KTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBVcGRhdGVUcnVja0Rpc3BhdGNoUGF5bG9hZCB7XG4gIHByb2R1Y2VyX2lkPzogbnVtYmVyO1xuICBsaWNlbnNlX3BsYXRlPzogc3RyaW5nO1xuICBkcml2ZXJfbmFtZT86IHN0cmluZyB8IG51bGw7XG4gIGNhcnJpZXJfY29tcGFueT86IHN0cmluZztcbiAgZGlzcGF0Y2hfZ3VpZGU/OiBzdHJpbmc7XG4gIGdyb3NzX3dlaWdodD86IG51bWJlcjtcbiAgdGFyZV93ZWlnaHQ/OiBudW1iZXI7XG4gIHByb2R1Y3Q/OiBMb2dpc3RpY3NQcm9kdWN0Q29kZTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFRydWNrRGlzcGF0Y2hCeUlkQWN0aW9uKGlkOiBudW1iZXIpOiBQcm9taXNlPFRydWNrRGlzcGF0Y2ggfCBudWxsPiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IGdldFNlcnZlclNlc3Npb24oYXV0aE9wdGlvbnMpO1xuXG4gICAgaWYgKCFzZXNzaW9uPy51c2VyPy5hY2Nlc3NUb2tlbikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBhdXRlbnRpY2FkbycpO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYCR7QVBJX1VSTH0vbG9naXN0aWNzL3RydWNrLWRpc3BhdGNoZXMvJHtpZH1gLCB7XG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgIEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHtzZXNzaW9uLnVzZXIuYWNjZXNzVG9rZW59YCxcbiAgICAgIH0sXG4gICAgICBjYWNoZTogJ25vLXN0b3JlJyxcbiAgICB9KTtcblxuICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICByZXR1cm4gcGFyc2VEaXNwYXRjaEZyb21BcGkocmVzdWx0LmRhdGEgYXMgUmVjb3JkPHN0cmluZywgdW5rbm93bj4pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIG9idGVuaWVuZG8gZGVzcGFjaG86JywgZXJyb3IpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGRhdGVUcnVja0Rpc3BhdGNoQWN0aW9uKFxuICBpZDogbnVtYmVyLFxuICBwYXlsb2FkOiBVcGRhdGVUcnVja0Rpc3BhdGNoUGF5bG9hZCxcbik6IFByb21pc2U8VHJ1Y2tEaXNwYXRjaD4ge1xuICBjb25zdCBzZXNzaW9uID0gYXdhaXQgZ2V0U2VydmVyU2Vzc2lvbihhdXRoT3B0aW9ucyk7XG5cbiAgaWYgKCFzZXNzaW9uPy51c2VyPy5hY2Nlc3NUb2tlbikge1xuICAgIHRocm93IG5ldyBFcnJvcignTm8gYXV0ZW50aWNhZG8nKTtcbiAgfVxuXG4gIGNvbnN0IGJvZHkgPSBPYmplY3QuZnJvbUVudHJpZXMoXG4gICAgT2JqZWN0LmVudHJpZXMocGF5bG9hZCkuZmlsdGVyKChbLCB2XSkgPT4gdiAhPT0gdW5kZWZpbmVkKSxcbiAgKTtcblxuICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAke0FQSV9VUkx9L2xvZ2lzdGljcy90cnVjay1kaXNwYXRjaGVzLyR7aWR9YCwge1xuICAgIG1ldGhvZDogJ1BVVCcsXG4gICAgaGVhZGVyczoge1xuICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgIEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHtzZXNzaW9uLnVzZXIuYWNjZXNzVG9rZW59YCxcbiAgICB9LFxuICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGJvZHkpLFxuICB9KTtcblxuICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgbGV0IG1zZyA9IGBIVFRQICR7cmVzcG9uc2Uuc3RhdHVzfWA7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGVyciA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgIGlmICh0eXBlb2YgZXJyPy5tZXNzYWdlID09PSAnc3RyaW5nJykgbXNnID0gZXJyLm1lc3NhZ2U7XG4gICAgICBlbHNlIGlmIChBcnJheS5pc0FycmF5KGVycj8ubWVzc2FnZSkpIG1zZyA9IGVyci5tZXNzYWdlLmpvaW4oJy4gJyk7XG4gICAgfSBjYXRjaCB7XG4gICAgICAvKiBpZ25vcmUgKi9cbiAgICB9XG4gICAgdGhyb3cgbmV3IEVycm9yKG1zZyk7XG4gIH1cblxuICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gIHJldHVybiBwYXJzZURpc3BhdGNoRnJvbUFwaShyZXN1bHQuZGF0YSBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPik7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkZWxldGVUcnVja0Rpc3BhdGNoQWN0aW9uKGlkOiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IGdldFNlcnZlclNlc3Npb24oYXV0aE9wdGlvbnMpO1xuXG4gIGlmICghc2Vzc2lvbj8udXNlcj8uYWNjZXNzVG9rZW4pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIGF1dGVudGljYWRvJyk7XG4gIH1cblxuICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAke0FQSV9VUkx9L2xvZ2lzdGljcy90cnVjay1kaXNwYXRjaGVzLyR7aWR9YCwge1xuICAgIG1ldGhvZDogJ0RFTEVURScsXG4gICAgaGVhZGVyczoge1xuICAgICAgQXV0aG9yaXphdGlvbjogYEJlYXJlciAke3Nlc3Npb24udXNlci5hY2Nlc3NUb2tlbn1gLFxuICAgIH0sXG4gIH0pO1xuXG4gIGNvbnN0IHJlc3BvbnNlUGF5bG9hZCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKS5jYXRjaCgoKSA9PiBudWxsKTtcblxuICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgY29uc3QgcmF3ID0gKHJlc3BvbnNlUGF5bG9hZCBhcyB7IG1lc3NhZ2U/OiB1bmtub3duIH0pPy5tZXNzYWdlO1xuICAgIGNvbnN0IG1zZyA9XG4gICAgICB0eXBlb2YgcmF3ID09PSAnc3RyaW5nJ1xuICAgICAgICA/IHJhd1xuICAgICAgICA6IEFycmF5LmlzQXJyYXkocmF3KVxuICAgICAgICAgID8gcmF3LmpvaW4oJy4gJylcbiAgICAgICAgICA6IGBIVFRQICR7cmVzcG9uc2Uuc3RhdHVzfWA7XG4gICAgdGhyb3cgbmV3IEVycm9yKG1zZyk7XG4gIH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBUcnVja0Rpc3BhdGNoR3JpZFJvdyB7XG4gIGlkOiBudW1iZXI7XG4gIHN0YXR1czogc3RyaW5nO1xuICBwcm9kdWN0Pzogc3RyaW5nO1xuICBwcm9kdWNlcl9pZD86IG51bWJlcjtcbiAgbGljZW5zZV9wbGF0ZTogc3RyaW5nO1xuICBkcml2ZXJfbmFtZTogc3RyaW5nO1xuICBjYXJyaWVyX2NvbXBhbnk/OiBzdHJpbmcgfCBudWxsO1xuICBkaXNwYXRjaF9ndWlkZT86IHN0cmluZyB8IG51bGw7XG4gIGdyb3NzX3dlaWdodDogc3RyaW5nIHwgbnVtYmVyIHwgbnVsbDtcbiAgdGFyZV93ZWlnaHQ6IHN0cmluZyB8IG51bWJlciB8IG51bGw7XG4gIG5ldF93ZWlnaHQ6IHN0cmluZyB8IG51bWJlciB8IG51bGw7XG4gIGVudHJ5X2F0OiBzdHJpbmc7XG4gIGZpbmlzaGVkX2F0Pzogc3RyaW5nIHwgbnVsbDtcbiAgcHJvZHVjZXJfbmFtZTogc3RyaW5nO1xuICBwcm9kdWNlcl9ydXQ6IHN0cmluZztcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFRydWNrRGlzcGF0Y2hlc0dyaWRBY3Rpb24ocGFyYW1zOiB7XG4gIGxpbWl0PzogbnVtYmVyO1xuICBvZmZzZXQ/OiBudW1iZXI7XG4gIHNlYXJjaD86IHN0cmluZztcbiAgZmlsdGVycz86IHN0cmluZztcbiAgc29ydD86IHN0cmluZztcbiAgc29ydEZpZWxkPzogc3RyaW5nO1xufSk6IFByb21pc2U8eyByb3dzOiBUcnVja0Rpc3BhdGNoR3JpZFJvd1tdOyB0b3RhbDogbnVtYmVyIH0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBzZXNzaW9uID0gYXdhaXQgZ2V0U2VydmVyU2Vzc2lvbihhdXRoT3B0aW9ucyk7XG5cbiAgICBpZiAoIXNlc3Npb24/LnVzZXI/LmFjY2Vzc1Rva2VuKSB7XG4gICAgICByZXR1cm4geyByb3dzOiBbXSwgdG90YWw6IDAgfTtcbiAgICB9XG5cbiAgICBjb25zdCBsaW1pdCA9IE1hdGgubWluKE1hdGgubWF4KHBhcmFtcy5saW1pdCA/PyAyNSwgMSksIDUwMCk7XG4gICAgY29uc3Qgb2Zmc2V0ID0gTWF0aC5tYXgocGFyYW1zLm9mZnNldCA/PyAwLCAwKTtcblxuICAgIGNvbnN0IHFzID0gbmV3IFVSTFNlYXJjaFBhcmFtcygpO1xuICAgIHFzLnNldCgnbGltaXQnLCBTdHJpbmcobGltaXQpKTtcbiAgICBxcy5zZXQoJ29mZnNldCcsIFN0cmluZyhvZmZzZXQpKTtcbiAgICBpZiAocGFyYW1zLnNlYXJjaD8udHJpbSgpKSB7XG4gICAgICBxcy5zZXQoJ3NlYXJjaCcsIHBhcmFtcy5zZWFyY2gudHJpbSgpKTtcbiAgICB9XG4gICAgaWYgKHBhcmFtcy5maWx0ZXJzPy50cmltKCkpIHtcbiAgICAgIHFzLnNldCgnZmlsdGVycycsIHBhcmFtcy5maWx0ZXJzLnRyaW0oKSk7XG4gICAgfVxuICAgIGlmIChwYXJhbXMuc29ydD8udHJpbSgpKSB7XG4gICAgICBxcy5zZXQoJ3NvcnQnLCBwYXJhbXMuc29ydC50cmltKCkpO1xuICAgIH1cbiAgICBpZiAocGFyYW1zLnNvcnRGaWVsZD8udHJpbSgpKSB7XG4gICAgICBxcy5zZXQoJ3NvcnRGaWVsZCcsIHBhcmFtcy5zb3J0RmllbGQudHJpbSgpKTtcbiAgICB9XG5cbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFxuICAgICAgYCR7QVBJX1VSTH0vbG9naXN0aWNzL3RydWNrLWRpc3BhdGNoZXMvZ3JpZD8ke3FzLnRvU3RyaW5nKCl9YCxcbiAgICAgIHtcbiAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgIEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHtzZXNzaW9uLnVzZXIuYWNjZXNzVG9rZW59YCxcbiAgICAgICAgfSxcbiAgICAgICAgY2FjaGU6ICduby1zdG9yZScsXG4gICAgICB9LFxuICAgICk7XG5cbiAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICByZXR1cm4geyByb3dzOiBbXSwgdG90YWw6IDAgfTtcbiAgICB9XG5cbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgY29uc3QgcGF5bG9hZCA9IHJlc3VsdC5kYXRhIGFzIHsgZGF0YTogdW5rbm93bltdOyB0b3RhbDogbnVtYmVyIH0gfCB1bmRlZmluZWQ7XG4gICAgY29uc3QgcmF3ID0gKHBheWxvYWQ/LmRhdGEgPz8gW10pIGFzIFJlY29yZDxzdHJpbmcsIHVua25vd24+W107XG4gICAgY29uc3QgdG90YWwgPSB0eXBlb2YgcGF5bG9hZD8udG90YWwgPT09ICdudW1iZXInID8gcGF5bG9hZC50b3RhbCA6IHJhdy5sZW5ndGg7XG5cbiAgICBjb25zdCByb3dzOiBUcnVja0Rpc3BhdGNoR3JpZFJvd1tdID0gcmF3Lm1hcCgocikgPT4ge1xuICAgICAgY29uc3QgcHJvZHVjZXIgPSByLnByb2R1Y2VyIGFzIHsgbmFtZT86IHN0cmluZzsgcnV0Pzogc3RyaW5nIH0gfCB1bmRlZmluZWQ7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBpZDogTnVtYmVyKHIuaWQpLFxuICAgICAgICBzdGF0dXM6IFN0cmluZyhyLnN0YXR1cyA/PyAnJyksXG4gICAgICAgIHByb2R1Y3Q6IHIucHJvZHVjdCAhPSBudWxsID8gU3RyaW5nKHIucHJvZHVjdCkgOiB1bmRlZmluZWQsXG4gICAgICAgIHByb2R1Y2VyX2lkOlxuICAgICAgICAgIHIucHJvZHVjZXJfaWQgIT0gbnVsbCA/IE51bWJlcihyLnByb2R1Y2VyX2lkKSA6IHVuZGVmaW5lZCxcbiAgICAgICAgbGljZW5zZV9wbGF0ZTogU3RyaW5nKHIubGljZW5zZV9wbGF0ZSA/PyAnJyksXG4gICAgICAgIGRyaXZlcl9uYW1lOiBTdHJpbmcoci5kcml2ZXJfbmFtZSA/PyAnJyksXG4gICAgICAgIGNhcnJpZXJfY29tcGFueTpcbiAgICAgICAgICByLmNhcnJpZXJfY29tcGFueSAhPSBudWxsID8gU3RyaW5nKHIuY2Fycmllcl9jb21wYW55KSA6IG51bGwsXG4gICAgICAgIGRpc3BhdGNoX2d1aWRlOlxuICAgICAgICAgIHIuZGlzcGF0Y2hfZ3VpZGUgIT0gbnVsbCA/IFN0cmluZyhyLmRpc3BhdGNoX2d1aWRlKSA6IG51bGwsXG4gICAgICAgIGdyb3NzX3dlaWdodDogci5ncm9zc193ZWlnaHQgYXMgc3RyaW5nIHwgbnVtYmVyIHwgbnVsbCxcbiAgICAgICAgdGFyZV93ZWlnaHQ6IHIudGFyZV93ZWlnaHQgYXMgc3RyaW5nIHwgbnVtYmVyIHwgbnVsbCxcbiAgICAgICAgbmV0X3dlaWdodDogci5uZXRfd2VpZ2h0IGFzIHN0cmluZyB8IG51bWJlciB8IG51bGwsXG4gICAgICAgIGVudHJ5X2F0OiBTdHJpbmcoci5lbnRyeV9hdCA/PyAnJyksXG4gICAgICAgIGZpbmlzaGVkX2F0OiByLmZpbmlzaGVkX2F0ICE9IG51bGwgPyBTdHJpbmcoci5maW5pc2hlZF9hdCkgOiBudWxsLFxuICAgICAgICBwcm9kdWNlcl9uYW1lOiBwcm9kdWNlcj8ubmFtZSA/PyAnJyxcbiAgICAgICAgcHJvZHVjZXJfcnV0OiBwcm9kdWNlcj8ucnV0ID8/ICcnLFxuICAgICAgfTtcbiAgICB9KTtcblxuICAgIHJldHVybiB7IHJvd3MsIHRvdGFsIH07XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcignRXJyb3IgZ3JpZCBkZXNwYWNob3M6JywgZXJyb3IpO1xuICAgIHJldHVybiB7IHJvd3M6IFtdLCB0b3RhbDogMCB9O1xuICB9XG59XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6InlVQWlLc0IsOE1BQUEifQ==
}),
"[project]/paddy/paddy-tms/src/app/despachos/ui/DispatchManualCreateForm.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DispatchManualCreateForm",
    ()=>DispatchManualCreateForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$TextField$2f$TextField$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/shared/components/ui/TextField/TextField.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$AutoComplete$2f$AutoComplete$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/shared/components/ui/AutoComplete/AutoComplete.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$Button$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/shared/components/ui/Button/Button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$Alert$2f$Alert$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/shared/components/ui/Alert/Alert.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$Select$2f$Select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/shared/components/ui/Select/Select.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$actions$2f$data$3a$dc0b45__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/actions/data:dc0b45 [app-ssr] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$actions$2f$data$3a$840283__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/actions/data:840283 [app-ssr] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$actions$2f$data$3a$043894__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/actions/data:043894 [app-ssr] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$lib$2f$logisticsProduct$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/lib/logisticsProduct.ts [app-ssr] (ecmascript)");
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
const DispatchManualCreateForm = ({ onClose, onCreated })=>{
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        producer_id: null,
        product: 'ARROZ_PADDY',
        license_plate: '',
        driver_name: '',
        carrier_company: '',
        dispatch_guide: '',
        tare_weight: '',
        gross_weight: ''
    });
    const [producers, setProducers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [producerSearch, setProducerSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [successMessage, setSuccessMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const loadProducers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        try {
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$actions$2f$data$3a$dc0b45__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["fetchProducersAction"])({
                page: 1,
                limit: 5000,
                sortField: 'name',
                sort: 'ASC'
            });
            setProducers(result.data);
        } catch (err) {
            console.error('Error cargando productores:', err);
        }
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        void loadProducers();
    }, [
        loadProducers
    ]);
    const producerAutocompleteOptions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const normalizedQuery = producerSearch.trim().toLowerCase();
        if (!normalizedQuery) {
            return producers;
        }
        return producers.filter((producer)=>producer.name.toLowerCase().includes(normalizedQuery) || producer.rut.toLowerCase().includes(normalizedQuery) || (producer.city || '').toLowerCase().includes(normalizedQuery) || (producer.email || '').toLowerCase().includes(normalizedQuery));
    }, [
        producers,
        producerSearch
    ]);
    const productSelectOptions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$lib$2f$logisticsProduct$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LOGISTICS_PRODUCT_OPTIONS"].map((o)=>({
                id: o.value,
                label: o.label
            })), []);
    const handleSubmit = async (e)=>{
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
        const tare = Number(formData.tare_weight);
        if (!tare || tare <= 0) {
            setError('El peso tara debe ser mayor a 0');
            return;
        }
        const grossTrim = formData.gross_weight.trim();
        let grossNum;
        if (grossTrim !== '') {
            grossNum = Number(grossTrim);
            if (!Number.isFinite(grossNum) || grossNum <= 0) {
                setError('El peso bruto debe ser mayor a 0');
                return;
            }
            if (grossNum <= tare) {
                setError('El peso bruto debe ser mayor que la tara');
                return;
            }
        }
        setIsLoading(true);
        try {
            const driverTrim = formData.driver_name.trim();
            const created = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$actions$2f$data$3a$840283__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["createTruckDispatchWithTareAction"])({
                producer_id: formData.producer_id,
                license_plate: formData.license_plate.trim(),
                ...driverTrim ? {
                    driver_name: driverTrim
                } : {},
                carrier_company: formData.carrier_company.trim() || undefined,
                dispatch_guide: formData.dispatch_guide.trim() || undefined,
                tare_weight: tare,
                product: formData.product
            });
            if (grossNum !== undefined) {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$actions$2f$data$3a$043894__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["registerDispatchGrossWeightAction"])({
                    truck_dispatch_id: created.id,
                    gross_weight: grossNum,
                    status: 'FINISHED'
                });
            }
            setSuccessMessage('Despacho creado correctamente.');
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
            onCreated?.();
            void loadProducers();
            setTimeout(()=>{
                setSuccessMessage(null);
                onClose?.();
            }, 600);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Error al crear despacho';
            setError(message);
        } finally{
            setIsLoading(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-1",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
            onSubmit: handleSubmit,
            className: "space-y-4",
            children: [
                successMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$Alert$2f$Alert$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    variant: "success",
                    className: "mb-2",
                    children: successMessage
                }, void 0, false, {
                    fileName: "[project]/paddy/paddy-tms/src/app/despachos/ui/DispatchManualCreateForm.tsx",
                    lineNumber: 169,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0)),
                error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$Alert$2f$Alert$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    variant: "error",
                    className: "mb-2",
                    children: error
                }, void 0, false, {
                    fileName: "[project]/paddy/paddy-tms/src/app/despachos/ui/DispatchManualCreateForm.tsx",
                    lineNumber: 174,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$AutoComplete$2f$AutoComplete$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    options: producerAutocompleteOptions,
                    value: producers.find((p)=>p.id === formData.producer_id) || null,
                    onChange: (option)=>{
                        setFormData((prev)=>({
                                ...prev,
                                producer_id: option?.id ?? null
                            }));
                    },
                    onInputChange: setProducerSearch,
                    getOptionLabel: (option)=>`${option.name} · ${option.rut}`,
                    getOptionValue: (option)=>option.id,
                    filterOption: (option, searchValue)=>{
                        const q = searchValue.trim().toLowerCase();
                        if (!q) return true;
                        return option.name.toLowerCase().includes(q) || option.rut.toLowerCase().includes(q) || (option.email || '').toLowerCase().includes(q) || (option.city || '').toLowerCase().includes(q);
                    },
                    placeholder: "Buscar por nombre o RUT",
                    disabled: isLoading,
                    label: "Productor",
                    labelAlwaysVisible: true
                }, void 0, false, {
                    fileName: "[project]/paddy/paddy-tms/src/app/despachos/ui/DispatchManualCreateForm.tsx",
                    lineNumber: 179,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$Select$2f$Select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    label: "Producto",
                    name: "dispatch-create-product",
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
                    disabled: isLoading
                }, void 0, false, {
                    fileName: "[project]/paddy/paddy-tms/src/app/despachos/ui/DispatchManualCreateForm.tsx",
                    lineNumber: 207,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$TextField$2f$TextField$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TextField"], {
                    label: "Patente",
                    name: "dispatch-create-plate",
                    value: formData.license_plate,
                    onChange: (e)=>setFormData((prev)=>({
                                ...prev,
                                license_plate: e.target.value
                            })),
                    disabled: isLoading,
                    required: true
                }, void 0, false, {
                    fileName: "[project]/paddy/paddy-tms/src/app/despachos/ui/DispatchManualCreateForm.tsx",
                    lineNumber: 221,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$TextField$2f$TextField$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TextField"], {
                    label: "Chofer (opcional)",
                    name: "dispatch-create-driver",
                    value: formData.driver_name,
                    onChange: (e)=>setFormData((prev)=>({
                                ...prev,
                                driver_name: e.target.value
                            })),
                    disabled: isLoading
                }, void 0, false, {
                    fileName: "[project]/paddy/paddy-tms/src/app/despachos/ui/DispatchManualCreateForm.tsx",
                    lineNumber: 232,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$TextField$2f$TextField$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TextField"], {
                    label: "Empresa transporte (opcional)",
                    name: "dispatch-create-carrier",
                    value: formData.carrier_company,
                    onChange: (e)=>setFormData((prev)=>({
                                ...prev,
                                carrier_company: e.target.value
                            })),
                    disabled: isLoading
                }, void 0, false, {
                    fileName: "[project]/paddy/paddy-tms/src/app/despachos/ui/DispatchManualCreateForm.tsx",
                    lineNumber: 242,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$TextField$2f$TextField$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TextField"], {
                    label: "Guía de despacho (opcional)",
                    name: "dispatch-create-guide",
                    value: formData.dispatch_guide,
                    onChange: (e)=>setFormData((prev)=>({
                                ...prev,
                                dispatch_guide: e.target.value
                            })),
                    disabled: isLoading
                }, void 0, false, {
                    fileName: "[project]/paddy/paddy-tms/src/app/despachos/ui/DispatchManualCreateForm.tsx",
                    lineNumber: 252,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$TextField$2f$TextField$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TextField"], {
                    label: "Peso tara (kg)",
                    name: "dispatch-create-tare",
                    type: "number",
                    value: formData.tare_weight,
                    onChange: (e)=>setFormData((prev)=>({
                                ...prev,
                                tare_weight: e.target.value
                            })),
                    disabled: isLoading,
                    required: true
                }, void 0, false, {
                    fileName: "[project]/paddy/paddy-tms/src/app/despachos/ui/DispatchManualCreateForm.tsx",
                    lineNumber: 262,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$TextField$2f$TextField$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TextField"], {
                    label: "Peso bruto (kg) — opcional",
                    name: "dispatch-create-gross",
                    type: "number",
                    value: formData.gross_weight,
                    onChange: (e)=>setFormData((prev)=>({
                                ...prev,
                                gross_weight: e.target.value
                            })),
                    disabled: isLoading
                }, void 0, false, {
                    fileName: "[project]/paddy/paddy-tms/src/app/despachos/ui/DispatchManualCreateForm.tsx",
                    lineNumber: 274,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-xs text-muted-foreground -mt-2",
                    children: "Si indicas bruto, el despacho queda finalizado con el neto calculado (bruto − tara)."
                }, void 0, false, {
                    fileName: "[project]/paddy/paddy-tms/src/app/despachos/ui/DispatchManualCreateForm.tsx",
                    lineNumber: 284,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-wrap justify-end gap-2 pt-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$Button$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                            type: "button",
                            variant: "outlined",
                            onClick: ()=>onClose?.(),
                            disabled: isLoading,
                            children: "Cancelar"
                        }, void 0, false, {
                            fileName: "[project]/paddy/paddy-tms/src/app/despachos/ui/DispatchManualCreateForm.tsx",
                            lineNumber: 289,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$Button$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                            type: "submit",
                            variant: "primary",
                            disabled: isLoading,
                            children: isLoading ? 'Guardando…' : 'Crear despacho'
                        }, void 0, false, {
                            fileName: "[project]/paddy/paddy-tms/src/app/despachos/ui/DispatchManualCreateForm.tsx",
                            lineNumber: 292,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/paddy/paddy-tms/src/app/despachos/ui/DispatchManualCreateForm.tsx",
                    lineNumber: 288,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/paddy/paddy-tms/src/app/despachos/ui/DispatchManualCreateForm.tsx",
            lineNumber: 167,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/paddy/paddy-tms/src/app/despachos/ui/DispatchManualCreateForm.tsx",
        lineNumber: 166,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/paddy/paddy-tms/src/actions/data:83c155 [app-ssr] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "updateTruckDispatchAction",
    ()=>$$RSC_SERVER_ACTION_4
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-ssr] (ecmascript)");
/* __next_internal_action_entry_do_not_use__ [{"6026949142ffc52f28de559ca3341db16678f5b867":"updateTruckDispatchAction"},"paddy/paddy-tms/src/actions/truckDispatchActions.ts",""] */ "use turbopack no side effects";
;
const $$RSC_SERVER_ACTION_4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createServerReference"])("6026949142ffc52f28de559ca3341db16678f5b867", __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findSourceMapURL"], "updateTruckDispatchAction");
;
 //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vdHJ1Y2tEaXNwYXRjaEFjdGlvbnMudHMiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzZXJ2ZXInO1xuXG5pbXBvcnQgeyBnZXRTZXJ2ZXJTZXNzaW9uIH0gZnJvbSAnbmV4dC1hdXRoJztcbmltcG9ydCB7IGF1dGhPcHRpb25zIH0gZnJvbSAnQC9saWIvYXV0aC5jb25maWcnO1xuaW1wb3J0IHR5cGUgeyBMb2dpc3RpY3NQcm9kdWN0Q29kZSB9IGZyb20gJ0AvbGliL2xvZ2lzdGljc1Byb2R1Y3QnO1xuXG5jb25zdCBBUElfVVJMID0gcHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfQVBJX1VSTCB8fCAnaHR0cDovL2xvY2FsaG9zdDozMDAwL2FwaS92MSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgVHJ1Y2tEaXNwYXRjaFByb2R1Y2VyUmVmIHtcbiAgaWQ/OiBudW1iZXI7XG4gIHJ1dDogc3RyaW5nO1xuICBuYW1lOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgVHJ1Y2tEaXNwYXRjaCB7XG4gIGlkOiBudW1iZXI7XG4gIG51bWVyb190dXJubzogbnVtYmVyIHwgbnVsbDtcbiAgc3RhdHVzOiAnRVNQRVJBJyB8ICdGSU5JU0hFRCc7XG4gIHByb2R1Y2VyX2lkOiBudW1iZXI7XG4gIHByb2R1Y3Q/OiBMb2dpc3RpY3NQcm9kdWN0Q29kZTtcbiAgcHJvZHVjZXI/OiBUcnVja0Rpc3BhdGNoUHJvZHVjZXJSZWY7XG4gIGxpY2Vuc2VfcGxhdGU6IHN0cmluZztcbiAgZHJpdmVyX25hbWU/OiBzdHJpbmcgfCBudWxsO1xuICBjYXJyaWVyX2NvbXBhbnk/OiBzdHJpbmc7XG4gIGRpc3BhdGNoX2d1aWRlPzogc3RyaW5nO1xuICBncm9zc193ZWlnaHQ/OiBudW1iZXI7XG4gIHRhcmVfd2VpZ2h0PzogbnVtYmVyO1xuICBuZXRfd2VpZ2h0PzogbnVtYmVyO1xuICBlbnRyeV9hdDogRGF0ZTtcbiAgZmluaXNoZWRfYXQ/OiBEYXRlO1xuICBjcmVhdGVkX2J5Pzogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIENyZWF0ZVRydWNrRGlzcGF0Y2hXaXRoVGFyZVBheWxvYWQge1xuICBwcm9kdWNlcl9pZDogbnVtYmVyO1xuICBsaWNlbnNlX3BsYXRlOiBzdHJpbmc7XG4gIGRyaXZlcl9uYW1lPzogc3RyaW5nO1xuICBjYXJyaWVyX2NvbXBhbnk/OiBzdHJpbmc7XG4gIGRpc3BhdGNoX2d1aWRlPzogc3RyaW5nO1xuICB0YXJlX3dlaWdodDogbnVtYmVyO1xuICBwcm9kdWN0OiBMb2dpc3RpY3NQcm9kdWN0Q29kZTtcbiAgY3JlYXRlZF9ieT86IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBSZWdpc3RlckRpc3BhdGNoR3Jvc3NXZWlnaHRQYXlsb2FkIHtcbiAgdHJ1Y2tfZGlzcGF0Y2hfaWQ6IG51bWJlcjtcbiAgZ3Jvc3Nfd2VpZ2h0OiBudW1iZXI7XG4gIHN0YXR1cz86ICdGSU5JU0hFRCc7XG4gIGNyZWF0ZWRfYnk/OiBzdHJpbmc7XG59XG5cbmZ1bmN0aW9uIHBhcnNlRGlzcGF0Y2hGcm9tQXBpKHJhdzogUmVjb3JkPHN0cmluZywgdW5rbm93bj4pOiBUcnVja0Rpc3BhdGNoIHtcbiAgY29uc3QgcHJvZHVjZXIgPSByYXcucHJvZHVjZXIgYXMgVHJ1Y2tEaXNwYXRjaFByb2R1Y2VyUmVmIHwgdW5kZWZpbmVkO1xuICBjb25zdCBzdCA9IFN0cmluZyhyYXcuc3RhdHVzID8/ICcnKS50cmltKCkudG9VcHBlckNhc2UoKTtcbiAgY29uc3Qgc3RhdHVzOiBUcnVja0Rpc3BhdGNoWydzdGF0dXMnXSA9IHN0ID09PSAnRklOSVNIRUQnID8gJ0ZJTklTSEVEJyA6ICdFU1BFUkEnO1xuICBjb25zdCBwcm9kdWN0ID0gcmF3LnByb2R1Y3QgIT0gbnVsbCA/IFN0cmluZyhyYXcucHJvZHVjdCkgOiB1bmRlZmluZWQ7XG4gIGNvbnN0IHAgPVxuICAgIHByb2R1Y3QgPT09ICdDQVNDQVJJTExBJyB8fCBwcm9kdWN0ID09PSAnQVJST1pfUEFERFknXG4gICAgICA/IChwcm9kdWN0IGFzIExvZ2lzdGljc1Byb2R1Y3RDb2RlKVxuICAgICAgOiB1bmRlZmluZWQ7XG5cbiAgcmV0dXJuIHtcbiAgICBpZDogTnVtYmVyKHJhdy5pZCksXG4gICAgbnVtZXJvX3R1cm5vOlxuICAgICAgcmF3Lm51bWVyb190dXJubyAhPSBudWxsICYmICFOdW1iZXIuaXNOYU4oTnVtYmVyKHJhdy5udW1lcm9fdHVybm8pKVxuICAgICAgICA/IE51bWJlcihyYXcubnVtZXJvX3R1cm5vKVxuICAgICAgICA6IG51bGwsXG4gICAgc3RhdHVzLFxuICAgIHByb2R1Y2VyX2lkOiBOdW1iZXIocmF3LnByb2R1Y2VyX2lkID8/IDApLFxuICAgIHByb2R1Y3Q6IHAsXG4gICAgcHJvZHVjZXIsXG4gICAgbGljZW5zZV9wbGF0ZTogU3RyaW5nKHJhdy5saWNlbnNlX3BsYXRlID8/ICcnKSxcbiAgICBkcml2ZXJfbmFtZTogcmF3LmRyaXZlcl9uYW1lICE9IG51bGwgPyBTdHJpbmcocmF3LmRyaXZlcl9uYW1lKSA6IG51bGwsXG4gICAgY2Fycmllcl9jb21wYW55OlxuICAgICAgcmF3LmNhcnJpZXJfY29tcGFueSAhPSBudWxsID8gU3RyaW5nKHJhdy5jYXJyaWVyX2NvbXBhbnkpIDogdW5kZWZpbmVkLFxuICAgIGRpc3BhdGNoX2d1aWRlOlxuICAgICAgcmF3LmRpc3BhdGNoX2d1aWRlICE9IG51bGwgPyBTdHJpbmcocmF3LmRpc3BhdGNoX2d1aWRlKSA6IHVuZGVmaW5lZCxcbiAgICBncm9zc193ZWlnaHQ6XG4gICAgICByYXcuZ3Jvc3Nfd2VpZ2h0ICE9IG51bGwgPyBOdW1iZXIocmF3Lmdyb3NzX3dlaWdodCkgOiB1bmRlZmluZWQsXG4gICAgdGFyZV93ZWlnaHQ6IHJhdy50YXJlX3dlaWdodCAhPSBudWxsID8gTnVtYmVyKHJhdy50YXJlX3dlaWdodCkgOiB1bmRlZmluZWQsXG4gICAgbmV0X3dlaWdodDogcmF3Lm5ldF93ZWlnaHQgIT0gbnVsbCA/IE51bWJlcihyYXcubmV0X3dlaWdodCkgOiB1bmRlZmluZWQsXG4gICAgZW50cnlfYXQ6IG5ldyBEYXRlKFN0cmluZyhyYXcuZW50cnlfYXQgPz8gRGF0ZS5ub3coKSkpLFxuICAgIGZpbmlzaGVkX2F0OiByYXcuZmluaXNoZWRfYXQgPyBuZXcgRGF0ZShTdHJpbmcocmF3LmZpbmlzaGVkX2F0KSkgOiB1bmRlZmluZWQsXG4gICAgY3JlYXRlZF9ieTogcmF3LmNyZWF0ZWRfYnkgIT0gbnVsbCA/IFN0cmluZyhyYXcuY3JlYXRlZF9ieSkgOiB1bmRlZmluZWQsXG4gIH07XG59XG5cbi8qKiBDb2xhIGRlIHBlc2FqZTogRVNQRVJBIGNvbiB0YXJhIHkgc2luIGJydXRvIChob3kpLiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldERpc3BhdGNoZXNXZWlnaGluZ1F1ZXVlVG9kYXlBY3Rpb24oKTogUHJvbWlzZTxcbiAgVHJ1Y2tEaXNwYXRjaFtdXG4+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBzZXNzaW9uID0gYXdhaXQgZ2V0U2VydmVyU2Vzc2lvbihhdXRoT3B0aW9ucyk7XG5cbiAgICBpZiAoIXNlc3Npb24/LnVzZXI/LmFjY2Vzc1Rva2VuKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgJHtBUElfVVJMfS9sb2dpc3RpY3MvdHVybm9zL2Rpc3BhdGNoZXMvdG9kYXlgLCB7XG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgIEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHtzZXNzaW9uLnVzZXIuYWNjZXNzVG9rZW59YCxcbiAgICAgIH0sXG4gICAgICBjYWNoZTogJ25vLXN0b3JlJyxcbiAgICB9KTtcblxuICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgY29uc3QgZGF0YUFycmF5ID0gKHJlc3VsdC5kYXRhIHx8IFtdKSBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPltdO1xuICAgIHJldHVybiBkYXRhQXJyYXkubWFwKHBhcnNlRGlzcGF0Y2hGcm9tQXBpKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdFcnJvciBvYnRlbmllbmRvIGNvbGEgZGVzcGFjaG86JywgZXJyb3IpO1xuICAgIHJldHVybiBbXTtcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlVHJ1Y2tEaXNwYXRjaFdpdGhUYXJlQWN0aW9uKFxuICBwYXlsb2FkOiBDcmVhdGVUcnVja0Rpc3BhdGNoV2l0aFRhcmVQYXlsb2FkLFxuKTogUHJvbWlzZTxUcnVja0Rpc3BhdGNoPiB7XG4gIGNvbnN0IHNlc3Npb24gPSBhd2FpdCBnZXRTZXJ2ZXJTZXNzaW9uKGF1dGhPcHRpb25zKTtcblxuICBpZiAoIXNlc3Npb24/LnVzZXI/LmFjY2Vzc1Rva2VuKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdObyBhdXRlbnRpY2FkbycpO1xuICB9XG5cbiAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgJHtBUElfVVJMfS9sb2dpc3RpY3MvdHJ1Y2stZGlzcGF0Y2hlcy93aXRoLXRhcmVgLCB7XG4gICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgaGVhZGVyczoge1xuICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgIEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHtzZXNzaW9uLnVzZXIuYWNjZXNzVG9rZW59YCxcbiAgICB9LFxuICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgIHByb2R1Y2VyX2lkOiBwYXlsb2FkLnByb2R1Y2VyX2lkLFxuICAgICAgbGljZW5zZV9wbGF0ZTogcGF5bG9hZC5saWNlbnNlX3BsYXRlLFxuICAgICAgZHJpdmVyX25hbWU6IHBheWxvYWQuZHJpdmVyX25hbWUsXG4gICAgICBjYXJyaWVyX2NvbXBhbnk6IHBheWxvYWQuY2Fycmllcl9jb21wYW55LFxuICAgICAgZGlzcGF0Y2hfZ3VpZGU6IHBheWxvYWQuZGlzcGF0Y2hfZ3VpZGUsXG4gICAgICB0YXJlX3dlaWdodDogcGF5bG9hZC50YXJlX3dlaWdodCxcbiAgICAgIHByb2R1Y3Q6IHBheWxvYWQucHJvZHVjdCxcbiAgICAgIGNyZWF0ZWRfYnk6IHBheWxvYWQuY3JlYXRlZF9ieSxcbiAgICB9KSxcbiAgfSk7XG5cbiAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgIGxldCBtc2cgPSBgSFRUUCAke3Jlc3BvbnNlLnN0YXR1c31gO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBlcnIgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICBpZiAodHlwZW9mIGVycj8ubWVzc2FnZSA9PT0gJ3N0cmluZycpIG1zZyA9IGVyci5tZXNzYWdlO1xuICAgICAgZWxzZSBpZiAoQXJyYXkuaXNBcnJheShlcnI/Lm1lc3NhZ2UpKSBtc2cgPSBlcnIubWVzc2FnZS5qb2luKCcuICcpO1xuICAgIH0gY2F0Y2gge1xuICAgICAgLyogaWdub3JlICovXG4gICAgfVxuICAgIHRocm93IG5ldyBFcnJvcihtc2cpO1xuICB9XG5cbiAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICByZXR1cm4gcGFyc2VEaXNwYXRjaEZyb21BcGkocmVzdWx0LmRhdGEgYXMgUmVjb3JkPHN0cmluZywgdW5rbm93bj4pO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVnaXN0ZXJEaXNwYXRjaEdyb3NzV2VpZ2h0QWN0aW9uKFxuICBwYXlsb2FkOiBSZWdpc3RlckRpc3BhdGNoR3Jvc3NXZWlnaHRQYXlsb2FkLFxuKTogUHJvbWlzZTxUcnVja0Rpc3BhdGNoPiB7XG4gIGNvbnN0IHNlc3Npb24gPSBhd2FpdCBnZXRTZXJ2ZXJTZXNzaW9uKGF1dGhPcHRpb25zKTtcblxuICBpZiAoIXNlc3Npb24/LnVzZXI/LmFjY2Vzc1Rva2VuKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdObyBhdXRlbnRpY2FkbycpO1xuICB9XG5cbiAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgJHtBUElfVVJMfS9sb2dpc3RpY3Mvd2VpZ2hpbmdzL2Rpc3BhdGNoLWdyb3NzYCwge1xuICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgIGhlYWRlcnM6IHtcbiAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7c2Vzc2lvbi51c2VyLmFjY2Vzc1Rva2VufWAsXG4gICAgfSxcbiAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICB0cnVja19kaXNwYXRjaF9pZDogcGF5bG9hZC50cnVja19kaXNwYXRjaF9pZCxcbiAgICAgIGdyb3NzX3dlaWdodDogcGF5bG9hZC5ncm9zc193ZWlnaHQsXG4gICAgICBzdGF0dXM6IHBheWxvYWQuc3RhdHVzID8/ICdGSU5JU0hFRCcsXG4gICAgICBjcmVhdGVkX2J5OiBwYXlsb2FkLmNyZWF0ZWRfYnksXG4gICAgfSksXG4gIH0pO1xuXG4gIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICBsZXQgbXNnID0gYEhUVFAgJHtyZXNwb25zZS5zdGF0dXN9YDtcbiAgICB0cnkge1xuICAgICAgY29uc3QgZXJyID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgaWYgKHR5cGVvZiBlcnI/Lm1lc3NhZ2UgPT09ICdzdHJpbmcnKSBtc2cgPSBlcnIubWVzc2FnZTtcbiAgICAgIGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoZXJyPy5tZXNzYWdlKSkgbXNnID0gZXJyLm1lc3NhZ2Uuam9pbignLiAnKTtcbiAgICB9IGNhdGNoIHtcbiAgICAgIC8qIGlnbm9yZSAqL1xuICAgIH1cbiAgICB0aHJvdyBuZXcgRXJyb3IobXNnKTtcbiAgfVxuXG4gIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgcmV0dXJuIHBhcnNlRGlzcGF0Y2hGcm9tQXBpKHJlc3VsdC5kYXRhIGFzIFJlY29yZDxzdHJpbmcsIHVua25vd24+KTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBVcGRhdGVUcnVja0Rpc3BhdGNoUGF5bG9hZCB7XG4gIHByb2R1Y2VyX2lkPzogbnVtYmVyO1xuICBsaWNlbnNlX3BsYXRlPzogc3RyaW5nO1xuICBkcml2ZXJfbmFtZT86IHN0cmluZyB8IG51bGw7XG4gIGNhcnJpZXJfY29tcGFueT86IHN0cmluZztcbiAgZGlzcGF0Y2hfZ3VpZGU/OiBzdHJpbmc7XG4gIGdyb3NzX3dlaWdodD86IG51bWJlcjtcbiAgdGFyZV93ZWlnaHQ/OiBudW1iZXI7XG4gIHByb2R1Y3Q/OiBMb2dpc3RpY3NQcm9kdWN0Q29kZTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFRydWNrRGlzcGF0Y2hCeUlkQWN0aW9uKGlkOiBudW1iZXIpOiBQcm9taXNlPFRydWNrRGlzcGF0Y2ggfCBudWxsPiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IGdldFNlcnZlclNlc3Npb24oYXV0aE9wdGlvbnMpO1xuXG4gICAgaWYgKCFzZXNzaW9uPy51c2VyPy5hY2Nlc3NUb2tlbikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBhdXRlbnRpY2FkbycpO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYCR7QVBJX1VSTH0vbG9naXN0aWNzL3RydWNrLWRpc3BhdGNoZXMvJHtpZH1gLCB7XG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgIEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHtzZXNzaW9uLnVzZXIuYWNjZXNzVG9rZW59YCxcbiAgICAgIH0sXG4gICAgICBjYWNoZTogJ25vLXN0b3JlJyxcbiAgICB9KTtcblxuICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICByZXR1cm4gcGFyc2VEaXNwYXRjaEZyb21BcGkocmVzdWx0LmRhdGEgYXMgUmVjb3JkPHN0cmluZywgdW5rbm93bj4pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIG9idGVuaWVuZG8gZGVzcGFjaG86JywgZXJyb3IpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGRhdGVUcnVja0Rpc3BhdGNoQWN0aW9uKFxuICBpZDogbnVtYmVyLFxuICBwYXlsb2FkOiBVcGRhdGVUcnVja0Rpc3BhdGNoUGF5bG9hZCxcbik6IFByb21pc2U8VHJ1Y2tEaXNwYXRjaD4ge1xuICBjb25zdCBzZXNzaW9uID0gYXdhaXQgZ2V0U2VydmVyU2Vzc2lvbihhdXRoT3B0aW9ucyk7XG5cbiAgaWYgKCFzZXNzaW9uPy51c2VyPy5hY2Nlc3NUb2tlbikge1xuICAgIHRocm93IG5ldyBFcnJvcignTm8gYXV0ZW50aWNhZG8nKTtcbiAgfVxuXG4gIGNvbnN0IGJvZHkgPSBPYmplY3QuZnJvbUVudHJpZXMoXG4gICAgT2JqZWN0LmVudHJpZXMocGF5bG9hZCkuZmlsdGVyKChbLCB2XSkgPT4gdiAhPT0gdW5kZWZpbmVkKSxcbiAgKTtcblxuICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAke0FQSV9VUkx9L2xvZ2lzdGljcy90cnVjay1kaXNwYXRjaGVzLyR7aWR9YCwge1xuICAgIG1ldGhvZDogJ1BVVCcsXG4gICAgaGVhZGVyczoge1xuICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgIEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHtzZXNzaW9uLnVzZXIuYWNjZXNzVG9rZW59YCxcbiAgICB9LFxuICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGJvZHkpLFxuICB9KTtcblxuICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgbGV0IG1zZyA9IGBIVFRQICR7cmVzcG9uc2Uuc3RhdHVzfWA7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGVyciA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgIGlmICh0eXBlb2YgZXJyPy5tZXNzYWdlID09PSAnc3RyaW5nJykgbXNnID0gZXJyLm1lc3NhZ2U7XG4gICAgICBlbHNlIGlmIChBcnJheS5pc0FycmF5KGVycj8ubWVzc2FnZSkpIG1zZyA9IGVyci5tZXNzYWdlLmpvaW4oJy4gJyk7XG4gICAgfSBjYXRjaCB7XG4gICAgICAvKiBpZ25vcmUgKi9cbiAgICB9XG4gICAgdGhyb3cgbmV3IEVycm9yKG1zZyk7XG4gIH1cblxuICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gIHJldHVybiBwYXJzZURpc3BhdGNoRnJvbUFwaShyZXN1bHQuZGF0YSBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPik7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkZWxldGVUcnVja0Rpc3BhdGNoQWN0aW9uKGlkOiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IGdldFNlcnZlclNlc3Npb24oYXV0aE9wdGlvbnMpO1xuXG4gIGlmICghc2Vzc2lvbj8udXNlcj8uYWNjZXNzVG9rZW4pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIGF1dGVudGljYWRvJyk7XG4gIH1cblxuICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAke0FQSV9VUkx9L2xvZ2lzdGljcy90cnVjay1kaXNwYXRjaGVzLyR7aWR9YCwge1xuICAgIG1ldGhvZDogJ0RFTEVURScsXG4gICAgaGVhZGVyczoge1xuICAgICAgQXV0aG9yaXphdGlvbjogYEJlYXJlciAke3Nlc3Npb24udXNlci5hY2Nlc3NUb2tlbn1gLFxuICAgIH0sXG4gIH0pO1xuXG4gIGNvbnN0IHJlc3BvbnNlUGF5bG9hZCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKS5jYXRjaCgoKSA9PiBudWxsKTtcblxuICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgY29uc3QgcmF3ID0gKHJlc3BvbnNlUGF5bG9hZCBhcyB7IG1lc3NhZ2U/OiB1bmtub3duIH0pPy5tZXNzYWdlO1xuICAgIGNvbnN0IG1zZyA9XG4gICAgICB0eXBlb2YgcmF3ID09PSAnc3RyaW5nJ1xuICAgICAgICA/IHJhd1xuICAgICAgICA6IEFycmF5LmlzQXJyYXkocmF3KVxuICAgICAgICAgID8gcmF3LmpvaW4oJy4gJylcbiAgICAgICAgICA6IGBIVFRQICR7cmVzcG9uc2Uuc3RhdHVzfWA7XG4gICAgdGhyb3cgbmV3IEVycm9yKG1zZyk7XG4gIH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBUcnVja0Rpc3BhdGNoR3JpZFJvdyB7XG4gIGlkOiBudW1iZXI7XG4gIHN0YXR1czogc3RyaW5nO1xuICBwcm9kdWN0Pzogc3RyaW5nO1xuICBwcm9kdWNlcl9pZD86IG51bWJlcjtcbiAgbGljZW5zZV9wbGF0ZTogc3RyaW5nO1xuICBkcml2ZXJfbmFtZTogc3RyaW5nO1xuICBjYXJyaWVyX2NvbXBhbnk/OiBzdHJpbmcgfCBudWxsO1xuICBkaXNwYXRjaF9ndWlkZT86IHN0cmluZyB8IG51bGw7XG4gIGdyb3NzX3dlaWdodDogc3RyaW5nIHwgbnVtYmVyIHwgbnVsbDtcbiAgdGFyZV93ZWlnaHQ6IHN0cmluZyB8IG51bWJlciB8IG51bGw7XG4gIG5ldF93ZWlnaHQ6IHN0cmluZyB8IG51bWJlciB8IG51bGw7XG4gIGVudHJ5X2F0OiBzdHJpbmc7XG4gIGZpbmlzaGVkX2F0Pzogc3RyaW5nIHwgbnVsbDtcbiAgcHJvZHVjZXJfbmFtZTogc3RyaW5nO1xuICBwcm9kdWNlcl9ydXQ6IHN0cmluZztcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFRydWNrRGlzcGF0Y2hlc0dyaWRBY3Rpb24ocGFyYW1zOiB7XG4gIGxpbWl0PzogbnVtYmVyO1xuICBvZmZzZXQ/OiBudW1iZXI7XG4gIHNlYXJjaD86IHN0cmluZztcbiAgZmlsdGVycz86IHN0cmluZztcbiAgc29ydD86IHN0cmluZztcbiAgc29ydEZpZWxkPzogc3RyaW5nO1xufSk6IFByb21pc2U8eyByb3dzOiBUcnVja0Rpc3BhdGNoR3JpZFJvd1tdOyB0b3RhbDogbnVtYmVyIH0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBzZXNzaW9uID0gYXdhaXQgZ2V0U2VydmVyU2Vzc2lvbihhdXRoT3B0aW9ucyk7XG5cbiAgICBpZiAoIXNlc3Npb24/LnVzZXI/LmFjY2Vzc1Rva2VuKSB7XG4gICAgICByZXR1cm4geyByb3dzOiBbXSwgdG90YWw6IDAgfTtcbiAgICB9XG5cbiAgICBjb25zdCBsaW1pdCA9IE1hdGgubWluKE1hdGgubWF4KHBhcmFtcy5saW1pdCA/PyAyNSwgMSksIDUwMCk7XG4gICAgY29uc3Qgb2Zmc2V0ID0gTWF0aC5tYXgocGFyYW1zLm9mZnNldCA/PyAwLCAwKTtcblxuICAgIGNvbnN0IHFzID0gbmV3IFVSTFNlYXJjaFBhcmFtcygpO1xuICAgIHFzLnNldCgnbGltaXQnLCBTdHJpbmcobGltaXQpKTtcbiAgICBxcy5zZXQoJ29mZnNldCcsIFN0cmluZyhvZmZzZXQpKTtcbiAgICBpZiAocGFyYW1zLnNlYXJjaD8udHJpbSgpKSB7XG4gICAgICBxcy5zZXQoJ3NlYXJjaCcsIHBhcmFtcy5zZWFyY2gudHJpbSgpKTtcbiAgICB9XG4gICAgaWYgKHBhcmFtcy5maWx0ZXJzPy50cmltKCkpIHtcbiAgICAgIHFzLnNldCgnZmlsdGVycycsIHBhcmFtcy5maWx0ZXJzLnRyaW0oKSk7XG4gICAgfVxuICAgIGlmIChwYXJhbXMuc29ydD8udHJpbSgpKSB7XG4gICAgICBxcy5zZXQoJ3NvcnQnLCBwYXJhbXMuc29ydC50cmltKCkpO1xuICAgIH1cbiAgICBpZiAocGFyYW1zLnNvcnRGaWVsZD8udHJpbSgpKSB7XG4gICAgICBxcy5zZXQoJ3NvcnRGaWVsZCcsIHBhcmFtcy5zb3J0RmllbGQudHJpbSgpKTtcbiAgICB9XG5cbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFxuICAgICAgYCR7QVBJX1VSTH0vbG9naXN0aWNzL3RydWNrLWRpc3BhdGNoZXMvZ3JpZD8ke3FzLnRvU3RyaW5nKCl9YCxcbiAgICAgIHtcbiAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgIEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHtzZXNzaW9uLnVzZXIuYWNjZXNzVG9rZW59YCxcbiAgICAgICAgfSxcbiAgICAgICAgY2FjaGU6ICduby1zdG9yZScsXG4gICAgICB9LFxuICAgICk7XG5cbiAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICByZXR1cm4geyByb3dzOiBbXSwgdG90YWw6IDAgfTtcbiAgICB9XG5cbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgY29uc3QgcGF5bG9hZCA9IHJlc3VsdC5kYXRhIGFzIHsgZGF0YTogdW5rbm93bltdOyB0b3RhbDogbnVtYmVyIH0gfCB1bmRlZmluZWQ7XG4gICAgY29uc3QgcmF3ID0gKHBheWxvYWQ/LmRhdGEgPz8gW10pIGFzIFJlY29yZDxzdHJpbmcsIHVua25vd24+W107XG4gICAgY29uc3QgdG90YWwgPSB0eXBlb2YgcGF5bG9hZD8udG90YWwgPT09ICdudW1iZXInID8gcGF5bG9hZC50b3RhbCA6IHJhdy5sZW5ndGg7XG5cbiAgICBjb25zdCByb3dzOiBUcnVja0Rpc3BhdGNoR3JpZFJvd1tdID0gcmF3Lm1hcCgocikgPT4ge1xuICAgICAgY29uc3QgcHJvZHVjZXIgPSByLnByb2R1Y2VyIGFzIHsgbmFtZT86IHN0cmluZzsgcnV0Pzogc3RyaW5nIH0gfCB1bmRlZmluZWQ7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBpZDogTnVtYmVyKHIuaWQpLFxuICAgICAgICBzdGF0dXM6IFN0cmluZyhyLnN0YXR1cyA/PyAnJyksXG4gICAgICAgIHByb2R1Y3Q6IHIucHJvZHVjdCAhPSBudWxsID8gU3RyaW5nKHIucHJvZHVjdCkgOiB1bmRlZmluZWQsXG4gICAgICAgIHByb2R1Y2VyX2lkOlxuICAgICAgICAgIHIucHJvZHVjZXJfaWQgIT0gbnVsbCA/IE51bWJlcihyLnByb2R1Y2VyX2lkKSA6IHVuZGVmaW5lZCxcbiAgICAgICAgbGljZW5zZV9wbGF0ZTogU3RyaW5nKHIubGljZW5zZV9wbGF0ZSA/PyAnJyksXG4gICAgICAgIGRyaXZlcl9uYW1lOiBTdHJpbmcoci5kcml2ZXJfbmFtZSA/PyAnJyksXG4gICAgICAgIGNhcnJpZXJfY29tcGFueTpcbiAgICAgICAgICByLmNhcnJpZXJfY29tcGFueSAhPSBudWxsID8gU3RyaW5nKHIuY2Fycmllcl9jb21wYW55KSA6IG51bGwsXG4gICAgICAgIGRpc3BhdGNoX2d1aWRlOlxuICAgICAgICAgIHIuZGlzcGF0Y2hfZ3VpZGUgIT0gbnVsbCA/IFN0cmluZyhyLmRpc3BhdGNoX2d1aWRlKSA6IG51bGwsXG4gICAgICAgIGdyb3NzX3dlaWdodDogci5ncm9zc193ZWlnaHQgYXMgc3RyaW5nIHwgbnVtYmVyIHwgbnVsbCxcbiAgICAgICAgdGFyZV93ZWlnaHQ6IHIudGFyZV93ZWlnaHQgYXMgc3RyaW5nIHwgbnVtYmVyIHwgbnVsbCxcbiAgICAgICAgbmV0X3dlaWdodDogci5uZXRfd2VpZ2h0IGFzIHN0cmluZyB8IG51bWJlciB8IG51bGwsXG4gICAgICAgIGVudHJ5X2F0OiBTdHJpbmcoci5lbnRyeV9hdCA/PyAnJyksXG4gICAgICAgIGZpbmlzaGVkX2F0OiByLmZpbmlzaGVkX2F0ICE9IG51bGwgPyBTdHJpbmcoci5maW5pc2hlZF9hdCkgOiBudWxsLFxuICAgICAgICBwcm9kdWNlcl9uYW1lOiBwcm9kdWNlcj8ubmFtZSA/PyAnJyxcbiAgICAgICAgcHJvZHVjZXJfcnV0OiBwcm9kdWNlcj8ucnV0ID8/ICcnLFxuICAgICAgfTtcbiAgICB9KTtcblxuICAgIHJldHVybiB7IHJvd3MsIHRvdGFsIH07XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcignRXJyb3IgZ3JpZCBkZXNwYWNob3M6JywgZXJyb3IpO1xuICAgIHJldHVybiB7IHJvd3M6IFtdLCB0b3RhbDogMCB9O1xuICB9XG59XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6ImlVQThPc0Isc01BQUEifQ==
}),
"[project]/paddy/paddy-tms/src/app/despachos/ui/DispatchEditDialog.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DispatchEditDialog",
    ()=>DispatchEditDialog
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$Dialog$2f$Dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/shared/components/ui/Dialog/Dialog.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$TextField$2f$TextField$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/shared/components/ui/TextField/TextField.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$AutoComplete$2f$AutoComplete$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/shared/components/ui/AutoComplete/AutoComplete.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$Button$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/shared/components/ui/Button/Button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$Alert$2f$Alert$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/shared/components/ui/Alert/Alert.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$Select$2f$Select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/shared/components/ui/Select/Select.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$actions$2f$data$3a$dc0b45__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/actions/data:dc0b45 [app-ssr] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$actions$2f$data$3a$83c155__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/actions/data:83c155 [app-ssr] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$lib$2f$logisticsProduct$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/lib/logisticsProduct.ts [app-ssr] (ecmascript)");
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
const DispatchEditDialog = ({ open, row, onClose, onSaved })=>{
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        producer_id: null,
        product: 'ARROZ_PADDY',
        license_plate: '',
        driver_name: '',
        carrier_company: '',
        dispatch_guide: '',
        tare_weight: '',
        gross_weight: ''
    });
    const [producers, setProducers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [producerSearch, setProducerSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const loadProducers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        try {
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$actions$2f$data$3a$dc0b45__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["fetchProducersAction"])({
                page: 1,
                limit: 5000,
                sortField: 'name',
                sort: 'ASC'
            });
            setProducers(result.data);
        } catch (err) {
            console.error('Error cargando productores:', err);
        }
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (open) {
            void loadProducers();
        }
    }, [
        open,
        loadProducers
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!open || !row) {
            return;
        }
        setError(null);
        setProducerSearch('');
        const product = row.product === 'CASCARILLA' || row.product === 'ARROZ_PADDY' ? row.product : 'ARROZ_PADDY';
        setFormData({
            producer_id: row.producer_id ?? null,
            product,
            license_plate: row.license_plate ?? '',
            driver_name: row.driver_name ?? '',
            carrier_company: row.carrier_company ?? '',
            dispatch_guide: row.dispatch_guide ?? '',
            tare_weight: row.tare_weight != null && row.tare_weight !== '' ? String(row.tare_weight) : '',
            gross_weight: row.gross_weight != null && row.gross_weight !== '' ? String(row.gross_weight) : ''
        });
    }, [
        open,
        row
    ]);
    const producerAutocompleteOptions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const normalizedQuery = producerSearch.trim().toLowerCase();
        if (!normalizedQuery) {
            return producers;
        }
        return producers.filter((producer)=>producer.name.toLowerCase().includes(normalizedQuery) || producer.rut.toLowerCase().includes(normalizedQuery) || (producer.city || '').toLowerCase().includes(normalizedQuery) || (producer.email || '').toLowerCase().includes(normalizedQuery));
    }, [
        producers,
        producerSearch
    ]);
    const productSelectOptions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$lib$2f$logisticsProduct$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LOGISTICS_PRODUCT_OPTIONS"].map((o)=>({
                id: o.value,
                label: o.label
            })), []);
    const isFinished = row != null && row.status?.trim().toUpperCase() === 'FINISHED';
    const handleSubmit = async (e)=>{
        e.preventDefault();
        if (!row) return;
        setError(null);
        if (!formData.producer_id) {
            setError('Selecciona un productor');
            return;
        }
        if (!formData.license_plate.trim()) {
            setError('La patente es requerida');
            return;
        }
        const tare = Number(formData.tare_weight);
        if (!tare || tare <= 0) {
            setError('El peso tara debe ser mayor a 0');
            return;
        }
        const grossTrim = formData.gross_weight.trim();
        let grossNum;
        if (grossTrim !== '') {
            grossNum = Number(grossTrim);
            if (!Number.isFinite(grossNum) || grossNum <= 0) {
                setError('El peso bruto debe ser mayor a 0');
                return;
            }
        } else if (row.gross_weight != null && String(row.gross_weight).trim() !== '') {
            const existing = Number(row.gross_weight);
            if (Number.isFinite(existing) && existing > 0) {
                grossNum = existing;
            }
        }
        if (isFinished && grossNum === undefined) {
            setError('En despachos finalizados el bruto es obligatorio');
            return;
        }
        if (grossNum !== undefined && grossNum <= tare) {
            setError('El peso bruto debe ser mayor que la tara');
            return;
        }
        setIsLoading(true);
        try {
            const driverTrim = formData.driver_name.trim();
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$actions$2f$data$3a$83c155__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["updateTruckDispatchAction"])(row.id, {
                producer_id: formData.producer_id,
                license_plate: formData.license_plate.trim(),
                driver_name: driverTrim === '' ? null : driverTrim,
                carrier_company: formData.carrier_company.trim() || undefined,
                dispatch_guide: formData.dispatch_guide.trim() || undefined,
                tare_weight: tare,
                ...grossNum !== undefined ? {
                    gross_weight: grossNum
                } : {},
                product: formData.product
            });
            onSaved();
            onClose();
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Error al actualizar despacho';
            setError(message);
        } finally{
            setIsLoading(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$Dialog$2f$Dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
        open: open,
        onClose: onClose,
        title: "Editar despacho",
        size: "lg",
        scroll: "body",
        hideActions: true,
        showCloseButton: true,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
            onSubmit: handleSubmit,
            className: "space-y-4 px-1 pb-2",
            children: [
                error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$Alert$2f$Alert$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    variant: "error",
                    className: "mb-2",
                    children: error
                }, void 0, false, {
                    fileName: "[project]/paddy/paddy-tms/src/app/despachos/ui/DispatchEditDialog.tsx",
                    lineNumber: 205,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$AutoComplete$2f$AutoComplete$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    options: producerAutocompleteOptions,
                    value: producers.find((p)=>p.id === formData.producer_id) || null,
                    onChange: (option)=>{
                        setFormData((prev)=>({
                                ...prev,
                                producer_id: option?.id ?? null
                            }));
                    },
                    onInputChange: setProducerSearch,
                    getOptionLabel: (option)=>`${option.name} · ${option.rut}`,
                    getOptionValue: (option)=>option.id,
                    filterOption: (option, searchValue)=>{
                        const q = searchValue.trim().toLowerCase();
                        if (!q) return true;
                        return option.name.toLowerCase().includes(q) || option.rut.toLowerCase().includes(q) || (option.email || '').toLowerCase().includes(q) || (option.city || '').toLowerCase().includes(q);
                    },
                    placeholder: "Buscar por nombre o RUT",
                    disabled: isLoading,
                    label: "Productor",
                    labelAlwaysVisible: true
                }, void 0, false, {
                    fileName: "[project]/paddy/paddy-tms/src/app/despachos/ui/DispatchEditDialog.tsx",
                    lineNumber: 210,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$Select$2f$Select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    label: "Producto",
                    name: "dispatch-edit-product",
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
                    disabled: isLoading
                }, void 0, false, {
                    fileName: "[project]/paddy/paddy-tms/src/app/despachos/ui/DispatchEditDialog.tsx",
                    lineNumber: 238,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$TextField$2f$TextField$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TextField"], {
                    label: "Patente",
                    name: "dispatch-edit-plate",
                    value: formData.license_plate,
                    onChange: (e)=>setFormData((prev)=>({
                                ...prev,
                                license_plate: e.target.value
                            })),
                    disabled: isLoading,
                    required: true
                }, void 0, false, {
                    fileName: "[project]/paddy/paddy-tms/src/app/despachos/ui/DispatchEditDialog.tsx",
                    lineNumber: 252,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$TextField$2f$TextField$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TextField"], {
                    label: "Chofer (opcional)",
                    name: "dispatch-edit-driver",
                    value: formData.driver_name,
                    onChange: (e)=>setFormData((prev)=>({
                                ...prev,
                                driver_name: e.target.value
                            })),
                    disabled: isLoading
                }, void 0, false, {
                    fileName: "[project]/paddy/paddy-tms/src/app/despachos/ui/DispatchEditDialog.tsx",
                    lineNumber: 263,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$TextField$2f$TextField$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TextField"], {
                    label: "Empresa transporte (opcional)",
                    name: "dispatch-edit-carrier",
                    value: formData.carrier_company,
                    onChange: (e)=>setFormData((prev)=>({
                                ...prev,
                                carrier_company: e.target.value
                            })),
                    disabled: isLoading
                }, void 0, false, {
                    fileName: "[project]/paddy/paddy-tms/src/app/despachos/ui/DispatchEditDialog.tsx",
                    lineNumber: 273,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$TextField$2f$TextField$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TextField"], {
                    label: "Guía de despacho (opcional)",
                    name: "dispatch-edit-guide",
                    value: formData.dispatch_guide,
                    onChange: (e)=>setFormData((prev)=>({
                                ...prev,
                                dispatch_guide: e.target.value
                            })),
                    disabled: isLoading
                }, void 0, false, {
                    fileName: "[project]/paddy/paddy-tms/src/app/despachos/ui/DispatchEditDialog.tsx",
                    lineNumber: 283,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$TextField$2f$TextField$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TextField"], {
                    label: "Peso tara (kg)",
                    name: "dispatch-edit-tare",
                    type: "number",
                    value: formData.tare_weight,
                    onChange: (e)=>setFormData((prev)=>({
                                ...prev,
                                tare_weight: e.target.value
                            })),
                    disabled: isLoading,
                    required: true
                }, void 0, false, {
                    fileName: "[project]/paddy/paddy-tms/src/app/despachos/ui/DispatchEditDialog.tsx",
                    lineNumber: 293,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$TextField$2f$TextField$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TextField"], {
                    label: "Peso bruto (kg)",
                    name: "dispatch-edit-gross",
                    type: "number",
                    value: formData.gross_weight,
                    onChange: (e)=>setFormData((prev)=>({
                                ...prev,
                                gross_weight: e.target.value
                            })),
                    disabled: isLoading
                }, void 0, false, {
                    fileName: "[project]/paddy/paddy-tms/src/app/despachos/ui/DispatchEditDialog.tsx",
                    lineNumber: 305,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-xs text-muted-foreground -mt-2",
                    children: isFinished ? 'Despacho finalizado: bruto y tara deben ser válidos (bruto mayor que tara).' : 'Vacío en bruto = no cambiar el bruto actual. Con bruto válido puede finalizar el despacho.'
                }, void 0, false, {
                    fileName: "[project]/paddy/paddy-tms/src/app/despachos/ui/DispatchEditDialog.tsx",
                    lineNumber: 315,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-wrap justify-end gap-2 pt-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$Button$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                            type: "button",
                            variant: "outlined",
                            onClick: onClose,
                            disabled: isLoading,
                            children: "Cancelar"
                        }, void 0, false, {
                            fileName: "[project]/paddy/paddy-tms/src/app/despachos/ui/DispatchEditDialog.tsx",
                            lineNumber: 322,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$Button$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                            type: "submit",
                            variant: "primary",
                            disabled: isLoading,
                            children: isLoading ? 'Guardando…' : 'Guardar cambios'
                        }, void 0, false, {
                            fileName: "[project]/paddy/paddy-tms/src/app/despachos/ui/DispatchEditDialog.tsx",
                            lineNumber: 325,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/paddy/paddy-tms/src/app/despachos/ui/DispatchEditDialog.tsx",
                    lineNumber: 321,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/paddy/paddy-tms/src/app/despachos/ui/DispatchEditDialog.tsx",
            lineNumber: 203,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/paddy/paddy-tms/src/app/despachos/ui/DispatchEditDialog.tsx",
        lineNumber: 194,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/paddy/paddy-tms/src/app/despachos/ui/DespachosDataGrid.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DespachosDataGrid",
    ()=>DespachosDataGrid
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$DataGrid$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$DataGrid$2f$DataGridWrapper$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/DataGridWrapper.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$IconButton$2f$IconButton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/shared/components/ui/IconButton/IconButton.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$Dialog$2f$Dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/shared/components/ui/Dialog/Dialog.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$Button$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/shared/components/ui/Button/Button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$actions$2f$data$3a$383e40__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/actions/data:383e40 [app-ssr] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$actions$2f$data$3a$3f23d9__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/actions/data:3f23d9 [app-ssr] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$Dialog$2f$DialogToPrint$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/shared/components/ui/Dialog/DialogToPrint.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$components$2f$weighing$2f$TruckWeighingTicketToPrint$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/components/weighing/TruckWeighingTicketToPrint.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$lib$2f$logisticsProduct$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/lib/logisticsProduct.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$app$2f$despachos$2f$ui$2f$DispatchManualCreateForm$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/app/despachos/ui/DispatchManualCreateForm.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$app$2f$despachos$2f$ui$2f$DispatchEditDialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/app/despachos/ui/DispatchEditDialog.tsx [app-ssr] (ecmascript)");
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
;
;
function parseGridWeight(v) {
    if (v === undefined || v === null || v === '') return undefined;
    const n = typeof v === 'number' ? v : parseFloat(String(v));
    return Number.isFinite(n) ? n : undefined;
}
function truckDispatchFromGridRow(row) {
    const st = row.status?.trim().toUpperCase();
    const status = st === 'FINISHED' ? 'FINISHED' : 'ESPERA';
    const product = row.product === 'CASCARILLA' || row.product === 'ARROZ_PADDY' ? row.product : undefined;
    return {
        id: row.id,
        numero_turno: null,
        status,
        producer_id: row.producer_id ?? 0,
        producer: row.producer_name || row.producer_rut ? {
            name: row.producer_name || '—',
            rut: row.producer_rut || ''
        } : undefined,
        product,
        license_plate: row.license_plate,
        driver_name: row.driver_name?.trim() ? row.driver_name : null,
        carrier_company: row.carrier_company ?? undefined,
        dispatch_guide: row.dispatch_guide ?? undefined,
        gross_weight: parseGridWeight(row.gross_weight),
        tare_weight: parseGridWeight(row.tare_weight),
        net_weight: parseGridWeight(row.net_weight),
        entry_at: new Date(row.entry_at),
        finished_at: row.finished_at ? new Date(row.finished_at) : undefined
    };
}
const baseColumns = [
    {
        field: 'id',
        headerName: 'Folio',
        type: 'id',
        width: 72,
        sortable: true
    },
    {
        field: 'status',
        headerName: 'Estado',
        width: 124,
        renderType: 'badge',
        sortable: true
    },
    {
        field: 'product',
        headerName: 'Producto',
        width: 130,
        valueGetter: ({ row })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$lib$2f$logisticsProduct$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatLogisticsProductLabel"])(row.product),
        sortable: true
    },
    {
        field: 'license_plate',
        headerName: 'Patente',
        minWidth: 118,
        width: 126,
        nowrap: true,
        mono: true,
        sortable: true
    },
    {
        field: 'dispatch_guide',
        headerName: 'Guía',
        minWidth: 140,
        width: 148,
        flex: 1.2,
        sortable: true
    },
    {
        field: 'producer_name',
        headerName: 'Productor',
        minWidth: 320,
        flex: 4,
        sortable: true
    },
    {
        field: 'producer_rut',
        headerName: 'RUT productor',
        minWidth: 120,
        width: 128,
        nowrap: true,
        mono: true,
        sortable: true
    },
    {
        field: 'tare_weight',
        headerName: 'Tara (kg)',
        type: 'number',
        renderType: 'weightKg',
        width: 112,
        sortable: true
    },
    {
        field: 'gross_weight',
        headerName: 'Bruto (kg)',
        type: 'number',
        renderType: 'weightKg',
        width: 112,
        sortable: true
    },
    {
        field: 'net_weight',
        headerName: 'Neto (kg)',
        type: 'number',
        renderType: 'weightKg',
        width: 112,
        sortable: true
    },
    {
        field: 'entry_at',
        headerName: 'Entrada',
        type: 'dateTime',
        minWidth: 156,
        width: 164,
        sortable: true
    },
    {
        field: 'finished_at',
        headerName: 'Finalizado',
        type: 'dateTime',
        minWidth: 156,
        width: 164,
        sortable: true
    }
];
const DespachosDataGrid = ({ rows, totalRows })=>{
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [editRow, setEditRow] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [deleteRow, setDeleteRow] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [deleteLoading, setDeleteLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [deleteError, setDeleteError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [printOpen, setPrintOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [printTruck, setPrintTruck] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [printLoadingId, setPrintLoadingId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const refresh = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        router.refresh();
    }, [
        router
    ]);
    const closePrint = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        setPrintOpen(false);
        setPrintTruck(null);
    }, []);
    const openDispatchPrint = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (row)=>{
        setPrintLoadingId(row.id);
        try {
            const full = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$actions$2f$data$3a$3f23d9__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["getTruckDispatchByIdAction"])(row.id);
            const truck = full != null ? {
                ...full,
                producer: full.producer ?? (row.producer_name || row.producer_rut ? {
                    name: row.producer_name || '—',
                    rut: row.producer_rut || ''
                } : undefined)
            } : truckDispatchFromGridRow(row);
            setPrintTruck(truck);
            setPrintOpen(true);
        } finally{
            setPrintLoadingId(null);
        }
    }, []);
    const columns = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const ActionsCell = ({ row })=>{
            const printBusy = printLoadingId === row.id;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-end gap-0.5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$IconButton$2f$IconButton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        icon: "print",
                        variant: "ghost",
                        size: "sm",
                        ariaLabel: "Imprimir ticket de despacho",
                        isLoading: printBusy,
                        disabled: printBusy,
                        onClick: ()=>void openDispatchPrint(row)
                    }, void 0, false, {
                        fileName: "[project]/paddy/paddy-tms/src/app/despachos/ui/DespachosDataGrid.tsx",
                        lineNumber: 201,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$IconButton$2f$IconButton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        icon: "edit",
                        variant: "ghost",
                        size: "sm",
                        ariaLabel: "Editar despacho",
                        onClick: ()=>setEditRow(row)
                    }, void 0, false, {
                        fileName: "[project]/paddy/paddy-tms/src/app/despachos/ui/DespachosDataGrid.tsx",
                        lineNumber: 210,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$IconButton$2f$IconButton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        icon: "delete",
                        variant: "ghost",
                        size: "sm",
                        ariaLabel: "Eliminar despacho",
                        onClick: ()=>setDeleteRow(row)
                    }, void 0, false, {
                        fileName: "[project]/paddy/paddy-tms/src/app/despachos/ui/DespachosDataGrid.tsx",
                        lineNumber: 217,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/paddy/paddy-tms/src/app/despachos/ui/DespachosDataGrid.tsx",
                lineNumber: 200,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0));
        };
        return [
            ...baseColumns,
            {
                field: 'actions',
                headerName: 'Acciones',
                width: 136,
                minWidth: 136,
                align: 'center',
                headerAlign: 'center',
                sortable: false,
                filterable: false,
                actionComponent: ActionsCell
            }
        ];
    }, [
        openDispatchPrint,
        printLoadingId
    ]);
    const confirmDelete = async ()=>{
        if (!deleteRow) return;
        setDeleteError(null);
        setDeleteLoading(true);
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$actions$2f$data$3a$383e40__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["deleteTruckDispatchAction"])(deleteRow.id);
            setDeleteRow(null);
            refresh();
        } catch (e) {
            setDeleteError(e instanceof Error ? e.message : 'No se pudo eliminar');
        } finally{
            setDeleteLoading(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$DataGrid$2f$DataGridWrapper$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                title: "Listado de despachos",
                columns: columns,
                rows: rows,
                totalRows: totalRows,
                limit: 25,
                showExportButton: false,
                height: "85vh",
                pinActionsColumn: true,
                actionsColumnField: "actions",
                createFormTitle: "Nuevo despacho manual",
                createForm: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$app$2f$despachos$2f$ui$2f$DispatchManualCreateForm$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DispatchManualCreateForm"], {
                    onCreated: refresh
                }, void 0, false, {
                    fileName: "[project]/paddy/paddy-tms/src/app/despachos/ui/DespachosDataGrid.tsx",
                    lineNumber: 272,
                    columnNumber: 21
                }, void 0)
            }, void 0, false, {
                fileName: "[project]/paddy/paddy-tms/src/app/despachos/ui/DespachosDataGrid.tsx",
                lineNumber: 261,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$app$2f$despachos$2f$ui$2f$DispatchEditDialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DispatchEditDialog"], {
                open: editRow != null,
                row: editRow,
                onClose: ()=>setEditRow(null),
                onSaved: refresh
            }, void 0, false, {
                fileName: "[project]/paddy/paddy-tms/src/app/despachos/ui/DespachosDataGrid.tsx",
                lineNumber: 275,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$Dialog$2f$DialogToPrint$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                open: printOpen && !!printTruck,
                onClose: closePrint,
                title: printTruck ? `Ticket de despacho — Folio ${printTruck.id.toLocaleString('es-CL')}` : 'Ticket de despacho',
                printLabel: "Imprimir",
                closeLabel: "Cerrar",
                size: "xl",
                scroll: "paper",
                children: printTruck ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$components$2f$weighing$2f$TruckWeighingTicketToPrint$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TruckWeighingTicketToPrint"], {
                    truck: printTruck,
                    variant: "dispatch"
                }, void 0, false, {
                    fileName: "[project]/paddy/paddy-tms/src/app/despachos/ui/DespachosDataGrid.tsx",
                    lineNumber: 296,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0)) : null
            }, void 0, false, {
                fileName: "[project]/paddy/paddy-tms/src/app/despachos/ui/DespachosDataGrid.tsx",
                lineNumber: 282,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$Dialog$2f$Dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                open: deleteRow != null,
                onClose: ()=>{
                    if (!deleteLoading) {
                        setDeleteRow(null);
                        setDeleteError(null);
                    }
                },
                title: "Eliminar despacho",
                size: "sm",
                hideActions: true,
                showCloseButton: !deleteLoading,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-4 px-1 pb-1",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-foreground",
                            children: [
                                "¿Eliminar el despacho con folio",
                                ' ',
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "font-semibold tabular-nums",
                                    children: deleteRow?.id
                                }, void 0, false, {
                                    fileName: "[project]/paddy/paddy-tms/src/app/despachos/ui/DespachosDataGrid.tsx",
                                    lineNumber: 316,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                deleteRow?.license_plate ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        ' ',
                                        "(patente ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-mono uppercase",
                                            children: deleteRow.license_plate
                                        }, void 0, false, {
                                            fileName: "[project]/paddy/paddy-tms/src/app/despachos/ui/DespachosDataGrid.tsx",
                                            lineNumber: 320,
                                            columnNumber: 26
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        ")?"
                                    ]
                                }, void 0, true) : '?'
                            ]
                        }, void 0, true, {
                            fileName: "[project]/paddy/paddy-tms/src/app/despachos/ui/DespachosDataGrid.tsx",
                            lineNumber: 314,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs text-muted-foreground",
                            children: "El despacho se anulará en el sistema (baja lógica)."
                        }, void 0, false, {
                            fileName: "[project]/paddy/paddy-tms/src/app/despachos/ui/DespachosDataGrid.tsx",
                            lineNumber: 326,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        deleteError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-destructive",
                            role: "alert",
                            children: deleteError
                        }, void 0, false, {
                            fileName: "[project]/paddy/paddy-tms/src/app/despachos/ui/DespachosDataGrid.tsx",
                            lineNumber: 330,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-wrap justify-end gap-2 pt-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$Button$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                    type: "button",
                                    variant: "outlined",
                                    onClick: ()=>{
                                        if (!deleteLoading) {
                                            setDeleteRow(null);
                                            setDeleteError(null);
                                        }
                                    },
                                    disabled: deleteLoading,
                                    children: "Cancelar"
                                }, void 0, false, {
                                    fileName: "[project]/paddy/paddy-tms/src/app/despachos/ui/DespachosDataGrid.tsx",
                                    lineNumber: 335,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$Button$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                    type: "button",
                                    variant: "danger",
                                    onClick: ()=>void confirmDelete(),
                                    disabled: deleteLoading,
                                    children: deleteLoading ? 'Eliminando…' : 'Eliminar'
                                }, void 0, false, {
                                    fileName: "[project]/paddy/paddy-tms/src/app/despachos/ui/DespachosDataGrid.tsx",
                                    lineNumber: 348,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/paddy/paddy-tms/src/app/despachos/ui/DespachosDataGrid.tsx",
                            lineNumber: 334,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/paddy/paddy-tms/src/app/despachos/ui/DespachosDataGrid.tsx",
                    lineNumber: 313,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/paddy/paddy-tms/src/app/despachos/ui/DespachosDataGrid.tsx",
                lineNumber: 300,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true);
};
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__8d49bc19._.js.map