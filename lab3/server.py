#!/usr/bin/env python3
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlparse

UNITS = ("C", "F", "K")

PAGE = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Temperature</title>
</head>
<body>
  <h1>Temperature</h1>
  <form action="/convert" method="get">
    <input name="value" type="number" step="any" required>
    <select name="src">
      <option>C</option>
      <option>F</option>
      <option>K</option>
    </select>
    to
    <select name="dst">
      <option>F</option>
      <option>C</option>
      <option>K</option>
    </select>
    <button type="submit">Convert</button>
  </form>
  {result}
</body>
</html>
"""


def to_celsius(value, unit):
    if unit == "C":
        return value
    if unit == "F":
        return (value - 32) * 5 / 9
    if unit == "K":
        return value - 273.15
    raise ValueError(unit)


def from_celsius(value, unit):
    if unit == "C":
        return value
    if unit == "F":
        return value * 9 / 5 + 32
    if unit == "K":
        return value + 273.15
    raise ValueError(unit)


def convert(value, src, dst):
    return from_celsius(to_celsius(value, src), dst)


class Handler(BaseHTTPRequestHandler):
    def _send(self, code, body, content_type="text/html; charset=utf-8"):
        data = body.encode()
        self.send_response(code)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path == "/health":
            self._send(200, "ok\n", "text/plain; charset=utf-8")
            return
        if parsed.path == "/":
            self._send(200, PAGE.format(result=""))
            return
        if parsed.path != "/convert":
            self._send(404, "not found\n", "text/plain; charset=utf-8")
            return

        query = parse_qs(parsed.query)
        try:
            value = float(query["value"][0])
            src = query["src"][0].upper()
            dst = query["dst"][0].upper()
            if src not in UNITS or dst not in UNITS:
                raise ValueError("unit")
            result = convert(value, src, dst)
        except (KeyError, ValueError, IndexError):
            self._send(400, PAGE.format(result="<p>Use a number and C, F, or K.</p>"))
            return

        self._send(200, PAGE.format(result=f"<p>{value:g} {src} = {result:.2f} {dst}</p>"))


if __name__ == "__main__":
    ThreadingHTTPServer(("0.0.0.0", 8000), Handler).serve_forever()
