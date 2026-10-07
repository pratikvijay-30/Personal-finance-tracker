import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/hooks";
import AnimatedBackground from "../components/ui/AnimatedBackground";

export default function Hero() {
  const { user } = useAuth();
  const navigate = useNavigate();

  function getStarted() {
    navigate(user ? "/dashboard" : "/signup");
  }

  return (
    <div className="public-page landing">
      <AnimatedBackground />
      <header className="landing-nav">
        <Link className="brand" to="/" aria-label="Paisa home">Paisa</Link>
        <nav className="landing-actions" aria-label="Account">
          <button className="nav-login" type="button" onClick={() => navigate("/login")}>Log in</button>
          <button className="button button-primary nav-cta" type="button" onClick={getStarted}>Get started</button>
        </nav>
      </header>

      <main className="story">
        <section className="story-step story-step-intro" data-s="0">
          <div className="story-copy">
            <h1>Know where every rupee goes.</h1>
            <p className="story-lead">One tracker for your balance, income, spending and savings. Scroll to watch your money take shape.</p>
            <div className="story-actions">
              <button className="button button-primary button-large" type="button" onClick={getStarted}>Create free account</button>
              <button className="button button-outline button-large" type="button" onClick={() => navigate("/login")}>Log in</button>
            </div>
          </div>
        </section>
        <StoryStep number="01" title="See where it goes">
          Every expense lands in a category, so rent, food and travel are never a mystery.
        </StoryStep>
        <StoryStep number="02" title="Watch income grow">
          Track every source of money and compare each month with the last.
        </StoryStep>
        <StoryStep number="03" title="Reach your savings goal">
          Set a target and see your progress fill up as you save.
        </StoryStep>
        <section className="story-step" data-s="4">
          <div className="story-copy story-card">
            <span className="story-number">04</span>
            <h2>Ready to start?</h2>
            <p>Your first budget takes about two minutes.</p>
            <button className="button button-primary button-large" type="button" onClick={getStarted}>Get started free</button>
          </div>
        </section>
      </main>

      <footer className="landing-footer">Paisa personal finance tracker.</footer>
    </div>
  );
}

function StoryStep({ number, title, children }) {
  return (
    <section className="story-step" data-s={Number(number)}>
      <article className="story-copy story-card">
        <span className="story-number">{number}</span>
        <h2>{title}</h2>
        <p>{children}</p>
      </article>
    </section>
  );
}
