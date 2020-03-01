
import { EditorClient } from '../constructors/editorclient'
import { puffin } from '@mkenzo_8/puffin'

const ImageViewerStyle = puffin.style.div`
    &{
       display:flex;
       justify-content:center;
       align-items:center;
       height:100%;
    }
    & > img{
        width:auto;
        height:auto;
        max-height:87%;
        max-width:87%;
    }
`

const ImageViewerClient = new EditorClient({
    name:'codemirror',
},{
    getValue: (instance) => "",
    getLangFromExt(extension){
        switch(extension){
            case 'svg':
                return { name: 'svg' }
            case 'png':
                return { name: 'png' }
            case 'jpg':
                return { name: 'jpg' }
            default:
                return { 
                    name: extension,
                    unknown:true
                 }   
        }
    },
    create({ element, directory }){
        
        const ImageViewerComp = puffin.element(`
            <ImageViewerStyle>
                <img src="${directory}"/>
            </ImageViewerStyle>
        `,{
            components:{
                ImageViewerStyle
            }
        })

        puffin.render(ImageViewerComp,element)

        return {
            instance : {}
        }
    },
    getCursorPosition({instance}){
        return {
            line:0,
            ch:0
        }
    }
})

export default ImageViewerClient