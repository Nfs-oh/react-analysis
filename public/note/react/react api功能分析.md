##### React.createElement
- jsx分析
```javascript
  // 标签化的react 组件会被 React.createElement 包装返回过了 react 元素对象，
  // 该用来对象描述 React 元素的基础信息， 并记录当前节点的子节点引用
  function Component() {
    return '我是一个React组件';
  }

  <Component a='a' /> = React.createElement(Component, {a: 'a'});

  <Component b='b'>123</Component>
  =
  React.createElement(Component, {b: 'b'}, '123');

  <Component b='b'><div>1</div><div>2</div></Component>
  =
  React.createElement(
    Component,
    {b: "b"},
    React.createElement("div", '1'),
    React.createElement("div", '2'),
  );
```

- react节点描述对象
```javascript
  <Component b='b'><div>1</div><div>2</div></Component>
  =
  {
    type: Component,
    $$typeof: Symbol(react.element),
    key: null,
    ref: null,
    props: {
      children: [
        // react children
      ],
      b: 'b'
    }
  }

  function createElement(type, props, ...children) {
    const { key = null, ref = null } = props;
    props.children = children;
    return ReactElement(type, key, ref, null, null, null, props);
  }
```

##### React.ReactElement
```javascript
  function ReactElement() {
    return {
      $$typeof: Symbol.for('react.element') || 0xeac7, 
      type: type,
      key: key,
      ref: ref,
      props: props,
      _owner: owner
    };
  }
```

##### React.memo
```javascript
  function ReactElement() {
    return {
      $$typeof: Symbol.for('react.memo') || 0xead3;,
      type: type,
      compare: compare === undefined ? null : compare
    };
  }

  createElement(memo(Component));
  =
  {
    $$typeof: Symbol.for('react.element') || 0xeac7,
    type: memo(Component) = {
      $$typeof: Symbol.for('react.memo') || 0xead3;,
      type: type,
      compare: compare === undefined ? null : compare
    },
    key: key,
    ref: ref,
    props: props,
    _owner: owner
  }
```
##### React.createContext
```javascript
  // React.createContext 在react组件树中创建上下文节点，在该上下文节点中的子节可以共享该上下文，并同步更新
  // eg:
    const ThemeContext = React.createContext('light');

    // 父组件
    class App extends React.Component {
      render(){
        return (
          <ThemeContext.Provider value='dark'>
            <Toolbar />
          <ThemeContext.Provider>
        )
      }
    }

    // 中间组件
    function ToolBar() {
      return (
        <div><ThemeButton /></div>
      )
    }

    // 子组件
    class ThemeButton extends React.Component {
      static contextType = ThemeContext;
      render() {
        return <Button theme={this.context}>
      }
    }

  // createContext函数

  function createContext(defaultValue) {
    var context = {
      $$typeof: Symbol.for('react.context') : 0xeace,
      // As a workaround to support multiple concurrent renderers, we categorize
      // some renderers as primary and others as secondary. We only expect
      // there to be two concurrent renderers at most: React Native (primary) and
      // Fabric (secondary); React DOM (primary) and React ART (secondary).
      // Secondary renderers store their context values on separate fields.
      _currentValue: defaultValue,
      _currentValue2: defaultValue,
      // Used to track how many concurrent renderers this context currently
      // supports within in a single renderer. Such as parallel server rendering.
      _threadCount: 0,
      // These are circular
      Provider: null,
      Consumer: null
    };

    context.Provider = {
      $$typeof: Symbol.for('react.provider') : 0xeacd,
      _context: context
    };

    var Consumer = {
      $$typeof: Symbol.for('react.context') : 0xeace,
      _context: context,
      _calculateChangedBits: context._calculateChangedBits
    };

    // 设置状态器

    var hasWarnedAboutUsingNestedContextConsumers = false;
    var hasWarnedAboutUsingConsumerProvider = false;

    // 为 Consumer 设置额外的属性
    Object.defineProperties(Consumer, {
      Provider: {
        get: function () {
          if (!hasWarnedAboutUsingConsumerProvider) {
            hasWarnedAboutUsingConsumerProvider = true;

            error('Rendering <Context.Consumer.Provider> is not supported and will be removed in ' + 'a future major release. Did you mean to render <Context.Provider> instead?');
          }

          return context.Provider;
        },
        set: function (_Provider) {
          context.Provider = _Provider;
        }
      },
      _currentValue: {
        get: function () {
          return context._currentValue;
        },
        set: function (_currentValue) {
          context._currentValue = _currentValue;
        }
      },
      _currentValue2: {
        get: function () {
          return context._currentValue2;
        },
        set: function (_currentValue2) {
          context._currentValue2 = _currentValue2;
        }
      },
      _threadCount: {
        get: function () {
          return context._threadCount;
        },
        set: function (_threadCount) {
          context._threadCount = _threadCount;
        }
      },
      Consumer: {
        get: function () {
          if (!hasWarnedAboutUsingNestedContextConsumers) {
            hasWarnedAboutUsingNestedContextConsumers = true;

            error('Rendering <Context.Consumer.Consumer> is not supported and will be removed in ' + 'a future major release. Did you mean to render <Context.Consumer> instead?');
          }

          return context.Consumer;
        }
      }
    });

    context.Consumer = Consumer;

    return context;
  }

  // context元素结构
  {
    $$typeof: Symbol(react.context)
    Consumer: {
      $$typeof: Symbol(react.context),
      Consumer: context.Consumer,
      Provider: context.Provider,
      _calculateChangedBits: null,
      _currentValue: '',
      _currentValue2: '',
      _threadCount: 0
    }
    Provider: {
      $$typeof: Symbol(react.provider)
      _context: context
    }
    _calculateChangedBits: null
    _currentValue: ''
    _currentValue2: ''
    _threadCount: 0
  }
```

