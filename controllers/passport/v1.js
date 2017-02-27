/**
 * Created by yuliang on 2017/1/9.
 */

"use strict"


module.exports = {
    login: function *() {
        var userId = this.checkBody("userId").notEmpty().value;
        var passWord = this.checkBody("passWord").notEmpty().value;
        this.errors && this.validateError()

    },
    logout: function *() {

    }
}

function encryptByDES(message, key) {
    var keyHex = CryptoJS.enc.Utf8.parse(key);
    var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
}

var crypto = require('crypto')

function test_des(param) {
    var key = new Buffer(param.key);
    var iv = new Buffer(param.iv ? param.iv : 0);
    var plaintext = param.plaintext
    var alg = param.alg
    var autoPad = param.autoPad

    //encrypt
    var cipher = crypto.createCipheriv(alg, key, iv);
    //cipher.setAutoPadding(autoPad)  //default true
    var ciph = cipher.update(plaintext, 'utf8', 'base64');
    ciph += cipher.final('base64');

    console.log(alg, ciph)

    //decrypt
    // var decipher = crypto.createDecipheriv(alg, key, iv);
    // cipher.setAutoPadding(autoPad)
    // var txt = decipher.update(ciph, 'hex', 'utf8');
    // txt += decipher.final('utf8');
    //assert.equal(txt, plaintext, 'fail');
}

// test_des({
//     alg: 'des-ede3-cbc',    //3des-cbc
//     autoPad: false,
//     key: '0123456789abcd0123456789',
//     plaintext: '1234567812345678',
//     iv: '12345678'
// })
//
// test_des({
//     alg: 'des-ede3',    //3des-ecb
//     autoPad: false,
//     key: '0123456789abcd0123456789',
//     plaintext: '1234567812345678',
//     iv: null
// })


//console.log(new Buffer("1234567812345678").toByteArray())
//console.log(new Buffer("0123456789abcd0123456789").toByteArray())

//console.log(new Buffer("4c398b6d89f44d2f0e5bf06cd929c48227809924").toByteArray())


// crypto.pbkdf2('0123456789abcd0123456789', new Buffer([]), 1, 24, function (err, hash) {
//     if (err) {
//         throw err;
//     }
//     console.log(hash.toByteArray());
//     hash = new Buffer(hash).toString('hex');
// })
