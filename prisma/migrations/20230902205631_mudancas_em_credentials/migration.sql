/*
  Warnings:

  - You are about to drop the `token` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `url` to the `credential` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "token" DROP CONSTRAINT "token_userId_fkey";

-- AlterTable
ALTER TABLE "credential" ADD COLUMN     "url" TEXT NOT NULL;

-- DropTable
DROP TABLE "token";
