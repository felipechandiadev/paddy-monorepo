module.exports = [
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/paddy/paddy-tms/src/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/paddy/paddy-tms/src/app/layout.tsx [app-rsc] (ecmascript)"));
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
"[project]/paddy/paddy-tms/src/components/layout/TmsAppLayout.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TmsAppLayout",
    ()=>TmsAppLayout,
    "useTmsSerialPort",
    ()=>useTmsSerialPort
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const TmsAppLayout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call TmsAppLayout() from the server but TmsAppLayout is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/paddy/paddy-tms/src/components/layout/TmsAppLayout.tsx <module evaluation>", "TmsAppLayout");
const useTmsSerialPort = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call useTmsSerialPort() from the server but useTmsSerialPort is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/paddy/paddy-tms/src/components/layout/TmsAppLayout.tsx <module evaluation>", "useTmsSerialPort");
}),
"[project]/paddy/paddy-tms/src/components/layout/TmsAppLayout.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TmsAppLayout",
    ()=>TmsAppLayout,
    "useTmsSerialPort",
    ()=>useTmsSerialPort
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const TmsAppLayout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call TmsAppLayout() from the server but TmsAppLayout is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/paddy/paddy-tms/src/components/layout/TmsAppLayout.tsx", "TmsAppLayout");
const useTmsSerialPort = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call useTmsSerialPort() from the server but useTmsSerialPort is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/paddy/paddy-tms/src/components/layout/TmsAppLayout.tsx", "useTmsSerialPort");
}),
"[project]/paddy/paddy-tms/src/components/layout/TmsAppLayout.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$components$2f$layout$2f$TmsAppLayout$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/components/layout/TmsAppLayout.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$components$2f$layout$2f$TmsAppLayout$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/components/layout/TmsAppLayout.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$components$2f$layout$2f$TmsAppLayout$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/paddy/paddy-tms/src/app/despachos/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DespachosPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/client/app-dir/link.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next-auth/index.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$lib$2f$auth$2e$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/lib/auth.config.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$components$2f$layout$2f$TmsAppLayout$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/components/layout/TmsAppLayout.tsx [app-rsc] (ecmascript)");
;
;
;
;
;
;
async function DespachosPage() {
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getServerSession"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$lib$2f$auth$2e$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["authOptions"]);
    if (!session?.user) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])('/login?redirect=/despachos');
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$components$2f$layout$2f$TmsAppLayout$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TmsAppLayout"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
            className: "flex-1 p-6",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-2xl font-bold text-foreground tracking-tight",
                        children: "Despacho de carga"
                    }, void 0, false, {
                        fileName: "[project]/paddy/paddy-tms/src/app/despachos/page.tsx",
                        lineNumber: 18,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                        href: "/despachos/lista",
                        className: "btn-text cursor-pointer px-4 py-2 text-sm inline-flex items-center justify-center rounded-md",
                        children: "Lista de despachos"
                    }, void 0, false, {
                        fileName: "[project]/paddy/paddy-tms/src/app/despachos/page.tsx",
                        lineNumber: 19,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/paddy/paddy-tms/src/app/despachos/page.tsx",
                lineNumber: 17,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/paddy/paddy-tms/src/app/despachos/page.tsx",
            lineNumber: 16,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/paddy/paddy-tms/src/app/despachos/page.tsx",
        lineNumber: 15,
        columnNumber: 5
    }, this);
}
}),
"[project]/paddy/paddy-tms/src/app/despachos/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/paddy/paddy-tms/src/app/despachos/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__d13ed113._.js.map