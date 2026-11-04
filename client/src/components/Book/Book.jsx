import { useEffect, useState, useSyncExternalStore } from 'react';
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
const LAST = LEAVES.length;

const desktopQuery = '(min-width: 900px)';
const subscribe = (cb) => {
  const mq = window.matchMedia(desktopQuery);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
};
const useDesktop = () => useSyncExternalStore(subscribe, () => window.matchMedia(desktopQuery).matches);

export default function Book() {
  const desktop = useDesktop();
  // spread 0 = closed front cover, spread LAST = closed back cover
  const [spread, setSpread] = useState(0);
  const [lastTurned, setLastTurned] = useState(-1);

  const turnTo = (next) => {
    const target = Math.max(0, Math.min(LAST, next));
    if (target === spread) return;
    // the leaf that moves last stays on top while it turns
    setLastTurned(target > spread ? target - 1 : target);
    setSpread(target);
  };

  useEffect(() => {
    if (!desktop) return undefined;
    const onKey = (e) => {
      if (e.target.closest('input, textarea')) return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') turnTo(spread + 1);
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') turnTo(spread - 1);
      else if ((e.key === 'e' || e.key === 'E') && spread === 0) turnTo(1);
      else if (e.key === 'Home') turnTo(0);
      else if (e.key === 'End') turnTo(LAST);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const goTo = (e, target) => {
    if (!desktop) return; // phones scroll to the anchor instead
    e.preventDefault();
    e.stopPropagation();
    turnTo(target);
  };

  // A click on a page that isn't on a link turns it.
  const onPageClick = (e, dir) => {
    if (!desktop || e.target.closest('a, button')) return;
    turnTo(spread + dir);
  };

  const position = spread === 0 ? s.closedFront : spread === LAST ? s.closedBack : '';

  return (
    <div className={s.desk}>
      <div className={s.lamp} aria-hidden="true" />
      <div className={`${s.book} ${position}`}>
        {LEAVES.map(([Front, Back], i) => {
          const flipped = i < spread;
          const zIndex = i === lastTurned ? LAST + 2 : flipped ? i + 1 : LAST - i;
          return (
            <div key={i} className={`${s.leaf} ${flipped ? s.flipped : ''}`} style={desktop ? { zIndex } : undefined}>
              <div
                className={`${s.face} ${s.front}`}
                inert={desktop && i !== spread ? true : undefined}
                onClick={(e) => onPageClick(e, 1)}
              >
                <Front goTo={goTo} />
              </div>
              <div
                className={`${s.face} ${s.back}`}
                inert={desktop && i !== spread - 1 ? true : undefined}
                onClick={(e) => onPageClick(e, -1)}
              >
                <Back goTo={goTo} />
              </div>
            </div>
          );
        })}
      </div>

      {desktop && (
        <nav className={s.controls} aria-label="Turn pages">
          <button type="button" onClick={() => turnTo(spread - 1)} disabled={spread === 0} aria-label="Previous page">
            ←
          </button>
          <span className={s.counter}>
            {spread === 0 ? 'Cover' : spread === LAST ? 'Back cover' : `${spread} / ${LAST - 1}`}
          </span>
          <button type="button" onClick={() => turnTo(spread + 1)} disabled={spread === LAST} aria-label="Next page">
            →
          </button>
        </nav>
      )}
    </div>
  );
}
