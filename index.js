const ith = require('@open-wa/wa-automate');
const moment = require('moment-timezone');
moment.tz.setDefault('Asia/Jakarta').locale('id')
const processTime = (timestamp, now) => {return moment.duration(now - moment(timestamp * 1000)).asSeconds()}

const start = async (client) => {

    client.onStateChanged(state=>{
        console.log('statechanged', state)
        if(state==="CONFLICT" || state==="UNLAUNCHED") client.forceRefocus();
        if(state==='UNPAIRED') console.log('LOGGED OUT!!!!')
      });
    
	client.onMessage(async (message) => {
        if (message.body.toLowerCase() === 'ping') {
            await client.sendText(message.from, `Pong ${processTime(message.t, moment())} S`);
          }
          
	});
};


const options = {
    sessionId: 'ithbot',
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
