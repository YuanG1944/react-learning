// ReactDOM.createRoot(root).render(<App/>)

import { Container } from 'hostConfig';
import {
	createContainer,
	updateContainer
} from 'react-reconciler/src/fiberReconciler';

import { ReactElement } from 'shared/ReactTypes';

export function createRoot(container: Container) {
	debugger
	const root = createContainer(container);

	return {
		render(element: ReactElement) {
			updateContainer(element, root);
		}
	};
}
