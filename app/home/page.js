"use client";

import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import NotFound from "../not-found";
import { StudyList } from "@/components/Options";
import History from "@/components/History";
import Feedback from "@/components/Feedback";
import { BlurFade } from "@/components/magicui/blur-fade";
import { Button } from "@/components/ui/button";
import UserInputDialog from "@/components/UserInputDialog";
import { EditProfileButton } from "@/components/EditProfileButton";

const Home = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

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

  if (!user) {
    return <div></div>;
  }

  return (
    <>
      {user && user.isVerified ? (
        <div>
          <Navbar />

          <div className="p-10 mt-14 md:px-20 lg:px-32 xl:px-56 2xl:px-72">
            <div>
              <h2 className="font-medium text-gray-500">My Workspace</h2>

              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold">Welcome, {user.name}</h2>
                <EditProfileButton />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10 mt-10">
              {StudyList.map((option, index) => (
                <BlurFade key={option.icon} delay={0.25 + index * 0.05} inView>
                  <div
                      key={index}
                      className="p-3 bg-secondary rounded-3xl flex flex-col justify-center items-center shadow-xl hover:shadow-2xl hover:cursor-pointer transition-all"
                    >
                  <UserInputDialog studyList={option}>
                    <div
                      key={index}
                      className="flex flex-col justify-center items-center hover:cursor-pointer"
                    >
                      <img
                        className="w-[70px] h-[70px] hover:rotate-12 transition-all"
                        src={option.icon}
                        alt={option.name}
                        width={150}
                        height={150}
                      />
                      <h2 className="mt-2">{option.name}</h2>
                    </div>
                  </UserInputDialog>
                  </div>
                </BlurFade>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-20">
              <History />
              <Feedback />
            </div>
          </div>
        </div>
      ) : (
        <NotFound />
      )}
    </>
  );
};

export default Home;
