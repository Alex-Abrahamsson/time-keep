'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Style from "./loginPage.module.scss";
import TicketButton from "../components/ticketButton/ticketButton";
import { db } from "../../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { UserType } from "@/types/types";
import { useAuth } from "@/context/authContext";
import NewUserModal from "../modals/newUserModal";

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {

    try {
      const usersRef = collection(db, "Users");
      const q = query(usersRef, where("Name", "==", username));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        alert("Fel användarnamn");
        return;
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data() as UserType;

      if (userData.Password !== password) {
        alert("Fel lösenord");
        return;
      }

      login({
        uid: userDoc.id,
        name: userData.Name,
        email: userData.Email,
        role: userData.Role,
      });

      router.push("/");
    } catch (error) {
      console.error("Login error:", error);
      alert("Något gick fel vid inloggning.");
    }
  };

  const handleRegisterUser = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  }

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
        <TicketButton onClick={() => handleLogin()} color="white" text="Logga in" />
        <div className={Style.registerLink}>
          <p><a onClick={() => handleRegisterUser()}>Skapa konto</a></p>
        </div>
      </div>
      {isModalOpen && < NewUserModal onClose={closeModal} />}
    </div>
  );
}