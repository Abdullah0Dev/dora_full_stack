const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator')
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name'],
        validate: [
            {
                validator: function (value) {
                    return value.length >= 4;
                },
                message: 'Name must be at least 4 characters long'
            }
        ]
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,
        lowercase: true,
        trim: true,
        validate: [validator.isEmail, 'Please Enter A valid Email']
    },
    avatar: {
        type: String,
        required: [true, 'Please Select Your Avatar'],
    }, 
    password: {
        type: String,
        required: [true, 'Please enter your password'],
        validate: [
            {
                validator: function (value) {
                    return /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(value);
                },
                message: 'Password must contain at least 8 characters & including at least one number & one symbol & and one uppercase letter'
            }
        ],

    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving to the database
userSchema.pre('save', async function (next) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});


// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword, next) {
    try {
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    } catch (error) {
        return next(error);
    }
};
// statics method to login              props
userSchema.statics.login = async function (email, password) {
    // this method means inside the userSchema
    // check if the email exiest
    const user = await this.findOne({ email }) // email: email
    //   check if the user is exist
    if (user) {            // compare the current password to the hashed password
        const auth = await bcrypt.compare(password, user.password)
        if (auth) {
            // if we have the email, and the pass return the user
            return user;
        } throw Error(`Incorrect Password`)
    } throw Error(`Incorrect Email`)
};

const User = mongoose.model('User', userSchema);

module.exports = User;

/**
 takes userModel.statics.login(any kind of name)
 */