###微博爬虫要点

- 微博服务器会拒绝正常用户的爬虫请求，所返回的response header 中有返回cookie但冇尝试插入，模拟正常用户请求

###Problem
- header中设置`'User-Agent': 'spider'`（微博服务器对搜索引擎有优化）
- nodejs内置模块可以对gzip进行解码
- 当成功请求到内容时会发现
    - 微博的防爬机制的确别有心裁
    - 发现微博页面凡是一些重要的模块都会采用前端渲染的方式对代码进行重组渲染
        - FM.render()
    - 以及许多无意义的空格 

###Resolve
- 使用正则表达式过滤无意义的字符
    - `html.replace(/\s{2}|\\t|\\n|\\r|\\/g, "");`
- 匹配查找需要的数据段
    - `var reg = /\<ul class=\"ul_text\" id=[\s\S]*\<\/ul\>/g; var result = html.match(reg);`

