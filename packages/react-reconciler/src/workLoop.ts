import { beginWork } from './beginWork';
import { completeWork } from './completeWork';
import { FiberNode } from './fiber';

let workInProgress: FiberNode | null = null;

function prepareFreshStack(fiber: FiberNode) {
	workInProgress = fiber;
}

function renderRoot(root: FiberNode) {
	// 初始化
	prepareFreshStack(root);

	do {
		try {
			workLoop();
			break;
		} catch (e) {
			console.error('workLoop发生错误', e);
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
