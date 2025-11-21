import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { backend } from "../api/client";
import { HeartHandshake, MessageCircleMore } from "lucide-react";

import SearchBar from "../components/SearchBar";

const Article = () => {
  const initialQuery =
    new URLSearchParams(window.location.search).get("q") || "";

  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(initialQuery);

  // fetch article by id
  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);

      try {
        const res = await backend.getArticle(id);
        setArticle(res);
      } catch (error) {
        console.error("Error fetching article:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  // Toggle Article Likes
  const toggleArticleLike = async () => {
    try {
      await backend.toggleArticleLike(id);

      const updatedArticle = await backend.getArticle(id);
      setArticle(updatedArticle);
    } catch (err) {
      console.error("Error toggling article like:", err);
    }
  };

  // Toggle Comment Likes
  const toggleCommentLike = async (commentId) => {
    try {
      await backend.toggleCommentLike(commentId);

      const updatedArticle = await backend.getArticle(id);
      setArticle(updatedArticle);
    } catch (err) {
      console.error("Error toggling comment like:", err);
    }
  };

  // Adding New Comments
  const addComment = async (e) => {
    e.preventDefault();
    const content = e.target[0].value.trim();
    if (content === "") return;

    try {
      await backend.createComment({ article_id: id, content });
      e.target[0].value = "";

      const updatedArticle = await backend.getArticle(id);
      setArticle(updatedArticle);
    } catch (err) {
      console.error("Error adding comment:", err);
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
      year: "numeric",
    });
  };

  if (loading)
    return (
      <p className="flex items-center justify-center h-[70vh]">Loading...</p>
    );
  if (!article)
    return (
      <p className="flex items-center justify-center h-[70vh]">
        Article not found
      </p>
    );

  return (
    <div>
      <SearchBar query={query} setQuery={setQuery} />

      <div className="max-w-2xl mx-auto mt-15 space-y-10 px-6">
        <div className="space-y-10">
          <h1 className="text-3xl font-bold font-heading mb-4">
            {article.title}
          </h1>

          <div className="flex items-center gap-2 leading-tight mt-10">
            <img
              className="w-10 h-10 bg-primary rounded-full border object-cover"
              src={article.author_image}
              alt=""
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
        </div>

        <div className="">
          <p className="text-xl whitespace-pre-wrap font-article">
            {article.content}
          </p>

          <div className="border-b border-gray-300 pb-9 mt-20 flex items-center gap-8">
            <p
              onClick={() => toggleArticleLike(article.id)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <HeartHandshake /> {article.likes_count}
            </p>

            <HashLink className="flex items-center gap-2" to="#comment" smooth>
              <MessageCircleMore /> {article.comments_count}
            </HashLink>
          </div>
        </div>

        {/*Comment section*/}
        <div className="mt-20 py-20" id="comment">
          <h2 className="font-heading font-medium text-2xl mb-4">Comments</h2>

          <div>
            <form onSubmit={addComment} className="w-full">
              <input
                type="text"
                className="py-3 px-6 rounded-full w-full border border-gray-600 focus:outline-primary"
                placeholder="Add comment"
              />
            </form>
          </div>

          <div className="mt-15 space-y-18">
            {article.comments && article.comments.length > 0 ? (
              [...article.comments]
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                .map((comment) => (
                  <div
                    key={comment.id}
                    className="flex gap-4 border-b border-gray-300 pb-9 items-start"
                  >
                    <img
                      src={comment.author_image}
                      alt={comment.author_name}
                      className="w-10 h-10 rounded-full object-cover"
                    />

                    <div className="space-y-6">
                      <div>
                        <Link
                          to={`/profile/${comment.author_id}`}
                          className="font-medium font-heading hover:text-primary cursor-pointer max-w-fit"
                        >
                          {comment.author_name}
                        </Link>
                        <p className="text-gray-700">{comment.content}</p>
                      </div>

                      <p
                        onClick={() => toggleCommentLike(comment.id)}
                        className="text-sm mt-1 flex items-center gap-2 cursor-pointer"
                      >
                        <HeartHandshake /> {comment.likes_count}
                      </p>
                    </div>
                  </div>
                ))
            ) : (
              <p className="text-gray-500 text-center">No comments yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Article;
