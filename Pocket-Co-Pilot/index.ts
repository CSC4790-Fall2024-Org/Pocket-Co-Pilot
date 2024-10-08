import express, { Request, Response } from "express";
import cors from "cors";
import { speechToText } from "./functions/speechToText";
import "dotenv/config";

const port = process.env.PORT || 4000;
const app = express();

// Middleware
app.use(cors());  // Enable CORS for all routes
app.use(express.json({ limit: "50mb" }));

// Routes
app.post("/Pocket-Co-Pilot", (req: Request, res: Response) => {
  console.log("Received request to /Pocket-Co-Pilot");
  try {
    speechToText(req, res);
  } catch (error) {
    console.error("Error in /Pocket-Co-Pilot route:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/", (req: Request, res: Response) => {
  res.send("App is running");
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Error handling
app.use((err: any, req: Request, res: Response, next: Function) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});