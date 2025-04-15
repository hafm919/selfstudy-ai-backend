/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `RepetitionCalendar` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `RepetitionCalendar` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RepetitionCalendar" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "RepetitionCalendar_userId_key" ON "RepetitionCalendar"("userId");

-- AddForeignKey
ALTER TABLE "RepetitionCalendar" ADD CONSTRAINT "RepetitionCalendar_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
