import { db } from "./db";
import { partners, achievements, trainings, opportunities, newsArticles } from "../shared/schema";
import { sql } from "drizzle-orm";

const seedPartners = [
  {
    name: "Ministère des Postes et de l'Économie Numérique du Tchad",
    logoUrl: "/images/partners/ministere-tic-tchad-logo.png",
    websiteUrl: "https://www.gouvernement.td",
    description: "Ministère en charge des TIC et de l'économie numérique au Tchad. Partenaire institutionnel du SAYC Tchad pour la transformation numérique du pays.",
    sortOrder: 1,
  },
  {
    name: "Thunderbird School - Arizona State University",
    logoUrl: "/images/partners/thunderbird-logo.png",
    websiteUrl: "https://thunderbird.asu.edu",
    description: "N°1 mondial pour le commerce international. Partenaire du programme 100 millions d'apprenants.",
    sortOrder: 2,
  },
  {
    name: "Transform Africa Summit",
    logoUrl: "/images/partners/transform-africa-logo.png",
    websiteUrl: "https://transformafricasummit.org",
    description: "Sommet annuel rassemblant les leaders africains pour la transformation digitale du continent.",
    sortOrder: 3,
  },
  {
    name: "Amazon Web Services (AWS)",
    logoUrl: "/images/partners/aws-logo.png",
    websiteUrl: "https://aws.amazon.com",
    description: "Leader mondial du cloud computing. Partenaire de Smart Africa pour la formation des jeunes africains aux technologies cloud et à l'innovation numérique.",
    sortOrder: 4,
  },
  {
    name: "Mastercard Foundation",
    logoUrl: "/images/partners/mastercard-logo.jpg",
    websiteUrl: "https://mastercardfdn.org",
    description: "Fondation mondiale engagée pour l'inclusion financière et l'autonomisation des jeunes africains. Partenaire stratégique de Smart Africa pour le développement des compétences numériques.",
    sortOrder: 5,
  },
];

const seedAchievements = [
  {
    title: "Jeunes formés via SADA4Youth",
    description: "Plus de 3000 jeunes formés à travers le programme SADA4Youth en Afrique.",
    metricValue: "3000+",
    metricLabel: "Jeunes formés",
  },
  {
    title: "Formations SADA disponibles",
    description: "Plus de 130 formations en ligne sur la plateforme SADA incluant des cours d'universités internationales.",
    metricValue: "130+",
    metricLabel: "Formations disponibles",
  },
  {
    title: "Pays membres Smart Africa",
    description: "40 États membres de l'Alliance Smart Africa représentant plus de 1,2 milliard de personnes.",
    metricValue: "40",
    metricLabel: "États membres",
  },
  {
    title: "Chapitres Jeunesse actifs",
    description: "Le Tchad est le 7e chapitre jeunesse actif de Smart Africa, aux côtés de la Sierra Leone, Congo-Brazzaville, Gambie, Malawi, Gabon et Afrique du Sud.",
    metricValue: "7",
    metricLabel: "Chapitres Jeunesse",
  },
];

const seedTrainings = [
  {
    title: "Programme Thunderbird 100 Millions d'Apprenants - Niveau Fondamental",
    description: "Certificat en entrepreneuriat mondial et innovation. 19 modules couvrant le leadership, la planification stratégique, le marketing, la propriété intellectuelle et plus. Bootcamp certifiant délivré par Thunderbird/ASU. Gratuit et disponible en 40 langues.",
    provider: "Thunderbird School / Arizona State University",
    level: "Fondamental",
    duration: "Auto-rythmé",
    link: "https://sada.smart.africa",
  },
  {
    title: "Programme Thunderbird - Niveau Intermédiaire",
    description: "5 cours certifiants : Principes de gestion globale, Comptabilité globale, Marketing mondial, Big Data dans l'économie mondiale, Entrepreneuriat mondial. Certificat accrédité de 15 crédits ASU disponible.",
    provider: "Thunderbird School / Arizona State University",
    level: "Intermédiaire",
    duration: "Auto-rythmé",
    link: "https://sada.smart.africa",
  },
  {
    title: "Programme Thunderbird - Niveau Avancé",
    description: "5 cours avancés : Leadership mondial, Entrepreneuriat durable, Comptabilité mondiale, Marketing numérique, Analyse des données et transformation numérique. Certificat de 15 crédits académiques ASU.",
    provider: "Thunderbird School / Arizona State University",
    level: "Avancé",
    duration: "Auto-rythmé",
    link: "https://sada.smart.africa",
  },
  {
    title: "Plateforme SADA - Formations en ligne",
    description: "Plus de 130 formations disponibles incluant des cours de classe mondiale des universités internationales. Évaluations numériques, podcasts sur la transformation numérique et parcours de certification.",
    provider: "SADA - Smart Africa Digital Academy",
    level: "Tous niveaux",
    duration: "Variable",
    link: "https://sada.smart.africa",
  },
  {
    title: "Formation Cloud AWS",
    description: "Formation aux technologies cloud AWS déployée par Smart Africa. Plus de 200 jeunes formés au Congo-Brazzaville et au Ghana dans le cadre du programme SADA4Youth.",
    provider: "Smart Africa / AWS",
    level: "Intermédiaire",
    duration: "Variable",
    link: "https://sada.smart.africa",
  },
  {
    title: "Cybersécurité et Intelligence Artificielle",
    description: "Initiative Smart Women and Girls : 40 femmes de 16 pays certifiées en cybersécurité et IA, formant à leur tour 500 jeunes femmes et filles. Centre d'innovation en cybersécurité avec 152 jeunes certifiés CyberOps.",
    provider: "Smart Africa / ÉSATIC",
    level: "Avancé",
    duration: "Variable",
    link: "https://sada.smart.africa",
  },
];

