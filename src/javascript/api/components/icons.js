/*
########################################
              MIT License

Copyright (c) 2019 Marc Espin Sanz

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/

module.exports = {
   icons: {
      default_zoom: `
			<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="14" viewBox="0 0 14 14">
				<g class="bbo bba" transform="translate(3 3)"  stroke-width="2">
					<circle cx="4" cy="4" r="4" stroke="none"/>
					<circle cx="4" cy="4" r="3.5" fill="none"/>
				</g>
			</svg>`,
      minus: `
			<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="14" viewBox="0 0 14 14">
				<g>
					<rect class="aba" width="2" height="7" transform="translate(11 6) rotate(90)" fill="#414141"/>
				</g>
			</svg>`,
      plus: `
			<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="14" viewBox="0 0 14 14">
				<g>
					<rect class="aba" data-name="0" width="2" height="7" transform="translate(11 6) rotate(90)"/>
					<rect class="aba" data-name="0" width="2" height="7" transform="translate(6.5 3.5)"/>
				</g>
			</svg>`,
      exit: `
			<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="14" viewBox="0 0 13 14">
				<g>
					<rect class="aba"  width="7" height="14" rx="2" />
					<rect class="bba bbo" width="8" height="4" rx="2" transform="translate(4 5)" stroke-width="1" />
					<path class="aba" d="M3.88.12a.17.17,0,0,1,.24,0L7.71,3.71A.17.17,0,0,1,7.59,4H.41a.17.17,0,0,1-.12-.29Z" transform="translate(14 3) rotate(90)" />
				</g>
			</svg>`,
      unsaved: `
			<svg  xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10">
				<circle  data-name="Elipse 1" cx="5" cy="5" r="5"/>
			</svg> 
			`,
      close: `
			<svg xmlns="http://www.w3.org/2000/svg" width="11.821" height="11.82" viewBox="0 0 11.821 11.82">
				<g transform="translate(-4.786 -4.868)">
					<path class="aba" id="Trazado_1" data-name="Trazado 1" d="M.7,1.5l12.336-.081a.467.467,0,0,1,.472.472.482.482,0,0,1-.478.478L.69,2.452a.467.467,0,0,1-.472-.472A.482.482,0,0,1,.7,1.5Z" transform="translate(16.917 7.296) rotate(135)" stroke-linecap="square" stroke-width="1.2"/>
					<path class="aba" id="Trazado_2" data-name="Trazado 2" d="M.428-.043,12.764.038a.482.482,0,0,1,.478.478.467.467,0,0,1-.472.472L.434.906A.482.482,0,0,1-.043.428.467.467,0,0,1,.428-.043Z" transform="translate(15.029 15.778) rotate(-135)" stroke-linecap="square" stroke-width="1.2"/>
				</g>
			</svg>`,
      split_screen: `
			<svg  xmlns="http://www.w3.org/2000/svg" width="20" height="13" viewBox="0 0 14 14">
				<g  id="Grupo_6" data-name="Grupo 6" transform="translate(-472 -381)">
					<g  class="bbo" id="Rectángulo_34" data-name="Rectángulo 34" transform="translate(472 381)" fill="transparent"  stroke-width="1.5">
						<rect width="14" height="14" rx="2" stroke="none"/>
						<rect x="0.75" y="0.75" width="12.5" height="12.5" rx="1.25" fill="none"/>
					</g>
						<path class="aba" id="Trazado_27" data-name="Trazado 27" d="M5,0A2,2,0,0,1,7,2V12a2,2,0,0,1-2,2H2a11.389,11.389,0,0,1-2-.125V2S-.011.206,0,0Z" transform="translate(479 381)" />
					<g class="bba" id="Rectángulo_36" data-name="Rectángulo 36" transform="translate(482 386)"  fill="white"  stroke-width="1">
						<rect width="1" height="4" stroke="none"/>
						<rect x="0.5" y="0.5" height="3" fill="none"/>
					</g>
					<g class="bba" id="Rectángulo_37" data-name="Rectángulo 37" transform="translate(484.5 387.5) rotate(90)" fill="white" stroke-width="1">
						<rect width="1" height="4" stroke="none"/>
						<rect x="0.5" y="0.5" height="3" fill="none"/>
					</g>
				</g>
			</svg>
			`,
      remove_screen: `
			<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="13" viewBox="0 0 14 14">
				<g id="remove_screen" >
					<g class="bbo" id="_2" data-name="2" fill="none"  stroke-width="1.5">
						<rect width="14" height="14" rx="2" stroke="none"/>
						<rect x="0.75" y="0.75" width="12.5" height="12.5" rx="1.25" fill="none"/>
					</g>
					<path class="aba" id="_1" data-name="1" d="M4.756,0a1.953,1.953,0,0,1,1.9,2V12a1.953,1.953,0,0,1-1.9,2H1.9A10.318,10.318,0,0,1,0,13.875V2S-.01.206,0,0Z" transform="translate(7.341)" fill="#707070"/>
					<g class="aba" id="_0" data-name="0" transform="translate(6.5 6.5) rotate(90)" stroke-width="1">
						<rect width="1" height="4" stroke="none"/>
						<rect x="0.5" y="0.5" height="3" fill="none"/>
					</g>
				</g>
			</svg>
			`,
      info: `
			<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="13" viewBox="0 0 14 14">
				<g fill="transparent"  >
					<g class="bbo" id="Elipse_2" data-name="Elipse 2" stroke-width="1.5">
						<circle cx="7" cy="7" r="7" stroke="none"/>
						<circle cx="7" cy="7" r="6.25" fill="none"/>
					</g>
					<text class="aba" id="i" transform="translate(6 10)"  font-size="8" font-family="TrebuchetMS-Bold, Trebuchet MS" font-weight="700"><tspan x="0" y="0">i</tspan></text>
				</g>
			</svg>
			`,
      new_terminal: `
			<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="14" viewBox="0 0 14 14">
				<g id="new_terminal" clip-path="url(#clip-path)">
					<g class="aba" id="_2" data-name="2"  stroke-width="1.5">
						<rect width="14" height="14" rx="2" stroke="none"/>
						<rect x="0.75" y="0.75" width="12.5" height="12.5" rx="1.25" fill="none"/>
					</g>
					<g class="bba" id="_0" data-name="0" transform="translate(10.5 6.5) rotate(90)"  stroke-width="1">
						<rect width="1" height="4" stroke="none"/>
						<rect x="0.5" y="0.5" height="3" fill="none"/>
					</g>
					<g class="bba" id="_0-2" data-name="0" transform="translate(8 5)" fill="#fff" stroke="#fff" stroke-width="1">
						<rect width="1" height="4" stroke="none"/>
						<rect x="0.5" y="0.5" height="3" fill="none"/>
					</g>
					<text class="bba" id="_" data-name="/" transform="translate(3 10)" font-size="10" font-family="Inter-Bold, Inter" font-weight="700"><tspan x="0" y="0">/</tspan></text>
				</g>
			</svg>`,
      close_terminal: `
			<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="14" viewBox="0 0 14 14">
				<g id="close_terminal" clip-path="url(#clip-path)">
					<g class="aba" id="_2" data-name="2"  stroke-width="1.5">
					<rect width="14" height="14" rx="2" stroke="none"/>
					<rect x="0.75" y="0.75" width="12.5" height="12.5" rx="1.25" fill="none"/>
					</g>
					<g class="bba" id="_0" data-name="0" transform="translate(10.5 6.5) rotate(90)"  stroke-width="1">
					<rect width="1" height="4" stroke="none"/>
					<rect x="0.5" y="0.5" height="3" fill="none"/>
					</g>
					<text class="bba" id="_" data-name="/" transform="translate(3 10)"  font-size="10" font-family="Inter-Bold, Inter" font-weight="700"><tspan x="0" y="0">/</tspan></text>
				</g>
			</svg>`,
      update: `
			<svg class=icon xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="20" viewBox="0 0 89.138 89.138">
				<g class=bbo  fill="none"  stroke-width="10">
					<circle cx="44.569" cy="44.569" r="44.569" stroke="none"/>
					<circle cx="44.569" cy="44.569" r="39.569" fill="none"/>
				</g>
				<g  transform="translate(28.554 74.404) rotate(-90)">
					<path class=aba d="M8.5,0H25.488a8.5,8.5,0,0,1,0,16.992H8.5A8.5,8.5,0,0,1,8.5,0Z" transform="translate(7.952 7.873)"  stroke-linecap="round" stroke-width="1"/>
					<path class=aba d="M18.293.707a1,1,0,0,1,1.414,0L36.293,17.293A1,1,0,0,1,35.586,19H2.414a1,1,0,0,1-.707-1.707Z" transform="translate(52.936 -3) rotate(90)" />
				</g>
				</g>
			</svg>
		`,
      star: `
			<svg width="13" height="13" style="position:relative;top:2px" viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M18.1739 2.92705C18.4733 2.00574 19.7767 2.00574 20.0761 2.92705L23.1943 12.5241C23.3282 12.9361 23.7121 13.215 24.1454 13.215H34.2363C35.205 13.215 35.6078 14.4547 34.8241 15.0241L26.6603 20.9554C26.3099 21.21 26.1632 21.6614 26.2971 22.0734L29.4153 31.6704C29.7147 32.5917 28.6602 33.3578 27.8765 32.7884L19.7128 26.8571C19.3623 26.6025 18.8877 26.6025 18.5372 26.8572L10.3735 32.7884C9.58979 33.3578 8.53531 32.5917 8.83466 31.6704L11.9529 22.0734C12.0868 21.6614 11.9401 21.21 11.5897 20.9553L3.42595 15.0241C2.64223 14.4547 3.045 13.215 4.01373 13.215H14.1046C14.5379 13.215 14.9218 12.9361 15.0557 12.5241L18.1739 2.92705Z" fill="#FFC300"/>
			</svg>
		`,
      settings: `
	<svg width="20" height="14" viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg">
		<g clip-path="url(#clip0)">
			<path class="aba" d="M15.3813 3.98372C17.3684 1.09693 21.6316 1.09693 23.6187 3.98372L24.9009 5.84659C25.7548 7.08718 27.1224 7.87678 28.6238 7.99599L30.8782 8.175C34.3717 8.45241 36.5033 12.1445 34.9968 15.3087L34.0246 17.3506C33.3772 18.7104 33.3772 20.2896 34.0246 21.6494L34.9968 23.6913C36.5033 26.8555 34.3717 30.5476 30.8782 30.825L28.6238 31.004C27.1224 31.1232 25.7548 31.9128 24.9009 33.1534L23.6187 35.0163C21.6316 37.9031 17.3684 37.9031 15.3813 35.0163L14.0991 33.1534C13.2452 31.9128 11.8776 31.1232 10.3762 31.004L8.12183 30.825C4.6283 30.5476 2.49665 26.8555 4.00318 23.6913L4.97536 21.6494C5.62279 20.2896 5.62279 18.7104 4.97536 17.3506L4.00318 15.3087C2.49665 12.1445 4.6283 8.4524 8.12184 8.175L10.3762 7.99599C11.8776 7.87678 13.2452 7.08718 14.0991 5.84659L15.3813 3.98372Z" />
			<circle cx="19.5" cy="19.4999" r="8.85294" class="bba"/>
		</g>
	</svg>
	
	`,
	market_theme:`
	<svg width="46px" height="46px" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
	<rect width="46" height="46" rx="5" fill="var(--secondaryColor)"/>
	<path d="M19 21L23 21V34C23 34.5523 22.5523 35 22 35H20C19.4477 35 19 34.5523 19 34V21Z" fill="var(--widget-color)"/>
	<path d="M19 21H32C32.5523 21 33 20.5523 33 20V19H20C19.4477 19 19 19.4477 19 20V21Z" fill="var(--widget-color)"/>
	<path d="M31 19H33V15H31V19Z" fill="var(--widget-color)"/>
	<path d="M27 15H33V14C33 13.4477 32.5523 13 32 13H27V15Z" fill="var(--widget-color)"/>
	<rect width="14" height="6" rx="1" transform="matrix(1 0 0 -1 13 17)" fill="var(--widget-color)"/>
	</svg>

	`,
	market_plugin:`
	<svg width="54" height="54" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
		<g filter="url(#filter0_d)">
		<rect x="4" y="3" width="46" height="46" rx="5" fill="var(--secondaryColor)"/>
		</g>
		<path d="M23.8345 15.3254C25.6029 12.7562 29.3971 12.7562 31.1655 15.3254V15.3254C31.9255 16.4294 33.1426 17.1322 34.4788 17.2383V17.2383C37.5879 17.4851 39.485 20.771 38.1442 23.5871V23.5871C37.5681 24.7973 37.5681 26.2027 38.1442 27.4129V27.4129C39.485 30.229 37.5879 33.5149 34.4788 33.7617V33.7617C33.1426 33.8678 31.9255 34.5706 31.1655 35.6746V35.6746C29.3971 38.2438 25.6029 38.2438 23.8345 35.6746V35.6746C23.0745 34.5706 21.8574 33.8678 20.5212 33.7617V33.7617C17.4121 33.5149 15.515 30.229 16.8558 27.4129V27.4129C17.4319 26.2027 17.4319 24.7973 16.8558 23.5871V23.5871C15.515 20.771 17.4121 17.4851 20.5212 17.2383V17.2383C21.8574 17.1322 23.0745 16.4294 23.8345 15.3254V15.3254Z" fill="var(--widget-color)"/>
		<circle cx="27.5" cy="25.4999" r="6.38235" fill="var(--secondaryColor)"/>
	</svg>
		

	`,
      empty: `
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="15" viewBox="0 0 14 14"></svg>`
   }
}