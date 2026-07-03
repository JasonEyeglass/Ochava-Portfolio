import styles from './About.module.css';

const PROFILE_IMAGE =
  'https://images.unsplash.com/photo-1517694712202-8dd0798254e8?w=600&q=80';

export default function About() {
  return (
    <section id="about" className="section">
      <div className={`sectionInner ${styles.about}`}>
        <div className={styles.imageWrapper}>
          <div className={styles.imageFrame}>
            <span className={styles.cornerTL} aria-hidden="true" />
            <span className={styles.cornerBR} aria-hidden="true" />
            <img
              src={PROFILE_IMAGE}
              alt="Karl Jason Ochava working at a development workstation"
              className={styles.image}
            />
          </div>
        </div>
        <div className={styles.content}>
          <h2 className={styles.title}>
            <span className={styles.titleBar} aria-hidden="true" />
            Engineering Efficiency. Solving Complexity.
          </h2>
          <div className={styles.text}>
            <p>
              I am a Full-Stack Developer dedicated to building robust digital
              architectures. My background is rooted in the belief that clean,
              maintainable code is the foundation of every successful product.
            </p>
            <p>
              With experience spanning from cloud-native microservices to
              pixel-perfect frontends, I specialize in translating complex
              business requirements into high-performance user-centric solutions.
              My focus is always on efficiency, whether it&apos;s optimizing
              database queries or refining a UI interaction.
            </p>
          </div>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statValue}>5+</span>
              <span className={styles.statLabel}>Years Experience</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>20+</span>
              <span className={styles.statLabel}>Projects Delivered</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
