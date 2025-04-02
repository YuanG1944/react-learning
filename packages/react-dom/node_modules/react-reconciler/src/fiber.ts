import type { Props, Key, Ref, ReactElement } from 'shared/ReactTypes';
import {
	WorkTag,
	HostRoot,
	FunctionComponent,
	HostComponent
} from './workTags';
import { type Flags, NoFlags } from './fiberFlags';
import { Container } from 'hostConfig';
export class FiberNode {
	/** 基本信息  */
	// 通常和 elementType 相同，但在某些情况下会有所不同，比如在处理高阶组件时，type 可能会被更新为更具体的组件类型。
	type: any;
	// 表示当前 Fiber 节点的类型，也就是 workTag。例如 FunctionComponent、HostComponent 等，用于在渲染过程中区分不同类型的节点并执行相应的处理逻辑。
	tag: WorkTag;
	// 用于帮助 React 识别哪些元素发生了变化。在列表渲染时，通过给每个元素添加唯一的 key，可以提高 React 对比新旧元素的效率，减少不必要的重新渲染。
	key: Key;

	ref: Ref;

	/** 树结构关系  */
	// 作用：指向当前 Fiber 节点的父节点。在 Fiber 树的遍历过程中，用于回溯到父节点。
	return: FiberNode | null;
	// 作用：指向当前 Fiber 节点的下一个兄弟节点。借助 sibling 可以遍历同一个父节点下的所有子节点。
	sibling: FiberNode | null;
	// 作用：指向当前 Fiber 节点的第一个子节点。通过 child 可以从父节点访问到子节点。
	child: FiberNode | null;

	index: number;

	/** 状态和属性 */
	// 作用：表示当前 Fiber 节点接收到的最新的 props。在更新过程中，新的 props 会先存储在 pendingProps 中，等待处理。
	pendingProps: Props | null;
	// 作用：表示上一次渲染时使用的 props。用于对比 pendingProps 和 memoizedProps，判断 props 是否发生了变化，从而决定是否需要重新渲染。
	memoizedProps: Props | null;
	// 作用：存储与当前 Fiber 节点关联的实际 DOM 节点或组件实例。例如，对于类组件，它是组件的实例；对于宿主组件，它是对应的 DOM 元素。
	stateNode: any;
	// 存储当前 Fiber 节点的状态。对于类组件，它是组件的 this.state；对于函数组件，它可以存储 useState 和 useReducer 的状态。
	memoizedState: any;

	/** 副作用和更新 */
	// 作用：表示当前 Fiber 节点需要执行的副作用操作，如插入、更新、删除等。这些标志位用于在提交阶段（commit phase）确定需要对 DOM 进行哪些操作。
	flags: Flags;
	// 作用：表示当前 Fiber 节点的子树中需要执行的副作用操作。通过这个属性可以快速判断子树中是否有需要处理的副作用，避免不必要的遍历。
	subtreeFlags: Flags;
	// 作用：存储当前 Fiber 节点的更新队列。当组件状态发生变化时，更新会被添加到这个队列中，等待后续处理。
	updateQueue: any;
	// 作用：指向当前 Fiber 节点的另一个版本。在双缓存机制中，alternate 用于在新旧 Fiber 树之间切换，提高渲染性能。
	// 双缓冲技术，在 currentFiberNode 和 workingProgressFiberNode 之间切换
	alternate: FiberNode | null;

	/** 时间相关 */
	// 作用：表示当前 Fiber 节点的优先级。React 使用 lanes 来管理不同更新的优先级，确保高优先级的更新能够更快地得到处理。
	// lanes: Lanes
	// 作用：表示当前 Fiber 节点的子树中所有更新的优先级。通过这个属性可以快速判断子树中是否有高优先级的更新。
	// childLanes: Lanes

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
		this.memoizedState = null;

		// 副作用
		this.flags = NoFlags;
		this.subtreeFlags = NoFlags;
	}
}

export class FiberRootNode {
	// 对应挂载的节点
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

export function createFiberFromElement(element: ReactElement): FiberNode {
	const { type, key, props } = element;

	let fiberTag: WorkTag = FunctionComponent;

	if (typeof type === 'string') {
		// <div/> type: 'div'
		fiberTag = HostComponent;
	} else if (typeof type !== 'function' && __DEV__) {
		console.warn('未定义的type类型', element);
	}

	const fiber = new FiberNode(fiberTag, props, key);
	fiber.type = type;

	return fiber;
}

export function createWorkInProgress(current: FiberNode, pendingProps: Props) {
	let wip = current.alternate; // workingProgressFiberNode

	// 首屏渲染的时候，wip 为 null
	if (wip === null) {
		// mount
		wip = new FiberNode(current.tag, pendingProps, current.key);
		// wip.type = current.type;
		wip.stateNode = current.stateNode;

		// 双缓存，替换node
		wip.alternate = current;
		current.alternate = wip;
	} else {
		// update
		wip.pendingProps = pendingProps;
		wip.flags = NoFlags;
		wip.subtreeFlags = NoFlags;
	}

	wip.type = current.type;
	wip.updateQueue = current.updateQueue;
	wip.child = current.child;
	wip.memoizedProps = current.memoizedProps;
	wip.memoizedState = current.memoizedState;

	return wip;
}
