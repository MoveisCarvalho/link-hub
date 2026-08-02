'use client';
import React, { useEffect, useState } from 'react';

interface LinkItem {
    _id: string;
    title: string;
    url: string;
    description: string;
}

export default function AdminPage() {
    // Estados de Autenticação
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userLogin, setUserLogin] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    // Estados do CRUD de Links
    const [links, setLinks] = useState<LinkItem[]>([]);
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [description, setDescription] = useState('');
    const [editId, setEditId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Estados para o Gerador de Link de Destaque
    const [activeShareId, setActiveShareId] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [origin, setOrigin] = useState('');

    // Capturar a URL base do site (para gerar o link correto) e verificar sessão
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setOrigin(window.location.origin);
        }

        const logged = sessionStorage.getItem('admin_logged');
        if (logged === 'true') {
            setIsAuthenticated(true);
            fetchLinks();
        }
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError('');

        const validLogins = ['18997261236', '18997901236', 'adm'];
        const validPassword = '123';

        if (validLogins.includes(userLogin.trim()) && userPassword === validPassword) {
            setIsAuthenticated(true);
            sessionStorage.setItem('admin_logged', 'true');
            fetchLinks();
        } else {
            setLoginError('Login ou senha incorretos.');
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        sessionStorage.removeItem('admin_logged');
        setUserLogin('');
        setUserPassword('');
    };

    const fetchLinks = async () => {
        try {
            const res = await fetch('/api/links');
            const data = await res.json();
            if (data.success) {
                setLinks(data.data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload = { title, url, description };

        if (editId) {
            await fetch(`/api/links/${editId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            setEditId(null);
        } else {
            await fetch('/api/links', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
        }

        setTitle('');
        setUrl('');
        setDescription('');
        setLoading(false);
        fetchLinks();
    };

    const handleEdit = (link: LinkItem) => {
        setEditId(link._id);
        setTitle(link.title);
        setUrl(link.url);
        setDescription(link.description);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Deseja realmente excluir este link?')) {
            await fetch(`/api/links/${id}`, { method: 'DELETE' });
            fetchLinks();
        }
    };

    const handleCopy = (shareUrl: string, id: string) => {
        navigator.clipboard.writeText(shareUrl);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    // Se não estiver autenticado, exibe a tela de Login
    if (!isAuthenticated) {
        return (
            <main className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl">
                    <h1 className="text-2xl font-bold mb-2 text-center">Área Restrita</h1>
                    <p className="text-sm text-slate-400 mb-6 text-center">Faça login para gerenciar os links</p>

                    {loginError && (
                        <div className="bg-rose-500/10 border border-rose-500 text-rose-400 p-3 rounded-lg text-sm mb-4 text-center">
                            {loginError}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="flex flex-col gap-4">
                        <div>
                            <label className="block text-xs text-slate-400 mb-1">Usuário / Telefone</label>
                            <input
                                type="text"
                                value={userLogin}
                                onChange={(e) => setUserLogin(e.target.value)}
                                required
                                placeholder="Digite seu login"
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-100 focus:outline-none focus:border-sky-500 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-400 mb-1">Senha</label>
                            <input
                                type="password"
                                value={userPassword}
                                onChange={(e) => setUserPassword(e.target.value)}
                                required
                                placeholder="Digite sua senha"
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-100 focus:outline-none focus:border-sky-500 text-sm"
                            />
                        </div>
                        <button
                            type="submit"
                            className="mt-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold py-3 rounded-lg transition text-sm shadow-md"
                        >
                            Entrar no Painel
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <a href="/" className="text-xs text-slate-500 hover:text-slate-300 underline">
                            ← Voltar para a Página Pública
                        </a>
                    </div>
                </div>
            </main>
        );
    }

    // Painel Administrativo Completo com Gerador de Links de Destaque
    return (
        <main className="min-h-screen bg-slate-900 text-slate-100 py-10 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="flex justify-between items-center mb-8 bg-slate-800 p-4 rounded-xl border border-slate-700">
                    <div>
                        <h1 className="text-xl font-bold">Painel Administrativo</h1>
                        <span className="text-xs text-emerald-400">● Sessão Ativa</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <a href="/" className="text-sm text-sky-400 hover:underline">Ver Página Pública</a>
                        <button
                            onClick={handleLogout}
                            className="bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/50 text-xs py-1.5 px-3 rounded-lg transition"
                        >
                            Sair
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="bg-slate-800 p-6 rounded-xl border border-slate-700 mb-8 flex flex-col gap-4 shadow-lg">
                    <h2 className="text-lg font-semibold">{editId ? 'Editar Link' : 'Adicionar Novo Link'}</h2>
                    <div>
                        <label className="block text-xs text-slate-400 mb-1">Nome do Botão</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-sky-500 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-slate-400 mb-1">URL de Destino</label>
                        <input
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            required
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-sky-500 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-slate-400 mb-1">Descrição</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            rows={3}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-sky-500 text-sm"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-sky-600 hover:bg-sky-500 text-white font-semibold py-2 px-4 rounded-lg transition text-sm shadow"
                        >
                            {loading ? 'Salvando...' : editId ? 'Atualizar Link' : 'Cadastrar Link'}
                        </button>
                        {editId && (
                            <button
                                type="button"
                                onClick={() => { setEditId(null); setTitle(''); setUrl(''); setDescription(''); }}
                                className="bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-lg transition text-sm"
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>

                <div className="flex flex-col gap-4">
                    <h2 className="text-lg font-semibold">Links Cadastrados & Gerador de Destaque</h2>
                    {links.length === 0 ? (
                        <p className="text-sm text-slate-500">Nenhum link cadastrado ainda.</p>
                    ) : (
                        links.map((link) => {
                            const shareUrl = `${origin}/?destaque=${encodeURIComponent(link.title)}`;
                            const isSharing = activeShareId === link._id;

                            return (
                                <div key={link._id} className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col gap-3 shadow">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-sky-400">{link.title}</h3>
                                            <p className="text-sm text-slate-300">{link.description}</p>
                                            <a href={link.url} target="_blank" rel="noreferrer" className="text-xs text-slate-500 truncate block max-w-xs hover:underline mt-1">{link.url}</a>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleEdit(link)} className="bg-amber-600 hover:bg-amber-500 text-xs py-1.5 px-3 rounded-lg text-white font-medium transition">Editar</button>
                                            <button onClick={() => handleDelete(link._id)} className="bg-rose-600 hover:bg-rose-500 text-xs py-1.5 px-3 rounded-lg text-white font-medium transition">Excluir</button>
                                        </div>
                                    </div>

                                    {/* Botão de Destaque / Gerar URL Personalizada */}
                                    <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between">
                                        <button
                                            onClick={() => setActiveShareId(isSharing ? null : link._id)}
                                            className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1.5 font-medium bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 rounded-lg transition border border-amber-500/30"
                                        >
                                            ⭐ {isSharing ? 'Ocultar Link de Destaque' : 'Gerar Link com este Card em Destaque'}
                                        </button>
                                    </div>

                                    {/* Caixa expansível com a URL gerada, botão Copiar e Abrir */}
                                    {isSharing && (
                                        <div className="bg-slate-900 p-3 rounded-xl border border-slate-700 flex flex-col gap-2 mt-1">
                                            <span className="text-[11px] text-slate-400 font-medium">URL personalizada para enviar ao cliente (deixa este card fixo no topo):</span>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    readOnly
                                                    value={shareUrl}
                                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-300 font-mono select-all"
                                                />
                                                <button
                                                    onClick={() => handleCopy(shareUrl, link._id)}
                                                    className="bg-sky-600 hover:bg-sky-500 text-white text-xs px-3 py-2 rounded-lg transition font-medium whitespace-nowrap shadow"
                                                >
                                                    {copiedId === link._id ? 'Copiado! ✓' : 'Copiar'}
                                                </button>
                                                <a
                                                    href={shareUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="bg-slate-700 hover:bg-slate-600 text-white text-xs px-3 py-2 rounded-lg transition font-medium whitespace-nowrap shadow"
                                                >
                                                    Abrir ↗
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </main>
    );
}