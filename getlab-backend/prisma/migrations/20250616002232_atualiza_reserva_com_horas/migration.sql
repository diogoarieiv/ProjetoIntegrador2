/*
  Warnings:

  - You are about to drop the column `dataHora` on the `Reserva` table. All the data in the column will be lost.
  - Added the required column `data` to the `Reserva` table without a default value. This is not possible if the table is not empty.
  - Added the required column `horaFim` to the `Reserva` table without a default value. This is not possible if the table is not empty.
  - Added the required column `horaInicio` to the `Reserva` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reserva" DROP COLUMN "dataHora",
ADD COLUMN     "data" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "horaFim" TEXT NOT NULL,
ADD COLUMN     "horaInicio" TEXT NOT NULL;
