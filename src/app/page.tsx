'use client';
import React, { useEffect, useState } from 'react';

interface LinkItem {
  _id: string;
  title: string;
  url: string;
  description: string;
}

export default function PublicPage() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);

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
            {links.map((link) => (
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

        <div className="mt-10">
          <a
            href="/admin"
            className="text-xs text-slate-500 hover:text-slate-300 underline"
          >
            Acessar Painel Administrativo
          </a>
        </div>
      </div>
    </main>
  );
}