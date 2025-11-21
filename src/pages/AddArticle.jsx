import React, { useState } from "react";
import { backend } from "../api/client";
import { useNavigate } from "react-router-dom";

const AddArticle = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const autoResize = (e) => {
    e.target.style.height = "auto"; // Reset height
    e.target.style.height = e.target.scrollHeight + "px";
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.title.trim() || !form.content.trim()) {
      setError("Title and content cannot be empty.");
      return;
    }

    try {
      setLoading(true);
      await backend.createArticle(form);

      // Save message to localStorage
      localStorage.setItem("successMsg", "Article published successfully!");

      setForm({ title: "", content: "" });

      navigate("/");
    } catch (err) {
      setError(err.message || "Failed to publish article.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-6 py-10">
      <div className="max-w-2xl mx-auto mt-10">
        <form onSubmit={handleSubmit}>
          <textarea
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            onInput={autoResize}
            className="w-full mb-4 py-3 px-6 border-gray-300 text-3xl outline-none focus:border-l font-heading font-semibold resize-none leading-relaxed"
          ></textarea>

          <textarea
            name="content"
            placeholder="Enlighten the world with your knowledge..."
            value={form.content}
            onChange={handleChange}
            onInput={autoResize}
            className="w-full mb-4 py-3 px-6 border-gray-300 outline-none focus:border-l resize-none"
          ></textarea>

          {error && (
            <p className="text-red-600 text-sm mb-2 font-medium">{error}</p>
          )}
          {success && (
            <p className="text-green-600 text-sm mb-2 font-medium">{success}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-4 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-full cursor-pointer disabled:opacity-50"
          >
            {loading ? "Publishing..." : "Publish"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddArticle;
