import request from 'request';
export default class extends G.controller.http{

    async city(){
        let d = await D.model('ylp_base_cities').find().toPromise()

        if(d.length>0){
            for(var i=0;i<d.length;i++){


                if(d[i].city_) {
                    let geodata = await this.getGeo(d[i].city_)
                    if(geodata&&geodata.status===0){
                        let lnglat = geodata.result.location
                        let updateData = {
                            lng_:lnglat.lng,
                            lat_:lnglat.lat
                        }
                        await D.model('ylp_base_cities').update({id_:d[i].id_},updateData).toPromise()
                    }
                }
                console.log(d[i].city_)

            }
        }
        this.json(d)
    }

    async getGeo(name) {
        name = encodeURIComponent(name)
        let url = 'http://api.map.baidu.com/geocoder/v2/?address='+name+'&output=json&ak=D7826f8aa6bb90b5704447aacc29bfe1'
        return new Promise((resolve, reject) => {
            request({
                url: url
            }, (error, response, body)=> {
                console.log(response.statusCode,body)
                if (!error && response.statusCode == 200) {
                    let d = JSON.parse(body&&body||{});
                    resolve(d)
                } else {
                    reject(error)
                }
            })
        })

    }

}