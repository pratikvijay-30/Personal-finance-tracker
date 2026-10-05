export default function WelcomeAnimation({ name, onComplete }) {
  return (
    <div className="welcome-animation" role="status" aria-live="polite" onAnimationEnd={onComplete}>
      <div className="welcome-animation-copy">
        <h1>Welcome, {name}</h1>
        <p>A little more clarity, every day.</p>
      </div>
    </div>
  );
}
