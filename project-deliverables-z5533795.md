# COMP6841 Project Deliverables

Author: Henrick Lin (z5533795)

This project focuses on web application security, specifically SQL injection (SQLi) and XSS (Cross-site scripting). It involves building four practical challenges (with hints) to demonstrate common SQLi and XSS vulnerabilities and bypass techniques. These challenges are designed for educational purposes.

## 1. Background

SQL injection (SQLi) remains one of the most popular and educationally valuable vulnerabilities in web application security. As a core topic in web security and CTF (Capture The Flag) training platforms, it not only introduces students to the concept of input manipulation and query control but also serves as a foundation for more advanced exploitation techniques.

The purpose of this project is to allow users to interact with realistic web applications that contain exploitable SQL injection points and progress through a structured learning experience with the help of "Hints" section in each challenge.


## 2. Existing Work

Many current CTF challenges often lack guided learning elements. Challenges typically present a web page with an input field and expect the user to deduce the vulnerability and exploit it without any contextual assistance. These platforms are designed for experienced players, but for beginners or intermediate learners, this can be intimidating and unproductive.

There is a noticeable gap in **challenge design that balances realism with educational clarity**, such as step-by-step progression, meaningful hints. My project tries to bridge this gap by not only offering functional vulnerable services but also structuring the vulnerability progression by designing **"Hints"** section.

## 3. My Implementation

This project includes the design and development of four challenges (basic SQLi, advanced SQLi, basic XSS, and combination of SQLi and XSS,) using **React (frontend)**, **Node.js with Express (backend)**, and **PostgreSQL (Supabase)** as the database platform.

### 3.1 Easy SQLi

The Easy SQLi challenge simulates a basic login page vulnerable to SQL injection. It uses insecure string concatenation in SQL queries without parameterization and lacks sufficient input sanitization. This allows attackers to bypass authentication by using payloads such as `' OR 1=1--` to force a successful login.

* **Key Features**:

  * SQL logic exposed directly via insecure query concatenation.

![login page](./SQLi1_login.png)
![success page](./SQLi1_success.png)

### 3.2 Advanced SQLi

The Advanced SQLi challenge significantly increases complexity. It mimics a COMP6841 grade-checking interface, where users enter a “key” to retrieve their grades. The back-end is intentionally flawed but protected by a keyword-based WAF that attempts to block common SQL keywords like `select`, `union`, `from`, etc.

#### 3.2.1 Technical Challenges Encountered

**Evolution of Query Design for Realistic SQLi Training:**

**Initial Design (Single-Column Query):**
The backend originally used `SELECT grade FROM users WHERE key = '...'`, returning only one column (`grade`). While this allowed straightforward UNION-based injections (e.g., `UNION SELECT table_name FROM information_schema.tables`), it oversimplified a critical exploitation step: **column count determination**.

**Enhanced Design (Two-Column Query):**
To better emulate real-world attacks, the query was updated to `SELECT id, grade FROM users WHERE key = '...'`. This forces attackers to:
1. Probe column count systematically (e.g., `UNION SELECT NULL, NULL--`).
2. Adapt payloads to match two columns (e.g., `UNION SELECT table_name, NULL FROM information_schema.tables`).

**Why This Matters:**  
- **Realism:** Mirrors actual SQLi workflows where attackers must reverse-engineer query structures.  
- **Pedagogy:** Teaches essential techniques like NULL placeholder usage and type matching.  
- **Defensive Awareness:** Highlights how subtle design choices (e.g., column selection) impact exploitability.  


**WAF Design**: One major hurdle was designing a realistic WAF (Web Application Firewall) that blocks common SQL keywords without being trivially bypassable, but still allowing creative exploitation. In my implementation, I created a simple blacklist that includes both uppercase and lowercase versions of common SQL keywords (e.g., both `"SELECT"` and `"select"`). However, the regular expression used is case-sensitive and does not cover mixed-case keywords (like `UnIoN` or `SeLEct`), so these can still bypass the filter.

