import jwt from 'jsonwebtoken'; 
import asyncHandler from 'express-async-handler'; 
import User from '../models/userModel.js'; 

// Middleware function to protect routes that require authentication
const protect = asyncHandler(async (req, res, next) => {
    let token; // Variable to store the JWT extracted from the request headers

    // Checking if the request headers contain an authorization token (Bearer token)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extracting the token from the authorization header
            token = req.headers.authorization.split(' ')[1];

            // Verifying and decoding the JWT using the provided secret
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Fetching the user details from the database based on the decoded JWT
            req.user = await User.findById(decoded.id);

            // Proceed to the next middleware or route handler
            next();
        } catch (error) {
            console.log(error);
            // Handling token verification failure
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    }

    // Handling the case when there is no token in the request headers
    if (!token) {
        res.status(401);
        throw new Error('Not authorized, No Student Token');
    }
});

// Exporting the protect middleware for use in other files
export { protect };
