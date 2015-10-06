
export default class {

    constructor(...args) {
        this.init(...args);
    }

    init(req, res, next) {
        this.req = req
        this.res = res
        this.next = next
        this.rq = req.rq
        this.startTime = Date.now()
    }

    model(){
        return D.model(this.rq.controller)
    }

    async __before(){}

    async __after(){}

    async invoke(action,...args){
        await this.__before()
        if (!this.res.headersSent) await this[action](...args)
        if (!this.res.headersSent) await this.__after()
    }
}