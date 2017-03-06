/**
 * 发布
 * @author j
 * 2016/2/23
 */

//名称
var NAME = "妖怪休走";
//平台
var PLATFORM = "vutimes";
//SDK
var SDK_URL = "http://cdn.11h5.com/static/js/sdk.min.js";
//SDK EXTRA
var SDK_EXTRA_URL = "http://cdn.11h5.com/static/js/sdk_hortor.min.js";
//引擎版本
var E_VERSION = "3.2.3";
//游戏版本
var G_VERSION;

var child_process = require("child_process");
var fs = require("fs");

var resJson = null;
var resIndex = 0;

updatePublish();

function updatePublish()
{
    console.log("更新目录....");

    child_process.exec("svn revert . -R", {"cwd": "../release/"}, function(error, stdout, stderr)
    {
        if (error)
        {
            console.log(stderr);
        }
        else
        {
            child_process.exec("svn update", {"cwd": "../release/"}, function(error, stdout, stderr)
            {
                if (error)
                {
                    console.log(stderr);
                }
                else
                {
                    rmdirSync("../release/publish/");
                    packageConfig();
                }
            });
        }
    });
}

function packageConfig()
{
    console.log("打包配表....");

    child_process.exec("node combin.js", {"cwd": "./tables/"}, function(error, stdout, stderr)
    {
        if (error)
        {
            console.log(stderr);
        }
        else
        {
            publishProject();
        }
    });
}

function publishProject()
{
    console.log("发布工程....");

    var date = new Date();
    G_VERSION = date.getFullYear() + unshiftZero(date.getMonth() + 1) + unshiftZero(date.getHours())
        + unshiftZero(date.getHours()) + unshiftZero(date.getMinutes()) + unshiftZero(date.getSeconds());

    child_process.exec("egret publish --version " + G_VERSION, {"cwd": "."}, function(error, stdout, stderr)
    {
        if (error)
        {
            console.log(stderr);
        }
        else
        {
            createGameFile();
        }
    });
}

function createGameFile()
{
    console.log("生成发布文件....");

    var indexStr = fs.readFileSync("./template/index.html", {"encoding": "utf8"});
    indexStr = indexStr.replace(/\$\{NAME}/g, NAME);
    indexStr = indexStr.replace(/\$\{PLATFORM}/g, PLATFORM);
    indexStr = indexStr.replace(/\$\{SDK_URL}/g, SDK_URL);
    indexStr = indexStr.replace(/\$\{SDK_EXTRA_URL}/g, SDK_EXTRA_URL);
    indexStr = indexStr.replace(/\$\{E_VERSION}/g, E_VERSION);
    indexStr = indexStr.replace(/\$\{G_VERSION}/g, G_VERSION);

    fs.renameSync("../release/web/" + G_VERSION + "/", "../release/publish/");
    fs.rmdirSync("../release/web/");
    fs.writeFileSync("../release/publish/index.html", indexStr);

    commitPublish();
}

function commitPublish()
{
    console.log("提交目录....");

    child_process.exec("svn add * --force", {"cwd": "../release/"}, function(error, stdout, stderr)
    {
        if (error)
        {
            console.log(stderr);
        }
        else
        {
            child_process.exec("svn commit . -m=" + G_VERSION, {"cwd": "../release/"}, function(error, stdout, stderr)
            {
                if (error)
                {
                    console.log(stderr);
                }
                else
                {
                    createResVersion();
                }
            });
        }
    });
}

function createResVersion()
{
    console.log("生成资源版本....");

    var resStr = fs.readFileSync("../release/publish/resource/default.res.json", {"encoding": "utf8"});
    resJson = JSON.parse(resStr);

    recordResVersion();
}

function recordResVersion()
{
    if (resIndex < resJson["resources"].length)
    {
        var item = resJson["resources"][resIndex];

        child_process.exec("svn info ./publish/resource/" + item["url"], {"cwd": "../release/"}, function(error, stdout, stderr)
        {
            if (error)
            {
                console.log(stderr);
            }
            else
            {
                var info = parseSvnInfo(stdout);
                item["url"] = item["url"] + "?v=" + info["lastchangedrev"];

                resIndex++;
                recordResVersion();
            }
        });
    }
    else
    {
        fs.writeFileSync("../release/publish/resource/default.res.json", JSON.stringify(resJson, null, 2));

        child_process.exec("svn commit ./publish/resource/default.res.json -m=" + G_VERSION, {"cwd": "../release/"}, function(error, stdout, stderr)
        {
            if (error)
            {
                console.log(stderr);
            }
            else
            {
                console.log("发布vutimes完成....");
                console.log("当前游戏版本：" + G_VERSION);
            }
        });
    }
}

function rmdirSync(path)
{
    var fileList = [];
    var directoryList = [];

    walkDir(path);

    function walkDir(dirPath)
    {
        var list = fs.readdirSync(dirPath);

        list.forEach(function(item)
        {
            var temp = dirPath + "/" + item;
            var result = fs.statSync(temp);

            if (result.isDirectory())
            {
                directoryList.unshift(dirPath + "/" + item);
                walkDir(temp);
            }
            else
            {
                fileList.unshift(dirPath + "/" + item);
            }
        });
    }

    fileList.forEach(function(item)
    {
        fs.unlinkSync(item);
    });
    directoryList.forEach(function(item)
    {
        fs.rmdirSync(item);
    });

    fs.rmdirSync(path);
}

function unshiftZero(num)
{
    var str = num.toString();

    while (str.length < 2)
    {
        str = "0" + str;
    }
    return str;
}

function parseSvnInfo(text)
{
    var info = {};
    var array = text.replace(/\r\n/g, "\n").split("\n");

    array.forEach(function(line)
    {
        var index = line.indexOf(":");
        info[line.substring(0, index).replace(/\s*/g, "").toLowerCase()] = line.substring(index + 1).trim();
    });
    return info;
}