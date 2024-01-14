// Login.tsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { LoginAPI } from "../../api/login";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    await LoginAPI({
      account: username,
      password,
    });
    navigate("/im");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="flex justify-start">
      <div className="inline-block">
        <div className="text-[20px] py-[10px]">Login</div>
        <div>
          <label>Username:</label>
          <input
            className="block"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="p-[5px]" />
        <div>
          <label>Password:</label>
          <input
            className="block"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyUp={handleKeyPress}
          />
        </div>
        <div className="p-[5px]" />
        <div className="flex justify-end">
          <button onClick={handleLogin}>Login</button>
        </div>
      </div>
    </div>
  );
};
