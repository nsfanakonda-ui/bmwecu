import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { storage } from "./storage";
import { insertFileSchema, insertTutorialSchema } from "@shared/schema";
import { z } from "zod";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = ['.xdf', '.bin', '.a2l'];
    const fileExtension = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf('.'));
    
    if (allowedTypes.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only XDF, BIN, and A2L files are allowed.'));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // File routes
  app.get("/api/files", async (req, res) => {
    try {
      const { model } = req.query;
      const files = model 
        ? await storage.getFilesByModel(model as string)
        : await storage.getFiles();
      res.json(files);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch files" });
    }
  });

  app.post("/api/files", upload.single('file'), async (req: Request & { file?: Express.Multer.File }, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const fileData = {
        originalName: req.file.originalname,
        fileType: req.file.originalname.toLowerCase().substring(req.file.originalname.lastIndexOf('.') + 1),
        bmwModel: req.body.bmwModel,
        motor: req.body.motor,
        description: req.body.description || "",
        fileSize: req.file.size,
      };

      const validatedData = insertFileSchema.parse(fileData);
      const file = await storage.createFile(validatedData, req.file.buffer);
      
      res.status(201).json(file);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid file data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to upload file" });
      }
    }
  });

  app.get("/api/files/:id/download", async (req, res) => {
    try {
      const { id } = req.params;
      const files = await storage.getFiles();
      const file = files.find(f => f.id === id);
      
      if (!file) {
        return res.status(404).json({ message: "File not found" });
      }

      const fileContent = await storage.getFileContent(id);
      if (!fileContent) {
        return res.status(404).json({ message: "File content not found" });
      }

      // Set appropriate headers for file download
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment; filename="${file.originalName}"`);
      res.setHeader('Content-Length', fileContent.length);
      
      res.send(fileContent);
    } catch (error) {
      res.status(500).json({ message: "Failed to download file" });
    }
  });

  app.delete("/api/files/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteFile(id);
      
      if (deleted) {
        res.json({ message: "File deleted successfully" });
      } else {
        res.status(404).json({ message: "File not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete file" });
    }
  });

  // Tutorial routes
  app.get("/api/tutorials", async (req, res) => {
    try {
      const { category } = req.query;
      const tutorials = category
        ? await storage.getTutorialsByCategory(category as string)
        : await storage.getTutorials();
      res.json(tutorials);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tutorials" });
    }
  });

  app.post("/api/tutorials", async (req, res) => {
    try {
      const validatedData = insertTutorialSchema.parse(req.body);
      const tutorial = await storage.createTutorial(validatedData);
      
      res.status(201).json(tutorial);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid tutorial data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create tutorial" });
      }
    }
  });

  app.delete("/api/tutorials/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteTutorial(id);
      
      if (deleted) {
        res.json({ message: "Tutorial deleted successfully" });
      } else {
        res.status(404).json({ message: "Tutorial not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete tutorial" });
    }
  });

  // Export endpoint
  app.get("/api/export", async (req, res) => {
    try {
      const files = await storage.getFiles();
      const tutorials = await storage.getTutorials();
      
      // Create export data structure
      const exportData = {
        exportDate: new Date().toISOString(),
        platform: "BMW ME9.2 Steuergeräte Platform",
        version: "1.0",
        data: {
          files: files.map(file => ({
            id: file.id,
            originalName: file.originalName,
            fileType: file.fileType,
            bmwModel: file.bmwModel,
            motor: file.motor,
            description: file.description,
            fileSize: file.fileSize,
            uploadedAt: file.uploadedAt
          })),
          tutorials: tutorials.map(tutorial => ({
            id: tutorial.id,
            title: tutorial.title,
            youtubeUrl: tutorial.youtubeUrl,
            youtubeId: tutorial.youtubeId,
            category: tutorial.category,
            description: tutorial.description,
            createdAt: tutorial.createdAt
          }))
        },
        statistics: {
          totalFiles: files.length,
          totalTutorials: tutorials.length,
          filesByModel: files.reduce((acc: Record<string, number>, file) => {
            acc[file.bmwModel] = (acc[file.bmwModel] || 0) + 1;
            return acc;
          }, {}),
          tutorialsByCategory: tutorials.reduce((acc: Record<string, number>, tutorial) => {
            acc[tutorial.category] = (acc[tutorial.category] || 0) + 1;
            return acc;
          }, {})
        }
      };

      // Set headers for JSON download
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename="bmw-me9-export.json"');
      
      res.json(exportData);
    } catch (error) {
      res.status(500).json({ message: "Failed to export data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
