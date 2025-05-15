import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Paper } from '@mui/material';
import 'sweetalert2/dist/sweetalert2.min.css';

import {
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon as HeroCheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/solid';

import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Doughnut } from 'react-chartjs-2';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { FaCheckCircle, FaExclamationCircle, FaTimesCircle, FaChartPie } from 'react-icons/fa';
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend as ChartLegend,} from 'chart.js';

ChartJS.register(ArcElement, ChartTooltip, ChartLegend);

const Inbox = () => {
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const [paginationModel, setPaginationModel] = useState({ pageSize: 5, page: 0 });

  const [userToken] = useState(() => JSON.parse(localStorage.getItem('userInfo')) || {});

  // Keep backend connection from first code
  const fetchData = async () => 
    {
    setLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/getData', {
        headers: {
          "Content-Type": "application/json",
          Accept: 'application/json',
          Authorization: `Bearer ${userToken.token}`
        }
      });
      const responseData = response.data?.data || [];
      console.log(responseData);
      setData(responseData.length ? responseData : mockData);
    } catch (error) {
      console.error("Error fetching data. Using mock:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() =>
    {
      fetchData();
    }, 1000);
  }, []);

  useEffect(() => {
    if (location.state?.refresh) fetchData();
  }, [location]);

  useEffect(() => {
    if (!userToken.token) navigate('/');
  }, [navigate, userToken?.token]);

  const handleSearch = (e) => {
    setSearchText(e.target.value);
    setPaginationModel(prev => ({...prev, page: 0}));
  };

  const handleButtonClick = (case_id) => 
  {
    try {
      navigate(`/StationaryApprover/${case_id}`)
    } catch(err) {
      console.error("Error In The Getting the Data")
    }
  }

  const filteredRows = useMemo(() => {
    const lowerSearch = searchText.toLowerCase();
    return data
      .filter(row => ["Pending"].includes(row.Status))
      .filter(row =>
        `${row.name} ${row.email} ${row.RaiserFor} ${row.Status}`.toLowerCase().includes(lowerSearch)
      );
  }, [searchText, data]);

  const handleApprove = async (case_id) => {
    Swal.fire("Approved!", `Case ID ${case_id} approved ✅`, "success");
    fetchData();
  };

  const handleReject = async (case_id) => {
    Swal.fire("Rejected!", `Case ID ${case_id} rejected ❌`, "error");
    fetchData();
  };

  // Calculate status counts for charts
  const statusCounts = useMemo(() => {
    const counts = {
      total: data.length,
      completed: 0,
      pending: 0,
      rejected: 0,
    };

    data.forEach(item => {
      const status = item.Status?.toLowerCase();
      if (status === 'completed') counts.completed += 1;
      else if (status === 'pending') counts.pending += 1;
      else if (status === 'rejected') counts.rejected += 1;
    });

    return counts;
  }, [data]);

  const donutData = {
    labels: ['completed', 'pending'],
    datasets: [
      {
        data: [60, 40],
        backgroundColor: ['#67AE6E', '#F5C45E'],
        hoverBackgroundColor: ['#328E6E', '#E78B48'],
      },
    ],
  };
  
  const donutOptions = {
    plugins: {
      legend: {
        labels: {
          font: {
            size: 10, // Adjust the font size for legend labels
          },
        },
      },
      tooltip: {
        titleFont: { size: 10 },
        bodyFont: { size: 10 },
      },
      // Modify the labels inside the donut chart
      datalabels: {
        color: 'white', // You can set this to the color you want
        font: {
          size: 12,  // Reduced font size inside the donut
          weight: 'bold',
        },
        formatter: (value, context) => {
          const label = context.chart.data.labels[context.dataIndex];
          return `${label}: ${value}%`; // Show percentage with label
        },
      },
    },
    maintainAspectRatio: false, // optional for tighter fit
  };
  
  
  const stackedBarData = [
    { name: 'Mon', completed: 40, pending: 30 },
   
  ];

  // DataGrid columns from first code with improvements
  const columns = [
    {
      field: 'sno',
      headerName: 'S.NO',
      width: 80,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const index = params.api.getRowIndexRelativeToVisibleRows(params.id);
        const pageSize = paginationModel.pageSize;
        const page = paginationModel.page;
    
        const serialNumber = page * pageSize + index + 1;
        return serialNumber;
      }
    },
    {
      field: 'btn',
      headerName: 'BUTTON',
      width: 130,
      renderCell: (params) => {
        const handleClick = () => handleButtonClick(params.row.case_id);
    
        return (
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            width: '100%',
          }}>
            <Box sx={{
              borderRadius: '5px',
              backgroundColor: '#007bff',
              color: 'white',
              fontWeight: 'bold',
              width: '80px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
              '&:hover': {
                backgroundColor: '#0056b3',
              },
              '&:focus': {
                outline: 'none',
              }
            }} onClick={handleClick}>
              OPEN
            </Box>
          </Box>
        );
      }
    },
    { field: 'case_id', headerName: 'CASE ID', width: 130 },
    { field: 'emp_id', headerName: 'EMP ID', width: 100 },
    { field: 'name', headerName: 'EMP_NAME', width: 180 },
    {
      field: 'process_name', 
      headerName: 'PROCESS_NAME', 
      width: 100,
      valueGetter: () => 'Stationary'
    },
    { field: 'current_user', headerName: 'APPROVAL', width: 100 },
    {
      field: 'current_status',
      headerName: 'STATUS',
      width: 160,
      renderCell: (params) => {
        const status = params.value;
        const getBackgroundColor = (status) => {
          switch (status) {
            case 'Completed': return 'green';
            case 'TO_DO': return '#ff9800';
            default: return '#bdbdbd';
          }
        };
        return (
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            width: '100%',
          }}>
            <Box sx={{
              borderRadius: '5px',
              backgroundColor: getBackgroundColor(status),
              color: 'white',
              fontWeight: 'bold',
              width: '100px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
            }}>
              {status}
            </Box>
          </Box>
        );
      },
    },
    { field: 'hod_aprvl_date', headerName: 'LOGS', width: 200 },
    { field: 'raiser_date', headerName: 'Raiser_Date', width: 200 },
  ];

  return (
    <>
      {/* Dashboard tiles from second code */}
      <div
      style={{
        height: '180px',
        width: '100%',
        backgroundColor: 'white',
        borderBottom: '10px solid #ddd',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        padding: '0 16px',
        boxSizing: 'border-box',
        gap: '10px',
      }}
    >
      {[...Array(7)].map((_, index) => {
        const tileStyle = {
          flex: '1 1 11.28%',
          minWidth: '100px',
          height: '150px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '14px',
          padding: '10px',
          boxSizing: 'border-box',
          color: 'white',
          border: '1px solid #ccc',
          borderRadius: '12px',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          cursor: 'pointer',
          backgroundColor: '#ffffff', // default white
          ...(index === 3 && { backgroundColor: '#87CEEB' }), // Total - sky blue
          ...(index === 4 && { backgroundColor: '#22c55e' }), // Completed - green
          ...(index === 5 && { backgroundColor: '#facc15', color: 'black' }), // Pending - yellow
          ...(index === 6 && { backgroundColor: '#ef4444' }), // Rejected - red
        };

        return (
          <div
            key={index}
            className="tile"
            style={tileStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.03)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {index === 0 ? (
              <Doughnut data={donutData} options={donutOptions} />
            ) : index === 1 ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                  width: '100%',
                }}
              >
                <div style={{ backgroundColor: '#C68EFD', padding: '8px', border: '1px solid #ccc', color: '#000' , fontSize: '10px' }}>
                  TOTAL:40
                </div>
                <div style={{ backgroundColor: '#A0C878', padding: '8px', border: '1px solid #ccc', color: '#000',fontSize: '10px' }}>
                  COMPLETED:20
                </div>
                <div style={{ backgroundColor: '#FFF085', padding: '8px', border: '1px solid #ccc', color: '#000',fontSize: '10px' }}>
                 PENDING:20
                </div>
              </div>
            ) : index === 2 ? (
              <BarChart width={50} height={150} data={stackedBarData}>
              {/* Removed <CartesianGrid /> */}
              <XAxis dataKey="name" hide />
              <YAxis hide />
              <Tooltip />
              <Bar dataKey="completed" stackId="a" fill="#22c55e" />
              <Bar dataKey="pending" stackId="a" fill="#facc15" />
            </BarChart>

            ) :  index === 3 ? (
              <div style={{
                display: 'flex', 
                alignItems: 'flex-start', // Aligns content to the top
                gap: '8px', 
                justifyContent: 'flex-start', 
                marginTop: '10px'  // Optional: adds space from the top
              }}>
                <FaChartPie size={30} />
                <div>
                  <span>Total</span>
                  {/* Additional div for the value */}
                  <div style={{
                    backgroundColor: 'white', 
                    color: 'black', 
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    fontSize: '14px',
                    marginTop: '4px', // Space between the label and the value
                    width:'40px'
                  }}>
                    40 {/* Example value */}
                  </div>
                </div>
              </div>
            ) : index === 4 ? (
              <div style={{
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: '8px', 
                justifyContent: 'flex-start', 
                marginTop: '10px'
              }}>
                <FaCheckCircle size={30} />
                <div>
                <span style={{ fontSize: '12px' }}>Completed</span>

                  {/* Additional div for the value */}
                  <div style={{
                    backgroundColor: 'white', 
                    color: 'black', 
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    fontSize: '12px',
                    marginTop: '4px' ,
                    width:'40px'// Space between the label and the value
                  }}>
                    30 {/* Example value */}
                  </div>
                </div>
              </div>
            ) : index === 5 ? (
              <div style={{
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: '8px', 
                justifyContent: 'flex-start', 
                color: 'white', 
                marginTop: '10px'
              }}>
                <FaExclamationCircle size={30} />
                <div>
                  <span>Pending</span>
                  {/* Additional div for the value */}
                  <div style={{
                    backgroundColor: 'white', 
                    color: 'black', 
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    fontSize: '14px',
                    marginTop: '4px', // Space between the label and the value
                    width:'40px'
                  }}>
                    10 {/* Example value */}
                  </div>
                </div>
              </div>
            ) : index === 6 ? (
              <div style={{
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: '8px', 
                justifyContent: 'flex-start', 
                marginTop: '10px'
              }}>
                <FaTimesCircle size={30} />
                <div>
                  <span>Rejected</span>
                  {/* Additional div for the value */}
                  <div style={{
                    backgroundColor: 'white', 
                    color: 'black', 
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    fontSize: '14px',
                    marginTop: '4px' ,// Space between the label and the value
                    width:'40px'
                  }}>
                    5 {/* Example value */}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>



      {/* DataGrid section from both codes */}
      <Paper sx={{ width: '100%', padding: 2 }}>
        <TextField
          variant="outlined"
          placeholder="Search..."
          value={searchText}
          onChange={handleSearch}
          sx={{ width: '300px', mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            style: {
              fontSize: '14px',
              borderRadius: '8px'
            }
          }}
        />

        <DataGrid
          rows={data}
          columns={columns}
          getRowId={(row) => row.stationary_id}
          loading={loading}
          autoHeight
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 20]}
          sx={{
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f3f4f6',
              fontWeight: 'bold',
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: '#f0f9ff',
            },
            fontSize: '13px'
          }}
        />
      </Paper>
    </>
  );
};

export default Inbox;