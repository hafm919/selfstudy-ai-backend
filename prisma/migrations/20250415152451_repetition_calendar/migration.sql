-- CreateTable
CREATE TABLE "RepetitionCalendar" (
    "id" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    "dates" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RepetitionCalendar_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RepetitionCalendar_chapterId_key" ON "RepetitionCalendar"("chapterId");

-- AddForeignKey
ALTER TABLE "RepetitionCalendar" ADD CONSTRAINT "RepetitionCalendar_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
