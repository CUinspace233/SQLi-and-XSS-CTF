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

export default function SQLi2Hints() {
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
          <Chip size="sm" color="danger">
            Advanced SQL Injection Challenge
          </Chip>
          Hints
        </Typography>
        <AccordionGroup>
          <Accordion>
            <AccordionSummary>
              <Typography level="title-sm">What's Different Here?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography level="body-sm">
                This challenge has a WAF (Web Application Firewall) that blocks common SQL injection
                keywords like SELECT, FROM, UNION, WHERE, OR, AND, etc. You need to bypass these
                filters to extract hidden data.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary>
              <Typography level="title-sm">Your Goal</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography level="body-sm">
                There's a hidden table containing sensitive information. You need to discover the
                database structure and extract the flag from the secret table.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary>
              <Typography level="title-sm">WAF Bypass Techniques</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography level="body-sm">
                The WAF blocks keywords but has weaknesses:
                <br />• Use <code>/**/</code> comments to replace spaces
                <br />• Mix upper and lower case letters
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary>
              <Typography level="title-sm">Step 0: Determine Column Count and Types</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography level="body-sm">
                Before using UNION, you must:
                <br />
                1. <strong>Find the column count</strong>:
                <br />• Try <code>'/**/UnIoN/**/SeLECT/**/null--</code> (1 column)
                <br />• Try <code>'/**/UnIoN/**/SeLECT/**/null,null--</code> (2 columns)
                <br />• Keep adding <code>null</code> until no error occurs
                <br />
                <br />
                2. <strong>Test column types</strong>:
                <br />• Replace <code>null</code> with values of different types:
                <br />• <code>1</code> (integer)
                <br />• <code>'a'</code> (string)
                <br />• <code>true</code> (boolean)
                <br />
                • The types must match the original query's columns
                <br />• Example for string + integer columns:{" "}
                <code>'/**/UnIoN/**/SeLECT/**/'test',1--</code>
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary>
              <Typography level="title-sm">Step 1: Database Discovery</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography level="body-sm">
                First, discover what tables exist in the database. Use the information_schema to
                enumerate tables:
                <br />• Use <code>'UNION</code> to add your own SELECT statement
                <br />• Select <code>&lt;a number&gt;,table_name</code> to get the table name
                <br />• Query from <code>information_schema.tables</code> to see all tables
                <br />• Filter by <code>table_schema=current_schema()</code> to see relevant tables
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary>
              <Typography level="title-sm">Step 2: Column Discovery</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography level="body-sm">
                Once you find interesting table names, discover their column structure:
                <br />• Select <code>column_name</code> from <code>information_schema.columns</code> to see column names
                <br />• Filter by the table name you're interested in, e.g. <code>table_name='flags'</code>
                <br />• Look for columns that might contain sensitive data
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary>
              <Typography level="title-sm">Step 3: Data Extraction</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography level="body-sm">
                Finally, extract the actual data from the target table:
                <br />
                • Use UNION SELECT to query the discovered table
                <br />
                • Select the column that likely contains the flag
                <br />• Remember to maintain the same number of columns as the original query
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary>
              <Typography level="title-sm">Payload Construction Tips</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography level="body-sm">
                Building your injection payload:
                <br />• Start with <code>'</code> to break out of the original query
                <br />• Use <code>Union/**/SeLECT/**/ ...</code> pattern
                <br />• End with <code>--</code> to comment out the rest
                <br />• Remember: no spaces, mixed case for keywords
              </Typography>
            </AccordionDetails>
          </Accordion>
        </AccordionGroup>
      </CardContent>
    </Card>
  );
}
