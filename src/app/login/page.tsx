'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Style from "./loginPage.module.scss";
import TicketButton from "../components/ticketButton/ticketButton";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (isDev: boolean) => {
    if(isDev) {
        // Simulera utvecklarinloggning
        localStorage.setItem("authToken", "dev-token");
        router.push("/");
        return;
        }
    // Simulera inloggning och spara en token
    localStorage.setItem("authToken", "your-token");
    router.push("/");
  };

  return (
    <div className={Style.loginPage}>
        <div className={Style.loginCard}>
            <h1>Logga in</h1>
            <input
                type="text"
                placeholder="Användarnamn"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Lösenord"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <TicketButton onClick={() => handleLogin(false)} color="white" text="Logga in" />
            <TicketButton onClick={() => handleLogin(true)} color="red" text="dev" />
      </div>
    </div>
  );
}