import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (query.trim() !== "") {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  }

  return (
    <div className="px-6 h-[65vh]">
      <div className="max-w-xl mx-auto space-y-10 h-full flex flex-col items-center justify-center">
        <div className="flex items-center justify-center flex-col gap-4">
          <div className="h-15 w-8 md:h-20 md:w-10 bg-primary"></div>
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
