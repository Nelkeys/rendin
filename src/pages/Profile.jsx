import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { backend } from "../api/client";

const Profile = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const user_id = window.location.pathname.split("/").pop();

  useEffect(() => {
    const loadProfile = async () => {
      setLoading;
      try {
        const res = await backend.getUserProfile(user_id);

        // Sort articles newest → oldest
        if (res.articles) {
          res.articles = res.articles.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );
        }

        setProfile(res);
      } catch (err) {
        console.error("Error fetching user profile:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

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

  if (loading)
    return (
      <p className="flex items-center justify-center h-[70vh]">Loading...</p>
    );

  if (!profile)
    return (
      <p className="flex items-center justify-center h-[70vh]">
        Profile not found
      </p>
    );

  return (
    <div className="px-6 pb-15">
      {profile && (
        <div className="max-w-2xl mx-auto mt-15">
          <div className="flex flex-col items-center gap-4">
            <img
              className="h-25 w-25 rounded-full object-cover border"
              src={profile.image_url}
              alt={profile.name}
            />

            <h1 className="text-2xl font-medium font-heading">
              {profile.name}
            </h1>
          </div>

          <div className="py-20">
            <div>
              <h2 className="font-heading font-medium text-2xl">Articles:</h2>
            </div>

            {profile && profile.articles.length > 0 ? (
              <div className="mt-15 space-y-18">
                {profile.articles.map((article) => (
                  <div key={article.id} className="space-y-4">
                    <div className="flex items-center gap-2 leading-tight">
                      <div>
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
            ) : (
              <p className="mt-5 text-gray-600">No articles found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
