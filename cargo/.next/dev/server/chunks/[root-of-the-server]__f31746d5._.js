module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
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
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/paddy/paddy-tms/src/lib/auth.config.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "authOptions",
    ()=>authOptions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2d$auth$2f$providers$2f$credentials$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next-auth/providers/credentials.js [app-route] (ecmascript)");
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
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2d$auth$2f$providers$2f$credentials$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])({
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
"[project]/paddy/paddy-tms/src/app/api/auth/[...nextauth]/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>handler,
    "POST",
    ()=>handler
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next-auth/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$lib$2f$auth$2e$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/lib/auth.config.ts [app-route] (ecmascript)");
;
;
const handler = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$lib$2f$auth$2e$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["authOptions"]);
;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__f31746d5._.js.map