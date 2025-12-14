const zod = require("zod");
const express = require("express");

const app = express();


const validateInput = (obj) => {
    const schema = zod.object({
        name: zod.string().min(3),
        age: zod.number().min(0).max(120),
        email: zod.string().email(),
    });

    return schema.safeParse(obj);
}

app.use(express.json());

app.post("/validate", (req, res) => {
    const parsed = validateInput(req.body);

    if (!parsed.success) {
        return res.status(400).json({ error: "Invalid input", details: parsed.error.errors });
    }

    res.json({ message: "Input is valid", data: parsed.data });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 