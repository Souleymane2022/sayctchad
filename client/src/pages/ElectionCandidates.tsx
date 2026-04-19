import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Vote, Star, Quote, ShieldCheck, ChevronRight } from "lucide-react";
import SEOHead from "@/components/SEOHead";

interface Leader {
  id: number;
  name: string;
  role: string;
  image: string;
  bio: string;
  vision: string;
  color: string;
  skills: string[];
}

const leaders: Leader[] = [
  {
    id: 1,
    name: "Abdelkerim Mahamat",
    role: "Visionnaire Tech",
    image: "/images/leaders/leader_1.png",
    bio: "Abdelkerim possède plus de 10 ans d'expérience dans l'élaboration de programmes éducatifs nationaux. Diplômé en relations internationales, il a milité activement pour l'intégration des jeunes dans le secteur administratif et public. Son approche se base sur le pragmatisme et le dialogue intergénérationnel.",
    vision: "Une voix forte pour la jeunesse, propulsant le leadership et l'innovation au sein des institutions tchadiennes.",
    color: "from-blue-600 to-indigo-700",
    skills: ["Gouvernance", "Diplomatie Tech", "Leadership"]
  },
  {
    id: 2,
    name: "Fatimé Zara",
    role: "Pionnière de l'Innovation",
    image: "/images/leaders/leader_2.png",
    bio: "Animée par la passion du code et du digital, Fatimé a fondé un incubateur tech visant les jeunes femmes. Elle défend une approche moderne du leadership où la technologie devient le vecteur principal d'ascension sociale et de création de richesse durable.",
    vision: "Équiper la nouvelle génération de compétences numériques pour conquérir l'économie numérique de demain.",
    color: "from-purple-600 to-fuchsia-700",
    skills: ["Tech & Innovation", "Entrepreneuriat", "Inclusion"]
  },
  {
    id: 3,
    name: "Dr. Ousmane T.",
    role: "Stratège Numérique",
    image: "/images/leaders/leader_3.png",
    bio: "Économiste et stratège respecté, Ousmane a passé sa carrière à structurer des fonds d'investissement pour l'entrepreneuriat jeune en Afrique Centrale. Il apporte une rigueur intellectuelle et un réseau impressionnant pour ouvrir des opportunités inédites à la jeunesse locale.",
    vision: "Bâtir des ponts entre le capital institutionnel mondial et notre talentueuse génération d'entrepreneurs.",
    color: "from-emerald-500 to-teal-700",
    skills: ["Stratégie Financière", "Investissement", "Mentorat"]
  },
  {
    id: 4,
    name: "Amina Alhadj",
    role: "Leader Éco-Tech",
    image: "/images/leaders/leader_4.png",
    bio: "Ingénieure agro-tech primée à l'international, Amina est à l'avant-garde de l'innovation écologique. Elle propose un modèle d'économie circulaire qui crée des emplois durables tout en protégeant les écosystèmes. Son expertise terrain fait d'elle un pilier du renouveau écologique conjoint au numérique.",
    vision: "L'indépendance économique locale couplée à une responsabilité écologique ambitieuse.",
    color: "from-amber-500 to-orange-700",
    skills: ["Développement Durable", "AgriTech", "Recherche"]
  }
];

