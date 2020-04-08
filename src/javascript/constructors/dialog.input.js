import { puffin } from '@mkenzo_8/puffin'
import Dialog from './dialog'
import Input from '../components/input'

function InputDialog({
	title,
	placeHolder = '',
}){
	return new Promise((resolve, reject) => {
		const randomSelector = Math.random()
		const component = puffin.element(`
			<div>
				<Input id="${ randomSelector }" placeHolder="${ placeHolder }" keyup="$onEnter"/>
			</div>
		`,{
			methods:{
				onEnter(e){
					if( e.keyCode === 13 ){
						e.preventDefault()
						const inputValue = document.getElementById( randomSelector ).value
						if( inputValue != '' ){
							resolve(inputValue)
						}else{
							reject()
						}
						DialogInstance.close()
					}
				}
			},
			events:{
				mounted(){
					this.children[0].focus()
				}
			},
			components:{
				Input
			}
		})
		const DialogInstance = new Dialog({
			title,
			component,
			buttons:[
				{
					label:'Continue',
					action(){
						const inputValue = document.getElementById( randomSelector ).value
						if( inputValue != '' ){
							resolve(inputValue)
						}else{
							reject()
						}
					}
				}
			]
		})  
		DialogInstance.launch()
	});
}

export default InputDialog