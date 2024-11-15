import { useState } from "react";
import { signup } from "../services/api";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try{
        const response = await signup(username, password);
        setMessage(response.data.message);
        console.log("Signup successful:", response.data);
    } catch (error: any) {
        setMessage(error.response?.data?.detail || "Signup failed");
        console.error("Signup error:", error);
    }
  };

  return (
    <div>
      <h1>Signup</h1>
      <form onSubmit={handleSignup}>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}
