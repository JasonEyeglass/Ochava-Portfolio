import projects from '../../data/projects.json';
import experience from '../../data/experience.json';
import skills from '../../data/skills.json';
import { DownloadIcon, ExternalLinkIcon, GitHubIcon, MailIcon, PhoneIcon } from '../Icons/Icons';
import s from './Pages.module.css';

const EMAIL = 'karljason.ochava@gmail.com';
const PHONE = '0976 161 8346';
const GITHUB = 'https://github.com/JasonEyeglass';
const { robmon, claudeTools } = projects;

function Page({ id, num, kicker, children, className = '' }) {
  return (
    <article id={id} className={`${s.page} ${className}`}>
      {kicker && <p className={s.kicker}>{kicker}</p>}
      {children}
      {num && <p className={s.num}>{num}</p>}
    </article>
  );
}

export function Cover() {
  return (
    <article id="top" className={s.cover}>
      <p className={s.coverVol}>Vol. 1 · 2026 Edition</p>
      <h1 className={s.coverTitle}>
        Karl Jason
        <br />
        Ochava
      </h1>
      <p className={s.coverSub}>Player's Handbook</p>
      <p className={s.coverRole}>Developer · Game builder · Systems analyst</p>
      <p className={s.prompt}>
        <kbd>E</kbd> Open the book
      </p>
    </article>
  );
}

const CONTENTS = [
  ['About the author', 1, 'about'],
  ['Character sheet', 2, 'sheet'],
  ['Quest log', 3, 'quests'],
  ['RobMon', 4, 'robmon'],
  ['Screenshots', 5, 'gallery'],
  ['claude-tools', 6, 'tools'],
  ['Send a letter', 7, 'contact'],
];

export function Contents({ goTo }) {
  return (
    <Page id="contents" num="i" kicker="Contents">
      <h2 className={s.h2}>Inside this book</h2>
      <ol className={s.toc}>
        {CONTENTS.map(([label, page, id]) => (
          <li key={id}>
            <a href={`#${id}`} onClick={(e) => goTo(e, Math.floor(page / 2) + 1)}>
              <span>{label}</span>
              <span className={s.dots} />
              <span>{page}</span>
            </a>
          </li>
        ))}
      </ol>
      <p className={s.note}>
        Turn pages with the arrow keys, or click the edge of a page.
      </p>
    </Page>
  );
}

export function About() {
  return (
    <Page id="about" num="1" kicker="About the author">
      <figure className={s.polaroid}>
        <img src="/img/karl.jpg" alt="Karl Jason Ochava" width="227" height="222" />
      </figure>
      <h2 className={s.h2}>Hi, I'm Karl.</h2>
      <p className={s.lead}>
        I'm an Information Systems graduate from Dasmariñas, Cavite. I like building things people can play
        with.
      </p>
      <p>
        Right now I'm making <strong>RobMon</strong>, a creature-raising game on Roblox, together with an AI
        pair-programmer. I design the systems, steer the code and build the world. Before that I worked on data and
        systems: a data analyst internship and the analysis and documentation of our capstone system.
      </p>
      <p className={s.honors}>BS Information Systems · Dean's Lister 2022–2026</p>
    </Page>
  );
}

export function CharacterSheet() {
  return (
    <Page id="sheet" num="2" kicker="Character sheet">
      <dl className={s.stats}>
        <div><dt>Class</dt><dd>Developer</dd></div>
        <div><dt>Home</dt><dd>Cavite, PH</dd></div>
        <div><dt>Guild</dt><dd>KLD, BSIS 2026</dd></div>
        <div><dt>Status</dt><dd className={s.ready}>Open to work</dd></div>
        <div className={s.wide}><dt>Playstyle</dt><dd>Vibe coder: I build with AI (Claude Code) and steer every system</dd></div>
      </dl>
      {skills.map((group) => (
        <section key={group.category} className={s.skillGroup}>
          <h3 className={s.h3}>{group.category}</h3>
          <ul className={s.chips}>
            {group.skills.map((skill) => <li key={skill}>{skill}</li>)}
          </ul>
        </section>
      ))}
      <h3 className={s.h3}>Badges</h3>
      <ul className={s.list}>
        <li>Cisco: Introduction to Data Science (2024)</li>
        <li>Cisco: Python Essentials 1 (2024)</li>
        <li>Cisco: Introduction to Cybersecurity (2024)</li>
      </ul>
    </Page>
  );
}

