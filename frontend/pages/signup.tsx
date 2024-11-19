import { useState } from "react";
import { signup } from "../services/api";
import { AxiosError } from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";

interface SignupResponse {
    message: string;
}

export default function Signup(): JSX.Element {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setMessage(null);
    setIsError(false);
    setIsLoading(true);

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
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      p={3}
    >
      <Typography variant="h4" gutterBottom>
        Signup
      </Typography>
      <Box
        component="form"
        onSubmit={handleSignup}
        display="flex"
        flexDirection="column"
        width="100%"
        maxWidth="400px"
        gap={2}
      >
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : "Sign Up"}
        </Button>
      </Box>
      {message && (
        <Alert severity={isError ? "error" : "success"} sx={{ mt: 2 }}>
          {message}
        </Alert>
      )}
    </Box>
  );
}
