"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { db } from "@/config/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { FaComments, FaArrowLeft } from "react-icons/fa";

interface ChatRoom {
  id: string;
  participants: string[];
  participantDetails?: Record<string, { name: string; image: string }>;
  lastMessage?: string;
  updatedAt?: any;
}

export default function ArtisanMessagesPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [chats, setChats] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);

  const currentUserId = (session?.user as any)?.id || session?.user?.email;

  useEffect(() => {
    if (!currentUserId) {
      setLoading(false);
      return;
    }

    const chatsRef = collection(db, "chats");
    const q = query(chatsRef, where("participants", "array-contains", currentUserId));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedChats: ChatRoom[] = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<ChatRoom, "id">),
        }));

        fetchedChats.sort((a, b) => {
          const timeA = a.updatedAt?.toMillis ? a.updatedAt.toMillis() : 0;
          const timeB = b.updatedAt?.toMillis ? b.updatedAt.toMillis() : 0;
          return timeB - timeA;
        });

        setChats(fetchedChats);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching messages:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUserId]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/artisan/dashboard"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-emerald-600 transition"
          >
            <FaArrowLeft /> Back to Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
            <FaComments className="text-emerald-600 text-xl" />
            <h1 className="text-xl font-bold text-gray-900">Client Inbox</h1>
          </div>

          {loading ? (
            <div className="py-12 text-center">
              <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-xs text-gray-400 mt-3">Loading conversations...</p>
            </div>
          ) : chats.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm font-semibold text-gray-700">No Conversations Yet</p>
              <p className="text-xs text-gray-400 mt-1">When clients contact you, your real-time chats will show up here.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 mt-2">
              {chats.map((chat) => {
                const clientId = chat.participants.find((p) => p !== currentUserId);
                const clientInfo = chat.participantDetails?.[clientId || ""] || {
                  name: "Client",
                  image: "",
                };

                return (
                  <div
                    key={chat.id}
                    onClick={() => router.push(`/chat/${chat.id}`)}
                    className="py-4 px-3 hover:bg-gray-50 rounded-xl transition cursor-pointer flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <img
                        src={
                          clientInfo.image ||
                          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400"
                        }
                        alt={clientInfo.name}
                        className="w-12 h-12 rounded-full object-cover border border-gray-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <h2 className="text-sm font-bold text-gray-900 truncate">{clientInfo.name}</h2>
                        <p className="text-xs text-gray-500 truncate mt-1">
                          {chat.lastMessage || "Start conversation..."}
                        </p>
                      </div>
                    </div>

                    <span className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 transition shrink-0">
                      Reply
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}