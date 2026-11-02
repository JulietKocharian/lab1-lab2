import { useEffect, useRef, useState } from 'react';
import {
  CLIMATES,
  climateLabel,
  getScore,
  startRound,
  submitGuess,
  type ClimateName,
  type GuessResponse,
  type RoundResponse,
  type ScoreResponse,
} from '../api';

type Phase = 'loading' | 'ready' | 'answering' | 'answered' | 'error';

export function GuessView() {
  const [phase, setPhase] = useState<Phase>('loading');
  const [error, setError] = useState('');
  const [round, setRound] = useState<RoundResponse | null>(null);
  const [score, setScore] = useState<ScoreResponse>({ correct: 0, attempts: 0 });
  const [picked, setPicked] = useState<ClimateName | null>(null);
  const [result, setResult] = useState<GuessResponse | null>(null);
  const inFlight = useRef(false);

  useEffect(() => {
    void loadRound();
  }, []);

  async function loadRound(): Promise<void> {
    inFlight.current = false;
    setPhase('loading');
    setError('');
    setResult(null);
    setPicked(null);
    try {
      const [nextRound, nextScore] = await Promise.all([startRound(), getScore()]);
      setRound(nextRound);
      setScore(nextScore);
      setPhase('ready');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not start a round.');
      setPhase('error');
    }
  }

  async function onGuess(climate: ClimateName): Promise<void> {
    if (!round || inFlight.current) {
      return;
    }
    inFlight.current = true;
    setPicked(climate);
    setPhase('answering');
    setError('');
    try {
      const guess = await submitGuess(round.roundId, climate);
      const nextScore = await getScore();
      setResult(guess);
      setScore(nextScore);
      setPhase('answered');
    } catch (err) {
      inFlight.current = false;
      setError(err instanceof Error ? err.message : 'The guess could not be checked.');
      setPhase('ready');
    }
  }

  const busy = phase === 'loading' || phase === 'answering';

  return (
    <section className="panel" aria-busy={busy}>
      <h2>Name that climate</h2>
      <p className="hint">
        A city is hidden. Read the temperature, rain, and season clues, then pick one of the five climates.
      </p>
      <ul className="score">
        <li>
          <span>Correct</span>
          <strong>{score.correct}</strong>
        </li>
        <li>
          <span>Attempts</span>
          <strong>{score.attempts}</strong>
        </li>
      </ul>

      {phase === 'loading' ? <p className="status">Drawing a city from the list…</p> : null}

      {round && phase !== 'loading' ? (
        <div className="clues">
          <article className="clue">
            <h3>Temperature</h3>
            <p>{round.clues.tempRange}</p>
          </article>
          <article className="clue">
            <h3>Rain</h3>
            <p>{round.clues.rainfall}</p>
          </article>
          <article className="clue">
            <h3>Seasons</h3>
            <p>{round.clues.season}</p>
          </article>
        </div>
      ) : null}

      <div className="choices">
        {CLIMATES.map((climate) => (
          <button
            key={climate.id}
            type="button"
            className={picked === climate.id ? `choice picked climate-${climate.id}` : `choice climate-${climate.id}`}
            disabled={phase !== 'ready'}
            onClick={() => void onGuess(climate.id)}
          >
            {climate.label}
            <small>{climate.hint}</small>
          </button>
        ))}
      </div>

      {phase === 'answering' ? <p className="status">Checking that guess…</p> : null}

      {error ? (
        <p className="banner bad" role="alert">
          {error}
        </p>
      ) : null}

      {result && picked ? (
        <div className={result.correct ? 'banner good' : 'banner bad'} role="status">
          <p className="outcome">
            {result.correct
              ? `Correct. This is ${result.city}. The climate is ${climateLabel(result.climate)}.`
              : `Not this time. You picked ${climateLabel(picked)}. This is ${result.city}, and the climate is ${climateLabel(result.climate)}.`}
          </p>
          <p>{result.explanation}</p>
        </div>
      ) : null}

      {phase === 'answered' || phase === 'error' ? (
        <button type="button" className="submit" onClick={() => void loadRound()}>
          {phase === 'error' ? 'Try again' : 'Another city'}
        </button>
      ) : null}
    </section>
  );
}
