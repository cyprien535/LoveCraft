import Link from 'next/link'
import { Heart, ArrowLeft, Shield, FileText } from 'lucide-react'

export const metadata = {
  title: "Conditions d'utilisation",
  description: "Conditions générales d'utilisation du service LoveCraft."
}

export default function TermsPage() {
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
            <FileText size={14} /> Juridique & Utilisation
          </span>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 4vw, 42px)', color: 'var(--foreground)', marginTop: 8, marginBottom: 12 }}>
            Conditions Générales d'Utilisation
          </h1>
          <p style={{ color: 'var(--muted-foreground)', fontSize: 14 }}>
            Dernière mise à jour : 21 août 2026
          </p>
        </div>

        <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 24, padding: 'clamp(24px, 5vw, 48px)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: 32, lineHeight: 1.7, fontSize: 15, color: 'var(--foreground)' }}>
          <section>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, color: 'var(--primary)', marginBottom: 12 }}>
              1. Objet du Service
            </h2>
            <p>
              LoveCraft est une plateforme interactive en ligne permettant à ses utilisateurs de créer, personnaliser et partager des surprises digitales (lettres d'amour interactives, messages secrets avec question de déverrouillage, ambiance musicale, galeries photos et cartes souvenirs).
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, color: 'var(--primary)', marginBottom: 12 }}>
              2. Accès et Inscription
            </h2>
            <p>
              L'accès au service est gratuit. La création d'un compte utilisateur nécessite une adresse email valide ou une authentification via un fournisseur tiers (Google). L'utilisateur s'engage à préserver la confidentialité de ses identifiants de connexion.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, color: 'var(--primary)', marginBottom: 12 }}>
              3. Règles de conduite et Contenus publiés
            </h2>
            <p>
              LoveCraft est dédié au partage de moments bienveillants et affectueux. L'utilisateur est seul responsable des textes, photos et informations qu'il insère dans ses surprises. Sont strictement prohibés :
            </p>
            <ul style={{ paddingLeft: 24, marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li>Les contenus haineux, menaçants, diffamatoires ou discriminatoires.</li>
              <li>Les contenus violents, pornographiques ou attentatoires à la dignité humaine.</li>
              <li>Les tentatives d'usurpation d'identité ou de harcèlement.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, color: 'var(--primary)', marginBottom: 12 }}>
              4. Propriété intellectuelle
            </h2>
            <p>
              La marque LoveCraft, le design, le code source, les animations et la structure générale de l'application sont la propriété exclusive de leurs auteurs. Les utilisateurs conservent l'intégralité de leurs droits d'auteur sur leurs messages et photos personnels.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, color: 'var(--primary)', marginBottom: 12 }}>
              5. Disponibilité et Responsabilité
            </h2>
            <p>
              Nous mettons tout en œuvre pour assurer une disponibilité maximale du service. Toutefois, LoveCraft ne saurait être tenu responsable d'éventuelles interruptions temporaires dues à des opérations de maintenance ou des dysfonctionnements du réseau Internet.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, color: 'var(--primary)', marginBottom: 12 }}>
              6. Contact & Réclamations
            </h2>
            <p>
              Pour toute question ou signalement relatif aux présentes conditions, vous pouvez nous contacter directement via notre <Link href="/contact" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'underline' }}>page de contact</Link>.
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
