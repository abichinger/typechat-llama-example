import fs from "fs";
import path from "path";

import { createJsonTranslator, processRequests } from "typechat";
import { LlamaLanguageModel } from "./model";
import { SentimentResponse } from "./schema";

// const model = createOpenAILanguageModel("", "", "http://localhost:8000/v1/chat/completions");
const model = new LlamaLanguageModel({model: ""}, {}, undefined);
const schema = fs.readFileSync(path.join(__dirname, "../src/schema.ts"), "utf8");
const translator = createJsonTranslator<SentimentResponse>(model, schema, "SentimentResponse");

// Process requests interactively or from the input file specified on the command line
processRequests("🦙> ", process.argv[2], async (request) => {
    const response = await translator.translate(request);
    if (!response.success) {
        console.log(response.message);
        return;
    }
    console.log(`The sentiment is ${response.data.sentiment}`);
});