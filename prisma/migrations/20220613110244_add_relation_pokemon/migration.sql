/*
  Warnings:

  - You are about to drop the `vote` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "vote";

-- CreateTable
CREATE TABLE "Vote" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "votedForId" INTEGER NOT NULL,
    "votedAgainstId" INTEGER NOT NULL,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pokemon" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "spriteUrl" TEXT NOT NULL,

    CONSTRAINT "Pokemon_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_votedForId_fkey" FOREIGN KEY ("votedForId") REFERENCES "Pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_votedAgainstId_fkey" FOREIGN KEY ("votedAgainstId") REFERENCES "Pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
