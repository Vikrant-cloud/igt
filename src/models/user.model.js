import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, // Unique index
        match: /.+\@.+\..+/,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        select: false
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    profilePicture: {
        type: String,
        default: 'https://www.gravatar.com/avatar/0000000000000000000000000000000?d=mp&f=y'
    },
    bio: {
        type: String,
        default: ''
    },
    otp: {
        type: String,
        default: null
    },
    otpExpires: {
        type: Date,
        default: null,
        index: { expireAfterSeconds: 300 } // TTL Index - 5 mins
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: {
        type: String,
        default: null
    },
    resetPasswordExpires: {
        type: Date,
        default: null,
        index: { expireAfterSeconds: 3600 } // TTL Index - 1 hour
    },
    isActive: {
        type: Boolean,
        default: true
    },
    stripeCustomerId: {
        type: String
    },
    subscriptionStatus: {
        type: String,
        index: true // Normal index
    },
    currentPeriodEnd: {
        type: Date,
        index: true // Date-based index
    }
}, { timestamps: true });

//
// 🔐 Password Hashing
//
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

//
// 📌 Additional Indexes
//

// 🔍 Text Index on bio
userSchema.index({ bio: 'text' });

// 📦 Compound Index: email + isVerified
userSchema.index({ email: 1, isVerified: -1 });

// ✅ Partial Index: only for verified users
userSchema.index({ email: 1 }, {
    partialFilterExpression: { isVerified: true }
});

// 🟡 Sparse Index (optional fields)
userSchema.index({ isActive: 1 }, { sparse: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
