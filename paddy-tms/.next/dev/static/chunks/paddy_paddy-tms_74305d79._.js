(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/paddy/paddy-tms/src/services/serialPort.service.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
            // Abrir puerto con configuración estándar para balanzas (9600, 8N1)
            await this.port.open({
                baudRate: 9600,
                dataBits: 8,
                stopBits: 1,
                parity: 'none'
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
            console.log('Puerto serial desconectado');
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
"[project]/paddy/paddy-tms/src/hooks/useSerialPort.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useSerialPort",
    ()=>useSerialPort
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$serialPort$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/services/serialPort.service.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function useSerialPort(enabled = false) {
    _s();
    const [isConnected, setIsConnected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isConnecting, setIsConnecting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [lastWeight, setLastWeight] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const pollingIntervalRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Verificar disponibilidad de Serial API
    const isAvailable = __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$serialPort$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serialPortService"].isAvailable();
    // Conectar
    const connect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
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
                const success = await __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$serialPort$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serialPortService"].connect();
                if (success) {
                    setIsConnected(true);
                    // Comenzar a polling del peso
                    const interval = setInterval({
                        "useSerialPort.useCallback[connect].interval": ()=>{
                            const weight = __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$serialPort$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serialPortService"].readWeight();
                            if (weight !== null) {
                                setLastWeight(weight);
                            }
                        }
                    }["useSerialPort.useCallback[connect].interval"], 100);
                    pollingIntervalRef.current = interval;
                } else {
                    setError('No se pudo conectar al puerto serial');
                }
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
                setError(`Error conectando: ${errorMessage}`);
                console.error('Error en conexión serial:', err);
            } finally{
                setIsConnecting(false);
            }
        }
    }["useSerialPort.useCallback[connect]"], [
        isConnected,
        isAvailable
    ]);
    // Desconectar
    const disconnect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSerialPort.useCallback[disconnect]": async ()=>{
            try {
                if (pollingIntervalRef.current) {
                    clearInterval(pollingIntervalRef.current);
                    pollingIntervalRef.current = null;
                }
                await __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$serialPort$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serialPortService"].disconnect();
                setIsConnected(false);
                setLastWeight(null);
                setError(null);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
                setError(`Error desconectando: ${errorMessage}`);
            }
        }
    }["useSerialPort.useCallback[disconnect]"], []);
    // Leer peso
    const readWeight = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSerialPort.useCallback[readWeight]": ()=>{
            const weight = __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$serialPort$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serialPortService"].readWeight();
            if (weight !== null) {
                setLastWeight(weight);
            }
            return weight;
        }
    }["useSerialPort.useCallback[readWeight]"], []);
    // Enviar comando
    const sendCommand = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSerialPort.useCallback[sendCommand]": async (command)=>{
            return await __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$serialPort$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serialPortService"].sendCommand(command);
        }
    }["useSerialPort.useCallback[sendCommand]"], []);
    // Auto-conectar si enabled es true
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useSerialPort.useEffect": ()=>{
            if (enabled && isAvailable && !isConnected) {
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
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
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
        connect,
        disconnect,
        readWeight,
        sendCommand
    };
}
_s(useSerialPort, "MlBhO2dicUHVY2VAfdTOivAsarM=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/paddy/paddy-tms/src/actions/data:037182 [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getTurnosTodayAction",
    ()=>$$RSC_SERVER_ACTION_3
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
/* __next_internal_action_entry_do_not_use__ [{"00e974fb0515369ecf82dada3ac5abce0639296144":"getTurnosTodayAction"},"paddy/paddy-tms/src/actions/truckReceptionActions.ts",""] */ "use turbopack no side effects";
;
const $$RSC_SERVER_ACTION_3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("00e974fb0515369ecf82dada3ac5abce0639296144", __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "getTurnosTodayAction");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
 //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vdHJ1Y2tSZWNlcHRpb25BY3Rpb25zLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc2VydmVyJztcblxuaW1wb3J0IHsgZ2V0U2VydmVyU2Vzc2lvbiB9IGZyb20gJ25leHQtYXV0aCc7XG5pbXBvcnQgeyBhdXRoT3B0aW9ucyB9IGZyb20gJ0AvbGliL2F1dGguY29uZmlnJztcblxuY29uc3QgQVBJX1VSTCA9IHByb2Nlc3MuZW52Lk5FWFRfUFVCTElDX0FQSV9VUkwgfHwgJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9hcGkvdjEnO1xuXG5leHBvcnQgaW50ZXJmYWNlIENyZWF0ZVRydWNrV2l0aEdyb3NzV2VpZ2h0UGF5bG9hZCB7XG4gIHByb2R1Y2VyX2lkOiBudW1iZXI7XG4gIGxpY2Vuc2VfcGxhdGU6IHN0cmluZztcbiAgZHJpdmVyX25hbWU6IHN0cmluZztcbiAgY2Fycmllcl9jb21wYW55Pzogc3RyaW5nO1xuICBkaXNwYXRjaF9ndWlkZT86IHN0cmluZztcbiAgZ3Jvc3Nfd2VpZ2h0OiBudW1iZXI7XG4gIGNyZWF0ZWRfYnk/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmVnaXN0ZXJUYXJlV2VpZ2h0UGF5bG9hZCB7XG4gIHRydWNrX3JlY2VwdGlvbl9pZDogbnVtYmVyO1xuICB0YXJlX3dlaWdodDogbnVtYmVyO1xuICBjcmVhdGVkX2J5Pzogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFRydWNrUmVjZXB0aW9uIHtcbiAgaWQ6IG51bWJlcjtcbiAgbnVtZXJvX3R1cm5vOiBudW1iZXI7XG4gIHN0YXR1czogJ0VTUEVSQScgfCAnRklOSVNIRUQnO1xuICBwcm9kdWNlcl9pZDogbnVtYmVyO1xuICBsaWNlbnNlX3BsYXRlOiBzdHJpbmc7XG4gIGRyaXZlcl9uYW1lOiBzdHJpbmc7XG4gIGNhcnJpZXJfY29tcGFueT86IHN0cmluZztcbiAgZGlzcGF0Y2hfZ3VpZGU/OiBzdHJpbmc7XG4gIGdyb3NzX3dlaWdodD86IG51bWJlcjtcbiAgdGFyZV93ZWlnaHQ/OiBudW1iZXI7XG4gIG5ldF93ZWlnaHQ/OiBudW1iZXI7XG4gIGVudHJ5X2F0OiBEYXRlO1xuICBmaW5pc2hlZF9hdD86IERhdGU7XG4gIGNyZWF0ZWRfYnk/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjcmVhdGVUcnVja1JlY2VwdGlvbkFjdGlvbihcbiAgcGF5bG9hZDogQ3JlYXRlVHJ1Y2tXaXRoR3Jvc3NXZWlnaHRQYXlsb2FkLFxuKTogUHJvbWlzZTxUcnVja1JlY2VwdGlvbj4ge1xuICB0cnkge1xuICAgIGNvbnN0IHNlc3Npb24gPSBhd2FpdCBnZXRTZXJ2ZXJTZXNzaW9uKGF1dGhPcHRpb25zKTtcblxuICAgIGlmICghc2Vzc2lvbj8udXNlcj8uYWNjZXNzVG9rZW4pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTm8gYXV0ZW50aWNhZG8nKTtcbiAgICB9XG5cbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFxuICAgICAgYCR7QVBJX1VSTH0vbG9naXN0aWNzL3RydWNrLXJlY2VwdGlvbnMvd2l0aC1ncm9zcy13ZWlnaHRgLFxuICAgICAge1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgQXV0aG9yaXphdGlvbjogYEJlYXJlciAke3Nlc3Npb24udXNlci5hY2Nlc3NUb2tlbn1gLFxuICAgICAgICB9LFxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShwYXlsb2FkKSxcbiAgICAgIH0sXG4gICAgKTtcblxuICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgIGxldCBlcnJvck1lc3NhZ2UgPSBgSFRUUCAke3Jlc3BvbnNlLnN0YXR1c306ICR7cmVzcG9uc2Uuc3RhdHVzVGV4dH1gO1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgZXJyb3JCb2R5ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgICBpZiAoZXJyb3JCb2R5Lm1lc3NhZ2UpIHtcbiAgICAgICAgICBlcnJvck1lc3NhZ2UgPSBlcnJvckJvZHkubWVzc2FnZTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCB7XG4gICAgICAgIC8vIFNpIG5vIHNlIHB1ZWRlIHBhcnNlYXIgZWwgZXJyb3IsIHVzYXIgZWwgbWVuc2FqZSBnZW5lcmljb1xuICAgICAgfVxuICAgICAgdGhyb3cgbmV3IEVycm9yKGVycm9yTWVzc2FnZSk7XG4gICAgfVxuXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgIFxuICAgIGNvbnNvbGUubG9nKCdSZXNwb25zZSBmcm9tIGNyZWF0ZVRydWNrUmVjZXB0aW9uQWN0aW9uOicsIHJlc3VsdCk7XG4gICAgXG4gICAgY29uc3QgdHJ1Y2tEYXRhOiBUcnVja1JlY2VwdGlvbiA9IHJlc3VsdC5kYXRhO1xuICAgIFxuICAgIGlmICghdHJ1Y2tEYXRhLm51bWVyb190dXJubykge1xuICAgICAgY29uc29sZS53YXJuKCdXYXJuaW5nOiBudW1lcm9fdHVybm8gbm8gZGVmaW5pZG8gZW4gcmVzcHVlc3RhOicsIHRydWNrRGF0YSk7XG4gICAgfVxuICAgIFxuICAgIHJldHVybiB0cnVja0RhdGE7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcignRXJyb3IgY3JlYW5kbyByZWNlcGNpb246JywgZXJyb3IpO1xuICAgIHRocm93IGVycm9yO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZWNvcmRUYXJlV2VpZ2h0QWN0aW9uKFxuICBwYXlsb2FkOiBSZWdpc3RlclRhcmVXZWlnaHRQYXlsb2FkLFxuKTogUHJvbWlzZTxUcnVja1JlY2VwdGlvbj4ge1xuICB0cnkge1xuICAgIGNvbnN0IHNlc3Npb24gPSBhd2FpdCBnZXRTZXJ2ZXJTZXNzaW9uKGF1dGhPcHRpb25zKTtcblxuICAgIGlmICghc2Vzc2lvbj8udXNlcj8uYWNjZXNzVG9rZW4pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTm8gYXV0ZW50aWNhZG8nKTtcbiAgICB9XG5cbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAke0FQSV9VUkx9L2xvZ2lzdGljcy93ZWlnaGluZ3MvdGFyZWAsIHtcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgaGVhZGVyczoge1xuICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7c2Vzc2lvbi51c2VyLmFjY2Vzc1Rva2VufWAsXG4gICAgICB9LFxuICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkocGF5bG9hZCksXG4gICAgfSk7XG5cbiAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEhUVFAgJHtyZXNwb25zZS5zdGF0dXN9OiAke3Jlc3BvbnNlLnN0YXR1c1RleHR9YCk7XG4gICAgfVxuXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgIHJldHVybiByZXN1bHQuZGF0YSBhcyBUcnVja1JlY2VwdGlvbjtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdFcnJvciByZWdpc3RyYW5kbyBwZXNvIHRhcmE6JywgZXJyb3IpO1xuICAgIHRocm93IGVycm9yO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXROZXh0VHVybm9BY3Rpb24oKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBzZXNzaW9uID0gYXdhaXQgZ2V0U2VydmVyU2Vzc2lvbihhdXRoT3B0aW9ucyk7XG5cbiAgICBpZiAoIXNlc3Npb24/LnVzZXI/LmFjY2Vzc1Rva2VuKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIGF1dGVudGljYWRvJyk7XG4gICAgfVxuXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgJHtBUElfVVJMfS9sb2dpc3RpY3MvdHVybm9zL25leHQtdG9kYXlgLCB7XG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgIEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHtzZXNzaW9uLnVzZXIuYWNjZXNzVG9rZW59YCxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEhUVFAgJHtyZXNwb25zZS5zdGF0dXN9YCk7XG4gICAgfVxuXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgIHJldHVybiByZXN1bHQuZGF0YS5udW1lcm9fdHVybm87XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcignRXJyb3Igb2J0ZW5pZW5kbyB0dXJubzonLCBlcnJvcik7XG4gICAgdGhyb3cgZXJyb3I7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFR1cm5vc1RvZGF5QWN0aW9uKCk6IFByb21pc2U8VHJ1Y2tSZWNlcHRpb25bXT4ge1xuICB0cnkge1xuICAgIGNvbnN0IHNlc3Npb24gPSBhd2FpdCBnZXRTZXJ2ZXJTZXNzaW9uKGF1dGhPcHRpb25zKTtcblxuICAgIGlmICghc2Vzc2lvbj8udXNlcj8uYWNjZXNzVG9rZW4pIHtcbiAgICAgIGNvbnNvbGUud2FybignTm8gYXV0ZW50aWNhZG8gcGFyYSBvYnRlbmVyIHR1cm5vcycpO1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYCR7QVBJX1VSTH0vbG9naXN0aWNzL3R1cm5vcy90b2RheWAsIHtcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgQXV0aG9yaXphdGlvbjogYEJlYXJlciAke3Nlc3Npb24udXNlci5hY2Nlc3NUb2tlbn1gLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgIGNvbnNvbGUud2FybihgRXJyb3IgJHtyZXNwb25zZS5zdGF0dXN9IG9idGVuaWVuZG8gdHVybm9zIGRlbCBiYWNrZW5kYCk7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgIFxuICAgIGNvbnNvbGUubG9nKCdSZXNwb25zZSBmcm9tIGdldFR1cm5vc1RvZGF5QWN0aW9uOicsIHJlc3VsdCk7XG5cbiAgICAvLyBFbCBiYWNrZW5kIGFob3JhIHJldG9ybmE6IHsgc3VjY2VzcywgZGF0YTogWy4uLl0sIHRpbWVzdGFtcCB9XG4gICAgLy8gRG9uZGUgZGF0YSBlcyBkaXJlY3RhbWVudGUgZWwgYXJyYXkgZGUgdHVybm9zXG4gICAgY29uc3QgZGF0YUFycmF5ID0gKHJlc3VsdC5kYXRhIHx8IFtdKSBhcyBUcnVja1JlY2VwdGlvbltdO1xuXG4gICAgY29uc29sZS5sb2coJ0V4dHJhY3RlZCB0dXJub3M6JywgZGF0YUFycmF5KTtcbiAgICByZXR1cm4gZGF0YUFycmF5O1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIG9idGVuaWVuZG8gdHVybm9zOicsIGVycm9yKTtcbiAgICByZXR1cm4gW107XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFRydWNrUmVjZXB0aW9uQnlJZEFjdGlvbihpZDogbnVtYmVyKTogUHJvbWlzZTxUcnVja1JlY2VwdGlvbiB8IG51bGw+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBzZXNzaW9uID0gYXdhaXQgZ2V0U2VydmVyU2Vzc2lvbihhdXRoT3B0aW9ucyk7XG5cbiAgICBpZiAoIXNlc3Npb24/LnVzZXI/LmFjY2Vzc1Rva2VuKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIGF1dGVudGljYWRvJyk7XG4gICAgfVxuXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgJHtBUElfVVJMfS9sb2dpc3RpY3MvdHJ1Y2stcmVjZXB0aW9ucy8ke2lkfWAsIHtcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgQXV0aG9yaXphdGlvbjogYEJlYXJlciAke3Nlc3Npb24udXNlci5hY2Nlc3NUb2tlbn1gLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgSFRUUCAke3Jlc3BvbnNlLnN0YXR1c31gKTtcbiAgICB9XG5cbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgcmV0dXJuIHJlc3VsdC5kYXRhIGFzIFRydWNrUmVjZXB0aW9uO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIG9idGVuaWVuZG8gcmVjZXBjaW9uOicsIGVycm9yKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBkYXRlVHJ1Y2tTdGF0dXNBY3Rpb24oXG4gIGlkOiBudW1iZXIsXG4gIHN0YXR1czogJ0VTUEVSQScgfCAnRklOSVNIRUQnLFxuKTogUHJvbWlzZTxUcnVja1JlY2VwdGlvbj4ge1xuICB0cnkge1xuICAgIGNvbnN0IHNlc3Npb24gPSBhd2FpdCBnZXRTZXJ2ZXJTZXNzaW9uKGF1dGhPcHRpb25zKTtcblxuICAgIGlmICghc2Vzc2lvbj8udXNlcj8uYWNjZXNzVG9rZW4pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTm8gYXV0ZW50aWNhZG8nKTtcbiAgICB9XG5cbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAke0FQSV9VUkx9L2xvZ2lzdGljcy90cnVjay1yZWNlcHRpb25zLyR7aWR9L3N0YXR1c2AsIHtcbiAgICAgIG1ldGhvZDogJ1BVVCcsXG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgIEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHtzZXNzaW9uLnVzZXIuYWNjZXNzVG9rZW59YCxcbiAgICAgIH0sXG4gICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IHN0YXR1cyB9KSxcbiAgICB9KTtcblxuICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgSFRUUCAke3Jlc3BvbnNlLnN0YXR1c306ICR7cmVzcG9uc2Uuc3RhdHVzVGV4dH1gKTtcbiAgICB9XG5cbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgcmV0dXJuIHJlc3VsdC5kYXRhIGFzIFRydWNrUmVjZXB0aW9uO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGFjdHVhbGl6YW5kbyBlc3RhZG8gZGVsIGNhbWlvbjonLCBlcnJvcik7XG4gICAgdGhyb3cgZXJyb3I7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZVRydWNrVHVybm9BY3Rpb24oXG4gIGlkOiBudW1iZXIsXG4gIG51bWVyb1R1cm5vOiBudW1iZXIsXG4pOiBQcm9taXNlPFRydWNrUmVjZXB0aW9uPiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IGdldFNlcnZlclNlc3Npb24oYXV0aE9wdGlvbnMpO1xuXG4gICAgaWYgKCFzZXNzaW9uPy51c2VyPy5hY2Nlc3NUb2tlbikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBhdXRlbnRpY2FkbycpO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYCR7QVBJX1VSTH0vbG9naXN0aWNzL3RydWNrLXJlY2VwdGlvbnMvJHtpZH1gLCB7XG4gICAgICBtZXRob2Q6ICdQVVQnLFxuICAgICAgaGVhZGVyczoge1xuICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7c2Vzc2lvbi51c2VyLmFjY2Vzc1Rva2VufWAsXG4gICAgICB9LFxuICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBudW1lcm9fdHVybm86IG51bWVyb1R1cm5vIH0pLFxuICAgIH0pO1xuXG4gICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBIVFRQICR7cmVzcG9uc2Uuc3RhdHVzfTogJHtyZXNwb25zZS5zdGF0dXNUZXh0fWApO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICByZXR1cm4gcmVzdWx0LmRhdGEgYXMgVHJ1Y2tSZWNlcHRpb247XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcignRXJyb3IgYWN0dWFsaXphbmRvIHR1cm5vIGRlbCBjYW1pb246JywgZXJyb3IpO1xuICAgIHRocm93IGVycm9yO1xuICB9XG59XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjZUQXFKc0IsaU1BQUEifQ==
}),
"[project]/paddy/paddy-tms/src/providers/WeighingPageProvider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WeighingPageProvider",
    ()=>WeighingPageProvider,
    "useWeighingPage",
    ()=>useWeighingPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$actions$2f$data$3a$037182__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/actions/data:037182 [app-client] (ecmascript) <text/javascript>");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
const WeighingPageContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const WeighingPageProvider = ({ children })=>{
    _s();
    const [trucks, setTrucks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedTruckId, setSelectedTruckId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [syncStatus, setSyncStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('idle');
    // Cargar turnos de hoy
    const loadTrucksToday = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "WeighingPageProvider.useCallback[loadTrucksToday]": async ()=>{
            setIsLoading(true);
            setError(null);
            try {
                console.log('loadTrucksToday called - fetching turnos...');
                const turnos = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$actions$2f$data$3a$037182__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["getTurnosTodayAction"])();
                console.log('loadTrucksToday result:', turnos);
                setTrucks(turnos);
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Error desconocido';
                setError(`Error cargando turnos: ${message}`);
                console.error('Error cargando turnos:', err);
            } finally{
                setIsLoading(false);
            }
        }
    }["WeighingPageProvider.useCallback[loadTrucksToday]"], []);
    // Seleccionar camión
    const selectTruck = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "WeighingPageProvider.useCallback[selectTruck]": (id)=>{
            setSelectedTruckId(id);
        }
    }["WeighingPageProvider.useCallback[selectTruck]"], []);
    // Agregar camión a la lista
    const addTruck = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "WeighingPageProvider.useCallback[addTruck]": (truck)=>{
            setTrucks({
                "WeighingPageProvider.useCallback[addTruck]": (prev)=>[
                        truck,
                        ...prev
                    ]
            }["WeighingPageProvider.useCallback[addTruck]"]);
        }
    }["WeighingPageProvider.useCallback[addTruck]"], []);
    // Actualizar camión existente
    const updateTruck = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "WeighingPageProvider.useCallback[updateTruck]": (truck)=>{
            setTrucks({
                "WeighingPageProvider.useCallback[updateTruck]": (prev)=>prev.map({
                        "WeighingPageProvider.useCallback[updateTruck]": (t)=>t.id === truck.id ? truck : t
                    }["WeighingPageProvider.useCallback[updateTruck]"])
            }["WeighingPageProvider.useCallback[updateTruck]"]);
        }
    }["WeighingPageProvider.useCallback[updateTruck]"], []);
    // Limpiar error
    const clearError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "WeighingPageProvider.useCallback[clearError]": ()=>{
            setError(null);
        }
    }["WeighingPageProvider.useCallback[clearError]"], []);
    // Cargar turnos al montar
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "WeighingPageProvider.useEffect": ()=>{
            loadTrucksToday();
        }
    }["WeighingPageProvider.useEffect"], [
        loadTrucksToday
    ]);
    // Sincronizar cola cada 30 segundos
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "WeighingPageProvider.useEffect": ()=>{
            const syncInterval = setInterval({
                "WeighingPageProvider.useEffect.syncInterval": async ()=>{
                    setSyncStatus('syncing');
                    try {
                        // Recargar la lista de turnos (esto es la sincronización)
                        await loadTrucksToday();
                        setSyncStatus('synced');
                    } catch (err) {
                        setSyncStatus('error');
                        console.error('Error sincronizando:', err);
                    }
                }
            }["WeighingPageProvider.useEffect.syncInterval"], 30000);
            return ({
                "WeighingPageProvider.useEffect": ()=>clearInterval(syncInterval)
            })["WeighingPageProvider.useEffect"];
        }
    }["WeighingPageProvider.useEffect"], [
        loadTrucksToday
    ]);
    const value = {
        trucks,
        selectedTruckId,
        isLoading,
        error,
        syncStatus,
        loadTrucksToday,
        selectTruck,
        addTruck,
        updateTruck,
        clearError
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(WeighingPageContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/paddy/paddy-tms/src/providers/WeighingPageProvider.tsx",
        lineNumber: 107,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(WeighingPageProvider, "cK3CVrjaNSza8Q8wZLKwniP1gWA=");
_c = WeighingPageProvider;
const useWeighingPage = ()=>{
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(WeighingPageContext);
    if (!context) {
        throw new Error('useWeighingPage debe usarse dentro de WeighingPageProvider');
    }
    return context;
};
_s1(useWeighingPage, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "WeighingPageProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/paddy/paddy-tms/src/actions/data:7b1e1a [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "updateTruckTurnoAction",
    ()=>$$RSC_SERVER_ACTION_6
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
/* __next_internal_action_entry_do_not_use__ [{"60bad2f729042d2e500828f3b11a9d08742469b1d9":"updateTruckTurnoAction"},"paddy/paddy-tms/src/actions/truckReceptionActions.ts",""] */ "use turbopack no side effects";
;
const $$RSC_SERVER_ACTION_6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("60bad2f729042d2e500828f3b11a9d08742469b1d9", __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "updateTruckTurnoAction");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
 //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vdHJ1Y2tSZWNlcHRpb25BY3Rpb25zLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc2VydmVyJztcblxuaW1wb3J0IHsgZ2V0U2VydmVyU2Vzc2lvbiB9IGZyb20gJ25leHQtYXV0aCc7XG5pbXBvcnQgeyBhdXRoT3B0aW9ucyB9IGZyb20gJ0AvbGliL2F1dGguY29uZmlnJztcblxuY29uc3QgQVBJX1VSTCA9IHByb2Nlc3MuZW52Lk5FWFRfUFVCTElDX0FQSV9VUkwgfHwgJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9hcGkvdjEnO1xuXG5leHBvcnQgaW50ZXJmYWNlIENyZWF0ZVRydWNrV2l0aEdyb3NzV2VpZ2h0UGF5bG9hZCB7XG4gIHByb2R1Y2VyX2lkOiBudW1iZXI7XG4gIGxpY2Vuc2VfcGxhdGU6IHN0cmluZztcbiAgZHJpdmVyX25hbWU6IHN0cmluZztcbiAgY2Fycmllcl9jb21wYW55Pzogc3RyaW5nO1xuICBkaXNwYXRjaF9ndWlkZT86IHN0cmluZztcbiAgZ3Jvc3Nfd2VpZ2h0OiBudW1iZXI7XG4gIGNyZWF0ZWRfYnk/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmVnaXN0ZXJUYXJlV2VpZ2h0UGF5bG9hZCB7XG4gIHRydWNrX3JlY2VwdGlvbl9pZDogbnVtYmVyO1xuICB0YXJlX3dlaWdodDogbnVtYmVyO1xuICBjcmVhdGVkX2J5Pzogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFRydWNrUmVjZXB0aW9uIHtcbiAgaWQ6IG51bWJlcjtcbiAgbnVtZXJvX3R1cm5vOiBudW1iZXI7XG4gIHN0YXR1czogJ0VTUEVSQScgfCAnRklOSVNIRUQnO1xuICBwcm9kdWNlcl9pZDogbnVtYmVyO1xuICBsaWNlbnNlX3BsYXRlOiBzdHJpbmc7XG4gIGRyaXZlcl9uYW1lOiBzdHJpbmc7XG4gIGNhcnJpZXJfY29tcGFueT86IHN0cmluZztcbiAgZGlzcGF0Y2hfZ3VpZGU/OiBzdHJpbmc7XG4gIGdyb3NzX3dlaWdodD86IG51bWJlcjtcbiAgdGFyZV93ZWlnaHQ/OiBudW1iZXI7XG4gIG5ldF93ZWlnaHQ/OiBudW1iZXI7XG4gIGVudHJ5X2F0OiBEYXRlO1xuICBmaW5pc2hlZF9hdD86IERhdGU7XG4gIGNyZWF0ZWRfYnk/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjcmVhdGVUcnVja1JlY2VwdGlvbkFjdGlvbihcbiAgcGF5bG9hZDogQ3JlYXRlVHJ1Y2tXaXRoR3Jvc3NXZWlnaHRQYXlsb2FkLFxuKTogUHJvbWlzZTxUcnVja1JlY2VwdGlvbj4ge1xuICB0cnkge1xuICAgIGNvbnN0IHNlc3Npb24gPSBhd2FpdCBnZXRTZXJ2ZXJTZXNzaW9uKGF1dGhPcHRpb25zKTtcblxuICAgIGlmICghc2Vzc2lvbj8udXNlcj8uYWNjZXNzVG9rZW4pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTm8gYXV0ZW50aWNhZG8nKTtcbiAgICB9XG5cbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFxuICAgICAgYCR7QVBJX1VSTH0vbG9naXN0aWNzL3RydWNrLXJlY2VwdGlvbnMvd2l0aC1ncm9zcy13ZWlnaHRgLFxuICAgICAge1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgQXV0aG9yaXphdGlvbjogYEJlYXJlciAke3Nlc3Npb24udXNlci5hY2Nlc3NUb2tlbn1gLFxuICAgICAgICB9LFxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShwYXlsb2FkKSxcbiAgICAgIH0sXG4gICAgKTtcblxuICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgIGxldCBlcnJvck1lc3NhZ2UgPSBgSFRUUCAke3Jlc3BvbnNlLnN0YXR1c306ICR7cmVzcG9uc2Uuc3RhdHVzVGV4dH1gO1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgZXJyb3JCb2R5ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgICBpZiAoZXJyb3JCb2R5Lm1lc3NhZ2UpIHtcbiAgICAgICAgICBlcnJvck1lc3NhZ2UgPSBlcnJvckJvZHkubWVzc2FnZTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCB7XG4gICAgICAgIC8vIFNpIG5vIHNlIHB1ZWRlIHBhcnNlYXIgZWwgZXJyb3IsIHVzYXIgZWwgbWVuc2FqZSBnZW5lcmljb1xuICAgICAgfVxuICAgICAgdGhyb3cgbmV3IEVycm9yKGVycm9yTWVzc2FnZSk7XG4gICAgfVxuXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgIFxuICAgIGNvbnNvbGUubG9nKCdSZXNwb25zZSBmcm9tIGNyZWF0ZVRydWNrUmVjZXB0aW9uQWN0aW9uOicsIHJlc3VsdCk7XG4gICAgXG4gICAgY29uc3QgdHJ1Y2tEYXRhOiBUcnVja1JlY2VwdGlvbiA9IHJlc3VsdC5kYXRhO1xuICAgIFxuICAgIGlmICghdHJ1Y2tEYXRhLm51bWVyb190dXJubykge1xuICAgICAgY29uc29sZS53YXJuKCdXYXJuaW5nOiBudW1lcm9fdHVybm8gbm8gZGVmaW5pZG8gZW4gcmVzcHVlc3RhOicsIHRydWNrRGF0YSk7XG4gICAgfVxuICAgIFxuICAgIHJldHVybiB0cnVja0RhdGE7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcignRXJyb3IgY3JlYW5kbyByZWNlcGNpb246JywgZXJyb3IpO1xuICAgIHRocm93IGVycm9yO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZWNvcmRUYXJlV2VpZ2h0QWN0aW9uKFxuICBwYXlsb2FkOiBSZWdpc3RlclRhcmVXZWlnaHRQYXlsb2FkLFxuKTogUHJvbWlzZTxUcnVja1JlY2VwdGlvbj4ge1xuICB0cnkge1xuICAgIGNvbnN0IHNlc3Npb24gPSBhd2FpdCBnZXRTZXJ2ZXJTZXNzaW9uKGF1dGhPcHRpb25zKTtcblxuICAgIGlmICghc2Vzc2lvbj8udXNlcj8uYWNjZXNzVG9rZW4pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTm8gYXV0ZW50aWNhZG8nKTtcbiAgICB9XG5cbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAke0FQSV9VUkx9L2xvZ2lzdGljcy93ZWlnaGluZ3MvdGFyZWAsIHtcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgaGVhZGVyczoge1xuICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7c2Vzc2lvbi51c2VyLmFjY2Vzc1Rva2VufWAsXG4gICAgICB9LFxuICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkocGF5bG9hZCksXG4gICAgfSk7XG5cbiAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEhUVFAgJHtyZXNwb25zZS5zdGF0dXN9OiAke3Jlc3BvbnNlLnN0YXR1c1RleHR9YCk7XG4gICAgfVxuXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgIHJldHVybiByZXN1bHQuZGF0YSBhcyBUcnVja1JlY2VwdGlvbjtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdFcnJvciByZWdpc3RyYW5kbyBwZXNvIHRhcmE6JywgZXJyb3IpO1xuICAgIHRocm93IGVycm9yO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXROZXh0VHVybm9BY3Rpb24oKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBzZXNzaW9uID0gYXdhaXQgZ2V0U2VydmVyU2Vzc2lvbihhdXRoT3B0aW9ucyk7XG5cbiAgICBpZiAoIXNlc3Npb24/LnVzZXI/LmFjY2Vzc1Rva2VuKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIGF1dGVudGljYWRvJyk7XG4gICAgfVxuXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgJHtBUElfVVJMfS9sb2dpc3RpY3MvdHVybm9zL25leHQtdG9kYXlgLCB7XG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgIEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHtzZXNzaW9uLnVzZXIuYWNjZXNzVG9rZW59YCxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEhUVFAgJHtyZXNwb25zZS5zdGF0dXN9YCk7XG4gICAgfVxuXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgIHJldHVybiByZXN1bHQuZGF0YS5udW1lcm9fdHVybm87XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcignRXJyb3Igb2J0ZW5pZW5kbyB0dXJubzonLCBlcnJvcik7XG4gICAgdGhyb3cgZXJyb3I7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFR1cm5vc1RvZGF5QWN0aW9uKCk6IFByb21pc2U8VHJ1Y2tSZWNlcHRpb25bXT4ge1xuICB0cnkge1xuICAgIGNvbnN0IHNlc3Npb24gPSBhd2FpdCBnZXRTZXJ2ZXJTZXNzaW9uKGF1dGhPcHRpb25zKTtcblxuICAgIGlmICghc2Vzc2lvbj8udXNlcj8uYWNjZXNzVG9rZW4pIHtcbiAgICAgIGNvbnNvbGUud2FybignTm8gYXV0ZW50aWNhZG8gcGFyYSBvYnRlbmVyIHR1cm5vcycpO1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYCR7QVBJX1VSTH0vbG9naXN0aWNzL3R1cm5vcy90b2RheWAsIHtcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgQXV0aG9yaXphdGlvbjogYEJlYXJlciAke3Nlc3Npb24udXNlci5hY2Nlc3NUb2tlbn1gLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgIGNvbnNvbGUud2FybihgRXJyb3IgJHtyZXNwb25zZS5zdGF0dXN9IG9idGVuaWVuZG8gdHVybm9zIGRlbCBiYWNrZW5kYCk7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgIFxuICAgIGNvbnNvbGUubG9nKCdSZXNwb25zZSBmcm9tIGdldFR1cm5vc1RvZGF5QWN0aW9uOicsIHJlc3VsdCk7XG5cbiAgICAvLyBFbCBiYWNrZW5kIGFob3JhIHJldG9ybmE6IHsgc3VjY2VzcywgZGF0YTogWy4uLl0sIHRpbWVzdGFtcCB9XG4gICAgLy8gRG9uZGUgZGF0YSBlcyBkaXJlY3RhbWVudGUgZWwgYXJyYXkgZGUgdHVybm9zXG4gICAgY29uc3QgZGF0YUFycmF5ID0gKHJlc3VsdC5kYXRhIHx8IFtdKSBhcyBUcnVja1JlY2VwdGlvbltdO1xuXG4gICAgY29uc29sZS5sb2coJ0V4dHJhY3RlZCB0dXJub3M6JywgZGF0YUFycmF5KTtcbiAgICByZXR1cm4gZGF0YUFycmF5O1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIG9idGVuaWVuZG8gdHVybm9zOicsIGVycm9yKTtcbiAgICByZXR1cm4gW107XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFRydWNrUmVjZXB0aW9uQnlJZEFjdGlvbihpZDogbnVtYmVyKTogUHJvbWlzZTxUcnVja1JlY2VwdGlvbiB8IG51bGw+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBzZXNzaW9uID0gYXdhaXQgZ2V0U2VydmVyU2Vzc2lvbihhdXRoT3B0aW9ucyk7XG5cbiAgICBpZiAoIXNlc3Npb24/LnVzZXI/LmFjY2Vzc1Rva2VuKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIGF1dGVudGljYWRvJyk7XG4gICAgfVxuXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgJHtBUElfVVJMfS9sb2dpc3RpY3MvdHJ1Y2stcmVjZXB0aW9ucy8ke2lkfWAsIHtcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgQXV0aG9yaXphdGlvbjogYEJlYXJlciAke3Nlc3Npb24udXNlci5hY2Nlc3NUb2tlbn1gLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgSFRUUCAke3Jlc3BvbnNlLnN0YXR1c31gKTtcbiAgICB9XG5cbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgcmV0dXJuIHJlc3VsdC5kYXRhIGFzIFRydWNrUmVjZXB0aW9uO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIG9idGVuaWVuZG8gcmVjZXBjaW9uOicsIGVycm9yKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBkYXRlVHJ1Y2tTdGF0dXNBY3Rpb24oXG4gIGlkOiBudW1iZXIsXG4gIHN0YXR1czogJ0VTUEVSQScgfCAnRklOSVNIRUQnLFxuKTogUHJvbWlzZTxUcnVja1JlY2VwdGlvbj4ge1xuICB0cnkge1xuICAgIGNvbnN0IHNlc3Npb24gPSBhd2FpdCBnZXRTZXJ2ZXJTZXNzaW9uKGF1dGhPcHRpb25zKTtcblxuICAgIGlmICghc2Vzc2lvbj8udXNlcj8uYWNjZXNzVG9rZW4pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTm8gYXV0ZW50aWNhZG8nKTtcbiAgICB9XG5cbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAke0FQSV9VUkx9L2xvZ2lzdGljcy90cnVjay1yZWNlcHRpb25zLyR7aWR9L3N0YXR1c2AsIHtcbiAgICAgIG1ldGhvZDogJ1BVVCcsXG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgIEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHtzZXNzaW9uLnVzZXIuYWNjZXNzVG9rZW59YCxcbiAgICAgIH0sXG4gICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IHN0YXR1cyB9KSxcbiAgICB9KTtcblxuICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgSFRUUCAke3Jlc3BvbnNlLnN0YXR1c306ICR7cmVzcG9uc2Uuc3RhdHVzVGV4dH1gKTtcbiAgICB9XG5cbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgcmV0dXJuIHJlc3VsdC5kYXRhIGFzIFRydWNrUmVjZXB0aW9uO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGFjdHVhbGl6YW5kbyBlc3RhZG8gZGVsIGNhbWlvbjonLCBlcnJvcik7XG4gICAgdGhyb3cgZXJyb3I7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZVRydWNrVHVybm9BY3Rpb24oXG4gIGlkOiBudW1iZXIsXG4gIG51bWVyb1R1cm5vOiBudW1iZXIsXG4pOiBQcm9taXNlPFRydWNrUmVjZXB0aW9uPiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IGdldFNlcnZlclNlc3Npb24oYXV0aE9wdGlvbnMpO1xuXG4gICAgaWYgKCFzZXNzaW9uPy51c2VyPy5hY2Nlc3NUb2tlbikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBhdXRlbnRpY2FkbycpO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYCR7QVBJX1VSTH0vbG9naXN0aWNzL3RydWNrLXJlY2VwdGlvbnMvJHtpZH1gLCB7XG4gICAgICBtZXRob2Q6ICdQVVQnLFxuICAgICAgaGVhZGVyczoge1xuICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7c2Vzc2lvbi51c2VyLmFjY2Vzc1Rva2VufWAsXG4gICAgICB9LFxuICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBudW1lcm9fdHVybm86IG51bWVyb1R1cm5vIH0pLFxuICAgIH0pO1xuXG4gICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBIVFRQICR7cmVzcG9uc2Uuc3RhdHVzfTogJHtyZXNwb25zZS5zdGF0dXNUZXh0fWApO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICByZXR1cm4gcmVzdWx0LmRhdGEgYXMgVHJ1Y2tSZWNlcHRpb247XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcignRXJyb3IgYWN0dWFsaXphbmRvIHR1cm5vIGRlbCBjYW1pb246JywgZXJyb3IpO1xuICAgIHRocm93IGVycm9yO1xuICB9XG59XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IitUQW1Qc0IsbU1BQUEifQ==
}),
"[project]/paddy/paddy-tms/src/shared/components/ui/Badge/Badge.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantStyles[variant]} ${className}`,
        children: children
    }, void 0, false, {
        fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/Badge/Badge.tsx",
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
"[project]/paddy/paddy-tms/src/components/weighing/TruckList.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TruckList",
    ()=>TruckList
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$actions$2f$data$3a$7b1e1a__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/actions/data:7b1e1a [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$Badge$2f$Badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/shared/components/ui/Badge/Badge.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
const TruckList = ({ trucks, selectedTruckId, onSelectTruck })=>{
    _s();
    const [orderedTrucks, setOrderedTrucks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [draggedId, setDraggedId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [dragOverId, setDragOverId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isUpdating, setIsUpdating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TruckList.useEffect": ()=>{
            const espera = trucks.filter({
                "TruckList.useEffect.espera": (t)=>t.status === 'ESPERA'
            }["TruckList.useEffect.espera"]);
            setOrderedTrucks(espera);
        }
    }["TruckList.useEffect"], [
        trucks
    ]);
    const handleDragStart = (e, truckId)=>{
        setDraggedId(truckId);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('truckId', truckId.toString());
    };
    const handleDragEnd = ()=>{
        setDraggedId(null);
        setDragOverId(null);
    };
    const handleDragOver = (e)=>{
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };
    const handleDragEnter = (e, truckId)=>{
        e.preventDefault();
        setDragOverId(truckId);
    };
    const handleDragLeave = (e)=>{
        e.preventDefault();
        setDragOverId(null);
    };
    const handleDrop = async (e, targetTruckId)=>{
        e.preventDefault();
        e.stopPropagation();
        if (!draggedId || draggedId === targetTruckId) {
            setDraggedId(null);
            setDragOverId(null);
            return;
        }
        const draggedIndex = orderedTrucks.findIndex((t)=>t.id === draggedId);
        const targetIndex = orderedTrucks.findIndex((t)=>t.id === targetTruckId);
        if (draggedIndex === -1 || targetIndex === -1) {
            setDraggedId(null);
            setDragOverId(null);
            return;
        }
        // Simple swap: intercambiar las posiciones
        const newList = [
            ...orderedTrucks
        ];
        [newList[draggedIndex], newList[targetIndex]] = [
            newList[targetIndex],
            newList[draggedIndex]
        ];
        // Actualizar los números de turno en los objetos
        newList.forEach((truck, index)=>{
            truck.numero_turno = index + 1;
        });
        setOrderedTrucks(newList);
        setDraggedId(null);
        setDragOverId(null);
        // Actualizar turnos en el backend
        setIsUpdating(true);
        try {
            // Actualizar todos los turnos con sus nuevas posiciones
            const updatePromises = newList.map((truck, index)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$actions$2f$data$3a$7b1e1a__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["updateTruckTurnoAction"])(truck.id, index + 1));
            await Promise.all(updatePromises);
            console.log('Turnos actualizados exitosamente:', newList.map((t)=>({
                    id: t.id,
                    turno: t.numero_turno
                })));
        } catch (error) {
            console.error('Error actualizando turnos:', error);
            // Revertir a la lista original en caso de error
            const espera = trucks.filter((t)=>t.status === 'ESPERA');
            setOrderedTrucks(espera);
        } finally{
            setIsUpdating(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-background rounded-lg border border-border p-4 h-full overflow-y-auto",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-lg font-bold text-foreground",
                        children: "En Espera para Tara"
                    }, void 0, false, {
                        fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckList.tsx",
                        lineNumber: 109,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$Badge$2f$Badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        variant: "secondary",
                        className: "text-sm",
                        children: orderedTrucks.length
                    }, void 0, false, {
                        fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckList.tsx",
                        lineNumber: 110,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckList.tsx",
                lineNumber: 108,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-3",
                onDragOver: handleDragOver,
                children: orderedTrucks.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-center py-12",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-muted-foreground",
                        children: "Sin camiones en espera"
                    }, void 0, false, {
                        fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckList.tsx",
                        lineNumber: 118,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckList.tsx",
                    lineNumber: 117,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0)) : orderedTrucks.map((truck)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        draggable: "true",
                        onDragStart: (e)=>handleDragStart(e, truck.id),
                        onDragEnd: handleDragEnd,
                        onDragOver: handleDragOver,
                        onDragEnter: (e)=>handleDragEnter(e, truck.id),
                        onDragLeave: handleDragLeave,
                        onDrop: (e)=>handleDrop(e, truck.id),
                        onClick: ()=>onSelectTruck(truck.id),
                        className: `group relative flex items-center rounded-lg border-2 transition-all cursor-move overflow-hidden ${isUpdating ? 'opacity-50 cursor-wait' : draggedId === truck.id ? 'opacity-50 border-dashed border-primary/50' : dragOverId === truck.id ? 'bg-primary/5 border-primary border-dashed shadow-md' : selectedTruckId === truck.id ? 'bg-primary/10 border-primary shadow-lg' : 'bg-card border-border hover:border-primary/50 hover:shadow-md'}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-[18%] flex items-center justify-center bg-gradient-to-r from-primary/5 to-transparent py-4 pl-3",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: (e)=>{
                                        e.stopPropagation();
                                        onSelectTruck(truck.id);
                                    },
                                    className: "p-2 rounded-full hover:bg-primary/30 hover:scale-110 transition-all duration-200 disabled:opacity-50 group/btn",
                                    title: "Seleccionar para pesar",
                                    disabled: isUpdating,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "w-8 h-8 text-primary group-hover/btn:text-primary group-hover/btn:drop-shadow-lg transition-all duration-200",
                                        fill: "none",
                                        stroke: "currentColor",
                                        viewBox: "0 0 24 24",
                                        strokeWidth: "2",
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                x: "3",
                                                y: "3",
                                                width: "18",
                                                height: "18",
                                                rx: "2"
                                            }, void 0, false, {
                                                fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckList.tsx",
                                                lineNumber: 163,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M 15 12 L 9 12 M 9 12 L 12 9 M 9 12 L 12 15"
                                            }, void 0, false, {
                                                fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckList.tsx",
                                                lineNumber: 164,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckList.tsx",
                                        lineNumber: 154,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckList.tsx",
                                    lineNumber: 145,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckList.tsx",
                                lineNumber: 144,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1 flex items-center justify-between p-4 pr-3 relative gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1 min-w-0 space-y-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-baseline gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$Badge$2f$Badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                        variant: "primary",
                                                        className: "text-xs font-semibold flex-shrink-0",
                                                        children: [
                                                            "#",
                                                            truck.numero_turno
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckList.tsx",
                                                        lineNumber: 175,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-lg font-bold text-foreground truncate",
                                                        children: truck.license_plate
                                                    }, void 0, false, {
                                                        fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckList.tsx",
                                                        lineNumber: 178,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckList.tsx",
                                                lineNumber: 174,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xs",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-muted-foreground font-medium",
                                                        children: "Chofer:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckList.tsx",
                                                        lineNumber: 185,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-foreground ml-1",
                                                        children: truck.driver_name
                                                    }, void 0, false, {
                                                        fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckList.tsx",
                                                        lineNumber: 186,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckList.tsx",
                                                lineNumber: 184,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            truck.carrier_company && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xs",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-muted-foreground font-medium",
                                                        children: "Empresa:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckList.tsx",
                                                        lineNumber: 192,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-foreground ml-1",
                                                        children: truck.carrier_company
                                                    }, void 0, false, {
                                                        fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckList.tsx",
                                                        lineNumber: 193,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckList.tsx",
                                                lineNumber: 191,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            truck.dispatch_guide && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xs",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-muted-foreground font-medium",
                                                        children: "Guía:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckList.tsx",
                                                        lineNumber: 200,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-foreground ml-1",
                                                        children: truck.dispatch_guide
                                                    }, void 0, false, {
                                                        fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckList.tsx",
                                                        lineNumber: 201,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckList.tsx",
                                                lineNumber: 199,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckList.tsx",
                                        lineNumber: 172,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2 flex-shrink-0",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-center px-2 py-1.5 rounded-md bg-neutral/10",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-muted-foreground font-medium",
                                                        children: "Bruto"
                                                    }, void 0, false, {
                                                        fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckList.tsx",
                                                        lineNumber: 210,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm font-bold text-foreground",
                                                        children: [
                                                            Number(truck.gross_weight || 0).toLocaleString('es-CL', {
                                                                maximumFractionDigits: 0
                                                            }),
                                                            " kg"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckList.tsx",
                                                        lineNumber: 211,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckList.tsx",
                                                lineNumber: 209,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-center px-2 py-1.5 rounded-md bg-neutral/10",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-muted-foreground font-medium",
                                                        children: "Entrada"
                                                    }, void 0, false, {
                                                        fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckList.tsx",
                                                        lineNumber: 218,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm font-bold text-foreground",
                                                        children: new Date(truck.entry_at).toLocaleTimeString('es-CL', {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                            hour12: false
                                                        })
                                                    }, void 0, false, {
                                                        fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckList.tsx",
                                                        lineNumber: 219,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckList.tsx",
                                                lineNumber: 217,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckList.tsx",
                                        lineNumber: 207,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onMouseDown: (e)=>e.stopPropagation(),
                                            className: "p-1.5 rounded hover:bg-primary/20 transition-all duration-200 disabled:opacity-50",
                                            title: "Arrastrar para reordenar",
                                            disabled: isUpdating,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                className: "w-4 h-4 text-muted-foreground hover:text-primary transition-colors duration-200",
                                                fill: "currentColor",
                                                viewBox: "0 0 24 24",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                        cx: "9",
                                                        cy: "5",
                                                        r: "1.5"
                                                    }, void 0, false, {
                                                        fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckList.tsx",
                                                        lineNumber: 242,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                        cx: "9",
                                                        cy: "12",
                                                        r: "1.5"
                                                    }, void 0, false, {
                                                        fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckList.tsx",
                                                        lineNumber: 243,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                        cx: "9",
                                                        cy: "19",
                                                        r: "1.5"
                                                    }, void 0, false, {
                                                        fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckList.tsx",
                                                        lineNumber: 244,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                        cx: "15",
                                                        cy: "5",
                                                        r: "1.5"
                                                    }, void 0, false, {
                                                        fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckList.tsx",
                                                        lineNumber: 245,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                        cx: "15",
                                                        cy: "12",
                                                        r: "1.5"
                                                    }, void 0, false, {
                                                        fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckList.tsx",
                                                        lineNumber: 246,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                        cx: "15",
                                                        cy: "19",
                                                        r: "1.5"
                                                    }, void 0, false, {
                                                        fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckList.tsx",
                                                        lineNumber: 247,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckList.tsx",
                                                lineNumber: 237,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckList.tsx",
                                            lineNumber: 231,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckList.tsx",
                                        lineNumber: 230,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckList.tsx",
                                lineNumber: 170,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, truck.id, true, {
                        fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckList.tsx",
                        lineNumber: 122,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)))
            }, void 0, false, {
                fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckList.tsx",
                lineNumber: 115,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckList.tsx",
        lineNumber: 107,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(TruckList, "zWRi1cUFkvKDDtPMJch8C2OJQ4A=");
_c = TruckList;
var _c;
__turbopack_context__.k.register(_c, "TruckList");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/paddy/paddy-tms/src/shared/components/ui/Button/Button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        className: buttonClasses,
        "data-test-id": "button-root",
        disabled: disabled || loading,
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center gap-2",
            children: [
                loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    className: "animate-spin h-4 w-4 text-current",
                    xmlns: "http://www.w3.org/2000/svg",
                    fill: "none",
                    viewBox: "0 0 24 24",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
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
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
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
_c = Button;
var _c;
__turbopack_context__.k.register(_c, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/paddy/paddy-tms/src/shared/components/ui/Alert/Alert.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
const variantStyles = {
    success: "alert-success",
    info: "alert-info",
    warning: "alert-warning",
    error: "alert-error"
};
const Alert = ({ variant = "info", children, className = "", ...props })=>{
    const dataTestId = props["data-test-id"];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative w-full",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 bg-white/70 rounded z-0 pointer-events-none"
            }, void 0, false, {
                fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/Alert/Alert.tsx",
                lineNumber: 24,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
_c = Alert;
const __TURBOPACK__default__export__ = Alert;
var _c;
__turbopack_context__.k.register(_c, "Alert");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/paddy/paddy-tms/src/app/weighing/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>WeighingPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next-auth/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$hooks$2f$useSerialPort$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/hooks/useSerialPort.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$providers$2f$WeighingPageProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/providers/WeighingPageProvider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$components$2f$weighing$2f$TruckList$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/components/weighing/TruckList.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$Button$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/shared/components/ui/Button/Button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$Alert$2f$Alert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/shared/components/ui/Alert/Alert.tsx [app-client] (ecmascript)");
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
// Componente interno que usa el contexto
const WeighingPageContent = ()=>{
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { data: session } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSession"])();
    const { trucks, selectedTruckId, isLoading, error, selectTruck, addTruck, updateTruck, clearError } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$providers$2f$WeighingPageProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWeighingPage"])();
    const { isConnected: serialConnected, lastWeight } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$hooks$2f$useSerialPort$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSerialPort"])(true);
    const selectedTruck = trucks.find((t)=>t.id === selectedTruckId) || null;
    const handleLogout = async ()=>{
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signOut"])({
            redirect: false
        });
        window.location.href = '/';
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-background flex flex-col",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "bg-background border-b border-border px-6 py-4 shadow-sm",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                    src: "/logo.svg",
                                    alt: "Paddy Logo",
                                    className: "h-8 w-auto"
                                }, void 0, false, {
                                    fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                    lineNumber: 34,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "text-2xl font-bold text-primary",
                                    children: "Paddy TMS"
                                }, void 0, false, {
                                    fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                    lineNumber: 39,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `w-3 h-3 rounded-full ${serialConnected ? 'bg-success' : 'bg-muted'}`
                                        }, void 0, false, {
                                            fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                            lineNumber: 41,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-sm text-muted-foreground",
                                            children: serialConnected ? 'Balanza conectada' : 'Sin conexión serial'
                                        }, void 0, false, {
                                            fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                            lineNumber: 44,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                    lineNumber: 40,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                            lineNumber: 33,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-sm text-muted-foreground",
                                    children: session?.user?.email
                                }, void 0, false, {
                                    fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                    lineNumber: 51,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$Button$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "outlined",
                                    onClick: handleLogout,
                                    children: "Salir"
                                }, void 0, false, {
                                    fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                    lineNumber: 54,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                            lineNumber: 50,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                    lineNumber: 32,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                lineNumber: 31,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "flex-1 p-6 overflow-hidden",
                children: [
                    error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$Alert$2f$Alert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        variant: "error",
                        className: "mb-4",
                        children: [
                            error,
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: clearError,
                                className: "ml-2 underline text-sm",
                                children: "Cerrar"
                            }, void 0, false, {
                                fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                lineNumber: 67,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                        lineNumber: 65,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-180px)]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "lg:col-span-1 overflow-auto",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NewTruckReceptionForm, {
                                    serialWeight: lastWeight,
                                    isSerialConnected: serialConnected
                                }, void 0, false, {
                                    fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                    lineNumber: 80,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                lineNumber: 79,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "lg:col-span-1 overflow-auto",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$components$2f$weighing$2f$TruckList$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TruckList"], {
                                    trucks: trucks,
                                    selectedTruckId: selectedTruckId,
                                    onSelectTruck: selectTruck
                                }, void 0, false, {
                                    fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                    lineNumber: 88,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                lineNumber: 87,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                        lineNumber: 77,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                lineNumber: 62,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
        lineNumber: 29,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(WeighingPageContent, "WuyFV0VAR1F3FylKwlp9BdbRRWo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSession"],
        __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$providers$2f$WeighingPageProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWeighingPage"],
        __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$hooks$2f$useSerialPort$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSerialPort"]
    ];
});
_c = WeighingPageContent;
function WeighingPage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$providers$2f$WeighingPageProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WeighingPageProvider"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(WeighingPageContent, {}, void 0, false, {
            fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
            lineNumber: 104,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
        lineNumber: 103,
        columnNumber: 5
    }, this);
}
_c1 = WeighingPage;
var _c, _c1;
__turbopack_context__.k.register(_c, "WeighingPageContent");
__turbopack_context__.k.register(_c1, "WeighingPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/paddy/paddy-tms/node_modules/next/navigation.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = __turbopack_context__.r("[project]/paddy/paddy-tms/node_modules/next/dist/client/components/navigation.js [app-client] (ecmascript)");
}),
"[project]/paddy/paddy-tms/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// This file must be bundled in the app's client layer, it shouldn't be directly
// imported by the server.
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    callServer: null,
    createServerReference: null,
    findSourceMapURL: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    callServer: function() {
        return _appcallserver.callServer;
    },
    createServerReference: function() {
        return _client.createServerReference;
    },
    findSourceMapURL: function() {
        return _appfindsourcemapurl.findSourceMapURL;
    }
});
const _appcallserver = __turbopack_context__.r("[project]/paddy/paddy-tms/node_modules/next/dist/client/app-call-server.js [app-client] (ecmascript)");
const _appfindsourcemapurl = __turbopack_context__.r("[project]/paddy/paddy-tms/node_modules/next/dist/client/app-find-source-map-url.js [app-client] (ecmascript)");
const _client = __turbopack_context__.r("[project]/paddy/paddy-tms/node_modules/next/dist/compiled/react-server-dom-turbopack/client.js [app-client] (ecmascript)"); //# sourceMappingURL=action-client-wrapper.js.map
}),
]);

//# sourceMappingURL=paddy_paddy-tms_74305d79._.js.map