//Sean Spink
const redis = require('redis');

const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = process.env.REDIS_PORT || '6379';

const redisClient = redis.createClient(redisPort, redisHost);

const rateLimitWindowMS = 60000;
const rateLimitNumRequests = 5;

function getUserTokenBucket(ip){
  return new Promise((resolve, reject) => {
    redisClient.hgetall(ip, (err, tokenBucket) => {
      if(err){
        reject(err);
      } else {
        if(tokenBucket){
          tokenBucket.tokens=parseFloat(tokenBucket.tokens);
        } else {
          tokenBucket = {
            tokens: rateLimitNumRequests,
            last: Date.now()
          };
        }
        resolve(tokenBucket);
      }
    });
  });
}

function saveUserTokeBucket(ip, tokenBucket){
  return new Promise((resolve, reject) => {
    redisClient.hmset(ip, tokenBucket, (err, resp) => {
      if(err){
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

async function applyRateLimit(req, res, next){
  try {
    const tokenBucket = await getUserTokenBucket(req.ip);
    const timestamp = Date.now();
    const ellapsedTime = timestamp - tokenBucket.last;
    const newTokens = ellapsedTime * (rateLimitNumRequests / rateLimitWindowMS);
    tokenBucket.tokens += newTokens;
    tokenBucket.tokens = Math.min(tokenBucket.tokens, rateLimitNumRequests);
    tokenBucket.last = timestamp;
    
    if(!tokenBucket.tokens >= 1){
      tokenBucket.tokens -= 1;
      await saveUserTokeBucket(req.ip, tokenBucket);
      next();
    } else {
      res.status(429).send({
        error: "Too many requests per minute"
      });
    }
  } catch (err) {
    console.error(err);
    next();
  }
  next();
}

exports.applyRateLimit = applyRateLimit;
