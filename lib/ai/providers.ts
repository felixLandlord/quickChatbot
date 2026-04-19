import { customProvider } from "ai";
import { createGroq } from "@ai-sdk/groq";

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

export const myProvider = customProvider({
  languageModels: {
    "llama-3.3-70b-versatile": groq("llama-3.3-70b-versatile"),
    "llama-3.1-8b-instant": groq("llama-3.1-8b-instant"),
    "openai/gpt-oss-120b": groq("openai/gpt-oss-120b"),
    "openai/gpt-oss-20b": groq("openai/gpt-oss-20b"),
    "title-model": groq("llama-3.1-8b-instant"),
  },
});

export function getLanguageModel(modelId: string) {
  return myProvider.languageModel(modelId);
}

export function getTitleModel() {
  return myProvider.languageModel("title-model");
}
