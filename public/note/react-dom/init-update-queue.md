##### 函数入口
- 使用unbatchedUpdates
```javascript
  // 首次构建react应用，不使用批处理，而是将首屏所有的react节点构建出来
  function unbatchedUpdates(fn, a = undefined) {
    // 缓存当前执行向下文
    var prevExecutionContext = executionContext;          // 初始化executionContext = NoContext = 0;
    executionContext &= ~BatchedContext;
    executionContext |= LegacyUnbatchedContext;           // 将当前执行上下文切换成 LegacyUnbatchedContext = 8
    try {
      // 开始执行 update
      return fn(a);
    } finally {
      executionContext = prevExecutionContext;

      if (executionContext === NoContext) {
        // Flush the immediate callbacks that were scheduled during this batch
        resetRenderTimer();
        flushSyncCallbackQueue();
      }
    }
  }
```

- 开始更新
```javascript
  updateContainer(
    children,           // <App />
    fiberRoot,          // fiberRoot
    parentComponent,    // null
    callback            // undefined
  );

  function updateContainer(
    element = '<App />',
    container = 'FiberRoot',
    parentComponent = null,
    callback = undefined
  ) {

    var current$1 = container.current;    // fiber对象
    var eventTime = requestEventTime();   // 时间戳   195.20499999634922

    var lane = requestUpdateLane(current$1);  // 初次构建 lane = 1

    var context = getContextForSubtree(parentComponent);  // 初次构建 context = {}

    if (container.context === null) {
      container.context = context;
    } else {
      container.pendingContext = context;
    }

    // 构建update对象
    var update = createUpdate(eventTime, lane);

    update.payload = {
      element: element
    };
    update.callback = callback;

    enqueueUpdate(current$1, update);
    scheduleUpdateOnFiber(current$1, lane, eventTime);
    return lane;
  }


  function createUpdate(eventTime, lane) {
    var update = {
      eventTime: eventTime,       // ~= 150
      lane: lane,                 // 1
      tag: UpdateState,           // 0
      payload: null,
      callback: null,
      next: null
    };
    return update;
  }

  // 初始化更新队列
  function enqueueUpdate(fiber, update) {
    var updateQueue = fiber.updateQueue;

    if (updateQueue === null) {
      // 如果 rootFiber.current 没有更新队列，则停止更新
      return;
    }

    var sharedQueue = updateQueue.shared;
    var pending = sharedQueue.pending;

    if (pending === null) {
      // 第一次更新 <App />, 将更新队列的next指向自己
      update.next = update;
    } else {
      update.next = pending.next;
      pending.next = update;
    }

    // 将当前的 update 对象，包含 element <App />，插入队列，准备更新
    sharedQueue.pending = update;
  }



  function scheduleUpdateOnFiber(fiber, lane, eventTime) {
    checkForNestedUpdates();
    var root = markUpdateLaneFromFiberToRoot(fiber, lane);

    markRootUpdated(root, lane, eventTime);

    if (root === workInProgressRoot) {
      // Received an update to a tree that's in the middle of rendering. Mark
      // that there was an interleaved update work on this root. Unless the
      // `deferRenderPhaseUpdateToNextBatch` flag is off and this is a render
      // phase update. In that case, we don't treat render phase updates as if
      // they were interleaved, for backwards compat reasons.
      {
        workInProgressRootUpdatedLanes = mergeLanes(workInProgressRootUpdatedLanes, lane);
      }

      if (workInProgressRootExitStatus === RootSuspendedWithDelay) {
        // The root already suspended with a delay, which means this render
        // definitely won't finish. Since we have a new update, let's mark it as
        // suspended now, right before marking the incoming update. This has the
        // effect of interrupting the current render and switching to the update.
        // TODO: Make sure this doesn't override pings that happen while we've
        // already started rendering.
        markRootSuspended$1(root, workInProgressRootRenderLanes);
      }
    } // TODO: requestUpdateLanePriority also reads the priority. Pass the
    // priority as an argument to that function and this one.


    var priorityLevel = getCurrentPriorityLevel();

    if (lane === SyncLane) {
      if ( // Check if we're inside unbatchedUpdates
      (executionContext & LegacyUnbatchedContext) !== NoContext && // Check if we're not already rendering
      (executionContext & (RenderContext | CommitContext)) === NoContext) {
        // Register pending interactions on the root to avoid losing traced interaction data.
        schedulePendingInteractions(root, lane); // This is a legacy edge case. The initial mount of a ReactDOM.render-ed
        // root inside of batchedUpdates should be synchronous, but layout updates
        // should be deferred until the end of the batch.

        performSyncWorkOnRoot(root);
      } else {
        ensureRootIsScheduled(root, eventTime);
        schedulePendingInteractions(root, lane);

        if (executionContext === NoContext) {
          // Flush the synchronous work now, unless we're already working or inside
          // a batch. This is intentionally inside scheduleUpdateOnFiber instead of
          // scheduleCallbackForFiber to preserve the ability to schedule a callback
          // without immediately flushing it. We only do this for user-initiated
          // updates, to preserve historical behavior of legacy mode.
          resetRenderTimer();
          flushSyncCallbackQueue();
        }
      }
    } else {
      // Schedule a discrete update but only if it's not Sync.
      if ((executionContext & DiscreteEventContext) !== NoContext && ( // Only updates at user-blocking priority or greater are considered
      // discrete, even inside a discrete event.
      priorityLevel === UserBlockingPriority$2 || priorityLevel === ImmediatePriority$1)) {
        // This is the result of a discrete event. Track the lowest priority
        // discrete update per root so we can flush them early, if needed.
        if (rootsWithPendingDiscreteUpdates === null) {
          rootsWithPendingDiscreteUpdates = new Set([root]);
        } else {
          rootsWithPendingDiscreteUpdates.add(root);
        }
      } // Schedule other updates after in case the callback is sync.


      ensureRootIsScheduled(root, eventTime);
      schedulePendingInteractions(root, lane);
    } // We use this when assigning a lane for a transition inside
    // `requestUpdateLane`. We assume it's the same as the root being updated,
    // since in the common case of a single root app it probably is. If it's not
    // the same root, then it's not a huge deal, we just might batch more stuff
    // together more than necessary.


    mostRecentlyUpdatedRoot = root;
  }

```


##### 分析总结
react16版本使用Fiber作为整个react应用的更新策略基石，fiber node记录当前需要更新的信息，
而 update 对象，则是更新的元信息。react更新策略，是react源码最复杂的，最难以理解的部分