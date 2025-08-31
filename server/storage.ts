import { type User, type InsertUser, type Question, type InsertQuestion } from "@shared/schema";
import { randomUUID } from "crypto";
import { readFileSync } from "fs";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getQuestions(filters?: { mood?: string; occasion?: string }): Promise<Question[]>;
  getRandomQuestion(filters?: { mood?: string; occasion?: string }): Promise<Question | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private questions: Question[];

  constructor() {
    this.users = new Map();
    this.questions = this.initializeQuestions();
  }

  private initializeQuestions(): Question[] {
    const data = readFileSync(new URL("./questions.json", import.meta.url), "utf-8");
    return JSON.parse(data) as Question[];
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getQuestions(filters?: { mood?: string; occasion?: string }): Promise<Question[]> {
    let filteredQuestions = this.questions;

    if (filters?.mood) {
      filteredQuestions = filteredQuestions.filter(q => q.mood === filters.mood);
    }

    if (filters?.occasion) {
      filteredQuestions = filteredQuestions.filter(q => q.occasion === filters.occasion);
    }

    return filteredQuestions;
  }

  async getRandomQuestion(filters?: { mood?: string; occasion?: string }): Promise<Question | undefined> {
    const availableQuestions = await this.getQuestions(filters);

    if (availableQuestions.length === 0) {
      return undefined;
    }

    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    return availableQuestions[randomIndex];
  }
}

export const storage = new MemStorage();

