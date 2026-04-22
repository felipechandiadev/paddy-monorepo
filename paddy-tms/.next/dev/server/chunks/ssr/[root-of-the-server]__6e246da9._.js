module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/paddy/paddy-tms/src/features/logistics/context/actions.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ACTION_TYPES",
    ()=>ACTION_TYPES,
    "logisticsReducer",
    ()=>logisticsReducer
]);
const ACTION_TYPES = {
    // Trucks
    SET_TRUCKS: 'SET_TRUCKS',
    ADD_TRUCK: 'ADD_TRUCK',
    UPDATE_TRUCK: 'UPDATE_TRUCK',
    REMOVE_TRUCK: 'REMOVE_TRUCK',
    SET_CURRENT_TRUCK: 'SET_CURRENT_TRUCK',
    // Receptions
    ADD_RECEPTION: 'ADD_RECEPTION',
    SET_RECEPTIONS: 'SET_RECEPTIONS',
    // Loading & Errors
    SET_LOADING: 'SET_LOADING',
    SET_ERROR: 'SET_ERROR',
    CLEAR_ERROR: 'CLEAR_ERROR',
    // Auth
    SET_USER: 'SET_USER',
    SET_AUTHENTICATED: 'SET_AUTHENTICATED',
    LOGOUT: 'LOGOUT'
};
const logisticsReducer = (state, action)=>{
    switch(action.type){
        case ACTION_TYPES.SET_TRUCKS:
            return {
                ...state,
                trucks: action.payload
            };
        case ACTION_TYPES.ADD_TRUCK:
            return {
                ...state,
                trucks: [
                    ...state.trucks,
                    action.payload
                ]
            };
        case ACTION_TYPES.UPDATE_TRUCK:
            return {
                ...state,
                trucks: state.trucks.map((t)=>t.id === action.payload.id ? action.payload : t),
                currentTruck: state.currentTruck?.id === action.payload.id ? action.payload : state.currentTruck
            };
        case ACTION_TYPES.REMOVE_TRUCK:
            return {
                ...state,
                trucks: state.trucks.filter((t)=>t.id !== action.payload)
            };
        case ACTION_TYPES.SET_CURRENT_TRUCK:
            return {
                ...state,
                currentTruck: action.payload
            };
        case ACTION_TYPES.ADD_RECEPTION:
            return {
                ...state,
                receptions: [
                    ...state.receptions,
                    action.payload
                ]
            };
        case ACTION_TYPES.SET_RECEPTIONS:
            return {
                ...state,
                receptions: action.payload
            };
        case ACTION_TYPES.SET_LOADING:
            return {
                ...state,
                loading: action.payload
            };
        case ACTION_TYPES.SET_ERROR:
            return {
                ...state,
                error: action.payload
            };
        case ACTION_TYPES.CLEAR_ERROR:
            return {
                ...state,
                error: null
            };
        case ACTION_TYPES.SET_USER:
            return {
                ...state,
                user: action.payload,
                isAuthenticated: !!action.payload
            };
        case ACTION_TYPES.SET_AUTHENTICATED:
            return {
                ...state,
                isAuthenticated: action.payload
            };
        case ACTION_TYPES.LOGOUT:
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                trucks: [],
                currentTruck: null,
                receptions: []
            };
        default:
            return state;
    }
};
}),
"[project]/paddy/paddy-tms/src/features/logistics/context/LogisticsContext.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LogisticsContext",
    ()=>LogisticsContext,
    "LogisticsProvider",
    ()=>LogisticsProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$features$2f$logistics$2f$context$2f$actions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/features/logistics/context/actions.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
const initialState = {
    trucks: [],
    currentTruck: null,
    receptions: [],
    loading: false,
    error: null,
    user: null,
    isAuthenticated: false
};
const LogisticsContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])({
    state: initialState,
    dispatch: ()=>{},
    setLoading: ()=>{},
    setError: ()=>{},
    setUser: ()=>{},
    logout: ()=>{}
});
const LogisticsProvider = ({ children })=>{
    const [state, dispatch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useReducer"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$features$2f$logistics$2f$context$2f$actions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["logisticsReducer"], initialState);
    const setLoading = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((loading)=>{
        dispatch({
            type: __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$features$2f$logistics$2f$context$2f$actions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ACTION_TYPES"].SET_LOADING,
            payload: loading
        });
    }, []);
    const setError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((error)=>{
        if (error) {
            dispatch({
                type: __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$features$2f$logistics$2f$context$2f$actions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ACTION_TYPES"].SET_ERROR,
                payload: error
            });
        } else {
            dispatch({
                type: __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$features$2f$logistics$2f$context$2f$actions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ACTION_TYPES"].CLEAR_ERROR
            });
        }
    }, []);
    const setUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((user)=>{
        dispatch({
            type: __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$features$2f$logistics$2f$context$2f$actions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ACTION_TYPES"].SET_USER,
            payload: user
        });
    }, []);
    const logout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        dispatch({
            type: __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$features$2f$logistics$2f$context$2f$actions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ACTION_TYPES"].LOGOUT
        });
    }, []);
    const value = {
        state,
        dispatch,
        setLoading,
        setError,
        setUser,
        logout
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(LogisticsContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/paddy/paddy-tms/src/features/logistics/context/LogisticsContext.tsx",
        lineNumber: 70,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/paddy/paddy-tms/src/providers/AuthProvider.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next-auth/react/index.js [app-ssr] (ecmascript)");
'use client';
;
;
function AuthProvider({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SessionProvider"], {
        children: children
    }, void 0, false, {
        fileName: "[project]/paddy/paddy-tms/src/providers/AuthProvider.tsx",
        lineNumber: 8,
        columnNumber: 5
    }, this);
}
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/dynamic-access-async-storage.external.js [external] (next/dist/server/app-render/dynamic-access-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/dynamic-access-async-storage.external.js", () => require("next/dist/server/app-render/dynamic-access-async-storage.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__6e246da9._.js.map