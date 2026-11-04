import { lazy, Suspense } from 'react';
import Book from './components/Book/Book';

// three.js only loads after the book, so Jojo never slows the first paint.
const Dog = lazy(() => import('./components/Dog/Dog'));

export default function App() {
  return (
    <main>
      <Book />
      <Suspense fallback={null}>
        <Dog />
      </Suspense>
    </main>
  );
}
