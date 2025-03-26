import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

type AiCoachResponse = {
  advice: string;
  suggestedActions: string[];
  confidence: number;
};

export async function getAiCoachAdvice(
  question: string,
  context?: {
    performanceHistory?: string;
    nutritionLogs?: string;
    injuries?: string;
  }
): Promise<AiCoachResponse> {
  try {
    const prompt = `You are an expert AI sports coach and athletic advisor. Provide specific, actionable advice based on the athlete's question and context.

Question: ${question}
${context ? `Context:
Performance History: ${context.performanceHistory}
Nutrition Logs: ${context.nutritionLogs}
Injury History: ${context.injuries}` : ''}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const content = response.text();

    return JSON.parse(content);
  } catch (error) {
    throw new Error(`AI Coach error: ${error.message}`);
  }
}

export async function analyzePerformanceData(data: {
  metrics: any[];
  goals: string;
}): Promise<{
  analysis: string;
  recommendations: string[];
}> {
  try {
    const prompt = `You are an expert sports performance analyst. Analyze the athlete's performance data and provide insights and recommendations.

Performance Data: ${JSON.stringify(data.metrics)}
Athlete Goals: ${data.goals}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return JSON.parse(response.text());
  } catch (error) {
    throw new Error(`Performance analysis error: ${error.message}`);
  }
}

export async function generateTrainingPlan(params: {
  level: string;
  goals: string;
  constraints: string[];
}): Promise<{
  plan: string;
  schedule: any;
  guidelines: string[];
}> {
  try {
    const prompt = `You are an expert sports trainer. Create a personalized training plan based on the athlete's level, goals, and constraints.

Level: ${params.level}
Goals: ${params.goals}
Constraints: ${params.constraints.join(", ")}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return JSON.parse(response.text());
  } catch (error) {
    throw new Error(`Training plan generation error: ${error.message}`);
  }
}

export async function analyzeNutrition(foodItems: string): Promise<{
  calories: number;
  protein: number;
  confidence: number;
}> {
  try {
    const prompt = `You are an expert nutritionist. Analyze these food items and estimate their nutritional content. Return a JSON with calories (number), protein (grams, number), and confidence (0-1).

Food Items: ${foodItems}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const parsed = JSON.parse(response.text());

    return {
      calories: Math.max(0, Math.round(parsed.calories)),
      protein: Math.max(0, Math.round(parsed.protein)),
      confidence: Math.min(1, Math.max(0, parsed.confidence))
    };
  } catch (error) {
    throw new Error(`Nutrition analysis error: ${error.message}`);
  }
}