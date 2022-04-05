const Redis = require("ioredis")
const redis = new Redis();
// node-fetch v2
// const fetch = require('node-fetch');
// node-fetch v3
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function main() {
    let res = await fetch('http://localhost:3000/query/sensors')
    res = await res.text()
    res = JSON.parse(res);
    // console.log(res);
    if (await redis.exists('plot_keys') == 1) {
        console.log('delete existing plot_keys')
        await redis.del('plot_keys');
    }
    if (await redis.exists('table_keys') == 1) {
        console.log('delete existing table_keys')
        await redis.del('table_keys');
    }
    for (const key in res) {
        await redis.rpush('plot_keys', key)
        await redis.rpush('table_keys', key)
        await redis.call('ts.create', key)
	    console.log('rpush into plot_keys and table_keys', key);
    }

    redis.disconnect()
}
main()
