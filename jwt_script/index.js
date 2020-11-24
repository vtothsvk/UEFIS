const fs = require("fs")
const crypto = require("crypto")
const jwt = require("jsonwebtoken")

var args = process.argv.slice(2);
console.log('myArgs: ', args);

var privateKeyFile = './private.pem'
var publicKeyFile = './public.pem'
var deviceSerialNumber = "aaffccffee35ae92"

if (args.length >= 3)
  deviceSerialNumber = args[3]

if (args.length >= 2)
  privateKeyFile = args[1]

if (args.length >= 1)
  publicKeyFile = args[0]

var hash = calculatePublicKeySignature();

var newToken = generateToken();

console.log("SN: " + deviceSerialNumber)
console.log("SIGN: " + hash)
console.log("JWT: " + newToken)

function generateToken() {
  var jwtOptions = {
    algorithm: "ES256",
    keyid: hash,
    subject: deviceSerialNumber,
    expiresIn: 60 * 60 * 24
  };

  var privateKey = fs.readFileSync(privateKeyFile);
  var newToken = jwt.sign({}, privateKey, jwtOptions);
  return newToken;
}

function calculatePublicKeySignature() {
  var key = fs.readFileSync(publicKeyFile);
  var hash = crypto.createHash('sha256').update(key).digest('hex');
  return hash;
}
