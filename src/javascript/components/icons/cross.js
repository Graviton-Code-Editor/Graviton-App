import {puffin} from '@mkenzo_8/puffin'
import ThemeProvider from 'ThemeProvider'

const Cross = puffin.element(`
    <svg class="${puffin.style.css`
        ${ThemeProvider}
    
        & path{
            stroke:{{tabIconStroke}};
        }
        &:hover path{
            stroke:{{tabIconHoverStroke}};
        }
    
    `}" xmlns="http://www.w3.org/2000/svg" width="11.821" height="11.82" viewBox="0 0 11.821 11.82">
        <g transform="translate(-4.786 -4.868)">
            <path d="M.7,1.5l12.336-.081a.467.467,0,0,1,.472.472.482.482,0,0,1-.478.478L.69,2.452a.467.467,0,0,1-.472-.472A.482.482,0,0,1,.7,1.5Z" transform="translate(16.917 7.296) rotate(135)" stroke-width="0.6"/>
            <path d="M.428-.043,12.764.038a.482.482,0,0,1,.478.478.467.467,0,0,1-.472.472L.434.906A.482.482,0,0,1-.043.428.467.467,0,0,1,.428-.043Z" transform="translate(15.029 15.778) rotate(-135)" stroke-width="0.6"/>
        </g>
    </svg>
`)

export default Cross