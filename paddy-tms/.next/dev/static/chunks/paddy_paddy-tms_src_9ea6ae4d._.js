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
"[project]/paddy/paddy-tms/src/services/localStorage.service.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LocalStorageService",
    ()=>LocalStorageService,
    "localStorageService",
    ()=>localStorageService
]);
'use client';
class LocalStorageService {
    TURNO_SESSION_KEY = 'turno_session';
    SYNC_QUEUE_KEY = 'truck_reception_sync_queue';
    CACHE_KEY = 'truck_receptions_cache';
    /**
   * Obtener la sesión de turnos para una fecha específica
   */ getTurnoSession(fecha) {
        const key = `${this.TURNO_SESSION_KEY}_${this.formatDate(fecha)}`;
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }
    /**
   * Crear o actualizar la sesión de turnos para hoy
   */ saveTurnoSession(fecha, session) {
        const key = `${this.TURNO_SESSION_KEY}_${this.formatDate(fecha)}`;
        localStorage.setItem(key, JSON.stringify(session));
    }
    /**
   * Inicializar sesión de turnos si no existe
   */ initializeTurnoSessionIfNeeded(fecha) {
        let session = this.getTurnoSession(fecha);
        if (!session) {
            session = {
                fecha: this.formatDate(fecha),
                turnos: [],
                nextTurno: 1
            };
            this.saveTurnoSession(fecha, session);
        }
        return session;
    }
    /**
   * Obtener el próximo número de turno para hoy
   */ getNextTurno(fecha) {
        const session = this.getTurnoSession(fecha) || this.initializeTurnoSessionIfNeeded(fecha);
        return session.nextTurno;
    }
    /**
   * Agregar un turno a la sesión
   */ addTurno(fecha, turno) {
        const session = this.getTurnoSession(fecha) || this.initializeTurnoSessionIfNeeded(fecha);
        session.turnos.push(turno);
        session.nextTurno = turno.numero + 1;
        this.saveTurnoSession(fecha, session);
    }
    /**
   * Actualizar turno existente
   */ updateTurno(fecha, numero, status) {
        const session = this.getTurnoSession(fecha);
        if (!session) return;
        const turno = session.turnos.find((t)=>t.numero === numero);
        if (turno) {
            turno.status = status;
            this.saveTurnoSession(fecha, session);
        }
    }
    /**
   * Guardar recepción en cache local
   */ saveTruckReception(truck) {
        const cache = this.getTruckReceptionsCache();
        cache[truck.id] = truck;
        localStorage.setItem(this.CACHE_KEY, JSON.stringify(cache));
    }
    /**
   * Obtener cache de recepciones
   */ getTruckReceptionsCache() {
        const data = localStorage.getItem(this.CACHE_KEY);
        return data ? JSON.parse(data) : {};
    }
    /**
   * Agregar a cola de sincronización
   */ addToSyncQueue(action, data, id) {
        const queue = this.getSyncQueue();
        queue.push({
            action,
            data,
            timestamp: Date.now(),
            id
        });
        localStorage.setItem(this.SYNC_QUEUE_KEY, JSON.stringify(queue));
    }
    /**
   * Obtener cola de sincronización
   */ getSyncQueue() {
        const data = localStorage.getItem(this.SYNC_QUEUE_KEY);
        return data ? JSON.parse(data) : [];
    }
    /**
   * Limpiar cola de sincronización
   */ clearSyncQueue() {
        localStorage.removeItem(this.SYNC_QUEUE_KEY);
    }
    /**
   * Remover un elemento de la cola de sincronización
   */ removeFromSyncQueue(index) {
        const queue = this.getSyncQueue();
        queue.splice(index, 1);
        localStorage.setItem(this.SYNC_QUEUE_KEY, JSON.stringify(queue));
    }
    /**
   * Limpiar todo el cache local
   */ clearAll() {
        Object.keys(localStorage).filter((key)=>key.startsWith(this.TURNO_SESSION_KEY) || key === this.SYNC_QUEUE_KEY || key === this.CACHE_KEY).forEach((key)=>localStorage.removeItem(key));
    }
    /**
   * Formatear fecha a YYYY-MM-DD
   */ formatDate(fecha) {
        const year = fecha.getFullYear();
        const month = String(fecha.getMonth() + 1).padStart(2, '0');
        const day = String(fecha.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
}
const localStorageService = new LocalStorageService();
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/paddy/paddy-tms/src/actions/data:799b9f [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getAuthTokenAction",
    ()=>$$RSC_SERVER_ACTION_1
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
/* __next_internal_action_entry_do_not_use__ [{"001620a38b2cdb75a15377e4c76005e7b6e48c62bd":"getAuthTokenAction"},"paddy/paddy-tms/src/actions/authActions.ts",""] */ "use turbopack no side effects";
;
const $$RSC_SERVER_ACTION_1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("001620a38b2cdb75a15377e4c76005e7b6e48c62bd", __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "getAuthTokenAction");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
 //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vYXV0aEFjdGlvbnMudHMiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzZXJ2ZXInO1xuXG5pbXBvcnQgeyBnZXRTZXJ2ZXJTZXNzaW9uIH0gZnJvbSAnbmV4dC1hdXRoJztcbmltcG9ydCB7IGF1dGhPcHRpb25zIH0gZnJvbSAnQC9saWIvYXV0aC5jb25maWcnO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0U2Vzc2lvbkFjdGlvbigpIHtcbiAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IGdldFNlcnZlclNlc3Npb24oYXV0aE9wdGlvbnMpO1xuICByZXR1cm4gc2Vzc2lvbjtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldEF1dGhUb2tlbkFjdGlvbigpOiBQcm9taXNlPHN0cmluZyB8IG51bGw+IHtcbiAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IGdldFNlcnZlclNlc3Npb24oYXV0aE9wdGlvbnMpO1xuICByZXR1cm4gc2Vzc2lvbj8udXNlcj8uYWNjZXNzVG9rZW4gPz8gbnVsbDtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldEN1cnJlbnRVc2VyQWN0aW9uKCkge1xuICBjb25zdCBzZXNzaW9uID0gYXdhaXQgZ2V0U2VydmVyU2Vzc2lvbihhdXRoT3B0aW9ucyk7XG4gIHJldHVybiBzZXNzaW9uPy51c2VyID8/IG51bGw7XG59XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6ImlUQVVzQiwrTEFBQSJ9
}),
"[project]/paddy/paddy-tms/src/services/truckReceptionService.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TruckReceptionService",
    ()=>TruckReceptionService,
    "truckReceptionService",
    ()=>truckReceptionService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$localStorage$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/services/localStorage.service.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$actions$2f$data$3a$799b9f__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/actions/data:799b9f [app-client] (ecmascript) <text/javascript>");
'use client';
;
;
const API_URL = ("TURBOPACK compile-time value", "http://localhost:3000/api/v1") || 'http://localhost:3000/api/v1';
class TruckReceptionService {
    /**
   * Crear recepción con peso bruto y asignar turno
   */ async createWithGrossWeight(payload) {
        try {
            // Obtener el token del servidor usando Server Action
            const token = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$actions$2f$data$3a$799b9f__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["getAuthTokenAction"])();
            // Crear en el backend
            const headers = {
                'Content-Type': 'application/json'
            };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            const response = await fetch(`${API_URL}/logistics/truck-receptions/with-gross-weight`, {
                method: 'POST',
                headers,
                credentials: 'include',
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            const result = await response.json();
            const truck = result.data;
            // Guardar en localStorage
            __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$localStorage$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["localStorageService"].saveTruckReception(truck);
            // Agregar a sesión de turnos
            const today = new Date();
            __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$localStorage$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["localStorageService"].addTurno(today, {
                numero: truck.numero_turno,
                truck_id: truck.id,
                status: truck.status,
                patente: truck.license_plate
            });
            // Agregar a cola de sincronización como respaldo
            __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$localStorage$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["localStorageService"].addToSyncQueue('create', truck, truck.id);
            return truck;
        } catch (error) {
            console.error('Error creando recepción:', error);
            // Fallback: crear localmente si falla el backend
            const today = new Date();
            const nextTurno = __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$localStorage$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["localStorageService"].getNextTurno(today);
            const localTruck = {
                id: Date.now(),
                numero_turno: nextTurno,
                status: 'ESPERA',
                ...payload,
                entry_at: new Date()
            };
            // Guardar localmente
            __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$localStorage$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["localStorageService"].saveTruckReception(localTruck);
            __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$localStorage$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["localStorageService"].addTurno(today, {
                numero: nextTurno,
                truck_id: localTruck.id,
                status: 'ESPERA',
                patente: localTruck.license_plate
            });
            // Agregar a cola de sincronización
            __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$localStorage$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["localStorageService"].addToSyncQueue('create', localTruck, localTruck.id);
            return localTruck;
        }
    }
    /**
   * Registrar peso tara y finalizar recepción
   */ async recordTareWeight(payload) {
        try {
            // Obtener el token del servidor usando Server Action
            const token = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$actions$2f$data$3a$799b9f__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["getAuthTokenAction"])();
            // Registrar en backend
            const headers = {
                'Content-Type': 'application/json'
            };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            const response = await fetch(`${API_URL}/logistics/weighings/tare`, {
                method: 'POST',
                headers,
                credentials: 'include',
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            const result = await response.json();
            const truck = result.data;
            // Actualizar en localStorage
            __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$localStorage$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["localStorageService"].saveTruckReception(truck);
            // Actualizar sesión de turnos
            const today = new Date();
            __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$localStorage$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["localStorageService"].updateTurno(today, truck.numero_turno, 'FINISHED');
            // Agregar a cola de sincronización
            __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$localStorage$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["localStorageService"].addToSyncQueue('update', truck, truck.id);
            return truck;
        } catch (error) {
            console.error('Error registrando peso tara:', error);
            // Fallback: actualizar localmente
            const cache = __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$localStorage$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["localStorageService"].getTruckReceptionsCache();
            const truck = cache[payload.truck_reception_id];
            if (truck) {
                truck.tare_weight = payload.tare_weight;
                truck.net_weight = truck.gross_weight - payload.tare_weight;
                truck.status = 'FINISHED';
                truck.finished_at = new Date();
                __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$localStorage$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["localStorageService"].saveTruckReception(truck);
                const today = new Date();
                __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$localStorage$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["localStorageService"].updateTurno(today, truck.numero_turno, 'FINISHED');
                __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$localStorage$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["localStorageService"].addToSyncQueue('update', truck, truck.id);
                return truck;
            }
            throw error;
        }
    }
    /**
   * Obtener próximo turno para hoy
   */ async getNextTurnoForToday() {
        try {
            // Obtener el token del servidor usando Server Action
            const token = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$actions$2f$data$3a$799b9f__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["getAuthTokenAction"])();
            const headers = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            const response = await fetch(`${API_URL}/logistics/turnos/next-today`, {
                headers,
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            const result = await response.json();
            return result.data.numero_turno;
        } catch (error) {
            console.warn('Error obteniendo turno del backend, usando local:', error);
            // Fallback a localStorage
            const today = new Date();
            return __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$localStorage$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["localStorageService"].getNextTurno(today);
        }
    }
    /**
   * Obtener todos los turnos de hoy
   */ async getTurnosToday() {
        try {
            // Obtener el token del servidor usando Server Action
            const token = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$actions$2f$data$3a$799b9f__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["getAuthTokenAction"])();
            const headers = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            const response = await fetch(`${API_URL}/logistics/turnos/today`, {
                headers,
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            const result = await response.json();
            // Asegurar que result.data es un array
            if (!Array.isArray(result.data)) {
                console.warn('Backend response data is not an array:', result.data);
                throw new Error('Invalid response format from backend');
            }
            const trucks = result.data;
            // Actualizar cache local
            trucks.forEach((truck)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$localStorage$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["localStorageService"].saveTruckReception(truck);
            });
            return trucks;
        } catch (error) {
            console.warn('Error obteniendo turnos del backend, usando cache local:', error);
            // Fallback a localStorage
            const today = new Date();
            const session = __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$localStorage$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["localStorageService"].getTurnoSession(today);
            if (!session) {
                return [];
            }
            const cache = __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$localStorage$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["localStorageService"].getTruckReceptionsCache();
            return session.turnos.map((turno)=>cache[turno.truck_id]).filter(Boolean);
        }
    }
    /**
   * Obtener recepción por ID
   */ async getTruckReceptionById(id) {
        // Primero intenta desde cache local
        const cache = __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$localStorage$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["localStorageService"].getTruckReceptionsCache();
        if (cache[id]) {
            return cache[id];
        }
        try {
            // Obtener el token del servidor usando Server Action
            const token = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$actions$2f$data$3a$799b9f__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["getAuthTokenAction"])();
            const headers = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            const response = await fetch(`${API_URL}/logistics/truck-receptions/${id}`, {
                headers,
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            const result = await response.json();
            const truck = result.data;
            // Guardar en cache
            __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$localStorage$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["localStorageService"].saveTruckReception(truck);
            return truck;
        } catch (error) {
            console.warn('Error obteniendo recepción del backend:', error);
            return null;
        }
    }
    /**
   * Sincronizar cola pendiente con backend
   */ async syncPendingQueue() {
        const queue = __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$localStorage$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["localStorageService"].getSyncQueue();
        if (queue.length === 0) {
            return true;
        }
        // Obtener el token una sola vez usando Server Action
        const token = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$actions$2f$data$3a$799b9f__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["getAuthTokenAction"])();
        const headers = {
            'Content-Type': 'application/json'
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        let successCount = 0;
        for(let i = 0; i < queue.length; i++){
            const item = queue[i];
            try {
                if (item.action === 'create') {
                    const response = await fetch(`${API_URL}/logistics/truck-receptions/with-gross-weight`, {
                        method: 'POST',
                        headers,
                        credentials: 'include',
                        body: JSON.stringify(item.data)
                    });
                    if (response.ok) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$localStorage$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["localStorageService"].removeFromSyncQueue(i - successCount);
                        successCount++;
                    }
                } else if (item.action === 'update') {
                    // Actualizar peso tara
                    if (item.data.tare_weight) {
                        const response = await fetch(`${API_URL}/logistics/weighings/tare`, {
                            method: 'POST',
                            headers,
                            credentials: 'include',
                            body: JSON.stringify({
                                truck_reception_id: item.id,
                                tare_weight: item.data.tare_weight
                            })
                        });
                        if (response.ok) {
                            __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$localStorage$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["localStorageService"].removeFromSyncQueue(i - successCount);
                            successCount++;
                        }
                    }
                }
            } catch (error) {
                console.warn(`Error sincronizando item ${i}:`, error);
            }
        }
        return successCount === queue.length;
    }
}
const truckReceptionService = new TruckReceptionService();
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
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
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$truckReceptionService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/services/truckReceptionService.ts [app-client] (ecmascript)");
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
                const turnos = await __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$truckReceptionService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["truckReceptionService"].getTurnosToday();
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
                        const success = await __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$truckReceptionService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["truckReceptionService"].syncPendingQueue();
                        setSyncStatus(success ? 'synced' : 'error');
                        if (success) {
                            await loadTrucksToday();
                        }
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
"[project]/paddy/paddy-tms/src/shared/components/ui/TextField/TextField.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TextField",
    ()=>TextField
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
const TextField = ({ id, label, labelAlwaysVisible = false, value, onChange, onKeyDown, onFocus, onBlur, selectAllOnFocus = false, compact = false, type = "text", name, placeholder, startIcon, startAdornment, endIcon, className = "", variante = "normal", rows, required = false, readOnly = false, disabled = false, labelStyle, placeholderColor, currencySymbol = "$", allowDecimalComma = false, currencyField, currencies, phonePrefix, allowLetters = false, passwordVisibilityToggle = true, autoComplete, ...props })=>{
    _s();
    const [focused, setFocused] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const inputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [showPassword, setShowPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [currencyRawValue, setCurrencyRawValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(value);
    const passwordToggleLabel = showPassword ? "Ocultar contraseña" : "Mostrar contraseña";
    // Sincronizar currencyRawValue con value cuando este cambie externamente
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
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
    // Función para formatear DNI chileno
    const formatDNI = (value)=>{
        // Remover todo lo que no sea número o 'k'/'K'
        let cleanValue = value.replace(/[^0-9kK]/g, '');
        // Convertir 'K' a minúscula
        cleanValue = cleanValue.toLowerCase();
        if (cleanValue.length === 0) return '';
        if (cleanValue.length === 1) return cleanValue;
        // Formatos específicos para DNI chileno:
        // • XX.XXX.XXX-X (9 dígitos: 8 números + 1 dígito verificador)
        // • X.XXX.XXX-X (8 dígitos: 7 números + 1 dígito verificador) 
        // • XX.XXX.XXX-k (8 dígitos + k: 8 números + 'k')
        // • X.XXX.XXX-k (7 dígitos + k: 7 números + 'k')
        if (cleanValue.length === 9 && !cleanValue.includes('k')) {
            // XX.XXX.XXX-X (8 dígitos + 1 DV)
            const numbers = cleanValue.slice(0, 8);
            const dv = cleanValue.slice(8);
            return numbers.slice(0, 2) + '.' + numbers.slice(2, 5) + '.' + numbers.slice(5) + '-' + dv;
        } else if (cleanValue.length === 8 && !cleanValue.includes('k')) {
            // X.XXX.XXX-X (7 dígitos + 1 DV)
            const numbers = cleanValue.slice(0, 7);
            const dv = cleanValue.slice(7);
            return numbers.slice(0, 1) + '.' + numbers.slice(1, 4) + '.' + numbers.slice(4) + '-' + dv;
        } else if (cleanValue.length === 9 && cleanValue.endsWith('k')) {
            // XX.XXX.XXX-k (8 dígitos + 'k')
            const numbers = cleanValue.slice(0, 8);
            return numbers.slice(0, 2) + '.' + numbers.slice(2, 5) + '.' + numbers.slice(5) + '-k';
        } else if (cleanValue.length === 8 && cleanValue.endsWith('k')) {
            // X.XXX.XXX-k (7 dígitos + 'k')
            const numbers = cleanValue.slice(0, 7);
            return numbers.slice(0, 1) + '.' + numbers.slice(1, 4) + '.' + numbers.slice(4) + '-k';
        } else {
            // Para otras longitudes, devolver sin formato especial
            return cleanValue;
        }
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
        const formattedValue = formatDNI(rawValue);
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
    const [showPlaceholder, setShowPlaceholder] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(shouldAlwaysShowLabel ? false : !shrink);
    const compactInputClasses = compact ? 'px-2.5 py-1.5 text-xs font-normal' : '';
    const compactLabelClasses = compact ? 'left-2.5 -top-1 text-[10px]' : 'left-3 -top-1 text-xs';
    const compactPlaceholderClasses = compact ? 'text-xs font-normal' : 'text-sm font-medium';
    const computedPlaceholder = type === "datePicker" ? `Ej: ${new Date().getFullYear()}` : shouldAlwaysShowLabel ? placeholder ?? "" : required ? "" : shrink || !showPlaceholder ? "" : placeholder ?? label;
    // Unique class for placeholder styling when placeholderColor is provided
    const placeholderClassRef = __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useRef(null);
    if (placeholderColor && !placeholderClassRef.current) {
        placeholderClassRef.current = `tf-ph-${Math.random().toString(36).slice(2, 9)}`;
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
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
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: compact || variante === "autocomplete" ? "relative w-full" : "input-container",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: `relative ${className}`,
            "data-test-id": "text-field-root",
            children: [
                typeof startIcon === 'string' && startIcon.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                    lineNumber: 409,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                startIcon === undefined && startAdornment && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                    lineNumber: 418,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                isTextArea ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
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
                    lineNumber: 426,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                            lineNumber: 451,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        type === "password" && passwordVisibilityToggle && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                                lineNumber: 496,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/TextField/TextField.tsx",
                            lineNumber: 478,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/TextField/TextField.tsx",
                    lineNumber: 450,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                required && !shrink && showPlaceholder && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-red-500 ml-1",
                            children: "*"
                        }, void 0, false, {
                            fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/TextField/TextField.tsx",
                            lineNumber: 521,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/TextField/TextField.tsx",
                    lineNumber: 509,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                placeholderColor && placeholderClassRef.current && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                    children: `input.${placeholderClassRef.current}::placeholder, textarea.${placeholderClassRef.current}::placeholder { color: ${placeholderColor} }`
                }, void 0, false, {
                    fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/TextField/TextField.tsx",
                    lineNumber: 526,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                    children: `
        textarea::placeholder {
          line-height: 1.5rem;
          text-align: left;
          color: ${placeholderColor || 'var(--color-muted)'};
        }
      `
                }, void 0, false, {
                    fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/TextField/TextField.tsx",
                    lineNumber: 528,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                    className: `absolute pointer-events-none transition-all duration-300 ease-in-out px-1 font-medium text-foreground rounded-md bg-background ${compactLabelClasses}` + (shrink ? " -translate-y-1 scale-90 opacity-100" : " opacity-0"),
                    onClick: ()=>inputRef.current?.focus(),
                    "data-test-id": "text-field-label",
                    children: [
                        label,
                        required && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-red-500 ml-1",
                            children: "*"
                        }, void 0, false, {
                            fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/TextField/TextField.tsx",
                            lineNumber: 542,
                            columnNumber: 22
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/TextField/TextField.tsx",
                    lineNumber: 535,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
                typeof endIcon === 'string' && endIcon.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                    lineNumber: 545,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/TextField/TextField.tsx",
            lineNumber: 407,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/TextField/TextField.tsx",
        lineNumber: 406,
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
"[project]/paddy/paddy-tms/src/shared/components/ui/DropdownList/DropdownList.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "dropdownOptionClass",
    ()=>dropdownOptionClass
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
const dropdownOptionClass = "dropdown-option";
const DropdownList = ({ open, children, className = "", style, testId, dropUp = false, highlightedIndex = -1, onHoverChange, anchorRef, usePortal = false })=>{
    _s();
    const [hoveredIndex, setHoveredIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(-1);
    const [position, setPosition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const dropdownRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Handle client-side mounting for portal
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DropdownList.useEffect": ()=>{
            setMounted(true);
        }
    }["DropdownList.useEffect"], []);
    // Calculate position when using portal mode
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
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
    const childrenArray = __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Children.toArray(children);
    const childrenWithHover = children ? childrenArray.map((child, idx)=>{
        if (/*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].isValidElement(child)) {
            const currentClassName = child.props.className || '';
            const hoverClass = highlightedIndex === idx ? 'bg-secondary-30' : hoveredIndex === idx ? 'bg-secondary-20' : '';
            // Get total children count for first/last detection
            const isFirst = idx === 0;
            const isLast = idx === childrenArray.length - 1;
            const roundedClass = isFirst ? 'rounded-t' : isLast ? 'rounded-b' : '';
            return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].cloneElement(child, {
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
    const dropdownElement = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
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
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPortal"])(dropdownElement, document.body);
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
"[project]/paddy/paddy-tms/src/shared/components/ui/IconButton/IconButton.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "button",
        className: `${variantClasses[variant] || variantClasses["containedPrimary"]} ${disabledClass} ${className} ${sizeClass}`,
        "data-test-id": "icon-button-root",
        onClick: onClick,
        "aria-label": ariaLabel,
        disabled: effectiveDisabled,
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
_c = IconButton;
const __TURBOPACK__default__export__ = IconButton;
var _c;
__turbopack_context__.k.register(_c, "IconButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/paddy/paddy-tms/src/shared/components/ui/AutoComplete/AutoComplete.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$DropdownList$2f$DropdownList$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/shared/components/ui/DropdownList/DropdownList.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$IconButton$2f$IconButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/shared/components/ui/IconButton/IconButton.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$TextField$2f$TextField$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/shared/components/ui/TextField/TextField.tsx [app-client] (ecmascript)");
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
    const [highlightedIndex, setHighlightedIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(-1);
    const [inputValue, setInputValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(value ? getLabel(value) : "");
    const [focused, setFocused] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isNavigating, setIsNavigating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [validationTriggered, setValidationTriggered] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const inputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const disabled = props.disabled;
    // Buscar y vincular el input interno del TextField al ref externo
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
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
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
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
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
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
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
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
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "autocomplete-container",
        ref: containerRef,
        "data-test-id": props["data-test-id"] || "auto-complete-root",
        "data-has-options": options.length > 0 ? "true" : "false",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$TextField$2f$TextField$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextField"], {
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
                    value && !disabled && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$IconButton$2f$IconButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
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
                    !disabled && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$IconButton$2f$IconButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$DropdownList$2f$DropdownList$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
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
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        ref: (el)=>{
                            if (el) itemRefs.set(optValue, el);
                            else itemRefs.delete(optValue);
                        },
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$DropdownList$2f$DropdownList$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dropdownOptionClass"],
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
_s(AutoComplete, "3TLqUzccZz8wHFIXrqWyU+I17UA=");
_c = AutoComplete;
const __TURBOPACK__default__export__ = AutoComplete;
var _c;
__turbopack_context__.k.register(_c, "AutoComplete");
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
"[project]/paddy/paddy-tms/src/actions/data:f47add [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fetchProducersAction",
    ()=>$$RSC_SERVER_ACTION_0
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
/* __next_internal_action_entry_do_not_use__ [{"40943fe0fc99eb8d9cea89841d7ec7102a5dd85eac":"fetchProducersAction"},"paddy/paddy-tms/src/actions/fetchProducersAction.ts",""] */ "use turbopack no side effects";
;
const $$RSC_SERVER_ACTION_0 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("40943fe0fc99eb8d9cea89841d7ec7102a5dd85eac", __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "fetchProducersAction");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
 //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vZmV0Y2hQcm9kdWNlcnNBY3Rpb24udHMiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzZXJ2ZXInO1xuXG5pbXBvcnQgeyBnZXRTZXJ2ZXJTZXNzaW9uIH0gZnJvbSAnbmV4dC1hdXRoJztcbmltcG9ydCB7IGF1dGhPcHRpb25zIH0gZnJvbSAnQC9saWIvYXV0aC5jb25maWcnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFByb2R1Y2VyT3B0aW9uIHtcbiAgaWQ6IG51bWJlcjtcbiAgbmFtZTogc3RyaW5nO1xuICBydXQ6IHN0cmluZztcbiAgZW1haWw/OiBzdHJpbmc7XG4gIGNpdHk/OiBzdHJpbmc7XG59XG5cbmludGVyZmFjZSBGZXRjaFByb2R1Y2Vyc1BhcmFtcyB7XG4gIHBhZ2U/OiBudW1iZXI7XG4gIGxpbWl0PzogbnVtYmVyO1xuICBzZWFyY2g/OiBzdHJpbmc7XG4gIHNvcnRGaWVsZD86IHN0cmluZztcbiAgc29ydD86ICdBU0MnIHwgJ0RFU0MnO1xufVxuXG5pbnRlcmZhY2UgRmV0Y2hQcm9kdWNlcnNSZXN1bHQge1xuICBkYXRhOiBQcm9kdWNlck9wdGlvbltdO1xuICB0b3RhbDogbnVtYmVyO1xuICBwYWdlOiBudW1iZXI7XG4gIGxpbWl0OiBudW1iZXI7XG59XG5cbi8qKlxuICogU2VydmVyIGFjdGlvbiBwYXJhIGNhcmdhciBwcm9kdWN0b3JlcyBkZXNkZSBlbCBiYWNrZW5kXG4gKiBTaW1pbGFyIGEgZmV0Y2hQcm9kdWNlcnNBY3Rpb24gZGVsIGZyb250ZW5kIHByaW5jaXBhbFxuICogVXRpbGl6YSBOZXh0QXV0aCBwYXJhIG9idGVuZXIgZWwgdG9rZW4gZGVsIHNlcnZpZG9yXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmZXRjaFByb2R1Y2Vyc0FjdGlvbihcbiAgcGFyYW1zPzogRmV0Y2hQcm9kdWNlcnNQYXJhbXMsXG4pOiBQcm9taXNlPEZldGNoUHJvZHVjZXJzUmVzdWx0PiB7XG4gIHRyeSB7XG4gICAgLy8gT2J0ZW5lciBsYSBzZXNpw7NuIGRlbCBzZXJ2aWRvciB1c2FuZG8gTmV4dEF1dGhcbiAgICBjb25zdCBzZXNzaW9uID0gYXdhaXQgZ2V0U2VydmVyU2Vzc2lvbihhdXRoT3B0aW9ucyk7XG4gICAgXG4gICAgaWYgKCFzZXNzaW9uPy51c2VyPy5hY2Nlc3NUb2tlbikge1xuICAgICAgY29uc29sZS53YXJuKCdObyBhY2Nlc3MgdG9rZW4gYXZhaWxhYmxlIGluIHNlcnZlciBzZXNzaW9uJyk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBkYXRhOiBbXSxcbiAgICAgICAgdG90YWw6IDAsXG4gICAgICAgIHBhZ2U6IDEsXG4gICAgICAgIGxpbWl0OiAxMCxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgY29uc3QgQVBJX0JBU0VfVVJMID0gYCR7cHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfQVBJX1VSTH0vcHJvZHVjZXJzYDtcblxuICAgIGNvbnN0IGhlYWRlcnM6IEhlYWRlcnNJbml0ID0ge1xuICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICdBdXRob3JpemF0aW9uJzogYEJlYXJlciAke3Nlc3Npb24udXNlci5hY2Nlc3NUb2tlbn1gLFxuICAgIH07XG5cbiAgICAvLyBGZXRjaCBkZXNkZSBlbCBiYWNrZW5kXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChBUElfQkFTRV9VUkwsIHtcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICBoZWFkZXJzLFxuICAgICAgY2FjaGU6ICduby1zdG9yZScsXG4gICAgfSk7XG5cbiAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEhUVFAgJHtyZXNwb25zZS5zdGF0dXN9OiAke3Jlc3BvbnNlLnN0YXR1c1RleHR9YCk7XG4gICAgfVxuXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuXG4gICAgLy8gTm9ybWFsaXphciBkYXRvc1xuICAgIGNvbnN0IG5vcm1hbGl6ZWREYXRhID0gKHJlc3VsdC5kYXRhIHx8IHJlc3VsdCB8fCBbXSkubWFwKChwcm9kdWNlcjogYW55KSA9PiAoe1xuICAgICAgaWQ6IHByb2R1Y2VyLmlkLFxuICAgICAgbmFtZTogcHJvZHVjZXIubmFtZSB8fCAnJyxcbiAgICAgIHJ1dDogcHJvZHVjZXIucnV0IHx8ICcnLFxuICAgICAgZW1haWw6IHByb2R1Y2VyLmVtYWlsLFxuICAgICAgY2l0eTogcHJvZHVjZXIuY2l0eSxcbiAgICB9KSk7XG5cbiAgICAvLyBGaWx0cmFkbyBlbiBjbGllbnRlXG4gICAgbGV0IGZpbHRlcmVkID0gbm9ybWFsaXplZERhdGE7XG5cbiAgICBpZiAocGFyYW1zPy5zZWFyY2gpIHtcbiAgICAgIGNvbnN0IHNlYXJjaExvd2VyID0gcGFyYW1zLnNlYXJjaC50b0xvd2VyQ2FzZSgpO1xuICAgICAgZmlsdGVyZWQgPSBmaWx0ZXJlZC5maWx0ZXIoKHA6IFByb2R1Y2VyT3B0aW9uKSA9PlxuICAgICAgICBwLm5hbWUudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhzZWFyY2hMb3dlcikgfHxcbiAgICAgICAgcC5ydXQudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhzZWFyY2hMb3dlcikgfHxcbiAgICAgICAgcC5lbWFpbD8udG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhzZWFyY2hMb3dlcikgfHxcbiAgICAgICAgcC5jaXR5Py50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHNlYXJjaExvd2VyKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBPcmRlbmFtaWVudG9cbiAgICBpZiAocGFyYW1zPy5zb3J0RmllbGQpIHtcbiAgICAgIGNvbnN0IGZpZWxkID0gcGFyYW1zLnNvcnRGaWVsZCBhcyBrZXlvZiBQcm9kdWNlck9wdGlvbjtcbiAgICAgIGNvbnN0IGlzQXNjID0gcGFyYW1zLnNvcnQgPT09ICdBU0MnO1xuICAgICAgZmlsdGVyZWQuc29ydCgoYTogUHJvZHVjZXJPcHRpb24sIGI6IFByb2R1Y2VyT3B0aW9uKSA9PiB7XG4gICAgICAgIGNvbnN0IGFWYWwgPSBhW2ZpZWxkXSB8fCAnJztcbiAgICAgICAgY29uc3QgYlZhbCA9IGJbZmllbGRdIHx8ICcnO1xuICAgICAgICBjb25zdCBjb21wYXJpc29uID0gU3RyaW5nKGFWYWwpLmxvY2FsZUNvbXBhcmUoU3RyaW5nKGJWYWwpLCAnZXMnKTtcbiAgICAgICAgcmV0dXJuIGlzQXNjID8gY29tcGFyaXNvbiA6IC1jb21wYXJpc29uO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gUGFnaW5hY2nDs25cbiAgICBjb25zdCBwYWdlID0gcGFyYW1zPy5wYWdlIHx8IDE7XG4gICAgY29uc3QgbGltaXQgPSBwYXJhbXM/LmxpbWl0IHx8IDEwO1xuICAgIGNvbnN0IHN0YXJ0ID0gKHBhZ2UgLSAxKSAqIGxpbWl0O1xuICAgIGNvbnN0IHBhZ2luYXRlZERhdGEgPSBmaWx0ZXJlZC5zbGljZShzdGFydCwgc3RhcnQgKyBsaW1pdCk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgZGF0YTogcGFnaW5hdGVkRGF0YSxcbiAgICAgIHRvdGFsOiBmaWx0ZXJlZC5sZW5ndGgsXG4gICAgICBwYWdlLFxuICAgICAgbGltaXQsXG4gICAgfTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdFcnJvciBlbiBmZXRjaFByb2R1Y2Vyc0FjdGlvbjonLCBlcnJvcik7XG4gICAgcmV0dXJuIHtcbiAgICAgIGRhdGE6IFtdLFxuICAgICAgdG90YWw6IDAsXG4gICAgICBwYWdlOiAxLFxuICAgICAgbGltaXQ6IDEwLFxuICAgIH07XG4gIH1cbn1cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiNFRBaUNzQixpTUFBQSJ9
}),
"[project]/paddy/paddy-tms/src/actions/data:77806a [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createTruckReceptionAction",
    ()=>$$RSC_SERVER_ACTION_0
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
/* __next_internal_action_entry_do_not_use__ [{"4050d7ab117902baaf6257f90e6439786adcc08baa":"createTruckReceptionAction"},"paddy/paddy-tms/src/actions/truckReceptionActions.ts",""] */ "use turbopack no side effects";
;
const $$RSC_SERVER_ACTION_0 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("4050d7ab117902baaf6257f90e6439786adcc08baa", __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "createTruckReceptionAction");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
 //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vdHJ1Y2tSZWNlcHRpb25BY3Rpb25zLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc2VydmVyJztcblxuaW1wb3J0IHsgZ2V0U2VydmVyU2Vzc2lvbiB9IGZyb20gJ25leHQtYXV0aCc7XG5pbXBvcnQgeyBhdXRoT3B0aW9ucyB9IGZyb20gJ0AvbGliL2F1dGguY29uZmlnJztcblxuY29uc3QgQVBJX1VSTCA9IHByb2Nlc3MuZW52Lk5FWFRfUFVCTElDX0FQSV9VUkwgfHwgJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9hcGkvdjEnO1xuXG5leHBvcnQgaW50ZXJmYWNlIENyZWF0ZVRydWNrV2l0aEdyb3NzV2VpZ2h0UGF5bG9hZCB7XG4gIHByb2R1Y2VyX2lkOiBudW1iZXI7XG4gIGxpY2Vuc2VfcGxhdGU6IHN0cmluZztcbiAgZHJpdmVyX25hbWU6IHN0cmluZztcbiAgY2Fycmllcl9jb21wYW55Pzogc3RyaW5nO1xuICBkaXNwYXRjaF9ndWlkZT86IHN0cmluZztcbiAgZ3Jvc3Nfd2VpZ2h0OiBudW1iZXI7XG4gIGNyZWF0ZWRfYnk/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmVnaXN0ZXJUYXJlV2VpZ2h0UGF5bG9hZCB7XG4gIHRydWNrX3JlY2VwdGlvbl9pZDogbnVtYmVyO1xuICB0YXJlX3dlaWdodDogbnVtYmVyO1xuICBjcmVhdGVkX2J5Pzogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFRydWNrUmVjZXB0aW9uIHtcbiAgaWQ6IG51bWJlcjtcbiAgbnVtZXJvX3R1cm5vOiBudW1iZXI7XG4gIHN0YXR1czogJ0VTUEVSQScgfCAnRklOSVNIRUQnO1xuICBwcm9kdWNlcl9pZDogbnVtYmVyO1xuICBsaWNlbnNlX3BsYXRlOiBzdHJpbmc7XG4gIGRyaXZlcl9uYW1lOiBzdHJpbmc7XG4gIGNhcnJpZXJfY29tcGFueT86IHN0cmluZztcbiAgZGlzcGF0Y2hfZ3VpZGU/OiBzdHJpbmc7XG4gIGdyb3NzX3dlaWdodD86IG51bWJlcjtcbiAgdGFyZV93ZWlnaHQ/OiBudW1iZXI7XG4gIG5ldF93ZWlnaHQ/OiBudW1iZXI7XG4gIGVudHJ5X2F0OiBEYXRlO1xuICBmaW5pc2hlZF9hdD86IERhdGU7XG4gIGNyZWF0ZWRfYnk/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogU2VydmVyIGFjdGlvbiBwYXJhIGNyZWFyIHJlY2VwY2nDs24gY29uIHBlc28gYnJ1dG9cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZVRydWNrUmVjZXB0aW9uQWN0aW9uKFxuICBwYXlsb2FkOiBDcmVhdGVUcnVja1dpdGhHcm9zc1dlaWdodFBheWxvYWQsXG4pOiBQcm9taXNlPFRydWNrUmVjZXB0aW9uPiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IGdldFNlcnZlclNlc3Npb24oYXV0aE9wdGlvbnMpO1xuXG4gICAgaWYgKCFzZXNzaW9uPy51c2VyPy5hY2Nlc3NUb2tlbikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBhdXRlbnRpY2FkbycpO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXG4gICAgICBgJHtBUElfVVJMfS9sb2dpc3RpY3MvdHJ1Y2stcmVjZXB0aW9ucy93aXRoLWdyb3NzLXdlaWdodGAsXG4gICAgICB7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgICBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7c2Vzc2lvbi51c2VyLmFjY2Vzc1Rva2VufWAsXG4gICAgICAgIH0sXG4gICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHBheWxvYWQpLFxuICAgICAgfSxcbiAgICApO1xuXG4gICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBIVFRQICR7cmVzcG9uc2Uuc3RhdHVzfTogJHtyZXNwb25zZS5zdGF0dXNUZXh0fWApO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICByZXR1cm4gcmVzdWx0LmRhdGEgYXMgVHJ1Y2tSZWNlcHRpb247XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcignRXJyb3IgY3JlYW5kbyByZWNlcGNpw7NuOicsIGVycm9yKTtcbiAgICB0aHJvdyBlcnJvcjtcbiAgfVxufVxuXG4vKipcbiAqIFNlcnZlciBhY3Rpb24gcGFyYSByZWdpc3RyYXIgcGVzbyB0YXJhXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZWNvcmRUYXJlV2VpZ2h0QWN0aW9uKFxuICBwYXlsb2FkOiBSZWdpc3RlclRhcmVXZWlnaHRQYXlsb2FkLFxuKTogUHJvbWlzZTxUcnVja1JlY2VwdGlvbj4ge1xuICB0cnkge1xuICAgIGNvbnN0IHNlc3Npb24gPSBhd2FpdCBnZXRTZXJ2ZXJTZXNzaW9uKGF1dGhPcHRpb25zKTtcblxuICAgIGlmICghc2Vzc2lvbj8udXNlcj8uYWNjZXNzVG9rZW4pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTm8gYXV0ZW50aWNhZG8nKTtcbiAgICB9XG5cbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAke0FQSV9VUkx9L2xvZ2lzdGljcy93ZWlnaGluZ3MvdGFyZWAsIHtcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgaGVhZGVyczoge1xuICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7c2Vzc2lvbi51c2VyLmFjY2Vzc1Rva2VufWAsXG4gICAgICB9LFxuICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkocGF5bG9hZCksXG4gICAgfSk7XG5cbiAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEhUVFAgJHtyZXNwb25zZS5zdGF0dXN9OiAke3Jlc3BvbnNlLnN0YXR1c1RleHR9YCk7XG4gICAgfVxuXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgIHJldHVybiByZXN1bHQuZGF0YSBhcyBUcnVja1JlY2VwdGlvbjtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdFcnJvciByZWdpc3RyYW5kbyBwZXNvIHRhcmE6JywgZXJyb3IpO1xuICAgIHRocm93IGVycm9yO1xuICB9XG59XG5cbi8qKlxuICogU2VydmVyIGFjdGlvbiBwYXJhIG9idGVuZXIgcHLDs3hpbW8gdHVybm9cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldE5leHRUdXJub0FjdGlvbigpOiBQcm9taXNlPG51bWJlcj4ge1xuICB0cnkge1xuICAgIGNvbnN0IHNlc3Npb24gPSBhd2FpdCBnZXRTZXJ2ZXJTZXNzaW9uKGF1dGhPcHRpb25zKTtcblxuICAgIGlmICghc2Vzc2lvbj8udXNlcj8uYWNjZXNzVG9rZW4pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTm8gYXV0ZW50aWNhZG8nKTtcbiAgICB9XG5cbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAke0FQSV9VUkx9L2xvZ2lzdGljcy90dXJub3MvbmV4dC10b2RheWAsIHtcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgQXV0aG9yaXphdGlvbjogYEJlYXJlciAke3Nlc3Npb24udXNlci5hY2Nlc3NUb2tlbn1gLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgSFRUUCAke3Jlc3BvbnNlLnN0YXR1c31gKTtcbiAgICB9XG5cbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgcmV0dXJuIHJlc3VsdC5kYXRhLm51bWVyb190dXJubztcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdFcnJvciBvYnRlbmllbmRvIHR1cm5vOicsIGVycm9yKTtcbiAgICB0aHJvdyBlcnJvcjtcbiAgfVxufVxuXG4vKipcbiAqIFNlcnZlciBhY3Rpb24gcGFyYSBvYnRlbmVyIHR1cm5vcyBkZSBob3lcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFR1cm5vc1RvZGF5QWN0aW9uKCk6IFByb21pc2U8VHJ1Y2tSZWNlcHRpb25bXT4ge1xuICB0cnkge1xuICAgIGNvbnN0IHNlc3Npb24gPSBhd2FpdCBnZXRTZXJ2ZXJTZXNzaW9uKGF1dGhPcHRpb25zKTtcblxuICAgIGlmICghc2Vzc2lvbj8udXNlcj8uYWNjZXNzVG9rZW4pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTm8gYXV0ZW50aWNhZG8nKTtcbiAgICB9XG5cbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAke0FQSV9VUkx9L2xvZ2lzdGljcy90dXJub3MvdG9kYXlgLCB7XG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgIEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHtzZXNzaW9uLnVzZXIuYWNjZXNzVG9rZW59YCxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEhUVFAgJHtyZXNwb25zZS5zdGF0dXN9YCk7XG4gICAgfVxuXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuXG4gICAgaWYgKCFBcnJheS5pc0FycmF5KHJlc3VsdC5kYXRhKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHJlc3BvbnNlIGZvcm1hdCBmcm9tIGJhY2tlbmQnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0LmRhdGEgYXMgVHJ1Y2tSZWNlcHRpb25bXTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdFcnJvciBvYnRlbmllbmRvIHR1cm5vczonLCBlcnJvcik7XG4gICAgdGhyb3cgZXJyb3I7XG4gIH1cbn1cblxuLyoqXG4gKiBTZXJ2ZXIgYWN0aW9uIHBhcmEgb2J0ZW5lciByZWNlcGNpw7NuIHBvciBJRFxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0VHJ1Y2tSZWNlcHRpb25CeUlkQWN0aW9uKGlkOiBudW1iZXIpOiBQcm9taXNlPFRydWNrUmVjZXB0aW9uIHwgbnVsbD4ge1xuICB0cnkge1xuICAgIGNvbnN0IHNlc3Npb24gPSBhd2FpdCBnZXRTZXJ2ZXJTZXNzaW9uKGF1dGhPcHRpb25zKTtcblxuICAgIGlmICghc2Vzc2lvbj8udXNlcj8uYWNjZXNzVG9rZW4pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTm8gYXV0ZW50aWNhZG8nKTtcbiAgICB9XG5cbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAke0FQSV9VUkx9L2xvZ2lzdGljcy90cnVjay1yZWNlcHRpb25zLyR7aWR9YCwge1xuICAgICAgaGVhZGVyczoge1xuICAgICAgICBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7c2Vzc2lvbi51c2VyLmFjY2Vzc1Rva2VufWAsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBIVFRQICR7cmVzcG9uc2Uuc3RhdHVzfWApO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICByZXR1cm4gcmVzdWx0LmRhdGEgYXMgVHJ1Y2tSZWNlcHRpb247XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcignRXJyb3Igb2J0ZW5pZW5kbyByZWNlcGNpw7NuOicsIGVycm9yKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJtVUEyQ3NCLHVNQUFBIn0=
}),
"[project]/paddy/paddy-tms/src/hooks/useWeighingPage.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$providers$2f$WeighingPageProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/providers/WeighingPageProvider.tsx [app-client] (ecmascript)");
'use client';
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/paddy/paddy-tms/src/components/weighing/NewTruckReceptionForm.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NewTruckReceptionForm",
    ()=>NewTruckReceptionForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$TextField$2f$TextField$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/shared/components/ui/TextField/TextField.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$AutoComplete$2f$AutoComplete$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/shared/components/ui/AutoComplete/AutoComplete.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$Button$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/shared/components/ui/Button/Button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$Alert$2f$Alert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/shared/components/ui/Alert/Alert.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$actions$2f$data$3a$f47add__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/actions/data:f47add [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$actions$2f$data$3a$77806a__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/actions/data:77806a [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$hooks$2f$useWeighingPage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/hooks/useWeighingPage.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$providers$2f$WeighingPageProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/providers/WeighingPageProvider.tsx [app-client] (ecmascript)");
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
const NewTruckReceptionForm = ({ serialWeight, isSerialConnected })=>{
    _s();
    const { addTruck } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$providers$2f$WeighingPageProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWeighingPage"])();
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        producer_id: null,
        license_plate: '',
        driver_name: '',
        carrier_company: '',
        dispatch_guide: '',
        gross_weight: ''
    });
    const [producers, setProducers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [successMessage, setSuccessMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Cargar productores
    const loadProducers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "NewTruckReceptionForm.useCallback[loadProducers]": async (search)=>{
            try {
                const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$actions$2f$data$3a$f47add__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["fetchProducersAction"])({
                    search
                });
                setProducers(result.data);
            } catch (err) {
                console.error('Error cargando productores:', err);
            }
        }
    }["NewTruckReceptionForm.useCallback[loadProducers]"], []);
    // Cargar productores al montar
    __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useEffect({
        "NewTruckReceptionForm.useEffect": ()=>{
            loadProducers();
        }
    }["NewTruckReceptionForm.useEffect"], [
        loadProducers
    ]);
    // Sincronizar peso serial
    __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useEffect({
        "NewTruckReceptionForm.useEffect": ()=>{
            if (serialWeight && isSerialConnected) {
                setFormData({
                    "NewTruckReceptionForm.useEffect": (prev)=>({
                            ...prev,
                            gross_weight: String(serialWeight)
                        })
                }["NewTruckReceptionForm.useEffect"]);
            }
        }
    }["NewTruckReceptionForm.useEffect"], [
        serialWeight,
        isSerialConnected
    ]);
    const handleProducerSearch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "NewTruckReceptionForm.useCallback[handleProducerSearch]": (searchValue)=>{
            loadProducers(searchValue);
        }
    }["NewTruckReceptionForm.useCallback[handleProducerSearch]"], [
        loadProducers
    ]);
    const handleSubmit = async (e)=>{
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        // Validación
        if (!formData.producer_id) {
            setError('Selecciona un productor');
            return;
        }
        if (!formData.license_plate.trim()) {
            setError('La patente es requerida');
            return;
        }
        if (!formData.driver_name.trim()) {
            setError('El nombre del chofer es requerido');
            return;
        }
        const weight = Number(formData.gross_weight);
        if (!weight || weight <= 0) {
            setError('El peso bruto debe ser mayor a 0');
            return;
        }
        setIsLoading(true);
        try {
            const newTruck = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$actions$2f$data$3a$77806a__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["createTruckReceptionAction"])({
                producer_id: formData.producer_id,
                license_plate: formData.license_plate.trim(),
                driver_name: formData.driver_name.trim(),
                carrier_company: formData.carrier_company.trim() || undefined,
                dispatch_guide: formData.dispatch_guide.trim() || undefined,
                gross_weight: weight
            });
            addTruck(newTruck);
            setSuccessMessage(`Recepción creada: Turno #${newTruck.numero_turno}`);
            // Limpiar formulario
            setFormData({
                producer_id: null,
                license_plate: '',
                driver_name: '',
                carrier_company: '',
                dispatch_guide: '',
                gross_weight: ''
            });
            setTimeout(()=>setSuccessMessage(null), 3000);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Error al crear recepción';
            setError(message);
        } finally{
            setIsLoading(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-background rounded-lg border border-border p-6 h-full overflow-y-auto",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "text-xl font-bold text-foreground mb-6",
                children: "Nueva Recepción"
            }, void 0, false, {
                fileName: "[project]/paddy/paddy-tms/src/components/weighing/NewTruckReceptionForm.tsx",
                lineNumber: 129,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                onSubmit: handleSubmit,
                className: "space-y-4",
                children: [
                    successMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$Alert$2f$Alert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        variant: "success",
                        className: "mb-4",
                        children: successMessage
                    }, void 0, false, {
                        fileName: "[project]/paddy/paddy-tms/src/components/weighing/NewTruckReceptionForm.tsx",
                        lineNumber: 134,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$Alert$2f$Alert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        variant: "error",
                        className: "mb-4",
                        children: error
                    }, void 0, false, {
                        fileName: "[project]/paddy/paddy-tms/src/components/weighing/NewTruckReceptionForm.tsx",
                        lineNumber: 141,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block text-sm font-medium text-foreground mb-2",
                                children: "Productor *"
                            }, void 0, false, {
                                fileName: "[project]/paddy/paddy-tms/src/components/weighing/NewTruckReceptionForm.tsx",
                                lineNumber: 148,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$AutoComplete$2f$AutoComplete$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                options: producers,
                                value: producers.find((p)=>p.id === formData.producer_id) || null,
                                onChange: (option)=>setFormData((prev)=>({
                                            ...prev,
                                            producer_id: option?.id || null
                                        })),
                                onInputChange: handleProducerSearch,
                                getOptionLabel: (option)=>`${option.name} · ${option.rut}`,
                                getOptionValue: (option)=>option.id,
                                filterOption: (option, searchValue)=>{
                                    const searchLower = searchValue.toLowerCase();
                                    return option.name.toLowerCase().includes(searchLower) || option.rut.toLowerCase().includes(searchLower) || option.email?.toLowerCase().includes(searchLower) || option.city?.toLowerCase().includes(searchLower);
                                },
                                placeholder: "Busca productor",
                                disabled: isLoading
                            }, void 0, false, {
                                fileName: "[project]/paddy/paddy-tms/src/components/weighing/NewTruckReceptionForm.tsx",
                                lineNumber: 151,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/paddy/paddy-tms/src/components/weighing/NewTruckReceptionForm.tsx",
                        lineNumber: 147,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$TextField$2f$TextField$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextField"], {
                        label: "Patente *",
                        value: formData.license_plate,
                        onChange: (e)=>setFormData((prev)=>({
                                    ...prev,
                                    license_plate: e.target.value
                                })),
                        placeholder: "Ej: ABC-1234",
                        disabled: isLoading
                    }, void 0, false, {
                        fileName: "[project]/paddy/paddy-tms/src/components/weighing/NewTruckReceptionForm.tsx",
                        lineNumber: 173,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$TextField$2f$TextField$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextField"], {
                        label: "Nombre del Chofer *",
                        value: formData.driver_name,
                        onChange: (e)=>setFormData((prev)=>({
                                    ...prev,
                                    driver_name: e.target.value
                                })),
                        placeholder: "Ej: Juan Pérez",
                        disabled: isLoading
                    }, void 0, false, {
                        fileName: "[project]/paddy/paddy-tms/src/components/weighing/NewTruckReceptionForm.tsx",
                        lineNumber: 182,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$TextField$2f$TextField$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextField"], {
                        label: "Empresa de Transporte",
                        value: formData.carrier_company,
                        onChange: (e)=>setFormData((prev)=>({
                                    ...prev,
                                    carrier_company: e.target.value
                                })),
                        placeholder: "Ej: Transporte XYZ",
                        disabled: isLoading
                    }, void 0, false, {
                        fileName: "[project]/paddy/paddy-tms/src/components/weighing/NewTruckReceptionForm.tsx",
                        lineNumber: 191,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$TextField$2f$TextField$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextField"], {
                        label: "Guía de Despacho",
                        value: formData.dispatch_guide,
                        onChange: (e)=>setFormData((prev)=>({
                                    ...prev,
                                    dispatch_guide: e.target.value
                                })),
                        placeholder: "Ej: DG-2024-001",
                        disabled: isLoading
                    }, void 0, false, {
                        fileName: "[project]/paddy/paddy-tms/src/components/weighing/NewTruckReceptionForm.tsx",
                        lineNumber: 200,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$TextField$2f$TextField$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextField"], {
                        label: "Peso Bruto (kg) *",
                        type: "number",
                        value: formData.gross_weight,
                        onChange: (e)=>setFormData((prev)=>({
                                    ...prev,
                                    gross_weight: e.target.value
                                })),
                        placeholder: isSerialConnected ? `${serialWeight || 0} kg (serial)` : 'Ingresa peso manualmente',
                        disabled: isLoading,
                        min: "0",
                        step: "0.01"
                    }, void 0, false, {
                        fileName: "[project]/paddy/paddy-tms/src/components/weighing/NewTruckReceptionForm.tsx",
                        lineNumber: 209,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$Button$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        type: "submit",
                        variant: "primary",
                        className: "w-full mt-6",
                        disabled: isLoading,
                        children: isLoading ? 'Guardando...' : 'Guardar Recepción'
                    }, void 0, false, {
                        fileName: "[project]/paddy/paddy-tms/src/components/weighing/NewTruckReceptionForm.tsx",
                        lineNumber: 221,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/paddy/paddy-tms/src/components/weighing/NewTruckReceptionForm.tsx",
                lineNumber: 131,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/paddy/paddy-tms/src/components/weighing/NewTruckReceptionForm.tsx",
        lineNumber: 128,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(NewTruckReceptionForm, "ahOcst/mSWtGIC9FOTiNAv8zztQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$providers$2f$WeighingPageProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWeighingPage"]
    ];
});
_c = NewTruckReceptionForm;
var _c;
__turbopack_context__.k.register(_c, "NewTruckReceptionForm");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/paddy/paddy-tms/src/components/weighing/TruckDetailPanel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TruckDetailPanel",
    ()=>TruckDetailPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$truckReceptionService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/services/truckReceptionService.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$TextField$2f$TextField$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/shared/components/ui/TextField/TextField.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$Button$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/shared/components/ui/Button/Button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$Alert$2f$Alert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/shared/components/ui/Alert/Alert.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$hooks$2f$useWeighingPage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/hooks/useWeighingPage.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$providers$2f$WeighingPageProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/providers/WeighingPageProvider.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
const TruckDetailPanel = ({ truck, serialWeight, isSerialConnected, isLoading: externalLoading })=>{
    _s();
    const { updateTruck } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$providers$2f$WeighingPageProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWeighingPage"])();
    const [tareWeight, setTareWeight] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    if (!truck) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-background rounded-lg border border-border p-6 h-full flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-muted-foreground text-center text-sm",
                children: "Esperando seleccionar un camión..."
            }, void 0, false, {
                fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckDetailPanel.tsx",
                lineNumber: 32,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckDetailPanel.tsx",
            lineNumber: 31,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    const netWeight = truck.gross_weight && truck.tare_weight ? truck.gross_weight - truck.tare_weight : null;
    const handleFinalizeTare = async ()=>{
        setError(null);
        const weight = Number(tareWeight);
        if (!weight || weight <= 0) {
            setError('El peso tara debe ser mayor a 0');
            return;
        }
        if (truck.gross_weight && weight >= truck.gross_weight) {
            setError('El peso tara debe ser menor al peso bruto');
            return;
        }
        setIsLoading(true);
        try {
            const payload = {
                truck_reception_id: truck.id,
                tare_weight: weight
            };
            const updatedTruck = await __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$services$2f$truckReceptionService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["truckReceptionService"].recordTareWeight(payload);
            updateTruck(updatedTruck);
            setTareWeight('');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Error al registrar peso tara';
            setError(message);
        } finally{
            setIsLoading(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-background rounded-lg border border-border p-6 h-full overflow-y-auto",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "text-lg font-bold text-foreground mb-6",
                children: "Detalles del Camión"
            }, void 0, false, {
                fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckDetailPanel.tsx",
                lineNumber: 78,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-4 mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "text-xs font-medium text-muted-foreground",
                                children: "Patente"
                            }, void 0, false, {
                                fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckDetailPanel.tsx",
                                lineNumber: 83,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-lg font-semibold text-foreground",
                                children: truck.license_plate
                            }, void 0, false, {
                                fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckDetailPanel.tsx",
                                lineNumber: 84,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckDetailPanel.tsx",
                        lineNumber: 82,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "text-xs font-medium text-muted-foreground",
                                children: "Chofer"
                            }, void 0, false, {
                                fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckDetailPanel.tsx",
                                lineNumber: 88,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-foreground",
                                children: truck.driver_name
                            }, void 0, false, {
                                fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckDetailPanel.tsx",
                                lineNumber: 89,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckDetailPanel.tsx",
                        lineNumber: 87,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "text-xs font-medium text-muted-foreground",
                                children: "Empresa"
                            }, void 0, false, {
                                fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckDetailPanel.tsx",
                                lineNumber: 93,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-foreground",
                                children: truck.carrier_company || '-'
                            }, void 0, false, {
                                fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckDetailPanel.tsx",
                                lineNumber: 94,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckDetailPanel.tsx",
                        lineNumber: 92,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "text-xs font-medium text-muted-foreground",
                                children: "Guía de Despacho"
                            }, void 0, false, {
                                fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckDetailPanel.tsx",
                                lineNumber: 98,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-foreground",
                                children: truck.dispatch_guide || '-'
                            }, void 0, false, {
                                fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckDetailPanel.tsx",
                                lineNumber: 99,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckDetailPanel.tsx",
                        lineNumber: 97,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "text-xs font-medium text-muted-foreground",
                                children: "Turno"
                            }, void 0, false, {
                                fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckDetailPanel.tsx",
                                lineNumber: 103,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-lg font-bold text-primary",
                                children: [
                                    "#",
                                    truck.numero_turno
                                ]
                            }, void 0, true, {
                                fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckDetailPanel.tsx",
                                lineNumber: 104,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckDetailPanel.tsx",
                        lineNumber: 102,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "text-xs font-medium text-muted-foreground",
                                children: "Estado"
                            }, void 0, false, {
                                fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckDetailPanel.tsx",
                                lineNumber: 108,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-foreground capitalize",
                                children: truck.status === 'ESPERA' ? 'En Espera' : 'Finalizado'
                            }, void 0, false, {
                                fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckDetailPanel.tsx",
                                lineNumber: 109,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckDetailPanel.tsx",
                        lineNumber: 107,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckDetailPanel.tsx",
                lineNumber: 81,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("hr", {
                className: "my-6 border-border"
            }, void 0, false, {
                fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckDetailPanel.tsx",
                lineNumber: 113,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-4 mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "text-xs font-medium text-muted-foreground",
                                children: "Peso Bruto (kg)"
                            }, void 0, false, {
                                fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckDetailPanel.tsx",
                                lineNumber: 118,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-2xl font-bold text-foreground",
                                children: truck.gross_weight?.toFixed(2) || '-'
                            }, void 0, false, {
                                fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckDetailPanel.tsx",
                                lineNumber: 119,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckDetailPanel.tsx",
                        lineNumber: 117,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    truck.tare_weight && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "text-xs font-medium text-muted-foreground",
                                children: "Peso Tara (kg)"
                            }, void 0, false, {
                                fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckDetailPanel.tsx",
                                lineNumber: 124,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-2xl font-bold text-foreground",
                                children: truck.tare_weight.toFixed(2)
                            }, void 0, false, {
                                fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckDetailPanel.tsx",
                                lineNumber: 125,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckDetailPanel.tsx",
                        lineNumber: 123,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    netWeight && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "text-xs font-medium text-muted-foreground",
                                children: "Peso Neto (kg)"
                            }, void 0, false, {
                                fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckDetailPanel.tsx",
                                lineNumber: 131,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-2xl font-bold text-primary",
                                children: netWeight.toFixed(2)
                            }, void 0, false, {
                                fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckDetailPanel.tsx",
                                lineNumber: 132,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckDetailPanel.tsx",
                        lineNumber: 130,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckDetailPanel.tsx",
                lineNumber: 116,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            truck.status === 'ESPERA' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("hr", {
                        className: "my-6 border-border"
                    }, void 0, false, {
                        fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckDetailPanel.tsx",
                        lineNumber: 140,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "font-medium text-foreground",
                                children: "En Espera para Tara"
                            }, void 0, false, {
                                fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckDetailPanel.tsx",
                                lineNumber: 142,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$Alert$2f$Alert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                variant: "error",
                                children: error
                            }, void 0, false, {
                                fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckDetailPanel.tsx",
                                lineNumber: 144,
                                columnNumber: 23
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$TextField$2f$TextField$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextField"], {
                                label: "Peso Tara (kg) *",
                                type: "number",
                                value: tareWeight,
                                onChange: (e)=>setTareWeight(e.target.value),
                                placeholder: isSerialConnected ? `${serialWeight || 0} kg (serial)` : 'Ingresa peso',
                                disabled: isLoading || externalLoading,
                                min: "0",
                                step: "0.01"
                            }, void 0, false, {
                                fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckDetailPanel.tsx",
                                lineNumber: 146,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$Button$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                onClick: handleFinalizeTare,
                                variant: "primary",
                                className: "w-full",
                                disabled: isLoading || externalLoading,
                                children: isLoading ? 'Finalizando...' : 'Finalizar Recepción'
                            }, void 0, false, {
                                fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckDetailPanel.tsx",
                                lineNumber: 157,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckDetailPanel.tsx",
                        lineNumber: 141,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("hr", {
                        className: "my-6 border-border"
                    }, void 0, false, {
                        fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckDetailPanel.tsx",
                        lineNumber: 169,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-success/10 border border-success/20 rounded-lg p-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm font-medium text-success",
                                children: "Recepción Finalizada"
                            }, void 0, false, {
                                fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckDetailPanel.tsx",
                                lineNumber: 171,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-muted-foreground mt-1",
                                children: [
                                    "Finalizado: ",
                                    truck.finished_at ? new Date(truck.finished_at).toLocaleString() : '-'
                                ]
                            }, void 0, true, {
                                fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckDetailPanel.tsx",
                                lineNumber: 172,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckDetailPanel.tsx",
                        lineNumber: 170,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true)
        ]
    }, void 0, true, {
        fileName: "[project]/paddy/paddy-tms/src/components/weighing/TruckDetailPanel.tsx",
        lineNumber: 77,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(TruckDetailPanel, "QlpUIZxw/NdwbKX3bZJ192d9Rac=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$providers$2f$WeighingPageProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWeighingPage"]
    ];
});
_c = TruckDetailPanel;
var _c;
__turbopack_context__.k.register(_c, "TruckDetailPanel");
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
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$components$2f$weighing$2f$NewTruckReceptionForm$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/components/weighing/NewTruckReceptionForm.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$components$2f$weighing$2f$TruckDetailPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/components/weighing/TruckDetailPanel.tsx [app-client] (ecmascript)");
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
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "text-2xl font-bold text-primary",
                                    children: "Paddy TMS"
                                }, void 0, false, {
                                    fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                    lineNumber: 35,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `w-3 h-3 rounded-full ${serialConnected ? 'bg-success' : 'bg-muted'}`
                                        }, void 0, false, {
                                            fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                            lineNumber: 37,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-sm text-muted-foreground",
                                            children: serialConnected ? 'Balanza conectada' : 'Sin conexión serial'
                                        }, void 0, false, {
                                            fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                            lineNumber: 40,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                    lineNumber: 36,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                            lineNumber: 34,
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
                                    lineNumber: 47,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$Button$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "outlined",
                                    onClick: handleLogout,
                                    children: "Salir"
                                }, void 0, false, {
                                    fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                    lineNumber: 50,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                            lineNumber: 46,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                    lineNumber: 33,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                lineNumber: 32,
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
                                lineNumber: 63,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                        lineNumber: 61,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-180px)]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "lg:col-span-1",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$components$2f$weighing$2f$NewTruckReceptionForm$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NewTruckReceptionForm"], {
                                    serialWeight: lastWeight,
                                    isSerialConnected: serialConnected
                                }, void 0, false, {
                                    fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                    lineNumber: 76,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                lineNumber: 75,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "lg:col-span-1",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "h-full overflow-hidden",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$components$2f$weighing$2f$TruckDetailPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TruckDetailPanel"], {
                                        truck: selectedTruck,
                                        serialWeight: lastWeight,
                                        isSerialConnected: serialConnected,
                                        isLoading: isLoading
                                    }, void 0, false, {
                                        fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                        lineNumber: 85,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                    lineNumber: 84,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                lineNumber: 83,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                        lineNumber: 73,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                lineNumber: 58,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
        lineNumber: 30,
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
            lineNumber: 103,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
        lineNumber: 102,
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
]);

//# sourceMappingURL=paddy_paddy-tms_src_9ea6ae4d._.js.map