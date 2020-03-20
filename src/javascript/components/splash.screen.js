import { puffin } from '@mkenzo_8/puffin'
import { Text } from '@mkenzo_8/puffin-drac'

const SplashScreen = puffin.element(`
	<div class="${puffin.style.css`
			&{
				background:var(--splashScreenBackground);
				color:var(--splashScreenText);
				position:fixed;
				top:0;
				left:0;
				min-height:100%;
				min-width:100%;
				display:flex;
				justify-content:center;
				align-items:center;
				font-size:20px;
			}
		`}">
		<Text>Graviton</Text>
	</div>
`,{
	components:{
		Text
	},
	events:{
		mounted(target){
			window.addEventListener("load",function(){
				console.log("%c 🎉 Loaded successfully. ", "color:black; border-radius:10px; background:pink; padding:3px 8px; margin:5px 0px;")
				target.remove()
			})
		}
	}
})

export default SplashScreen