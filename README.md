# TypeChat-serge-example - TypeChat with LLaMA

Sentiment example using TypeChat with a self hosted LLM. No API keys required.

## ✅ Requirements

- Node.js version 18 or above
- [Serge](https://github.com/serge-chat/serge) - chat interface crafted with [llama.cpp](https://github.com/ggerganov/llama.cpp)
- Model supported by [llama.cpp](https://github.com/ggerganov/llama.cpp#description)

## ⚡️ Quick start



**Download a model**: e.g. llama-2-13b-chat.ggmlv3.q4_0

```bash
curl -L "https://huggingface.co/TheBloke/Llama-2-13B-chat-GGML/resolve/main/llama-2-13b-chat.ggmlv3.q4_0.bin" --create-dirs -o models/llama-2-13b-chat.ggmlv3.q4_0.bin
```

**Start Serge:** 

```bash
docker-compose up -d
```



## Remarks

 - [llama-node](https://llama-node.vercel.app/docs/start) could be used instead of Serge
