export default class extends G.controller.base {


    get(){
        let id = this.req.params.id
        this.json({id:id})
    }


}