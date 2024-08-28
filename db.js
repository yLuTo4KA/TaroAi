const mongoose = require("mongoose");
const database = module.exports = () => {
    const connectionParams = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
    try {
        mongoose.connect(`mongodb+srv://2ytka2:${process.env.DB_PASS}@cluster0.xj7m478.mongodb.net/TaroAI?retryWrites=true&w=majority&appName=Cluster0`);
        console.log('connect success! 🧠🧠🧠')
    } catch (error) {
        console.log(error);
    }

}

database();


const UserSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
    },
    username: {
        type: String,
        required: true,
        default: '',
        trim: true,
    },
    first_name: {
        type: String,
        required: false,
        default: null,
        trim: true,
    },
    last_name: {
        type: String,
        required: false,
        default: null,
        trim: true,
    },
    language_code: {
        type: String,
        required: false,
        default: "eng",
        trim: true
    },
    bday: {
        type: String,
        required: false,
        default: null,
        trim: true
    },
    avatar: {
        type: String,
        required: false,
        default: './',
        trim: true
    },
    ref_key: {
        type: String,
        required: false,
        default: null
    },
    invited: {
        type: Boolean,
        required: false,
        default: false
    },
    DIV_balance: {
        type: Number,
        required: true,
        default: 0
    },
    rating: {
        type: Number,
        required: true,
        default: 0
    },
    last_visit: {
        type: Date,
        required: false,
        default: Date.now
    }
});
const AnswerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    date: {
        type: Date,
        default: Date.now(),
    },
    questions: {
        type: {},
        required: true
    },
    aiAnswer: {
        type: JSON,
        required: false,
        default: null,
    },
    userAnswer: {
        type: [String],
        required: false,
        default: null,
    }
});

const ReferralSchema = new mongoose.Schema({
    referrer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    referral: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    bonus: {
        type: Number,
        required: false
    }
});
const UserModel = new mongoose.model("Users", UserSchema);

ReferralSchema.index({ referrer: 1, referral: 1 }, { unique: true });
ReferralSchema.pre('save', async function (next) {
    try {
        const existingReferral1 = await mongoose.models.Referral.findOne({
            referrer: this.referrer,
            referral: this.referral
        });

        const existingReferral2 = await mongoose.models.Referral.findOne({
            referrer: this.referral,
            referral: this.referrer
        });

        if (existingReferral1 || existingReferral2) {
            return next(new Error('Referral already exists in either direction.'));
        }

        next();
    } catch (err) {
        next(err);
    }
});
const ReferralModel = new mongoose.model("Referral", ReferralSchema);

module.exports = {UserModel, ReferralModel};