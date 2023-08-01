# TypeChat-llama-example - TypeChat with LLaMA

Sentiment example using TypeChat with a self hosted LLM. No API keys required.

## ✅ Requirements

- Node.js version 18 or above
- [llama-cpp-python](https://github.com/abetlen/llama-cpp-python#web-server) web server
- Model supported by [llama.cpp](https://github.com/ggerganov/llama.cpp#description)

## ⚡️ Quick start

**Download a model**: e.g. llama-2-13b-chat.ggmlv3.q4_0

```bash
curl -L "https://huggingface.co/TheBloke/Llama-2-13B-chat-GGML/resolve/main/llama-2-13b-chat.ggmlv3.q4_0.bin" --create-dirs -o models/llama-2-13b-chat.ggmlv3.q4_0.bin
```

**Start llama-cpp web server:** 

```bash
docker-compose up -d
```

**Run the example:**

```bash
yarn install
yarn start
```

## Notes

 - [llama-node](https://llama-node.vercel.app/docs/start) could be used instead of the web server

 ## Used software components

 - This example is a modified version of the TypeChat [sentiment example](https://github.com/microsoft/TypeChat/tree/main/examples/sentiment) 
 <br /> Copyright (c) Microsoft Corporation - [MIT License](https://github.com/microsoft/TypeChat/blob/main/LICENSE)
 - [llama-cpp-python](https://github.com/abetlen/llama-cpp-python)
 <br /> Copyright (c) 2023 Andrei Betlen - [MIT License](https://github.com/abetlen/llama-cpp-python/blob/main/LICENSE.md)
