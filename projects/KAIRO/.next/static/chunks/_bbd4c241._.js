(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/contexts/AuthContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "default",
    ()=>__TURBOPACK__default__export__,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-hot-toast/dist/index.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
// Configure axios defaults - use frontend API routes
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].defaults.baseURL = '/api';
// Add request interceptor to include auth token
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].interceptors.request.use((config)=>{
    const token = ("TURBOPACK compile-time truthy", 1) ? localStorage.getItem('token') : "TURBOPACK unreachable";
    if (token) {
        config.headers.Authorization = "Bearer ".concat(token);
    }
    return config;
}, (error)=>{
    return Promise.reject(error);
});
// Add response interceptor to handle token refresh
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].interceptors.response.use((response)=>response, async (error)=>{
    var _error_response;
    const originalRequest = error.config;
    if (((_error_response = error.response) === null || _error_response === void 0 ? void 0 : _error_response.status) === 401 && !originalRequest._retry && "object" !== 'undefined') {
        originalRequest._retry = true;
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post('/auth/refresh', {
                    refreshToken
                });
                const { token } = response.data.data;
                localStorage.setItem('token', token);
                // Retry the original request
                originalRequest.headers.Authorization = "Bearer ".concat(token);
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(originalRequest);
            }
        } catch (refreshError) {
            // Refresh failed, redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            if ("TURBOPACK compile-time truthy", 1) {
                window.location.href = '/login';
            }
        }
    }
    return Promise.reject(error);
});
const AuthProvider = (param)=>{
    let { children } = param;
    _s();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            const initializeAuth = {
                "AuthProvider.useEffect.initializeAuth": async ()=>{
                    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                    ;
                    const token = localStorage.getItem('token');
                    if (token) {
                        try {
                            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('/auth/me');
                            setUser(response.data.data.user);
                        } catch (error) {
                            localStorage.removeItem('token');
                            localStorage.removeItem('refreshToken');
                        }
                    }
                    setLoading(false);
                }
            }["AuthProvider.useEffect.initializeAuth"];
            initializeAuth();
        }
    }["AuthProvider.useEffect"], []);
    const login = async (email, password)=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post('/auth/login', {
                email,
                password
            });
            const { user, accessToken, refreshToken } = response.data.data;
            if ("TURBOPACK compile-time truthy", 1) {
                localStorage.setItem('token', accessToken);
                localStorage.setItem('refreshToken', refreshToken);
            }
            setUser(user);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Login successful!');
        } catch (error) {
            var _error_response_data, _error_response;
            const message = ((_error_response = error.response) === null || _error_response === void 0 ? void 0 : (_error_response_data = _error_response.data) === null || _error_response_data === void 0 ? void 0 : _error_response_data.message) || 'Login failed';
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(message);
            throw error;
        }
    };
    const register = async (data)=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post('/auth/register', data);
            const { user, accessToken, refreshToken } = response.data.data;
            if ("TURBOPACK compile-time truthy", 1) {
                localStorage.setItem('token', accessToken);
                localStorage.setItem('refreshToken', refreshToken);
            }
            setUser(user);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Registration successful!');
        } catch (error) {
            var _error_response_data, _error_response;
            const message = ((_error_response = error.response) === null || _error_response === void 0 ? void 0 : (_error_response_data = _error_response.data) === null || _error_response_data === void 0 ? void 0 : _error_response_data.message) || 'Registration failed';
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(message);
            throw error;
        }
    };
    const logout = ()=>{
        if ("TURBOPACK compile-time truthy", 1) {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
        }
        setUser(null);
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Logged out successfully');
    };
    const updateProfile = async (data)=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].put('/auth/profile', data);
            setUser(response.data.data.user);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Profile updated successfully!');
        } catch (error) {
            var _error_response_data, _error_response;
            const message = ((_error_response = error.response) === null || _error_response === void 0 ? void 0 : (_error_response_data = _error_response.data) === null || _error_response_data === void 0 ? void 0 : _error_response_data.message) || 'Profile update failed';
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(message);
            throw error;
        }
    };
    const refreshToken = async ()=>{
        try {
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) throw new Error('No refresh token');
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post('/auth/refresh', {
                refreshToken
            });
            const { token } = response.data.data;
            localStorage.setItem('token', token);
        } catch (error) {
            logout();
            throw error;
        }
    };
    const value = {
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        refreshToken
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/contexts/AuthContext.tsx",
        lineNumber: 220,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(AuthProvider, "NiO5z6JIqzX62LS5UWDgIqbZYyY=");
_c = AuthProvider;
const useAuth = ()=>{
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
_s1(useAuth, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
const __TURBOPACK__default__export__ = AuthContext;
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/contexts/ThemeContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeProvider",
    ()=>ThemeProvider,
    "default",
    ()=>__TURBOPACK__default__export__,
    "useTheme",
    ()=>useTheme
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
const ThemeContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const ThemeProvider = (param)=>{
    let { children } = param;
    _s();
    const [theme, setThemeState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('light');
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ThemeProvider.useEffect": ()=>{
            setMounted(true);
            // Check for saved theme preference or default to 'light'
            const savedTheme = ("TURBOPACK compile-time truthy", 1) ? localStorage.getItem('theme') : "TURBOPACK unreachable";
            const prefersDark = ("TURBOPACK compile-time truthy", 1) ? window.matchMedia('(prefers-color-scheme: dark)').matches : "TURBOPACK unreachable";
            const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
            setThemeState(initialTheme);
            // Apply theme to document
            if (typeof document !== 'undefined') {
                document.documentElement.classList.toggle('dark', initialTheme === 'dark');
            }
        }
    }["ThemeProvider.useEffect"], []);
    // Prevent hydration mismatch by not rendering theme-dependent content until mounted
    if (!mounted) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: children
        }, void 0, false);
    }
    const setTheme = (newTheme)=>{
        setThemeState(newTheme);
        if ("TURBOPACK compile-time truthy", 1) {
            localStorage.setItem('theme', newTheme);
        }
        if (typeof document !== 'undefined') {
            document.documentElement.classList.toggle('dark', newTheme === 'dark');
        }
    };
    const toggleTheme = ()=>{
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    };
    const value = {
        theme,
        toggleTheme,
        setTheme
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ThemeContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/contexts/ThemeContext.tsx",
        lineNumber: 62,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(ThemeProvider, "8EJlfNZEM7Rz4lnQSGQ4gv329RU=");
_c = ThemeProvider;
const useTheme = ()=>{
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(ThemeContext);
    if (context === undefined) {
        // Return default values during mounting phase to prevent hydration errors
        return {
            theme: 'light',
            toggleTheme: ()=>{},
            setTheme: ()=>{}
        };
    }
    return context;
};
_s1(useTheme, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
const __TURBOPACK__default__export__ = ThemeContext;
var _c;
__turbopack_context__.k.register(_c, "ThemeProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/contexts/BrokerAccountContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BrokerAccountProvider",
    ()=>BrokerAccountProvider,
    "useBrokerAccount",
    ()=>useBrokerAccount
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
const BrokerAccountContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function BrokerAccountProvider(param) {
    let { children } = param;
    _s();
    const [selectedAccount, setSelectedAccount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [accounts, setAccounts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const fetchBrokerAccounts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "BrokerAccountProvider.useCallback[fetchBrokerAccounts]": async ()=>{
            try {
                setLoading(true);
                setError(null);
                const token = localStorage.getItem('token');
                if (!token) {
                    // User is not authenticated, set empty accounts and return
                    setAccounts([]);
                    setSelectedAccount(null);
                    setLoading(false);
                    return;
                }
                const response = await fetch('/api/brokers/accounts', {
                    headers: {
                        'Authorization': "Bearer ".concat(token),
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch broker accounts');
                }
                const data = await response.json();
                if (data.success) {
                    setAccounts(data.data || []);
                    // If there's a previously selected account, try to maintain it
                    if (selectedAccount) {
                        const stillExists = data.data.find({
                            "BrokerAccountProvider.useCallback[fetchBrokerAccounts].stillExists": (acc)=>acc.id === selectedAccount.id
                        }["BrokerAccountProvider.useCallback[fetchBrokerAccounts].stillExists"]);
                        if (!stillExists) {
                            setSelectedAccount(null);
                        }
                    }
                    // Auto-select the first account if none is selected and accounts are available
                    if (!selectedAccount && data.data.length > 0) {
                        setSelectedAccount(data.data[0]);
                    }
                } else {
                    throw new Error(data.message || 'Failed to fetch accounts');
                }
            } catch (err) {
                console.error('Error fetching broker accounts:', err);
                setError(err instanceof Error ? err.message : 'Failed to load accounts');
                setAccounts([]);
            } finally{
                setLoading(false);
            }
        }
    }["BrokerAccountProvider.useCallback[fetchBrokerAccounts]"], [
        selectedAccount
    ]);
    const refreshAccounts = async ()=>{
        await fetchBrokerAccounts();
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "BrokerAccountProvider.useEffect": ()=>{
            fetchBrokerAccounts();
        }
    }["BrokerAccountProvider.useEffect"], []);
    // Save selected account to localStorage
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "BrokerAccountProvider.useEffect": ()=>{
            if (selectedAccount) {
                localStorage.setItem('selectedBrokerAccount', JSON.stringify(selectedAccount));
            } else {
                localStorage.removeItem('selectedBrokerAccount');
            }
        }
    }["BrokerAccountProvider.useEffect"], [
        selectedAccount
    ]);
    // Load selected account from localStorage on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "BrokerAccountProvider.useEffect": ()=>{
            const savedAccount = localStorage.getItem('selectedBrokerAccount');
            if (savedAccount) {
                try {
                    const parsedAccount = JSON.parse(savedAccount);
                    setSelectedAccount(parsedAccount);
                } catch (err) {
                    console.error('Error parsing saved broker account:', err);
                    localStorage.removeItem('selectedBrokerAccount');
                }
            }
        }
    }["BrokerAccountProvider.useEffect"], []);
    const value = {
        selectedAccount,
        setSelectedAccount,
        accounts,
        loading,
        error,
        refreshAccounts
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(BrokerAccountContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/contexts/BrokerAccountContext.tsx",
        lineNumber: 137,
        columnNumber: 5
    }, this);
}
_s(BrokerAccountProvider, "LXmI9DlFqVozwh0kOxl/WYexvzU=");
_c = BrokerAccountProvider;
function useBrokerAccount() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(BrokerAccountContext);
    if (context === undefined) {
        throw new Error('useBrokerAccount must be used within a BrokerAccountProvider');
    }
    return context;
}
_s1(useBrokerAccount, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "BrokerAccountProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/contexts/TradingModeContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TradingModeContext",
    ()=>TradingModeContext,
    "TradingModeProvider",
    ()=>TradingModeProvider,
    "useTradingMode",
    ()=>useTradingMode
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
const TradingModeContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function TradingModeProvider(param) {
    let { children } = param;
    _s();
    const [isPaperTrading, setIsPaperTrading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true); // Default to paper trading (demo mode)
    // Load trading mode from localStorage on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TradingModeProvider.useEffect": ()=>{
            const savedMode = localStorage.getItem('tradingMode');
            if (savedMode) {
                setIsPaperTrading(savedMode === 'paper');
            }
        }
    }["TradingModeProvider.useEffect"], []);
    // Save trading mode to localStorage when it changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TradingModeProvider.useEffect": ()=>{
            localStorage.setItem('tradingMode', isPaperTrading ? 'paper' : 'live');
        }
    }["TradingModeProvider.useEffect"], [
        isPaperTrading
    ]);
    const tradingMode = isPaperTrading ? 'paper' : 'live';
    const toggleTradingMode = ()=>{
        setIsPaperTrading(!isPaperTrading);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TradingModeContext.Provider, {
        value: {
            isPaperTrading,
            setIsPaperTrading,
            tradingMode,
            toggleTradingMode
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/contexts/TradingModeContext.tsx",
        lineNumber: 41,
        columnNumber: 5
    }, this);
}
_s(TradingModeProvider, "9Qhn6QPq3vPE7lPljpFITRZMfRo=");
_c = TradingModeProvider;
function useTradingMode() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(TradingModeContext);
    if (context === undefined) {
        throw new Error('useTradingMode must be used within a TradingModeProvider');
    }
    return context;
}
_s1(useTradingMode, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
;
var _c;
__turbopack_context__.k.register(_c, "TradingModeProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/errorHandler.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ErrorSeverity",
    ()=>ErrorSeverity,
    "ErrorType",
    ()=>ErrorType,
    "default",
    ()=>__TURBOPACK__default__export__,
    "errorHandler",
    ()=>errorHandler,
    "handleCompilationError",
    ()=>handleCompilationError,
    "handleNetworkError",
    ()=>handleNetworkError,
    "handleTradingError",
    ()=>handleTradingError,
    "handleValidationError",
    ()=>handleValidationError,
    "useErrorHandler",
    ()=>useErrorHandler
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_define_property.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-hot-toast/dist/index.mjs [app-client] (ecmascript)");
'use client';
;
;
var ErrorType = /*#__PURE__*/ function(ErrorType) {
    ErrorType["VALIDATION"] = "validation";
    ErrorType["NETWORK"] = "network";
    ErrorType["AUTHENTICATION"] = "authentication";
    ErrorType["TRADING"] = "trading";
    ErrorType["COMPILATION"] = "compilation";
    ErrorType["SYSTEM"] = "system";
    ErrorType["USER_INPUT"] = "user_input";
    return ErrorType;
}({});
var ErrorSeverity = /*#__PURE__*/ function(ErrorSeverity) {
    ErrorSeverity["LOW"] = "low";
    ErrorSeverity["MEDIUM"] = "medium";
    ErrorSeverity["HIGH"] = "high";
    ErrorSeverity["CRITICAL"] = "critical";
    return ErrorSeverity;
}({});
// Default configurations for different error types
const DEFAULT_CONFIGS = {
    ["validation"]: {
        showToast: true,
        logToConsole: false,
        logToService: false,
        retryable: false
    },
    ["network"]: {
        showToast: true,
        logToConsole: true,
        logToService: true,
        retryable: true
    },
    ["authentication"]: {
        showToast: true,
        logToConsole: true,
        logToService: true,
        retryable: false
    },
    ["trading"]: {
        showToast: true,
        logToConsole: true,
        logToService: true,
        retryable: true
    },
    ["compilation"]: {
        showToast: false,
        logToConsole: true,
        logToService: false,
        retryable: false
    },
    ["system"]: {
        showToast: true,
        logToConsole: true,
        logToService: true,
        retryable: false
    },
    ["user_input"]: {
        showToast: true,
        logToConsole: false,
        logToService: false,
        retryable: false
    }
};
// Centralized error handler class
class ErrorHandler {
    static getInstance() {
        if (!ErrorHandler.instance) {
            ErrorHandler.instance = new ErrorHandler();
        }
        return ErrorHandler.instance;
    }
    // Main error handling method
    handle(error, context, config) {
        const appError = this.normalizeError(error, context);
        const finalConfig = {
            ...DEFAULT_CONFIGS[appError.type],
            ...config
        };
        // Add to error queue
        this.addToQueue(appError);
        // Handle based on configuration
        if (finalConfig.showToast) {
            this.showToast(appError);
        }
        if (finalConfig.logToConsole) {
            this.logToConsole(appError);
        }
        if (finalConfig.logToService) {
            this.logToService(appError);
        }
        return appError;
    }
    // Normalize different error types to AppError
    normalizeError(error, context) {
        if (typeof error === 'string') {
            return {
                type: "system",
                severity: "medium",
                message: error,
                timestamp: new Date(),
                context
            };
        }
        if (error instanceof Error) {
            return {
                type: this.inferErrorType(error),
                severity: this.inferSeverity(error),
                message: error.message,
                details: {
                    name: error.name,
                    stack: error.stack
                },
                timestamp: new Date(),
                context
            };
        }
        // Already an AppError
        return {
            ...error,
            context: context || error.context
        };
    }
    // Infer error type from Error object
    inferErrorType(error) {
        const message = error.message.toLowerCase();
        const name = error.name.toLowerCase();
        if (message.includes('validation') || message.includes('required') || message.includes('invalid')) {
            return "validation";
        }
        if (message.includes('network') || message.includes('fetch') || name.includes('network')) {
            return "network";
        }
        if (message.includes('auth') || message.includes('token') || message.includes('unauthorized')) {
            return "authentication";
        }
        if (message.includes('trade') || message.includes('order') || message.includes('position')) {
            return "trading";
        }
        if (message.includes('compile') || message.includes('syntax') || message.includes('parse')) {
            return "compilation";
        }
        return "system";
    }
    // Infer severity from Error object
    inferSeverity(error) {
        const message = error.message.toLowerCase();
        if (message.includes('critical') || message.includes('fatal')) {
            return "critical";
        }
        if (message.includes('failed') || message.includes('error')) {
            return "high";
        }
        if (message.includes('warning') || message.includes('deprecated')) {
            return "medium";
        }
        return "low";
    }
    // Show appropriate toast based on error severity
    showToast(error) {
        const message = this.formatUserMessage(error);
        switch(error.severity){
            case "critical":
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(message, {
                    duration: 8000
                });
                break;
            case "high":
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(message, {
                    duration: 6000
                });
                break;
            case "medium":
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"])(message, {
                    icon: '⚠️',
                    duration: 4000
                });
                break;
            case "low":
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"])(message, {
                    icon: 'ℹ️',
                    duration: 3000
                });
                break;
        }
    }
    // Format user-friendly error messages
    formatUserMessage(error) {
        switch(error.type){
            case "validation":
                return error.message;
            case "network":
                return 'Network error. Please check your connection and try again.';
            case "authentication":
                return 'Authentication failed. Please log in again.';
            case "trading":
                return "Trading error: ".concat(error.message);
            case "compilation":
                return "Compilation error: ".concat(error.message);
            default:
                return 'An unexpected error occurred. Please try again.';
        }
    }
    // Log to console with proper formatting
    logToConsole(error) {
        const logMethod = error.severity === "critical" || error.severity === "high" ? console.error : console.warn;
        logMethod("[".concat(error.type.toUpperCase(), "] ").concat(error.message), {
            severity: error.severity,
            timestamp: error.timestamp,
            context: error.context,
            details: error.details
        });
    }
    // Log to external service (placeholder for future implementation)
    logToService(error) {
        // In production, this would send to error tracking service like Sentry
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }
    // Add error to queue for analysis
    addToQueue(error) {
        this.errorQueue.push(error);
        if (this.errorQueue.length > this.maxQueueSize) {
            this.errorQueue.shift(); // Remove oldest error
        }
    }
    // Get recent errors for debugging
    getRecentErrors() {
        let count = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 10;
        return this.errorQueue.slice(-count);
    }
    // Clear error queue
    clearErrors() {
        this.errorQueue = [];
    }
    // Get error statistics
    getErrorStats() {
        const stats = {
            total: this.errorQueue.length,
            byType: {},
            bySeverity: {}
        };
        // Initialize counters
        Object.values(ErrorType).forEach((type)=>{
            stats.byType[type] = 0;
        });
        Object.values(ErrorSeverity).forEach((severity)=>{
            stats.bySeverity[severity] = 0;
        });
        // Count errors
        this.errorQueue.forEach((error)=>{
            stats.byType[error.type]++;
            stats.bySeverity[error.severity]++;
        });
        return stats;
    }
    constructor(){
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "errorQueue", []);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "maxQueueSize", 100);
    }
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(ErrorHandler, "instance", void 0);
const errorHandler = ErrorHandler.getInstance();
const handleValidationError = (message, context)=>{
    return errorHandler.handle({
        type: "validation",
        severity: "medium",
        message,
        timestamp: new Date()
    }, context);
};
const handleNetworkError = (error, context)=>{
    return errorHandler.handle(error, context, {
        showToast: true,
        logToConsole: true,
        logToService: true
    });
};
const handleTradingError = (message, details, context)=>{
    return errorHandler.handle({
        type: "trading",
        severity: "high",
        message,
        details,
        timestamp: new Date()
    }, context);
};
const handleCompilationError = function(line, message) {
    let type = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 'error';
    return errorHandler.handle({
        type: "compilation",
        severity: type === 'error' ? "high" : "medium",
        message: "Line ".concat(line, ": ").concat(message),
        details: {
            line,
            type
        },
        timestamp: new Date()
    }, 'Pine Script Compilation');
};
const useErrorHandler = ()=>{
    return {
        handleError: (error, context)=>errorHandler.handle(error, context),
        handleValidationError,
        handleNetworkError,
        handleTradingError,
        handleCompilationError,
        getRecentErrors: ()=>errorHandler.getRecentErrors(),
        getErrorStats: ()=>errorHandler.getErrorStats(),
        clearErrors: ()=>errorHandler.clearErrors()
    };
};
const __TURBOPACK__default__export__ = errorHandler;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/logger.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Logger",
    ()=>Logger,
    "default",
    ()=>__TURBOPACK__default__export__,
    "logger",
    ()=>logger,
    "useLogger",
    ()=>useLogger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_define_property.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$errorHandler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/errorHandler.ts [app-client] (ecmascript)");
