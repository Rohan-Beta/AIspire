"use client";

import React from "react";
import { Navbar } from "@/components/Navbar";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useState } from "react";
import NotFound from "@/app/not-found";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const DiscussionRoom = () => {
  const [discussionRoomData, setDiscussionRoomData] = useState(null);
  const [error, setError] = useState("");

  const { roomid } = useParams();

  useEffect(() => {
    const fetchDiscussionRoomDataData = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/getdiscussion", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // "auth-token": token,
          },
          body: JSON.stringify({ roomid }),
        });
        const data = await res.json();

        if (res.status == 200) {
          setDiscussionRoomData(data);
        }
        if (res.status == 500) {
          setDiscussionRoomData(data.error);
        }
      } catch (error) {
        setError("Error fetching discussionRoomData data");
      }
    };
    fetchDiscussionRoomDataData();
  }, []);

  if (!discussionRoomData) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoaderCircle className="animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div>
        <Navbar />
        <div className="p-10 mt-2 md:px-20 lg:px-32 xl:px-56 2xl:px-72">
          <h2 className="text-lg font-bold">
            {discussionRoomData.coachingOption}
          </h2>

          <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <div className="h-[60vh] bg-secondary border rounded-4xl flex flex-col items-center justify-center relative">
                <img
                  src={`/${discussionRoomData.tutorName}.avif`}
                  alt="Avatar"
                  className="h-[80px] w-[80px] rounded-full object-cover animate-pulse"
                />
                <h2 className="text-gray-500">
                  {discussionRoomData.tutorName}
                </h2>

                <div className="p-5 bg-gray-200 px-10 rounded-lg absolute bottom-10 right-10">
                  <img
                    src={`/logo.png`}
                    alt="Avatar"
                    className="h-[40px] w-[40px] rounded-full object-cover"
                  />
                </div>
              </div>
              <div className="flex justify-center mt-5">
                <Button
                  className="hover:bg-black hover:text-white transition-all hover:cursor-pointer shadow-2xl hover:animate-bounce"
                  variant="outline"
                >
                  Connect
                </Button>
              </div>
            </div>

            <div>
              <div className="h-[60vh] bg-secondary border rounded-4xl flex flex-col items-center justify-center relative">
               
                <h2>chat section</h2>
              
              </div>
              <h2 className="mt-5 text-gray-400 text-sm">At the end of your conversation we will automatically generate feedback/notes from your conversation</h2>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DiscussionRoom;
