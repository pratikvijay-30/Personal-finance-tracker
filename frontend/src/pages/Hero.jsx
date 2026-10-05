import { Link } from "react-router-dom";
import { useAuth } from "../context/hooks";
import ThemeSwitch from "../components/ui/ThemeSwitch";
import AnimatedBackground from "../components/ui/AnimatedBackground";
import { formatCurrency } from "../utils/format";

export default function Hero() {
  const { user } = useAuth();
  const appLink = user ? "/dashboard" : "/signup";
  return (
    <>
      <AnimatedBackground />
      <div className="landing">
      <header className="landing-nav">
        <Link className="brand" to="/"><span className="brand-mark">p.</span><span>pocketwise</span></Link>
        <nav className="landing-links"><a href="#features">Features</a><a href="#how-it-works">How it works</a></nav>
        <div className="landing-actions"><ThemeSwitch /><Link className="nav-login" to="/login">Log in</Link><Link className="button button-primary nav-cta" to={appLink}>{user ? "Open app" : "Get started"} <span>↗</span></Link></div>
      </header>
      <main>
        <section className="hero-section">
          <div className="hero-copy"><span className="eyebrow"><i className="eyebrow-dot" /> YOUR MONEY, A LITTLE MORE MINDFUL</span><h1>Take control of<br />every <em>rupee.</em></h1><p>A calmer way to see where your money goes, what you’re growing, and what’s possible next.</p><div className="hero-ctas"><Link className="button button-primary button-large" to={appLink}>Get started free <span>↗</span></Link><Link className="hero-secondary" to="/login"><span className="play-icon">▶</span> Log in to your account</Link></div><div className="hero-proof"><div className="proof-avatars"><i>A</i><i>M</i><i>R</i></div><span>Made for real life, not just spreadsheets.</span></div></div>
          <div className="hero-art" aria-label="Pocketwise dashboard preview">
            <div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" />
            <div className="preview-window"><div className="preview-header"><div className="preview-brand"><span className="brand-mark">p.</span> pocketwise</div><div className="preview-dots"><i /><i /><i /></div></div><div className="preview-content"><span className="eyebrow">MONDAY, OCTOBER 05</span><h3>Good morning, Aarav <span>✳</span></h3><p>Here’s your money at a glance.</p><div className="preview-balance"><div><span>Total balance</span><strong>{formatCurrency(128450)}</strong></div><span className="preview-change">↗ 12.8%</span><div className="preview-chart"><svg viewBox="0 0 520 105" preserveAspectRatio="none" role="img" aria-label="Balance trend rising over the past month"><defs><linearGradient id="fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="var(--income)" stopOpacity=".2" /><stop offset="100%" stopColor="var(--income)" stopOpacity="0" /></linearGradient></defs><path d="M0 79 C45 74 47 51 94 62 S144 80 183 50 S238 67 281 40 S327 56 366 30 S421 45 458 20 S495 29 520 8 V105 H0Z" fill="url(#fill)" /><path d="M0 79 C45 74 47 51 94 62 S144 80 183 50 S238 67 281 40 S327 56 366 30 S421 45 458 20 S495 29 520 8" fill="none" stroke="var(--income)" strokeWidth="3" /></svg></div><div className="preview-months"><span>Sep 08</span><span>Sep 15</span><span>Sep 22</span><span>Sep 29</span><span>Oct 05</span></div></div><div className="preview-bottom"><div className="preview-stat"><span>Income</span><strong>₹97,500</strong><small>↗ 8.2% this month</small></div><div className="preview-divider" /><div className="preview-stat"><span>Spent</span><strong>₹18,240</strong><small>↘ 3.4% this month</small></div></div></div>
            </div>
            <div className="float-card float-savings"><span className="float-icon">✳</span><div><small>Monthly savings</small><strong>₹24,850</strong></div><span className="float-arrow">↗</span></div><div className="float-card float-goal"><span className="goal-ring">82%</span><div><small>Trip to Japan</small><strong>Goal reached</strong></div></div><span className="hero-sparkle sparkle-a">✳</span><span className="hero-sparkle sparkle-b">✦</span>
          </div>
        </section>
        <section className="trust-strip"><span>MADE TO MAKE SENSE OF YOUR MONEY</span><div><span>Track spending</span><b>✳</b><span>Build good habits</span><b>✳</b><span>Grow your savings</span></div></section>
        <section className="marketing-section features-section" id="features"><div className="section-intro"><span className="eyebrow">A PLACE FOR EVERY RUPEE</span><h2>Small details.<br /><em>Big-picture clarity.</em></h2><p>Everything you need to feel more in control, without the spreadsheet headache.</p></div><div className="feature-grid">
          <Feature number="01" icon="↔" title="Track transactions" copy="Know what came in, what went out, and where it all went." tone="peach" /><Feature number="02" icon="↗" title="Manage incomes" copy="Keep salary, side projects, and every extra earning in view." tone="mint" /><Feature number="03" icon="◔" title="Visual analysis" copy="Make sense of the patterns with charts that just click." tone="lavender" /><Feature number="04" icon="◎" title="Set gentle goals" copy="Build budgets that guide you, not guilt-trip you." tone="yellow" />
        </div></section>
        <section className="steps-section" id="how-it-works"><div className="steps-heading"><span className="eyebrow">THREE LITTLE STEPS</span><h2>Clearer money days,<br /><em>starting now.</em></h2></div><div className="steps-grid"><Step n="01" title="Make it yours" copy="Create your account in a moment. No bank connection required." /><Step n="02" title="Add your money" copy="Log a few transactions and income sources to get started." /><Step n="03" title="See the whole picture" copy="Find your rhythm with an overview that makes sense at a glance." /></div></section>
        <section className="final-cta"><div className="cta-flower">✳</div><span className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</span><h2>Feel good about<br />where it’s going.</h2><p>Your money story is yours to write. Let’s make it a little clearer.</p><Link className="button button-primary button-large" to={appLink}>Get started — it’s free <span>↗</span></Link><div className="cta-doodle">◎</div></section>
      </main>
      <footer className="landing-footer"><Link className="brand" to="/"><span className="brand-mark">p.</span><span>pocketwise</span></Link><span>A little more clarity, every day.</span><span>© 2026 Pocketwise</span></footer>
      </div>
    </>
  );
}

function Feature({ number, icon, title, copy, tone }) {
  return <article className="feature-card"><div className={`feature-icon ${tone}`}>{icon}</div><span className="feature-number">{number}</span><h3>{title}</h3><p>{copy}</p><span className="feature-arrow">↗</span></article>;
}

function Step({ n, title, copy }) {
  return <article className="step-card"><span className="step-number">{n}</span><span className="step-line" /><h3>{title}</h3><p>{copy}</p></article>;
}
