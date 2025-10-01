(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/services/BalanceTrackingService.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_define_property.js [app-client] (ecmascript)");
'use client';
;
class BalanceTrackingService {
    /**
   * Subscribe to balance updates
   */ subscribe(listener) {
        this.listeners.add(listener);
        // Immediately send current balance
        listener(this.balance);
        // Return unsubscribe function
        return ()=>{
            this.listeners.delete(listener);
        };
    }
    /**
   * Get current balance
   */ getCurrentBalance() {
        return {
            ...this.balance
        };
    }
    /**
   * Update balance after deposit
   */ async processDeposit(amount) {
        // Add to pending deposits first
        this.balance.pendingDeposits += amount;
        this.notifyListeners();
        // Simulate processing time
        await new Promise((resolve)=>setTimeout(resolve, 2000));
        // Move from pending to available balance
        this.balance.pendingDeposits -= amount;
        this.balance.availableBalance += amount;
        this.balance.totalBalance += amount;
        this.balance.lastUpdated = new Date();
        this.notifyListeners();
    }
    /**
   * Update balance after withdrawal
   */ async processWithdrawal(amount) {
        // Check if sufficient funds
        if (this.balance.availableBalance < amount) {
            throw new Error('Insufficient funds for withdrawal');
        }
        // Add to pending withdrawals
        this.balance.pendingWithdrawals += amount;
        this.balance.availableBalance -= amount;
        this.notifyListeners();
        // Simulate processing time
        await new Promise((resolve)=>setTimeout(resolve, 2000));
        // Complete withdrawal
        this.balance.pendingWithdrawals -= amount;
        this.balance.totalBalance -= amount;
        this.balance.lastUpdated = new Date();
        this.notifyListeners();
    }
    /**
   * Update invested amount
   */ updateInvestedAmount(amount) {
        const difference = amount - this.balance.investedAmount;
        // Adjust available balance
        this.balance.availableBalance -= difference;
        this.balance.investedAmount = amount;
        this.balance.lastUpdated = new Date();
        this.notifyListeners();
    }
    /**
   * Add profit from trading
   */ addTradingProfit(profit) {
        this.balance.availableBalance += profit;
        this.balance.totalBalance += profit;
        this.balance.lastUpdated = new Date();
        this.notifyListeners();
    }
    /**
   * Start real-time balance updates (simulate market changes)
   */ startRealTimeUpdates() {
        this.updateInterval = setInterval(()=>{
            // Simulate small market fluctuations in invested amount
            const fluctuation = (Math.random() - 0.5) * 100 // ±$50
            ;
            const newInvestedValue = Math.max(0, this.balance.investedAmount + fluctuation);
            const difference = newInvestedValue - this.balance.investedAmount;
            this.balance.investedAmount = newInvestedValue;
            this.balance.totalBalance += difference;
            this.balance.lastUpdated = new Date();
            this.notifyListeners();
        }, 5000); // Update every 5 seconds
    }
    /**
   * Stop real-time updates
   */ stopRealTimeUpdates() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }
    /**
   * Notify all listeners of balance changes
   */ notifyListeners() {
        const balanceCopy = {
            ...this.balance
        };
        this.listeners.forEach((listener)=>{
            try {
                listener(balanceCopy);
            } catch (error) {
                console.error('Error in balance listener:', error);
            }
        });
    }
    /**
   * Format currency for display
   */ formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    }
    /**
   * Get balance summary for display
   */ getBalanceSummary() {
        return {
            total: this.formatCurrency(this.balance.totalBalance),
            available: this.formatCurrency(this.balance.availableBalance),
            invested: this.formatCurrency(this.balance.investedAmount),
            pending: this.formatCurrency(this.balance.pendingDeposits + this.balance.pendingWithdrawals)
        };
    }
    constructor(){
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "balance", {
            totalBalance: 125000,
            availableBalance: 45000,
            investedAmount: 80000,
            pendingDeposits: 0,
            pendingWithdrawals: 0,
            lastUpdated: new Date()
        });
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "listeners", new Set());
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "updateInterval", null);
        // Start real-time updates
        this.startRealTimeUpdates();
    }
}
// Create singleton instance
const balanceTrackingService = new BalanceTrackingService();
const __TURBOPACK__default__export__ = balanceTrackingService;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/services/AutomatedWorkflowService.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "automatedWorkflowService",
    ()=>automatedWorkflowService,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_define_property.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-hot-toast/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$BalanceTrackingService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/BalanceTrackingService.ts [app-client] (ecmascript)");
'use client';
;
;
;
class AutomatedWorkflowService {
    loadConfig() {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        const saved = localStorage.getItem('automatedWorkflowConfig');
        return saved ? JSON.parse(saved) : this.getDefaultConfig();
    }
    loadStatus() {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        const saved = localStorage.getItem('automatedWorkflowStatus');
        return saved ? JSON.parse(saved) : this.getDefaultStatus();
    }
    loadTransactions() {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        const saved = localStorage.getItem('automatedWorkflowTransactions');
        return saved ? JSON.parse(saved) : [];
    }
    getDefaultConfig() {
        return {
            autoDeposit: {
                enabled: false,
                amount: 100,
                frequency: 'weekly',
                source: 'bank'
            },
            autoInvest: {
                enabled: false,
                strategy: 'moderate',
                allocation: {
                    stocks: 40,
                    crypto: 30,
                    forex: 20,
                    commodities: 10
                },
                minBalance: 50
            },
            autoWithdraw: {
                enabled: false,
                profitThreshold: 500,
                withdrawPercentage: 50,
                destination: 'bank'
            }
        };
    }
    getDefaultStatus() {
        return {
            isRunning: false,
            lastExecution: null,
            nextExecution: null,
            totalDeposited: 0,
            totalInvested: 0,
            totalWithdrawn: 0,
            currentBalance: 1250.75,
            totalProfit: 250.75 // Mock profit
        };
    }
    saveConfig() {
        if ("TURBOPACK compile-time truthy", 1) {
            localStorage.setItem('automatedWorkflowConfig', JSON.stringify(this.config));
        }
    }
    saveStatus() {
        if ("TURBOPACK compile-time truthy", 1) {
            localStorage.setItem('automatedWorkflowStatus', JSON.stringify(this.status));
        }
    }
    saveTransactions() {
        if ("TURBOPACK compile-time truthy", 1) {
            localStorage.setItem('automatedWorkflowTransactions', JSON.stringify(this.transactions));
        }
    }
    isAnyWorkflowEnabled() {
        return this.config.autoDeposit.enabled || this.config.autoInvest.enabled || this.config.autoWithdraw.enabled;
    }
    updateConfig(newConfig) {
        this.config = {
            ...this.config,
            ...newConfig
        };
        this.saveConfig();
        // Restart workflow with new config
        this.stopWorkflow();
        if (this.isAnyWorkflowEnabled()) {
            this.startWorkflow();
        }
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Automated workflow configuration updated');
    }
    getConfig() {
        return {
            ...this.config
        };
    }
    getStatus() {
        return {
            ...this.status
        };
    }
    getTransactions() {
        return [
            ...this.transactions
        ];
    }
    startWorkflow() {
        if (this.intervalId) {
            this.stopWorkflow();
        }
        this.status.isRunning = true;
        this.status.nextExecution = this.calculateNextExecution();
        this.saveStatus();
        // Run workflow every minute (in production, this would be less frequent)
        this.intervalId = setInterval(()=>{
            this.executeWorkflow();
        }, 60000); // 1 minute
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Automated workflow started');
    }
    stopWorkflow() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.status.isRunning = false;
        this.status.nextExecution = null;
        this.saveStatus();
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Automated workflow stopped');
    }
    calculateNextExecution() {
        const now = new Date();
        const next = new Date(now);
        // For demo purposes, set next execution to 1 minute from now
        next.setMinutes(next.getMinutes() + 1);
        return next;
    }
    async executeWorkflow() {
        try {
            this.status.lastExecution = new Date();
            // Execute auto deposit
            if (this.config.autoDeposit.enabled) {
                await this.executeAutoDeposit();
            }
            // Execute auto invest
            if (this.config.autoInvest.enabled && this.status.currentBalance >= this.config.autoInvest.minBalance) {
                await this.executeAutoInvest();
            }
            // Execute auto withdraw
            if (this.config.autoWithdraw.enabled && this.status.totalProfit >= this.config.autoWithdraw.profitThreshold) {
                await this.executeAutoWithdraw();
            }
            this.status.nextExecution = this.calculateNextExecution();
            this.saveStatus();
        } catch (error) {
            console.error('Workflow execution failed:', error);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Automated workflow execution failed');
        }
    }
    async executeAutoDeposit() {
        const transaction = {
            id: "dep_".concat(Date.now()),
            type: 'deposit',
            amount: this.config.autoDeposit.amount,
            status: 'pending',
            timestamp: new Date(),
            description: "Auto deposit from ".concat(this.config.autoDeposit.source)
        };
        this.transactions.unshift(transaction);
        this.saveTransactions();
        // Simulate deposit processing
        setTimeout(()=>{
            transaction.status = 'completed';
            this.status.totalDeposited += transaction.amount;
            this.status.currentBalance += transaction.amount;
            this.saveStatus();
            this.saveTransactions();
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success("Auto deposit of $".concat(transaction.amount, " completed"));
        }, 2000);
    }
    async executeAutoInvest() {
        const investAmount = Math.min(this.status.currentBalance - this.config.autoInvest.minBalance, this.status.currentBalance * 0.8 // Invest max 80% of available balance
        );
        if (investAmount <= 0) return;
        const transaction = {
            id: "inv_".concat(Date.now()),
            type: 'invest',
            amount: investAmount,
            status: 'pending',
            timestamp: new Date(),
            description: "Auto investment using ".concat(this.config.autoInvest.strategy, " strategy")
        };
        this.transactions.unshift(transaction);
        this.saveTransactions();
        // Simulate investment processing
        setTimeout(()=>{
            transaction.status = 'completed';
            this.status.totalInvested += transaction.amount;
            this.status.currentBalance -= transaction.amount;
            // Simulate profit generation (random between 1-5%)
            const profitRate = (Math.random() * 4 + 1) / 100;
            const profit = transaction.amount * profitRate;
            this.status.totalProfit += profit;
            this.status.currentBalance += profit;
            this.saveStatus();
            this.saveTransactions();
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success("Auto investment of $".concat(transaction.amount.toFixed(2), " completed"));
        }, 3000);
    }
    async executeAutoWithdraw() {
        const withdrawAmount = this.status.totalProfit * this.config.autoWithdraw.withdrawPercentage / 100;
        if (withdrawAmount <= 0) return;
        const transaction = {
            id: "wit_".concat(Date.now()),
            type: 'withdraw',
            amount: withdrawAmount,
            status: 'pending',
            timestamp: new Date(),
            description: "Auto withdrawal to ".concat(this.config.autoWithdraw.destination)
        };
        this.transactions.unshift(transaction);
        this.saveTransactions();
        // Simulate withdrawal processing
        setTimeout(()=>{
            transaction.status = 'completed';
            this.status.totalWithdrawn += transaction.amount;
            this.status.currentBalance -= transaction.amount;
            this.status.totalProfit -= transaction.amount;
            this.saveStatus();
            this.saveTransactions();
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success("Auto withdrawal of $".concat(transaction.amount.toFixed(2), " completed"));
        }, 4000);
    }
    async manualDeposit(amount, source) {
        try {
            const transaction = {
                id: "man_dep_".concat(Date.now()),
                type: 'deposit',
                amount,
                status: 'pending',
                timestamp: new Date(),
                description: "Manual deposit from ".concat(source)
            };
            this.transactions.unshift(transaction);
            this.saveTransactions();
            // Process deposit with balance tracking
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$BalanceTrackingService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].processDeposit(amount);
            transaction.status = 'completed';
            this.status.totalDeposited += amount;
            this.status.currentBalance += amount;
            this.saveStatus();
            this.saveTransactions();
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success("Deposit of $".concat(amount, " completed"));
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Deposit failed. Please try again.');
            throw error;
        }
    }
    async manualWithdraw(amount, destination) {
        try {
            if (amount > this.status.currentBalance) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Insufficient balance for withdrawal');
                throw new Error('Insufficient balance');
            }
            const transaction = {
                id: "man_wit_".concat(Date.now()),
                type: 'withdraw',
                amount,
                status: 'pending',
                timestamp: new Date(),
                description: "Manual withdrawal to ".concat(destination)
            };
            this.transactions.unshift(transaction);
            this.saveTransactions();
            // Process withdrawal with balance tracking
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$BalanceTrackingService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].processWithdrawal(amount);
            transaction.status = 'completed';
            this.status.totalWithdrawn += amount;
            this.status.currentBalance -= amount;
            this.saveStatus();
            this.saveTransactions();
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success("Withdrawal of $".concat(amount, " completed"));
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Withdrawal failed. Please try again.');
            throw error;
        }
    }
    constructor(){
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "config", void 0);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "status", void 0);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "transactions", void 0);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "intervalId", null);
        // Load configuration from localStorage or use defaults
        this.config = this.loadConfig();
        this.status = this.loadStatus();
        this.transactions = this.loadTransactions();
        // Start the workflow if enabled
        if (this.isAnyWorkflowEnabled()) {
            this.startWorkflow();
        }
    }
}
const automatedWorkflowService = new AutomatedWorkflowService();
const __TURBOPACK__default__export__ = automatedWorkflowService;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/services/tradingService.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "tradingService",
    ()=>tradingService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-hot-toast/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$errorHandler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/errorHandler.ts [app-client] (ecmascript)");
