import {
  PrismaClient,
  AssetStatus,
  TonerRequestStatus,
  PhoneType,
} from '../src/generated/prisma'

const prisma = new PrismaClient()

// Helper function to get random enum value
function getRandomEnumValue<T extends Record<string, string>>(
  enumObject: T,
): T[keyof T] {
  const values = Object.values(enumObject)
  return values[Math.floor(Math.random() * values.length)] as T[keyof T]
}

async function main() {
  console.log('Start seeding ...')

  // Clean up previous data to avoid conflicts
  await prisma.tonerRequest.deleteMany()
  await prisma.assetStatusHistory.deleteMany()
  await prisma.printer.deleteMany()
  await prisma.phone.deleteMany()
  await prisma.asset.deleteMany()
  await prisma.printerModel.deleteMany()
  await prisma.sector.deleteMany()
  await prisma.department.deleteMany()
  console.log('Previous data cleaned.')

  // Get the first admin user for history tracking
  const adminUser = await prisma.user.findFirst({
    where: { role: 'ADMIN' },
  })

  if (!adminUser) {
    console.log('No admin user found. Please create an admin user first.')
    process.exit(1)
  }
  console.log('Using existing admin user for history tracking.')

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
  const createdPrinters = []
  for (let i = 1; i <= 10; i++) {
    // Select a random sector and printer model
    const randomSector = sectors[Math.floor(Math.random() * sectors.length)]
    const randomPrinterModel =
      printerModels[Math.floor(Math.random() * printerModels.length)]

    // Get random status for asset
    const randomStatus = getRandomEnumValue(AssetStatus)

    // Create the asset first
    const asset = await prisma.asset.create({
      data: {
        tag: `TI-${i.toString().padStart(5, '0')}`,
        assetType: 'PRINTER',
        status: randomStatus,
        sectorId: randomSector.id,
      },
    })

    // Create the printer linked to the asset and store it directly
    const printer = await prisma.printer.create({
      data: {
        serialNumber: `SN-${String(Math.random()).slice(2, 12)}`,
        ipAddress: `192.168.1.${100 + i}`,
        printerModelId: randomPrinterModel.id,
        assetId: asset.id,
      },
    })
    createdPrinters.push(printer)

    // Create initial status history entry for the asset
    await prisma.assetStatusHistory.create({
      data: {
        assetId: asset.id,
        status: randomStatus,
        sectorId: randomSector.id,
        changedBy: adminUser.id,
        notes: 'Registro inicial do ativo no sistema',
      },
    })
  }
  console.log('Created 10 printers and their assets.')

  // 4. Create 10 Phones and their corresponding Assets randomly across sectors
  const phoneBrands = [
    'Intelbras',
    'Cisco',
    'Yealink',
    'Grandstream',
    'Panasonic',
  ]

  for (let i = 1; i <= 10; i++) {
    // Select a random sector and phone type
    const randomSector = sectors[Math.floor(Math.random() * sectors.length)]
    const randomPhoneType = getRandomEnumValue(PhoneType)
    const randomBrand =
      phoneBrands[Math.floor(Math.random() * phoneBrands.length)]

    // Get random status for asset
    const randomStatus = getRandomEnumValue(AssetStatus)

    // Create the asset first
    const asset = await prisma.asset.create({
      data: {
        tag: `TI-${(10 + i).toString().padStart(5, '0')}`,
        assetType: 'PHONE',
        status: randomStatus,
        sectorId: randomSector.id,
      },
    })

    // Create the phone linked to the asset
    await prisma.phone.create({
      data: {
        phoneNumber: `3323${(2000 + i).toString()}`,
        brand: randomBrand,
        phoneType: randomPhoneType,
        ipAddress:
          randomPhoneType === 'VOIP' && Math.random() > 0.3
            ? `192.168.2.${100 + i}`
            : null,
        serialNumber: `TEL-SN-${String(Math.random()).slice(2, 12)}`,
        assetId: asset.id,
      },
    })

    // Create initial status history entry for the asset
    await prisma.assetStatusHistory.create({
      data: {
        assetId: asset.id,
        status: randomStatus,
        sectorId: randomSector.id,
        changedBy: adminUser.id,
        notes: 'Registro inicial do telefone no sistema',
      },
    })
  }
  console.log('Created 10 phones and their assets.')

  // 5. Create 3 toner requests per printer (30 total)
  const requesterNames = [
    'João Silva',
    'Maria Santos',
    'Pedro Oliveira',
    'Ana Costa',
    'Carlos Ferreira',
    'Lucia Pereira',
    'Roberto Lima',
    'Fernanda Alves',
    'Marcos Souza',
    'Patricia Rocha',
  ]

  for (const printer of createdPrinters) {
    for (let j = 1; j <= 3; j++) {
      const randomRequester =
        requesterNames[Math.floor(Math.random() * requesterNames.length)]
      const randomStatus = getRandomEnumValue(TonerRequestStatus)

      await prisma.tonerRequest.create({
        data: {
          requesterName: randomRequester,
          registrationNumber: `REG${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
          requesterWhatsApp: `(24) 9${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
          requesterEmail: `${randomRequester.toLowerCase().replace(' ', '.')}@barramansa.rj.gov.br`,
          selectedToner: 'HP 58A Black', // Simplified for now
          status: randomStatus,
          notes: j === 1 ? 'Pedido urgente para impressão de relatórios' : null,
          printerId: printer.id,
        },
      })
    }
  }
  console.log('Created 30 toner requests (3 per printer).')

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
