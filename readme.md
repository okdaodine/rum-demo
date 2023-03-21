If you want to learn how to develop an application based on [Rum](https://github.com/rumsystem/quorum), this is a very good example.

All the functional implementations refer to the [ActivityPub](https://docs.rumsystem.net/docs/data-format-and-examples/) format recommended by Quorum official.

This example is simple, but its application scenario is very common, so it's worth looking at.

If you want to run it on your own computer, follow these steps:

## Get the code

```
git clone https://github.com/okdaodine/rum-demo.git
```

## Configure Rum Group

1. Open [Quorum open node](https://node.rumsystem.net/)
2. Log in with Github
3. Create a group
4. Open the group
5. Copy the seed
6. Fill in the `seedUrl` in `server/config.js`.

Done! let's start using this Rum Group.

## Start the frontend service
(This example is developed in JavaScript, so please install nodejs first)

In the root directory, run:

```
yarn install
yarn dev
```

## Start the backend service

Open another terminal window and execute:

```
cd server
yarn install
yarn dev
```

## Access the service

http://localhost:3000

## Summary and Advancement

Through this example, you can know:

1. How to implement post?
2. How to implement comment?
3. How to implement like?
4. How to implement profile?

If you want to implement more features, such as:

1. How to include pictures in post?
2. How to modify avatar in profile?
3. How to implement secondary comments?
4. How to implement message notifications between users (who commented on who, who liked who)?

You can refer to the product [rum-feed](https://github.com/okdaodine/rum-feed), which is also open source, and you can learn from its features and source code.
