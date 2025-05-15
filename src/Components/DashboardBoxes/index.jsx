import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IoCalendarOutline, IoClose } from "react-icons/io5";
import { GiPencilRuler, GiSteelClaws } from "react-icons/gi";
import { RiPassValidLine } from "react-icons/ri";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { MdBuild } from "react-icons/md";
import CustomCalendar from './CustomCalendar'; 
import holidayImages from './holidayImages';

// Chart.js imports
import {Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const getRandomData = () => labels.map(() => Math.floor(Math.random() * 100));

const DashboardBoxes = () => {
  const [showNotification, setShowNotification] = useState(true);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Random Dataset',
        data: getRandomData(),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  return (
    <div className="min-h-screen pt-2 px-6 pb-6  relative">
      <div className="grid grid-cols-12 gap-4 bg-blue">

        {/* Left Section - Tiles */}
        <div className="col-span-12 lg:col-span-7">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          
            {/* Meeting Room Blocking */}
            <Link to="/StationaryForm">
              <div className="box p-5 bg-white text-white rounded-xl cursor-pointer bg-gradient-to-br from-[#4183a5] via-[#56b2c4] to-[#139aed] hover:brightness-110 border border-[rgba(0,0,0,0.1)] flex items-center gap-4 transition-transform duration-300 transform hover:scale-105">
                <IoCalendarOutline className="text-[40px] text-white" />
                <div className="info w-[70%]">
                  <h3>Meeting Room Blocking</h3>
                </div>
              </div>
            </Link>

            {/* Stationery */}
            <Link to="/StationaryForm">
              <div className="box h-full p-5 bg-white text-white rounded-xl cursor-pointer bg-gradient-to-r from-[#c71d6f] to-[#d09693] hover:brightness-110 border border-[rgba(0,0,0,0.1)] flex items-center gap-4 transition-transform duration-300 transform hover:scale-105">
                <GiPencilRuler className="text-[40px] text-white" />
                <div className="info w-[70%]">
                  <h3>Stationery</h3>
                </div>
              </div>
            </Link>

            {/* Gate Pass */}
            <div className="box p-5 bg-white text-white rounded-xl cursor-pointer bg-gradient-to-br from-[#4183a5] via-[#56b2c4] to-[#139aed] hover:brightness-110 border border-[rgba(0,0,0,0.1)] flex items-center gap-4 transition-transform duration-300 transform hover:scale-105">
              <RiPassValidLine className="text-[40px] text-white" />
              <div className="info w-[70%]">
                <h3>Gate pass</h3>
              </div>
            </div>

            {/* Register Bill Tracker */}
            
            <div className="box p-5 bg-white text-white rounded-xl cursor-pointer bg-gradient-to-r from-[#c71d6f] to-[#d09693] hover:brightness-110 border border-[rgba(0,0,0,0.1)] flex items-center gap-4 transition-transform duration-300 transform hover:scale-105">
              <FaFileInvoiceDollar className="text-[30px] text-white" />
              <div className="info w-[70%]">
                <h3>Register Bill Tracker</h3>
              </div>
            </div>
            
            {/* Steel Indents */}
            <div className="box p-5 bg-white text-white rounded-xl cursor-pointer bg-gradient-to-br from-[#4183a5] via-[#56b2c4] to-[#139aed] hover:brightness-110 border border-[rgba(0,0,0,0.1)] flex items-center gap-4 transition-transform duration-300 transform hover:scale-105">
            <img src="/myHomeDashboard/steel.png" alt="Steel Indents" className="w-[40px] h-[40px] object-contain filter brightness-0 invert" />

              <div className="info w-[70%]">
                <h3>Steel Indents</h3>
              </div>
            </div>

            {/* Material/Service Indents */}
            <div className="box p-5 bg-white text-white rounded-xl cursor-pointer bg-gradient-to-r from-[#c71d6f] to-[#d09693] hover:brightness-110 border border-[rgba(0,0,0,0.1)] flex items-center gap-4 transition-transform duration-300 transform hover:scale-105">
              <MdBuild className="text-[30px] text-white" />
              <div className="info w-[70%]">
                <h3>Material/Service Indents</h3>
              </div>
            </div>

            {/* ManPower Upload Form */}
            <Link to="/ManpowerUploadForm">
            <div className="box p-5 bg-white text-white rounded-xl cursor-pointer bg-gradient-to-br from-[#4183a5] via-[#56b2c4] to-[#139aed] hover:brightness-110 border border-[rgba(0,0,0,0.1)] flex items-center gap-4 transition-transform duration-300 transform hover:scale-105">
              <FaFileInvoiceDollar className="text-[30px] text-white" />
              <div className="info w-[70%]">
                <h3>ManPower Upload Form</h3>
              </div>
            </div>
            </Link>

          </div>
        </div>

        {/* Right Section - Chart & Calendar */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-4">
        <div className="bg-white rounded-xl p-6 shadow-[0_12px_32px_rgba(0,0,0,0.2)] ring-1 ring-blue-100 border border-blue-300 h-[300px] overflow-hidden">

        <h2 className="text-lg font-semibold mb-2">Chart</h2>
        <div className="h-[240px]">
          <Bar data={chartData} options={chartOptions} />
        </div>
        </div>



          {/* Replace the old Calendar with CustomCalendar */}
          <CustomCalendar />
        </div>
      </div>

      {/* ✅ Notification Popup */}
      {showNotification && (
        <div
          className="absolute bg-white shadow-lg border border-gray-300 rounded-lg p-4 w-72 flex justify-between items-start"
          style={{
            top: '20px',
            right: '30px',
            animation: 'slideIn 0.3s ease-out',
          }}
        >
          <style jsx>{`
            @keyframes slideIn {
              0% {
                opacity: 0;
                transform: translateX(100%);
              }
              100% {
                opacity: 1;
                transform: translateX(0);
              }
            }
          `}</style>
          <div>
            <h4 className="font-semibold text-gray-800 mb-1">Reminder</h4>
            <p className="text-sm text-gray-600">Don't forget to submit your report by 5 PM today!</p>
          </div>
          <button
            onClick={() => setShowNotification(false)}
            className="ml-2 text-gray-400 hover:text-gray-600"
          >
            <IoClose size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default DashboardBoxes;