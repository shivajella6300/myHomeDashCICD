import React, { useState, useEffect } from "react";
import { useNavigate ,useParams} from 'react-router-dom';
import { HiTrash } from 'react-icons/hi';

const StationeryApproverForm = () => {
  const { case_id } = useParams();
  //Stationary Data By Employee Id
  const [statData,setStationaryData]=useState([]);
  const [formData, setFormData] = useState({
    date: "",
    request_for: "",
    name: "",
    email: "",
    emp_id: "",
    department: "",
    hod_name: "",
    items: [{ stationary: "", quantity: "", remarks: "" }],
    comments: "",
  });
  const [userToken,setToken]=useState(()=>{
    return JSON.parse(localStorage.getItem("userInfo"))?JSON.parse(localStorage.getItem("userInfo")):{}
  });
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "submit" or "draft"
  const [errors, setErrors] = useState({});
  const [attempted, setAttempted] = useState(false);
  const navigate = useNavigate();
  
const fetchDataByEmpId=async()=>
  {
  try
  {
    const getDataStBYEmpId = await fetch(`http://172.20.0.12:8085/StationeryApis/api/gt-stat-userId/${case_id}`,{
      method:"GET",
      headers:
      {
        "Content-Type":"application/json",
        Accept:"application/json",
        Authorization:`Bearer ${userToken.token}`,
      }
    })
    
    const statAndSubStatData =await getDataStBYEmpId.json();
    setStationaryData(statAndSubStatData.Stationary_data[0])
   console.log(statAndSubStatData.Stationary_data[0]);
  }catch(error){
    console.error("Error in getting the data");
  }
}

useEffect(() => {
  if (case_id) {
   // alert(case_id);
    fetchDataByEmpId();
  }
}, [case_id]); // ✅ run when case_id changes



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
    const requiredFields = ['date', 'request_for', 'name', 'email', 'emp_id', 'department', 'hod_name'];

    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = `${field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} is required`;
      }
    });

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }

    // Validate each item in the items array
    let hasItemError = false;
    formData.items.forEach((item, index) => {
      if (!item.stationary || !item.quantity) {
        hasItemError = true;
      }
    });
    
    if (hasItemError) {
      newErrors.items = 'All stationery items must have both type and quantity selected';
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
      name: "",
      email: "",
      emp_id: "",
      department: "",
      hod_name: "",
      items: [{ stationary: "", quantity: "", remarks: "" }],
      comments: "",
    });
    setErrors({});
    setAttempted(false);
    
    // Clear the saved draft from localStorage
    localStorage.removeItem('stationeryFormDraft');
  };

  const handleSaveAsDraft = () => {
    // Save form data to localStorage
    localStorage.setItem('stationeryFormDraft', JSON.stringify(formData));
    
    // Show the draft modal
    setModalType("draft");
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAttempted(true);

    if (validateForm()) {
      setModalType("submit");
      setShowModal(true);
      // Clear the saved draft after successful submission
      localStorage.removeItem('stationeryFormDraft');
    } else {
      setModalType("error");
      setShowModal(true);
    }
  };

  const inputStyle = "w-full border border-blue-500 rounded-full p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400";
  const highlightedInputStyle = "w-full border border-blue-500 rounded-full p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 bg-blue-50";
  const errorInputStyle = "w-full border border-red-500 rounded-full p-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-400 bg-red-50";

  const Modal = ({ onClose }) => {
    const hasErrors = modalType === "error";
    const isDraft = modalType === "draft";

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-md max-w-md w-full text-center">
          <div className="flex justify-center mb-4">
            {hasErrors ? (
              <div className="rounded-full border-2 border-red-400 p-4 inline-flex">
                <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
            ) : isDraft ? (
              <div className="rounded-full border-2 border-blue-500 p-4 inline-flex">
                <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
                </svg>
              </div>
            ) : (
              <div className="rounded-full border-2 border-green-500 p-4 inline-flex">
                <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            )}
          </div>
          <h2 className="text-2xl font-bold mb-2">
            {hasErrors ? "Error" : isDraft ? "Draft Saved" : "Success"}
          </h2>
          <p className="mb-6">
            {hasErrors ? "Please fill all required fields." : isDraft ? "Form saved as draft!" : "Form submitted successfully!"}
          </p>
          <button
            onClick={onClose}
            className="bg-indigo-600 text-white px-6 py-2 rounded-md font-medium"
          >
            OK
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen py-8 px-2">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow border-4 border-blue-500 overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <img src="/myHomeDashboard/quote4.png" alt="Logo" className="mr-4 w-60 h-16 rounded-lg" />
              </div>
              <div className="flex-grow flex justify-center">
                {/* Heading inside a blue box */}
                <div className="bg-[#83bcc9] px-6 py-3  rounded-lg inline-block -ml-28">
                  <h1 className="text-2xl font-bold text-white">Stationery Request Form</h1>
                </div>
              </div>
              <div>
                <button
                  onClick={handleBack}
                  className="text-white bg-gradient-to-br from-[#4183a5] via-[#56b2c4] to-[#139aed] hover:bg-gradient-to-r hover:from-[#c71d6f] hover:to-[#d09693] rounded-full p-2">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="h-1 bg-blue-600 w-[95%] mx-auto"></div>

          <div className="p-6">
            <form onSubmit={handleSubmit} noValidate>
              {/* Top Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Image Section - Reduced Size */}
                <div className="flex justify-center">
                  <img
                    src="/myHomeDashboard/stationeryimg.jpg"
                    alt="Form process illustration"
                    className="max-w-full h-48 mb-6 mt-10" // Reduced height and width
                  />
                </div>

                {/* Right Side Form Fields - Now taking 2 columns */}
                <div className="space-y-4 lg:col-span-2">
                  {/* Row 1: Employee Name and Date */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Employee Name field */}
                    <div>
                      <div className="flex items-center">
                        <label className="w-1/3 text-indigo-800 font-bold text-sm">
                          Employee Name<span className="text-red-500 ml-2">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={statData.name}
                          readOnly
                          onChange={handleChange}
                          className={errors.name && attempted ? errorInputStyle : highlightedInputStyle}
                        />
                      </div>
                      {errors.name && attempted && (
                        <div className="ml-1/3 pl-32 text-red-500 text-sm mt-1">{errors.name}</div>
                      )}
                    </div>

                    {/* Date field */}
                    <div>
                      <div className="flex items-center">
                        <label className="w-1/3 text-indigo-800 font-bold text-sm">
                          Date<span className="text-red-500 ml-2">*</span>
                        </label>
                        <input
                          type="date"
                          name="date"
                          value={formData.date}
                          readOnly
                          onChange={handleChange}
                          className={errors.date && attempted ? errorInputStyle : highlightedInputStyle}
                        />
                      </div>
                      {errors.date && attempted && (
                        <div className="ml-1/3 pl-32 text-red-500 text-sm mt-1">{errors.date}</div>
                      )}
                    </div>
                  </div>

                  {/* Row 2: Email Id */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center">
                        <label className="w-full md:w-1/3 text-indigo-800 font-bold text-sm">
                          Email Id<span className="text-red-500 ml-2">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={statData.email}
                          readOnly
                          onChange={handleChange}
                          className={errors.email && attempted ? errorInputStyle : highlightedInputStyle}
                        />
                      </div>
                      {errors.email && attempted && (
                        <div className="ml-1/3 pl-32 text-red-500 text-sm mt-1">{errors.email}</div>
                      )}
                    </div>
                  </div>


                  {/* Row 3: Request For and Employee ID */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Request For - Radio Buttons */}
                    <div>
                      <div className="flex items-center">
                        <label className="w-1/3 text-indigo-800 font-bold text-sm">
                          Request For<span className="text-red-500 ml-2">*</span>
                        </label>
                        <div className="flex gap-4">
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name="request_for"
                              checked={statData.request_for === "Self"}
                              disabled 
                              onChange={() => handleRadioChange("Self")}
                              className={`mr-2 h-4 w-4 ${errors.request_for && attempted ? "text-red-600" : "text-blue-600"}`}
                            />
                            <span>Self</span>
                          </label>
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name="request_for"
                              checked={statData.request_for === "Others"}
                              disabled
                              onChange={() => handleRadioChange("Others")}
                              className={`mr-2 h-4 w-4 ml-16 ${errors.request_for && attempted ? "text-red-600" : "text-blue-600"}`}
                            />
                            <span>Others</span>
                          </label>
                        </div>
                      </div>
                      {errors.request_for && attempted && (
                        <div className="ml-1/3 pl-32 text-red-500 text-sm mt-1">{errors.request_for}</div>
                      )}
                    </div>

                    {/* Employee ID field */}
                    <div>
                      <div className="flex items-center">
                        <label className="w-1/3 text-indigo-800 font-bold text-sm">
                          Employee ID<span className="text-red-500 ml-2">*</span>
                        </label>

                        <input
                          type="text"
                          name="emp_id"
                          value={statData.emp_id} 
                          readOnly
                          onChange={handleChange}
                          className={errors.email && attempted ? errorInputStyle : highlightedInputStyle}
                        />
                      </div>
                      {errors.emp_id && attempted && (
                        <div className="ml-1/3 pl-32 text-red-500 text-sm mt-1">{errors.emp_id}</div>
                      )}
                    </div>
                  </div>

                  {/* Row 4: Department and Department HOD */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Department field */}
                    <div>
                      <div className="flex items-center">
                        <label className="w-1/3 text-indigo-800 font-bold text-sm">
                          Department<span className="text-red-500 ml-2">*</span>
                        </label>
                        <input
                          type="text"
                          name="department"
                          value={statData.department}
                          readOnly
                          onChange={handleChange}
                          className={errors.email && attempted ? errorInputStyle : highlightedInputStyle}
                        />
                       
                      </div>
                      {errors.department && attempted && (
                        <div className="ml-1/3 pl-32 text-red-500 text-sm mt-1">{errors.department}</div>
                      )}
                    </div>

                    {/* Department HOD field */}
                    <div>
                      <div className="flex items-center">
                        <label className="w-1/3 text-indigo-800 font-bold text-sm">
                          Department HOD<span className="text-red-500 ml-2">*</span>
                        </label>
                        <input
                          type="text"
                          name="department"
                          value={statData.RaiserFor}
                          readOnly
                          onChange={handleChange}
                          className={errors.email && attempted ? errorInputStyle : highlightedInputStyle}
                        />
                        {/* <select
                          name="hod_name"
                          value={formData.hod_name}
                          onChange={handleChange}
                          disabled
                          className={errors.hod_name && attempted ? errorInputStyle : inputStyle}
                        >
                          <option value="">Select</option>
                          {["Rama Devi", "Sai Vineeth", "Shiva Jella"].map((option, i) => (
                            <option key={i} value={option.trim()}>{option}</option>
                          ))}
                        </select> */}
                      </div>
                      {errors.hod_name && attempted && (
                        <div className="ml-1/3 pl-32 text-red-500 text-sm mt-1">{errors.hod_name}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>


              {/* Logs and Comments Table */}
              <div className="mt-8 mx-12">
                <div className="flex items-center mb-2">
                  <label className="text-indigo-800 font-bold text-base">Logs and Comments</label>
                </div>
                
                {/* Header with two columns */}
                <div className="bg-blue-600 text-white grid grid-cols-2 p-2 rounded-t-lg">
                  <div className="font-bold pr-2 border-r-2 border-white">Activity Logs</div>
                  <div className="font-bold pl-2">Comments</div>
                </div>
                
                {/* Logs and Comments row */}
                <div className="grid grid-cols-2 border-b border-gray-300 p-2">
                  <div className="pr-2 border-r-2 border-gray-300">
                    <div className="text-sm text-gray-700 mb-2">
                      {new Date().toLocaleString()} - Request Initiated
                    </div>
                    <div className="text-sm text-gray-700">
                      {new Date(new Date().getTime() - 24*60*60*1000).toLocaleString()} - Last Modified
                    </div>
                  </div>
                  <div className="pl-2">
                    <textarea
                      name="comments"
                      placeholder="Add your comments here..."
                      value={formData.comments || ''}
                      onChange={handleChange}
                      className={`${inputStyle} h-20 rounded-lg`}
                    />
                  </div>
                </div>
              </div>

              {/* Stationery Items Section - Kept as is */}
              <div className="mt-10 mx-12">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-indigo-800 font-bold text-base">Stationery Items<span className="text-red-500 ml-2">*</span></label>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="bg-blue-600 hover:bg-gradient-to-r hover:from-[#c71d6f] hover:to-[#d09693] text-white w-8 h-8 rounded-lg flex items-center justify-center"
                  >
                    +
                  </button>
                </div>

                {/* Header with three equal columns */}
                <div className="bg-blue-600 text-white grid grid-cols-3 p-2 rounded-t-lg">
                  <div className="font-bold pr-2 border-r-2 border-white">Stationery Item</div>
                  <div className="font-bold px-2 border-r-2 border-white">Quantity</div>
                  <div className="font-bold pl-2">Available Quantity</div>
                </div>

                {/* Items with three equal columns */}
                {formData.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-3 border-b border-gray-300 p-2 mt-2">
                    <div className="pr-2 border-r-2 border-gray-300">
                      <select
                        name="stationary"
                        value={item.stationary}
                        onChange={(e) => handleItemChange(e, index)}
                        disabled
                        className={errors.items && attempted ? errorInputStyle : inputStyle}
                      >
                        <option value="">Select Stationery</option>
                        <option value="Notebook">Notebook</option>
                        <option value="Pen">Pen</option>
                        <option value="Folder">Folder</option>
                        <option value="Marker">Marker</option>
                      </select>
                    </div>
                    <div className="px-2 border-r-2 border-gray-300">
                      <select
                        name="quantity"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(e, index)}
                       
                        className={errors.items && attempted ? errorInputStyle : inputStyle}
                      >
                        <option value="">Qty</option>
                        {[1, 2, 3, 4].map((q) => (
                          <option key={q} value={q}>{q}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center pl-2">
                      <input
                        type="text"
                        name="remarks"
                        placeholder=""
                        value={item.remarks || ''}
                        onChange={(e) => handleItemChange(e, index)}
                        className={`${inputStyle} flex-grow`}
                      />
                      {formData.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className="text-red-600 ml-2"
                        >
                          <HiTrash className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {errors.items && attempted && (
                  <div className="text-red-500 text-sm mt-1">{errors.items}</div>
                )}
              </div>

              {/* Centered Buttons */}
              <div className="flex justify-center gap-6 mt-10">
                <button
                  type="button"
                  onClick={handleSaveAsDraft}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-2 rounded-md flex items-center gap-2"
                >
                  Reject
                </button>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-800  flex items-center gap-2 text-white px-8 py-2 rounded-md"
                > Approve
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

export default StationeryApproverForm;