Additionally, I also blocks any input containing a space character. This is implemented by checking if the input includes `" "`. As a result, attackers are forced to use alternative techniques such as comment-based or encoded whitespace (e.g., `/**/`) to construct their payloads, further increasing the challenge difficulty and encouraging creative bypass methods.

* **Frontend Output Design**: Initially, I only returned the first query result field (e.g., `data[0].grade`) in the frontend. This caused confusion when users were trying to extract lists of table names or columns because they were expecting to see a list of table names or columns but only saw a single value. I updated the frontend to display all returned rows using `.map()` and `JSON.stringify`.

📌 **\[Insert screenshot: table name extraction / column extraction]**

**Code snippet of WAF filtering logic**

```javascript
const wafKeywords = [
    "SELECT",
    "FROM",
    "UNION",
    "WHERE",
    "OR",
    "AND",
    "JOIN",
    "FLAG",
    "select",
    "from",
    "union",
    "where",
    "or",
    "and",
    "join",
    "flag",
];
const wafPattern = new RegExp(`\\b(${wafKeywords.join("|")})\\b`);

if (wafPattern.test(key) || key.includes(" ")) {
    return res.status(400).json({ error: "Forbidden keyword or space detected" });
}
```


#### 3.2.2 Known Design Compromise

In real production code, keyword filtering would always be lowercase-normalized (`.toLowerCase()`), and likely done through parameterized queries altogether. However, I intentionally left this bypass open to allow intermediate learners to focus on union-based SQLi instead of jumping into `CHR()`-based injection or blind injection.


### 3.3 Stored XSS

At first, I want to make a simple XSS challenge. But I found that it is not easy to make a simple XSS challenge that is not easily bypassable. So I decided to make a stored XSS challenge.

This is the first version of the backend code.

```javascript
// Admin panel for XSS challenge (simulated admin viewing)
app.get("/admin/messages/:id", async (req, res) => {
  const { id } = req.params;
  const sql = `SELECT id, name, message, created_at FROM messages WHERE id = ${id}`;

  try {
    const result = await client.query(sql);

    res.cookie("adminFlag", "CUINSPACE{yoU_ARe_GEnius}", {
      httpOnly: false, // so it can be accessed by JavaScript
      secure: false, // should be true if https
      sameSite: "lax", // More secure than 'none' but less strict than 'strict' which blocks all cross-site requests
    });

    // Return a simple HTML page, directly inserting the message (vulnerable to XSS)
    const message = result.rows.length > 0 ? result.rows[0].message : "No message found";
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Admin Message View</title>
      </head>
      <body>
        <h1>Hi, admin. Please view the message below:</h1>
        <div>${message}</div>
      </body>
      </html>
    `);
  } catch (err) {
    console.error("Error fetching admin messages:", err);
    res.status(500).send("Failed to fetch messages");
  }
});

