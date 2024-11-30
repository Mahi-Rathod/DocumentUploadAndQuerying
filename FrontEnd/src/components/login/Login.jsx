import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from "react-cookie"
import axios from "axios";

import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const [cookies] = useCookies(['accessToken']);

    const { isLogin, authDispatch } = useAuth();

    const validateIdentifier = (input) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const usernameRegex = /^[a-zA-Z0-9_]{3,}$/; // Alphanumeric and underscores, min 3 chars
        const mobileRegex = /^[0-9]{10}$/;

        if (emailRegex.test(input)) return 'email';
        if (mobileRegex.test(input)) return 'mobile';
        if (usernameRegex.test(input)) return 'username';

        return 'invalid';
    };

    const axiosInstance = axios.create({
        baseURL: `${import.meta.env.VITE_API_BASE_URL}`,
        withCredentials: true
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const type = validateIdentifier(identifier);
        if (type === 'invalid') {

            setError('Please enter a valid email, username, or mobile number.');

        } else {
            setError('');
            try {
                const data = {
                    userIdentifier: identifier,
                    password: password
                }
                const logInRes = await axiosInstance.post("/user/sign-in-using-password", data)
                const { _id } = logInRes.data.user;
                if (logInRes.status === 200) {
                    authDispatch({ type: "LOGIN_SUCCESS", payload:_id});
                    navigate("/file-upload")
                }
                else {
                    authDispatch({ type: "LOGIN_FAILURE", payload: err.response?.data?.message || "Login failed" });
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Something went wrong.');
            }

        }
    };


    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await axiosInstance.get('/user/get-user');
                const { _id } = res.data.user;
                console.log(_id);
                if (res.status === 200) {
                    authDispatch({ type: "LOGIN_SUCCESS", payload:_id });
                }
                else {
                    authDispatch({ type: "LOGIN_FAILURE" });
                }
            } catch (err) {
                authDispatch({ type: "LOGIN_FAILURE" });
            }
        }

        const accessToken = cookies.accessToken;
        if (accessToken) {
            getUser();
        }
    }, [authDispatch, cookies.accessToken]);

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="w-1/3 p-6 bg-white rounded-lg shadow-md"
            >
                <h2 className="mb-4 text-lg font-semibold text-gray-700">Login</h2>
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-600" htmlFor="identifier">
                        Email, Username, or Mobile Number
                    </label>
                    <input
                        type="text"
                        id="identifier"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="Enter email, username, or mobile"
                        className="w-full px-4 py-2 text-sm border rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-400"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-600" htmlFor="password">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full px-4 py-2 text-sm border rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-400"
                        required
                    />
                </div>
                {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
                <button
                    type="submit"
                    className="w-full px-4 py-2 text-white bg-indigo-500 rounded-lg hover:bg-indigo-600"
                >
                    Login
                </button>
            </form>
            <a href="/sign-up">new user</a>
        </div>
    );
};

export default Login;
