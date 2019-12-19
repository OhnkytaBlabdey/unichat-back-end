# `unichat-back-end`

database API for `unichat`

### 服务器主机 [http://47.102.140.37:10010/](http://47.102.140.37:10010/)

## 文档

### 请在 Release 下载

### 或者通过 `npm i -g jsdoc && npm run doc` 生成

## 后台返回 JSON 的约定

    -   status

        3 种

        -   `OK`
        -   `FAILED`
        -   `UNAUTHORIZED`

    -   msg

        用于给用户看的文字

    -   err

        报错详细信息，不给用户显示的

    -   dat

        查询返回的数据对象，看情况处理

## 相关链接

-   [后台](https://github.com/OhnkytaBlabdey/unichat-back-end)
-   [前台](https://github.com/NeWive/UniChatFrontEnd)

## TODO:

-   调用接口的**认证**方式
    -   ~~session 中存储，交给 express 处理过期等问题~~
-   ~~确定编码规范~~
    -   ~~代码：驼峰命名~~
    -   ~~数据库中的字段：下划线命名~~
    -   ~~文件：驼峰命名~~
-   确定接口包括哪些业务
-   编写测试

1.  用户

    -   ~~用户注册~~
        -   ~~验证码~~
            ~~SVG Captcha~~
        -   ~~用户显示 ID 的生成~~
    -   ~~用户登录~~
    -   ~~查询用户信息~~
    -   用户其他方式认证
    -   ~~用户改属性~~

        -   ~~昵称~~
        -   ~~邮箱~~
        -   ~~头像通过信任的第三方存图，把新的 URL 告诉后台~~

            目前白名单的模式需要为

            [ https://i.loli.net/* ]之一

2.  群
    -   ~~用户创建群~~
    -   用户为群改名
    -   ~~（群内用户）分享群聊~~
        -   ~~注：一定时间内的邀请码是不变的~~
    -   ~~**用户加入群**~~
    -   ~~用户退出群~~
    -   ~~查询群里所有用户~~
    -   ~~查询用户是否在群里~~
3.  频道
    -   ~~用户在群里创建频道~~
    -   查询群里所有聊天频道
    -   用户为聊天频道改名
4.  消息

    -   用户发给另一个用户消息
    -   查询用户发的消息
    -   查询用户收的消息

**待添加**

-   数据对象持久化

-   ~~代码自动部署~~
-   ~~文档持续集成~~
-   ~~限制访问流量~~

## Usage

### config database password before run

create `src\db\config.json` and save the password of database in the file.

-   npm start

    开启服务器

-   npm test

    运行测试

-   npm run apply

    把数据模型的字段更新到对应的表中，并**删除**之前的旧数据表

## 文件说明

-   文件夹

    -   log

        运行过程中生成的日志文件

    -   src

        源代码

    -   .vscode

        vscode 有关项目的文件

-   文件

    -   .editorconfig

        代码的缩进格式配置

    -   .eslintrc.json

        ESLint 语法检查的规则

    -   .gitignore

        版本控制工具忽略的文件

    -   \*.code-workspace

        vscode 的工作空间

    -   LICENSE
    -   package-lock.json
    -   package.json

        Node.js 的项目配置

    -   README.md

        此说明文件