// Simulate admin bot visiting reported messages
app.post("/report-message", async (req, res) => {
  const { messageId, reason } = req.body;

  console.log(`Message ${messageId} reported for: ${reason}`);

  // Immediately respond to the user
  res.json({
    success: true,
    message: "Message reported successfully. An admin will review it shortly.",
  });

  // Simulate admin bot delay and then visit admin panel
  setTimeout(async () => {
    try {
      console.log(`Admin bot is reviewing message ${messageId}...`);

      const axios = require("axios");

      try {
        const response = await axios.get(`http://localhost:1314/admin/messages/${messageId}`, {
          headers: {
            Cookie: "adminSession=admin_session_token",
          },
        });

        console.log(response.data);
      } catch (adminError) {
        console.error("Admin bot failed to access admin panel:", adminError.message);
      }
    } catch (err) {
      console.error("Admin bot error:", err);
    }
  }, 2000);
});
```

XSS cannot be triggered by making a server-side HTTP request (like using axios or curl) because these tools only fetch the raw HTML. They do not parse or execute any js in the page.
XSS attacks require a real browser to load the page and run the injected JavaScript code.
Only browsers (or browser automation tools like Puppeteer) will actually execute the script and trigger the XSS payload.
So, server-side requests will never execute the attacker's js. So I need to use a real browser to simulate the admin viewing:
Here is my updated report-message route:

```javascript
app.get("/admin/messages/:id", async (req, res) => {
  const { id } = req.params;
  const sql = `SELECT id, name, message, created_at FROM messages WHERE id = ${id}`;

  try {
    const result = await client.query(sql);

    res.cookie("adminFlag", "CUINSPACE{yoU_ARe_GEnius}", {
      httpOnly: false, // so it can be accessed by JavaScript
      secure: false, // should be true if https
      sameSite: "lax", // More secure than 'none' but less strict than 'strict' which blocks all cross-site requests
    });

    // Return a simple HTML page, directly inserting the message (vulnerable to XSS)
    const message = result.rows.length > 0 ? result.rows[0].message : "No message found";
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Admin Message View</title>
      </head>
      <body>
        <h1>Hi, admin. Please view the message below:</h1>
        <div>${message}</div>
      </body>
      </html>
    `);
  } catch (err) {
    console.error("Error fetching admin messages:", err);
    res.status(500).send("Failed to fetch messages");
  }
});

app.post("/report-message", async (req, res) => {
  const { messageId, reason } = req.body;

  console.log(`Message ${messageId} reported for: ${reason}`);

  res.json({
    success: true,
    message: "Message reported successfully. An admin will review it shortly.",
  });

  // Simulate admin viewing with real browser
  setTimeout(async () => {
    try {
      console.log(`Admin bot is reviewing message ${messageId}...`);

      // Launch headless browser to simulate admin viewing
      const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", // local path to chrome
      });
      const page = await browser.newPage();

      await page.goto(`http://localhost:1314/admin/messages/${messageId}`);

      await page.evaluate(() => {
        document.cookie = "adminSession=admin_session_token";
      });

      // Wait for any scripts to execute
      await new Promise((resolve) => setTimeout(resolve, 10000));

      console.log("Admin bot finished reviewing messages");

      await browser.close();
    } catch (err) {
      console.error("Admin bot error:", err);
    }
  }, 2000);
});
```



```javascript
<Card variant="outlined">
    <CardContent>
    <Typography level="h3" sx={{ mb: 3 }}>
        Recent Messages ({messages.length})
    </Typography>

    {messages.length === 0 ? (
        <Typography level="body-lg" color="neutral" sx={{ textAlign: "center", py: 4 }}>
        No messages yet. Be the first to leave a message!
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
```

## 4. Findings and Reflections

### What I Learned

* **Balancing Realism and Pedagogy**: One key insight from this project is that designing a security challenge is not just about inserting a vulnerability—it's about tuning the difficulty curve. I had to carefully balance realism with learnability.

* **PostgreSQL-Specific Payloads**: I deepened my understanding of how PostgreSQL differs from other databases in SQLi scenarios, particularly with catalog access and function behavior.

* **WAF Behavior and Testing**: Even simple WAF logic has edge cases. Through testing, I learned how easily a poorly designed blacklist can be bypassed, and how to shape one that provides just enough defense to force learners to try harder.

### Limitations

* The current WAF is still bypassable with techniques like `CHR()`-based payloads or blind injection timing if someone goes further.
* The `value` field storing the flag is exposed directly; future versions might use delayed access logic, timing-based hints, or require multi-step auth/token chaining.
* In the XSS challenge, there is a report button in "My Messages" page which does not make sense in a real-world application. But the report button is a way to reduce the server-side workload. If I want to make it more realistic, I can make a bot that view the message like every 30 seconds.

### Future Work


## 5. Appendices




## 6. References

* PostgreSQL System Catalog Reference: [https://www.postgresql.org/docs/current/catalogs.html](https://www.postgresql.org/docs/current/catalogs.html)
* Puppeteer Documentation: [https://pptr.dev/guides/browser-management](https://pptr.dev/guides/browser-management)
* PayloadsAllTheThings: [https://github.com/swisskyrepo/PayloadsAllTheThings](https://github.com/swisskyrepo/PayloadsAllTheThings)
* Supabase Documentation: [https://supabase.com/docs](https://supabase.com/docs)
* Joy UI Documentation: [https://mui.com/joy-ui/getting-started/](https://mui.com/joy-ui/getting-started/)



