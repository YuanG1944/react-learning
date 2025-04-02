import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbol';
import { type ReactElement } from 'shared/ReactTypes';
import { createFiberFromElement, FiberNode } from './fiber';
import { Placement } from './fiberFlags';
import { HostText } from './workTags';

/**
 * beginWork性能优化策略
 * <div>
 *  <p>练习时长</p>
 *  <span>两年半</span>
 * </div>
 *
 * 理论上mount流程完毕后包含的flags:
 *  两年半 placement
 *  span placement
 *  练习时长 placement
 *  p placement
 *  div placement
 *
 * 相比与执行5次placement，我们可以构建好「离屏DOM树」后，对div执行1次placement操作
 */

function childReconciler(shouldTrackEffects: boolean) {
	function reconcileSingleTextNode(
		returnFiber: FiberNode,
		currentFiber: FiberNode | null,
		content: string | number
	) {
		const fiber = new FiberNode(HostText, { content }, null);
		fiber.return = returnFiber;
		return fiber;
	}

	function reconcileSingleElement(
		returnFiber: FiberNode,
		currentFiber: FiberNode | null,
		element: ReactElement
	) {
		// 根据element创建fiber并返回
		const fiber = createFiberFromElement(element);
		fiber.return = returnFiber;

		return fiber;
	}

	function placeSingleChild(fiber: FiberNode) {
		// 在首屏渲染 与 追踪副作用的情况下，标记Placement
		if (shouldTrackEffects && fiber.alternate === null) {
			fiber.flags |= Placement;
		}
		return fiber;
	}

	return function reconcileChildFibers(
		returnFiber: FiberNode,
		currentFiberNode: FiberNode | null,
		newChild?: ReactElement
	) {
		// 判断当前fiber的类型
		if (typeof newChild === 'object' && newChild !== null) {
			switch (newChild.$$typeof) {
				case REACT_ELEMENT_TYPE:
					return placeSingleChild(
						reconcileSingleElement(returnFiber, currentFiberNode, newChild)
					);
				default:
					if (__DEV__) {
						console.warn('未实现的reconcile类型', newChild);
					}
					break;
			}
		}

		// TODO 多节点的情况

		if (typeof newChild === 'string' || typeof newChild === 'number') {
			return placeSingleChild(
				reconcileSingleTextNode(returnFiber, currentFiberNode, newChild)
			);
		}

		if (__DEV__) {
			console.warn('为实现的reconcile类型');
		}
		return null;
	};
}

export const reconcilerChildFibers = childReconciler(true);
export const mountChildFibers = childReconciler(false);
