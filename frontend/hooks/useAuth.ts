"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/lib/utils";

interface User {
  id: string;
  email: string;
  name?: string;
  picture?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. On mount, check if user is logged in
  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/auth/me`, { withCredentials: true }) // send cookies
      .then((res) => {
        setUser(res.data.user);
      })
      .catch(() => {
        setUser(null); // not logged in
      })
      .finally(() => setLoading(false));
  }, []);

  // 2. Logout method
  const logout = async () => {
    await axios.post(
      `${BACKEND_URL}/auth/logout`,
      {},
      { withCredentials: true },
    );
    setUser(null);
    window.location.href = "/"; // redirect to home/login
  };

  return { user, loading, logout };
}
