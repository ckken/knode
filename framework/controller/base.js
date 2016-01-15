export default class {

    constructor(req, res, next,...args) {
        this.req = req
        this.res = res
        this.next = next
        this.rq = req.rq
        this.startTime = Date.now()
        this.modelName = ''
        this.init(...args);

    }

    init(...args) {
    }

    model() {
        let modelName = this.modelName || this.rq.controller
        return D.model(modelName)
    }

    async __before() {
    }

    async __after() {
    }

    async invoke(action, ...args) {
        await this.__before()
        if (!this.res.headersSent) await this[action](...args)
        if (!this.res.headersSent) await this.__after()
    }


    json(data) {
        this.res.json(data)
    }
}