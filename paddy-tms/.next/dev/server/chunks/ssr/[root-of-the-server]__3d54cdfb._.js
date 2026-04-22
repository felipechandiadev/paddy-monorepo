module.exports = [
"[project]/paddy/paddy-tms/src/services/serialPort.service.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SerialPortService",
    ()=>SerialPortService,
    "serialPortService",
    ()=>serialPortService
]);
'use client';
class SerialPortService {
    port = null;
    reader = null;
    isConnected = false;
    lastWeight = null;
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
            // Abrir puerto con configuración estándar para balanzas (9600, 8N1)
            await this.port.open({
                baudRate: 9600,
                dataBits: 8,
                stopBits: 1,
                parity: 'none'
            });
            this.isConnected = true;
            this.startReading();
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
            await this.port.open({
                baudRate: 9600,
                dataBits: 8,
                stopBits: 1,
                parity: 'none'
            });
            this.isConnected = true;
            this.startReading();
            return true;
        } catch (error) {
            this.isConnected = false;
            return false;
        }
    }
    /**
   * Iniciar lectura continua desde el puerto
   */ async startReading() {
        if (!this.port) return;
        try {
            this.reader = this.port.readable.getReader();
            while(this.isConnected && this.reader){
                try {
                    const { value, done } = await this.reader.read();
                    if (done) {
                        break;
                    }
                    // Procesar datos recibidos
                    const text = new TextDecoder().decode(value);
                    this.processWeight(text);
                } catch (error) {
                    if (error.name !== 'TypeError') {
                        console.warn('Error leyendo puerto serial:', error);
                    }
                    break;
                }
            }
        } catch (error) {
            console.warn('Error en lectura de puerto serial:', error);
        } finally{
            if (this.reader) {
                this.reader.releaseLock();
                this.reader = null;
            }
        }
    }
    /**
   * Procesar y extraer peso de los datos recibidos
   * Asume que la balanza envía formato: "PESO: XXX.XX kg\n"
   */ processWeight(text) {
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
   */ async disconnect() {
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
    __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$serialPortConfigService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serialPortConfigStorage"].saveConfig({
        port: fp || 'serial',
        baudRate: 9600,
        dataBits: 8,
        stopBits: 1,
        parity: 'none',
        lastUsed: new Date().toISOString()
    });
}
function useSerialPort(enabled = false) {
    const [isConnected, setIsConnected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isConnecting, setIsConnecting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [lastWeight, setLastWeight] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const pollingIntervalRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    /** Evita que el efecto de auto-conexión vuelva a conectar tras un Desconectar explícito */ const suppressAutoConnectRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    // Verificar disponibilidad de Serial API
    const isAvailable = __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$serialPort$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serialPortService"].isAvailable();
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
                setIsConnected(true);
                persistSerialConfig();
                // Comenzar a polling del peso
                const interval = setInterval(()=>{
                    const weight = __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$serialPort$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serialPortService"].readWeight();
                    if (weight !== null) {
                        setLastWeight(weight);
                    }
                }, 100);
                pollingIntervalRef.current = interval;
            } else {
                setError('No se pudo conectar al puerto serial');
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
                    const weight = __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$serialPort$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serialPortService"].readWeight();
                    if (weight !== null) {
                        setLastWeight(weight);
                    }
                }, 100);
                pollingIntervalRef.current = interval;
            } else {
                setIsConnected(false);
                setError('No se pudo conectar o se canceló la selección del puerto');
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
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (open) {
            const cfg = __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$serialPortConfigService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serialPortConfigStorage"].getConfig();
            setSavedPortLabel(cfg?.port ?? null);
        }
    }, [
        open
    ]);
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
                    lineNumber: 53,
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
                                    lineNumber: 61,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "font-medium",
                                    children: isConnected ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-success",
                                        children: "Conectado"
                                    }, void 0, false, {
                                        fileName: "[project]/paddy/paddy-tms/src/components/weighing/SerialPortConfigDialog.tsx",
                                        lineNumber: 64,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-red-400",
                                        children: "Sin conexión"
                                    }, void 0, false, {
                                        fileName: "[project]/paddy/paddy-tms/src/components/weighing/SerialPortConfigDialog.tsx",
                                        lineNumber: 66,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/paddy/paddy-tms/src/components/weighing/SerialPortConfigDialog.tsx",
                                    lineNumber: 62,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/paddy/paddy-tms/src/components/weighing/SerialPortConfigDialog.tsx",
                            lineNumber: 60,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        currentLabel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs font-medium text-muted-foreground mb-1",
                                    children: "Puerto actual"
                                }, void 0, false, {
                                    fileName: "[project]/paddy/paddy-tms/src/components/weighing/SerialPortConfigDialog.tsx",
                                    lineNumber: 73,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "font-mono text-xs break-all",
                                    children: currentLabel
                                }, void 0, false, {
                                    fileName: "[project]/paddy/paddy-tms/src/components/weighing/SerialPortConfigDialog.tsx",
                                    lineNumber: 74,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/paddy/paddy-tms/src/components/weighing/SerialPortConfigDialog.tsx",
                            lineNumber: 72,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0)),
                        savedPortLabel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs font-medium text-muted-foreground mb-1",
                                    children: "Último guardado (local)"
                                }, void 0, false, {
                                    fileName: "[project]/paddy/paddy-tms/src/components/weighing/SerialPortConfigDialog.tsx",
                                    lineNumber: 80,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "font-mono text-xs break-all",
                                    children: savedPortLabel
                                }, void 0, false, {
                                    fileName: "[project]/paddy/paddy-tms/src/components/weighing/SerialPortConfigDialog.tsx",
                                    lineNumber: 81,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/paddy/paddy-tms/src/components/weighing/SerialPortConfigDialog.tsx",
                            lineNumber: 79,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs text-muted-foreground",
                            children: "El navegador pedirá permiso para el puerto. Puedes elegir otro dispositivo en cualquier momento."
                        }, void 0, false, {
                            fileName: "[project]/paddy/paddy-tms/src/components/weighing/SerialPortConfigDialog.tsx",
                            lineNumber: 85,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        dialogError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs text-red-600 bg-red-50 border border-red-100 rounded-md p-2",
                            children: dialogError
                        }, void 0, false, {
                            fileName: "[project]/paddy/paddy-tms/src/components/weighing/SerialPortConfigDialog.tsx",
                            lineNumber: 91,
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
                                    lineNumber: 97,
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
                                    lineNumber: 107,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/paddy/paddy-tms/src/components/weighing/SerialPortConfigDialog.tsx",
                            lineNumber: 96,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true)
            ]
        }, void 0, true, {
            fileName: "[project]/paddy/paddy-tms/src/components/weighing/SerialPortConfigDialog.tsx",
            lineNumber: 51,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/paddy/paddy-tms/src/components/weighing/SerialPortConfigDialog.tsx",
        lineNumber: 42,
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
                                        alt: "Paddy Logo",
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
                                                children: "Paddy"
                                            }, void 0, false, {
                                                fileName: "[project]/paddy/paddy-tms/src/components/layout/TmsAppLayout.tsx",
                                                lineNumber: 61,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs text-muted-foreground -mt-1",
                                                children: "Recepción de carga"
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
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        href: "/receptions",
                                        className: "p-2 rounded-lg hover:bg-muted/60 transition-colors duration-200",
                                        title: "Listado de recepciones",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            className: "w-5 h-5 text-foreground hover:text-primary transition-colors",
                                            fill: "none",
                                            stroke: "currentColor",
                                            viewBox: "0 0 24 24",
                                            strokeWidth: "2",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 12h6m-6 4h6"
                                            }, void 0, false, {
                                                fileName: "[project]/paddy/paddy-tms/src/components/layout/TmsAppLayout.tsx",
                                                lineNumber: 114,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/paddy/paddy-tms/src/components/layout/TmsAppLayout.tsx",
                                            lineNumber: 107,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/paddy/paddy-tms/src/components/layout/TmsAppLayout.tsx",
                                        lineNumber: 102,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: WEIGHING_APP_URL,
                                        className: "p-2 rounded-lg hover:bg-muted/60 transition-colors duration-200",
                                        title: "Ir a pesaje (dashboard)",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            className: "w-5 h-5 text-foreground hover:text-primary transition-colors",
                                            fill: "none",
                                            stroke: "currentColor",
                                            viewBox: "0 0 24 24",
                                            strokeWidth: "2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                    x: "3",
                                                    y: "3",
                                                    width: "7",
                                                    height: "7"
                                                }, void 0, false, {
                                                    fileName: "[project]/paddy/paddy-tms/src/components/layout/TmsAppLayout.tsx",
                                                    lineNumber: 130,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                    x: "14",
                                                    y: "3",
                                                    width: "7",
                                                    height: "7"
                                                }, void 0, false, {
                                                    fileName: "[project]/paddy/paddy-tms/src/components/layout/TmsAppLayout.tsx",
                                                    lineNumber: 131,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                    x: "3",
                                                    y: "14",
                                                    width: "7",
                                                    height: "7"
                                                }, void 0, false, {
                                                    fileName: "[project]/paddy/paddy-tms/src/components/layout/TmsAppLayout.tsx",
                                                    lineNumber: 132,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                    x: "14",
                                                    y: "14",
                                                    width: "7",
                                                    height: "7"
                                                }, void 0, false, {
                                                    fileName: "[project]/paddy/paddy-tms/src/components/layout/TmsAppLayout.tsx",
                                                    lineNumber: 133,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/paddy/paddy-tms/src/components/layout/TmsAppLayout.tsx",
                                            lineNumber: 123,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/paddy/paddy-tms/src/components/layout/TmsAppLayout.tsx",
                                        lineNumber: 118,
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
                                                lineNumber: 150,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/paddy/paddy-tms/src/components/layout/TmsAppLayout.tsx",
                                            lineNumber: 143,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/paddy/paddy-tms/src/components/layout/TmsAppLayout.tsx",
                                        lineNumber: 137,
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
                    lineNumber: 157,
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
"[project]/paddy/paddy-tms/src/app/receptions/ui/ReceptionsDataGrid.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ReceptionsDataGrid",
    ()=>ReceptionsDataGrid
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$DataGrid$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$DataGrid$2f$DataGridWrapper$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/DataGridWrapper.tsx [app-ssr] (ecmascript)");
'use client';
;
;
const columns = [
    {
        field: 'id',
        headerName: 'Folio',
        type: 'id',
        width: 72
    },
    {
        field: 'status',
        headerName: 'Estado',
        width: 124,
        renderType: 'badge'
    },
    {
        field: 'license_plate',
        headerName: 'Patente',
        minWidth: 118,
        width: 126,
        nowrap: true,
        mono: true
    },
    {
        field: 'driver_name',
        headerName: 'Chofer',
        minWidth: 169,
        flex: 1.3
    },
    {
        field: 'producer_name',
        headerName: 'Productor',
        minWidth: 260,
        flex: 3
    },
    {
        field: 'producer_rut',
        headerName: 'RUT productor',
        minWidth: 120,
        width: 128,
        nowrap: true,
        mono: true
    },
    {
        field: 'gross_weight',
        headerName: 'Bruto (kg)',
        type: 'number',
        renderType: 'weightKg',
        width: 112
    },
    {
        field: 'tare_weight',
        headerName: 'Tara (kg)',
        type: 'number',
        renderType: 'weightKg',
        width: 112
    },
    {
        field: 'net_weight',
        headerName: 'Neto (kg)',
        type: 'number',
        renderType: 'weightKg',
        width: 112
    },
    {
        field: 'dispatch_guide',
        headerName: 'Guía',
        minWidth: 108,
        flex: 1
    },
    {
        field: 'entry_at',
        headerName: 'Entrada',
        type: 'dateTime',
        minWidth: 156,
        width: 164
    },
    {
        field: 'finished_at',
        headerName: 'Finalizado',
        type: 'dateTime',
        minWidth: 156,
        width: 164
    }
];
const ReceptionsDataGrid = ({ rows, totalRows })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$DataGrid$2f$DataGridWrapper$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
        title: "Listado de recepciones de carga",
        columns: columns,
        rows: rows,
        totalRows: totalRows,
        limit: 25,
        showExportButton: false,
        height: "85vh"
    }, void 0, false, {
        fileName: "[project]/paddy/paddy-tms/src/app/receptions/ui/ReceptionsDataGrid.tsx",
        lineNumber: 43,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__3d54cdfb._.js.map