/*
  Warnings:

  - You are about to drop the column `action` on the `bot_trades` table. All the data in the column will be lost.
  - You are about to drop the column `botId` on the `bot_trades` table. All the data in the column will be lost.
  - Added the required column `botConfigId` to the `bot_trades` table without a default value. This is not possible if the table is not empty.
  - Added the required column `side` to the `bot_trades` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "NotificationType" ADD VALUE 'AI_BOT_STARTED';
ALTER TYPE "NotificationType" ADD VALUE 'AI_BOT_STOPPED';
ALTER TYPE "NotificationType" ADD VALUE 'AI_BOT_TRADE_EXECUTED';

-- AlterTable
ALTER TABLE "bot_trades" DROP COLUMN "action",
DROP COLUMN "botId",
ADD COLUMN     "botConfigId" TEXT NOT NULL,
ADD COLUMN     "executedPrice" DOUBLE PRECISION,
ADD COLUMN     "fees" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "pnl" DOUBLE PRECISION,
ADD COLUMN     "side" "TradeSide" NOT NULL,
ADD COLUMN     "status" "TradeStatus" NOT NULL DEFAULT 'PENDING',
ALTER COLUMN "reasoning" DROP NOT NULL,
ALTER COLUMN "executedAt" DROP NOT NULL,
ALTER COLUMN "executedAt" DROP DEFAULT;

-- CreateTable
CREATE TABLE "ai_bot_configs" (
    "id" TEXT NOT NULL,
    "botId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "riskLevel" "RiskLevel" NOT NULL DEFAULT 'MEDIUM',
    "maxPositionSize" DOUBLE PRECISION NOT NULL DEFAULT 10,
    "minConfidence" DOUBLE PRECISION NOT NULL DEFAULT 0.7,
    "tradingPairs" TEXT[],
    "stopLossPercentage" DOUBLE PRECISION NOT NULL DEFAULT 2,
    "takeProfitRatio" DOUBLE PRECISION NOT NULL DEFAULT 2,
    "maxDailyTrades" INTEGER NOT NULL DEFAULT 10,
    "maxDailyLoss" DOUBLE PRECISION NOT NULL DEFAULT 5,
    "riskPerTrade" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "targetProfitability" DOUBLE PRECISION NOT NULL DEFAULT 90,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "portfolioId" TEXT NOT NULL,

    CONSTRAINT "ai_bot_configs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ai_bot_configs_botId_key" ON "ai_bot_configs"("botId");

-- AddForeignKey
ALTER TABLE "bot_trades" ADD CONSTRAINT "bot_trades_botConfigId_fkey" FOREIGN KEY ("botConfigId") REFERENCES "ai_bot_configs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_bot_configs" ADD CONSTRAINT "ai_bot_configs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_bot_configs" ADD CONSTRAINT "ai_bot_configs_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "portfolios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
