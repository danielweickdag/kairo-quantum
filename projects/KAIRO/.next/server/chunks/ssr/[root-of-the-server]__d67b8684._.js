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
"[project]/src/services/alertService.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "alertService",
    ()=>alertService,
    "default",
    ()=>__TURBOPACK__default__export__
]);
'use client';
class AlertService {
    alerts = [];
    preferences = null;
    templates = [];
    listeners = [];
    constructor(){
        this.initializeDefaultTemplates();
        this.loadUserPreferences();
    }
    // Initialize default alert templates
    initializeDefaultTemplates() {
        this.templates = [
            // Price Alerts
            {
                id: 'price-breakout',
                name: 'Price Breakout Alert',
                description: 'Alert when price breaks above or below a key level',
                type: 'price',
                category: 'price',
                defaultConditions: [
                    {
                        type: 'price_above',
                        value: 0,
                        operator: '>',
                        timeframe: '1m'
                    }
                ],
                isCustom: false,
                priority: 'medium',
                isPopular: true
            },
            {
                id: 'price-below-target',
                name: 'Price Below Target',
                description: 'Alert when price goes below a specific value',
                type: 'price',
                category: 'price',
                defaultConditions: [
                    {
                        type: 'price_below',
                        value: 0,
                        operator: '<',
                        timeframe: '1m'
                    }
                ],
                isCustom: false,
                priority: 'high',
                isPopular: true
            },
            {
                id: 'price-change-percent',
                name: 'Price Change %',
                description: 'Alert when price changes by a percentage',
                type: 'price',
                category: 'price',
                defaultConditions: [
                    {
                        type: 'percentage_change',
                        value: 5,
                        operator: '>',
                        timeframe: '5m'
                    }
                ],
                isCustom: false,
                priority: 'medium'
            },
            // Portfolio Alerts
            {
                id: 'portfolio-loss',
                name: 'Portfolio Loss Alert',
                description: 'Alert when portfolio value drops by a certain percentage',
                type: 'portfolio',
                category: 'portfolio',
                defaultConditions: [
                    {
                        type: 'percentage_change',
                        value: -5,
                        operator: '<=',
                        timeframe: '1d'
                    }
                ],
                isCustom: false,
                priority: 'critical',
                isPopular: true
            },
            {
                id: 'profit-loss-threshold',
                name: 'Profit/Loss Threshold',
                description: 'Alert when profit or loss reaches a threshold',
                type: 'portfolio',
                category: 'portfolio',
                defaultConditions: [
                    {
                        type: 'profit_loss',
                        value: -500,
                        operator: '<',
                        timeframe: '1h'
                    }
                ],
                isCustom: false,
                priority: 'critical'
            },
            // Technical Analysis Alerts
            {
                id: 'rsi-overbought',
                name: 'RSI Overbought',
                description: 'Alert when RSI indicates overbought conditions',
                type: 'trading',
                category: 'technical',
                defaultConditions: [
                    {
                        type: 'rsi',
                        value: 70,
                        operator: '>',
                        timeframe: '1h'
                    }
                ],
                isCustom: false,
                priority: 'medium'
            },
            {
                id: 'rsi-oversold',
                name: 'RSI Oversold',
                description: 'Alert when RSI indicates oversold conditions',
                type: 'trading',
                category: 'technical',
                defaultConditions: [
                    {
                        type: 'rsi',
                        value: 30,
                        operator: '<',
                        timeframe: '1h'
                    }
                ],
                isCustom: false,
                priority: 'medium'
            },
            // Volume and Trading Alerts
            {
                id: 'volume-spike',
                name: 'Volume Spike Alert',
                description: 'Alert when trading volume increases significantly',
                type: 'trading',
                category: 'trading',
                defaultConditions: [
                    {
                        type: 'volume_spike',
                        value: 200,
                        operator: '>',
                        timeframe: '5m'
                    }
                ],
                isCustom: false,
                priority: 'medium',
                isPopular: true
            },
            // Risk Management Alerts
            {
                id: 'risk-threshold',
                name: 'Risk Threshold Alert',
                description: 'Alert when risk exposure exceeds safe limits',
                type: 'risk',
                category: 'risk',
                defaultConditions: [
                    {
                        type: 'portfolio_value',
                        value: 10000,
                        operator: '>',
                        timeframe: '1h'
                    }
                ],
                isCustom: false,
                priority: 'critical'
            },
            {
                id: 'stop-loss-trigger',
                name: 'Stop Loss Trigger',
                description: 'Alert when stop loss conditions are met',
                type: 'risk',
                category: 'risk',
                defaultConditions: [
                    {
                        type: 'price_below',
                        value: 0,
                        operator: '<',
                        timeframe: '1m'
                    }
                ],
                isCustom: false,
                priority: 'critical'
            },
            // News Alerts
            {
                id: 'market-news',
                name: 'Market News Alert',
                description: 'Alert for important market news',
                type: 'news',
                category: 'news',
                defaultConditions: [
                    {
                        type: 'percentage_change',
                        value: 0,
                        operator: '>',
                        timeframe: '1d'
                    }
                ],
                isCustom: false,
                priority: 'low'
            }
        ];
    }
    // Load user preferences from storage
    loadUserPreferences() {
        try {
            const stored = localStorage.getItem('alertPreferences');
            if (stored) {
                this.preferences = JSON.parse(stored);
            } else {
                this.preferences = this.getDefaultPreferences();
                this.savePreferences();
            }
        } catch (error) {
            console.error('Failed to load alert preferences:', error);
            this.preferences = this.getDefaultPreferences();
        }
    }
    // Get default preferences
    getDefaultPreferences() {
        return {
            id: 'default',
            userId: 'current-user',
            emailNotifications: true,
            pushNotifications: true,
            smsNotifications: false,
            tradingAlerts: true,
            priceAlerts: true,
            portfolioAlerts: true,
            newsAlerts: false,
            systemAlerts: true,
            soundEnabled: true,
            alertFrequency: 'immediate',
            quietHours: {
                enabled: false,
                startTime: '22:00',
                endTime: '08:00'
            }
        };
    }
    // Save preferences to storage
    savePreferences() {
        if (this.preferences) {
            localStorage.setItem('alertPreferences', JSON.stringify(this.preferences));
        }
    }
    // Subscribe to alert updates
    subscribe(callback) {
        this.listeners.push(callback);
        return ()=>{
            this.listeners = this.listeners.filter((listener)=>listener !== callback);
        };
    }
    // Notify all listeners
    notifyListeners() {
        this.listeners.forEach((listener)=>listener(this.alerts));
    }
    // Get user preferences
    getPreferences() {
        return this.preferences;
    }
    // Update user preferences
    updatePreferences(updates) {
        if (this.preferences) {
            this.preferences = {
                ...this.preferences,
                ...updates
            };
            this.savePreferences();
        }
    }
    // Create a new alert
    createAlert(alertData) {
        const alert = {
            ...alertData,
            id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date(),
            isActive: true,
            category: alertData.category || 'trading',
            recurring: alertData.recurring || false,
            cooldownMinutes: alertData.cooldownMinutes || 0
        };
        this.alerts.push(alert);
        this.notifyListeners();
        return alert;
    }
    // Get all alerts
    getAlerts() {
        return this.alerts;
    }
    // Get active alerts
    getActiveAlerts() {
        return this.alerts.filter((alert)=>alert.isActive);
    }
    // Get alerts by type
    getAlertsByType(type) {
        return this.alerts.filter((alert)=>alert.type === type);
    }
    // Update alert
    updateAlert(id, updates) {
        const index = this.alerts.findIndex((alert)=>alert.id === id);
        if (index !== -1) {
            this.alerts[index] = {
                ...this.alerts[index],
                ...updates
            };
            this.notifyListeners();
        }
    }
    // Delete alert
    deleteAlert(id) {
        this.alerts = this.alerts.filter((alert)=>alert.id !== id);
        this.notifyListeners();
    }
    // Toggle alert active state
    toggleAlert(id) {
        const alert = this.alerts.find((alert)=>alert.id === id);
        if (alert) {
            alert.isActive = !alert.isActive;
            this.notifyListeners();
        }
    }
    // Check if alerts should be triggered (mock implementation)
    checkAlertConditions(marketData) {
        const activeAlerts = this.getActiveAlerts();
        activeAlerts.forEach((alert)=>{
            if (alert.symbol === marketData.symbol) {
                alert.conditions.forEach((condition)=>{
                    let shouldTrigger = false;
                    switch(condition.type){
                        case 'price_above':
                            shouldTrigger = marketData.price > condition.value;
                            break;
                        case 'price_below':
                            shouldTrigger = marketData.price < condition.value;
                            break;
                        case 'volume_spike':
                            shouldTrigger = marketData.volume > condition.value;
                            break;
                    }
                    if (shouldTrigger && !alert.triggeredAt) {
                        this.triggerAlert(alert);
                    }
                });
            }
        });
    }
    // Trigger an alert
    triggerAlert(alert) {
        if (!alert.isActive) return;
        // Check cooldown period
        if (alert.triggeredAt && alert.cooldownMinutes) {
            const timeSinceLastTrigger = Date.now() - alert.triggeredAt.getTime();
            const cooldownMs = alert.cooldownMinutes * 60 * 1000;
            if (timeSinceLastTrigger < cooldownMs) {
                return; // Still in cooldown period
            }
        }
        alert.triggeredAt = new Date();
        // Send notification based on user preferences and alert priority
        if (this.preferences) {
            if (this.preferences.pushNotifications) {
                this.sendPushNotification(alert);
            }
            if (this.preferences.emailNotifications && (alert.priority === 'high' || alert.priority === 'critical')) {
                this.sendEmailNotification(alert);
            }
            if (this.preferences.soundEnabled) {
                this.playAlertSound(alert.priority);
            }
        }
        // Deactivate non-recurring alerts after triggering
        if (!alert.recurring) {
            alert.isActive = false;
        }
        this.notifyListeners();
    }
    // Send push notification
    sendPushNotification(alert) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(alert.title, {
                body: alert.message,
                icon: '/favicon.ico',
                tag: alert.id
            });
        }
    }
    // Send email notification (mock)
    sendEmailNotification(alert) {
        console.log('Email notification sent:', alert.title);
    // In a real implementation, this would call an API endpoint
    }
    // Play alert sound
    playAlertSound(priority) {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            // Different frequencies for different priorities
            const frequencies = {
                low: 440,
                medium: 554,
                high: 659,
                critical: 880
            };
            oscillator.frequency.setValueAtTime(frequencies[priority], audioContext.currentTime);
            oscillator.type = 'sine';
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (error) {
            console.error('Failed to play alert sound:', error);
        }
    }
    // Get alert templates
    getTemplates() {
        return this.templates;
    }
    getTemplatesByCategory(category) {
        return this.templates.filter((template)=>template.type === category);
    }
    getTemplatesByAlertCategory(category) {
        return this.templates.filter((template)=>template.category === category);
    }
    getPopularTemplates() {
        return this.templates.filter((template)=>template.isPopular === true);
    }
    getAlertsByCategory(category) {
        return this.alerts.filter((alert)=>alert.category === category);
    }
    getAlertsByPriority(priority) {
        return this.alerts.filter((alert)=>alert.priority === priority);
    }
    getCriticalAlerts() {
        return this.getAlertsByPriority('critical').filter((alert)=>alert.isActive);
    }
    // Create alert from template
    createAlertFromTemplate(templateId, symbol, customValues) {
        const template = this.templates.find((t)=>t.id === templateId);
        if (!template) return null;
        const conditions = template.defaultConditions.map((condition)=>({
                ...condition,
                id: `condition_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                value: customValues[condition.type] || condition.value
            }));
        return this.createAlert({
            type: template.type,
            priority: 'medium',
            title: `${template.name} - ${symbol}`,
            message: `${template.description} for ${symbol}`,
            symbol,
            userId: 'current-user',
            conditions
        });
    }
    // Request notification permission
    async requestNotificationPermission() {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        }
        return false;
    }
    // Enable alerts (main function for the button)
    async enableAlerts() {
        try {
            // Request notification permission
            const hasPermission = await this.requestNotificationPermission();
            if (hasPermission) {
                // Update preferences to enable notifications
                this.updatePreferences({
                    pushNotifications: true,
                    tradingAlerts: true,
                    priceAlerts: true,
                    portfolioAlerts: true,
                    systemAlerts: true
                });
                // Show success notification
                this.sendPushNotification({
                    id: 'welcome',
                    type: 'system',
                    priority: 'medium',
                    title: 'Alerts Enabled!',
                    message: 'You will now receive real-time trading alerts and notifications.',
                    userId: 'current-user',
                    conditions: [],
                    isActive: true,
                    createdAt: new Date()
                });
                return true;
            } else {
                console.warn('Notification permission denied');
                return false;
            }
        } catch (error) {
            console.error('Failed to enable alerts:', error);
            return false;
        }
    }
}
const alertService = new AlertService();
const __TURBOPACK__default__export__ = alertService;
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
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$alertService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/alertService.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
// Configure axios defaults - use frontend API routes
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].defaults.baseURL = '/api';
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
            // Ensure alerts are enabled for all users
            try {
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$alertService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["alertService"].enableAlerts();
                console.log('Alerts enabled for user login');
            } catch (error) {
                console.warn('Failed to enable alerts for user:', error);
            }
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
            // Automatically enable alerts for new users
            try {
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$alertService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["alertService"].enableAlerts();
                console.log('Alerts automatically enabled for new user');
            } catch (error) {
                console.warn('Failed to auto-enable alerts for new user:', error);
            }
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
        lineNumber: 236,
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
"[project]/src/lib/logger.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$errorHandler$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/errorHandler.ts [app-ssr] (ecmascript)");
'use client';
;
class Logger {
    static isDevelopment = ("TURBOPACK compile-time value", "development") === 'development';
    static isProduction = ("TURBOPACK compile-time value", "development") === 'production';
    // Error logging
    static error(message, error, context) {
        if (error instanceof Error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$errorHandler$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["errorHandler"].handle(error, context || 'Logger');
        } else {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$errorHandler$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["errorHandler"].handle(new Error(message), context || 'Logger');
        }
        // Still log to console in development for debugging
        if (this.isDevelopment) {
            console.error(`[${context || 'Logger'}] ${message}`, error);
        }
    }
    // Warning logging
    static warn(message, context, details) {
        const warningError = new Error(message);
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$errorHandler$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["errorHandler"].handle(warningError, context || 'Logger');
        if (this.isDevelopment) {
            console.warn(`[${context || 'Logger'}] ${message}`, details);
        }
    }
    // Info logging (for important events)
    static info(message, context, details) {
        // Only log to console in development, or to external service in production
        if (this.isDevelopment) {
            console.log(`[${context || 'Logger'}] ${message}`, details);
        } else if (this.isProduction) {
            // In production, you might want to log to an external service
            // For now, we'll just store it internally
            this.logToService('info', message, context, details);
        }
    }
    // Debug logging (only in development)
    static debug(message, context, details) {
        if (this.isDevelopment) {
            console.log(`[DEBUG][${context || 'Logger'}] ${message}`, details);
        }
    }
    // Trading-specific logging
    static trading(message, details, context) {
        const tradingError = new Error(message);
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$errorHandler$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["errorHandler"].handle(tradingError, context || 'Trading');
        if (this.isDevelopment) {
            console.log(`[TRADING][${context || 'Trading'}] ${message}`, details);
        }
    }
    // Performance logging
    static performance(operation, duration, context) {
        const message = `${operation} completed in ${duration}ms`;
        if (duration > 1000) {
            // Log slow operations as warnings
            this.warn(`Slow operation: ${message}`, context || 'Performance');
        } else {
            this.info(message, context || 'Performance');
        }
    }
    // User action logging
    static userAction(action, userId, details) {
        const context = userId ? `User-${userId}` : 'User';
        this.info(`User action: ${action}`, context, details);
    }
    // API call logging
    static apiCall(method, url, status, duration) {
        const message = `${method} ${url} - ${status} (${duration}ms)`;
        if (status >= 400) {
            this.error(`API Error: ${message}`, undefined, 'API');
        } else if (duration > 2000) {
            this.warn(`Slow API call: ${message}`, 'API');
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
                userAgent: ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 'server',
                url: ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 'server'
            };
            // Store in localStorage for now (in production, send to logging service)
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
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
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
        } catch (error) {
            this.error('Failed to retrieve logs', error, 'Logger');
        }
        return [];
    }
    // Method to clear logs
    static clearLogs() {
        try {
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
        } catch (error) {
            this.error('Failed to clear logs', error, 'Logger');
        }
    }
}
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
}),
"[project]/lib/services/workflowAutomationService.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "workflowAutomationService",
    ()=>workflowAutomationService
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$events__$5b$external$5d$__$28$events$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/events [external] (events, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/logger.ts [app-ssr] (ecmascript)");
;
;
class WorkflowAutomationService extends __TURBOPACK__imported__module__$5b$externals$5d2f$events__$5b$external$5d$__$28$events$2c$__cjs$29$__["EventEmitter"] {
    workflows = new Map();
    executions = new Map();
    isInitialized = false;
    constructor(){
        super();
        this.initializeDefaultWorkflows();
    }
    async initialize() {
        if (this.isInitialized) return;
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["logger"].info('Initializing Workflow Automation Service');
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
        const id = `workflow-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newWorkflow = {
            ...workflow,
            id,
            createdAt: new Date(),
            executionCount: 0,
            successRate: 100
        };
        this.workflows.set(id, newWorkflow);
        this.emit('workflow:created', newWorkflow);
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["logger"].info(`Created workflow: ${newWorkflow.name}`);
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
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["logger"].info(`Deleted workflow: ${id}`);
        }
        return deleted;
    }
    // Workflow Execution
    async executeWorkflow(workflowId, triggerData) {
        const workflow = this.workflows.get(workflowId);
        if (!workflow) {
            throw new Error(`Workflow not found: ${workflowId}`);
        }
        if (!workflow.isActive) {
            throw new Error(`Workflow is not active: ${workflowId}`);
        }
        const executionId = `exec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
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
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["logger"].info(`Started workflow execution: ${workflowId}`);
        try {
            await this.runWorkflowSteps(execution, triggerData);
            execution.status = 'completed';
            execution.endTime = new Date();
            // Update workflow statistics
            workflow.executionCount++;
            workflow.lastExecuted = new Date();
            this.emit('workflow:execution:completed', execution);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["logger"].info(`Completed workflow execution: ${executionId}`);
        } catch (error) {
            execution.status = 'failed';
            execution.endTime = new Date();
            execution.error = error instanceof Error ? error.message : 'Unknown error';
            workflow.executionCount++;
            workflow.successRate = Math.max(0, workflow.successRate - 5);
            this.emit('workflow:execution:failed', execution);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["logger"].error(`Failed workflow execution: ${executionId}`, error);
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
                throw new Error(`Unknown step type: ${step.type}`);
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
        const stopLossPrice = triggerData?.entryPrice * (1 - (config.riskPercentage || 2) / 100);
        this.emit('trading:order:place', {
            type: 'stop_loss',
            price: stopLossPrice,
            symbol: triggerData?.symbol,
            quantity: triggerData?.quantity
        });
        return {
            orderPlaced: true,
            stopLossPrice
        };
    }
    async takeProfitOrder(config, triggerData) {
        // Simulate taking profit
        const closeQuantity = (triggerData?.quantity || 0) * (config.closePercentage || 100) / 100;
        this.emit('trading:order:place', {
            type: 'market',
            side: 'sell',
            symbol: triggerData?.symbol,
            quantity: closeQuantity
        });
        return {
            orderPlaced: true,
            closedQuantity: closeQuantity
        };
    }
    // Event Handlers
    async handleDashboardTrigger(event) {
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["logger"].info(`Dashboard workflow trigger received: ${JSON.stringify(event)}`);
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
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["logger"].info('Trading event received', event);
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
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["logger"].info('Pages connected for workflow automation');
    }
    // Execution Queries
    getExecution(id) {
        return this.executions.get(id);
    }
    getWorkflowExecutions(workflowId) {
        return Array.from(this.executions.values()).filter((exec)=>exec.workflowId === workflowId);
    }
    getRecentExecutions(limit = 10) {
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
}
const workflowAutomationService = new WorkflowAutomationService();
// Initialize on import
workflowAutomationService.initialize().catch((error)=>{
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["logger"].error('Failed to initialize workflow automation service', error);
});
const __TURBOPACK__default__export__ = workflowAutomationService;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

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
"[project]/src/contexts/WorkflowContext.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WorkflowProvider",
    ()=>WorkflowProvider,
    "default",
    ()=>__TURBOPACK__default__export__,
    "useWorkflow",
    ()=>useWorkflow
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$workflowAutomationService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/services/workflowAutomationService.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/logger.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
'use client';
;
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
const WorkflowContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function WorkflowProvider({ children }) {
    const [state, dispatch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useReducer"])(workflowReducer, initialState);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    // Initialize from localStorage on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
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
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["logger"].error('Failed to load workflow state from localStorage', error);
        }
    }, []);
    // Real-time status broadcasting
    const broadcastStatusUpdate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((workflowId, status)=>{
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
    }, []);
    // Listen for real-time status updates
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const handleStatusUpdate = (event)=>{
            const { workflowId, status } = event.detail;
            dispatch({
                type: 'UPDATE_WORKFLOW_STATUS',
                payload: {
                    workflowId,
                    status
                }
            });
        };
        const handleStorageStatusUpdate = (event)=>{
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
        };
        window.addEventListener('workflow-status-update', handleStatusUpdate);
        window.addEventListener('storage', handleStorageStatusUpdate);
        return ()=>{
            window.removeEventListener('workflow-status-update', handleStatusUpdate);
            window.removeEventListener('storage', handleStorageStatusUpdate);
        };
    }, []);
    // Real-time synchronization
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
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
    }, [
        state
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Listen for state updates from other tabs/windows
        const handleStateUpdate = (event)=>{
            const { state: newState } = event.detail;
            if (newState && JSON.stringify(newState) !== JSON.stringify(state)) {
                dispatch({
                    type: 'SYNC_STATE',
                    payload: newState
                });
            }
        };
        // Listen for localStorage changes (cross-tab communication)
        const handleStorageChange = (event)=>{
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
        };
        window.addEventListener('workflow-state-update', handleStateUpdate);
        window.addEventListener('storage', handleStorageChange);
        return ()=>{
            window.removeEventListener('workflow-state-update', handleStateUpdate);
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [
        state
    ]);
    // Initialize workflow service and set up event listeners
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const initializeWorkflows = async ()=>{
            try {
                dispatch({
                    type: 'SET_LOADING',
                    payload: true
                });
                // Initialize the service
                await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$workflowAutomationService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["workflowAutomationService"].initialize();
                // Load existing workflows
                const workflows = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$workflowAutomationService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["workflowAutomationService"].getAllWorkflows();
                dispatch({
                    type: 'SET_WORKFLOWS',
                    payload: workflows
                });
                // Load recent executions
                const recentExecutions = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$workflowAutomationService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["workflowAutomationService"].getRecentExecutions(10);
                dispatch({
                    type: 'SET_RECENT_EXECUTIONS',
                    payload: recentExecutions
                });
                dispatch({
                    type: 'SET_CONNECTED',
                    payload: true
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["logger"].info('Workflow context initialized successfully');
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["logger"].error('Failed to initialize workflow context', error);
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
        };
        initializeWorkflows();
    }, []);
    // Set up event listeners for workflow service events
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const handleWorkflowCreated = (workflow)=>{
            dispatch({
                type: 'ADD_WORKFLOW',
                payload: workflow
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["logger"].info(`Workflow created: ${workflow.name}`);
        };
        const handleWorkflowUpdated = (workflow)=>{
            dispatch({
                type: 'UPDATE_WORKFLOW',
                payload: workflow
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["logger"].info(`Workflow updated: ${workflow.name}`);
        };
        const handleWorkflowDeleted = (workflowId)=>{
            dispatch({
                type: 'DELETE_WORKFLOW',
                payload: workflowId
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["logger"].info(`Workflow deleted: ${workflowId}`);
        };
        const handleExecutionStarted = (execution)=>{
            dispatch({
                type: 'SET_CURRENT_EXECUTION',
                payload: execution
            });
            dispatch({
                type: 'ADD_EXECUTION',
                payload: execution
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["logger"].info(`Workflow execution started: ${execution.id}`);
        };
        const handleExecutionCompleted = (execution)=>{
            dispatch({
                type: 'SET_CURRENT_EXECUTION',
                payload: execution
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["logger"].info(`Workflow execution completed: ${execution.id}`);
        };
        const handleExecutionFailed = (execution)=>{
            dispatch({
                type: 'SET_CURRENT_EXECUTION',
                payload: execution
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["logger"].error(`Workflow execution failed: ${execution.id}`, new Error(execution.error));
        };
        const handlePageNavigation = (data)=>{
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
        };
        // Register event listeners
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$workflowAutomationService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["workflowAutomationService"].on('workflow:created', handleWorkflowCreated);
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$workflowAutomationService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["workflowAutomationService"].on('workflow:updated', handleWorkflowUpdated);
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$workflowAutomationService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["workflowAutomationService"].on('workflow:deleted', handleWorkflowDeleted);
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$workflowAutomationService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["workflowAutomationService"].on('workflow:execution:started', handleExecutionStarted);
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$workflowAutomationService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["workflowAutomationService"].on('workflow:execution:completed', handleExecutionCompleted);
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$workflowAutomationService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["workflowAutomationService"].on('workflow:execution:failed', handleExecutionFailed);
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$workflowAutomationService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["workflowAutomationService"].on('page:navigate', handlePageNavigation);
        // Cleanup event listeners
        return ()=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$workflowAutomationService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["workflowAutomationService"].off('workflow:created', handleWorkflowCreated);
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$workflowAutomationService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["workflowAutomationService"].off('workflow:updated', handleWorkflowUpdated);
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$workflowAutomationService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["workflowAutomationService"].off('workflow:deleted', handleWorkflowDeleted);
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$workflowAutomationService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["workflowAutomationService"].off('workflow:execution:started', handleExecutionStarted);
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$workflowAutomationService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["workflowAutomationService"].off('workflow:execution:completed', handleExecutionCompleted);
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$workflowAutomationService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["workflowAutomationService"].off('workflow:execution:failed', handleExecutionFailed);
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$workflowAutomationService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["workflowAutomationService"].off('page:navigate', handlePageNavigation);
        };
    }, [
        router
    ]);
    // Context methods
    const createWorkflow = async (workflow)=>{
        try {
            dispatch({
                type: 'SET_LOADING',
                payload: true
            });
            const workflowId = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$workflowAutomationService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["workflowAutomationService"].createWorkflow(workflow);
            return workflowId;
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["logger"].error('Failed to create workflow', error);
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
            const success = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$workflowAutomationService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["workflowAutomationService"].updateWorkflow(id, updates);
            if (!success) {
                dispatch({
                    type: 'SET_ERROR',
                    payload: 'Workflow not found'
                });
            }
            return success;
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["logger"].error('Failed to update workflow', error);
            dispatch({
                type: 'SET_ERROR',
                payload: 'Failed to update workflow'
            });
            return false;
        }
    };
    const deleteWorkflow = async (id)=>{
        try {
            const success = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$workflowAutomationService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["workflowAutomationService"].deleteWorkflow(id);
            if (!success) {
                dispatch({
                    type: 'SET_ERROR',
                    payload: 'Workflow not found'
                });
            }
            return success;
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["logger"].error('Failed to delete workflow', error);
            dispatch({
                type: 'SET_ERROR',
                payload: 'Failed to delete workflow'
            });
            return false;
        }
    };
    const toggleWorkflow = async (id)=>{
        const workflow = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$workflowAutomationService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["workflowAutomationService"].getWorkflow(id);
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
            const executionId = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$workflowAutomationService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["workflowAutomationService"].executeWorkflow(workflowId, triggerData);
            return executionId;
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["logger"].error('Failed to execute workflow', error);
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
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["logger"].info(`Stopping execution: ${executionId}`);
            return true;
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["logger"].error('Failed to stop execution', error);
            dispatch({
                type: 'SET_ERROR',
                payload: 'Failed to stop execution'
            });
            return false;
        }
    };
    const triggerFromDashboard = (workflowId, data)=>{
        try {
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$workflowAutomationService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["workflowAutomationService"].triggerFromDashboard(workflowId, data);
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
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["logger"].error('Failed to trigger workflow from dashboard', error);
            dispatch({
                type: 'SET_ERROR',
                payload: 'Failed to trigger workflow'
            });
        }
    };
    const receiveFromDashboard = (workflowId, data)=>{
        // Process received data from dashboard
        const workflow = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$workflowAutomationService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["workflowAutomationService"].getWorkflow(workflowId);
        if (workflow) {
            dispatch({
                type: 'SELECT_WORKFLOW',
                payload: workflowId
            });
            if (data) {
                setCrossPageData({
                    [`workflow_${workflowId}`]: data
                });
            }
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["logger"].info(`Received workflow data from dashboard for ${workflowId}: ${JSON.stringify(data)}`);
        }
    };
    const navigateToTrading = (workflowId, config)=>{
        const params = new URLSearchParams();
        if (workflowId) {
            params.set('workflow', workflowId);
            params.set('source', 'dashboard');
            if (config) {
                // Encode configuration as URL parameters
                Object.entries(config).forEach(([key, value])=>{
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
        const url = params.toString() ? `/trading?${params.toString()}` : '/trading';
        router.push(url);
    };
    const navigateToDashboard = (workflowId, config)=>{
        const params = new URLSearchParams();
        if (workflowId) {
            params.set('workflow', workflowId);
            params.set('source', 'trading');
            if (config) {
                Object.entries(config).forEach(([key, value])=>{
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
        const url = params.toString() ? `/dashboard?${params.toString()}` : '/dashboard';
        router.push(url);
    };
    // Deep link handler for URL parameters
    const handleDeepLink = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((searchParams)=>{
        const workflowId = searchParams.get('workflow');
        const source = searchParams.get('source');
        if (workflowId) {
            // Extract configuration from URL parameters
            const config = {};
            searchParams.forEach((value, key)=>{
                if (key !== 'workflow' && key !== 'source') {
                    try {
                        // Try to parse as JSON first, fallback to string
                        config[key] = value.startsWith('{') || value.startsWith('[') ? JSON.parse(value) : value;
                    } catch  {
                        config[key] = value;
                    }
                }
            });
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
                setTimeout(()=>{
                    executeWorkflow(workflowId, config);
                }, 1000); // Small delay to ensure page is loaded
            }
        }
    }, [
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
            const workflows = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$workflowAutomationService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["workflowAutomationService"].getAllWorkflows();
            dispatch({
                type: 'SET_WORKFLOWS',
                payload: workflows
            });
            const recentExecutions = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$workflowAutomationService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["workflowAutomationService"].getRecentExecutions(10);
            dispatch({
                type: 'SET_RECENT_EXECUTIONS',
                payload: recentExecutions
            });
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["logger"].error('Failed to refresh workflows', error);
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
            const success = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$workflowAutomationService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["workflowAutomationService"].updateWorkflow(workflowId, {
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
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["logger"].info(`Workflow ${workflowId} status updated to ${status}`);
            } else {
                throw new Error('Failed to update workflow');
            }
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["logger"].error('Failed to update workflow status', error);
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(WorkflowContext.Provider, {
        value: contextValue,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/contexts/WorkflowContext.tsx",
        lineNumber: 631,
        columnNumber: 5
    }, this);
}
function useWorkflow() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(WorkflowContext);
    if (context === undefined) {
        throw new Error('useWorkflow must be used within a WorkflowProvider');
    }
    return context;
}
const __TURBOPACK__default__export__ = WorkflowContext;
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
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$WorkflowContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/WorkflowContext.tsx [app-ssr] (ecmascript)");
'use client';
;
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
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$WorkflowContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WorkflowProvider"], {
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
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/dynamic-access-async-storage.external.js [external] (next/dist/server/app-render/dynamic-access-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/dynamic-access-async-storage.external.js", () => require("next/dist/server/app-render/dynamic-access-async-storage.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__d67b8684._.js.map