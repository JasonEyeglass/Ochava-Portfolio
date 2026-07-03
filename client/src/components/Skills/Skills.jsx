import skillsData from '../../data/skills.json';
import { CategoryIcon } from '../Icons/Icons';
import SkillBadge from './SkillBadge';
import styles from './Skills.module.css';

export default function Skills() {
  return (
    <section id="skills" className={`section ${styles.section}`}>
      <div className="sectionInner">
        <div className={styles.header}>
          <h2 className={styles.title}>Technical Proficiency</h2>
          <p className={styles.subtitle}>
            My toolkit is built on modern industry standards, optimized for speed,
            security, and developer experience.
          </p>
        </div>
        <div className={styles.grid}>
          {skillsData.map(({ category, icon, iconColor, skills }) => (
            <div key={category} className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={`${styles.iconBox} ${styles[`icon_${iconColor}`]}`}>
                  <CategoryIcon name={icon} />
                </span>
                <h3 className={styles.categoryTitle}>{category}</h3>
              </div>
              <div className={styles.badges}>
                {skills.map((skill) => (
                  <SkillBadge
                    key={skill.name}
                    name={skill.name}
                    highlight={skill.highlight}
                    highlightColor={iconColor}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
