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
"[project]/paddy/paddy-tms/src/actions/truckReceptionActions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"0058bf6fa1bb2d34d98b2adb0dac6c98985b479206":"getNextTurnoAction","00e974fb0515369ecf82dada3ac5abce0639296144":"getTurnosTodayAction","4050d7ab117902baaf6257f90e6439786adcc08baa":"createTruckReceptionAction","408705be56ab210b83bde4817c26730e6db571ee8a":"getTruckReceptionByIdAction","40ebb88ba80441a75112e8cdf2a13620b182de3ab6":"recordTareWeightAction","60b1c6f4f3ede8e97388a43447f378cfab1b572bae":"updateTruckStatusAction","60bad2f729042d2e500828f3b11a9d08742469b1d9":"updateTruckTurnoAction"},"",""] */ __turbopack_context__.s([
    "createTruckReceptionAction",
    ()=>createTruckReceptionAction,
    "getNextTurnoAction",
    ()=>getNextTurnoAction,
    "getTruckReceptionByIdAction",
    ()=>getTruckReceptionByIdAction,
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
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
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
        console.log('Response from createTruckReceptionAction:', result);
        const truckData = result.data;
        if (!truckData.numero_turno) {
            console.warn('Warning: numero_turno no definido en respuesta:', truckData);
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
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
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
        console.log('Response from getTurnosTodayAction:', result);
        // El backend ahora retorna: { success, data: [...], timestamp }
        // Donde data es directamente el array de turnos
        const dataArray = result.data || [];
        console.log('Extracted turnos:', dataArray);
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
    getTurnosTodayAction,
    getTruckReceptionByIdAction,
    updateTruckStatusAction,
    updateTruckTurnoAction
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createTruckReceptionAction, "4050d7ab117902baaf6257f90e6439786adcc08baa", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(recordTareWeightAction, "40ebb88ba80441a75112e8cdf2a13620b182de3ab6", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getNextTurnoAction, "0058bf6fa1bb2d34d98b2adb0dac6c98985b479206", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getTurnosTodayAction, "00e974fb0515369ecf82dada3ac5abce0639296144", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getTruckReceptionByIdAction, "408705be56ab210b83bde4817c26730e6db571ee8a", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateTruckStatusAction, "60b1c6f4f3ede8e97388a43447f378cfab1b572bae", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateTruckTurnoAction, "60bad2f729042d2e500828f3b11a9d08742469b1d9", null);
}),
"[project]/paddy/paddy-tms/.next-internal/server/app/weighing/page/actions.js { ACTIONS_MODULE0 => \"[project]/paddy/paddy-tms/src/actions/truckReceptionActions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$actions$2f$truckReceptionActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/actions/truckReceptionActions.ts [app-rsc] (ecmascript)");
;
;
}),
"[project]/paddy/paddy-tms/.next-internal/server/app/weighing/page/actions.js { ACTIONS_MODULE0 => \"[project]/paddy/paddy-tms/src/actions/truckReceptionActions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "00e974fb0515369ecf82dada3ac5abce0639296144",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$actions$2f$truckReceptionActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getTurnosTodayAction"],
    "60bad2f729042d2e500828f3b11a9d08742469b1d9",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$actions$2f$truckReceptionActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateTruckTurnoAction"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f2e$next$2d$internal$2f$server$2f$app$2f$weighing$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$actions$2f$truckReceptionActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/paddy/paddy-tms/.next-internal/server/app/weighing/page/actions.js { ACTIONS_MODULE0 => "[project]/paddy/paddy-tms/src/actions/truckReceptionActions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$actions$2f$truckReceptionActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/actions/truckReceptionActions.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__ed4271e0._.js.map