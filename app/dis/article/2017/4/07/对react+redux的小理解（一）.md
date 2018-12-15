### react-redux的踩坑之旅

- action 必须要带上type属性

__使用combineReducers时__

- reducer当中的action.type无法匹配时，必须要返回原来的state
    - default return state
- 做mapStateToProps映射时,注意每一个reducer都会有所对应的独立状态

---

__对中间件thunk的理解__

- 装了thunk后，最大的特点就是dispatch时可以对传入的函数进行处理
    - 分析一下原本redux的store.dispatch只能对传入的对象进行分发，但现在的话就可以先将异步处理等等逻辑封装在函数里，在最后一步再进行dispatch分发。
        - __即middleware 链中的最后一个 middleware 开始 dispatch action 时，这个 action 必须是一个普通对象__
    - 在component/container(mapStateToProps)中的dispatch能将(dispatch)方法一直顺着middleware链一直传递下去

```   
    const fetchArticle = () => {
        return (dispatch) => {
            fetch('http://localhost:80/article/all', {
                method: "GET"
            }).then(data => data.json()).then(data => {
                console.log(data)
                dispatch(receiveData(data))
            })
        }
    }
```

__中间件的的写法__

```
    function logger(store) {
        return function wrapDispatchToAddLogging(next) {
            return function dispatchAndLog(action) {
                console.log('dispatching', action)
                let result = next(action)
                console.log('next state', store.getState())
                return result
            }
        }
    }
```

```
    function applyMiddleware(store, middlewares) {
        middlewares = middlewares.slice()
        middlewares.reverse()
        let dispatch = store.dispatch
        middlewares.forEach(middleware =>
            dispatch = middleware(store)(dispatch)
        )
        return Object.assign({}, store, { dispatch })
    }
```

---

__疑问__

- dispatch在middleware链中的传递
    - <http://cn.redux.js.org/docs/advanced/Middleware.html> 