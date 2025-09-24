module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

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
"[externals]/tty [external] (tty, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tty", () => require("tty"));

module.exports = mod;
}),
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[project]/src/contexts/AuthContext.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "default",
    ()=>__TURBOPACK__default__export__,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-hot-toast/dist/index.mjs [app-ssr] (ecmascript)");
'use client';
;
;
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
// Configure axios defaults
const API_URL = ("TURBOPACK compile-time value", "http://localhost:3001") || 'https://api.kairoquantum.com';
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].defaults.baseURL = `${API_URL}/api`;
// Add request interceptor to include auth token
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].interceptors.request.use((config)=>{
    const token = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : null;
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return config;
}, (error)=>{
    return Promise.reject(error);
});
// Add response interceptor to handle token refresh
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].interceptors.response.use((response)=>response, async (error)=>{
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry && "undefined" !== 'undefined') //TURBOPACK unreachable
    ;
    return Promise.reject(error);
});
const AuthProvider = ({ children })=>{
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const initializeAuth = async ()=>{
            if ("TURBOPACK compile-time truthy", 1) {
                setLoading(false);
                return;
            }
            //TURBOPACK unreachable
            ;
            const token = undefined;
        };
        initializeAuth();
    }, []);
    const login = async (email, password)=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].post('/auth/login', {
                email,
                password
            });
            const { user, accessToken, refreshToken } = response.data.data;
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            setUser(user);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success('Login successful!');
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed';
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error(message);
            throw error;
        }
    };
    const register = async (data)=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].post('/auth/register', data);
            const { user, accessToken, refreshToken } = response.data.data;
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            setUser(user);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success('Registration successful!');
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed';
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error(message);
            throw error;
        }
    };
    const logout = ()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        setUser(null);
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success('Logged out successfully');
    };
    const updateProfile = async (data)=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].put('/auth/profile', data);
            setUser(response.data.data.user);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success('Profile updated successfully!');
        } catch (error) {
            const message = error.response?.data?.message || 'Profile update failed';
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error(message);
            throw error;
        }
    };
    const refreshToken = async ()=>{
        try {
            if ("TURBOPACK compile-time truthy", 1) {
                throw new Error('Cannot refresh token on server side');
            }
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) throw new Error('No refresh token');
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].post('/auth/refresh', {
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/contexts/AuthContext.tsx",
        lineNumber: 220,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const useAuth = ()=>{
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
const __TURBOPACK__default__export__ = AuthContext;
}),
"[project]/src/contexts/ThemeContext.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeProvider",
    ()=>ThemeProvider,
    "default",
    ()=>__TURBOPACK__default__export__,
    "useTheme",
    ()=>useTheme
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
;
const ThemeContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const ThemeProvider = ({ children })=>{
    const [theme, setThemeState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('light');
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setMounted(true);
        // Check for saved theme preference or default to 'light'
        const savedTheme = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : null;
        const prefersDark = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : false;
        const initialTheme = savedTheme || (("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 'light');
        setThemeState(initialTheme);
        // Apply theme to document
        if (typeof document !== 'undefined') {
            document.documentElement.classList.toggle('dark', initialTheme === 'dark');
        }
    }, []);
    // Prevent hydration mismatch by not rendering theme-dependent content until mounted
    if (!mounted) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
            children: children
        }, void 0, false);
    }
    const setTheme = (newTheme)=>{
        setThemeState(newTheme);
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ThemeContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/contexts/ThemeContext.tsx",
        lineNumber: 62,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const useTheme = ()=>{
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(ThemeContext);
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
const __TURBOPACK__default__export__ = ThemeContext;
}),
"[project]/src/contexts/BrokerAccountContext.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BrokerAccountProvider",
    ()=>BrokerAccountProvider,
    "useBrokerAccount",
    ()=>useBrokerAccount
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
;
const BrokerAccountContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function BrokerAccountProvider({ children }) {
    const [selectedAccount, setSelectedAccount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [accounts, setAccounts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const fetchBrokerAccounts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
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
                    'Authorization': `Bearer ${token}`,
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
                    const stillExists = data.data.find((acc)=>acc.id === selectedAccount.id);
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
    }, [
        selectedAccount
    ]);
    const refreshAccounts = async ()=>{
        await fetchBrokerAccounts();
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        fetchBrokerAccounts();
    }, []);
    // Save selected account to localStorage
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (selectedAccount) {
            localStorage.setItem('selectedBrokerAccount', JSON.stringify(selectedAccount));
        } else {
            localStorage.removeItem('selectedBrokerAccount');
        }
    }, [
        selectedAccount
    ]);
    // Load selected account from localStorage on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
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
    }, []);
    const value = {
        selectedAccount,
        setSelectedAccount,
        accounts,
        loading,
        error,
        refreshAccounts
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(BrokerAccountContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/contexts/BrokerAccountContext.tsx",
        lineNumber: 137,
        columnNumber: 5
    }, this);
}
function useBrokerAccount() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(BrokerAccountContext);
    if (context === undefined) {
        throw new Error('useBrokerAccount must be used within a BrokerAccountProvider');
    }
    return context;
}
}),
"[project]/src/contexts/TradingModeContext.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TradingModeContext",
    ()=>TradingModeContext,
    "TradingModeProvider",
    ()=>TradingModeProvider,
    "useTradingMode",
    ()=>useTradingMode
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
;
const TradingModeContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function TradingModeProvider({ children }) {
    const [isPaperTrading, setIsPaperTrading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true); // Default to paper trading (demo mode)
    // Load trading mode from localStorage on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const savedMode = localStorage.getItem('tradingMode');
        if (savedMode) {
            setIsPaperTrading(savedMode === 'paper');
        }
    }, []);
    // Save trading mode to localStorage when it changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        localStorage.setItem('tradingMode', isPaperTrading ? 'paper' : 'live');
    }, [
        isPaperTrading
    ]);
    const tradingMode = isPaperTrading ? 'paper' : 'live';
    const toggleTradingMode = ()=>{
        setIsPaperTrading(!isPaperTrading);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(TradingModeContext.Provider, {
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
function useTradingMode() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(TradingModeContext);
    if (context === undefined) {
        throw new Error('useTradingMode must be used within a TradingModeProvider');
    }
    return context;
}
;
}),
"[project]/src/app/providers.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Providers",
    ()=>Providers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/query-core/build/modern/queryClient.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/AuthContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$ThemeContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/ThemeContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$BrokerAccountContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/BrokerAccountContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$TradingModeContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/TradingModeContext.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
