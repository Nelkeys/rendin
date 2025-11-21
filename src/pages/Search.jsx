import React, { useState, useEffect } from "react";
import { backend } from "../api/client";
import { useNavigate, Link } from "react-router-dom";

import SearchBar from "../components/SearchBar";

const Search = () => {
  const navigate = useNavigate();

  const initialQuery =
    new URLSearchParams(window.location.search).get("q") || "";

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(initialQuery);

  // fetch related articles based on search query
  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);

      try {
        const res = await backend.search(query);

        const sorted = res.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

        setArticles(sorted);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setArticles([]); // fallback
      } finally {
        setLoading(false);
      }
    };

    if (query.trim() !== "") {
      fetchArticles();
    } else {
      setArticles([]);
      setLoading(false);
    }
  }, [query]);

  // HELPERS
  const truncateContent = (content) => {
    const words = content.split(" ");
    return words.length <= 30 ? content : words.slice(0, 30).join(" ") + "...";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div>
      <SearchBar query={query} setQuery={setQuery} />

      <div className="px-6 py-10">
        <div className="max-w-2xl mx-auto mt-15 space-y-15">
          {/* Loading State */}
          {loading && <p className="text-center text-gray-600">Loading...</p>}

          {/* No results */}
          {!loading && query.trim() !== "" && articles.length === 0 && (
            <p className="text-center text-gray-600">No articles found.</p>
          )}

          {/* Articles */}
          {!loading &&
            articles.map((article) => (
              <div key={article.id} className="space-y-4">
                <div className="flex items-center gap-2 leading-tight">
                  <img
                    className="w-10 h-10 bg-primary rounded-full"
                    src={article.author_image}
                    alt={article.author_name}
                  />
                  <div>
                    <Link
                      to={`/profile/${article.author_id}`}
                      className="font-medium hover:text-primary cursor-pointer max-w-fit font-heading"
                    >
                      {article.author_name}
                    </Link>
                    <p className="text-sm text-gray-600">
                      {formatDate(article.created_at)}
                    </p>
                  </div>
                </div>

                <div className="space-y-1">
                  <h2
                    className="font-medium hover:text-primary cursor-pointer max-w-fit font-heading"
                    onClick={() => navigate(`/article/${article.id}`)}
                  >
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
