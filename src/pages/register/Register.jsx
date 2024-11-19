import React, { useState, useEffect } from 'react';
import { firebase } from '../../Firebase/config';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, Link } from 'react-router-dom';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

const Register = () => {
    const [id, setId] = useState('');
    const navigate = useNavigate(); 
  
    const [username, setUserName] = useState('');
    const [mainReferralId, setMainReferralId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [cpasswordVisible, setCPasswordVisible] = useState(false);

    // New state for the form fields
    const [formData, setFormData] = useState({
        name: '',
        lname: '',
        email: '',
        number: '',
        password: '',
        cpassword: ''
    });

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const referralId = urlParams.get("referral");
        setMainReferralId(referralId); // Store the referral ID

        const fetchData = async () => {
            setLoading(true);
            try {
                const query = firebase.firestore().collection("users").where("tokenId", "==", referralId);
                const snapshot = await query.get();
                const users = snapshot.docs.map(doc => {
                    const data = doc.data();
                    data.id = doc.id;
                    return data;
                });
                if (users.length > 0) {
                    setUserName(users[0].name);
                    setId(users[0].referralId);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
  
        const { name, lname, email, number, password, cpassword } = formData;

        // Validate mobile number (must be 10 digits)
        if (number.length !== 10) {
            toast.error("Mobile number must be 10 digits!");
            setLoading(false);
            return;
        }

        // Check if passwords match
        if (password !== cpassword) {
            toast.error("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;
            const currentDateTime = new Date().toISOString();
            const currentYear = new Date().getFullYear();
            const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, ""); // Format as YYYYMMDD
    
            const randomNumbers = Math.floor(10000 + Math.random() * 90000); 
            const tokenId = `GAINBOT${currentDate}${randomNumbers}`;

            const depositData = {
                amount: '1',
                date: currentDateTime,
                method: "Deposit",
                title: 'Signup bonus',
                totalbalance: '1'
            };
            const refferal = `${mainReferralId},${id}`;
            const userData = {
                name,
                lname,
                email,
                number,
                tokenId,
                referralId: refferal,
                Transaction: firebase.firestore.FieldValue.arrayUnion(depositData),
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            };

            await firebase.firestore().collection('users').doc(user.uid).set(userData);
            toast.success("Account created successfully!");
            navigate('/'); // Redirect to dashboard after signup
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <main>
                <div className="form-section white img-adjust bg-black ">
                    <div className="form-bg">
                        <img src="https://gainbot.io/default/images/1920x1080" alt="Background image" />
                    </div>
                    <div className="linear-center"></div>
                    <div className="container-fluid px-0">
                        <div className="row justify-content-center align-items-center gy-5">
                            <div className="col-xl-6 col-lg-6">
                                <div className="form-left">
                                    <a href="index.html" className="logo" data-cursor="Home">
                                        <img src="/logo1.jpeg" alt="Logo" />
                                    </a>
                                    <h1>Join Today &amp; Receive up to 100 USDT Bonus</h1>
                                    <p> Embark on a journey with FinFunder, where innovation meets opportunity in the dynamic world of blockchain and cryptocurrency. As the market evolves with heightened interest and regulatory developments, position yourself for success with our advanced, secure platform. Begin your trading adventure with a welcome bonus! </p>
                                </div>
                            </div>
                            <div className="col-xl-6 col-lg-6 col-md-8 col-sm-10 position-relative">
                                <div className="form-wrapper2 login-form">
                                    <h4 className="form-title text-white">Sign Up Your Account</h4>
                                    <form onSubmit={handleSubmit}>
                                        <div className="row">
                                            <div className="col-12">
                                                <div className="form-inner">
                                                    <label className='text-white' htmlFor="name">First Name</label>
                                                    <input 
                                                        type="text" 
                                                        id="name" 
                                                        name="name" 
                                                        value={formData.name} 
                                                        onChange={handleChange} 
                                                        placeholder="Enter First Name" 
                                                        required 
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-12">
                                                <div className="form-inner">
                                                    <label className='text-white' htmlFor="lname">Last Name</label>
                                                    <input 
                                                        type="text" 
                                                        id="lname" 
                                                        name="lname" 
                                                        value={formData.lname} 
                                                        onChange={handleChange} 
                                                        placeholder="Enter Last Name" 
                                                        required 
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-12">
                                                <div className="form-inner">
                                                    <label className='text-white' htmlFor="email">Email</label>
                                                    <input 
                                                        type="email" 
                                                        id="email" 
                                                        name="email" 
                                                        value={formData.email} 
                                                        onChange={handleChange} 
                                                        placeholder="Enter Email" 
                                                        required 
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-12">
                                                <div className="form-inner">
                                                    <label className='text-white' htmlFor="number">Mobile Number</label>
                                                    <input 
                                                        type="number" 
                                                        id="number" 
                                                        name="number" 
                                                        value={formData.number} 
                                                        onChange={handleChange} 
                                                        placeholder="Enter Mobile Number" 
                                                        required 
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-12">
                                                <div className="form-inner">
                                                    <label className='text-white' htmlFor="sponsorid">Sponsor Id</label>
                                                    <input 
                                                        value={mainReferralId} 
                                                        readOnly 
                                                        placeholder="Sponsor Id" 
                                                        required 
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-12">
                                                <div className="form-inner">
                                                    <label className='text-white' htmlFor="password">Password</label>
                                                    <input 
                                                        type="password" 
                                                        id="password" 
                                                        name="password" 
                                                        value={formData.password} 
                                                        onChange={handleChange} 
                                                        placeholder="Enter Password" 
                                                        required 
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-12">
                                                <div className="form-inner">
                                                    <label className='text-white' htmlFor="cpassword">Confirm Password</label>
                                                    <input 
                                                        type="password" 
                                                        id="cpassword" 
                                                        name="cpassword" 
                                                        value={formData.cpassword} 
                                                        onChange={handleChange} 
                                                        placeholder="Enter Confirm Password" 
                                                        required 
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-12">
                                                <button  disabled={loading} type="submit" className="i-btn btn--lg btn--primary w-100">
                                                {loading ? (
                  <div className="flex justify-center items-center">
                    <div className="w-4 h-4 border-2 border-t-2 border-white rounded-full animate-spin"></div>
                  </div>
                ) : (
                  'Sign Up'
                )}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="have-account">
                                            <p className="mb-0">Already registered? <Link className='text-white' to="/login"> Sign In</Link></p>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <ToastContainer />
        </div>
    );
};

export default Register;
