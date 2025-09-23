import {Outlet} from "react-router-dom";
import DiseaseNav from "../components/navbar/DiseaseNav.jsx";

const IdentifyDisease = () => {
    return(
        <>
        <DiseaseNav/>
        <Outlet/>
        </>
    )
}


export default IdentifyDisease;