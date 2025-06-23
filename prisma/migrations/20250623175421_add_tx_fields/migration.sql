-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "amount" DOUBLE PRECISION,
ADD COLUMN     "fromAddress" TEXT,
ADD COLUMN     "toAddress" TEXT;
