(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/OrbitPath.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>OrbitPath
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.core.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function OrbitPath({ radius, color, opacity = 0.3 }) {
    _s();
    const lineGeometry = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "OrbitPath.useMemo[lineGeometry]": ()=>{
            const points = [];
            const segments = 128;
            for(let i = 0; i <= segments; i++){
                const angle = i / segments * Math.PI * 2;
                points.push(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
            }
            const geometry = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BufferGeometry"]().setFromPoints(points);
            return geometry;
        }
    }["OrbitPath.useMemo[lineGeometry]"], [
        radius
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
        geometry: lineGeometry,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("lineBasicMaterial", {
            color: color,
            transparent: true,
            opacity: opacity
        }, void 0, false, {
            fileName: "[project]/components/OrbitPath.tsx",
            lineNumber: 34,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/OrbitPath.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, this);
}
_s(OrbitPath, "rB2MBaqG+RDshOsT8xfKUpnjy28=");
_c = OrbitPath;
var _c;
__turbopack_context__.k.register(_c, "OrbitPath");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/AsteroidVisualizer.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AsteroidVisualizer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$react$2d$three$2d$fiber$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@react-three/fiber/dist/react-three-fiber.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$PerspectiveCamera$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-three/drei/core/PerspectiveCamera.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$OrbitControls$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-three/drei/core/OrbitControls.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Stars$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-three/drei/core/Stars.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$web$2f$Html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-three/drei/web/Html.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$5a94e5eb$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__useFrame$3e$__ = __turbopack_context__.i("[project]/node_modules/@react-three/fiber/dist/events-5a94e5eb.esm.js [app-client] (ecmascript) <export D as useFrame>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.core.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$OrbitPath$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/OrbitPath.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
function Asteroid({ asteroid, position = [
    0,
    0,
    0
], isSelected = false, freeze = false }) {
    _s();
    const meshRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const hazardColors = {
        low: '#4ADE80',
        medium: '#F59E0B',
        high: '#F87171'
    };
    const color = asteroid?.hazardLevel ? hazardColors[asteroid.hazardLevel] : '#60A5FA';
    const size = asteroid?.diameter ? Math.max(0.03, asteroid.diameter / 2000) : 0.06;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
        ref: meshRef,
        castShadow: true,
        position: position,
        scale: isSelected ? 1.6 : 1,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("sphereGeometry", {
                args: [
                    size,
                    8,
                    8
                ]
            }, void 0, false, {
                fileName: "[project]/components/AsteroidVisualizer.tsx",
                lineNumber: 42,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                color: color,
                emissive: color,
                emissiveIntensity: isSelected ? 0.9 : 0.25,
                metalness: 0.1,
                roughness: 0.6
            }, void 0, false, {
                fileName: "[project]/components/AsteroidVisualizer.tsx",
                lineNumber: 43,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/AsteroidVisualizer.tsx",
        lineNumber: 41,
        columnNumber: 5
    }, this);
}
_s(Asteroid, "e4CAwo/q3Mh5N9nuIOzG1d1uu5c=");
_c = Asteroid;
// Small wrapper to rotate asteroid when not frozen
function AsteroidInstance({ asteroid, position, isSelected, freeze }) {
    _s1();
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$5a94e5eb$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__useFrame$3e$__["useFrame"])({
        "AsteroidInstance.useFrame": (state, delta)=>{
            if (freeze || !ref.current) return;
            ref.current.rotation.y += delta * 0.4;
            ref.current.rotation.x += delta * 0.1;
        }
    }["AsteroidInstance.useFrame"]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        ref: ref,
        position: position,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Asteroid, {
                asteroid: asteroid,
                isSelected: isSelected,
                freeze: freeze
            }, void 0, false, {
                fileName: "[project]/components/AsteroidVisualizer.tsx",
                lineNumber: 65,
                columnNumber: 7
            }, this),
            isSelected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                rotation: [
                    Math.PI / 2,
                    0,
                    0
                ],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ringGeometry", {
                        args: [
                            Math.max(0.25, (asteroid?.diameter || 50) / 2000 + 0.15),
                            Math.max(0.28, (asteroid?.diameter || 50) / 2000 + 0.2),
                            64
                        ]
                    }, void 0, false, {
                        fileName: "[project]/components/AsteroidVisualizer.tsx",
                        lineNumber: 68,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshBasicMaterial", {
                        color: "#FFFF00",
                        transparent: true,
                        opacity: 0.25,
                        side: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DoubleSide"]
                    }, void 0, false, {
                        fileName: "[project]/components/AsteroidVisualizer.tsx",
                        lineNumber: 69,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/AsteroidVisualizer.tsx",
                lineNumber: 67,
                columnNumber: 9
            }, this),
            asteroid && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$web$2f$Html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Html"], {
                position: [
                    0,
                    (asteroid.diameter || 50) / 2000 + 0.06,
                    0
                ],
                distanceFactor: 8,
                center: true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "pointer-events-none text-[10px] text-muted-foreground bg-black/30 px-1 rounded",
                    children: asteroid.name.length > 12 ? asteroid.name.slice(0, 12) + '…' : asteroid.name
                }, void 0, false, {
                    fileName: "[project]/components/AsteroidVisualizer.tsx",
                    lineNumber: 75,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/AsteroidVisualizer.tsx",
                lineNumber: 74,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/AsteroidVisualizer.tsx",
        lineNumber: 64,
        columnNumber: 5
    }, this);
}
_s1(AsteroidInstance, "8QVLrcMdYxPUkj6ry5zpyt6J6X8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$5a94e5eb$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__useFrame$3e$__["useFrame"]
    ];
});
_c1 = AsteroidInstance;
function Earth() {
    _s2();
    const meshRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const earthTexture = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Earth.useMemo[earthTexture]": ()=>{
            const canvas = document.createElement('canvas');
            canvas.width = 512;
            canvas.height = 512;
            const ctx = canvas.getContext('2d');
            // Create a simple Earth representation
            ctx.fillStyle = '#1e3a8a';
            ctx.fillRect(0, 0, 512, 512);
            // Add continents
            ctx.fillStyle = '#10b981';
            ctx.beginPath();
            ctx.arc(150, 200, 80, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(350, 150, 60, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(300, 350, 70, 0, Math.PI * 2);
            ctx.fill();
            return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CanvasTexture"](canvas);
        }
    }["Earth.useMemo[earthTexture]"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
        ref: meshRef,
        castShadow: true,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("sphereGeometry", {
                args: [
                    1,
                    64,
                    64
                ]
            }, void 0, false, {
                fileName: "[project]/components/AsteroidVisualizer.tsx",
                lineNumber: 116,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshPhongMaterial", {
                map: earthTexture,
                shininess: 5
            }, void 0, false, {
                fileName: "[project]/components/AsteroidVisualizer.tsx",
                lineNumber: 117,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/AsteroidVisualizer.tsx",
        lineNumber: 115,
        columnNumber: 5
    }, this);
}
_s2(Earth, "N4FCLFsBfBZZ93pt1Ma+gGCCnxU=");
_c2 = Earth;
function Scene({ asteroid, asteroids, selectedId, autoRotate }) {
    _s3();
    const freeze = Boolean(asteroid) && !autoRotate;
    const list = asteroids && asteroids.length > 0 ? asteroids : undefined;
    // generate demo asteroids if none provided
    const demo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Scene.useMemo[demo]": ()=>{
            if (list) return list;
            return [
                {
                    id: 'demo-1',
                    name: 'Demo A',
                    diameter: 40,
                    velocity: 12,
                    distance: 2000000,
                    hazardLevel: 'low',
                    is_potentially_hazardous_asteroid: false,
                    estimatedDiameter: {
                        kilometers: {
                            estimated_diameter_min: 30,
                            estimated_diameter_max: 40
                        }
                    },
                    close_approach_data: []
                },
                {
                    id: 'demo-2',
                    name: 'Demo B',
                    diameter: 70,
                    velocity: 18,
                    distance: 5000000,
                    hazardLevel: 'medium',
                    is_potentially_hazardous_asteroid: false,
                    estimatedDiameter: {
                        kilometers: {
                            estimated_diameter_min: 60,
                            estimated_diameter_max: 70
                        }
                    },
                    close_approach_data: []
                },
                {
                    id: 'demo-3',
                    name: 'Demo C',
                    diameter: 120,
                    velocity: 25,
                    distance: 12000000,
                    hazardLevel: 'high',
                    is_potentially_hazardous_asteroid: true,
                    estimatedDiameter: {
                        kilometers: {
                            estimated_diameter_min: 100,
                            estimated_diameter_max: 120
                        }
                    },
                    close_approach_data: []
                },
                {
                    id: 'demo-4',
                    name: 'Demo D',
                    diameter: 30,
                    velocity: 10,
                    distance: 8000000,
                    hazardLevel: 'low',
                    is_potentially_hazardous_asteroid: false,
                    estimatedDiameter: {
                        kilometers: {
                            estimated_diameter_min: 20,
                            estimated_diameter_max: 30
                        }
                    },
                    close_approach_data: []
                }
            ];
        }
    }["Scene.useMemo[demo]"], [
        list
    ]);
    // compute positions for asteroids around earth
    const positions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Scene.useMemo[positions]": ()=>{
            return demo.map({
                "Scene.useMemo[positions]": (a, i)=>{
                    const r = Math.min(8, Math.max(2, Math.sqrt((a.distance || 1000000) / 1000000)));
                    const angle = i / demo.length * Math.PI * 2;
                    return [
                        Math.cos(angle) * r,
                        Math.sin(angle) * r,
                        i % 3 - 1
                    ];
                }
            }["Scene.useMemo[positions]"]);
        }
    }["Scene.useMemo[positions]"], [
        demo
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$PerspectiveCamera$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PerspectiveCamera"], {
                makeDefault: true,
                position: [
                    0,
                    0,
                    asteroid ? 8 : 5
                ]
            }, void 0, false, {
                fileName: "[project]/components/AsteroidVisualizer.tsx",
                lineNumber: 148,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$OrbitControls$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OrbitControls"], {
                enableZoom: true,
                enablePan: true,
                autoRotate: !freeze,
                autoRotateSpeed: 2
            }, void 0, false, {
                fileName: "[project]/components/AsteroidVisualizer.tsx",
                lineNumber: 149,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Stars$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Stars"], {
                radius: 100,
                depth: 50,
                count: 1000,
                factor: 4
            }, void 0, false, {
                fileName: "[project]/components/AsteroidVisualizer.tsx",
                lineNumber: 156,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ambientLight", {
                intensity: 0.5
            }, void 0, false, {
                fileName: "[project]/components/AsteroidVisualizer.tsx",
                lineNumber: 159,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pointLight", {
                position: [
                    10,
                    10,
                    10
                ],
                intensity: 1
            }, void 0, false, {
                fileName: "[project]/components/AsteroidVisualizer.tsx",
                lineNumber: 160,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pointLight", {
                position: [
                    -10,
                    -10,
                    -10
                ],
                intensity: 0.3
            }, void 0, false, {
                fileName: "[project]/components/AsteroidVisualizer.tsx",
                lineNumber: 161,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                position: [
                    0,
                    0,
                    0
                ],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Earth, {}, void 0, false, {
                        fileName: "[project]/components/AsteroidVisualizer.tsx",
                        lineNumber: 165,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                        position: [
                            0,
                            0,
                            0
                        ],
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("sphereGeometry", {
                                args: [
                                    1.02,
                                    64,
                                    64
                                ]
                            }, void 0, false, {
                                fileName: "[project]/components/AsteroidVisualizer.tsx",
                                lineNumber: 167,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshBasicMaterial", {
                                wireframe: true,
                                color: "#00FFFF",
                                transparent: true,
                                opacity: 0.2
                            }, void 0, false, {
                                fileName: "[project]/components/AsteroidVisualizer.tsx",
                                lineNumber: 168,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/AsteroidVisualizer.tsx",
                        lineNumber: 166,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/AsteroidVisualizer.tsx",
                lineNumber: 164,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                children: demo.map((a, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AsteroidInstance, {
                        asteroid: a,
                        position: positions[i],
                        isSelected: selectedId === a.id,
                        freeze: freeze
                    }, a.id, false, {
                        fileName: "[project]/components/AsteroidVisualizer.tsx",
                        lineNumber: 175,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/AsteroidVisualizer.tsx",
                lineNumber: 173,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$OrbitPath$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        radius: 1.5,
                        color: "#00FFFF",
                        opacity: 0.15
                    }, void 0, false, {
                        fileName: "[project]/components/AsteroidVisualizer.tsx",
                        lineNumber: 187,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$OrbitPath$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        radius: 3,
                        color: "#00FF00",
                        opacity: 0.1
                    }, void 0, false, {
                        fileName: "[project]/components/AsteroidVisualizer.tsx",
                        lineNumber: 188,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$OrbitPath$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        radius: 5,
                        color: "#FFA500",
                        opacity: 0.08
                    }, void 0, false, {
                        fileName: "[project]/components/AsteroidVisualizer.tsx",
                        lineNumber: 189,
                        columnNumber: 9
                    }, this),
                    asteroid && asteroid.distance && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$OrbitPath$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        radius: Math.sqrt(asteroid.distance / 1000000),
                        color: "#FF0000",
                        opacity: 0.2
                    }, void 0, false, {
                        fileName: "[project]/components/AsteroidVisualizer.tsx",
                        lineNumber: 190,
                        columnNumber: 43
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/AsteroidVisualizer.tsx",
                lineNumber: 186,
                columnNumber: 7
            }, this),
            asteroid && (()=>{
                const targetId = selectedId || asteroid.id;
                const idx = demo.findIndex((d)=>d.id === targetId);
                const pos = idx >= 0 ? positions[idx] : [
                    0,
                    0,
                    0
                ];
                const labelPos = [
                    pos[0],
                    pos[1] + 0.5,
                    pos[2]
                ];
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$web$2f$Html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Html"], {
                            position: labelPos,
                            distanceFactor: 6,
                            center: true,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-black/90 border border-primary px-3 py-2 rounded-lg text-xs whitespace-nowrap pointer-events-none",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-primary font-semibold",
                                        children: asteroid.name
                                    }, void 0, false, {
                                        fileName: "[project]/components/AsteroidVisualizer.tsx",
                                        lineNumber: 203,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-secondary text-[10px] mt-1",
                                        children: [
                                            "Distance: ",
                                            asteroid.distance ? (asteroid.distance / 1000000).toFixed(2) : '0',
                                            "M km"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/AsteroidVisualizer.tsx",
                                        lineNumber: 204,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-secondary text-[10px]",
                                        children: [
                                            "Velocity: ",
                                            asteroid.velocity ? asteroid.velocity.toFixed(1) : '0',
                                            " km/s"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/AsteroidVisualizer.tsx",
                                        lineNumber: 207,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/AsteroidVisualizer.tsx",
                                lineNumber: 202,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/AsteroidVisualizer.tsx",
                            lineNumber: 201,
                            columnNumber: 13
                        }, this),
                        idx >= 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                            position: [
                                (pos[0] + labelPos[0]) / 2,
                                (pos[1] + labelPos[1]) / 2,
                                (pos[2] + labelPos[2]) / 2
                            ],
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                                    args: [
                                        0.01,
                                        0.01,
                                        Math.max(0.1, Math.hypot(labelPos[0] - pos[0], labelPos[1] - pos[1], labelPos[2] - pos[2])),
                                        6
                                    ]
                                }, void 0, false, {
                                    fileName: "[project]/components/AsteroidVisualizer.tsx",
                                    lineNumber: 215,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshBasicMaterial", {
                                    color: "#60A5FA",
                                    transparent: true,
                                    opacity: 0.9
                                }, void 0, false, {
                                    fileName: "[project]/components/AsteroidVisualizer.tsx",
                                    lineNumber: 216,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/AsteroidVisualizer.tsx",
                            lineNumber: 214,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true);
            })()
        ]
    }, void 0, true);
}
_s3(Scene, "quVYfiH2Yl6RB78AteXzlHNLjR0=");
_c3 = Scene;
function AsteroidVisualizer({ asteroid, asteroids, selectedId, autoRotate }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full h-full rounded-lg overflow-hidden bg-gradient-to-br from-background to-card/50 border border-primary/20",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$react$2d$three$2d$fiber$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Canvas"], {
            dpr: [
                1,
                2
            ],
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Scene, {
                asteroid: asteroid,
                asteroids: asteroids,
                selectedId: selectedId,
                autoRotate: autoRotate
            }, void 0, false, {
                fileName: "[project]/components/AsteroidVisualizer.tsx",
                lineNumber: 230,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/AsteroidVisualizer.tsx",
            lineNumber: 229,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/AsteroidVisualizer.tsx",
        lineNumber: 228,
        columnNumber: 5
    }, this);
}
_c4 = AsteroidVisualizer;
var _c, _c1, _c2, _c3, _c4;
__turbopack_context__.k.register(_c, "Asteroid");
__turbopack_context__.k.register(_c1, "AsteroidInstance");
__turbopack_context__.k.register(_c2, "Earth");
__turbopack_context__.k.register(_c3, "Scene");
__turbopack_context__.k.register(_c4, "AsteroidVisualizer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "alertsAPI",
    ()=>alertsAPI,
    "authAPI",
    ()=>authAPI,
    "dataHelpers",
    ()=>dataHelpers,
    "feedAPI",
    ()=>feedAPI,
    "storageHelpers",
    ()=>storageHelpers,
    "validationHelpers",
    ()=>validationHelpers
]);
/**
 * API Integration Module
 * Handles all communication with the backend running on localhost:8000
 */ const API_BASE_URL = 'http://localhost:8000';
