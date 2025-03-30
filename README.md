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
