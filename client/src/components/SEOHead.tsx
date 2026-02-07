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
    const baseUrl = window.location.origin;
    const url = `${baseUrl}${path}`;
    const imageUrl = `${baseUrl}/favicon.png`;
    const siteName = "SAYC Tchad - Smart Africa Youth Chapter";

    document.title = title;

    setMetaTag("description", description, true);

    setLinkTag("canonical", url);

    setMetaTag("og:title", title);
    setMetaTag("og:description", description);
    setMetaTag("og:url", url);
    setMetaTag("og:type", type);
    setMetaTag("og:image", imageUrl);
    setMetaTag("og:locale", "fr_TD");
    setMetaTag("og:site_name", siteName);

    setMetaTag("twitter:card", "summary_large_image", true);
    setMetaTag("twitter:title", title, true);
    setMetaTag("twitter:description", description, true);
    setMetaTag("twitter:image", imageUrl, true);

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
    };
  }, [title, description, path, type, jsonLd]);

  return null;
}
