import React from "react";
import bitebuddy from "../assets/bitebuddy.png";
const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-300 shadow-md z-50">
      <div className="container mx-auto flex items-center justify-between p-2">
        <div className="flex items-center">
          <h1 className="text-black text-xl font-bold">BiteBuddy</h1>
          <img src={bitebuddy} alt="MJ Logo" className="h-20 w-30 rounded-full"/>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
