import { ReactElement } from 'shared/ReactTypes';

// @ts-ignore
import { createRoot } from 'react-dom';

export function renderIntoDocument(element: ReactElement) {
	const div = document.createElement('div');

	// element
	return createRoot(div).render(element);
}
