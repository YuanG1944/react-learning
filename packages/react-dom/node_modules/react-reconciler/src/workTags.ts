/**
 * 1. FunctionComponent
			FunctionComponent 这种 workTag 代表的是函数组件。
			函数组件是 React 里一种基本的组件形式，它属于一个纯函数，接收 props 作为参数，然后返回 React 元素。

			function MyFunctionComponent(props) {
				return <div>{props.message}</div>;
			}

 * 2. HostComponent
			HostComponent 这个 workTag 表示的是宿主组件。
			宿主组件是指那些由 React 渲染器（像 React DOM 或者 React Native）所管理的原生组件。
			在 React DOM 里，宿主组件一般对应着 DOM 元素，例如 <div>、<span> 等。

			const element = <div>Hello, World!</div>;

 * 3. HostText
			HostText 这种 workTag 代表的是文本节点。
			文本节点是 DOM 树里的基本节点，用来存储纯文本内容。

			const textElement = <div>这是一段文本</div>;

 * 4. HostRoot
			HostRoot 这个 workTag 表示的是根 Fiber 节点。
			每个 React 应用都有一个根节点，它是整个 Fiber 树的起始点。
			在 React DOM 里，根节点通常和 ReactDOM.render 方法里的容器元素相关联。

			ReactDOM.render(<App />, document.getElementById('root'));
 */

export const FunctionComponent = 0;

// ReactDom.render(root)
export const HostRoot = 3;
// div
export const HostComponent = 5;
// <div>text</div>
export const HostText = 6;

export type WorkTag =
	| typeof FunctionComponent
	| typeof HostRoot
	| typeof HostComponent
	| typeof HostText;
