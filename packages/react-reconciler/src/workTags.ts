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
