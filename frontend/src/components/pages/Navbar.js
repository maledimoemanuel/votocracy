"use client";
import React, {useState, useEffect} from "react";
import { FaPowerOff } from "react-icons/fa";
import '../../index.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [navbar, setNavbar] = useState(false);
  const [auth, setAuth] =useState(false);
  const [name, setName] = useState("")
  const [message, setMessage] = useState('')

  const navigate = useNavigate()

  const handleLogout =()=>{
    axios.get('http://localhost:8086/logout', { withCredentials: true })
    .then(res => {
      if(res.data.Status === "Success"){
        window.location.href = '/';
      } else{
        alert("error")
      }
    })
    .catch(err => console.log(err))
  }

  return(
    <div>
          <nav className="w-full bg-gray-800 shadow">
          <div className="justify-between px-4 mx-auto lg:max-w-7xl md:items-center md:flex md:px-8">
            <div>
              <div className="flex items-center justify-between py-3 md:py-5 md:block">
                <a href="#" className="flex">
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
                  <h2 className="text-2xl text-white font-bold">Votocracy</h2>
                </a>
                <div className="md:hidden">
                  <button
                    className="p-2 text-gray-700 rounded-md outline-none focus:border-gray-400 focus:border"
                    onClick={() => setNavbar(!navbar)}
                  >
                    {navbar ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 6h16M4 12h16M4 18h16"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
            <div>
              <div
                className={`flex-1 justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0 ${
                  navbar ? 'block' : 'hidden'
                }`}
              >
                <ul className="items-center justify-center space-y-8 md:flex md:space-x-6 md:space-y-0 ">
                  <li className="text-white hover:bg-indigo-600">
                    <Link to="/feed">
                      Home
                    </Link>
                  </li>
                  <li className="text-white hover:bg-indigo-600">
                    <Link to="/about">
                      About
                    </Link>
                  </li>
                  <li className="text-white hover:bg-indigo-600">
                    <Link to="/contact">
                      Contact
                    </Link>
                  </li>
                  <li>
                    <button className="hover:bg-indigo-700 bg-red-700 rounded-lg font-bold py-2 px-4 flex text-white justify-center align-center" onClick={handleLogout}><FaPowerOff/></button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </nav>
    </div>
  );
};

export default Navbar;