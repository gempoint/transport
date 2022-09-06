-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "accCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);
