import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import userRoutes from './routes/userRoutes.js'
import { newMonth } from './controllers/userController.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'

// Connect to the database
connectDB();

// Create an Express application
const app = express();

// Enable JSON parsing for incoming requests
app.use(express.json());

// Execute the newMonth function (Assuming it initializes logic for a new month)
newMonth();

// Use the userRoutes for API endpoints under the '/api/users' path
app.use('/api/users', userRoutes);

// Resolve the absolute path of the project
const __dirname = path.resolve();

// Serve static files and index.html for production
if (process.env.NODE_ENV === 'production') {
    // Serve static files from the 'frontend/build' directory
    app.use(express.static(path.join(__dirname, '/frontend/build')));

    // For any other route, serve the index.html file
    app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html')));
} else {
    // For development, respond with a simple message for the root route
    app.get('/', (req, res) => {
        res.send('API is running...');
    });
}

// Middleware for handling 404 (Not Found) errors
app.use(notFound);

// Middleware for handling other errors
app.use(errorHandler);

// Set the port for the server to listen on, default to 5000
const PORT = process.env.PORT || 5000;

// Start the Express server
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));