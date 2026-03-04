import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  keywords?: string;
  jsonLd?: Record<string, unknown>;
}

export default function SEOHead({ title, description, path, type = "website", keywords, jsonLd }: SEOHeadProps) {
  const baseUrl = "https://sayctchad.org";
  const url = `${baseUrl}${path}`;
  const imageUrl = `${baseUrl}/images/og-image.png`;
  const siteName = "SAYC Tchad - Smart Africa Youth Chapter";

  const defaultKeywords = "Souleymane Mahamat Saleh, SAYC Tchad, Smart Africa, Youth Chapter, jeunesse tchadienne, innovation numérique Tchad, Ingénierie logicielle, tech leader Tchad, formation, SADA, leadership jeunesse, N'Djamena, transformation digitale Afrique";
  const finalKeywords = keywords ? `${defaultKeywords}, ${keywords}` : defaultKeywords;

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

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={finalKeywords} />
      <link rel="canonical" href={url} />

      {/* OpenGraph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="675" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:locale" content="fr_TD" />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content={title} />

      {/* JSON-LD for Breadcrumbs */}
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbJsonLd)}
      </script>

      {/* Custom JSON-LD if provided */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
}
