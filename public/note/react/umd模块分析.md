##### React注入到widow

配置webpack将React的引入指定到 window.React

webpack.config.externals = {
  'react': 'window.React',
  'react-dom': 'window.ReactDom'
}

html模板引入React
<script src='your react file path'></script>

html模板引入ReactDom
<script src='your react-dom file path'></script>


##### umd模块导入React分析

umd模块使用立即执行函数，将React挂载到window中

```javascript
  (function(global, factory) {
    factory(global.React = {});
    // 执行 react 函数体，挂载并初始化React = {}, 且将React作为 umd 的 exports 在 react 函数体中执行
  })(this, function(exports){
    /// react函数体
  })
```
