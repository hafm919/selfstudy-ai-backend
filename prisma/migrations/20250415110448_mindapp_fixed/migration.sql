/*
  Warnings:

  - A unique constraint covering the columns `[chapterId]` on the table `MindMap` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "MindMap_chapterId_key" ON "MindMap"("chapterId");
