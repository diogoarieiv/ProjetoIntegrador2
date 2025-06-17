-- AlterEnum
ALTER TYPE "StatusReserva" ADD VALUE 'cancelado';

-- AlterTable
ALTER TABLE "Reserva" ADD COLUMN     "motivo" TEXT;
