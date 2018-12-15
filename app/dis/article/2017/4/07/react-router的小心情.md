### 今天来说说react-router这货

- 路由之间传递参数

>
    <Route path="/article/:id" component={ArticleDetail}/>
    //------------------
    //那如何接受参数呢
    //在页面跳转的过程中react-router会将路由参数对象params传递到所指向的组件的props
    //so 
    const {someParams}=this.props.params
    //即可得到

###参考
<http://www.ruanyifeng.com/blog/2016/05/react_router.html?utm_source=tool.lu>
