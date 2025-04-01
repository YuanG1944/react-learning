/**
 * commit的三个阶段
 * 1. beforeMutation
 * 2. mutation
 * 3. layout (useEffectLayout)
 */

import { appendChildToContainer, Container } from 'hostConfig';
import { FiberNode, FiberRootNode } from './fiber';
import {
	ChildDeletion,
	MutationMask,
	NoFlags,
	Placement,
	Update
} from './fiberFlags';
import { HostComponent, HostRoot, HostText } from './workTags';

let nextEffect: FiberNode | null = null;

export const commitMutationEffects = (finishedWork: FiberNode) => {
	nextEffect = finishedWork;

	while (nextEffect !== null) {
		// 向下遍历
		const child: FiberNode | null = nextEffect.child;

		if (
			(nextEffect.subtreeFlags & MutationMask) !== NoFlags &&
			child !== null
		) {
			nextEffect = child;
		} else {
			// 向上遍历 DFS
			up: while (nextEffect !== null) {
				commitMutationEffectsOnFiber(nextEffect);
				const sibling: FiberNode | null = nextEffect.sibling;
				if (sibling !== null) {
					nextEffect = sibling;
					break up;
				}

				nextEffect = nextEffect.return;
			}
		}
	}
};

const commitMutationEffectsOnFiber = (finishedWork: FiberNode) => {
	const flags = finishedWork.flags;

	if ((flags & Placement) !== NoFlags) {
		commitPlacement(finishedWork);
		finishedWork.flags &= ~Placement; // 将Placement从flags中移除
	}
	// flag: update
	if ((flags & Placement) !== NoFlags) {
		// commitUpdate(finishedWork);
		finishedWork.flags &= ~Update; // 将Placement从flags中移除
	}
	// flag: ChildDeletion
	if ((flags & Placement) !== NoFlags) {
		// commitChildDeletion(finishedWork);
		finishedWork.flags &= ~ChildDeletion; // 将Placement从flags中移除
	}
};

const commitPlacement = (finishedWork: FiberNode) => {
	// finishedWork ~~ Dom
	if (__DEV__) {
		console.warn('执行Placement操作', finishedWork);
	}

	// parent Dom
	const hostParent = getHostParent(finishedWork);

	// finishWork  Dom append parent DOM
	appendPlacementNodeIntoContainer(finishedWork, hostParent);
};

function getHostParent(fiber: FiberNode): Container {
	let parent = fiber.return;

	while (parent) {
		const parentTag = parent.tag;
		// hostComponent HostRoot
		if (parentTag === HostComponent) {
			// 对于HostComponent节点来说 环境节点保存在sateNode中
			return parent.stateNode as Container;
		}
		if (parentTag === HostRoot) {
			return (parent.stateNode as FiberRootNode).container;
		}
		parent = parent.return;
	}

	if (__DEV__) {
		console.warn('未找到hostParent');
	}
}

function appendPlacementNodeIntoContainer(
	finishedWork: FiberNode,
	hostParent: Container
) {
	// fiber -> host
	if (finishedWork.tag === HostComponent || finishedWork.tag === HostText) {
		appendChildToContainer(finishedWork.stateNode, hostParent);

		return;
	}

	const child = finishedWork.child;
	if (child !== null) {
		appendPlacementNodeIntoContainer(child, hostParent);
		let sibling = child.sibling;

		while (sibling !== null) {
			appendPlacementNodeIntoContainer(sibling, hostParent);
			sibling = sibling.sibling;
		}
	}
}
