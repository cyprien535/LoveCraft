'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight, BarChart3, Check, ChevronLeft, ChevronRight,
  Copy, Download, ExternalLink, Eye, Gift, Heart, LogIn, LogOut,
  Menu, Plus, QrCode, Search, Sparkles, Trash2, TrendingUp, X,
  CopyPlus, Filter, Award, Share2, Music, Calendar, Smile, User, Shuffle
} from 'lucide-react'
import QRCode from 'qrcode'
import { createClient } from '@/lib/supabase/client'
import { AUDIO_PRESETS, getRandomTrackForTone } from '@/lib/audioPresets'

type Surprise = {
  id: string; title: string; recipient: string; sender?: string; message: string;
  theme: string; question: string; answer: string; slug: string;
  published: boolean; views: number; created_at: string;
  occasion?: string; tone?: string; music_url?: string; photos?: string; unlock_date?: string
}

const themes = ['rose', 'lavender', 'peach', 'green', 'yellow', 'ocean', 'midnight']
const occasions = ["Anniversaire", "Demande en mariage", "Saint-Valentin", "Déclaration", "Réconciliation", "Sans occasion"]
const tones = ["Romantique", "Humoristique", "Poétique", "Nostalgique", "Émouvant"]

const testimonials = [
  { quote: "J'ai demandé sa main d'une façon qui nous ressemblait vraiment. La surprise a rendu ce moment encore plus précieux.", author: "Aïcha & Arnaud", occasion: "Demande en mariage · Cotonou" },
  { quote: "Pour notre anniversaire, LoveCraft nous a permis de créer un moment doux, personnel et plein de sens.", author: "Mireille & Cédric", occasion: "Anniversaire · Porto-Novo" },
  { quote: "La question secrète rend l'ouverture magique. On a gardé le lien comme un souvenir de notre histoire.", author: "Grâce & Joël", occasion: "Une surprise sans occasion · Abomey-Calavi" },
  { quote: "LoveCraft m'a permis de dire ce que je n'arrivais pas à exprimer de vive voix. C'était simple et sincère.", author: "Félicité & Wilfried", occasion: "Réconciliation · Parakou" },
]

const previewCards = [
  { theme: 'rose', for: 'Éloïse', title: 'Tu es mon préféré', sub: 'avec tout mon amour' },
  { theme: 'lavender', for: 'Mathieu', title: 'Une surprise pour toi', sub: 'pour tous nos lendemains' },
  { theme: 'peach', for: 'Sofia', title: 'Je t\'aime depuis toujours', sub: 'et pour toujours' },
]

