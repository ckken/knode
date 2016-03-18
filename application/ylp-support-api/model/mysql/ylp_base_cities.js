module.exports = {
    attributes: {
        id_:{type:'integer',primaryKey:true},
        city_id_:{type:'integer'},
        city_:{type:'string'},
        province_id_:{type:'integer'},
        lng_:{type:'float'},
        lat_:{type:'float'}
    },
    autoCreatedAt:false,
    autoUpdatedAt:false
}