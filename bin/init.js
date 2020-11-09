#!/usr/bin/env node
const { exec, execSync } = require('child_process');
const fs = require("fs");
const path = require("path");
var inquirer = require('inquirer');
var shell = require('shelljs');
var chalk = require('chalk');

const resolve = (dir = '') => path.join(__dirname, dir);

// 获取当前系统git user.name
if (!shell.which('git')) {
    shell.echo('Sorry, this script requires git');
    shell.exit(1);
}
var gitname = execSync('git config user.name', {
    encoding: 'utf8'
});
gitname = gitname.trim();
const cwd = process.cwd();
const currentPath = resolve();
console.log('cwd: ', cwd);
console.log('currentPath: ', currentPath);
const currentPathFolderList = fs.readdirSync(cwd, 'utf8');

inquirer
    .prompt([
        {
            type: 'input',
            name: 'name',
            message: '请输入创建的JS组件名字：',
            validate: function (input) {
                var done = this.async();
                setTimeout(function() {
                    if (/[^a-zA-Z-]/g.test(input)) {
                        done('只能由字母和-组成');
                        return;
                    }
                    if (input.trim().length === 0) {
                        done('名字必填');
                        return;
                    }
                    if (currentPathFolderList.find((currentFolder) => currentFolder === input)) {
                        done('当前文件夹已包含同名文件夹');
                        return;
                    }
                    // Pass the return value in the done callback
                    done(null, true);
                }, 100);
            }
        },
        {
            type: 'input',
            name: 'description',
            message: '请输入组件描述：',
        },
        {
            type: 'input',
            name: 'author',
            message: '请输入你的名字: ',
            default: gitname,
            validate: function (input) {
                var done = this.async();
                setTimeout(function() {
                    if (!input.length) {
                        done('作者必填');
                        return;
                    }
                    // Pass the return value in the done callback
                    done(null, true);
                }, 100);
            }
        }
    ])
    .then(({ name, author, description }) => {
        const projectFolder = path.join(cwd, name);
        // 创建文件夹
        shell.exec(`mkdir ${projectFolder}`);

        // 设置package.json
        var templatePackage = fs.readFileSync(resolve('../template/template-package.json'), 'utf8');
        templatePackage = JSON.parse(templatePackage);
        templatePackage.name += name;
        templatePackage.author = author;
        templatePackage.description = description;

        shell.cp('-Rf', resolve('../template/build'), `${projectFolder}/`);
        shell.cp('-Rf', resolve('../template/src'), `${projectFolder}/`);
        shell.cp('-Rf', resolve('../template/test'), `${projectFolder}/`);
        shell.cp('-Rf', resolve('../template/types'), `${projectFolder}/`);
        shell.cp('-Rf', resolve('../template/babel.config.js'), `${projectFolder}/`);
        shell.cp('-Rf', resolve('../template/declareModule.d.ts'), `${projectFolder}/`);
        shell.cp('-Rf', resolve('../template/postcss.config.js'), `${projectFolder}/`);
        shell.cp('-Rf', resolve('../template/readme.md'), `${projectFolder}/`);
        shell.cp('-Rf', resolve('../template/tsconfig.json'), `${projectFolder}/`);

        shell.cd(projectFolder);

        // 生成package.json
        fs.writeFile(`./package.json`, JSON.stringify(templatePackage,null,4), function (err) {
            if (err) console.error(err);

            console.log(chalk.blue(`---------------------------------祝你开发JS组件愉快---------------------------------------`));
            console.log(chalk.blue(`cd ${name} \n`));
            console.log(chalk.blue(`npm install \n`));
            console.log(chalk.blue('npx za-dev-components\n'));
        });
    })
    .catch(error => {
        console.log(error);
    });
