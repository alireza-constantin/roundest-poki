-- CreateTable
CREATE TABLE "vote" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "votedFor" INTEGER NOT NULL,
    "votedAgainst" INTEGER NOT NULL,

    CONSTRAINT "vote_pkey" PRIMARY KEY ("id")
);
