/*
  Warnings:

  - You are about to drop the column `adres` on the `User` table. All the data in the column will be lost.
  - Added the required column `adress` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passwordHash` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "adres",
ADD COLUMN     "adress" TEXT NOT NULL,
ADD COLUMN     "passwordHash" TEXT NOT NULL;
