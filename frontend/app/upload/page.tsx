"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";

const UploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // ✅ go back to dashboard
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 w-screen">
      <div className="bg-gradient-to-r from-[#b67237] via-[#d89050] to-[#b67237] rounded-2xl text-white container mx-auto p-6">
        <h1 className="text-3xl font-semibold mb-6">Upload Document</h1>

        <div className="bg-white rounded-2xl shadow-md p-6 text-gray-800">
          <p className="mb-4 text-sm text-gray-600">
            Supports <span className="font-medium">PDF, TXT, and MD</span> files
          </p>

          <input
            type="file"
            accept=".pdf,.txt,.md"
            onChange={handleFileChange}
            className="block mb-4"
          />

          {file && (
            <div className="mb-4 text-sm">
              Selected file:{" "}
              <span className="font-medium text-amber-700">{file.name}</span>
            </div>
          )}

          <Button
            onClick={handleUpload}
            disabled={loading || !file}
            className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl"
          >
            {loading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
