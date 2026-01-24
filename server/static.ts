import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  let distPath = path.resolve(__dirname, "public");

  if (!fs.existsSync(distPath)) {
    // Si le dossier public n'existe pas, on cherche à la racine (structure plate cPanel)
    distPath = __dirname;
  }

  app.use(express.static(distPath, {
    index: false // On gère l'index manuellement pour éviter les conflits
  }));

  // fall through to index.html if the file doesn't exist
  app.use("*", (req, res, next) => {
    // Si c'est une requête API, on laisse passer
    if (req.path.startsWith('/api')) {
      return next();
    }

    const indexPath = path.resolve(distPath, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send("Site en cours de maintenance (Fichiers manquants)");
    }
  });
}
