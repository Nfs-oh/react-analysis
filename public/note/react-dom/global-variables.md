### react-dom 涉及的全局变量

##### context
1. var NoContext = 0;
2. var BatchedContext = 1;
3. var EventContext = 2;
4. var DiscreteEventContext = 4;
5. var LegacyUnbatchedContext = 8;
6. var RenderContext = 16;
7. var CommitContext = 32;
8. var RetryAfterError = 64;
9. var executionContext = NoContext;


##### lane
1. var NoLanes = 0;
2. var NoLane = 0;
3. var SyncLane = 1;


##### priority

1. var ImmediatePriority$1 = 99;
2. var UserBlockingPriority$2 = 98;
3. var NormalPriority$1 = 97;
4. var LowPriority$1 = 96;
5. var IdlePriority$1 = 95; // NoPriority is the absence of priority. Also React-only.
6. var NoPriority$1 = 90;
7. var pendingPassiveEffectsRenderPriority = NoPriority$1;

  
var noTimeout = -1;
var ProfileMode = 8;