import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        dateOfBirth: {
            type: Date,
            required: true
        },
        password: {
            type: String,
            required: true,
        },
        currSlot: {
            type: String,
            required: true,
        },
        nextSlot: {
            type: String,
            default: null,
        },
        paymentStatus: {
            type: Boolean,
            default: false,
        }
    },
    {
    timestamps: true,
    }
)

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

// Adding a method to the user schema to compare entered password with stored hashed password
userSchema.pre('save', async function (next) {
    // Checking if the password field is not modified, if not, proceed to the next middleware
    if (!this.isModified('password')) {
      next();
    }
    
    // Generating a salt with a cost factor of 10
    const salt = await bcrypt.genSalt(10);

    // Hashing the password with the generated salt
    this.password = await bcrypt.hash(this.password, salt);


    next();
});

// Creating the User model using the user schema
const User = mongoose.model('User', userSchema)

export default User