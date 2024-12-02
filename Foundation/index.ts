import express, { Request, Response } from "express";
import cors from "cors";
import { speechToText } from "./functions/speechToText";
import { airportInfoQuery } from "./functions/airportInfo";
import "dotenv/config";


const port = process.env.PORT || 4000;
const server = '0.0.0.0';
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

app.post("/airportInfo", async (req: Request, res: Response) => {
  console.log("Received request to /airportInfo");
  try {
    const { text } = req.body;
    const response = await airportInfoQuery(text);
    res.status(200).json(response);
  } catch (error) {
    console.error("Error in /airportInfo route:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.get("/", (req: Request, res: Response) => {
  res.send("App is running");
});

// Start server
app.listen(4000, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});

// Error handling
app.use((err: any, req: Request, res: Response, next: Function) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});