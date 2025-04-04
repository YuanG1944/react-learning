import { Action } from 'shared/ReactTypes';
import { Dispatch, Dispatcher } from 'react/src/currentDispatcher';
import { FiberNode } from './fiber';
import internals from 'shared/internals';
import {
	createUpdate,
	createUpdateQueue,
	enqueueUpdate,
	UpdateQueue
} from './updateQueue';
import { scheduleUpdateOnFiber } from './workLoop';

let currentlyRenderingFiber: FiberNode | null = null;
let workInProgressHook: Hook | null = null;

const { currentDispatcher } = internals;

interface Hook {
	// 该属性用于存储当前 Hook 的状态。在不同的 Hook 里，memoizedState 存储的内容也不同。
	// 例如，在 useState 中，它存储的是状态值；
	// 在 useReducer 中，它存储的是 reducer 的状态。
	memoizedState: any;
	// 用于存储更新队列 此属性用于存储更新队列。
	// 当调用 setState 或者 dispatch 时，更新操作会被加入这个队列。
	updateQueue: unknown;

	// 这是一个指向 Hook 类型对象或者 null 的引用。
	// 在 React 里，函数组件中的多个 Hook 会形成一个链表，next 属性用于连接链表中的下一个 Hook。
	// 当不存在下一个 Hook 时，next 为 null。
	next: Hook | null;
}

export function renderWithHooks(wip: FiberNode) {
	// 赋值操作
	currentlyRenderingFiber = wip;
	wip.memoizedState = null;

	const current = wip.alternate;

	if (current !== null) {
		// update
	} else {
		// mount
		currentDispatcher.current = HooksDispatcherOnMount;
	}

	const Component = wip.type;
	const props = wip.pendingProps;
	const children = Component(props);

	// 重置操作
	currentlyRenderingFiber = null;
	return children;
}

const HooksDispatcherOnMount: Dispatcher = {
	useState: mountState,
	useEffect: null
};

function mountState<State>(
	initialState: (() => State) | State
): [State, Dispatch<State>] {
	// 找到当前 useState对应的 hook 数据
	const hook = mountWorkInProgressHook();

	let memoizedState: State;
	if (initialState instanceof Function) {
		memoizedState = initialState();
	} else {
		memoizedState = initialState;
	}

	const queue = createUpdateQueue<State>();
	hook.updateQueue = queue;
	hook.memoizedState = memoizedState;

	const dispatch = dispatchSetState.bind(null, currentlyRenderingFiber, queue);

	queue.dispatch = dispatch;

	return [memoizedState, dispatch];
}

function dispatchSetState<State>(
	fiber: FiberNode,
	UpdateQueue: UpdateQueue<State>,
	action: Action<State>
) {
	const update = createUpdate<State>(action);
	enqueueUpdate(UpdateQueue, update);
	scheduleUpdateOnFiber(fiber);
}

function mountWorkInProgressHook(): Hook {
	const hook: Hook = {
		memoizedState: null,
		updateQueue: null,
		next: null
	};
	if (workInProgressHook === null) {
		if (currentlyRenderingFiber === null) {
			throw new Error('请在函数组件内调用 hook');
		} else {
			workInProgressHook = hook;
			currentlyRenderingFiber.memoizedProps = workInProgressHook;
		}
	} else {
		// mount 时后续的hook
		workInProgressHook.next = hook;
		workInProgressHook = hook;
	}

	return workInProgressHook;
}
