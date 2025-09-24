(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/trading/OptionsTrading.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calculator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calculator$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/calculator.js [app-client] (ecmascript) <export default as Calculator>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$target$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Target$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/target.js [app-client] (ecmascript) <export default as Target>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield.js [app-client] (ecmascript) <export default as Shield>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bar$2d$chart$2d$3$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bar-chart-3.js [app-client] (ecmascript) <export default as BarChart3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const OptionsTrading = ()=>{
    _s();
    const [optionChain, setOptionChain] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [positions, setPositions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedUnderlying, setSelectedUnderlying] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('AAPL');
    const [selectedExpiry, setSelectedExpiry] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('2024-02-16');
    const [selectedTab, setSelectedTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('chain');
    const [underlyingPrice, setUnderlyingPrice] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(192.85);
    const [accountBalance, setAccountBalance] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(50000);
    const [selectedStrategy, setSelectedStrategy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [showGreeks, setShowGreeks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [executingStrategy, setExecutingStrategy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showOrderModal, setShowOrderModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedOption, setSelectedOption] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [orderForm, setOrderForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        side: 'BUY',
        quantity: 1,
        orderType: 'MARKET',
        price: 0
    });
    // Custom strategy builder state
    const [showStrategyBuilder, setShowStrategyBuilder] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [customStrategy, setCustomStrategy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        name: '',
        description: '',
        legs: []
    });
    // Strategy templates
    const strategyTemplates = [
        {
            id: 'long-call',
            name: 'Long Call',
            description: 'Bullish strategy with unlimited upside potential',
            legs: [
                {
                    type: 'CALL',
                    side: 'BUY',
                    strike: 195,
                    quantity: 1
                }
            ],
            maxProfit: null,
            maxLoss: 500,
            breakeven: [
                195.5
            ]
        },
        {
            id: 'long-put',
            name: 'Long Put',
            description: 'Bearish strategy with high profit potential',
            legs: [
                {
                    type: 'PUT',
                    side: 'BUY',
                    strike: 190,
                    quantity: 1
                }
            ],
            maxProfit: 18500,
            maxLoss: 450,
            breakeven: [
                185.5
            ]
        },
        {
            id: 'covered-call',
            name: 'Covered Call',
            description: 'Generate income from stock holdings',
            legs: [
                {
                    type: 'CALL',
                    side: 'SELL',
                    strike: 200,
                    quantity: 1
                }
            ],
            maxProfit: 1200,
            maxLoss: null,
            breakeven: [
                191.8
            ]
        },
        {
            id: 'bull-call-spread',
            name: 'Bull Call Spread',
            description: 'Limited risk, limited reward bullish strategy',
            legs: [
                {
                    type: 'CALL',
                    side: 'BUY',
                    strike: 190,
                    quantity: 1
                },
                {
                    type: 'CALL',
                    side: 'SELL',
                    strike: 200,
                    quantity: 1
                }
            ],
            maxProfit: 800,
            maxLoss: 200,
            breakeven: [
                192
            ]
        },
        {
            id: 'iron-condor',
            name: 'Iron Condor',
            description: 'Neutral strategy for range-bound markets',
            legs: [
                {
                    type: 'PUT',
                    side: 'SELL',
                    strike: 185,
                    quantity: 1
                },
                {
                    type: 'PUT',
                    side: 'BUY',
                    strike: 180,
                    quantity: 1
                },
                {
                    type: 'CALL',
                    side: 'SELL',
                    strike: 200,
                    quantity: 1
                },
                {
                    type: 'CALL',
                    side: 'BUY',
                    strike: 205,
                    quantity: 1
                }
            ],
            maxProfit: 300,
            maxLoss: 200,
            breakeven: [
                187,
                198
            ]
        },
        {
            id: 'straddle',
            name: 'Long Straddle',
            description: 'Profit from high volatility in either direction',
            legs: [
                {
                    type: 'CALL',
                    side: 'BUY',
                    strike: 195,
                    quantity: 1
                },
                {
                    type: 'PUT',
                    side: 'BUY',
                    strike: 195,
                    quantity: 1
                }
            ],
            maxProfit: null,
            maxLoss: 950,
            breakeven: [
                185.5,
                204.5
            ]
        }
    ];
    // Mock option chain data
    const generateOptionChain = (underlying, underlyingPrice, expiry)=>{
        const strikes = [];
        const baseStrike = Math.round(underlyingPrice / 5) * 5;
        for(let i = -10; i <= 10; i++){
            strikes.push(baseStrike + i * 5);
        }
        const options = [];
        const daysToExpiry = Math.max(1, Math.ceil((new Date(expiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
        const timeToExpiry = daysToExpiry / 365;
        strikes.forEach((strike, index)=>{
            // Calculate basic Greeks and pricing (simplified Black-Scholes approximation)
            const moneyness = underlyingPrice / strike;
            const isITM = (type)=>type === 'CALL' ? underlyingPrice > strike : underlyingPrice < strike;
            // Call option
            const callIntrinsic = Math.max(0, underlyingPrice - strike);
            const callTimeValue = Math.max(0.05, Math.sqrt(timeToExpiry) * Math.abs(underlyingPrice - strike) * 0.2);
            const callPrice = callIntrinsic + callTimeValue;
            const callDelta = moneyness > 1 ? 0.7 - (moneyness - 1) * 0.3 : 0.3 + (moneyness - 0.8) * 0.4;
            options.push({
                id: "".concat(underlying, "-").concat(strike, "-").concat(expiry, "-CALL"),
                symbol: "".concat(underlying).concat(expiry.replace(/-/g, ''), "C").concat(strike),
                underlying,
                strike,
                expiry,
                type: 'CALL',
                bid: callPrice - 0.05,
                ask: callPrice + 0.05,
                lastPrice: callPrice,
                volume: Math.floor(Math.random() * 1000) + 100,
                openInterest: Math.floor(Math.random() * 5000) + 500,
                impliedVolatility: 0.15 + Math.random() * 0.3,
                delta: Math.max(0.01, Math.min(0.99, callDelta)),
                gamma: 0.01 + Math.random() * 0.05,
                theta: -(0.01 + Math.random() * 0.05),
                vega: 0.05 + Math.random() * 0.15,
                rho: 0.01 + Math.random() * 0.03,
                intrinsicValue: callIntrinsic,
                timeValue: callTimeValue
            });
            // Put option
            const putIntrinsic = Math.max(0, strike - underlyingPrice);
            const putTimeValue = Math.max(0.05, Math.sqrt(timeToExpiry) * Math.abs(strike - underlyingPrice) * 0.2);
            const putPrice = putIntrinsic + putTimeValue;
            const putDelta = -(1 - Math.max(0.01, Math.min(0.99, callDelta)));
            options.push({
                id: "".concat(underlying, "-").concat(strike, "-").concat(expiry, "-PUT"),
                symbol: "".concat(underlying).concat(expiry.replace(/-/g, ''), "P").concat(strike),
                underlying,
                strike,
                expiry,
                type: 'PUT',
                bid: putPrice - 0.05,
                ask: putPrice + 0.05,
                lastPrice: putPrice,
                volume: Math.floor(Math.random() * 1000) + 100,
                openInterest: Math.floor(Math.random() * 5000) + 500,
                impliedVolatility: 0.15 + Math.random() * 0.3,
                delta: putDelta,
                gamma: 0.01 + Math.random() * 0.05,
                theta: -(0.01 + Math.random() * 0.05),
                vega: 0.05 + Math.random() * 0.15,
                rho: -(0.01 + Math.random() * 0.03),
                intrinsicValue: putIntrinsic,
                timeValue: putTimeValue
            });
        });
        return options;
    };
    // Mock positions
    const mockPositions = [
        {
            id: '1',
            contractId: 'AAPL-195-2024-02-16-CALL',
            symbol: 'AAPL240216C195',
            underlying: 'AAPL',
            strike: 195,
            expiry: '2024-02-16',
            type: 'CALL',
            side: 'BUY',
            quantity: 2,
            entryPrice: 4.50,
            currentPrice: 5.20,
            unrealizedPnL: 140,
            delta: 0.65,
            gamma: 0.03,
            theta: -0.02,
            vega: 0.08,
            openTime: '2024-01-15T10:30:00Z'
        },
        {
            id: '2',
            contractId: 'AAPL-190-2024-02-16-PUT',
            symbol: 'AAPL240216P190',
            underlying: 'AAPL',
            strike: 190,
            expiry: '2024-02-16',
            type: 'PUT',
            side: 'SELL',
            quantity: 1,
            entryPrice: 3.20,
            currentPrice: 2.80,
            unrealizedPnL: 40,
            delta: -0.35,
            gamma: 0.02,
            theta: 0.015,
            vega: -0.06,
            openTime: '2024-01-15T14:20:00Z'
        }
    ];
    // Initialize data
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "OptionsTrading.useEffect": ()=>{
            const chain = generateOptionChain(selectedUnderlying, underlyingPrice, selectedExpiry);
            setOptionChain(chain);
            setPositions(mockPositions);
        }
    }["OptionsTrading.useEffect"], [
        selectedUnderlying,
        selectedExpiry,
        underlyingPrice
    ]);
    // Calculate portfolio Greeks
    const calculatePortfolioGreeks = ()=>{
        return positions.reduce((acc, pos)=>{
            const multiplier = pos.side === 'BUY' ? pos.quantity : -pos.quantity;
            return {
                delta: acc.delta + pos.delta * multiplier * 100,
                gamma: acc.gamma + pos.gamma * multiplier * 100,
                theta: acc.theta + pos.theta * multiplier * 100,
                vega: acc.vega + pos.vega * multiplier * 100
            };
        }, {
            delta: 0,
            gamma: 0,
            theta: 0,
            vega: 0
        });
    };
    // Calculate portfolio risk metrics
    const calculatePortfolioRisk = ()=>{
        const portfolioValue = positions.reduce((sum, pos)=>sum + Math.abs(pos.unrealizedPnL), 0);
        const totalPnL = positions.reduce((sum, pos)=>sum + pos.unrealizedPnL, 0);
        const portfolioGreeks = calculatePortfolioGreeks();
        return {
            totalValue: portfolioValue,
            totalPnL: totalPnL,
            pnlPercentage: portfolioValue > 0 ? totalPnL / portfolioValue * 100 : 0,
            maxRisk: Math.abs(portfolioGreeks.delta * 10) + Math.abs(portfolioGreeks.gamma * 100),
            riskPercentage: accountBalance > 0 ? (Math.abs(portfolioGreeks.delta * 10) + Math.abs(portfolioGreeks.gamma * 100)) / accountBalance * 100 : 0
        };
    };
    // Format number with appropriate decimals
    const formatNumber = function(num) {
        let decimals = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 2;
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(num);
    };
    // Handle individual option order
    const handleOptionOrder = (option, side)=>{
        setSelectedOption(option);
        setOrderForm({
            side,
            quantity: 1,
            orderType: 'MARKET',
            limitPrice: side === 'BUY' ? option.ask : option.bid
        });
        setShowOrderModal(true);
    };
    // Execute individual option order
    const executeOptionOrder = ()=>{
        if (!selectedOption) return;
        const orderPrice = orderForm.orderType === 'MARKET' ? orderForm.side === 'BUY' ? selectedOption.ask : selectedOption.bid : orderForm.limitPrice;
        const orderCost = orderPrice * orderForm.quantity * 100;
        // Risk management checks
        const portfolioRisk = calculatePortfolioRisk();
        const positionRisk = Math.abs(selectedOption.delta * orderForm.quantity * 100 * 10);
        const newTotalRisk = portfolioRisk.maxRisk + positionRisk;
        const riskLimit = accountBalance * 0.2; // 20% risk limit
        if (orderForm.side === 'BUY' && orderCost > accountBalance) {
            alert('Insufficient funds for this order');
            return;
        }
        if (newTotalRisk > riskLimit) {
            alert("Order exceeds risk limit. Current risk: $".concat(portfolioRisk.maxRisk.toFixed(2), ", New risk: $").concat(newTotalRisk.toFixed(2), ", Limit: $").concat(riskLimit.toFixed(2)));
            return;
        }
        // Position sizing recommendation
        const maxQuantity = Math.floor(riskLimit / positionRisk);
        if (orderForm.quantity > maxQuantity && maxQuantity > 0) {
            if (!confirm("Recommended max quantity: ".concat(maxQuantity, ". Continue with ").concat(orderForm.quantity, "?"))) {
                return;
            }
        }
        // Create new position
        const newPosition = {
            id: "pos-".concat(Date.now()),
            contractId: selectedOption.id,
            symbol: selectedOption.symbol,
            underlying: selectedOption.underlying,
            strike: selectedOption.strike,
            expiry: selectedOption.expiry,
            type: selectedOption.type,
            side: orderForm.side,
            quantity: orderForm.quantity,
            entryPrice: orderPrice,
            currentPrice: selectedOption.lastPrice,
            unrealizedPnL: orderForm.side === 'BUY' ? (selectedOption.lastPrice - orderPrice) * orderForm.quantity * 100 : (orderPrice - selectedOption.lastPrice) * orderForm.quantity * 100,
            delta: selectedOption.delta,
            gamma: selectedOption.gamma,
            theta: selectedOption.theta,
            vega: selectedOption.vega,
            openTime: new Date().toISOString()
        };
        setPositions((prev)=>[
                ...prev,
                newPosition
            ]);
        // Update account balance
        if (orderForm.side === 'BUY') {
            setAccountBalance((prev)=>prev - orderCost);
        } else {
            setAccountBalance((prev)=>prev + orderCost);
        }
        // Close modal and reset form
        setShowOrderModal(false);
        setSelectedOption(null);
        setOrderForm({
            side: 'BUY',
            quantity: 1,
            orderType: 'MARKET',
            limitPrice: 0
        });
        alert("Order executed: ".concat(orderForm.side, " ").concat(orderForm.quantity, " ").concat(selectedOption.symbol, " @ $").concat(orderPrice.toFixed(2)));
    };
    // Close position function
    const closePosition = (position)=>{
        // Calculate closing cost (opposite side of original position)
        const closingSide = position.side === 'BUY' ? 'SELL' : 'BUY';
        const closingPrice = position.currentPrice;
        const closingCost = closingPrice * position.quantity * 100;
        // Calculate realized P&L
        const realizedPnL = position.side === 'BUY' ? (closingPrice - position.entryPrice) * position.quantity * 100 : (position.entryPrice - closingPrice) * position.quantity * 100;
        // Update account balance with realized P&L
        setAccountBalance((prev)=>prev + realizedPnL + (position.side === 'BUY' ? closingCost : -closingCost));
        // Remove position from positions array
        setPositions((prev)=>prev.filter((pos)=>pos.id !== position.id));
        alert("Position closed: ".concat(realizedPnL >= 0 ? 'Profit' : 'Loss', " of $").concat(Math.abs(realizedPnL).toFixed(2)));
    };
    // Custom strategy builder functions
    const addStrategyLeg = ()=>{
        setCustomStrategy((prev)=>({
                ...prev,
                legs: [
                    ...prev.legs,
                    {
                        type: 'CALL',
                        side: 'BUY',
                        strike: underlyingPrice,
                        quantity: 1
                    }
                ]
            }));
    };
    const removeStrategyLeg = (index)=>{
        setCustomStrategy((prev)=>({
                ...prev,
                legs: prev.legs.filter((_, i)=>i !== index)
            }));
    };
    const updateStrategyLeg = (index, field, value)=>{
        setCustomStrategy((prev)=>({
                ...prev,
                legs: prev.legs.map((leg, i)=>i === index ? {
                        ...leg,
                        [field]: value
                    } : leg)
            }));
    };
    const saveCustomStrategy = ()=>{
        if (!customStrategy.name || customStrategy.legs.length === 0) {
            alert('Please provide a strategy name and at least one leg');
            return;
        }
        const newStrategy = {
            id: "custom_".concat(Date.now()),
            name: customStrategy.name,
            description: customStrategy.description,
            legs: customStrategy.legs,
            maxProfit: null,
            maxLoss: null,
            breakeven: [] // Could be calculated based on strategy type
        };
        setStrategyTemplates((prev)=>[
                ...prev,
                newStrategy
            ]);
        setShowStrategyBuilder(false);
        setCustomStrategy({
            name: '',
            description: '',
            legs: []
        });
        alert('Custom strategy saved successfully!');
    };
    const executeStrategy = async (strategy)=>{
        setExecutingStrategy(strategy.id);
        try {
            // Simulate strategy execution
            const newPositions = strategy.legs.map((leg, index)=>{
                const contractId = "".concat(selectedUnderlying, "-").concat(leg.strike, "-").concat(leg.type, "-").concat(selectedExpiry);
                const currentPrice = leg.type === 'CALL' ? Math.max(0, underlyingPrice - leg.strike) + (Math.random() * 2 + 1) : Math.max(0, leg.strike - underlyingPrice) + (Math.random() * 2 + 1);
                const entryPrice = currentPrice + (leg.side === 'BUY' ? 0.05 : -0.05);
                const unrealizedPnL = leg.side === 'BUY' ? (currentPrice - entryPrice) * leg.quantity * 100 : (entryPrice - currentPrice) * leg.quantity * 100;
                return {
                    id: "pos-".concat(Date.now(), "-").concat(index),
                    contractId,
                    symbol: "".concat(selectedUnderlying, " ").concat(new Date(selectedExpiry).toLocaleDateString(), " ").concat(leg.strike, " ").concat(leg.type),
                    underlying: selectedUnderlying,
                    strike: leg.strike,
                    expiry: selectedExpiry,
                    type: leg.type,
                    side: leg.side,
                    quantity: leg.quantity,
                    entryPrice,
                    currentPrice,
                    unrealizedPnL,
                    delta: leg.type === 'CALL' ? 0.5 + Math.random() * 0.3 : -0.5 - Math.random() * 0.3,
                    gamma: Math.random() * 0.1,
                    theta: -Math.random() * 0.05,
                    vega: Math.random() * 0.2,
                    openTime: new Date().toISOString()
                };
            });
            // Add positions to the portfolio
            setPositions((prev)=>[
                    ...prev,
                    ...newPositions
                ]);
            // Update account balance (simulate cost)
            const totalCost = newPositions.reduce((sum, pos)=>{
                return sum + (pos.side === 'BUY' ? pos.entryPrice * pos.quantity * 100 : 0);
            }, 0);
            setAccountBalance((prev)=>prev - totalCost);
            // Switch to positions tab to show the executed strategy
            setSelectedTab('positions');
            // Show success message (you could add a toast notification here)
            console.log("Successfully executed ".concat(strategy.name, " strategy"));
        } catch (error) {
            console.error('Error executing strategy:', error);
        } finally{
            setExecutingStrategy(null);
        }
    };
    // Get moneyness color
    const getMoneynessColor = (option)=>{
        const isITM = option.type === 'CALL' ? underlyingPrice > option.strike : underlyingPrice < option.strike;
        if (isITM) return 'bg-green-50 dark:bg-green-900/20';
        if (Math.abs(underlyingPrice - option.strike) <= 5) return 'bg-yellow-50 dark:bg-yellow-900/20';
        return 'bg-gray-50 dark:bg-gray-900/20';
    };
    // Group options by strike
    const groupedOptions = optionChain.reduce((acc, option)=>{
        if (!acc[option.strike]) {
            acc[option.strike] = {
                calls: [],
                puts: []
            };
        }
        if (option.type === 'CALL') {
            acc[option.strike].calls.push(option);
        } else {
            acc[option.strike].puts.push(option);
        }
        return acc;
    }, {});
    const strikes = Object.keys(groupedOptions).map(Number).sort((a, b)=>a - b);
    const portfolioGreeks = calculatePortfolioGreeks();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center space-x-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calculator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calculator$3e$__["Calculator"], {
                                className: "h-6 w-6 text-blue-600"
                            }, void 0, false, {
                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                lineNumber: 575,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-2xl font-bold text-gray-900 dark:text-white",
                                children: "Options Trading"
                            }, void 0, false, {
                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                lineNumber: 576,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                        lineNumber: 574,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center space-x-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-sm text-gray-500 dark:text-gray-400",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        "Account Balance: ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-semibold text-gray-900 dark:text-white",
                                            children: [
                                                "$",
                                                formatNumber(accountBalance)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/trading/OptionsTrading.tsx",
                                            lineNumber: 583,
                                            columnNumber: 35
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/trading/OptionsTrading.tsx",
                                    lineNumber: 583,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        selectedUnderlying,
                                        ": ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-semibold text-gray-900 dark:text-white",
                                            children: [
                                                "$",
                                                formatNumber(underlyingPrice)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/trading/OptionsTrading.tsx",
                                            lineNumber: 584,
                                            columnNumber: 40
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/trading/OptionsTrading.tsx",
                                    lineNumber: 584,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/trading/OptionsTrading.tsx",
                            lineNumber: 582,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                        lineNumber: 581,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/components/trading/OptionsTrading.tsx",
                lineNumber: 573,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg shadow p-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center space-x-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1",
                                        children: "Underlying"
                                    }, void 0, false, {
                                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                                        lineNumber: 593,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: selectedUnderlying,
                                        onChange: (e)=>setSelectedUnderlying(e.target.value),
                                        className: "border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "AAPL",
                                                children: "AAPL"
                                            }, void 0, false, {
                                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                lineNumber: 601,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "TSLA",
                                                children: "TSLA"
                                            }, void 0, false, {
                                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                lineNumber: 602,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "MSFT",
                                                children: "MSFT"
                                            }, void 0, false, {
                                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                lineNumber: 603,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "GOOGL",
                                                children: "GOOGL"
                                            }, void 0, false, {
                                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                lineNumber: 604,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "AMZN",
                                                children: "AMZN"
                                            }, void 0, false, {
                                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                lineNumber: 605,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                                        lineNumber: 596,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                lineNumber: 592,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1",
                                        children: "Expiration"
                                    }, void 0, false, {
                                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                                        lineNumber: 610,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: selectedExpiry,
                                        onChange: (e)=>setSelectedExpiry(e.target.value),
                                        className: "border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "2024-02-16",
                                                children: "Feb 16, 2024"
                                            }, void 0, false, {
                                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                lineNumber: 618,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "2024-03-15",
                                                children: "Mar 15, 2024"
                                            }, void 0, false, {
                                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                lineNumber: 619,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "2024-04-19",
                                                children: "Apr 19, 2024"
                                            }, void 0, false, {
                                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                lineNumber: 620,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "2024-06-21",
                                                children: "Jun 21, 2024"
                                            }, void 0, false, {
                                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                lineNumber: 621,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                                        lineNumber: 613,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                lineNumber: 609,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                        lineNumber: 591,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center space-x-3",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: "flex items-center space-x-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "checkbox",
                                    checked: showGreeks,
                                    onChange: (e)=>setShowGreeks(e.target.checked),
                                    className: "h-4 w-4 text-blue-600 border-gray-300 rounded"
                                }, void 0, false, {
                                    fileName: "[project]/components/trading/OptionsTrading.tsx",
                                    lineNumber: 628,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-sm text-gray-700 dark:text-gray-300",
                                    children: "Show Greeks"
                                }, void 0, false, {
                                    fileName: "[project]/components/trading/OptionsTrading.tsx",
                                    lineNumber: 634,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/trading/OptionsTrading.tsx",
                            lineNumber: 627,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                        lineNumber: 626,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/components/trading/OptionsTrading.tsx",
                lineNumber: 590,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            positions.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white dark:bg-gray-800 rounded-lg shadow p-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-lg font-semibold text-gray-900 dark:text-white mb-3",
                        children: "Portfolio Greeks"
                    }, void 0, false, {
                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                        lineNumber: 642,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-2 md:grid-cols-4 gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-2xl font-bold text-blue-600",
                                        children: formatNumber(portfolioGreeks.delta)
                                    }, void 0, false, {
                                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                                        lineNumber: 647,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-sm text-gray-500 dark:text-gray-400",
                                        children: "Delta"
                                    }, void 0, false, {
                                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                                        lineNumber: 648,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                lineNumber: 646,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-2xl font-bold text-green-600",
                                        children: formatNumber(portfolioGreeks.gamma)
                                    }, void 0, false, {
                                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                                        lineNumber: 651,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-sm text-gray-500 dark:text-gray-400",
                                        children: "Gamma"
                                    }, void 0, false, {
                                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                                        lineNumber: 652,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                lineNumber: 650,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-2xl font-bold text-red-600",
                                        children: formatNumber(portfolioGreeks.theta)
                                    }, void 0, false, {
                                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                                        lineNumber: 655,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-sm text-gray-500 dark:text-gray-400",
                                        children: "Theta"
                                    }, void 0, false, {
                                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                                        lineNumber: 656,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                lineNumber: 654,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-2xl font-bold text-purple-600",
                                        children: formatNumber(portfolioGreeks.vega)
                                    }, void 0, false, {
                                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                                        lineNumber: 659,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-sm text-gray-500 dark:text-gray-400",
                                        children: "Vega"
                                    }, void 0, false, {
                                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                                        lineNumber: 660,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                lineNumber: 658,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                        lineNumber: 645,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/components/trading/OptionsTrading.tsx",
                lineNumber: 641,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "border-b border-gray-200 dark:border-gray-700",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                    className: "flex space-x-8",
                    children: [
                        {
                            id: 'chain',
                            label: 'Option Chain',
                            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bar$2d$chart$2d$3$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__["BarChart3"]
                        },
                        {
                            id: 'positions',
                            label: 'Positions',
                            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"]
                        },
                        {
                            id: 'strategies',
                            label: 'Strategies',
                            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$target$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Target$3e$__["Target"]
                        }
                    ].map((param)=>{
                        let { id, label, icon: Icon } = param;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setSelectedTab(id),
                            className: "flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ".concat(selectedTab === id ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                    className: "h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/components/trading/OptionsTrading.tsx",
                                    lineNumber: 683,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: label
                                }, void 0, false, {
                                    fileName: "[project]/components/trading/OptionsTrading.tsx",
                                    lineNumber: 684,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, id, true, {
                            fileName: "[project]/components/trading/OptionsTrading.tsx",
                            lineNumber: 674,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0));
                    })
                }, void 0, false, {
                    fileName: "[project]/components/trading/OptionsTrading.tsx",
                    lineNumber: 668,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/components/trading/OptionsTrading.tsx",
                lineNumber: 667,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            selectedTab === 'chain' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "overflow-x-auto",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                        className: "w-full",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                className: "bg-gray-50 dark:bg-gray-700",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                colSpan: showGreeks ? 9 : 5,
                                                className: "px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600",
                                                children: "Calls"
                                            }, void 0, false, {
                                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                lineNumber: 697,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider",
                                                children: "Strike"
                                            }, void 0, false, {
                                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                lineNumber: 700,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                colSpan: showGreeks ? 9 : 5,
                                                className: "px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-l border-gray-200 dark:border-gray-600",
                                                children: "Puts"
                                            }, void 0, false, {
                                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                lineNumber: 703,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                                        lineNumber: 696,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-2 py-2 text-xs font-medium text-gray-500 dark:text-gray-400",
                                                children: "Bid"
                                            }, void 0, false, {
                                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                lineNumber: 708,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-2 py-2 text-xs font-medium text-gray-500 dark:text-gray-400",
                                                children: "Ask"
                                            }, void 0, false, {
                                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                lineNumber: 709,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-2 py-2 text-xs font-medium text-gray-500 dark:text-gray-400",
                                                children: "Last"
                                            }, void 0, false, {
                                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                lineNumber: 710,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-2 py-2 text-xs font-medium text-gray-500 dark:text-gray-400",
                                                children: "Vol"
                                            }, void 0, false, {
                                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                lineNumber: 711,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            showGreeks && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "px-2 py-2 text-xs font-medium text-gray-500 dark:text-gray-400",
                                                        children: "Δ"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                        lineNumber: 714,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "px-2 py-2 text-xs font-medium text-gray-500 dark:text-gray-400",
                                                        children: "Γ"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                        lineNumber: 715,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "px-2 py-2 text-xs font-medium text-gray-500 dark:text-gray-400",
                                                        children: "Θ"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                        lineNumber: 716,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "px-2 py-2 text-xs font-medium text-gray-500 dark:text-gray-400",
                                                        children: "ν"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                        lineNumber: 717,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "px-2 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-gray-600",
                                                        children: "Action"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                        lineNumber: 718,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400",
                                                children: "Strike"
                                            }, void 0, false, {
                                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                lineNumber: 721,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-2 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 border-l border-gray-200 dark:border-gray-600",
                                                children: "Bid"
                                            }, void 0, false, {
                                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                lineNumber: 722,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-2 py-2 text-xs font-medium text-gray-500 dark:text-gray-400",
                                                children: "Ask"
                                            }, void 0, false, {
                                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                lineNumber: 723,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-2 py-2 text-xs font-medium text-gray-500 dark:text-gray-400",
                                                children: "Last"
                                            }, void 0, false, {
                                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                lineNumber: 724,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-2 py-2 text-xs font-medium text-gray-500 dark:text-gray-400",
                                                children: "Vol"
                                            }, void 0, false, {
                                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                lineNumber: 725,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            showGreeks && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "px-2 py-2 text-xs font-medium text-gray-500 dark:text-gray-400",
                                                        children: "Δ"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                        lineNumber: 728,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "px-2 py-2 text-xs font-medium text-gray-500 dark:text-gray-400",
                                                        children: "Γ"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                        lineNumber: 729,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "px-2 py-2 text-xs font-medium text-gray-500 dark:text-gray-400",
                                                        children: "Θ"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                        lineNumber: 730,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "px-2 py-2 text-xs font-medium text-gray-500 dark:text-gray-400",
                                                        children: "ν"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                        lineNumber: 731,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-2 py-2 text-xs font-medium text-gray-500 dark:text-gray-400",
                                                children: "Action"
                                            }, void 0, false, {
                                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                lineNumber: 734,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                                        lineNumber: 707,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                lineNumber: 695,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                className: "bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700",
                                children: strikes.map((strike)=>{
                                    var _groupedOptions_strike, _groupedOptions_strike1;
                                    const callOption = (_groupedOptions_strike = groupedOptions[strike]) === null || _groupedOptions_strike === void 0 ? void 0 : _groupedOptions_strike.calls[0];
                                    const putOption = (_groupedOptions_strike1 = groupedOptions[strike]) === null || _groupedOptions_strike1 === void 0 ? void 0 : _groupedOptions_strike1.puts[0];
                                    const isATM = Math.abs(underlyingPrice - strike) <= 2.5;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        className: "hover:bg-gray-50 dark:hover:bg-gray-700 ".concat(isATM ? 'bg-blue-50 dark:bg-blue-900/20' : getMoneynessColor(callOption || putOption)),
                                        children: [
                                            callOption ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-2 py-2 text-sm text-gray-900 dark:text-white",
                                                        children: formatNumber(callOption.bid)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                        lineNumber: 750,
                                                        columnNumber: 27
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-2 py-2 text-sm text-gray-900 dark:text-white",
                                                        children: formatNumber(callOption.ask)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                        lineNumber: 751,
                                                        columnNumber: 27
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-2 py-2 text-sm font-medium text-gray-900 dark:text-white",
                                                        children: formatNumber(callOption.lastPrice)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                        lineNumber: 752,
                                                        columnNumber: 27
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-2 py-2 text-sm text-gray-500 dark:text-gray-400",
                                                        children: callOption.volume
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                        lineNumber: 753,
                                                        columnNumber: 27
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    showGreeks && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "px-2 py-2 text-sm text-gray-900 dark:text-white",
                                                                children: formatNumber(callOption.delta, 3)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                                lineNumber: 756,
                                                                columnNumber: 31
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "px-2 py-2 text-sm text-gray-900 dark:text-white",
                                                                children: formatNumber(callOption.gamma, 3)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                                lineNumber: 757,
                                                                columnNumber: 31
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "px-2 py-2 text-sm text-red-600",
                                                                children: formatNumber(callOption.theta, 3)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                                lineNumber: 758,
                                                                columnNumber: 31
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "px-2 py-2 text-sm text-gray-900 dark:text-white",
                                                                children: formatNumber(callOption.vega, 3)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                                lineNumber: 759,
                                                                columnNumber: 31
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-2 py-2 border-r border-gray-200 dark:border-gray-600",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex space-x-1",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>handleOptionOrder(callOption, 'BUY'),
                                                                    className: "px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700",
                                                                    children: "Buy"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                                    lineNumber: 764,
                                                                    columnNumber: 31
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>handleOptionOrder(callOption, 'SELL'),
                                                                    className: "px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700",
                                                                    children: "Sell"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                                    lineNumber: 770,
                                                                    columnNumber: 31
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                            lineNumber: 763,
                                                            columnNumber: 29
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                        lineNumber: 762,
                                                        columnNumber: 27
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    colSpan: showGreeks ? 9 : 5,
                                                    className: "px-2 py-2 border-r border-gray-200 dark:border-gray-600"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                    lineNumber: 781,
                                                    columnNumber: 27
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-4 py-2 text-sm font-bold text-center ".concat(isATM ? 'text-blue-600' : 'text-gray-900 dark:text-white'),
                                                children: strike
                                            }, void 0, false, {
                                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                lineNumber: 786,
                                                columnNumber: 23
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            putOption ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-2 py-2 text-sm text-gray-900 dark:text-white border-l border-gray-200 dark:border-gray-600",
                                                        children: formatNumber(putOption.bid)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                        lineNumber: 795,
                                                        columnNumber: 27
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-2 py-2 text-sm text-gray-900 dark:text-white",
                                                        children: formatNumber(putOption.ask)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                        lineNumber: 796,
                                                        columnNumber: 27
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-2 py-2 text-sm font-medium text-gray-900 dark:text-white",
                                                        children: formatNumber(putOption.lastPrice)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                        lineNumber: 797,
                                                        columnNumber: 27
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-2 py-2 text-sm text-gray-500 dark:text-gray-400",
                                                        children: putOption.volume
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                        lineNumber: 798,
                                                        columnNumber: 27
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    showGreeks && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "px-2 py-2 text-sm text-gray-900 dark:text-white",
                                                                children: formatNumber(putOption.delta, 3)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                                lineNumber: 801,
                                                                columnNumber: 31
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "px-2 py-2 text-sm text-gray-900 dark:text-white",
                                                                children: formatNumber(putOption.gamma, 3)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                                lineNumber: 802,
                                                                columnNumber: 31
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "px-2 py-2 text-sm text-red-600",
                                                                children: formatNumber(putOption.theta, 3)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                                lineNumber: 803,
                                                                columnNumber: 31
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "px-2 py-2 text-sm text-gray-900 dark:text-white",
                                                                children: formatNumber(putOption.vega, 3)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                                lineNumber: 804,
                                                                columnNumber: 31
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-2 py-2",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex space-x-1",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>handleOptionOrder(putOption, 'BUY'),
                                                                    className: "px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700",
                                                                    children: "Buy"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                                    lineNumber: 809,
                                                                    columnNumber: 31
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>handleOptionOrder(putOption, 'SELL'),
                                                                    className: "px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700",
                                                                    children: "Sell"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                                    lineNumber: 815,
                                                                    columnNumber: 31
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                            lineNumber: 808,
                                                            columnNumber: 29
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                        lineNumber: 807,
                                                        columnNumber: 27
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    colSpan: showGreeks ? 9 : 5,
                                                    className: "px-2 py-2 border-l border-gray-200 dark:border-gray-600"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                    lineNumber: 826,
                                                    columnNumber: 27
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false)
                                        ]
                                    }, strike, true, {
                                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                                        lineNumber: 744,
                                        columnNumber: 21
                                    }, ("TURBOPACK compile-time value", void 0));
                                })
                            }, void 0, false, {
                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                lineNumber: 737,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                        lineNumber: 694,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/components/trading/OptionsTrading.tsx",
                    lineNumber: 693,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/components/trading/OptionsTrading.tsx",
                lineNumber: 692,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            selectedTab === 'positions' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bar$2d$chart$2d$3$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__["BarChart3"], {
                                className: "mr-2",
                                size: 20
                            }, void 0, false, {
                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                lineNumber: 842,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            "Portfolio Summary"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                        lineNumber: 841,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 md:grid-cols-4 gap-4 mb-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-gray-50 dark:bg-gray-700 p-4 rounded-lg",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-sm text-gray-600 dark:text-gray-400",
                                        children: "Account Balance"
                                    }, void 0, false, {
                                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                                        lineNumber: 848,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-2xl font-bold text-gray-900 dark:text-white",
                                        children: [
                                            "$",
                                            formatNumber(accountBalance)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                                        lineNumber: 849,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                lineNumber: 847,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-gray-50 dark:bg-gray-700 p-4 rounded-lg",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-sm text-gray-600 dark:text-gray-400",
                                        children: "Total P&L"
                                    }, void 0, false, {
                                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                                        lineNumber: 855,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-2xl font-bold ".concat(positions.reduce((sum, pos)=>sum + pos.unrealizedPnL, 0) >= 0 ? 'text-green-600' : 'text-red-600'),
                                        children: [
                                            "$",
                                            formatNumber(positions.reduce((sum, pos)=>sum + pos.unrealizedPnL, 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                                        lineNumber: 856,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                lineNumber: 854,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-gray-50 dark:bg-gray-700 p-4 rounded-lg",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-sm text-gray-600 dark:text-gray-400",
                                        children: "Open Positions"
                                    }, void 0, false, {
                                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                                        lineNumber: 866,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-2xl font-bold text-gray-900 dark:text-white",
                                        children: positions.length
                                    }, void 0, false, {
                                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                                        lineNumber: 867,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                lineNumber: 865,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-gray-50 dark:bg-gray-700 p-4 rounded-lg",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-sm text-gray-600 dark:text-gray-400",
                                        children: "Portfolio Delta"
                                    }, void 0, false, {
                                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                                        lineNumber: 873,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-2xl font-bold text-gray-900 dark:text-white",
                                        children: formatNumber(calculatePortfolioGreeks().delta, 2)
                                    }, void 0, false, {
                                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                                        lineNumber: 874,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                lineNumber: 872,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                        lineNumber: 846,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-3 flex items-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"], {
                                        className: "mr-2",
                                        size: 18
                                    }, void 0, false, {
                                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                                        lineNumber: 883,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    "Risk Management"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                lineNumber: 882,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 md:grid-cols-3 gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-sm text-yellow-700 dark:text-yellow-300",
                                                children: "Portfolio Risk"
                                            }, void 0, false, {
                                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                lineNumber: 888,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xl font-bold text-yellow-800 dark:text-yellow-200",
                                                children: [
                                                    "$",
                                                    formatNumber(calculatePortfolioRisk().maxRisk)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                lineNumber: 889,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xs text-yellow-600 dark:text-yellow-400",
                                                children: [
                                                    formatNumber(calculatePortfolioRisk().riskPercentage, 1),
                                                    "% of account"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                lineNumber: 892,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                                        lineNumber: 887,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-sm text-yellow-700 dark:text-yellow-300",
                                                children: "Risk Limit"
                                            }, void 0, false, {
                                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                lineNumber: 897,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xl font-bold text-yellow-800 dark:text-yellow-200",
                                                children: [
                                                    "$",
                                                    formatNumber(accountBalance * 0.2)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                lineNumber: 898,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xs text-yellow-600 dark:text-yellow-400",
                                                children: "20% of account balance"
                                            }, void 0, false, {
                                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                lineNumber: 901,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                                        lineNumber: 896,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-sm text-yellow-700 dark:text-yellow-300",
                                                children: "Available Risk"
                                            }, void 0, false, {
                                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                lineNumber: 906,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xl font-bold text-yellow-800 dark:text-yellow-200",
                                                children: [
                                                    "$",
                                                    formatNumber(Math.max(0, accountBalance * 0.2 - calculatePortfolioRisk().maxRisk))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                lineNumber: 907,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xs text-yellow-600 dark:text-yellow-400",
                                                children: "Remaining capacity"
                                            }, void 0, false, {
                                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                lineNumber: 910,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                                        lineNumber: 905,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                lineNumber: 886,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                        lineNumber: 881,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/components/trading/OptionsTrading.tsx",
                lineNumber: 840,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            selectedTab === 'positions' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white dark:bg-gray-800 rounded-lg shadow",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-4 border-b border-gray-200 dark:border-gray-700",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-lg font-semibold text-gray-900 dark:text-white",
                            children: "Option Positions"
                        }, void 0, false, {
                            fileName: "[project]/components/trading/OptionsTrading.tsx",
                            lineNumber: 923,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                        lineNumber: 922,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "overflow-x-auto",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                            className: "w-full",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                    className: "bg-gray-50 dark:bg-gray-700",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider",
                                                children: "Symbol"
                                            }, void 0, false, {
                                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                lineNumber: 932,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider",
                                                children: "Type"
                                            }, void 0, false, {
                                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                lineNumber: 935,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider",
                                                children: "Side"
                                            }, void 0, false, {
                                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                lineNumber: 938,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider",
                                                children: "Qty"
                                            }, void 0, false, {
                                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                lineNumber: 941,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider",
                                                children: "Entry"
                                            }, void 0, false, {
                                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                lineNumber: 944,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider",
                                                children: "Current"
                                            }, void 0, false, {
                                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                lineNumber: 947,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider",
                                                children: "P&L"
                                            }, void 0, false, {
                                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                lineNumber: 950,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider",
                                                children: "Greeks"
                                            }, void 0, false, {
                                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                lineNumber: 953,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider",
                                                children: "Action"
                                            }, void 0, false, {
                                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                lineNumber: 956,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                                        lineNumber: 931,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/components/trading/OptionsTrading.tsx",
                                    lineNumber: 930,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                    className: "bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700",
                                    children: positions.map((position)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            className: "hover:bg-gray-50 dark:hover:bg-gray-700",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-4 py-4",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-sm font-medium text-gray-900 dark:text-white",
                                                                children: position.symbol
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                                lineNumber: 966,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-xs text-gray-500 dark:text-gray-400",
                                                                children: [
                                                                    "$",
                                                                    position.strike,
                                                                    " ",
                                                                    new Date(position.expiry).toLocaleDateString()
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                                lineNumber: 969,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                        lineNumber: 965,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                }, void 0, false, {
                                                    fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                    lineNumber: 964,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-4 py-4",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "px-2 py-1 rounded-full text-xs font-medium ".concat(position.type === 'CALL' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'),
                                                        children: position.type
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                        lineNumber: 975,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                }, void 0, false, {
                                                    fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                    lineNumber: 974,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-4 py-4",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "px-2 py-1 rounded-full text-xs font-medium ".concat(position.side === 'BUY' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' : 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'),
                                                        children: position.side
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                        lineNumber: 984,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                }, void 0, false, {
                                                    fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                    lineNumber: 983,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-4 py-4 text-sm text-gray-900 dark:text-white",
                                                    children: position.quantity
                                                }, void 0, false, {
                                                    fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                    lineNumber: 992,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-4 py-4 text-sm text-gray-900 dark:text-white",
                                                    children: [
                                                        "$",
                                                        formatNumber(position.entryPrice)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                    lineNumber: 995,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-4 py-4 text-sm text-gray-900 dark:text-white",
                                                    children: [
                                                        "$",
                                                        formatNumber(position.currentPrice)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                    lineNumber: 998,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-4 py-4",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-sm font-medium ".concat(position.unrealizedPnL >= 0 ? 'text-green-600' : 'text-red-600'),
                                                        children: [
                                                            "$",
                                                            formatNumber(position.unrealizedPnL)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                        lineNumber: 1002,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                }, void 0, false, {
                                                    fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                    lineNumber: 1001,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-4 py-4 text-xs text-gray-500 dark:text-gray-400",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                "Δ: ",
                                                                formatNumber(position.delta, 3)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                            lineNumber: 1009,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                "Θ: ",
                                                                formatNumber(position.theta, 3)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                            lineNumber: 1010,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                    lineNumber: 1008,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-4 py-4",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>closePosition(position),
                                                        className: "text-red-600 hover:text-red-800 text-sm font-medium",
                                                        children: "Close"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                        lineNumber: 1013,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                }, void 0, false, {
                                                    fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                    lineNumber: 1012,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, position.id, true, {
                                            fileName: "[project]/components/trading/OptionsTrading.tsx",
                                            lineNumber: 963,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)))
                                }, void 0, false, {
                                    fileName: "[project]/components/trading/OptionsTrading.tsx",
                                    lineNumber: 961,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/trading/OptionsTrading.tsx",
                            lineNumber: 929,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                        lineNumber: 928,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/components/trading/OptionsTrading.tsx",
                lineNumber: 921,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            selectedTab === 'strategies' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between items-center mb-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-xl font-semibold text-gray-900 dark:text-white",
                                children: "Strategy Templates"
                            }, void 0, false, {
                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                lineNumber: 1032,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setShowStrategyBuilder(true),
                                className: "flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                        className: "h-4 w-4 mr-2"
                                    }, void 0, false, {
                                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                                        lineNumber: 1037,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    "Create Custom Strategy"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                lineNumber: 1033,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                        lineNumber: 1031,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
                        children: strategyTemplates.map((strategy)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white dark:bg-gray-800 rounded-lg shadow p-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between mb-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-lg font-semibold text-gray-900 dark:text-white",
                                                children: strategy.name
                                            }, void 0, false, {
                                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                lineNumber: 1045,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$target$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Target$3e$__["Target"], {
                                                className: "h-5 w-5 text-blue-600"
                                            }, void 0, false, {
                                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                lineNumber: 1048,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                                        lineNumber: 1044,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-gray-600 dark:text-gray-400 mb-4",
                                        children: strategy.description
                                    }, void 0, false, {
                                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                                        lineNumber: 1051,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-2 mb-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xs text-gray-500 dark:text-gray-400 font-medium",
                                                children: "Strategy Legs:"
                                            }, void 0, false, {
                                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                lineNumber: 1056,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            strategy.legs.map((leg, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-xs bg-gray-50 dark:bg-gray-700 rounded p-2",
                                                    children: [
                                                        leg.side,
                                                        " ",
                                                        leg.quantity,
                                                        " ",
                                                        leg.type,
                                                        " @ $",
                                                        leg.strike
                                                    ]
                                                }, index, true, {
                                                    fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                    lineNumber: 1058,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                                        lineNumber: 1055,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-2 gap-3 text-xs mb-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-gray-500 dark:text-gray-400",
                                                        children: "Max Profit:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                        lineNumber: 1066,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "font-medium text-green-600",
                                                        children: strategy.maxProfit ? "$".concat(formatNumber(strategy.maxProfit)) : 'Unlimited'
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                        lineNumber: 1067,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                lineNumber: 1065,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-gray-500 dark:text-gray-400",
                                                        children: "Max Loss:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                        lineNumber: 1072,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "font-medium text-red-600",
                                                        children: strategy.maxLoss ? "$".concat(formatNumber(strategy.maxLoss)) : 'Unlimited'
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                        lineNumber: 1073,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                lineNumber: 1071,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                                        lineNumber: 1064,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-xs mb-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-gray-500 dark:text-gray-400",
                                                children: "Breakeven:"
                                            }, void 0, false, {
                                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                lineNumber: 1080,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "font-medium text-gray-900 dark:text-white",
                                                children: strategy.breakeven.map((be)=>"$".concat(formatNumber(be))).join(', ')
                                            }, void 0, false, {
                                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                lineNumber: 1081,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                                        lineNumber: 1079,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>executeStrategy(strategy),
                                        disabled: executingStrategy === strategy.id,
                                        className: "w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm",
                                        children: executingStrategy === strategy.id ? 'Executing...' : 'Execute Strategy'
                                    }, void 0, false, {
                                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                                        lineNumber: 1086,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, strategy.id, true, {
                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                lineNumber: 1043,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)))
                    }, void 0, false, {
                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                        lineNumber: 1041,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/components/trading/OptionsTrading.tsx",
                lineNumber: 1030,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            showOrderModal && selectedOption && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white dark:bg-gray-800 rounded-lg p-6 w-96 max-w-md mx-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between mb-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-lg font-semibold text-gray-900 dark:text-white",
                                    children: [
                                        orderForm.side,
                                        " ",
                                        selectedOption.symbol
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/trading/OptionsTrading.tsx",
                                    lineNumber: 1104,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setShowOrderModal(false),
                                    className: "text-gray-400 hover:text-gray-600",
                                    children: "×"
                                }, void 0, false, {
                                    fileName: "[project]/components/trading/OptionsTrading.tsx",
                                    lineNumber: 1107,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/trading/OptionsTrading.tsx",
                            lineNumber: 1103,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-2 gap-4 text-sm",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-gray-500 dark:text-gray-400",
                                                    children: "Strike:"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                    lineNumber: 1118,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "font-medium",
                                                    children: [
                                                        "$",
                                                        selectedOption.strike
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                    lineNumber: 1119,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/trading/OptionsTrading.tsx",
                                            lineNumber: 1117,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-gray-500 dark:text-gray-400",
                                                    children: "Expiry:"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                    lineNumber: 1122,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "font-medium",
                                                    children: new Date(selectedOption.expiry).toLocaleDateString()
                                                }, void 0, false, {
                                                    fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                    lineNumber: 1123,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/trading/OptionsTrading.tsx",
                                            lineNumber: 1121,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-gray-500 dark:text-gray-400",
                                                    children: "Bid:"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                    lineNumber: 1126,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "font-medium",
                                                    children: [
                                                        "$",
                                                        formatNumber(selectedOption.bid)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                    lineNumber: 1127,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/trading/OptionsTrading.tsx",
                                            lineNumber: 1125,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-gray-500 dark:text-gray-400",
                                                    children: "Ask:"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                    lineNumber: 1130,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "font-medium",
                                                    children: [
                                                        "$",
                                                        formatNumber(selectedOption.ask)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                    lineNumber: 1131,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/trading/OptionsTrading.tsx",
                                            lineNumber: 1129,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/trading/OptionsTrading.tsx",
                                    lineNumber: 1116,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1",
                                            children: "Side"
                                        }, void 0, false, {
                                            fileName: "[project]/components/trading/OptionsTrading.tsx",
                                            lineNumber: 1136,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            value: orderForm.side,
                                            onChange: (e)=>setOrderForm((prev)=>({
                                                        ...prev,
                                                        side: e.target.value
                                                    })),
                                            className: "w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "BUY",
                                                    children: "Buy"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                    lineNumber: 1144,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "SELL",
                                                    children: "Sell"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                    lineNumber: 1145,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/trading/OptionsTrading.tsx",
                                            lineNumber: 1139,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/trading/OptionsTrading.tsx",
                                    lineNumber: 1135,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1",
                                            children: "Quantity"
                                        }, void 0, false, {
                                            fileName: "[project]/components/trading/OptionsTrading.tsx",
                                            lineNumber: 1150,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "number",
                                            min: "1",
                                            value: orderForm.quantity,
                                            onChange: (e)=>setOrderForm((prev)=>({
                                                        ...prev,
                                                        quantity: parseInt(e.target.value) || 1
                                                    })),
                                            className: "w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        }, void 0, false, {
                                            fileName: "[project]/components/trading/OptionsTrading.tsx",
                                            lineNumber: 1153,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/trading/OptionsTrading.tsx",
                                    lineNumber: 1149,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1",
                                            children: "Order Type"
                                        }, void 0, false, {
                                            fileName: "[project]/components/trading/OptionsTrading.tsx",
                                            lineNumber: 1163,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            value: orderForm.orderType,
                                            onChange: (e)=>setOrderForm((prev)=>({
                                                        ...prev,
                                                        orderType: e.target.value
                                                    })),
                                            className: "w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "MARKET",
                                                    children: "Market"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                    lineNumber: 1171,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "LIMIT",
                                                    children: "Limit"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                    lineNumber: 1172,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/trading/OptionsTrading.tsx",
                                            lineNumber: 1166,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/trading/OptionsTrading.tsx",
                                    lineNumber: 1162,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                orderForm.orderType === 'LIMIT' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1",
                                            children: "Limit Price"
                                        }, void 0, false, {
                                            fileName: "[project]/components/trading/OptionsTrading.tsx",
                                            lineNumber: 1178,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "number",
                                            step: "0.01",
                                            value: orderForm.price,
                                            onChange: (e)=>setOrderForm((prev)=>({
                                                        ...prev,
                                                        price: parseFloat(e.target.value) || 0
                                                    })),
                                            className: "w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        }, void 0, false, {
                                            fileName: "[project]/components/trading/OptionsTrading.tsx",
                                            lineNumber: 1181,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/trading/OptionsTrading.tsx",
                                    lineNumber: 1177,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-gray-50 dark:bg-gray-700 rounded-md p-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-sm text-gray-600 dark:text-gray-400 mb-1",
                                            children: "Order Summary"
                                        }, void 0, false, {
                                            fileName: "[project]/components/trading/OptionsTrading.tsx",
                                            lineNumber: 1192,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-lg font-semibold text-gray-900 dark:text-white",
                                            children: [
                                                orderForm.side,
                                                " ",
                                                orderForm.quantity,
                                                " contracts"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/trading/OptionsTrading.tsx",
                                            lineNumber: 1193,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-sm text-gray-600 dark:text-gray-400",
                                            children: [
                                                "Est. Cost: $",
                                                formatNumber((orderForm.orderType === 'MARKET' ? orderForm.side === 'BUY' ? selectedOption.ask : selectedOption.bid : orderForm.limitPrice) * orderForm.quantity * 100)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/trading/OptionsTrading.tsx",
                                            lineNumber: 1196,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/trading/OptionsTrading.tsx",
                                    lineNumber: 1191,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex space-x-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setShowOrderModal(false),
                                            className: "flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500",
                                            children: "Cancel"
                                        }, void 0, false, {
                                            fileName: "[project]/components/trading/OptionsTrading.tsx",
                                            lineNumber: 1207,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: executeOptionOrder,
                                            className: "flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700",
                                            children: "Place Order"
                                        }, void 0, false, {
                                            fileName: "[project]/components/trading/OptionsTrading.tsx",
                                            lineNumber: 1213,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/trading/OptionsTrading.tsx",
                                    lineNumber: 1206,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/trading/OptionsTrading.tsx",
                            lineNumber: 1115,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/trading/OptionsTrading.tsx",
                    lineNumber: 1102,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/components/trading/OptionsTrading.tsx",
                lineNumber: 1101,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            showStrategyBuilder && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-between items-center mb-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-lg font-semibold text-gray-900 dark:text-white",
                                    children: "Custom Strategy Builder"
                                }, void 0, false, {
                                    fileName: "[project]/components/trading/OptionsTrading.tsx",
                                    lineNumber: 1230,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setShowStrategyBuilder(false),
                                    className: "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200",
                                    children: "✕"
                                }, void 0, false, {
                                    fileName: "[project]/components/trading/OptionsTrading.tsx",
                                    lineNumber: 1231,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/trading/OptionsTrading.tsx",
                            lineNumber: 1229,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1",
                                            children: "Strategy Name"
                                        }, void 0, false, {
                                            fileName: "[project]/components/trading/OptionsTrading.tsx",
                                            lineNumber: 1241,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            value: customStrategy.name,
                                            onChange: (e)=>setCustomStrategy((prev)=>({
                                                        ...prev,
                                                        name: e.target.value
                                                    })),
                                            className: "w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white",
                                            placeholder: "Enter strategy name"
                                        }, void 0, false, {
                                            fileName: "[project]/components/trading/OptionsTrading.tsx",
                                            lineNumber: 1244,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/trading/OptionsTrading.tsx",
                                    lineNumber: 1240,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1",
                                            children: "Description"
                                        }, void 0, false, {
                                            fileName: "[project]/components/trading/OptionsTrading.tsx",
                                            lineNumber: 1254,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                            value: customStrategy.description,
                                            onChange: (e)=>setCustomStrategy((prev)=>({
                                                        ...prev,
                                                        description: e.target.value
                                                    })),
                                            className: "w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white",
                                            rows: 3,
                                            placeholder: "Describe your strategy"
                                        }, void 0, false, {
                                            fileName: "[project]/components/trading/OptionsTrading.tsx",
                                            lineNumber: 1257,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/trading/OptionsTrading.tsx",
                                    lineNumber: 1253,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex justify-between items-center mb-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-medium text-gray-700 dark:text-gray-300",
                                                    children: "Strategy Legs"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                    lineNumber: 1268,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: addStrategyLeg,
                                                    className: "bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm",
                                                    children: "Add Leg"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                    lineNumber: 1271,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/trading/OptionsTrading.tsx",
                                            lineNumber: 1267,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-3",
                                            children: customStrategy.legs.map((leg, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "border border-gray-300 dark:border-gray-600 rounded-md p-3",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "grid grid-cols-5 gap-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1",
                                                                        children: "Type"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                                        lineNumber: 1284,
                                                                        columnNumber: 27
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                        value: leg.type,
                                                                        onChange: (e)=>updateStrategyLeg(index, 'type', e.target.value),
                                                                        className: "w-full border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                value: "call",
                                                                                children: "Call"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                                                lineNumber: 1292,
                                                                                columnNumber: 30
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                value: "put",
                                                                                children: "Put"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                                                lineNumber: 1293,
                                                                                columnNumber: 30
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                                        lineNumber: 1287,
                                                                        columnNumber: 27
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                                lineNumber: 1283,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1",
                                                                        children: "Side"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                                        lineNumber: 1298,
                                                                        columnNumber: 27
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                        value: leg.side,
                                                                        onChange: (e)=>updateStrategyLeg(index, 'side', e.target.value),
                                                                        className: "w-full border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                value: "buy",
                                                                                children: "Buy"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                                                lineNumber: 1306,
                                                                                columnNumber: 30
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                value: "sell",
                                                                                children: "Sell"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                                                lineNumber: 1307,
                                                                                columnNumber: 30
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                                        lineNumber: 1301,
                                                                        columnNumber: 27
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                                lineNumber: 1297,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1",
                                                                        children: "Strike"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                                        lineNumber: 1312,
                                                                        columnNumber: 27
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "number",
                                                                        value: leg.strike,
                                                                        onChange: (e)=>updateStrategyLeg(index, 'strike', parseFloat(e.target.value) || 0),
                                                                        className: "w-full border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm",
                                                                        placeholder: "Strike"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                                        lineNumber: 1315,
                                                                        columnNumber: 27
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                                lineNumber: 1311,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1",
                                                                        children: "Quantity"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                                        lineNumber: 1325,
                                                                        columnNumber: 27
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "number",
                                                                        value: leg.quantity,
                                                                        onChange: (e)=>updateStrategyLeg(index, 'quantity', parseInt(e.target.value) || 1),
                                                                        className: "w-full border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm",
                                                                        placeholder: "Qty",
                                                                        min: "1"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                                        lineNumber: 1328,
                                                                        columnNumber: 27
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                                lineNumber: 1324,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-end",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>removeStrategyLeg(index),
                                                                    className: "bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm w-full",
                                                                    children: "Remove"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                                    lineNumber: 1339,
                                                                    columnNumber: 27
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                                lineNumber: 1338,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                        lineNumber: 1282,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                }, index, false, {
                                                    fileName: "[project]/components/trading/OptionsTrading.tsx",
                                                    lineNumber: 1281,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0)))
                                        }, void 0, false, {
                                            fileName: "[project]/components/trading/OptionsTrading.tsx",
                                            lineNumber: 1279,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/trading/OptionsTrading.tsx",
                                    lineNumber: 1266,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-end space-x-3 pt-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setShowStrategyBuilder(false),
                                            className: "px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700",
                                            children: "Cancel"
                                        }, void 0, false, {
                                            fileName: "[project]/components/trading/OptionsTrading.tsx",
                                            lineNumber: 1353,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: saveCustomStrategy,
                                            disabled: !customStrategy.name || customStrategy.legs.length === 0,
                                            className: "px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-md",
                                            children: "Save Strategy"
                                        }, void 0, false, {
                                            fileName: "[project]/components/trading/OptionsTrading.tsx",
                                            lineNumber: 1359,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/trading/OptionsTrading.tsx",
                                    lineNumber: 1352,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/trading/OptionsTrading.tsx",
                            lineNumber: 1239,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/trading/OptionsTrading.tsx",
                    lineNumber: 1228,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/components/trading/OptionsTrading.tsx",
                lineNumber: 1227,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/trading/OptionsTrading.tsx",
        lineNumber: 571,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(OptionsTrading, "bH9uSCJhClsGsEctONADLXD9dS8=");
_c = OptionsTrading;
const __TURBOPACK__default__export__ = OptionsTrading;
var _c;
__turbopack_context__.k.register(_c, "OptionsTrading");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn,
    "formatCurrency",
    ()=>formatCurrency,
    "formatNumber",
    ()=>formatNumber,
    "formatPercent",
    ()=>formatPercent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn() {
    for(var _len = arguments.length, inputs = new Array(_len), _key = 0; _key < _len; _key++){
        inputs[_key] = arguments[_key];
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
function formatCurrency(amount) {
    if (typeof amount !== 'number' || isNaN(amount)) return '$0.00';
    try {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    } catch (error) {
        return '$0.00';
    }
}
function formatPercent(value) {
    if (typeof value !== 'number' || isNaN(value)) return '0.00%';
    try {
        return "".concat(value >= 0 ? '+' : '').concat(value.toFixed(2), "%");
    } catch (error) {
        return '0.00%';
    }
}
function formatNumber(value) {
    if (typeof value !== 'number' || isNaN(value)) return '0';
    try {
        return new Intl.NumberFormat('en-US').format(value);
    } catch (error) {
        return '0';
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/badge.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Badge",
    ()=>Badge,
    "badgeVariants",
    ()=>badgeVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
;
;
;
const badgeVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", {
    variants: {
        variant: {
            default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
            secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
            destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
            outline: "text-foreground"
        }
    },
    defaultVariants: {
        variant: "default"
    }
});
function Badge(param) {
    let { className, variant, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(badgeVariants({
            variant
        }), className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/badge.tsx",
        lineNumber: 31,
        columnNumber: 5
    }, this);
}
_c = Badge;
;
var _c;
__turbopack_context__.k.register(_c, "Badge");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/DemoModeIndicator.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DemoModeIndicator",
    ()=>DemoModeIndicator,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/play.js [app-client] (ecmascript) <export default as Play>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$TradingModeContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/TradingModeContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function DemoModeIndicator(param) {
    let { className, variant = 'badge' } = param;
    _s();
    const { isPaperTrading, tradingMode } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$TradingModeContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTradingMode"])();
    if (!isPaperTrading) {
        return null;
    }
    if (variant === 'banner') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('bg-orange-100 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3 mb-4', className),
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__["Play"], {
                        className: "h-4 w-4 text-orange-600 dark:text-orange-400"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/DemoModeIndicator.tsx",
                        lineNumber: 28,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-sm font-medium text-orange-800 dark:text-orange-200",
                        children: "Demo Mode Active"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/DemoModeIndicator.tsx",
                        lineNumber: 29,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-xs text-orange-600 dark:text-orange-400",
                        children: "• All trades are simulated • No real money involved"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/DemoModeIndicator.tsx",
                        lineNumber: 32,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/DemoModeIndicator.tsx",
                lineNumber: 27,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/ui/DemoModeIndicator.tsx",
            lineNumber: 23,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
        variant: "outline",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300 font-medium', className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__["Play"], {
                className: "h-3 w-3 mr-1"
            }, void 0, false, {
                fileName: "[project]/src/components/ui/DemoModeIndicator.tsx",
                lineNumber: 48,
                columnNumber: 7
            }, this),
            "Demo Mode"
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/DemoModeIndicator.tsx",
        lineNumber: 41,
        columnNumber: 5
    }, this);
}
_s(DemoModeIndicator, "P+OxBcxLTCLj5aMGBUiewYPaP2Q=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$TradingModeContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTradingMode"]
    ];
});
_c = DemoModeIndicator;
const __TURBOPACK__default__export__ = DemoModeIndicator;
var _c;
__turbopack_context__.k.register(_c, "DemoModeIndicator");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/Navigation.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Navigation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/AuthContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$ThemeContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/ThemeContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$TradingModeContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/TradingModeContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$DemoModeIndicator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/DemoModeIndicator.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-hot-toast/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$home$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/home.js [app-client] (ecmascript) <export default as Home>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trending-up.js [app-client] (ecmascript) <export default as TrendingUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bar$2d$chart$2d$3$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bar-chart-3.js [app-client] (ecmascript) <export default as BarChart3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/copy.js [app-client] (ecmascript) <export default as Copy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bell.js [app-client] (ecmascript) <export default as Bell>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings.js [app-client] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/log-out.js [app-client] (ecmascript) <export default as LogOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sun.js [app-client] (ecmascript) <export default as Sun>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/moon.js [app-client] (ecmascript) <export default as Moon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/activity.js [app-client] (ecmascript) <export default as Activity>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield.js [app-client] (ecmascript) <export default as Shield>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$help$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__HelpCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/help-circle.js [app-client] (ecmascript) <export default as HelpCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/zap.js [app-client] (ecmascript) <export default as Zap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$radio$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Radio$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/radio.js [app-client] (ecmascript) <export default as Radio>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$credit$2d$card$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CreditCard$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/credit-card.js [app-client] (ecmascript) <export default as CreditCard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$crown$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Crown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/crown.js [app-client] (ecmascript) <export default as Crown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$award$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Award$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/award.js [app-client] (ecmascript) <export default as Award>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bot$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bot.js [app-client] (ecmascript) <export default as Bot>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Link$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/link.js [app-client] (ecmascript) <export default as Link>");
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
const navigationItems = [
    {
        name: 'Dashboard',
        href: '/dashboard',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$home$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"],
        description: 'Overview and portfolio summary'
    },
    {
        name: 'User Dashboard',
        href: '/user-dashboard',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"],
        description: 'Personal account and subscription management'
    },
    {
        name: 'Trading',
        href: '/trading',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"],
        description: 'Execute trades and view market data'
    },
    {
        name: 'Live Trading',
        href: '/trading/live',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$radio$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Radio$3e$__["Radio"],
        description: 'Real-time trading dashboard'
    },
    {
        name: 'Futures Trading',
        href: '/trading/futures',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"],
        description: 'Futures contracts trading'
    },
    {
        name: 'Options Trading',
        href: '/trading/options',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bar$2d$chart$2d$3$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__["BarChart3"],
        description: 'Options contracts trading'
    },
    {
        name: 'Market Updates',
        href: '/trading/market-updates',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"],
        description: 'Real-time market news and updates'
    },
    {
        name: 'Pine Editor',
        href: '/trading/pine-editor',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"],
        description: 'Pine Script editor for custom indicators'
    },
    {
        name: 'Profit Targets',
        href: '/trading/profit-targets',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$award$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Award$3e$__["Award"],
        description: 'Set and manage profit targets'
    },
    {
        name: 'Portfolio',
        href: '/portfolio',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bar$2d$chart$2d$3$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__["BarChart3"],
        description: 'Manage your investments'
    },
    {
        name: 'Copy Trade',
        href: '/copy-trade',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__["Copy"],
        description: 'Follow and copy successful traders'
    },
    {
        name: 'Creators',
        href: '/creators',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$award$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Award$3e$__["Award"],
        description: 'Discover top trading creators and investors'
    },
    {
        name: 'Social',
        href: '/social',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"],
        badge: 3,
        description: 'Connect with the trading community'
    },
    {
        name: 'Pricing',
        href: '/pricing',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$crown$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Crown$3e$__["Crown"],
        description: 'View subscription plans and pricing'
    },
    {
        name: 'Payment',
        href: '/payment',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$credit$2d$card$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CreditCard$3e$__["CreditCard"],
        description: 'Manage payment methods and billing'
    },
    {
        name: 'Security',
        href: '/security',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"],
        description: 'Security settings and compliance'
    },
    {
        name: 'Automation',
        href: '/automation',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bot$3e$__["Bot"],
        description: 'Automated trading and system management'
    },
    {
        name: 'Trading Bot',
        href: '/automation/trading-bot',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bot$3e$__["Bot"],
        description: 'Configure and manage trading bots'
    },
    {
        name: 'Copy Trading Auto',
        href: '/automation/copy-trading',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__["Copy"],
        description: 'Automated copy trading settings'
    },
    {
        name: 'Risk Management',
        href: '/automation/risk-management',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"],
        description: 'Automated risk management rules'
    },
    {
        name: 'Data Pipeline',
        href: '/automation/data-pipeline',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__["Activity"],
        description: 'Automated data processing and analysis'
    },
    {
        name: 'Auto Notifications',
        href: '/automation/notifications',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"],
        description: 'Automated notification settings'
    },
    {
        name: 'Auto Payments',
        href: '/automation/payments',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$credit$2d$card$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CreditCard$3e$__["CreditCard"],
        description: 'Automated payment processing'
    },
    {
        name: 'Auto Reporting',
        href: '/automation/reporting',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bar$2d$chart$2d$3$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__["BarChart3"],
        description: 'Automated report generation'
    },
    {
        name: 'Auto Onboarding',
        href: '/automation/onboarding',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"],
        description: 'Automated user onboarding process'
    },
    {
        name: 'Brokers',
        href: '/brokers',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Link$3e$__["Link"],
        description: 'Connect and manage broker accounts'
    },
    {
        name: 'Demo',
        href: '/demo',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__["Activity"],
        description: 'Practice trading with demo account'
    },
    {
        name: 'Settings',
        href: '/settings',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"],
        description: 'Application settings and preferences'
    },
    {
        name: 'Profile',
        href: '/profile',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"],
        description: 'Manage your profile and account details'
    },
    {
        name: 'Help',
        href: '/help',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$help$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__HelpCircle$3e$__["HelpCircle"],
        description: 'Get help and support'
    }
];
function Navigation() {
    var _user_firstName, _user_lastName, _user_firstName1, _user_lastName1;
    _s();
    const { user, logout } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const { theme, setTheme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$ThemeContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"])();
    const { isPaperTrading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$TradingModeContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTradingMode"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [focusedItemIndex, setFocusedItemIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(-1);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Navigation.useEffect": ()=>{
            setMounted(true);
        }
    }["Navigation.useEffect"], []);
    const handleLogout = async ()=>{
        try {
            await logout();
            router.push('/login');
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Logged out successfully');
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Failed to logout. Please try again.');
        }
    };
    const toggleTheme = ()=>{
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };
    const handleKeyDown = (event, action)=>{
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            action();
        }
    };
    const handleNavigationKeyDown = (event)=>{
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            setFocusedItemIndex((prev)=>(prev + 1) % navigationItems.length);
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            setFocusedItemIndex((prev)=>prev <= 0 ? navigationItems.length - 1 : prev - 1);
        } else if (event.key === 'Enter' && focusedItemIndex >= 0) {
            event.preventDefault();
            router.push(navigationItems[focusedItemIndex].href);
        } else if (event.key === 'Escape') {
            setIsProfileMenuOpen(false);
            setIsMobileMenuOpen(false);
        }
    };
    const isActive = (href)=>{
        return pathname === href;
    };
    if (!mounted) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-200 lg:dark:border-gray-700 lg:bg-white lg:dark:bg-gray-800 lg:shadow-sm",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-center h-16 px-6 border-b border-gray-200 dark:border-gray-700",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col items-center space-y-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center space-x-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"], {
                                                className: "h-5 w-5 text-white"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Navigation.tsx",
                                                lineNumber: 300,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Navigation.tsx",
                                            lineNumber: 299,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-xl font-bold text-gray-900 dark:text-white",
                                            children: "KAIRO"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Navigation.tsx",
                                            lineNumber: 302,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Navigation.tsx",
                                    lineNumber: 298,
                                    columnNumber: 13
                                }, this),
                                isPaperTrading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$DemoModeIndicator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    className: "text-xs"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Navigation.tsx",
                                    lineNumber: 304,
                                    columnNumber: 32
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/Navigation.tsx",
                            lineNumber: 297,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/Navigation.tsx",
                        lineNumber: 296,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 flex items-center justify-center px-4 py-6",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center text-gray-500 dark:text-gray-400",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm",
                                    children: "Navigation Menu"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Navigation.tsx",
                                    lineNumber: 311,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs mt-1",
                                    children: "Available in Profile"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Navigation.tsx",
                                    lineNumber: 312,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/Navigation.tsx",
                            lineNumber: 310,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/Navigation.tsx",
                        lineNumber: 309,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "border-t border-gray-200 dark:border-gray-700 p-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setIsProfileMenuOpen(!isProfileMenuOpen),
                                    className: "w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
                                    "aria-expanded": isProfileMenuOpen,
                                    "aria-haspopup": "menu",
                                    "aria-label": "User profile menu",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "h-10 w-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-white font-semibold text-sm",
                                                children: user ? "".concat(((_user_firstName = user.firstName) === null || _user_firstName === void 0 ? void 0 : _user_firstName[0]) || '').concat(((_user_lastName = user.lastName) === null || _user_lastName === void 0 ? void 0 : _user_lastName[0]) || '') || 'U' : 'U'
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Navigation.tsx",
                                                lineNumber: 327,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Navigation.tsx",
                                            lineNumber: 326,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex-1 text-left",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm font-medium text-gray-900 dark:text-white",
                                                    children: user ? "".concat(user.firstName || '', " ").concat(user.lastName || '').trim() || 'User' : 'User'
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Navigation.tsx",
                                                    lineNumber: 332,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-gray-500 dark:text-gray-400",
                                                    children: (user === null || user === void 0 ? void 0 : user.email) || 'user@example.com'
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Navigation.tsx",
                                                    lineNumber: 335,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/Navigation.tsx",
                                            lineNumber: 331,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                            className: "h-4 w-4 text-gray-400 transition-transform ".concat(isProfileMenuOpen ? 'rotate-180' : '')
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Navigation.tsx",
                                            lineNumber: 339,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Navigation.tsx",
                                    lineNumber: 319,
                                    columnNumber: 13
                                }, this),
                                isProfileMenuOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 max-h-96 overflow-y-auto",
                                    role: "menu",
                                    "aria-label": "User profile and navigation menu",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "px-2 py-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "px-2 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider",
                                                    children: "Navigation"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Navigation.tsx",
                                                    lineNumber: 353,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    onKeyDown: handleNavigationKeyDown,
                                                    children: navigationItems.map((item, index)=>{
                                                        const active = isActive(item.href);
                                                        const isFocused = focusedItemIndex === index;
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>{
                                                                router.push(item.href);
                                                                setIsProfileMenuOpen(false);
                                                            },
                                                            onKeyDown: (e)=>handleKeyDown(e, ()=>{
                                                                    router.push(item.href);
                                                                    setIsProfileMenuOpen(false);
                                                                }),
                                                            className: "w-full flex items-center space-x-3 px-3 py-2 mb-1 rounded-lg transition-all duration-200 group text-sm ".concat(active ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-sm' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white', " ").concat(isFocused ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-800' : ''),
                                                            "aria-current": active ? 'page' : undefined,
                                                            title: item.description,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(item.icon, {
                                                                    className: "h-4 w-4 transition-colors ".concat(active ? 'text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'),
                                                                    "aria-hidden": "true"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/Navigation.tsx",
                                                                    lineNumber: 379,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "flex-1 text-left",
                                                                    children: item.name
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/Navigation.tsx",
                                                                    lineNumber: 382,
                                                                    columnNumber: 27
                                                                }, this),
                                                                item.badge && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "ml-2 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold rounded-full ".concat(active ? 'bg-white/20 text-white' : 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'),
                                                                    "aria-label": "".concat(item.badge, " notifications"),
                                                                    children: item.badge
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/Navigation.tsx",
                                                                    lineNumber: 384,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, item.href, true, {
                                                            fileName: "[project]/src/components/Navigation.tsx",
                                                            lineNumber: 359,
                                                            columnNumber: 25
                                                        }, this);
                                                    })
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Navigation.tsx",
                                                    lineNumber: 354,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/Navigation.tsx",
                                            lineNumber: 352,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "border-t border-gray-200 dark:border-gray-700 mt-2 pt-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "px-4 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider",
                                                    children: "Account"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Navigation.tsx",
                                                    lineNumber: 400,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>{
                                                        router.push('/profile');
                                                        setIsProfileMenuOpen(false);
                                                    },
                                                    className: "w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700",
                                                    role: "menuitem",
                                                    "aria-label": "Go to profile page",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                                            className: "h-4 w-4",
                                                            "aria-hidden": "true"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/Navigation.tsx",
                                                            lineNumber: 410,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "Profile"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/Navigation.tsx",
                                                            lineNumber: 411,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/Navigation.tsx",
                                                    lineNumber: 401,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>{
                                                        router.push('/settings');
                                                        setIsProfileMenuOpen(false);
                                                    },
                                                    className: "w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"], {
                                                            className: "h-4 w-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/Navigation.tsx",
                                                            lineNumber: 420,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "Settings"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/Navigation.tsx",
                                                            lineNumber: 421,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/Navigation.tsx",
                                                    lineNumber: 413,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: toggleTheme,
                                                    className: "w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700",
                                                    children: [
                                                        theme === 'dark' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"], {
                                                            className: "h-4 w-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/Navigation.tsx",
                                                            lineNumber: 427,
                                                            columnNumber: 41
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__["Moon"], {
                                                            className: "h-4 w-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/Navigation.tsx",
                                                            lineNumber: 427,
                                                            columnNumber: 71
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: theme === 'dark' ? 'Light Mode' : 'Dark Mode'
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/Navigation.tsx",
                                                            lineNumber: 428,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/Navigation.tsx",
                                                    lineNumber: 423,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "border-t border-gray-200 dark:border-gray-700 my-2"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Navigation.tsx",
                                                    lineNumber: 430,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: handleLogout,
                                                    className: "w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__["LogOut"], {
                                                            className: "h-4 w-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/Navigation.tsx",
                                                            lineNumber: 435,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "Sign Out"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/Navigation.tsx",
                                                            lineNumber: 436,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/Navigation.tsx",
                                                    lineNumber: 431,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/Navigation.tsx",
                                            lineNumber: 399,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Navigation.tsx",
                                    lineNumber: 346,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/Navigation.tsx",
                            lineNumber: 318,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/Navigation.tsx",
                        lineNumber: 317,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Navigation.tsx",
                lineNumber: 294,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "lg:hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between h-16 px-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center space-x-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center space-x-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center",
                                                role: "img",
                                                "aria-label": "KAIRO logo",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"], {
                                                    className: "h-5 w-5 text-white",
                                                    "aria-hidden": "true"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Navigation.tsx",
                                                    lineNumber: 452,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Navigation.tsx",
                                                lineNumber: 451,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xl font-bold text-gray-900 dark:text-white",
                                                children: "KAIRO"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Navigation.tsx",
                                                lineNumber: 454,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/Navigation.tsx",
                                        lineNumber: 450,
                                        columnNumber: 13
                                    }, this),
                                    isPaperTrading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$DemoModeIndicator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        className: "text-xs"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Navigation.tsx",
                                        lineNumber: 456,
                                        columnNumber: 32
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Navigation.tsx",
                                lineNumber: 449,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center space-x-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: toggleTheme,
                                        className: "p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors",
                                        "aria-label": "Switch to ".concat(theme === 'dark' ? 'light' : 'dark', " mode"),
                                        title: "Switch to ".concat(theme === 'dark' ? 'light' : 'dark', " mode"),
                                        children: theme === 'dark' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"], {
                                            className: "h-5 w-5",
                                            "aria-hidden": "true"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Navigation.tsx",
                                            lineNumber: 466,
                                            columnNumber: 35
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__["Moon"], {
                                            className: "h-5 w-5",
                                            "aria-hidden": "true"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Navigation.tsx",
                                            lineNumber: 466,
                                            columnNumber: 84
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Navigation.tsx",
                                        lineNumber: 460,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors relative",
                                        "aria-label": "Notifications",
                                        title: "View notifications",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"], {
                                                className: "h-5 w-5"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Navigation.tsx",
                                                lineNumber: 473,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Navigation.tsx",
                                                lineNumber: 474,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/Navigation.tsx",
                                        lineNumber: 468,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Navigation.tsx",
                                lineNumber: 459,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Navigation.tsx",
                        lineNumber: 448,
                        columnNumber: 9
                    }, this),
                    isMobileMenuOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "fixed inset-0 z-50 lg:hidden",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "fixed inset-0 bg-black bg-opacity-25",
                                onClick: ()=>setIsMobileMenuOpen(false)
                            }, void 0, false, {
                                fileName: "[project]/src/components/Navigation.tsx",
                                lineNumber: 482,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white dark:bg-gray-800 shadow-xl",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center space-x-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "h-10 w-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-white font-semibold text-sm",
                                                            children: user ? "".concat(((_user_firstName1 = user.firstName) === null || _user_firstName1 === void 0 ? void 0 : _user_firstName1[0]) || '').concat(((_user_lastName1 = user.lastName) === null || _user_lastName1 === void 0 ? void 0 : _user_lastName1[0]) || '') || 'U' : 'U'
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/Navigation.tsx",
                                                            lineNumber: 488,
                                                            columnNumber: 21
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Navigation.tsx",
                                                        lineNumber: 487,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm font-medium text-gray-900 dark:text-white",
                                                                children: user ? "".concat(user.firstName || '', " ").concat(user.lastName || '').trim() || 'User' : 'User'
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/Navigation.tsx",
                                                                lineNumber: 493,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs text-gray-500 dark:text-gray-400",
                                                                children: (user === null || user === void 0 ? void 0 : user.email) || 'user@example.com'
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/Navigation.tsx",
                                                                lineNumber: 496,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/Navigation.tsx",
                                                        lineNumber: 492,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/Navigation.tsx",
                                                lineNumber: 486,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setIsMobileMenuOpen(false),
                                                className: "p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                    className: "h-6 w-6"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Navigation.tsx",
                                                    lineNumber: 505,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Navigation.tsx",
                                                lineNumber: 501,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/Navigation.tsx",
                                        lineNumber: 485,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "px-4 py-6 space-y-2",
                                        onKeyDown: handleNavigationKeyDown,
                                        role: "navigation",
                                        "aria-label": "Mobile navigation menu",
                                        children: navigationItems.map((item, index)=>{
                                            const Icon = item.icon;
                                            const active = isActive(item.href);
                                            const isFocused = focusedItemIndex === index;
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>{
                                                    router.push(item.href);
                                                    setIsMobileMenuOpen(false);
                                                },
                                                onKeyDown: (e)=>handleKeyDown(e, ()=>{
                                                        router.push(item.href);
                                                        setIsMobileMenuOpen(false);
                                                    }),
                                                className: "w-full group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ".concat(active ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700', " ").concat(isFocused ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-800' : ''),
                                                "aria-current": active ? 'page' : undefined,
                                                "aria-describedby": item.description ? "".concat(item.href, "-mobile-desc") : undefined,
                                                title: item.description,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                                        className: "mr-3 h-5 w-5 ".concat(active ? 'text-white' : 'text-gray-400'),
                                                        "aria-hidden": "true"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Navigation.tsx",
                                                        lineNumber: 538,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex-1 text-left",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "font-medium",
                                                                children: item.name
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/Navigation.tsx",
                                                                lineNumber: 542,
                                                                columnNumber: 25
                                                            }, this),
                                                            item.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-xs mt-1 ".concat(active ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'),
                                                                id: "".concat(item.href, "-mobile-desc"),
                                                                children: item.description
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/Navigation.tsx",
                                                                lineNumber: 544,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/Navigation.tsx",
                                                        lineNumber: 541,
                                                        columnNumber: 23
                                                    }, this),
                                                    item.badge && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded-full ".concat(active ? 'bg-white/20 text-white' : 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'),
                                                        "aria-label": "".concat(item.badge, " notifications"),
                                                        children: item.badge
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Navigation.tsx",
                                                        lineNumber: 552,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, item.name, true, {
                                                fileName: "[project]/src/components/Navigation.tsx",
                                                lineNumber: 517,
                                                columnNumber: 21
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Navigation.tsx",
                                        lineNumber: 510,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "border-t border-gray-200 dark:border-gray-700 px-4 py-4 space-y-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>{
                                                    router.push('/profile');
                                                    setIsMobileMenuOpen(false);
                                                },
                                                className: "w-full flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                                        className: "h-5 w-5 text-gray-400"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Navigation.tsx",
                                                        lineNumber: 574,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Profile"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Navigation.tsx",
                                                        lineNumber: 575,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/Navigation.tsx",
                                                lineNumber: 567,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>{
                                                    router.push('/settings');
                                                    setIsMobileMenuOpen(false);
                                                },
                                                className: "w-full flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"], {
                                                        className: "h-5 w-5 text-gray-400"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Navigation.tsx",
                                                        lineNumber: 584,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Settings"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Navigation.tsx",
                                                        lineNumber: 585,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/Navigation.tsx",
                                                lineNumber: 577,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>{
                                                    router.push('/help');
                                                    setIsMobileMenuOpen(false);
                                                },
                                                className: "w-full flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$help$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__HelpCircle$3e$__["HelpCircle"], {
                                                        className: "h-5 w-5 text-gray-400"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Navigation.tsx",
                                                        lineNumber: 594,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Help & Support"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Navigation.tsx",
                                                        lineNumber: 595,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/Navigation.tsx",
                                                lineNumber: 587,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: handleLogout,
                                                className: "w-full flex items-center space-x-3 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__["LogOut"], {
                                                        className: "h-5 w-5"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Navigation.tsx",
                                                        lineNumber: 601,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Sign Out"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Navigation.tsx",
                                                        lineNumber: 602,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/Navigation.tsx",
                                                lineNumber: 597,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/Navigation.tsx",
                                        lineNumber: 566,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Navigation.tsx",
                                lineNumber: 483,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Navigation.tsx",
                        lineNumber: 481,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Navigation.tsx",
                lineNumber: 446,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-5 h-16",
                    children: navigationItems.slice(0, 5).map((item)=>{
                        const Icon = item.icon;
                        const active = isActive(item.href);
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>router.push(item.href),
                            className: "flex flex-col items-center justify-center space-y-1 transition-colors ".concat(active ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                            className: "h-5 w-5"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Navigation.tsx",
                                            lineNumber: 629,
                                            columnNumber: 19
                                        }, this),
                                        item.badge && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "absolute -top-2 -right-2 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center",
                                            children: item.badge
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Navigation.tsx",
                                            lineNumber: 631,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Navigation.tsx",
                                    lineNumber: 628,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-xs font-medium truncate",
                                    children: item.name
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Navigation.tsx",
                                    lineNumber: 636,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, item.name, true, {
                            fileName: "[project]/src/components/Navigation.tsx",
                            lineNumber: 619,
                            columnNumber: 15
                        }, this);
                    })
                }, void 0, false, {
                    fileName: "[project]/src/components/Navigation.tsx",
                    lineNumber: 612,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/Navigation.tsx",
                lineNumber: 611,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s(Navigation, "318ec8h+a+hHW0PLfVR45jIbhfI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$ThemeContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$TradingModeContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTradingMode"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = Navigation;
var _c;
__turbopack_context__.k.register(_c, "Navigation");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/layouts/AppLayout.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AppLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Navigation$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Navigation.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/AuthContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function AppLayout(param) {
    let { children, requireAuth = true } = param;
    _s();
    const { user, loading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    // Public routes that don't require authentication
    const publicRoutes = [
        '/login',
        '/register',
        '/demo',
        '/'
    ];
    const isPublicRoute = publicRoutes.includes(pathname);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AppLayout.useEffect": ()=>{
            if (!loading && requireAuth && !user && !isPublicRoute) {
                router.push('/login');
            }
        }
    }["AppLayout.useEffect"], [
        user,
        loading,
        requireAuth,
        isPublicRoute,
        router
    ]);
    // Show loading spinner while checking authentication
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
            }, void 0, false, {
                fileName: "[project]/src/components/layouts/AppLayout.tsx",
                lineNumber: 33,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/layouts/AppLayout.tsx",
            lineNumber: 32,
            columnNumber: 7
        }, this);
    }
    // For public routes or when auth is not required, show content without navigation
    if (!requireAuth || isPublicRoute) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: children
        }, void 0, false);
    }
    // For authenticated routes, show navigation + content
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gray-50 dark:bg-gray-900",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Navigation$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/components/layouts/AppLayout.tsx",
                lineNumber: 46,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "lg:pl-64",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                    className: "min-h-screen",
                    children: children
                }, void 0, false, {
                    fileName: "[project]/src/components/layouts/AppLayout.tsx",
                    lineNumber: 51,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/layouts/AppLayout.tsx",
                lineNumber: 49,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-16 lg:hidden"
            }, void 0, false, {
                fileName: "[project]/src/components/layouts/AppLayout.tsx",
                lineNumber: 57,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/layouts/AppLayout.tsx",
        lineNumber: 45,
        columnNumber: 5
    }, this);
}
_s(AppLayout, "+V/1yikrC2yNn6BpNR6HilodE6g=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = AppLayout;
var _c;
__turbopack_context__.k.register(_c, "AppLayout");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/trading/options/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>OptionsTradingPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$trading$2f$OptionsTrading$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/trading/OptionsTrading.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layouts$2f$AppLayout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/layouts/AppLayout.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$target$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Target$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/target.js [app-client] (ecmascript) <export default as Target>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-client] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
'use client';
;
;
;
;
;
function OptionsTradingPage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layouts$2f$AppLayout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-gray-50 dark:bg-gray-900 p-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between h-16",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center space-x-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/trading",
                                            className: "flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                                    className: "h-5 w-5"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/trading/options/page.tsx",
                                                    lineNumber: 21,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Back to Trading"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/trading/options/page.tsx",
                                                    lineNumber: 22,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/trading/options/page.tsx",
                                            lineNumber: 17,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "h-6 w-px bg-gray-300 dark:bg-gray-600"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/trading/options/page.tsx",
                                            lineNumber: 24,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center space-x-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$target$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Target$3e$__["Target"], {
                                                    className: "h-6 w-6 text-purple-600"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/trading/options/page.tsx",
                                                    lineNumber: 26,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                                    className: "text-xl font-semibold text-gray-900 dark:text-white",
                                                    children: "Options Trading"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/trading/options/page.tsx",
                                                    lineNumber: 27,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/trading/options/page.tsx",
                                            lineNumber: 25,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/trading/options/page.tsx",
                                    lineNumber: 16,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center space-x-3",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-sm text-gray-500 dark:text-gray-400",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Greeks & Strategies"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/trading/options/page.tsx",
                                            lineNumber: 35,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/trading/options/page.tsx",
                                        lineNumber: 34,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/trading/options/page.tsx",
                                    lineNumber: 33,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/trading/options/page.tsx",
                            lineNumber: 15,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/trading/options/page.tsx",
                        lineNumber: 14,
                        columnNumber: 9
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/trading/options/page.tsx",
                    lineNumber: 13,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$trading$2f$OptionsTrading$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/src/app/trading/options/page.tsx",
                        lineNumber: 44,
                        columnNumber: 9
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/trading/options/page.tsx",
                    lineNumber: 43,
                    columnNumber: 7
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/trading/options/page.tsx",
            lineNumber: 11,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/trading/options/page.tsx",
        lineNumber: 10,
        columnNumber: 5
    }, this);
}
_c = OptionsTradingPage;
var _c;
__turbopack_context__.k.register(_c, "OptionsTradingPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_17d90875._.js.map