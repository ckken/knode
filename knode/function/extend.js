/**
 * Created by ken.xu on 14-2-17.
 */
module.exports = function (origin, add) {
    if (!add || typeof add !== 'object') return origin;

    var keys = Object.keys(add);
    var i = keys.length;
    while (i--) {
        origin[keys[i]] = add[keys[i]];
    }
    return origin;
}