##### React.createRef
```javascript
  function createRef() {
    return {
      current: null
    }
  }

```

##### React.forwardRef
```javascript
  function createRef() {
    return {
      $$typeof: Symbol.for('react.forward_ref') : 0xead0,
      render: render
    };
  }

```

##### react的更新机制 updater
```javascript

```

##### React组件 Component
```javascript
  // react组件是一个非常简单的构造函数，在 Component 的 prototype 中继承了 setState,
  // 该函数是react组件的核心，使用频率最高的函数
  function Component(props, context, updater) {
    this.props = props;
    this.context = context;
    this.refs = {};

    // 该update没有实际作用，函数在被 render 实例化过程中，会被重新赋值
    this.updater = updater || ReactNoopUpdateQueue;

    // ReactNoopUpdateQueue 是一个包含更新步骤错误提示的对象, 在生产环境中，提示为空
    ReactNoopUpdateQueue = {
      isMounted: function (a) {
        return false;
      },
      enqueueForceUpdate: function (a, b, c) {},
      enqueueReplaceState: function (a, b, c, d) {},
      enqueueSetState: function (a, b, c, d) {},
    }
  }

  Component.prototype.isReactComponent = {};

  Component.protoType.setState = function() {
    this.updater.enqueueSetState(this, partialState, callback, 'setState');
  }

  Component.prototype.forceUpdate = function (callback) {
    this.updater.enqueueForceUpdate(this, callback, 'forceUpdate');
  };
```

##### React.PureComponent
- PureComponent 与 Component 唯一的区别是， PureComponent 的 prototype 多了一个属性
pureComponentPrototype.isPureReactComponent = true;

##### React.useState
```javascript

  var ReactCurrentDispatcher = {
    current: null
  };

  function resolveDispatcher() {
    // 在react.umd.js中, ReactCurrentDispatcher被当做引用值传递到 react-dom.umd.js 中，给current赋值实际的Dispatcher
    // exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = ReactSharedInternals$1;
    var dispatcher = ReactCurrentDispatcher.current;
    return dispatcher;
  }

  // useState函数定义，
  React.useState = function(initialState) {
    const dispatcher = resolveDispatcher();
    return dispatcher.useState(initialState);
  }

```

##### React其他hook

```javascript
  function useContext(Context, unstable_observedBits) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useContext(Context, unstable_observedBits);
  }
  function useState(initialState) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useState(initialState);
  }
  function useReducer(reducer, initialArg, init) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useReducer(reducer, initialArg, init);
  }
  function useRef(initialValue) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useRef(initialValue);
  }
  function useEffect(create, deps) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useEffect(create, deps);
  }
  function useLayoutEffect(create, deps) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useLayoutEffect(create, deps);
  }
  function useCallback(callback, deps) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useCallback(callback, deps);
  }
  function useMemo(create, deps) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useMemo(create, deps);
  }
  function useImperativeHandle(ref, create, deps) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useImperativeHandle(ref, create, deps);
  }
```