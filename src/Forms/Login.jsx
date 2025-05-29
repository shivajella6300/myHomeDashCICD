import React, { useState, useEffect } from "react";
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Box, TextField, Button, Typography, InputAdornment, IconButton, Paper
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [userToken, setToken] = useState(() => {
    return JSON.parse(localStorage.getItem('userInfo')) || {};
  });
  const [focusedField, setFocusedField] = useState(""); // NEW

  const handleTogglePassword = () => setShowPassword(!showPassword);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    if (userToken.token) {
      navigate('/dashboard');
    }
  }, [navigate, userToken?.token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const loginData = await axios.post(
        "http://127.0.0.1:8000/api/login",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          }
        }
      );
      console.log(loginData);
      const userInfo = {
        token: loginData.data.token,
        Emp_Id: loginData.data.employee.Emp_Id,
        employee: loginData.data.employee.Employee_Name,
        Email: loginData.data.employee.Email,
        Is_Employee: loginData.data.employee.Is_Employee,
        Emp_Category:loginData.data.employee.Emp_Category
      };
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      navigate('/dashboard', { state: { refresh: true } });
    } catch (error) {
      console.error("Login Credentials Not Matched");
    }
  };

  return (
    <Box
      position="relative"
      width="100vw"
      height="100vh"
      overflow="hidden"
    >
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          top: 0,
          left: 0,
          zIndex: -2,
        }}
      >
        <source src="/myHomeDashboard/bg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Dark Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: -1,
        }}
      />

      {/* Login Form */}
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100%"
      >
        <Paper
          elevation={0}
          sx={{
            p: 4,
            width: 350,
            height: 400,
            borderRadius: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(8px)',
            color: '#fff',
            boxShadow: `
              0 0 8px rgba(255, 255, 255, 0.6),
              0 0 16px rgba(255, 255, 255, 0.4),
              0 0 24px rgba(255, 255, 255, 0.2)
            `
          }}
        >

          {/* 🐼 Panda GIF (top middle inside login box) */}
          <Box display="flex" justifyContent="center" mb={1}>
            <img
              src={focusedField === "password" ? "/myHomeDashboard/panda-closed.gif" : "/myHomeDashboard/panda-open.gif"}
              alt="Panda"
              style={{ width: 80, height: 80 }}
            />
          </Box>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="UserName"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              onFocus={() => setFocusedField("username")} // NEW
              onBlur={() => setFocusedField("")} // NEW
              required
              InputLabelProps={{ style: { color: '#fff' } }}
              InputProps={{
                style: { color: '#fff' },
                sx: {
                  '& input:-webkit-autofill': {
                    WebkitBoxShadow: '0 0 0 1000px rgba(255, 255, 255, 0.1) inset',
                    WebkitTextFillColor: '#fff',
                    caretColor: '#fff',
                    transition: 'background-color 5000s ease-in-out 0s',
                  }
                }
              }}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              onFocus={() => setFocusedField("password")} // NEW
              onBlur={() => setFocusedField("")} // NEW
              required
              InputLabelProps={{ style: { color: '#fff' } }}
              InputProps={{
                style: { color: '#fff' },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePassword} edge="end" sx={{ color: '#fff' }}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  '& input:-webkit-autofill': {
                    WebkitBoxShadow: '0 0 0 1000px rgba(255, 255, 255, 0.1) inset',
                    WebkitTextFillColor: '#fff',
                    caretColor: '#fff',
                    transition: 'background-color 5000s ease-in-out 0s',
                  }
                }
              }}
            />

            <Box display="flex" justifyContent="center" mt={5}>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  px: 5,
                  bgcolor: "primary.main",
                  width: 150,
                  boxShadow: '0px 0px 12px rgba(255,255,255,0.6)',
                  '&:hover': {
                    boxShadow: '0px 0px 20px rgba(255,255,255,0.9)',
                    bgcolor: "primary.dark",
                  },
                }}
              >
                Login
              </Button>
            </Box>

            <Typography textAlign="center" sx={{ mt: 2, color: "#90caf9" }}>
              <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
                Back
              </Link>
            </Typography>
          </form>
        </Paper>
      </Box>
    </Box>
  );
};

export default Login;
