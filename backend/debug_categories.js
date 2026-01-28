import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load env
dotenv.config();

const MONGO_URI = "mongodb+srv://NecroRohan:One%40piece7003@recipeappdb.5s0auo.mongodb.net/sagaa_dummy_db?retryWrites=true&w=majority&appName=sagaa-testing-app";

const categorySchema = new mongoose.Schema({
    name: String,
    subcategories: [{ name: String }]
});

const Category = mongoose.model('Category', categorySchema);

async function run() {
    try {
        console.log("Connecting to DB...");
        await mongoose.connect(MONGO_URI);
        console.log("Connected.");

        const categories = await Category.find({});
        console.log("Categories found:", categories.length);

        categories.forEach(c => {
            console.log(`Category: "${c.name}"`);
            console.log(`  Subcategories: ${JSON.stringify(c.subcategories)}`);
            console.log('---');
        });

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}

run();
