import { MosyCard } from "../../components/MosyCard";
import { mosyBtoa, mosyUpdateUrlParam } from "../../MosyUtils/hiveUtils";
import RegisteredsitesProfile from "../gpssites/uiControl/RegisteredsitesProfile";

export  function loadSiteData(sitedata)
{
    mosyUpdateUrlParam("sites_uptoken", mosyBtoa(sitedata.token || sitedata.primkey || ""));
    MosyCard("",<RegisteredsitesProfile dataIn={{showNavigationIsle:false}}/>,true, "modal1","mosycard_wide")
    
}