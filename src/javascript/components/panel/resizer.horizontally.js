import { puffin } from '@mkenzo_8/puffin'

const resizeSelector = Math.random()

function startResizing(event,resizerElement = document.getElementById(resizeSelector)){
	const otherChildren = resizerElement.parentElement.children
	let leftPanel = null;
	Object.keys(otherChildren).forEach(function(index){
		const child = otherChildren[index]
		if (child.id == resizerElement.id) {
			leftPanel = otherChildren[index-1]
		}
	})
	leftPanel.style.width = `${event.clientX - 25}px`
}

function stopResizing(){
	window.removeEventListener("mousemove", startResizing, false);
	window.removeEventListener("mouseup", stopResizing, false);
}

const resizerComponent = puffin.element(`
	<div mousedown="$working" class="${
		puffin.style.css`
			&{
				user-select: none;
				padding:3px;
				cursor:e-resize;
			}`}"/>
`,{
	events:{
		mounted(target){
			target.id = resizeSelector
		}
	},
	methods:{
		working(e){
			window.addEventListener("mousemove",startResizing, false);
			window.addEventListener("mouseup", stopResizing, false);
		}
	}
})

export default resizerComponent