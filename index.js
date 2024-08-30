// init
const express = require('express');
const crypto = require('crypto');
const bodyParser = require('body-parser');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { UserModel, ReferralModel, TransactionModel } = require("./db");
const { Telegraf } = require('telegraf');


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    next();
});

const bot = new Telegraf(process.env.BOT_TOKEN);
// bot.telegram.setWebhook('https://taroai-546ac6a4db3b.herokuapp.com/payment/status');


const expToken = '1d';


bot.start((ctx) => ctx.reply('welcome'));
bot.command('start', (ctx) => ctx.reply('ping'));

bot.launch(
    {
        webhook: {
            domain: 'https://taroai-546ac6a4db3b.herokuapp.com/payment/status',
            port: 88
        }
    }
);


app.get('/', (req, res) => {
    res.send('Tg mini app work1');
})

// func

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).send("Unauthorized: No token provided");
    }

    jwt.verify(token, process.env.SALT, (err, decoded) => {
        if (err) {
            return res.status(401).send("Unauthorized: Invalid token");
        }
        req.user = decoded;
        next();
    });
};
function checkTelegramAuth(initData) {
    const decoded = decodeURIComponent(initData);

    // Разделяем строки параметров и находим значение 'hash'
    const arr = decoded.split('&');
    const hashIndex = arr.findIndex(str => str.startsWith('hash='));
    const hash = arr.splice(hashIndex)[0].split('=')[1];


    // Удаляем параметр 'hash' из массива
    arr.sort((a, b) => a.localeCompare(b));

    // Создаем строку для проверки
    const dataCheckString = arr.join('\n');

    // Создаем HMAC-SHA-256 signature
    const secret = crypto.createHmac('sha256', 'WebAppData')
        .update(process.env.BOT_TOKEN)
        .digest();

    const computedHash = crypto.createHmac('sha256', secret)
        .update(dataCheckString)
        .digest('hex');

    // Сравниваем вычисленный хэш с полученным
    return computedHash === hash;
}
function getUserData(initData) {
    const parsedData = new URLSearchParams(initData);
    const userJson = decodeURIComponent(parsedData.get('user'));
    const user = JSON.parse(userJson);
    return user;

}
async function getUserAvatar(userId) {
    const userProfilePhotos = await bot.telegram.getUserProfilePhotos(userId);
    let avatarUrl = null;

    if (userProfilePhotos.total_count > 0) {
        const photo = userProfilePhotos.photos[0][0];
        const fileId = photo.file_id;

        const file = await bot.telegram.getFile(fileId);
        avatarUrl = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file.file_path}`;
    }
    return avatarUrl;
}
function generateToken(userData) {
    const userId = userData._id
    return jwt.sign({ _id: userId }, process.env.SALT, { expiresIn: expToken });
};
function generateRefKey(userId) {
    const randomPart = crypto.randomBytes(3).toString('hex');
    const userPart = Buffer.from(userId.toString()).toString('hex');
    return `${randomPart}-${userPart}`;
}
async function updateDIVbalance(userId, count) {
    await UserModel.updateOne(
        { _id: userId },
        { $inc: { DIV_balance: count } }
    )
}
async function addReferral(referrerKey, referralKey, bonus) {
    try {
        const referrer = await UserModel.findOne({ ref_key: referrerKey });
        const referral = await UserModel.findOne({ ref_key: referralKey });

        if (!referrer || !referral) {
            throw new Error('Referrer or referral user not found');
        }

        const refBonus = await ReferralModel.findOne({ referrer: referrer._id, referral: referral._id });

        if (referrer._id.equals(referral._id)) {
            throw new Error('Referrer and referral cannot be the same user');
        }

        if (!refBonus) {
            await ReferralModel.create({
                referrer: referrer._id,
                referral: referral._id,
                bonus: bonus
            });

            await UserModel.updateOne(
                { _id: referral._id },
                {
                    $set: { invited: true },
                    $inc: { DIV_balance: bonus }
                }
            );
            await updateDIVbalance(referrer._id, bonus);

            console.log('Referral added successfully');
        } else {
            console.log('Referral already exists');
        }
    } catch (e) {
        console.error('Error adding referral:', e.message);
    }
}

async function generateInvoiceLink(star_amount, div_amount, userId) {
    try {
        const transaction = await TransactionModel.create(
            {
                type: "Purchase",
                user_id: userId,
                date: Date.now(),
                star_amount: star_amount,
                div_amount: div_amount,
                currency: "XTR",
                status: "Pending"
            }
        )
        const invoice = {
            title: `${div_amount} Divinations token`,
            description: 'Divinations token - To be able to do a tarot reading in the app',
            payload: transaction._id.toString(),
            provider_token: '',
            currency: 'XTR',
            prices: [{ label: `Divinations token`, amount: star_amount }],
        }
        const invoiceLink = await bot.telegram.createInvoiceLink(invoice);
        return invoiceLink;
    } catch (e) {
        throw new Error(e);
    }
}



//open routes
app.post('/auth', async (req, res) => {
    try {
        const initData = req.body.initData;

        const parsedData = new URLSearchParams(initData);
        const startParams = decodeURIComponent(parsedData.get('start_param'));
        const verifyData = checkTelegramAuth(initData)

        if (verifyData) {
            const userData = getUserData(initData);
            const existingUser = await UserModel.findOne({ id: userData.id });
            const avatarUrl = await getUserAvatar(userData.id);
            const isPremium = userData.is_premium;

            if (!existingUser) {
                const refKey = generateRefKey(userData.id);
                const data = { ...userData, avatar: avatarUrl, ref_key: refKey }
                await UserModel.insertMany(data);
                const user = await UserModel.findOne({ id: userData.id });
                const token = generateToken(user);
                if (startParams && !user.invited) {
                    await addReferral(startParams, user.ref_key, isPremium ? 10 : 5);
                }
                res.status(200).json({
                    success: true, data: {
                        token: token,
                        userData: user
                    }
                })
            } else {
                if (existingUser.avatar !== avatarUrl) {
                    existingUser.avatar = avatarUrl;
                    await UserModel.updateOne(
                        { _id: existingUser._id },
                        { $set: { avatar: avatarUrl } }
                    )
                }
                if (startParams && !existingUser.invited) {
                    await addReferral(startParams, existingUser.ref_key, isPremium ? 10 : 5);
                }
                const token = generateToken(existingUser);

                res.status(200).json({
                    success: true, data: {
                        token: token,
                        userData: existingUser
                    }
                })
            }



        } else {
            res.status(403).json({ success: false, message: 'Fake data detected!' });
        }
    } catch (e) {
        res.status(404).json({ success: false, message: e.message });
    }
});



// closed routes
app.get('/getUser', verifyToken, async (req, res) => {
    const token = req.headers.authorization;
    const decodeToken = jwt.verify(token, process.env.SALT);
    const userId = decodeToken.id;

    const user = await UserModel.findOne({ id: userId })
    if (!user) {
        return res.status(404).json({ message: "No data!" });
    }
    res.status(200).json(user);
})

app.get('/getReferrals', verifyToken, async (req, res) => {
    try {
        const userId = req.user._id;

        const referrals = await ReferralModel.find({ referrer: userId }).populate('referral', 'username avatar -_id').select('referral bonus');
        const totalBonus = referrals.reduce((sum, referral) => sum + referral.bonus, 0);

        res.status(200).json({ referrals, totalBonus });
    } catch (e) {
        res.status(500).json({ message: 'Internal error', error: e.message })
    }
})

app.post('/payment/getLink', verifyToken, async (req, res) => {
    try {
        const userId = req.user._id;
        const starAmount = req.body.star_amount;
        const divAmount = req.body.div_amount;

        const link = await generateInvoiceLink(starAmount, divAmount, userId);
        res.status(200).json({ link: link });
    } catch (e) {
        res.status(404).json({ message: "Internal error", error: e });
    }
});
app.post('/payment/status', async (req, res) => {
    try {
        const update = req.body;
        console.log(update);

        if (update.invoice_payload && update.payment) {
            const transactionId = update.invoice_payload;
            const paymentStatus = update.payment.status;
            const transaction = await TransactionModel.findOneAndUpdate(
                { _id: transactionId },
                { status: paymentStatus },
                { new: true }
            )
            if (paymentStatus === 'paid') {
                await UserModel.updateOne({_id: transaction.user_id}, {$inc: {DIV_balance: transaction.div_amount}});
            }
        }
        res.status(200).json({update});
    } catch (e) {
        res.status(500).send('internal error');
    }
})

// code  123

// settings
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
    console.log('app listen to 3000');
    console.log(`App is listening on http://${HOST}:${PORT}`);
});