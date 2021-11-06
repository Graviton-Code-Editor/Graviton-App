import { useRecoilValue } from "recoil";
import { panels } from "../utils/atoms";


/*
 * Sidebar that contains all the loaded panels
 */
function Panels(){

    const loadedPanels = useRecoilValue(panels);

    return (
        <div>
            <div>
            {loadedPanels.map(({ panel }) => {
                return <button key={panel.name}>{panel.name}</button>
            })}
            </div>
           <div>
           {loadedPanels.map(({ panel, displayed }) => {
                if (displayed){
                    const Container = panel.container;
                    return <Container key={panel.name}/>;
                }
            })}
           </div>
        </div>
    )
}

export default Panels;