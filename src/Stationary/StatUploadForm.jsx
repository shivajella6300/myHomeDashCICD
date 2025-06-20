import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { HiTrash } from 'react-icons/hi';

const StatUploadForm = () => {
  const [userToken, setToken] = useState(() => {
    return JSON.parse(localStorage.getItem('userInfo')) || {};
  });

  // Initialize form data with user information from token
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    request_for: "",
    name: userToken.employee || "",
    email: userToken.Email || "",
    emp_id: userToken.Emp_Id || "",
    department: "",
    hod_name: "",
    items: [{ stationary: "", quantity: "", remarks: "" }],
    invoice: "",
    invoicedate: "",
  });

  // Add a state for the form mode (update or upload)
  const [formMode, setFormMode] = useState('update'); // 'update' or 'upload'
  const [file, setFile] = useState(null);
  
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "submit", "draft", or "error"
  const [errors, setErrors] = useState({});
  const [attempted, setAttempted] = useState(false);
  const navigate = useNavigate();
  
  // Set only today's date when form loads, clear localStorage on refresh
  useEffect(() => {
    // Check if this is a page refresh
    const isPageRefresh = performance.navigation && 
      performance.navigation.type === 1;
    
    // Alternative check for browsers that don't support performance.navigation
    if (isPageRefresh || document.referrer === document.location.href) {
      // Clear localStorage on page refresh
      localStorage.removeItem('stationeryFormDraft');
    }
    
    // Always set today's date
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    setFormData(prev => ({ ...prev, date: formattedDate }));
  }, []);

  const handleBack = () => {
    navigate('/dashboard');
  };

  const validateForm = () => {
  const newErrors = {};
  
  if (formMode === 'update') {
    // Validation for update mode - FIX: Removed stationery_item_no from required fields
    const requiredFields = ['date', 'invoice', 'invoicedate'];
    
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = `${field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} is required`;
      }
    });
    
    // Validate each item in the items array
    let hasItemError = false;
    formData.items.forEach((item) => {
      if (!item.stationary || !item.quantity) {
        hasItemError = true;
      }
    });
    
    if (hasItemError) {
      newErrors.items = 'All stationery items must have both type and quantity selected';
    }
  } else {
    // Validation for upload mode
    if (!file) {
      newErrors.file = 'File is required';
    }
    
    // Added invoice date validation for upload mode as well
    if (!formData.invoicedate) {
      newErrors.invoicedate = 'Invoice date is required';
    }
  }

  if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
    newErrors.email = 'Email address is invalid';
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear the error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleRadioChange = (value) => {
    setFormData(prev => ({ ...prev, request_for: value }));
    
    // Clear the error for this field if it exists
    if (errors.request_for) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors.request_for;
        return newErrors;
      });
    }
  };

  const handleItemChange = (e, index) => {
    const { name, value } = e.target;
    const updatedItems = [...formData.items];
    updatedItems[index] = { ...updatedItems[index], [name]: value };
    setFormData(prev => ({ ...prev, items: updatedItems }));
    
    // Clear the items error if all items now have values
    if (errors.items) {
      const allItemsValid = updatedItems.every(item => item.stationary && item.quantity);
      if (allItemsValid) {
        setErrors(prev => {
          const newErrors = {...prev};
          delete newErrors.items;
          return newErrors;
        });
      }
    }
  };

  const handleAddItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { stationary: "", quantity: "", remarks: "" }],
    }));
  };

  const handleRemoveItem = (index) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index),
      }));
    }
  };

  const handleReset = () => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    
    setFormData({
      date: formattedDate,
      request_for: "",
      name: userToken.employee || "",
      email: userToken.Email || "",
      emp_id: userToken.Emp_Id || "",
      department: "",
      hod_name: "",
      items: [{ stationary: "", quantity: "", remarks: "" }],
      invoice: "",
      invoicedate: "",
    });
    setErrors({});
    setAttempted(false);
    setFile(null);
    
    // Clear the saved draft from localStorage
    localStorage.removeItem('stationeryFormDraft');
  };

  const handleSaveAsDraft = () => {
    // Save form data to localStorage with the current mode
    const dataToSave = formMode === 'upload' 
      ? { ...formData, formMode, hasFile: !!file } // We can't store the actual file in localStorage
      : { ...formData, formMode };
    
    localStorage.setItem('stationeryFormDraft', JSON.stringify(dataToSave));
    
    // Show the draft modal
    setModalType("draft");
    setShowModal(true);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    
    // Clear file error if it exists
    if (errors.file) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors.file;
        return newErrors;
      });
    }
  };

  // Modified to conform to the backend API structure
