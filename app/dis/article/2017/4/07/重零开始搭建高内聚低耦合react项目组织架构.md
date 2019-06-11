## 高内聚低耦合
### 高内聚
- 多做有意义的代码拆分
- 函数内部简洁明了思路清晰

### 低耦合
- 最小化修改
- 易于维护

### 总结：
- 公共模块通常用于促进代码复用
- 业务模块通常用于提升可维护性

### links
- 前端模块化
- https://segmentfault.com/a/1190000002638831
- 2015前端的状态
- https://github.com/xufei/blog/issues/19
- 阮一峰log
    - 模块的写法
    - http://www.ruanyifeng.com/blog/2012/10/javascript_module.html
    - amd 
    - http://www.ruanyifeng.com/blog/2012/10/asynchronous_module_definition.html
    - require.js
    - http://www.ruanyifeng.com/blog/2012/11/require_js.html
- amd/cmd
- http://www.zhihu.com/question/20351507/answer/14859415 
- 前端框架何去何从
- http://www.cnblogs.com/sskyy/p/4264371.html
- 变量命名
- http://kb.cnblogs.com/page/548394/
- 更有效组织代码
- http://kb.cnblogs.com/page/549080/

>以上是一些参考，从而引发一场巨大的头脑风暴
---

究竟一个好的前端项目架构是怎么样的呢？这个问题一直在心中出现

首先要搞清楚何为一个好的前端架构，这个好的前端架构应该有怎么的属性，当代码写多了之后，就会发觉，一个好的前端架构总离不开高内聚低耦合这些老生常谈的话题，但总结起来其实就是一个词，效率。可以讲，一个越有效率的架构就系一个越好的架构，一切的一切都为效率服务。这个效率在经济学中称之为生产力。

那一个高效的前端架构应该是怎么样的呢？

那我们可以从所写的前端代码中去分析结构层次，当我们写纯原生的前端代码时，会发现总是离不开这几个步骤。
1. 写界面，样式
2. 写相关的业务逻辑
3. 写相关的网络请求获取数据

