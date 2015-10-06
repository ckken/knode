/**
 * Created by ken on 15/10/3.
 */
export default class extends G.controller.base {

    init(req, res, next) {
        console.log('restCrud')
        super.init(req, res, next)
        this.pageSet = {
            pageSize: 10,
            page: 1,
            sort: 'desc',
            order: 'id'
        }
    }


    async get() {
        //
        var order = this.req.query.order || this.pageSet.order
        var sort = this.req.query.sort || this.pageSet.sort
        var orderby = {}

        this.pageSet.page = this.req.query.page || this.pageSet.page
        this.pageSet.pageSize = this.req.query.pageSize || this.pageSet.pageSize

        orderby[order] = sort
        let paginates = {
            page: this.pageSet.page,
            limit: this.pageSet.pageSize
        }

        //
        let map = this.req.map || {}
        let data = {}
        let rs = {}
        rs.code = 0
        //
        if (this.req.params.id) {
            map.id = this.req.params.id
            data = await this.model().findOne(map).toPromise()
        } else {
            rs.page = this.pageSet.page
            rs.pageSize = this.pageSet.pageSize
            rs.total = await this.model().count(map).toPromise()
            data = await this.model().find(map).paginate(paginates).sort(orderby).toPromise()
        }
        rs.data = data
        this.json(rs)
    }

    async post(req, res, next) {
        var data = req.body || {}
        var rs = await this.model().create(data).toPromise()
        this.json(rs)
    }

    async put(req, res, next) {
        var map = (this.req.params.id) && {id: this.req.params.id} || {}
        var data = req.body || {}
        map = _.extend(data, map)
        var rs = {
            code: 0,
            data: await this.model().update(map, data).toPromise()
        }
        this.json(rs)

    }

    async delete(req, res, next) {

        var map = (this.req.params.id) && {id: this.req.params.id} || {}
        var data = req.body || {}
        map = _.extend(data, map)
        var rs = {
            code: 0,
            data: await this.model().destroy(map).toPromise()
        }
        this.json(rs)
    }

    json(data) {
        this.res.json(data)
    }

}