const handleSubmit = async(e) => {
  e.preventDefault(); 
  setAttempted(true); // Mark that submission was attempted
  
  // Run validation
  const isValid = validateForm();
  
  if (!isValid) {
    // Show error modal
    setModalType("error");
    setShowModal(true);
    return;
  }
  
  try {
    // Different API endpoint and data based on mode
    const endpoint = formMode === 'update' 
      ? 'http://172.20.0.12:8085/StationeryApis/api/store-upload'
      : 'http://172.20.0.12:8085/StationeryApis/api/emp-stationary-upload';
    
    let requestData;
    
    if (formMode === 'update') {
      // Format data to match what the backend expects
      const stationary_items = formData.items.map(item => ({
        name: item.stationary,
        quantity: parseInt(item.quantity, 10),
        remarks: item.remarks || ""
      }));
      
      // Send JSON data for update mode
      requestData = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization: `Bearer ${userToken.token}`
        },
        body: JSON.stringify({
          invoice_number: formData.invoice,
          invoice_date: formData.invoicedate,
          date: formData.date,
          stationary_items: stationary_items
          // Other fields can be added if needed by the backend
        })
      };
    } else {
      // Send FormData for upload mode
      const formDataObj = new FormData();
      formDataObj.append('file', file);
      // Changed from 'date' to 'invoicedate' to match backend expectation
      formDataObj.append('invoicedate', formData.invoicedate);
      // Add other necessary fields
      
      requestData = {
        method: "POST",
        headers: {
          "Accept": "application/json",
          Authorization: `Bearer ${userToken.token}`
        },
        body: formDataObj
      };
    }
    
    const response = await fetch(endpoint, requestData);
    const responseData = await response.json();
    
    if (responseData.success) {
      setModalType("submit");
      setShowModal(true);
      // Optional: Reset form after successful submission
      handleReset();
    } else {
      console.error("API Error:", responseData.message);
      setModalType("error");
      setShowModal(true);
    }
  } catch(error) {
    console.error("Error in Storing Data", error);
    setModalType("error");
    setShowModal(true);
  }
};

  const inputStyle = "w-full border border-blue-500 rounded-full p-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400";
  const highlightedInputStyle = "w-full border border-blue-500 rounded-full p-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 bg-blue-50";
  const errorInputStyle = "w-full border border-red-500 rounded-full p-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-red-400 bg-red-50";
  const buttonStyle = "px-6 py-2 text-sm font-medium rounded-md transition-colors duration-300";
  const activeButtonStyle = `${buttonStyle} bg-blue-600 text-white`;
  const inactiveButtonStyle = `${buttonStyle} bg-gray-300 text-gray-700`;

  // Function to determine the correct style for input fields
  const getInputStyle = (fieldName) => {
    if (errors[fieldName] && attempted) {
      return errorInputStyle;
    }
    
    // Highlighted fields are date, name, email, emp_id
    if (['date', 'name', 'email', 'emp_id'].includes(fieldName)) {
      return highlightedInputStyle;
    }
    
    return inputStyle;
  };

  const Modal = ({ onClose }) => {
    const hasErrors = modalType === "error";
    const isDraft = modalType === "draft";

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-4 rounded-md max-w-md w-full text-center">
          <div className="flex justify-center mb-2">
            {hasErrors ? (
              <div className="rounded-full border-2 border-red-400 p-2 inline-flex">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
            ) : isDraft ? (
              <div className="rounded-full border-2 border-blue-500 p-2 inline-flex">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
                </svg>
              </div>
            ) : (
              <div className="rounded-full border-2 border-green-500 p-2 inline-flex">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            )}
          </div>
          <h2 className="text-xl font-bold mb-1">
            {hasErrors ? "Error" : isDraft ? "Draft Saved" : "Success"}
          </h2>
          <p className="mb-4 text-sm">
            {hasErrors ? "Please fill all required fields." : isDraft ? "Form saved as draft!" : "Form submitted successfully!"}
          </p>
          <button
            onClick={onClose}
            className="bg-indigo-600 text-white px-4 py-1 rounded-md font-medium text-sm"
          >
            OK
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="py-3 px-3">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow border-2 border-blue-500 overflow-hidden">
          <div className="p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <img src="./quote4.png" alt="Logo" className="mr-4 w-40 h-12 rounded-lg" />
              </div>
              <div className="flex-grow flex justify-center">
                {/* Heading inside a blue box */}
                <div className="bg-[#83bcc9] px-5 py-1.5 rounded-lg inline-block -ml-20">
                  <h1 className="text-xl font-bold text-white">Stationery Upload Form</h1>
                </div>
              </div>
              <div>
                <button
                  onClick={handleBack}
                  className="text-white bg-gradient-to-br from-[#4183a5] via-[#56b2c4] to-[#139aed] hover:bg-gradient-to-r hover:from-[#c71d6f] hover:to-[#d09693] rounded-full p-1">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="h-0.5 bg-blue-600 w-[95%] mx-auto"></div>
          
          {/* Mode Selection Buttons */}
          <div className="flex justify-center gap-4 mt-4">
            <button
              type="button"
              onClick={() => setFormMode('update')}
              className={formMode === 'update' ? activeButtonStyle : inactiveButtonStyle}
              disabled={formMode === 'update'}
            >
              UPDATE
            </button>
            <button
              type="button"
              onClick={() => setFormMode('upload')}
              className={formMode === 'upload' ? activeButtonStyle : inactiveButtonStyle}
              disabled={formMode === 'upload'}
            >
              UPLOAD
            </button>
          </div>

          <div className="p-3">
            <form onSubmit={handleSubmit} noValidate>
              {/* Top Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Image Section - Reduced Size */}
                <div className="flex justify-center">
                  <img
                    src="./stationeryimg.jpg"
                    alt="Form process illustration"
                    className="max-w-full max-h-48 mb-3 mt-4" // Slightly increased height
                  />
                </div>

                {/* Right Side Form Fields */}
                <div className="space-y-1">
                  {formMode === 'update' ? (
                    // UPDATE MODE FORM FIELDS
                    <>
                      {/* Invoice number */}
                      <div className="mb-2">
                        <div className="flex items-center">
                          <label className="w-1/3 text-indigo-800 font-bold text-xs">
                            Invoice Number<span className="text-red-500 ml-1">*</span>
                          </label>
                          <input
                            type="text"
                            name="invoice"
                            value={formData.invoice || ""}
                            onChange={handleChange}
                            className={`${getInputStyle('invoice')} h-7 text-xs px-2 w-full`}
                          />
                        </div>
                        {errors.invoice && attempted && (
                          <div className="pl-32 text-red-500 text-xs mt-0.5">{errors.invoice}</div>
                        )}
                      </div>

                      {/* Invoice Date field */}
                      <div className="mb-2"> 
                        <div className="flex items-center">
                          <label className="w-1/3 text-indigo-800 font-bold text-xs">
                            Invoice Date<span className="text-red-500 ml-1">*</span>
                          </label>
                          <input
                            type="date"
                            name="invoicedate"
                            value={formData.invoicedate}
                            onChange={handleChange}
                            className={`${getInputStyle('invoicedate')} py-1 text-xs bg-transparent`}
                          />
                        </div>
                        {errors.invoicedate && attempted && (
                          <div className="ml-1/3 pl-32 text-red-500 text-xs mt-0.5">{errors.invoicedate}</div>
                        )}
                      </div>

                      {/* System Date field */}
                      <div className="mb-2"> 
                        <div className="flex items-center">
                          <label className="w-1/3 text-indigo-800 font-bold text-xs">
                            Date<span className="text-red-500 ml-1">*</span>
                          </label>
                          <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            readOnly
                            className={`${getInputStyle('date')} py-1 text-xs`}
                          />
                        </div>
                      </div>

                      <div className="mt-2 mx-8">
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-indigo-800 font-bold text-xs"></label>
                          <button
                            type="button"
                            onClick={handleAddItem}
                            className="bg-blue-600 hover:bg-gradient-to-r hover:from-[#c71d6f] hover:to-[#d09693] text-white w-7 h-7 rounded-lg flex items-center justify-center text-base"
                          >
                            +
                          </button>
                        </div>

                        {/* Header with two equal columns */}
                        <div className="bg-blue-600 text-white grid grid-cols-2 p-1.5 rounded-t-lg text-xs font-semibold">
                          <div className="pr-2 border-r border-white">Stationery Item</div>
                          <div className="pl-2">Quantity</div>
                        </div>

                        {/* Items with two equal columns */}
                        <div className="max-h-36 overflow-y-auto border border-t-0 border-gray-300 rounded-b-lg">
                          {formData.items.map((item, index) => (
                            <div key={index} className="grid grid-cols-2 p-1 border-b border-gray-200 text-xs">
                              {/* Stationery Item input */}
                              <div className="pr-2 border-r border-gray-300">
                                <select
                                  name="stationary"
                                  value={item.stationary}
                                  onChange={(e) => handleItemChange(e, index)}
                                  className={`${errors.items && attempted ? errorInputStyle : inputStyle} h-7 px-2 w-full`}
                                >
                                  <option value="">Select</option>
                                  <option value="Notebook">Notebook</option>
                                  <option value="Pen">Pen</option>
                                  <option value="Folder">Folder</option>
                                  <option value="Marker">Marker</option>
                                </select>
                              </div>

                              {/* Quantity input + Remove button */}
                              <div className="pl-2 flex items-center gap-1">
                                <input
                                  type="number"
                                  name="quantity"
                                  placeholder="Qty"
                                  min="1"
                                  value={item.quantity}
                                  onChange={(e) => handleItemChange(e, index)}
                                  className={`${errors.items && attempted ? errorInputStyle : inputStyle} h-7 px-2 w-full`}
                                />
                                {formData.items.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveItem(index)}
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    <HiTrash className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Error Message for Items */}
                        {errors.items && attempted && (
                          <div className="text-red-500 text-xs mt-1">{errors.items}</div>
                        )}
                      </div>
                    </>
                  ) : (
                    // UPLOAD MODE FORM FIELDS
                    <>
                      {/* Invoice Date field */}
                      <div className="mb-2"> 
                        <div className="flex items-center">
                          <label className="w-1/3 text-indigo-800 font-bold text-xs">
                            Invoice Date<span className="text-red-500 ml-1">*</span>
                          </label>
                          <input
                            type="date"
                            name="invoicedate"
                            value={formData.invoicedate}
                            onChange={handleChange}
                            className={`${getInputStyle('invoicedate')} py-1 text-xs bg-transparent`}
                          />
                        </div>
                        {errors.invoicedate && attempted && (
                          <div className="ml-1/3 pl-32 text-red-500 text-xs mt-0.5">{errors.invoicedate}</div>
                        )}
                      </div>

                      {/* File Upload field */}
                      <div className="mb-4">
                        <div className="flex items-center">
                          <label className="w-1/3 text-indigo-800 font-bold text-xs">
                            Upload File<span className="text-red-500 ml-1">*</span>
                          </label>
                          <input
                            type="file"
                            name="file"
                            onChange={handleFileChange}
                            className={`${errors.file && attempted ? errorInputStyle : inputStyle} py-1 text-xs`}
                            accept=".xlsx,.xls,.csv,.pdf"
                          />
                        </div>
                        {errors.file && attempted && (
                          <div className="pl-32 text-red-500 text-xs mt-0.5">{errors.file}</div>
                        )}
                      </div>
                      
                      {/* File information */}
                      {file && (
                        <div className="bg-blue-50 p-3 rounded-lg mt-2 mb-2">
                          <h3 className="text-sm font-semibold text-blue-800">File Information:</h3>
                          <p className="text-xs text-gray-700 mt-1">Name: {file.name}</p>
                          <p className="text-xs text-gray-700">Size: {(file.size / 1024).toFixed(2)} KB</p>
                          <p className="text-xs text-gray-700">Type: {file.type || "Unknown"}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
         
              {/* Centered Buttons */}
              <div className="flex justify-center gap-5 mt-5">
                <button
                  type="button"
                  onClick={handleSaveAsDraft}
                  className="bg-blue-600 hover:bg-gradient-to-r hover:from-[#c71d6f] hover:to-[#d09693] text-white px-5 py-1.5 rounded-md flex items-center gap-1.5 text-sm"
                >
                  Save as Draft
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-gradient-to-r hover:from-[#c71d6f] hover:to-[#d09693] flex items-center gap-1.5 text-white px-5 py-1.5 rounded-md text-sm"
                >
                  Submit
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {showModal && <Modal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default StatUploadForm;