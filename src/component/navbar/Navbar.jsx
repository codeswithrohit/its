import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { firebase } from '../../Firebase/config';
import { FaUserCircle } from 'react-icons/fa'; // Import the icon

const Navbar = () => {
  function showMenu(){
    document.getElementsByClassName("main-nav")[0].classList.toggle("show-menu");
  }
   
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);

      const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
          try {
            const userRef = firebase.firestore().collection("users").doc(user.uid);
            const doc = await userRef.get();
            if (doc.exists) {
              setUserData(doc.data());
            } else {
              console.log("No user data found");
            }
          } catch (error) {
            console.error("Error fetching user data: ", error);
          }
        } else {
          console.log("No user signed in");
        }
        setLoading(false);
      });

      return () => unsubscribe();
    };

    fetchUserData();
  }, []);

  
  return (
    <div>
      <header class="header-area style-1">
        <div class="container-fluid d-flex justify-content-between align-items-center">
          <div class="header-left">
            <button class="header-item-btn sidebar-btn d-lg-none d-block">
              <i class="bi bi-bars"></i>
            </button>

            <div class="header-logo">
              <a href="/">
                <img src="/logo1.jpeg" alt="White Logo" />
              </a>
            </div>
          </div>

          <div class="main-nav">
            <div class="mobile-logo-area d-xl-none d-flex justify-content-between align-items-center">
              <div class="mobile-logo-wrap">
                <img src="/logo1.jpeg" alt="White Logo" />
              </div>
              <div class="menu-close-btn" onClick={showMenu}>
                <i class="bi bi-x-lg"></i>
              </div>
            </div>
            <ul class="menu-list">
              <li class="menu-item-has-children">
             
            <Link className="active" to="/">
            Home
            </Link>
                
                
                 
              
             
              </li>
              <li class="menu-item-has-children">
              <Link to="/trade">  Trade</Link>
                
                
              </li>

              <li class="menu-item-has-children">
              <Link to="/article">Article</Link>
                
                
              </li>
            
              <li>

                <Link to="/features"> Features</Link>
                
               
              </li>
              <li>
               
                <Link to="/faq">FAQ</Link>
               
              </li>
              <li>
               <Link to="/contact"> Contact</Link>
                 
                
              </li>
            </ul>
        
          </div>
     
          <div class="nav-right">
           

          {userData ? (
              <a
                href="/Profile"
                className="i-btn btn--md d-xl-flex d-none capsuled btn--primary-outline"
              >
                <FaUserCircle size={28} /> {/* Show icon when userData is available */}
              </a>
            ) : (
              <a
              href="/login"
                className="i-btn btn--md d-xl-flex d-none capsuled btn--primary-outline"
              >
                Sign In
              </a>
            )}
 <div className="sidebar-btn d-xl-none d-flex" >
                {userData ? (
                    <a
                    href="/Profile"
                    className="i-btn  capsuled btn--primary-outline"
                  >
                    <FaUserCircle size={28} /> {/* Show icon when userData is available */}
                  </a>
                ) : (
                  <a
                  href="/login"
                    className="i-btn  capsuled btn--primary-outline"
                  >
                    Sign In
                  </a>
                )}
              </div>

            <div class="sidebar-btn d-xl-none d-flex" onClick={showMenu}>
              <i class="bi bi-list"></i>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
