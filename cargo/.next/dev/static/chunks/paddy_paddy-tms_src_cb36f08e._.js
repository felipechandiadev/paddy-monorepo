(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Toolbar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$IconButton$2f$IconButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/shared/components/ui/IconButton/IconButton.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const Toolbar = ({ filterMode = false, onToggleFilterMode, columns = [], title = '', onExportExcel, showSortButton = true, showFilterButton = true, showExportButton = true })=>{
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    // TODO: Implement useAlert hook
    // const { showAlert } = useAlert();
    // Determine active sortField from URL
    const activeSortField = searchParams.get('sortField');
    // First visible column field
    const firstVisible = columns.find((c)=>!c.hide)?.field;
    const handleQuickSort = ()=>{
        if (!firstVisible) return;
        const params = new URLSearchParams(searchParams.toString());
        if (isSortActive) {
            // If already active, remove sorting params
            params.delete('sort');
            params.delete('sortField');
        } else {
            // Activate sort on first visible column
            params.set('sort', 'asc');
            params.set('sortField', firstVisible);
            params.set('page', '1');
        }
        router.replace(`${pathname}?${params.toString()}`);
    };
    const handleExportExcel = async ()=>{
        if (onExportExcel) {
            try {
                await onExportExcel();
            } catch (error) {
                console.error('Error exporting to Excel:', error);
            // TODO: uncomment when useAlert hook is implemented
            // showAlert({ message: 'Error al exportar a Excel', type: 'error', duration: 4000 });
            }
        } else {
        // TODO: uncomment when useAlert hook is implemented
        // showAlert({ message: 'Exportación no disponible', type: 'warning', duration: 4000 });
        }
    };
    const isSortActive = activeSortField === firstVisible;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex justify-end items-center gap-4 py-2",
        "data-test-id": "data-grid-toolbar",
        children: [
            showSortButton && firstVisible ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$IconButton$2f$IconButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                variant: "text",
                title: "Ordenar por primer campo (asc)",
                onClick: handleQuickSort,
                icon: "sort",
                className: isSortActive ? 'text-primary' : 'text-secondary',
                style: {
                    fontSize: 20,
                    width: 20,
                    height: 20,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }
            }, void 0, false, {
                fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Toolbar.tsx",
                lineNumber: 79,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)) : null,
            showFilterButton ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$IconButton$2f$IconButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                variant: "text",
                title: filterMode ? 'Desactivar filtros' : 'Filtrar',
                onClick: ()=>{
                    const params = new URLSearchParams(searchParams.toString());
                    if (filterMode) {
                        // Clear filters when deactivating
                        params.delete('filters');
                        params.delete('filtration');
                        router.replace(`${pathname}?${params.toString()}`);
                    } else {
                        // Activate filtration when enabling filter mode
                        params.set('filtration', 'true');
                        router.replace(`${pathname}?${params.toString()}`);
                    }
                    onToggleFilterMode?.();
                },
                icon: filterMode ? 'filter_alt_off' : 'filter_alt',
                className: "text-secondary",
                style: {
                    fontSize: 20,
                    width: 20,
                    height: 20,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }
            }, void 0, false, {
                fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Toolbar.tsx",
                lineNumber: 91,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)) : null,
            showExportButton ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$IconButton$2f$IconButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                variant: "text",
                title: "Exportar a Excel",
                onClick: handleExportExcel,
                icon: "file_download",
                className: "text-secondary",
                style: {
                    fontSize: 20,
                    width: 20,
                    height: 20,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }
            }, void 0, false, {
                fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Toolbar.tsx",
                lineNumber: 115,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)) : null
        ]
    }, void 0, true, {
        fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Toolbar.tsx",
        lineNumber: 76,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(Toolbar, "66hrdMMH0WyruZN7frcpeuU7V/k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"]
    ];
});
_c = Toolbar;
const __TURBOPACK__default__export__ = Toolbar;
var _c;
__turbopack_context__.k.register(_c, "Toolbar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/paddy/paddy-tms/src/lib/formatChileanRut.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$lib$2f$formatChileanRut$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/lib/formatChileanRut.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
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
        const formattedValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$lib$2f$formatChileanRut$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatChileanRut"])(rawValue);
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
                    lineNumber: 369,
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
                    lineNumber: 378,
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
                    lineNumber: 386,
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
                            lineNumber: 411,
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
                                lineNumber: 456,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/TextField/TextField.tsx",
                            lineNumber: 438,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/TextField/TextField.tsx",
                    lineNumber: 410,
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
                            lineNumber: 481,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/TextField/TextField.tsx",
                    lineNumber: 469,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                placeholderColor && placeholderClassRef.current && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                    children: `input.${placeholderClassRef.current}::placeholder, textarea.${placeholderClassRef.current}::placeholder { color: ${placeholderColor} }`
                }, void 0, false, {
                    fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/TextField/TextField.tsx",
                    lineNumber: 486,
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
                    lineNumber: 488,
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
                            lineNumber: 502,
                            columnNumber: 22
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/TextField/TextField.tsx",
                    lineNumber: 495,
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
                    lineNumber: 505,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/TextField/TextField.tsx",
            lineNumber: 367,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/TextField/TextField.tsx",
        lineNumber: 366,
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
"[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/utils/columnStyles.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DataGridStyles",
    ()=>DataGridStyles,
    "calculateColumnStyles",
    ()=>calculateColumnStyles,
    "useScreenSize",
    ()=>useScreenSize
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
function useScreenSize() {
    _s();
    // Provide a SSR-safe initial state - use 1024 to match server
    const getInitial = ()=>({
            width: 1024,
            height: 768,
            isMobile: false,
            isTablet: false,
            isDesktop: true
        });
    const [screenSize, setScreenSize] = __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useState(getInitial);
    __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useEffect({
        "useScreenSize.useEffect": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            const handleResize = {
                "useScreenSize.useEffect.handleResize": ()=>{
                    setScreenSize({
                        width: window.innerWidth,
                        height: window.innerHeight,
                        isMobile: window.innerWidth < 640,
                        isTablet: window.innerWidth >= 640 && window.innerWidth < 1024,
                        isDesktop: window.innerWidth >= 1024
                    });
                }
            }["useScreenSize.useEffect.handleResize"];
            window.addEventListener('resize', handleResize);
            return ({
                "useScreenSize.useEffect": ()=>window.removeEventListener('resize', handleResize)
            })["useScreenSize.useEffect"];
        }
    }["useScreenSize.useEffect"], []);
    return screenSize;
}
_s(useScreenSize, "XkaZQIYOwbzsXB/dk3xm0AsL36g=");
/**
 * Calcula el ancho mínimo inteligente basado en el tamaño de pantalla y el texto del header
 */ function getSmartMinWidth(baseMinWidth, screenWidth, totalColumns, headerText = '') {
    // Calcular ancho mínimo basado en el texto del header
    // Estimación más precisa: caracteres anchos (W, M, etc.) ~10px, caracteres normales ~7px
    const wideChars = (headerText.match(/[WMwm]/g) || []).length;
    const normalChars = headerText.length - wideChars;
    const headerTextWidth = wideChars * 10 + normalChars * 7 + 32; // 32px para padding interno
    // Ancho mínimo nunca debe ser menor que el necesario para el header
    const headerBasedMinWidth = Math.max(60, headerTextWidth);
    // En móviles (< 640px):
    // - Calcula espacio disponible después de padding
    // - Distribuye equitativamente entre columnas
    // - Mínimo garantizado: 35px para legibilidad
    if (screenWidth < 640) {
        // Calculamos cuánto espacio tenemos disponible después de padding
        const availableWidth = screenWidth - 32; // 16px padding left + 16px padding right
        const calculatedMinWidth = Math.max(35, Math.floor(availableWidth / totalColumns));
        // No reducimos por debajo del ancho necesario para el header
        return Math.max(headerBasedMinWidth, calculatedMinWidth);
    }
    // En tablets (640px - 1024px):
    // - Reduce minWidth en 20% para mejor adaptación
    // - Pero nunca por debajo del ancho del header
    if (screenWidth < 1024) {
        return Math.max(headerBasedMinWidth, Math.max(40, baseMinWidth * 0.8));
    }
    // En desktop (> 1024px):
    // - Usa el ancho base definido, pero nunca menor que el necesario para el header
    return Math.max(headerBasedMinWidth, baseMinWidth);
}
function calculateColumnStyles(columns, screenWidth = 1024) {
    const visibleColumns = columns.filter((c)=>!c.hide);
    const hasFlex = visibleColumns.some((c)=>typeof c.flex === 'number');
    return visibleColumns.map((col, idx)=>{
        const style = {};
        // Lógica de dimensionamiento
        if (typeof col.width === 'number') {
            style.width = col.width;
            style.flex = '0 0 auto';
        } else if (typeof col.flex === 'number') {
            style.flex = `${col.flex} 1 0`;
        } else {
            // Sistema de distribución automática
            if (hasFlex) {
                style.flex = '1 1 0';
            } else {
                // Última columna se expande, las demás tienen tamaño automático
                if (idx === visibleColumns.length - 1) {
                    style.flex = '1 1 0';
                } else {
                    style.flex = '0 0 auto';
                }
            }
        }
        // Ancho mínimo inteligente basado en pantalla y texto del header
        const baseMinWidth = typeof col.minWidth === 'number' ? col.minWidth : 50;
        style.minWidth = getSmartMinWidth(baseMinWidth, screenWidth, visibleColumns.length, col.headerName);
        // Ancho máximo si está definido
        if (typeof col.maxWidth === 'number') {
            style.maxWidth = col.maxWidth;
        }
        return style;
    });
}
const DataGridStyles = {
    // Contenedor principal
    container: 'rounded-md bg-background flex flex-col',
    // Contenedor scrollable
    scrollContainer: 'flex-1 overflow-auto',
    // Headers de columna
    headerRow: 'flex min-w-full',
    headerCell: 'px-3 py-2 text-sm font-medium text-gray-700',
    // Celdas del body (desde Cell.tsx)
    bodyCell: 'px-3 py-1 text-sm text-gray-900 border-b border-gray-200 border-r border-gray-200 bg-background whitespace-pre-line break-words min-h-[22px] flex-auto last:border-r-0',
    // Responsive breakpoints
    responsive: {
        minWidth: 'min-w-[280px] sm:min-w-[400px] md:min-w-[600px]',
        mobileScroll: 'sm:overflow-x-visible overflow-x-auto'
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Header.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$IconButton$2f$IconButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/shared/components/ui/IconButton/IconButton.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$DataGrid$2f$components$2f$Toolbar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Toolbar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$TextField$2f$TextField$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/shared/components/ui/TextField/TextField.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$DataGrid$2f$utils$2f$columnStyles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/utils/columnStyles.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$Dialog$2f$Dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/shared/components/ui/Dialog/Dialog.tsx [app-client] (ecmascript)");
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
const Header = ({ title, filterMode = false, onToggleFilterMode, columns = [], createForm, createFormTitle, onAddClick, addDisabled = false, screenWidth = 1024, onExportExcel, headerActions, showSortButton = true, showFilterButton = true, showExportButton = true, showSearch = true, onSearchChange })=>{
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const [isCreateModalOpen, setIsCreateModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [searchInput, setSearchInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(searchParams.get('search') || '');
    const searchValue = searchParams.get('search') || '';
    const filtration = searchParams.get('filtration') === 'true';
    // Debounce search updates to avoid excessive URL changes
    const debounceTimer = __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useRef(null);
    const handleChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Header.useCallback[handleChange]": (e)=>{
            const value = e.target.value;
            setSearchInput(value);
            // Clear previous timer
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
            // Set new timer for 300ms debounce
            debounceTimer.current = setTimeout({
                "Header.useCallback[handleChange]": ()=>{
                    if (onSearchChange) {
                        onSearchChange(value);
                    } else {
                        const params = new URLSearchParams(searchParams.toString());
                        if (value) {
                            params.set('search', value);
                        } else {
                            params.delete('search');
                        }
                        // Reset to page 1 when searching
                        params.set('page', '1');
                        router.replace(`${pathname}?${params.toString()}`);
                    }
                }
            }["Header.useCallback[handleChange]"], 300);
        }
    }["Header.useCallback[handleChange]"], [
        searchParams,
        router,
        pathname,
        onSearchChange
    ]);
    // Limpiar búsqueda de forma inmediata (cancela debounce y actualiza la URL o llama onSearchChange)
    const handleClear = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Header.useCallback[handleClear]": ()=>{
            setSearchInput('');
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
            if (onSearchChange) {
                onSearchChange('');
            } else {
                const params = new URLSearchParams(searchParams.toString());
                params.delete('search');
                params.set('page', '1');
                router.replace(`${pathname}?${params.toString()}`);
            }
        }
    }["Header.useCallback[handleClear]"], [
        searchParams,
        router,
        pathname,
        onSearchChange
    ]);
    // Calcular estilos computados para las columnas usando utilidad centralizada
    const computedStyles = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$DataGrid$2f$utils$2f$columnStyles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateColumnStyles"])(columns, screenWidth);
    // border-b border-gray-300 bg-gray-100
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full",
        "data-test-id": "data-grid-header",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center w-full px-4 pt-4 pb-2",
                children: [
                    (createForm || onAddClick) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center mr-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$IconButton$2f$IconButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            icon: "add",
                            variant: "ghost",
                            size: "md",
                            onClick: onAddClick || (()=>setIsCreateModalOpen(true)),
                            disabled: addDisabled,
                            "data-test-id": "add-button"
                        }, void 0, false, {
                            fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Header.tsx",
                            lineNumber: 118,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Header.tsx",
                        lineNumber: 117,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mr-6 min-w-0 text-lg font-semibold leading-snug text-foreground",
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Header.tsx",
                        lineNumber: 130,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    headerActions && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "hidden sm:flex flex-1 items-center justify-center gap-3",
                        "data-test-id": "header-actions-slot",
                        children: headerActions
                    }, void 0, false, {
                        fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Header.tsx",
                        lineNumber: 136,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    !headerActions && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1"
                    }, void 0, false, {
                        fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Header.tsx",
                        lineNumber: 142,
                        columnNumber: 28
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "hidden sm:flex items-center gap-4 ml-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-shrink-0",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$DataGrid$2f$components$2f$Toolbar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    filterMode: filterMode,
                                    onToggleFilterMode: onToggleFilterMode,
                                    columns: columns,
                                    title: title,
                                    onExportExcel: onExportExcel,
                                    showSortButton: showSortButton,
                                    showFilterButton: showFilterButton,
                                    showExportButton: showExportButton
                                }, void 0, false, {
                                    fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Header.tsx",
                                    lineNumber: 148,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Header.tsx",
                                lineNumber: 147,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            showSearch && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$TextField$2f$TextField$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextField"], {
                                    label: "",
                                    name: "datagrid-search",
                                    value: searchInput,
                                    onChange: handleChange,
                                    placeholder: "Buscar...",
                                    startIcon: "search",
                                    className: "w-full sm:w-64",
                                    "data-test-id": "data-grid-search-input"
                                }, void 0, false, {
                                    fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Header.tsx",
                                    lineNumber: 162,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Header.tsx",
                                lineNumber: 161,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Header.tsx",
                        lineNumber: 145,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Header.tsx",
                lineNumber: 114,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            headerActions && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex sm:hidden items-center justify-center gap-3 mt-3",
                "data-test-id": "header-actions-slot-mobile",
                children: headerActions
            }, void 0, false, {
                fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Header.tsx",
                lineNumber: 181,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex sm:hidden items-start justify-end gap-4 mt-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$DataGrid$2f$components$2f$Toolbar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            columns: columns,
                            title: title,
                            onExportExcel: onExportExcel,
                            filterMode: filterMode,
                            onToggleFilterMode: onToggleFilterMode,
                            showSortButton: showSortButton,
                            showFilterButton: showFilterButton,
                            showExportButton: showExportButton
                        }, void 0, false, {
                            fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Header.tsx",
                            lineNumber: 190,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Header.tsx",
                        lineNumber: 189,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-start flex-1 max-w-xs",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                htmlFor: "datagrid-search-mobile",
                                className: "sr-only",
                                children: "Buscar"
                            }, void 0, false, {
                                fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Header.tsx",
                                lineNumber: 203,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-start w-full gap-2",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$TextField$2f$TextField$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextField"], {
                                    label: "Buscar",
                                    placeholder: "Buscar...",
                                    name: "datagrid-search-mobile",
                                    value: searchInput,
                                    onChange: handleChange,
                                    startIcon: "search",
                                    className: "text-sm w-full"
                                }, void 0, false, {
                                    fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Header.tsx",
                                    lineNumber: 205,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Header.tsx",
                                lineNumber: 204,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Header.tsx",
                        lineNumber: 202,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Header.tsx",
                lineNumber: 187,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            createForm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$Dialog$2f$Dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                open: isCreateModalOpen,
                onClose: ()=>setIsCreateModalOpen(false),
                size: "lg",
                scroll: "body",
                hideActions: true,
                title: createFormTitle,
                children: /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].isValidElement(createForm) ? /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].cloneElement(createForm, {
                    onClose: ()=>setIsCreateModalOpen(false)
                }) : createForm
            }, void 0, false, {
                fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Header.tsx",
                lineNumber: 220,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Header.tsx",
        lineNumber: 112,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(Header, "QLtjg8djFOM5W6FGqjmx5Dc8c54=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"]
    ];
});
_c = Header;
const __TURBOPACK__default__export__ = Header;
var _c;
__turbopack_context__.k.register(_c, "Header");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/utils/formatGridCell.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Fecha/hora para grillas: DD-MM-YYYY HH:mm (hora local del navegador).
 */ __turbopack_context__.s([
    "formatGridDate",
    ()=>formatGridDate,
    "formatGridDateTime",
    ()=>formatGridDateTime,
    "formatKilogramsDisplay",
    ()=>formatKilogramsDisplay
]);
function formatGridDateTime(value) {
    if (value == null || value === '') return '—';
    const d = value instanceof Date ? value : new Date(String(value));
    if (Number.isNaN(d.getTime())) return String(value);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${dd}-${mm}-${yyyy} ${hh}:${min}`;
}
function formatGridDate(value) {
    if (value == null || value === '') return '—';
    const d = value instanceof Date ? value : new Date(String(value));
    if (Number.isNaN(d.getTime())) return String(value);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
}
function formatKilogramsDisplay(value) {
    if (value == null || value === '') return '—';
    let n;
    if (typeof value === 'number') {
        n = value;
    } else {
        const s = String(value).trim();
        n = Number(s);
        if (Number.isNaN(n)) {
            n = parseFloat(s.replace(/\./g, '').replace(',', '.'));
        }
    }
    if (Number.isNaN(n)) return '—';
    const rounded = Math.round(n);
    return rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Body.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$DataGrid$2f$utils$2f$columnStyles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/utils/columnStyles.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$IconButton$2f$IconButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/shared/components/ui/IconButton/IconButton.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$DataGrid$2f$utils$2f$formatGridCell$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/utils/formatGridCell.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
function cellJustify(column) {
    const a = column.align ?? (column.type === 'number' || column.type === 'id' || column.renderType === 'weightKg' ? 'right' : 'left');
    if (a === 'right') return 'justify-end text-right';
    if (a === 'center') return 'justify-center text-center';
    return 'justify-start text-left';
}
/** Etiqueta en español para valores de estado en badges (p. ej. recepciones). */ function badgeStatusLabel(raw) {
    const key = raw.trim().toUpperCase();
    if (key === 'FINISHED') return 'Finalizado';
    if (key === 'ESPERA') return 'En espera';
    return raw || '—';
}
function renderDefaultCellInner(column, value) {
    if (column.renderType === 'badge') {
        const s = String(value ?? '');
        const done = s.trim().toUpperCase() === 'FINISHED';
        const wait = s.trim().toUpperCase() === 'ESPERA';
        const label = badgeStatusLabel(s);
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: `inline-flex max-w-full shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-semibold ${done ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/35 dark:text-emerald-100' : wait ? 'bg-amber-100 text-amber-900 dark:bg-amber-900/35 dark:text-amber-100' : 'bg-muted text-muted-foreground'}`,
            children: label
        }, void 0, false, {
            fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Body.tsx",
            lineNumber: 50,
            columnNumber: 7
        }, this);
    }
    if (column.renderType === 'currency') {
        const n = typeof value === 'number' ? value : parseFloat(String(value));
        if (Number.isNaN(n)) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "tabular-nums",
                children: "—"
            }, void 0, false, {
                fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Body.tsx",
                lineNumber: 67,
                columnNumber: 14
            }, this);
        }
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "tabular-nums",
            children: n.toLocaleString('es-CL')
        }, void 0, false, {
            fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Body.tsx",
            lineNumber: 69,
            columnNumber: 12
        }, this);
    }
    if (column.renderType === 'weightKg') {
        const text = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$DataGrid$2f$utils$2f$formatGridCell$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatKilogramsDisplay"])(value);
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "whitespace-nowrap tabular-nums",
            children: text
        }, void 0, false, {
            fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Body.tsx",
            lineNumber: 74,
            columnNumber: 12
        }, this);
    }
    if (column.renderType === 'dateString') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "whitespace-nowrap tabular-nums text-foreground/90",
            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$DataGrid$2f$utils$2f$formatGridCell$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatGridDateTime"])(value)
        }, void 0, false, {
            fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Body.tsx",
            lineNumber: 79,
            columnNumber: 7
        }, this);
    }
    if (column.type === 'dateTime') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "whitespace-nowrap tabular-nums text-foreground/90",
            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$DataGrid$2f$utils$2f$formatGridCell$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatGridDateTime"])(value)
        }, void 0, false, {
            fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Body.tsx",
            lineNumber: 87,
            columnNumber: 7
        }, this);
    }
    if (column.type === 'date') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "whitespace-nowrap tabular-nums text-foreground/90",
            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$DataGrid$2f$utils$2f$formatGridCell$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatGridDate"])(value)
        }, void 0, false, {
            fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Body.tsx",
            lineNumber: 95,
            columnNumber: 7
        }, this);
    }
    if (column.type === 'number' || column.type === 'id') {
        const t = value !== null && value !== undefined ? String(value) : '—';
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "whitespace-nowrap tabular-nums",
            children: t
        }, void 0, false, {
            fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Body.tsx",
            lineNumber: 103,
            columnNumber: 12
        }, this);
    }
    const t = value !== null && value !== undefined ? String(value) : '—';
    if (column.nowrap || column.mono) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: `whitespace-nowrap text-foreground/95 ${column.mono ? 'font-mono text-xs uppercase' : 'font-normal'}`,
            children: t
        }, void 0, false, {
            fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Body.tsx",
            lineNumber: 110,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "min-w-0 break-words text-foreground/95 leading-snug line-clamp-2",
        children: t
    }, void 0, false, {
        fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Body.tsx",
        lineNumber: 119,
        columnNumber: 5
    }, this);
}
const bodyCellBase = 'min-h-[40px] min-w-0 border-b border-border/70 px-3 py-2 text-sm flex items-center';
const Body = ({ columns = [], rows = [], filterMode = false, screenWidth = 1024, expandable = false, expandedRowIds = new Set(), onToggleExpand, expandableRowContent, pinActionsColumn = false, actionsColumnField = 'actions' })=>{
    _s();
    const [hoveredRowId, setHoveredRowId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const visibleColumns = columns.filter((c)=>!c.hide);
    const computedStyles = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$DataGrid$2f$utils$2f$columnStyles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateColumnStyles"])(columns, screenWidth);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex-1",
        "data-test-id": "data-grid-body",
        children: rows.map((row, rowIndex)=>{
            const rowId = row.id || rowIndex;
            const isExpanded = expandedRowIds.has(rowId);
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Fragment, {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex min-w-full items-stretch data-grid-row",
                        style: {
                            minWidth: 'max-content'
                        },
                        "data-test-id": "data-grid-row",
                        children: [
                            expandable && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex h-auto min-h-[40px] w-10 min-w-[40px] items-center justify-center border-b border-border/70 px-1 py-1",
                                style: {
                                    backgroundColor: hoveredRowId === rowId ? 'var(--color-hover, #f5f5f5)' : 'transparent'
                                },
                                onMouseEnter: ()=>setHoveredRowId(rowId),
                                onMouseLeave: ()=>setHoveredRowId(null),
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$IconButton$2f$IconButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    icon: "expand_more",
                                    variant: "basic",
                                    size: "sm",
                                    onClick: ()=>onToggleExpand?.(rowId),
                                    className: `transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`,
                                    ariaLabel: isExpanded ? 'Colapsar fila' : 'Expandir fila'
                                }, void 0, false, {
                                    fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Body.tsx",
                                    lineNumber: 168,
                                    columnNumber: 19
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Body.tsx",
                                lineNumber: 159,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0)),
                            visibleColumns.map((column, colIndex)=>{
                                const rawValue = row[column.field];
                                const style = computedStyles[colIndex];
                                const isPinnedActionsColumn = pinActionsColumn && column.field === actionsColumnField;
                                const rowBackgroundColor = hoveredRowId === rowId ? 'var(--color-hover, #f5f5f5)' : 'var(--color-background, #ffffff)';
                                const cellStyle = {
                                    ...style,
                                    backgroundColor: rowBackgroundColor,
                                    ...isPinnedActionsColumn ? {
                                        position: 'sticky',
                                        right: 0,
                                        zIndex: 8,
                                        borderLeft: '1px solid var(--border, #e5e7eb)',
                                        flex: '0 0 auto'
                                    } : {}
                                };
                                const value = column.valueGetter ? column.valueGetter({
                                    row,
                                    value: rawValue,
                                    column,
                                    rowIndex
                                }) : rawValue;
                                const cellClass = `${bodyCellBase} ${cellJustify(column)}`;
                                if (column.actionComponent) {
                                    const ActionComponent = column.actionComponent;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: cellClass,
                                        style: cellStyle,
                                        onMouseEnter: ()=>setHoveredRowId(rowId),
                                        onMouseLeave: ()=>setHoveredRowId(null),
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionComponent, {
                                            row: row,
                                            column: column
                                        }, void 0, false, {
                                            fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Body.tsx",
                                            lineNumber: 218,
                                            columnNumber: 23
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, `${column.field}-${rowId}`, false, {
                                        fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Body.tsx",
                                        lineNumber: 211,
                                        columnNumber: 21
                                    }, ("TURBOPACK compile-time value", void 0));
                                }
                                if (column.renderCell) {
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: cellClass,
                                        style: cellStyle,
                                        onMouseEnter: ()=>setHoveredRowId(rowId),
                                        onMouseLeave: ()=>setHoveredRowId(null),
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "min-w-0 overflow-hidden",
                                            children: column.renderCell({
                                                row,
                                                value,
                                                column
                                            })
                                        }, void 0, false, {
                                            fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Body.tsx",
                                            lineNumber: 232,
                                            columnNumber: 23
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, `${column.field}-${rowId}`, false, {
                                        fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Body.tsx",
                                        lineNumber: 225,
                                        columnNumber: 21
                                    }, ("TURBOPACK compile-time value", void 0));
                                }
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: cellClass,
                                    style: cellStyle,
                                    onMouseEnter: ()=>setHoveredRowId(rowId),
                                    onMouseLeave: ()=>setHoveredRowId(null),
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "min-w-0 max-w-full overflow-hidden",
                                        children: renderDefaultCellInner(column, value)
                                    }, void 0, false, {
                                        fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Body.tsx",
                                        lineNumber: 247,
                                        columnNumber: 21
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, `${column.field}-${rowId}`, false, {
                                    fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Body.tsx",
                                    lineNumber: 240,
                                    columnNumber: 19
                                }, ("TURBOPACK compile-time value", void 0));
                            })
                        ]
                    }, void 0, true, {
                        fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Body.tsx",
                        lineNumber: 153,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    expandable && isExpanded && expandableRowContent && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "min-w-full overflow-hidden border-b border-border/70 bg-muted/40",
                        style: {
                            minWidth: 'max-content'
                        },
                        "data-test-id": "data-grid-expanded-row",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-4",
                            children: expandableRowContent(row)
                        }, void 0, false, {
                            fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Body.tsx",
                            lineNumber: 260,
                            columnNumber: 17
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Body.tsx",
                        lineNumber: 255,
                        columnNumber: 15
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, rowId, true, {
                fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Body.tsx",
                lineNumber: 152,
                columnNumber: 11
            }, ("TURBOPACK compile-time value", void 0));
        })
    }, void 0, false, {
        fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Body.tsx",
        lineNumber: 146,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(Body, "JD0rGoQJpb7AO/X1ALYPGkckY9Q=");
_c = Body;
const __TURBOPACK__default__export__ = Body;
var _c;
__turbopack_context__.k.register(_c, "Body");
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
"[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Pagination.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$IconButton$2f$IconButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/shared/components/ui/IconButton/IconButton.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$Select$2f$Select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/shared/components/ui/Select/Select.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const Pagination = ({ total, totalGeneral, mobileMode = false })=>{
    _s();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    // Obtener valores de la URL
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '25');
    const totalPages = Math.max(1, Math.ceil(total / limit));
    // Funciones para actualizar la URL
    const updateSearchParams = (newParams)=>{
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(newParams).forEach(([key, value])=>{
            params.set(key, value);
        });
        router.push(`${pathname}?${params.toString()}`);
    };
    const handleLimitChange = (newLimit)=>{
        updateSearchParams({
            limit: newLimit.toString(),
            page: '1'
        }); // Reset to page 1 when changing limit
    };
    const handlePageChange = (newPage)=>{
        updateSearchParams({
            page: newPage.toString()
        });
    };
    // Opciones fijas para el paginador
    const limitOptions = [
        {
            id: 5,
            label: '5'
        },
        {
            id: 10,
            label: '10'
        },
        {
            id: 25,
            label: '25'
        },
        {
            id: 50,
            label: '50'
        },
        {
            id: 75,
            label: '75'
        },
        {
            id: 100,
            label: '100'
        },
        {
            id: 200,
            label: '200'
        },
        {
            id: 300,
            label: '300'
        },
        {
            id: 500,
            label: '500'
        }
    ];
    if (mobileMode) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center gap-2 text-xs text-foreground",
            "data-test-id": "data-grid-pagination",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$IconButton$2f$IconButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    icon: "first_page",
                    variant: "text",
                    className: "p-1 text-secondary cursor-pointer",
                    onClick: ()=>handlePageChange(1),
                    "aria-label": "Primera página"
                }, void 0, false, {
                    fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Pagination.tsx",
                    lineNumber: 57,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$IconButton$2f$IconButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    icon: "chevron_left",
                    variant: "text",
                    className: "p-1 text-secondary cursor-pointer",
                    onClick: ()=>handlePageChange(Math.max(1, page - 1)),
                    "aria-label": "Anterior"
                }, void 0, false, {
                    fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Pagination.tsx",
                    lineNumber: 58,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "px-3 py-1 text-xs font-normal text-foreground w-16 text-center",
                    children: [
                        page,
                        " ",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-gray-400",
                            children: [
                                "/ ",
                                totalPages
                            ]
                        }, void 0, true, {
                            fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Pagination.tsx",
                            lineNumber: 60,
                            columnNumber: 18
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Pagination.tsx",
                    lineNumber: 59,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$IconButton$2f$IconButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    icon: "chevron_right",
                    variant: "text",
                    className: "p-1 text-secondary cursor-pointer",
                    onClick: ()=>handlePageChange(Math.min(totalPages, page + 1)),
                    "aria-label": "Siguiente"
                }, void 0, false, {
                    fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Pagination.tsx",
                    lineNumber: 62,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$IconButton$2f$IconButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    icon: "last_page",
                    variant: "text",
                    className: "p-1 text-secondary cursor-pointer",
                    onClick: ()=>handlePageChange(totalPages),
                    "aria-label": "Última página"
                }, void 0, false, {
                    fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Pagination.tsx",
                    lineNumber: 63,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Pagination.tsx",
            lineNumber: 56,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center justify-between p-2",
        "data-test-id": "data-grid-pagination",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-3 flex-shrink-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-xs text-foreground font-normal whitespace-nowrap",
                        children: "Filas por página:"
                    }, void 0, false, {
                        fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Pagination.tsx",
                        lineNumber: 72,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$Select$2f$Select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        options: limitOptions,
                        placeholder: "",
                        value: limit,
                        onChange: (newLimit)=>newLimit && handleLimitChange(Number(newLimit)),
                        variant: "minimal",
                        className: "min-w-[112px]"
                    }, void 0, false, {
                        fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Pagination.tsx",
                        lineNumber: 73,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Pagination.tsx",
                lineNumber: 71,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 text-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-xs text-muted-foreground",
                    children: totalGeneral && totalGeneral !== total ? `Registros filtrados: ${total} de ${totalGeneral}` : `Registros totales: ${total}`
                }, void 0, false, {
                    fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Pagination.tsx",
                    lineNumber: 85,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Pagination.tsx",
                lineNumber: 84,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2 text-xs text-foreground",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$IconButton$2f$IconButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        icon: "first_page",
                        variant: "text",
                        className: "p-1 text-secondary cursor-pointer",
                        onClick: ()=>handlePageChange(1),
                        "aria-label": "Primera página"
                    }, void 0, false, {
                        fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Pagination.tsx",
                        lineNumber: 92,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$IconButton$2f$IconButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        icon: "chevron_left",
                        variant: "text",
                        className: "p-1 text-secondary cursor-pointer",
                        onClick: ()=>handlePageChange(Math.max(1, page - 1)),
                        "aria-label": "Anterior"
                    }, void 0, false, {
                        fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Pagination.tsx",
                        lineNumber: 93,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "px-3 py-1 text-xs font-normal text-foreground w-16 text-center",
                        children: [
                            page,
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-gray-400",
                                children: [
                                    "/ ",
                                    totalPages
                                ]
                            }, void 0, true, {
                                fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Pagination.tsx",
                                lineNumber: 95,
                                columnNumber: 18
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Pagination.tsx",
                        lineNumber: 94,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$IconButton$2f$IconButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        icon: "chevron_right",
                        variant: "text",
                        className: "p-1 text-secondary cursor-pointer",
                        onClick: ()=>handlePageChange(Math.min(totalPages, page + 1)),
                        "aria-label": "Siguiente"
                    }, void 0, false, {
                        fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Pagination.tsx",
                        lineNumber: 97,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$IconButton$2f$IconButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        icon: "last_page",
                        variant: "text",
                        className: "p-1 text-secondary cursor-pointer",
                        onClick: ()=>handlePageChange(totalPages),
                        "aria-label": "Última página"
                    }, void 0, false, {
                        fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Pagination.tsx",
                        lineNumber: 98,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Pagination.tsx",
                lineNumber: 91,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Pagination.tsx",
        lineNumber: 69,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(Pagination, "gljU79eAHa3+bf98ZS8FD0ldRxY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = Pagination;
const __TURBOPACK__default__export__ = Pagination;
var _c;
__turbopack_context__.k.register(_c, "Pagination");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Footer.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$DataGrid$2f$components$2f$Pagination$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Pagination.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$DataGrid$2f$utils$2f$columnStyles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/utils/columnStyles.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$Select$2f$Select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/shared/components/ui/Select/Select.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
const Footer = ({ total = 0, totalGeneral })=>{
    _s();
    const { isMobile } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$DataGrid$2f$utils$2f$columnStyles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScreenSize"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const updateSearchParams = (newParams)=>{
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(newParams).forEach(([key, value])=>{
            params.set(key, value);
        });
        router.push(`${pathname}?${params.toString()}`);
    };
    const handleLimitChange = (newLimit)=>{
        updateSearchParams({
            limit: newLimit.toString(),
            page: '1'
        });
    };
    const limitOptions = [
        {
            id: 5,
            label: '5'
        },
        {
            id: 10,
            label: '10'
        },
        {
            id: 25,
            label: '25'
        },
        {
            id: 50,
            label: '50'
        },
        {
            id: 75,
            label: '75'
        },
        {
            id: 100,
            label: '100'
        },
        {
            id: 200,
            label: '200'
        },
        {
            id: 300,
            label: '300'
        },
        {
            id: 500,
            label: '500'
        }
    ];
    if (isMobile) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col p-4 space-y-4 min-h-[120px] border-t border-t-gray-300",
            "data-test-id": "data-grid-footer",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$DataGrid$2f$components$2f$Pagination$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        total: total,
                        totalGeneral: totalGeneral,
                        mobileMode: true
                    }, void 0, false, {
                        fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Footer.tsx",
                        lineNumber: 51,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Footer.tsx",
                    lineNumber: 50,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-3 flex-shrink-0",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-xs text-foreground whitespace-nowrap",
                                    children: "Filas por página:"
                                }, void 0, false, {
                                    fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Footer.tsx",
                                    lineNumber: 56,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$Select$2f$Select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    options: limitOptions,
                                    placeholder: "",
                                    value: limit,
                                    onChange: (newLimit)=>newLimit && handleLimitChange(Number(newLimit)),
                                    variant: "minimal",
                                    className: "min-w-[112px]"
                                }, void 0, false, {
                                    fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Footer.tsx",
                                    lineNumber: 57,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Footer.tsx",
                            lineNumber: 55,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-xs text-muted-foreground",
                            children: totalGeneral && totalGeneral !== total ? `Filtrados: ${total} de ${totalGeneral}` : `Total: ${total}`
                        }, void 0, false, {
                            fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Footer.tsx",
                            lineNumber: 66,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Footer.tsx",
                    lineNumber: 54,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Footer.tsx",
            lineNumber: 48,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-0 border-t border-t-gray-300",
        "data-test-id": "data-grid-footer",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$DataGrid$2f$components$2f$Pagination$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            total: total,
            totalGeneral: totalGeneral
        }, void 0, false, {
            fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Footer.tsx",
            lineNumber: 76,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Footer.tsx",
        lineNumber: 75,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(Footer, "FryQR/q4Y7SxHI7NHvOw3xGtQQ0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$DataGrid$2f$utils$2f$columnStyles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScreenSize"],
        __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = Footer;
const __TURBOPACK__default__export__ = Footer;
var _c;
__turbopack_context__.k.register(_c, "Footer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/ColHeader.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ColHeader",
    ()=>ColHeader,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$IconButton$2f$IconButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/shared/components/ui/IconButton/IconButton.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
// Parse filters from URL format: "column1-value1,column2-value2"
function parseFiltersFromUrl(filtersParam) {
    if (!filtersParam) return {};
    const filters = {};
    const filterPairs = filtersParam.split(',');
    filterPairs.forEach((pair)=>{
        const [column, ...valueParts] = pair.split('-');
        if (column && valueParts.length > 0) {
            filters[column] = decodeURIComponent(valueParts.join('-')); // Decode to handle special chars
        }
    });
    return filters;
}
const ColHeader = ({ column, computedStyle, filterMode = false, isPinned = false })=>{
    _s();
    const { headerName, headerAlign, align, width, flex, minWidth, maxWidth, field, filterable = true } = column;
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const debounceTimer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Get current sort state from URL
    const currentSort = searchParams.get('sort');
    const currentSortField = searchParams.get('sortField');
    const isThisColumnSorted = currentSortField === field;
    // Show sort icon only if sort parameters exist in URL
    const shouldShowSortIcon = Boolean(currentSort || currentSortField);
    const hasSortIcon = shouldShowSortIcon && Boolean(column.sortable);
    // Get current filter value for this column from URL
    const filtersParam = searchParams.get('filters') || '';
    const currentFilters = parseFiltersFromUrl(filtersParam);
    const filterValueFromUrl = currentFilters[field] || '';
    // Local state for the input - initialize from URL
    const [localFilterValue, setLocalFilterValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(filterValueFromUrl);
    // Track if we're in the middle of typing (debounce pending)
    const isTypingRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    // Sync local state with URL only when URL changes externally (not from our own typing)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ColHeader.useEffect": ()=>{
            if (!isTypingRef.current) {
                setLocalFilterValue(filterValueFromUrl);
            }
        }
    }["ColHeader.useEffect"], [
        filterValueFromUrl
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ColHeader.useEffect": ()=>{
            return ({
                "ColHeader.useEffect": ()=>{
                    if (debounceTimer.current) {
                        clearTimeout(debounceTimer.current);
                    }
                }
            })["ColHeader.useEffect"];
        }
    }["ColHeader.useEffect"], []);
    // Handle filter change with debounce
    const handleFilterChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ColHeader.useCallback[handleFilterChange]": (e)=>{
            const value = e.target.value;
            setLocalFilterValue(value);
            isTypingRef.current = true;
            // Clear previous timer
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
            // Set new timer for 300ms debounce
            debounceTimer.current = setTimeout({
                "ColHeader.useCallback[handleFilterChange]": ()=>{
                    isTypingRef.current = false;
                    const params = new URLSearchParams(searchParams.toString());
                    // Update filters parameter
                    const currentFilters = parseFiltersFromUrl(params.get('filters') || '');
                    if (value.trim() === '') {
                        // Remove this column's filter if input is empty
                        delete currentFilters[field];
                    } else {
                        // Set/update this column's filter
                        currentFilters[field] = value;
                    }
                    // Build new filters string
                    const newFiltersString = Object.entries(currentFilters).filter({
                        "ColHeader.useCallback[handleFilterChange].newFiltersString": ([_, filterValue])=>filterValue.trim() !== ''
                    }["ColHeader.useCallback[handleFilterChange].newFiltersString"]).map({
                        "ColHeader.useCallback[handleFilterChange].newFiltersString": ([column, filterValue])=>`${column}-${encodeURIComponent(filterValue)}`
                    }["ColHeader.useCallback[handleFilterChange].newFiltersString"]).join(',');
                    if (newFiltersString) {
                        params.set('filters', newFiltersString);
                        params.set('filtration', 'true');
                    } else {
                        params.delete('filters');
                        // NO eliminar filtration aquí: solo la Toolbar puede quitar filtration
                        params.set('filtration', 'true');
                    }
                    // Reset to page 1 when filtering
                    params.set('page', '1');
                    router.replace(`${pathname}?${params.toString()}`, {
                        scroll: false
                    });
                }
            }["ColHeader.useCallback[handleFilterChange]"], 300);
        }
    }["ColHeader.useCallback[handleFilterChange]"], [
        searchParams,
        router,
        pathname,
        field
    ]);
    // Handle sort click - toggle between asc/desc if this column is active, or activate this column
    const handleSortClick = ()=>{
        if (!column.sortable) return;
        const params = new URLSearchParams(searchParams.toString());
        if (isThisColumnSorted) {
            // If this column is already sorted, toggle the direction
            const newDirection = currentSort === 'asc' ? 'desc' : 'asc';
            params.set('sort', newDirection);
            params.set('sortField', field);
        } else {
            // If this column is not sorted, activate it with ascending order
            params.set('sort', 'asc');
            params.set('sortField', field);
        }
        params.set('page', '1');
        router.replace(`${pathname}?${params.toString()}`, {
            scroll: false
        });
    };
    // Determine which icon to show and its color
    let iconName;
    let iconColor;
    if (isThisColumnSorted) {
        // If this column is sorted, show the appropriate direction icon in primary color
        iconName = currentSort === 'asc' ? 'arrow_upward_alt' : 'arrow_downward_alt';
        iconColor = 'text-primary';
    } else {
        // If not sorted, show upward arrow in secondary color
        iconName = 'arrow_upward_alt';
        iconColor = 'text-secondary';
    }
    const headerStyle = {
        ...flex !== undefined ? {
            flex
        } : {},
        ...width !== undefined ? {
            width
        } : {},
        ...minWidth !== undefined ? {
            minWidth
        } : {},
        ...maxWidth !== undefined ? {
            maxWidth
        } : {}
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-w-0 border-b border-gray-200 px-3 font-semibold text-xs text-gray-700 flex items-stretch text-left dark:border-border dark:text-foreground/90",
        style: {
            backgroundColor: 'var(--color-background)',
            height: '56px',
            minHeight: '56px',
            maxHeight: '56px',
            ...headerStyle,
            ...computedStyle || {},
            ...isPinned ? {
                position: 'sticky',
                top: 0,
                right: 0,
                zIndex: 40,
                flex: '0 0 auto'
            } : {}
        },
        "data-test-id": `data-grid-column-header-${field}`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "relative flex items-center w-full h-full min-w-0",
            children: [
                hasSortIcon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute right-0 top-1/2 -translate-y-1/2 z-10 flex h-5 w-5 items-center justify-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$IconButton$2f$IconButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        icon: iconName,
                        variant: "text",
                        size: "xs",
                        title: isThisColumnSorted ? currentSort === 'asc' ? 'Cambiar a descendente' : 'Cambiar a ascendente' : 'Ordenar por esta columna',
                        onClick: handleSortClick,
                        className: iconColor,
                        style: {
                            fontSize: 16,
                            width: 20,
                            height: 20,
                            padding: 0,
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        },
                        "aria-hidden": true
                    }, void 0, false, {
                        fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/ColHeader.tsx",
                        lineNumber: 193,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/ColHeader.tsx",
                    lineNumber: 192,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0)),
                filterMode && filterable ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `relative flex h-full min-w-0 flex-1 items-center justify-start overflow-hidden ${hasSortIcon ? 'pr-6' : ''}`,
                    children: [
                        localFilterValue && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: "absolute left-0 text-[10px] text-foreground bg-white px-0 pointer-events-none z-10 transition-all duration-200 text-left",
                            style: {
                                lineHeight: 1,
                                top: '2px'
                            },
                            children: headerName
                        }, void 0, false, {
                            fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/ColHeader.tsx",
                            lineNumber: 211,
                            columnNumber: 17
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "text",
                            size: 1,
                            value: localFilterValue,
                            onChange: handleFilterChange,
                            placeholder: headerName,
                            className: `block w-full min-w-0 max-w-full text-xs h-[28px] bg-transparent outline-none p-0 border-0 ${localFilterValue ? 'text-secondary pt-3' : ''} text-left`,
                            "aria-label": headerName,
                            style: {
                                width: '100%',
                                minWidth: 0,
                                maxWidth: '100%',
                                border: 'none'
                            }
                        }, void 0, false, {
                            fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/ColHeader.tsx",
                            lineNumber: 217,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/ColHeader.tsx",
                    lineNumber: 209,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: `break-words leading-tight min-w-0 flex-1 h-full flex items-center ${hasSortIcon ? 'pr-6' : ''}`,
                    children: headerName
                }, void 0, false, {
                    fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/ColHeader.tsx",
                    lineNumber: 229,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/ColHeader.tsx",
            lineNumber: 190,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/ColHeader.tsx",
        lineNumber: 169,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(ColHeader, "+nYdEWBwqpMmIdEGRHZgYT7Mq1M=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = ColHeader;
const __TURBOPACK__default__export__ = ColHeader;
var _c;
__turbopack_context__.k.register(_c, "ColHeader");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/DataGrid.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$DataGrid$2f$components$2f$Header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Header.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$DataGrid$2f$components$2f$Body$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Body.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$DataGrid$2f$components$2f$Footer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/Footer.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$DataGrid$2f$components$2f$ColHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/components/ColHeader.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$DataGrid$2f$utils$2f$columnStyles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/utils/columnStyles.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/paddy/paddy-tms/node_modules/next/navigation.js [app-client] (ecmascript)");
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
const DataGrid = ({ columns, title, rows, sort, sortField, search, filters, height = '70vh', totalRows, totalGeneral, createForm, createFormTitle, onAddClick, addDisabled, ["data-test-id"]: dataTestId, excelUrl, excelFields, limit = 25, onExportExcel, showBorder = false, showSortButton = true, showFilterButton = true, showExportButton = true, showSearch = true, onSearchChange, expandable = false, expandableRowContent, defaultExpandedRowIds = [], headerActions, pinActionsColumn = false, actionsColumnField = 'actions' })=>{
    _s();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const [data, setData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(rows || []);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [total, setTotal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(totalRows || (rows ? rows.length : 0));
    const [expandedRowIds, setExpandedRowIds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set(defaultExpandedRowIds));
    // Inicializar filterMode basado en si hay filtros activos en la URL
    const [filterMode, setFilterMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "DataGrid.useState": ()=>{
            const filtration = searchParams.get('filtration') === 'true';
            return filtration;
        }
    }["DataGrid.useState"]);
    // Hook para detectar tamaño de pantalla
    const { width: screenWidth, isMobile } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$DataGrid$2f$utils$2f$columnStyles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScreenSize"])();
    const toggleFilterMode = ()=>setFilterMode((v)=>!v);
    // Toggle expandir/colapsar una fila
    const toggleRowExpanded = (rowId)=>{
        setExpandedRowIds((prev)=>{
            const newSet = new Set(prev);
            if (newSet.has(rowId)) {
                newSet.delete(rowId);
            } else {
                newSet.add(rowId);
            }
            return newSet;
        });
    };
    // Update data when rows prop changes (server-side updates)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DataGrid.useEffect": ()=>{
            setData(rows || []);
            setTotal(totalRows || (rows ? rows.length : 0));
        }
    }["DataGrid.useEffect"], [
        rows,
        totalRows
    ]);
    // Sincronizar filterMode con la URL
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DataGrid.useEffect": ()=>{
            const filtration = searchParams.get('filtration') === 'true';
            setFilterMode(filtration);
        }
    }["DataGrid.useEffect"], [
        searchParams
    ]);
    // Inicializar limit en la URL si no está presente
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DataGrid.useEffect": ()=>{
            const currentLimit = searchParams.get('limit');
            if (!currentLimit) {
                const params = new URLSearchParams(searchParams.toString());
                params.set('limit', limit.toString());
                router.replace(`${pathname}?${params.toString()}`, {
                    scroll: false
                });
            }
        }
    }["DataGrid.useEffect"], [
        searchParams,
        limit,
        router,
        pathname
    ]);
    const containerClasses = `${__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$DataGrid$2f$utils$2f$columnStyles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DataGridStyles"].container} ${__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$DataGrid$2f$utils$2f$columnStyles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DataGridStyles"].responsive.minWidth} ${__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$DataGrid$2f$utils$2f$columnStyles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DataGridStyles"].responsive.mobileScroll} ${showBorder ? 'border border-border' : ''}`.trim();
    const visibleColumns = columns.filter((c)=>!c.hide);
    const computedStyles = (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$DataGrid$2f$utils$2f$columnStyles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateColumnStyles"])(columns, screenWidth);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: containerClasses,
        style: {
            height: typeof height === 'number' ? `${height}px` : height
        },
        "data-test-id": dataTestId || "data-grid-root",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$DataGrid$2f$components$2f$Header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                title: title ?? '',
                filterMode: filterMode,
                onToggleFilterMode: toggleFilterMode,
                columns: columns,
                createForm: createForm,
                createFormTitle: createFormTitle,
                onAddClick: onAddClick,
                addDisabled: addDisabled,
                screenWidth: screenWidth,
                onExportExcel: onExportExcel,
                headerActions: headerActions,
                showSortButton: showSortButton,
                showFilterButton: showFilterButton,
                showExportButton: showExportButton,
                showSearch: showSearch,
                onSearchChange: onSearchChange
            }, void 0, false, {
                fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/DataGrid.tsx",
                lineNumber: 175,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$DataGrid$2f$utils$2f$columnStyles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DataGridStyles"].scrollContainer} relative`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$DataGrid$2f$utils$2f$columnStyles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DataGridStyles"].headerRow} sticky top-0 z-30 bg-background`,
                        style: {
                            minWidth: 'max-content'
                        },
                        children: [
                            expandable && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-10 min-w-[40px] border-b border-gray-200"
                            }, void 0, false, {
                                fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/DataGrid.tsx",
                                lineNumber: 204,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            visibleColumns.map((column, i)=>{
                                const style = computedStyles[i];
                                const isPinnedActionsColumn = pinActionsColumn && column.field === actionsColumnField;
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$DataGrid$2f$components$2f$ColHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ColHeader"], {
                                    column: column,
                                    computedStyle: style,
                                    filterMode: filterMode,
                                    isPinned: isPinnedActionsColumn
                                }, column.field, false, {
                                    fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/DataGrid.tsx",
                                    lineNumber: 212,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0));
                            })
                        ]
                    }, void 0, true, {
                        fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/DataGrid.tsx",
                        lineNumber: 196,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$DataGrid$2f$components$2f$Body$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        columns: columns,
                        rows: loading ? [] : data,
                        filterMode: filterMode,
                        screenWidth: screenWidth,
                        expandable: expandable,
                        expandedRowIds: expandedRowIds,
                        onToggleExpand: toggleRowExpanded,
                        expandableRowContent: expandableRowContent,
                        pinActionsColumn: pinActionsColumn,
                        actionsColumnField: actionsColumnField
                    }, void 0, false, {
                        fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/DataGrid.tsx",
                        lineNumber: 223,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/DataGrid.tsx",
                lineNumber: 194,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$DataGrid$2f$components$2f$Footer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                total: total,
                totalGeneral: totalGeneral
            }, void 0, false, {
                fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/DataGrid.tsx",
                lineNumber: 237,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/DataGrid.tsx",
        lineNumber: 173,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(DataGrid, "IAqtEDw/+PM3rbt1hnL4A5BnnPc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$paddy$2f$paddy$2d$tms$2f$src$2f$shared$2f$components$2f$ui$2f$DataGrid$2f$utils$2f$columnStyles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScreenSize"]
    ];
});
_c = DataGrid;
const __TURBOPACK__default__export__ = DataGrid;
var _c;
__turbopack_context__.k.register(_c, "DataGrid");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/DataGrid.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/paddy/paddy-tms/src/shared/components/ui/DataGrid/DataGrid.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=paddy_paddy-tms_src_cb36f08e._.js.map