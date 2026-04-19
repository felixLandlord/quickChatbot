import { generateText } from "ai";
import { codePrompt, updateDocumentPrompt } from "@/lib/ai/prompts";
import { getLanguageModel } from "@/lib/ai/providers";
import { createDocumentHandler } from "@/lib/artifacts/server";

function stripFences(code: string): string {
  return code
    .replace(/^```[\w]*\n?/, "")
    .replace(/\n?```\s*$/, "")
    .trim();
}

export const codeDocumentHandler = createDocumentHandler<"code">({
  kind: "code",
  onCreateDocument: async ({ title, dataStream, modelId }) => {
    let draftContent = "";

    try {
      const { text } = await generateText({
        model: getLanguageModel(modelId),
        prompt: `${codePrompt}\n\nOutput ONLY the code. No explanations, no markdown fences, no wrapping.\n\nTask: ${title}`,
      });
      draftContent = text;

      dataStream.write({
        type: "data-codeDelta",
        data: stripFences(draftContent),
        transient: true,
      });

      return stripFences(draftContent);
    } catch (error) {
      console.error("Error creating code document:", error);
      throw error;
    }
  },
  onUpdateDocument: async ({ document, description, dataStream, modelId }) => {
    let draftContent = "";

    try {
      const { text } = await generateText({
        model: getLanguageModel(modelId),
        prompt: `${updateDocumentPrompt(document.content, "code")}\n\nTask: ${description}\n\nOutput ONLY the complete updated code. No explanations, no markdown fences, no wrapping.`,
      });
      draftContent = text;

      dataStream.write({
        type: "data-codeDelta",
        data: stripFences(draftContent),
        transient: true,
      });

      return stripFences(draftContent);
    } catch (error) {
      console.error("Error updating code document:", error);
      throw error;
    }
  },
});
