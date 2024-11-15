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

    try {
        const response = await signup(username, password);
        const data: SignupResponse = response.data;
        setMessage(data.message); // Display success message
        console.log("Signup successful:", data);
      
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
            if (error.response) {
              // If the server responds with an error status
              if (error.response.status === 400) {
                // Set the message based on server's error message or use a default
                setMessage(error.response.data.detail || "User already exists.");
              } else {
                setMessage("Signup failed.");
              }
            } else if (error.request) {
              // If the request was made but no response was received
              setMessage("No response from server. Please try again later.");
            } else {
              // For any other errors that occurred in setting up the request
              setMessage("Signup failed due to unexpected error.");
            }
          } else {
            // Generic fallback message for non-Axios errors
            setMessage("An unexpected error occurred.");
          }
        console.error("Signup error:", error);
      };
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
