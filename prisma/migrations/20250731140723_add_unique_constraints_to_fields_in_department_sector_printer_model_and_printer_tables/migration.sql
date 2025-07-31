/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `department` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[serial_number]` on the table `printer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ip_address]` on the table `printer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `printer_model` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[department_id,name]` on the table `sector` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "department_name_key" ON "department"("name");

-- CreateIndex
CREATE UNIQUE INDEX "printer_serial_number_key" ON "printer"("serial_number");

-- CreateIndex
CREATE UNIQUE INDEX "printer_ip_address_key" ON "printer"("ip_address");

-- CreateIndex
CREATE UNIQUE INDEX "printer_model_name_key" ON "printer_model"("name");

-- CreateIndex
CREATE UNIQUE INDEX "sector_department_id_name_key" ON "sector"("department_id", "name");
