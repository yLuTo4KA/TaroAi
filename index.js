// init
const express = require('express');
const crypto = require('crypto');
const bodyParser = require('body-parser');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { UserModel, ReferralModel, TransactionModel, PurchaseModel, ItemModel } = require("./db");
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
            domain: 'taroai-546ac6a4db3b.herokuapp.com/payment/status',
            path: '/telegraf/' + process.env.WEBHOOK_SECRET
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

function getHoursPassed(lastIncomeDate, date) {
    const hoursPassed = Math.floor((date - lastIncomeDate) / (1000 * 60 * 60));
    return hoursPassed;
};

function calculateIncome(item, level, hoursPassed) {
    const maxHoursPassed = hoursPassed < 30 ? hoursPassed : 30;
    const incomePerHour = item.baseIncome + (level * item.incomePerLevel);

    const income = incomePerHour * maxHoursPassed;

    return income;
}

async function updateUserIncome(userId) {
    const purchases = await PurchaseModel.find({ user_id: userId }).populate("item_id");
    if (purchases) {
        for (const purchase of purchases) {
            const now = Date.now();
            const hoursPassed = getHoursPassed(purchase.lastIncome, now);
            if (hoursPassed > 0) {
                const income = calculateIncome(purchase.item_id, purchase.level, hoursPassed);

                await UserModel.findByIdAndUpdate(
                    userId,
                    { $inc: { DIV_balance: income } }
                )
                purchase.lastIncome = now;
                await purchase.save();
                return income;
            }
        }
    }
    return 0
}

async function updateItem(userId, itemId) {
    const item = await ItemModel.findById(itemId);
    const user = await UserModel.findById(userId);

    if (!item) {
        throw new Error('item not found');
    }
    if (item.price > user.DIV_balance) {
        throw new Error('Balance is low!');
    }

    let purchase = await PurchaseModel.findOne({ user_id: userId, item_id: itemId });

    if (!purchase) {
        purchase = new PurchaseModel({
            user_id: userId,
            item_id: itemId,
            level: 1,
            lastIncome: new Date()
        });

        await purchase.save();

        user.DIV_balance -= item.price;
        await user.save();
    } else if (purchase.level >= 5) {
        throw new Error('level max!!!')
    } else {
        purchase.level += 1;

        await purchase.save();
        user.DIV_balance -= item.price;
        await user.save();
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
            const now = Date.now();
            const userData = getUserData(initData);

            let existingUser = await UserModel.findOneAndUpdate({ id: userData.id }, { last_visit: now }, { new: true });
            const avatarUrl = await getUserAvatar(userData.id);
            const isPremium = userData.is_premium;

            if (!existingUser) {
                const refKey = generateRefKey(userData.id);
                const data = { ...userData, avatar: avatarUrl, ref_key: refKey }
                await UserModel.insertMany(data);
                let user = await UserModel.findOne({ id: userData.id });
                const token = generateToken(user);
                if (startParams && !user.invited) {
                    await addReferral(startParams, user.ref_key, isPremium ? 10 : 5);
                    user = await UserModel.findOne({ id: userData.id });
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
                const userIncome = await updateUserIncome(existingUser._id) || 0;
                if (userIncome) {
                    existingUser = await UserModel.findOneAndUpdate({ id: userData.id }, { last_visit: now }, { new: true });
                }
                const token = generateToken(existingUser);
                const user = await UserModel.findOne({id: existingUser.userData.id});
                res.status(200).json({
                    success: true, data: {
                        token: token,
                        userData: user,
                        income: userIncome
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
app.get('/profile/getProfile', verifyToken, async (req, res) => {
    try {
        const { _id } = req.user;
        const user = await UserModel.findOne({ _id: _id });

        res.status(200).json(user);
    } catch (e) {
        res.status(403).json({ message: "internal error", error: e })
    }
})

app.get('/profile/getPurchase', verifyToken, async (req, res) => {
    try {
        const userId = req.user._id;
        const purchases = await PurchaseModel.find({user_id: userId});
        
        res.status(200).json({purchases: purchases});
    } catch (e) {
        res.status(403).json({ message: "internal error", error: e });
    }
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

app.post('/payment/status/telegraf/:secret', async (req, res) => {
    const { secret } = req.params;
    if (secret !== process.env.WEBHOOK_SECRET) {
        return res.status(403).send("Forbidden");
    }

    try {
        const update = req.body;

        if (update.pre_checkout_query) {
            const { id, from, invoice_payload, shipping_option_id, order_info } = update.pre_checkout_query;
            const allGoodsAvailable = true;

            if (allGoodsAvailable) {
                await bot.telegram.answerPreCheckoutQuery(id, true);
            } else {
                await bot.telegram.answerPreCheckoutQuery(id, false, "Sorry, the item you wanted is no longer available. Please choose another item.");
            }
        } else if (update.message.successful_payment) {
            console.log(update.message);
            const { invoice_payload } = update.message.successful_payment;
            const paymentStatus = "Paid"
            const transaction = await TransactionModel.findOneAndUpdate(
                { _id: invoice_payload },
                { status: paymentStatus },
                { new: true }
            );
            await UserModel.updateOne({ _id: transaction.user_id }, { $inc: { DIV_balance: transaction.div_amount } });
        }

        res.status(200).json({ update });
    } catch (e) {
        console.error('Error handling payment or pre-checkout query:', e.message);
        res.status(500).send('Internal error');
    }
});

app.post('/shop/upgrade', verifyToken, async (req, res) => {

    try {
        const userId = req.user._id;
        const itemId = req.body.itemId;

        await updateItem(userId, itemId);

        res.status(200).json({message: "OK!"});
    } catch (e) {
        res.status(403).json({ message: "Error!", error: e })
    }
});

app.get('/shop/getItems', verifyToken, async (req, res) => {
    try {
        const items = await ItemModel.find({});
        if (items.length === 0) {
            throw new Error("No items");
        }
        res.status(200).json({shopItems: items});
    } catch (e) {
        res.status(403).json({ message: "Internal error", error: e });
    }
});



// code  123

// settings
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
    console.log('app listen to 3000');
    console.log(`App is listening on http://${HOST}:${PORT}`);
});