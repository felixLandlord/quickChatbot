import { generateText } from "ai";
import { updateDocumentPrompt } from "@/lib/ai/prompts";
import { getLanguageModel } from "@/lib/ai/providers";
import { createDocumentHandler } from "@/lib/artifacts/server";

export const textDocumentHandler = createDocumentHandler<"text">({
  kind: "text",
  onCreateDocument: async ({ title, dataStream, modelId }) => {
    let draftContent = "";

    try {
      const { text } = await generateText({
        model: getLanguageModel(modelId),
        prompt: `Write about the given topic. Markdown is supported. Use headings wherever appropriate.\n\nTopic: ${title}`,
      });
      draftContent = text;

      dataStream.write({
        type: "data-textDelta",
        data: draftContent,
        transient: true,
      });

      return draftContent;
    } catch (error) {
      console.error("Error creating text document:", error);
      throw error;
    }
  },
  onUpdateDocument: async ({ document, description, dataStream, modelId }) => {
    let draftContent = "";

    try {
      const { text } = await generateText({
        model: getLanguageModel(modelId),
        prompt: `${updateDocumentPrompt(document.content, "text")}\n\nUpdate description: ${description}`,
      });
      draftContent = text;

      dataStream.write({
        type: "data-textDelta",
        data: draftContent,
        transient: true,
      });

      return draftContent;
    } catch (error) {
      console.error("Error updating text document:", error);
      throw error;
    }
  },
});
