"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface DocCardProps {
  id: string;
  title: string;
  createdAt: string;
  onDelete: (id: string) => void;
}

function DocCard({ id, title, createdAt, onDelete }: DocCardProps) {
  const router = useRouter();

  return (
    <Card className="rounded-2xl shadow-md hover:shadow-lg transition flex flex-col justify-between">
      <CardHeader>
        <CardTitle className="truncate">{title}</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col justify-between flex-1">
        <p className="text-sm text-gray-500 mb-4">Created: {createdAt}</p>

        <div className="flex justify-between items-center">
          <Button
            onClick={() => router.push(`/chat/${id}`)}
            className="bg-amber-600 text-white rounded-xl"
          >
            Chat
          </Button>

          <Button
            onClick={() => onDelete(id)}
            variant="outline"
            className="border-red-500 text-red-500 hover:bg-red-50 rounded-xl flex items-center gap-1"
          >
            <Trash2 size={16} />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export { DocCard };
