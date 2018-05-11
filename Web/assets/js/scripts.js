function UserTokenIsValid() {
    if (Backendless.UserService.isValidLoginSync() == true) {
            return true;
    }
    return false;
}

function GetAndSetUserToken() {

    try {
        var queryDict = {}
        location.search.substr(1).split("&").forEach(function(item) {queryDict[item.split("=")[0]] = item.split("=")[1]})
        if (queryDict["userToken"] != undefined && queryDict["userToken"] != null) {
            Backendless.LocalCache.set("user-token", queryDict["userToken"])
        }
    } catch(e) { }
}