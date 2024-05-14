/*
  Warnings:

  - A unique constraint covering the columns `[attendee_id]` on the table `check_ins` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "check_ins_attendee_id_key" ON "check_ins"("attendee_id");
