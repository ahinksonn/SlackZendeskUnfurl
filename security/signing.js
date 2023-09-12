const axios = require("axios");
const crypto =require("crypto")
// Get Signing Secret
const signing = process.env.SIGNING_SECRET;

function verify(recSig,ts,body) {
  // log the received signature
  // console.log("Incoming signature:");
  // console.log(recSig)
  // generate the expected signature base string
  var sig = "v0:" + ts + ":" + JSON.stringify(body, {format: 'RFC1738'}).replaceAll('/', "\\/")
  // console.log("base:");
  // console.log(sig)
  // encrypt the signature
  var encrypt = "v0="+crypto.createHmac('sha256', signing)
  .update(sig, 'utf8')
  .digest('hex')
  // console.log("Calculated signature:")
  // console.log(encrypt)
  // compare the signatures
  if (crypto.timingSafeEqual(Buffer.from(recSig, "utf-8"), Buffer.from(encrypt, "utf-8"))) {
    // console.log("Signature Match")
    return true
  } else {
    // console.log("Signature Mismatch")
    // console.log("body")
    // console.log(sig)
    return false
  }
};

module.exports = { verify }