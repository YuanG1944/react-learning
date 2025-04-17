import * as React from 'react';
import { useState } from 'react';
import ReactDOM from 'react-dom';

console.info(import.meta.hot);

const TT = () => {
	return <div>True</div>;
};

const FF = () => {
	return <div>False</div>;
};
const App = () => {
	const [num, setNum] = useState(true);
	window.setNum = setNum;

	return <div>{num ? <TT /> : <FF />}</div>;
};

const root = document.querySelector('#root');

ReactDOM.createRoot(root).render(<App />);

// console.info('React', React);
// console.info('App', App);
// console.info('ReactDOM', ReactDOM);
