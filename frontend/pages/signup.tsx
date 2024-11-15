import { useState } from "react";
import { signup } from "../services/api";
import { AxiosError } from "axios";

interface SignupResponse {
    message: string;
}

// Define a custom type for error messages
type ErrorMessage = string | null;

export default function Signup(): JSX.Element {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<ErrorMessage>(null);

  const handleSignup = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setMessage(null);

    try{
        const response = await signup(username, password);
        const data: SignupResponse = response.data;
        setMessage(data.message);
        console.log("Signup successful:", response);

    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            setMessage(error.response.data.detail || "Signup failed");
        } else {
            setMessage("An unexpected error occurred.");
        }
        console.error("singup error:", error);
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
      {message && <p>{message}</p>}
    </div>
  );
}
