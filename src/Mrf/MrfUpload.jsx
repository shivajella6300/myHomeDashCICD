import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const FileUpload = () => {
  const [userToken, setToken] = useState(() => {
    return JSON.parse(localStorage.getItem('userInfo')) || {};
  });
  const [file, setFile] = useState(null);
  const [plantCode, setPlantCode] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handlePlantCodeChange = (e) => {
    setPlantCode(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage('');
    setError('');

    if (!file || !plantCode.trim()) {
      setError('Please select a file and enter Plant Code');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('PlantCode', plantCode);

    try {
      const response = await fetch('http://172.20.0.12:8085/StationeryApis/api/manpower-upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${userToken.token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Unknown error');
      }

      setMessage(data.message);
      navigate('/ManpowerUploadList');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div
      className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-xl border-2"
      style={{ borderColor: '#007bff' }} // Blue border
    >
      {/* Header with logo, heading, and back icon */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <img src="/mrflogo.png" alt="Logo" className="h-12 w-16 object-contain" />
          <h2 className="text-xl font-bold text-blue-600">Manpower Upload Form</h2>
        </div>
        <ArrowBackIcon
          className="text-blue-600 cursor-pointer"
          onClick={() => navigate('/dashboard')}
        />
      </div>



      {/* Blue underline */}
      <hr className="border-t-4 border-blue-600 mt-1 mb-6" />

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-800">Plant Code</label>
          <select
            value={plantCode}
            onChange={handlePlantCodeChange}
            className="mt-1 w-full p-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Plant Code</option>
            <option value="1209">1209</option>
            <option value="1208">1208</option>
            <option value="1207">1207</option>
            <option value="1206">1206</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800">Excel File</label>
          <input
            type="file"
            onChange={handleFileChange}
            accept=".xlsx, .xls"
            className="mt-1 w-full p-2 border border-blue-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-blue-600 text-white text-sm font-semibold py-1.5 px-4 rounded hover:bg-blue-700 transition"
          >
            Upload
          </button>
        </div>


        {message && <p className="text-green-600 font-medium">{message}</p>}
        {error && <p className="text-red-600 font-medium">{error}</p>}
      </form>
    </div>
  );
};

export default FileUpload;
