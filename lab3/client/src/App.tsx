import { useEffect, useState } from 'react';
import { ClassifyView } from './views/ClassifyView';
import { GuessView } from './views/GuessView';

type View = 'guess' | 'classify';

function readView(): View {
  return window.location.pathname.startsWith('/classify') ? 'classify' : 'guess';
}

export function App() {
  const [view, setView] = useState<View>(readView);

  useEffect(() => {
    const onPop = () => setView(readView());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  function open(next: View): void {
    const path = next === 'classify' ? '/classify' : '/';
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    setView(next);
  }

  return (
    <div className="page">
      <header className="site-header">
        <h1>Climate guess</h1>
        <nav className="tabs" aria-label="Screens">
          <button type="button" className={view === 'guess' ? 'tab active' : 'tab'} onClick={() => open('guess')}>
            Guess
          </button>
          <button
            type="button"
            className={view === 'classify' ? 'tab active' : 'tab'}
            onClick={() => open('classify')}
          >
            Classify
          </button>
        </nav>
      </header>
      <p className="lede">
        Guess the climate behind a hidden city, or classify a place from its average high, yearly rain, and humidity.
      </p>
      {view === 'guess' ? <GuessView /> : <ClassifyView />}
    </div>
  );
}
