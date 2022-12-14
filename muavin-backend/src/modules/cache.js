const Redis = require("ioredis");
const redis = new Redis();

async function listKeys() {
    keys("*").then((result) => {
        console.log(`Redis keys : ${JSON.stringify(result, null, 2)}`);
    })
}
//listKeys();

async function keys(pattern) {
    return redis.keys(pattern);
}

async function exists(key) {
    return redis.exists(key);
}

async function save(key, data, ttl) {
    if (ttl) {
        return redis.set(key, data, "EX", ttl);
    } else {
        return redis.set(key, data);
    }
}

async function retrieve(key) {
    return redis.get(key);
}

async function flushall() {
    return redis.flushall();
}

module.exports = {
    exists,
    save,
    retrieve,
    flushall
}