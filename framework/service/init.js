import fs from 'fs'
export default function(){
    //服务层初始化
    G.service = {}
    G.service.load = function(path){
        path = G.path.service+'/'+path+'.js'
        if(fs.existsSync(path)){
            return require(path)
        }
    }
}