import { writeFile } from "node:fs/promises";
import matter from "gray-matter";
import { query } from "@anthropic-ai/claude-agent-sdk";
import { guides, categories } from "../sidebar.guides.js";
import {
  projectDir,
  findMarkdownFile,
  extractDocsFromNavigation,
} from "./sidebar-utils.js";

interface FrontmatterUpdate {
  title?: string;
  description?: string;
  tags?: string[];
}

async function generateFrontmatter(
  content: string,
  existingFrontmatter: any,
): Promise<FrontmatterUpdate> {
  const missingFields: string[] = [];
  if (!existingFrontmatter.title) missingFields.push("title");
  if (!existingFrontmatter.description) missingFields.push("description");
  if (
    !existingFrontmatter.tags ||
    !Array.isArray(existingFrontmatter.tags) ||
    existingFrontmatter.tags.length === 0
  ) {
    missingFields.push("tags");
  }

  if (missingFields.length === 0) {
    return {};
  }

  console.log(`  Generating: ${missingFields.join(", ")}`);

  const prompt = `You are analyzing a technical documentation article to generate frontmatter metadata.

CONTENT TO ANALYZE:
${content.slice(0, 3000)}

EXISTING FRONTMATTER:
${JSON.stringify(existingFrontmatter, null, 2)}

AVAILABLE CATEGORIES FOR TAGS:
${categories.map((cat) => `Label: ${cat.label} Slug: ${cat.slug}`).join(", ")}

INSTRUCTIONS:
Generate the missing frontmatter fields:
${missingFields.includes("title") ? "- title: A clear, concise title (max 60 characters)" : ""}
${missingFields.includes("description") ? "- description: A brief description of what the article covers (max 160 characters, should start with a verb like 'Learn how to...')" : ""}
${missingFields.includes("tags") ? "- tags: An array of 1-3 relevant categories from the AVAILABLE CATEGORIES list above - use the slug here" : ""}

Return ONLY a valid JSON object with the missing fields. Example:
{
  "title": "Example Title",
  "description": "Learn how to implement this feature.",
  "tags": ["slug-1", "slug-2"]
}`;

  // Use Claude Agent SDK to generate frontmatter
  const result = query({
    prompt,
    options: {
      model: "claude-sonnet-4-20250514",
      cwd: projectDir,
    },
  });

  let responseText = "";
  const debugMode = process.env.DEBUG === "true";

  for await (const message of result) {
    if (debugMode) {
      console.log("Message type:", message.type);
      console.log("Message keys:", Object.keys(message));
    }

    // Agent SDK returns assistant messages with a 'message' property
    if (message.type === "assistant" && "message" in message) {
      const msg = message.message as any;
      if (debugMode) {
        console.log("Assistant message structure:", Object.keys(msg));
      }

      // Extract text from content blocks
      if (msg.content && Array.isArray(msg.content)) {
        for (const block of msg.content) {
          if (block.type === "text" && block.text) {
            responseText += block.text;
          }
        }
      }
    }
  }

  if (debugMode) {
    console.log("Full response:", responseText);
  }

  // Extract JSON from response (handle code blocks and plain JSON)
  let jsonMatch = responseText.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
  if (!jsonMatch) {
    jsonMatch = responseText.match(/\{[\s\S]*\}/);
  }

  if (!jsonMatch) {
    console.error("Response text:", responseText.slice(0, 500));
    throw new Error("Failed to extract JSON from Claude response");
  }

  const jsonString = jsonMatch[1] || jsonMatch[0];
  const generated = JSON.parse(jsonString);

  // Only return fields that were actually missing
  const updateResult: FrontmatterUpdate = {};
  if (missingFields.includes("title") && generated.title) {
    updateResult.title = generated.title;
  }
  if (missingFields.includes("description") && generated.description) {
    updateResult.description = generated.description;
  }
  if (missingFields.includes("tags") && generated.tags) {
    updateResult.tags = generated.tags;
  }

  return updateResult;
}

async function processGuide(guidePath: string): Promise<boolean> {
  console.log(`\nProcessing: ${guidePath}`);

  const file = await findMarkdownFile(guidePath);

  if (!file) {
    console.log(`  ⚠️  File not found`);
    return false;
  }

  const { content, path: actualPath } = file;

  const parsed = matter(content);
  const { data: frontmatter, content: markdownContent } = parsed;

  // Check what's missing
  const needsTitle = !frontmatter.title;
  const needsDescription = !frontmatter.description;
  const needsTags =
    !frontmatter.tags ||
    !Array.isArray(frontmatter.tags) ||
    frontmatter.tags.length === 0;

  if (!needsTitle && !needsDescription && !needsTags) {
    console.log(`  ✅ Already has all required fields`);
    return false;
  }

  // Generate missing frontmatter
  const updates = await generateFrontmatter(markdownContent, frontmatter);

  if (Object.keys(updates).length === 0) {
    console.log(`  ⚠️  No updates generated`);
    return false;
  }

  // Merge updates into existing frontmatter
  const updatedFrontmatter = {
    ...frontmatter,
    ...updates,
  };

  // Reconstruct the file with updated frontmatter
  const updatedContent = matter.stringify(markdownContent, updatedFrontmatter);

  // Write the updated file
  await writeFile(actualPath, updatedContent);

  console.log(`  ✅ Updated with:`);
  if (updates.title) console.log(`     - title: ${updates.title}`);
  if (updates.description)
    console.log(`     - description: ${updates.description}`);
  if (updates.tags) console.log(`     - tags: ${updates.tags.join(", ")}`);

  return true;
}

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error(
      "❌ Error: ANTHROPIC_API_KEY environment variable is required",
    );
    console.error("   Set it with: export ANTHROPIC_API_KEY=your-api-key-here");
    process.exit(1);
  }

  const guidePaths = extractDocsFromNavigation(guides);
  console.log(`Processing ${guidePaths.length} guides...\n`);

  let updatedCount = 0;
  let errorCount = 0;

  for (const guidePath of guidePaths) {
    try {
      const wasUpdated = await processGuide(guidePath);
      if (wasUpdated) {
        updatedCount++;
      }
    } catch (error) {
      console.error(
        `  ❌ Error: ${error instanceof Error ? error.message : String(error)}`,
      );
      errorCount++;
    }
  }

  console.log(`\n${"=".repeat(60)}`);
  console.log(`✅ Updated: ${updatedCount} files`);
  if (errorCount > 0) {
    console.log(`❌ Errors: ${errorCount} files`);
  }
  console.log(`${"=".repeat(60)}`);
}

main().catch(console.error);
