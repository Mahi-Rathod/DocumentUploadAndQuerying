import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";


const VerifyOTP = () => {
    const location = useLocation();
    const email = location.state?.email; // Safely access the email
    const [OTP, setOTP] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const axiosInstance = axios.create({
        baseURL: `${import.meta.env.VITE_API_BASE_URL}`,
        withCredentials: true
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axiosInstance.post("/verify-email-otp", { email: email, otp: OTP });
            if(res.status === 200){
                navigate("/login");
            }
            else{
                setError("Wrong OTP")
            }
        } catch (err) {
            const errorMessage =
                err.response?.data?.message ||
                err.message || "";
            setError(errorMessage);
        }
    }
    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-md">
            <h2 className="text-2xl font-bold text-center mb-6">Verify OTP</h2>
            {email ? (
                <p className="text-center mb-4">An OTP has been sent to {email}</p>
            ) : (
                <p className="text-center mb-4 text-red-500">Email not provided!</p>
            )}
            <form className="space-y-4">
                <div>
                    <label className="block text-gray-700 font-medium mb-2">OTP</label>
                    <input
                        type="text"
                        name="otp"
                        value={OTP}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter OTP"
                        onChange={(e) => setOTP(e.target.value)}
                        required
                    />

                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
                    onClick={handleSubmit}
                >
                    Verify
                </button>
            </form>
        </div>
    );
};

export default VerifyOTP;
