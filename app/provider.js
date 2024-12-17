"use client";


import { useUser } from "@clerk/nextjs";
import axios from "axios";
import React, { useEffect } from "react";


// import { USER_TABLE } from "@/configs/schema";

function Provider({ children }) {
  const { user } = useUser();

  useEffect(() => {
    user && CheckNewUser(); // Run the check when the user exists
  }, [user]); // Dependency array to re-run when `user` changes

  const CheckNewUser = async () => {
    const resp = await axios.post("/api/create-user", { user: user });
    console.log(resp.data);
  };

  return <div>{children}</div>;
}

export default Provider;
