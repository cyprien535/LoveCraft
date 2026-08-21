import Link from 'next/link'
import { Heart, ArrowLeft, Cookie, Info } from 'lucide-react'

export const metadata = {
  title: "Politique des Cookies",
  description: "Informations sur l'utilisation des cookies et traceurs sur LoveCraft."
}

export default function CookiesPage() {
  return (
    <main className="story-page" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav className="story-nav">
        <Link href="/" className="brand">
          <span className="brand-mark"><Heart size={15} fill="currentColor" /></span>
          <span>LoveCraft</span>
        </Link>
        <div className="story-links">
          <Link href="/">Accueil</Link>
          <Link href="/story">Notre histoire</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <Link href="/" className="story-nav-cta">
          Créer une surprise
        </Link>
      </nav>

      <div style={{ maxWidth: 860, margin: '40px auto 80px', padding: '0 24px', flex: 1, width: '100%' }}>
        <div style={{ marginBottom: 32 }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--muted-foreground)', marginBottom: 20 }}>
            <ArrowLeft size={14} /> Retour à l'accueil
          </Link>
          <span className="eyebrow" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Cookie size={14} /> Traceurs & Cookies
          </span>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 4vw, 42px)', color: 'var(--foreground)', marginTop: 8, marginBottom: 12 }}>
            Politique relative aux Cookies
          </h1>
          <p style={{ color: 'var(--muted-foreground)', fontSize: 14 }}>
            Dernière mise à jour : 21 août 2026
          </p>
        </div>

        <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 24, padding: 'clamp(24px, 5vw, 48px)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: 32, lineHeight: 1.7, fontSize: 15, color: 'var(--foreground)' }}>
          <section>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, color: 'var(--primary)', marginBottom: 12 }}>
              1. Qu'est-ce qu'un cookie ?
            </h2>
            <p>
              Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, tablette ou smartphone) lors de la visite d'un site internet. Il permet au site de mémoriser vos préférences et de maintenir votre session ouverte de manière sécurisée.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, color: 'var(--primary)', marginBottom: 12 }}>
              2. Les cookies utilisés sur LoveCraft
            </h2>
            <p>LoveCraft privilégie une approche respectueuse et minimaliste. Nous utilisons uniquement :</p>
            <ul style={{ paddingLeft: 24, marginTop: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li>
                <strong>Cookies essentiels de session & authentification (Supabase Auth) :</strong> indispensables pour vous maintenir connecté à votre espace de création en toute sécurité.
              </li>
              <li>
                <strong>Mesure d'audience anonyme (Vercel Analytics) :</strong> pour mesurer les performances techniques et la stabilité du service, sans aucun suivi publicitaire invasif.
              </li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, color: 'var(--primary)', marginBottom: 12 }}>
              3. Absence de cookies publicitaires tiers
            </h2>
            <p>
              LoveCraft n'utilise <strong>aucun cookie publicitaire tiers ni traceur de reciblage commercial</strong>. Vos moments intimes ne sont jamais monétisés.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, color: 'var(--primary)', marginBottom: 12 }}>
              4. Gestion des cookies dans votre navigateur
            </h2>
            <p>
              Vous pouvez à tout moment configurer votre navigateur pour bloquer ou supprimer les cookies. Veuillez noter que la désactivation des cookies essentiels peut empêcher la connexion à votre compte LoveCraft.
            </p>
          </section>
        </div>
      </div>

      <footer className="landing-footer">
        <div className="footer-inner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
          <div className="footer-brand">
            <div className="brand">
              <span className="brand-mark"><Heart size={15} fill="currentColor" /></span>
              <span>LoveCraft</span>
            </div>
            <span>Des souvenirs, en mieux.</span>
          </div>
          <small>© 2026 LoveCraft · Site créé et développé par <a href="https://www.facebook.com/profile.php?id=61588131732811" target="_blank" rel="noreferrer" style={{ textDecoration: 'underline', color: 'inherit' }}>MEVI Cyprien</a></small>
        </div>
      </footer>
    </main>
  )
}
