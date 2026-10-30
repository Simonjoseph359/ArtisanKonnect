"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { db } from "@/config/firebase";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

interface Message {
  id: string;
  senderId: string;
  text: string;
  createdAt: any;
}

export default function ChatPage() {
  const { chatId } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();

  const [chatMeta, setChatMeta] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUserId = (session?.user as any)?.id || session?.user?.email;

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  // Fetch Chat Metadata and Subscribe to Realtime Messages
  useEffect(() => {
    if (!chatId || !currentUserId) return;

    // 1. Fetch Chat metadata (Participant info)
    async function fetchChatMeta() {
      try {
        const chatDocRef = doc(db, "chats", chatId as string);
        const docSnap = await getDoc(chatDocRef);
        if (docSnap.exists()) {
          setChatMeta(docSnap.data());
        } else {
          console.error("Chat room not found!");
        }
      } catch (err) {
        console.error("Error fetching chat metadata:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchChatMeta();

    // 2. Real-time Message Listener via Firebase onSnapshot
    const messagesRef = collection(db, "chats", chatId as string, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: Message[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<Message, "id">),
      }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [chatId, currentUserId]);

  // Send Message Handler
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUserId || !chatId) return;

    const messageText = newMessage.trim();
    setNewMessage("");

    try {
      // Add message to sub-collection
      const messagesRef = collection(db, "chats", chatId as string, "messages");
      await addDoc(messagesRef, {
        senderId: currentUserId,
        text: messageText,
        createdAt: serverTimestamp(),
      });

      // Update parent chat metadata for list previews
      const chatDocRef = doc(db, "chats", chatId as string);
      await updateDoc(chatDocRef, {
        lastMessage: messageText,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <p className="text-gray-600 mb-4">Please sign in to access your chat.</p>
        <Link href="/auth" className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold">
          Sign In
        </Link>
      </div>
    );
  }

  // Get recipient details from participantDetails
  const otherUserId = chatMeta?.participants?.find((p: string) => p !== currentUserId);
  const recipient = chatMeta?.participantDetails?.[otherUserId] || { name: "Artisan", image: "" };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top Chat Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-800 text-sm font-bold cursor-pointer">
            ← Back
          </button>
          <div className="flex items-center gap-3">
            <img
              src={recipient.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400"}
              alt={recipient.name}
              className="w-10 h-10 rounded-full object-cover border border-gray-200"
            />
            <div>
              <h2 className="text-sm font-bold text-gray-900">{recipient.name}</h2>
              <span className="text-[11px] text-emerald-600 font-medium">● Online</span>
            </div>
          </div>
        </div>
      </header>

      {/* Messages Feed Area */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 overflow-y-auto space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 my-12 text-sm">
            No messages yet. Send a greeting to start the conversation!
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === currentUserId;
            return (
              <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                    isMe
                      ? "bg-emerald-600 text-white rounded-br-none"
                      : "bg-white text-gray-800 border border-gray-100 rounded-bl-none"
                  }`}
                >
                  <p className="leading-relaxed">{msg.text}</p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </main>

     
     {/* Message Input Box & Make Payment Button */}
      <footer className="bg-white border-t border-gray-200 p-4 sticky bottom-0">
        <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto flex items-center gap-2">
          {/* Input field with min-w-0 so it doesn't crush buttons */}
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={`Message ${recipient.name}...`}
            className="flex-1 min-w-0 px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition text-gray-900"
          />
          
          {/* Button Group locked to the right side without shrinking */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Send Button */}
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="px-4 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow hover:bg-emerald-700 transition disabled:opacity-50 cursor-pointer"
            >
              Send
            </button>

            {/* Make Payment Button */}
            <button
              type="button"
              onClick={() =>
                router.push(
                  `/chat/${chatId}/escrow-terms?artisanId=${otherUserId}&artisanEmail=${otherUserId}&artisanName=${encodeURIComponent(
                    recipient.name
                  )}`
                )
              }
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow transition whitespace-nowrap cursor-pointer flex items-center gap-1.5"
            >
              <span>🛡️ Make Payment</span>
            </button>
          </div>
        </form>
      </footer>
    </div>
  );
}