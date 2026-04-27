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
  ArrowLeft, Star, ShieldCheck, ChevronRight, 
  FileText, Video, LayoutDashboard, MessageSquare, 
  Linkedin, Facebook, Twitter, ExternalLink, Award, Users,
  CheckCircle2, Megaphone
} from "lucide-react";
import SEOHead from "@/components/SEOHead";
import type { ElectionCandidate } from "@shared/schema";

// Last Update: 2026-04-27 17:35
export default function ElectionCandidates() {
  const [, setLocation] = useLocation();
  const [selectedLeader, setSelectedLeader] = useState<ElectionCandidate | null>(null);

  const { data: candidates, isLoading } = useQuery<ElectionCandidate[]>({
    queryKey: ["/api/elections/candidates"],
  });

  const roles = ["Leader Adjoint", "Académique", "Inclusion", "Secteur Privé"];
  
  // Logic to identify winners and runners-up
  const board = roles.map(role => {
    const roleCandidates = candidates?.filter(c => c.role === role).sort((a, b) => b.votesCount - a.votesCount) || [];
    return {
      role,
      leader: roleCandidates[0],
      assistant: roleCandidates[1]
    };
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

  return (
    <div className="min-h-screen bg-slate-50 text-foreground pb-20 overflow-hidden relative">
      <SEOHead 
        title="Bureau National 2026-2028 - SAYC Tchad"
        description="Découvrez les leaders officiellement élus pour diriger le SAYC Tchad."
        path="/elections/candidats"
      />

      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sayc-teal/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 p-4 container mx-auto max-w-6xl">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/elections")} className="hover:bg-slate-100 rounded-full shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-black text-[#1e3a8a] truncate uppercase tracking-tight">
              Bureau National 2026-2028
            </h1>
            <p className="text-xs text-slate-500 font-bold flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-emerald-500" /> Mandat Officiel Affirmé
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 md:p-8 container mx-auto max-w-6xl space-y-12 mt-4">
        
        {/* Proclamation Banner */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[2.5rem] shadow-2xl bg-gradient-to-br from-[#1e3a8a] to-[#1e40af] text-white p-8 md:p-14"
        >
          <div className="absolute -top-24 -right-24 p-8 opacity-10 scale-150 transform rotate-12">
             <Award className="h-96 w-96 text-white" />
          </div>
          
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <Badge className="bg-emerald-500 text-white border-none px-4 py-1.5 rounded-full font-black text-xs">OFFICIEL</Badge>
              <Badge className="bg-white/10 text-white border-white/20 px-4 py-1.5 rounded-full font-black text-xs uppercase">Mandat 2026-2028</Badge>
            </div>
            <h2 className="text-4xl md:text-6xl font-black leading-tight">
              L'excellence au service <br/>
              <span className="text-sayc-teal italic">du Numérique Tchadien.</span>
            </h2>
            <p className="text-blue-100 max-w-3xl text-lg md:text-xl font-medium leading-relaxed">
              Le SAYC Tchad est fier de présenter son nouveau Bureau National. Suite à une élection transparente et une étude rigoureuse, ces leaders ont été choisis pour porter notre vision commune vers de nouveaux sommets.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
               <div className="flex items-center gap-2 bg-white/10 px-6 py-3 rounded-2xl border border-white/10 font-bold">
                 <ShieldCheck className="w-5 h-5 text-sayc-teal" /> Élection Certifiée
               </div>
               <div className="flex items-center gap-2 bg-white/10 px-6 py-3 rounded-2xl border border-white/10 font-bold">
                 <Users className="w-5 h-5 text-sayc-teal" /> 1697 Votants
               </div>
            </div>
          </div>
        </motion.div>

        {/* National Leader Special Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="relative max-w-4xl mx-auto"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-sayc-teal/20 to-[#1e3a8a]/20 blur-3xl rounded-full" />
          <Card className="relative overflow-hidden bg-white border-4 border-[#1e3a8a] shadow-[0_20px_50px_rgba(30,58,138,0.3)] rounded-[3rem]">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 relative h-[450px] overflow-hidden">
                <img 
                  src="/images/leader.jpg" 
                  alt="Souleymane Mahamat Saleh" 
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1e3a8a]/40 to-transparent" />
                <div className="absolute top-6 left-6">
                  <Badge className="bg-[#1e3a8a] text-white border-none px-4 py-2 rounded-full font-black text-xs shadow-lg">
                    REPRÉSENTANT OFFICIEL
                  </Badge>
                </div>
              </div>
              <div className="md:w-1/2 p-10 md:p-16 flex flex-col justify-center space-y-6">
                <div className="space-y-2">
                  <Badge variant="outline" className="border-sayc-teal text-sayc-teal px-3 py-1 font-black text-[10px] uppercase tracking-widest">
                    Smart Africa Alliance
                  </Badge>
                  <h2 className="text-4xl md:text-5xl font-black text-[#1e3a8a] leading-tight">
                    Souleymane <br/>
                    <span className="text-sayc-teal italic">Mahamat Saleh</span>
                  </h2>
                </div>
                <div className="space-y-4">
                   <div className="flex items-center gap-3">
                     <Award className="w-8 h-8 text-amber-400" />
                     <p className="text-xl font-black text-[#1e3a8a] uppercase tracking-tighter">Leader National</p>
                   </div>
                   <p className="text-slate-500 font-medium leading-relaxed">
                     Mandaté par l'alliance mère **Smart Africa**, il assure la direction stratégique et la représentation diplomatique du SAYC Tchad au niveau continental.
                   </p>
                </div>
                <div className="pt-4 flex gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-slate-50 border flex items-center justify-center text-[#1e3a8a] hover:bg-[#1e3a8a] hover:text-white transition-all cursor-pointer shadow-sm">
                    <Linkedin className="w-5 h-5" />
                  </div>
                  <div className="h-12 w-12 rounded-2xl bg-slate-50 border flex items-center justify-center text-[#1e3a8a] hover:bg-[#1e3a8a] hover:text-white transition-all cursor-pointer shadow-sm">
                    <Twitter className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Board Grid */}
        <div className="space-y-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-3xl font-black text-[#1e3a8a] flex items-center gap-3">
                <Star className="h-8 w-8 text-amber-400 fill-amber-400" />
                Tableau d'Honneur
              </h3>
              <p className="text-slate-500 font-medium">Les Leaders et Assistants investis pour la réussite du Tchad.</p>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map(n => (
                <Skeleton key={n} className="h-96 w-full rounded-3xl" />
              ))}
            </div>
          ) : (
            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 gap-12"
            >
              {board.map((group, idx) => (
                <motion.div key={idx} variants={item} className="space-y-6">
                  <div className="flex items-center gap-3 px-2">
                    <div className="w-10 h-1 bg-sayc-teal rounded-full" />
                    <h4 className="text-xl font-black text-[#1e3a8a] uppercase tracking-wider">{group.role}</h4>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    {/* Leader Card */}
                    {group.leader && (
                      <Card 
                        className="group overflow-hidden relative bg-white border-2 border-[#1e3a8a]/10 hover:border-[#1e3a8a]/30 shadow-xl rounded-[2rem] transition-all duration-500 hover:-translate-y-2 cursor-pointer"
                        onClick={() => setSelectedLeader(group.leader!)}
                      >
                        <div className="flex flex-col sm:flex-row">
                          <div className="relative h-64 sm:h-auto sm:w-48 overflow-hidden bg-slate-100 shrink-0">
                            <img 
                              src={group.leader.photoUrl} 
                              alt={group.leader.firstName} 
                              className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#1e3a8a]/60 to-transparent" />
                          </div>
                          <div className="p-8 flex-1 flex flex-col justify-center relative">
                            <div className="absolute top-6 right-6">
                               <Award className="w-10 h-10 text-amber-400 fill-amber-400/20" />
                            </div>
                            <Badge className="bg-amber-400 text-amber-950 border-none px-4 py-1 rounded-full font-black text-[10px] mb-3 w-fit">LEADER ÉLU</Badge>
                            <h5 className="text-2xl font-black text-[#1e3a8a] leading-tight">
                              {group.leader.firstName} <br/>
                              <span className="uppercase">{group.leader.nomSpecifiqueUnique}</span>
                            </h5>
                            <div className="mt-4 flex items-center gap-2 text-slate-500 font-bold text-sm">
                               Voir le profil <ChevronRight className="w-4 h-4" />
                            </div>
                          </div>
                        </div>
                      </Card>
                    )}

                    {/* Assistant Card */}
                    {group.assistant && (
                      <Card 
                        className="group overflow-hidden relative bg-slate-100/50 border border-slate-200 hover:border-slate-300 shadow-lg rounded-[1.5rem] transition-all duration-500 hover:-translate-y-1 cursor-pointer"
                        onClick={() => setSelectedLeader(group.assistant!)}
                      >
                        <div className="flex items-center gap-6 p-6">
                          <div className="relative w-20 h-20 overflow-hidden rounded-2xl shrink-0 border-2 border-white shadow-md">
                            <img 
                              src={group.assistant.photoUrl} 
                              alt={group.assistant.firstName} 
                              className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700"
                            />
                          </div>
                          <div className="flex-1">
                            <Badge className="bg-slate-200 text-slate-600 border-none px-3 py-0.5 rounded-full font-black text-[9px] mb-1.5 w-fit uppercase">Assistant</Badge>
                            <h6 className="text-lg font-bold text-slate-700 leading-tight">
                              {group.assistant.firstName} {group.assistant.nomSpecifiqueUnique}
                            </h6>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500 transition-colors" />
                        </div>
                      </Card>
                    )}
                  </div>
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
            <DialogContent className="max-w-4xl p-0 overflow-hidden bg-white shadow-2xl rounded-[2.5rem] border-none">
              <div className="flex flex-col md:flex-row h-full max-h-[90vh]">
                <div className="relative h-64 md:h-auto md:w-2/5 md:flex-shrink-0 bg-slate-100 overflow-hidden">
                  <img 
                     src={selectedLeader.photoUrl} 
                     className="w-full h-full object-cover object-top" 
                     alt={`${selectedLeader.firstName} ${selectedLeader.nomSpecifiqueUnique}`} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1e3a8a]/80 via-transparent to-transparent" />
                  
                  <div className="absolute top-6 left-6 right-6 flex justify-end gap-2 z-20">
                    {selectedLeader.linkedInUrl && (
                      <a href={selectedLeader.linkedInUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white hover:bg-[#0a66c2] transition-colors">
                        <Linkedin className="w-5 h-5" />
                      </a>
                    )}
                  </div>

                  <div className="absolute bottom-8 left-8 right-8">
                     <Badge className="bg-sayc-teal text-white border-none px-4 py-1 mb-3 rounded-full font-black text-[10px]">
                        {selectedLeader.role}
                     </Badge>
                     <h2 className="text-3xl font-black text-white leading-tight">
                        {selectedLeader.firstName} <br/> {selectedLeader.nomSpecifiqueUnique}
                     </h2>
                  </div>
                </div>

                <div className="p-10 md:w-3/5 overflow-y-auto w-full space-y-8 flex flex-col bg-white">
                  <div className="space-y-6 flex-1">
                    <div>
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                        <span className="w-8 h-[2px] bg-sayc-teal block"></span> Documents Officiels
                      </h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         {selectedLeader.programUrl && (
                           <a href={selectedLeader.programUrl} target="_blank" rel="noopener noreferrer" className="block focus:outline-none sm:col-span-2">
                              <Card className="p-6 flex flex-row items-center gap-5 bg-slate-50 border border-slate-100 shadow-sm hover:bg-[#1e3a8a] hover:text-white transition-all group cursor-pointer rounded-3xl h-full">
                                 <div className="p-4 bg-[#1e3a8a]/5 rounded-2xl group-hover:bg-white/10">
                                    <LayoutDashboard className="w-7 h-7 text-[#1e3a8a] group-hover:text-white" />
                                 </div>
                                 <div className="text-left flex-1">
                                    <span className="block font-black text-lg group-hover:text-white">Vision & Programme</span>
                                    <span className="text-sm text-slate-500 group-hover:text-blue-100">Plan d'action 2026-2028</span>
                                 </div>
                                 <ExternalLink className="w-6 h-6 opacity-30 group-hover:opacity-100 transition-opacity" />
                              </Card>
                           </a>
                         )}

                         {selectedLeader.videoUrl && (
                           <a href={selectedLeader.videoUrl} target="_blank" rel="noopener noreferrer" className="block focus:outline-none">
                              <Card className="p-5 flex flex-col items-center justify-center gap-3 bg-white border border-slate-100 shadow-sm hover:border-accent transition-all group cursor-pointer text-center h-full rounded-3xl">
                                 <div className="p-3 bg-accent/5 rounded-2xl group-hover:bg-accent group-hover:text-white transition-colors">
                                    <Video className="w-6 h-6 text-accent group-hover:text-white" />
                                 </div>
                                 <span className="font-black text-sm">Pitch Vidéo</span>
                              </Card>
                           </a>
                         )}

                         {selectedLeader.cvUrl && (
                           <a href={selectedLeader.cvUrl} target="_blank" rel="noopener noreferrer" className="block focus:outline-none">
                              <Card className="p-5 flex flex-col items-center justify-center gap-3 bg-white border border-slate-100 shadow-sm hover:border-[#1e3a8a] transition-all group cursor-pointer text-center h-full rounded-3xl">
                                 <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-[#1e3a8a] group-hover:text-white transition-colors">
                                    <FileText className="w-6 h-6 text-slate-400 group-hover:text-white" />
                                 </div>
                                 <span className="font-black text-sm">Parcours (CV)</span>
                              </Card>
                           </a>
                         )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-slate-100 text-center">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                       <ShieldCheck className="w-4 h-4 text-emerald-500" /> Profil Certifié par le Comité National
                    </p>
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
