// src/components/Navbar.jsx
import { useAuth } from "../../context/AuthContext.jsx";
import axios from "axios";
import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
    const { isLogin, authDispatch } = useAuth();
    const navigate = useNavigate();

    const axiosInstance = axios.create({
        baseURL: `${import.meta.env.VITE_API_BASE_URL}`,
        withCredentials: true
    });

    const handleLogout = async () => {
        try {
            const res = await axiosInstance.post('/user/sign-out');
            if (res.status === 200) {
                authDispatch({ type: 'LOGOUT' });
                navigate('/login'); // Ensure redirection after successful logout
            } else {
                alert('Logout failed!');
            }
        } catch (err) {
            alert('Error logging out. Try again.');
        }
    };

    return (
        <nav className="bg-blue-600 text-white px-4 py-3 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-lg font-bold">My App</div>
                {isLogin ? (
                    <ul className="flex space-x-4">
                        <li>
                            <Link to="/dashboard" className="hover:text-blue-200">
                                Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link to="/file-upload" className="hover:text-blue-200">
                                File Upload
                            </Link>
                        </li>
                        <li>
                            <button
                                onClick={handleLogout}
                                className="hover:text-blue-200"
                            >
                                Logout
                            </button>
                        </li>
                    </ul>
                ) : (
                    <ul className="flex space-x-4">
                        <li>
                            <Link to="/send-verification-otp" className="hover:text-blue-200">
                                Verify Email
                            </Link>
                        </li>
                        <li>
                            <Link to="/sign-up" className="hover:text-blue-200">
                                SignUp
                            </Link>
                        </li>
                        <li>
                            <Link to="/login" className="hover:text-blue-200">
                                Login
                            </Link>
                        </li>
                    </ul>
                )}
            </div>
        </nav>
    );
};


export default Navbar;
