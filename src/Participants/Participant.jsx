import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Paper, Modal, IconButton, Typography, Button, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import 'sweetalert2/dist/sweetalert2.min.css';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Doughnut } from 'react-chartjs-2';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { FaCheckCircle, FaExclamationCircle, FaTimesCircle, FaChartPie } from 'react-icons/fa';
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend as ChartLegend, } from 'chart.js';

ChartJS.register(ArcElement, ChartTooltip, ChartLegend);

const Participant = () => {
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const [paginationModel, setPaginationModel] = useState({ pageSize: 5, page: 0 });

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [flowData, setFlowData] = useState(null);
  const [flowLoading, setFlowLoading] = useState(false);

  const [userToken] = useState(() => JSON.parse(localStorage.getItem('userInfo')) || {});

  // Keep backend connection from first code
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/participants', {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${userToken.token}`
          }
        });

        const data = response.data.participantData;
        console.log(data);
        setData(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching participant data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!userToken.token) navigate('/');
  }, [navigate, userToken?.token]);

  const handleSearch = (e) => {
    setSearchText(e.target.value);
    setPaginationModel(prev => ({ ...prev, page: 0 }));
  };

  // Fetch flow data based on case ID
  const fetchFlowData = async (caseId) => {
    setFlowLoading(true);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/stationary/${caseId}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${userToken.token}`
        }
      });

      console.log('Flow data response:', response.data);
      setFlowData(response.data);
    } catch (error) {
      console.error("Error fetching flow data:", error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to fetch case flow data',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setFlowLoading(false);
    }
  };

  // Handle modal open
  const handleOpenModal = async (rowData) => {
    setSelectedRowData(rowData);
    setModalOpen(true);

    // Fetch flow data when modal opens
    if (rowData.CASEID) {
      await fetchFlowData(rowData.CASEID);
    }
  };

  // Handle modal close
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedRowData(null);
    setFlowData(null);
  };

  // Filter data based on search text
  const filteredData = useMemo(() => {
    if (!searchText) return data;

    return data.filter(row => {
      // Convert search text to lowercase for case-insensitive search
      const search = searchText.toLowerCase();

      // Search across all fields in the row
      return (
        (row.CASEID && row.CASEID.toLowerCase().includes(search)) ||
        (row.PROCESSNAME && row.PROCESSNAME.toLowerCase().includes(search)) ||
        (row.ACTION_UID && row.ACTION_UID.toLowerCase().includes(search)) ||
        (row.RAISER && row.RAISER.toLowerCase().includes(search)) ||
        (row.CURRENT_USER && row.CURRENT_USER.toLowerCase().includes(search)) ||
        (row.ACTION_STATUS && row.ACTION_STATUS.toLowerCase().includes(search))
      );
    });
  }, [data, searchText]);

  // Calculate counts based on actual data - FIXED TO_DO handling
  const statusCounts = useMemo(() => {
    const counts = {
      total: filteredData.length,
      completed: 0,
      pending: 0,
      rejected: 0
    };

    filteredData.forEach(row => {
      const status = row.ACTION_STATUS?.toLowerCase();
      if (status === 'completed') {
        counts.completed++;
      } else if (status === 'pending' || status === 'to_do') { // Fixed: lowercase 'to_do'
        counts.pending++;
      } else if (status === 'rejected') {
        counts.rejected++;
      }
    });

    return counts;
  }, [filteredData]);

  const donutData = {
    labels: ['Completed', 'Pending'],
    datasets: [
      {
        data: [statusCounts.completed, statusCounts.pending],
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
          return `${label}: ${value}`; // Show count with label
        },
      },
    },
    maintainAspectRatio: false, // optional for tighter fit
  };

  const stackedBarData = [
    { name: 'Data', completed: statusCounts.completed, pending: statusCounts.pending },
  ];

  // DataGrid columns with improved styling - FIXED TO_DO display and added Details column
  const columns = [
    { field: 'SNO', headerName: 'S.NO', flex: 0.5, minWidth: 80 },
    {
      field: 'details',
      headerName: 'Details',
      flex: 0.8,
      minWidth: 100,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const isToDoStatus = params.row.ACTION_STATUS?.toLowerCase() === 'to_do';
        return (
          <Button
            variant="contained"
            size="small"
            onClick={() => !isToDoStatus && handleOpenModal(params.row)}
            disabled={isToDoStatus}
            sx={{
              backgroundColor: isToDoStatus ? '#cccccc' : '#8e7ad5',
              color: isToDoStatus ? '#666666' : 'white',
              fontSize: '11px',
              padding: '4px 12px',
              cursor: isToDoStatus ? 'not-allowed' : 'pointer',
              '&:hover': {
                backgroundColor: isToDoStatus ? '#cccccc' : '#7c68c3',
              },
              '&.Mui-disabled': {
                backgroundColor: '#cccccc',
                color: '#666666',
              }
            }}
          >
            Open
          </Button>
        );
      },
    },
    { field: 'CASEID', headerName: 'CASE ID', flex: 1, minWidth: 120 },
    { field: 'PROCESSNAME', headerName: 'PROCESS', flex: 1, minWidth: 120 },
    { field: 'ACTION_UID', headerName: 'ACTION UID', flex: 1, minWidth: 120 },
    { field: 'RAISER', headerName: 'RAISER', flex: 1, minWidth: 120 },
    { field: 'CURRENT_USER', headerName: 'CURRENT USER', flex: 1.2, minWidth: 140 },
    {
      field: 'ACTION_STATUS',
      headerName: 'ACTION STATUS',
      flex: 1.2,
      minWidth: 140,
      renderCell: (params) => {
        let color = '';
        const status = params.value?.toLowerCase();
        if (status === 'pending' || status === 'to_do') color = '#facc15'; // Yellow - Fixed case
        else if (status === 'completed') color = '#22c55e'; // Green
        else if (status === 'rejected') color = '#ef4444'; // Red

        return (
          <span style={{ color, fontWeight: 'bold' }}>
            {params.value}
          </span>
        );
      }
    },
  ];

  // Function to get status color
  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === 'completed') return '#22c55e';
    if (statusLower === 'pending' || statusLower === 'to_do') return '#facc15';
    if (statusLower === 'rejected') return '#ef4444';
    if (statusLower === 'approved' || statusLower === 'approve') return '#22c55e';
    if (statusLower === 'reject') return '#ef4444';
    return 'inherit';
  };

  // Updated renderFlowData function with reduced height/width and removed headings
  const renderFlowData = () => {
    if (flowLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '150px' }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Loading flow data...</Typography>
        </Box>
      );
    }

    if (!flowData || !flowData.data) {
      return (
        <Typography variant="body1" sx={{ textAlign: 'center', py: 3 }}>
          No flow data available
        </Typography>
      );
    }

    const data = flowData.data;

    // Separate approved and rejected items
    const approvedItems = data.stationary_items ? data.stationary_items.filter(item =>
      item.sub_status?.toLowerCase() === 'approved' || item.sub_status?.toLowerCase() === 'approve'
    ) : [];

    const rejectedItems = data.stationary_items ? data.stationary_items.filter(item =>
      item.sub_status?.toLowerCase() === 'rejected' || item.sub_status?.toLowerCase() === 'reject'
    ) : [];

    const renderApprovalStep = (name, status, approvalDate, approvedItems, rejectedItems) => (
  <Box sx={{
    border: '1px solid #ccc',
    borderRadius: '6px',
    p: 1.5,
    mb: 1.5,
    backgroundColor: '#c6ddf1',
    width: '100%'
  }}>
    <Box sx={{ display: 'flex', gap: 1.5, minHeight: '100px' }}>
      
      {/* Left Box - Approval Details */}
      <Box sx={{
        flex: 1,
        border: '1px solid #ddd',
        borderRadius: '4px',
        p: 1.5,
        backgroundColor: 'white'
      }}>
        <Typography variant="body2" fontWeight="bold" sx={{ mb: 0.5 }}>
          {name}
        </Typography>
        <Typography variant="body2" fontWeight="bold" sx={{
          mb: 0.5,
          color: getStatusColor(status),
          fontSize: '12px'
        }}>
          Status: {status}
        </Typography>
        {approvalDate && (
          <Typography variant="body2" sx={{ color: 'BLACK', fontSize: '11px' }}>
            Date: {new Date(approvalDate).toLocaleDateString()}
          </Typography>
        )}
      </Box>

      {/* Right Box - Approved/Rejected Items */}
      <Box sx={{
        flex: 1,
        border: '1px solid #ddd',
        borderRadius: '4px',
        p: 1,
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column'
      }}>
        
        {/* Table Header */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 40px 60px',
          gap: '2px',
          mb: 1,
          borderBottom: '1px solid #ddd',
          pb: 0.5
        }}>
          <Typography variant="body2" fontWeight="bold" sx={{ fontSize: '10px', color: '#333' }}>
            Item
          </Typography>
          <Typography variant="body2" fontWeight="bold" sx={{ fontSize: '10px', color: '#333', textAlign: 'center' }}>
            Qty
          </Typography>
          <Typography variant="body2" fontWeight="bold" sx={{ fontSize: '10px', color: '#333', textAlign: 'center' }}>
            Status
          </Typography>
        </Box>

        {/* Table Rows */}
        <Box sx={{
          maxHeight: '60px',
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            width: '3px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#f1f1f1',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#c1c1c1',
            borderRadius: '3px',
          }
        }}>
         {/* Approved Items */}
{approvedItems.map((item, index) => (
  <Box key={`approved-${index}`} sx={{
    display: 'grid',
    gridTemplateColumns: '1fr 40px 60px',
    gap: '2px',
    py: 0.3,
    borderBottom: '1px solid #f0f0f0',
    '&:last-child': { borderBottom: 'none' }
  }}>
    <Typography variant="body2" sx={{
      fontSize: '9px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }}>
      {item.stationary}
    </Typography>
    <Typography variant="body2" sx={{ fontSize: '9px', textAlign: 'center' }}>
      {item.approved_quantity ?? item.quantity}
    </Typography>
    <Box sx={{
      backgroundColor: '#22c55e',
      color: 'white',
      fontSize: '8px',
      padding: '1px 3px',
      borderRadius: '3px',
      textAlign: 'center',
      fontWeight: 'bold'
    }}>
      APPROVED
    </Box>
  </Box>
))}


          {/* Rejected Items */}
          {rejectedItems.map((item, index) => (
            <Box key={`rejected-${index}`} sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 40px 60px',
              gap: '2px',
              py: 0.3,
              borderBottom: '1px solid #f0f0f0',
              '&:last-child': { borderBottom: 'none' }
            }}>
              <Typography variant="body2" sx={{
                fontSize: '9px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {item.stationary}
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '9px', textAlign: 'center' }}>
                {item.quantity}
              </Typography>
              <Box sx={{
                backgroundColor: '#ef4444',
                color: 'white',
                fontSize: '8px',
                padding: '1px 3px',
                borderRadius: '3px',
                textAlign: 'center',
                fontWeight: 'bold'
              }}>
                REJECTED
              </Box>
            </Box>
          ))}

          {/* If no items in either category */}
          {approvedItems.length === 0 && rejectedItems.length === 0 && (
            <Box sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '40px'
            }}>
              <Typography variant="body2" sx={{
                color: 'gray',
                fontStyle: 'italic',
                fontSize: '9px',
                textAlign: 'center'
              }}>
                No items processed
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

    </Box>
  </Box>
);


    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {/* Raiser Information */}
        {data.name && (
          <Box sx={{
            border: '1px solid #ccc',
            borderRadius: '6px',
            p: 1.5,
            backgroundColor: '#C6DEF1',
            textAlign: 'center'
          }}>
            <Typography variant="body2" fontWeight="bold" sx={{ color: '#1976d2', mb: 0.5 }}>
              Request Raised By: {data.name}
            </Typography>
            {data.raiser_date && (
              <Typography variant="body2" sx={{ color: 'black', fontSize: '11px' }}>
                Date: {new Date(data.raiser_date).toLocaleDateString()}
              </Typography>
            )}
          </Box>
        )}

        {/* Down Arrow */}
        <Typography sx={{ fontSize: 26, textAlign: 'center', color: '#1976d2' }}>
          ↓
        </Typography>

        {/* HOD Approval Step */}
        {data.hod_name && renderApprovalStep(
          data.hod_name,
          data.hod_status || 'Pending',
          data.hod_aprvl_date,
          approvedItems,
          rejectedItems
        )}

        {/* Down Arrow */}
        {data.stores_name && (
          <Typography sx={{ fontSize: 26, textAlign: 'center', color: '#1976d2' }}>
            ↓
          </Typography>
        )}

        {/* Stores Head Approval Step */}
        {data.stores_name && renderApprovalStep(
          data.stores_name,
          data.stores_status || 'Pending',
          data.stores_aprvl_date,
          approvedItems,
          rejectedItems
        )}

        {/* Current Status */}
        {(data.current_user || data.current_status) && (
          <>
            <Typography sx={{ fontSize: 26, textAlign: 'center', color: '#1976d2' }}>
              ↓
            </Typography>
            <Box sx={{
              border: '1px solid #ccc',
              borderRadius: '6px',
              p: 1.5,
              backgroundColor: '#c6ddf1',
              textAlign: 'center'
            }}>
              {data.current_user && (
                <Typography variant="body2" fontWeight="bold">
                  Current User: {data.current_user}
                </Typography>
              )}
              {data.current_task && (
                <Typography variant="body2" sx={{ mt: 0.5, fontSize: '11px' }}>
                  Task: {data.current_task}
                </Typography>
              )}
              {data.current_status && (
                <Typography variant="body2" fontWeight="bold" sx={{
                  mt: 0.5,
                  color: getStatusColor(data.current_status),
                  fontSize: '12px'
                }}>
                  Status: {data.current_status}
                </Typography>
              )}
            </Box>
          </>
        )}
      </Box>
    );
  };

  // Modal styles - reduced size and single scroll
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70%',
    maxWidth: 500,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    borderRadius: '8px',
    boxShadow: 24,
    p: 3,
    maxHeight: '70vh',
    overflow: 'auto'
  };

  return (
    <>
      {/* Dashboard tiles section */}
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
          border: '1px solid gray',
          borderRadius: '8px',
          marginBottom: '16px',
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
                  <div style={{ backgroundColor: '#C68EFD', padding: '8px', border: '1px solid #ccc', color: '#000', fontSize: '10px', fontWeight: 'bold' }}>
                    TOTAL:{statusCounts.total}
                  </div>
                  <div style={{ backgroundColor: '#A0C878', padding: '8px', border: '1px solid #ccc', color: '#000', fontSize: '10px', fontWeight: 'bold' }}>
                    COMPLETED:{statusCounts.completed}
                  </div>
                  <div style={{ backgroundColor: '#FFF085', padding: '8px', border: '1px solid #ccc', color: '#000', fontSize: '10px', fontWeight: 'bold' }}>
                    PENDING:{statusCounts.pending}
                  </div>
                </div>
              ) : index === 2 ? (
                <BarChart width={50} height={150} data={stackedBarData}>
                  <XAxis dataKey="name" hide />
                  <YAxis hide />
                  <Tooltip />
                  <Bar dataKey="completed" stackId="a" fill="#22c55e" />
                  <Bar dataKey="pending" stackId="a" fill="#facc15" />
                </BarChart>
              ) : index === 3 ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  justifyContent: 'flex-start',
                  marginTop: '10px'
                }}>
                  <FaChartPie size={30} />
                  <div>
                    <span style={{ fontWeight: 'bold' }}>Total</span>
                    <div style={{
                      backgroundColor: 'white',
                      color: 'black',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '14px',
                      marginTop: '4px',
                      width: '40px'
                    }}>
                      {statusCounts.total}
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
                    <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Completed</span>
                    <div style={{
                      backgroundColor: 'white',
                      color: 'black',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      marginTop: '4px',
                      width: '40px'
                    }}>
                      {statusCounts.completed}
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
                    <span style={{ fontWeight: 'bold' }}>Pending</span>
                    <div style={{
                      backgroundColor: 'white',
                      color: 'black',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '14px',
                      marginTop: '4px',
                      width: '40px'
                    }}>
                      {statusCounts.pending}
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
                    <span style={{ fontWeight: 'bold' }}>Rejected</span>
                    <div style={{
                      backgroundColor: 'white',
                      color: 'black',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '14px',
                      marginTop: '4px',
                      width: '40px'
                    }}>
                      {statusCounts.rejected}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {/* DataGrid section with improved styling */}
      <Paper sx={{
        width: '100%',
        padding: 2,
        border: '1px solid gray',
        borderRadius: '8px',
      }}>
        {/* Search bar */}
        <Box sx={{ mb: 2, width: '70%' }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search..."
            value={searchText}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#8e7ad5' }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box sx={{
          width: '100%',
          height: '100%',
          borderRadius: '10px',
        }}>
          <DataGrid
            rows={filteredData}
            columns={columns}
            getRowId={(row) => row.SNO}
            getRowClassName={(params) =>
              params.indexRelativeToCurrentPage % 2 === 0 ? 'even-row' : ''
            }
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[5, 10, 20]}
            autoHeight={false}
            rowHeight={30}
            columnHeaderHeight={30}
            sx={{
              width: '100%',
              height: '80%',
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#CDC1FF',
              },
              '& .MuiDataGrid-columnHeader': {
                backgroundColor: '#CDC1FF',
                fontWeight: 'bold',
              },
              '& .MuiDataGrid-columnHeaderTitle': {
                fontWeight: 'bold',
                color: '#000',
              },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: '#f0f9ff',
              },
              '& .even-row': {
                backgroundColor: '#F2F2F2',
              },
              fontSize: '13px',
              color: 'black',
            }}
          />
        </Box>
      </Paper>

      {/* Modal for displaying row details with dynamic flow data */}
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          {/* Close button */}
          <IconButton
            aria-label="close"
            onClick={handleCloseModal}
            sx={{
              position: 'absolute',
              right: 1,
              top: 1,
              color: (theme) => theme.palette.grey[700],
              padding: '4px', // smaller clickable area
            }}
          >
            <CloseIcon sx={{ fontSize: 18 }} /> {/* Reduced size */}
          </IconButton>

          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{
              mb: 2,
              pr: 5,
              textAlign: 'center',
              fontWeight: 'bold',
              backgroundImage: 'linear-gradient(90deg,rgb(131, 223, 239),rgb(223, 128, 217))', // Gradient background
              color: 'white',
              padding: '8px',
              borderRadius: '6px',
            }}
          >
            Case ID: {selectedRowData?.CASEID}
          </Typography>

          {/* Dynamic flow data */}
          {renderFlowData()}
        </Box>
      </Modal>
    </>
  );
};

export default Participant;