const queryClient = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["QueryClient"]({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 5 * 60 * 1000
        }
    }
});
function Providers({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["QueryClientProvider"], {
        client: queryClient,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$ThemeContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThemeProvider"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AuthProvider"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$BrokerAccountContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BrokerAccountProvider"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$TradingModeContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TradingModeProvider"], {
                        children: children
                    }, void 0, false, {
                        fileName: "[project]/src/app/providers.tsx",
                        lineNumber: 30,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/providers.tsx",
                    lineNumber: 29,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/providers.tsx",
                lineNumber: 28,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/providers.tsx",
            lineNumber: 27,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/providers.tsx",
        lineNumber: 26,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/lib/errorHandler.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-hot-toast/dist/index.mjs [app-ssr] (ecmascript)");
'use client';
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
    static instance;
    errorQueue = [];
    maxQueueSize = 100;
    constructor(){}
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
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error(message, {
                    duration: 8000
                });
                break;
            case "high":
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error(message, {
                    duration: 6000
                });
                break;
            case "medium":
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"])(message, {
                    icon: '⚠️',
                    duration: 4000
                });
                break;
            case "low":
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"])(message, {
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
                return `Trading error: ${error.message}`;
            case "compilation":
                return `Compilation error: ${error.message}`;
            default:
                return 'An unexpected error occurred. Please try again.';
        }
    }
    // Log to console with proper formatting
    logToConsole(error) {
        const logMethod = error.severity === "critical" || error.severity === "high" ? console.error : console.warn;
        logMethod(`[${error.type.toUpperCase()}] ${error.message}`, {
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
    getRecentErrors(count = 10) {
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
}
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
const handleCompilationError = (line, message, type = 'error')=>{
    return errorHandler.handle({
        type: "compilation",
        severity: type === 'error' ? "high" : "medium",
        message: `Line ${line}: ${message}`,
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
}),
"[project]/src/components/ErrorBoundary.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "useErrorHandler",
    ()=>useErrorHandler,
    "withErrorBoundary",
    ()=>withErrorBoundary
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$errorHandler$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/errorHandler.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$alert$2d$triangle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/alert-triangle.js [app-ssr] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-ssr] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$home$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/home.js [app-ssr] (ecmascript) <export default as Home>");
'use client';
;
;
;
;
class ErrorBoundary extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Component"] {
    constructor(props){
        super(props);
        this.state = {
            hasError: false
        };
    }
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
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$errorHandler$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["errorHandler"].handle(error, 'ErrorBoundary');
        // Call custom error handler if provided
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }
    }
    handleRetry = ()=>{
        this.setState({
            hasError: false,
            error: undefined,
            errorInfo: undefined
        });
    };
    handleGoHome = ()=>{
        // Use router navigation instead of window.location for better hydration
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    };
    render() {
        if (this.state.hasError) {
            // Custom fallback UI
            if (this.props.fallback) {
                return this.props.fallback;
            }
            // Default fallback UI
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-6 text-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mx-auto mb-4 w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$alert$2d$triangle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
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
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
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
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "px-6 pb-6 space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-gray-600 dark:text-gray-400 text-center",
                                    children: "We encountered an unexpected error. This has been logged and our team will look into it."
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ErrorBoundary.tsx",
                                    lineNumber: 74,
                                    columnNumber: 15
                                }, this),
                                ("TURBOPACK compile-time value", "development") === 'development' && this.state.error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("details", {
                                    className: "mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("summary", {
                                            className: "cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300",
                                            children: "Error Details (Development)"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ErrorBoundary.tsx",
                                            lineNumber: 80,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-2 text-xs text-gray-600 dark:text-gray-400 font-mono",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mb-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
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
                                                this.state.error.stack && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mb-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: "Stack:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/ErrorBoundary.tsx",
                                                            lineNumber: 89,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
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
                                                this.state.errorInfo?.componentStack && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: "Component Stack:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/ErrorBoundary.tsx",
                                                            lineNumber: 95,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
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
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col sm:flex-row gap-3 pt-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: this.handleRetry,
                                            className: "flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
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
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: this.handleGoHome,
                                            className: "flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$home$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"], {
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
}
const __TURBOPACK__default__export__ = ErrorBoundary;
function useErrorHandler() {
    return (error, errorInfo)=>{
        // Use centralized error handler
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$errorHandler$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["errorHandler"].handle(error, 'useErrorHandler');
    };
}
function withErrorBoundary(Component, errorBoundaryProps) {
    const WrappedComponent = (props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ErrorBoundary, {
            ...errorBoundaryProps,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Component, {
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
    WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
    return WrappedComponent;
}
}),
"[project]/src/lib/chunkErrorHandler.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$errorHandler$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/errorHandler.ts [app-ssr] (ecmascript)");
'use client';
;
class ChunkLoadErrorHandler {
    static retryAttempts = new Map();
    static maxRetries = 3;
    static retryDelay = 1000;
    static handleChunkError(error, chunkId) {
        const errorMessage = error?.message || 'Unknown chunk loading error';
        const isChunkError = errorMessage.includes('ChunkLoadError') || errorMessage.includes('Loading chunk') || errorMessage.includes('Loading CSS chunk');
        if (!isChunkError) {
            // Not a chunk error, handle normally
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$errorHandler$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["errorHandler"].handle(error, 'ChunkErrorHandler');
            return Promise.reject(error);
        }
        const key = chunkId || errorMessage;
        const attempts = this.retryAttempts.get(key) || 0;
        if (attempts >= this.maxRetries) {
            // Max retries reached, log error and reload page
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$errorHandler$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["errorHandler"].handle(error, 'ChunkErrorHandler - Max Retries Reached');
            // Clear retry attempts for this chunk
            this.retryAttempts.delete(key);
            // Reload the page as last resort
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            return Promise.reject(error);
        }
        // Increment retry count
        this.retryAttempts.set(key, attempts + 1);
        // Log retry attempt
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$errorHandler$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["errorHandler"].handle(error, 'ChunkErrorHandler - Retry Attempt');
        // Return a promise that resolves after retry delay
        return new Promise((resolve, reject)=>{
            setTimeout(()=>{
                // Try to reload the failed chunk
                if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                ;
                resolve();
            }, this.retryDelay * (attempts + 1)); // Exponential backoff
        });
    }
    static clearChunkCache(chunkId) {
        try {
            // Clear webpack chunk cache if available
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
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
// Global error handler for unhandled chunk loading errors
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
function withChunkErrorHandling(fn) {
    return (...args)=>{
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
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/dynamic-access-async-storage.external.js [external] (next/dist/server/app-render/dynamic-access-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/dynamic-access-async-storage.external.js", () => require("next/dist/server/app-render/dynamic-access-async-storage.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1eb2ceb3._.js.map