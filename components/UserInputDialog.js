"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Textarea } from "./ui/textarea";
import { TutorList } from "./Options";
import { useState } from "react";
import { Button } from "./ui/button";
import { DialogClose } from "@radix-ui/react-dialog";
import { useEffect } from "react";
import { LoaderCircle } from "lucide-react";

const UserInputDialog = ({ children, studyList }) => {
  
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedTutor, setSelectedTutor] = useState("");
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false)

  useEffect(() => {
      const fetchUserData = async () => {
        
        setSelectedTopic(studyList.name)
      };
      fetchUserData();
    }, []);

  const onSubmit = async (e) => {

    setLoading(true);

    const token = localStorage.getItem("authToken");

      if (!token) {
        setError("No authentication token found");
        return;
      }

    try {
      let res = await fetch("http://localhost:4000/api/discussion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify({selectedTopic, selectedTutor, topic}),
      });

      const data = await res.json();

      setSelectedTutor("");

    } catch (error) {
      console.log("server Issue");
    }
    setLoading(false)
  };

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{studyList.name}</DialogTitle>
          <DialogDescription asChild>
            <div className="mt-3">
              <h2 className="text-black font-semibold">
                Enter a topic to master your skills in {studyList.name}
              </h2>
              <Textarea
                className="mt-3 text-black"
                placeholder="Enter your topic here..."
                onChange={(e) => setTopic(e.target.value)}
              />

              <h2 className="mt-5 mb-2 text-gray-700">Select a Tutor Guide</h2>

              <div className="grid grid-cols-3 md:grid-cols-5 gap-6">
                {TutorList.map((option, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedTutor(option.name)}
                  >
                    <img
                      src={option.icon}
                      alt={option.name}
                      className={`rounded-2xl h-[80px] w-[80px] object-cover hover:shadow-2xl hover:cursor-pointer hover:scale-105 hover:transition-all ${
                        selectedTutor == option.name &&
                        "border-2 p-1 rounded-2xl shadow-2xl border-blue-300"
                      }`}
                    />
                    <h2 className="text-center mt-1">{option.name}</h2>
                  </div>
                ))}
              </div>

              <div className="flex gap-5 justify-end">
                <DialogClose>
                  <Button
                    onClick={() => setSelectedTutor("")}
                    variant={"ghost"}
                    className="hover:cursor-pointer"
                  >
                    Cancel
                  </Button>
                </DialogClose>

                <Button
                onClick={onSubmit}
                  disabled={!topic || !selectedTutor || loading}
                  className="hover:cursor-pointer hover:bg-white hover:text-black border hover:border-black transition-all"
                >
                  {loading && <LoaderCircle className="animate-spin" />}
                  Next
                </Button>

              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default UserInputDialog;
