import { Typography, Card, CardContent, Sheet, Button } from "@mui/joy";
import { Link as RouterLink } from "react-router-dom";

interface SuccessPageProps {
  username: string;
  onLogout: () => void;
  isSQLi1?: boolean;
}

export default function SuccessPage({ username, onLogout, isSQLi1 = false }: SuccessPageProps) {
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
      <Card
        variant="soft"
        sx={{
          width: 400,
          textAlign: "center",
        }}
      >
        <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Typography level="h2" component="h1" sx={{ mb: 2 }}>
            Welcome, {username}!
          </Typography>
          <Typography level="body-lg" color="neutral">
            You have successfully logged in. {isSQLi1 && "Here is your flag: CUINSPACE{HRL_!1iLQS}"}
          </Typography>
          <Button onClick={onLogout} sx={{ mt: 2, width: "30%", alignSelf: "center" }}>
            Logout
          </Button>
          {isSQLi1 && (
            <Button
              component={RouterLink}
              to="/sqli2"
              variant="soft"
              color="primary"
              sx={{ mt: 3, width: "80%" }}
            >
              Go to Advanced SQLi Challenge
            </Button>
          )}
        </CardContent>
      </Card>
    </Sheet>
  );
}
