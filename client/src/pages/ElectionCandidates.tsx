import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ArrowLeft, Vote, Star, ShieldCheck, ChevronRight, 
  FileText, Video, LayoutDashboard, MessageSquare, 
  Linkedin, Facebook, Twitter, ExternalLink, Users
} from "lucide-react";
import SEOHead from "@/components/SEOHead";
import type { ElectionCandidate } from "@shared/schema";

export default function ElectionCandidates() {
  const [, setLocation] = useLocation();
  const [selectedLeader, setSelectedLeader] = useState<ElectionCandidate | null>(null);

  const { data: candidates, isLoading } = useQuery<ElectionCandidate[]>({
    queryKey: ["/api/elections/candidates"],
  });

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

  const handleGoToVote = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setLocation('/elections/voter');
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 overflow-hidden relative">
      <SEOHead 
        title="Candidats Présélectionnés - SAYC"
        description="Découvrez les profils des candidats validés pour les élections SAYC Tchad."
        path="/elections/candidats"
      />

      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sayc-teal/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border shadow-sm">
        <div className="flex items-center gap-3 p-4 container mx-auto max-w-6xl">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/elections")} className="hover:bg-muted rounded-full shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-primary truncate">
              Découverte des Candidats
            </h1>
            <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-sayc-teal" /> Élections Officielles
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 md:p-8 container mx-auto max-w-6xl space-y-12 mt-4">
        
        {/* Intro Banner (Identique à l'Accueil) */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl shadow-xl bg-gradient-to-br from-sidebar via-sidebar to-sidebar/95 text-sidebar-foreground"
        >
          <div className="absolute -top-24 -right-24 p-8 opacity-10 scale-150 transform rotate-12">
             <Users className="h-96 w-96 text-sidebar-foreground" />
          </div>
          
          <div className="relative z-10 p-8 md:p-14 space-y-6">
            <Badge variant="secondary" className="bg-accent/20 text-accent border-accent/30 text-sm rounded-full">
              Phase Découverte
            </Badge>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight font-heading">
              Nos Leaders de Demain.<br/>
              <span className="text-accent">Avenir Commun.</span>
            </h2>
            <p className="text-sidebar-foreground/80 max-w-3xl text-lg md:text-xl font-light leading-relaxed">
              Plongez dans les programmes d'action, les pitchs et les visions portés par nos candidats exceptionnels. Préparez-vous à exprimer votre choix en toute connaissance.
            </p>

            <div className="pt-4">
               <Button 
                 onClick={() => setLocation('/elections/voter')} 
                 className="bg-accent text-accent-foreground hover:bg-accent/90 h-12 px-8 rounded-full font-bold shadow-lg shadow-accent/20"
               >
                 <Vote className="w-5 h-5 mr-2" /> Aller au bureau de vote
               </Button>
            </div>
          </div>
        </motion.div>

        {/* Candidate Grid */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h3 className="text-2xl font-heading font-bold flex items-center gap-3">
              <Star className="h-6 w-6 text-accent" />
              Candidats Validés
            </h3>
            {candidates && candidates.length > 0 && (
              <Badge variant="outline" className="bg-sayc-teal/10 text-sayc-teal border-sayc-teal/20 self-start md:self-center font-bold px-3 py-1">
                {candidates.length} Profil{candidates.length > 1 ? 's' : ''} disponible{candidates.length > 1 ? 's' : ''}
              </Badge>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(n => (
                <Card key={n} className="overflow-hidden border-border bg-card shadow-sm h-96 flex flex-col">
                  <Skeleton className="h-72 w-full bg-muted" />
                  <div className="p-4 flex-1 space-y-3">
                    <Skeleton className="h-5 w-3/4 bg-muted" />
                    <Skeleton className="h-4 w-1/2 bg-muted/60" />
                  </div>
                </Card>
              ))}
            </div>
          ) : !candidates || candidates.length === 0 ? (
            <div className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed border-border">
              <Users className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-muted-foreground mb-2">Aucun candidat validé</h3>
              <p className="text-muted-foreground/80 max-w-sm mx-auto">
                L'équipe administrative n'a pas encore validé les candidats finaux pour cette élection.
              </p>
            </div>
          ) : (
            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {candidates.map((candidate) => (
                <motion.div key={candidate.id} variants={item} className="h-full">
                  <Card 
                    className="group h-full cursor-pointer overflow-hidden relative bg-card text-card-foreground flex flex-col transition-all duration-300 rounded-2xl border hover-elevate border-transparent hover:border-border shadow-md"
                    onClick={() => setSelectedLeader(candidate)}
                  >
                    {/* Image container */}
                    <div className="relative h-72 overflow-hidden bg-muted flex-shrink-0">
                      <img 
                        src={candidate.photoUrl} 
                        alt={`${candidate.firstName} ${candidate.nomSpecifiqueUnique}`} 
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://via.placeholder.com/400x500?text=Candidat";
                        }}
                      />
                      <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent z-0" />
                      
                      <div className="absolute bottom-4 left-5 right-5 z-20">
                        <h4 className="text-lg md:text-xl font-heading font-bold text-white drop-shadow-md leading-tight">
                          {candidate.firstName} <br/>
                          <span className="opacity-90">{candidate.nomSpecifiqueUnique}</span>
                        </h4>
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col bg-background">
                      <Badge className="bg-primary/10 text-primary border-primary/20 w-fit mb-4">
                        {candidate.role}
                      </Badge>
                      
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                        <span className="text-sm font-medium text-muted-foreground">Voir le profil & programme</span>
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 group-hover:bg-accent group-hover:text-accent-foreground transition-all duration-300 border border-border">
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </main>

      {/* Profile Modal */}
      <AnimatePresence>
        {selectedLeader && (
          <Dialog open={!!selectedLeader} onOpenChange={(open) => !open && setSelectedLeader(null)}>
            <DialogContent className="max-w-4xl p-0 overflow-hidden bg-card text-card-foreground shadow-2xl rounded-2xl border border-border">
              
              <div className="flex flex-col md:flex-row h-full max-h-[90vh]">
                {/* Modal Header Image - Left side on desktop */}
                <div className="relative h-64 md:h-auto md:w-2/5 md:flex-shrink-0 bg-muted overflow-hidden">
                  <img 
                     src={selectedLeader.photoUrl} 
                     className="w-full h-full object-cover object-top" 
                     alt={`${selectedLeader.firstName} ${selectedLeader.nomSpecifiqueUnique}`} 
                     onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://via.placeholder.com/400x500?text=Candidat";
                     }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent md:bg-black/10" />
                  
                  {/* Social Links on Image */}
                  <div className="absolute top-6 left-6 right-6 flex justify-end gap-2 z-20">
                    {selectedLeader.linkedInUrl && (
                      <a href={selectedLeader.linkedInUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white hover:bg-[#0a66c2] transition-colors" title="LinkedIn">
                        <Linkedin className="w-5 h-5" />
                      </a>
                    )}
                    {selectedLeader.twitterUrl && (
                      <a href={selectedLeader.twitterUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white hover:bg-[#1da1f2] transition-colors" title="Twitter">
                        <Twitter className="w-5 h-5" />
                      </a>
                    )}
                    {selectedLeader.facebookUrl && (
                      <a href={selectedLeader.facebookUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white hover:bg-[#1877f2] transition-colors" title="Facebook">
                        <Facebook className="w-5 h-5" />
                      </a>
                    )}
                  </div>

                  <div className="absolute bottom-6 left-6 right-6 md:hidden">
                     <Badge className="bg-primary/20 backdrop-blur-md text-white border-white/20 px-3 py-1 shadow-md w-fit">
                        {selectedLeader.role}
                     </Badge>
                     <h2 className="text-3xl font-extrabold font-heading text-white mt-2 drop-shadow-lg">
                        {selectedLeader.firstName} <br/> {selectedLeader.nomSpecifiqueUnique}
                     </h2>
                  </div>
                </div>

                {/* Modal Body - Right side on desktop */}
                <div className="p-6 md:p-10 md:w-3/5 overflow-y-auto w-full space-y-8 flex flex-col bg-background">
                  
                  <div className="space-y-3 hidden md:block">
                     <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 text-sm tracking-wide">
                        Poste Visé : {selectedLeader.role}
                     </Badge>
                     <h2 className="text-4xl md:text-5xl font-extrabold font-heading text-foreground">
                        {selectedLeader.firstName} <br/>
                        <span className="text-primary">{selectedLeader.nomSpecifiqueUnique}</span>
                     </h2>
                  </div>
                  
                  <div className="space-y-6 flex-1 pt-4 md:pt-0">
                    <div>
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span className="w-4 h-[1px] bg-border block"></span> Documents de Campagne
                      </h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         {selectedLeader.cvUrl && (
                           <a href={selectedLeader.cvUrl} target="_blank" rel="noopener noreferrer" className="block focus:outline-none">
                              <Card className="p-4 flex flex-col items-center justify-center gap-3 bg-card hover:bg-primary hover:text-primary-foreground border border-border shadow-sm transition-colors group cursor-pointer text-center h-full">
                                 <FileText className="w-8 h-8 text-muted-foreground group-hover:text-primary-foreground/90 transition-colors" />
                                 <span className="font-semibold text-sm">Mon CV</span>
                              </Card>
                           </a>
                         )}

                         {selectedLeader.motivationUrl && (
                           <a href={selectedLeader.motivationUrl} target="_blank" rel="noopener noreferrer" className="block focus:outline-none">
                              <Card className="p-4 flex flex-col items-center justify-center gap-3 bg-card hover:bg-primary hover:text-primary-foreground border border-border shadow-sm transition-colors group cursor-pointer text-center h-full">
                                 <MessageSquare className="w-8 h-8 text-muted-foreground group-hover:text-primary-foreground/90 transition-colors" />
                                 <span className="font-semibold text-sm">Lettre de Motivation</span>
                              </Card>
                           </a>
                         )}

                         {selectedLeader.programUrl && (
                           <a href={selectedLeader.programUrl} target="_blank" rel="noopener noreferrer" className="block focus:outline-none sm:col-span-2">
                              <Card className="p-4 flex flex-row items-center gap-4 bg-sayc-teal/5 border-sayc-teal/20 shadow-sm hover:bg-sayc-teal hover:border-sayc-teal transition-colors group cursor-pointer h-full">
                                 <div className="p-3 bg-sayc-teal/10 rounded-full group-hover:bg-white/20">
                                    <LayoutDashboard className="w-6 h-6 text-sayc-teal group-hover:text-white" />
                                 </div>
                                 <div className="text-left flex-1">
                                    <span className="block font-bold text-sayc-teal group-hover:text-white transition-colors">Programme Électoral</span>
                                    <span className="text-xs text-muted-foreground group-hover:text-white/80">Lire les propositions concrètes</span>
                                 </div>
                                 <ExternalLink className="w-5 h-5 text-sayc-teal group-hover:text-white" />
                              </Card>
                           </a>
                         )}

                         {selectedLeader.videoUrl && (
                           <a href={selectedLeader.videoUrl} target="_blank" rel="noopener noreferrer" className="block focus:outline-none sm:col-span-2">
                              <Card className="p-4 flex flex-row items-center gap-4 bg-accent/5 border-accent/20 shadow-sm hover:bg-accent hover:border-accent transition-colors group cursor-pointer h-full">
                                 <div className="p-3 bg-accent/10 rounded-full group-hover:bg-white/20">
                                    <Video className="w-6 h-6 text-accent group-hover:text-white" />
                                 </div>
                                 <div className="text-left flex-1">
                                    <span className="block font-bold text-accent group-hover:text-white transition-colors">Pitch Vidéo</span>
                                    <span className="text-xs text-muted-foreground group-hover:text-white/80">Voir ma déclaration sur Youtube</span>
                                 </div>
                                 <ExternalLink className="w-5 h-5 text-accent group-hover:text-white" />
                              </Card>
                           </a>
                         )}
                      </div>
                    </div>
                  </div>

                  {/* Call to Action Wrapper */}
                  <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto">
                    <p className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-sayc-teal" />
                      Prêt(e) à voter ?
                    </p>
                    <Button 
                      onClick={handleGoToVote}
                      className="w-full sm:w-auto px-8 bg-[#1e3a8a] hover:bg-blue-900 text-white shadow-md h-12 rounded-xl text-base font-bold group" 
                    >
                      Aller Voter
                      <ChevronRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
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
