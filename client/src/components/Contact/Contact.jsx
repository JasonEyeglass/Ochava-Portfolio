import ContactForm from './ContactForm';
import { MailIcon, MapPinIcon } from '../Icons/Icons';
import styles from './Contact.module.css';

export default function Contact() {
  return (
    <section id="contact" className={`section ${styles.section}`}>
      <div className={`sectionInner ${styles.layout}`}>
        <div className={styles.info}>
          <h2 className={styles.title}>Let&apos;s build something together.</h2>
          <p className={styles.subtitle}>
            Currently open to new opportunities and collaboration on ambitious
            projects. If you have a challenge, I have the engineering expertise
            to help.
          </p>
          <div className={styles.contactBlocks}>
            <div className={styles.block}>
              <span className={`${styles.iconBox} ${styles.iconCyan}`}>
                <MailIcon />
              </span>
              <div>
                <span className={styles.blockLabel}>Email Me</span>
                <a href="mailto:hello@kjo.dev" className={styles.blockValue}>
                  hello@kjo.dev
                </a>
              </div>
            </div>
            <div className={styles.block}>
              <span className={`${styles.iconBox} ${styles.iconGreen}`}>
                <MapPinIcon />
              </span>
              <div>
                <span className={styles.blockLabel}>Location</span>
                <span className={styles.blockValue}>Remote / Global</span>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.formWrapper}>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
