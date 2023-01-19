# 如何基于 Rum 开发应用？

[Rum](https://github.com/rumsystem/quorum) 可以提供一个去中心化同步内容的基础功能。

比如：

- 你运行一个 Rum 节点 A
- 我运行一个 Rum 节点 B
- 我们两个节点互相连接、互相同步数据
- 那么数据就是我们自己掌握的，你我都存储了一份

这是 Rum 能提供的基础功能。

当你自己这份数据丢了，可以从别人那里拿回来。听起来有点像是分布式数据库？是的，确实可以这么理解。

作为开发者，我们可以基于这个做什么呢？举例来说，假如你要做一个产品，你可以运行一个 Rum 节点，然后把产品的所有数据都存储在 Rum 节点里面。

假如这个 Rum 节点没有连接其他人，那么就是单机版，也就是说，数据存储在你个人电脑上，弄没了就是没了。这并不是去中心化的，和传统的数据库没有什么区别。

只有当多个 Rum 节点互相同步时，才是真正的去中心化。也就是变成了分布式的数据库，对吧。

从产品开发的角度，把 Rum 节点类比成分布式数据库，是合适的。那么接下来我们就可以了解一下，如何操作这个“数据库”，也就是说，如何写数据和读数据。

这里我们还需要了解另外一个东西 -- Group。

假如你跑了一个 Rum 节点，你就可以根据需要，在节点上新建 group。简单解释一下就是：

1. 一个节点上面可以建立无数个 groups
2. 每个 group 都有一个 seed（种子）
3. 我们通过 seed 来使用 group、同步 group、加入 group
4. 一般我们开发一个 app，都是建一个 group，然后把数据都存储在里面，就足够了
5. 你可以把 group 类比我们平时使用的云服务的对象存储，你建立一个 bucket，然后把数据都存储在里面

好，下面我们使用 [Rum JS SDK](https://github.com/okdaodine/quorum-light-node-sdk) 来示范一下

写一条数据：

```javascript
import SDK from 'quorum-light-node-sdk';
(async () => {
  const seed = 'rum://seed?xxx';
  const group = SDK.cache.Group.add(seed);
  const wallet = ethers.Wallet.createRandom();
  const result = await SDK.chain.Trx.create({
    groupId: group.groupId,
    object: {
      type: 'Note',
      content: 'send from JavaScript SDK',
    },
    privateKey: wallet.privateKey,
  });
  console.log(result);
})();

// { trx_id: '41f1e91e-5604-4539-8dee-7cf7e3ef5046' }
```

我们通过一个 seed，给一个 group 提交了一条内容，或者也称为一条 trx

结果返回的是这条 trx 的 id。

这条 trx 通过 Rum 节点的上链、同步之后，我们就可以它读取回来

```javascript
import SDK from 'quorum-light-node-sdk';

(async () => {
  const seed = 'rum://seed?xxx';
  const group = SDK.cache.Group.add(seed);
  const result = await SDK.chain.Content.list({
    groupId: group.groupId,
  });
  console.log(result);
})();

// [
//   {
//     Data: { type: 'Note', content: 'send from JavaScript SDK' },
//     Expired: 1657279269056000000,
//     GroupId: "8136923b-8203-4e08-bfe7-50eb3b558e2c",
//     Nonce: 1,
//     SenderPubkey: "Ak0RxoYwYhkAfg0ImkLh-ukRIHkoQ-Kw6QCRr_o83bmq",
//     SenderSign: "Dz436tcTh+NSUjF38oUBjXkIezVfENb/pit9BY1v8jZrjzcwu66YE8OFO9/MzRNIkhgTK2wulfmk51mzJz/9Txs=",
//     TimeStamp: "1657279239056000000",
//     TrxId: "41f1e91e-5604-4539-8dee-7cf7e3ef5046",
//     Version: "1.0.0",
//   }
// ]
```

这就是写和读的方法，具体的使用说明可以参考 [Rum JS SDK](https://github.com/okdaodine/quorum-light-node-sdk)

那么现在的问题就是如何通过写特定的数据，来实现你想要的功能，对吧？

这个问题我觉得最好使用例子来说明，[rum-demo](https://github.com/okdaodine/rum-demo) 就是这样一个真实的例子。

你通过使用它以及阅读它的代码实现，应该就可以弄明白整个来龙去脉。

如果有疑问和反馈，可以在 [rum-demo Issues](https://github.com/okdaodine/rum-demo/issues) 反馈和交流

这里还有一个很好的资源可以帮助你了解 Rum -- [awesome-quorum](https://github.com/okdaodine/awesome-quorum)

希望对您有帮助。