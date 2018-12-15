###具体发现左一个很好用的nodejs守护进程
- 冇错就系pm2
- npm install -g pm2 之后
- 先sudo su取得root权限
- 才能pm2 start path/app
- 发现就算sudo pm2 start path/app 都会发生权限错误

<http://www.jianshu.com/p/fdc12d82b661>
<http://pm2.keymetrics.io/docs/usage/quick-start/>
<https://www.npmjs.com/package/pm2>