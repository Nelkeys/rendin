import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Icon from "../assets/icon.png";

const SearchBar = ({ query, setQuery }) => {
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/");
  };

  // Handle Search
  const handleSubmit = (e) => {
    e.preventDefault();

    if (query.trim() !== "") {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="px-6 mt-5">
      <div className="max-w-2xl mx-auto space-y-6 lg:space-y-8 h-full flex flex-col items-center justify-center">
        <div
          onClick={goHome}
          className="flex items-end justify-center gap-4 cursor-pointer"
        >
          <img className="w-12 md:w-13 lg:w-15" src={Icon} alt="app icon" />
          <h1 className="text-4xl lg:text-5xl font-semibold font-heading">
            Rend<span className="text-primary">In</span>.
          </h1>
        </div>

        <div className="w-full">
          <form onSubmit={handleSubmit} className="">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by topic or author."
              className="w-full py-3 px-6 rounded-full bg-primary/5 border-2 border-gray-500 focus:outline-primary transition-all duration-300"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
