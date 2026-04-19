import { generateText } from "ai";
import type { Session } from "next-auth";
import { z } from "zod";
import { getDocumentById } from "@/lib/db/queries";
import { getLanguageModel } from "../providers";

type RequestSuggestionsProps = {
  session: Session;
  modelId: string;
};

export const requestSuggestions = ({
  session,
  modelId,
}: RequestSuggestionsProps) => ({
  description:
    "Request writing suggestions for an existing document artifact. Only use this when the user explicitly asks to improve or get suggestions for a document they have already created. Never use for general questions.",
  parameters: z.object({
    documentId: z
      .string()
      .describe(
        "The UUID of an existing document artifact that was previously created with createDocument"
      ),
  }),
  execute: async ({ documentId }: { documentId: string }) => {
    const document = await getDocumentById({ id: documentId });

    if (!document || !document.content) {
      return {
        error: "Document not found",
      };
    }

    if (document.userId !== session.user?.id) {
      return { error: "Forbidden" };
    }

    try {
      const { text } = await generateText({
        model: getLanguageModel(modelId),
        prompt: `You are a writing assistant. Given a piece of writing, offer up to 5 suggestions to improve it. Each suggestion must contain full sentences, not just individual words. Describe what changed and why.\n\nDocument content:\n${document.content}`,
      });

      return {
        suggestions: text,
      };
    } catch (error) {
      console.error("Error getting suggestions:", error);
      return {
        error: "Failed to generate suggestions",
      };
    }
  },
});
