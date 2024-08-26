// init
const express = require('express');
const crypto = require('crypto');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { UserModel } = require("./db");
const { Telegraf } = require('telegraf');


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    next();
});

const bot = new Telegraf(process.env.BOT_TOKEN);


const expToken = '1d';


bot.start((ctx) => ctx.reply('welcome'));
bot.command('start', (ctx) => ctx.reply('ping'));

bot.launch();

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
    return jwt.sign(userData, process.env.SALT, { expiresIn: expToken });
};
function generateRefKey(userId) {
    const randomPart = crypto.randomBytes(3).toString('hex');
    const userPart = Buffer.from(userId.toString()).toString('hex');
    return `${randomPart}-${userPart}`;
}
function getRefLink(refKey) {
    const refLink = `https://t.me/${process.env.BOT_NAME}/${process.env.BOT_START}?startapp=${refKey}`;
    return refLink;
}



//open routes
app.post('/auth', async (req, res) => {
    const initData = req.body.initData;

    if (checkTelegramAuth(initData)) {

        const userData = getUserData(initData);
        const existingUser = await UserModel.findOne({ id: userData.id });
        const token = generateToken(userData);
        const refKey = generateRefKey(userData.id);
        const avatarUrl = await getUserAvatar(userData.id);

        if (!existingUser) {
            const data = {...userData, avatar: avatarUrl, ref_key: refKey}
            await UserModel.insertMany(data);
            const user = await UserModel.findOne({ id: userData.id });
            res.status(200).json({
                success: true, data: {
                    token: token,
                    userData: user
                }
            })
        }else {
            if(existingUser.avatar !== avatarUrl) {
                console.log('avatar upd!');
                existingUser.avatar = avatarUrl;
            }
            
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
});



// closed routes
app.get('/getUser', verifyToken, async(req, res) => {
    const token = req.headers.authorization;
    const decodeToken = jwt.verify(token, process.env.SALT);
    const userId = decodeToken.id;

    const user = await UserModel.findOne({id: userId})
    if(!user) {
        return res.status(404).json({message: "No data!"});
    }
    console.log(getRefLink(user.ref_key));
    res.status(200).json(user);
})



// settings
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
    console.log('app listen to 3000');
    console.log(`App is listening on http://${HOST}:${PORT}`);
});