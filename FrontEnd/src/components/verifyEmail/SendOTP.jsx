import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const SendOTP = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);

    const navigate = useNavigate();
  // Handle change in email field
  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const axiosInstance = axios.create({
    baseURL : `${import.meta.env.VITE_API_BASE_URL}`,
    withCredentials : true,
  })
  // Handle Send OTP button click
  const handleSendOtp = async () => {
    if (!email) {
      setError("Please enter a valid email address.");
      return;
    }
    try {
      const response = await axiosInstance.post("/send-email-otp", { email });

      if (response.status === 200) {
        navigate("/verify-otp", { state : {email : email} });
      }
    } catch (err) {
      setError("Failed to send OTP. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-md">
      <h2 className="text-2xl font-bold text-center mb-6">Enter Email for OTP</h2>
      
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Email</label>
        <input
          type="email"
          name="email"
          value={email}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your email"
          required
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="button"
        onClick={handleSendOtp}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
      >
        Send OTP
      </button>

      {otpSent && (
        <p className="text-center text-green-500 mt-4">OTP sent to {email}</p>
      )}
    </div>
  );
};

export default SendOTP;
