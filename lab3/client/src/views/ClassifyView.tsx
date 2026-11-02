import { FormEvent, useState } from 'react';
import { classifyClimate, climateLabel, type Classification } from '../api';

type Phase = 'idle' | 'loading' | 'done' | 'error';

function readNumber(value: string): number | null {
  const trimmed = value.trim();
  if (trimmed === '') {
    return null;
  }
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

export function ClassifyView() {
  const [averageHighC, setAverageHighC] = useState('');
  const [annualRainfallMm, setAnnualRainfallMm] = useState('');
  const [humidityPercent, setHumidityPercent] = useState('');
  const [phase, setPhase] = useState<Phase>('idle');
  const [error, setError] = useState('');
  const [result, setResult] = useState<Classification | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setPhase('loading');
    setError('');
    setResult(null);
    try {
      const classification = await classifyClimate({
        averageHighC: readNumber(averageHighC),
        annualRainfallMm: readNumber(annualRainfallMm),
        humidityPercent: readNumber(humidityPercent),
      });
      setResult(classification);
      setPhase('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'The climate could not be classified.');
      setPhase('error');
    }
  }

  return (
    <section className="panel" aria-busy={phase === 'loading'}>
      <h2>Classify a place</h2>
      <p className="hint">
        Enter the average high, the rain for a full year, and the humidity. The server checks polar, tropical,
        dry, and continental cutoffs in that order. Anything left is temperate.
      </p>
      <form className="form" onSubmit={(event) => void onSubmit(event)}>
        <label>
          <span>Average high (°C)</span>
          <input
            name="averageHighC"
            type="number"
            inputMode="decimal"
            step="any"
            value={averageHighC}
            onChange={(event) => setAverageHighC(event.target.value)}
            placeholder="29"
          />
        </label>
        <label>
          <span>Annual rainfall (mm)</span>
          <input
            name="annualRainfallMm"
            type="number"
            inputMode="decimal"
            step="any"
            value={annualRainfallMm}
            onChange={(event) => setAnnualRainfallMm(event.target.value)}
            placeholder="2100"
          />
        </label>
        <label>
          <span>Humidity (%)</span>
          <input
            name="humidityPercent"
            type="number"
            inputMode="decimal"
            step="any"
            value={humidityPercent}
            onChange={(event) => setHumidityPercent(event.target.value)}
            placeholder="82"
          />
        </label>
        <p className="hint">Average high from −80 to 55 °C. Rain from 0 to 12000 mm. Humidity from 0 to 100%.</p>
        <button type="submit" className="submit" disabled={phase === 'loading'}>
          {phase === 'loading' ? 'Classifying…' : 'Classify climate'}
        </button>
      </form>

      {error ? (
        <p className="banner bad" role="alert">
          {error}
        </p>
      ) : null}

      {result ? (
        <div className={`banner info climate-${result.climate}`} role="status">
          <h3 className="climate-name">{climateLabel(result.climate)}</h3>
          <p>{result.reason}</p>
          <p>
            <strong>Typical weather. </strong>
            {result.weatherNote}
          </p>
        </div>
      ) : null}
    </section>
  );
}
