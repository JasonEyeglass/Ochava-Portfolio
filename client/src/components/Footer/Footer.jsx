import styles from './Footer.module.css';

const SOCIAL_LINKS = [
  { label: 'GitHub', href: 'https://github.com/karljasonochava' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/karljasonochava' },
  { label: 'Twitter', href: 'https://twitter.com/karljasonochava' },
  { label: 'Email', href: 'mailto:hello@kjo.dev' },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.logo}>KJO.DEV</span>
          <p className={styles.tagline}>
            &copy; {new Date().getFullYear()} Karl Jason Ochava. Engineered for performance.
          </p>
        </div>
        <ul className={styles.links}>
          {SOCIAL_LINKS.map(({ label, href }) => (
            <li key={label}>
              <a href={href} target="_blank" rel="noopener noreferrer">
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
