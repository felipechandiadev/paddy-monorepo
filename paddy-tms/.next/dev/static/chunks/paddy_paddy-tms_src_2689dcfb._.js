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
"[project]/paddy/paddy-tms/src/features/logistics/services/authService.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getAuthToken",
    ()=>getAuthToken,
    "hasPermission",
    ()=>hasPermission,
    "hasRole",
    ()=>hasRole,
    "isAdmin",
    ()=>isAdmin,
    "isOperator",
    ()=>isOperator,
    "isViewer",
    ()=>isViewer,
    "login",
    ()=>login,
    "logout",
    ()=>logout,
    "validateAuth",
    ()=>validateAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const API_URL = ("TURBOPACK compile-time value", "http://localhost:3000/api/v1") || 'http://localhost:3000/api';
/**
 * Guarda el token en una cookie accesible desde el cliente
 */ const saveAuthToken = (token)=>{
    document.cookie = `auth_token=${token}; path=/; max-age=86400; SameSite=Lax`;
};
const getAuthToken = ()=>{
    if (typeof document === 'undefined') return null;
    const cookies = document.cookie.split(';');
    for (const cookie of cookies){
        const [name, value] = cookie.trim().split('=');
        if (name === 'auth_token') {
            return value;
        }
    }
    return null;
};
/**
 * Limpia el token de las cookies
 */ const clearAuthToken = ()=>{
    document.cookie = 'auth_token=; path=/; max-age=0';
};
const validateAuth = async ()=>{
    try {
        const token = getAuthToken();
        if (!token) {
            return null;
        }
        const response = await fetch(`${API_URL}/auth/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            credentials: 'include'
        });
        if (!response.ok) {
            clearAuthToken();
            return null;
        }
        return response.json();
    } catch (error) {
        console.error('Auth validation failed:', error);
        clearAuthToken();
        return null;
    }
};
const login = async (email, password)=>{
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            password
        }),
        credentials: 'include'
    });
    if (!response.ok) {
        throw new Error(`Login failed: ${response.statusText}`);
    }
    const data = await response.json();
    // Guardar el token en cookie si viene en la respuesta
    if (data.token) {
        saveAuthToken(data.token);
    }
    // Si el backend devuelve el token en un header, también lo guardamos
    const authHeader = response.headers.get('authorization');
    if (authHeader) {
        const token = authHeader.replace('Bearer ', '');
        saveAuthToken(token);
    }
    return data;
};
const logout = async ()=>{
    clearAuthToken();
    try {
        await fetch(`${API_URL}/auth/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
    } catch (error) {
        console.error('Logout error:', error);
    }
};
const hasPermission = (user, permission)=>{
    return user?.permissions.includes(permission) ?? false;
};
const hasRole = (user, role)=>{
    return user?.role === role;
};
const isAdmin = (user)=>{
    return hasRole(user, 'admin');
};
const isOperator = (user)=>{
    return hasRole(user, 'operator');
};
const isViewer = (user)=>{
    return hasRole(user, 'viewer');
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/paddy/paddy-tms/src/features/logistics/hooks/useAuth.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$features$2f$logistics$2f$hooks$2f$useLogistics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/features/logistics/hooks/useLogistics.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$features$2f$logistics$2f$services$2f$authService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/features/logistics/services/authService.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
const useAuth = ()=>{
    _s();
    const { state, setUser, setError } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$features$2f$logistics$2f$hooks$2f$useLogistics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLogistics"])();
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useAuth.useEffect": ()=>{
            const checkAuth = {
                "useAuth.useEffect.checkAuth": async ()=>{
                    try {
                        setIsLoading(true);
                        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$features$2f$logistics$2f$services$2f$authService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateAuth"])();
                        if (user) {
                            setUser(user);
                        }
                    } catch (error) {
                        const message = error instanceof Error ? error.message : 'Authentication failed';
                        setError(message);
                        setUser(null);
                    } finally{
                        setIsLoading(false);
                    }
                }
            }["useAuth.useEffect.checkAuth"];
            checkAuth();
        }
    }["useAuth.useEffect"], [
        setUser,
        setError
    ]);
    return {
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isLoading,
        hasPermission: (permission)=>state.user?.permissions.includes(permission) ?? false,
        hasRole: (role)=>state.user?.role === role
    };
};
_s(useAuth, "rGEvvUeX+VCM1hmyVVV45yZxI88=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$features$2f$logistics$2f$hooks$2f$useLogistics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLogistics"]
    ];
});
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
"[project]/paddy/paddy-tms/src/shared/components/ui/Select/Select.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
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
const Select = ({ label, options, placeholder, value = null, onChange, required = false, name, variant = 'default', compact = false, allowClear = false, disabled = false, className = '', ...props })=>{
    _s();
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [focused, setFocused] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isSelecting, setIsSelecting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [highlightedIndex, setHighlightedIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(-1);
    const selected = options.find((opt)=>opt.id === value);
    const shrink = focused || selected;
    const onChangeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(onChange);
    const triggerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Update ref when onChange changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Select.useEffect": ()=>{
            onChangeRef.current = onChange;
        }
    }["Select.useEffect"], [
        onChange
    ]);
    // Handle form validation
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
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
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
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
    const optionRefs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])([]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "select-container",
        children: variant === 'minimal' ? // Variante Minimal: Contenedor compacto con icono de despliegue
        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `flex items-center rounded-md border border-border bg-background ${compact ? 'py-1.5 text-xs' : 'py-2 text-sm'} transition-colors ${focused ? 'border-primary ring-2 ring-primary/20' : 'hover:border-border/80'} ${disabled ? 'bg-muted text-muted-foreground' : ''} ${hasClear ? compact ? 'pr-10 pl-2.5' : 'pr-12 pl-3' : compact ? 'pr-7 pl-2.5' : 'pr-8 pl-3'}`.trim(),
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                allowClear && value !== null && value !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$IconButton$2f$IconButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
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
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: `material-symbols-outlined pointer-events-none absolute ${hasClear ? 'right-3.5' : 'right-3'} top-1/2 -translate-y-1/2 text-base transition-colors ${focused ? 'text-primary' : 'text-secondary'}`,
                    "aria-hidden": "true",
                    children: "expand_more"
                }, void 0, false, {
                    fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/Select/Select.tsx",
                    lineNumber: 175,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$DropdownList$2f$DropdownList$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    open: open,
                    testId: "select-list",
                    highlightedIndex: highlightedIndex,
                    onHoverChange: (idx)=>{},
                    usePortal: true,
                    anchorRef: triggerRef,
                    children: options.map((opt, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                            ref: (el)=>{
                                optionRefs.current[idx] = el;
                            },
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$DropdownList$2f$DropdownList$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dropdownOptionClass"],
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
        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$TextField$2f$TextField$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextField"], {
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
                allowClear && value !== null && value !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$IconButton$2f$IconButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
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
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$IconButton$2f$IconButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
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
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$DropdownList$2f$DropdownList$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    open: open,
                    testId: "select-list",
                    highlightedIndex: highlightedIndex,
                    onHoverChange: (idx)=>{},
                    usePortal: true,
                    anchorRef: triggerRef,
                    children: options.map((opt, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                            ref: (el)=>{
                                optionRefs.current[idx] = el;
                            },
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$DropdownList$2f$DropdownList$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dropdownOptionClass"],
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
_s(Select, "0+M7oLd57DFUMco1/42BnoqCbDw=");
_c = Select;
const __TURBOPACK__default__export__ = Select;
var _c;
__turbopack_context__.k.register(_c, "Select");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
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
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$features$2f$logistics$2f$hooks$2f$useAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/features/logistics/hooks/useAuth.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$features$2f$logistics$2f$hooks$2f$useLogistics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/features/logistics/hooks/useLogistics.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$features$2f$logistics$2f$services$2f$authService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/features/logistics/services/authService.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$Button$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/shared/components/ui/Button/Button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$TextField$2f$TextField$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/shared/components/ui/TextField/TextField.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$Select$2f$Select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/shared/components/ui/Select/Select.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$Badge$2f$Badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/shared/components/ui/Badge/Badge.tsx [app-client] (ecmascript)");
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
;
;
function WeighingPage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { user, isAuthenticated, isLoading: authLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$features$2f$logistics$2f$hooks$2f$useAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const { setError } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$features$2f$logistics$2f$hooks$2f$useLogistics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLogistics"])();
    // Estado de UI
    const [selectedTruckId, setSelectedTruckId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showNewReceptionForm, setShowNewReceptionForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('ESPERA');
    // Datos de ejemplo (en producción vendría del backend)
    const [trucks, setTrucks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([
        {
            id: '1',
            numero_turno: 2,
            patente: 'XYZ-88',
            productor: 'Campo Verde S.A.',
            chofer_nombre: 'Juan Pérez',
            rut_chofer: '12.345.678-9',
            estado: 'ESPERA',
            fecha_entrada: new Date()
        },
        {
            id: '2',
            numero_turno: 3,
            patente: 'ABC-34',
            productor: 'Agrícola del Centro',
            chofer_nombre: 'Carlos García',
            rut_chofer: '15.678.901-2',
            estado: 'PESANDO_BRUTO',
            peso_bruto: 2500,
            fecha_entrada: new Date(Date.now() - 1800000)
        },
        {
            id: '3',
            numero_turno: 5,
            patente: 'DEF-67',
            productor: 'La Huerta',
            chofer_nombre: 'Maria López',
            rut_chofer: '18.901.234-5',
            estado: 'EN_DESCARGA',
            peso_bruto: 3200,
            tiempoDescarga: 1132,
            fecha_entrada: new Date(Date.now() - 3600000)
        },
        {
            id: '4',
            numero_turno: 1,
            patente: 'JKL-91',
            productor: 'Campos Dorados',
            chofer_nombre: 'Roberto Silva',
            rut_chofer: '19.234.567-8',
            estado: 'PESANDO_TARA',
            peso_bruto: 2150,
            fecha_entrada: new Date(Date.now() - 5400000)
        }
    ]);
    const [newReception, setNewReception] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        productor: '',
        patente: '',
        guia: '',
        chofer: '',
        rut: ''
    });
    const [weighingForm, setWeighingForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        pesoBruto: '',
        pesoTara: ''
    });
    // Redireccionar si no está autenticado
    __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useEffect({
        "WeighingPage.useEffect": ()=>{
            if (!authLoading && !isAuthenticated) {
                router.push('/login');
            }
        }
    }["WeighingPage.useEffect"], [
        isAuthenticated,
        authLoading,
        router
    ]);
    const handleLogout = async ()=>{
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$features$2f$logistics$2f$services$2f$authService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logout"])();
        router.push('/login');
    };
    const handleCreateReception = ()=>{
        if (!newReception.productor || !newReception.patente || !newReception.chofer) {
            setError('Completa todos los campos requeridos');
            return;
        }
        const nuevoCamion = {
            id: Date.now().toString(),
            numero_turno: trucks.length + 1,
            patente: newReception.patente,
            productor: newReception.productor,
            chofer_nombre: newReception.chofer,
            rut_chofer: newReception.rut,
            estado: 'ESPERA',
            fecha_entrada: new Date()
        };
        setTrucks([
            ...trucks,
            nuevoCamion
        ]);
        setNewReception({
            productor: '',
            patente: '',
            guia: '',
            chofer: '',
            rut: ''
        });
        setShowNewReceptionForm(false);
    };
    const handleConfirmBruto = ()=>{
        if (!weighingForm.pesoBruto) {
            setError('Ingresa el peso bruto');
            return;
        }
        setTrucks(trucks.map((t)=>t.id === selectedTruckId ? {
                ...t,
                peso_bruto: parseFloat(weighingForm.pesoBruto),
                estado: 'EN_DESCARGA',
                tiempoDescarga: 0
            } : t));
        setWeighingForm({
            pesoBruto: '',
            pesoTara: ''
        });
    };
    const handleConfirmTara = ()=>{
        if (!weighingForm.pesoTara) {
            setError('Ingresa el peso tara');
            return;
        }
        const pesoNeto = (trucks.find((t)=>t.id === selectedTruckId)?.peso_bruto || 0) - parseFloat(weighingForm.pesoTara);
        if (pesoNeto <= 0) {
            setError('El peso neto debe ser mayor a 0');
            return;
        }
        setTrucks(trucks.map((t)=>t.id === selectedTruckId ? {
                ...t,
                peso_tara: parseFloat(weighingForm.pesoTara),
                estado: 'FINALIZADO'
            } : t));
        setWeighingForm({
            pesoBruto: '',
            pesoTara: ''
        });
        setSelectedTruckId(null);
    };
    const selectedTruck = trucks.find((t)=>t.id === selectedTruckId);
    if (authLoading || !isAuthenticated) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen flex items-center justify-center bg-background",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"
                    }, void 0, false, {
                        fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                        lineNumber: 184,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-foreground mt-4",
                        children: "Loading..."
                    }, void 0, false, {
                        fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                        lineNumber: 185,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                lineNumber: 183,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
            lineNumber: 182,
            columnNumber: 7
        }, this);
    }
    const getEstadoColor = (estado)=>{
        switch(estado){
            case 'ESPERA':
                return '#2563a8';
            case 'PESANDO_BRUTO':
                return '#4CAF50';
            case 'EN_DESCARGA':
                return '#FFC107';
            case 'PESANDO_TARA':
                return '#FF9800';
            case 'FINALIZADO':
                return '#4CAF50';
            default:
                return '#6b7280';
        }
    };
    const getEstadoLabel = (estado)=>{
        switch(estado){
            case 'ESPERA':
                return 'En Espera';
            case 'PESANDO_BRUTO':
                return 'Pesaje Bruto';
            case 'EN_DESCARGA':
                return 'En Descarga';
            case 'PESANDO_TARA':
                return 'Pesaje Tara';
            case 'FINALIZADO':
                return 'Finalizado';
            default:
                return estado;
        }
    };
    const trucksByEstado = {
        ESPERA: trucks.filter((t)=>t.estado === 'ESPERA'),
        PESANDO_BRUTO: trucks.filter((t)=>t.estado === 'PESANDO_BRUTO'),
        EN_DESCARGA: trucks.filter((t)=>t.estado === 'EN_DESCARGA'),
        PESANDO_TARA: trucks.filter((t)=>t.estado === 'PESANDO_TARA'),
        FINALIZADO: trucks.filter((t)=>t.estado === 'FINALIZADO')
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-background flex flex-col",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "bg-white shadow sticky top-0 z-10",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between items-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        className: "text-2xl font-bold text-primary",
                                        children: "Panel de Pesaje"
                                    }, void 0, false, {
                                        fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                        lineNumber: 228,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-foreground mt-1",
                                        children: [
                                            "Operador: ",
                                            user?.name || 'Unknown'
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                        lineNumber: 229,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                lineNumber: 227,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleLogout,
                                className: "bg-error text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-colors",
                                children: "Logout"
                            }, void 0, false, {
                                fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                lineNumber: 233,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                        lineNumber: 226,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                    lineNumber: 225,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                lineNumber: 224,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 flex overflow-hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                        className: "w-64 bg-white shadow-lg border-r border-border overflow-y-auto",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-4 space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$Button$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "primary",
                                    className: "w-full",
                                    onClick: ()=>setShowNewReceptionForm(!showNewReceptionForm),
                                    children: "+ Nueva Recepción"
                                }, void 0, false, {
                                    fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                    lineNumber: 249,
                                    columnNumber: 13
                                }, this),
                                showNewReceptionForm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "p-3 bg-neutral rounded-lg border border-border space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$Select$2f$Select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            label: "Productor",
                                            value: newReception.productor,
                                            onChange: (value)=>setNewReception({
                                                    ...newReception,
                                                    productor: value
                                                }),
                                            options: [
                                                {
                                                    id: 'Campo Verde S.A.',
                                                    label: 'Campo Verde S.A.'
                                                },
                                                {
                                                    id: 'Agrícola del Centro',
                                                    label: 'Agrícola del Centro'
                                                },
                                                {
                                                    id: 'La Huerta',
                                                    label: 'La Huerta'
                                                }
                                            ]
                                        }, void 0, false, {
                                            fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                            lineNumber: 259,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$TextField$2f$TextField$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextField"], {
                                            label: "Patente",
                                            value: newReception.patente,
                                            onChange: (e)=>setNewReception({
                                                    ...newReception,
                                                    patente: e.target.value
                                                }),
                                            placeholder: "ABC-1234"
                                        }, void 0, false, {
                                            fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                            lineNumber: 269,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$TextField$2f$TextField$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextField"], {
                                            label: "Guía",
                                            value: newReception.guia,
                                            onChange: (e)=>setNewReception({
                                                    ...newReception,
                                                    guia: e.target.value
                                                }),
                                            placeholder: "Número guía"
                                        }, void 0, false, {
                                            fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                            lineNumber: 275,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$TextField$2f$TextField$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextField"], {
                                            label: "Chofer",
                                            value: newReception.chofer,
                                            onChange: (e)=>setNewReception({
                                                    ...newReception,
                                                    chofer: e.target.value
                                                }),
                                            placeholder: "Nombre"
                                        }, void 0, false, {
                                            fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                            lineNumber: 281,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$TextField$2f$TextField$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextField"], {
                                            label: "RUT",
                                            value: newReception.rut,
                                            onChange: (e)=>setNewReception({
                                                    ...newReception,
                                                    rut: e.target.value
                                                }),
                                            placeholder: "Opcional"
                                        }, void 0, false, {
                                            fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                            lineNumber: 287,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$Button$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                    variant: "primary",
                                                    className: "flex-1 text-sm",
                                                    onClick: handleCreateReception,
                                                    children: "Crear"
                                                }, void 0, false, {
                                                    fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                                    lineNumber: 294,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$Button$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                    variant: "secondary",
                                                    className: "flex-1 text-sm",
                                                    onClick: ()=>setShowNewReceptionForm(false),
                                                    children: "Cancelar"
                                                }, void 0, false, {
                                                    fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                                    lineNumber: 301,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                            lineNumber: 293,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                    lineNumber: 258,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-3",
                                    children: Object.entries(trucksByEstado).map(([estado, trucks])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-xs font-semibold text-muted uppercase mb-2 flex items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-3 h-3 rounded-full",
                                                            style: {
                                                                backgroundColor: getEstadoColor(estado)
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                                            lineNumber: 317,
                                                            columnNumber: 21
                                                        }, this),
                                                        getEstadoLabel(estado)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                                    lineNumber: 316,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-1 ml-2",
                                                    children: [
                                                        trucks.map((truck)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>setSelectedTruckId(truck.id),
                                                                className: `w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedTruckId === truck.id ? 'bg-primary text-white font-semibold' : 'bg-neutral text-foreground hover:bg-border'}`,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "font-mono font-bold",
                                                                        children: truck.patente
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                                                        lineNumber: 334,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "text-xs opacity-75",
                                                                        children: [
                                                                            "Turno #",
                                                                            truck.numero_turno
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                                                        lineNumber: 335,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, truck.id, true, {
                                                                fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                                                lineNumber: 325,
                                                                columnNumber: 23
                                                            }, this)),
                                                        trucks.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-xs text-muted italic",
                                                            children: "Sin camiones"
                                                        }, void 0, false, {
                                                            fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                                            lineNumber: 339,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                                    lineNumber: 323,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, estado, true, {
                                            fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                            lineNumber: 315,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                    lineNumber: 313,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                            lineNumber: 247,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                        lineNumber: 246,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                        className: "flex-1 overflow-y-auto p-6",
                        children: selectedTruck ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "max-w-2xl space-y-6",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white rounded-lg shadow-lg border-l-4 p-6",
                                style: {
                                    borderLeftColor: getEstadoColor(selectedTruck.estado)
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between items-start mb-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-3 mb-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                                className: "text-2xl font-bold text-foreground",
                                                                children: selectedTruck.patente
                                                            }, void 0, false, {
                                                                fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                                                lineNumber: 358,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$Badge$2f$Badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                variant: "primary",
                                                                children: [
                                                                    "Turno #",
                                                                    selectedTruck.numero_turno
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                                                lineNumber: 359,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                                        lineNumber: 357,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm text-muted",
                                                        children: getEstadoLabel(selectedTruck.estado)
                                                    }, void 0, false, {
                                                        fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                                        lineNumber: 363,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                                lineNumber: 356,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-right",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-xs text-muted",
                                                        children: "Entrada:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                                        lineNumber: 366,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-sm font-mono",
                                                        children: selectedTruck.fecha_entrada.toLocaleTimeString('es-CL')
                                                    }, void 0, false, {
                                                        fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                                        lineNumber: 367,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                                lineNumber: 365,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                        lineNumber: 355,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-border",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-muted",
                                                        children: "Productor"
                                                    }, void 0, false, {
                                                        fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                                        lineNumber: 376,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "font-semibold text-foreground",
                                                        children: selectedTruck.productor
                                                    }, void 0, false, {
                                                        fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                                        lineNumber: 377,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                                lineNumber: 375,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-muted",
                                                        children: "Chofer"
                                                    }, void 0, false, {
                                                        fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                                        lineNumber: 380,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "font-semibold text-foreground",
                                                        children: selectedTruck.chofer_nombre
                                                    }, void 0, false, {
                                                        fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                                        lineNumber: 381,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                                lineNumber: 379,
                                                columnNumber: 19
                                            }, this),
                                            selectedTruck.rut_chofer && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-muted",
                                                        children: "RUT"
                                                    }, void 0, false, {
                                                        fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                                        lineNumber: 385,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "font-semibold text-foreground",
                                                        children: selectedTruck.rut_chofer
                                                    }, void 0, false, {
                                                        fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                                        lineNumber: 386,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                                lineNumber: 384,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                        lineNumber: 374,
                                        columnNumber: 17
                                    }, this),
                                    selectedTruck.estado === 'ESPERA' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$Button$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "primary",
                                        className: "w-full",
                                        onClick: ()=>{
                                            setTrucks(trucks.map((t)=>t.id === selectedTruck.id ? {
                                                    ...t,
                                                    estado: 'PESANDO_BRUTO'
                                                } : t));
                                        },
                                        children: "Ir a Pesaje Bruto"
                                    }, void 0, false, {
                                        fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                        lineNumber: 393,
                                        columnNumber: 19
                                    }, this),
                                    selectedTruck.estado === 'PESANDO_BRUTO' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "p-4 bg-info/10 border border-info rounded-lg",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-info font-medium",
                                                    children: "Ingresa el peso bruto del camión"
                                                }, void 0, false, {
                                                    fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                                    lineNumber: 411,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                                lineNumber: 410,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$TextField$2f$TextField$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextField"], {
                                                label: "Peso Bruto (kg)",
                                                type: "number",
                                                value: weighingForm.pesoBruto,
                                                onChange: (e)=>setWeighingForm({
                                                        ...weighingForm,
                                                        pesoBruto: e.target.value
                                                    }),
                                                placeholder: "Ej: 2500"
                                            }, void 0, false, {
                                                fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                                lineNumber: 415,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$Button$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                        variant: "primary",
                                                        className: "flex-1",
                                                        onClick: handleConfirmBruto,
                                                        children: "Confirmar Peso Bruto"
                                                    }, void 0, false, {
                                                        fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                                        lineNumber: 423,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$Button$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                        variant: "secondary",
                                                        className: "flex-1",
                                                        onClick: ()=>setSelectedTruckId(null),
                                                        children: "Cancelar"
                                                    }, void 0, false, {
                                                        fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                                        lineNumber: 430,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                                lineNumber: 422,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                        lineNumber: 409,
                                        columnNumber: 19
                                    }, this),
                                    selectedTruck.estado === 'EN_DESCARGA' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "p-4 bg-warning/10 border border-warning rounded-lg",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm text-foreground font-medium",
                                                        children: [
                                                            "Peso Bruto: ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-bold",
                                                                children: [
                                                                    selectedTruck.peso_bruto,
                                                                    " kg"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                                                lineNumber: 445,
                                                                columnNumber: 37
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                                        lineNumber: 444,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-muted mt-2",
                                                        children: [
                                                            "Tiempo descargando: ",
                                                            Math.floor((selectedTruck.tiempoDescarga || 0) / 60),
                                                            ":",
                                                            String((selectedTruck.tiempoDescarga || 0) % 60).padStart(2, '0')
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                                        lineNumber: 447,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                                lineNumber: 443,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$Button$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                variant: "primary",
                                                className: "w-full",
                                                onClick: ()=>{
                                                    setTrucks(trucks.map((t)=>t.id === selectedTruck.id ? {
                                                            ...t,
                                                            estado: 'PESANDO_TARA'
                                                        } : t));
                                                },
                                                children: "Listo para Pesaje Tara"
                                            }, void 0, false, {
                                                fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                                lineNumber: 451,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                        lineNumber: 442,
                                        columnNumber: 19
                                    }, this),
                                    selectedTruck.estado === 'PESANDO_TARA' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-3 gap-4 p-4 bg-neutral rounded-lg",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs text-muted",
                                                                children: "Peso Bruto"
                                                            }, void 0, false, {
                                                                fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                                                lineNumber: 471,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "font-bold text-lg text-foreground",
                                                                children: [
                                                                    selectedTruck.peso_bruto,
                                                                    " kg"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                                                lineNumber: 472,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                                        lineNumber: 470,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs text-muted",
                                                                children: "Peso Tara"
                                                            }, void 0, false, {
                                                                fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                                                lineNumber: 475,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "font-bold text-lg text-foreground",
                                                                children: [
                                                                    weighingForm.pesoTara || '0',
                                                                    " kg"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                                                lineNumber: 476,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                                        lineNumber: 474,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs text-muted",
                                                                children: "Peso Neto"
                                                            }, void 0, false, {
                                                                fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                                                lineNumber: 479,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "font-bold text-lg text-success",
                                                                children: [
                                                                    weighingForm.pesoTara ? (selectedTruck.peso_bruto - parseFloat(weighingForm.pesoTara)).toFixed(0) : '0',
                                                                    " kg"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                                                lineNumber: 480,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                                        lineNumber: 478,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                                lineNumber: 469,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$TextField$2f$TextField$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextField"], {
                                                label: "Peso Tara (kg)",
                                                type: "number",
                                                value: weighingForm.pesoTara,
                                                onChange: (e)=>setWeighingForm({
                                                        ...weighingForm,
                                                        pesoTara: e.target.value
                                                    }),
                                                placeholder: "Ej: 400"
                                            }, void 0, false, {
                                                fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                                lineNumber: 487,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$Button$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                        variant: "primary",
                                                        className: "flex-1",
                                                        onClick: handleConfirmTara,
                                                        children: "Finalizar"
                                                    }, void 0, false, {
                                                        fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                                        lineNumber: 495,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$Button$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                        variant: "secondary",
                                                        className: "flex-1",
                                                        onClick: ()=>setSelectedTruckId(null),
                                                        children: "Cancelar"
                                                    }, void 0, false, {
                                                        fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                                        lineNumber: 502,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                                lineNumber: 494,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                        lineNumber: 468,
                                        columnNumber: 19
                                    }, this),
                                    selectedTruck.estado === 'FINALIZADO' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$Alert$2f$Alert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                variant: "success",
                                                children: "✓ Recepción completada exitosamente"
                                            }, void 0, false, {
                                                fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                                lineNumber: 515,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-3 gap-4 p-4 bg-success/10 border border-success rounded-lg",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs text-muted",
                                                                children: "Peso Bruto"
                                                            }, void 0, false, {
                                                                fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                                                lineNumber: 520,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "font-bold text-foreground",
                                                                children: [
                                                                    selectedTruck.peso_bruto,
                                                                    " kg"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                                                lineNumber: 521,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                                        lineNumber: 519,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs text-muted",
                                                                children: "Peso Tara"
                                                            }, void 0, false, {
                                                                fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                                                lineNumber: 524,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "font-bold text-foreground",
                                                                children: [
                                                                    selectedTruck.peso_tara,
                                                                    " kg"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                                                lineNumber: 525,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                                        lineNumber: 523,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs text-muted",
                                                                children: "Peso Neto"
                                                            }, void 0, false, {
                                                                fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                                                lineNumber: 528,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "font-bold text-foreground",
                                                                children: [
                                                                    (selectedTruck.peso_bruto - (selectedTruck.peso_tara || 0)).toFixed(0),
                                                                    " kg"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                                                lineNumber: 529,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                                        lineNumber: 527,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                                lineNumber: 518,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$Button$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                variant: "secondary",
                                                className: "w-full",
                                                onClick: ()=>setSelectedTruckId(null),
                                                children: "Volver al Panel"
                                            }, void 0, false, {
                                                fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                                lineNumber: 534,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                        lineNumber: 514,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                lineNumber: 353,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                            lineNumber: 351,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-full flex items-center justify-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xl text-foreground font-semibold mb-2",
                                        children: "Selecciona un camión"
                                    }, void 0, false, {
                                        fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                        lineNumber: 548,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-muted",
                                        children: "Haz click en un camión de la barra lateral para comenzar"
                                    }, void 0, false, {
                                        fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                        lineNumber: 549,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                                lineNumber: 547,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                            lineNumber: 546,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                        lineNumber: 349,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
                lineNumber: 244,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/paddy/paddy-tms/src/app/weighing/page.tsx",
        lineNumber: 222,
        columnNumber: 5
    }, this);
}
_s(WeighingPage, "SKOKwiQ+kJmlZ+8EgvhGBy0g9Z0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$features$2f$logistics$2f$hooks$2f$useAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$features$2f$logistics$2f$hooks$2f$useLogistics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLogistics"]
    ];
});
_c = WeighingPage;
var _c;
__turbopack_context__.k.register(_c, "WeighingPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=paddy_paddy-tms_src_2689dcfb._.js.map