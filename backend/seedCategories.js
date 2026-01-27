import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "./src/models/Category.js";

dotenv.config();

// Categories from frontend with proper image URLs
const categories = [
    {
        name: "Nails & Nail Art",
        image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=80",
        order: 1
    },
    {
        name: "Hair (His)",
        image: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=800&q=80",
        order: 2
    },
    {
        name: "Hair (Her)",
        image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80",
        order: 3
    },
    {
        name: "Styling (Her)",
        image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&q=80",
        order: 4
    },
    {
        name: "Shampoo & Conditioning",
        image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800&q=80",
        order: 5
    },
    {
        name: "Head Massage (30 mins)",
        image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80",
        order: 6
    },
    {
        name: "Texture Services",
        image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&q=80",
        order: 7
    },
    {
        name: "Hair Treatments",
        image: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=800&q=80",
        order: 8
    },
    {
        name: "Hair Spa",
        image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80",
        order: 9
    },
    {
        name: "Hair Color",
        image: "https://images.unsplash.com/photo-1634449571010-02389ed0f9b0?w=800&q=80",
        order: 10
    },
    {
        name: "Skin & Facial",
        image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80",
        order: 11
    },
    {
        name: "Body Care (Wax)",
        image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&q=80",
        order: 12
    },
    {
        name: "Threading",
        image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80",
        order: 13
    },
    {
        name: "Bleach",
        image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&q=80",
        order: 14
    },
    {
        name: "Body Polishing & Massage",
        image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80",
        order: 15
    },
    {
        name: "Hands & Feet",
        image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=80",
        order: 16
    },
    {
        name: "Lashes",
        image: "https://images.unsplash.com/photo-1583001931096-959e155e7a3f?w=800&q=80",
        order: 17
    },
    {
        name: "His Packages",
        image: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=800&q=80",
        order: 18
    },
    {
        name: "Her Packages",
        image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80",
        order: 19
    }
];

const seedCategories = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to MongoDB");

        // Clear existing categories
        await Category.deleteMany({});
        console.log("🗑️  Cleared existing categories");

        // Insert new categories
        const result = await Category.insertMany(categories);
        console.log(`✅ Successfully inserted ${result.length} categories:`);

        result.forEach((cat) => {
            console.log(`   - ${cat.name}`);
        });

        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding categories:", error);
        process.exit(1);
    }
};

seedCategories();
