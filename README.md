# `unichat-back-end`

database API for `unichat`

## 接口说明

### 服务器主机 [https://47.102.140.37:10010/](https://47.102.140.37:10010/)

-   用户注册 `GET POST`

    PATH `/signup`

    参数列表

    -   昵称 `nickname`
    -   密码 `password`
    -   邮箱地址 `emailAddr`
    -   签名档 `profile`
        -   可以为空
    -   验证码 `captcha`

-   获取验证码 `GET`

    PATH `/captcha`

    参数列表

    -   无

    备注：验证码的文本存储在该请求的 session 中

-   用户登录 `GET POST`

    PATH `/signin`

    参数列表

    -   昵称 `nickname`
    -   邮箱地址 `emailAddr`
    -   密码的 hash 值 `passwordHash`

    备注

    -   用户的昵称和邮箱地址不能都为空
    -   密码的 hash 算法使用 SHA256
    -   用户登录有效时间为 2 个月

-   用户修改属性 `GET POST`

    PATH `/modify`

    参数列表

    -   字段名 `colName`
    -   新赋值 `newVal`

    备注

    -   可用的字段名如下
        -   昵称 `nickname`
        -   邮箱地址 `emailAddr`
        -   签名档 `profile`
        -   新头像的 URL `avatar`
    -   必须在期限内登录过的用户才可以使用这个接口

-   用户创建群聊

    PATH `/createGroup`

    参数列表

    -   群聊名称 `name`
    -   群聊图标 `logo`

    备注

    -   必须登录过的用户才可以使用

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

    -   certificate.pem

        SSL 认证

    -   certrequest.csr

        CA

    -   privatekey.pem

        SSL 密钥

    -   \*.code-workspace

        vscode 的工作空间

    -   LICENSE
    -   package-lock.json
    -   package.json

        Node.js 的项目配置

    -   README.md

        此说明文件

## TODO:

-   后台返回 JSON 的约定
-   调用接口的**认证**方式
    -   session 中存储，交给 express 处理过期等问题
-   确定编码规范
    -   代码：驼峰命名
    -   字段：下划线命名
    -   文件：驼峰命名
-   确定接口包括哪些业务

1.  用户
    -   ~~用户注册~~
        -   ~~验证码~~
            ~~SVG Captcha~~
        -   ~~用户显示 ID 的生成~~
    -   ~~用户登录~~
    -   用户其他方式认证
    -   ~~用户改属性~~
        -   ~~昵称~~
        -   ~~邮箱~~
        -   头像
            第三方存图，把新的 URL 告诉后台
2.  群
    -   用户创建群
    -   用户为群改名
    -   用户加入群
    -   用户退出群
    -   查询群里所有用户
        -   查询用户是否在群里
3.  频道
    -   用户在群里创建频道
    -   查询群里所有聊天频道
    -   用户为聊天频道改名
4.  消息

    -   用户发给另一个用户消息
    -   查询用户发的消息
    -   查询用户收的消息

**待添加**

-   数据对象持久化

-   ~~自动部署~~

## Usage

### config database password before run

create `src\db\config.json` and save the password of database in the file.

-   npm start

    开启服务器

-   npm test

    运行测试

-   npm run apply

    把数据模型的字段更新到对应的表中，并**删除**之前的旧数据表

## 相关链接

-   [后台](https://github.com/OhnkytaBlabdey/unichat-back-end)
-   [前台](https://github.com/NeWive/UniChatFrontEnd)
