import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { storage } from "./storage";

export function serveStatic(app: Express) {
  // Common locations for build artifacts
  const possiblePaths = [
    path.resolve(process.cwd(), "dist", "public"), // Replit/Standard
    path.resolve(process.cwd(), "dist"),          // Vercel
    path.resolve(process.cwd(), "public"),        // Dev fallback
    path.resolve(__dirname, "public"),            // Bundle fallback
    path.resolve(__dirname, "..", "public"),      // Parent fallback
    path.resolve(__dirname, "..", "client", "dist") // Dev fallback 2
  ];

  let distPath = "";
  for (const p of possiblePaths) {
    if (fs.existsSync(p) && fs.existsSync(path.join(p, "index.html"))) {
      distPath = p;
      break;
    }
  }

  if (!distPath) {
    console.error(`[Static] WARNING: Could not find build directory with index.html. Static serving will be disabled.`);
    console.error(`Checked paths: ${possiblePaths.join(", ")}`);
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
      } else if (reqPath.includes("/actualites/")) {
        const item = await storage.getNewsArticleById(id);
        if (item) {
          title = `${item.title} | Actualités SAYC Tchad`;
          description = (item.excerpt || item.content || "").substring(0, 160);
          if (item.imageUrl) imageUrl = item.imageUrl;
        }
      } else if (reqPath.includes("/resultats")) {
        title = "Liste Officielle des 50 Lauréats | Bourse Thunderbird SAYC Tchad";
        description = "Découvrez les 50 candidats retenus pour la bourse Thunderbird School of Global Management - Initiative Najafi 100 Million Learners.";
      }

      // Convert base64 imageUrl to dynamic render endpoint for crawler compatibility
      if (imageUrl && imageUrl.startsWith("data:image")) {
        if (reqPath.includes("/opportunites/")) {
          imageUrl = `https://sayctchad.org/api/images/opportunities/${id}`;
        } else if (reqPath.includes("/formations/")) {
          imageUrl = `https://sayctchad.org/api/images/trainings/${id}`;
        } else if (reqPath.includes("/evenements/")) {
          imageUrl = `https://sayctchad.org/api/images/events/${id}`;
        } else if (reqPath.includes("/actualites/")) {
          imageUrl = `https://sayctchad.org/api/images/news/${id}`;
        }
      }

      // Ensure imageUrl is absolute and fallback to a default image if none exists
      if (imageUrl) {
        if (!imageUrl.startsWith("http")) {
          imageUrl = `https://sayctchad.org${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
        }
      } else {
        imageUrl = "https://sayctchad.org/images/logo.png";
      }

      const fullUrl = `https://sayctchad.org${reqPath}`;

      // Meta Tag Replacement Logic (Ultra-robust regex, matches regardless of attribute order or newlines)
      html = html.replace(/<title>.*?<\/title>/i, `<title>${title}</title>`);
      html = html.replace(/<meta[^>]*?name="description"[^>]*?>/i, `<meta name="description" content="${description}" />`);
      html = html.replace(/<meta[^>]*?property="og:title"[^>]*?>/i, `<meta property="og:title" content="${title}" />`);
      html = html.replace(/<meta[^>]*?property="og:description"[^>]*?>/i, `<meta property="og:description" content="${description}" />`);
      html = html.replace(/<meta[^>]*?property="og:image"[^>]*?>/i, `<meta property="og:image" content="${imageUrl}" />`);
      html = html.replace(/<meta[^>]*?property="og:url"[^>]*?>/i, `<meta property="og:url" content="${fullUrl}" />`);
      html = html.replace(/<meta[^>]*?name="twitter:title"[^>]*?>/i, `<meta name="twitter:title" content="${title}" />`);
      html = html.replace(/<meta[^>]*?name="twitter:description"[^>]*?>/i, `<meta name="twitter:description" content="${description}" />`);
      html = html.replace(/<meta[^>]*?name="twitter:image"[^>]*?>/i, `<meta name="twitter:image" content="${imageUrl}" />`);

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
  app.get("/actualites/:id", serveIndexWithSEO);

  // Serve other static files
  app.use(express.static(distPath, { index: false }));

  // Fallback for all other SPA routes
  app.get("*", (req, res) => {
    if (req.path.startsWith("/api")) return; // Don't interfere with API
    res.sendFile(indexPath);
  });
}