;
;
;
class TradingService {
    /**
   * Create a new trade
   */ async createTrade(tradeData) {
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post('/trades', tradeData);
            if (response.data.success) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].success("".concat(tradeData.side, " order for ").concat(tradeData.symbol, " placed successfully!"));
                return response.data.data.trade;
            } else {
                throw new Error('Failed to create trade');
            }
        } catch (error) {
            const handledError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$errorHandler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleNetworkError"])(error, 'Trading Service - Create Trade');
            throw handledError;
        }
    }
    /**
   * Get user's trades with optional filters
   */ async getTrades(params) {
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('/trades', {
                params
            });
            if (response.data.success) {
                return response.data.data;
            } else {
                throw new Error('Failed to fetch trades');
            }
        } catch (error) {
            const handledError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$errorHandler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleNetworkError"])(error, 'Trading Service - Get Trades');
            throw handledError;
        }
    }
    /**
   * Get a specific trade by ID
   */ async getTradeById(tradeId) {
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/trades/".concat(tradeId));
            if (response.data.success) {
                return response.data.data.trade;
            } else {
                throw new Error('Failed to fetch trade');
            }
        } catch (error) {
            const handledError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$errorHandler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleNetworkError"])(error, 'Trading Service - Get Trade By ID');
            throw handledError;
        }
    }
    /**
   * Cancel a pending trade
   */ async cancelTrade(tradeId) {
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].put("/trades/".concat(tradeId, "/cancel"));
            if (response.data.success) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].success('Trade cancelled successfully!');
                return response.data.data.trade;
            } else {
                throw new Error('Failed to cancel trade');
            }
        } catch (error) {
            const handledError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$errorHandler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleNetworkError"])(error, 'Trading Service - Cancel Trade');
            throw handledError;
        }
    }
    /**
   * Validate trade data before submission
   */ validateTradeData(tradeData) {
        const errors = [];
        if (!tradeData.portfolioId) {
            const error = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$errorHandler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleValidationError"])('Portfolio is required', 'Trade Validation');
            errors.push(error.message);
        }
        if (!tradeData.symbol) {
            const error = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$errorHandler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleValidationError"])('Symbol is required', 'Trade Validation');
            errors.push(error.message);
        }
        if (!tradeData.side) {
            const error = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$errorHandler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleValidationError"])('Order side (BUY/SELL) is required', 'Trade Validation');
            errors.push(error.message);
        }
        if (!tradeData.quantity || tradeData.quantity <= 0) {
            const error = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$errorHandler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleValidationError"])('Quantity must be greater than 0', 'Trade Validation');
            errors.push(error.message);
        }
        if (!tradeData.price || tradeData.price <= 0) {
            const error = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$errorHandler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleValidationError"])('Price must be greater than 0', 'Trade Validation');
            errors.push(error.message);
        }
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    // GainzAlgo Integration Methods
    /**
   * Generate trading signals using GainzAlgo algorithm
   */ async generateSignals(marketType, timeFrame, symbols) {
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post('/trading/signals/generate', {
                marketType,
                timeFrame,
                symbols
            });
            if (response.data.success) {
                return response.data.data.signals;
            } else {
                throw new Error('Failed to generate signals');
            }
        } catch (error) {
            const handledError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$errorHandler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleNetworkError"])(error, 'Trading Service - Generate Signals');
            throw handledError;
        }
    }
    /**
   * Get active trading signals
   */ async getActiveSignals(marketType) {
        try {
            const params = marketType ? {
                marketType
            } : {};
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('/trading/signals/active', {
                params
            });
            if (response.data.success) {
                return response.data.data.signals;
            } else {
                throw new Error('Failed to fetch active signals');
            }
        } catch (error) {
            const handledError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$errorHandler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleNetworkError"])(error, 'Trading Service - Get Active Signals');
            throw handledError;
        }
    }
    /**
   * Calculate Stop Loss and Take Profit levels
   */ calculateSLTP(entryPrice, signalType) {
        let riskPercent = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 2, rewardRatio = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 2;
        const riskAmount = entryPrice * (riskPercent / 100);
        if (signalType === 'BUY') {
            const stopLoss = entryPrice - riskAmount;
            const takeProfit = entryPrice + riskAmount * rewardRatio;
            return {
                stopLoss,
                takeProfit
            };
        } else {
            const stopLoss = entryPrice + riskAmount;
            const takeProfit = entryPrice - riskAmount * rewardRatio;
            return {
                stopLoss,
                takeProfit
            };
        }
    }
    /**
   * Get performance metrics for a specific market or overall
   */ async getPerformanceMetrics(marketType, timeRange) {
        try {
            const params = {
                marketType,
                timeRange
            };
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('/trading/performance/metrics', {
                params
            });
            if (response.data.success) {
                return response.data.data.metrics;
            } else {
                throw new Error('Failed to fetch performance metrics');
            }
        } catch (error) {
            const handledError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$errorHandler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleNetworkError"])(error, 'Trading Service - Get Performance Metrics');
            throw handledError;
        }
    }
    /**
   * Get market-specific performance data
   */ async getMarketPerformance() {
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('/trading/performance/markets');
            if (response.data.success) {
                return response.data.data.markets;
            } else {
                throw new Error('Failed to fetch market performance');
            }
        } catch (error) {
            const handledError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$errorHandler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleNetworkError"])(error, 'Trading Service - Get Market Performance');
            throw handledError;
        }
    }
    /**
   * Calculate win rate from trades
   */ calculateWinRate(trades) {
        if (trades.length === 0) return 0;
        const executedTrades = trades.filter((trade)=>trade.status === 'EXECUTED' && trade.actualPnL !== undefined);
        if (executedTrades.length === 0) return 0;
        const winningTrades = executedTrades.filter((trade)=>(trade.actualPnL || 0) > 0);
        return winningTrades.length / executedTrades.length * 100;
    }
    /**
   * Calculate profit factor from trades
   */ calculateProfitFactor(trades) {
        const executedTrades = trades.filter((trade)=>trade.status === 'EXECUTED' && trade.actualPnL !== undefined);
        if (executedTrades.length === 0) return 0;
        const grossProfit = executedTrades.filter((trade)=>(trade.actualPnL || 0) > 0).reduce((sum, trade)=>sum + (trade.actualPnL || 0), 0);
        const grossLoss = Math.abs(executedTrades.filter((trade)=>(trade.actualPnL || 0) < 0).reduce((sum, trade)=>sum + (trade.actualPnL || 0), 0));
        return grossLoss === 0 ? grossProfit > 0 ? Infinity : 0 : grossProfit / grossLoss;
    }
    /**
   * Calculate maximum drawdown
   */ calculateMaxDrawdown(trades) {
        const executedTrades = trades.filter((trade)=>trade.status === 'EXECUTED' && trade.actualPnL !== undefined).sort((a, b)=>new Date(a.executedAt || a.createdAt).getTime() - new Date(b.executedAt || b.createdAt).getTime());
        if (executedTrades.length === 0) return 0;
        let peak = 0;
        let maxDrawdown = 0;
        let runningPnL = 0;
        for (const trade of executedTrades){
            runningPnL += trade.actualPnL || 0;
            if (runningPnL > peak) {
                peak = runningPnL;
            }
            const drawdown = peak - runningPnL;
            if (drawdown > maxDrawdown) {
                maxDrawdown = drawdown;
            }
        }
        return maxDrawdown;
    }
    /**
   * Execute trade based on signal with automatic SL/TP
   */ async executeSignalTrade(signal, portfolioId, quantity) {
        let riskPercent = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 2;
        const { stopLoss, takeProfit } = this.calculateSLTP(signal.entryPrice, signal.signalType, riskPercent);
        const tradeData = {
            portfolioId,
            symbol: signal.symbol,
            marketType: signal.marketType,
            side: signal.signalType === 'BUY' ? 'BUY' : 'SELL',
            quantity,
            price: signal.entryPrice,
            stopLoss,
            takeProfit,
            signalId: signal.id,
            timeFrame: signal.timeFrame,
            orderType: 'MARKET'
        };
        return this.createTrade(tradeData);
    }
}
const tradingService = new TradingService();
const __TURBOPACK__default__export__ = tradingService;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/services/liveMarketService.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "liveMarketService",
    ()=>liveMarketService,
    "useCandlestickData",
    ()=>useCandlestickData,
    "useDerivativeInstrument",
    ()=>useDerivativeInstrument,
    "useFuturesData",
    ()=>useFuturesData,
    "useMarketData",
    ()=>useMarketData,
    "useOptionsData",
    ()=>useOptionsData,
    "useOrderBook",
    ()=>useOrderBook,
    "useRecentTrades",
    ()=>useRecentTrades
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_define_property.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/logger.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature(), _s5 = __turbopack_context__.k.signature(), _s6 = __turbopack_context__.k.signature();
'use client';
;
;
class LiveMarketService {
    // Initialize mock market data
    initializeMarketData() {
        const baseData = {
            // Cryptocurrencies
            BTCUSDT: {
                basePrice: 45000,
                volatility: 0.02
            },
            ETHUSDT: {
                basePrice: 2800,
                volatility: 0.025
            },
            ADAUSDT: {
                basePrice: 0.45,
                volatility: 0.03
            },
            SOLUSDT: {
                basePrice: 98,
                volatility: 0.035
            },
            DOTUSDT: {
                basePrice: 6.5,
                volatility: 0.03
            },
            LINKUSDT: {
                basePrice: 14.2,
                volatility: 0.028
            },
            MATICUSDT: {
                basePrice: 0.85,
                volatility: 0.032
            },
            AVAXUSDT: {
                basePrice: 35,
                volatility: 0.03
            },
            ATOMUSDT: {
                basePrice: 9.8,
                volatility: 0.029
            },
            NEARUSDT: {
                basePrice: 2.1,
                volatility: 0.034
            },
            FTMUSDT: {
                basePrice: 0.32,
                volatility: 0.036
            },
            SANDUSDT: {
                basePrice: 0.48,
                volatility: 0.038
            },
            MANAUSDT: {
                basePrice: 0.42,
                volatility: 0.037
            },
            CHZUSDT: {
                basePrice: 0.089,
                volatility: 0.04
            },
            ENJUSDT: {
                basePrice: 0.28,
                volatility: 0.035
            },
            GALAUSDT: {
                basePrice: 0.035,
                volatility: 0.042
            },
            // Major Indices
            SPY: {
                basePrice: 428.50,
                volatility: 0.015
            },
            QQQ: {
                basePrice: 365.20,
                volatility: 0.018
            },
            DJI: {
                basePrice: 37689.54,
                volatility: 0.012
            },
            IXIC: {
                basePrice: 14845.73,
                volatility: 0.020
            },
            RUT: {
                basePrice: 2045.32,
                volatility: 0.025
            },
            VTI: {
                basePrice: 245.30,
                volatility: 0.014
            },
            IWM: {
                basePrice: 198.75,
                volatility: 0.022
            },
            // Futures
            ES: {
                basePrice: 4285.50,
                volatility: 0.018
            },
            NQ: {
                basePrice: 14850.25,
                volatility: 0.022
            },
            YM: {
                basePrice: 37650.00,
                volatility: 0.015
            },
            RTY: {
                basePrice: 2045.80,
                volatility: 0.028
            },
            CL: {
                basePrice: 78.45,
                volatility: 0.035
            },
            GC: {
                basePrice: 2025.60,
                volatility: 0.025
            },
            SI: {
                basePrice: 24.85,
                volatility: 0.040
            },
            NG: {
                basePrice: 2.85,
                volatility: 0.055
            },
            ZB: {
                basePrice: 112.25,
                volatility: 0.012
            },
            ZN: {
                basePrice: 108.75,
                volatility: 0.015
            },
            ZF: {
                basePrice: 105.50,
                volatility: 0.010
            },
            ZT: {
                basePrice: 102.25,
                volatility: 0.008
            },
            'BTC-PERP': {
                basePrice: 45200.00,
                volatility: 0.025
            },
            'ETH-PERP': {
                basePrice: 2820.00,
                volatility: 0.030
            },
            'SOL-PERP': {
                basePrice: 99.50,
                volatility: 0.040
            },
            'ADA-PERP': {
                basePrice: 0.46,
                volatility: 0.035
            },
            // Options
            'SPY-C-430-2024-03-15': {
                basePrice: 8.50,
                volatility: 0.45
            },
            'SPY-P-430-2024-03-15': {
                basePrice: 9.25,
                volatility: 0.42
            },
            'QQQ-C-370-2024-03-15': {
                basePrice: 12.75,
                volatility: 0.38
            },
            'QQQ-P-370-2024-03-15': {
                basePrice: 17.50,
                volatility: 0.40
            },
            'AAPL-C-180-2024-03-15': {
                basePrice: 5.25,
                volatility: 0.35
            },
            'AAPL-P-180-2024-03-15': {
                basePrice: 6.80,
                volatility: 0.37
            },
            'TSLA-C-200-2024-03-15': {
                basePrice: 15.60,
                volatility: 0.55
            },
            'TSLA-P-200-2024-03-15': {
                basePrice: 18.90,
                volatility: 0.52
            },
            'BTC-C-50000-2024-03-29': {
                basePrice: 2850.00,
                volatility: 0.65
            },
            'BTC-P-50000-2024-03-29': {
                basePrice: 7650.00,
                volatility: 0.68
            },
            'ETH-C-3000-2024-03-29': {
                basePrice: 285.50,
                volatility: 0.60
            },
            'ETH-P-3000-2024-03-29': {
                basePrice: 465.25,
                volatility: 0.62
            }
        };
        this.SUPPORTED_SYMBOLS.forEach((symbol)=>{
            const config = baseData[symbol];
            if (config) {
                const currentPrice = config.basePrice * (1 + (Math.random() - 0.5) * 0.1);
                const change = (Math.random() - 0.5) * config.basePrice * 0.05;
                const changePercent = change / (currentPrice - change) * 100;
                this.marketData.set(symbol, {
                    symbol,
                    price: currentPrice,
                    change,
                    changePercent,
                    volume: Math.random() * 10000000 + 1000000,
                    high24h: currentPrice * (1 + Math.random() * 0.05),
                    low24h: currentPrice * (1 - Math.random() * 0.05),
                    marketCap: currentPrice * (Math.random() * 1000000000 + 100000000),
                    lastUpdate: Date.now()
                });
                // Initialize candlestick data
                this.initializeCandlestickData(symbol, currentPrice, config.volatility);
                // Initialize order book
                this.initializeOrderBook(symbol, currentPrice);
                // Initialize recent trades
                this.initializeRecentTrades(symbol, currentPrice);
            }
        });
    }
    initializeCandlestickData(symbol, basePrice, volatility) {
        const candles = [];
        let currentPrice = basePrice;
        const now = Date.now();
        // Generate 100 historical candles (1 minute each)
        for(let i = 99; i >= 0; i--){
            const time = now - i * 60 * 1000;
            const open = currentPrice;
            const priceChange = (Math.random() - 0.5) * basePrice * volatility;
            const close = Math.max(0.01, open + priceChange);
            const high = Math.max(open, close) * (1 + Math.random() * 0.01);
            const low = Math.min(open, close) * (1 - Math.random() * 0.01);
            const volume = Math.random() * 1000000 + 10000;
            candles.push({
                time,
                open,
                high,
                low,
                close,
                volume
            });
            currentPrice = close;
        }
        this.candlestickData.set(symbol, candles);
    }
    initializeOrderBook(symbol, currentPrice) {
        const bids = [];
        const asks = [];
        // Generate 20 bid levels
        for(let i = 1; i <= 20; i++){
            const price = currentPrice - i * currentPrice * 0.001;
            const size = Math.random() * 10 + 0.1;
            bids.push({
                price,
                size,
                total: size * price
            });
        }
        // Generate 20 ask levels
        for(let i = 1; i <= 20; i++){
            const price = currentPrice + i * currentPrice * 0.001;
            const size = Math.random() * 10 + 0.1;
            asks.push({
                price,
                size,
                total: size * price
            });
        }
        this.orderBooks.set(symbol, {
            symbol,
            bids,
            asks,
            lastUpdate: Date.now()
        });
    }
    initializeRecentTrades(symbol, currentPrice) {
        const trades = [];
        const now = Date.now();
        // Generate 50 recent trades
        for(let i = 0; i < 50; i++){
            trades.push({
                id: "trade_".concat(symbol, "_").concat(i),
                symbol,
                price: currentPrice * (1 + (Math.random() - 0.5) * 0.01),
                size: Math.random() * 5 + 0.01,
                side: Math.random() > 0.5 ? 'buy' : 'sell',
                timestamp: now - i * 1000
            });
        }
        this.recentTrades.set(symbol, trades.reverse());
    }
    // Start real-time data simulation
    startDataSimulation() {
        this.isConnected = true;
        // Update market data every 1 second
        const marketUpdateInterval = setInterval(()=>{
            this.updateMarketData();
        }, 1000);
        // Update candlestick data every 5 seconds
        const candleUpdateInterval = setInterval(()=>{
            this.updateCandlestickData();
        }, 5000);
        // Update order books every 500ms
        const orderBookUpdateInterval = setInterval(()=>{
            this.updateOrderBooks();
        }, 500);
        // Add new trades every 2 seconds
        const tradesUpdateInterval = setInterval(()=>{
            this.updateRecentTrades();
        }, 2000);
        this.updateIntervals.set('market', marketUpdateInterval);
        this.updateIntervals.set('candles', candleUpdateInterval);
        this.updateIntervals.set('orderbook', orderBookUpdateInterval);
        this.updateIntervals.set('trades', tradesUpdateInterval);
    }
    updateMarketData() {
        this.marketData.forEach((ticker, symbol)=>{
            const volatility = this.getVolatilityForSymbol(symbol);
            const priceChange = (Math.random() - 0.5) * ticker.price * volatility * 0.1;
            const newPrice = Math.max(0.01, ticker.price + priceChange);
            const change = newPrice - ticker.price;
            const changePercent = change / ticker.price * 100;
            const updatedTicker = {
                ...ticker,
                price: newPrice,
                change: ticker.change + change,
                changePercent: ticker.changePercent + changePercent,
                volume: ticker.volume + Math.random() * 10000,
                high24h: Math.max(ticker.high24h, newPrice),
                low24h: Math.min(ticker.low24h, newPrice),
                lastUpdate: Date.now()
            };
            this.marketData.set(symbol, updatedTicker);
            this.notifySubscribers("ticker:".concat(symbol), updatedTicker);
        });
    }
    updateCandlestickData() {
        this.candlestickData.forEach((candles, symbol)=>{
            const ticker = this.marketData.get(symbol);
            if (!ticker) return;
            const lastCandle = candles[candles.length - 1];
            const now = Date.now();
            // If last candle is older than 1 minute, create a new one
            if (now - lastCandle.time > 60000) {
                const newCandle = {
                    time: now,
                    open: lastCandle.close,
                    high: ticker.price,
                    low: ticker.price,
                    close: ticker.price,
                    volume: Math.random() * 100000 + 1000
                };
                candles.push(newCandle);
                // Keep only last 200 candles
                if (candles.length > 200) {
                    candles.shift();
                }
            } else {
                // Update current candle
                lastCandle.close = ticker.price;
                lastCandle.high = Math.max(lastCandle.high, ticker.price);
                lastCandle.low = Math.min(lastCandle.low, ticker.price);
                lastCandle.volume += Math.random() * 1000;
            }
            this.notifySubscribers("candles:".concat(symbol), candles.slice(-100));
        });
    }
    updateOrderBooks() {
        this.orderBooks.forEach((orderBook, symbol)=>{
            const ticker = this.marketData.get(symbol);
            if (!ticker) return;
            // Simulate order book changes
            const updatedBids = orderBook.bids.map((bid)=>({
                    ...bid,
                    size: Math.max(0.01, bid.size + (Math.random() - 0.5) * 0.5),
                    price: ticker.price * (1 - Math.random() * 0.01)
                }));
            const updatedAsks = orderBook.asks.map((ask)=>({
                    ...ask,
                    size: Math.max(0.01, ask.size + (Math.random() - 0.5) * 0.5),
                    price: ticker.price * (1 + Math.random() * 0.01)
                }));
            const updatedOrderBook = {
                symbol,
                bids: updatedBids.sort((a, b)=>b.price - a.price),
                asks: updatedAsks.sort((a, b)=>a.price - b.price),
                lastUpdate: Date.now()
            };
            this.orderBooks.set(symbol, updatedOrderBook);
            this.notifySubscribers("orderbook:".concat(symbol), updatedOrderBook);
        });
    }
    updateRecentTrades() {
        this.recentTrades.forEach((trades, symbol)=>{
            const ticker = this.marketData.get(symbol);
            if (!ticker) return;
            // Add new trade
            const newTrade = {
                id: "trade_".concat(symbol, "_").concat(Date.now()),
                symbol,
                price: ticker.price * (1 + (Math.random() - 0.5) * 0.005),
                size: Math.random() * 2 + 0.01,
                side: Math.random() > 0.5 ? 'buy' : 'sell',
                timestamp: Date.now()
            };
            trades.push(newTrade);
            // Keep only last 100 trades
            if (trades.length > 100) {
                trades.shift();
            }
            this.notifySubscribers("trades:".concat(symbol), trades.slice(-20));
        });
    }
    getVolatilityForSymbol(symbol) {
        const volatilityMap = {
            'BTCUSDT': 0.02,
            'ETHUSDT': 0.025,
            'ADAUSDT': 0.03,
            'SOLUSDT': 0.035,
            'DOTUSDT': 0.03,
            'LINKUSDT': 0.028,
            'MATICUSDT': 0.032,
            'AVAXUSDT': 0.03,
            'ATOMUSDT': 0.029,
            'NEARUSDT': 0.034,
            'FTMUSDT': 0.036,
            'SANDUSDT': 0.038,
            'MANAUSDT': 0.037,
            'CHZUSDT': 0.04,
            'ENJUSDT': 0.035,
            'GALAUSDT': 0.042
        };
        return volatilityMap[symbol] || 0.03;
    }
    notifySubscribers(channel, data) {
        const subscribers = this.subscribers.get(channel);
        if (subscribers) {
            subscribers.forEach((callback)=>{
                try {
                    callback(data);
                } catch (error) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error('Failed to notify market data subscriber', error, 'LiveMarketService');
                }
            });
        }
    }
    // Public API methods
    subscribe(channel, callback) {
        if (!this.subscribers.has(channel)) {
            this.subscribers.set(channel, new Set());
        }
        this.subscribers.get(channel).add(callback);
        // Return unsubscribe function
        return ()=>{
            const subscribers = this.subscribers.get(channel);
            if (subscribers) {
                subscribers.delete(callback);
                if (subscribers.size === 0) {
                    this.subscribers.delete(channel);
                }
            }
        };
    }
    getMarketData(symbol) {
        if (symbol) {
            return this.marketData.get(symbol) || null;
        }
        return Array.from(this.marketData.values());
    }
    getCandlestickData(symbol) {
        let limit = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 100;
        const candles = this.candlestickData.get(symbol) || [];
        return candles.slice(-limit);
    }
    getOrderBook(symbol) {
        return this.orderBooks.get(symbol) || null;
    }
    getRecentTrades(symbol) {
        let limit = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 20;
        const trades = this.recentTrades.get(symbol) || [];
        return trades.slice(-limit);
    }
    getSupportedSymbols() {
        return [
            ...this.SUPPORTED_SYMBOLS
        ];
    }
    isConnectedToMarket() {
        return this.isConnected;
    }
    connect() {
        if (!this.isConnected) {
            this.initializeMarketData();
            this.startDataSimulation();
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].info('Live market service connected', 'LiveMarketService');
        }
    }
    disconnect() {
        this.isConnected = false;
        this.updateIntervals.forEach((interval)=>clearInterval(interval));
        this.updateIntervals.clear();
        this.subscribers.clear();
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].info('Live market service disconnected', 'LiveMarketService');
    }
    // Market analysis helpers
    getMarketStats(symbol) {
        var _last24hCandles_;
        const ticker = this.marketData.get(symbol);
        const candles = this.candlestickData.get(symbol);
        if (!ticker || !candles || candles.length === 0) {
            return null;
        }
        const last24hCandles = candles.filter((c)=>Date.now() - c.time <= 24 * 60 * 60 * 1000);
        const volume24h = last24hCandles.reduce((sum, c)=>sum + c.volume, 0);
        const trades24h = last24hCandles.length;
        return {
            symbol,
            volume24h,
            volumeChange24h: Math.random() * 20 - 10,
            trades24h,
            high24h: ticker.high24h,
            low24h: ticker.low24h,
            openPrice: ((_last24hCandles_ = last24hCandles[0]) === null || _last24hCandles_ === void 0 ? void 0 : _last24hCandles_.open) || ticker.price,
            closePrice: ticker.price,
            lastUpdate: Date.now()
        };
    }
    calculateTechnicalIndicators(symbol) {
        const candles = this.getCandlestickData(symbol, 50);
        if (candles.length < 20) return null;
        // Simple Moving Average (20 periods)
        const sma20 = candles.slice(-20).reduce((sum, c)=>sum + c.close, 0) / 20;
        // Exponential Moving Average (12 periods)
        let ema12 = candles[0].close;
        const multiplier = 2 / (12 + 1);
        for(let i = 1; i < candles.length; i++){
            ema12 = candles[i].close * multiplier + ema12 * (1 - multiplier);
        }
        // RSI (14 periods)
        const rsiPeriod = 14;
        if (candles.length >= rsiPeriod + 1) {
            let gains = 0;
            let losses = 0;
            for(let i = candles.length - rsiPeriod; i < candles.length; i++){
                const change = candles[i].close - candles[i - 1].close;
                if (change > 0) {
                    gains += change;
                } else {
                    losses += Math.abs(change);
                }
            }
            const avgGain = gains / rsiPeriod;
            const avgLoss = losses / rsiPeriod;
            const rs = avgGain / avgLoss;
            const rsi = 100 - 100 / (1 + rs);
            return {
                sma20,
                ema12,
                rsi,
                lastUpdate: Date.now()
            };
        }
        return {
            sma20,
            ema12,
            rsi: null,
            lastUpdate: Date.now()
        };
    }
    // Futures-specific methods
    getFuturesData(symbol) {
        var _this_marketData_get;
        if (!this.isFuturesSymbol(symbol)) return null;
        const contractMonth = this.extractContractMonth(symbol);
        const expirationDate = this.calculateExpirationDate(symbol);
        return {
            symbol,
            contractMonth,
            expirationDate,
            openInterest: Math.floor(Math.random() * 100000) + 50000,
            settlementPrice: ((_this_marketData_get = this.marketData.get(symbol)) === null || _this_marketData_get === void 0 ? void 0 : _this_marketData_get.price) || 0,
            marginRequirement: this.calculateMarginRequirement(symbol),
            tickSize: this.getTickSize(symbol),
            contractSize: this.getContractSize(symbol),
            lastTradingDay: this.calculateLastTradingDay(symbol)
        };
    }
    // Options-specific methods
    getOptionsData(symbol) {
        var _this_marketData_get;
        if (!this.isOptionsSymbol(symbol)) return null;
        const { underlying, strike, expiration, optionType } = this.parseOptionsSymbol(symbol);
        const currentPrice = ((_this_marketData_get = this.marketData.get(symbol)) === null || _this_marketData_get === void 0 ? void 0 : _this_marketData_get.price) || 0;
        const underlyingPrice = this.getUnderlyingPrice(underlying);
        const timeToExpiration = this.calculateTimeToExpiration(expiration);
        const impliedVolatility = 0.2 + Math.random() * 0.6; // 20-80% IV
        const greeks = this.calculateGreeks(currentPrice, underlyingPrice, strike, timeToExpiration, impliedVolatility, optionType);
        return {
            symbol,
            underlying,
            strike,
            expiration,
            optionType,
            impliedVolatility,
            ...greeks,
            openInterest: Math.floor(Math.random() * 10000) + 1000,
            timeToExpiration,
            intrinsicValue: this.calculateIntrinsicValue(underlyingPrice, strike, optionType),
            timeValue: currentPrice - this.calculateIntrinsicValue(underlyingPrice, strike, optionType)
        };
    }
    getDerivativeInstrument(symbol) {
        const marketData = this.marketData.get(symbol);
        if (!marketData) return null;
        let type = 'spot';
        let futuresData;
        let optionsData;
        if (this.isFuturesSymbol(symbol)) {
            type = 'futures';
            futuresData = this.getFuturesData(symbol) || undefined;
        } else if (this.isOptionsSymbol(symbol)) {
            type = 'options';
            optionsData = this.getOptionsData(symbol) || undefined;
        }
        return {
            type,
            symbol,
            marketData,
            futuresData,
            optionsData
        };
    }
    // Helper methods
    isFuturesSymbol(symbol) {
        return symbol.includes('-PERP') || [
            'ES',
            'NQ',
            'YM',
            'RTY',
            'CL',
            'GC',
            'SI',
            'NG',
            'ZB',
            'ZN',
            'ZF',
            'ZT'
        ].includes(symbol);
    }
    isOptionsSymbol(symbol) {
        return symbol.includes('-C-') || symbol.includes('-P-');
    }
    extractContractMonth(symbol) {
        if (symbol.includes('-PERP')) return 'Perpetual';
        const date = new Date();
        const months = [
            'JAN',
            'FEB',
            'MAR',
            'APR',
            'MAY',
            'JUN',
            'JUL',
            'AUG',
            'SEP',
            'OCT',
            'NOV',
            'DEC'
        ];
        return "".concat(months[date.getMonth()]).concat(date.getFullYear().toString().slice(-2));
    }
    calculateExpirationDate(symbol) {
        if (symbol.includes('-PERP')) return 'N/A';
        const date = new Date();
        date.setMonth(date.getMonth() + 1);
        return date.toISOString().split('T')[0];
    }
    calculateMarginRequirement(symbol) {
        var _this_marketData_get;
        const price = ((_this_marketData_get = this.marketData.get(symbol)) === null || _this_marketData_get === void 0 ? void 0 : _this_marketData_get.price) || 0;
        const marginRates = {
            'ES': 0.05,
            'NQ': 0.05,
            'YM': 0.05,
            'RTY': 0.06,
            'CL': 0.08,
            'GC': 0.04,
            'SI': 0.06,
            'NG': 0.10
        };
        return price * (marginRates[symbol] || 0.05);
    }
    getTickSize(symbol) {
        const tickSizes = {
            'ES': 0.25,
            'NQ': 0.25,
            'YM': 1.0,
            'RTY': 0.10,
            'CL': 0.01,
            'GC': 0.10,
            'SI': 0.005,
            'NG': 0.001
        };
        return tickSizes[symbol] || 0.01;
    }
    getContractSize(symbol) {
        const contractSizes = {
            'ES': 50,
            'NQ': 20,
            'YM': 5,
            'RTY': 50,
            'CL': 1000,
            'GC': 100,
            'SI': 5000,
            'NG': 10000
        };
        return contractSizes[symbol] || 1;
    }
    calculateLastTradingDay(symbol) {
        const date = new Date();
        date.setMonth(date.getMonth() + 1);
        date.setDate(15); // Typically 3rd Friday, simplified to 15th
        return date.toISOString().split('T')[0];
    }
    parseOptionsSymbol(symbol) {
        const parts = symbol.split('-');
        return {
            underlying: parts[0],
            optionType: parts[1].toLowerCase() === 'c' ? 'call' : 'put',
            strike: parseFloat(parts[2]),
            expiration: parts[3]
        };
    }
    getUnderlyingPrice(underlying) {
        var _this_marketData_get;
        // Map options underlying to actual symbols
        const underlyingMap = {
            'SPY': 'SPY',
            'QQQ': 'QQQ',
            'AAPL': 'AAPL',
            'TSLA': 'TSLA',
            'BTC': 'BTCUSDT',
            'ETH': 'ETHUSDT'
        };
        const actualSymbol = underlyingMap[underlying] || underlying;
        return ((_this_marketData_get = this.marketData.get(actualSymbol)) === null || _this_marketData_get === void 0 ? void 0 : _this_marketData_get.price) || 0;
    }
    calculateTimeToExpiration(expiration) {
        const expirationDate = new Date(expiration);
        const now = new Date();
        const diffTime = expirationDate.getTime() - now.getTime();
        return Math.max(0, diffTime / (1000 * 60 * 60 * 24 * 365)); // Years
    }
    calculateGreeks(optionPrice, underlyingPrice, strike, timeToExpiration, iv, optionType) {
        // Simplified Black-Scholes Greeks calculation
        const riskFreeRate = 0.05; // 5% risk-free rate
        const d1 = (Math.log(underlyingPrice / strike) + (riskFreeRate + 0.5 * iv * iv) * timeToExpiration) / (iv * Math.sqrt(timeToExpiration));
        const d2 = d1 - iv * Math.sqrt(timeToExpiration);
        const normalCDF = (x)=>0.5 * (1 + this.erf(x / Math.sqrt(2)));
        const normalPDF = (x)=>Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
        const delta = optionType === 'call' ? normalCDF(d1) : normalCDF(d1) - 1;
        const gamma = normalPDF(d1) / (underlyingPrice * iv * Math.sqrt(timeToExpiration));
        const theta = optionType === 'call' ? -(underlyingPrice * normalPDF(d1) * iv) / (2 * Math.sqrt(timeToExpiration)) - riskFreeRate * strike * Math.exp(-riskFreeRate * timeToExpiration) * normalCDF(d2) : -(underlyingPrice * normalPDF(d1) * iv) / (2 * Math.sqrt(timeToExpiration)) + riskFreeRate * strike * Math.exp(-riskFreeRate * timeToExpiration) * normalCDF(-d2);
        const vega = underlyingPrice * normalPDF(d1) * Math.sqrt(timeToExpiration);
        const rho = optionType === 'call' ? strike * timeToExpiration * Math.exp(-riskFreeRate * timeToExpiration) * normalCDF(d2) : -strike * timeToExpiration * Math.exp(-riskFreeRate * timeToExpiration) * normalCDF(-d2);
        return {
            delta,
            gamma,
            theta: theta / 365,
            vega: vega / 100,
            rho: rho / 100
        };
    }
    calculateIntrinsicValue(underlyingPrice, strike, optionType) {
        if (optionType === 'call') {
            return Math.max(0, underlyingPrice - strike);
        } else {
            return Math.max(0, strike - underlyingPrice);
        }
    }
    erf(x) {
        // Approximation of error function
        const a1 = 0.254829592;
        const a2 = -0.284496736;
        const a3 = 1.421413741;
        const a4 = -1.453152027;
        const a5 = 1.061405429;
        const p = 0.3275911;
        const sign = x >= 0 ? 1 : -1;
        x = Math.abs(x);
        const t = 1.0 / (1.0 + p * x);
        const y = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
        return sign * y;
    }
    constructor(){
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "subscribers", new Map());
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "marketData", new Map());
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "candlestickData", new Map());
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "orderBooks", new Map());
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "recentTrades", new Map());
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "updateIntervals", new Map());
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "isConnected", false);
        // Supported trading pairs
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "SUPPORTED_SYMBOLS", [
            // Cryptocurrencies
            'BTCUSDT',
            'ETHUSDT',
            'ADAUSDT',
            'SOLUSDT',
            'DOTUSDT',
            'LINKUSDT',
            'MATICUSDT',
            'AVAXUSDT',
            'ATOMUSDT',
            'NEARUSDT',
            'FTMUSDT',
            'SANDUSDT',
            'MANAUSDT',
            'CHZUSDT',
            'ENJUSDT',
            'GALAUSDT',
            // Major Indices
            'SPY',
            'QQQ',
            'DJI',
            'IXIC',
            'RUT',
            'VTI',
            'IWM',
            // Futures
            'ES',
            'NQ',
            'YM',
            'RTY',
            'CL',
            'GC',
            'SI',
            'NG',
            'ZB',
            'ZN',
            'ZF',
            'ZT',
            'BTC-PERP',
            'ETH-PERP',
            'SOL-PERP',
            'ADA-PERP',
            // Options
            'SPY-C-430-2024-03-15',
            'SPY-P-430-2024-03-15',
            'QQQ-C-370-2024-03-15',
            'QQQ-P-370-2024-03-15',
            'AAPL-C-180-2024-03-15',
            'AAPL-P-180-2024-03-15',
            'TSLA-C-200-2024-03-15',
            'TSLA-P-200-2024-03-15',
            'BTC-C-50000-2024-03-29',
            'BTC-P-50000-2024-03-29',
            'ETH-C-3000-2024-03-29',
            'ETH-P-3000-2024-03-29'
        ]);
        this.initializeMarketData();
        this.startDataSimulation();
    }
}
const liveMarketService = new LiveMarketService();
const __TURBOPACK__default__export__ = liveMarketService;
function useMarketData(symbol) {
    _s();
    const [data, setData] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useState(null);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useEffect({
        "useMarketData.useEffect": ()=>{
            const updateData = {
                "useMarketData.useEffect.updateData": ()=>{
                    setData(liveMarketService.getMarketData(symbol));
                }
            }["useMarketData.useEffect.updateData"];
            updateData();
            const channel = symbol ? "ticker:".concat(symbol) : 'ticker:all';
            const unsubscribe = liveMarketService.subscribe(channel, updateData);
            return unsubscribe;
        }
    }["useMarketData.useEffect"], [
        symbol
    ]);
    return data;
}
_s(useMarketData, "fQZRxy/+nAZ7NLS1X4dVhrlp8Go=");
function useCandlestickData(symbol) {
    let limit = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 100;
    _s1();
    const [data, setData] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useState([]);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useEffect({
        "useCandlestickData.useEffect": ()=>{
            const updateData = {
                "useCandlestickData.useEffect.updateData": (newData)=>{
                    setData(newData);
                }
            }["useCandlestickData.useEffect.updateData"];
            setData(liveMarketService.getCandlestickData(symbol, limit));
            const unsubscribe = liveMarketService.subscribe("candles:".concat(symbol), updateData);
            return unsubscribe;
        }
    }["useCandlestickData.useEffect"], [
        symbol,
        limit
    ]);
    return data;
}
_s1(useCandlestickData, "IEMTtLVFIuToo7X/raQbJAxzNQU=");
function useOrderBook(symbol) {
    _s2();
    const [data, setData] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useState(null);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useEffect({
        "useOrderBook.useEffect": ()=>{
            const updateData = {
                "useOrderBook.useEffect.updateData": (newData)=>{
                    setData(newData);
                }
            }["useOrderBook.useEffect.updateData"];
            setData(liveMarketService.getOrderBook(symbol));
            const unsubscribe = liveMarketService.subscribe("orderbook:".concat(symbol), updateData);
            return unsubscribe;
        }
    }["useOrderBook.useEffect"], [
        symbol
    ]);
    return data;
}
_s2(useOrderBook, "fQZRxy/+nAZ7NLS1X4dVhrlp8Go=");
function useRecentTrades(symbol) {
    let limit = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 20;
    _s3();
    const [data, setData] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useState([]);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useEffect({
        "useRecentTrades.useEffect": ()=>{
            const updateData = {
                "useRecentTrades.useEffect.updateData": (newData)=>{
                    setData(newData);
                }
            }["useRecentTrades.useEffect.updateData"];
            setData(liveMarketService.getRecentTrades(symbol, limit));
            const unsubscribe = liveMarketService.subscribe("trades:".concat(symbol), updateData);
            return unsubscribe;
        }
    }["useRecentTrades.useEffect"], [
        symbol,
        limit
    ]);
    return data;
}
_s3(useRecentTrades, "IEMTtLVFIuToo7X/raQbJAxzNQU=");
function useFuturesData(symbol) {
    _s4();
    const [futuresData, setFuturesData] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useState(null);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useEffect({
        "useFuturesData.useEffect": ()=>{
            const data = liveMarketService.getFuturesData(symbol);
            setFuturesData(data);
            const unsubscribe = liveMarketService.subscribe("futures:".concat(symbol), {
                "useFuturesData.useEffect.unsubscribe": (newData)=>{
                    setFuturesData(newData);
                }
            }["useFuturesData.useEffect.unsubscribe"]);
            return unsubscribe;
        }
    }["useFuturesData.useEffect"], [
        symbol
    ]);
    return futuresData;
}
_s4(useFuturesData, "wg5Ac1K1oPHoVOdy4RyxrOhcm7c=");
function useOptionsData(symbol) {
    _s5();
    const [optionsData, setOptionsData] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useState(null);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useEffect({
        "useOptionsData.useEffect": ()=>{
            const data = liveMarketService.getOptionsData(symbol);
            setOptionsData(data);
            const unsubscribe = liveMarketService.subscribe("options:".concat(symbol), {
                "useOptionsData.useEffect.unsubscribe": (newData)=>{
                    setOptionsData(newData);
                }
            }["useOptionsData.useEffect.unsubscribe"]);
            return unsubscribe;
        }
    }["useOptionsData.useEffect"], [
        symbol
    ]);
    return optionsData;
}
_s5(useOptionsData, "gy+QMQN23ZJFNUKUrSzSHVk1U2s=");
function useDerivativeInstrument(symbol) {
    _s6();
    const [instrument, setInstrument] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useState(null);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useEffect({
        "useDerivativeInstrument.useEffect": ()=>{
            const data = liveMarketService.getDerivativeInstrument(symbol);
            setInstrument(data);
            const unsubscribe = liveMarketService.subscribe("instrument:".concat(symbol), {
                "useDerivativeInstrument.useEffect.unsubscribe": (newData)=>{
                    setInstrument(newData);
                }
            }["useDerivativeInstrument.useEffect.unsubscribe"]);
            return unsubscribe;
        }
    }["useDerivativeInstrument.useEffect"], [
        symbol
    ]);
    return instrument;
}
_s6(useDerivativeInstrument, "T8f75a8gLGfaOifYZwE/Fnkt9vo=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/services/marketDataService.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MARKET_SYMBOLS",
    ()=>MARKET_SYMBOLS,
    "default",
    ()=>__TURBOPACK__default__export__,
    "useMarketConnection",
    ()=>useMarketConnection,
    "useMarketData",
    ()=>useMarketData,
    "useOrderBook",
    ()=>useOrderBook,
    "useTrades",
    ()=>useTrades
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_define_property.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature();
'use client';
;
const MARKET_SYMBOLS = {
    crypto: [
        {
            symbol: 'BTCUSDT',
            name: 'Bitcoin',
            basePrice: 43000
        },
        {
            symbol: 'ETHUSDT',
            name: 'Ethereum',
            basePrice: 2600
        },
        {
            symbol: 'LINKUSDT',
            name: 'Chainlink',
            basePrice: 21.5
        },
        {
            symbol: 'ADAUSDT',
            name: 'Cardano',
            basePrice: 0.65
        },
        {
            symbol: 'DOTUSDT',
            name: 'Polkadot',
            basePrice: 8.5
        },
        {
            symbol: 'SOLUSDT',
            name: 'Solana',
            basePrice: 95
        },
        {
            symbol: 'MATICUSDT',
            name: 'Polygon',
            basePrice: 1.1
        },
        {
            symbol: 'AVAXUSDT',
            name: 'Avalanche',
            basePrice: 42
        }
    ],
    stocks: [
        {
            symbol: 'AAPL',
            name: 'Apple Inc.',
            basePrice: 185
        },
        {
            symbol: 'GOOGL',
            name: 'Alphabet Inc.',
            basePrice: 140
        },
        {
            symbol: 'MSFT',
            name: 'Microsoft Corp.',
            basePrice: 380
        },
        {
            symbol: 'AMZN',
            name: 'Amazon.com Inc.',
            basePrice: 155
        },
        {
            symbol: 'TSLA',
            name: 'Tesla Inc.',
            basePrice: 240
        },
        {
            symbol: 'NVDA',
            name: 'NVIDIA Corp.',
            basePrice: 480
        },
        {
            symbol: 'META',
            name: 'Meta Platforms',
            basePrice: 350
        },
        {
            symbol: 'NFLX',
            name: 'Netflix Inc.',
            basePrice: 450
        }
    ],
    forex: [
        {
            symbol: 'EURUSD',
            name: 'Euro/US Dollar',
            basePrice: 1.08
        },
        {
            symbol: 'GBPUSD',
            name: 'British Pound/US Dollar',
            basePrice: 1.27
        },
        {
            symbol: 'USDJPY',
            name: 'US Dollar/Japanese Yen',
            basePrice: 150
        },
        {
            symbol: 'AUDUSD',
            name: 'Australian Dollar/US Dollar',
            basePrice: 0.66
        },
        {
            symbol: 'USDCAD',
            name: 'US Dollar/Canadian Dollar',
            basePrice: 1.35
        }
    ]
};
class MarketDataService {
    initializeMarketData() {
        // Initialize crypto data
        MARKET_SYMBOLS.crypto.forEach((param)=>{
            let { symbol, name, basePrice } = param;
            this.marketData.set(symbol, {
                symbol,
                name,
                price: basePrice + (Math.random() - 0.5) * basePrice * 0.1,
                change: (Math.random() - 0.5) * basePrice * 0.05,
                changePercent: (Math.random() - 0.5) * 10,
                volume: Math.random() * 10000000 + 1000000,
                high24h: basePrice * (1 + Math.random() * 0.1),
                low24h: basePrice * (1 - Math.random() * 0.1),
                bid: basePrice * (1 - Math.random() * 0.001),
                ask: basePrice * (1 + Math.random() * 0.001),
                spread: basePrice * Math.random() * 0.002,
                type: 'crypto'
            });
            this.initializeOrderBook(symbol);
            this.initializeRecentTrades(symbol);
        });
        // Initialize stock data
        MARKET_SYMBOLS.stocks.forEach((param)=>{
            let { symbol, name, basePrice } = param;
            this.marketData.set(symbol, {
                symbol,
                name,
                price: basePrice + (Math.random() - 0.5) * basePrice * 0.05,
                change: (Math.random() - 0.5) * basePrice * 0.03,
                changePercent: (Math.random() - 0.5) * 5,
                volume: Math.random() * 50000000 + 5000000,
                high24h: basePrice * (1 + Math.random() * 0.05),
                low24h: basePrice * (1 - Math.random() * 0.05),
                bid: basePrice * (1 - Math.random() * 0.0005),
                ask: basePrice * (1 + Math.random() * 0.0005),
                spread: basePrice * Math.random() * 0.001,
                marketCap: basePrice * Math.random() * 1000000000 + 100000000000,
                sector: [
                    'Technology',
                    'Consumer',
                    'Healthcare',
                    'Finance'
                ][Math.floor(Math.random() * 4)],
                type: 'stock'
            });
            this.initializeOrderBook(symbol);
            this.initializeRecentTrades(symbol);
        });
        // Initialize forex data
        MARKET_SYMBOLS.forex.forEach((param)=>{
            let { symbol, name, basePrice } = param;
            this.marketData.set(symbol, {
                symbol,
                name,
                price: basePrice + (Math.random() - 0.5) * basePrice * 0.02,
                change: (Math.random() - 0.5) * basePrice * 0.01,
                changePercent: (Math.random() - 0.5) * 2,
                volume: Math.random() * 100000000 + 10000000,
                high24h: basePrice * (1 + Math.random() * 0.02),
                low24h: basePrice * (1 - Math.random() * 0.02),
                bid: basePrice * (1 - Math.random() * 0.0001),
                ask: basePrice * (1 + Math.random() * 0.0001),
                spread: basePrice * Math.random() * 0.0002,
                type: 'forex'
            });
            this.initializeOrderBook(symbol);
            this.initializeRecentTrades(symbol);
        });
    }
    initializeOrderBook(symbol) {
        const marketData = this.marketData.get(symbol);
        if (!marketData) return;
        const bids = [];
        const asks = [];
        // Generate order book data
        for(let i = 0; i < 10; i++){
            const bidPrice = marketData.price * (1 - (i + 1) * 0.001);
            const askPrice = marketData.price * (1 + (i + 1) * 0.001);
            const bidQuantity = Math.random() * 1000 + 100;
            const askQuantity = Math.random() * 1000 + 100;
            bids.push({
                price: bidPrice,
                quantity: bidQuantity,
                total: bidPrice * bidQuantity
            });
            asks.push({
                price: askPrice,
                quantity: askQuantity,
                total: askPrice * askQuantity
            });
        }
        this.orderBooks.set(symbol, {
            bids: bids.sort((a, b)=>b.price - a.price),
            asks: asks.sort((a, b)=>a.price - b.price),
            lastUpdate: Date.now()
        });
    }
    initializeRecentTrades(symbol) {
        const marketData = this.marketData.get(symbol);
        if (!marketData) return;
        const trades = [];
        const now = Date.now();
        for(let i = 0; i < 20; i++){
            const timestamp = now - i * 1000 * Math.random() * 60;
            const price = marketData.price * (1 + (Math.random() - 0.5) * 0.01);
            const quantity = Math.random() * 100 + 10;
            const side = Math.random() > 0.5 ? 'buy' : 'sell';
            trades.push({
                price,
                quantity,
                time: new Date(timestamp).toLocaleTimeString(),
                side,
                timestamp
            });
        }
        this.recentTrades.set(symbol, trades.sort((a, b)=>b.timestamp - a.timestamp));
    }
    connect() {
        if (this.isConnected) return;
        this.isConnected = true;
        // Start real-time updates for all symbols
        Array.from(this.marketData.keys()).forEach((symbol)=>{
            this.startRealTimeUpdates(symbol);
        });
    }
    disconnect() {
        this.isConnected = false;
        // Clear all intervals
        this.intervals.forEach((interval)=>clearInterval(interval));
        this.intervals.clear();
    }
    startRealTimeUpdates(symbol) {
        // Price updates every 1-3 seconds
        const priceInterval = setInterval(()=>{
            this.updateMarketData(symbol);
        }, 1000 + Math.random() * 2000);
        // Order book updates every 2-5 seconds
        const orderBookInterval = setInterval(()=>{
            this.updateOrderBook(symbol);
        }, 2000 + Math.random() * 3000);
        // Trade updates every 3-8 seconds
        const tradeInterval = setInterval(()=>{
            this.addNewTrade(symbol);
        }, 3000 + Math.random() * 5000);
        this.intervals.set("".concat(symbol, "_price"), priceInterval);
        this.intervals.set("".concat(symbol, "_orderbook"), orderBookInterval);
        this.intervals.set("".concat(symbol, "_trades"), tradeInterval);
    }
    updateMarketData(symbol) {
        const data = this.marketData.get(symbol);
        if (!data) return;
        const volatility = data.type === 'crypto' ? 0.02 : data.type === 'stock' ? 0.01 : 0.005;
        const priceChange = (Math.random() - 0.5) * data.price * volatility;
        const newPrice = Math.max(0.001, data.price + priceChange);
        const updatedData = {
            ...data,
            price: newPrice,
            change: data.change + priceChange * 0.1,
            changePercent: (newPrice - (data.price - data.change)) / (data.price - data.change) * 100,
            volume: data.volume + Math.random() * 100000,
            bid: newPrice * (1 - Math.random() * 0.001),
            ask: newPrice * (1 + Math.random() * 0.001)
        };
        updatedData.spread = updatedData.ask - updatedData.bid;
        this.marketData.set(symbol, updatedData);
        // Notify subscribers
        const symbolSubscribers = this.subscribers.get(symbol);
        if (symbolSubscribers) {
            symbolSubscribers.forEach((callback)=>callback(updatedData));
        }
    }
    updateOrderBook(symbol) {
        const orderBook = this.orderBooks.get(symbol);
        const marketData = this.marketData.get(symbol);
        if (!orderBook || !marketData) return;
        // Update a few random entries
        const updateCount = Math.floor(Math.random() * 3) + 1;
        for(let i = 0; i < updateCount; i++){
            // Update bids
            const bidIndex = Math.floor(Math.random() * orderBook.bids.length);
            if (orderBook.bids[bidIndex]) {
                orderBook.bids[bidIndex].quantity += (Math.random() - 0.5) * 100;
                orderBook.bids[bidIndex].quantity = Math.max(1, orderBook.bids[bidIndex].quantity);
                orderBook.bids[bidIndex].total = orderBook.bids[bidIndex].price * orderBook.bids[bidIndex].quantity;
            }
            // Update asks
            const askIndex = Math.floor(Math.random() * orderBook.asks.length);
            if (orderBook.asks[askIndex]) {
                orderBook.asks[askIndex].quantity += (Math.random() - 0.5) * 100;
                orderBook.asks[askIndex].quantity = Math.max(1, orderBook.asks[askIndex].quantity);
                orderBook.asks[askIndex].total = orderBook.asks[askIndex].price * orderBook.asks[askIndex].quantity;
            }
        }
        orderBook.lastUpdate = Date.now();
        // Notify subscribers
        const subscribers = this.orderBookSubscribers.get(symbol);
        if (subscribers) {
            subscribers.forEach((callback)=>callback(orderBook));
        }
    }
    addNewTrade(symbol) {
        const trades = this.recentTrades.get(symbol);
        const marketData = this.marketData.get(symbol);
        if (!trades || !marketData) return;
        const newTrade = {
            price: marketData.price * (1 + (Math.random() - 0.5) * 0.005),
            quantity: Math.random() * 100 + 10,
            time: new Date().toLocaleTimeString(),
            side: Math.random() > 0.5 ? 'buy' : 'sell',
            timestamp: Date.now()
        };
        trades.unshift(newTrade);
        if (trades.length > 50) {
            trades.pop();
        }
        // Notify subscribers
        const subscribers = this.tradeSubscribers.get(symbol);
        if (subscribers) {
            subscribers.forEach((callback)=>callback([
                    ...trades
                ]));
        }
    }
    // Public API
    subscribe(symbol, callback) {
        if (!this.subscribers.has(symbol)) {
            this.subscribers.set(symbol, new Set());
        }
        this.subscribers.get(symbol).add(callback);
        // Send initial data
        const data = this.marketData.get(symbol);
        if (data) {
            callback(data);
        }
        return ()=>{
            const symbolSubscribers = this.subscribers.get(symbol);
            if (symbolSubscribers) {
                symbolSubscribers.delete(callback);
            }
        };
    }
    subscribeOrderBook(symbol, callback) {
        if (!this.orderBookSubscribers.has(symbol)) {
            this.orderBookSubscribers.set(symbol, new Set());
        }
        this.orderBookSubscribers.get(symbol).add(callback);
        // Send initial data
        const data = this.orderBooks.get(symbol);
        if (data) {
            callback(data);
        }
        return ()=>{
            const subscribers = this.orderBookSubscribers.get(symbol);
            if (subscribers) {
                subscribers.delete(callback);
            }
        };
    }
    subscribeTrades(symbol, callback) {
        if (!this.tradeSubscribers.has(symbol)) {
            this.tradeSubscribers.set(symbol, new Set());
        }
        this.tradeSubscribers.get(symbol).add(callback);
        // Send initial data
        const data = this.recentTrades.get(symbol);
        if (data) {
            callback([
                ...data
            ]);
        }
        return ()=>{
            const subscribers = this.tradeSubscribers.get(symbol);
            if (subscribers) {
                subscribers.delete(callback);
            }
        };
    }
    getMarketData(symbol) {
        return this.marketData.get(symbol);
    }
    getOrderBook(symbol) {
        return this.orderBooks.get(symbol);
    }
    getRecentTrades(symbol) {
        return this.recentTrades.get(symbol) || [];
    }
    getAllSymbols() {
        return Array.from(this.marketData.keys());
    }
    searchSymbols(query) {
        const results = [];
        const lowerQuery = query.toLowerCase();
        this.marketData.forEach((data)=>{
            if (data.symbol.toLowerCase().includes(lowerQuery) || data.name.toLowerCase().includes(lowerQuery)) {
                results.push(data);
            }
        });
        return results;
    }
    constructor(){
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "subscribers", new Map());
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "orderBookSubscribers", new Map());
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "tradeSubscribers", new Map());
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "marketData", new Map());
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "orderBooks", new Map());
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "recentTrades", new Map());
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "intervals", new Map());
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "isConnected", false);
        this.initializeMarketData();
    }
}
// Singleton instance
const marketDataService = new MarketDataService();
const useMarketData = (symbol)=>{
    _s();
    const [data, setData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useMarketData.useEffect": ()=>{
            setIsLoading(true);
            const unsubscribe = marketDataService.subscribe(symbol, {
                "useMarketData.useEffect.unsubscribe": (newData)=>{
                    setData(newData);
                    setIsLoading(false);
                }
            }["useMarketData.useEffect.unsubscribe"]);
            return unsubscribe;
        }
    }["useMarketData.useEffect"], [
        symbol
    ]);
    return {
        data,
        isLoading
    };
};
_s(useMarketData, "879Zp3RmOvEg9BC9+U0/eGysi/A=");
const useOrderBook = (symbol)=>{
    _s1();
    const [orderBook, setOrderBook] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useOrderBook.useEffect": ()=>{
            setIsLoading(true);
            const unsubscribe = marketDataService.subscribeOrderBook(symbol, {
                "useOrderBook.useEffect.unsubscribe": (newData)=>{
                    setOrderBook(newData);
                    setIsLoading(false);
                }
            }["useOrderBook.useEffect.unsubscribe"]);
            return unsubscribe;
        }
    }["useOrderBook.useEffect"], [
        symbol
    ]);
    return {
        orderBook,
        isLoading
    };
};
_s1(useOrderBook, "CR6Ik5AzdHsWGeOgHdGYde5csz8=");
const useTrades = (symbol)=>{
    _s2();
    const [trades, setTrades] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useTrades.useEffect": ()=>{
            setIsLoading(true);
            const unsubscribe = marketDataService.subscribeTrades(symbol, {
                "useTrades.useEffect.unsubscribe": (newTrades)=>{
                    setTrades(newTrades);
                    setIsLoading(false);
                }
            }["useTrades.useEffect.unsubscribe"]);
            return unsubscribe;
        }
    }["useTrades.useEffect"], [
        symbol
    ]);
    return {
        trades,
        isLoading
    };
};
_s2(useTrades, "nCh02x7Kz4ZS07yZSrvwyv3b46I=");
const useMarketConnection = ()=>{
    _s3();
    const [isConnected, setIsConnected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const connect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useMarketConnection.useCallback[connect]": ()=>{
            marketDataService.connect();
            setIsConnected(true);
        }
    }["useMarketConnection.useCallback[connect]"], []);
    const disconnect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useMarketConnection.useCallback[disconnect]": ()=>{
            marketDataService.disconnect();
            setIsConnected(false);
        }
    }["useMarketConnection.useCallback[disconnect]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useMarketConnection.useEffect": ()=>{
            // Auto-connect on mount
            connect();
            return ({
                "useMarketConnection.useEffect": ()=>{
                    disconnect();
                }
            })["useMarketConnection.useEffect"];
        }
    }["useMarketConnection.useEffect"], [
        connect,
        disconnect
    ]);
    return {
        isConnected,
        connect,
        disconnect
    };
};
_s3(useMarketConnection, "qxpN7ytQkUvvMx54v7dOfsnTwJ4=");
const __TURBOPACK__default__export__ = marketDataService;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/services/riskManagementSystem.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "riskManagementSystem",
    ()=>riskManagementSystem,
    "useRiskManagement",
    ()=>useRiskManagement
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_define_property.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-hot-toast/dist/index.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
class RiskManagementSystem {
    initializeRiskRules() {
        this.rules = [
            {
                id: 'daily_loss_limit',
                name: 'Daily Loss Limit',
                description: 'Triggers when daily loss exceeds the maximum allowed percentage',
                condition: (account)=>Math.abs(account.dailyPnLPercentage) > this.parameters.maxDailyLoss,
                action: 'stop_trading',
                severity: 'critical',
                enabled: true
            },
            {
                id: 'max_drawdown',
                name: 'Maximum Drawdown',
                description: 'Triggers when account drawdown exceeds the maximum allowed',
                condition: (account)=>account.currentDrawdown > this.parameters.maxDrawdown,
                action: 'reduce_positions',
                severity: 'critical',
                enabled: true
            },
            {
                id: 'position_size_limit',
                name: 'Position Size Limit',
                description: 'Triggers when a single position exceeds maximum size',
                condition: (account, positions)=>positions.some((p)=>p.currentRisk > this.parameters.maxPositionSize),
                action: 'reduce_positions',
                severity: 'high',
                enabled: true
            },
            {
                id: 'correlation_risk',
                name: 'High Correlation Risk',
                description: 'Triggers when positions have high correlation',
                condition: (account, positions)=>positions.some((p)=>p.correlationRisk > this.parameters.correlationLimit),
                action: 'alert',
                severity: 'medium',
                enabled: true
            },
            {
                id: 'margin_warning',
                name: 'High Margin Usage',
                description: 'Triggers when margin usage exceeds 80%',
                condition: (account)=>account.marginUsed / (account.marginUsed + account.marginAvailable) > 0.8,
                action: 'alert',
                severity: 'medium',
                enabled: true
            },
            {
                id: 'max_positions',
                name: 'Maximum Positions',
                description: 'Triggers when number of open positions exceeds limit',
                condition: (account, positions)=>positions.length > this.parameters.maxOpenPositions,
                action: 'alert',
                severity: 'medium',
                enabled: true
            }
        ];
    }
    startDailyReset() {
        // Reset daily tracking at midnight
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        const msUntilMidnight = tomorrow.getTime() - now.getTime();
        setTimeout(()=>{
            this.resetDailyTracking();
            // Set up daily interval
            setInterval(()=>this.resetDailyTracking(), 24 * 60 * 60 * 1000);
        }, msUntilMidnight);
    }
    resetDailyTracking() {
        this.dailyStartBalance = this.accountBalance;
        this.createAlert({
            type: 'info',
            message: 'Daily risk tracking reset',
            action: 'review_risk'
        });
    }
    createAlert(alertData) {
        const alert = {
            id: "alert_".concat(Date.now(), "_").concat(Math.random().toString(36).substr(2, 9)),
            type: alertData.type || 'info',
            message: alertData.message || 'Risk alert triggered',
            timestamp: new Date(),
            symbol: alertData.symbol,
            action: alertData.action,
            acknowledged: false
        };
        this.alerts.unshift(alert);
        // Keep only last 100 alerts
        if (this.alerts.length > 100) {
            this.alerts = this.alerts.slice(0, 100);
        }
        // Show toast notification
        const toastMessage = alertData.symbol ? "".concat(alertData.symbol, ": ").concat(alert.message) : alert.message;
        switch(alert.type){
            case 'critical':
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].error(toastMessage, {
                    duration: 10000
                });
                break;
            case 'warning':
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].error(toastMessage, {
                    duration: 5000
                });
                break;
            default:
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(toastMessage, {
                    duration: 3000
                });
        }
        this.notifySubscribers();
    }
    notifySubscribers() {
        this.subscribers.forEach((callback)=>callback(this.alerts));
    }
    // Public Methods
    updateAccountBalance(balance) {
        this.accountBalance = balance;
        // Update max drawdown
        const currentDrawdown = (this.dailyStartBalance - balance) / this.dailyStartBalance * 100;
        if (currentDrawdown > this.maxDrawdownValue) {
            this.maxDrawdownValue = currentDrawdown;
        }
    }
    calculatePositionRisk(symbol, entryPrice, size, stopLoss) {
        const positionValue = entryPrice * size;
        const currentRisk = positionValue / this.accountBalance * 100;
        const defaultStopLoss = stopLoss || entryPrice * (1 - this.parameters.stopLossPercentage / 100);
        const defaultTakeProfit = entryPrice + (entryPrice - defaultStopLoss) * this.parameters.takeProfitRatio;
        const riskAmount = Math.abs(entryPrice - defaultStopLoss) * size;
        const rewardAmount = Math.abs(defaultTakeProfit - entryPrice) * size;
        const riskRewardRatio = rewardAmount / riskAmount;
        // Calculate correlation risk (simplified)
        const correlationRisk = this.calculateCorrelationRisk(symbol);
        return {
            symbol,
            currentRisk,
            maxRisk: this.parameters.maxPositionSize,
            stopLoss: defaultStopLoss,
            takeProfit: defaultTakeProfit,
            riskRewardRatio,
            correlationRisk
        };
    }
    calculateCorrelationRisk(symbol) {
        // Simplified correlation calculation
        // In a real implementation, this would use historical price data
        const correlationMap = {
            'BTCUSDT': {
                'ETHUSDT': 0.8,
                'ADAUSDT': 0.7
            },
            'ETHUSDT': {
                'BTCUSDT': 0.8,
                'ADAUSDT': 0.6
            },
            'AAPL': {
                'MSFT': 0.6,
                'GOOGL': 0.5
            },
            'TSLA': {
                'AAPL': 0.3,
                'MSFT': 0.2
            }
        };
        const correlations = correlationMap[symbol] || {};
        return Math.max(...Object.values(correlations), 0);
    }
    calculateAccountRisk(positions) {
        const totalRisk = positions.reduce((sum, pos)=>sum + pos.currentRisk, 0);
        const dailyPnL = this.accountBalance - this.dailyStartBalance;
        const dailyPnLPercentage = dailyPnL / this.dailyStartBalance * 100;
        const currentDrawdown = this.maxDrawdownValue;
        // Calculate risk score (0-100)
        let riskScore = 0;
        riskScore += Math.min(totalRisk / this.parameters.maxPositionSize * 20, 20); // Position size risk
        riskScore += Math.min(Math.abs(dailyPnLPercentage) / this.parameters.maxDailyLoss * 30, 30); // Daily loss risk
        riskScore += Math.min(currentDrawdown / this.parameters.maxDrawdown * 30, 30); // Drawdown risk
        riskScore += Math.min(positions.length / this.parameters.maxOpenPositions * 20, 20); // Position count risk
        return {
            totalRisk,
            dailyPnL,
            dailyPnLPercentage,
            currentDrawdown,
            maxDrawdownReached: this.maxDrawdownValue,
            marginUsed: totalRisk * this.accountBalance / 100,
            marginAvailable: this.accountBalance - totalRisk * this.accountBalance / 100,
            riskScore: Math.min(riskScore, 100)
        };
    }
    checkRiskRules(accountRisk, positionRisks) {
        this.rules.forEach((rule)=>{
            if (!rule.enabled) return;
            if (rule.condition(accountRisk, positionRisks)) {
                this.createAlert({
                    type: rule.severity === 'critical' ? 'critical' : 'warning',
                    message: "".concat(rule.name, ": ").concat(rule.description),
                    action: rule.action
                });
            }
        });
    }
    validateOrder(symbol, size, price, stopLoss) {
        const positionRisk = this.calculatePositionRisk(symbol, price, size, stopLoss);
        // Check position size
        if (positionRisk.currentRisk > this.parameters.maxPositionSize) {
            const maxSize = this.parameters.maxPositionSize / 100 * this.accountBalance / price;
            return {
                valid: false,
                reason: "Position size exceeds maximum allowed (".concat(this.parameters.maxPositionSize, "%)"),
                suggestedSize: Math.floor(maxSize * 100) / 100
            };
        }
        // Check risk per trade
        const riskAmount = Math.abs(price - (stopLoss || price * 0.98)) * size;
        const riskPercentage = riskAmount / this.accountBalance * 100;
        if (riskPercentage > this.parameters.riskPerTrade) {
            const maxSize = this.parameters.riskPerTrade / 100 * this.accountBalance / Math.abs(price - (stopLoss || price * 0.98));
            return {
                valid: false,
                reason: "Risk per trade exceeds maximum allowed (".concat(this.parameters.riskPerTrade, "%)"),
                suggestedSize: Math.floor(maxSize * 100) / 100
            };
        }
        return {
            valid: true
        };
    }
    getOptimalPositionSize(symbol, entryPrice, stopLoss) {
        const riskAmount = this.parameters.riskPerTrade / 100 * this.accountBalance;
        const priceRisk = Math.abs(entryPrice - stopLoss);
        return riskAmount / priceRisk;
    }
    acknowledgeAlert(alertId) {
        const alert = this.alerts.find((a)=>a.id === alertId);
        if (alert) {
            alert.acknowledged = true;
            this.notifySubscribers();
        }
    }
    updateRiskParameters(newParameters) {
        this.parameters = {
            ...this.parameters,
            ...newParameters
        };
        this.createAlert({
            type: 'info',
            message: 'Risk parameters updated',
            action: 'review_risk'
        });
    }
    getRiskParameters() {
        return {
            ...this.parameters
        };
    }
    getAlerts() {
        return [
            ...this.alerts
        ];
    }
    getUnacknowledgedAlerts() {
        return this.alerts.filter((alert)=>!alert.acknowledged);
    }
    subscribe(callback) {
        this.subscribers.push(callback);
        return ()=>{
            const index = this.subscribers.indexOf(callback);
            if (index > -1) {
                this.subscribers.splice(index, 1);
            }
        };
    }
    clearAlerts() {
        this.alerts = [];
        this.notifySubscribers();
    }
    exportRiskReport() {
        return {
            parameters: this.parameters,
            alerts: this.alerts,
            timestamp: new Date()
        };
    }
    constructor(){
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "parameters", void 0);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "alerts", void 0);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "rules", []);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "subscribers", void 0);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "accountBalance", void 0);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "dailyStartBalance", void 0);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "maxDrawdownValue", void 0);
        this.parameters = {
            maxPositionSize: 10,
            maxDailyLoss: 5,
            maxDrawdown: 15,
            stopLossPercentage: 2,
            takeProfitRatio: 2,
            maxOpenPositions: 5,
            riskPerTrade: 1,
            correlationLimit: 0.7 // 70% correlation limit
        };
        this.alerts = [];
        this.subscribers = [];
        this.accountBalance = 10000; // Default balance
        this.dailyStartBalance = 10000;
        this.maxDrawdownValue = 0;
        this.initializeRiskRules();
        this.startDailyReset();
    }
}
const riskManagementSystem = new RiskManagementSystem();
function useRiskManagement() {
    _s();
    const [alerts, setAlerts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [parameters, setParameters] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(riskManagementSystem.getRiskParameters());
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useRiskManagement.useEffect": ()=>{
            const unsubscribe = riskManagementSystem.subscribe(setAlerts);
            setAlerts(riskManagementSystem.getAlerts());
            return unsubscribe;
        }
    }["useRiskManagement.useEffect"], []);
    const updateParameters = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useRiskManagement.useCallback[updateParameters]": (newParams)=>{
            riskManagementSystem.updateRiskParameters(newParams);
            setParameters(riskManagementSystem.getRiskParameters());
        }
    }["useRiskManagement.useCallback[updateParameters]"], []);
    const acknowledgeAlert = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useRiskManagement.useCallback[acknowledgeAlert]": (alertId)=>{
            riskManagementSystem.acknowledgeAlert(alertId);
        }
    }["useRiskManagement.useCallback[acknowledgeAlert]"], []);
    const validateOrder = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useRiskManagement.useCallback[validateOrder]": (symbol, size, price, stopLoss)=>{
            return riskManagementSystem.validateOrder(symbol, size, price, stopLoss);
        }
    }["useRiskManagement.useCallback[validateOrder]"], []);
    const calculatePositionRisk = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useRiskManagement.useCallback[calculatePositionRisk]": (symbol, entryPrice, size, stopLoss)=>{
            return riskManagementSystem.calculatePositionRisk(symbol, entryPrice, size, stopLoss);
        }
    }["useRiskManagement.useCallback[calculatePositionRisk]"], []);
    const getOptimalPositionSize = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useRiskManagement.useCallback[getOptimalPositionSize]": (symbol, entryPrice, stopLoss)=>{
            return riskManagementSystem.getOptimalPositionSize(symbol, entryPrice, stopLoss);
        }
    }["useRiskManagement.useCallback[getOptimalPositionSize]"], []);
    return {
        alerts,
        parameters,
        updateParameters,
        acknowledgeAlert,
        validateOrder,
        calculatePositionRisk,
        getOptimalPositionSize,
        unacknowledgedAlerts: alerts.filter((a)=>!a.acknowledged),
        clearAlerts: ()=>riskManagementSystem.clearAlerts()
    };
}
_s(useRiskManagement, "pbDlL1veWV8BymFz3nTLeiF9zYs=");
const __TURBOPACK__default__export__ = riskManagementSystem;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/services/liveTradingService.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "useLivePrice",
    ()=>useLivePrice,
    "useLiveTrading",
    ()=>useLiveTrading
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_define_property.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$errorHandler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/errorHandler.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
class LiveTradingService {
    initializeConnection() {
        // Simulate connection to trading server
        setTimeout(()=>{
            this.isConnected = true;
            this.reconnectAttempts = 0;
            this.notifySubscribers();
        }, 1000);
    }
    startPriceUpdates() {
        // Simulate real-time price updates
        setInterval(()=>{
            if (!this.isConnected) return;
            // Update position prices and PnL
            this.positions.forEach((position)=>{
                const priceChange = (Math.random() - 0.5) * 0.01; // ±0.5% change
                position.currentPrice = position.currentPrice * (1 + priceChange);
                // Calculate PnL
                const priceDiff = position.currentPrice - position.entryPrice;
                const multiplier = position.side === 'long' ? 1 : -1;
                position.pnl = priceDiff * multiplier * position.size;
                position.pnlPercent = priceDiff / position.entryPrice * multiplier * 100;
                // Update account equity
                this.updateAccountEquity();
                // Notify price subscribers
                const symbolSubscribers = this.priceSubscribers.get(position.symbol);
                if (symbolSubscribers) {
                    symbolSubscribers.forEach((callback)=>callback(position.currentPrice));
                }
            });
            this.notifySubscribers();
        }, 1000);
    }
    updateAccountEquity() {
        let totalPnL = 0;
        this.positions.forEach((position)=>{
            totalPnL += position.pnl;
        });
        this.account.equity = this.account.balance + totalPnL;
        this.account.freeMargin = this.account.equity - this.account.margin;
        if (this.account.margin > 0) {
            this.account.marginLevel = this.account.equity / this.account.margin * 100;
        }
    }
    generateTradingSignals() {
        const symbols = [
            'BTCUSD',
            'ETHUSD',
            'EURUSD',
            'GBPUSD',
            'USDJPY'
        ];
        setInterval(()=>{
            if (Math.random() < 0.3) {
                const symbol = symbols[Math.floor(Math.random() * symbols.length)];
                const action = Math.random() > 0.5 ? 'buy' : 'sell';
                const confidence = 60 + Math.random() * 35; // 60-95% confidence
                const basePrice = this.getMarketPrice(symbol);
                const signal = {
                    id: "signal-".concat(Date.now(), "-").concat(Math.random().toString(36).substr(2, 9)),
                    symbol,
                    action,
                    confidence,
                    entryPrice: basePrice,
                    stopLoss: action === 'buy' ? basePrice * 0.98 : basePrice * 1.02,
                    takeProfit: action === 'buy' ? basePrice * 1.04 : basePrice * 0.96,
                    reasoning: this.generateSignalReasoning(symbol, action, confidence),
                    timestamp: new Date()
                };
                this.signals.unshift(signal);
                if (this.signals.length > 20) {
                    this.signals = this.signals.slice(0, 20);
                }
                this.notifySubscribers();
            }
        }, 5000); // Check every 5 seconds
    }
    generateSignalReasoning(symbol, action, confidence) {
        const reasons = [
            "Technical analysis shows strong ".concat(action === 'buy' ? 'bullish' : 'bearish', " momentum on ").concat(symbol),
            "RSI indicates ".concat(action === 'buy' ? 'oversold' : 'overbought', " conditions for ").concat(symbol),
            "Moving average crossover suggests ".concat(action === 'buy' ? 'upward' : 'downward', " trend for ").concat(symbol),
            "Support/resistance levels favor ".concat(action === 'buy' ? 'long' : 'short', " position on ").concat(symbol),
            "Volume analysis confirms ".concat(action === 'buy' ? 'buying' : 'selling', " pressure on ").concat(symbol)
        ];
        return reasons[Math.floor(Math.random() * reasons.length)];
    }
    getMarketPrice(symbol) {
        // Simulate market prices
        const basePrices = {
            'BTCUSD': 45000,
            'ETHUSD': 2800,
            'EURUSD': 1.0850,
            'GBPUSD': 1.2650,
            'USDJPY': 148.50
        };
        const basePrice = basePrices[symbol] || 1.0000;
        const variation = (Math.random() - 0.5) * 0.02; // ±1% variation
        return basePrice * (1 + variation);
    }
    notifySubscribers() {
        this.subscribers.forEach((callback)=>callback());
    }
    // Public API methods
    async placeOrder(orderRequest) {
        try {
            if (!this.isConnected) {
                throw new Error('Not connected to trading server');
            }
            // Validate order
            const validation = this.validateOrder(orderRequest);
            if (!validation.valid) {
                throw new Error(validation.error);
            }
            const orderId = "order-".concat(Date.now(), "-").concat(Math.random().toString(36).substr(2, 9));
            const currentPrice = this.getMarketPrice(orderRequest.symbol);
            const order = {
                id: orderId,
                symbol: orderRequest.symbol,
                type: orderRequest.type,
                side: orderRequest.side,
                size: orderRequest.size,
                price: orderRequest.price,
                status: 'pending',
                timestamp: new Date()
            };
            this.orders.set(orderId, order);
            // Simulate order execution
            setTimeout(()=>{
                this.executeOrder(orderId, orderRequest);
            }, Math.random() * 2000 + 500); // 0.5-2.5 seconds
            this.notifySubscribers();
            return {
                success: true,
                orderId
            };
        } catch (error) {
            const handledError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$errorHandler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleTradingError"])(error.message, {
                orderRequest
            }, 'Live Trading - Place Order');
            return {
                success: false,
                error: handledError.message
            };
        }
    }
    validateOrder(orderRequest) {
        // Check account balance
        const requiredMargin = this.calculateRequiredMargin(orderRequest);
        if (requiredMargin > this.account.freeMargin) {
            const error = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$errorHandler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleTradingError"])('Insufficient margin', {
                requiredMargin,
                freeMargin: this.account.freeMargin
            }, 'Order Validation');
            return {
                valid: false,
                error: error.message
            };
        }
        // Check minimum size
        if (orderRequest.size < 0.01) {
            const error = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$errorHandler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleTradingError"])('Minimum order size is 0.01', {
                size: orderRequest.size
            }, 'Order Validation');
            return {
                valid: false,
                error: error.message
            };
        }
        // Check maximum size
        if (orderRequest.size > 100) {
            const error = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$errorHandler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleTradingError"])('Maximum order size is 100', {
                size: orderRequest.size
            }, 'Order Validation');
            return {
                valid: false,
                error: error.message
            };
        }
        return {
            valid: true
        };
    }
    calculateRequiredMargin(orderRequest) {
        const currentPrice = this.getMarketPrice(orderRequest.symbol);
        const notionalValue = orderRequest.size * currentPrice;
        const leverage = orderRequest.leverage || this.account.leverage;
        return notionalValue / leverage;
    }
    executeOrder(orderId, orderRequest) {
        const order = this.orders.get(orderId);
        if (!order) return;
        const currentPrice = this.getMarketPrice(orderRequest.symbol);
        const executionPrice = orderRequest.type === 'market' ? currentPrice : orderRequest.price || currentPrice;
        // Update order status
        order.status = 'filled';
        order.fillPrice = executionPrice;
        order.commission = orderRequest.size * executionPrice * 0.0001; // 0.01% commission
        // Create position
        const positionId = "pos-".concat(Date.now(), "-").concat(Math.random().toString(36).substr(2, 9));
        const side = orderRequest.side === 'buy' ? 'long' : 'short';
        const position = {
            id: positionId,
            symbol: orderRequest.symbol,
            side,
            size: orderRequest.size,
            entryPrice: executionPrice,
            currentPrice: executionPrice,
            pnl: 0,
            pnlPercent: 0,
            margin: this.calculateRequiredMargin(orderRequest),
            swap: 0,
            commission: order.commission,
            openTime: new Date(),
            stopLoss: orderRequest.stopLoss,
            takeProfit: orderRequest.takeProfit
        };
        this.positions.set(positionId, position);
        // Update account
        this.account.margin += position.margin;
        this.account.balance -= order.commission;
        this.updateAccountEquity();
        this.notifySubscribers();
    }
    async closePosition(positionId) {
        try {
            const position = this.positions.get(positionId);
            if (!position) {
                throw new Error('Position not found');
            }
            // Create closing order
            const closingSide = position.side === 'long' ? 'sell' : 'buy';
            const currentPrice = this.getMarketPrice(position.symbol);
            const commission = position.size * currentPrice * 0.0001;
            // Update account
            this.account.balance += position.pnl - commission;
            this.account.margin -= position.margin;
            this.updateAccountEquity();
            // Remove position
            this.positions.delete(positionId);
            this.notifySubscribers();
            return {
                success: true
            };
        } catch (error) {
            const handledError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$errorHandler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleTradingError"])(error.message, {
                positionId
            }, 'Live Trading - Close Position');
            return {
                success: false,
                error: handledError.message
            };
        }
    }
    async modifyPosition(positionId, stopLoss, takeProfit) {
        try {
            const position = this.positions.get(positionId);
            if (!position) {
                throw new Error('Position not found');
            }
            if (stopLoss !== undefined) {
                position.stopLoss = stopLoss;
            }
            if (takeProfit !== undefined) {
                position.takeProfit = takeProfit;
            }
            this.notifySubscribers();
            return {
                success: true
            };
        } catch (error) {
            const handledError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$errorHandler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleTradingError"])(error.message, {
                positionId,
                stopLoss,
                takeProfit
            }, 'Live Trading - Modify Position');
            return {
                success: false,
                error: handledError.message
            };
        }
    }
    // Getters
    getAccount() {
        return {
            ...this.account
        };
    }
    getPositions() {
        return Array.from(this.positions.values());
    }
    getOrders() {
        return Array.from(this.orders.values()).sort((a, b)=>b.timestamp.getTime() - a.timestamp.getTime());
    }
    getSignals() {
        return [
            ...this.signals
        ];
    }
    isConnectedToServer() {
        return this.isConnected;
    }
    // Subscription methods
    subscribe(callback) {
        this.subscribers.add(callback);
        return ()=>this.subscribers.delete(callback);
    }
    subscribeToPrices(symbol, callback) {
        if (!this.priceSubscribers.has(symbol)) {
            this.priceSubscribers.set(symbol, new Set());
        }
        this.priceSubscribers.get(symbol).add(callback);
        return ()=>{
            const symbolSubscribers = this.priceSubscribers.get(symbol);
            if (symbolSubscribers) {
                symbolSubscribers.delete(callback);
                if (symbolSubscribers.size === 0) {
                    this.priceSubscribers.delete(symbol);
                }
            }
        };
    }
    constructor(){
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "account", void 0);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "positions", new Map());
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "orders", new Map());
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "signals", []);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "subscribers", new Set());
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "priceSubscribers", new Map());
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "isConnected", false);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "reconnectAttempts", 0);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "maxReconnectAttempts", 5);
        // Initialize demo account
        this.account = {
            id: 'demo-account-001',
            balance: 10000,
            equity: 10000,
            margin: 0,
            freeMargin: 10000,
            marginLevel: 0,
            currency: 'USD',
            leverage: 100
        };
        this.initializeConnection();
        this.startPriceUpdates();
        this.generateTradingSignals();
    }
}
// Singleton instance
const liveTradingService = new LiveTradingService();
const __TURBOPACK__default__export__ = liveTradingService;
function useLiveTrading() {
    _s();
    const [account, setAccount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(liveTradingService.getAccount());
    const [positions, setPositions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(liveTradingService.getPositions());
    const [orders, setOrders] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(liveTradingService.getOrders());
    const [signals, setSignals] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(liveTradingService.getSignals());
    const [isConnected, setIsConnected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(liveTradingService.isConnectedToServer());
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useLiveTrading.useEffect": ()=>{
            const unsubscribe = liveTradingService.subscribe({
                "useLiveTrading.useEffect.unsubscribe": ()=>{
                    setAccount(liveTradingService.getAccount());
                    setPositions(liveTradingService.getPositions());
                    setOrders(liveTradingService.getOrders());
                    setSignals(liveTradingService.getSignals());
                    setIsConnected(liveTradingService.isConnectedToServer());
                }
            }["useLiveTrading.useEffect.unsubscribe"]);
            return unsubscribe;
        }
    }["useLiveTrading.useEffect"], []);
    const placeOrder = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useLiveTrading.useCallback[placeOrder]": async (orderRequest)=>{
            return await liveTradingService.placeOrder(orderRequest);
        }
    }["useLiveTrading.useCallback[placeOrder]"], []);
    const closePosition = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useLiveTrading.useCallback[closePosition]": async (positionId)=>{
            return await liveTradingService.closePosition(positionId);
        }
    }["useLiveTrading.useCallback[closePosition]"], []);
    const modifyPosition = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useLiveTrading.useCallback[modifyPosition]": async (positionId, stopLoss, takeProfit)=>{
            return await liveTradingService.modifyPosition(positionId, stopLoss, takeProfit);
        }
    }["useLiveTrading.useCallback[modifyPosition]"], []);
    return {
        account,
        positions,
        orders,
        signals,
        isConnected,
        placeOrder,
        closePosition,
        modifyPosition
    };
}
_s(useLiveTrading, "O1x9OkYOQAwipsOjz14flaO+lAE=");
function useLivePrice(symbol) {
    _s1();
    const [price, setPrice] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useLivePrice.useEffect": ()=>{
            const unsubscribe = liveTradingService.subscribeToPrices(symbol, setPrice);
            return unsubscribe;
        }
    }["useLivePrice.useEffect"], [
        symbol
    ]);
    return price;
}
_s1(useLivePrice, "iFUZSRAb9ibYi8LU9CUAlPfDQ9Y=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_services_a10effa5._.js.map