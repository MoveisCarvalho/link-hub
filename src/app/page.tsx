'use client';
import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

interface LinkItem {
  _id: string;
  title: string;
  url: string;
  description: string;
}

function PublicContent() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  // Pega o parâmetro de destaque da URL, ex: ?destaque=corretor ou ?destaque=primeira
  const highlightParam = searchParams.get('destaque') || searchParams.get('highlight') || '';

  useEffect(() => {
    fetch('/api/links')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setLinks(data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erro ao buscar links:', err);
        setLoading(false);
      });
  }, []);

  // Normaliza o parâmetro para buscar no título do card (ignora maiúsculas/minúsculas)
  const normalizedHighlight = highlightParam.toLowerCase().trim();

  const featuredLink = normalizedHighlight
    ? links.find(l => l.title.toLowerCase().includes(normalizedHighlight))
    : null;

  const otherLinks = featuredLink
    ? links.filter(l => l._id !== featuredLink._id)
    : links;

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center py-12 px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-2">Central de Links</h1>
        <p className="text-slate-400 mb-8">Acesse nossos principais canais e parceiros</p>

        {loading ? (
          <p className="text-slate-400">Carregando...</p>
        ) : links.length === 0 ? (
          <p className="text-slate-400">Nenhum link cadastrado no momento.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {/* Card de Destaque Fixo no Topo */}
            {featuredLink && (
              <div className="mb-2">
                <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1 text-left flex items-center gap-1">
                  ⭐ Em Destaque
                </div>
                <a
                  href={featuredLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-sky-950 to-slate-800 hover:from-sky-900 hover:to-slate-700 border-2 border-sky-500 p-5 rounded-2xl transition shadow-2xl text-left block group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 bg-sky-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">
                    PRINCIPAL
                  </div>
                  <h2 className="text-xl font-extrabold text-sky-300 group-hover:underline mb-1">
                    {featuredLink.title}
                  </h2>
                  <p className="text-sm text-slate-200">{featuredLink.description}</p>
                </a>
              </div>
            )}

            {/* Demais Links */}
            {otherLinks.map((link) => (
              <a
                key={link._id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 p-4 rounded-xl transition shadow-lg text-left block group"
              >
                <h2 className="text-lg font-semibold text-sky-400 group-hover:underline mb-1">
                  {link.title}
                </h2>
                <p className="text-sm text-slate-300">{link.description}</p>
              </a>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default function PublicPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center">Carregando...</main>}>
      <PublicContent />
    </Suspense>
  );
}