如果你想了解如何基于 [Rum](https://github.com/rumsystem/quorum) 开发一个应用，这是一个非常好的例子。

所有的功能实现参考 Quorum 官方推荐的 [ActivityPub](https://docs.rumsystem.net/docs/data-format-and-examples/) 格式。

这个例子的功能是很简单的，但它的应用场景非常典型，所以具有参考的意义。

这里有一个 live 版本可以让您体验一下：https://rum-demo.prsdev.club

如果您想要在本地运行，可以参考如下步骤：

## 获取代码

```
git clone https://github.com/okdaodine/rum-demo.git
```

## 配置 Rum Group

1. 打开 [Quorum open node](https://node.rumsystem.net/)
2. 使用 Github 登录
3. 创建一个 group
4. 打开 group
5. 复制 seed
6. 将 seed 填写到 `server/config.js` 里面的 `seedUrl`。

这样就完成了 Rum Group 的配置啦。

好，接下来让我们开始使用这个 Rum Group 吧。

## 启动前端服务
（这个例子使用 js 开发，所以请先安装 nodejs 哦）

在根目录下，运行：

```
yarn install
yarn dev
```

## 启动后端服务

另外起一个终端界面，执行：

```
cd server
yarn install
yarn dev
```

## 访问服务

http://localhost:3000

## 总结和进阶

通过这个例子，您可以知道：

1. 如何实现 post
2. 如何实现 comment
3. 如何实现 like
4. 如何实现 profile

如果您想实现更多功能，比如说：

1. post 如何包含图片
2. profile 如何修改头像
3. 如何实现二级评论
4. 如何实现用户之间的消息通知（谁评论了谁，谁点赞了谁）

可以参考 [rum-feed](https://github.com/okdaodine/rum-feed) 这个产品，它也是开源的，你可以从它的功能和源码进行学习

## 反馈和交流

可以直接提 [Issues](https://github.com/okdaodine/rum-demo/issues)
