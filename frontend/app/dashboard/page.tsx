"use client";

import DashboardLoader from "@/components/DashboardLoader";
import { AuthGate } from "@/components/ui/authgate";
import { Button } from "@/components/ui/button";
import { DocCard } from "@/components/ui/doccard";
import { NavBar } from "@/components/ui/navbar";
import api from "@/lib/axios";
import { BACKEND_URL } from "@/lib/utils";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

const ChatPage = () => {
  const [allDocs, setAllDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${BACKEND_URL}/docs/${id}`, {
        withCredentials: true,
      });
      setAllDocs((docs) => docs.filter((doc) => doc.id !== id));
    } catch (e) {
      console.error("Delete failed", e);
    }
  };

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await api.get("/docs");
        setAllDocs(res.data.allDocs || []);
      } catch (e) {
        console.error("Failed to fetch docs", e);
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, []);

  return (
    <AuthGate className={"p-2 w-screen h-screen"}>
      <div className="bg-gradient-to-r from-[#b67237] via-[#d89050] to-[#b67237] rounded-2xl text-white container mx-auto md:p-4 p-2 h-[90%]">
        <NavBar />
        {/* Title + Upload */}
        <div className="flex items-center justify-between py-4">
          <h1 className="text-2xl font-bold">My Documents</h1>
          <Link href={"/upload"}>
            <Button variant="amber">Upload File</Button>
          </Link>
        </div>

        {/*cards grid*/}
        {loading ? (
          // <div className="py-10">Loading documents...</div>
          <DashboardLoader />
        ) : allDocs.length === 0 ? (
          <div className="py-10 space-y-2">
            <h1>No Documents Found</h1>
            <div>Upload docs to get started</div>
            <Button variant={"amber"}>Upload File</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-10">
            {allDocs.map((doc) => (
              <DocCard
                key={doc.id}
                id={doc.id}
                title={doc.title}
                createdAt={new Date(doc.createdAt).toLocaleDateString()}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </AuthGate>
  );
};

export default ChatPage;