// Helper function for making authenticated requests
async function apiCall(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers
        });
        if (!response.ok) {
            const errorData = await response.json().catch(()=>({}));
            throw new Error(errorData.message || `API error: ${response.status}`);
        }
        return response;
    } catch (error) {
        console.error('[v0] API call failed:', {
            endpoint,
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        throw error;
    }
}
const authAPI = {
    async register (data) {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Registration failed');
        }
        return response.json();
    },
    async login (data) {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Login failed');
        }
        return response.json();
    },
    logout () {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
    }
};
const feedAPI = {
    async getAll () {
        const response = await apiCall('/feed');
        const data = await response.json();
        // Normalize backend shapes:
        // - Some backends return { near_earth_objects: [...] }
        // - Others return an array of simplified objects
        let items = [];
        if (Array.isArray(data)) {
            items = data;
        } else if (data && Array.isArray(data.near_earth_objects)) {
            items = data.near_earth_objects;
        }
        // Map simplified backend fields to frontend expected NEO schema
        const normalized = items.map((item)=>({
                id: item.id || item.neoId || String(item.id),
                name: item.name || item.full_name || item.designation || 'Unknown',
                estimatedDiameter: {
                    kilometers: {
                        estimated_diameter_min: item.estimated_diameter_min || item.diameter_km || 0,
                        estimated_diameter_max: item.estimated_diameter_max || item.diameter_km || item.estimated_diameter || 0
                    }
                },
                close_approach_data: [
                    {
                        miss_distance: {
                            kilometers: item.miss_distance_km || item.close_approach_km || item.miss_distance && item.miss_distance.kilometers || '0'
                        },
                        relative_velocity: {
                            kilometers_per_second: item.velocity_kms || item.relative_velocity && item.relative_velocity.kilometers_per_second || '0'
                        }
                    }
                ],
                is_potentially_hazardous_asteroid: item.hazardous === true || item.is_potentially_hazardous_asteroid === true || item.hazardous === 'true' || false,
                // keep raw fields for debugging/advanced uses
                __raw: item
            }));
        return {
            near_earth_objects: normalized
        };
    },
    async getById (neoId) {
        const response = await apiCall(`/feed/${neoId}`);
        const data = await response.json();
        // If backend returns array or object, find matching id
        const items = Array.isArray(data) ? data : data?.near_earth_objects || [];
        const found = items.find((i)=>String(i.id) === String(neoId) || String(i.neoId) === String(neoId));
        if (!found) return null;
        const normalized = {
            id: found.id || found.neoId || String(found.id),
            name: found.name || found.full_name || 'Unknown',
            estimatedDiameter: {
                kilometers: {
                    estimated_diameter_min: found.estimated_diameter_min || found.diameter_km || 0,
                    estimated_diameter_max: found.estimated_diameter_max || found.diameter_km || found.estimated_diameter || 0
                }
            },
            close_approach_data: [
                {
                    miss_distance: {
                        kilometers: found.miss_distance_km || '0'
                    },
                    relative_velocity: {
                        kilometers_per_second: found.velocity_kms || '0'
                    }
                }
            ],
            is_potentially_hazardous_asteroid: found.hazardous === true || found.is_potentially_hazardous_asteroid === true || false,
            __raw: found
        };
        return normalized;
    }
};
const alertsAPI = {
    async addToWatchlist (neoId) {
        const response = await apiCall('/alerts/watch', {
            method: 'POST',
            body: JSON.stringify({
                neoId
            })
        });
        return response.json();
    },
    async removeFromWatchlist (neoId) {
        const response = await apiCall(`/alerts/unwatch/${neoId}`, {
            method: 'POST'
        });
        return response.json();
    }
};
const dataHelpers = {
    /**
   * Calculate hazard level based on asteroid properties
   */ getHazardLevel (asteroid) {
        if (!asteroid.close_approach_data || asteroid.close_approach_data.length === 0) {
            return 'low';
        }
        const distance = asteroid.close_approach_data[0].miss_distance?.kilometers ? parseFloat(asteroid.close_approach_data[0].miss_distance.kilometers) : Infinity;
        const diameter = asteroid.estimatedDiameter?.kilometers?.estimated_diameter_max || 0;
        if (asteroid.is_potentially_hazardous_asteroid && distance < 20000000) {
            return 'high';
        }
        if (distance < 50000000 && diameter > 100) {
            return 'medium';
        }
        return 'low';
    },
    /**
   * Format distance in kilometers to millions of kilometers
   */ formatDistance (kilometers) {
        const km = typeof kilometers === 'string' ? parseFloat(kilometers) : kilometers;
        const millions = km / 1000000;
        return `${millions.toFixed(2)} M km`;
    },
    /**
   * Format velocity from km/s
   */ formatVelocity (kms) {
        const kmh = typeof kms === 'string' ? parseFloat(kms) * 3600 : kms * 3600;
        return `${(kmh / 3600).toFixed(2)} km/s`;
    },
    /**
   * Format diameter in kilometers
   */ formatDiameter (km) {
        return `${km.toFixed(2)} km`;
    },
    /**
   * Parse close approach date
   */ parseApproachDate (dateString) {
        return new Date(dateString);
    },
    /**
   * Get next closest approach
   */ getNextCloseApproach (closeApproachData) {
        if (!closeApproachData || closeApproachData.length === 0) {
            return null;
        }
        return closeApproachData[0];
    }
};
const storageHelpers = {
    setToken (token) {
        localStorage.setItem('token', token);
    },
    getToken () {
        return localStorage.getItem('token');
    },
    setUserId (userId) {
        localStorage.setItem('userId', userId);
    },
    getUserId () {
        return localStorage.getItem('userId');
    },
    clearAuth () {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
    },
    isAuthenticated () {
        return !!this.getToken();
    }
};
const validationHelpers = {
    isValidEmail (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    isValidPassword (password) {
        return password.length >= 6;
    },
    isValidName (name) {
        return name.trim().length > 0;
    },
    validateRegistration (data) {
        const errors = [];
        if (!this.isValidName(data.name)) {
            errors.push('Name is required');
        }
        if (!this.isValidEmail(data.email)) {
            errors.push('Valid email is required');
        }
        if (!this.isValidPassword(data.password)) {
            errors.push('Password must be at least 6 characters');
        }
        if (data.password !== data.confirmPassword) {
            errors.push('Passwords do not match');
        }
        return {
            valid: errors.length === 0,
            errors
        };
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const e = new Error("Could not parse module '[project]/app/page.tsx'\n\nExpression expected");
e.code = 'MODULE_UNPARSABLE';
throw e;
}),
]);

//# sourceMappingURL=_3e584472._.js.map