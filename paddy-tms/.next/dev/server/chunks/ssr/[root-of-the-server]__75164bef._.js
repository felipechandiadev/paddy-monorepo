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
            // Add user data to session
            if (session.user) {
                session.user.id = token.id;
                session.user.name = token.name ?? session.user.name;
                session.user.email = token.email ?? session.user.email;
                session.user.role = token.role;
                session.user.accessToken = token.accessToken;
                session.user.permissions = token.permissions ?? [];
                // Refresh mutable profile fields from backend to avoid stale UI after user edits.
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
                        if (!rawMePayload) {
                            return session;
                        }
                        const mePayload = JSON.parse(rawMePayload);
                        const meData = mePayload?.data ?? mePayload;
                        session.user.id = String(meData.userId ?? session.user.id);
                        session.user.name = String(meData.name ?? session.user.name ?? '');
                        session.user.email = String(meData.email ?? session.user.email ?? '');
                        session.user.role = String(meData.role ?? session.user.role ?? '');
                        if (Array.isArray(meData.permissions)) {
                            session.user.permissions = meData.permissions;
                        }
                    }
                } catch (error) {
                    console.warn('Unable to refresh auth profile from backend /auth/me', error);
                }
            }
            return session;
        }
    },
    pages: {
        signIn: "/login"
    },
    session: {
        strategy: "jwt",
        maxAge: 24 * 60 * 60
    },
    secret: process.env.NEXTAUTH_SECRET || "paddy-tms-secret-key-2026"
};
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
        const API_BASE_URL = `${("TURBOPACK compile-time value", "http://localhost:3000/api/v1")}/general-data/producers`;
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
"[project]/paddy/paddy-tms/.next-internal/server/app/weighing/page/actions.js { ACTIONS_MODULE0 => \"[project]/paddy/paddy-tms/src/actions/fetchProducersAction.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$actions$2f$fetchProducersAction$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/actions/fetchProducersAction.ts [app-rsc] (ecmascript)");
;
}),
"[project]/paddy/paddy-tms/.next-internal/server/app/weighing/page/actions.js { ACTIONS_MODULE0 => \"[project]/paddy/paddy-tms/src/actions/fetchProducersAction.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "40943fe0fc99eb8d9cea89841d7ec7102a5dd85eac",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$actions$2f$fetchProducersAction$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchProducersAction"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f2e$next$2d$internal$2f$server$2f$app$2f$weighing$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$actions$2f$fetchProducersAction$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/paddy/paddy-tms/.next-internal/server/app/weighing/page/actions.js { ACTIONS_MODULE0 => "[project]/paddy/paddy-tms/src/actions/fetchProducersAction.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$actions$2f$fetchProducersAction$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/actions/fetchProducersAction.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__75164bef._.js.map