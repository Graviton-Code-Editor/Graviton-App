import { element } from '@mkenzo_8/puffin'
import { css as style } from '@emotion/css'

const styleWrapper = style`
	display: flex;
	align-items: center;
	padding: 10px 10px 10px 4px;
	overflow: hidden;
	white-space: nowrap;
	& label {
		margin-left: 12px;
		font-size: 15px;
	}
	& .slider{
		border-radius: 4px;
		background: blue;
		height: 7px;
		width: 200px;
		background: var(--sliderBackground);
		& .track {
			display: inline-block;
			position: relative;
			left: 0;
			height: 7px;
			top: -7px;
			background: var(--sliderFilledBackground);
			border-radius: inherit;
			border-top-right-radius: 0;
			border-bottom-right-radius: 0;
		}
		& .thumb {
			left: -2px;
			top: -3.5px;
			width: 14px;
			height: 14px;
			background: red;
			display: inline-block;
			position: relative;
			border-radius: 50px;
			background: var(--sliderThumbBackground);
			transition: 0.1s;
			&:hover{
				transform: scale(1.2);
				transition: 0.1s;
			}
		}
	}
`

function Slider({ data, min, max, step, value }) {
	let thumb
	let slider
	let track

	function drag(e) {
		const width = e.clientX - slider.getBoundingClientRect().left - 5

		const sliderSize = slider.offsetWidth - thumb.offsetWidth
		if (width < 0) {
			track.style.width = 0
		} else if (width > sliderSize) {
			track.style.width = sliderSize
		} else if (width > 0 && width < sliderSize) {
			track.style.width = width
		}
	}

	function clicked(e) {
		thumb = this
		slider = this.parentElement
		track = slider.firstChild

		window.addEventListener('mousemove', drag)
		window.addEventListener('mouseup', over)
	}

	function over() {
		window.removeEventListener('mousemove', drag)
		window.removeEventListener('mouseup', over)

		const toggledEvent = new CustomEvent('change', {
			detail: {
				value: ((max - min) * ((track.offsetWidth / slider.offsetWidth) * 100)) / 100 + min,
			},
		})

		slider.parentElement.dispatchEvent(toggledEvent)
	}

	return element`
		<div class="${styleWrapper}">
			<div class="slider">
				<div style="width:${((value - min) / (max - min)) * 200}px" class="track"/>
				<div :mousedown="${clicked}" class="thumb"/>
			</div>
			<label lang-string="${data.label}"/>
		</div>
	`
}

export default Slider
