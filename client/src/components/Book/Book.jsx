import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import {
  Cover, Contents, About, CharacterSheet, Quests, RobMon, Gallery, Tools, Contact, BackCover,
} from '../Pages/Pages';
import s from './Book.module.css';

// Each leaf is one sheet of paper: front is a right-hand page, back is the next left-hand page.
const LEAVES = [
  [Cover, Contents],
  [About, CharacterSheet],
  [Quests, RobMon],
  [Gallery, Tools],
  [Contact, BackCover],
];
// Phones show one page at a time, so every page gets its own leaf with a blank back.
const PAGES = LEAVES.flat().map((Page) => [Page]);

const desktopQuery = '(min-width: 900px)';
const subscribe = (cb) => {
  const mq = window.matchMedia(desktopQuery);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
};
const useDesktop = () => useSyncExternalStore(subscribe, () => window.matchMedia(desktopQuery).matches);

export default function Book() {
  const desktop = useDesktop();
  const leaves = desktop ? LEAVES : PAGES;
  // Desktop: 0 = closed front cover, LEAVES.length = closed back cover.
  // Phone: the index of the page on top; the back cover is never turned.
  const max = desktop ? LEAVES.length : PAGES.length - 1;
  const [at, setAt] = useState(0);
  const [lastTurned, setLastTurned] = useState(-1);
  const cur = Math.min(at, max);
  const swipe = useRef(null);

  const turnTo = (next) => {
    const target = Math.max(0, Math.min(max, next));
    if (target === cur) return;
    // the leaf that moves last stays on top while it turns
    setLastTurned(target > cur ? target - 1 : target);
    setAt(target);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.target.closest('input, textarea')) return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') turnTo(cur + 1);
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') turnTo(cur - 1);
      else if ((e.key === 'e' || e.key === 'E') && cur === 0) turnTo(1);
      else if (e.key === 'Home') turnTo(0);
      else if (e.key === 'End') turnTo(max);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  // `page` counts every page from the cover (0) to the back cover.
  const goTo = (e, page) => {
    e.preventDefault();
    e.stopPropagation();
    turnTo(desktop ? Math.ceil(page / 2) : page);
  };

  // A click on a page that isn't on a link turns it.
  const onPageClick = (e, dir) => {
    if (e.target.closest('a, button')) return;
    turnTo(cur + dir);
  };

  // Phones also turn pages with a sideways swipe.
  const onPointerDown = (e) => {
    swipe.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e) => {
    if (!swipe.current) return;
    const dx = e.clientX - swipe.current.x;
    const dy = e.clientY - swipe.current.y;
    swipe.current = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) turnTo(cur + (dx < 0 ? 1 : -1));
  };

  const position = !desktop ? '' : cur === 0 ? s.closedFront : cur === max ? s.closedBack : '';

  return (
    <div className={s.desk}>
      <div className={s.lamp} aria-hidden="true" />
      <div
        className={`${s.book} ${position}`}
        data-book
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        {leaves.map(([Front, Back], i) => {
          const flipped = i < cur;
          const zIndex = i === lastTurned ? leaves.length + 2 : flipped ? i + 1 : leaves.length - i;
          return (
            <div key={i} className={`${s.leaf} ${flipped ? s.flipped : ''}`} style={{ zIndex }}>
              <div
                className={`${s.face} ${s.front}`}
                inert={i !== cur ? true : undefined}
                onClick={(e) => onPageClick(e, 1)}
              >
                <Front goTo={goTo} />
              </div>
              <div
                className={`${s.face} ${s.back}`}
                inert={!Back || i !== cur - 1 ? true : undefined}
                onClick={(e) => onPageClick(e, -1)}
              >
                {Back && <Back goTo={goTo} />}
              </div>
            </div>
          );
        })}
      </div>

      <nav className={s.controls} aria-label="Turn pages">
        <button type="button" onClick={() => turnTo(cur - 1)} disabled={cur === 0} aria-label="Previous page">
          ←
        </button>
        <span className={s.counter}>
          {cur === 0 ? 'Cover' : cur === max ? 'Back cover' : `${cur} / ${max - 1}`}
        </span>
        <button type="button" onClick={() => turnTo(cur + 1)} disabled={cur === max} aria-label="Next page">
          →
        </button>
      </nav>
    </div>
  );
}
