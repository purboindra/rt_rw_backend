-- CreateTable
CREATE TABLE "news_counter" (
    "rt_code" TEXT NOT NULL,
    "yyyymmdd" TEXT NOT NULL,
    "last_no" INTEGER NOT NULL,

    CONSTRAINT "news_counter_pkey" PRIMARY KEY ("rt_code","yyyymmdd")
);
