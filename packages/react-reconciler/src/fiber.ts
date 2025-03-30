import type { Props, Key, Ref } from 'shared/ReactTypes';
import { WorkTag, HostRoot } from './workTags';
import { type Flags, NoFlags } from './fiberFlags';
import { Container } from 'hostConfig';
export class FiberNode {
	type: any;
	tag: WorkTag;
	key: Key;
	// HostComponent <div> div dom
	stateNode: any | null;
	ref: Ref;

	return: FiberNode | null;
	sibling: FiberNode | null;
	child: FiberNode | null;

	index: number;

	pendingProps: Props | null;
	memoizedProps: Props | null;

	// 双缓冲技术，在 currentFiberNode 和 workingProgressFiberNode 之间切换
	alternate: FiberNode | null;
	flags: Flags;
	updateQueue: any;

	/**
	 *
	 * @param tag 什么类型的节点
	 * @param pendingProps 有哪些props需要改变
	 * @param key ReactElement:Key
	 */
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
		this.updateQueue = null;

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
