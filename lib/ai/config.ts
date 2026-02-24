import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not set");
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const AI_CONFIG = {
  model: "gpt-4o-mini",
  temperature: 0.7,
  maxTokens: 1000,
};
