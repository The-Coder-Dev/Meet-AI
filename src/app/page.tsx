"use client"

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = () => {
    authClient.signUp.email({
      email, 
      name, 
      password
    }, {
       onError: (ctx) => {
        console.log("ERROR:", ctx);
        window.alert("Something went wrong");
      },
      onSuccess: (ctx) => {
        console.log("SUCCESS:", ctx);
        window.alert("Success");
      },
    } );
  }

  return (
    <div className="p-4 flex flex-col gap-y-6">
      <Input
        placeholder="Enter Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        placeholder="Enter Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button onClick={onSubmit}>
        Submit
      </Button>
    </div>
  );
}
