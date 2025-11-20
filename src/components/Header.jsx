// src/components/SignIn.jsx
import React, { useEffect, useState } from "react";
import { auth, signInWithGoogle, logout } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { LogOut } from "lucide-react";

import GoogleIcon from "../assets/google.png";

const Header = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="flex w-full px-6 lg:px-20 py-5">
      {!user ? (
        <div className="flex justify-between w-full items-center">
          <div></div>
          <button
            onClick={signInWithGoogle}
            className="px-4 py-2 bg-dark hover:bg-dark/90 text-white font-medium rounded-full flex items-center gap-2 transition-all cursor-pointer"
          >
            <img src={GoogleIcon} alt="Google icon" className="w-8" />
            Sign In with Google
          </button>
        </div>
      ) : (
        <div className="flex justify-between w-full items-center gap-4">
          <div className="flex gap-2 items-center">
            <img
              src="https://lh3.googleusercontent.com/a/ACg8ocIUWqOxnMVVHW3ejfAAc83Tv3Tu-eGXi1NZTgggZiSr0_rN-Q=s96-c"
              alt=""
              className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-primary"
            />
            <span className="font-medium text-lg md:text-xl font-heading">
              {user.displayName}
            </span>
          </div>

          <button
            onClick={logout}
            className="px-4 py-2 bg-primary hover:bg-primary/90 text-white font-medium rounded-full flex items-center gap-2 transition-all cursor-pointer"
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
