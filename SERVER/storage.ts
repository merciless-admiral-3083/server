import { IStorage } from "./storage";
import session from "express-session";
import createMemoryStore from "memorystore";
import {
  User,
  InsertUser,
  PerformanceMetric,
  InsertPerformanceMetric,
  NutritionLog,
  InsertNutritionLog,
  Injury,
  InsertInjury,
  Finance,
  InsertFinance,
} from "server/schema";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getMetrics(userId: number): Promise<PerformanceMetric[]>;
  createMetric(metric: InsertPerformanceMetric): Promise<PerformanceMetric>;
  
  getNutritionLogs(userId: number): Promise<NutritionLog[]>;
  createNutritionLog(log: InsertNutritionLog): Promise<NutritionLog>;
  
  getInjuries(userId: number): Promise<Injury[]>;
  createInjury(injury: InsertInjury): Promise<Injury>;
  
  getFinances(userId: number): Promise<Finance[]>;
  createFinance(finance: InsertFinance): Promise<Finance>;
  
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private metrics: Map<number, PerformanceMetric[]>;
  private nutritionLogs: Map<number, NutritionLog[]>;
  private injuries: Map<number, Injury[]>;
  private finances: Map<number, Finance[]>;
  sessionStore: session.Store;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.metrics = new Map();
    this.nutritionLogs = new Map();
    this.injuries = new Map();
    this.finances = new Map();
    this.currentId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getMetrics(userId: number): Promise<PerformanceMetric[]> {
    return this.metrics.get(userId) || [];
  }

  async createMetric(metric: InsertPerformanceMetric): Promise<PerformanceMetric> {
    const id = this.currentId++;
    const newMetric = { ...metric, id };
    const userMetrics = this.metrics.get(metric.userId) || [];
    userMetrics.push(newMetric);
    this.metrics.set(metric.userId, userMetrics);
    return newMetric;
  }

  async getNutritionLogs(userId: number): Promise<NutritionLog[]> {
    return this.nutritionLogs.get(userId) || [];
  }

  async createNutritionLog(log: InsertNutritionLog): Promise<NutritionLog> {
    const id = this.currentId++;
    const newLog = { ...log, id };
    const userLogs = this.nutritionLogs.get(log.userId) || [];
    userLogs.push(newLog);
    this.nutritionLogs.set(log.userId, userLogs);
    return newLog;
  }

  async getInjuries(userId: number): Promise<Injury[]> {
    return this.injuries.get(userId) || [];
  }

  async createInjury(injury: InsertInjury): Promise<Injury> {
    const id = this.currentId++;
    const newInjury = { ...injury, id };
    const userInjuries = this.injuries.get(injury.userId) || [];
    userInjuries.push(newInjury);
    this.injuries.set(injury.userId, userInjuries);
    return newInjury;
  }

  async getFinances(userId: number): Promise<Finance[]> {
    return this.finances.get(userId) || [];
  }

  async createFinance(finance: InsertFinance): Promise<Finance> {
    const id = this.currentId++;
    const newFinance = { ...finance, id };
    const userFinances = this.finances.get(finance.userId) || [];
    userFinances.push(newFinance);
    this.finances.set(finance.userId, userFinances);
    return newFinance;
  }
}

export const storage = new MemStorage();
