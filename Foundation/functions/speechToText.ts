import {Request, Response} from 'express';
export const speechToText = async (req: Request, res: Response) => {
    const data = req.body;
    const audioUrl = data?.audioUrl;
    const audioConfig = data?.config;

    if (!audioUrl) return res.status(422).send("No audio URL was provided.");
    if (!audioConfig) return res.status(422).send("No audio config was provided.");

    try{
        const speechResults = await fetch("https://speech.googleapis.com/v1/speech:recognize", {
            method: "POST",
            body: JSON.stringify({
                audio: {
                    content: audioUrl
                },
                config: audioConfig
            }),
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "X-goog-api-key": `${process.env.GOOGLE_SPEECH_TO_TEXT_API_KEY}`, 
            },
        }).then((response) => response.json());
        console.log({ results: speechResults.results?.[0]?.alternatives?.[0] });
        return res.send(speechResults);
    } catch (e){ 
        console.error("Error converting speech to text: ", e);
        res.status(404).send(e);
        return e;
    }

};