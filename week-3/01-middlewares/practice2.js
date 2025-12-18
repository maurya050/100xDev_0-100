const zod = require("zod");
const express = require("express");

const app = express();


const validateInput = zod.object({
    name : zod.string().min(3).max(50),
    age: zod.number().min(10).max(100),
    email: zod.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"),
})

app.use(express.json());

app.post("/validate", (req, res) => {
    const parsed = validateInput.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).json({ error: "Invalid input", details: parsed.error.errors });
    }

    res.json({ message: "Input is valid", data: parsed.data });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 