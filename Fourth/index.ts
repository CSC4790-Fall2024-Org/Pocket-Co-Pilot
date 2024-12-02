import express from "express";
import { Request, Response } from "express-serve-static-core";
import cors from "cors";
import { speechToText } from "./functions/speechToText";
import { airportInfoQuery } from "./functions/airportInfo";
import "dotenv/config";

const port = process.env.PORT || 4000;
const app = express();

interface AirportInfoRequest extends Request {
  body: {
    input: string;
  };
}

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

// Airport Info Route
app.post("/airportInfo", (req: AirportInfoRequest, res: Response): void => {
  console.log("Received request to /airport-info");
  try {
    console.log("Request body:", req.body);
    const { input } = req.body;
    if (input === '') {
      res.json("Please Try again");
      return;
    }
    
    if (!input) {
      res.status(400).json({ error: "Input is required" });
      return;
    }

    airportInfoQuery(input)
      .then((result) => {
        res.json(result);
      })
      .catch((error) => {
        console.error("Error in /airport-info route:", error);
        res.status(500).json({ error: "Internal server error" });
      });
  } catch (error) {
    console.error("Error in /airport-info route:", error);
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

// // New route for airport information
// app.post("/airport-info", async (req: Request, res: Response) => {
//   const { query } = req.body;

//   if (!query) {
//     return res.status(400).json({ error: "Query parameter is required" });
//   }

//   try {
//     const result = await airportInfoQuery(query);
//     return res.json(result);
//   } catch (error) {
//     console.error("Error in /airport-info route:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// });