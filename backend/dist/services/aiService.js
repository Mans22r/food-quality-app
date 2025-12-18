"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluateReport = exports.generateReportSummary = void 0;
const openai_1 = __importDefault(require("openai"));
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
const generateReportSummary = async (reportData) => {
    try {
        const prompt = `
      You are a food quality inspection assistant. Summarize the following inspection report into a concise paragraph highlighting key issues and good practices.
      
      Report Data:
      ${JSON.stringify(reportData, null, 2)}
    `;
        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-4-turbo",
        });
        return completion.choices[0].message.content || "No summary available.";
    }
    catch (error) {
        console.error("AI Summary generation failed:", error);
        return "AI Summary unavailable due to an error.";
    }
};
exports.generateReportSummary = generateReportSummary;
const evaluateReport = async (reportData) => {
    try {
        const prompt = `
      Evaluate the overall food quality based on the inspection report below. Return ONLY one of the following words: GOOD, AVERAGE, POOR.
      
      Report Data:
      ${JSON.stringify(reportData, null, 2)}
    `;
        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-4-turbo",
            temperature: 0,
        });
        const result = completion.choices[0].message.content?.trim().toUpperCase();
        if (result === "GOOD" || result === "AVERAGE" || result === "POOR") {
            return result;
        }
        return "AVERAGE"; // Default fallback
    }
    catch (error) {
        console.error("AI Evaluation failed:", error);
        return "AVERAGE";
    }
};
exports.evaluateReport = evaluateReport;
