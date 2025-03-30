import type { Props, Key, Ref } from 'shared/ReactTypes';
import { WorkTag, HostRoot } from './workTags';
import { type Flags, NoFlags } from './fiberFlags';
import { Container } from 'hostConfig';
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

	constructor(tag: WorkTag, pendingProps: Props, key: Key) {
		this.tag = tag;
		this.key = key;
		// HostComponent <div></div> -> stateNode保存 div dom 元素
		this.stateNode = null;
		// FunctionComponent () => {} Function 本身
		this.type = null;

		// 指向父fiberNode
		this.return = null;
		// 兄弟fiberNode
		this.sibling = null;
		// 儿子fiberNode
		this.child = null;
		this.index = 0;

		this.ref;

		// 作为工作单元
		this.pendingProps = pendingProps;
		this.memoizedProps = null;
		this.alternate = null;

		// 副作用
		this.flags = NoFlags;
	}
}

export class FiberRootNode {
	container: Container;
	current: FiberNode;
	finishedWork: FiberNode | null;

	constructor(container: Container, hostRootFiber: FiberNode) {
		this.container = container;
		this.current = hostRootFiber;
		hostRootFiber.stateNode = this;
		this.finishedWork = null;
	}
}
