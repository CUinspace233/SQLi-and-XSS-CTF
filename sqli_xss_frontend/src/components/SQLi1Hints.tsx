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

export default function SQLi1Hints() {
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
            Basic SQL Injection Challenge
          </Chip>
          Hints
        </Typography>
        <AccordionGroup>
          <Accordion>
            <AccordionSummary>
              <Typography level="title-sm">What is SQL Injection?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography level="body-sm">
                SQL injection is a technique where malicious SQL code is inserted into application
                queries. This can bypass authentication or extract sensitive data.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary>
              <Typography level="title-sm">Your Goal</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography level="body-sm">
                Try to log in without knowing the correct password. The login form might be
                vulnerable to SQL injection attacks.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary>
              <Typography level="title-sm">How to Approach This</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography level="body-sm">
                Think about how the backend might construct a SQL query like: <br />
                <code>SELECT * FROM users WHERE username='...' AND password='...'</code>
                <br />
                What if you could make this query always return true?
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary>
              <Typography level="title-sm">Basic Technique</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography level="body-sm">
                Try using special characters like single quotes (') to break out of the query. The
                OR operator can make conditions always true, and -- comments out the rest.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary>
              <Typography level="title-sm">Example Payload</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography level="body-sm">
                Try entering something like: <code>' OR 1=1; --</code> in the username field. This
                makes the query always return true regardless of the password.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </AccordionGroup>
      </CardContent>
    </Card>
  );
}
