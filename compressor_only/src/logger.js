const Redis = require("ioredis")
// const redis = new Redis('132.163.53.82');
const redis = new Redis();

// node-fetch v2
// const fetch = require('node-fetch');
// node-fetch v3
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

let busy = false;
setInterval(async () => {
    if (!busy) {
        busy = true;
        const channel = 'messages'
        let res = await fetch('http://localhost:3000/query/sensors')
        res = await res.text()
        const message = JSON.parse(res);

        let time = (new Date().getTime()) // Convert to seconds
        for (const key in message) {
            await redis.call('ts.add', key, time, message[key]);
        }
        message.time = time
        await redis.publish(channel, JSON.stringify(message));
        // console.log("Published %s to %s", message, channel);
        busy = false;
    }
}, 10000);
