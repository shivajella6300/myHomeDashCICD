import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Paper } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import 'sweetalert2/dist/sweetalert2.min.css';
import { PieChart, Pie, Cell, Legend } from 'recharts';
import {
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon as HeroCheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/solid';
import { BarChart, XAxis, YAxis, Tooltip, Bar } from 'recharts';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';



const COLORS = ['#67AE6E', '#FF6363']; // Approval = Blue, Reject = Red

const Inbox = () => {
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const [paginationModel, setPaginationModel] = useState({ pageSize: 5, page: 0 });

  const [userToken] = useState(() => JSON.parse(localStorage.getItem('userInfo')) || {});

  const mockData = [
    { stationary_id: 1, name: "Alice", email: "alice@example.com", RaiserFor: "Manager A", Status: "Pending", case_id: 101 },
    { stationary_id: 2, name: "Bob", email: "bob@example.com", RaiserFor: "Manager B", Status: "Completed", case_id: 102 },
    { stationary_id: 3, name: "Charlie", email: "charlie@example.com", RaiserFor: "Manager C", Status: "Completed", case_id: 103 },
    { stationary_id: 4, name: "David", email: "david@example.com", RaiserFor: "Manager A", Status: "Pending", case_id: 104 },
    { stationary_id: 5, name: "Alice", email: "alice@example.com", RaiserFor: "Manager A", Status: "Pending", case_id: 101 },
    { stationary_id: 6, name: "Bob", email: "bob@example.com", RaiserFor: "Manager B", Status: "Completed", case_id: 102 },
    { stationary_id: 7, name: "Charlie", email: "charlie@example.com", RaiserFor: "Manager C", Status: "Pending", case_id: 103 },
    { stationary_id: 8, name: "David", email: "david@example.com", RaiserFor: "Manager A", Status: "Pending", case_id: 104 },
    { stationary_id: 9, name: "Alice", email: "alice@example.com", RaiserFor: "Manager A", Status: "Completed", case_id: 101 },
    { stationary_id: 10, name: "Bob", email: "bob@example.com", RaiserFor: "Manager B", Status: "Completed", case_id: 102 },
    { stationary_id: 11, name: "Charlie", email: "charlie@example.com", RaiserFor: "Manager C", Status: "Pending", case_id: 103 },
    { stationary_id: 12, name: "David", email: "david@example.com", RaiserFor: "Manager A", Status: "Pending", case_id: 104 },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://172.20.0.12:8085/StationeryApis/api/getData', {
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
      setData(mockData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
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
    setPaginationModel(prev => ({ ...prev, page: 0 }));
  };

 const  handleButtonClick=(case_id)=>{
  try
  {
    navigate(`/StationaryApprover/${case_id}`)
  }catch(err){
    console.err("Error In The Getting the Data")
  }
  }

  const filteredRows = useMemo(() => {
    const lowerSearch = searchText.toLowerCase();
    return data
      .filter(row => [ "Pending"].includes(row.Status))
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

  const actionStyle = (color) => ({
    width: '80px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    bgcolor: `${color}.main`,
    color: 'white',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 500,
    cursor: 'pointer',
    gap: '4px',
    '&:hover': {
      bgcolor: `${color}.dark`,
    }
  });

  const pending = data.filter(d => d.Status === 'Pending').length;
  const completed = data.filter(d => d.Status === 'Completed').length;

  const chartData = [
    { name: 'Completed', value: completed },
    { name: 'Pending', value: pending }
  ];
  const barChartData = [
    {
      name: 'Status',
      Pending: pending,
      Completed: completed
    }
  ];
  //Approve
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
        const handleClick = () => 
        {
          handleButtonClick(params.row.case_id);
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
              backgroundColor: '#007bff', // Button background color (blue)
              color: 'white',
              fontWeight: 'bold',
              width: '80px', // Adjust width as needed
              height: '32px', // Adjust height as needed
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px', // Adjust font size as needed
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
              '&:hover': {
                backgroundColor: '#0056b3', // Darker blue on hover
              },
              '&:focus': {
                outline: 'none',
              }
            }} onClick={handleClick}>
              Open
            </Box>
          </Box>
        );
      }
    },
    { field: 'case_id',       headerName: 'CASE ID', width: 130 },
    { field: 'emp_id',        headerName: 'EMP ID', width: 100 },
    { field: 'name',          headerName: 'EMP_NAME', width: 180 },
    {
      field: 'process_name',
      headerName: 'PROCESS_NAME',
      width: 100,
      valueGetter: () => 'Stationary'
    },
    { field: 'RaiserFor',     headerName: 'APPROVAL', width: 100 },     
    {
      field: 'Status',
      headerName: 'STATUS',
      width: 160,
      renderCell: (params) => {
        const status = params.value;
        const getBackgroundColor = (status) => {
          switch (status) {
            case 'Completed': return 'green';
            case 'Pending': return '#ff9800';
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
    { field: 'logs', headerName: 'LOGS', width: 200 },
    { field: 'created_at', headerName: 'CREATED_AT', width: 200 },
  ];


  return (
    <>
      <div style={{
        height: '160px',
        width: '100%',
        backgroundColor: 'white',
        borderBottom: '10px solid #ddd',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px'
      }}>
        <div className="flex w-full justify-between items-center">
          <div className="w-1/4 flex items-start justify-start h-[140px] px-4">
            <PieChart width={120} height={140}>
              <Pie
                data={chartData}
                cx="40%"
                cy="45%"
                innerRadius={28}
                outerRadius={42}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" height={20} iconSize={8} wrapperStyle={{ fontSize: '10px', marginTop: '-10px' }} />
            </PieChart>
            <div className="flex flex-col pl-4 ml-2 border-l border-gray-400 h-full  justify-center">
              <div className="text-sm font-bold p-2 rounded bg-blue-300 text-blue-1000">
                TOTAL: {pending + completed}
              </div>
              <div className="border-t border-gray-500 my-1 w-full" />
              <div className="text-xs p-2 rounded bg-yellow-300 text-yellow-1000">
                Pending: {pending}
              </div>
              <div className="text-xs p-2 rounded bg-green-300 text-green-1000">
                Completed: {completed}
              </div>
            </div>
           
                    <div className="w-[80px] flex flex-col pl-4 ml-2 border-l border-gray-400 h-full  justify-center">
                    <BarChart width={120} height={140} data={barChartData}>
                    <XAxis dataKey="name" hide />
                    <YAxis hide />
                    <Tooltip />
                    <Legend
                      content={({ payload }) => (
                        <ul className="flex justify-center space-x-2 text-[10px]">
                          {payload.map((entry, index) => (
                            <li key={`item-${index}`} className="flex items-center space-x-1">
                              <span
                                className="w-2 h-2 rounded"
                                style={{ backgroundColor: entry.color }}
                              />
                              <span>{entry.value}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    />
                    <Bar dataKey="Pending" stackId="a" fill="#facc15" barSize={20} />
                    <Bar dataKey="Completed" stackId="a" fill="#22c55e" barSize={20} />
                  </BarChart>

                   </div>

      </div>
      <div className="w-3/4 h-[140px] p-4 rounded-xl flex justify-between items-center gap-4">
  {/* Total */}
  <div className="flex-1 h-full rounded-lg bg-blue-500 flex items-center text-white font-semibold px-3">
    {/* Left side */}
    <div className="flex flex-col items-start justify-center w-1/2">
      <ChartBarIcon className="h-8 w-8 mb-2" />
      <span>Total</span>
    </div>

    {/* Vertical divider */}
    <div className="w-[1px] h-16 bg-white mx-3" />

    {/* Right side (white box) */}
    <div className="bg-white rounded p-2 text-blue-600 font-bold w-1/2 text-center">
      120
    </div>
  </div>

  {/* Pending */}
  <div className="flex-1 h-full rounded-lg bg-yellow-500 flex items-center text-white font-semibold px-3">
    <div className="flex flex-col items-start justify-center w-1/2">
      <ClockIcon className="h-8 w-8 mb-2" />
      <span>Pending</span>
    </div>
    <div className="w-[1px] h-16 bg-white mx-3" />
    <div className="bg-white rounded p-2 text-yellow-600 font-bold w-1/2 text-center">
      45
    </div>
  </div>

  {/* Completed */}
  <div className="flex-1 h-full rounded-lg bg-green-500 flex items-center text-white font-semibold px-3">
    <div className="flex flex-col items-start justify-center w-1/2">
      <HeroCheckCircleIcon className="h-8 w-8 mb-2" />
      <span>Completed</span>
    </div>
    <div className="w-[1px] h-16 bg-white mx-3" />
    <div className="bg-white rounded p-2 text-green-600 font-bold w-1/2 text-center">
      65
    </div>
  </div>

  {/* Rejected */}
  <div className="flex-1 h-full rounded-lg bg-red-500 flex items-center text-white font-semibold px-3">
    <div className="flex flex-col items-start justify-center w-1/2">
      <XCircleIcon className="h-8 w-8 mb-2" />
      <span>Rejected</span>
    </div>
    <div className="w-[1px] h-16 bg-white mx-3" />
    <div className="bg-white rounded p-2 text-red-600 font-bold w-1/2 text-center">
      10
    </div>
  </div>
</div>




        </div>
      </div>

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
  rows={filteredRows}
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
