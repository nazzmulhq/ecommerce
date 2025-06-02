const { MongoClient } = require('mongodb');
require('dotenv').config();

async function checkMongoConnection() {
    const mongoUrl = process.env.MONGO_DB_URL;

    console.log('Checking MongoDB connection to:', mongoUrl);

    const client = new MongoClient(mongoUrl);

    try {
        await client.connect();
        console.log('MongoDB connection successful!');

        // List databases to verify permissions
        const dbs = await client.db().admin().listDatabases();
        console.log('Databases available:');
        dbs.databases.forEach((db) => {
            console.log(`- ${db.name}`);
        });
    } catch (error) {
        console.error('MongoDB connection failed with error:', error);
        console.log('\nTroubleshooting tips:');
        console.log('1. Make sure MongoDB is running');
        console.log(
            '2. Check if your cr        node src/scripts/check-mongo-connection.js        node src/scripts/check-mongo-connection.jsedentials are correct',
        );
        console.log(
            '3. Verify that the MongoDB host is accessible from your application',
        );
        console.log(
            '4. For Docker setups, ensure the MongoDB container is running and properly networked',
        );
    } finally {
        await client.close();
    }
}

checkMongoConnection().catch(console.error);