'use client';
;
;
class Logger {
    // Error logging
    static error(message, error, context) {
        if (error instanceof Error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$errorHandler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["errorHandler"].handle(error, context || 'Logger');
        } else {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$errorHandler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["errorHandler"].handle(new Error(message), context || 'Logger');
        }
        // Still log to console in development for debugging
        if (this.isDevelopment) {
            console.error("[".concat(context || 'Logger', "] ").concat(message), error);
        }
    }
    // Warning logging
    static warn(message, context, details) {
        const warningError = new Error(message);
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$errorHandler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["errorHandler"].handle(warningError, context || 'Logger');
        if (this.isDevelopment) {
            console.warn("[".concat(context || 'Logger', "] ").concat(message), details);
        }
    }
    // Info logging (for important events)
    static info(message, context, details) {
        // Only log to console in development, or to external service in production
        if (this.isDevelopment) {
            console.log("[".concat(context || 'Logger', "] ").concat(message), details);
        } else if (this.isProduction) {
            // In production, you might want to log to an external service
            // For now, we'll just store it internally
            this.logToService('info', message, context, details);
        }
    }
    // Debug logging (only in development)
    static debug(message, context, details) {
        if (this.isDevelopment) {
            console.log("[DEBUG][".concat(context || 'Logger', "] ").concat(message), details);
        }
    }
    // Trading-specific logging
    static trading(message, details, context) {
        const tradingError = new Error(message);
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$errorHandler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["errorHandler"].handle(tradingError, context || 'Trading');
        if (this.isDevelopment) {
            console.log("[TRADING][".concat(context || 'Trading', "] ").concat(message), details);
        }
    }
    // Performance logging
    static performance(operation, duration, context) {
        const message = "".concat(operation, " completed in ").concat(duration, "ms");
        if (duration > 1000) {
            // Log slow operations as warnings
            this.warn("Slow operation: ".concat(message), context || 'Performance');
        } else {
            this.info(message, context || 'Performance');
        }
    }
    // User action logging
    static userAction(action, userId, details) {
        const context = userId ? "User-".concat(userId) : 'User';
        this.info("User action: ".concat(action), context, details);
    }
    // API call logging
    static apiCall(method, url, status, duration) {
        const message = "".concat(method, " ").concat(url, " - ").concat(status, " (").concat(duration, "ms)");
        if (status >= 400) {
            this.error("API Error: ".concat(message), undefined, 'API');
        } else if (duration > 2000) {
            this.warn("Slow API call: ".concat(message), 'API');
        } else {
            this.debug(message, 'API');
        }
    }
    // Private method to log to external service (placeholder)
    static logToService(level, message, context, details) {
        // In a real application, you would send this to your logging service
        // For now, we'll just store it in memory or localStorage
        try {
            const logEntry = {
                level,
                message,
                context,
                details,
                timestamp: new Date().toISOString(),
                userAgent: ("TURBOPACK compile-time truthy", 1) ? window.navigator.userAgent : "TURBOPACK unreachable",
                url: ("TURBOPACK compile-time truthy", 1) ? window.location.href : "TURBOPACK unreachable"
            };
            // Store in localStorage for now (in production, send to logging service)
            if ("object" !== 'undefined' && window.localStorage) {
                const logs = JSON.parse(localStorage.getItem('app_logs') || '[]');
                logs.push(logEntry);
                // Keep only last 100 logs to prevent storage overflow
                if (logs.length > 100) {
                    logs.splice(0, logs.length - 100);
                }
                localStorage.setItem('app_logs', JSON.stringify(logs));
            }
        } catch (error) {
            // Fallback to console if logging service fails
            if (this.isDevelopment) {
                console.error('Failed to log to service:', error);
            }
        }
    }
    // Method to retrieve logs (useful for debugging)
    static getLogs() {
        try {
            if ("object" !== 'undefined' && window.localStorage) {
                return JSON.parse(localStorage.getItem('app_logs') || '[]');
            }
        } catch (error) {
            this.error('Failed to retrieve logs', error, 'Logger');
        }
        return [];
    }
    // Method to clear logs
    static clearLogs() {
        try {
            if ("object" !== 'undefined' && window.localStorage) {
                localStorage.removeItem('app_logs');
            }
        } catch (error) {
            this.error('Failed to clear logs', error, 'Logger');
        }
    }
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(Logger, "isDevelopment", ("TURBOPACK compile-time value", "development") === 'development');
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(Logger, "isProduction", ("TURBOPACK compile-time value", "development") === 'production');
const logger = Logger;
const __TURBOPACK__default__export__ = Logger;
function useLogger() {
    return {
        error: Logger.error,
        warn: Logger.warn,
        info: Logger.info,
        debug: Logger.debug,
        trading: Logger.trading,
        performance: Logger.performance,
        userAction: Logger.userAction,
        apiCall: Logger.apiCall,
        getLogs: Logger.getLogs,
        clearLogs: Logger.clearLogs
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/services/workflowAutomationService.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "workflowAutomationService",
    ()=>workflowAutomationService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_define_property.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$events$2f$events$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/events/events.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/logger.ts [app-client] (ecmascript)");
;
;
;
class WorkflowAutomationService extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$events$2f$events$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventEmitter"] {
    async initialize() {
        if (this.isInitialized) return;
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].info('Initializing Workflow Automation Service');
        // Set up event listeners for cross-page communication
        this.setupEventListeners();
        this.isInitialized = true;
        this.emit('service:initialized');
    }
    setupEventListeners() {
        // Listen for dashboard events
        this.on('dashboard:workflow:trigger', this.handleDashboardTrigger.bind(this));
        this.on('trading:order:placed', this.handleTradingEvent.bind(this));
        this.on('market:price:change', this.handleMarketEvent.bind(this));
    }
    initializeDefaultWorkflows() {
        const defaultWorkflows = [
            {
                id: 'auto-stop-loss',
                name: 'Automatic Stop Loss',
                description: 'Automatically place stop loss orders when positions are opened',
                isActive: true,
                steps: [
                    {
                        id: 'trigger-position-open',
                        type: 'trigger',
                        name: 'Position Opened',
                        config: {
                            eventType: 'position:opened'
                        },
                        status: 'pending'
                    },
                    {
                        id: 'calculate-stop-loss',
                        type: 'action',
                        name: 'Calculate Stop Loss Price',
                        config: {
                            riskPercentage: 2
                        },
                        status: 'pending'
                    },
                    {
                        id: 'place-stop-loss',
                        type: 'action',
                        name: 'Place Stop Loss Order',
                        config: {
                            orderType: 'stop_loss'
                        },
                        status: 'pending'
                    }
                ],
                createdAt: new Date(),
                executionCount: 0,
                successRate: 100
            },
            {
                id: 'profit-taking',
                name: 'Automated Profit Taking',
                description: 'Take profits at predefined levels',
                isActive: false,
                steps: [
                    {
                        id: 'trigger-profit-target',
                        type: 'trigger',
                        name: 'Profit Target Reached',
                        config: {
                            profitPercentage: 5
                        },
                        status: 'pending'
                    },
                    {
                        id: 'partial-close',
                        type: 'action',
                        name: 'Close Partial Position',
                        config: {
                            closePercentage: 50
                        },
                        status: 'pending'
                    }
                ],
                createdAt: new Date(),
                executionCount: 0,
                successRate: 95
            }
        ];
        defaultWorkflows.forEach((workflow)=>{
            this.workflows.set(workflow.id, workflow);
        });
    }
    // Workflow Management
    createWorkflow(workflow) {
        const id = "workflow-".concat(Date.now(), "-").concat(Math.random().toString(36).substr(2, 9));
        const newWorkflow = {
            ...workflow,
            id,
            createdAt: new Date(),
            executionCount: 0,
            successRate: 100
        };
        this.workflows.set(id, newWorkflow);
        this.emit('workflow:created', newWorkflow);
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].info("Created workflow: ".concat(newWorkflow.name));
        return id;
    }
    getWorkflow(id) {
        return this.workflows.get(id);
    }
    getAllWorkflows() {
        return Array.from(this.workflows.values());
    }
    getActiveWorkflows() {
        return this.getAllWorkflows().filter((w)=>w.isActive);
    }
    updateWorkflow(id, updates) {
        const workflow = this.workflows.get(id);
        if (!workflow) return false;
        const updatedWorkflow = {
            ...workflow,
            ...updates
        };
        this.workflows.set(id, updatedWorkflow);
        this.emit('workflow:updated', updatedWorkflow);
        return true;
    }
    deleteWorkflow(id) {
        const deleted = this.workflows.delete(id);
        if (deleted) {
            this.emit('workflow:deleted', id);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].info("Deleted workflow: ".concat(id));
        }
        return deleted;
    }
    // Workflow Execution
    async executeWorkflow(workflowId, triggerData) {
        const workflow = this.workflows.get(workflowId);
        if (!workflow) {
            throw new Error("Workflow not found: ".concat(workflowId));
        }
        if (!workflow.isActive) {
            throw new Error("Workflow is not active: ".concat(workflowId));
        }
        const executionId = "exec-".concat(Date.now(), "-").concat(Math.random().toString(36).substr(2, 9));
        const execution = {
            id: executionId,
            workflowId,
            status: 'running',
            startTime: new Date(),
            steps: workflow.steps.map((step)=>({
                    ...step,
                    status: 'pending'
                }))
        };
        this.executions.set(executionId, execution);
        this.emit('workflow:execution:started', execution);
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].info("Started workflow execution: ".concat(workflowId));
        try {
            await this.runWorkflowSteps(execution, triggerData);
            execution.status = 'completed';
            execution.endTime = new Date();
            // Update workflow statistics
            workflow.executionCount++;
            workflow.lastExecuted = new Date();
            this.emit('workflow:execution:completed', execution);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].info("Completed workflow execution: ".concat(executionId));
        } catch (error) {
            execution.status = 'failed';
            execution.endTime = new Date();
            execution.error = error instanceof Error ? error.message : 'Unknown error';
            workflow.executionCount++;
            workflow.successRate = Math.max(0, workflow.successRate - 5);
            this.emit('workflow:execution:failed', execution);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error("Failed workflow execution: ".concat(executionId), error);
        }
        return executionId;
    }
    async runWorkflowSteps(execution, triggerData) {
        for (const step of execution.steps){
            step.status = 'running';
            this.emit('workflow:step:started', {
                execution,
                step
            });
            try {
                const result = await this.executeStep(step, triggerData);
                step.result = result;
                step.status = 'completed';
                this.emit('workflow:step:completed', {
                    execution,
                    step
                });
            } catch (error) {
                step.status = 'failed';
                this.emit('workflow:step:failed', {
                    execution,
                    step,
                    error
                });
                throw error;
            }
        }
    }
    async executeStep(step, triggerData) {
        switch(step.type){
            case 'trigger':
                return this.executeTriggerStep(step, triggerData);
            case 'condition':
                return this.executeConditionStep(step, triggerData);
            case 'action':
                return this.executeActionStep(step, triggerData);
            default:
                throw new Error("Unknown step type: ".concat(step.type));
        }
    }
    async executeTriggerStep(step, triggerData) {
        // Trigger steps are usually already satisfied when workflow is executed
        return {
            triggered: true,
            data: triggerData
        };
    }
    async executeConditionStep(step, triggerData) {
        // Implement condition logic based on step.config
        return {
            conditionMet: true
        };
    }
    async executeActionStep(step, triggerData) {
        // Implement action logic based on step.config
        switch(step.config.orderType){
            case 'stop_loss':
                return this.placeStopLossOrder(step.config, triggerData);
            case 'take_profit':
                return this.takeProfitOrder(step.config, triggerData);
            default:
                return {
                    actionExecuted: true
                };
        }
    }
    async placeStopLossOrder(config, triggerData) {
        // Simulate placing a stop loss order
        const stopLossPrice = (triggerData === null || triggerData === void 0 ? void 0 : triggerData.entryPrice) * (1 - (config.riskPercentage || 2) / 100);
        this.emit('trading:order:place', {
            type: 'stop_loss',
            price: stopLossPrice,
            symbol: triggerData === null || triggerData === void 0 ? void 0 : triggerData.symbol,
            quantity: triggerData === null || triggerData === void 0 ? void 0 : triggerData.quantity
        });
        return {
            orderPlaced: true,
            stopLossPrice
        };
    }
    async takeProfitOrder(config, triggerData) {
        // Simulate taking profit
        const closeQuantity = ((triggerData === null || triggerData === void 0 ? void 0 : triggerData.quantity) || 0) * (config.closePercentage || 100) / 100;
        this.emit('trading:order:place', {
            type: 'market',
            side: 'sell',
            symbol: triggerData === null || triggerData === void 0 ? void 0 : triggerData.symbol,
            quantity: closeQuantity
        });
        return {
            orderPlaced: true,
            closedQuantity: closeQuantity
        };
    }
    // Event Handlers
    async handleDashboardTrigger(event) {
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].info("Dashboard workflow trigger received: ".concat(JSON.stringify(event)));
        // Find workflows that should be triggered by this event
        const activeWorkflows = this.getActiveWorkflows();
        for (const workflow of activeWorkflows){
            const triggerStep = workflow.steps.find((step)=>step.type === 'trigger');
            if (triggerStep && this.shouldTriggerWorkflow(triggerStep, event)) {
                await this.executeWorkflow(workflow.id, event.data);
            }
        }
    }
    async handleTradingEvent(event) {
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].info('Trading event received', event);
        // Trigger relevant workflows based on trading events
        if (event.type === 'position:opened') {
            const triggerEvent = {
                type: 'manual',
                data: event,
                timestamp: new Date()
            };
            await this.handleDashboardTrigger(triggerEvent);
        }
    }
    async handleMarketEvent(event) {
        // Handle market-based triggers
        const triggerEvent = {
            type: 'price_change',
            data: event,
            timestamp: new Date()
        };
        await this.handleDashboardTrigger(triggerEvent);
    }
    shouldTriggerWorkflow(triggerStep, event) {
        // Implement trigger matching logic
        return triggerStep.config.eventType === event.type || triggerStep.config.eventType === 'position:opened';
    }
    // Cross-page Communication
    triggerFromDashboard(workflowId, data) {
        const event = {
            type: 'dashboard_action',
            data: {
                workflowId,
                ...data
            },
            timestamp: new Date()
        };
        this.emit('dashboard:workflow:trigger', event);
        this.emit('page:navigate', {
            to: '/trading',
            workflow: workflowId
        });
    }
    connectPages() {
        // Establish connection between dashboard and trading pages
        this.emit('pages:connected');
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].info('Pages connected for workflow automation');
    }
    // Execution Queries
    getExecution(id) {
        return this.executions.get(id);
    }
    getWorkflowExecutions(workflowId) {
        return Array.from(this.executions.values()).filter((exec)=>exec.workflowId === workflowId);
    }
    getRecentExecutions() {
        let limit = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 10;
        return Array.from(this.executions.values()).sort((a, b)=>b.startTime.getTime() - a.startTime.getTime()).slice(0, limit);
    }
    // Statistics
    getWorkflowStats(workflowId) {
        const workflow = this.workflows.get(workflowId);
        if (!workflow) {
            return {
                executionCount: 0,
                successRate: 0
            };
        }
        return {
            executionCount: workflow.executionCount,
            successRate: workflow.successRate,
            lastExecuted: workflow.lastExecuted
        };
    }
    constructor(){
        super(), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "workflows", new Map()), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "executions", new Map()), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "isInitialized", false);
        this.initializeDefaultWorkflows();
    }
}
const workflowAutomationService = new WorkflowAutomationService();
// Initialize on import
workflowAutomationService.initialize().catch((error)=>{
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error('Failed to initialize workflow automation service', error);
});
const __TURBOPACK__default__export__ = workflowAutomationService;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/contexts/WorkflowContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WorkflowProvider",
    ()=>WorkflowProvider,
    "default",
    ()=>__TURBOPACK__default__export__,
    "useWorkflow",
    ()=>useWorkflow
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$workflowAutomationService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/services/workflowAutomationService.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/logger.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
;
const initialState = {
    workflows: [],
    activeWorkflows: [],
    recentExecutions: [],
    isConnected: false,
    isLoading: false,
    crossPageData: {}
};
function workflowReducer(state, action) {
    switch(action.type){
        case 'SET_LOADING':
            return {
                ...state,
                isLoading: action.payload
            };
        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload,
                isLoading: false
            };
        case 'CLEAR_ERROR':
            return {
                ...state,
                error: undefined
            };
        case 'SET_WORKFLOWS':
            return {
                ...state,
                workflows: action.payload,
                activeWorkflows: action.payload.filter((w)=>w.isActive)
            };
        case 'ADD_WORKFLOW':
            const newWorkflows = [
                ...state.workflows,
                action.payload
            ];
            return {
                ...state,
                workflows: newWorkflows,
                activeWorkflows: newWorkflows.filter((w)=>w.isActive)
            };
        case 'UPDATE_WORKFLOW':
            const updatedWorkflows = state.workflows.map((w)=>w.id === action.payload.id ? action.payload : w);
            return {
                ...state,
                workflows: updatedWorkflows,
                activeWorkflows: updatedWorkflows.filter((w)=>w.isActive)
            };
        case 'DELETE_WORKFLOW':
            const filteredWorkflows = state.workflows.filter((w)=>w.id !== action.payload);
            return {
                ...state,
                workflows: filteredWorkflows,
                activeWorkflows: filteredWorkflows.filter((w)=>w.isActive)
            };
        case 'SET_CURRENT_EXECUTION':
            return {
                ...state,
                currentExecution: action.payload
            };
        case 'ADD_EXECUTION':
            return {
                ...state,
                recentExecutions: [
                    action.payload,
                    ...state.recentExecutions.slice(0, 9)
                ]
            };
        case 'SET_RECENT_EXECUTIONS':
            return {
                ...state,
                recentExecutions: action.payload
            };
        case 'SET_CONNECTED':
            return {
                ...state,
                isConnected: action.payload
            };
        case 'SELECT_WORKFLOW':
            return {
                ...state,
                selectedWorkflowId: action.payload
            };
        case 'SET_CROSS_PAGE_DATA':
            return {
                ...state,
                crossPageData: {
                    ...state.crossPageData,
                    ...action.payload
                }
            };
        case 'CLEAR_CROSS_PAGE_DATA':
            return {
                ...state,
                crossPageData: {}
            };
        case 'SYNC_STATE':
            return {
                ...action.payload
            };
        case 'UPDATE_WORKFLOW_STATUS':
            const statusUpdatedWorkflows = state.workflows.map((w)=>w.id === action.payload.workflowId ? {
                    ...w,
                    status: action.payload.status
                } : w);
            return {
                ...state,
                workflows: statusUpdatedWorkflows,
                activeWorkflows: statusUpdatedWorkflows.filter((w)=>w.isActive)
            };
        default:
            return state;
    }
}
const WorkflowContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function WorkflowProvider(param) {
    let { children } = param;
    _s();
    const [state, dispatch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReducer"])(workflowReducer, initialState);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    // Initialize from localStorage on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "WorkflowProvider.useEffect": ()=>{
            try {
                const savedState = localStorage.getItem('workflowState');
                if (savedState) {
                    const parsedState = JSON.parse(savedState);
                    dispatch({
                        type: 'SYNC_STATE',
                        payload: parsedState
                    });
                }
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error('Failed to load workflow state from localStorage', error);
            }
        }
    }["WorkflowProvider.useEffect"], []);
    // Real-time status broadcasting
    const broadcastStatusUpdate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "WorkflowProvider.useCallback[broadcastStatusUpdate]": (workflowId, status)=>{
            const updateEvent = new CustomEvent('workflow-status-update', {
                detail: {
                    workflowId,
                    status,
                    timestamp: Date.now()
                }
            });
            window.dispatchEvent(updateEvent);
            // Cross-tab communication
            localStorage.setItem('workflow-status-update', JSON.stringify({
                workflowId,
                status,
                timestamp: Date.now()
            }));
        }
    }["WorkflowProvider.useCallback[broadcastStatusUpdate]"], []);
    // Listen for real-time status updates
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "WorkflowProvider.useEffect": ()=>{
            const handleStatusUpdate = {
                "WorkflowProvider.useEffect.handleStatusUpdate": (event)=>{
                    const { workflowId, status } = event.detail;
                    dispatch({
                        type: 'UPDATE_WORKFLOW_STATUS',
                        payload: {
                            workflowId,
                            status
                        }
                    });
                }
            }["WorkflowProvider.useEffect.handleStatusUpdate"];
            const handleStorageStatusUpdate = {
                "WorkflowProvider.useEffect.handleStorageStatusUpdate": (event)=>{
                    if (event.key === 'workflow-status-update' && event.newValue) {
                        try {
                            const { workflowId, status } = JSON.parse(event.newValue);
                            dispatch({
                                type: 'UPDATE_WORKFLOW_STATUS',
                                payload: {
                                    workflowId,
                                    status
                                }
                            });
                        } catch (error) {
                            console.error('Failed to parse workflow status update:', error);
                        }
                    }
                }
            }["WorkflowProvider.useEffect.handleStorageStatusUpdate"];
            window.addEventListener('workflow-status-update', handleStatusUpdate);
            window.addEventListener('storage', handleStorageStatusUpdate);
            return ({
                "WorkflowProvider.useEffect": ()=>{
                    window.removeEventListener('workflow-status-update', handleStatusUpdate);
                    window.removeEventListener('storage', handleStorageStatusUpdate);
                }
            })["WorkflowProvider.useEffect"];
        }
    }["WorkflowProvider.useEffect"], []);
    // Real-time synchronization
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "WorkflowProvider.useEffect": ()=>{
            // Save state to localStorage whenever it changes
            localStorage.setItem('workflowState', JSON.stringify(state));
            // Broadcast state changes to other tabs/windows
            const event = new CustomEvent('workflow-state-update', {
                detail: {
                    state,
                    timestamp: Date.now()
                }
            });
            window.dispatchEvent(event);
        }
    }["WorkflowProvider.useEffect"], [
        state
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "WorkflowProvider.useEffect": ()=>{
            // Listen for state updates from other tabs/windows
            const handleStateUpdate = {
                "WorkflowProvider.useEffect.handleStateUpdate": (event)=>{
                    const { state: newState } = event.detail;
                    if (newState && JSON.stringify(newState) !== JSON.stringify(state)) {
                        dispatch({
                            type: 'SYNC_STATE',
                            payload: newState
                        });
                    }
                }
            }["WorkflowProvider.useEffect.handleStateUpdate"];
            // Listen for localStorage changes (cross-tab communication)
            const handleStorageChange = {
                "WorkflowProvider.useEffect.handleStorageChange": (event)=>{
                    if (event.key === 'workflowState' && event.newValue) {
                        try {
                            const newState = JSON.parse(event.newValue);
                            if (JSON.stringify(newState) !== JSON.stringify(state)) {
                                dispatch({
                                    type: 'SYNC_STATE',
                                    payload: newState
                                });
                            }
                        } catch (error) {
                            console.error('Failed to parse workflow state from localStorage:', error);
                        }
                    }
                }
            }["WorkflowProvider.useEffect.handleStorageChange"];
            window.addEventListener('workflow-state-update', handleStateUpdate);
            window.addEventListener('storage', handleStorageChange);
            return ({
                "WorkflowProvider.useEffect": ()=>{
                    window.removeEventListener('workflow-state-update', handleStateUpdate);
                    window.removeEventListener('storage', handleStorageChange);
                }
            })["WorkflowProvider.useEffect"];
        }
    }["WorkflowProvider.useEffect"], [
        state
    ]);
    // Initialize workflow service and set up event listeners
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "WorkflowProvider.useEffect": ()=>{
            const initializeWorkflows = {
                "WorkflowProvider.useEffect.initializeWorkflows": async ()=>{
                    try {
                        dispatch({
                            type: 'SET_LOADING',
                            payload: true
                        });
                        // Initialize the service
                        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$workflowAutomationService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["workflowAutomationService"].initialize();
                        // Load existing workflows
                        const workflows = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$workflowAutomationService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["workflowAutomationService"].getAllWorkflows();
                        dispatch({
                            type: 'SET_WORKFLOWS',
                            payload: workflows
                        });
                        // Load recent executions
                        const recentExecutions = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$workflowAutomationService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["workflowAutomationService"].getRecentExecutions(10);
                        dispatch({
                            type: 'SET_RECENT_EXECUTIONS',
                            payload: recentExecutions
                        });
                        dispatch({
                            type: 'SET_CONNECTED',
                            payload: true
                        });
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].info('Workflow context initialized successfully');
                    } catch (error) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error('Failed to initialize workflow context', error);
                        dispatch({
                            type: 'SET_ERROR',
                            payload: 'Failed to initialize workflows'
                        });
                    } finally{
                        dispatch({
                            type: 'SET_LOADING',
                            payload: false
                        });
                    }
                }
            }["WorkflowProvider.useEffect.initializeWorkflows"];
            initializeWorkflows();
        }
    }["WorkflowProvider.useEffect"], []);
    // Set up event listeners for workflow service events
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "WorkflowProvider.useEffect": ()=>{
            const handleWorkflowCreated = {
                "WorkflowProvider.useEffect.handleWorkflowCreated": (workflow)=>{
                    dispatch({
                        type: 'ADD_WORKFLOW',
                        payload: workflow
                    });
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].info("Workflow created: ".concat(workflow.name));
                }
            }["WorkflowProvider.useEffect.handleWorkflowCreated"];
            const handleWorkflowUpdated = {
                "WorkflowProvider.useEffect.handleWorkflowUpdated": (workflow)=>{
                    dispatch({
                        type: 'UPDATE_WORKFLOW',
                        payload: workflow
                    });
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].info("Workflow updated: ".concat(workflow.name));
                }
            }["WorkflowProvider.useEffect.handleWorkflowUpdated"];
            const handleWorkflowDeleted = {
                "WorkflowProvider.useEffect.handleWorkflowDeleted": (workflowId)=>{
                    dispatch({
                        type: 'DELETE_WORKFLOW',
                        payload: workflowId
                    });
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].info("Workflow deleted: ".concat(workflowId));
                }
            }["WorkflowProvider.useEffect.handleWorkflowDeleted"];
            const handleExecutionStarted = {
                "WorkflowProvider.useEffect.handleExecutionStarted": (execution)=>{
                    dispatch({
                        type: 'SET_CURRENT_EXECUTION',
                        payload: execution
                    });
                    dispatch({
                        type: 'ADD_EXECUTION',
                        payload: execution
                    });
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].info("Workflow execution started: ".concat(execution.id));
                }
            }["WorkflowProvider.useEffect.handleExecutionStarted"];
            const handleExecutionCompleted = {
                "WorkflowProvider.useEffect.handleExecutionCompleted": (execution)=>{
                    dispatch({
                        type: 'SET_CURRENT_EXECUTION',
                        payload: execution
                    });
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].info("Workflow execution completed: ".concat(execution.id));
                }
            }["WorkflowProvider.useEffect.handleExecutionCompleted"];
            const handleExecutionFailed = {
                "WorkflowProvider.useEffect.handleExecutionFailed": (execution)=>{
                    dispatch({
                        type: 'SET_CURRENT_EXECUTION',
                        payload: execution
                    });
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error("Workflow execution failed: ".concat(execution.id), new Error(execution.error));
                }
            }["WorkflowProvider.useEffect.handleExecutionFailed"];
            const handlePageNavigation = {
                "WorkflowProvider.useEffect.handlePageNavigation": (data)=>{
                    if (data.workflow) {
                        dispatch({
                            type: 'SELECT_WORKFLOW',
                            payload: data.workflow
                        });
                        dispatch({
                            type: 'SET_CROSS_PAGE_DATA',
                            payload: {
                                selectedWorkflow: data.workflow
                            }
                        });
                    }
                    router.push(data.to);
                }
            }["WorkflowProvider.useEffect.handlePageNavigation"];
            // Register event listeners
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$workflowAutomationService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["workflowAutomationService"].on('workflow:created', handleWorkflowCreated);
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$workflowAutomationService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["workflowAutomationService"].on('workflow:updated', handleWorkflowUpdated);
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$workflowAutomationService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["workflowAutomationService"].on('workflow:deleted', handleWorkflowDeleted);
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$workflowAutomationService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["workflowAutomationService"].on('workflow:execution:started', handleExecutionStarted);
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$workflowAutomationService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["workflowAutomationService"].on('workflow:execution:completed', handleExecutionCompleted);
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$workflowAutomationService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["workflowAutomationService"].on('workflow:execution:failed', handleExecutionFailed);
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$workflowAutomationService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["workflowAutomationService"].on('page:navigate', handlePageNavigation);
            // Cleanup event listeners
            return ({
                "WorkflowProvider.useEffect": ()=>{
                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$workflowAutomationService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["workflowAutomationService"].off('workflow:created', handleWorkflowCreated);
                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$workflowAutomationService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["workflowAutomationService"].off('workflow:updated', handleWorkflowUpdated);
                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$workflowAutomationService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["workflowAutomationService"].off('workflow:deleted', handleWorkflowDeleted);
                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$workflowAutomationService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["workflowAutomationService"].off('workflow:execution:started', handleExecutionStarted);
                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$workflowAutomationService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["workflowAutomationService"].off('workflow:execution:completed', handleExecutionCompleted);
                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$workflowAutomationService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["workflowAutomationService"].off('workflow:execution:failed', handleExecutionFailed);
                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$workflowAutomationService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["workflowAutomationService"].off('page:navigate', handlePageNavigation);
                }
            })["WorkflowProvider.useEffect"];
        }
    }["WorkflowProvider.useEffect"], [
        router
    ]);
    // Context methods
    const createWorkflow = async (workflow)=>{
        try {
            dispatch({
                type: 'SET_LOADING',
                payload: true
            });
            const workflowId = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$workflowAutomationService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["workflowAutomationService"].createWorkflow(workflow);
            return workflowId;
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error('Failed to create workflow', error);
            dispatch({
                type: 'SET_ERROR',
                payload: 'Failed to create workflow'
            });
            throw error;
        } finally{
            dispatch({
                type: 'SET_LOADING',
                payload: false
            });
        }
    };
    const updateWorkflow = async (id, updates)=>{
        try {
            const success = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$workflowAutomationService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["workflowAutomationService"].updateWorkflow(id, updates);
            if (!success) {
                dispatch({
                    type: 'SET_ERROR',
                    payload: 'Workflow not found'
                });
            }
            return success;
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error('Failed to update workflow', error);
            dispatch({
                type: 'SET_ERROR',
                payload: 'Failed to update workflow'
            });
            return false;
        }
    };
    const deleteWorkflow = async (id)=>{
        try {
            const success = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$workflowAutomationService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["workflowAutomationService"].deleteWorkflow(id);
            if (!success) {
                dispatch({
                    type: 'SET_ERROR',
                    payload: 'Workflow not found'
                });
            }
            return success;
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error('Failed to delete workflow', error);
            dispatch({
                type: 'SET_ERROR',
                payload: 'Failed to delete workflow'
            });
            return false;
        }
    };
    const toggleWorkflow = async (id)=>{
        const workflow = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$workflowAutomationService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["workflowAutomationService"].getWorkflow(id);
        if (!workflow) {
            dispatch({
                type: 'SET_ERROR',
                payload: 'Workflow not found'
            });
            return false;
        }
        return updateWorkflow(id, {
            isActive: !workflow.isActive
        });
    };
    const executeWorkflow = async (workflowId, triggerData)=>{
        try {
            dispatch({
                type: 'SET_LOADING',
                payload: true
            });
            const executionId = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$workflowAutomationService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["workflowAutomationService"].executeWorkflow(workflowId, triggerData);
            return executionId;
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error('Failed to execute workflow', error);
            dispatch({
                type: 'SET_ERROR',
                payload: 'Failed to execute workflow'
            });
            throw error;
        } finally{
            dispatch({
                type: 'SET_LOADING',
                payload: false
            });
        }
    };
    const stopExecution = async (executionId)=>{
        try {
            // Implementation would depend on workflow service capabilities
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].info("Stopping execution: ".concat(executionId));
            return true;
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error('Failed to stop execution', error);
            dispatch({
                type: 'SET_ERROR',
                payload: 'Failed to stop execution'
            });
            return false;
        }
    };
    const triggerFromDashboard = (workflowId, data)=>{
        try {
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$workflowAutomationService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["workflowAutomationService"].triggerFromDashboard(workflowId, data);
            dispatch({
                type: 'SELECT_WORKFLOW',
                payload: workflowId
            });
            dispatch({
                type: 'SET_CROSS_PAGE_DATA',
                payload: {
                    triggerSource: 'dashboard',
                    workflowId,
                    ...data
                }
            });
            // Broadcast trigger event to other tabs
            const event = new CustomEvent('workflow-trigger', {
                detail: {
                    workflowId,
                    data,
                    timestamp: Date.now()
                }
            });
            window.dispatchEvent(event);
            // Also save to localStorage for cross-tab communication
            localStorage.setItem('workflow-trigger', JSON.stringify({
                workflowId,
                data,
                timestamp: Date.now()
            }));
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error('Failed to trigger workflow from dashboard', error);
            dispatch({
                type: 'SET_ERROR',
                payload: 'Failed to trigger workflow'
            });
        }
    };
    const receiveFromDashboard = (workflowId, data)=>{
        // Process received data from dashboard
        const workflow = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$workflowAutomationService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["workflowAutomationService"].getWorkflow(workflowId);
        if (workflow) {
            dispatch({
                type: 'SELECT_WORKFLOW',
                payload: workflowId
            });
            if (data) {
                setCrossPageData({
                    ["workflow_".concat(workflowId)]: data
                });
            }
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].info("Received workflow data from dashboard for ".concat(workflowId, ": ").concat(JSON.stringify(data)));
        }
    };
    const navigateToTrading = (workflowId, config)=>{
        const params = new URLSearchParams();
        if (workflowId) {
            params.set('workflow', workflowId);
            params.set('source', 'dashboard');
            if (config) {
                // Encode configuration as URL parameters
                Object.entries(config).forEach((param)=>{
                    let [key, value] = param;
                    if (value !== undefined && value !== null) {
                        params.set(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
                    }
                });
            }
            dispatch({
                type: 'SELECT_WORKFLOW',
                payload: workflowId
            });
            dispatch({
                type: 'SET_CROSS_PAGE_DATA',
                payload: {
                    source: 'dashboard',
                    workflowId,
                    config
                }
            });
        }
        const url = params.toString() ? "/trading?".concat(params.toString()) : '/trading';
        router.push(url);
    };
    const navigateToDashboard = (workflowId, config)=>{
        const params = new URLSearchParams();
        if (workflowId) {
            params.set('workflow', workflowId);
            params.set('source', 'trading');
            if (config) {
                Object.entries(config).forEach((param)=>{
                    let [key, value] = param;
                    if (value !== undefined && value !== null) {
                        params.set(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
                    }
                });
            }
            dispatch({
                type: 'SELECT_WORKFLOW',
                payload: workflowId
            });
            dispatch({
                type: 'SET_CROSS_PAGE_DATA',
                payload: {
                    source: 'trading',
                    workflowId,
                    config
                }
            });
        }
        const url = params.toString() ? "/dashboard?".concat(params.toString()) : '/dashboard';
        router.push(url);
    };
    // Deep link handler for URL parameters
    const handleDeepLink = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "WorkflowProvider.useCallback[handleDeepLink]": (searchParams)=>{
            const workflowId = searchParams.get('workflow');
            const source = searchParams.get('source');
            if (workflowId) {
                // Extract configuration from URL parameters
                const config = {};
                searchParams.forEach({
                    "WorkflowProvider.useCallback[handleDeepLink]": (value, key)=>{
                        if (key !== 'workflow' && key !== 'source') {
                            try {
                                // Try to parse as JSON first, fallback to string
                                config[key] = value.startsWith('{') || value.startsWith('[') ? JSON.parse(value) : value;
                            } catch (e) {
                                config[key] = value;
                            }
                        }
                    }
                }["WorkflowProvider.useCallback[handleDeepLink]"]);
                dispatch({
                    type: 'SELECT_WORKFLOW',
                    payload: workflowId
                });
                dispatch({
                    type: 'SET_CROSS_PAGE_DATA',
                    payload: {
                        source,
                        workflowId,
                        config
                    }
                });
                // Auto-execute workflow if specified
                if (config.autoExecute === 'true' || config.autoExecute === true) {
                    setTimeout({
                        "WorkflowProvider.useCallback[handleDeepLink]": ()=>{
                            executeWorkflow(workflowId, config);
                        }
                    }["WorkflowProvider.useCallback[handleDeepLink]"], 1000); // Small delay to ensure page is loaded
                }
            }
        }
    }["WorkflowProvider.useCallback[handleDeepLink]"], [
        executeWorkflow
    ]);
    const setCrossPageData = (data)=>{
        dispatch({
            type: 'SET_CROSS_PAGE_DATA',
            payload: data
        });
    };
    const clearCrossPageData = ()=>{
        dispatch({
            type: 'CLEAR_CROSS_PAGE_DATA'
        });
    };
    const selectWorkflow = (workflowId)=>{
        dispatch({
            type: 'SELECT_WORKFLOW',
            payload: workflowId
        });
    };
    const refreshWorkflows = async ()=>{
        try {
            dispatch({
                type: 'SET_LOADING',
                payload: true
            });
            const workflows = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$workflowAutomationService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["workflowAutomationService"].getAllWorkflows();
            dispatch({
                type: 'SET_WORKFLOWS',
                payload: workflows
            });
            const recentExecutions = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$workflowAutomationService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["workflowAutomationService"].getRecentExecutions(10);
            dispatch({
                type: 'SET_RECENT_EXECUTIONS',
                payload: recentExecutions
            });
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error('Failed to refresh workflows', error);
            dispatch({
                type: 'SET_ERROR',
                payload: 'Failed to refresh workflows'
            });
        } finally{
            dispatch({
                type: 'SET_LOADING',
                payload: false
            });
        }
    };
    const clearError = ()=>{
        dispatch({
            type: 'CLEAR_ERROR'
        });
    };
    const updateWorkflowStatus = async (workflowId, status)=>{
        try {
            // Use updateWorkflow method with isActive status
            const isActive = status === 'active';
            const success = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$workflowAutomationService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["workflowAutomationService"].updateWorkflow(workflowId, {
                isActive
            });
            if (success) {
                dispatch({
                    type: 'UPDATE_WORKFLOW_STATUS',
                    payload: {
                        workflowId,
                        status
                    }
                });
                // Broadcast status update in real-time
                broadcastStatusUpdate(workflowId, status);
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].info("Workflow ".concat(workflowId, " status updated to ").concat(status));
            } else {
                throw new Error('Failed to update workflow');
            }
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error('Failed to update workflow status', error);
            throw error;
        }
    };
    const contextValue = {
        workflowState: state,
        createWorkflow,
        updateWorkflow,
        deleteWorkflow,
        toggleWorkflow,
        executeWorkflow,
        stopExecution,
        updateWorkflowStatus,
        triggerFromDashboard,
        receiveFromDashboard,
        navigateToTrading,
        navigateToDashboard,
        handleDeepLink,
        setCrossPageData,
        clearCrossPageData,
        selectWorkflow,
        refreshWorkflows,
        clearError
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(WorkflowContext.Provider, {
        value: contextValue,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/contexts/WorkflowContext.tsx",
        lineNumber: 631,
        columnNumber: 5
    }, this);
}
_s(WorkflowProvider, "0wibXK/YcPMz/eYIOOLmEm5qvug=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = WorkflowProvider;
function useWorkflow() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(WorkflowContext);
    if (context === undefined) {
        throw new Error('useWorkflow must be used within a WorkflowProvider');
    }
    return context;
}
_s1(useWorkflow, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
const __TURBOPACK__default__export__ = WorkflowContext;
var _c;
__turbopack_context__.k.register(_c, "WorkflowProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/providers.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Providers",
    ()=>Providers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/query-core/build/modern/queryClient.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/AuthContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$ThemeContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/ThemeContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$BrokerAccountContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/BrokerAccountContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$TradingModeContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/TradingModeContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$WorkflowContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/WorkflowContext.tsx [app-client] (ecmascript)");
'use client';
;
;
;
;
;
;
;
const queryClient = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QueryClient"]({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 5 * 60 * 1000
        }
    }
});
function Providers(param) {
    let { children } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QueryClientProvider"], {
        client: queryClient,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$ThemeContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThemeProvider"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthProvider"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$BrokerAccountContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BrokerAccountProvider"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$TradingModeContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TradingModeProvider"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$WorkflowContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WorkflowProvider"], {
                            children: children
                        }, void 0, false, {
                            fileName: "[project]/src/app/providers.tsx",
                            lineNumber: 32,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/providers.tsx",
                        lineNumber: 31,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/providers.tsx",
                    lineNumber: 30,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/providers.tsx",
                lineNumber: 29,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/providers.tsx",
            lineNumber: 28,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/providers.tsx",
        lineNumber: 27,
        columnNumber: 5
    }, this);
}
_c = Providers;
var _c;
__turbopack_context__.k.register(_c, "Providers");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ErrorBoundary.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "useErrorHandler",
    ()=>useErrorHandler,
    "withErrorBoundary",
    ()=>withErrorBoundary
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_define_property.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$errorHandler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/errorHandler.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$alert$2d$triangle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/alert-triangle.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-client] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$home$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/home.js [app-client] (ecmascript) <export default as Home>");
'use client';
;
;
;
;
;
class ErrorBoundary extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Component"] {
    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return {
            hasError: true,
            error
        };
    }
    componentDidCatch(error, errorInfo) {
        // Store error info in state
        this.setState({
            errorInfo
        });
        // Use centralized error handler
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$errorHandler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["errorHandler"].handle(error, 'ErrorBoundary');
        // Call custom error handler if provided
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }
    }
    render() {
        if (this.state.hasError) {
            var _this_state_errorInfo;
            // Custom fallback UI
            if (this.props.fallback) {
                return this.props.fallback;
            }
            // Default fallback UI
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-6 text-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mx-auto mb-4 w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$alert$2d$triangle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                        className: "w-6 h-6 text-red-600 dark:text-red-400"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ErrorBoundary.tsx",
                                        lineNumber: 67,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ErrorBoundary.tsx",
                                    lineNumber: 66,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-xl font-semibold text-gray-900 dark:text-white mb-4",
                                    children: "Oops! Something went wrong"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ErrorBoundary.tsx",
                                    lineNumber: 69,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ErrorBoundary.tsx",
                            lineNumber: 65,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "px-6 pb-6 space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-gray-600 dark:text-gray-400 text-center",
                                    children: "We encountered an unexpected error. This has been logged and our team will look into it."
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ErrorBoundary.tsx",
                                    lineNumber: 74,
                                    columnNumber: 15
                                }, this),
                                ("TURBOPACK compile-time value", "development") === 'development' && this.state.error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("details", {
                                    className: "mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("summary", {
                                            className: "cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300",
                                            children: "Error Details (Development)"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ErrorBoundary.tsx",
                                            lineNumber: 80,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-2 text-xs text-gray-600 dark:text-gray-400 font-mono",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mb-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: "Error:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/ErrorBoundary.tsx",
                                                            lineNumber: 85,
                                                            columnNumber: 23
                                                        }, this),
                                                        " ",
                                                        this.state.error.message
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/ErrorBoundary.tsx",
                                                    lineNumber: 84,
                                                    columnNumber: 21
                                                }, this),
                                                this.state.error.stack && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mb-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: "Stack:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/ErrorBoundary.tsx",
                                                            lineNumber: 89,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                                                            className: "whitespace-pre-wrap mt-1",
                                                            children: this.state.error.stack
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/ErrorBoundary.tsx",
                                                            lineNumber: 90,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/ErrorBoundary.tsx",
                                                    lineNumber: 88,
                                                    columnNumber: 23
                                                }, this),
                                                ((_this_state_errorInfo = this.state.errorInfo) === null || _this_state_errorInfo === void 0 ? void 0 : _this_state_errorInfo.componentStack) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: "Component Stack:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/ErrorBoundary.tsx",
                                                            lineNumber: 95,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                                                            className: "whitespace-pre-wrap mt-1",
                                                            children: this.state.errorInfo.componentStack
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/ErrorBoundary.tsx",
                                                            lineNumber: 96,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/ErrorBoundary.tsx",
                                                    lineNumber: 94,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/ErrorBoundary.tsx",
                                            lineNumber: 83,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/ErrorBoundary.tsx",
                                    lineNumber: 79,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col sm:flex-row gap-3 pt-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: this.handleRetry,
                                            className: "flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                                    className: "w-4 h-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/ErrorBoundary.tsx",
                                                    lineNumber: 108,
                                                    columnNumber: 19
                                                }, this),
                                                "Try Again"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/ErrorBoundary.tsx",
                                            lineNumber: 104,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: this.handleGoHome,
                                            className: "flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$home$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"], {
                                                    className: "w-4 h-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/ErrorBoundary.tsx",
                                                    lineNumber: 115,
                                                    columnNumber: 19
                                                }, this),
                                                "Go Home"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/ErrorBoundary.tsx",
                                            lineNumber: 111,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/ErrorBoundary.tsx",
                                    lineNumber: 103,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ErrorBoundary.tsx",
                            lineNumber: 73,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ErrorBoundary.tsx",
                    lineNumber: 64,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/ErrorBoundary.tsx",
                lineNumber: 63,
                columnNumber: 9
            }, this);
        }
        return this.props.children;
    }
    constructor(props){
        super(props), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "handleRetry", ()=>{
            this.setState({
                hasError: false,
                error: undefined,
                errorInfo: undefined
            });
        }), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "handleGoHome", ()=>{
            // Use router navigation instead of window.location for better hydration
            if ("TURBOPACK compile-time truthy", 1) {
                window.location.href = '/dashboard';
            }
        });
        this.state = {
            hasError: false
        };
    }
}
const __TURBOPACK__default__export__ = ErrorBoundary;
function useErrorHandler() {
    return (error, errorInfo)=>{
        // Use centralized error handler
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$errorHandler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["errorHandler"].handle(error, 'useErrorHandler');
    };
}
function withErrorBoundary(Component, errorBoundaryProps) {
    const WrappedComponent = (props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ErrorBoundary, {
            ...errorBoundaryProps,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Component, {
                ...props
            }, void 0, false, {
                fileName: "[project]/src/components/ErrorBoundary.tsx",
                lineNumber: 146,
                columnNumber: 7
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/ErrorBoundary.tsx",
            lineNumber: 145,
            columnNumber: 5
        }, this);
    WrappedComponent.displayName = "withErrorBoundary(".concat(Component.displayName || Component.name, ")");
    return WrappedComponent;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/chunkErrorHandler.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ChunkLoadErrorHandler",
    ()=>ChunkLoadErrorHandler,
    "default",
    ()=>__TURBOPACK__default__export__,
    "useChunkErrorHandler",
    ()=>useChunkErrorHandler,
    "withChunkErrorHandling",
    ()=>withChunkErrorHandling
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_define_property.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$errorHandler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/errorHandler.ts [app-client] (ecmascript)");
'use client';
;
;
class ChunkLoadErrorHandler {
    static handleChunkError(error, chunkId) {
        const errorMessage = (error === null || error === void 0 ? void 0 : error.message) || 'Unknown chunk loading error';
        const isChunkError = errorMessage.includes('ChunkLoadError') || errorMessage.includes('Loading chunk') || errorMessage.includes('Loading CSS chunk');
        if (!isChunkError) {
            // Not a chunk error, handle normally
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$errorHandler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["errorHandler"].handle(error, 'ChunkErrorHandler');
            return Promise.reject(error);
        }
        const key = chunkId || errorMessage;
        const attempts = this.retryAttempts.get(key) || 0;
        if (attempts >= this.maxRetries) {
            // Max retries reached, log error and reload page
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$errorHandler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["errorHandler"].handle(error, 'ChunkErrorHandler - Max Retries Reached');
            // Clear retry attempts for this chunk
            this.retryAttempts.delete(key);
            // Reload the page as last resort
            if ("TURBOPACK compile-time truthy", 1) {
                window.location.reload();
            }
            return Promise.reject(error);
        }
        // Increment retry count
        this.retryAttempts.set(key, attempts + 1);
        // Log retry attempt
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$errorHandler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["errorHandler"].handle(error, 'ChunkErrorHandler - Retry Attempt');
        // Return a promise that resolves after retry delay
        return new Promise((resolve, reject)=>{
            setTimeout(()=>{
                // Try to reload the failed chunk
                if ("object" !== 'undefined' && chunkId) {
                    // Clear any cached modules for this chunk
                    this.clearChunkCache(chunkId);
                }
                resolve();
            }, this.retryDelay * (attempts + 1)); // Exponential backoff
        });
    }
    static clearChunkCache(chunkId) {
        try {
            // Clear webpack chunk cache if available
            if ("object" !== 'undefined' && window.__webpack_require__) {
                const webpackRequire = window.__webpack_require__;
                // Clear chunk from cache
                if (webpackRequire.cache) {
                    Object.keys(webpackRequire.cache).forEach((key)=>{
                        if (key.includes(chunkId)) {
                            delete webpackRequire.cache[key];
                        }
                    });
                }
                // Clear installed chunks
                if (webpackRequire.installedChunks) {
                    delete webpackRequire.installedChunks[chunkId];
                }
            }
        } catch (cacheError) {
            // Ignore cache clearing errors
            console.warn('Failed to clear chunk cache:', cacheError);
        }
    }
    static resetRetryCount(chunkId) {
        if (chunkId) {
            this.retryAttempts.delete(chunkId);
        } else {
            this.retryAttempts.clear();
        }
    }
    static getRetryCount(chunkId) {
        return this.retryAttempts.get(chunkId) || 0;
    }
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(ChunkLoadErrorHandler, "retryAttempts", new Map());
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(ChunkLoadErrorHandler, "maxRetries", 3);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(ChunkLoadErrorHandler, "retryDelay", 1000); // 1 second
// Global error handler for unhandled chunk loading errors
if ("TURBOPACK compile-time truthy", 1) {
    // Handle unhandled promise rejections (common for chunk loading errors)
    window.addEventListener('unhandledrejection', (event)=>{
        const error = event.reason;
        if (error && (error.name === 'ChunkLoadError' || error.message && error.message.includes('Loading chunk'))) {
            event.preventDefault(); // Prevent default browser error handling
            ChunkLoadErrorHandler.handleChunkError(error);
        }
    });
    // Handle general errors that might be chunk-related
    window.addEventListener('error', (event)=>{
        const error = event.error;
        if (error && (error.name === 'ChunkLoadError' || error.message && error.message.includes('Loading chunk'))) {
            event.preventDefault();
            ChunkLoadErrorHandler.handleChunkError(error);
        }
    });
}
function withChunkErrorHandling(fn) {
    return function() {
        for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
            args[_key] = arguments[_key];
        }
        try {
            const result = fn(...args);
            // Handle promises that might reject with chunk errors
            if (result && typeof result.catch === 'function') {
                return result.catch((error)=>{
                    if (error && (error.name === 'ChunkLoadError' || error.message && error.message.includes('Loading chunk'))) {
                        return ChunkLoadErrorHandler.handleChunkError(error);
                    }
                    throw error;
                });
            }
            return result;
        } catch (error) {
            if (error && (error.name === 'ChunkLoadError' || error.message && error.message.includes('Loading chunk'))) {
                ChunkLoadErrorHandler.handleChunkError(error);
                return;
            }
            throw error;
        }
    };
}
function useChunkErrorHandler() {
    return {
        handleChunkError: ChunkLoadErrorHandler.handleChunkError,
        resetRetryCount: ChunkLoadErrorHandler.resetRetryCount,
        getRetryCount: ChunkLoadErrorHandler.getRetryCount
    };
}
const __TURBOPACK__default__export__ = ChunkLoadErrorHandler;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_bbd4c241._.js.map