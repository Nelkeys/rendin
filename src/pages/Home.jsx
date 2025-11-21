import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Icon from "../assets/icon.png";

const Home = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const msg = localStorage.getItem("successMsg");

    if (msg) {
      setSuccess(msg);

      setTimeout(() => {
        setSuccess("");
        localStorage.removeItem("successMsg");
      }, 4000);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (query.trim() !== "") {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="px-6 h-[65vh]">
      {success && (
        <p className="text-center bg-primary text-white py-2 px-4 rounded-md my-4 fixed bottom-10 left-10 max-w-fit">
          {success}
        </p>
      )}

      <div className="max-w-2xl mx-auto space-y-10 h-full flex flex-col items-center justify-center">
        <div className="flex items-end justify-center gap-4 cursor-pointer">
          <img className="w-12 md:w-13 lg:w-15" src={Icon} alt="app icon" />
          <h1 className="text-4xl lg:text-5xl font-semibold font-heading">
            Rend<span className="text-primary">In</span>.
          </h1>
        </div>

        <div className="space-y-10 w-full">
          <form onSubmit={handleSubmit} className="">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by topic or author."
              className="w-full py-3 px-6 rounded-full bg-primary/5 border-2 border-gray-500 focus:outline-primary transition-all duration-300"
            />
          </form>

          <div className="flex items-center justify-center">
            <p className="flex items-center gap-2">
              Server status:{" "}
              <span className="h-3 w-3 rounded-full bg-green-600"></span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
