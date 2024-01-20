const path = require("path")
require("dotenv").config({path: path.join(__dirname, ".env")})
const { Scenes } = require("telegraf")
const fetch = require("node-fetch")
const crypto = require('crypto');
const { faker } = require('@faker-js/faker');


module.exports = new Scenes.WizardScene("surveyScene", 
    async ctx => {
        ctx.scene.session.state = { firstName: "", lastName: "", phoneNumber: "" }
        await ctx.reply("Здравствуйте! Спасибо, что подписались на наш бот. У нас вы сможете узнать об актуальных вакансиях нашей компании, а так же и о вакансиях от наших партнеров")
        await ctx.reply("Пожалуйста, ответьте на следующие вопросы, чтобы мы смогли подобрать для вас подходящие вакансии:")
        await ctx.reply("Являетесь ли вы гражданином РФ?", {reply_markup: {inline_keyboard: [[{text: "Да", callback_data: "russianCitizen"}, {text: "Нет", callback_data: "notRussianCitizen"}]]}})
        return ctx.wizard.next()
    },
    ctx => {
        if(!["russianCitizen", "notRussianCitizen"].includes(ctx?.callbackQuery?.data)) return ctx.reply("Выберите одну из кнопок")
        if(ctx.callbackQuery.data == "notRussianCitizen") {
            ctx.reply("Извините, но наши вакансии доступны только для граждан РФ, достигших 25 лет. Хорошего дня!")
            return ctx.scene.leave()
        }
        ctx.reply("Сколько вам лет?", {reply_markup: {inline_keyboard: [[{text: "до 18", callback_data: "до 18"}, {text: "18-24", callback_data: "18-24"}], [{text: "25-40", callback_data: "25-40"}, {text: "40+", callback_data: "40+"}]]}})
        return ctx.wizard.next()
    },
    ctx => {
        if(!["до 18", "18-24", "25-40", "40+"].includes(ctx?.callbackQuery?.data)) return ctx.reply("Выберите одну из кнопок")
        if(["до 18", "18-24"].includes(ctx.callbackQuery.data)) {
            ctx.reply("Извините, но наши вакансии доступны только для граждан РФ, достигших 25 лет. Хорошего дня!")
            return ctx.scene.leave()
        }
        ctx.reply("Какой уровень дохода в месяц Вас бы устроил?", {reply_markup: {inline_keyboard: [[{text: "5 000 - 10 000 рублей", callback_data: "5000-10000"}], [{text: "10 000 - 25 000 рублей", callback_data: "10000-25000"}], [{text: "25 000 - 50 000 рублей", callback_data: "25000-50000"}], [{text: "50 000 - 100 000 рублей", callback_data: "50000-100000"}], [{text: "100 000 рублей +", callback_data: "100000+"}]]}})
        return ctx.wizard.next()
    },
    ctx => {
        if(!["5000-10000", "10000-25000", "25000-50000", "50000-100000", "100000+"].includes(ctx?.callbackQuery?.data)) return ctx.reply("Выберите одну из кнопок")
        ctx.reply("В какой период дня вам больше всего хотелось бы работать?", {reply_markup: {inline_keyboard: [[{text: "Утром", callback_data: "Утром"}], [{text: "В обед", callback_data: "В обед"}], [{text: "Вечером", callback_data: "Вечером"}]]}})
        return ctx.wizard.next()
    },
    ctx => {
        if(!["Утром", "В обед", "Вечером"].includes(ctx?.callbackQuery?.data)) return ctx.reply("Выберите одну из кнопок")
        ctx.reply("Имели ли вы опыт в инвестировнии?", {reply_markup: {inline_keyboard: [[{text: "Да", callback_data: "withExp"}, {text: "Нет", callback_data: "withoutExp"}]]}})
        return ctx.wizard.next()
    },
    ctx => {
        if(!["withExp", "withoutExp"].includes(ctx?.callbackQuery?.data)) return ctx.reply("Выберите одну из кнопок")
        ctx.reply("Вы не хотели бы открыть свой собственный бизнес?", {reply_markup: {inline_keyboard: [[{text: "Да", callback_data: "Да"}], [{text: "Нет", callback_data: "Нет"}], [{text: "Скорее да, чем нет", callback_data: "Скорее да, чем нет"}]]}})
        return ctx.wizard.next()
    },
    ctx => {
        if(!["Да", "Нет", "Скорее да, чем нет"].includes(ctx?.callbackQuery?.data)) return ctx.reply("Выберите одну из кнопок")
        ctx.reply("Что из этих качеств, вам больше всего подходит?", {reply_markup: {inline_keyboard: [[{text: "Исполнительность", callback_data: "Исполнительность"}], [{text: "Внимательность к деталям", callback_data: "Внимательность к деталям"}], [{text: "Умение работать в команде", callback_data: "Умение работать в команде"}], [{text: "Инициативность", callback_data: "Инициативность"}], [{text: "Коммуникабельность", callback_data: "Коммуникабельность"}]]}})
        return ctx.wizard.next()
    },
    async ctx => {
        if(!["Исполнительность", "Внимательность к деталям", "Умение работать в команде", "Инициативность", "Коммуникабельность"].includes(ctx?.callbackQuery?.data)) return ctx.reply("Выберите одну из кнопок")
        await ctx.reply("Спасибо за уделенное время и пройденный опрос! Мы подобрали для вас больше 10 вакансий и отправим ваши ответы работодателям, если кто-то одобрит вашу кандидатуру, мы с вами свяжемся. Пожалуйста, напишите ваше имя, фамилию и номер телефона.")
        await ctx.reply("Как вас зовут (имя)?")
        return ctx.wizard.next()
    },
    ctx => {
        if(!ctx?.message?.text) return ctx.reply("Введите пожалуйста имя текстом")
        ctx.scene.session.state.firstName = ctx.message.text
        ctx.reply("Отлично, теперь введите пожалуйста фамилию")
        return ctx.wizard.next()
    },
    ctx => {
        if(!ctx?.message?.text) return ctx.reply("Введите пожалуйста фамилию текстом")
        ctx.scene.session.state.lastName = ctx.message.text
        ctx.reply("Теперь пожалуйста отправьте номер телефона\nПример: +78005555535")
        return ctx.wizard.next()
    },
    ctx => {
        if(!ctx?.message?.text) return ctx.reply("Введите пожалуйста номер телефона текстом")
        if(!validatePhoneNumber(ctx.message.text)) return ctx.reply("Пожалуйста введите номер телефона в правильном формате (+78005555535)")
        ctx.scene.session.state.phoneNumber = ctx.message.text
        ctx.replyWithPhoto("AgACAgIAAxkBAAMGZaqyo7YPQB6_lRQ1vo0jczyVuWkAAsbhMRsy7VFJEvPs0Nm09_4BAAMCAAN5AAM0BA", {caption: "Спасибо! Как только работодатели рассмотрят вашу кандидатуру, с вами сразу свяжутся. Успехов вам и хорошего дня!"})
        console.log(ctx.scene.session.state)
        const { firstName, lastName, phoneNumber } = ctx.scene.session.state
        saveToCRM(phoneNumber, firstName, lastName, generateRandomEmail())
        return ctx.scene.leave()
    }
)

function validatePhoneNumber(phoneNumber) {
    const phoneRegex = /^\+\d{11}$/;
    return phoneRegex.test(phoneNumber);
}

async function saveToCRM(phoneNumber, firstName, lastName, email) {
    var res = await fetch(new URL(`http://doza-traffic.com/api/wm/push.json?id=${process.env.apiToken}&offer=1&flow=214&site=272&phone=${phoneNumber}&name=${firstName}&last=${lastName}&email=${email}`))
    console.log(await res.json());
}

function generateRandomEmail() {
    const randomName = faker.internet.userName();
    const randomDomain = faker.internet.domainName();
    const randomHash = crypto.randomBytes(8).toString('hex');
    return `${randomName}_${randomHash}@${randomDomain}`;
}
