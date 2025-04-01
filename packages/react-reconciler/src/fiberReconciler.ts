import { Container } from 'hostConfig';
import type { Props, ReactElement } from 'shared/ReactTypes';
import { FiberNode, FiberRootNode } from './fiber';
import {
	createUpdate,
	createUpdateQueue,
	enqueueUpdate,
	UpdateQueue
} from './updateQueue';
import { scheduleUpdateOnFiber } from './workLoop';
import { HostRoot } from './workTags';
import { NoFlags } from './fiberFlags';

export function createContainer(container: Container): FiberRootNode {
	const hostRootFiber = new FiberNode(HostRoot, {}, null);
	const root = new FiberRootNode(container, hostRootFiber);
	hostRootFiber.updateQueue = createUpdateQueue();

	return root;
}

export function updateContainer(
	element: ReactElement | null,
	root: FiberRootNode
): ReactElement | null {
	const hostRootFiber = root.current;
	const update = createUpdate<ReactElement | null>(element);

	// 插入更新队列
	enqueueUpdate<ReactElement | null>(
		hostRootFiber.updateQueue as UpdateQueue<ReactElement | null>,
		update
	);
	// 调和(reconciler) fiber
	scheduleUpdateOnFiber(hostRootFiber);
	return element;
}
