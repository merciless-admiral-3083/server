import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { getAiCoachAdvice, analyzePerformanceData, generateTrainingPlan, analyzeNutrition } from "./openai";
import { z } from "zod";
import {
  insertPerformanceMetricSchema,
  insertNutritionLogSchema,
  insertInjurySchema,
  insertFinanceSchema,
} from "./schema";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Performance Metrics
  app.get("/api/metrics/:userId", async (req, res) => {
    const metrics = await storage.getMetrics(parseInt(req.params.userId));
    res.json(metrics);
  });
  
  // Additional endpoint that uses the logged-in user's ID
  app.get("/api/metrics", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const metrics = await storage.getMetrics(req.user.id);
    res.json(metrics);
  });

  app.post("/api/metrics", async (req, res) => {
    const data = {
      ...insertPerformanceMetricSchema.parse(req.body),
      notes: req.body.notes || null
    };
    const metric = await storage.createMetric(data);
    res.status(201).json(metric);
  });

  // Nutrition Logs
  app.get("/api/nutrition/:userId", async (req, res) => {
    const logs = await storage.getNutritionLogs(parseInt(req.params.userId));
    res.json(logs);
  });
  
  // Additional endpoint that uses the logged-in user's ID
  app.get("/api/nutrition", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const logs = await storage.getNutritionLogs(req.user.id);
    res.json(logs);
  });

  app.post("/api/nutrition", async (req, res) => {
    const data = {
      ...insertNutritionLogSchema.parse(req.body),
      notes: req.body.notes || null,
      calories: req.body.calories || null,
      protein: req.body.protein || null
    };
    const log = await storage.createNutritionLog(data);
    res.status(201).json(log);
  });

  // Injuries
  app.get("/api/injuries/:userId", async (req, res) => {
    const injuries = await storage.getInjuries(parseInt(req.params.userId));
    res.json(injuries);
  });
  
  // Additional endpoint that uses the logged-in user's ID
  app.get("/api/injuries", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const injuries = await storage.getInjuries(req.user.id);
    res.json(injuries);
  });

  app.post("/api/injuries", async (req, res) => {
    const data = {
      ...insertInjurySchema.parse(req.body),
      notes: req.body.notes || null
    };
    const injury = await storage.createInjury(data);
    res.status(201).json(injury);
  });

  // Finances
  app.get("/api/finances/:userId", async (req, res) => {
    const finances = await storage.getFinances(parseInt(req.params.userId));
    res.json(finances);
  });
  
  // Additional endpoint that uses the logged-in user's ID
  app.get("/api/finances", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const finances = await storage.getFinances(req.user.id);
    res.json(finances);
  });

  app.post("/api/finances", async (req, res) => {
    const data = {
      ...insertFinanceSchema.parse(req.body),
      description: req.body.description || null
    };
    const finance = await storage.createFinance(data);
    res.status(201).json(finance);
  });

  // AI Coach
  app.post("/api/ai-coach/advice", async (req, res) => {
    try {
      const { question, context } = req.body;
      
      const advice = await getAiCoachAdvice(question, context);
      res.json(advice);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/ai-coach/analyze-performance", async (req, res) => {
    try {
      const { metrics, goals } = req.body;
      
      const analysis = await analyzePerformanceData({ metrics, goals });
      res.json(analysis);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/ai-coach/training-plan", async (req, res) => {
    try {
      const { level, goals, constraints } = req.body;
      
      const plan = await generateTrainingPlan({ level, goals, constraints });
      res.json(plan);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Nutrition Analysis
  app.post("/api/nutrition/analyze", async (req, res) => {
    try {
      const { foodItems } = req.body;
      
      if (!foodItems || typeof foodItems !== 'string' || foodItems.trim() === '') {
        return res.status(400).json({ message: "Food items are required" });
      }
      
      const nutritionInfo = await analyzeNutrition(foodItems);
      res.json(nutritionInfo);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
