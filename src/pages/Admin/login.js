
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { signInWithEmailAndPassword } from "firebase/auth";
import { firebase } from "../../Firebase/config";
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate(); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
        setLoading(true);

        // Sign in with email and password
        const userCredential = await signInWithEmailAndPassword(
            firebase.auth(),
            email,
            password
        );

        // Access user object from userCredential
        const user = userCredential.user;

        // Store isAdmin: true in localStorage
        localStorage.setItem("isAdmin", true);

        // Navigate to Admin Dashboard
        navigate("/Admin/Dashboard");
    
    } catch (error) {
        console.error("Error signing in:", error.message);
        toast.error(error.message);
    } finally {
        setLoading(false);
    }
};

 

  return (
    <>
      <div className="flex items-center justify-center m-auto min-h-screen bg-white dark:bg-white">
        <div className="w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
          <div className="px-6 py-4">
            <h3 className="mt-3 text-xl font-medium text-center text-black dark:text-black">
              Admin Login
            </h3>

            <form onSubmit={handleLogin}>
              <div className="w-full mt-4">
                <input
                  className="block w-full px-4 py-2 mt-2 text-black placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                  type="email"
                  placeholder="Email Address"
                  aria-label="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="w-full mt-4">
                <input
                  className="block w-full px-4 py-2 mt-2 text-black placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                  type="password"
                  placeholder="Password"
                  aria-label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between mt-4">
                {/* <a
                  href="/Admin/Forgotpassword"
                  className="text-sm text-black dark:text-black hover:text-black"
                >
                  Forget Password?
                </a> */}

                <button
                  className="px-6 py-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Signing In..." : "Sign In"}
                </button>
              </div>
            </form>
          </div>
        </div>
        {/* Show toast messages */}
        <ToastContainer />
      </div>
    </>
  );
};

export default Login;