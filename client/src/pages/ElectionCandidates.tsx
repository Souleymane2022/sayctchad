import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Vote, Star, Quote, ShieldCheck, ChevronRight, CheckCircle2 } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import confetti from "canvas-confetti";

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
  const [votedCandidate, setVotedCandidate] = useState<Leader | null>(null);

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

  const handleConfirmVote = () => {
    if (selectedLeader) {
      setVotedCandidate(selectedLeader);
      setSelectedLeader(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Lancer des confettis
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20 overflow-hidden relative">
      <SEOHead 
        title="Candidats Présélectionnés - SAYC"
        description="Découvrez et confirmez votre soutien pour les 4 leaders de la jeunesse."
        path="/elections/candidats"
      />

      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-50 rounded-full blur-[120px] -z-10 pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 p-4 container mx-auto max-w-6xl">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/elections")} className="hover:bg-slate-100 rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-[#1e3a8a]">
              SAYC Elections
            </h1>
            <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-sayc-teal" /> Processus Transparent
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 md:p-8 container mx-auto max-w-6xl space-y-12 mt-4">
        
        {/* Banner de Succès du Vote */}
        <AnimatePresence>
          {votedCandidate && (
            <motion.div 
              initial={{ opacity: 0, height: 0, scale: 0.9 }}
              animate={{ opacity: 1, height: "auto", scale: 1 }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 md:p-8 flex items-center gap-6 shadow-sm relative overflow-hidden"
            >
              <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-100 rounded-full blur-2xl -mr-10 -mt-10"></div>
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex-shrink-0 flex items-center justify-center border-4 border-white shadow-sm z-10">
                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              </div>
              <div className="z-10">
                <h3 className="text-2xl font-bold text-emerald-800 mb-2">Vote Enregistré !</h3>
                <p className="text-emerald-700 font-medium text-lg">
                  Vous avez confirmé votre soutien pour <span className="font-bold underline decoration-2 decoration-emerald-400">{votedCandidate.name}</span>.
                </p>
                <p className="text-emerald-600/80 text-sm mt-1">Merci de participer activement à la construction de l'avenir du numérique au Tchad.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Intro Banner */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl shadow-xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a8a] to-blue-900 z-0" />
          <div className="absolute -top-24 -right-24 p-8 opacity-10 scale-150 transform rotate-12">
             <Vote className="h-96 w-96 text-white" />
          </div>
          
          <div className="relative z-10 p-8 md:p-14 space-y-6">
            <Badge variant="outline" className="text-blue-100 border-blue-400/50 bg-blue-900/40 backdrop-blur px-3 py-1 text-sm rounded-full">
              Phase Découverte
            </Badge>
            <h2 className="text-4xl md:text-6xl font-extrabold text-white leading-tight font-heading">
              14 Leaders Présélectionnés.<br/>
              <span className="text-sayc-teal">Un Avenir Commun.</span>
            </h2>
            <p className="text-blue-100 max-w-3xl text-lg md:text-xl font-light leading-relaxed">
              Découvrez les profils d'exception qui aspirent à diriger la nouvelle ère de notre écosystème numérique, et exprimez votre choix.
            </p>
          </div>
        </motion.div>

        {/* Candidate Grid */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h3 className="text-2xl font-bold flex items-center gap-3 text-[#1e3a8a]">
              <Star className="h-6 w-6 text-sayc-teal" />
              Candidats à l'honneur
            </h3>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border shadow-sm">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-sm font-bold text-slate-600">Vote Ouvert</span>
            </div>
          </div>

          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {leaders.map((leader) => {
              const isVoted = votedCandidate?.id === leader.id;
              
              return (
                <motion.div key={leader.id} variants={item}>
                  <Card 
                    className={`group cursor-pointer overflow-hidden relative bg-white flex flex-col transition-all duration-300 rounded-2xl border-2 ${isVoted ? 'border-sayc-teal shadow-lg scale-[1.02]' : 'border-transparent hover:border-slate-200 shadow-md hover:shadow-xl'}`}
                    onClick={() => setSelectedLeader(leader)}
                  >
                    {isVoted && (
                      <div className="absolute top-4 right-4 z-30 bg-white rounded-full p-1 shadow-md">
                        <CheckCircle2 className="h-6 w-6 text-sayc-teal" />
                      </div>
                    )}

                    {/* Image container */}
                    <div className="relative h-72 overflow-hidden bg-slate-100">
                      <img 
                        src={leader.image} 
                        alt={leader.name} 
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-slate-900/80 to-transparent z-0" />
                      
                      <div className="absolute bottom-4 left-5 right-5 z-20">
                        <h4 className="text-xl font-bold text-white drop-shadow-md">{leader.name}</h4>
                        <p className="text-sm font-semibold text-sayc-teal">{leader.role}</p>
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col">
                      <p className="text-sm text-slate-600 line-clamp-3 mb-6 flex-1 leading-relaxed">
                        {leader.bio}
                      </p>
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex gap-2 overflow-hidden flex-wrap w-[80%]">
                          {leader.skills.slice(0, 2).map((s, i) => (
                            <span key={i} className={`text-[10px] font-bold px-2 py-1 rounded-full bg-slate-100 text-slate-700`}>
                              {s}
                            </span>
                          ))}
                        </div>
                        <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0 group-hover:bg-sayc-teal group-hover:text-white transition-all duration-300 border">
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </main>

      {/* Profile Modal */}
      <AnimatePresence>
        {selectedLeader && (
          <Dialog open={!!selectedLeader} onOpenChange={(open) => !open && setSelectedLeader(null)}>
            <DialogContent className="max-w-4xl p-0 overflow-hidden bg-white shadow-2xl rounded-2xl text-slate-800 border-0">
              
              <div className="flex flex-col md:flex-row h-full max-h-[90vh]">
                {/* Modal Header Image - Left side on desktop */}
                <div className="relative h-64 md:h-auto md:w-2/5 md:flex-shrink-0 bg-slate-100 overflow-hidden">
                  <img src={selectedLeader.image} className="w-full h-full object-cover object-top" alt={selectedLeader.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent md:bg-black/10" />
                  <div className="absolute bottom-6 left-6 right-6 md:hidden">
                    <Badge className={`mb-3 bg-gradient-to-r ${selectedLeader.color} text-white border-0 px-3 py-1 shadow-md`}>
                      Candidat #{selectedLeader.id}
                    </Badge>
                  </div>
                </div>

                {/* Modal Body - Right side on desktop */}
                <div className="p-6 md:p-10 md:w-3/5 overflow-y-auto w-full space-y-8 flex flex-col bg-slate-50">
                  
                  <div className="space-y-2 hidden md:block">
                    <Badge className={`bg-gradient-to-r ${selectedLeader.color} text-white border-0 px-3 py-1 shadow-sm`}>
                      Candidat #{selectedLeader.id}
                    </Badge>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-[#1e3a8a]">
                      {selectedLeader.name}
                    </h2>
                    <p className="text-xl font-bold text-sayc-teal">{selectedLeader.role}</p>
                  </div>
                  
                  <div className="block md:hidden space-y-1">
                    <h2 className="text-3xl font-extrabold text-[#1e3a8a]">
                      {selectedLeader.name}
                    </h2>
                    <p className="text-lg font-bold text-sayc-teal">{selectedLeader.role}</p>
                  </div>

                  <div className="space-y-6 flex-1">
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <span className="w-4 h-[1px] bg-slate-300 block"></span> Biographie
                      </h4>
                      <div className="text-base leading-relaxed text-slate-600">
                        {selectedLeader.bio}
                      </div>
                    </div>

                    <div className="relative border-l-[4px] border-sayc-teal pl-6 py-4 bg-white rounded-r-xl shadow-sm">
                      <Quote className="absolute top-2 left-4 h-8 w-8 text-sayc-teal/10" />
                      <h4 className="text-xs font-bold text-sayc-teal uppercase tracking-wide mb-2">Notre Vision Numérique</h4>
                      <p className="text-lg font-medium italic leading-relaxed text-slate-700 relative z-10">
                        "{selectedLeader.vision}"
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <span className="w-4 h-[1px] bg-slate-300 block"></span> Domaines d'Expertise
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedLeader.skills.map((s, i) => (
                          <Badge key={i} variant="secondary" className="bg-slate-200 hover:bg-slate-300 text-slate-700 py-1.5 px-3">
                            {s}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Call to Action Wrapper */}
                  <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto">
                    <p className="text-sm text-slate-500 font-medium">
                      Exprimez votre soutien
                    </p>
                    <Button 
                      onClick={handleConfirmVote}
                      className={`w-full sm:w-auto px-8 bg-[#1e3a8a] text-white hover:bg-blue-900 shadow-md h-12 rounded-xl text-base font-bold`} 
                    >
                      <Vote className="h-5 w-5 mr-2" />
                      Confirmer de choix
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
