import { puffin } from '@mkenzo_8/puffin'

const CardsListContainer = puffin.style.div`
    &{
        display:flex;
        flex-direction:columns;
        flex:1;
        max-height:100%;
        overflow:hidden;
    }
    & > div{
        overflow:auto;
        padding-right:20px;
        min-height:80%;
        max-height:80%;
        display:block;
    }
    & > div > div{
        min-width:100%;
        max-width:auto;
        white-space:nowrap;
        overflow:hidden;
        padding:20px 25px;
        display:block;
    }
    & > div > div *{
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        left:0;
        margin:6px 2px;
        display:block;
    }
`

export default CardsListContainer