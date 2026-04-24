(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/paddy/cargo/src/components/monitor/MonitorFullscreenButton.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MonitorFullscreenButton",
    ()=>MonitorFullscreenButton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$maximize$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Maximize2$3e$__ = __turbopack_context__.i("[project]/paddy/cargo/node_modules/lucide-react/dist/esm/icons/maximize-2.js [app-client] (ecmascript) <export default as Maximize2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minimize$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minimize2$3e$__ = __turbopack_context__.i("[project]/paddy/cargo/node_modules/lucide-react/dist/esm/icons/minimize-2.js [app-client] (ecmascript) <export default as Minimize2>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const MonitorFullscreenButton = ({ className = '' })=>{
    _s();
    const [isFullscreen, setIsFullscreen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MonitorFullscreenButton.useEffect": ()=>{
            const sync = {
                "MonitorFullscreenButton.useEffect.sync": ()=>{
                    setIsFullscreen(Boolean(document.fullscreenElement));
                }
            }["MonitorFullscreenButton.useEffect.sync"];
            sync();
            document.addEventListener('fullscreenchange', sync);
            return ({
                "MonitorFullscreenButton.useEffect": ()=>document.removeEventListener('fullscreenchange', sync)
            })["MonitorFullscreenButton.useEffect"];
        }
    }["MonitorFullscreenButton.useEffect"], []);
    const toggle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "MonitorFullscreenButton.useCallback[toggle]": async ()=>{
            try {
                if (!document.fullscreenElement) {
                    await document.documentElement.requestFullscreen();
                } else {
                    await document.exitFullscreen();
                }
            } catch (err) {
                console.warn('[MonitorFullscreen]', err);
            }
        }
    }["MonitorFullscreenButton.useCallback[toggle]"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "button",
        onClick: toggle,
        className: [
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
            className
        ].filter(Boolean).join(' '),
        title: isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa',
        "aria-label": isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa',
        children: isFullscreen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minimize$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minimize2$3e$__["Minimize2"], {
            className: "h-5 w-5",
            strokeWidth: 2
        }, void 0, false, {
            fileName: "[project]/paddy/cargo/src/components/monitor/MonitorFullscreenButton.tsx",
            lineNumber: 53,
            columnNumber: 9
        }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$maximize$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Maximize2$3e$__["Maximize2"], {
            className: "h-5 w-5",
            strokeWidth: 2
        }, void 0, false, {
            fileName: "[project]/paddy/cargo/src/components/monitor/MonitorFullscreenButton.tsx",
            lineNumber: 55,
            columnNumber: 9
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/paddy/cargo/src/components/monitor/MonitorFullscreenButton.tsx",
        lineNumber: 40,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(MonitorFullscreenButton, "3vMddapDe/cRKN7wEIfQ/ya+aVY=");
_c = MonitorFullscreenButton;
var _c;
__turbopack_context__.k.register(_c, "MonitorFullscreenButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/paddy/cargo/src/features/logistics/components/MonitorTopBar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MonitorTopBar",
    ()=>MonitorTopBar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wifi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wifi$3e$__ = __turbopack_context__.i("[project]/paddy/cargo/node_modules/lucide-react/dist/esm/icons/wifi.js [app-client] (ecmascript) <export default as Wifi>");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wifi$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__WifiOff$3e$__ = __turbopack_context__.i("[project]/paddy/cargo/node_modules/lucide-react/dist/esm/icons/wifi-off.js [app-client] (ecmascript) <export default as WifiOff>");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$components$2f$monitor$2f$MonitorFullscreenButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/src/components/monitor/MonitorFullscreenButton.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function formatClock(d) {
    return d.toLocaleTimeString('es-CL', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
}
const MonitorTopBar = ({ connected })=>{
    _s();
    const [now, setNow] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "MonitorTopBar.useState": ()=>new Date()
    }["MonitorTopBar.useState"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MonitorTopBar.useEffect": ()=>{
            const t = setInterval({
                "MonitorTopBar.useEffect.t": ()=>setNow(new Date())
            }["MonitorTopBar.useEffect.t"], 1000);
            return ({
                "MonitorTopBar.useEffect": ()=>clearInterval(t)
            })["MonitorTopBar.useEffect"];
        }
    }["MonitorTopBar.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: "bg-background border-b border-border shadow-sm shrink-0",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "px-6 py-4",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between gap-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-4 min-w-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: "/logo.svg",
                                alt: "Paddy AyG",
                                className: "h-10 w-auto shrink-0"
                            }, void 0, false, {
                                fileName: "[project]/paddy/cargo/src/features/logistics/components/MonitorTopBar.tsx",
                                lineNumber: 34,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col min-w-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-3xl font-bold text-primary leading-tight",
                                        children: "Paddy AyG"
                                    }, void 0, false, {
                                        fileName: "[project]/paddy/cargo/src/features/logistics/components/MonitorTopBar.tsx",
                                        lineNumber: 36,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm text-muted-foreground -mt-0.5",
                                        children: "Monitor De Espera"
                                    }, void 0, false, {
                                        fileName: "[project]/paddy/cargo/src/features/logistics/components/MonitorTopBar.tsx",
                                        lineNumber: 37,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/paddy/cargo/src/features/logistics/components/MonitorTopBar.tsx",
                                lineNumber: 35,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/paddy/cargo/src/features/logistics/components/MonitorTopBar.tsx",
                        lineNumber: 33,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2 md:gap-3 shrink-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-right tabular-nums",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-4xl md:text-5xl font-semibold tracking-tight text-foreground leading-none",
                                    children: formatClock(now)
                                }, void 0, false, {
                                    fileName: "[project]/paddy/cargo/src/features/logistics/components/MonitorTopBar.tsx",
                                    lineNumber: 45,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/paddy/cargo/src/features/logistics/components/MonitorTopBar.tsx",
                                lineNumber: 44,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "flex items-center justify-center",
                                role: "status",
                                "aria-label": connected ? 'Conectado al servidor' : 'Sin conexión en vivo, reconectando',
                                children: connected ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wifi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wifi$3e$__["Wifi"], {
                                    className: "h-7 w-7 md:h-8 md:w-8 text-success",
                                    strokeWidth: 2,
                                    "aria-hidden": true
                                }, void 0, false, {
                                    fileName: "[project]/paddy/cargo/src/features/logistics/components/MonitorTopBar.tsx",
                                    lineNumber: 57,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wifi$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__WifiOff$3e$__["WifiOff"], {
                                    className: "h-7 w-7 md:h-8 md:w-8 text-muted-foreground animate-pulse",
                                    strokeWidth: 2,
                                    "aria-hidden": true
                                }, void 0, false, {
                                    fileName: "[project]/paddy/cargo/src/features/logistics/components/MonitorTopBar.tsx",
                                    lineNumber: 63,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/paddy/cargo/src/features/logistics/components/MonitorTopBar.tsx",
                                lineNumber: 49,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$components$2f$monitor$2f$MonitorFullscreenButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MonitorFullscreenButton"], {}, void 0, false, {
                                fileName: "[project]/paddy/cargo/src/features/logistics/components/MonitorTopBar.tsx",
                                lineNumber: 70,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/paddy/cargo/src/features/logistics/components/MonitorTopBar.tsx",
                        lineNumber: 43,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/paddy/cargo/src/features/logistics/components/MonitorTopBar.tsx",
                lineNumber: 32,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/paddy/cargo/src/features/logistics/components/MonitorTopBar.tsx",
            lineNumber: 31,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/paddy/cargo/src/features/logistics/components/MonitorTopBar.tsx",
        lineNumber: 30,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(MonitorTopBar, "aIQ63u2pSAvMwtVQMX73MhWGFJ4=");
_c = MonitorTopBar;
var _c;
__turbopack_context__.k.register(_c, "MonitorTopBar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/paddy/cargo/src/features/logistics/components/MonitorDisplay.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MonitorDisplay",
    ()=>MonitorDisplay
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
'use client';
;
function formatEntryTime(iso) {
    try {
        return new Date(iso).toLocaleTimeString('es-CL', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    } catch  {
        return '—';
    }
}
function QueueCard({ item, variant }) {
    const isWeighing = variant === 'weighing';
    const isNext = variant === 'next';
    const metaClass = isWeighing ? 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl' : isNext ? 'text-xl sm:text-2xl md:text-3xl lg:text-4xl' : 'text-lg sm:text-xl md:text-2xl lg:text-3xl';
    const plateClass = isWeighing ? 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-primary' : isNext ? 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-foreground' : 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-foreground/90';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: [
            'rounded-2xl border-2 w-full transition-shadow',
            'px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10',
            isWeighing ? 'border-primary bg-primary/10 shadow-lg ring-2 ring-primary/30' : isNext ? 'border-amber-500/70 bg-amber-500/5 shadow-md' : 'border-border bg-card/80'
        ].join(' '),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: [
                    'grid w-full grid-cols-3 items-center gap-3 sm:gap-6 md:gap-8',
                    'min-h-[1.2em]'
                ].join(' '),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: [
                            'justify-self-start text-left tabular-nums font-semibold text-foreground',
                            metaClass
                        ].join(' '),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-medium text-muted-foreground",
                                children: "Turno"
                            }, void 0, false, {
                                fileName: "[project]/paddy/cargo/src/features/logistics/components/MonitorDisplay.tsx",
                                lineNumber: 65,
                                columnNumber: 11
                            }, this),
                            ' ',
                            item.numero_turno ?? '—'
                        ]
                    }, void 0, true, {
                        fileName: "[project]/paddy/cargo/src/features/logistics/components/MonitorDisplay.tsx",
                        lineNumber: 59,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: [
                            'justify-self-center text-center font-bold tracking-wide min-w-0 px-1',
                            plateClass
                        ].join(' '),
                        children: item.license_plate
                    }, void 0, false, {
                        fileName: "[project]/paddy/cargo/src/features/logistics/components/MonitorDisplay.tsx",
                        lineNumber: 68,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: [
                            'justify-self-end text-right tabular-nums font-semibold text-foreground',
                            metaClass
                        ].join(' '),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-medium text-muted-foreground",
                                children: "Ingreso"
                            }, void 0, false, {
                                fileName: "[project]/paddy/cargo/src/features/logistics/components/MonitorDisplay.tsx",
                                lineNumber: 82,
                                columnNumber: 11
                            }, this),
                            ' ',
                            formatEntryTime(item.entry_at)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/paddy/cargo/src/features/logistics/components/MonitorDisplay.tsx",
                        lineNumber: 76,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/paddy/cargo/src/features/logistics/components/MonitorDisplay.tsx",
                lineNumber: 53,
                columnNumber: 7
            }, this),
            isWeighing && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-center text-base sm:text-lg md:text-xl font-semibold text-primary mt-4 md:mt-5 uppercase tracking-wide",
                children: "En balanza"
            }, void 0, false, {
                fileName: "[project]/paddy/cargo/src/features/logistics/components/MonitorDisplay.tsx",
                lineNumber: 87,
                columnNumber: 9
            }, this),
            isNext && !isWeighing && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-center text-sm sm:text-base md:text-lg font-semibold text-amber-700 dark:text-amber-400 mt-3 md:mt-4",
                children: "Siguiente"
            }, void 0, false, {
                fileName: "[project]/paddy/cargo/src/features/logistics/components/MonitorDisplay.tsx",
                lineNumber: 92,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/paddy/cargo/src/features/logistics/components/MonitorDisplay.tsx",
        lineNumber: 42,
        columnNumber: 5
    }, this);
}
_c = QueueCard;
const MonitorDisplay = ({ state, error })=>{
    const weighingId = state?.weighingTruckReceptionId ?? null;
    const waiting = state?.waiting ?? [];
    const weighingItem = weighingId ? waiting.find((w)=>w.id === weighingId) ?? null : null;
    /** Mantiene el orden que envía el backend (tras drag-and-drop en pesaje). */ const orderedRest = [
        ...waiting
    ].filter((w)=>w.id !== weighingId);
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "rounded-xl border border-destructive/40 bg-destructive/10 p-8 text-center",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-destructive font-medium",
                    children: "Error de conexión en tiempo real"
                }, void 0, false, {
                    fileName: "[project]/paddy/cargo/src/features/logistics/components/MonitorDisplay.tsx",
                    lineNumber: 120,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-destructive/80 text-sm mt-2",
                    children: error
                }, void 0, false, {
                    fileName: "[project]/paddy/cargo/src/features/logistics/components/MonitorDisplay.tsx",
                    lineNumber: 121,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-muted-foreground text-xs mt-4",
                    children: "Compruebe que el backend esté en ejecución y que CORS permita este origen."
                }, void 0, false, {
                    fileName: "[project]/paddy/cargo/src/features/logistics/components/MonitorDisplay.tsx",
                    lineNumber: 122,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/paddy/cargo/src/features/logistics/components/MonitorDisplay.tsx",
            lineNumber: 119,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            !state && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-4 w-full",
                children: [
                    1,
                    2,
                    3
                ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-40 sm:h-48 md:h-56 rounded-2xl bg-muted animate-pulse w-full"
                    }, i, false, {
                        fileName: "[project]/paddy/cargo/src/features/logistics/components/MonitorDisplay.tsx",
                        lineNumber: 134,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)))
            }, void 0, false, {
                fileName: "[project]/paddy/cargo/src/features/logistics/components/MonitorDisplay.tsx",
                lineNumber: 132,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            state && waiting.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-center text-muted-foreground py-16 text-lg",
                children: "No hay turnos registrados para hoy."
            }, void 0, false, {
                fileName: "[project]/paddy/cargo/src/features/logistics/components/MonitorDisplay.tsx",
                lineNumber: 143,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            state && waiting.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-4 md:gap-6 w-full",
                children: [
                    weighingItem && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(QueueCard, {
                        item: weighingItem,
                        variant: "weighing"
                    }, void 0, false, {
                        fileName: "[project]/paddy/cargo/src/features/logistics/components/MonitorDisplay.tsx",
                        lineNumber: 151,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    orderedRest.map((item, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(QueueCard, {
                            item: item,
                            variant: idx === 0 ? 'next' : 'queue'
                        }, item.id, false, {
                            fileName: "[project]/paddy/cargo/src/features/logistics/components/MonitorDisplay.tsx",
                            lineNumber: 154,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)))
                ]
            }, void 0, true, {
                fileName: "[project]/paddy/cargo/src/features/logistics/components/MonitorDisplay.tsx",
                lineNumber: 149,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/paddy/cargo/src/features/logistics/components/MonitorDisplay.tsx",
        lineNumber: 130,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c1 = MonitorDisplay;
var _c, _c1;
__turbopack_context__.k.register(_c, "QueueCard");
__turbopack_context__.k.register(_c1, "MonitorDisplay");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/paddy/cargo/src/lib/logisticsSocket.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createLogisticsSocket",
    ()=>createLogisticsSocket,
    "emitEsperaQueueOrder",
    ()=>emitEsperaQueueOrder,
    "getLogisticsSocketBaseUrl",
    ()=>getLogisticsSocketBaseUrl,
    "getSharedWeighingLogisticsSocket",
    ()=>getSharedWeighingLogisticsSocket
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/paddy/cargo/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$socket$2e$io$2d$client$2f$build$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/paddy/cargo/node_modules/socket.io-client/build/esm/index.js [app-client] (ecmascript) <locals>");
;
function getLogisticsSocketBaseUrl() {
    const api = __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_WS_URL || ("TURBOPACK compile-time value", "http://localhost:3000/api/v1") || 'http://localhost:3000/api/v1';
    try {
        const u = new URL(api);
        return `${u.protocol}//${u.host}`;
    } catch  {
        return 'http://localhost:3000';
    }
}
function createLogisticsSocket() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$socket$2e$io$2d$client$2f$build$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["io"])(`${getLogisticsSocketBaseUrl()}/logistics`, {
        transports: [
            'websocket',
            'polling'
        ],
        reconnection: true,
        reconnectionAttempts: 12,
        reconnectionDelay: 1500
    });
}
/**
 * Socket compartido para la pantalla de pesaje (selección en balanza + orden de cola).
 * El monitor usa su propia conexión vía createLogisticsSocket.
 */ let sharedWeighingSocket = null;
function getSharedWeighingLogisticsSocket() {
    if (!sharedWeighingSocket) {
        sharedWeighingSocket = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$socket$2e$io$2d$client$2f$build$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["io"])(`${getLogisticsSocketBaseUrl()}/logistics`, {
            transports: [
                'websocket',
                'polling'
            ],
            reconnection: true,
            reconnectionAttempts: 12,
            reconnectionDelay: 1500
        });
    }
    return sharedWeighingSocket;
}
function emitEsperaQueueOrder(orderedIds) {
    const s = getSharedWeighingLogisticsSocket();
    const payload = {
        ordered_ids: orderedIds
    };
    const send = ()=>s.emit('espera-queue-order', payload);
    if (s.connected) {
        send();
    } else {
        s.once('connect', send);
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/paddy/cargo/src/features/logistics/hooks/useMonitorQueueSocket.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useMonitorQueueSocket",
    ()=>useMonitorQueueSocket
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$lib$2f$logisticsSocket$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/src/lib/logisticsSocket.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function useMonitorQueueSocket() {
    _s();
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [connected, setConnected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useMonitorQueueSocket.useEffect": ()=>{
            const socket = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$lib$2f$logisticsSocket$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createLogisticsSocket"])();
            const onState = {
                "useMonitorQueueSocket.useEffect.onState": (payload)=>{
                    setState(payload);
                    setError(null);
                }
            }["useMonitorQueueSocket.useEffect.onState"];
            socket.on('connect', {
                "useMonitorQueueSocket.useEffect": ()=>{
                    setConnected(true);
                    setError(null);
                }
            }["useMonitorQueueSocket.useEffect"]);
            socket.on('disconnect', {
                "useMonitorQueueSocket.useEffect": ()=>setConnected(false)
            }["useMonitorQueueSocket.useEffect"]);
            socket.on('connect_error', {
                "useMonitorQueueSocket.useEffect": (e)=>{
                    setError(e.message || 'No se pudo conectar al servidor en tiempo real');
                }
            }["useMonitorQueueSocket.useEffect"]);
            socket.on('monitor-state', onState);
            return ({
                "useMonitorQueueSocket.useEffect": ()=>{
                    socket.off('monitor-state', onState);
                    socket.disconnect();
                }
            })["useMonitorQueueSocket.useEffect"];
        }
    }["useMonitorQueueSocket.useEffect"], []);
    return {
        state,
        connected,
        error
    };
}
_s(useMonitorQueueSocket, "8F75orO3vF6vjI4pqOjWKysKH50=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/paddy/cargo/src/app/monitor/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MonitorPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$features$2f$logistics$2f$components$2f$MonitorTopBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/src/features/logistics/components/MonitorTopBar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$features$2f$logistics$2f$components$2f$MonitorDisplay$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/src/features/logistics/components/MonitorDisplay.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$features$2f$logistics$2f$hooks$2f$useMonitorQueueSocket$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/cargo/src/features/logistics/hooks/useMonitorQueueSocket.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function MonitorPage() {
    _s();
    const { state, connected, error } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$features$2f$logistics$2f$hooks$2f$useMonitorQueueSocket$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMonitorQueueSocket"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-background flex flex-col",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$features$2f$logistics$2f$components$2f$MonitorTopBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MonitorTopBar"], {
                connected: connected
            }, void 0, false, {
                fileName: "[project]/paddy/cargo/src/app/monitor/page.tsx",
                lineNumber: 13,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "flex-1 w-full px-4 sm:px-6 lg:px-10 py-6",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$features$2f$logistics$2f$components$2f$MonitorDisplay$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MonitorDisplay"], {
                    state: state,
                    error: error
                }, void 0, false, {
                    fileName: "[project]/paddy/cargo/src/app/monitor/page.tsx",
                    lineNumber: 15,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/paddy/cargo/src/app/monitor/page.tsx",
                lineNumber: 14,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/paddy/cargo/src/app/monitor/page.tsx",
        lineNumber: 12,
        columnNumber: 5
    }, this);
}
_s(MonitorPage, "l0TkgzGMssMO2si8+ejBV2it/Xk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$cargo$2f$src$2f$features$2f$logistics$2f$hooks$2f$useMonitorQueueSocket$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMonitorQueueSocket"]
    ];
});
_c = MonitorPage;
var _c;
__turbopack_context__.k.register(_c, "MonitorPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=paddy_cargo_src_2b0cff11._.js.map