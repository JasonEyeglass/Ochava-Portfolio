import experienceData from '../../data/experience.json';
import styles from './Experience.module.css';

export default function Experience() {
  return (
    <section id="experience" className="section">
      <div className="sectionInner">
        <span className="sectionLabel">Experience</span>
        <h2 className="sectionTitle">Where I&apos;ve been</h2>
        <p className="sectionSubtitle">
          My journey building web applications and growing as a developer.
        </p>
        <div className={styles.timeline}>
          {experienceData.map((item, index) => (
            <article key={item.id} className={styles.item}>
              <div className={styles.marker} aria-hidden="true">
                <span className={styles.dot} />
                {index < experienceData.length - 1 && <span className={styles.line} />}
              </div>
              <div className={styles.content}>
                <time className={styles.period}>{item.period}</time>
                <h3 className={styles.role}>
                  {item.role}
                  <span className={styles.company}> @ {item.company}</span>
                </h3>
                <p className={styles.description}>{item.description}</p>
                <ul className={styles.highlights}>
                  {item.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
