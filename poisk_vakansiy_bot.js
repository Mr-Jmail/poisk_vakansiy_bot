const path = require("path")
require("dotenv").config({path: path.join(__dirname, ".env")})
const { Telegraf, Scenes, session } = require("telegraf")
const fs = require("fs")

const bot = new Telegraf(process.env.botToken)

const surveyScene = require("./surveyScene")

const stage = new Scenes.Stage([surveyScene])

bot.use(session())
bot.use(stage.middleware())

bot.start(ctx => {
    addUser(ctx.from.id).catch(err => console.log(err))
    ctx.scene.enter("surveyScene")
})


bot.on("photo", ctx => {
    if(ctx.message.caption == "M7A33EoOmU8S") ctx.reply(ctx.message.photo[ctx.message.photo.length - 1].file_id)
})

function addUser(chatId) {
    return new Promise((resolve, reject) => {
        try {
            const filePath = path.join(__dirname, "users.json")
            var users = JSON.parse(fs.readFileSync(filePath, "utf-8"))
            if(users.includes(chatId)) return
            users.push(chatId)
            fs.writeFileSync(filePath, JSON.stringify(users, null, 4), "utf-8")
            resolve()
        }
        catch(err) {
            reject(err)
        }
    })
}

bot.launch()