module.exports = [
"[project]/paddy/paddy-tms/src/actions/fetchProducersAction.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"40943fe0fc99eb8d9cea89841d7ec7102a5dd85eac":"fetchProducersAction"},"",""] */ __turbopack_context__.s([
    "fetchProducersAction",
    ()=>fetchProducersAction
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '@/auth.config'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
async function fetchProducersAction(params) {
    try {
        const session = await auth();
        if (!session?.user) {
            throw new Error('No autenticado');
        }
        const API_BASE_URL = `${("TURBOPACK compile-time value", "http://localhost:3000/api/v1")}/producers`;
        const headers = {
            'Content-Type': 'application/json'
        };
        if (session.user.accessToken) {
            headers['Authorization'] = `Bearer ${session.user.accessToken}`;
        }
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
"[project]/paddy/paddy-tms/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/* eslint-disable import/no-extraneous-dependencies */ Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "registerServerReference", {
    enumerable: true,
    get: function() {
        return _server.registerServerReference;
    }
});
const _server = __turbopack_context__.r("[project]/paddy/paddy-tms/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)"); //# sourceMappingURL=server-reference.js.map
}),
"[project]/paddy/paddy-tms/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// This function ensures that all the exported values are valid server actions,
// during the runtime. By definition all actions are required to be async
// functions, but here we can only check that they are functions.
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ensureServerEntryExports", {
    enumerable: true,
    get: function() {
        return ensureServerEntryExports;
    }
});
function ensureServerEntryExports(actions) {
    for(let i = 0; i < actions.length; i++){
        const action = actions[i];
        if (typeof action !== 'function') {
            throw Object.defineProperty(new Error(`A "use server" file can only export async functions, found ${typeof action}.\nRead more: https://nextjs.org/docs/messages/invalid-use-server-value`), "__NEXT_ERROR_CODE", {
                value: "E352",
                enumerable: false,
                configurable: true
            });
        }
    }
} //# sourceMappingURL=action-validate.js.map
}),
];

//# sourceMappingURL=paddy_paddy-tms_f6191d44._.js.map