import React, { useState } from 'react';
import ReactDOM from 'react-dom';

// console.info(import.meta.hot);

const App = () => {
	const [num, setNum] = useState('1-1');
	return (
		<div>
			<span>{num}</span>
		</div>
	);
};

const Hello = () => <h1>Hello world xxxxx</h1>;

const root = document.querySelector('#root');

ReactDOM.createRoot(root).render(<App />);

console.info('React', React);
console.info('App', App);
console.info('ReactDOM', ReactDOM);
