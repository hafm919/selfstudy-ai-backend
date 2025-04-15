-- CreateTable
CREATE TABLE "MindMap" (
    "id" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    "mindMapData" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MindMap_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MindMap" ADD CONSTRAINT "MindMap_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
