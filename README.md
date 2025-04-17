# React-learning Note

#### 怎么取消 pnpm link --global

1. 取消全局链接本地包
   如果你要取消全局链接一个本地包，可在本地包所在的项目根目录下执行以下命令：
   bash
   pnpm unlink --global

此命令会把当前项目从全局链接中移除。

2. 取消全局链接到另一个项目
   要是你想取消某个全局链接的包在特定项目中的使用，需在该项目的根目录下执行以下命令：
   bash
   pnpm unlink --global <package-name>

这里的 <package-name> 指的是你之前全局链接的包的名称。

#### React 中的节点类型：

```tsx
// JSX

// ReactElement
export interface ReactElement {
	$$typeof: symbol | number;
	type: Type;
	key: Key;
	props: Props;
	ref: Ref;
	__mark: string;
}

// FiberNode
export class FiberNode {
	type: any;
	tag: WorkTag;
	key: Key;
	stateNode: any | null;
	ref: Ref;

	return: FiberNode | null;
	sibling: FiberNode | null;
	child: FiberNode | null;

	index: number;

	pendingProps: Props | null;
	memoizedProps: Props | null;

	// 在 currentFiberNode 和 workingProgressFiberNode 之间切换
	alternate: FiberNode | null;
	flags: Flags;
	updateQueue: any;
}

// FiberRootNode
export class FiberRootNode {
	container: Container;
	current: FiberNode;
	finishedWork: FiberNode | null;
}
```


## update 流程

#### update流程与mount流程的区别
对于beginWork:
	- 需要处理ChildDeletion的情况
	- 需要处理节点移动的情况(abc -> bca)
对于completeWork:
	- 需要处理 HostText内容更新的情况
	- 需要处理 HostComponent 属性变化的情况
对于commitWork:
	- 对于childDeletion, 需要遍历被删除的子树
对于useState
	- 实现相对于mountState的updateState

#### beginWork流程
本节课仅处理单一节点，所以省去了「节点移动」的情况。我们需要处理：
	- singleElement
	- singleTextNode
处理流程为：
1. 比较是否可以复用current fiber
	1. 比较key, 如果key不同，不能复用
	2. 比较type, 如果type不同，不能复用
	3. 如果key与type都相同，则可复用
2. 不能复用，则创建新的（同mount）流程，可以复用则复用旧的
注意：对于同一个fiberNode，即使反复更新，current、wip这两个fiberNode会重复使用

#### completeWork流程
主要处理「标记Update」的情况，本节课我们处理HostText内容更新的情况

#### commitWork流程
对于标记ChildDeletion的子树，由于子树中：
	- 对于FC, 需要处理useEffect unmount执行、解绑ref
	- 对于HostComponent，需要解绑ref
	- 对于子树的「根HostComponent」需要移除DOM
    所以需要实现「遍历ChildDeletion子树」的流程 
