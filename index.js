const express = require('express');

const app = express();
const { Telegraf } = require('telegraf');
var fs = require('fs');
const http = require('http');

var request = require('request');
app.get('/', (req, res) => {
  res.send('Hello Express app!')
});

app.listen(3000, () => {
  console.log('server started');
});

var token = "1086403371:AAG7LqtYyhq5UVNvArscsvb1g8ggfI0sZuc";

const bot = new Telegraf(token)
bot.start((ctx) => ctx.reply(`مرحبا بك في بوت نتائج السادس 2020
ارسل رقمك الامتحاني لعرض النتيجة`))
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.on('message', async function(ctx) {
  var text = ctx.message.text;
  if (isFinite(text)) {
    var url = "http://studentapi.earthlink.iq/api/search/";
    request.get({url:url + text, json:true}, async (err, resp, body) => {
      if (err) {
        console.log('error ', err);
        ctx.reply(`حصلت مشكلة في جلب البيانات !!`);
       }
       
       if (body) {
        await downloadPdf(body.url, `./pdf/${text}.pdf`);
        ctx.replyWithDocument({ source: `./pdf/${text}.pdf` , filename: `res_${text}.pdf` });
        fs.unlinkSync(`./pdf/${text}.pdf`);
       } else ctx.reply(`الرجاء التأكد من الرقم الامتحاني واعادة المحاولة`);
      
      
    })
  } else {
    ctx.reply(`ارسل الرقم الامتحاني المكون من ارقام فقط!!`);
  }
});
bot.launch();

async function downloadPdf(url, local) {
  return new Promise(resolve => {
    const file = fs.createWriteStream(local);
    const request2 = http.get(url, function(response) {
      response.pipe(file);
      response.on('end', resolve);
});
  });
}