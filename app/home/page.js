"use client";

import React from "react";
import { useEffect } from "react";
import { useState } from "react";

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

  return (
    <div>
      {!user ? (
        <div>hello</div>
      ) : (<div>
        {user.name}
        <br />
        {user.email}
        </div>)
    }
    </div>
  );
}

export default Home;
