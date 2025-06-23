import React from "react";
import { UserAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { session, signOut } = UserAuth();
  const navigate = useNavigate();

  console.log(session);

  const handleSignOut = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await signOut();
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1> Welcome, {session?.user?.email}</h1>
      <button onClick={handleSignOut}>Signout</button>
    </div>
  );
};

export default Dashboard;
