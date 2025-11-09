const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Brand = require("./models/Brand");

dotenv.config();

const brands = [
  {
    name: "Nike",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg",
    description: "American athletic footwear and apparel corporation",
    isActive: true,
  },
  {
    name: "Adidas",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg",
    description: "German athletic apparel and footwear corporation",
    isActive: true,
  },
  {
    name: "Puma",
    logo: "https://upload.wikimedia.org/wikipedia/en/d/da/Puma_complete_logo.svg",
    description:
      "German multinational corporation that designs and manufactures athletic and casual footwear",
    isActive: true,
  },
  {
    name: "New Balance",
    logo: "https://upload.wikimedia.org/wikipedia/commons/e/ea/New_Balance_logo.svg",
    description: "American sports footwear and apparel brand",
    isActive: true,
  },
  {
    name: "Converse",
    logo: "https://upload.wikimedia.org/wikipedia/commons/3/30/Converse_logo.svg",
    description:
      "American lifestyle brand that markets, distributes, and licenses footwear",
    isActive: true,
  },
  {
    name: "Vans",
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/78/Vans-logo.svg",
    description: "American manufacturer of skateboarding shoes and apparel",
    isActive: true,
  },
  {
    name: "Reebok",
    logo: "https://upload.wikimedia.org/wikipedia/commons/3/3b/Reebok_logo.svg",
    description: "American fitness footwear and clothing brand",
    isActive: true,
  },
];

const seedBrands = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected...");

    // Clear existing brands
    await Brand.deleteMany({});
    console.log("Cleared existing brands");

    // Insert new brands
    const createdBrands = await Brand.insertMany(brands);
    console.log(`Successfully seeded ${createdBrands.length} brands:`);
    createdBrands.forEach((brand) => {
      console.log(`- ${brand.name}`);
    });

    process.exit(0);
  } catch (error) {
    console.error("Error seeding brands:", error);
    process.exit(1);
  }
};

seedBrands();
