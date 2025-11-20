import React, { useState, useEffect } from "react";
import { backend } from "../api/client";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const navigate = useNavigate();

  const initialQuery =
    new URLSearchParams(window.location.search).get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const goHome = () => {
    navigate("/");
  };

  // fetch related article from search query
  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);

      try {
        const res = await backend.search(query);
        setArticles(res);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    if (query.trim() !== "") {
      fetchArticles();
    }
  }, [query]);

  // Test
  //console.log("Search articles:", articles);

  // Handle Search
  const handleSubmit = (e) => {
    e.preventDefault();

    if (query.trim() !== "") {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  // HELPERS
  const truncateContent = (content) => {
    const words = content.split(" ");
    return words.length <= 30 ? content : words.slice(0, 30).join(" ") + "...";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div>
      <div className="px-6 mt-5">
        <div className="max-w-xl mx-auto space-y-6 lg:space-y-8 h-full flex flex-col items-center justify-center">
          <div onClick={goHome} className="flex items-end justify-center gap-4 cursor-pointer">
            <div className="h-15 w-8 md:h-20 md:w-10 bg-primary"></div>
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

      <div className="px-6">
        <div className="max-w-xl mx-auto mt-15">
          {articles.map((article) => (
            <div key={article.id} className="space-y-4">
              <div className="flex items-center gap-4">
                <img
                  className="w-10 h-10 bg-primary rounded-full"
                  src={article.author_image}
                  alt=""
                />
                <div>
                  <h2 className="font-medium hover:text-primary cursor-pointer max-w-fit">
                    {article.author_name}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {formatDate(article.created_at)}
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <h2 className="font-medium hover:text-primary cursor-pointer max-w-fit">
                  {article.title}
                </h2>
                <p className="text-base text-gray-600">
                  {truncateContent(article.content)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Search;
