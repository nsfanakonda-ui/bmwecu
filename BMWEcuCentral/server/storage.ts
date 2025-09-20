import { type File, type InsertFile, type Tutorial, type InsertTutorial } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // File operations
  createFile(file: InsertFile, fileBuffer: Buffer): Promise<File>;
  getFiles(): Promise<File[]>;
  getFilesByModel(model: string): Promise<File[]>;
  getFileContent(id: string): Promise<Buffer | null>;
  deleteFile(id: string): Promise<boolean>;

  // Tutorial operations
  createTutorial(tutorial: InsertTutorial): Promise<Tutorial>;
  getTutorials(): Promise<Tutorial[]>;
  getTutorialsByCategory(category: string): Promise<Tutorial[]>;
  deleteTutorial(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private files: Map<string, File>;
  private fileContents: Map<string, Buffer>;
  private tutorials: Map<string, Tutorial>;

  constructor() {
    this.files = new Map();
    this.fileContents = new Map();
    this.tutorials = new Map();
  }

  async createFile(insertFile: InsertFile, fileBuffer: Buffer): Promise<File> {
    const id = randomUUID();
    const filename = `${id}-${insertFile.originalName}`;
    const file: File = {
      ...insertFile,
      id,
      filename,
      uploadedAt: new Date(),
      description: insertFile.description || null,
    };
    this.files.set(id, file);
    this.fileContents.set(id, fileBuffer);
    return file;
  }

  async getFiles(): Promise<File[]> {
    return Array.from(this.files.values()).sort(
      (a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime()
    );
  }

  async getFilesByModel(model: string): Promise<File[]> {
    return Array.from(this.files.values())
      .filter((file) => file.bmwModel === model)
      .sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());
  }

  async getFileContent(id: string): Promise<Buffer | null> {
    return this.fileContents.get(id) || null;
  }

  async deleteFile(id: string): Promise<boolean> {
    const fileDeleted = this.files.delete(id);
    const contentDeleted = this.fileContents.delete(id);
    return fileDeleted;
  }

  async createTutorial(insertTutorial: InsertTutorial): Promise<Tutorial> {
    const id = randomUUID();
    // Extract YouTube ID from URL
    const youtubeIdMatch = insertTutorial.youtubeUrl.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/
    );
    const youtubeId = youtubeIdMatch ? youtubeIdMatch[1] : "";

    const tutorial: Tutorial = {
      ...insertTutorial,
      id,
      youtubeId,
      createdAt: new Date(),
      description: insertTutorial.description || null,
    };
    this.tutorials.set(id, tutorial);
    return tutorial;
  }

  async getTutorials(): Promise<Tutorial[]> {
    return Array.from(this.tutorials.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getTutorialsByCategory(category: string): Promise<Tutorial[]> {
    return Array.from(this.tutorials.values())
      .filter((tutorial) => tutorial.category === category)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async deleteTutorial(id: string): Promise<boolean> {
    return this.tutorials.delete(id);
  }
}

export const storage = new MemStorage();
