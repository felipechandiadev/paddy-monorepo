(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/paddy/paddy-tms/src/features/logistics/hooks/useLogistics.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useLogistics",
    ()=>useLogistics
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$features$2f$logistics$2f$context$2f$LogisticsContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/features/logistics/context/LogisticsContext.tsx [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const useLogistics = ()=>{
    _s();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$features$2f$logistics$2f$context$2f$LogisticsContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LogisticsContext"]);
    if (!context) {
        throw new Error('useLogistics must be used within LogisticsProvider');
    }
    return context;
};
_s(useLogistics, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/paddy/paddy-tms/src/features/logistics/services/truckService.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createTruckRequest",
    ()=>createTruckRequest,
    "fetchReceptions",
    ()=>fetchReceptions,
    "fetchTruckById",
    ()=>fetchTruckById,
    "fetchTrucks",
    ()=>fetchTrucks,
    "updateTruckRequest",
    ()=>updateTruckRequest
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const API_URL = ("TURBOPACK compile-time value", "http://localhost:3000/api/v1") || 'http://localhost:3000/api';
const fetchTrucks = async ()=>{
    const response = await fetch(`${API_URL}/trucks`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch trucks: ${response.statusText}`);
    }
    return response.json();
};
const fetchTruckById = async (id)=>{
    const response = await fetch(`${API_URL}/trucks/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch truck: ${response.statusText}`);
    }
    return response.json();
};
const fetchReceptions = async ()=>{
    const response = await fetch(`${API_URL}/receptions`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch receptions: ${response.statusText}`);
    }
    return response.json();
};
const createTruckRequest = async (truck)=>{
    const response = await fetch(`${API_URL}/trucks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(truck),
        credentials: 'include'
    });
    if (!response.ok) {
        throw new Error(`Failed to create truck: ${response.statusText}`);
    }
    return response.json();
};
const updateTruckRequest = async (id, truck)=>{
    const response = await fetch(`${API_URL}/trucks/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(truck),
        credentials: 'include'
    });
    if (!response.ok) {
        throw new Error(`Failed to update truck: ${response.statusText}`);
    }
    return response.json();
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/paddy/paddy-tms/src/features/logistics/hooks/useLogisticsData.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useLogisticsData",
    ()=>useLogisticsData
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$features$2f$logistics$2f$hooks$2f$useLogistics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/features/logistics/hooks/useLogistics.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$features$2f$logistics$2f$services$2f$truckService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/features/logistics/services/truckService.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$features$2f$logistics$2f$context$2f$actions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/features/logistics/context/actions.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
const useLogisticsData = (enabled = true)=>{
    _s();
    const { dispatch, state, setLoading, setError } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$features$2f$logistics$2f$hooks$2f$useLogistics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLogistics"])();
    const loadData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useLogisticsData.useCallback[loadData]": async ()=>{
            if (!enabled) return;
            setLoading(true);
            try {
                const [trucks, receptions] = await Promise.all([
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$features$2f$logistics$2f$services$2f$truckService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchTrucks"])(),
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$features$2f$logistics$2f$services$2f$truckService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchReceptions"])()
                ]);
                dispatch({
                    type: __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$features$2f$logistics$2f$context$2f$actions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ACTION_TYPES"].SET_TRUCKS,
                    payload: trucks
                });
                dispatch({
                    type: __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$features$2f$logistics$2f$context$2f$actions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ACTION_TYPES"].SET_RECEPTIONS,
                    payload: receptions
                });
                setError(null);
            } catch (error) {
                const message = error instanceof Error ? error.message : 'Error loading data';
                setError(message);
            } finally{
                setLoading(false);
            }
        }
    }["useLogisticsData.useCallback[loadData]"], [
        dispatch,
        setLoading,
        setError,
        enabled
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useLogisticsData.useEffect": ()=>{
            loadData();
        }
    }["useLogisticsData.useEffect"], [
        loadData
    ]);
    return {
        trucks: state.trucks,
        receptions: state.receptions,
        loading: state.loading,
        error: state.error,
        refetch: loadData
    };
};
_s(useLogisticsData, "75+2d+LaxNgCPw2SY63VT0deLfE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$features$2f$logistics$2f$hooks$2f$useLogistics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLogistics"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/paddy/paddy-tms/src/features/logistics/hooks/useRealtimeSync.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useRealtimeSync",
    ()=>useRealtimeSync
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$features$2f$logistics$2f$hooks$2f$useLogistics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/features/logistics/hooks/useLogistics.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$features$2f$logistics$2f$context$2f$actions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/features/logistics/context/actions.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
const useRealtimeSync = (enabled = false)=>{
    _s();
    const { dispatch, setError } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$features$2f$logistics$2f$hooks$2f$useLogistics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLogistics"])();
    const socketRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const reconnectTimeoutRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const connectSocket = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useRealtimeSync.useCallback[connectSocket]": ()=>{
            if (!enabled) {
                console.log('WebSocket sync disabled');
                return null;
            }
            try {
                const wsUrl = __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3000';
                console.log('Attempting WebSocket connection to:', wsUrl);
                const socket = new WebSocket(wsUrl);
                socket.onopen = ({
                    "useRealtimeSync.useCallback[connectSocket]": ()=>{
                        console.log('WebSocket connected');
                    }
                })["useRealtimeSync.useCallback[connectSocket]"];
                socket.onmessage = ({
                    "useRealtimeSync.useCallback[connectSocket]": (event)=>{
                        try {
                            const data = JSON.parse(event.data);
                            if (data.type === 'truck_updated') {
                                dispatch({
                                    type: __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$features$2f$logistics$2f$context$2f$actions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ACTION_TYPES"].UPDATE_TRUCK,
                                    payload: data.truck
                                });
                            } else if (data.type === 'truck_added') {
                                dispatch({
                                    type: __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$features$2f$logistics$2f$context$2f$actions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ACTION_TYPES"].ADD_TRUCK,
                                    payload: data.truck
                                });
                            } else if (data.type === 'reception_recorded') {
                                dispatch({
                                    type: __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$features$2f$logistics$2f$context$2f$actions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ACTION_TYPES"].ADD_RECEPTION,
                                    payload: data.reception
                                });
                            }
                        } catch (error) {
                            console.error('Error parsing socket message:', error);
                        }
                    }
                })["useRealtimeSync.useCallback[connectSocket]"];
                socket.onerror = ({
                    "useRealtimeSync.useCallback[connectSocket]": (error)=>{
                        console.warn('WebSocket error - Real-time updates disabled:', error);
                    // No mostrar error en UI - es esperado si el backend no tiene WebSocket configurado
                    }
                })["useRealtimeSync.useCallback[connectSocket]"];
                socket.onclose = ({
                    "useRealtimeSync.useCallback[connectSocket]": ()=>{
                        console.log('WebSocket disconnected');
                        socketRef.current = null;
                        if (enabled) {
                            // Intentar reconectar después de 5 segundos
                            reconnectTimeoutRef.current = setTimeout({
                                "useRealtimeSync.useCallback[connectSocket]": ()=>{
                                    connectSocket();
                                }
                            }["useRealtimeSync.useCallback[connectSocket]"], 5000);
                        }
                    }
                })["useRealtimeSync.useCallback[connectSocket]"];
                socketRef.current = socket;
                return socket;
            } catch (error) {
                console.warn('WebSocket connection error - falling back to polling:', error);
                // No mostrar error - es opcional si el backend no tiene WebSocket
                return null;
            }
        }
    }["useRealtimeSync.useCallback[connectSocket]"], [
        dispatch,
        enabled
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useRealtimeSync.useEffect": ()=>{
            if (enabled) {
                connectSocket();
            }
            return ({
                "useRealtimeSync.useEffect": ()=>{
                    if (reconnectTimeoutRef.current) {
                        clearTimeout(reconnectTimeoutRef.current);
                    }
                    if (socketRef.current) {
                        socketRef.current.close();
                    }
                }
            })["useRealtimeSync.useEffect"];
        }
    }["useRealtimeSync.useEffect"], [
        connectSocket,
        enabled
    ]);
    return {
        isConnected: socketRef.current?.readyState === WebSocket.OPEN
    };
};
_s(useRealtimeSync, "sxYVFX79Jf/Irb18+NyZvre324w=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$features$2f$logistics$2f$hooks$2f$useLogistics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLogistics"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/paddy/paddy-tms/src/features/logistics/components/TruckCard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TruckCard",
    ()=>TruckCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
'use client';
;
const TruckCard = ({ truck, onClick, isSelected })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        onClick: onClick,
        className: `
        p-4 rounded-lg border transition-all cursor-pointer
        ${isSelected ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-200 bg-white hover:border-gray-300'}
      `,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between items-start mb-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-lg font-semibold text-gray-900",
                        children: truck.plate
                    }, void 0, false, {
                        fileName: "[project]/paddy/paddy-tms/src/features/logistics/components/TruckCard.tsx",
                        lineNumber: 25,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: `
          px-2 py-1 rounded-full text-sm font-medium
          ${truck.status === 'completed' ? 'bg-green-100 text-green-800' : truck.status === 'weighing' ? 'bg-blue-100 text-blue-800' : truck.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}
        `,
                        children: truck.status
                    }, void 0, false, {
                        fileName: "[project]/paddy/paddy-tms/src/features/logistics/components/TruckCard.tsx",
                        lineNumber: 26,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/paddy/paddy-tms/src/features/logistics/components/TruckCard.tsx",
                lineNumber: 24,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-1 text-sm text-gray-600",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-medium",
                                children: "Driver:"
                            }, void 0, false, {
                                fileName: "[project]/paddy/paddy-tms/src/features/logistics/components/TruckCard.tsx",
                                lineNumber: 38,
                                columnNumber: 12
                            }, ("TURBOPACK compile-time value", void 0)),
                            " ",
                            truck.driverName
                        ]
                    }, void 0, true, {
                        fileName: "[project]/paddy/paddy-tms/src/features/logistics/components/TruckCard.tsx",
                        lineNumber: 38,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-medium",
                                children: "Document:"
                            }, void 0, false, {
                                fileName: "[project]/paddy/paddy-tms/src/features/logistics/components/TruckCard.tsx",
                                lineNumber: 39,
                                columnNumber: 12
                            }, ("TURBOPACK compile-time value", void 0)),
                            " ",
                            truck.driverDocument
                        ]
                    }, void 0, true, {
                        fileName: "[project]/paddy/paddy-tms/src/features/logistics/components/TruckCard.tsx",
                        lineNumber: 39,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    truck.weight && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-medium",
                                children: "Weight:"
                            }, void 0, false, {
                                fileName: "[project]/paddy/paddy-tms/src/features/logistics/components/TruckCard.tsx",
                                lineNumber: 41,
                                columnNumber: 14
                            }, ("TURBOPACK compile-time value", void 0)),
                            " ",
                            truck.weight,
                            " kg"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/paddy/paddy-tms/src/features/logistics/components/TruckCard.tsx",
                        lineNumber: 41,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-gray-500",
                        children: [
                            "Entry: ",
                            new Date(truck.entryTime).toLocaleString()
                        ]
                    }, void 0, true, {
                        fileName: "[project]/paddy/paddy-tms/src/features/logistics/components/TruckCard.tsx",
                        lineNumber: 43,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/paddy/paddy-tms/src/features/logistics/components/TruckCard.tsx",
                lineNumber: 37,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/paddy/paddy-tms/src/features/logistics/components/TruckCard.tsx",
        lineNumber: 14,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = TruckCard;
var _c;
__turbopack_context__.k.register(_c, "TruckCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/paddy/paddy-tms/src/features/logistics/components/MonitorDisplay.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MonitorDisplay",
    ()=>MonitorDisplay
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$features$2f$logistics$2f$hooks$2f$useLogisticsData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/features/logistics/hooks/useLogisticsData.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$features$2f$logistics$2f$hooks$2f$useRealtimeSync$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/features/logistics/hooks/useRealtimeSync.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$features$2f$logistics$2f$components$2f$TruckCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/features/logistics/components/TruckCard.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
const MonitorDisplay = ({ refreshInterval = 5000, publicView = true })=>{
    _s();
    const { trucks, loading, error, refetch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$features$2f$logistics$2f$hooks$2f$useLogisticsData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLogisticsData"])(true);
    // Solo habilitar WebSocket en monitor view (comentado por ahora ya que no hay WS server)
    const { isConnected } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$features$2f$logistics$2f$hooks$2f$useRealtimeSync$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRealtimeSync"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MonitorDisplay.useEffect": ()=>{
            if (!publicView) return;
            const interval = setInterval({
                "MonitorDisplay.useEffect.interval": ()=>{
                    refetch();
                }
            }["MonitorDisplay.useEffect.interval"], refreshInterval);
            return ({
                "MonitorDisplay.useEffect": ()=>clearInterval(interval)
            })["MonitorDisplay.useEffect"];
        }
    }["MonitorDisplay.useEffect"], [
        refreshInterval,
        refetch,
        publicView
    ]);
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-red-50 border border-red-200 rounded-lg p-6 text-center",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-red-700 font-medium",
                    children: "Error loading data"
                }, void 0, false, {
                    fileName: "[project]/paddy/paddy-tms/src/features/logistics/components/MonitorDisplay.tsx",
                    lineNumber: 34,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-red-600 text-sm mt-1",
                    children: error
                }, void 0, false, {
                    fileName: "[project]/paddy/paddy-tms/src/features/logistics/components/MonitorDisplay.tsx",
                    lineNumber: 35,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/paddy/paddy-tms/src/features/logistics/components/MonitorDisplay.tsx",
            lineNumber: 33,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    const activeTrucks = trucks.filter((t)=>t.status !== 'completed');
    const completedTrucks = trucks.filter((t)=>t.status === 'completed').slice(0, 5);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 md:grid-cols-3 gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-blue-600 font-medium",
                                children: "Active"
                            }, void 0, false, {
                                fileName: "[project]/paddy/paddy-tms/src/features/logistics/components/MonitorDisplay.tsx",
                                lineNumber: 47,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-3xl font-bold text-blue-900 mt-1",
                                children: activeTrucks.length
                            }, void 0, false, {
                                fileName: "[project]/paddy/paddy-tms/src/features/logistics/components/MonitorDisplay.tsx",
                                lineNumber: 48,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/paddy/paddy-tms/src/features/logistics/components/MonitorDisplay.tsx",
                        lineNumber: 46,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-green-50 rounded-lg p-4 border border-green-200",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-green-600 font-medium",
                                children: "Completed Today"
                            }, void 0, false, {
                                fileName: "[project]/paddy/paddy-tms/src/features/logistics/components/MonitorDisplay.tsx",
                                lineNumber: 51,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-3xl font-bold text-green-900 mt-1",
                                children: completedTrucks.length
                            }, void 0, false, {
                                fileName: "[project]/paddy/paddy-tms/src/features/logistics/components/MonitorDisplay.tsx",
                                lineNumber: 52,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/paddy/paddy-tms/src/features/logistics/components/MonitorDisplay.tsx",
                        lineNumber: 50,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-purple-600 font-medium",
                                children: "Real-time"
                            }, void 0, false, {
                                fileName: "[project]/paddy/paddy-tms/src/features/logistics/components/MonitorDisplay.tsx",
                                lineNumber: 55,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: `text-3xl font-bold mt-1 ${isConnected ? 'text-green-600' : 'text-red-600'}`,
                                children: isConnected ? 'Connected' : 'Offline'
                            }, void 0, false, {
                                fileName: "[project]/paddy/paddy-tms/src/features/logistics/components/MonitorDisplay.tsx",
                                lineNumber: 56,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/paddy/paddy-tms/src/features/logistics/components/MonitorDisplay.tsx",
                        lineNumber: 54,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/paddy/paddy-tms/src/features/logistics/components/MonitorDisplay.tsx",
                lineNumber: 45,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-2",
                children: [
                    1,
                    2,
                    3
                ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-24 bg-gray-200 rounded-lg animate-pulse"
                    }, i, false, {
                        fileName: "[project]/paddy/paddy-tms/src/features/logistics/components/MonitorDisplay.tsx",
                        lineNumber: 65,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)))
            }, void 0, false, {
                fileName: "[project]/paddy/paddy-tms/src/features/logistics/components/MonitorDisplay.tsx",
                lineNumber: 63,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-lg font-semibold text-gray-900",
                        children: "Active Trucks"
                    }, void 0, false, {
                        fileName: "[project]/paddy/paddy-tms/src/features/logistics/components/MonitorDisplay.tsx",
                        lineNumber: 71,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    activeTrucks.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-500 text-center py-8",
                        children: "No active trucks"
                    }, void 0, false, {
                        fileName: "[project]/paddy/paddy-tms/src/features/logistics/components/MonitorDisplay.tsx",
                        lineNumber: 73,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                        children: activeTrucks.map((truck)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$features$2f$logistics$2f$components$2f$TruckCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TruckCard"], {
                                truck: truck
                            }, truck.id, false, {
                                fileName: "[project]/paddy/paddy-tms/src/features/logistics/components/MonitorDisplay.tsx",
                                lineNumber: 77,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)))
                    }, void 0, false, {
                        fileName: "[project]/paddy/paddy-tms/src/features/logistics/components/MonitorDisplay.tsx",
                        lineNumber: 75,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/paddy/paddy-tms/src/features/logistics/components/MonitorDisplay.tsx",
                lineNumber: 70,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            completedTrucks.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-lg font-semibold text-gray-900",
                        children: "Recently Completed"
                    }, void 0, false, {
                        fileName: "[project]/paddy/paddy-tms/src/features/logistics/components/MonitorDisplay.tsx",
                        lineNumber: 85,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                        children: completedTrucks.map((truck)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$features$2f$logistics$2f$components$2f$TruckCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TruckCard"], {
                                truck: truck
                            }, truck.id, false, {
                                fileName: "[project]/paddy/paddy-tms/src/features/logistics/components/MonitorDisplay.tsx",
                                lineNumber: 88,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)))
                    }, void 0, false, {
                        fileName: "[project]/paddy/paddy-tms/src/features/logistics/components/MonitorDisplay.tsx",
                        lineNumber: 86,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/paddy/paddy-tms/src/features/logistics/components/MonitorDisplay.tsx",
                lineNumber: 84,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/paddy/paddy-tms/src/features/logistics/components/MonitorDisplay.tsx",
        lineNumber: 44,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(MonitorDisplay, "TDRsjdHgwC7lJZIWRcJItVah2x4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$features$2f$logistics$2f$hooks$2f$useLogisticsData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLogisticsData"],
        __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$features$2f$logistics$2f$hooks$2f$useRealtimeSync$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRealtimeSync"]
    ];
});
_c = MonitorDisplay;
var _c;
__turbopack_context__.k.register(_c, "MonitorDisplay");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/paddy/paddy-tms/src/app/monitor/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MonitorPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$features$2f$logistics$2f$components$2f$MonitorDisplay$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/features/logistics/components/MonitorDisplay.tsx [app-client] (ecmascript)");
'use client';
;
;
function MonitorPage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gray-50",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "bg-white shadow",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-2xl font-bold text-gray-900",
                            children: "Logistics Monitor"
                        }, void 0, false, {
                            fileName: "[project]/paddy/paddy-tms/src/app/monitor/page.tsx",
                            lineNumber: 12,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-gray-600 mt-1",
                            children: "Real-time truck tracking and status"
                        }, void 0, false, {
                            fileName: "[project]/paddy/paddy-tms/src/app/monitor/page.tsx",
                            lineNumber: 13,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/paddy/paddy-tms/src/app/monitor/page.tsx",
                    lineNumber: 11,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/paddy/paddy-tms/src/app/monitor/page.tsx",
                lineNumber: 10,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$features$2f$logistics$2f$components$2f$MonitorDisplay$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MonitorDisplay"], {
                    refreshInterval: 5000,
                    publicView: true
                }, void 0, false, {
                    fileName: "[project]/paddy/paddy-tms/src/app/monitor/page.tsx",
                    lineNumber: 19,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/paddy/paddy-tms/src/app/monitor/page.tsx",
                lineNumber: 18,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/paddy/paddy-tms/src/app/monitor/page.tsx",
        lineNumber: 8,
        columnNumber: 5
    }, this);
}
_c = MonitorPage;
var _c;
__turbopack_context__.k.register(_c, "MonitorPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=paddy_paddy-tms_src_b0225374._.js.map