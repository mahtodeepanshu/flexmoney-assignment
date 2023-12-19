import jwt from 'jsonwebtoken';

// Function to generate a JWT token based on a provided user ID
const generateToken = (id) => {
    // Convert the user ID to a string if it is an object
    const serializableId = typeof id === 'object' ? id.toString() : id;

    // Sign the JWT with the user ID and a secret key, and set an expiration time of 30 days
    return jwt.sign({ id: serializableId }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
}

// Export the 'generateToken' function to make it available for use in other modules
export default generateToken;