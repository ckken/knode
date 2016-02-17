import request from 'request'
//Promise.promisifyAll(request)



//let today1 = _.moment().format('YYYY-MM-DD')+'+00%3A00%3A00'
//let today2 = _.moment().format('YYYY-MM-DD')+'+23%3A59%3A59'

let today1 = _.moment().subtract(0, "days").startOf("day").format('YYYY-MM-DD HH:mm:ss')
let today2 = _.moment().subtract(0, "days").endOf("day").format('YYYY-MM-DD HH:mm:ss')

function setDay(day=0){
    today1 = _.moment().subtract(day, "days").startOf("day").format('YYYY-MM-DD HH:mm:ss')
    today2 = _.moment().subtract(day, "days").endOf("day").format('YYYY-MM-DD HH:mm:ss')
}
/**
 * moment().subtract(1, "days").startOf("day"), moment().subtract(1, "days").endOf("day")
 * moment().startOf("day"), moment().endOf("day")
 * moment().startOf("week"), moment().endOf("week")
 * @type {string}
 */

let sourceUrl = 'http://m.yolipai.cn/source/sendLog/sendLogList'
let payUrl = 'http://pay-api.yolipai.com/trade/recordList'
let token = 'eyJraWQiOiJrMSIsImFsZyI6IlJTMjU2In0.eyJpc3MiOiJ0ZXN0IiwiYXVkIjoidGVzdCIsImV4cCI6MTQ1NDc3OTMyNCwianRpIjoiVnZWWDFHeERjb0YtYzF0czVwWG9xdyIsImlhdCI6MTQ1NDc3NTcyNCwibmJmIjoxNDU0Nzc1NjY0LCJzdWIiOiJzdWJqZWN0IiwieWxwRW50ZXJwcmlzZVJvbGUiOiJCVVNJTkVTUyIsInVzZXJJZCI6IjEwMDMwNCIsInVzZXJBY2NvdW50Tm8iOiI4ODg4MjAxNjAxMTUxMDAwMDM0NCIsInVzZXJOYW1lIjoieWxwenlnbHkiLCJtZXJjaGFudElkIjoiNiIsInVzZXJSb2xlIjoiWllaIiwiaXNCaW5kaW5nRXJwIjoiIiwieWxwRW50ZXJwcmlzZUFjb3VudE5vIjoiRTg4ODIwMTUxMjE3MTAwMDAwNDYiLCJhdWRpZW5jZSI6InRlc3QifQ.U72sM7KUeEbNvqbvGavQyCv6aLUzzIKaAKEw_CbpWl6YCcUO1MH5hMgIBLJuEXjbiVYkLQF9YQnjL9YWEmd_7Z24uVu1E_dIPKIoHNyHHK_WksMgZ1pIxlh3GWa4ZXZ32TvOO6aNaGdhpGRrNZF5fUpjOlJ0omIilIGDD83hVShwxuxxICtp-oHuOSX521jPU8oyJPAroFYkBTa-W_jSyWSnZFfYaBcgdI1RtOPUfc5mYu7vnoVJQ6Z7zg7NKqAf7L86beyLhTtZeZCj71erWLewdGwA_b1F1Z7IWucq2Yd6-zbFGM2C9lWxrgOBvbaDsD229OOEQSk8bQBGn_RNKg'

let refreshToken = 'eyJraWQiOiJrMSIsImFsZyI6IlJTMjU2In0.eyJpc3MiOiJ0ZXN0IiwiYXVkIjoidGVzdCIsImp0aSI6ImU2azd5czlnc1dRc0o1bC1ZOHFTd1EiLCJpYXQiOjE0NTQ3NzIxMTQsIm5iZiI6MTQ1NDc3MTk5NCwic3ViIjoic3ViamVjdCIsInlscEVudGVycHJpc2VSb2xlIjoiQlVTSU5FU1MiLCJ1c2VySWQiOiIxMDAzMDQiLCJ1c2VyQWNjb3VudE5vIjoiODg4ODIwMTYwMTE1MTAwMDAzNDQiLCJ1c2VyTmFtZSI6InlscHp5Z2x5IiwibWVyY2hhbnRJZCI6IjYiLCJ1c2VyUm9sZSI6IlpZWiIsInlscEVudGVycHJpc2VBY291bnRObyI6IkU4ODgyMDE1MTIxNzEwMDAwMDQ2IiwiYXVkaWVuY2UiOiJ0ZXN0In0.HmqFiHPChDxyqWIDhxY1qcTCZP69A1pecKty9IJ1GfR_90ij_b4-xbtNa6EGgNnOVqrY7Fq0SG1Wii0fQG1gIR7dGW6wppbg0aWP6rRQYAGKO3QJ_PQuez1yioe6XIyx-IbS0fngRvfkSKYwaS3TY1Hb7RSJGH5h-Y-A5qNjwz5ZiD7Xt9-e4jmd0xsWPOdF2y7Lf0QRDbk8cjnxFZndXgT0dhVQGrMk-XzpeLcx9o9oGjjRMOAGEBMmshAmhalrBKZ9a63Pj3XHhL7bpQPDzyMSNXrbi-5ziVNpANwxBOT6yFd0D-eXvYw8no1bKWkHN5P-Mp1sz2qHJWvmC7y8OQ'

