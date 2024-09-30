import express from "express";
import { speechToText } from "./functions/speechToText";
import "dotenv/config";
const port = process.env.PORT || 4000;
const app = express();
app.use(
    express.json({
    limit: "50mb",
    })
);
app.post("/speech-to-text", (req: Request, res: Response) => {
    speechToText(req, res);
});

app.get("/,", (req, res) => {
    res.send("App is running")
});

app.listen(port, () => {
    console.log(`Server is runnig on port ${port}`);
});