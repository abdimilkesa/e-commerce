const mongoose = require("mongoose");
require("dotenv").config();

const Product = require("./models/Product");

const products = [
  {
    legacyId: "a",
    name: "Sexy Women Basic Casual Fitting Top",
    price: 100,
    image: "women-top.jpg",
    category: "Women",
    sizes: ["S", "M", "L"],
    bestseller: true,
  },
  {
    legacyId: "ab",
    name: "Kids Casual Fashion Round Neck Top",
    price: 200,
    image: "kid1.jpg",
    category: "Kids",
    sizes: ["M", "L", "XL"],
    bestseller: true,
  },
  {
    legacyId: "ac",
    name: "Kids Fashion Slim Fit Casual",
    price: 220,
    image: "kid2.jpg",
    category: "Kids",
    sizes: ["S", "L", "XL"],
    bestseller: true,
  },
  {
    legacyId: "ad",
    name: "Men Casaul Slim Fit Polo Shirt",
    price: 110,
    image: "men-t-2.jpg",
    category: "Men",
    sizes: ["S", "M", "XXL"],
    bestseller: true,
  },
  {
    legacyId: "ae",
    name: "Sexy Women Basic Casual Fitting Top",
    price: 130,
    image: "w-top2.jpg",
    category: "Women",
    sizes: ["M", "L", "XL"],
    bestseller: true,
  },
  {
    legacyId: "af",
    name: "Kids Fashion Slim Fit Casual",
    price: 140,
    image: "kid3.jpg",
    category: "Kids",
    sizes: ["S", "L", "XL"],
    bestseller: true,
  },
  {
    legacyId: "ag",
    name: "Men Tapered Fit Flat-Front Trousers",
    price: 190,
    image: "men-t-3.jpg",
    category: "Men",
    sizes: ["S", "L", "XL"],
  },
  {
    legacyId: "ah",
    name: "Men Casaul Slim Fit Polo Shirt",
    price: 140,
    image: "men-t-4.jpg",
    category: "Men",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    legacyId: "ai",
    name: "Kids Fashion Slim Fit Casual",
    price: 100,
    image: "kid4.jpg",
    category: "Kids",
    sizes: ["M", "L", "XL"],
  },
  {
    legacyId: "aj",
    name: "Men Tapered Fit Flat-Front Trousers",
    price: 110,
    image: "men-t-5.jpg",
    category: "Men",
    sizes: ["S", "L", "XL"],
  },
  {
    legacyId: "ak",
    name: "Men Casaul Slim Fit Polo Shirt",
    price: 120,
    image: "men-t-6.jpg",
    category: "Men",
    sizes: ["S", "M", "L"],
  },
  {
    legacyId: "al",
    name: "Men Casaul Slim Fit Polo Shirt",
    price: 150,
    image: "men-t-7.jpg",
    category: "Men",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    legacyId: "am",
    name: "Sexy Women Basic Casual Fitting Top",
    price: 130,
    image: "w-top3.jpg",
    category: "Women",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    legacyId: "an",
    name: "Boy Casaul Slim Fit Polo Shirt",
    price: 160,
    image: "kid5.jpg",
    category: "Kids",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    legacyId: "ao",
    name: "Men Tapered Fit Flat-Front Trousers",
    price: 140,
    image: "men-t-8.jpg",
    category: "Men",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    legacyId: "ap",
    name: "Kids Fashion Slim Fit Casual",
    price: 170,
    image: "kid6.jpg",
    category: "Kids",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    legacyId: "aq",
    name: "Men Tapered Fit Flat-Front Trousers",
    price: 150,
    image: "men-t-9.jpg",
    category: "Men",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    legacyId: "ar",
    name: "Boy Casaul Slim Fit Polo Shirt",
    price: 180,
    image: "kid7.jpg",
    category: "Kids",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    legacyId: "as",
    name: "Boy Casaul Slim Fit Polo Shirt",
    price: 160,
    image: "kid8.jpg",
    category: "Kids",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    legacyId: "at",
    name: "Women Palazzo Pants with Waist Belt",
    price: 190,
    image: "w-top4.jpg",
    category: "Women",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    legacyId: "au",
    name: "Women Zip-Front Relaxed Fit Jacket",
    price: 170,
    image: "w-top5.jpg",
    category: "Women",
    subCategory: "Winterwear",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    legacyId: "av",
    name: "Women Palazzo Pants with Waist Belt",
    price: 200,
    image: "w-top6.jpg",
    category: "Women",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    legacyId: "aw",
    name: "Boy Casaul Slim Fit Polo Shirt",
    price: 180,
    image: "kid2.jpg",
    category: "Kids",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    legacyId: "ax",
    name: "Boy Casaul Slim Fit Polo Shirt",
    price: 210,
    image: "kid9.jpg",
    category: "Kids",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    legacyId: "ay",
    name: "Kids Fashion Slim Fit Casual",
    price: 190,
    image: "kid10.jpg",
    category: "Kids",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    legacyId: "az",
    name: "Women Zip-Front Relaxed Fit Jacket",
    price: 220,
    image: "w-top7.jpg",
    category: "Women",
    subCategory: "Winterwear",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    legacyId: "ba",
    name: "Kids Fashion Slim Fit Casual",
    price: 200,
    image: "kid2.jpg",
    category: "Kids",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    legacyId: "bb",
    name: "Men Slim Fit Relaxed Denim Jacket",
    price: 230,
    image: "men-t-10.jpg",
    category: "Men",
    subCategory: "Winterwear",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    legacyId: "bc",
    name: "Sexy Women Basic Casual Fitting Top",
    price: 210,
    image: "w-top8.jpg",
    category: "Women",
    sizes: ["S", "M", "L", "XL"],
  },
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "ecommerce",
    });

    console.log("MongoDB connected:", mongoose.connection.name);

    const operations = products.map((product) => ({
      updateOne: {
        filter: { legacyId: product.legacyId },
        update: {
          $set: {
            ...product,
            description: "",
            stock: 20,
            isActive: true,
          },
          $setOnInsert: {
            currency: "ETB",
          },
        },
        upsert: true,
      },
    }));

    const result = await Product.bulkWrite(operations);

    console.log("Product import completed!");
    console.log("Inserted:", result.upsertedCount);
    console.log("Updated:", result.modifiedCount);
    console.log("Total source products:", products.length);
  } catch (error) {
    console.error("Import failed:", error.message);
  } finally {
    await mongoose.disconnect();
  }
};

seedProducts();
