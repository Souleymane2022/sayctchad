import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  Code, 
  Cloud, 
  Shield, 
  Database,
  Smartphone,
  Brain,
  Palette,
  Clock,
  Users,
  Award,
  ChevronRight,
  ArrowRight
} from "lucide-react";

const trainings = [
  {
    icon: Code,
    title: "Développement Web Full Stack",
    description: "Apprenez à créer des applications web modernes avec HTML, CSS, JavaScript, React et Node.js.",
    level: "Débutant à Intermédiaire",
    duration: "12 semaines",
    participants: "25 max",
    badge: "Populaire",
    topics: ["HTML/CSS", "JavaScript", "React", "Node.js", "MongoDB"],
  },
  {
    icon: Smartphone,
    title: "Développement Mobile",
    description: "Créez des applications mobiles natives et cross-platform avec React Native et Flutter.",
    level: "Intermédiaire",
    duration: "10 semaines",
    participants: "20 max",
    badge: null,
    topics: ["React Native", "Flutter", "API REST", "Firebase"],
  },
  {
    icon: Cloud,
    title: "Cloud Computing & DevOps",
    description: "Maîtrisez les services cloud AWS, Azure et les pratiques DevOps modernes.",
    level: "Intermédiaire à Avancé",
    duration: "8 semaines",
    participants: "15 max",
    badge: "Nouveau",
    topics: ["AWS", "Azure", "Docker", "Kubernetes", "CI/CD"],
  },
  {
    icon: Shield,
    title: "Cybersécurité",
    description: "Protégez les systèmes et données contre les menaces avec les meilleures pratiques de sécurité.",
    level: "Intermédiaire à Avancé",
    duration: "10 semaines",
    participants: "20 max",
    badge: null,
    topics: ["Ethical Hacking", "Network Security", "SIEM", "Forensics"],
  },
  {
    icon: Brain,
    title: "Data Science & IA",
    description: "Explorez l'analyse de données, le machine learning et l'intelligence artificielle.",
    level: "Avancé",
    duration: "14 semaines",
    participants: "15 max",
    badge: null,
    topics: ["Python", "Machine Learning", "Deep Learning", "TensorFlow"],
  },
  {
    icon: Database,
    title: "Bases de Données & SQL",
    description: "Apprenez à concevoir, gérer et optimiser des bases de données relationnelles et NoSQL.",
    level: "Débutant à Intermédiaire",
    duration: "6 semaines",
    participants: "25 max",
    badge: null,
    topics: ["SQL", "PostgreSQL", "MongoDB", "Redis"],
  },
  {
    icon: Palette,
    title: "Design UI/UX",
    description: "Concevez des interfaces utilisateur intuitives et des expériences mémorables.",
    level: "Débutant à Intermédiaire",
    duration: "8 semaines",
    participants: "20 max",
    badge: null,
    topics: ["Figma", "User Research", "Prototyping", "Design Systems"],
  },
  {
    icon: GraduationCap,
    title: "Initiation au Numérique",
    description: "Programme d'introduction pour les débutants souhaitant découvrir le monde digital.",
    level: "Débutant",
    duration: "4 semaines",
    participants: "30 max",
    badge: "Gratuit",
    topics: ["Bureautique", "Internet", "Outils collaboratifs", "Sécurité de base"],
  },
];

const stats = [
  { icon: GraduationCap, value: "25+", label: "Formations" },
  { icon: Users, value: "500+", label: "Participants formés" },
  { icon: Award, value: "85%", label: "Taux de réussite" },
  { icon: Clock, value: "1000+", label: "Heures de formation" },
];

export default function Trainings() {
  return (
    <div className="flex flex-col">
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-muted/50 to-background overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative">
          <div className="max-w-3xl">
            <Badge variant="outline" className="mb-6" data-testid="badge-trainings-header">
              <GraduationCap className="w-3 h-3 mr-1" />
              Formations
            </Badge>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6" data-testid="text-trainings-title">
              Catalogue des{" "}
              <span className="text-primary">formations</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8" data-testid="text-trainings-description">
              Découvrez notre catalogue complet de formations en compétences numériques. 
              Du niveau débutant à avancé, trouvez le programme adapté à vos objectifs.
            </p>
            <Link href="/rejoindre">
              <Button size="lg" data-testid="button-trainings-join">
                S'inscrire aux formations
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 bg-sidebar text-sidebar-foreground">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center" data-testid={`stat-training-${index}`}>
                <div className="w-12 h-12 rounded-full bg-accent/20 text-accent flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="font-heading text-2xl md:text-3xl font-bold text-accent mb-1">
                  {stat.value}
                </div>
                <div className="text-sidebar-foreground/70 text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4" data-testid="text-catalog-title">
              Nos Formations
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto" data-testid="text-catalog-description">
              Choisissez parmi nos programmes de formation certifiants et développez vos compétences.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {trainings.map((training, index) => (
              <Card key={index} className="hover-elevate transition-all" data-testid={`card-training-${index}`}>
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="w-14 h-14 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <training.icon className="w-7 h-7" />
                    </div>
                    <div className="flex items-center gap-2 flex-wrap justify-end">
                      {training.badge && (
                        <Badge 
                          variant={training.badge === "Gratuit" ? "secondary" : "default"}
                          className={training.badge === "Gratuit" ? "bg-chart-3 text-white" : ""}
                        >
                          {training.badge}
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        {training.level}
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className="font-heading text-xl">{training.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {training.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {training.topics.map((topic, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {training.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {training.participants}
                    </span>
                  </div>
                  <Button variant="outline" className="w-full" data-testid={`button-training-register-${index}`}>
                    S'inscrire
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-gradient-to-br from-primary to-primary/90 text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6" data-testid="text-cta-trainings-title">
              Prêt à développer vos compétences?
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto" data-testid="text-cta-trainings-description">
              Inscrivez-vous maintenant et commencez votre parcours vers l'excellence numérique.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/rejoindre">
                <Button size="lg" variant="secondary" className="min-w-[200px]" data-testid="button-cta-join-trainings">
                  Devenir membre
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="min-w-[200px] border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" data-testid="button-cta-contact-trainings">
                  Demander des informations
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
