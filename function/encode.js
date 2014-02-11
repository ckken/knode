/**
 * Created by ken.xu on 14-1-27.
 */
var crypto = require('crypto');
module.exports = {
    md5: function (text,encoding) {
        //return crypto.createHash('md5').update(text).digest('hex');
        return crypto.createHash('md5').update(this.bufferStr(text)).digest(encoding || 'hex');
    },

    bufferStr:function(value) {
        return Buffer.isBuffer(value) ? value : this.toStr(value);
    },

    toStr:function (value) {
        return (value || value === 0) ? (value + '') : '';
    },


    d: function (crypted) {

        var decipher = crypto.createDecipher('aes-256-cbc', 123);
        var dec = decipher.update(crypted, 'hex', 'utf8')
        dec += decipher.final('utf8')
        return dec;


    },

    e: function (text) {
        var cipher = crypto.createCipher('aes-256-cbc', 123);
        var crypted = cipher.update(text, 'utf8', 'hex');
        crypted += cipher.final('hex');
        return crypted;


    }
}