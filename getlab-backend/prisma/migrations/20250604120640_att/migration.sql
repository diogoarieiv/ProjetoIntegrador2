/*
  Warnings:

  - Added the required column `telefone` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipo` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "telefone" TEXT NOT NULL,
ADD COLUMN     "tipo" TEXT NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'ativo',
ALTER COLUMN "status" SET DATA TYPE TEXT;
