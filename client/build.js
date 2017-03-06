/**
 * 编译
 * @author j
 * 2016/2/23
 */

var child_process = require("child_process");

packageConfig();

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
            compileProject();
        }
    });
}

function compileProject()
{
    console.log("编译工程....");

    child_process.exec("egret clean", {"cwd": "."}, function(error, stdout, stderr)
    {
        if (error)
        {
            console.log(stderr);
        }
        else
        {
            console.log("编译完成....");
        }
    });
}