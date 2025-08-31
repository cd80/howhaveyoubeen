import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

const getQuestionFiltersSchema = z.object({
  mood: z.string().optional(),
  occasion: z.string().optional(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Get random question with optional filters
  app.get("/api/questions/random", async (req, res) => {
    try {
      const filters = getQuestionFiltersSchema.parse(req.query);
      const question = await storage.getRandomQuestion(filters);
      
      if (!question) {
        return res.status(404).json({ message: "No questions found matching the filters" });
      }

      res.json(question);
    } catch (error) {
      res.status(400).json({ message: "Invalid filters provided" });
    }
  });

  // Get all questions with optional filters
  app.get("/api/questions", async (req, res) => {
    try {
      const filters = getQuestionFiltersSchema.parse(req.query);
      const questions = await storage.getQuestions(filters);
      res.json(questions);
    } catch (error) {
      res.status(400).json({ message: "Invalid filters provided" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
