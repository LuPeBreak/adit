import { PrismaClient } from '../src/generated/prisma'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding ...')

  // Clean up previous data to avoid conflicts
  await prisma.printer.deleteMany()
  await prisma.asset.deleteMany()
  await prisma.printerModel.deleteMany()
  await prisma.sector.deleteMany()
  await prisma.department.deleteMany()
  console.log('Previous data cleaned.')

  // 1. Create Printer Models
  const hpModel = await prisma.printerModel.create({
    data: {
      name: 'HP LaserJet Pro M404dn',
      toners: ['HP 58A Black'],
    },
  })

  const epsonModel = await prisma.printerModel.create({
    data: {
      name: 'Epson EcoTank L3250',
      toners: [
        'T544120-AL (Black)',
        'T544220-AL (Cyan)',
        'T544320-AL (Magenta)',
        'T544420-AL (Yellow)',
      ],
    },
  })
  const printerModels = [hpModel, epsonModel]
  console.log('Created printer models.')

  // 2. Create Departments and their Sectors
  const sectors = []
  for (let i = 1; i <= 50; i++) {
    const department = await prisma.department.create({
      data: {
        name: `Secretaria de Exemplo ${i}`,
        manager: `Gestor da Secretaria ${i}`,
        managerEmail: `gestor.secretaria${i}@example.com`,
      },
    })

    for (let j = 1; j <= 2; j++) {
      const sector = await prisma.sector.create({
        data: {
          name: `Setor ${j} da Secretaria ${i}`,
          manager: `Chefe de Setor ${j}`,
          managerEmail: `chefe.setor${i}-${j}@example.com`,
          departmentId: department.id,
        },
      })
      sectors.push(sector)
    }
  }
  console.log('Created departments and sectors.')

  // 3. Create 10 Printers and their corresponding Assets randomly across sectors
  for (let i = 1; i <= 10; i++) {
    // Select a random sector and printer model
    const randomSector = sectors[Math.floor(Math.random() * sectors.length)]
    const randomPrinterModel =
      printerModels[Math.floor(Math.random() * printerModels.length)]

    // Create the asset first
    const asset = await prisma.asset.create({
      data: {
        tag: `PRINTER-${String(i).padStart(3, '0')}`,
        assetType: 'PRINTER',
        status: 'USING',
        sectorId: randomSector.id,
      },
    })

    // Create the printer linked to the asset
    await prisma.printer.create({
      data: {
        serialNumber: `SN-${String(Math.random()).slice(2, 12)}`,
        ipAddress: `192.168.1.${100 + i}`,
        printerModelId: randomPrinterModel.id,
        assetId: asset.id,
      },
    })
  }
  console.log('Created 10 printers and their assets.')

  console.log('Seeding finished successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
