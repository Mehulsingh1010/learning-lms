"use client";

import { useUser } from "@clerk/nextjs";
import axios from "axios";
import React, { useEffect } from "react";

function Provider({ children }) {
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      checkNewUser();
    }
  }, [user]);

  const checkNewUser = async () => {
    try {
      const response = await axios.post("/api/create-user", {
        user: {
          id: user.id,
          email: user.emailAddresses[0]?.emailAddress,
          username: user.username || user.firstName || user.id,
        },
      });
      console.log(response.data.message);
    } catch (error) {
      console.error("Error checking or creating user:", error.response?.data || error.message);
    }
  };

  return <>{children}</>;
}

export default Provider;

