/**
 * Created by ken on 15/10/3.
 */

export default class extends G.controller.base {


    init() {
        this.tVal = {}
    }


    display(...args) {
        let rq = this.req.rq
        let paths = args[0] || false
        if (paths) {
            paths = paths.split('/');
            switch (paths.length) {
                case 1:
                    rq.action = paths[0] || rq.action
                    break;
                case 2:
                    rq.controller = paths[0]
                    rq.action = paths[1]
                    break;
                case 3:
                    rq.module = paths[0]
                    rq.controller = paths[1]
                    rq.action = paths[2]
                    break;
            }
        }
        let view_path = rq.module + '/' + rq.controller + '/' + rq.action
        return this.res.render(view_path, this.tVal)
    }

    assign(name, val) {
        this.tVal[name] = val
    }

}