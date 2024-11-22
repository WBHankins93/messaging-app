import { useState } from "react";
import { login } from "../services/api"; // Ensure this is defined in your API utilities
import { AxiosError } from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Checkbox,
  FormControlLabel
} from "@mui/material";
import { useRouter } from "next/router";
import { saveToken } from "../utils/sessionStorage"; // Use sessionStorage utilities

interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

export default function Login(): JSX.Element {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setMessage(null);
    setIsError(false);
    setIsLoading(true);

    try {
      const response = await login(username, password);
      const data: LoginResponse = response.data;

      // Save the tokens in session storage
      saveToken("accessToken", data.access_token);
      saveToken("refreshToken", data.refresh_token);

      setMessage("Login successful!");
      console.log("Login successful:", data);

      // Redirect to the chat page
      router.push("/chat");
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response) {
          setMessage("Invalid username or password. Please try again.");
        } else if (error.request) {
          setMessage("No response from server. Please try again later.");
        } else {
          setMessage("Unexpected error occurred. Please try again.");
        }
      } else {
        setMessage("An unknown error occurred.");
      }
      setIsError(true);
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
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
        Login
      </Typography>
      <Box
        component="form"
        onSubmit={handleLogin}
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
        <FormControlLabel
          control={
            <Checkbox
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
          }
          label="Remember Me"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : "Log In"}
        </Button>
        <Box mt={2}>
        <Typography variant="body2">
            Don't have an account?{" "}
            <Button onClick={() => router.push("/signup")}>Sign Up</Button>
        </Typography>
        </Box>
      </Box>
      {message && (
        <Alert severity={isError ? "error" : "success"} sx={{ mt: 2 }}>
          {message}
        </Alert>
      )}
    </Box>
  );
}
