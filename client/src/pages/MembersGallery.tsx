import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Users,
  Search,
  Award,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Shield,
  X,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { Member } from "@shared/schema";
import SEOHead from "@/components/SEOHead";

export default function MembersGallery() {
  const [search, setSearch] = useState("");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 24;

  const { data: allMembers = [], isLoading } = useQuery<Member[]>({
    queryKey: ["/api/members"],
  });

  // Only members with photo
  const membersWithPhoto = useMemo(
    () => allMembers.filter((m) => m.photoUrl && m.photoUrl.trim() !== ""),
    [allMembers]
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return membersWithPhoto;
    return membersWithPhoto.filter(
      (m) =>
        m.firstName?.toLowerCase().includes(q) ||
        m.nomSpecifiqueUnique?.toLowerCase().includes(q) ||
        m.membershipId?.toLowerCase().includes(q) ||
        m.city?.toLowerCase().includes(q)
    );
  }, [membersWithPhoto, search]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleSearch = (v: string) => {
    setSearch(v);
    setPage(1);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.04 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.35, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen bg-[#080c1a] text-white overflow-hidden">
      <SEOHead
        title="Galerie des Membres - SAYC Tchad"
        description="Galerie officielle des membres du SAYC Tchad."
        path="/membres/galerie"
      />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className="relative overflow-hidden">
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Glow blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 container mx-auto px-4 md:px-6 py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full px-4 py-2 text-sm text-indigo-300 mb-6">
              <Sparkles className="w-4 h-4" />
              Communauté SAYC Tchad
            </div>
            <h1 className="font-heading text-5xl md:text-7xl font-black mb-4 bg-gradient-to-r from-white via-indigo-200 to-cyan-300 bg-clip-text text-transparent">
              Nos Membres
            </h1>
            <p className="text-lg text-white/50 max-w-xl mx-auto mb-10">
              Les visages de la génération numérique tchadienne — membres officiels du Smart Africa Youth Chapter Tchad.
            </p>

            {/* Stats */}
            <div className="flex justify-center gap-8 mb-10 flex-wrap">
              <div className="text-center">
                <div className="text-3xl font-black text-indigo-400">{membersWithPhoto.length}</div>
                <div className="text-xs text-white/40 uppercase tracking-widest mt-1">Membres avec photo</div>
              </div>
              <div className="w-px bg-white/10 hidden md:block" />
              <div className="text-center">
                <div className="text-3xl font-black text-cyan-400">{allMembers.length}</div>
                <div className="text-xs text-white/40 uppercase tracking-widest mt-1">Membres au total</div>
              </div>
              <div className="w-px bg-white/10 hidden md:block" />
              <div className="text-center">
                <div className="text-3xl font-black text-emerald-400">2025</div>
                <div className="text-xs text-white/40 uppercase tracking-widest mt-1">Année de fondation</div>
              </div>
            </div>

            {/* Search */}
            <div className="relative max-w-lg mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              <Input
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Rechercher un membre par nom, ID..."
                className="pl-12 pr-4 h-14 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-2xl text-base focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"
              />
              {search && (
                <button
                  onClick={() => handleSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {search && (
              <p className="text-sm text-white/40 mt-3">
                {filtered.length} résultat{filtered.length !== 1 ? "s" : ""} pour «{" "}
                <span className="text-indigo-300">{search}</span> »
              </p>
            )}
          </motion.div>
        </div>
      </div>

      {/* ── Gallery Grid ─────────────────────────────────────── */}
      <div className="container mx-auto px-4 md:px-6 pb-24">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 24 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-2xl bg-white/5 animate-pulse"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Users className="w-16 h-16 mx-auto text-white/10 mb-4" />
            <p className="text-white/30 text-lg">Aucun membre trouvé</p>
          </div>
        ) : (
          <motion.div
            key={page + search}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
          >
            {paginated.map((member) => (
              <motion.div
                key={member.id}
                variants={cardVariants}
                whileHover={{ scale: 1.04, y: -4 }}
                onClick={() => setSelectedMember(member)}
                className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, #1e2a4a 0%, #0f172a 100%)",
                }}
              >
                {/* Photo */}
                <img
                  src={member.photoUrl!}
                  alt={member.firstName}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Info on hover */}
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white text-xs font-bold leading-tight truncate">
                    {member.firstName} {member.nomSpecifiqueUnique}
                  </p>
                  <p className="text-indigo-300 text-[10px] font-mono mt-0.5 truncate">
                    {member.membershipId}
                  </p>
                </div>

                {/* Badge corner */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-indigo-500 rounded-full p-1">
                    <Award className="w-3 h-3 text-white" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* ── Pagination ────────────── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-12">
            <Button
              variant="ghost"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="text-white/50 hover:text-white hover:bg-white/5"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <span className="text-white/40 text-sm">
              Page <span className="text-white font-bold">{page}</span> sur{" "}
              <span className="text-white font-bold">{totalPages}</span>
            </span>
            <Button
              variant="ghost"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="text-white/50 hover:text-white hover:bg-white/5"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>

      {/* ── Member Detail Modal ───────────────────────────────── */}
      <AnimatePresence>
        {selectedMember && (
          <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
            <DialogContent className="max-w-sm p-0 overflow-hidden border-0 bg-transparent shadow-none">
              <DialogHeader className="sr-only">
                <DialogTitle>Profil de {selectedMember.firstName}</DialogTitle>
                <DialogDescription>
                  Fiche membre SAYC Tchad de {selectedMember.firstName} {selectedMember.nomSpecifiqueUnique}
                </DialogDescription>
              </DialogHeader>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25 }}
                className="relative rounded-3xl overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
                  boxShadow: "0 25px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(99,102,241,0.2)",
                }}
              >
                {/* Top photo */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={selectedMember.photoUrl!}
                    alt={selectedMember.firstName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0f172a]" />

                  {/* Close btn */}
                  <button
                    onClick={() => setSelectedMember(null)}
                    className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm rounded-full p-1.5 text-white/60 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {/* Member badge */}
                  <div className="absolute top-3 left-3">
                    <div className="flex items-center gap-1.5 bg-indigo-500/20 border border-indigo-400/30 backdrop-blur-sm rounded-full px-3 py-1">
                      <Shield className="w-3 h-3 text-indigo-400" />
                      <span className="text-[10px] text-indigo-300 font-semibold uppercase tracking-wider">
                        Membre Officiel
                      </span>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="px-6 pb-6 -mt-4">
                  <div className="mb-4">
                    <h2 className="text-2xl font-black text-white leading-tight">
                      {selectedMember.firstName}{" "}
                      <span className="text-indigo-400">{selectedMember.nomSpecifiqueUnique}</span>
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg px-3 py-1 inline-flex items-center gap-1.5">
                        <Award className="w-3 h-3 text-indigo-400" />
                        <span className="font-mono text-xs text-indigo-300 font-bold tracking-wider">
                          {selectedMember.membershipId}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {selectedMember.city && (
                      <div className="flex items-center gap-3 text-sm text-white/60">
                        <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-4 h-4 text-cyan-400" />
                        </div>
                        <span className="truncate">{selectedMember.city}, Tchad</span>
                      </div>
                    )}
                    {selectedMember.email && (
                      <div className="flex items-center gap-3 text-sm text-white/60">
                        <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                          <Mail className="w-4 h-4 text-emerald-400" />
                        </div>
                        <span className="truncate">{selectedMember.email}</span>
                      </div>
                    )}
                    {selectedMember.phone && (
                      <div className="flex items-center gap-3 text-sm text-white/60">
                        <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                          <Phone className="w-4 h-4 text-amber-400" />
                        </div>
                        <span>{selectedMember.phone}</span>
                      </div>
                    )}
                    {selectedMember.createdAt && (
                      <div className="flex items-center gap-3 text-sm text-white/60">
                        <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-4 h-4 text-pink-400" />
                        </div>
                        <span>
                          Membre depuis{" "}
                          {new Date(selectedMember.createdAt).toLocaleDateString("fr-FR", {
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Separator */}
                  <div className="border-t border-white/5 my-4" />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <img src="/favicon.png" alt="SAYC" className="w-5 h-5 rounded" />
                      <span className="text-[10px] text-white/30 font-semibold uppercase tracking-widest">
                        SAYC Tchad
                      </span>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-[10px] border-emerald-500/30 text-emerald-400 bg-emerald-500/5"
                    >
                      ✓ Vérifié
                    </Badge>
                  </div>
                </div>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
}
