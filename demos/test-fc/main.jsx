import React from 'react';
import ReactDOM from 'react-dom';

const App = () => {
	return (
		<div>
			<span>
				{/* HostText */}
				<Hello />
			</span>
		</div>
	);
};

const Hello = () => <h1>Hello world xxxxx</h1>;

const root = document.querySelector('#root');

ReactDOM.createRoot(root).render(<App />);

console.info('React', React);
console.info('App', App);
console.info('ReactDOM', ReactDOM);
