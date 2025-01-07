import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { validate } from 'email-validator';
import sign_up from '../../assets/images/sign_up.svg'
import axios from 'axios';

function Register() {
  const [fullname, setFullname] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [registerStatus, setRegisterStatus] = useState('');
  let navigate = useNavigate();

  const validateEmail = (email) => {
    if (!email || !validate(email)) {
      setIsEmailValid(false);
      setEmailErrorMessage('Please enter a valid email address.');
    } else {
      setIsEmailValid(true);
      setEmailErrorMessage('');
    }
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    validateEmail(newEmail);
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
  
    if (fullname === '' || age === '' || !isEmailValid || password === '' || confirmPassword === '') {
      setError('Please fix the validation errors.');
      setError('All fields are required.');
      setIsLoading(false);
      return;
    } else if (password.length < 7) {
      setError('Password must be 7 characters or more');
      setIsLoading(false);
      return;
    } else if (password === '1234567' || password === '12345678') {
      setError('Your password is too easy!');
      setIsLoading(false);
      return;
    } else if (password !== confirmPassword) {
      setError('Passwords do not match!');
      setIsLoading(false);
      return;
    } else {
      try {
        setIsLoading(true);
  
        axios.post('http://localhost:8086/register', {
          fullname: fullname,
          age: age,
          email: email,
          password: password,
        })
        .then((response) => {
          if (response.data.message === 'Email already exists') {
            setError('Email is already in use. Please choose a different email.');
            setIsLoading(false);
          } else if (response.data.message) {
            setRegisterStatus(response.data.message);
            setIsLoading(false);
          } else {
            setSuccess('REGISTRATION SUCCESSFUL');
            let path = '/';
            navigate(path);
            setError(null);
            setFullname('');
            setAge('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
          }
        });
      } catch (error) {
        setError(`Registration failed: ${error.message}`);
        setIsLoading(false);
      }
    }
  };
  
  return (
    <>
      <div className="lg:flex">
        <div className="lg:w-1/2 xl:max-w-screen-sm">
          <div className="py-12 bg-indigo-100 lg:bg-white flex justify-center lg:justify-start lg:px-12">
          <div className="cursor-pointer flex items-center">
          <div>
            <svg
              className="w-10 text-indigo-500"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              version="1.1"
              id="Layer_1"
              x="0px"
              y="0px"
              viewBox="0 0 225 225"
              style={{ enableBackground: "new 0 0 225 225" }}
              xmlSpace="preserve"
            >
              <style
                type="text/css"
                dangerouslySetInnerHTML={{
                  __html:
                    "\n                                    .st0{fill:none;stroke:currentColor;stroke-width:20;stroke-linecap:round;stroke-miterlimit:3;}\n                                "
                }}
              />
              <g transform="matrix( 1, 0, 0, 1, 0,0) ">
                <g>
                  <path
                    id="Layer0_0_1_STROKES"
                    className="st0"
                    d="M173.8,151.5l13.6-13.6 M35.4,89.9l29.1-29 M89.4,34.9v1 M137.4,187.9l-0.6-0.4     M36.6,138.7l0.2-0.2 M56.1,169.1l27.7-27.6 M63.8,111.5l74.3-74.4 M87.1,188.1L187.6,87.6 M110.8,114.5l57.8-57.8"
                  />
                </g>
              </g>
            </svg>
          </div>
          <div className="text-2 xl text-indigo-800 tracking-wide ml-2 font-semibold">
            Votocary
          </div>
        </div>
          </div>
          <div className="mt-10 px-12 sm:px-24 md:px-48 lg:px-12 lg:mt-16 xl:px-24 xl:max-w-2xl">
            <h2 className="text-center text-4xl text-indigo-900 font-display font-semibold lg:text-left xl:text-5xl xl:text-bold">
              Register
            </h2>
            <div className="mt-12">
              {success && (
                <Stack spacing={2}>
                  <Alert severity="success">{success}</Alert>
                </Stack>
              )}
              <form onSubmit={handleRegistration}>
                <div>
                  <div className="text-sm font-bold text-gray-700 tracking-wide">
                    Full Name
                  </div>
                  <input
                    className="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500"
                    type="text"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    placeholder="Full name"
                  />
                </div>
                <div className="mt-6">
                  <div className="text-sm font-bold text-gray-700 tracking-wide">
                    Age
                  </div>
                  <input
                    className="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500"
                    type="numeric"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="22"
                  />
                </div>
                <div className="mt-6">
                  <div className="text-sm font-bold text-gray-700 tracking-wide">
                    Email Address
                  </div>
                  <input
                    className="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500"
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="username@gmail.com"
                  />
                  {!isEmailValid && (
                    <div className="text-sm text-red-500">{emailErrorMessage}</div>
                  )}
                </div>
                <div className="mt-6">
                  <div className="flex justify-between items-center">
                    <div className="text-sm font-bold text-gray-700 tracking-wide">
                      Password
                    </div>
                  </div>
                  <input
                    className="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                  />
                </div>
                <div className="mt-6">
                  <div className="flex justify-between items-center">
                    <div className="text-sm font-bold text-gray-700 tracking-wide">
                      Confirm Password
                    </div>
                  </div>
                  <input
                    className="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                  />
                </div>
                <div className="mt-10">
                  {error && (
                    <Stack spacing={2}>
                      <Alert severity="error">{error}</Alert>
                    </Stack>
                  )}
                  <button
                    className="bg-gradient-to-r from-violet-700 to-indigo-700 text-gray-100 p-4 w-full rounded-full tracking-wide font-semibold font-display focus:outline-none focus:shadow-outline hover:bg-indigo-600 shadow-lg"
                    type="submit"
                  >
                    {isLoading ? 'Registering...' : 'Register'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="hidden lg:flex items-center justify-center bg-indigo-100 flex-1 h-screen">
        <div className="max-w-xs transform duration-200 hover:scale-110 cursor-pointer">
          <img src={sign_up} alt="Sign Up" onClick={handleRegistration}/>
        </div>
      </div>
      </div>
    </>
  );
}

export default Register;
