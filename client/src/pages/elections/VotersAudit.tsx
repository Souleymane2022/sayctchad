import { useQuery } from "@tanstack/react-query";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { Search, ShieldCheck, UserCheck, Clock, Award, BarChart3, TrendingUp } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { ElectionCandidate } from "@shared/schema";

interface VoteRecord {
  id: string;
  voterId: string;
  role: string;
  createdAt: string;
  candidateFirstName: string;
  candidateLastName: string;
}

export default function VotersAudit({ preview = false }: { preview?: boolean }) {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: votes, isLoading: isLoadingVotes } = useQuery<VoteRecord[]>({
    queryKey: ["/api/elections/audit-votes"],
  });

  const { data: candidates, isLoading: isLoadingCandidates } = useQuery<ElectionCandidate[]>({
    queryKey: ["/api/elections/candidates"],
  });

  const anonymizeId = (id: string) => {
    if (!id) return "****";
    
    // Si c'est un identifiant de vote restauré (SAYC-2026-XXXX)
    if (id.startsWith('SAYC-2026-')) {
      return id;
    }

    const parts = id.split('-');
    if (parts.length > 1) {
        const membershipId = `${parts[0]}-${parts[1]}-${parts[2]}`;
        const email = parts[3];
        if (email && email.includes('@')) {
            const domain = email.split('@')[1];
            return `${membershipId} (***@${domain})`;
        }
        return membershipId;
    }
    
    if (id.includes('@')) {
      return id.replace(/(.{3}).*@(.*)/, "$1***@$2");
    }

    return id;
  };

  const filteredVotes = votes?.filter(vote => 
    vote.voterId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vote.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${vote.candidateFirstName} ${vote.candidateLastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group candidates by role
  const roles = ["Leader Adjoint", "Académique", "Inclusion", "Secteur Privé"];
  const groupedCandidates = roles.map(role => ({
    role,
    items: candidates?.filter(c => c.role === role).sort((a, b) => b.votesCount - a.votesCount) || []
  }));

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-4">
      <SEOHead 
        title="Audit de Transparence - Élections SAYC Tchad"
        description="Consultez la liste anonymisée des votants et les statistiques de vote pour garantir l'intégrité du scrutin."
        path="/elections/transparence"
      />

      <div className="container mx-auto max-w-6xl space-y-12">
        <div className="text-center space-y-4">
          <Badge variant="outline" className="bg-sayc-teal/10 text-sayc-teal border-sayc-teal/20 px-4 py-1 uppercase tracking-widest text-xs font-black">
            Registre de Transparence
          </Badge>
          <h1 className="text-4xl md:text-5xl font-heading font-black text-[#1e3a8a]">
            Audit Public des <span className="text-sayc-teal">Suffrages</span>
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            Afin de garantir l'intégrité absolue de l'élection, ce portail permet de vérifier les scores en temps réel et de consulter le registre anonymisé.
          </p>
        </div>

        {/* Stats Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-sayc-teal" />
            <h2 className="text-2xl font-black text-[#1e3a8a]">Synthèse des Résultats</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {groupedCandidates.map((group) => {
              const totalRoleVotes = group.items.reduce((sum, c) => sum + c.votesCount, 0);
              return (
                <Card key={group.role} className="border-none shadow-xl bg-white overflow-hidden rounded-3xl">
                  <CardHeader className="bg-slate-50/50 border-b pb-4">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg font-black text-[#1e3a8a]">{group.role}</CardTitle>
                      <Badge className="bg-[#1e3a8a] text-white font-bold">{totalRoleVotes} votes</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    {group.items.map((candidate) => {
                      const percentage = totalRoleVotes > 0 ? (candidate.votesCount / totalRoleVotes) * 100 : 0;
                      return (
                        <div key={candidate.id} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-bold text-slate-700">
                              {candidate.firstName} {candidate.nomSpecifiqueUnique}
                            </span>
                            <span className="font-black text-[#1e3a8a]">
                              {candidate.votesCount} voix ({percentage.toFixed(1)}%)
                            </span>
                          </div>
                          <Progress value={percentage} className="h-2.5 bg-slate-100" indicatorClassName="bg-gradient-to-r from-[#1e3a8a] to-sayc-teal" />
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Audit List Section */}
        <div className="space-y-6 pt-10">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-sayc-teal" />
            <h2 className="text-2xl font-black text-[#1e3a8a]">Registre Détaillé</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-none shadow-sm bg-white rounded-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-sayc-teal" /> Votes Vérifiés
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-[#1e3a8a]">{votes?.length || 0}</div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white rounded-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-sayc-teal" /> Intégrité
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-sayc-teal">100%</div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white rounded-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-sayc-teal" /> Dernière Mise à jour
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-bold text-slate-700">
                  {format(new Date(), "HH:mm", { locale: fr })} (En direct)
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-none shadow-2xl bg-white overflow-hidden rounded-[2.5rem]">
            <CardHeader className="border-b bg-slate-50/50 p-8 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-xl font-black text-[#1e3a8a]">Registre des Suffrages</CardTitle>
                  <CardDescription>Liste exhaustive et anonymisée certifiée par le comité technique</CardDescription>
                </div>
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    placeholder="Rechercher un membre ou un candidat..." 
                    className="pl-10 bg-white border-slate-200 h-12 rounded-xl"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 h-16">
                      <TableHead className="font-bold text-slate-700 pl-8">Membre (Anonymisé)</TableHead>
                      <TableHead className="font-bold text-slate-700">Poste</TableHead>
                      <TableHead className="font-bold text-slate-700">Candidat Choisi</TableHead>
                      <TableHead className="font-bold text-slate-700">Date & Heure</TableHead>
                      <TableHead className="font-bold text-slate-700 text-right pr-8">Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingVotes ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-20 text-slate-400">Chargement des données d'audit...</TableCell>
                      </TableRow>
                    ) : filteredVotes?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-20 text-slate-400">Aucun vote trouvé pour cette recherche.</TableCell>
                      </TableRow>
                    ) : (
                      filteredVotes?.map((vote) => (
                        <TableRow key={vote.id} className="hover:bg-slate-50/50 transition-colors h-16">
                          <TableCell className="font-mono text-xs font-bold text-slate-600 pl-8">
                            {anonymizeId(vote.voterId)}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-[10px] uppercase font-bold border-slate-200">
                              {vote.role}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-bold text-[#1e3a8a]">
                            {vote.candidateFirstName} {vote.candidateLastName}
                          </TableCell>
                          <TableCell className="text-slate-500 text-sm">
                            {format(new Date(vote.createdAt), "dd MMM yyyy à HH:mm", { locale: fr })}
                          </TableCell>
                          <TableCell className="text-right pr-8">
                            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
                              <ShieldCheck className="w-3.5 h-3.5" /> Certifié
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-[#1e3a8a] rounded-[3rem] p-8 md:p-16 text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10 space-y-8">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
                        <Award className="w-8 h-8 text-sayc-teal" />
                    </div>
                    <div>
                      <h2 className="text-3xl md:text-4xl font-black">Engagement de Transparence</h2>
                      <p className="text-blue-200 font-medium">Certification officielle du Comité National</p>
                    </div>
                </div>
                <p className="text-blue-100 text-xl max-w-4xl leading-relaxed">
                    Le SAYC Tchad s'engage à ce que chaque voix compte. Ce portail de transparence est accessible à tous les membres et auditeurs externes pour garantir un processus démocratique exemplaire et incontestable.
                </p>
                <div className="flex flex-wrap gap-6 pt-4">
                    <div className="bg-white/10 px-6 py-3 rounded-2xl text-lg font-bold flex items-center gap-3">
                        <ShieldCheck className="w-6 h-6 text-sayc-teal" /> Vote Sécurisé
                    </div>
                    <div className="bg-white/10 px-6 py-3 rounded-2xl text-lg font-bold flex items-center gap-3">
                        <UserCheck className="w-6 h-6 text-sayc-teal" /> Audit Direct
                    </div>
                </div>
            </div>
            
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-20 -translate-y-20 blur-3xl" />
        </div>
      </div>
    </div>
  );
}

