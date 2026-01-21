
import { config } from "dotenv";
config({ path: ".env.local" });

async function main() {
  const { db } = await import("../src/db/client");
  const { products } = await import("../src/db/schema");

  console.log("Checking products in DB...");
  const allProducts = await db.select().from(products).all();
  console.log(`Found ${allProducts.length} products:`);
  allProducts.forEach(p => {
    console.log(`ID: ${p.id}, Name: ${p.name}`);
  });
}

main();
