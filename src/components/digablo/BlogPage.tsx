import React, { useState } from 'react';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  ArrowRight, 
  Tag, 
  ShieldCheck, 
  Sparkles, 
  Smartphone,
  ChevronRight,
  Share2
} from 'lucide-react';
import { DIGABLO_BLOG_POSTS, DigabloBlogPost } from '../../data/digablo/blogData';

interface BlogPageProps {
  onOpenLiveSimulator: () => void;
  setCurrentPage: (page: string) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({
  onOpenLiveSimulator,
  setCurrentPage
}) => {
  const [selectedPost, setSelectedPost] = useState<DigabloBlogPost | null>(null);
  const [selectedTag, setSelectedTag] = useState<string>('ALL');

  const categories = [
    { id: 'ALL', label: 'Tous les articles' },
    { id: 'FISCALITE', label: 'Fiscalité & Factur-X' },
    { id: 'TECHNIQUE', label: 'Hors-Ligne & Architecture' },
    { id: 'GESTION', label: 'Gestion & Rush' },
    { id: 'CONSEILS', label: 'Conseils Matériel' },
  ];

  const filteredPosts = selectedTag === 'ALL'
    ? DIGABLO_BLOG_POSTS
    : DIGABLO_BLOG_POSTS.filter(p => p.categorie === selectedTag);

  return (
    <div className="py-8 sm:py-12 space-y-12">
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Guides & Actualités Professionnelles</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Conseils concrets pour commerçants et restaurateurs
        </h1>
        <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
          Comprendre la réforme fiscale 2026, éviter les pannes internet du samedi soir et choisir le bon matériel de caisse sans se ruiner.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedTag(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              selectedTag === cat.id
                ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <article
            key={post.id}
            onClick={() => setSelectedPost(post)}
            className="group bg-slate-900/80 rounded-2xl p-6 border border-slate-800 hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between cursor-pointer hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-1"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="px-2.5 py-1 rounded-md bg-slate-800 text-amber-400 font-bold uppercase tracking-wider text-[10px]">
                  {post.categorie}
                </span>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(post.datePublication).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {post.tempsLecture}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors leading-snug">
                  {post.titre}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                  {post.resume}
                </p>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-slate-800/60 flex items-center justify-between text-xs font-semibold text-amber-400 group-hover:text-amber-300">
              <span>Lire l’article complet</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </article>
        ))}
      </div>

      {/* Full Article Modal / Reader */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 rounded-3xl border border-slate-800 max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-10 space-y-6 shadow-2xl relative">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 uppercase tracking-wider">
                    {selectedPost.categorie}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {selectedPost.tempsLecture}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                  {selectedPost.titre}
                </h2>
              </div>
              <button
                onClick={() => setSelectedPost(null)}
                className="text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors shrink-0 ml-4"
              >
                ✕
              </button>
            </div>

            <div className="text-sm sm:text-base text-slate-300 space-y-4 leading-relaxed border-t border-slate-800 pt-6">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-sm font-medium">
                💡 {selectedPost.resume}
              </div>

              <div className="whitespace-pre-line prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed">
                {selectedPost.contenuMarkdown}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-400">
                Publié par l’équipe d’ingénierie FastFood POS
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setSelectedPost(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Fermer
                </button>
                <button
                  onClick={() => {
                    setSelectedPost(null);
                    onOpenLiveSimulator();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 flex items-center gap-2"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Tester notre système</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
