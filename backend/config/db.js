// Import the Mongoose library for MongoDB interactions
import mongoose from 'mongoose';

// Define a function to establish a connection to the MongoDB database
const connectDB = async () => {
    try {
        // Set strict query mode to true for MongoDB connection
        mongoose.set('strictQuery', true);

        // Use Mongoose to connect to the MongoDB database using the provided URI from the environment variables
        const conn = await mongoose.connect(process.env.MONGO_URI);

        // Log a success message if the connection is established
        console.log(`MonogoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        // Log an error message if there's an issue connecting to the database and exit the process
        console.log(`Error: ${error.message}`);
        process.exit(1);
    }
};

// Export the connectDB function to make it available for use in other parts of the application
export default connectDB;
