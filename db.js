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
        ref: 'User',
        required: true
    },
    referral: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bonus: {
        type: mongoose.Schema.Types.Decimal128,
        required: false
    }
}, {
    unique: true,
    index: {
        fields: {
            referrer: 1,
            referral: 1
        },
        unique: true
    }
});
const UserModel = new mongoose.model("Users", UserSchema);
const ReferralModel = new mongoose.model("Referral", ReferralSchema);

module.exports = {UserModel, ReferralModel};