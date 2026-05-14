/*
  Warnings:

  - The values [SENTIMENT_ANALYSIS,DESCRIPTION_GENERATION,VALUE_ESTIMATION] on the enum `AIType` will be removed. If these variants are still used in the database, this will fail.
  - The values [BOOKING_RESCHEDULED,PAYMENT_FAILED,MENTOR_MATCH,SYSTEM_ALERT] on the enum `NotificationType` will be removed. If these variants are still used in the database, this will fail.
  - The values [PARTIALLY_REFUNDED] on the enum `PaymentStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `duration` on the `AILog` table. All the data in the column will be lost.
  - You are about to drop the column `model` on the `AILog` table. All the data in the column will be lost.
  - You are about to drop the column `readAt` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `refundId` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `stripePaymentIntentId` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the `ActivityLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserSession` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AIType_new" AS ENUM ('RECOMMENDATION', 'CHAT', 'MATCHING', 'INSIGHT');
ALTER TABLE "AILog" ALTER COLUMN "type" TYPE "AIType_new" USING ("type"::text::"AIType_new");
ALTER TYPE "AIType" RENAME TO "AIType_old";
ALTER TYPE "AIType_new" RENAME TO "AIType";
DROP TYPE "AIType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "NotificationType_new" AS ENUM ('BOOKING_CONFIRMED', 'BOOKING_REMINDER', 'BOOKING_CANCELLED', 'REVIEW_RECEIVED', 'PAYMENT_RECEIVED', 'SYSTEM');
ALTER TABLE "Notification" ALTER COLUMN "type" TYPE "NotificationType_new" USING ("type"::text::"NotificationType_new");
ALTER TYPE "NotificationType" RENAME TO "NotificationType_old";
ALTER TYPE "NotificationType_new" RENAME TO "NotificationType";
DROP TYPE "NotificationType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "PaymentStatus_new" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');
ALTER TABLE "Booking" ALTER COLUMN "paymentStatus" DROP DEFAULT;
ALTER TABLE "Payment" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Booking" ALTER COLUMN "paymentStatus" TYPE "PaymentStatus_new" USING ("paymentStatus"::text::"PaymentStatus_new");
ALTER TABLE "Payment" ALTER COLUMN "status" TYPE "PaymentStatus_new" USING ("status"::text::"PaymentStatus_new");
ALTER TYPE "PaymentStatus" RENAME TO "PaymentStatus_old";
ALTER TYPE "PaymentStatus_new" RENAME TO "PaymentStatus";
DROP TYPE "PaymentStatus_old";
ALTER TABLE "Booking" ALTER COLUMN "paymentStatus" SET DEFAULT 'PENDING';
ALTER TABLE "Payment" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_senderId_fkey";

-- DropIndex
DROP INDEX "Conversation_lastMessageAt_idx";

-- DropIndex
DROP INDEX "Message_isRead_idx";

-- DropIndex
DROP INDEX "Notification_type_idx";

-- DropIndex
DROP INDEX "Payment_createdAt_idx";

-- DropIndex
DROP INDEX "Payment_mentorId_idx";

-- DropIndex
DROP INDEX "Payment_status_idx";

-- DropIndex
DROP INDEX "Payment_userId_idx";

-- AlterTable
ALTER TABLE "AILog" DROP COLUMN "duration",
DROP COLUMN "model";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "readAt";

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "refundId",
DROP COLUMN "stripePaymentIntentId";

-- DropTable
DROP TABLE "ActivityLog";

-- DropTable
DROP TABLE "UserSession";
