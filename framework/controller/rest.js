/**
 * Created by ken on 15/10/3.
 */
export default class extends G.controller.base {

    init(){
        this._map = {}//自定义条件
    }

    async get(op={}) {
        this.pageSet = {
            pageSize: 10,
            page: 1,
            sort: 'desc',
            order: 'id',
            cb:false,
            findOne:false,
        }
        //
        let order = this.req.query.order || this.pageSet.order
        let sort = this.req.query.sort || this.pageSet.sort
        let orderby = {}

        this.pageSet.page = this.req.query.page || this.pageSet.page
        this.pageSet.pageSize = this.req.query.pageSize || this.pageSet.pageSize

        orderby[order] = sort
        let paginates = {
            page: this.pageSet.page,
            limit: this.pageSet.pageSize
        }

        let rs = {}
        rs.code = 0
        //
        if (op.findOne) {
            this._map.id = this._map.id || this.req.params.id
            rs.data = await this.model().findOne(this._map).toPromise()
        } else {
            rs.data = {
                page: this.pageSet.page,
                pageSize: this.pageSet.pageSize,
                total: await this.model().count(this._map).toPromise(),
                pageData: (!op.populate)&&
                await this.model().find(this._map).paginate(paginates).sort(orderby).toPromise()||
                await this.model().find(this._map).paginate(paginates).sort(orderby)
                    .populate(op.populate.model,{select:op.populate.select})
                    .toPromise()
            }
        }
        if(!op.cb){
            this.json(rs)
        }else{
            return rs
        }
    }

    async post() {
        let post = this.req.body || {}
        let rs = {
            code: 0,
            data: await this.model().create(post).toPromise()
        }

        this.json(rs)
    }

    async put() {

        //this._map = this._map ||((this.req.params.id) && {id: this.req.params.id})
        this._map = _.extend(this._map,{id: this.req.params.id})
        let post = this.req.body || {}
        let rs = {
            code: 0,
            data: await this.model().update(this._map, post).toPromise()
        }
        this.json(rs)
    }

    async delete() {
        this._map = this._map ||((this.req.params.id) && {id: this.req.params.id})
        var rs = {
            code: 0,
            data: await this.model().destroy(this._map).toPromise()
        }
        this.json(rs)
    }

    json(data) {
        this.res.json(data)
    }

}