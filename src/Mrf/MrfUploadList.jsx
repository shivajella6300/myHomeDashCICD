import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { Link,useLocation,useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import '../assets/styles/style.css';
import 'sweetalert2/dist/sweetalert2.min.css';
import { DataGrid } from '@mui/x-data-grid';
import { Box,IconButton, Paper } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';


const MrfUploadList = () => 
{
    const [userToken,setUserToken] = useState(()=>
    {
        return JSON.parse(localStorage.getItem('userInfo'))||{};
    })
    //console.log(userToken.token);
const loaderStyle = {
    border: '5px solid #f3f3f3',
    borderTop: '5px solid #3498db',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    animation: 'spin 1s linear infinite',
    margin: '50px auto',
    };
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState([]);
  const [loading,setLoading] =useState(true);
   const location =useLocation();
   const navigate=useNavigate();
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 0,
  });  
  const fetchData = async()=>
 {
    setLoading(true);
    try
    {
     const response = await axios.get('http://127.0.0.1:8000/api/manpower-upload-get'
      ,
      {
      headers:
      {
          "Content-Type":"application/json",
           Accept:'application/json',
          Authorization:`Bearer  ${userToken.token}`
        }
    }) 
    console.log(response);
     if(response.data && Array.isArray(response.data.data))
     {
        setData(response.data.data);
     }
    }
    catch(error)
    {
      console.error("Data is not in the Array Format here---");
    }finally
    {
     setLoading(false);
    }
  }
    useEffect(() => 
      { 
        setTimeout(()=>
        {
          fetchData(); // ✅ Force refresh if navigating from MyForm
          setLoading(false);
        },1000)    
        }, 
    []);
  
      useEffect(() => 
      {
          if (location.state?.refresh) 
         {
            fetchData(); // ✅ Force refresh if navigating from MyForm
          }
        }, [location]);
      useEffect(()=>
      {
       if(!userToken.token)
      {
        navigate('/')
       }
      },[navigate,userToken?.token])
  const handleSearch = (e) => 
  {
    setSearchText(e.target.value);
    setPaginationModel({...paginationModel,page:0}); // Reset page on search
  };

  const columns = [
    { field: 'mrf_id', headerName: 'MRF_ID', width: 150 }, 
    { field: 'Plant_code', headerName: 'Plant_code', width: 170 },
    { field: 'Designation', headerName: 'Designation',  width: 150 },
    { field: 'Total_Requirement', headerName: 'Tl_Reqmt',  width: 150 },
    { field: 'Availability', headerName: 'Avail', width: 170 },
    { field: 'Actual_Requirement', headerName: 'Act_Reqmt',  width: 150 },
    { field: 'created_at', headerName: 'created_at', width: 170 },    
  ];
  return (
    <Paper sx={{ height: 440, width: '100%',  padding: 2 }}>
      <input
        type="text"
        placeholder="Search..."
        value={searchText}
        onChange={handleSearch}
        className="border p-2 rounded mb-4 w-50"
      />
      <DataGrid
        rows={data}
        columns={columns}
        loading={loading}
        getRowId={(row) => row.mrf_id} // 👈 This line fixes the error
        rowCount={data.length}
        pagination
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[5, 10, 15]}
        checkboxSelection
        getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? 'even-row' : 'odd-row')}
        sx={{ border: 0, mt: 2 , '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: 'bold', // Makes header text bold
          },
                '& .even-row': {
            backgroundColor: '#f9f9f9', // Light gray
            },
            '& .odd-row': {
            backgroundColor: '#ffffff', // White
            },
        }}
      />
    </Paper>
  );
};

export default MrfUploadList;
