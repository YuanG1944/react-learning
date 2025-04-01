import {
	FunctionComponent,
	HostComponent,
	HostRoot,
	HostText
} from './workTags';
// 递归中的递阶段

import { FiberNode } from './fiber';
import { processUpdateQueue, UpdateQueue } from './updateQueue';

export const beginWork = (wip: FiberNode | null): FiberNode | null => {
	switch (wip?.tag) {
		case HostRoot:
			/* 
			 1. 计算状态的最新值
			 2. 创建子fiberNode
			*/
			return updateHostRoot(wip);
		case HostComponent:
			/*
				1. 创建子 fiberNode
			*/
			return updateHostComponent(wip);
		case HostText:
			/*
				HostText 没有 beginWork流程(因为他没有子节点) 
			*/
			return null;
		case FunctionComponent:
			return null;
		default:
			if (__DEV__) {
				console.warn('beginWork 未实现的类型');
			}
			break;
	}
	// 比较，返回子fiberNode
	return null;
};

function reconcileChildren(wip: FiberNode, nextChildren: any) {
	throw new Error('Function not implemented.');
}

function updateHostRoot(wip: FiberNode) {
	const baseState = wip.memoizedState;
	const updateQueue = wip.updateQueue as UpdateQueue<Element>;
	const pending = updateQueue.shared.pending;

	// 计算后，清空updateQueue
	updateQueue.shared.pending = null;
	const { memorizedState } = processUpdateQueue(baseState, pending);
	wip.memoizedState = memorizedState;

	const nextChildren = wip.memoizedState;
	reconcileChildren(wip, nextChildren);

	return wip.child;
}

function updateHostComponent(wip: FiberNode) {
	const nextProps = wip.pendingProps;
	const nextChildren = nextProps.children;

	reconcileChildren(wip, nextChildren);

	return wip.child;
}
