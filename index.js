const ith = require('@open-wa/wa-automate');
const moment = require('moment-timezone');
const reply = require('./reply');
moment.tz.setDefault('Asia/Jakarta').locale('id')
const processTime = (timestamp, now) => {return moment.duration(now - moment(timestamp * 1000)).asSeconds()}
const start = async (client) => {
    client.onStateChanged(state=>{
        console.log('statechanged', state)
        if(state==="CONFLICT" || state==="UNLAUNCHED") client.forceRefocus();
        if(state==='UNPAIRED') console.log('LOGGED OUT!!!!')
      });
    
	client.onMessage(async (message) => {      
        if (!message.body) return;
        if (!!reply.answer[message.body.toLowerCase()]) return client.reply(message.from, reply.answer[message.body.toLowerCase()],message.id)
        Object.keys(reply.notspecificanswer).forEach(e =>{if(message.body.toLowerCase().includes(e)) return client.reply(message.from, reply.notspecificanswer[e],message.id)})   
	});
};


const options = {
    sessionId: 'ithbot',
    multiDevice: true,
    headless: true,
    qrTimeout: 60,
    authTimeout: 0,
    restartOnCrash: start,
    cacheEnabled: false,
    useChrome: true,
    killProcessOnBrowserClose: true,
    throwErrorOnTosBlock: false,
    chromiumArgs: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--aggressive-cache-discard',
        '--disable-cache',
        '--disable-application-cache',
        '--disable-offline-load-stale-cache',
        '--disk-cache-size=0'
    ]
}

ith.create(options)
    .then((client) => start(client))
    .catch((err) => new Error(err))
