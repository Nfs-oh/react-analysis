##### ReactDom.render
- ReactDom.render 是整个web应用的入口，React负责构建虚拟dom，ReactDom.render则负责构建真实的 dom，因此React和ReactDom分离，使得React构建出来的虚拟dom树，可以被转换成任意的平台的代码，比如小程序，移动设备，服务端渲染等

##### render入口
```javascript
  function render(element, container, callback) {

    // element一般为 app 的根节点，container 为 id=root 的真是节点
    return legacyRenderSubtreeIntoContainer(null, element, container, false, callback);
  }

  function legacyRenderSubtreeIntoContainer(parentComponent, children, container, forceHydrate, callback) {
    var root = container._reactRootContainer;
    var fiberRoot;
    fiberRoot = root._internalRoot;
    updateContainer(children, fiberRoot, parentComponent, callback);
    return getPublicRootInstance(fiberRoot);
  }
```