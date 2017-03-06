var fs = require('fs');
var charset = "utf-8";

/**
 * 转换本机路径为Unix风格路径。
 */
function escapePath(path) {
    if (!path)
        return "";
    return path.split("\\").join("/");
}

/**
 * 是否是文件夹
 * @param path
 * @returns {*}
 */
function isDirectory(path){
    path = escapePath(path);
    try{
        var stat = fs.statSync(path);
    }
    catch(e){
        return false;
    }
    return stat.isDirectory();
}

/**
 * 保存数据到指定文件
 * @param path 文件完整路径名
 * @param data 要保存的数据
 */
function save(path, data){
    if(exists(path)) {
        remove(path);
    }
    path = escapePath(path);
    fs.writeFileSync(path, data, charset);
}
/**
 * 删除文件或目录
 * @param path 要删除的文件源路径
 */
function remove(path) {
    path = escapePath(path);
    try{
        fs.lstatSync(path).isDirectory()
            ? rmdir(path)
            : fs.unlinkSync(path)
    }
    catch (e){
    }
}


/**
 * 指定路径的文件或文件夹是否存在
 */
function exists(path) {
    path = escapePath(path);
    return fs.existsSync(path);
}

function readSheetResVersion(absoultePath,versionData){
    if(sheets.length > 0)
    {
        var a = sheets.pop() ;
        var ppp = process.cwd() + "/../" + absoultePath + a ;
        //console.log("readSheetResVersion:",ppp) ;
        //
        fs.readFile(ppp,{encoding:'utf-8'}, function (err,bytesRead) {
            if (err) throw err;
            
            var resData = JSON.parse(bytesRead);
            var pngFile = resData["file"].split("?")[0] ; 
            var b = a.split("/")  ;
            if(b.length > 1)
            {
                b.pop() ;
            }
            b.push(pngFile) ;
            //
            var v = versionData[b.join("/")] ;
            //console.log(a,"[",pngFile,"]",v,ppp)
            if(v != null)
            {
                resData["file"] = pngFile + "?v=" + v ; 
            }
            else
            {
                resData["file"] = pngFile + "?v=" + Date.now()  ;
            }
            //
            save(ppp,JSON.stringify(resData)) ;
            //
            readSheetResVersion(absoultePath,versionData) ;
        });
    }
}


var sheets = [] ;

function readResVersion(absoultePath,name,versionData){
    var now = new Date(); 
    fs.readFile(name,{encoding:'utf-8'}, function (err,bytesRead) {
        if (err) throw err;
        //
        var resData = JSON.parse(bytesRead);
        //
        for(idx in resData.resources)
        {
            var rrr = resData.resources[idx] ;
            var type = rrr["type"] ;
            var url = rrr["url"].split("?")[0] ;
            var v = versionData[url] ;
            if(v != null)
            {
                rrr["url"] = url + "?v=" + v ; 
            }
            else
            {
                rrr["url"] = url + "?v=" + now.getTime()  ; 
            }
            //
            if(type == "sheet")
            {
                sheets.push(url) ;
            }
        }
        //
        save(name,JSON.stringify(resData)) ;
        //
        if(sheets.length > 0)
        {
            //console.log("versionData:",versionData);
            readSheetResVersion(absoultePath,versionData) ;
        }

        //
        console.log("Update [",resData.resources.length,"]Resource Version Success!");
    });
}



exports.save = save;
exports.isDirectory = isDirectory;
exports.escapePath = escapePath;
exports.readResVersion = readResVersion;