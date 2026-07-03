import { useState } from 'react';
import testimonialsData from '../../data/testimonials.json';
import styles from './Testimonials.module.css';

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const current = testimonialsData[activeIndex];

  const goTo = (index) => {
    setActiveIndex((index + testimonialsData.length) % testimonialsData.length);
  };

  return (
    <section id="testimonials" className="section">
      <div className="sectionInner">
        <span className="sectionLabel">Testimonials</span>
        <h2 className="sectionTitle">What people say</h2>
        <div className={styles.carousel}>
          <blockquote className={styles.quote}>
            <p>&ldquo;{current.quote}&rdquo;</p>
            <footer className={styles.author}>
              <div className={styles.avatar} aria-hidden="true">
                {current.name.charAt(0)}
              </div>
              <div>
                <cite className={styles.name}>{current.name}</cite>
                <span className={styles.role}>{current.role}</span>
              </div>
            </footer>
          </blockquote>
          <div className={styles.controls}>
            <button
              className={styles.navBtn}
              onClick={() => goTo(activeIndex - 1)}
              aria-label="Previous testimonial"
            >
              ←
            </button>
            <div className={styles.dots} role="tablist" aria-label="Testimonial navigation">
              {testimonialsData.map((_, index) => (
                <button
                  key={index}
                  role="tab"
                  aria-selected={index === activeIndex}
                  aria-label={`Testimonial ${index + 1}`}
                  className={`${styles.dot} ${index === activeIndex ? styles.dotActive : ''}`}
                  onClick={() => setActiveIndex(index)}
                />
              ))}
            </div>
            <button
              className={styles.navBtn}
              onClick={() => goTo(activeIndex + 1)}
              aria-label="Next testimonial"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
