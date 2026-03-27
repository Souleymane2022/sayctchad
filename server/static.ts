import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { storage } from "./storage";

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  // Helper for dynamic SEO injection
  const serveIndexWithSEO = async (req: any, res: any) => {
    const indexPath = path.resolve(distPath, "index.html");
    let html = fs.readFileSync(indexPath, "utf8");

    try {
      let title = "SAYC Tchad - Smart Africa Youth Chapter";
      let description = "7ème chapitre jeunesse de Smart Africa au Tchad.";
      let imageUrl = "https://sayctchad.org/images/og-image.png";

      const { path: reqPath, params } = req;
      const id = params.id;

      if (reqPath.startsWith("/opportunites/")) {
        const item = await storage.getOpportunityById(id);
        if (item) {
          title = `${item.title} | Opportunité SAYC Tchad`;
          description = item.description.substring(0, 160);
          if (item.imageUrl) imageUrl = item.imageUrl;
        }
      } else if (reqPath.startsWith("/formations/")) {
        const item = await storage.getTrainingById(id);
        if (item) {
          title = `${item.title} | Formation SAYC Tchad`;
          description = item.description.substring(0, 160);
          if (item.imageUrl) imageUrl = item.imageUrl;
        }
      } else if (reqPath.startsWith("/evenements/")) {
        const item = await storage.getEventById(id);
        if (item) {
          title = `${item.title} | Événement SAYC Tchad`;
          description = item.description.substring(0, 160);
          if (item.imageUrl) imageUrl = item.imageUrl;
        }
      }

      // Replace Title
      html = html.replace(/<title>.*?<\/title>/i, `<title>${title}</title>`);

      // Replace Description
      html = html.replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i, `<meta name="description" content="${description}" \/>`);
      
      // Replace OG Title
      html = html.replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:title" content="${title}" \/>`);
      
      // Replace OG Description
      html = html.replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:description" content="${description}" \/>`);
      
      // Replace OG Image
      html = html.replace(/<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:image" content="${imageUrl}" \/>`);
      
      // Replace Twitter Title
      html = html.replace(/<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i, `<meta name="twitter:title" content="${title}" \/>`);
      
      // Replace Twitter Description
      html = html.replace(/<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i, `<meta name="twitter:description" content="${description}" \/>`);
      
      // Replace Twitter Image
      html = html.replace(/<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/i, `<meta name="twitter:image" content="${imageUrl}" \/>`);

    } catch (error) {
      console.error("SEO Injection Error:", error);
    }

    res.header("Content-Type", "text/html");
    res.send(html);
  };

  // Specific routes for SEO
  app.get("/opportunites/:id", serveIndexWithSEO);
  app.get("/formations/:id", serveIndexWithSEO);
  app.get("/evenements/:id", serveIndexWithSEO);

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("/{*path}", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
