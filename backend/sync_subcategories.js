import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load env
dotenv.config();

const MONGO_URI = "mongodb+srv://NecroRohan:One%40piece7003@recipeappdb.5s0auo.mongodb.net/sagaa_dummy_db?retryWrites=true&w=majority&appName=sagaa-testing-app";

// Schemas
const categorySchema = new mongoose.Schema({
    name: String,
    subcategories: [{ name: String }]
});

const serviceSchema = new mongoose.Schema({
    name: String,
    category: String,
    subcategory: String,
    prices: {
        male: Number,
        female: Number
    },
    description: String,
    image: String,
    isActive: Boolean
});

const Category = mongoose.model('Category', categorySchema);
const Service = mongoose.model('Service', serviceSchema);

async function run() {
    try {
        console.log("Connecting to DB...");
        await mongoose.connect(MONGO_URI);
        console.log("Connected.");

        // 1. Get all Services
        const services = await Service.find({});
        console.log(`Found ${services.length} services.`);

        // 2. Group subcategories by Category
        const subcatsMap = {}; // { "Category Name": Set("Sub A", "Sub B") }

        services.forEach(s => {
            if (s.category && s.subcategory) {
                if (!subcatsMap[s.category]) {
                    subcatsMap[s.category] = new Set();
                }
                subcatsMap[s.category].add(s.subcategory.trim());
            }
        });

        // 3. Update Categories
        const categories = await Category.find({});

        for (const cat of categories) {
            const discovered = subcatsMap[cat.name];
            if (!discovered) continue;

            // Get existing subcats (handle objects or strings if schema was loose before, but schema defines obj)
            const existingNames = new Set(cat.subcategories.map(s => s.name));
            let needsSave = false;

            discovered.forEach(subName => {
                // Check case-insensitive match to avoid duplicates like "Long Hair" vs "long hair"
                // But generally retain the one used in Service if missing.
                // Simple check against existing Names
                if (!existingNames.has(subName)) {
                    console.log(`Adding subcategory "${subName}" to "${cat.name}"`);
                    cat.subcategories.push({ name: subName });
                    existingNames.add(subName);
                    needsSave = true;
                }
            });

            if (needsSave) {
                await cat.save();
                console.log(`Saved "${cat.name}"`);
            } else {
                console.log(`"${cat.name}" is up to date.`);
            }
        }

        console.log("Migration complete.");

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}

run();