const seedOpportunities = [
  {
    title: "Recrutement d'un Consultant Individuel pour le Développement d'un Cadre de Mentorat Panafricain pour les Femmes et les Filles dans les TIC",
    description: "Smart Africa recrute un consultant individuel pour concevoir un programme et un cadre de mentorat panafricain destiné aux femmes et aux filles dans le secteur des TIC. Référence : 143/S.A/NORAD/RFP/01/2026. Date de publication : 23 janvier 2026.",
    category: "Appel d'offres",
    organization: "Smart Africa Secretariat",
    deadline: "22 Février 2026",
    location: "À distance (Anywhere)",
    link: "https://smartafrica.org/job/recruitment-of-an-individual-consultant-for-the-development-of-a-pan-african-women-and-girls-in-ict-mentorship-framework-program-design/",
  },
  {
    title: "Appel à Propositions (RFP) - Évaluation de l'Environnement Réglementaire et Politique de l'Entrepreneuriat Numérique et Innovation pour huit pays africains",
    description: "Smart Africa recherche un cabinet de conseil pour mener une évaluation de l'environnement réglementaire et politique de l'entrepreneuriat numérique et de l'innovation, et développer des parcours de soutien adaptés pour huit pays africains. Référence : 142/SA/RFP/01/2026. Date de publication : 7 janvier 2026.",
    category: "Appel d'offres",
    organization: "Smart Africa Secretariat",
    deadline: "9 Février 2026",
    location: "À distance (Anywhere)",
    link: "https://smartafrica.org/job/request-for-proposal-rfp-for-the-recruitment-of-consultancy-firm-to-conduct-digital-entrepreneurship-and-innovation-regulatory-policy-environment-assessment-and-develop-tailored-support-pathwa/",
  },
];

const seedNews = [
  {
    title: "Formation en Intelligence Artificielle pour 200 jeunes Tchadiens",
    excerpt: "Un événement majeur de formation en Intelligence Artificielle a été organisé au Tchad, réunissant 200 jeunes Tchadiens pour les initier aux technologies de l'IA.",
    content: "Un événement de formation en Intelligence Artificielle a été organisé au Tchad, réunissant 200 jeunes Tchadiens passionnés par les nouvelles technologies. Cet événement s'inscrit dans le cadre des initiatives de Smart Africa et de ses partenaires pour le développement des compétences numériques en Afrique. La formation a couvert les fondamentaux de l'intelligence artificielle, ses applications pratiques et les opportunités qu'elle offre aux jeunes africains. Plusieurs partenaires institutionnels et privés ont soutenu cette initiative, notamment l'ENASTIC, le PATN, Airtel, la Chaire UNESCO, la Banque Mondiale et l'ADETIC.",
    category: "Formation",
    imageUrl: "/images/news-ia-formation-tchad.jpg",
    publishedAt: new Date("2026-01-15"),
  },
];

async function seedTable<T extends Record<string, any>>(
  tableName: string,
  table: any,
  data: T[],
  nameField: string = "name"
) {
  const existing = await db.select().from(table);
  if (existing.length === 0) {
    console.log(`Seeding ${tableName}...`);
    await db.insert(table).values(data);
    console.log(`${tableName} seeded: ${data.length} rows.`);
  }
}

export async function seedDatabase() {
  try {
    try {
      await seedTable("partners", partners, seedPartners);
      await seedTable("achievements", achievements, seedAchievements, "title");
      await seedTable("trainings", trainings, seedTrainings, "title");
      await seedTable("opportunities", opportunities, seedOpportunities, "title");
      await seedTable("news_articles", newsArticles, seedNews, "title");

      await db.update(partners)
        .set({ isActive: false })
        .where(sql`${partners.name} IN ('Smart Africa Alliance', 'SADA - Smart Africa Digital Academy') AND ${partners.isActive} = true`);

      console.log("Database seed check complete.");
    } catch (e) {
      console.error("Failed to seed tables:", e);
    }
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}
