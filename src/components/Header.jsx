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
  const [authChecked, setAuthChecked] = useState(false);
  const [profileError, setProfileError] = useState(false); // ✅ NEW

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthChecked(true);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const loadProfile = async () => {
      if (!authChecked) return;

      // If unauthenticated → nothing to fetch
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setProfileError(false);

      try {
        const token = await user.getIdToken();
        const res = await backend.getCurrentUserProfile(token);
        setProfile(res);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setProfileError(true); // profile failed
        setProfile(null); // clear profile
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [authChecked, user]);

  // UI states
  if (!authChecked)
    return <p className="flex items-center justify-center"></p>;

  // If profile failed → act like user is signed out
  if (profileError)
    return (
      <div className="flex w-full px-6 lg:px-20 py-5">
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
      </div>
    );

  // If loading profile but user exists
  if (user && !profile && !profileError)
    return (
      <p className="flex items-center justify-center"></p>
    );

  return (
    <div className="flex w-full px-6 lg:px-20 py-5">
      {!user || !profile ? (
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
              className="w-11 h-11 lg:w-12 lg:h-12 rounded-full border"
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
