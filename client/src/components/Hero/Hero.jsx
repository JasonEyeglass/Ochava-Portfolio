import { ArrowRightIcon, DownloadIcon } from '../Icons/Icons';
import styles from './Hero.module.css';

export default function Hero() {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className={styles.hero}>
      <div className={styles.bgGlow} aria-hidden="true" />
      <pre className={styles.codeSnippet} aria-hidden="true">{`{
  "developer": "Karl Jason Ochava",
  "focus": ["Scalability", "Architecture"],
  "stack": {
    "frontend": "Next.js / TypeScript",
    "backend": "Node.js / Go / Python",
    "cloud": "AWS / Docker"
  }
}`}</pre>
      <div className={styles.inner}>
        <span className={styles.badge}>Full-Stack Developer</span>
        <h1 className={styles.headline}>
          Building Scalable{' '}
          <span className={styles.highlight}>Digital Solutions</span>{' '}
          with Precision.
        </h1>
        <p className={styles.description}>
          Karl Jason Ochava — Engineering high-performance web applications that
          merge technical excellence with elegant design.
        </p>
        <div className={styles.ctas}>
          <button className={`btn btnPrimary ${styles.ctaPrimary}`} onClick={() => scrollTo('projects')}>
            View Projects
            <ArrowRightIcon />
          </button>
          <a href="/resume.pdf" className={`btn btnOutline ${styles.ctaSecondary}`} download>
            Download Resume
            <DownloadIcon />
          </a>
        </div>
      </div>
    </section>
  );
}
