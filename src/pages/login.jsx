import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

export default function Login() {
  const navigate = useNavigate(); // Initialize the navigate function

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginStatus, setLoginStatus] = useState('');
  const [statusHolder, setStatusHolder] = useState('');

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoginStatus('');

    // Frontend validation
    if (email === '' || password === '') {
      setLoginStatus('Missing information');
      return;
    }

    if (!validateEmail(email)) {
      setLoginStatus("Incorrect email format");
      return;
    }
    console.log('Logging in with:', { email, password });
    try {
      // Send login request to backend
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Login successful, redirect to dashboard
        setLoginStatus('Login successful');
        navigate('/dashboard'); // Redirect to dashboard
      } else {
        // Handle error from backend (e.g., incorrect credentials)
        setLoginStatus(data.message || 'Login failed');
      }
    } catch (error) {
      // Handle network errors or other unexpected errors
      setLoginStatus('Something went wrong. Please try again.');
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    if (loginStatus !== '') {
      setStatusHolder('showMessage');
      setTimeout(() => {
        setStatusHolder('message');
      }, 4000);
    }
  }, [loginStatus]);

  return (
    <div className='bg-[#EEEEEE] flex items-center justify-center h-screen'>
      {/* Container for the layout */}
      <div className='flex flex-col md:flex-row w-3/4 bg-[#EEEEEE] rounded-md shadow-lg'>
        {/* Left section - Sign In Form */}
        <div className="md:w-1/2 w-full p-8 bg-[#E0E0E2] rounded-md">
          {/* Logo for mobile devices */}
          <div className="flex justify-center mb-4 md:hidden">
            <img src="../public/logo.png" alt="Logo" className='w-40' />
          </div>
          {/* Center the heading and description */}
          <div className="text-center mt-4">
            <h1 className='text-[#A2A1A6] text-3xl'>Sign In</h1>
            <br />
            <p className='text-[#1D1C24]'>Welcome again! Please enter your details.</p>
          </div>
          
          <form className="space-y-6 mt-12" action="#" method="POST">
            <div>
              {/* Error message */}
              {loginStatus && (
                <span
                  className={`${statusHolder} block text-center bg-red-500 text-white py-2 px-4 rounded-md mb-4`}
                >
                  {loginStatus}
                </span>
              )}

              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email" 
                  autoComplete="email"
                  required
                  placeholder="Enter your email"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 placeholder:pl-2 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
                  onChange={(event) => {
                    setEmail(event.target.value);
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between"></div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="Enter your password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 placeholder:pl-2 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
                  onChange={(event) => {
                    setPassword(event.target.value);
                  }}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-[#3EA0A3] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#2d9599] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                onClick={handleSignIn}
              >
                Continue
              </button>
              <br /><br />
              <div className="text-sm flex justify-center">
                <a href="#" className="hover:text-[#3EA0A3] text-gray-700">
                  Forgot password?
                </a>
              </div>
              <br />
            </div>
          </form>
        </div>

        {/* Right section - Image (Hidden on mobile) */}
        <div className="hidden bg-[#373A40] md:flex md:w-1/2 flex-col rounded-tr-md rounded-br-md pt-4 justify-center items-center">
          <img
            src="../public/logo.png"
            alt="Logo"
            className='w-40'
          />
          <img
            src="../public/login.png"
            alt="Login"
            className="w-72 h-96 mb-6"
          />
        </div>
      </div>
    </div>
  );
}
