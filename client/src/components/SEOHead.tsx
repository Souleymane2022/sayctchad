import { useEffect } from "react";

interface SEOHeadProps {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  jsonLd?: Record<string, unknown>;
}

function setMetaTag(property: string, content: string, isName = false) {
  const attr = isName ? "name" : "property";
  let el = document.querySelector(`meta[${attr}="${property}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, property);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLinkTag(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export default function SEOHead({ title, description, path, type = "website", jsonLd }: SEOHeadProps) {
  useEffect(() => {
    const baseUrl = "https://sayctchad.org";
    const url = `${baseUrl}${path}`;
    const imageUrl = `${baseUrl}/images/og-image.png`;
    const siteName = "SAYC Tchad - Smart Africa Youth Chapter";

    document.title = title;

    setMetaTag("description", description, true);
    setMetaTag("keywords", `SAYC Tchad, Smart Africa, ${title}, jeunesse, innovation numérique, Tchad, formation`, true);

    setLinkTag("canonical", url);

    setMetaTag("og:title", title);
    setMetaTag("og:description", description);
    setMetaTag("og:url", url);
    setMetaTag("og:type", type);
    setMetaTag("og:image", imageUrl);
    setMetaTag("og:image:width", "1200");
    setMetaTag("og:image:height", "675");
    setMetaTag("og:image:alt", title);
    setMetaTag("og:locale", "fr_TD");
    setMetaTag("og:site_name", siteName);

    setMetaTag("twitter:card", "summary_large_image", true);
    setMetaTag("twitter:title", title, true);
    setMetaTag("twitter:description", description, true);
    setMetaTag("twitter:image", imageUrl, true);
    setMetaTag("twitter:image:alt", title, true);

    const breadcrumbJsonLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Accueil",
          "item": baseUrl,
        },
        ...(path !== "/" ? [{
          "@type": "ListItem",
          "position": 2,
          "name": title.split("|")[0].trim(),
          "item": url,
        }] : []),
      ],
    };

    let breadcrumbEl = document.querySelector('script[data-seo-breadcrumb]') as HTMLScriptElement | null;
    if (!breadcrumbEl) {
      breadcrumbEl = document.createElement("script");
      breadcrumbEl.setAttribute("type", "application/ld+json");
      breadcrumbEl.setAttribute("data-seo-breadcrumb", "true");
      document.head.appendChild(breadcrumbEl);
    }
    breadcrumbEl.textContent = JSON.stringify(breadcrumbJsonLd);

    let scriptEl = document.querySelector('script[data-seo-jsonld]') as HTMLScriptElement | null;
    if (jsonLd) {
      if (!scriptEl) {
        scriptEl = document.createElement("script");
        scriptEl.setAttribute("type", "application/ld+json");
        scriptEl.setAttribute("data-seo-jsonld", "true");
        document.head.appendChild(scriptEl);
      }
      scriptEl.textContent = JSON.stringify(jsonLd);
    } else if (scriptEl) {
      scriptEl.remove();
    }

    return () => {
      const existingScript = document.querySelector('script[data-seo-jsonld]');
      if (existingScript) existingScript.remove();
      const existingBreadcrumb = document.querySelector('script[data-seo-breadcrumb]');
      if (existingBreadcrumb) existingBreadcrumb.remove();
    };
  }, [title, description, path, type, jsonLd]);

  return null;
}
