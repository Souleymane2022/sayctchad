import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ThunderbirdApplication } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Users, Award, ShieldCheck, Search, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import jsPDF from "jspdf";
import { toPng } from "html-to-image";
import SEOHead from "@/components/SEOHead";

const ITEMS_PER_PAGE = 50;

export default function ThunderbirdResults() {
  const [searchTerm, setSearchTerm] = useState("");
  const [genderFilter, setGenderFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: results, isLoading } = useQuery<ThunderbirdApplication[]>({
    queryKey: ["/api/thunderbird/results"],
  });

  const exportPDF = async () => {
    const element = document.getElementById("results-content");
    if (!element) return;

    try {
      const dataUrl = await toPng(element, { quality: 0.95, pixelRatio: 2 });
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("Resultats_Bourse_Thunderbird_SAYC.pdf");
    } catch (error) {
      console.error("PDF Export failed", error);
    }
  };

  const statsData = useMemo(() => {
    if (!results) return [];
    const male = results.filter(r => {
      const g = r.gender?.toLowerCase() || "";
      return g === "masculin" || g === "male" || g === "m" || g === "homme";
    }).length;
    const female = results.filter(r => {
      const g = r.gender?.toLowerCase() || "";
      return g === "féminin" || g === "female" || g === "f" || g === "femme";
    }).length;
    return [
      { name: "Hommes", value: male, color: "#1E3A5F" },
      { name: "Femmes", value: female, color: "#D4AF37" },
    ];
  }, [results]);

  const filteredResults = useMemo(() => {
    if (!results) return [];
    return results.filter(app => {
      const matchesSearch = app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          app.city?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const g = app.gender?.toLowerCase() || "";
      const isMale = g === "masculin" || g === "male" || g === "m" || g === "homme";
      const isFemale = g === "féminin" || g === "female" || g === "f" || g === "femme";
      
      const matchesGender = genderFilter === "all" || 
                          (genderFilter === "male" && isMale) || 
                          (genderFilter === "female" && isFemale);
      
      return matchesSearch && matchesGender;
    });
  }, [results, searchTerm, genderFilter]);

  const totalPages = Math.ceil(filteredResults.length / ITEMS_PER_PAGE);
  const displayedResults = filteredResults.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <SEOHead 
        title="Résultats Bourse Thunderbird | 100 Million Learners" 
        description="Liste officielle des 50 candidats retenus pour la bourse Thunderbird School of Global Management - Initiative Najafi 100 Million Learners."
        path="/programmes/thunderbird/resultats"
      />

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Rechercher un nom ou une ville..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              />
            </div>
            <div className="flex bg-white rounded-lg border border-slate-200 p-1">
              <Button 
                variant={genderFilter === "all" ? "default" : "ghost"}
                size="sm"
                onClick={() => { setGenderFilter("all"); setCurrentPage(1); }}
                className={genderFilter === "all" ? "bg-[#1E3A5F]" : ""}
              >
                Tous
              </Button>
              <Button 
                variant={genderFilter === "male" ? "default" : "ghost"}
                size="sm"
                onClick={() => { setGenderFilter("male"); setCurrentPage(1); }}
                className={genderFilter === "male" ? "bg-[#1E3A5F]" : ""}
              >
                Hommes
              </Button>
              <Button 
                variant={genderFilter === "female" ? "default" : "ghost"}
                size="sm"
                onClick={() => { setGenderFilter("female"); setCurrentPage(1); }}
                className={genderFilter === "female" ? "bg-[#1E3A5F]" : ""}
              >
                Femmes
              </Button>
            </div>
          </div>
          <Button onClick={exportPDF} className="bg-[#1E3A5F] hover:bg-[#162a45] text-white flex items-center gap-2 w-full md:w-auto">
            <Download className="h-4 w-4" />
            Télécharger la Liste (PDF)
          </Button>
        </div>

        <div id="results-content" className="bg-white shadow-2xl rounded-xl overflow-hidden p-8 md:p-12 border border-slate-200">
          <div className="flex flex-wrap justify-between items-center gap-8 mb-12 pb-8 border-b border-slate-100">
            <img src="/favicon.png" alt="SAYC Logo" className="h-20 w-auto" />
            <div className="flex gap-8 flex-wrap items-center">
               <div className="flex flex-col items-center">
                 <span className="text-[10px] text-slate-400 font-bold tracking-tighter uppercase mb-1">Partenaire</span>
                 <div className="h-12 flex items-center justify-center font-black text-2xl text-[#1E3A5F]">SADA</div>
               </div>
               <div className="flex flex-col items-center">
                 <span className="text-[10px] text-slate-400 font-bold tracking-tighter uppercase mb-1">Institution</span>
                 <div className="h-12 flex items-center justify-center font-black text-2xl text-[#8C1D40]">THUNDERBIRD / ASU</div>
               </div>
               <div className="flex flex-col items-center">
                 <span className="text-[10px] text-slate-400 font-bold tracking-tighter uppercase mb-1">Initiative</span>
                 <div className="h-12 flex items-center justify-center font-black text-2xl text-[#FF9900]">SMART AFRICA</div>
               </div>
            </div>
          </div>

          <div className="text-center mb-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-3xl md:text-5xl font-extrabold text-[#1E3A5F] mb-4 tracking-tight">
                Liste Officielle des Lauréats
              </h1>
              <div className="w-24 h-1 bg-[#D4AF37] mx-auto mb-6"></div>
              <p className="text-2xl text-[#8C1D40] font-bold mb-2">
                Bourse Thunderbird School of Global Management
              </p>
              <p className="text-slate-500 font-medium uppercase tracking-[0.2em] text-sm">
                Initiative Najafi 100 Million Learners
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 gap-6 mb-12">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b-2 border-slate-200 bg-slate-50/50">
                    <th className="py-5 px-6 font-bold text-[#1E3A5F] w-20">Rang</th>
                    <th className="py-5 px-6 font-bold text-[#1E3A5F]">Nom et Prénoms</th>
                    <th className="py-5 px-6 font-bold text-[#1E3A5F] w-32">Genre</th>
                    <th className="py-5 px-6 font-bold text-[#1E3A5F] w-40">Ville</th>
                    <th className="py-5 px-6 font-bold text-[#1E3A5F] text-right w-32">Mention</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence mode="popLayout">
                    {displayedResults.map((app, index) => (
                      <motion.tr 
                        key={app.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors group"
                      >
                        <td className="py-5 px-6 font-bold text-slate-300">#{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                        <td className="py-5 px-6">
                          <div className="font-bold text-slate-800 text-lg uppercase">{app.fullName}</div>
                        </td>
                        <td className="py-5 px-6">
                           <span className={`px-2 py-1 rounded text-xs font-bold ${
                             (app.gender?.toLowerCase() === 'f' || app.gender?.toLowerCase() === 'féminin') 
                             ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                           }`}>
                             {app.gender || '-'}
                           </span>
                        </td>
                        <td className="py-5 px-6 text-slate-500 font-medium">{app.city}</td>
                        <td className="py-5 px-6 text-right">
                          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter bg-green-500 text-white shadow-sm">
                            <ShieldCheck className="w-3 h-3 mr-1.5" />
                            Retenu
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              <AnimatePresence mode="popLayout">
                {displayedResults.map((app, index) => (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="bg-slate-50 border border-slate-200 rounded-xl p-5 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-2">
                       <span className="bg-green-500 text-white text-[10px] font-black px-2 py-1 rounded-bl-lg uppercase">
                         Retenu
                       </span>
                    </div>
                    <div className="flex items-center gap-4 mb-3">
                      <div className="text-2xl font-black text-slate-300">
                        #{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                      </div>
                      <div>
                        <div className="font-bold text-[#1E3A5F] uppercase text-sm leading-tight">
                          {app.fullName}
                        </div>
                        <div className="text-xs text-slate-400 font-medium mt-1">
                          {app.city || "Ville non précisée"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        (app.gender?.toLowerCase() === 'f' || app.gender?.toLowerCase() === 'féminin') 
                        ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {app.gender === 'F' ? 'Femme' : app.gender === 'M' ? 'Homme' : app.gender}
                      </span>
                      <ShieldCheck className="w-4 h-4 text-green-500" />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {filteredResults.length === 0 && (
              <div className="py-20 text-center text-slate-400 italic">
                Aucun résultat trouvé pour cette recherche.
              </div>
            )}
          </div>

          <div className="flex justify-between items-center py-6 border-t border-slate-100 mb-12">
            <p className="text-sm text-slate-500 font-medium">
              Affichage de {displayedResults.length} sur {filteredResults.length} lauréats
            </p>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center px-4 text-sm font-bold text-[#1E3A5F]">
                Page {currentPage} / {totalPages || 1}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center pt-12 border-t-2 border-slate-100">
            <div>
              <h2 className="text-2xl font-black text-[#1E3A5F] mb-8 flex items-center gap-3">
                <Users className="h-7 w-7" />
                Démographie des Lauréats
              </h2>
              <div className="space-y-6">
                {statsData.map((stat) => (
                  <div key={stat.name} className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-slate-700 uppercase text-sm tracking-wide">{stat.name}</span>
                      <span className="font-black text-xl" style={{ color: stat.color }}>
                        {((stat.value / (results?.length || 1)) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(stat.value / (results?.length || 1)) * 100}%` }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: stat.color }}
                      />
                    </div>
                    <p className="mt-1 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                      {stat.value} candidats sélectionnés
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {statsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-20 text-center">
            <div className="inline-block px-8 py-4 border-2 border-slate-100 rounded-full text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">
              Certifié par Smart Africa Youth Chapter Tchad © 2026
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
