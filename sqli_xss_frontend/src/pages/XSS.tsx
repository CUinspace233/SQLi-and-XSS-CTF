import { useState, useEffect } from "react";
import {
  Sheet,
  Card,
  CardContent,
  Typography,
  Input,
  Textarea,
  Button,
  Divider,
  Alert,
  Box,
  IconButton,
  Modal,
  ModalDialog,
  ModalClose,
  Stack,
} from "@mui/joy";
import axios from "axios";
import XSSHints from "../components/XSSHints";

interface Message {
  id: number;
  name: string;
  message: string;
  created_at: string;
}

export default function XSS() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // New state for report functionality
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportingMessageId, setReportingMessageId] = useState<number | null>(null);
  const [reportReason, setReportReason] = useState("");
  const [reportLoading, setReportLoading] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  // Fetch messages on component mount
  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/get-messages`);
      setMessages(response.data.messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/submit-message`, {
        name: name.trim(),
        message: message.trim(),
      });

      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);

      // Clear form
      setName("");
      setMessage("");

      // Refresh messages
      await fetchMessages();
    } catch (error) {
      console.error("Error submitting message:", error);
    }
    setLoading(false);
  };

  const handleClearMessages = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/delete-messages`);
      setMessages([]);
    } catch (error) {
      console.error("Error clearing messages:", error);
    }
  };

  const handleReport = async () => {
    if (!reportingMessageId || !reportReason.trim()) return;

    setReportLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/report-message`, {
        messageId: reportingMessageId,
        reason: reportReason.trim(),
      });

      setReportSuccess(true);
      setTimeout(() => setReportSuccess(false), 3000);

      // Close modal and reset
      setReportModalOpen(false);
      setReportingMessageId(null);
      setReportReason("");
    } catch (error) {
      console.error("Error reporting message:", error);
    }
    setReportLoading(false);
  };

  const openReportModal = (messageId: number) => {
    setReportingMessageId(messageId);
    setReportModalOpen(true);
  };

  return (
    <Sheet
      sx={{
        minHeight: "100vh",
        padding: 4,
        background: "linear-gradient(45deg, #f3f4f6, #e5e7eb)",
      }}
    >
      <Box
        sx={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        {/* Header */}
        <Card variant="soft" sx={{ mb: 4, textAlign: "center", width: "100%" }}>
          <CardContent>
            <Typography level="h1" sx={{ mb: 2 }}>
              COMP6841 Community Message Board
            </Typography>
            <Typography level="body-lg" sx={{ mt: 2, color: "neutral" }}>
              Share your thoughts with the community! All messages are reviewed by our admin team.
            </Typography>
          </CardContent>
        </Card>

        {submitSuccess && (
          <Alert color="success" sx={{ mb: 2 }}>
            Message submitted successfully! It will be reviewed by admin.
          </Alert>
        )}

        {reportSuccess && (
          <Alert color="success" sx={{ mb: 2 }}>
            Message reported successfully! Admin will review it shortly.
          </Alert>
        )}

        {/* Submit Message Form */}
        <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap", width: "100%" }}>
          <Card
            variant="outlined"
            sx={{
              flex: 1,
              minWidth: 400,
              maxHeight: "fit-content",
            }}
          >
            <CardContent>
              <Typography level="h3" sx={{ mb: 2 }}>
                Leave a Message
              </Typography>

              <form onSubmit={handleSubmit}>
                <Input
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  sx={{ mb: 2 }}
                  required
                />

                <Textarea
                  placeholder="Leave a message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  minRows={4}
                  sx={{ mb: 2 }}
                  required
                />

                <Button type="submit" loading={loading} sx={{ width: "100%" }}>
                  Submit Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Messages Display */}
        <Card variant="outlined" sx={{ width: "100%" }}>
          <CardContent>
            <Typography level="h3" sx={{ mb: 3 }}>
              My Messages
            </Typography>

            <Button onClick={handleClearMessages}>Clear Messages</Button>

            {messages.length === 0 ? (
              <Typography level="body-lg" color="neutral" sx={{ textAlign: "center", py: 4 }}>
                No messages yet.
              </Typography>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {messages.map((msg) => (
                  <Card key={msg.id} variant="soft" size="sm">
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "start",
                          mb: 1,
                        }}
                      >
                        <Typography level="title-sm" color="primary">
                          {msg.name}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Typography level="body-xs" color="neutral">
                            {new Date(msg.created_at).toLocaleString()}
                          </Typography>
                          <IconButton
                            size="sm"
                            variant="plain"
                            color="danger"
                            onClick={() => openReportModal(msg.id)}
                            title="Report this message"
                          >
                            Report this message
                          </IconButton>
                        </Box>
                      </Box>
                      {/* Intentionally vulnerable: rendering raw HTML using plain div */}
                      <div
                        style={{
                          fontSize: "14px",
                          color: "var(--joy-palette-text-secondary)",
                          lineHeight: 1.5,
                          wordWrap: "break-word",
                        }}
                        dangerouslySetInnerHTML={{ __html: msg.message }}
                      />
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
          </CardContent>
        </Card>

        <Divider sx={{ my: 6 }} />

        <XSSHints />

        {/* Report Modal */}
        <Modal open={reportModalOpen} onClose={() => setReportModalOpen(false)}>
          <ModalDialog>
            <ModalClose />
            <Typography level="h4" sx={{ mb: 2 }}>
              Report Message
            </Typography>
            <Stack spacing={2}>
              <Typography level="body-sm" color="neutral">
                Why are you reporting this message? This will be sent to admin for review.
              </Typography>
              <Textarea
                placeholder="Describe the issue with this message..."
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                minRows={3}
              />
              <Button
                onClick={handleReport}
                loading={reportLoading}
                disabled={!reportReason.trim()}
              >
                Submit Report
              </Button>
            </Stack>
          </ModalDialog>
        </Modal>
      </Box>
    </Sheet>
  );
}
