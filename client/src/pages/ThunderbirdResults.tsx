import { useQuery } from "@tanstack/react-query";
import { ThunderbirdApplication } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Users, Award, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import jsPDF from "jspdf";
import { toPng } from "html-to-image";
import SEOHead from "@/components/SEOHead";

export default function ThunderbirdResults() {
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

  const getStats = () => {
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
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const statsData = getStats();

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <SEOHead 
        title="Résultats Bourse Thunderbird | 100 Million Learners" 
        description="Liste officielle des 50 candidats retenus pour la bourse Thunderbird School of Global Management - Initiative Najafi 100 Million Learners."
        path="/programmes/thunderbird/resultats"
      />

      <div className="max-w-5xl mx-auto">
        <div className="flex justify-end mb-8">
          <Button onClick={exportPDF} className="bg-[#1E3A5F] hover:bg-[#162a45] text-white flex items-center gap-2">
            <Download className="h-4 w-4" />
            Télécharger la liste (PDF)
          </Button>
        </div>

        <div id="results-content" className="bg-white shadow-2xl rounded-xl overflow-hidden p-8 md:p-12 border border-slate-200">
          {/* Header Logos */}
          <div className="flex flex-wrap justify-between items-center gap-8 mb-12 pb-8 border-b border-slate-100">
            <img src="/favicon.png" alt="SAYC Logo" className="h-16 w-auto grayscale-0" />
            <div className="flex gap-6">
               {/* Placeholders for logos that will be uploaded */}
               <div className="h-16 flex items-center justify-center font-bold text-[#1E3A5F]">SADA</div>
               <div className="h-16 flex items-center justify-center font-bold text-[#8C1D40]">THUNDERBIRD / ASU</div>
               <div className="h-16 flex items-center justify-center font-bold text-[#FF9900]">SMART AFRICA</div>
            </div>
          </div>

          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold text-[#1E3A5F] mb-4">
                Liste Officielle des Lauréats
              </h1>
              <p className="text-xl text-[#8C1D40] font-semibold mb-2">
                Bourse Thunderbird School of Global Management
              </p>
              <p className="text-slate-500 uppercase tracking-widest text-sm">
                Initiative Najafi 100 Million Learners
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 gap-8 mb-16">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-100">
                    <th className="py-4 px-6 font-bold text-[#1E3A5F] w-16">N°</th>
                    <th className="py-4 px-6 font-bold text-[#1E3A5F]">Nom Complet</th>
                    <th className="py-4 px-6 font-bold text-[#1E3A5F]">Genre</th>
                    <th className="py-4 px-6 font-bold text-[#1E3A5F]">Ville</th>
                    <th className="py-4 px-6 font-bold text-[#1E3A5F] text-right">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {results?.map((app, index) => (
                    <motion.tr 
                      key={app.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
                    >
                      <td className="py-4 px-6 font-medium text-slate-400">{index + 1}</td>
                      <td className="py-4 px-6 font-semibold text-slate-800">{app.fullName}</td>
                      <td className="py-4 px-6 text-slate-600">{app.gender}</td>
                      <td className="py-4 px-6 text-slate-600">{app.city}</td>
                      <td className="py-4 px-6 text-right">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <ShieldCheck className="w-3 h-3 mr-1" />
                          Retenu
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center pt-12 border-t border-slate-100">
            <div>
              <h2 className="text-2xl font-bold text-[#1E3A5F] mb-6 flex items-center gap-2">
                <Users className="h-6 w-6" />
                Statistiques de Genre
              </h2>
              <div className="space-y-4">
                {statsData.map((stat) => (
                  <div key={stat.name} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stat.color }} />
                      <span className="font-semibold text-slate-700">{stat.name}</span>
                    </div>
                    <span className="text-xl font-bold" style={{ color: stat.color }}>
                      {((stat.value / (results?.length || 1)) * 100).toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-16 text-center text-slate-400 text-xs italic">
            Certifié par Smart Africa Youth Chapter Tchad (SAYC Tchad). 2026.
          </div>
        </div>
      </div>
    </div>
  );
}
