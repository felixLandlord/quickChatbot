export const DEFAULT_CHAT_MODEL = "openai/gpt-oss-120b";

export const titleModel = {
  id: "openai/gpt-oss-20b",
  name: "GPT OSS 20B",
  provider: "groq",
  description: "Fast model for title generation",
};

export type ModelCapabilities = {
  tools: boolean;
  vision: boolean;
  reasoning: boolean;
};

export type ChatModel = {
  id: string;
  name: string;
  provider: string;
  description: string;
  reasoningEffort?: "none" | "minimal" | "low" | "medium" | "high";
};

export const chatModels: ChatModel[] = [
  {
    id: "openai/gpt-oss-120b",
    name: "GPT OSS 120B",
    provider: "groq",
    description: "Open-source 120B parameter model with tool use",
  },
  {
    id: "openai/gpt-oss-20b",
    name: "GPT OSS 20B",
    provider: "groq",
    description: "Compact reasoning model",
  },
];

export async function getCapabilities(): Promise<
  Record<string, ModelCapabilities>
> {
  const capabilitiesMap: Record<string, ModelCapabilities> = {};
  
  for (const model of chatModels) {
    capabilitiesMap[model.id] = {
      tools: true,
      vision: false,
      reasoning: false,
    };
  }

  return capabilitiesMap;
}

export const isDemo = process.env.IS_DEMO === "1";

export type GroqModel = {
  id: string;
  name: string;
  type?: string;
  context_window?: number;
};

export type GatewayModelWithCapabilities = ChatModel & {
  capabilities: ModelCapabilities;
};

export async function getAllGatewayModels(): Promise<
  GatewayModelWithCapabilities[]
> {
  return chatModels.map((model) => ({
    ...model,
    capabilities: {
      tools: true,
      vision: false,
      reasoning: false,
    },
  }));
}

export function getActiveModels(): ChatModel[] {
  return chatModels;
}

export const allowedModelIds = new Set(chatModels.map((m) => m.id));

export const modelsByProvider = chatModels.reduce(
  (acc, model) => {
    if (!acc[model.provider]) {
      acc[model.provider] = [];
    }
    acc[model.provider].push(model);
    return acc;
  },
  {} as Record<string, ChatModel[]>
);
