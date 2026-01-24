import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";

const app = express();
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
    }
  });

  next();
});

import { writeFileSync } from "fs";

(async () => {
  try {
    await registerRoutes(httpServer, app);

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
      throw err;
    });

    if (process.env.NODE_ENV === "production") {
      serveStatic(app);
    } else {
      const { setupVite } = await import("./vite");
      await setupVite(httpServer, app);
    }

    const portInput = process.env.PORT || "5000";
    // Passenger peut envoyer un chemin de socket au lieu d'un numéro de port
    const isSocket = isNaN(Number(portInput));

    if (isSocket) {
      httpServer.listen(portInput, () => {
        log(`serving on passenger socket: ${portInput}`);
      });
    } else {
      const port = parseInt(portInput, 10);
      httpServer.listen(port, "0.0.0.0", () => {
        log(`serving on port ${port}`);
      });
    }
  } catch (error: any) {
    // En cas de crash au démarrage sur cPanel, on écrit l'erreur dans un fichier
    const errorLog = `${new Date().toISOString()} SCARTUP ERROR: ${error.message}\n${error.stack}`;
    console.error(errorLog);
    if (process.env.NODE_ENV === "production") {
      writeFileSync("startup_error.log", errorLog);
    }
    process.exit(1);
  }
})();
