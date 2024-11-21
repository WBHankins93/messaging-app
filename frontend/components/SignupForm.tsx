import React, { useState } from "react";
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

interface SignupFormProps {
  onSuccess?: () => void; // Callback after successful signup
}

const SignupForm: React.FC<SignupFormProps> = ({ onSuccess }) => {
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

      if (onSuccess) onSuccess(); // Trigger callback after successful signup
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response) {
          // Handle server error
          if (error.response.status === 400) {
            setMessage(error.response.data.detail || "User already exists.");
          } else {
            setMessage("Signup failed.");
          }
        } else if (error.request) {
          // Handle no response
          setMessage("No response from server. Please try again later.");
        } else {
          setMessage("Signup failed due to unexpected error.");
        }
      } else {
        setMessage("An unexpected error occurred.");
      }
      setIsError(true);
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false); // Hide loading spinner
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSignup}
      display="flex"
      flexDirection="column"
      gap={2}
      width="100%"
      maxWidth="400px"
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
      {message && (
        <Alert severity={isError ? "error" : "success"} sx={{ mt: 2 }}>
          {message}
        </Alert>
      )}
    </Box>
  );
};

export default SignupForm;
