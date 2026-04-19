import { customProvider } from "ai";
import { createGroq } from "@ai-sdk/groq";

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

export const myProvider = customProvider({
  languageModels: {
    "openai/gpt-oss-120b": groq("openai/gpt-oss-120b"),
    "openai/gpt-oss-20b": groq("openai/gpt-oss-20b"),
  },
});

export function getLanguageModel(modelId: string) {
  return myProvider.languageModel(modelId);
}

export function getTitleModel() {
  return myProvider.languageModel("openai/gpt-oss-20b");
}
