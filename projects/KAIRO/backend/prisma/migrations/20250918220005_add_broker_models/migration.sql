-- CreateEnum
CREATE TYPE "BrokerType" AS ENUM ('ALPACA', 'INTERACTIVE_BROKERS', 'TD_AMERITRADE', 'TRADIER', 'ROBINHOOD', 'FIDELITY', 'SCHWAB', 'ETRADE');

-- CreateEnum
CREATE TYPE "BrokerAccountType" AS ENUM ('CASH', 'MARGIN', 'IRA', 'ROTH_IRA');

-- CreateEnum
CREATE TYPE "BrokerAccountStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'RESTRICTED');

-- CreateTable
CREATE TABLE "broker_connections" (
    "id" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    "brokerType" "BrokerType" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isConnected" BOOLEAN NOT NULL DEFAULT false,
    "lastSyncAt" TIMESTAMP(3),
    "apiKey" TEXT NOT NULL,
    "apiSecret" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "accountId" TEXT,
    "environment" TEXT NOT NULL DEFAULT 'sandbox',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "broker_connections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "broker_accounts" (
    "id" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "accountType" "BrokerAccountType" NOT NULL,
    "status" "BrokerAccountStatus" NOT NULL DEFAULT 'ACTIVE',
    "buyingPower" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cashBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "portfolioValue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "dayTradingBuyingPower" DOUBLE PRECISION,
    "maintenanceMargin" DOUBLE PRECISION,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "brokerConnectionId" TEXT NOT NULL,

    CONSTRAINT "broker_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "broker_positions" (
    "id" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "marketValue" DOUBLE PRECISION NOT NULL,
    "averageCost" DOUBLE PRECISION NOT NULL,
    "unrealizedPnL" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "unrealizedPnLPercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "side" TEXT NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "brokerAccountId" TEXT NOT NULL,

    CONSTRAINT "broker_positions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "broker_orders" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "side" "TradeSide" NOT NULL,
    "orderType" "OrderType" NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "price" DOUBLE PRECISION,
    "stopPrice" DOUBLE PRECISION,
    "timeInForce" TEXT NOT NULL DEFAULT 'DAY',
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "filledQuantity" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "averageFillPrice" DOUBLE PRECISION,
    "commission" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "filledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "brokerAccountId" TEXT NOT NULL,

    CONSTRAINT "broker_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "broker_trades" (
    "id" TEXT NOT NULL,
    "tradeId" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "side" "TradeSide" NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "commission" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "executedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "brokerConnectionId" TEXT NOT NULL,
    "brokerOrderId" TEXT,

    CONSTRAINT "broker_trades_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "broker_connections_userId_brokerType_accountName_key" ON "broker_connections"("userId", "brokerType", "accountName");

-- CreateIndex
CREATE UNIQUE INDEX "broker_accounts_brokerConnectionId_accountNumber_key" ON "broker_accounts"("brokerConnectionId", "accountNumber");

-- CreateIndex
CREATE UNIQUE INDEX "broker_positions_brokerAccountId_symbol_key" ON "broker_positions"("brokerAccountId", "symbol");

-- CreateIndex
CREATE UNIQUE INDEX "broker_orders_brokerAccountId_orderId_key" ON "broker_orders"("brokerAccountId", "orderId");

-- CreateIndex
CREATE UNIQUE INDEX "broker_trades_brokerConnectionId_tradeId_key" ON "broker_trades"("brokerConnectionId", "tradeId");

-- AddForeignKey
ALTER TABLE "broker_connections" ADD CONSTRAINT "broker_connections_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "broker_accounts" ADD CONSTRAINT "broker_accounts_brokerConnectionId_fkey" FOREIGN KEY ("brokerConnectionId") REFERENCES "broker_connections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "broker_positions" ADD CONSTRAINT "broker_positions_brokerAccountId_fkey" FOREIGN KEY ("brokerAccountId") REFERENCES "broker_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "broker_orders" ADD CONSTRAINT "broker_orders_brokerAccountId_fkey" FOREIGN KEY ("brokerAccountId") REFERENCES "broker_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "broker_trades" ADD CONSTRAINT "broker_trades_brokerConnectionId_fkey" FOREIGN KEY ("brokerConnectionId") REFERENCES "broker_connections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "broker_trades" ADD CONSTRAINT "broker_trades_brokerOrderId_fkey" FOREIGN KEY ("brokerOrderId") REFERENCES "broker_orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
