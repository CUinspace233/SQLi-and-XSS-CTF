import { useState } from "react";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  Typography,
  FormControl,
  FormLabel,
  Input,
  Button,
  Alert,
  Sheet,
  Divider,
} from "@mui/joy";
import SQLi1Hints from "./SQLi1Hints";

interface LoginPageProps {
  onLoginSuccess: (username: string) => void;
  isSQLi1?: boolean;
}

export default function LoginPage({ onLoginSuccess, isSQLi1 = false }: LoginPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmitSQLi1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("http://localhost:3001/login", {
        username,
        password,
      });

      if (res.data.success) {
        onLoginSuccess(username);
      } else {
        setError("Wrong username or password");
      }
    } catch (error) {
      console.error(error);
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        {/* Login Form */}
        <Card
          variant="outlined"
          sx={{
            width: 400,
            boxShadow: "lg",
            borderRadius: "lg",
          }}
        >
          <CardContent sx={{ gap: 2 }}>
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <Typography level="h2" component="h1">
                Welcome Back
              </Typography>
              <Typography level="body-sm" color="neutral">
                Please log in to your account
              </Typography>
            </Box>

            {error && (
              <Alert color="danger" variant="soft" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmitSQLi1}>
              <FormControl sx={{ mb: 2 }}>
                <FormLabel>Username</FormLabel>
                <Input
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  size="lg"
                />
              </FormControl>

              <FormControl sx={{ mb: 3 }}>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  size="lg"
                />
              </FormControl>

              <Button type="submit" fullWidth size="lg" loading={loading} sx={{ mb: 2 }}>
                Log In
              </Button>
            </form>
          </CardContent>
        </Card>

        <Divider sx={{ my: 4 }} />

        {/* SQL Injection Hints */}
        {isSQLi1 && <SQLi1Hints />}
      </Box>
    </Sheet>
  );
}
