import projectsData from '../../data/projects.json';
import { ArrowRightIcon, ExternalLinkIcon, LinkIcon } from '../Icons/Icons';
import styles from './Projects.module.css';

function StackTags({ stack, className }) {
  return (
    <ul className={className} aria-label="Tech stack">
      {stack.map((tech) => (
        <li key={tech}>{tech}</li>
      ))}
    </ul>
  );
}

function FeaturedCard({ project }) {
  return (
    <article className={styles.featuredCard}>
      <img src={project.image} alt="" className={styles.featuredBg} />
      <div className={styles.featuredOverlay} />
      <div className={styles.featuredContent}>
        <span className={styles.label}>{project.label}</span>
        <h3 className={styles.featuredTitle}>{project.title}</h3>
        <p className={styles.featuredDesc}>{project.description}</p>
        <div className={styles.featuredFooter}>
          <StackTags stack={project.stack} className={styles.tags} />
          {project.links.live && (
            <a href={project.links.live} className={styles.linkBtn} aria-label="View project">
              <LinkIcon />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

function CompactCard({ project }) {
  return (
    <article className={`${styles.compactCard} ${styles.networkBg}`}>
      <div className={styles.compactContent}>
        <h3 className={styles.compactTitle}>{project.title}</h3>
        <p className={styles.compactDesc}>{project.description}</p>
        <StackTags stack={project.stack} className={styles.tags} />
        {project.links.github && (
          <a
            href={project.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.githubLink}
          >
            GitHub
            <ArrowRightIcon />
          </a>
        )}
      </div>
    </article>
  );
}

function VisualCard({ project }) {
  return (
    <article className={styles.visualCard}>
      <img src={project.image} alt="" className={styles.visualBg} />
      <div className={styles.visualOverlay} />
      <div className={styles.visualContent}>
        <h3 className={styles.visualTitle}>{project.title}</h3>
        <StackTags stack={project.stack} className={styles.tags} />
        {project.links.github && (
          <a
            href={project.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.githubLink}
          >
            GitHub
            <ArrowRightIcon />
          </a>
        )}
      </div>
    </article>
  );
}

function DetailCard({ project }) {
  return (
    <article className={`${styles.detailCard} ${styles.chevronBg}`}>
      <span className={styles.detailLabel}>{project.label}</span>
      <h3 className={styles.detailTitle}>{project.title}</h3>
      <p className={styles.detailDesc}>{project.description}</p>
      <StackTags stack={project.stack} className={styles.monoTags} />
    </article>
  );
}

export default function Projects() {
  const featured = projectsData.filter((p) => p.layout === 'featured');
  const compact = projectsData.filter((p) => p.layout === 'compact');
  const secondary = projectsData.filter((p) => p.layout === 'visual' || p.layout === 'detail');

  return (
    <section id="projects" className="section">
      <div className="sectionInner">
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Flagship Projects</h2>
            <p className={styles.subtitle}>
              A selection of recent works showcasing complex architecture and
              high-end execution.
            </p>
          </div>
          <a
            href="https://github.com/karljasonochava"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.repoLink}
          >
            View All Repository
            <ExternalLinkIcon />
          </a>
        </div>

        <div className={styles.featuredRow}>
          {featured.map((p) => (
            <FeaturedCard key={p.id} project={p} />
          ))}
          {compact.map((p) => (
            <CompactCard key={p.id} project={p} />
          ))}
        </div>

        <div className={styles.secondaryRow}>
          {secondary.map((p) =>
            p.layout === 'visual' ? (
              <VisualCard key={p.id} project={p} />
            ) : (
              <DetailCard key={p.id} project={p} />
            )
          )}
        </div>
      </div>
    </section>
  );
}
