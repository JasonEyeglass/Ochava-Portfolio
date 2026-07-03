import styles from './Skills.module.css';

export default function SkillBadge({ name, highlight, highlightColor }) {
  return (
    <span
      className={`${styles.badge} ${highlight ? styles[`highlight_${highlightColor}`] : ''}`}
    >
      {name}
    </span>
  );
}
