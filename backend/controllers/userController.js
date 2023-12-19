import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import generateToken from '../utils/generateToken.js'
import schedule from 'node-schedule'

// @desc    Auth user & get token
// @route   POST /auth
// @access  Public
const authUser = asyncHandler(async (req, res) => {
    // Extract email and password from the request body
    const { email, password } = req.body;

    // Find the user in the database based on the provided email
    const user = await User.findOne({ email });

    // Check if the user exists and the provided password is correct
    if (user && (await user.matchPassword(password))) {
        // Generate a token for the authenticated user
        const token = generateToken(user._id);

        // Respond with user details and token
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            dateOfBirth: user.dateOfBirth,
            currSlot: user.currSlot,
            nextSlot: user.nextSlot,
            paymentStatus: user.paymentStatus,
            token: token
        });
    } else {
        // Respond with an error if authentication fails
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// @desc    Register a new user
// @route   POST /
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
     // Extract user details from the request body
     const { name, email, dateOfBirth, password, currSlot } = req.body;

     // Check if the user already exists in the database
     const userExists = await User.findOne({ email });
 
     // Respond with an error if the user already exists
     if (userExists) {
         res.status(400);
         throw new Error('User already exists');
     }
 
     // Calculate the user's age based on the provided date of birth
     const today = new Date();
     const birthDate = new Date(dateOfBirth);
     const age = today.getFullYear() - birthDate.getFullYear();
 
     // Validate that the user's age is between 18 and 65
     if (age < 18 || age > 65) {
         res.status(400);
         throw new Error('Age must be between 18 and 65');
     }
 
     // Create a new user in the database
     const user = await User.create({
         name,
         email,
         dateOfBirth,
         password,
         currSlot
     });
 
     // If the user is successfully created, generate a token and respond with user details
     if (user) {
         const token = generateToken(user._id);
 
         res.status(201).send({
             _id: user._id,
             name: user.name,
             email: user.email,
             dateOfBirth: user.dateOfBirth,
             currSlot: user.currSlot,
             nextSlot: user.nextSlot,
             paymentStatus: user.paymentStatus,
             token: token
         });
     } else {
         // Respond with an error if user creation fails
         res.status(400);
         throw new Error('Invalid user data');
     }
});

// @desc    Logout user / clear cookie
// @route   POST /logout
// @access  Public
const logoutUser = (req, res) => {
    // Logout user by clearing cookie
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /profile
// @access  Private
const getUser = asyncHandler(async (req, res) => {
    // Retrieve user details based on the authenticated user's ID
    const user = await User.findById(req.user._id);

    // Respond with user details if found, otherwise, respond with an error
    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            currSlot: user.currSlot,
            nextSlot: user.nextSlot,
            paymentStatus: user.paymentStatus
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Update user profile
// @route   PUT /profile
// @access  Private
const updateUser = asyncHandler(async (req, res) => {
    // Retrieve the user based on the provided user ID
    const user = await User.findById(req.body.id);

    // If the user is found, update user profile details
    if (user) {
        user.nextSlot = req.body.nextSlot || user.nextSlot;
        user.paymentStatus = req.body.paymentStatus || user.paymentStatus;

        // Save the updated user profile
        const updatedUser = await user.save();
        const token = generateToken(user._id);

        // Respond with updated user details and token
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            dateOfBirth: updatedUser.dateOfBirth,
            currSlot: updatedUser.currSlot,
            nextSlot: updatedUser.nextSlot,
            paymentStatus: updatedUser.paymentStatus,
            token: token
        });
    } else {
        // Respond with an error if the user is not found
        res.status(404);
        throw new Error('User not found');
    }
});


// *    *    *    *    *    *
// ┬    ┬    ┬    ┬    ┬    ┬
// │    │    │    │    │    │
// │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
// │    │    │    │    └───── month (1 - 12)
// │    │    │    └────────── day of month (1 - 31)
// │    │    └─────────────── hour (0 - 23)
// │    └──────────────────── minute (0 - 59)
// └───────────────────────── second (0 - 59, OPTIONAL)

// Schedule a job to execute at the beginning of every hour to update users' slots and payment status for a new month
const newMonth = async () => {
    await schedule.scheduleJob('1 * *', async () => {
        try {
            // Fetch all users from the database
            const users = await User.find({});

            // Iterate through all users and update their profile for a new month
            for (const user of users) {
                const previousNextSlot = user.nextSlot;

                // Reset payment status, set current slot to next slot (or 6-7AM if not set), and clear the next slot
                user.paymentStatus = false;
                user.currSlot = (previousNextSlot === null || previousNextSlot === '') ? '6-7AM' : previousNextSlot;
                user.nextSlot = null;

                // Save the updated user profile
                await user.save();
            }

            console.log('Monthly Update Done!');
        } catch (error) {
            console.log('Monthly Update Failed');
        }
    });
}

// Export the defined functions
export {
    authUser,
    registerUser,
    logoutUser,
    getUser,
    updateUser,
    newMonth
};