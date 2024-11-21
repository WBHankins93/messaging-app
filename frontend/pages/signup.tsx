import React from "react";
import { useRouter } from "next/router";
import SignupForm from "../components/SignupForm";
import { Box, Typography } from "@mui/material";

const SignupPage: React.FC = () => {
  const router = useRouter();

  // Redirect to /chat on successful signup
  const handleSuccess = () => {
    router.push("/chat");
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
      <SignupForm onSuccess={handleSuccess} />
    </Box>
  );
};

export default SignupPage;
