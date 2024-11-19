import React, { useState } from 'react';
import { firebase } from '../../Firebase/config';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Added loading state
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
  
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      toast.success('Logged in successfully!');
      navigate('/'); // Redirect after login
    } catch (error) {
      // Check error codes to show specific messages
      if (error.code === 'auth/user-not-found') {
        toast.error('Email not found. Please check your email or sign up.');
      } else if (error.code === 'auth/wrong-password') {
        toast.error('Incorrect password. Please try again.');
      } else {
        toast.error('Error: ' + error.message);
      }
    } finally {
      setLoading(false); // Stop loading
    }
  };
  

  return (
    <div>
      <main>
        <ToastContainer /> {/* Added ToastContainer */}
        <div className="form-section white img-adjust bg-black">
          <div className="container-fluid px-0">
            <div className="row justify-content-center align-items-center gy-5">
              <div className="col-xl-6 col-lg-6 col-md-8 col-sm-10 position-relative">
                <div className="form-wrapper2">
                  <h4 className="form-title text-white">Access Your Trading Hub</h4>
                  <form onSubmit={handleLogin}>
                    <div className="row">
                      <div className="col-12">
                        <div className="form-inner">
                          <label className="text-white" htmlFor="email">Email</label>
                          <input
                            type="email"
                            id="email"
                            placeholder="Enter Email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-inner">
                          <label className="text-white" htmlFor="password">Password</label>
                          <input
                            type="password"
                            id="password"
                            placeholder="Enter Password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="row mb-4">
                        <div className="col-sm-6">
                          <div className="form-inner">
                            <div className="form-group">
                              <input type="checkbox" id="remember_me" />
                              <label className="text-white" htmlFor="remember_me">Remember me</label>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-6 text-end">
                          <div className="forgot-pass">
                            <a href="/forgotpassword">Forgot your password?</a>
                          </div>
                        </div>
                      </div>
                      <div className="!mt-8">
                        <button
                          type="submit"
                          disabled={loading} // Disable button while loading
                          className={`w-full shadow-xl py-3 px-4 text-sm tracking-wide rounded-lg text-white ${
                            loading ? 'bg-gray-500' : 'bg-red-600 hover:bg-blue-700'
                          }`}
                        >
                          {loading ? 'Logging in...' : 'Log in'} {/* Show loading text */}
                        </button>
                      </div>
                    </div>
                    <div className="have-account text-white">
                      <p className="mb-0">
                        Don't have an account?{' '}
                        <a className="text-white" href="/register">Sign Up</a>
                      </p>
                    </div>
                  </form>
                </div>
              </div>
              <div className="col-xl-6 col-lg-6">
                <div className="form-left">
                  <a href="/" className="logo">
                    <img
                      src="/logo1.jpeg"
                      alt="Logo"
                    />
                  </a>
                  <h1>Step Into the World of Smart Trading</h1>
                  <p>
                    Enter the realm of FinFunder, where cutting-edge blockchain
                    technology meets seamless trading experiences. Stay ahead with
                    our secure, intuitive platform.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
