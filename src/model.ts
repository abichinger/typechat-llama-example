import axios from "axios";
import { Result, TypeChatLanguageModel, error, success } from "typechat";

type RetryParams = {
    retryMaxAttempts?: number;
    retryPauseMs?: number;
}

type SergeConfig = {
    host?: string; 
    model: string;
    initPrompt?: string;
}

export class SergeLanguageModel implements TypeChatLanguageModel {
    config: SergeConfig;
    client: axios.AxiosInstance;
    retryMaxAttempts: number;
    retryPauseMs: number;

    constructor(config: SergeConfig, axiosConfig: object, retryParams: RetryParams | undefined) {
        this.config = config;
        this.client = axios.create(axiosConfig);
        this.retryMaxAttempts = retryParams?.retryPauseMs ?? 3;
        this.retryPauseMs = retryParams?.retryPauseMs ?? 1000;
    }

    async complete(prompt: string): Promise<Result<string>> {
        let retryCount = 0;
        
        while(true) {
            const result = await this.chat(prompt);
            if (result.status === 200) {
                const data = JSON.parse(result.data);
                return success(data.choices[0].text ?? "");
            }
            if (!isTransientHttpError(result.status) || retryCount >= this.retryMaxAttempts) {
                return error(`REST API error ${result.status}: ${result.statusText}`);
            }
            await sleep(this.retryPauseMs);
            retryCount++;
        }

    }

    async chat(prompt: string): Promise<axios.AxiosResponse> {
        const host = this.config.host ?? 'http://localhost:8008';
        const chatParams = {
            model: this.config.model,
            init_prompt: this.config.initPrompt ?? "",
        };
        const params = {
            prompt: prompt,
        }

        // create chat
        const chatRes = await this.client.post(`${host}/api/chat`, null, {params: chatParams});
        if(chatRes.status !== 200) {
            return chatRes;
        }
        const chatId = chatRes.data;
        console.log(chatId)

        // ask question
        const result = await this.client.post(`${host}/api/chat/${chatId}/question`, null, {params: params});
        console.log(result.data)

        // delete chat
        // this.client.delete(`${host}/api/${chatId}`);
        return result;
    }
}

/**
 * Returns true of the given HTTP status code represents a transient error.
 */
function isTransientHttpError(code: number): boolean {
    switch (code) {
        case 429: // TooManyRequests
        case 500: // InternalServerError
        case 502: // BadGateway
        case 503: // ServiceUnavailable
        case 504: // GatewayTimeout
            return true;
    }
    return false;
}

/**
 * Sleeps for the given number of milliseconds.
 */
function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}