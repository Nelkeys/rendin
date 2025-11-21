import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Pen } from "lucide-react";
import { backend } from "../api/client";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

const AddButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthChecked(true);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const checkProfile = async () => {
      if (!authChecked) return;
      if (!user) return;

      setLoading(true);

      try {
        const token = await user.getIdToken();
        await backend.getCurrentUserProfile(token);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    checkProfile();
  }, [user, authChecked]);

  const navigateToAddArticle = () => {
    navigate("/add-article");
  };

  // Hide button if not logged in or on /add-article page
  if (!user || location.pathname === "/add-article") return null;

  return (
    <button
      onClick={navigateToAddArticle}
      className="fixed bottom-10 right-10 cursor-pointer shadow-xl flex items-center gap-2 py-3 px-6 bg-primary text-white rounded-full hover:bg-primary/90 transition-all duration-300"
    >
      <Pen />
      Add Article
    </button>
  );
};

export default AddButton;
