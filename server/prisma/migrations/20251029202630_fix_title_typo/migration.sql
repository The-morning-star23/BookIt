/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Experience` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Experience_title_key" ON "Experience"("title");