function urlEncode(url,params){
    url =  url+'?'
    _.forEach(params,function(v,k){
        url+='&'+k+'='+v
    })
    return url
}
//红包推送
let sourceRedPackUrl = function(){
   return urlEncode(sourceUrl,{
        startDate:today1,
        endDate:today2,
        state:'EXCHANGE',
        giftType:2,
        page:1,
        pageSize:10
    })
}
let RedPackSumUrl = function(){
    return urlEncode(sourceUrl,{
        startDate:today1,
        endDate:today2,
        giftType:2,
        page:1,
        pageSize:10
    })
}
// 推送礼品数
let sourceListUrl = function(){
   return  urlEncode(sourceUrl,{
        startDate:today1,
        endDate:today2,
        state:'EXCHANGE',
        giftType:1,
        page:1,
        pageSize:10
    })
}

let sourceSumUrl = function(){
    return  urlEncode(sourceUrl,{
        startDate:today1,
        endDate:today2,
        giftType:1,
        page:1,
        pageSize:10
    })
}

//支付成功数
let payListUrl = function(){
    return urlEncode(payUrl,{
        beginTime:today1,
        endTime:today2,
        status:'SUCCESS',
        page:1,
        pageSize:10
    })
}





function getData(url){
    //console.log(token)
    return new Promise((resolve,reject) => {

        request({
            url:url,
            headers: {'token': token}
        },(error, response, body)=>{
            if (!error && response.statusCode == 200) {
                let d = JSON.parse(body);
               // console.log(url,body)
                resolve(d)
            }else{
               // console.log(error)
                reject(error)
            }
        })
    })

}

let tokenId = false
function reloadToken(){

    if(tokenId) {
        request({
            url: 'http://m.yolipai.cn/accounts/refresh',
            method: 'PUT',
            headers: {'token': token},
            form: {'token': token, refreshToken: refreshToken}
        }, (error, response, body)=> {
            if (!error && response.statusCode == 200) {
                let d = JSON.parse(body);
                if(d.code==0) {
                    D.model('sys_token').update({id: tokenId}, {
                        token: d.data.token,
                        refreshToken: d.data.refreshToken
                    }).exec(function (e, d) {
                        console.log('reflash', e, d)
                    })
                }
            }
        })
    }
}

let refreshTokenID = setInterval(async ()=>{
    reloadToken()
},600000);

module.exports =  async (io) => {


    let sysToken = await D.model('sys_token').find().toPromise()
    sysToken = sysToken[0]||{}
    if(sysToken.token){
        token = sysToken.token
        refreshToken = sysToken.refreshToken
    }else{
        sysToken = await D.model('sys_token').create({token:token,refreshToken:refreshToken}).toPromise()
        sysToken = sysToken[0]||{}
    }
    tokenId = sysToken.id


    async function getCount(day=0){
        console.log('getCount',Date.now())
        setDay(day)
        let d =  await Promise.all([
            getData(sourceRedPackUrl()),
            getData(sourceListUrl()),
            getData(payListUrl()),
            getData(sourceSumUrl()),
            getData(RedPackSumUrl()),
        ])

        //console.log(d)
        return {
            redPack:d[0].data.total,
            source:d[1].data.total,
            order:d[2].data.total,
            money:Math.round(d[2].data.summary*100)/100,
            sum_source:d[3].data.total,
            sum_redPack:d[4].data.total
        }
    }

    let SC = io.of('/payCount');

    console.log('payCount')

    let cacheData = {}
    let chooseDay = 0
    cacheData[chooseDay] = await getCount(chooseDay)||{}
    setInterval(async ()=>{
        console.log(chooseDay)
        cacheData[chooseDay] = await getCount(chooseDay)
    },20000)

    let memberList= []
    let openIds = []

    SC.on('connection', async (socket)=> {

        socket.emit('payCount',cacheData)
        socket.on('setDay',async (day)=>{
            chooseDay = parseInt(day)||0
            cacheData[chooseDay] = cacheData[chooseDay]||await getCount(chooseDay)
            socket.emit('payCount',cacheData)
        })

        socket.setID = setInterval(async ()=>{
            //cacheData[chooseDay] = await getCount(chooseDay)
            socket.emit('payCount',cacheData)
        },20000);


        socket.on('member_join',(d)=>{
            d = d.member
            let user = {
                nickname:d.nickname,
                headimgurl:d.headimgurl,
                openid:d.openid
            }

            if(openIds.indexOf(user.openid)===-1){
                memberList.push(user)
                openIds.push(user.openid)
            }
            socket.user = user
            socket.emit('member_join',memberList)
            socket.broadcast.emit('member_join',memberList)
        })

        socket.on('disconnect', async  ()=> {
            clearInterval('socket.setID');
            //let index =memberList.indexOf(socket.user)
            //console.log(memberList,index)
            memberList.forEach((v,k)=>{
                if(socket.user.openid == v.openid) {
                    memberList.splice(k, 1)
                    openIds.splice(k,1)
                }
            })
            socket.emit('member_join', memberList)
            socket.broadcast.emit('member_join', memberList)


        })
    })
}