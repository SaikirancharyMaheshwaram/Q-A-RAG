// components/AuthGate.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BACKEND_URL } from "@/lib/utils";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/auth/me`, {
          withCredentials: true,
        });
        if (res.data.message == "success") {
          setAuthorized(true);
        } else {
          router.push("/login");
        }
      } catch (err) {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) return <p>Loading...</p>;

  if (!authorized) return null;

  return <>{children}</>;
}
