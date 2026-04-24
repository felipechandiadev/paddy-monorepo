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
"[project]/paddy/cargo/src/lib/auth.config.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "authOptions",
    ()=>authOptions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2d$auth$2f$providers$2f$credentials$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/node_modules/next-auth/providers/credentials.js [app-rsc] (ecmascript)");
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
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2d$auth$2f$providers$2f$credentials$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"])({
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
"[project]/paddy/cargo/src/actions/truckDispatchActions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"003735e412ed2deddc1fdbcf1fe861a020f9c8c491":"getDispatchesWeighingQueueTodayAction","40066322b36835c0bbffebf9cb55530e9049b126e0":"createTruckDispatchWithTareAction","40475b6f2300e3de90c7526504d197c0fa3aa1b0c2":"getTruckDispatchesGridAction","40b553985b3b3b051a32c47976f2e58950c0dde555":"deleteTruckDispatchAction","40baef2a9abe8f6f058d6c9010b4f2bd203b4b3ba2":"registerDispatchGrossWeightAction","40bec8354a80d7aa8048df99d619b1c6cc5bf2cf01":"getTruckDispatchByIdAction","605bc51c06be28337ea562d878a8747e3620424c9f":"updateTruckDispatchAction"},"",""] */ __turbopack_context__.s([
    "createTruckDispatchWithTareAction",
    ()=>createTruckDispatchWithTareAction,
    "deleteTruckDispatchAction",
    ()=>deleteTruckDispatchAction,
    "getDispatchesWeighingQueueTodayAction",
    ()=>getDispatchesWeighingQueueTodayAction,
    "getTruckDispatchByIdAction",
    ()=>getTruckDispatchByIdAction,
    "getTruckDispatchesGridAction",
    ()=>getTruckDispatchesGridAction,
    "registerDispatchGrossWeightAction",
    ()=>registerDispatchGrossWeightAction,
    "updateTruckDispatchAction",
    ()=>updateTruckDispatchAction
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/node_modules/next-auth/index.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$lib$2f$auth$2e$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/src/lib/auth.config.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
const API_URL = ("TURBOPACK compile-time value", "http://localhost:3000/api/v1") || 'http://localhost:3000/api/v1';
function parseDispatchFromApi(raw) {
    const producer = raw.producer;
    const st = String(raw.status ?? '').trim().toUpperCase();
    const status = st === 'FINISHED' ? 'FINISHED' : 'ESPERA';
    const product = raw.product != null ? String(raw.product) : undefined;
    const p = product === 'CASCARILLA' || product === 'ARROZ_PADDY' ? product : undefined;
    return {
        id: Number(raw.id),
        numero_turno: raw.numero_turno != null && !Number.isNaN(Number(raw.numero_turno)) ? Number(raw.numero_turno) : null,
        status,
        producer_id: Number(raw.producer_id ?? 0),
        product: p,
        producer,
        license_plate: String(raw.license_plate ?? ''),
        driver_name: raw.driver_name != null ? String(raw.driver_name) : null,
        carrier_company: raw.carrier_company != null ? String(raw.carrier_company) : undefined,
        dispatch_guide: raw.dispatch_guide != null ? String(raw.dispatch_guide) : undefined,
        gross_weight: raw.gross_weight != null ? Number(raw.gross_weight) : undefined,
        tare_weight: raw.tare_weight != null ? Number(raw.tare_weight) : undefined,
        net_weight: raw.net_weight != null ? Number(raw.net_weight) : undefined,
        entry_at: new Date(String(raw.entry_at ?? Date.now())),
        finished_at: raw.finished_at ? new Date(String(raw.finished_at)) : undefined,
        created_by: raw.created_by != null ? String(raw.created_by) : undefined
    };
}
async function getDispatchesWeighingQueueTodayAction() {
    try {
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getServerSession"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$lib$2f$auth$2e$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["authOptions"]);
        if (!session?.user?.accessToken) {
            return [];
        }
        const response = await fetch(`${API_URL}/logistics/turnos/dispatches/today`, {
            headers: {
                Authorization: `Bearer ${session.user.accessToken}`
            },
            cache: 'no-store'
        });
        if (!response.ok) {
            return [];
        }
        const result = await response.json();
        const dataArray = result.data || [];
        return dataArray.map(parseDispatchFromApi);
    } catch (error) {
        console.error('Error obteniendo cola despacho:', error);
        return [];
    }
}
async function createTruckDispatchWithTareAction(payload) {
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getServerSession"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$lib$2f$auth$2e$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["authOptions"]);
    if (!session?.user?.accessToken) {
        throw new Error('No autenticado');
    }
    const response = await fetch(`${API_URL}/logistics/truck-dispatches/with-tare`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.user.accessToken}`
        },
        body: JSON.stringify({
            producer_id: payload.producer_id,
            license_plate: payload.license_plate,
            driver_name: payload.driver_name,
            carrier_company: payload.carrier_company,
            dispatch_guide: payload.dispatch_guide,
            tare_weight: payload.tare_weight,
            product: payload.product,
            created_by: payload.created_by
        })
    });
    if (!response.ok) {
        let msg = `HTTP ${response.status}`;
        try {
            const err = await response.json();
            if (typeof err?.message === 'string') msg = err.message;
            else if (Array.isArray(err?.message)) msg = err.message.join('. ');
        } catch  {
        /* ignore */ }
        throw new Error(msg);
    }
    const result = await response.json();
    return parseDispatchFromApi(result.data);
}
async function registerDispatchGrossWeightAction(payload) {
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getServerSession"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$lib$2f$auth$2e$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["authOptions"]);
    if (!session?.user?.accessToken) {
        throw new Error('No autenticado');
    }
    const response = await fetch(`${API_URL}/logistics/weighings/dispatch-gross`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.user.accessToken}`
        },
        body: JSON.stringify({
            truck_dispatch_id: payload.truck_dispatch_id,
            gross_weight: payload.gross_weight,
            status: payload.status ?? 'FINISHED',
            created_by: payload.created_by
        })
    });
    if (!response.ok) {
        let msg = `HTTP ${response.status}`;
        try {
            const err = await response.json();
            if (typeof err?.message === 'string') msg = err.message;
            else if (Array.isArray(err?.message)) msg = err.message.join('. ');
        } catch  {
        /* ignore */ }
        throw new Error(msg);
    }
    const result = await response.json();
    return parseDispatchFromApi(result.data);
}
async function getTruckDispatchByIdAction(id) {
    try {
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getServerSession"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$lib$2f$auth$2e$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["authOptions"]);
        if (!session?.user?.accessToken) {
            throw new Error('No autenticado');
        }
        const response = await fetch(`${API_URL}/logistics/truck-dispatches/${id}`, {
            headers: {
                Authorization: `Bearer ${session.user.accessToken}`
            },
            cache: 'no-store'
        });
        if (!response.ok) {
            return null;
        }
        const result = await response.json();
        return parseDispatchFromApi(result.data);
    } catch (error) {
        console.error('Error obteniendo despacho:', error);
        return null;
    }
}
async function updateTruckDispatchAction(id, payload) {
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getServerSession"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$lib$2f$auth$2e$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["authOptions"]);
    if (!session?.user?.accessToken) {
        throw new Error('No autenticado');
    }
    const body = Object.fromEntries(Object.entries(payload).filter(([, v])=>v !== undefined));
    const response = await fetch(`${API_URL}/logistics/truck-dispatches/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.user.accessToken}`
        },
        body: JSON.stringify(body)
    });
    if (!response.ok) {
        let msg = `HTTP ${response.status}`;
        try {
            const err = await response.json();
            if (typeof err?.message === 'string') msg = err.message;
            else if (Array.isArray(err?.message)) msg = err.message.join('. ');
        } catch  {
        /* ignore */ }
        throw new Error(msg);
    }
    const result = await response.json();
    return parseDispatchFromApi(result.data);
}
async function deleteTruckDispatchAction(id) {
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getServerSession"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$lib$2f$auth$2e$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["authOptions"]);
    if (!session?.user?.accessToken) {
        throw new Error('No autenticado');
    }
    const response = await fetch(`${API_URL}/logistics/truck-dispatches/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${session.user.accessToken}`
        }
    });
    const responsePayload = await response.json().catch(()=>null);
    if (!response.ok) {
        const raw = responsePayload?.message;
        const msg = typeof raw === 'string' ? raw : Array.isArray(raw) ? raw.join('. ') : `HTTP ${response.status}`;
        throw new Error(msg);
    }
}
async function getTruckDispatchesGridAction(params) {
    try {
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getServerSession"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$lib$2f$auth$2e$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["authOptions"]);
        if (!session?.user?.accessToken) {
            return {
                rows: [],
                total: 0
            };
        }
        const limit = Math.min(Math.max(params.limit ?? 25, 1), 500);
        const offset = Math.max(params.offset ?? 0, 0);
        const qs = new URLSearchParams();
        qs.set('limit', String(limit));
        qs.set('offset', String(offset));
        if (params.search?.trim()) {
            qs.set('search', params.search.trim());
        }
        if (params.filters?.trim()) {
            qs.set('filters', params.filters.trim());
        }
        if (params.sort?.trim()) {
            qs.set('sort', params.sort.trim());
        }
        if (params.sortField?.trim()) {
            qs.set('sortField', params.sortField.trim());
        }
        const response = await fetch(`${API_URL}/logistics/truck-dispatches/grid?${qs.toString()}`, {
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
                product: r.product != null ? String(r.product) : undefined,
                producer_id: r.producer_id != null ? Number(r.producer_id) : undefined,
                license_plate: String(r.license_plate ?? ''),
                driver_name: String(r.driver_name ?? ''),
                carrier_company: r.carrier_company != null ? String(r.carrier_company) : null,
                dispatch_guide: r.dispatch_guide != null ? String(r.dispatch_guide) : null,
                gross_weight: r.gross_weight,
                tare_weight: r.tare_weight,
                net_weight: r.net_weight,
                entry_at: String(r.entry_at ?? ''),
                finished_at: r.finished_at != null ? String(r.finished_at) : null,
                producer_name: producer?.name ?? '',
                producer_rut: producer?.rut ?? ''
            };
        });
        return {
            rows,
            total
        };
    } catch (error) {
        console.error('Error grid despachos:', error);
        return {
            rows: [],
            total: 0
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getDispatchesWeighingQueueTodayAction,
    createTruckDispatchWithTareAction,
    registerDispatchGrossWeightAction,
    getTruckDispatchByIdAction,
    updateTruckDispatchAction,
    deleteTruckDispatchAction,
    getTruckDispatchesGridAction
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getDispatchesWeighingQueueTodayAction, "003735e412ed2deddc1fdbcf1fe861a020f9c8c491", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createTruckDispatchWithTareAction, "40066322b36835c0bbffebf9cb55530e9049b126e0", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(registerDispatchGrossWeightAction, "40baef2a9abe8f6f058d6c9010b4f2bd203b4b3ba2", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getTruckDispatchByIdAction, "40bec8354a80d7aa8048df99d619b1c6cc5bf2cf01", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateTruckDispatchAction, "605bc51c06be28337ea562d878a8747e3620424c9f", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteTruckDispatchAction, "40b553985b3b3b051a32c47976f2e58950c0dde555", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getTruckDispatchesGridAction, "40475b6f2300e3de90c7526504d197c0fa3aa1b0c2", null);
}),
"[project]/paddy/cargo/src/actions/fetchProducersAction.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"403780f9f3cbf4ac7c6190415e81ad5b3abe649d0d":"fetchProducersAction"},"",""] */ __turbopack_context__.s([
    "fetchProducersAction",
    ()=>fetchProducersAction
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/node_modules/next-auth/index.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$lib$2f$auth$2e$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/src/lib/auth.config.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
async function fetchProducersAction(params) {
    try {
        // Obtener la sesión del servidor usando NextAuth
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getServerSession"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$lib$2f$auth$2e$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["authOptions"]);
        if (!session?.user?.accessToken) {
            console.warn('No access token available in server session');
            return {
                data: [],
                total: 0,
                page: 1,
                limit: 5000
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
        // Ordenamiento (por defecto: nombre ascendente, para autocompletado en báscula)
        if (params?.sortField) {
            const field = params.sortField;
            const isAsc = params.sort === 'ASC';
            filtered.sort((a, b)=>{
                const aVal = a[field] || '';
                const bVal = b[field] || '';
                const comparison = String(aVal).localeCompare(String(bVal), 'es');
                return isAsc ? comparison : -comparison;
            });
        } else {
            filtered.sort((a, b)=>a.name.localeCompare(b.name, 'es', {
                    sensitivity: 'base'
                }));
        }
        // Paginación (límite alto por defecto para cargar catálogo completo en TMS)
        const page = params?.page || 1;
        const limit = params?.limit ?? 5000;
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
            limit: 5000
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    fetchProducersAction
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(fetchProducersAction, "403780f9f3cbf4ac7c6190415e81ad5b3abe649d0d", null);
}),
"[project]/paddy/cargo/src/actions/producerActions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"40f41787a47c7a56994ff86127b4aacb76e346a429":"createProducerAction"},"",""] */ __turbopack_context__.s([
    "createProducerAction",
    ()=>createProducerAction
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/node_modules/next-auth/index.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$lib$2f$auth$2e$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/src/lib/auth.config.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
const API_BASE_URL = `${("TURBOPACK compile-time value", "http://localhost:3000/api/v1")}/producers`;
function extractBackendErrorMessage(errorData, fallback) {
    const parseMessage = (value)=>{
        if (Array.isArray(value)) {
            const parsed = value.map((entry)=>{
                if (typeof entry === 'string') return entry;
                if (entry && typeof entry === 'object' && 'message' in entry) {
                    const nested = entry.message;
                    return typeof nested === 'string' ? nested : String(nested);
                }
                return String(entry);
            }).filter((entry)=>entry.trim().length > 0);
            return parsed.length > 0 ? parsed.join(', ') : null;
        }
        if (typeof value === 'string' && value.trim().length > 0) return value;
        return null;
    };
    if (!errorData || typeof errorData !== 'object') return fallback;
    const e = errorData;
    return parseMessage(e.message) || parseMessage(e.data?.message) || parseMessage(e.error) || fallback;
}
async function createProducerAction(data) {
    try {
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getServerSession"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$lib$2f$auth$2e$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["authOptions"]);
        const token = session?.user?.accessToken;
        if (!token) {
            return {
                success: false,
                error: 'No hay sesión activa'
            };
        }
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const errorData = await response.json().catch(()=>({}));
            const errorMessage = extractBackendErrorMessage(errorData, `Error al crear productor (${response.status})`);
            return {
                success: false,
                error: errorMessage
            };
        }
        const responseData = await response.json();
        const producerData = responseData.data ?? responseData;
        const id = typeof producerData.id === 'string' ? parseInt(producerData.id, 10) : Number(producerData.id);
        const normalized = {
            id,
            rut: String(producerData.rut ?? ''),
            name: String(producerData.name ?? ''),
            address: producerData.address != null ? String(producerData.address) : undefined,
            city: producerData.city != null ? String(producerData.city) : undefined,
            email: producerData.email != null ? String(producerData.email) : undefined,
            phone: producerData.phone != null ? String(producerData.phone) : undefined,
            contactPerson: producerData.contactPerson != null ? String(producerData.contactPerson) : undefined,
            isActive: Boolean(producerData.isActive)
        };
        return {
            success: true,
            data: normalized
        };
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error desconocido';
        return {
            success: false,
            error: message
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    createProducerAction
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createProducerAction, "40f41787a47c7a56994ff86127b4aacb76e346a429", null);
}),
"[project]/paddy/cargo/.next-internal/server/app/despachos/page/actions.js { ACTIONS_MODULE0 => \"[project]/paddy/cargo/src/actions/truckDispatchActions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/paddy/cargo/src/actions/fetchProducersAction.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE2 => \"[project]/paddy/cargo/src/actions/producerActions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$actions$2f$truckDispatchActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/src/actions/truckDispatchActions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$actions$2f$fetchProducersAction$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/src/actions/fetchProducersAction.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$actions$2f$producerActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/src/actions/producerActions.ts [app-rsc] (ecmascript)");
;
;
;
;
;
}),
"[project]/paddy/cargo/.next-internal/server/app/despachos/page/actions.js { ACTIONS_MODULE0 => \"[project]/paddy/cargo/src/actions/truckDispatchActions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/paddy/cargo/src/actions/fetchProducersAction.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE2 => \"[project]/paddy/cargo/src/actions/producerActions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "003735e412ed2deddc1fdbcf1fe861a020f9c8c491",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$actions$2f$truckDispatchActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getDispatchesWeighingQueueTodayAction"],
    "40066322b36835c0bbffebf9cb55530e9049b126e0",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$actions$2f$truckDispatchActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createTruckDispatchWithTareAction"],
    "403780f9f3cbf4ac7c6190415e81ad5b3abe649d0d",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$actions$2f$fetchProducersAction$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchProducersAction"],
    "40baef2a9abe8f6f058d6c9010b4f2bd203b4b3ba2",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$actions$2f$truckDispatchActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerDispatchGrossWeightAction"],
    "40f41787a47c7a56994ff86127b4aacb76e346a429",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$actions$2f$producerActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createProducerAction"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f2e$next$2d$internal$2f$server$2f$app$2f$despachos$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$paddy$2f$cargo$2f$src$2f$actions$2f$truckDispatchActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$paddy$2f$cargo$2f$src$2f$actions$2f$fetchProducersAction$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$paddy$2f$cargo$2f$src$2f$actions$2f$producerActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/paddy/cargo/.next-internal/server/app/despachos/page/actions.js { ACTIONS_MODULE0 => "[project]/paddy/cargo/src/actions/truckDispatchActions.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/paddy/cargo/src/actions/fetchProducersAction.ts [app-rsc] (ecmascript)", ACTIONS_MODULE2 => "[project]/paddy/cargo/src/actions/producerActions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$actions$2f$truckDispatchActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/src/actions/truckDispatchActions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$actions$2f$fetchProducersAction$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/src/actions/fetchProducersAction.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$actions$2f$producerActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/src/actions/producerActions.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__8846004a._.js.map