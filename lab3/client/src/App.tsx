import { FormEvent, useState } from 'react';
import './App.css';

const UNITS = ['C', 'F', 'K'] as const;
type Unit = (typeof UNITS)[number];

export default function App() {
  const [value, setValue] = useState('');
  const [src, setSrc] = useState<Unit>('C');
  const [dst, setDst] = useState<Unit>('F');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setResult('');

    const params = new URLSearchParams({ value, src, dst });
    const response = await fetch(`/convert?${params.toString()}`);
    const text = (await response.text()).trim();

    if (!response.ok) {
      setError('Use a number and C, F, or K.');
      return;
    }

    setResult(text);
  }

  return (
    <main>
      <h1>Temperature</h1>
      <form onSubmit={onSubmit}>
        <label>
          Value
          <input
            name="value"
            type="number"
            step="any"
            inputMode="decimal"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            required
          />
        </label>
        <label>
          From
          <select name="src" value={src} onChange={(event) => setSrc(event.target.value as Unit)}>
            {UNITS.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </label>
        <label>
          To
          <select name="dst" value={dst} onChange={(event) => setDst(event.target.value as Unit)}>
            {UNITS.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </label>
        <button type="submit">Convert</button>
      </form>
      {result ? <p className="result">{result}</p> : null}
      {error ? <p className="error">{error}</p> : null}
    </main>
  );
}
