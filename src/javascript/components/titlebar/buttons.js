
import {puffin} from '@mkenzo_8/puffin'
import ThemeProvider from '../../utils/themeprovider'

if("windows" == "windows"){
    var Buttons = puffin.element(`
        <div class="buttons" class="${puffin.style.css`
            ${ThemeProvider}
            rect{
                stroke:{{controlButtonsFill}};
            }
            rect.fill{
                fill:{{controlButtonsFill}};
            }
        `}">
            <button title="Minimize">
                <svg xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="0 0 24 24" width="24" height="24">
                    <rect x="7" y="11.5" width="10" height="0.8" transform="matrix(1,0,0,1,0,0)" />
                </svg>
            </button>
            <button title="Maximize">
                <svg width="24" height="24" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="16" y="16" width="18.5714" height="18.5714"  stroke-width="2" />
                </svg>
            </button>
            <button title="Close">
                <svg width="20" height="20" viewBox="0 0 174 174" xmlns="http://www.w3.org/2000/svg">
                    <rect class="fill" x="40.3309" y="127.305" width="123" height="9" rx="4.5" transform="rotate(-45 40.3309 127.305)" />
                    <rect class="fill" x="127.305" y="133.669" width="123" height="9" rx="4.5" transform="rotate(-135 127.305 133.669)"  />
                </svg>
            </button>
        </div>
    `)
}else{
    var Buttons = puffin.element(`
        <div class="buttons" >
            <button title="Close" >
                <img/>
            </button>
            <button title="Minimize">
                <img/>
            </button>
            <button title="Zoom">
                <img/>
            </button>
        </div>
    `)
}

export default Buttons
