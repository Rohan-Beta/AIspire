"use client";

import React, { useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useState } from "react";
import NotFound from "@/app/not-found";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
// import dynamic from "next/dynamic";
// const RecordRTC = dynamic(() => import("recordrtc"), { ssr: false });

let RecordRTC;

const DiscussionRoom = () => {
  const [discussionRoomData, setDiscussionRoomData] = useState(null);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [enableMic, setEnableMic] = useState(false);
  const recorder = useRef(null);
  let silenceTimeout;

  const realtimeTranscriber = useRef(null);

  const { roomid } = useParams();

  // mic recording

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("recordrtc").then((mod) => {
        RecordRTC = mod.default || mod; // depending on how it's exported
      });
    }
  }, []);

  // discussion room info

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

  // user info

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        setError("No authentication token found");
        return;
      }

      try {
        const res = await fetch("http://localhost:4000/api/getuser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
        });
        const data = await res.json();

        if (res.status == 200) {
          setUser(data);
        }
        if (res.status == 500) {
          setUser(data.error);
        }
      } catch (error) {
        setError("Error fetching user data");
      }
    };
    fetchUserData();
  }, []);

  const connectToServer = async () => {
    setEnableMic(true);

    if (typeof window !== "undefined" && typeof navigator !== "undefined") {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          recorder.current = new RecordRTC(stream, {
            type: "audio",
            mimeType: "audio/webm;codecs=opus", // "pom" likely meant "opus"
            recorderType: RecordRTC.StereoAudioRecorder,
            timeSlice: 250,
            desiredSampRate: 16000,
            numberOfAudioChannels: 1,
            bufferSize: 4096,
            audioBitsPerSecond: 128000,

            ondataavailable: async (blob) => {
                // if (!realtimeTranscriber.current) return;

              // Reset the silence detection timer on audio input
              clearTimeout(silenceTimeout);

              const buffer = await blob.arrayBuffer();

              // Process buffer here if needed
              console.log(buffer);

              // Restart the silence detection timer
              silenceTimeout = setTimeout(() => {
                console.log("User stopped talking");
                // Handle silence (e.g., send final transcript, stop recording, etc.)
              }, 2000);
            },
          });

          // recorder.current.startRecording();
          recorder.current.startRecording();
        })
        .catch((err) => console.error(err));
    }
  };

  const disconnectFromServer = async (e) => {
    e.preventDefault();

    setEnableMic(false);

    recorder.current.pauseRecording();
    recorder.current = null;
  };

  if (!discussionRoomData) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoaderCircle className="animate-spin" />
      </div>
    );
  }
  if (!user) {
    return <div></div>;
  }

  return (
    <>
      {user && user.isVerified ? (
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
                    <div className="bg-black text-white rounded-full px-4 py-2">
                      {user.name[0]}
                    </div>
                    {/* <img
                    src={`/logo.png`}
                    alt="Avatar"
                    className="h-[40px] w-[40px] rounded-full object-cover"
                  /> */}
                  </div>
                </div>
                <div className="flex justify-center mt-5">
                  {!enableMic ? (
                    <Button
                      onClick={connectToServer}
                      className="hover:bg-black hover:text-white transition-all hover:cursor-pointer shadow-2xl hover:animate-bounce"
                      variant="outline"
                    >
                      Connect
                    </Button>
                  ) : (
                    <Button
                      variant="destructive"
                      onClick={disconnectFromServer}
                      className="bg-black text-white hover:bg-white hover:text-black border hover:border-black transition-all hover:cursor-pointer shadow-2xl hover:animate-bounce"
                    >
                      Disconnect
                    </Button>
                  )}
                </div>
              </div>

              <div>
                <div className="h-[60vh] bg-secondary border rounded-4xl flex flex-col items-center justify-center relative">
                  <h2>chat section</h2>
                </div>
                <h2 className="mt-5 text-gray-400 text-sm">
                  At the end of your conversation we will automatically generate
                  feedback/notes from your conversation
                </h2>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <NotFound />
      )}
    </>
  );
};

export default DiscussionRoom;