export default function Page() {
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [screen, setScreen] = useState<'home' | 'auth' | 'dashboard'>('home')
  const [activeTab, setActiveTab] = useState<'surprises' | 'stats'>('surprises')
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [surprises, setSurprises] = useState<Surprise[]>([])
  const [query, setQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all')
  const [sortBy, setSortBy] = useState<'recent' | 'views' | 'title'>('recent')
  const [showCreate, setShowCreate] = useState(false)
  const [qrModalItem, setQrModalItem] = useState<{ item: Surprise; urlData: string } | null>(null)
  const [previewModalItem, setPreviewModalItem] = useState<Surprise | null>(null)

  const [musicChoiceMode, setMusicChoiceMode] = useState<'random' | 'select' | 'custom'>('random')
  const [selectedTrackUrl, setSelectedTrackUrl] = useState<string>('')

  const [form, setForm] = useState({
    title: '', recipient: '', sender: '', message: '', theme: 'rose',
    question: 'Dans quelle ville avons-nous partagé notre premier souvenir ?', answer: 'Cotonou',
    occasion: 'Anniversaire', tone: 'Romantique',
    music_url: '', photos: '', unlock_date: ''
  })

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser(data.user)
        setScreen('dashboard')
        setForm(f => ({ ...f, sender: data.user.email?.split('@')[0] || '' }))
      }
    }).catch(() => {
      // L’utilisateur non connecté doit pouvoir consulter la page d’accueil.
    })
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        setScreen('dashboard')
        setForm(f => ({ ...f, sender: session.user.email?.split('@')[0] || '' }))
      } else {
        setScreen(curr => curr === 'dashboard' ? 'auth' : curr)
        setAuthMode('login')
      }
    })
    return () => data.subscription.unsubscribe()
  }, [])

  useEffect(() => { if (user) loadSurprises() }, [user])

  async function loadSurprises() {
    const { data } = await supabase.from('surprises').select('*').order('created_at', { ascending: false })
    setSurprises(data ?? [])
  }

  async function auth() {
    setError('')
    setNotice('')

    const normalizedEmail = email.trim().toLowerCase()
    if (!normalizedEmail || !normalizedEmail.includes('@')) {
      return setError('Veuillez saisir une adresse email valide.')
    }
    if (password.length < 6) {
      return setError('Le mot de passe doit contenir au moins 6 caractères.')
    }

    setAuthLoading(true)
    try {
      const result = authMode === 'login'
        ? await supabase.auth.signInWithPassword({ email: normalizedEmail, password })
        : await supabase.auth.signUp({
            email: normalizedEmail,
            password,
            options: { emailRedirectTo: 'https://love-craft-lrok.vercel.app/auth/callback' },
          })

      if (result.error) {
        const message = result.error.message.toLowerCase()
        if (message.includes('email not confirmed')) {
          setError('Votre email n’est pas encore confirmé. Consultez votre boîte de réception.')
        } else if (message.includes('already registered') || message.includes('already been registered')) {
          setError('Cette adresse possède déjà un compte. Connectez-vous plutôt.')
        } else if (message.includes('password should be at least') || message.includes('password')) {
          setError('Le mot de passe doit respecter la politique Supabase (au moins 6 caractères).')
        } else if (message.includes('invalid api key') || message.includes('project not found') || message.includes('fetch')) {
          setError('La connexion à Supabase est mal configurée sur Vercel. Vérifiez les variables NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.')
        } else if (message.includes('email address') || message.includes('invalid email')) {
          setError('Cette adresse email n’est pas acceptée par Supabase. Vérifiez son format.')
        } else {
          setError(`Supabase : ${result.error.message}`)
        }
        return
      }

      if (authMode === 'signup' && !result.data.session) {
        setNotice('Compte créé. Si une confirmation est demandée, vérifiez votre email, puis connectez-vous.')
        setAuthMode('login')
        setPassword('')
        return
      }

      setNotice('Connexion réussie !')
      setScreen('dashboard')
    } catch {
      setError('Le service d’authentification est momentanément indisponible. Vérifiez les réglages Supabase et réessayez.')
    } finally {
      setAuthLoading(false)
    }
  }

  async function signInWithGoogle() {
    setError('')
    setNotice('')
    setAuthLoading(true)
    try {
      const { error: googleError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: 'https://love-craft-lrok.vercel.app/auth/callback' },
      })
      if (googleError) setError(`Google : ${googleError.message}`)
    } catch {
      setError('La connexion avec Google est momentanément indisponible.')
    } finally {
      setAuthLoading(false)
    }
  }

  async function save(publish = false) {
    if (!user || !form.title || !form.recipient || !form.sender || !form.message) {
      return setError('Veuillez compléter le titre, le destinataire, votre prénom (expéditeur) et le message.')
    }

    // Determine final music URL
    let finalMusicUrl = form.music_url
    if (musicChoiceMode === 'random') {
      finalMusicUrl = getRandomTrackForTone(form.tone).url
    } else if (musicChoiceMode === 'select' && selectedTrackUrl) {
      finalMusicUrl = selectedTrackUrl
    }

    const payload = {
      ...form,
      music_url: finalMusicUrl,
      sender: form.sender || user.email?.split('@')[0] || 'Un être cher',
      user_id: user.id,
      published: publish,
      unlock_date: form.unlock_date ? new Date(form.unlock_date).toISOString() : null
    }
    const { data, error: saveError } = await supabase.from('surprises').insert(payload).select().single()
    if (saveError) return setError('Impossible d\'enregistrer cette surprise.')
    setSurprises([data, ...surprises])
    setShowCreate(false)
    setForm({
      title: '', recipient: '', sender: user.email?.split('@')[0] || '', message: '', theme: 'rose',
      question: 'Dans quelle ville avons-nous partagé notre premier souvenir ?', answer: 'Cotonou',
      occasion: 'Anniversaire', tone: 'Romantique',
      music_url: '', photos: '', unlock_date: ''
    })
    setNotice(publish ? 'Votre surprise est publiée.' : 'Brouillon enregistré.')
    setError('')
    setTimeout(() => setNotice(''), 4000)
  }

  async function duplicateSurprise(item: Surprise) {
    if (!user) return
    const newForm = {
      title: `${item.title} (Copie)`,
      recipient: item.recipient,
      sender: item.sender || 'Un être cher',
      message: item.message,
      theme: item.theme,
      question: item.question,
      answer: item.answer,
      occasion: item.occasion || 'Autre',
      tone: item.tone || 'Romantique',
      music_url: item.music_url || '',
      photos: item.photos || '',
      unlock_date: item.unlock_date || null,
      published: false,
      user_id: user.id
    }
    const { data, error: dupError } = await supabase.from('surprises').insert(newForm).select().single()
    if (!dupError && data) {
      setSurprises([data, ...surprises])
      setNotice('Surprise dupliquée avec succès !')
      setTimeout(() => setNotice(''), 4000)
    }
  }

  async function remove(id: string) {
    await supabase.from('surprises').delete().eq('id', id)
    setSurprises(surprises.filter(s => s.id !== id))
  }

  async function openQrModal(item: Surprise) {
    const urlData = await QRCode.toDataURL(`${window.location.origin}/s/${item.slug}`, { width: 260, margin: 1 })
    setQrModalItem({ item, urlData })
  }

  function copyLink(slug: string) {
    const link = `${window.location.origin}/s/${slug}`
    navigator.clipboard.writeText(link)
    setNotice('Lien copié dans le presse-papier !')
    setTimeout(() => setNotice(''), 3500)
  }

  const shown = useMemo(() => {
    return surprises
      .filter(s => {
        const matchesQuery = `${s.title} ${s.recipient} ${s.sender || ''} ${s.occasion || ''}`.toLowerCase().includes(query.toLowerCase())
        const matchesStatus = filterStatus === 'all' ? true : filterStatus === 'published' ? s.published : !s.published
        return matchesQuery && matchesStatus
      })
      .sort((a, b) => {
        if (sortBy === 'views') return (b.views ?? 0) - (a.views ?? 0)
        if (sortBy === 'title') return a.title.localeCompare(b.title)
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      })
  }, [surprises, query, filterStatus, sortBy])

  const totalViews = surprises.reduce((acc, s) => acc + (s.views ?? 0), 0)
  const mostViewedSurprise = useMemo(() => {
    if (!surprises.length) return null
    return [...surprises].sort((a, b) => (b.views ?? 0) - (a.views ?? 0))[0]
  }, [surprises])

  const openAuth = (mode: 'login' | 'signup') => { setAuthMode(mode); setScreen('auth') }

  // Available preset tracks for selected tone
  const availableTracks = AUDIO_PRESETS[form.tone] || AUDIO_PRESETS['Romantique']

  if (screen === 'home') return <Landing onAuth={openAuth} />

  if (screen === 'auth') return (
    <main className="auth-page">
      <section className="auth-art">
        <button className="auth-back" onClick={() => setScreen('home')}>
          <ChevronLeft size={16} /> Retour à l'accueil
        </button>
        <div className="auth-art-content">
          <span className="eyebrow" style={{ color: 'rgba(240,200,208,0.65)' }}>Votre histoire commence ici</span>
          <h1>Les plus beaux souvenirs sont ceux que l'on <em>crée ensemble.</em></h1>
          <p>Un espace doux pour transformer ce que vous ressentez en une surprise qui lui ressemble.</p>
        </div>
        <div className="auth-floating-cards">
          <div className="auth-fc rose auth-fc-1"><Heart size={18} fill="currentColor" /><span>pour toujours</span></div>
          <div className="auth-fc lavender auth-fc-2"><Heart size={14} fill="currentColor" /><span>avec amour</span></div>
          <div className="auth-fc peach auth-fc-3"><span>une surprise ♥</span></div>
        </div>
      </section>
      <section className="auth-panel">
        <div className="auth-form-wrap">
          <Logo />
          <div style={{ height: 48 }} />
          <span className="eyebrow">{authMode === 'signup' ? 'Créer votre espace' : 'Ravi de vous revoir'}</span>
          <h2>{authMode === 'signup' ? 'Créez une surprise qui compte.' : 'Reconnectez-vous à vos émotions.'}</h2>
          <div style={{ height: 28 }} />
          <button id="google-auth-btn" type="button" className="secondary-btn" style={{ width: '100%', justifyContent: 'center', marginBottom: 18 }} onClick={signInWithGoogle} disabled={authLoading}>
            <span style={{ fontWeight: 800, fontSize: 16, color: '#4285F4' }}>G</span> Continuer avec Google
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18, color: 'var(--muted-foreground)', fontSize: 11 }}>
            <span style={{ height: 1, flex: 1, background: 'var(--border)' }} />
            ou avec votre email
            <span style={{ height: 1, flex: 1, background: 'var(--border)' }} />
          </div>
          <label className="field-label">Adresse email</label>
          <input
            id="auth-email"
            className="text-input"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="vous@email.com"
            onKeyDown={e => e.key === 'Enter' && auth()}
          />
          <label className="field-label">Mot de passe</label>
          <input
            id="auth-password"
            className="text-input"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            onKeyDown={e => e.key === 'Enter' && auth()}
          />
          {error && <p className="form-error">{error}</p>}
          {notice && <p className="form-notice">{notice}</p>}
          <button id="auth-submit" className="primary-btn auth-submit" onClick={auth} disabled={authLoading}>
            {authLoading ? 'Connexion en cours…' : authMode === 'signup' ? 'Créer mon espace' : 'Se connecter'} <LogIn size={15} />
          </button>
          <p className="auth-switch">
            {authMode === 'signup' ? 'Déjà un compte ?' : 'Pas encore de compte ?'}{' '}
            <button onClick={() => setAuthMode(authMode === 'signup' ? 'login' : 'signup')}>
              {authMode === 'signup' ? 'Se connecter' : 'Créer un compte'}
            </button>
          </p>
        </div>
      </section>
    </main>
  )

  // === DASHBOARD ===
  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-top">
          <Logo />
        </div>
        <nav className="side-nav">
          <button id="nav-surprises" className={`side-link ${activeTab === 'surprises' ? 'active' : ''}`} onClick={() => setActiveTab('surprises')}>
            <Gift size={18} /> <span>Mes surprises</span>
          </button>
          <button id="nav-stats" className={`side-link ${activeTab === 'stats' ? 'active' : ''}`} onClick={() => setActiveTab('stats')}>
            <BarChart3 size={18} /> <span>Statistiques</span>
          </button>
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-user">
            <div className="user-avatar">{user?.email?.[0]?.toUpperCase()}</div>
            <div className="user-info">
              <span className="user-name">{user?.email?.split('@')[0]}</span>
              <span className="user-email">{user?.email}</span>
            </div>
          </div>
          <button id="nav-logout" className="side-link side-link-danger" onClick={async () => { await supabase.auth.signOut(); setAuthMode('login'); setScreen('auth') }}>
            <LogOut size={18} /> <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      <div className="main-content">
        {/* Header */}
        <header className="dashboard-header">
          <div>
            <p className="dashboard-eyebrow">Votre espace créatif</p>
            <h1 className="dashboard-title">{activeTab === 'surprises' ? 'Mes surprises' : 'Statistiques & Performances'}</h1>
          </div>
          <button id="create-surprise-btn" className="create-btn" onClick={() => setShowCreate(true)}>
            <Plus size={16} /> Nouvelle surprise
          </button>
        </header>

        {/* Toast Notice */}
        {notice && (
          <div style={{ padding: '12px 18px', background: '#edf6f0', border: '1px solid #c2e2cc', color: '#2e7d52', borderRadius: 10, fontSize: 13, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Check size={16} /> {notice}
          </div>
        )}

        {/* TAB 1: SURPRISES */}
        {activeTab === 'surprises' && (
          <>
            {/* KPI Cards */}
            <div className="kpi-grid">
              <div className="kpi-card">
                <div className="kpi-icon kpi-rose"><Gift size={20} /></div>
                <div>
                  <span className="kpi-label">Total surprises</span>
                  <strong className="kpi-value">{surprises.length}</strong>
                </div>
              </div>
              <div className="kpi-card">
                <div className="kpi-icon kpi-violet"><Eye size={20} /></div>
                <div>
                  <span className="kpi-label">Vues totales</span>
                  <strong className="kpi-value">{totalViews}</strong>
                </div>
              </div>
              <div className="kpi-card">
                <div className="kpi-icon kpi-peach"><TrendingUp size={20} /></div>
                <div>
                  <span className="kpi-label">Publiées</span>
                  <strong className="kpi-value">{surprises.filter(s => s.published).length}</strong>
                </div>
              </div>
            </div>

            {/* Welcome Banner */}
            <section className="welcome-banner">
              <div className="banner-content">
                <span className="banner-kicker"><Sparkles size={13} /> L'atelier est ouvert</span>
                <h2>Une belle émotion mérite<br /><em>une belle histoire.</em></h2>
                <p>Créez une surprise digitale qui ressemble vraiment à votre relation.</p>
                <button className="banner-button" onClick={() => setShowCreate(true)}>
                  Nouvelle surprise <Plus size={14} />
                </button>
              </div>
              <div className="banner-visual">
                <div className="banner-card rose">
                  <Heart size={30} fill="currentColor" />
                  <strong>Une surprise</strong>
                  <small>juste pour toi</small>
                </div>
              </div>
            </section>

            {/* Section Toolbar */}
            <div className="section-toolbar">
              <div>
                <p className="dashboard-eyebrow">Votre collection</p>
                <h2 className="section-title">Créations <span className="badge">{shown.length}</span></h2>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                <select
                  id="filter-status"
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value as any)}
                  style={{ padding: '8px 12px', borderRadius: 10, border: '1px solid var(--border)', background: 'white', fontSize: 12, color: 'var(--foreground)' }}
                >
                  <option value="all">Tous les statuts</option>
                  <option value="published">Publiées uniquement</option>
                  <option value="draft">Brouillons uniquement</option>
                </select>

                <select
                  id="sort-by"
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as any)}
                  style={{ padding: '8px 12px', borderRadius: 10, border: '1px solid var(--border)', background: 'white', fontSize: 12, color: 'var(--foreground)' }}
                >
                  <option value="recent">Plus récents</option>
                  <option value="views">Plus vues</option>
                  <option value="title">Titre (A-Z)</option>
                </select>

                <label className="search-box">
                  <Search size={15} />
                  <input id="search-input" placeholder="Rechercher..." value={query} onChange={e => setQuery(e.target.value)} />
                </label>
              </div>
            </div>

            {/* Surprise Cards Grid */}
            <div className="surprise-grid">
              {shown.map(item => (
                <article className="surprise-card" key={item.id}>
                  <div className={`sc-art ${item.theme}`}><Heart size={26} fill="currentColor" /></div>
                  <div className="sc-body">
                    <div className="sc-header">
                      <strong className="sc-title">{item.title}</strong>
                      <span className={`sc-status ${item.published ? 'published' : 'draft'}`}>
                        <span className="status-dot" />{item.published ? 'Publiée' : 'Brouillon'}
                      </span>
                    </div>
                    <p className="sc-sub">Pour {item.recipient} {item.sender && <small style={{ opacity: 0.8 }}>· De la part de {item.sender}</small>}</p>

                    {/* Occasion and Tone pills */}
                    <div style={{ display: 'flex', gap: 6, margin: '8px 0 12px', flexWrap: 'wrap' }}>
                      {item.occasion && <span className="badge-pill" style={{ fontSize: 10, padding: '2px 8px' }}><Gift size={10} /> {item.occasion}</span>}
                      {item.tone && <span className="badge-pill" style={{ fontSize: 10, padding: '2px 8px', background: 'var(--muted)', borderColor: 'var(--border)' }}><Smile size={10} /> {item.tone}</span>}
                    </div>

                    <div className="sc-footer">
                      <span className="sc-views"><Eye size={12} /> {item.views ?? 0} vues</span>
                      <div className="sc-actions">
                        <button className="icon-btn" title="Aperçu en direct" onClick={() => setPreviewModalItem(item)}><Eye size={15} /></button>
                        <button className="icon-btn" title="Générer QR Code" onClick={() => openQrModal(item)}><QrCode size={15} /></button>
                        <button className="icon-btn" title="Copier le lien" onClick={() => copyLink(item.slug)}><Copy size={15} /></button>
                        <button className="icon-btn" title="Dupliquer" onClick={() => duplicateSurprise(item)}><CopyPlus size={15} /></button>
                        <button className="icon-btn danger" title="Supprimer" onClick={() => remove(item.id)}><Trash2 size={15} /></button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
              {!shown.length && (
                <div className="empty-state">
                  <div className="empty-icon"><Heart size={32} /></div>
                  <h3>Aucune surprise trouvée</h3>
                  <p>Ajustez vos filtres ou créez votre première surprise dès maintenant.</p>
                  <button className="primary-btn" onClick={() => setShowCreate(true)}>Créer une surprise <Plus size={14} /></button>
                </div>
              )}
            </div>
          </>
        )}

        {/* TAB 2: STATISTIQUES */}
        {activeTab === 'stats' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <div className="kpi-grid">
              <div className="kpi-card">
                <div className="kpi-icon kpi-violet"><Eye size={22} /></div>
                <div>
                  <span className="kpi-label">Vues cumulées</span>
                  <strong className="kpi-value">{totalViews}</strong>
                </div>
              </div>
              <div className="kpi-card">
                <div className="kpi-icon kpi-rose"><Award size={22} /></div>
                <div>
                  <span className="kpi-label">Top surprise</span>
                  <strong className="kpi-value" style={{ fontSize: 20 }}>{mostViewedSurprise ? mostViewedSurprise.title : 'N/A'}</strong>
                  {mostViewedSurprise && <small style={{ color: 'var(--muted-foreground)' }}>{mostViewedSurprise.views} vues</small>}
                </div>
              </div>
              <div className="kpi-card">
                <div className="kpi-icon kpi-peach"><Gift size={22} /></div>
                <div>
                  <span className="kpi-label">Taux de publication</span>
                  <strong className="kpi-value">
                    {surprises.length ? Math.round((surprises.filter(s => s.published).length / surprises.length) * 100) : 0}%
                  </strong>
                </div>
              </div>
            </div>

            <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 20, padding: 32, boxShadow: 'var(--shadow-sm)' }}>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, marginBottom: 20, color: 'var(--foreground)' }}>Performance par surprise</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {surprises.map(s => {
                  const maxV = mostViewedSurprise?.views || 1
                  const pct = Math.max(8, Math.round(((s.views ?? 0) / maxV) * 100))
                  return (
                    <div key={s.id} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600 }}>
                        <span>{s.title} <small style={{ color: 'var(--muted-foreground)', fontWeight: 400 }}>pour {s.recipient} (par {s.sender || 'Créateur'})</small></span>
                        <span>{s.views ?? 0} vues</span>
                      </div>
                      <div style={{ height: 10, width: '100%', background: 'var(--secondary)', borderRadius: 99, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: 'var(--primary)', borderRadius: 99, transition: 'width 0.6s ease' }} />
                      </div>
                    </div>
                  )
                })}
                {!surprises.length && <p style={{ color: 'var(--muted-foreground)', fontSize: 13 }}>Aucune donnée à afficher.</p>}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Création Avancée */}
      {showCreate && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setShowCreate(false)}>
          <section className="modal" style={{ maxWidth: 620, maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="modal-header">
              <div>
                <span className="eyebrow">Atelier créatif</span>
                <h2>Composez votre surprise</h2>
              </div>
              <button className="icon-btn" onClick={() => setShowCreate(false)}><X size={16} /></button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Occasion & Ton */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className="field-label">Quelle est l'occasion ?</label>
                  <select
                    className="text-input"
                    value={form.occasion}
                    onChange={e => setForm({ ...form, occasion: e.target.value })}
                  >
                    {occasions.map(occ => <option key={occ} value={occ}>{occ}</option>)}
                  </select>
                </div>
                <div>
                  <label className="field-label">Quel est le ton ?</label>
                  <select
                    className="text-input"
                    value={form.tone}
                    onChange={e => {
                      const newTone = e.target.value
                      setForm({ ...form, tone: newTone })
                      // Reset selected track url to first of new tone
                      const newTracks = AUDIO_PRESETS[newTone] || AUDIO_PRESETS['Romantique']
                      setSelectedTrackUrl(newTracks[0].url)
                    }}
                  >
                    {tones.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="field-label">Titre de l'histoire</label>
                <input id="form-title" className="text-input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Ex: Notre premier anniversaire" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className="field-label">Pour qui ? (Destinataire)</label>
                  <input id="form-recipient" className="text-input" value={form.recipient} onChange={e => setForm({ ...form, recipient: e.target.value })} placeholder="Ex: Camille" />
                </div>
                <div>
                  <label className="field-label">De la part de ? (Votre nom/prénom)</label>
                  <input id="form-sender" className="text-input" value={form.sender} onChange={e => setForm({ ...form, sender: e.target.value })} placeholder="Ex: Lucas" />
                </div>
              </div>

              <div>
                <label className="field-label">Votre message secret</label>
                <textarea id="form-message" className="text-input text-area" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Écrivez ce que vous ressentez du plus profond de votre cœur..." />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className="field-label">Question secrète (déverrouillage)</label>
                  <input id="form-question" className="text-input" value={form.question} onChange={e => setForm({ ...form, question: e.target.value })} placeholder="Ex: Quel est notre endroit préféré ?" />
                </div>
                <div>
                  <label className="field-label">Réponse exacte</label>
                  <input id="form-answer" className="text-input" value={form.answer} onChange={e => setForm({ ...form, answer: e.target.value })} placeholder="Ex: Cotonou" />
                </div>
              </div>

              {/* 🎵 Sélection Audio / Fond Musical */}
              <div>
                <label className="field-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Music size={14} /> Fond musical (3 musiques complètes pour le ton "{form.tone}")
                </label>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <button
                    type="button"
                    className={`secondary-btn ${musicChoiceMode === 'random' ? 'active' : ''}`}
                    style={{ fontSize: 12, padding: '6px 12px', background: musicChoiceMode === 'random' ? 'var(--secondary)' : 'white', borderColor: musicChoiceMode === 'random' ? 'var(--primary)' : 'var(--border)' }}
                    onClick={() => setMusicChoiceMode('random')}
                  >
                    <Shuffle size={13} /> Aléatoire
                  </button>
                  <button
                    type="button"
                    className={`secondary-btn ${musicChoiceMode === 'select' ? 'active' : ''}`}
                    style={{ fontSize: 12, padding: '6px 12px', background: musicChoiceMode === 'select' ? 'var(--secondary)' : 'white', borderColor: musicChoiceMode === 'select' ? 'var(--primary)' : 'var(--border)' }}
                    onClick={() => setMusicChoiceMode('select')}
                  >
                    <Music size={13} /> Choisir (3 pistes)
                  </button>
                  <button
                    type="button"
                    className={`secondary-btn ${musicChoiceMode === 'custom' ? 'active' : ''}`}
                    style={{ fontSize: 12, padding: '6px 12px', background: musicChoiceMode === 'custom' ? 'var(--secondary)' : 'white', borderColor: musicChoiceMode === 'custom' ? 'var(--primary)' : 'var(--border)' }}
                    onClick={() => setMusicChoiceMode('custom')}
                  >
                    Lien perso
                  </button>
                </div>

                {musicChoiceMode === 'random' && (
                  <p style={{ fontSize: 12, color: 'var(--muted-foreground)', margin: '4px 0 16px' }}>
                    ✨ LoveCraft choisira automatiquement l'une des 3 meilleures mélodies complètes de ton <strong>{form.tone}</strong>.
                  </p>
                )}

                {musicChoiceMode === 'select' && (
                  <select
                    className="text-input"
                    value={selectedTrackUrl || availableTracks[0]?.url}
                    onChange={e => setSelectedTrackUrl(e.target.value)}
                  >
                    {availableTracks.map(t => (
                      <option key={t.id} value={t.url}>{t.title}</option>
                    ))}
                  </select>
                )}

                {musicChoiceMode === 'custom' && (
                  <input
                    className="text-input"
                    value={form.music_url}
                    onChange={e => setForm({ ...form, music_url: e.target.value })}
                    placeholder="https://exemple.com/ma-chanson.mp3"
                  />
                )}
              </div>

              {/* ⏳ Countdown Date */}
              <div>
                <label className="field-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Calendar size={14} /> Déverrouillage programmé (Optionnel)
                </label>
                <input type="datetime-local" className="text-input" value={form.unlock_date} onChange={e => setForm({ ...form, unlock_date: e.target.value })} />
              </div>

              <div>
                <label className="field-label">Thème visuel</label>
                <div className="theme-picker">
                  {themes.map(theme => (
                    <button type="button" key={theme} title={`Thème ${theme}`} aria-label={`Choisir le thème ${theme}`} className={`theme-swatch ${theme} ${form.theme === theme ? 'selected' : ''}`} onClick={() => setForm({ ...form, theme })} />
                  ))}
                </div>
              </div>

              {error && <p className="form-error">{error}</p>}
            </div>

            <div className="modal-footer">
              <button id="save-draft-btn" className="secondary-btn" onClick={() => save(false)}>Enregistrer brouillon</button>
              <button id="publish-btn" className="primary-btn" onClick={() => save(true)}>Publier maintenant <ArrowRight size={14} /></button>
            </div>
          </section>
        </div>
      )}

      {/* Modal QR Code */}
      {qrModalItem && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setQrModalItem(null)}>
          <section className="modal qr-modal" style={{ maxWidth: 460 }}>
            <div className="modal-header" style={{ width: '100%', borderBottom: '1px solid var(--border)', marginBottom: 0, paddingBottom: 16 }}>
              <div>
                <span className="eyebrow">Partage & QR Code</span>
                <h2 style={{ fontSize: 20 }}>{qrModalItem.item.title}</h2>
              </div>
              <button className="icon-btn" onClick={() => setQrModalItem(null)}><X size={16} /></button>
            </div>

            <img src={qrModalItem.urlData} alt="QR code" style={{ marginTop: 20, width: 220, height: 220, borderRadius: 16, border: '1px solid var(--border)', padding: 8, background: 'white' }} />

            <p style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>Scannez ce QR Code pour accéder directement à la surprise de <strong>{qrModalItem.item.recipient}</strong>.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', marginTop: 8 }}>
              <a
                href={qrModalItem.urlData}
                download={`qrcode-${qrModalItem.item.slug}.png`}
                className="primary-btn"
                style={{ justifyContent: 'center', width: '100%' }}
              >
                <Download size={15} /> Télécharger le QR Code (PNG)
              </a>

              <button
                className="secondary-btn"
                style={{ justifyContent: 'center', width: '100%' }}
                onClick={() => copyLink(qrModalItem.item.slug)}
              >
                <Copy size={15} /> Copier le lien unique
              </button>

              <a
                href={`/s/${qrModalItem.item.slug}`}
                target="_blank"
                rel="noreferrer"
                className="ghost-btn"
                style={{ justifyContent: 'center', width: '100%' }}
              >
                <ExternalLink size={15} /> Tester la surprise en direct
              </a>
            </div>
          </section>
        </div>
      )}

      {/* Modal Aperçu Direct */}
      {previewModalItem && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setPreviewModalItem(null)}>
          <section className="modal" style={{ maxWidth: 520, padding: 36, textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <span className="eyebrow">Aperçu en direct</span>
              <button className="icon-btn" onClick={() => setPreviewModalItem(null)}><X size={16} /></button>
            </div>

            <div className={`sc-art ${previewModalItem.theme}`} style={{ height: 100, borderRadius: 16, marginBottom: 20 }}>
              <Heart size={42} fill="currentColor" />
            </div>

            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, marginBottom: 8 }}>{previewModalItem.title}</h2>
            <p style={{ color: 'var(--muted-foreground)', fontSize: 13, marginBottom: 20 }}>
              Destiné à <strong>{previewModalItem.recipient}</strong> de la part de <strong>{previewModalItem.sender || 'Un être cher'}</strong>
            </p>

            <div style={{ background: 'var(--secondary)', padding: 20, borderRadius: 14, textStyle: 'italic', fontFamily: 'Playfair Display, serif', fontSize: 17, color: 'var(--foreground)', marginBottom: 24, textAlign: 'left', whiteSpace: 'pre-wrap' }}>
              "{previewModalItem.message}"
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button className="secondary-btn" onClick={() => setPreviewModalItem(null)}>Fermer</button>
              <a href={`/s/${previewModalItem.slug}`} target="_blank" rel="noreferrer" className="primary-btn">
                Ouvrir la page complète <ExternalLink size={14} />
              </a>
            </div>
          </section>
        </div>
      )}
    </main>
  )
}

