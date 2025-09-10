"use client";

import Image from "next/image";
import { Button } from "./button";
import { useAuth } from "@/hooks/useAuth";
// Assume useAuth returns { user, logout }

export const NavBar = () => {
  const { user, logout } = useAuth();
  console.log(user?.picture);

  return (
    <div className="h-16 flex items-center justify-between px-4 bg-gradient-to-r from-[#b67237] via-[#d89050] to-[#b67237] rounded-xl shadow-md">
      {/* Left: Logo + Name */}
      <div className="flex items-center gap-2">
        <Image src="/knowflowicon.png" alt="logo" width={40} height={40} />
        <div className="text-xl font-semibold text-white">KnowFlow</div>
      </div>

      {/* Right: Auth actions */}
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Image
              src={user.picture || "/default-avatar.png"}
              alt="avatar"
              width={40}
              height={40}
              className="rounded-full border border-white"
            />
            <Button
              onClick={logout}
              className="bg-white text-amber-700 rounded-xl text-sm px-3 py-1"
            >
              Logout
            </Button>
          </>
        ) : (
          <Button className="bg-white text-amber-700 rounded-xl text-sm px-4 py-2">
            Login
          </Button>
        )}
      </div>
    </div>
  );
};
