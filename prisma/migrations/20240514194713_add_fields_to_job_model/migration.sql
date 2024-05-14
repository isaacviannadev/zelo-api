/*
  Warnings:

  - Added the required column `contract_type` to the `jobs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `jobs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `salary` to the `jobs` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ContractType" AS ENUM ('CLT', 'PJ');

-- AlterTable
ALTER TABLE "jobs" ADD COLUMN     "contract_type" "ContractType" NOT NULL,
ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "salary" DOUBLE PRECISION NOT NULL;
