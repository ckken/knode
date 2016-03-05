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
        values.createTime = _.moment(values.createTime).format('YYYY-MM-DD HH:mm:ss')
        values.modifyTime = _.moment(values.modifyTime).format('YYYY-MM-DD HH:mm:ss')
        values.paySuccessTime = _.moment(values.paySuccessTime).format('YYYY-MM-DD HH:mm:ss')
        values.completeTime = _.moment(values.completeTime).format('YYYY-MM-DD HH:mm:ss')
        console.log('beforeCreate',JSON.stringify(values))
        cb();
    },
    //
    beforeUpdate: function (values, cb) {
        values.createTime = _.moment(values.createTime).format('YYYY-MM-DD HH:mm:ss')
        values.modifyTime = _.moment(values.modifyTime).format('YYYY-MM-DD HH:mm:ss')
        values.paySuccessTime = _.moment(values.paySuccessTime).format('YYYY-MM-DD HH:mm:ss')
        values.completeTime = _.moment(values.completeTime).format('YYYY-MM-DD HH:mm:ss')
        console.log('beforeUpdate',JSON.stringify(values))
        cb();
    },
}