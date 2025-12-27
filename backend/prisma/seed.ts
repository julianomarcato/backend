import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed...");

  await prisma.user.createMany({
    data: [
      {
        name: "Juliano",
        email: "juliano@teste.com",
      },
      {
        name: "Admin",
        email: "admin@teste.com",
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Seed executado com sucesso");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
