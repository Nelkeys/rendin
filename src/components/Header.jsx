import React, { useEffect, useState } from "react";
import { auth, signInWithGoogle, logout } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { LogOut } from "lucide-react";
import GoogleIcon from "../assets/google.png";
import { backend } from "../api/client";

const Header = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false); // ✅ NEW

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthChecked(true); // Firebase has finished checking
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const loadProfile = async () => {
      if (!authChecked) return; // Wait for Firebase
      if (!user) return; // User is not logged in

      setLoading(true);

      try {
        const token = await user.getIdToken();
        const res = await backend.getCurrentUserProfile(token);
        setProfile(res);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [authChecked, user]);

  // UI states
  if (!authChecked)
    return <p className="flex items-center justify-center">Loading...</p>;

  if (user && !profile)
    return (
      <p className="flex items-center justify-center">Loading profile...</p>
    );

  return (
    <div className="flex w-full px-6 lg:px-20 py-5">
      {!user ? (
        <div className="flex justify-between w-full items-center">
          <div></div>
          <button
            onClick={signInWithGoogle}
            className="px-4 py-2 bg-dark hover:bg-dark/90 text-white font-medium rounded-full flex items-center gap-2 transition-all cursor-pointer"
          >
            <img src={GoogleIcon} alt="Google" className="w-8" />
            Sign In
          </button>
        </div>
      ) : (
        <div className="flex justify-between w-full items-center gap-4">
          <div className="flex gap-2 items-center">
            <img
              src={profile.image_url}
              alt=""
              className="w-10 h-10 lg:w-12 lg:h-12 rounded-full border"
            />
            <span className="font-medium text-lg md:text-xl font-heading">
              {profile.name}
            </span>
          </div>

          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-full flex items-center gap-2 transition-all cursor-pointer"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Header;
