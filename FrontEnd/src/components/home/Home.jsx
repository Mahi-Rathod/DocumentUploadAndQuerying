import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Home() {
    const { isLogin, authDispatch } = useAuth();
    const navigate = useNavigate();
    const [cookies] = useCookies(['accessToken']);

    const axiosInstance = axios.create({
        baseURL: `${import.meta.env.VITE_API_BASE_URL}`,
        withCredentials: true
    });

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await axiosInstance.get('/user/get-user');
                if (res.status === 200) {
                    authDispatch({ type: "LOGIN_SUCCESS" });
                    navigate("/file-upload");
                } else {
                    throw new Error('Authentication failed.');
                }
            } catch (err) {
              authDispatch({ type: "LOGIN_FAILURE" });
              navigate("/login");
            } 
        };

        const accessToken = cookies.accessToken;
        if (accessToken) {
            getUser();
        } else {
            navigate("/login");
        }
    }, [authDispatch, cookies.accessToken, isLogin, navigate]);

    return (
        <div className="home-page">
            <h1>Welcome to Home</h1>
            <p>Loading user data...</p>
        </div>
    );
}

export default Home;
