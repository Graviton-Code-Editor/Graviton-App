const icons = {
	default_zoom:`
	<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="14" viewBox="0 0 14 14">
	    <g class="bbo bba" transform="translate(3 3)"  stroke-width="2">
	      <circle cx="4" cy="4" r="4" stroke="none"/>
	      <circle cx="4" cy="4" r="3.5" fill="none"/>
	    </g>
	</svg>
	`,
	minus_zoom:`
	<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="14" viewBox="0 0 14 14">
	  <g>
	    <rect class="aba" width="2" height="7" transform="translate(11 6) rotate(90)" fill="#414141"/>
	  </g>
	</svg>
	`,
	plus_zoom:`
	<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="14" viewBox="0 0 14 14">
	  <g>
	    <rect class="aba" data-name="0" width="2" height="7" transform="translate(11 6) rotate(90)"/>
    	<rect class="aba" data-name="0" width="2" height="7" transform="translate(6.5 3.5)"/>
	  </g>
	</svg>
	`,
	exit:`
	<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="14" viewBox="0 0 13 14">
	  <g>
	    <rect class="aba"  width="7" height="14" rx="2" />
	    <rect class="bba bbo" width="8" height="4" rx="2" transform="translate(4 5)" stroke-width="1" />
	    <path class="aba" d="M3.88.12a.17.17,0,0,1,.24,0L7.71,3.71A.17.17,0,0,1,7.59,4H.41a.17.17,0,0,1-.12-.29Z" transform="translate(14 3) rotate(90)" />
	  </g>
	</svg>
	`,
	unsaved:`
	<svg  xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10">
  	<circle  data-name="Elipse 1" cx="5" cy="5" r="5"/>
  </svg> 
	`,
	close:`
	<svg xmlns="http://www.w3.org/2000/svg" width="11.821" height="11.82" viewBox="0 0 11.821 11.82">
	  <g id="close" transform="translate(-4.786 -4.868)">
	    <path id="Trazado_1" data-name="Trazado 1" d="M.7,1.5l12.336-.081a.467.467,0,0,1,.472.472.482.482,0,0,1-.478.478L.69,2.452a.467.467,0,0,1-.472-.472A.482.482,0,0,1,.7,1.5Z" transform="translate(16.917 7.296) rotate(135)" stroke-linecap="square" stroke-width="1.2"/>
	    <path id="Trazado_2" data-name="Trazado 2" d="M.428-.043,12.764.038a.482.482,0,0,1,.478.478.467.467,0,0,1-.472.472L.434.906A.482.482,0,0,1-.043.428.467.467,0,0,1,.428-.043Z" transform="translate(15.029 15.778) rotate(-135)" stroke-linecap="square" stroke-width="1.2"/>
	  </g>
	</svg>
	`,
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
	</svg>
	`,
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
</svg>

	`,
  empty: `
		<svg xmlns="http://www.w3.org/2000/svg" width="20" height="15" viewBox="0 0 14 14">
		  
		</svg>
	`
}