export function Quests() {
  return (
    <Page id="quests" num="3" kicker="Quest log">
      <h2 className={s.h2}>Quests completed</h2>
      <ol className={s.quests}>
        {experience.map((q) => (
          <li key={q.id}>
            <p className={s.questMeta}>{q.period}</p>
            <h3 className={s.questTitle}>{q.role}</h3>
            <p className={s.questOrg}>{q.org}</p>
            <ul className={s.list}>
              {q.points.map((p) => <li key={p}>{p}</li>)}
            </ul>
          </li>
        ))}
      </ol>
    </Page>
  );
}

export function RobMon() {
  return (
    <Page id="robmon" num="4" kicker={robmon.tag}>
      <h2 className={s.display}>{robmon.title}</h2>
      <p className={s.lead}>{robmon.blurb}</p>
      <dl className={s.facts}>
        {robmon.facts.map(([value, label]) => (
          <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
        ))}
      </dl>
      <ul className={s.list}>
        {robmon.points.map((p) => <li key={p}>{p}</li>)}
      </ul>
      <a className={s.play} href={robmon.link} target="_blank" rel="noreferrer">
        Play on Roblox <ExternalLinkIcon />
      </a>
      <p className={s.stack}>{robmon.stack.join(' · ')}</p>
    </Page>
  );
}

export function Gallery() {
  const [hero, ...rest] = robmon.gallery;
  return (
    <Page id="gallery" num="5" kicker="Screenshots from RobMon">
      <figure className={s.shot}>
        <img src={hero.src} alt={hero.caption} loading="lazy" />
        <figcaption>{hero.caption}</figcaption>
      </figure>
      <div className={s.shotGrid}>
        {rest.map((g) => (
          <figure key={g.src} className={s.shot}>
            <img src={g.src} alt={g.caption} loading="lazy" />
            <figcaption>{g.caption}</figcaption>
          </figure>
        ))}
      </div>
    </Page>
  );
}

export function Tools() {
  return (
    <Page id="tools" num="6" kicker={claudeTools.tag}>
      <h2 className={s.display}>{claudeTools.title}</h2>
      <p className={s.lead}>{claudeTools.blurb}</p>
      <ol className={s.tools}>
        {claudeTools.tools.map(([name, desc], i) => (
          <li key={name}>
            <span className={s.toolNum}>0{i + 1}</span>
            <div>
              <h3 className={s.h3}>{name}</h3>
              <p>{desc}</p>
            </div>
          </li>
        ))}
      </ol>
      <a className={s.play} href={claudeTools.link} target="_blank" rel="noreferrer">
        View on GitHub <ExternalLinkIcon />
      </a>
      <p className={s.stack}>{claudeTools.stack.join(' · ')}</p>
    </Page>
  );
}

export function Contact() {
  return (
    <Page id="contact" num="7" kicker="Send a letter">
      <h2 className={s.display}>Let's build something.</h2>
      <p className={s.lead}>
        I'm open to developer, game and data roles. The fastest way to reach me is email.
      </p>
      <ul className={s.links}>
        <li>
          <a href={`mailto:${EMAIL}`}><MailIcon /> {EMAIL}</a>
        </li>
        <li>
          <a href="tel:+639761618346"><PhoneIcon /> {PHONE}</a>
        </li>
        <li>
          <a href={GITHUB} target="_blank" rel="noreferrer"><GitHubIcon /> github.com/JasonEyeglass <ExternalLinkIcon /></a>
        </li>
        <li>
          <a href="/Karl_Jason_Ochava_Resume.pdf" download><DownloadIcon /> Download my resume (PDF)</a>
        </li>
      </ul>
      <p className={s.sign}>Karl</p>
    </Page>
  );
}

export function BackCover() {
  return (
    <article className={s.cover}>
      <p className={s.coverSub}>The End</p>
      <p className={s.coverRole}>…of Vol. 1. More pages are being written.</p>
      <p className={s.coverRole}>This book was built with React, Vite, JavaScript, HTML and CSS.</p>
      <p className={s.coverVol}>© 2026 Karl Jason Ochava</p>
    </article>
  );
}
