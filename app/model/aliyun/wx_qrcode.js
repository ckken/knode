/**
 * Created by ken on 15/9/15.
 */
module.exports = {
    schema:true,
    attributes: {
        qrcode:{type:'string',index:true,required:true}
        ,sid:{type:'integer',index:true}
        ,url:{type:'string'}
    }
}