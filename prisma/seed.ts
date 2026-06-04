// import { PrismaClient } from "@prisma/client/extension";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Role } from "@prisma/client";
import * as bcrypt from 'bcrypt'
// import { PrismaClient, Role } from "../generated/prisma";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

export const prisma = new PrismaClient({ adapter });

async function main() {
  // Create Estate
  let estate = await prisma.estate.findFirst();

  if (!estate) {
   estate = await prisma.estate.create({
      data: {
        name: "Odera Residential Estate",
        address: "Lekki Phase 2, Lagos",
        totalHouses: 60,
        settings: {
          levyAmount: 45000,
          currency: "NGN",
          timezone: "Africa/Lagos",
          sosResponseSLA: 120,
          maintenanceSLA: {
            p1: 7200,
            p2: 86400,
            p3: 259200
          }
        }
      }
    })
    console.log("Estate created")
  }

  // Create Super Admin
  const existingAdmin = await prisma.user.findFirst({
    where: { role: Role.ADMIN }
  })

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("Admin@123", 10)

    await prisma.user.create({
      data: {
        email: "admin@oderasafe.com",
        password: hashedPassword,
        role: Role.ADMIN,
        first_login: true,
        estateId: estate.id,
      }
    })

    console.log("Super Admin created")
    console.log("Email: admin@oderasafe.com")
    console.log("Password: Admin@123")
  } else {
    console.log("Admin already exists")
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })