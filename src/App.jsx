import './App.css'
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import Dashboard from './Pages/Dashboard';
import Header from './Components/Header/index.jsx';
import Sidebar from './Components/Sidebar/index.jsx';
import {createContext, useState} from 'react';
import DemoStationaryList from './Demo/DemoStationaryList.jsx';
import Login from './Forms/Login.jsx';
import MainPage from './MainPage/MainPage.jsx';
import ProtectRoute from './ProtectRoute/ProtectRoute.jsx';
import StationaryRequestForm from './Stationary/StationaryRequestForm.jsx';
import StationaryApproverForm from './Stationary/StationaryApproverForm.jsx'
import Mrf from './Mrf/Mrf.jsx'; // Manpower Request Form import
import MrfUpload from  './Mrf/MrfUpload.jsx';
import MrfUploadList from './Mrf/MrfUploadList.jsx';
import Inbox from './Inbox/Inbox.jsx';
import StationaryStoreApproval from './Stationary/StationaryStoreApproval.jsx'
import Participant from './Participants/Participant.jsx';
import StatUploadForm from './Stationary/StatUploadForm.jsx';


const MyContext = createContext();

function App() {
  const [isSidebarOpen, setisSidebarOpen] = useState(true);
  
  const router = createBrowserRouter([
    {
      path: "/",
      exact: true,
      element: <MainPage/>
    },
    {
      path: '/login',
      exact: true,
      element: <Login/>
    },
    {
      element: <ProtectRoute />, // 👈 Protect all routes under this
      children: [
        {
          path: '/dashboard',
          exact: true,
          element: (
            <section className='main'>
              <Header/>
              <div className='contentMain flex'>
                <div className={`sidebarWapper ${isSidebarOpen === true ? 'w-[18%]' : 'w-[90px]'} transition-all`}>
                  <Sidebar/>
                </div>
                <div className={`contentRight py-4 px-4 ${isSidebarOpen ? 'w-[82%]' : 'w-[calc(100%-90px)]'} transition-all`}>
                  <Dashboard/>
                </div>
              </div>
            </section>
          )
        },
        {
          path: '/StationaryList',
          exact: true,
          element: (
            <section className='main'>
              <Header/>
              <div className='contentMain flex'>
                <div className={`sidebarWapper ${isSidebarOpen === true ? 'w-[18%]' : 'w-[90px]'} transition-all`}>
                  <Sidebar/>
                </div>
                <div className={`contentRight py-4 px-4 ${isSidebarOpen === true ? 'w-[82%]' : 'w-[calc(100%-90px)]'} transition-all`}>
                  <Inbox/>
                </div>
              </div>
            </section>
          )
        },
        {
          path:"/DemoStationaryList",
          exact:true,
          element: (
            <section className='main'>
              <Header/>
              <div className='contentMain flex'>
                <div className={`sidebarWapper ${isSidebarOpen === true ? 'w-[18%]' : 'w-[90px]'} transition-all`}>
                  <Sidebar/>
                </div>
                <div className={`contentRight py-4 px-4 ${isSidebarOpen === true ? 'w-[82%]' : 'w-[calc(100%-90px)]'} transition-all`}>
                  <DemoStationaryList/>
                </div>
              </div>
            </section>
          )
        },
        {
          path: '/StationaryForm',
          exact: true,
          element: (
            <section className='main'>
              <Header/>
              <div className='contentMain flex'>
                <div className={`sidebarWapper ${isSidebarOpen === true ? 'w-[18%]' : 'w-[90px]'} transition-all`}>
                  <Sidebar/>
                </div>
                <div className={`contentRight py-4 px-4 ${isSidebarOpen === true ? 'w-[82%]' : 'w-[calc(100%-90px)]'} transition-all`}>
                  <StationaryRequestForm/>
                </div>
              </div>
            </section>
          )
        },
        
        {
          path: '/ManpowerForm',
          exact: true,
          element: (
            <section className='main'>
              <Header/>
              <div className='contentMain flex'>
                <div className={`sidebarWapper ${isSidebarOpen === true ? 'w-[18%]' : 'w-[90px]'} transition-all`}>
                  <Sidebar/>
                </div>
                <div className={`contentRight py-4 px-4 ${isSidebarOpen === true ? 'w-[82%]' : 'w-[calc(100%-90px)]'} transition-all`}>
                  <Mrf/>
                </div>
              </div>
            </section>
          )
        },
        {
          path: '/ManpowerUploadForm',
          exact: true,
          element: (
            <section className='main'>
              <Header/>
              <div className='contentMain flex'>
                <div className={`sidebarWapper ${isSidebarOpen === true ? 'w-[18%]' : 'w-[90px]'} transition-all`}>
                  <Sidebar/>
                </div>
                <div className={`contentRight py-4 px-4 ${isSidebarOpen === true ? 'w-[82%]' : 'w-[calc(100%-90px)]'} transition-all`}>
                  <MrfUpload/>
                </div>
              </div>
            </section>
          )
        },

        {
          path: '/ManpowerUploadList',
          exact: true,
          element: (
            <section className='main'>
              <Header/>
              <div className='contentMain flex'>
                <div className={`sidebarWapper ${isSidebarOpen === true ? 'w-[18%]' : 'w-[90px]'} transition-all`}>
                  <Sidebar/>
                </div>
                <div className={`contentRight py-4 px-4 ${isSidebarOpen === true ? 'w-[82%]' : 'w-[calc(100%-90px)]'} transition-all`}>
                  <MrfUploadList/>
                </div>
              </div>
            </section>
          )
        },

        {
          path: '/StationaryApprover/:case_id',
          exact: true,
          element: (
            <section className='main'>
              <Header/>
              <div className='contentMain flex'>
                <div className={`sidebarWapper ${isSidebarOpen === true ? 'w-[18%]' : 'w-[90px]'} transition-all`}>
                  <Sidebar/>
                </div>
                <div className={`contentRight py-4 px-4 ${isSidebarOpen === true ? 'w-[82%]' : 'w-[calc(100%-90px)]'} transition-all`}>
                  <StationaryApproverForm/>
                </div>
              </div>
            </section>
          )
        },
        {
          path: '/StationaryStoreApproval/:case_id',
          exact: true,
          element: (
            <section className='main'>
              <Header/>
              <div className='contentMain flex'>
                <div className={`sidebarWapper ${isSidebarOpen === true ? 'w-[18%]' : 'w-[90px]'} transition-all`}>
                  <Sidebar/>
                </div>
                <div className={`contentRight py-4 px-4 ${isSidebarOpen === true ? 'w-[82%]' : 'w-[calc(100%-90px)]'} transition-all`}>
                  <StationaryStoreApproval/>
                </div>
              </div>
            </section>
          )
        },
         {
          path: '/participants',
          exact: true,
          element: (
            <section className='main'>
              <Header/>
              <div className='contentMain flex'>
                <div className={`sidebarWapper ${isSidebarOpen === true ? 'w-[18%]' : 'w-[90px]'} transition-all`}>
                  <Sidebar/>
                </div>
                <div className={`contentRight py-4 px-4 ${isSidebarOpen === true ? 'w-[82%]' : 'w-[calc(100%-90px)]'} transition-all`}>
                  <Participant/>
                </div>
              </div>
            </section>
          )
        }
        ,
         {
          path: '/stationaryUpload',
          exact: true,
          element: (
            <section className='main'>
              <Header/>
              <div className='contentMain flex'>
                <div className={`sidebarWapper ${isSidebarOpen === true ? 'w-[18%]' : 'w-[90px]'} transition-all`}>
                  <Sidebar/>
                </div>
                <div className={`contentRight py-4 px-4 ${isSidebarOpen === true ? 'w-[82%]' : 'w-[calc(100%-90px)]'} transition-all`}>
                  <StatUploadForm/>
                </div>
              </div>
            </section>
          )
        }
      ],
    },
  ], {
    basename: '/myHomeDashboard', // ✅ Put basename here
  }
)
  
  const values = {
    isSidebarOpen,
    setisSidebarOpen,
  }
  
  return (
    <>
      <MyContext.Provider value={values}>
        <RouterProvider router={router}/>
      </MyContext.Provider>
    </>
  )
}

export default App;
export {MyContext};