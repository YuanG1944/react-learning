import { Container } from 'hostConfig';
import type { ReactElement } from 'shared/ReactTypes';
import { FiberNode, FiberRootNode } from './fiber';
import {
	createUpdate,
	createUpdateQueue,
	enqueueUpdate,
	UpdateQueue
} from './updateQueue';
import { scheduleUpdateOnFiber } from './workLoop';
import { HostRoot } from './workTags';

function createContainer(container: Container) {
	const hostRootFiber = new FiberNode(HostRoot, {}, null);
	const root = new FiberRootNode(container, hostRootFiber);
	hostRootFiber.updateQueue = createUpdateQueue();

	return root;
}

function updateContainer(element: ReactElement | null, root: FiberRootNode) {
	const hostRootFiber = root.current;
	const update = createUpdate<ReactElement | null>(element);
	enqueueUpdate<ReactElement | null>(
		hostRootFiber.updateQueue as UpdateQueue<ReactElement | null>,
		update
	);
	scheduleUpdateOnFiber(hostRootFiber);
	return element;
}

export default {
	createContainer,
	updateContainer
};