export default function ElectionCandidates() {
  const [, setLocation] = useLocation();
  const [selectedLeader, setSelectedLeader] = useState<Leader | null>(null);

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const item = {
    hidden: { opacity: 0, scale: 0.95, y: 30 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 200 } }
  };

  return (
    <div className="min-h-screen bg-[#020817] text-slate-50 pb-20 overflow-hidden relative">
      <SEOHead 
        title="Maquette : 4 Leaders Présélectionnés"
        description="Découvrez les profils des 4 candidats à l'honneur pour la préparation aux élections SAYC."
        path="/elections/candidats"
      />

      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#020817]/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-3 p-4 container mx-auto max-w-6xl">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/elections")} className="hover:bg-white/10 text-white rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sayc-teal to-blue-400">
              SAYC Elections
            </h1>
            <p className="text-xs text-slate-400 font-medium flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-emerald-400" /> Processus Transparent
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 md:p-8 container mx-auto max-w-6xl space-y-12 mt-6">
        
        {/* Intro Banner */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#020817] z-0" />
          <div className="absolute -top-24 -right-24 p-8 opacity-[0.03] scale-150 transform rotate-12">
             <Vote className="h-96 w-96 text-white" />
          </div>
          
          <div className="relative z-10 p-8 md:p-14 space-y-6">
            <Badge variant="outline" className="text-blue-300 border-blue-400/50 bg-blue-900/40 backdrop-blur px-3 py-1 text-sm rounded-full">
              Phase Découverte
            </Badge>
            <h2 className="text-4xl md:text-6xl font-extrabold text-white leading-tight font-heading">
              14 Leaders Présélectionnés.<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sayc-teal to-cyan-400">Un Avenir Commun.</span>
            </h2>
            <p className="text-slate-300 max-w-3xl text-lg md:text-xl font-light leading-relaxed">
              Découvrez les profils d'exception qui aspirent à diriger la nouvelle ère de notre écosystème numérique. Parcourez leurs visions et préparez-vous pour l'ouverture du vote démocratique sécurisé.
            </p>
            <div className="pt-4 flex items-center justify-between">
              <p className="text-sm text-amber-400 uppercase tracking-widest font-bold">
                * Maquette de test : 4 sur 14 profils affichés
              </p>
            </div>
          </div>
        </motion.div>

        {/* Candidate Grid */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h3 className="text-2xl font-bold flex items-center gap-3 text-white">
              <Star className="h-6 w-6 text-sayc-teal" />
              Candidats à l'honneur
            </h3>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-sm font-medium text-slate-300">Vote d'essai bientôt disponible</span>
            </div>
          </div>

          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {leaders.map((leader) => (
              <motion.div key={leader.id} variants={item}>
                <Card 
                  className="group cursor-pointer overflow-hidden relative border border-white/10 bg-[#0f172a]/60 backdrop-blur-md h-full flex flex-col hover:border-white/30 transition-all duration-500 hover:shadow-[0_0_30px_rgba(45,212,191,0.15)] rounded-2xl"
                  onClick={() => setSelectedLeader(leader)}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-[#020817] via-transparent to-transparent z-10 pointer-events-none" />
                  
                  {/* Image container */}
                  <div className="relative h-72 overflow-hidden bg-slate-800">
                    <img 
                      src={leader.image} 
                      alt={leader.name} 
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute bottom-0 inset-x-0 h-2/3 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/80 to-transparent z-0" />
                    
                    <div className="absolute bottom-4 left-5 right-5 z-20 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                      <h4 className="text-2xl font-bold text-white drop-shadow-md mb-1">{leader.name}</h4>
                      <p className="text-sm font-semibold text-sayc-teal">{leader.role}</p>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col bg-gradient-to-br from-[#0f172a] to-[#020817]">
                    <p className="text-sm text-slate-400 line-clamp-3 mb-6 flex-1 font-light leading-relaxed">
                      {leader.bio}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex gap-2 overflow-hidden flex-wrap w-[80%]">
                        {leader.skills.slice(0, 2).map((s, i) => (
                          <span key={i} className={`text-[10px] font-bold px-2 py-1 rounded-full bg-gradient-to-r ${leader.color} text-white shadow-sm ring-1 ring-white/20`}>
                            {s}
                          </span>
                        ))}
                      </div>
                      <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-sayc-teal group-hover:text-[#020817] transition-all duration-300 border border-white/10">
                        <ChevronRight className="h-5 w-5" />
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>

      {/* Profile Modal */}
      <AnimatePresence>
        {selectedLeader && (
          <Dialog open={!!selectedLeader} onOpenChange={(open) => !open && setSelectedLeader(null)}>
            <DialogContent className="max-w-4xl p-0 overflow-hidden border border-white/10 bg-[#0f172a]/95 backdrop-blur-2xl shadow-2xl rounded-2xl text-slate-50">
              
              <div className="flex flex-col md:flex-row h-full max-h-[90vh]">
                {/* Modal Header Image - Left side on desktop */}
                <div className="relative h-64 md:h-auto md:w-2/5 md:flex-shrink-0 bg-slate-900 overflow-hidden">
                  <img src={selectedLeader.image} className="w-full h-full object-cover object-center" alt={selectedLeader.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#0f172a]" />
                  <div className="absolute bottom-6 left-6 right-6 md:hidden">
                    <Badge className={`mb-3 bg-gradient-to-r ${selectedLeader.color} text-white border-0 px-3 py-1`}>
                      Candidat #{selectedLeader.id}
                    </Badge>
                  </div>
                </div>

                {/* Modal Body - Right side on desktop */}
                <div className="p-6 md:p-10 md:w-3/5 overflow-y-auto w-full space-y-8 flex flex-col">
                  
                  <div className="space-y-2 hidden md:block">
                    <Badge className={`bg-gradient-to-r ${selectedLeader.color} text-white border-0 px-3 py-1`}>
                      Candidat #{selectedLeader.id}
                    </Badge>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-white">
                      {selectedLeader.name}
                    </h2>
                    <p className="text-xl font-medium text-sayc-teal">{selectedLeader.role}</p>
                  </div>
                  
                  <div className="block md:hidden space-y-1">
                    <h2 className="text-3xl font-extrabold text-white">
                      {selectedLeader.name}
                    </h2>
                    <p className="text-lg font-medium text-sayc-teal">{selectedLeader.role}</p>
                  </div>

                  <div className="space-y-6 flex-1">
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <span className="w-4 h-[1px] bg-slate-600 block"></span> Biographie
                      </h4>
                      <div className="text-base leading-relaxed text-slate-300 font-light">
                        {selectedLeader.bio}
                        <p className="mt-3">Son parcours exemplaire l'a préparé(e) à assumer des responsabilités majeures au sein du comité national, avec une vision novatrice et inclusive.</p>
                      </div>
                    </div>

                    <div className="relative border-l-[3px] border-sayc-teal pl-6 py-2">
                      <Quote className="absolute -top-2 -left-2 h-8 w-8 text-sayc-teal/20" />
                      <h4 className="text-xs font-bold text-sayc-teal uppercase tracking-wide mb-2">Notre Vision Numérique</h4>
                      <p className="text-lg font-medium italic leading-relaxed text-white">
                        "{selectedLeader.vision}"
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <span className="w-4 h-[1px] bg-slate-600 block"></span> Domaines d'Expertise
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedLeader.skills.map((s, i) => (
                          <Badge key={i} variant="outline" className="bg-white/5 hover:bg-white/10 text-slate-200 border-white/20 py-1.5 px-3">
                            {s}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Call to Action Wrapper */}
                  <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto">
                    <p className="text-sm text-slate-400 flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-emerald-400" /> Phase de vote sécurisée bientôt.
                    </p>
                    <Button 
                      className={`w-full sm:w-auto px-8 bg-gradient-to-r ${selectedLeader.color} text-white hover:opacity-90 shadow-lg border-0 h-12 rounded-xl text-base font-bold`} 
                      disabled
                    >
                      <Vote className="h-5 w-5 mr-2" />
                      Vote de Test
                    </Button>
                  </div>

                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
}
