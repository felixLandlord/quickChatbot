import { generateText } from "ai";
import { sheetPrompt, updateDocumentPrompt } from "@/lib/ai/prompts";
import { getLanguageModel } from "@/lib/ai/providers";
import { createDocumentHandler } from "@/lib/artifacts/server";

export const sheetDocumentHandler = createDocumentHandler<"sheet">({
  kind: "sheet",
  onCreateDocument: async ({ title, dataStream, modelId }) => {
    let draftContent = "";

    try {
      const { text } = await generateText({
        model: getLanguageModel(modelId),
        prompt: `${sheetPrompt}\n\nTask: ${title}\n\nOutput ONLY the raw CSV data. No explanations, no markdown fences.`,
      });
      draftContent = text;

      dataStream.write({
        type: "data-sheetDelta",
        data: draftContent,
        transient: true,
      });

      return draftContent;
    } catch (error) {
      console.error("Error creating sheet document:", error);
      throw error;
    }
  },
  onUpdateDocument: async ({ document, description, dataStream, modelId }) => {
    let draftContent = "";

    try {
      const { text } = await generateText({
        model: getLanguageModel(modelId),
        prompt: `${updateDocumentPrompt(document.content, "sheet")}\n\nTask: ${description}\n\nOutput ONLY the raw CSV data. No explanations, no markdown fences.`,
      });
      draftContent = text;

      dataStream.write({
        type: "data-sheetDelta",
        data: draftContent,
        transient: true,
      });

      return draftContent;
    } catch (error) {
      console.error("Error updating sheet document:", error);
      throw error;
    }
  },
});
