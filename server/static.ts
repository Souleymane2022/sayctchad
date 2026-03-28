import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { storage } from "./storage";

export function serveStatic(app: Express) {
  // Try to find dist/public (standard build location)
  let distPath = path.resolve(process.cwd(), "dist", "public");
  
  if (!fs.existsSync(distPath)) {
    // Fallback for Replit/local structure where dist/public might be elsewhere
    distPath = path.resolve(__dirname, "public");
  }

  if (!fs.existsSync(distPath)) {
    // If still not found, search in common locations
    const possiblePaths = [
      path.resolve(process.cwd(), "public"),
      path.resolve(__dirname, "..", "public"),
      path.resolve(__dirname, "..", "client", "dist")
    ];
    for (const p of possiblePaths) {
      if (fs.existsSync(p) && fs.existsSync(path.join(p, "index.html"))) {
        distPath = p;
        break;
      }
    }
  }

  if (!fs.existsSync(distPath)) {
    console.error(`[Static] WARNING: Could not find build directory. Static serving will be disabled.`);
    return;
  }

  console.log(`[Static] Serving from: ${distPath}`);
  return setupServe(app, distPath);
}

function setupServe(app: Express, distPath: string) {
  const indexPath = path.resolve(distPath, "index.html");

  // Helper for dynamic SEO injection
  const serveIndexWithSEO = async (req: any, res: any) => {
    if (!fs.existsSync(indexPath)) {
      return res.status(404).send("Index file not found");
    }

    let html = fs.readFileSync(indexPath, "utf8");

    try {
      let title = "SAYC Tchad - Smart Africa Youth Chapter";
      let description = "7ème chapitre jeunesse de Smart Africa au Tchad.";
      let imageUrl = "https://sayctchad.org/images/og-image.png";

      const reqPath = req.path;
      const id = req.params.id;

      if (reqPath.includes("/opportunites/")) {
        const item = await storage.getOpportunityById(id);
        if (item) {
          title = `${item.title} | Opportunité SAYC Tchad`;
          description = item.description.substring(0, 160);
          if (item.imageUrl) imageUrl = item.imageUrl;
        }
      } else if (reqPath.includes("/formations/")) {
        const item = await storage.getTrainingById(id);
        if (item) {
          title = `${item.title} | Formation SAYC Tchad`;
          description = item.description.substring(0, 160);
          if (item.imageUrl) imageUrl = item.imageUrl;
        }
      } else if (reqPath.includes("/evenements/")) {
        const item = await storage.getEventById(id);
        if (item) {
          title = `${item.title} | Événement SAYC Tchad`;
          description = item.description.substring(0, 160);
          if (item.imageUrl) imageUrl = item.imageUrl;
        }
      } else if (reqPath.includes("/resultats")) {
        title = "Liste Officielle des 50 Lauréats | Bourse Thunderbird SAYC Tchad";
        description = "Découvrez les 50 candidats retenus pour la bourse Thunderbird School of Global Management - Initiative Najafi 100 Million Learners.";
      }

      // Ensure imageUrl is absolute
      if (imageUrl && !imageUrl.startsWith("http")) {
        imageUrl = `https://sayctchad.org${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
      }

      // Meta Tag Replacement Logic
      html = html.replace(/<title>.*?<\/title>/i, `<title>${title}</title>`);
      html = html.replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i, `<meta name="description" content="${description}" \/>`);
      html = html.replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:title" content="${title}" \/>`);
      html = html.replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:description" content="${description}" \/>`);
      html = html.replace(/<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:image" content="${imageUrl}" \/>`);
      html = html.replace(/<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i, `<meta name="twitter:title" content="${title}" \/>`);
      html = html.replace(/<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i, `<meta name="twitter:description" content="${description}" \/>`);
      html = html.replace(/<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/i, `<meta name="twitter:image" content="${imageUrl}" \/>`);

    } catch (error) {
      console.error("SEO Injection Error:", error);
    }

    res.header("Content-Type", "text/html");
    res.send(html);
  };

  // SEO Routes
  app.get("/opportunites/:id", serveIndexWithSEO);
  app.get("/formations/:id", serveIndexWithSEO);
  app.get("/evenements/:id", serveIndexWithSEO);

  // Serve other static files
  app.use(express.static(distPath, { index: false }));

  // Fallback for all other SPA routes
  app.get("*", (req, res) => {
    if (req.path.startsWith("/api")) return; // Don't interfere with API
    res.sendFile(indexPath);
  });
}
