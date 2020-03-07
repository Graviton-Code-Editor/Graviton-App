import { puffin } from '@mkenzo_8/puffin'

const UnSavedIcon = puffin.element(`
    <div class="${puffin.style.css`
        &{
           background:var(--fileNotSavedIndicator);
           height:10px;
           width:10px;
           border-radius:100px;
        }
        &:hover{
            background:var(--fileNotSavedIndicatorHovering);
        }
    `}"></div>
    
`)

export default UnSavedIcon