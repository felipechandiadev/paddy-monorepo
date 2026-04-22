module.exports = [
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/assert [external] (assert, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("assert", () => require("assert"));

module.exports = mod;
}),
"[externals]/querystring [external] (querystring, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("querystring", () => require("querystring"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[project]/paddy/paddy-tms/src/lib/auth.config.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "authOptions",
    ()=>authOptions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2d$auth$2f$providers$2f$credentials$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next-auth/providers/credentials.js [app-rsc] (ecmascript)");
;
const LOCAL_BACKEND_API_URL = "http://localhost:3000/api/v1";
const AUTH_BACKEND_TIMEOUT_MS = 10000;
function resolveBackendApiUrl() {
    const configuredUrl = process.env.BACKEND_API_URL || process.env.NEXTAUTH_BACKEND_URL || ("TURBOPACK compile-time value", "http://localhost:3000/api/v1");
    if (configuredUrl && configuredUrl.trim().length > 0) {
        return configuredUrl.replace(/\/+$/, "");
    }
    if ("TURBOPACK compile-time truthy", 1) {
        return LOCAL_BACKEND_API_URL;
    }
    //TURBOPACK unreachable
    ;
}
async function fetchWithTimeout(input, init, timeoutMs = AUTH_BACKEND_TIMEOUT_MS) {
    const controller = new AbortController();
    const timeout = setTimeout(()=>controller.abort(), timeoutMs);
    try {
        return await fetch(input, {
            ...init,
            signal: controller.signal
        });
    } finally{
        clearTimeout(timeout);
    }
}
function readMessageFromPayload(payload) {
    if (!payload || typeof payload !== "object") {
        return null;
    }
    const source = payload;
    const candidates = [
        source.message,
        source.error,
        source.data?.message
    ];
    for (const candidate of candidates){
        if (typeof candidate === "string" && candidate.trim().length > 0) {
            return candidate;
        }
        if (Array.isArray(candidate) && candidate.length > 0) {
            const merged = candidate.map((entry)=>typeof entry === "string" ? entry.trim() : "").filter(Boolean).join(" | ");
            if (merged.length > 0) {
                return merged;
            }
        }
    }
    return null;
}
const authOptions = {
    providers: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2d$auth$2f$providers$2f$credentials$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"])({
            name: "Credentials",
            credentials: {
                email: {
                    label: "Email",
                    type: "email"
                },
                password: {
                    label: "Contraseña",
                    type: "password"
                }
            },
            async authorize (credentials, _req) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Credenciales inválidas");
                }
                try {
                    const apiUrl = resolveBackendApiUrl();
                    const loginUrl = `${apiUrl}/auth/login`;
                    let response;
                    try {
                        response = await fetchWithTimeout(loginUrl, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                email: credentials.email,
                                password: credentials.password
                            })
                        });
                    } catch (error) {
                        if (error instanceof Error && error.name === "AbortError") {
                            throw new Error("AUTH_BACKEND_TIMEOUT");
                        }
                        throw new Error("AUTH_BACKEND_UNREACHABLE");
                    }
                    const rawResponse = await response.text();
                    let payload = null;
                    if (rawResponse) {
                        try {
                            payload = JSON.parse(rawResponse);
                        } catch  {
                            payload = null;
                        }
                    }
                    if (response.status === 401 || response.status === 403) {
                        return null;
                    }
                    if (!response.ok) {
                        const message = readMessageFromPayload(payload) || rawResponse.slice(0, 200) || `Backend returned ${response.status}`;
                        throw new Error(message);
                    }
                    if (!payload || typeof payload !== "object") {
                        throw new Error("AUTH_BACKEND_INVALID_JSON_RESPONSE");
                    }
                    const data = payload;
                    const accessToken = data?.data?.access_token;
                    const userId = data?.data?.userId;
                    const email = data?.data?.email;
                    const role = data?.data?.role;
                    if (!accessToken || !userId || !email || !role) {
                        throw new Error("AUTH_BACKEND_INVALID_PAYLOAD");
                    }
                    // Return user object with token (matching Paddy API response)
                    return {
                        id: String(userId),
                        name: data.data?.name || email,
                        email,
                        role,
                        accessToken,
                        permissions: data.data?.permissions ?? []
                    };
                } catch (error) {
                    console.error("NextAuth login error:", error);
                    throw error;
                }
            }
        })
    ],
    callbacks: {
        async jwt ({ token, user }) {
            // Add user data and token to JWT on sign in
            if (user) {
                console.log('✅ JWT callback - Adding user to token:', user.email);
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
                token.role = user.role;
                token.accessToken = user.accessToken;
                token.permissions = user.permissions ?? [];
            }
            return token;
        },
        async session ({ session, token }) {
            console.log('🔄 Session callback - Token exists:', !!token.accessToken);
            // Add user data to session
            if (session.user) {
                session.user.id = token.id;
                session.user.name = token.name ?? session.user.name;
                session.user.email = token.email ?? session.user.email;
                session.user.role = token.role;
                session.user.accessToken = token.accessToken;
                session.user.permissions = token.permissions ?? [];
                // Refresh mutable profile fields from backend to avoid stale UI after user edits.
                // This is optional - if it fails, the session is still valid with cached data
                if (token.accessToken) {
                    try {
                        const apiUrl = resolveBackendApiUrl();
                        const meResponse = await fetchWithTimeout(`${apiUrl}/auth/me`, {
                            method: 'GET',
                            headers: {
                                Authorization: `Bearer ${token.accessToken}`
                            },
                            cache: 'no-store'
                        });
                        if (meResponse.ok) {
                            const rawMePayload = await meResponse.text();
                            if (rawMePayload) {
                                try {
                                    const mePayload = JSON.parse(rawMePayload);
                                    const meData = mePayload?.data ?? mePayload;
                                    session.user.id = String(meData.userId ?? session.user.id);
                                    session.user.name = String(meData.name ?? session.user.name ?? '');
                                    session.user.email = String(meData.email ?? session.user.email ?? '');
                                    session.user.role = String(meData.role ?? session.user.role ?? '');
                                    if (Array.isArray(meData.permissions)) {
                                        session.user.permissions = meData.permissions;
                                    }
                                } catch (parseError) {
                                    console.warn('Failed to parse /auth/me response:', parseError);
                                // Continue with cached data
                                }
                            }
                        }
                    } catch (error) {
                        // Don't fail the session if backend is unreachable
                        // The client-side validation will handle it
                        console.warn('Unable to refresh auth profile from backend /auth/me:', error);
                    }
                }
            }
            return session;
        }
    },
    pages: {
        signIn: "/"
    },
    session: {
        strategy: "jwt",
        maxAge: 24 * 60 * 60
    },
    secret: process.env.NEXTAUTH_SECRET || "paddy-tms-secret-key-2026"
};
}),
"[project]/paddy/paddy-tms/src/lib/formatChileanRut.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/paddy/paddy-tms/src/actions/truckReceptionActions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"0058bf6fa1bb2d34d98b2adb0dac6c98985b479206":"getNextTurnoAction","00e974fb0515369ecf82dada3ac5abce0639296144":"getTurnosTodayAction","4028bdcaafef50d4cfa9add8e7c0e3be6b012b148e":"getTruckReceptionsGridAction","4050d7ab117902baaf6257f90e6439786adcc08baa":"createTruckReceptionAction","408705be56ab210b83bde4817c26730e6db571ee8a":"getTruckReceptionByIdAction","40ebb88ba80441a75112e8cdf2a13620b182de3ab6":"recordTareWeightAction","60b1c6f4f3ede8e97388a43447f378cfab1b572bae":"updateTruckStatusAction","60bad2f729042d2e500828f3b11a9d08742469b1d9":"updateTruckTurnoAction"},"",""] */ __turbopack_context__.s([
    "createTruckReceptionAction",
    ()=>createTruckReceptionAction,
    "getNextTurnoAction",
    ()=>getNextTurnoAction,
    "getTruckReceptionByIdAction",
    ()=>getTruckReceptionByIdAction,
    "getTruckReceptionsGridAction",
    ()=>getTruckReceptionsGridAction,
    "getTurnosTodayAction",
    ()=>getTurnosTodayAction,
    "recordTareWeightAction",
    ()=>recordTareWeightAction,
    "updateTruckStatusAction",
    ()=>updateTruckStatusAction,
    "updateTruckTurnoAction",
    ()=>updateTruckTurnoAction
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next-auth/index.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$lib$2f$auth$2e$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/lib/auth.config.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$lib$2f$formatChileanRut$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/lib/formatChileanRut.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
const API_URL = ("TURBOPACK compile-time value", "http://localhost:3000/api/v1") || 'http://localhost:3000/api/v1';
async function createTruckReceptionAction(payload) {
    try {
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getServerSession"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$lib$2f$auth$2e$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["authOptions"]);
        if (!session?.user?.accessToken) {
            throw new Error('No autenticado');
        }
        const response = await fetch(`${API_URL}/logistics/truck-receptions/with-gross-weight`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session.user.accessToken}`
            },
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
            try {
                const errorBody = await response.json();
                if (errorBody.message) {
                    errorMessage = errorBody.message;
                }
            } catch  {
            // Si no se puede parsear el error, usar el mensaje generico
            }
            throw new Error(errorMessage);
        }
        const result = await response.json();
        const truckData = result.data;
        if (!truckData.numero_turno) {
        // numero_turno no definido en respuesta
        }
        return truckData;
    } catch (error) {
        console.error('Error creando recepcion:', error);
        throw error;
    }
}
async function recordTareWeightAction(payload) {
    try {
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getServerSession"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$lib$2f$auth$2e$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["authOptions"]);
        if (!session?.user?.accessToken) {
            throw new Error('No autenticado');
        }
        const response = await fetch(`${API_URL}/logistics/weighings/tare`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session.user.accessToken}`
            },
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
            try {
                const errorBody = await response.json();
                if (errorBody.message) {
                    errorMessage = errorBody.message;
                }
            } catch  {
            // Si no se puede parsear el error, usar el mensaje generico
            }
            throw new Error(errorMessage);
        }
        const result = await response.json();
        return result.data;
    } catch (error) {
        console.error('Error registrando peso tara:', error);
        throw error;
    }
}
async function getNextTurnoAction() {
    try {
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getServerSession"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$lib$2f$auth$2e$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["authOptions"]);
        if (!session?.user?.accessToken) {
            throw new Error('No autenticado');
        }
        const response = await fetch(`${API_URL}/logistics/turnos/next-today`, {
            headers: {
                Authorization: `Bearer ${session.user.accessToken}`
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        const result = await response.json();
        return result.data.numero_turno;
    } catch (error) {
        console.error('Error obteniendo turno:', error);
        throw error;
    }
}
async function getTruckReceptionsGridAction(params) {
    try {
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getServerSession"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$lib$2f$auth$2e$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["authOptions"]);
        if (!session?.user?.accessToken) {
            return {
                rows: [],
                total: 0
            };
        }
        const limit = Math.min(Math.max(params.limit ?? 25, 1), 500);
        const offset = Math.max(params.offset ?? 0, 0);
        const response = await fetch(`${API_URL}/logistics/truck-receptions/grid?limit=${limit}&offset=${offset}`, {
            headers: {
                Authorization: `Bearer ${session.user.accessToken}`
            },
            cache: 'no-store'
        });
        if (!response.ok) {
            return {
                rows: [],
                total: 0
            };
        }
        const result = await response.json();
        const payload = result.data;
        const raw = payload?.data ?? [];
        const total = typeof payload?.total === 'number' ? payload.total : raw.length;
        const rows = raw.map((r)=>{
            const producer = r.producer;
            return {
                id: Number(r.id),
                status: String(r.status ?? ''),
                license_plate: String(r.license_plate ?? ''),
                driver_name: String(r.driver_name ?? ''),
                carrier_company: r.carrier_company != null ? String(r.carrier_company) : null,
                dispatch_guide: r.dispatch_guide != null ? String(r.dispatch_guide) : null,
                gross_weight: r.gross_weight,
                tare_weight: r.tare_weight,
                net_weight: r.net_weight,
                entry_at: r.entry_at != null ? String(r.entry_at) : '',
                finished_at: r.finished_at != null ? String(r.finished_at) : null,
                producer_name: producer?.name ?? '',
                producer_rut: producer?.rut != null ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$lib$2f$formatChileanRut$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatChileanRut"])(String(producer.rut)) : ''
            };
        });
        return {
            rows,
            total
        };
    } catch  {
        return {
            rows: [],
            total: 0
        };
    }
}
async function getTurnosTodayAction() {
    try {
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getServerSession"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$lib$2f$auth$2e$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["authOptions"]);
        if (!session?.user?.accessToken) {
            console.warn('No autenticado para obtener turnos');
            return [];
        }
        const response = await fetch(`${API_URL}/logistics/turnos/today`, {
            headers: {
                Authorization: `Bearer ${session.user.accessToken}`
            }
        });
        if (!response.ok) {
            console.warn(`Error ${response.status} obteniendo turnos del backend`);
            return [];
        }
        const result = await response.json();
        // El backend ahora retorna: { success, data: [...], timestamp }
        // Donde data es directamente el array de turnos
        const dataArray = result.data || [];
        return dataArray;
    } catch (error) {
        console.error('Error obteniendo turnos:', error);
        return [];
    }
}
async function getTruckReceptionByIdAction(id) {
    try {
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getServerSession"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$lib$2f$auth$2e$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["authOptions"]);
        if (!session?.user?.accessToken) {
            throw new Error('No autenticado');
        }
        const response = await fetch(`${API_URL}/logistics/truck-receptions/${id}`, {
            headers: {
                Authorization: `Bearer ${session.user.accessToken}`
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        const result = await response.json();
        return result.data;
    } catch (error) {
        console.error('Error obteniendo recepcion:', error);
        return null;
    }
}
async function updateTruckStatusAction(id, status) {
    try {
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getServerSession"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$lib$2f$auth$2e$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["authOptions"]);
        if (!session?.user?.accessToken) {
            throw new Error('No autenticado');
        }
        const response = await fetch(`${API_URL}/logistics/truck-receptions/${id}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session.user.accessToken}`
            },
            body: JSON.stringify({
                status
            })
        });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const result = await response.json();
        return result.data;
    } catch (error) {
        console.error('Error actualizando estado del camion:', error);
        throw error;
    }
}
async function updateTruckTurnoAction(id, numeroTurno) {
    try {
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getServerSession"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$lib$2f$auth$2e$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["authOptions"]);
        if (!session?.user?.accessToken) {
            throw new Error('No autenticado');
        }
        const response = await fetch(`${API_URL}/logistics/truck-receptions/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session.user.accessToken}`
            },
            body: JSON.stringify({
                numero_turno: numeroTurno
            })
        });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const result = await response.json();
        return result.data;
    } catch (error) {
        console.error('Error actualizando turno del camion:', error);
        throw error;
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    createTruckReceptionAction,
    recordTareWeightAction,
    getNextTurnoAction,
    getTruckReceptionsGridAction,
    getTurnosTodayAction,
    getTruckReceptionByIdAction,
    updateTruckStatusAction,
    updateTruckTurnoAction
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createTruckReceptionAction, "4050d7ab117902baaf6257f90e6439786adcc08baa", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(recordTareWeightAction, "40ebb88ba80441a75112e8cdf2a13620b182de3ab6", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getNextTurnoAction, "0058bf6fa1bb2d34d98b2adb0dac6c98985b479206", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getTruckReceptionsGridAction, "4028bdcaafef50d4cfa9add8e7c0e3be6b012b148e", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getTurnosTodayAction, "00e974fb0515369ecf82dada3ac5abce0639296144", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getTruckReceptionByIdAction, "408705be56ab210b83bde4817c26730e6db571ee8a", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateTruckStatusAction, "60b1c6f4f3ede8e97388a43447f378cfab1b572bae", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateTruckTurnoAction, "60bad2f729042d2e500828f3b11a9d08742469b1d9", null);
}),
"[project]/paddy/paddy-tms/src/actions/fetchProducersAction.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"40943fe0fc99eb8d9cea89841d7ec7102a5dd85eac":"fetchProducersAction"},"",""] */ __turbopack_context__.s([
    "fetchProducersAction",
    ()=>fetchProducersAction
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next-auth/index.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$lib$2f$auth$2e$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/lib/auth.config.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
async function fetchProducersAction(params) {
    try {
        // Obtener la sesión del servidor usando NextAuth
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getServerSession"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$lib$2f$auth$2e$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["authOptions"]);
        if (!session?.user?.accessToken) {
            console.warn('No access token available in server session');
            return {
                data: [],
                total: 0,
                page: 1,
                limit: 10
            };
        }
        const API_BASE_URL = `${("TURBOPACK compile-time value", "http://localhost:3000/api/v1")}/producers`;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.user.accessToken}`
        };
        // Fetch desde el backend
        const response = await fetch(API_BASE_URL, {
            method: 'GET',
            headers,
            cache: 'no-store'
        });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const result = await response.json();
        // Normalizar datos
        const normalizedData = (result.data || result || []).map((producer)=>({
                id: producer.id,
                name: producer.name || '',
                rut: producer.rut || '',
                email: producer.email,
                city: producer.city
            }));
        // Filtrado en cliente
        let filtered = normalizedData;
        if (params?.search) {
            const searchLower = params.search.toLowerCase();
            filtered = filtered.filter((p)=>p.name.toLowerCase().includes(searchLower) || p.rut.toLowerCase().includes(searchLower) || p.email?.toLowerCase().includes(searchLower) || p.city?.toLowerCase().includes(searchLower));
        }
        // Ordenamiento
        if (params?.sortField) {
            const field = params.sortField;
            const isAsc = params.sort === 'ASC';
            filtered.sort((a, b)=>{
                const aVal = a[field] || '';
                const bVal = b[field] || '';
                const comparison = String(aVal).localeCompare(String(bVal), 'es');
                return isAsc ? comparison : -comparison;
            });
        }
        // Paginación
        const page = params?.page || 1;
        const limit = params?.limit || 10;
        const start = (page - 1) * limit;
        const paginatedData = filtered.slice(start, start + limit);
        return {
            data: paginatedData,
            total: filtered.length,
            page,
            limit
        };
    } catch (error) {
        console.error('Error en fetchProducersAction:', error);
        return {
            data: [],
            total: 0,
            page: 1,
            limit: 10
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    fetchProducersAction
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(fetchProducersAction, "40943fe0fc99eb8d9cea89841d7ec7102a5dd85eac", null);
}),
"[project]/paddy/paddy-tms/.next-internal/server/app/weighing/page/actions.js { ACTIONS_MODULE0 => \"[project]/paddy/paddy-tms/src/actions/truckReceptionActions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/paddy/paddy-tms/src/actions/fetchProducersAction.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$actions$2f$truckReceptionActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/actions/truckReceptionActions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$actions$2f$fetchProducersAction$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/actions/fetchProducersAction.ts [app-rsc] (ecmascript)");
;
;
;
;
;
}),
"[project]/paddy/paddy-tms/.next-internal/server/app/weighing/page/actions.js { ACTIONS_MODULE0 => \"[project]/paddy/paddy-tms/src/actions/truckReceptionActions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/paddy/paddy-tms/src/actions/fetchProducersAction.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "00e974fb0515369ecf82dada3ac5abce0639296144",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$actions$2f$truckReceptionActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getTurnosTodayAction"],
    "4050d7ab117902baaf6257f90e6439786adcc08baa",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$actions$2f$truckReceptionActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createTruckReceptionAction"],
    "40943fe0fc99eb8d9cea89841d7ec7102a5dd85eac",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$actions$2f$fetchProducersAction$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchProducersAction"],
    "40ebb88ba80441a75112e8cdf2a13620b182de3ab6",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$actions$2f$truckReceptionActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["recordTareWeightAction"],
    "60bad2f729042d2e500828f3b11a9d08742469b1d9",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$actions$2f$truckReceptionActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateTruckTurnoAction"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f2e$next$2d$internal$2f$server$2f$app$2f$weighing$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$actions$2f$truckReceptionActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$actions$2f$fetchProducersAction$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/paddy/paddy-tms/.next-internal/server/app/weighing/page/actions.js { ACTIONS_MODULE0 => "[project]/paddy/paddy-tms/src/actions/truckReceptionActions.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/paddy/paddy-tms/src/actions/fetchProducersAction.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$actions$2f$truckReceptionActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/actions/truckReceptionActions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$actions$2f$fetchProducersAction$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/actions/fetchProducersAction.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__e1a09151._.js.map