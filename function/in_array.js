/**
 * Created by ken.xu on 14-2-12.
 */
module.exports = function(stringToSearch, arrayToSearch){
    console.log(stringToSearch, arrayToSearch);
    for (s = 0; s < arrayToSearch.length; s++) {
       var thisEntry = arrayToSearch[s].toString();
        if (thisEntry == stringToSearch) {
            return true;
        }
    }
    return false;

}