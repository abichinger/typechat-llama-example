import fs from "fs";
import path from "path";

import { createJsonTranslator, processRequests } from "typechat";
import { SergeLanguageModel } from "./model";
import { SentimentResponse } from "./schema";

const model = new SergeLanguageModel({model: "llama-2-13b-chat.ggmlv3.q4_0"}, {}, undefined);
const schema = fs.readFileSync(path.join(__dirname, "../src/schema.ts"), "utf8");
const translator = createJsonTranslator<SentimentResponse>(model, schema, "SentimentResponse");

// Process requests interactively or from the input file specified on the command line
processRequests("😀> ", process.argv[2], async (request) => {
    const response = await translator.translate(request);
    if (!response.success) {
        console.log(response.message);
        return;
    }
    console.log(`The sentiment is ${response.data.sentiment}`);
});