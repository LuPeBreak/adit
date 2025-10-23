/*
  Warnings:

  - A unique constraint covering the columns `[acronym]` on the table `department` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[department_id,acronym]` on the table `sector` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "department_acronym_key" ON "department"("acronym");

-- CreateIndex
CREATE UNIQUE INDEX "sector_department_id_acronym_key" ON "sector"("department_id", "acronym");
