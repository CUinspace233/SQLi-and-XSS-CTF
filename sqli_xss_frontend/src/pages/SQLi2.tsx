import { useState } from "react";
import axios, { AxiosError } from "axios";
import { Box, Typography, Input, Button, CircularProgress, Sheet, Divider } from "@mui/joy";
import SQLi2Hints from "../components/SQLi2Hints";

export default function SQLi2() {
  const [key, setKey] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/query-grade`, {
        key,
      });
      const display = res.data?.data?.length
        ? res.data.data.map((row: { grade: string }) => row.grade).join(", ")
        : "No result found";
      setResult(display);
    } catch (err) {
      const msg = (err as AxiosError<{ error: string }>).response?.data?.error || "try another key";
      setResult(`Opps, something went wrong: ${msg}`);
    }
    setLoading(false);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <Sheet
        variant="outlined"
        sx={{
          mx: "auto",
          mt: 8,
          p: 4,
          borderRadius: "md",
          boxShadow: "sm",
        }}
      >
        <Typography level="h2" component="h1" sx={{ mb: 2 }}>
          Your COMP6841 Final Grade
        </Typography>
        <Typography level="body-lg" sx={{ mb: 2 }}>
          Please enter your key to check your grade.
        </Typography>
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <Input
            fullWidth
            placeholder="Please enter your COMP6841 key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            disabled={loading}
          />
          <Button
            onClick={handleSubmit}
            loading={loading}
            disabled={loading || !key}
            variant="solid"
          >
            Check
          </Button>
        </Box>
        <Box sx={{ mt: 2, whiteSpace: "pre-wrap" }}>
          <Typography level="body-lg" fontWeight="lg">
            Result:
          </Typography>
          <Sheet
            variant="soft"
            sx={{
              mt: 1,
              p: 2,
              minHeight: 40,
              borderRadius: "sm",
              backgroundColor: "#f7f7fa",
            }}
          >
            {loading ? <CircularProgress size="sm" /> : result}
          </Sheet>
        </Box>
      </Sheet>
      <Divider sx={{ my: 4 }} />
      <SQLi2Hints />
    </Box>
  );
}
