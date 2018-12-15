- 有时候，有时候，写react,react-redux的时候，慢慢的就会发现，同一目录下的reducer，component，action什么的贼多。
- 那这个时候当然就要认真思考一下，按传统逻辑流程来分目录或许真不好维护。好吧，确实不好维护，要修改一个功能的话要找半天。
- 这样按功能划分项目结构就应运而生了

>
    example:
    - dis
    - src
        - app
        - article
            - action.js
            - action-spec.js
            - reducer.js
            - reducer-spec.js
            - component.js
            - component-spec.js
            - container.js
            - container-spec.js
        - login
        - public

- 这里设置-spec后缀标记为测试版本
- 为了解决功能之间的重用性问题，设置了public目录

### 参考
<https://marmelab.com/blog/2015/12/17/react-directory-structure.html>