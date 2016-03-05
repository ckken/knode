module.exports = {
    //schema:true,
    attributes: {
        /*"paySuccessTime":{type:'string'},
         "completeTime":{type:'string'},
         "createTime":{type:'string'},
         "modifyTime":{type:'string'}*/
    },
    //
    beforeCreate: function (values, cb) {
        console.log('beforeCreate',values)
        values.createTime = _.moment(values.createTime).format('YYYY-MM-DD HH:mm:ss')
        values.modifyTime = _.moment(values.modifyTime).format('YYYY-MM-DD HH:mm:ss')
        values.paySuccessTime = _.moment(values.paySuccessTime).format('YYYY-MM-DD HH:mm:ss')
        values.completeTime = _.moment(values.completeTime).format('YYYY-MM-DD HH:mm:ss')
        cb();
    },
    //
    beforeUpdate: function (values, cb) {
        console.log('beforeUpdate',values)
        values.createTime = _.moment(values.createTime).format('YYYY-MM-DD HH:mm:ss')
        values.modifyTime = _.moment(values.modifyTime).format('YYYY-MM-DD HH:mm:ss')
        values.paySuccessTime = _.moment(values.paySuccessTime).format('YYYY-MM-DD HH:mm:ss')
        values.completeTime = _.moment(values.completeTime).format('YYYY-MM-DD HH:mm:ss')
        cb();
    },
}