// =========================================================
// LANDING PAGE
// =========================================================

function Landing({ onAuth }: { onAuth: (mode: 'login' | 'signup') => void }) {
  const [scrolled, setScrolled] = useState(false)
  const [cardIdx, setCardIdx] = useState(0)
  const [testiIdx, setTestiIdx] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const t = setInterval(() => setTestiIdx(i => (i + 1) % testimonials.length), 4800)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const t = setInterval(() => setCardIdx(i => (i + 1) % previewCards.length), 3600)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.12 }
    )
    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <main className="landing-page">
      <nav id="main-nav" className={`landing-nav${scrolled ? ' scrolled' : ''}`}>
        <div className="nav-inner">
          <Logo />
          <div className={`landing-links${menuOpen ? ' open' : ''}`}>
            <a href="#fonctionnalites" onClick={() => setMenuOpen(false)}>Fonctionnalités</a>
            <a href="#processus" onClick={() => setMenuOpen(false)}>Comment ça marche</a>
            <a href="#temoignages" onClick={() => setMenuOpen(false)}>Histoires</a>
            <div className="mobile-only-actions" style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
              <button className="secondary-btn" style={{ width: '100%', justifyContent: 'center' }} onClick={() => { setMenuOpen(false); onAuth('login'); }}>
                Se connecter
              </button>
              <button className="primary-btn" style={{ width: '100%', justifyContent: 'center' }} onClick={() => { setMenuOpen(false); onAuth('signup'); }}>
                Commencer <ArrowRight size={14} />
              </button>
            </div>
          </div>
          <div className="landing-nav-actions">
            <button id="nav-login-btn" className="nav-login-muted desktop-only-btn" onClick={() => onAuth('login')}>Se connecter</button>
            <button id="nav-signup-btn" className="nav-cta desktop-only-btn" onClick={() => onAuth('signup')}>Commencer <ArrowRight size={14} /></button>
            <button id="nav-menu-btn" className="nav-burger" onClick={() => setMenuOpen(v => !v)} aria-label="Menu">
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      <section className="landing-hero">
        <div className="hero-bg">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-orb hero-orb-3" />
        </div>

        <div className="hero-copy">
          <span className="hero-badge"><Sparkles size={12} /> Créez des surprises inoubliables</span>
          <h1>Créez des souvenirs<br /><em>qui restent.</em></h1>
          <p>LoveCraft transforme vos mots et vos moments en expériences digitales intimes, belles et inoubliables.</p>
          <div className="hero-actions">
            <button id="hero-cta-btn" className="primary-btn hero-cta" onClick={() => onAuth('signup')}>
              Créer ma surprise <ArrowRight size={16} />
            </button>
            <Link id="hero-story-link" className="ghost-btn" href="/story">Voir notre histoire <ArrowRight size={14} /></Link>
          </div>
          <div className="hero-trust">
            <div className="trust-avatars">
              {['T', 'S', 'M', 'R'].map((l, i) => <span key={i} className="trust-av">{l}</span>)}
            </div>
            <div>
              <div className="trust-stars">★★★★★</div>
              <span>Déjà choisi par <strong>2 400+ créateurs</strong></span>
            </div>
          </div>
        </div>

        <div className="hero-art">
          {previewCards.map((c, i) => {
            const isPrev = i === (cardIdx - 1 + previewCards.length) % previewCards.length
            return (
              <div
                key={c.theme}
                className={`preview-card ${c.theme}${i === cardIdx ? ' active' : ''}${isPrev ? ' prev' : ''}`}
              >
                <small>Pour {c.for}</small>
                <Heart size={42} fill="currentColor" />
                <strong>{c.title}</strong>
                <span>{c.sub}</span>
              </div>
            )
          })}
          <div className="card-dots">
            {previewCards.map((_, i) => (
              <button key={i} className={`card-dot${i === cardIdx ? ' active' : ''}`} onClick={() => setCardIdx(i)} aria-label={`Carte ${i + 1}`} />
            ))}
          </div>
        </div>
      </section>

      <div className="proof-bar">
        <div className="proof-bar-inner">
          <span>⟶ Plus qu'un message</span>
          <span>★ 4.9/5 satisfaction</span>
          <span>❤ 2 400+ histoires créées</span>
          <span>✓ Gratuit, sans carte bancaire</span>
        </div>
      </div>

      <section id="fonctionnalites" className="landing-features animate-on-scroll">
        <div className="features-header">
          <span className="eyebrow">Tout ce qu'il faut</span>
          <h2>Votre histoire mérite<br /><em>son propre univers.</em></h2>
          <p>Pas de template impersonnel. Une expérience pensée dans les détails pour faire naître un vrai sourire.</p>
        </div>
        <div className="feature-cards">
          <article className="feature-card feature-card-hero">
            <div className="feature-mockup">
              <div className="mockup-bar"><span /><span /><span /></div>
              <div className="mockup-card rose">
                <small>Pour Éloïse ♥</small>
                <Heart size={28} fill="currentColor" />
                <strong>J'ai quelque chose à te raconter...</strong>
              </div>
            </div>
            <div>
              <div className="feature-icon"><Heart size={22} /></div>
              <h3>Un récit qui vous ressemble</h3>
              <p>Choisissez l'ambiance, écrivez les mots justes et composez une révélation à votre image.</p>
            </div>
          </article>
          <article className="feature-card">
            <div className="feature-icon"><QrCode size={22} /></div>
            <h3>Partage simple et privé</h3>
            <p>Un lien unique et un QR code pour offrir votre surprise exactement au bon moment.</p>
          </article>
          <article className="feature-card">
            <div className="feature-icon"><BarChart3 size={22} /></div>
            <h3>Le bon moment, toujours</h3>
            <p>Suivez les ouvertures et découvrez quand votre histoire a été révélée.</p>
          </article>
          <article className="feature-card">
            <div className="feature-icon"><Check size={22} /></div>
            <h3>Simple et gratuit</h3>
            <p>Créez et partagez des surprises illimitées, sans abonnement ni carte bancaire.</p>
          </article>
        </div>
      </section>

      <section id="processus" className="landing-steps animate-on-scroll">
        <div className="steps-header">
          <span className="eyebrow">Le rituel LoveCraft</span>
          <h2>De l'idée à l'émotion<br /><em>en quelques minutes.</em></h2>
        </div>
        <div className="steps-row">
          {[
            { n: '01', title: 'Imaginez', desc: 'Donnez un titre à votre histoire, choisissez un thème et posez l\'intention.' },
            { n: '02', title: 'Écrivez', desc: 'Ajoutez votre message, une question secrète et les détails qui comptent.' },
            { n: '03', title: 'Révélez', desc: 'Envoyez le lien. La personne répond, découvre et garde ce moment avec elle.' },
          ].map((step, i) => (
            <div className="step-card" key={i}>
              <div className="step-number">{step.n}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
              {i < 2 && <div className="step-arrow"><ArrowRight size={18} /></div>}
            </div>
          ))}
        </div>
      </section>

      <section id="temoignages" className="landing-testimonials animate-on-scroll">
        <div className="testi-header">
          <span className="eyebrow">Ils ont écrit une histoire</span>
          <h2>Des mots simples.<br /><em>Des réactions inoubliables.</em></h2>
        </div>
        <div className="testi-carousel">
          <div className="testi-card" key={testiIdx}>
            <div className="testi-stars">★★★★★</div>
            <p className="testi-quote">"{testimonials[testiIdx].quote}"</p>
            <div className="testi-author">
              <div className="testi-av">{testimonials[testiIdx].author[0]}</div>
              <div>
                <strong>{testimonials[testiIdx].author}</strong>
                <span>{testimonials[testiIdx].occasion}</span>
              </div>
            </div>
          </div>
          <div className="testi-controls">
            <button id="testi-prev-btn" onClick={() => setTestiIdx(i => (i - 1 + testimonials.length) % testimonials.length)} aria-label="Témoignage précédent">
              <ChevronLeft size={18} />
            </button>
            <div className="testi-dots">
              {testimonials.map((_, i) => (
                <button key={i} className={`testi-dot${i === testiIdx ? ' active' : ''}`} onClick={() => setTestiIdx(i)} aria-label={`Témoignage ${i + 1}`} />
              ))}
            </div>
            <button id="testi-next-btn" onClick={() => setTestiIdx(i => (i + 1) % testimonials.length)} aria-label="Témoignage suivant">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>

      <section className="landing-cta animate-on-scroll">
        <div className="cta-orb cta-orb-1" />
        <div className="cta-orb cta-orb-2" />
        <div className="cta-inner">
          <span className="eyebrow" style={{ color: 'rgba(240,200,208,0.6)' }}>Votre prochaine histoire vous attend</span>
          <h2>Écrivez quelque chose<br /><em>qu'on n'oubliera pas.</em></h2>
          <p>Créez gratuitement votre première surprise et donnez à vos mots une vraie place.</p>
          <button id="final-cta-btn" className="cta-btn" onClick={() => onAuth('signup')}>
            Commencer avec LoveCraft <ArrowRight size={16} />
          </button>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <Logo />
            <span>Des souvenirs, en mieux.</span>
          </div>
          <nav className="footer-nav">
            <a href="#fonctionnalites">Fonctionnalités</a>
            <a href="#processus">Comment ça marche</a>
            <Link href="/story">Notre histoire</Link>
          </nav>
          <small>© 2026 LoveCraft · Site créé et développé par <a href="https://www.facebook.com/profile.php?id=61588131732811" target="_blank" rel="noreferrer" style={{ textDecoration: 'underline', color: 'inherit' }}>MEVI Cyprien</a></small>
        </div>
      </footer>
    </main>
  )
}

function Logo() {
  return (
    <div className="brand">
      <span className="brand-mark"><Heart size={15} fill="currentColor" /></span>
      <span>LoveCraft</span>
    </div>
  )
}


