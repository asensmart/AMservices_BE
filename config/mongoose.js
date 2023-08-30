const mongoose = require('mongoose');

async function ConnectMongoDB() {
    try {
        await mongoose.connect(process.env.MONGO_DB_CONNECTION_URI);
        console.log("Mongodb connected successfully");
    } catch (error) {
        console.log(error);
        console.log("MongoDB Not Connected");
    }
}

module.exports = ConnectMongoDB;