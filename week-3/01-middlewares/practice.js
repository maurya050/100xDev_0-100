const express = require("express");

const z = require("zod");

const app = express();

const schema = z.number().min(1).max(100);

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(32),
});

// Middleware to log request method and URL
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Middleware to parse JSON bodies
app.use(express.json());

app.get("/check", (req, res) => {
    const {email, password} = req.body;
    const parsed = loginSchema.safeParse({ email, password });

    if (!parsed.success) {
        return res.status(400).json({ error: "Invalid input. Please provide a valid email and password (8-32 characters)." });
    }
    res.send("Hello, World!");
    
});

app.post("/health-check", (req, res) => {

    const kidney = req.body.kidney;
    const parsed = schema.safeParse(kidney);

    if (!parsed.success) {
        return res.status(400).json({ error: "Invalid input. 'kidney' must be a number between 1 and 1000." });
    }

    res.json({ status: "Healthy" });
});

const PORT = process.env.PORT || 3000;


//global catch for errors
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
