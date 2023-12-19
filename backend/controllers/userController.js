import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import generateToken from '../utils/generateToken.js'
import schedule from 'node-schedule'

// @desc    Auth user & get token
// @route   POST /api/users/auth
// @access  Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        const token = generateToken(user._id);

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
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, dateOfBirth, password, currSlot } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    const age = today.getFullYear() - birthDate.getFullYear()

    if(age < 18 || age > 65){
        res.status(400)
        throw new Error('Age must be between 18 and 65')
    }

    const user = await User.create({
        name,
        email,
        dateOfBirth,
        password,
        currSlot
    });

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
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
const logoutUser = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

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
// @route   PUT /api/users/profile
// @access  Private
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.body.id);

    if (user) {
        user.nextSlot = req.body.nextSlot || user.nextSlot;
        user.paymentStatus = req.body.paymentStatus || user.paymentStatus;

        const updatedUser = await user.save();
        const token = generateToken(user._id);

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
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        await User.deleteOne({ _id: user._id });
        res.json({ message: 'User removed' });
    } else {
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

const newMonth = async () => {
    await schedule.scheduleJob('1 * *', async () => {
        try{
            const users = await User.find({});

            for (const user of users) {
                const previousNextSlot = user.nextSlot;
    
                user.paymentStatus = false;  
                user.currSlot = (previousNextSlot === null || previousNextSlot === '') ? '6-7AM' : previousNextSlot; 
                user.nextSlot = null;  
    
                await user.save();
            }
    
            console.log('Monthly Update Done!')
        } catch (error) {
            console.log('Monthly Update Failed')
        }
    })
}

export {
    authUser,
    registerUser,
    logoutUser,
    getUser,
    updateUser,
    deleteUser,
    newMonth
};