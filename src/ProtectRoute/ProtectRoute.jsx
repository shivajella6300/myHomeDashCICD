import {Outlet,Navigate} from 'react-router-dom';


const ProtectRoute=()=>
{
    const userInfo=JSON.parse(localStorage.getItem('userInfo'));
    return userInfo?.token? <Outlet/>:<Navigate to="/" replace/>
}
export default ProtectRoute;