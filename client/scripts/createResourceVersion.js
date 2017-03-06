/**
 * 版本控制脚本
 * @author fraser
 * @version 0.2
 */
var fs = require('fs');
var SVN = require("node.svn");
var EventEmitter = require('events').EventEmitter;
var fileUtils = require("./libs/fileUtils.js");

var absoultePath = "../release/publish/resource/" ;
var config = {
    "cwd" : process.cwd()+"/../",
    "username" : "fraser",
    "password" : "zxcvbnm"
};

var filterConfig = [
    absoultePath + "default.res.json"
    // "resource/default.res.json"
];

// var exportFile = config.cwd + "resource/default.res.json";
var exportFile = config.cwd + absoultePath + "default.res.json";


var singleExportNum = 70;

var svn = new SVN(config);
var ee = new EventEmitter();

var allFiles = [];
var obj = {};
var dirNum = 0;
var dirNum_complate = 0;


function foreachAllFiles(root) {
    dirNum++;
    fs.readdir(root, function(err, files){
        if(err || files.length == 0){
            ee.emit("fileForeachComplate");
            return;
        }
        for(var i = 0, len = files.length; i<len; i++){
            var file = files[i];
            if(file.indexOf(".DS_Store") != -1){
                continue;
            }
            //
            var filePath = root + "/" + file;
            var exportFilePath = filePath.replace(config.cwd, "");
            //
            // console.log("exportFilePath-->",exportFilePath) ;
            //
            if(filterConfig.indexOf(exportFilePath) == -1){
                if(!fileUtils.isDirectory(filePath)) {  //文件
                    allFiles.push(filePath);
                }else{                                  // 目录
                    foreachAllFiles(filePath);
                }
            }

            if(i == (len-1)){
                ee.emit("fileForeachComplate");
            }
        }
    });
}

function getFileVersion(){
    var dealFiles = allFiles.splice(0, singleExportNum);
    var fileNum = dealFiles.length;
    var fileNumComplate = 0;
    //
    dealFiles.forEach(
        function(filePath){
            svn.info(filePath, 
                function (err, info) {
                    if(err == null){
                        var path = filePath.replace(config.cwd + "resource/", "");
                        obj[path] = info.lastchangedrev;
                    }else{
                        console.log(err);
                    }
                    //
                    fileNumComplate++;
                    if(fileNumComplate >= fileNum){
                        if(allFiles.length == 0){
                            saveConfigFile();
                        }else{
                            setTimeout(getFileVersion, 100);
                        }
                    }
                }
            );
        }
    );
}

function saveConfigFile(){
    // svn 数据信息
    fileUtils.readResVersion(absoultePath,exportFile,obj) ;
}

ee.on("fileForeachComplate", function() {
    dirNum_complate++;
    if(dirNum_complate >= dirNum){
        getFileVersion();
    }
});

foreachAllFiles(config.cwd + "resource");


