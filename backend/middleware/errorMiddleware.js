const notFound = (req, res, next) => {
    // Create a new Error object for 404 situations
    const error = new Error(`Not Found - ${req.originalUrl}`);
    
    // Set the HTTP status code to 404
    res.status(404);
    
    // Pass the error to the next middleware
    next(error);
};


const errorHandler = (err, req, res, next) => {
    // Determine the HTTP status code based on the existing status code or default to 500
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    
    // Set the HTTP status code
    res.status(statusCode);
    
    // Send a JSON response with the error message and, in non-production, the stack trace
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};


export {notFound, errorHandler}