import fs from '../utils/fs'
import cors from 'cors'

module.exports = (app)=> {
    //restful 方法
    var Func = async (req, res, next)=> {
        req.rq = {}
        req.rq.module = req.params.module || G.web.module
        req.rq.controller = req.params.controller || G.web.controller
        req.rq.action = req.params.action || G.web.action
        var id = req.params.id
        if (!req.params.action && !(req.url === '/')) {
            switch (req.method) {
                case 'GET':
                    req.rq.action = 'get';
                    break;
                case 'POST':
                    req.rq.action = 'post';
                    break;
                case 'PUT':
                    req.rq.action = 'put';
                    break;
                case 'DELETE':
                    req.rq.action = 'delete';
                    break;
            }
        }

        if (req.isApi) {
            var load_file_path = G.path.api + '/' + req.rq.module + '/' + req.rq.controller
        } else {
            var load_file_path = G.path.module + '/' + req.rq.module + '/' + req.rq.controller
        }
        //console.log(load_file_path)
        var check = await fs.exists(load_file_path + '.js')
        if (check) {
            try {
                let cls = require(load_file_path)
                cls = new cls(req, res, next)
                await cls.invoke(req.rq.action)

            } catch (e) {
                next(e)
            }

        } else {
            next('找不到相应资源')
        }
    }

    var restFunc = ()=> {
        return (req, res, next)=> {
            req.isApi = true
            return Func(req, res, next)
        }
    }

    app.get('/', Func)


    //G.system_mod = G.system_mod ||[]
    //console.log(G.system_mod)
    if(G.system_mod.indexOf('api')>-1 && G.system_mod.indexOf('module') >-1) {

        app.options('/*', cors())
        app.get('/' + G.rest + '/:module/:controller', cors(), restFunc())
        app.get('/' + G.rest + '/:module/:controller/:id', cors(), restFunc())
        app.post('/' + G.rest + '/:module/:controller', cors(), restFunc())
        app.put('/' + G.rest + '/:module/:controller/:id', cors(), restFunc())
        app.delete('/' + G.rest + '/:module/:controller/:id', cors(), restFunc())
        app.put('/' + G.rest + '/:module/:controller', cors(), restFunc())
        app.delete('/' + G.rest + '/:module/:controller', cors(), restFunc())
        //
        app.all('/' + G.rest + '/:module/:controller/:id/:action', cors(), restFunc())
        app.all('/' + G.rest + '/:module/:controller/:id/:action/:actionId', cors(), restFunc())
        //刷新页面模型
        app.options('/:module/:controller/:action', cors())
        app.get('/:module/:controller/:action', cors(), Func)
        app.get('/:module/:controller/:action/:id', cors(), Func)
        app.post('/:module/:controller/:action', cors(), Func)
        app.post('/:module/:controller/:action/:id', cors(), Func)

    }else if(G.system_mod.indexOf('api')>-1 && G.system_mod.indexOf('module') === -1){
        //restful 模型
        app.options('/*', cors())
        app.get('/:module/:controller', cors(), restFunc())
        app.get('/:module/:controller/:id', cors(), restFunc())
        app.post('/:module/:controller', cors(), restFunc())
        app.put('/:module/:controller/:id', cors(), restFunc())
        app.delete('/:module/:controller/:id', cors(), restFunc())
        //
        app.all('/:module/:controller/:id/:action', cors(), restFunc())
        app.all('/:module/:controller/:id/:action/:actionId', cors(), restFunc())
    }


}