import { HostRoot } from './workTags';
import { beginWork } from './beginWork';
import { completeWork } from './completeWork';
import { FiberNode, FiberRootNode } from './fiber';
import { createWorkInProgress } from './fiberReconciler';

let workInProgress: FiberNode | null = null;

function prepareFreshStack(root: FiberRootNode) {
	workInProgress = createWorkInProgress(root.current, {});
}

export function scheduleUpdateOnFiber(fiber: FiberNode) {
	// 调度功能
	const root = markUpdateFromFiberToRoot(fiber);
	renderRoot(root);
}

// 从当前node遍历到root
function markUpdateFromFiberToRoot(fiber: FiberNode): FiberRootNode | null {
	let node = fiber;
	let parent = node.return;

	while (parent !== null) {
		node = parent;
		parent = node.return;
	}

	if (node.tag === HostRoot) {
		return node.stateNode;
	}

	return null;
}

/**
 * 出发更新的 API
 * ReactDom.createRoot(render)
 * this.setState
 * useState 的 dispatch 方法
 */
function renderRoot(root: FiberRootNode | null) {
	if (root === null) return;
	// 初始化
	prepareFreshStack(root);

	do {
		try {
			workLoop();
			break;
		} catch (e) {
			if (__DEV__) {
				console.error('workLoop发生错误', e);
			}
			workInProgress = null;
		}
	} while (true);
}

function workLoop() {
	while (workInProgress !== null) {
		performUnitOfWork(workInProgress);
	}
}

function performUnitOfWork(fiber: FiberNode | null) {
	const next = beginWork(fiber);
	fiber && (fiber.memoizedProps = fiber.pendingProps);

	if (next === null) {
		completeUnitOfWork(fiber);
	} else {
		workInProgress = next;
	}
}

function completeUnitOfWork(fiber: FiberNode | null) {
	let node: FiberNode | null = fiber;

	do {
		completeWork(node);
		const sibling = node?.sibling;
		if (sibling) {
			workInProgress = sibling;
			return;
		}
		node = node?.return ?? null;
		workInProgress = node;
	} while (node !== null);
}
