import axios from "axios";
import { Result, TypeChatLanguageModel, error, success } from "typechat";

type RetryParams = {
    retryMaxAttempts?: number;
    retryPauseMs?: number;
}

type LlamaConfig = {
    url?: string; 
    model: string;
    maxTokens?: number;
}

export class LlamaLanguageModel implements TypeChatLanguageModel {
    config: LlamaConfig;
    client: axios.AxiosInstance;
    retryMaxAttempts: number;
    retryPauseMs: number;

    constructor(config: LlamaConfig, axiosConfig: object, retryParams: RetryParams | undefined) {
        this.config = config;
        this.client = axios.create(axiosConfig);
        this.retryMaxAttempts = retryParams?.retryPauseMs ?? 3;
        this.retryPauseMs = retryParams?.retryPauseMs ?? 1000;
    }

    async complete(prompt: string): Promise<Result<string>> {
        let retryCount = 0;
        const url = this.config.url ?? "http://localhost:8000/v1/chat/completions";
        
        while(true) {
            const params = {
                max_tokens: this.config.maxTokens ?? 2000,
                model: this.config.model,
                messages: [{ role: "user", content: prompt }],
                temperature: 0,
                n: 1
            };
            const result = await this.client.post(url, params, { validateStatus: status => true });
            if (result.status === 200) {
                return success(result.data.choices[0].message?.content ?? "");
            }
            if (!isTransientHttpError(result.status) || retryCount >= this.retryMaxAttempts) {
                return error(`REST API error ${result.status}: ${result.statusText}`);
            }
            await sleep(this.retryPauseMs);
            retryCount++;
        }

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