from flask import Blueprint, request

from app.convert import UNITS, convert

bp = Blueprint("temperature", __name__)

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


@bp.get("/health")
def health():
    return "ok\n", 200, {"Content-Type": "text/plain; charset=utf-8"}


@bp.get("/")
def index():
    return PAGE.format(result="")


@bp.get("/convert")
def convert_temperature():
    try:
        raw_value = request.args["value"]
        src = request.args["src"].upper()
        dst = request.args["dst"].upper()
        value = float(raw_value)
        if src not in UNITS or dst not in UNITS:
            raise ValueError("unit")
        result = convert(value, src, dst)
    except (KeyError, ValueError, TypeError):
        body = PAGE.format(result="<p>Use a number and C, F, or K.</p>")
        return body, 400
    body = PAGE.format(result=f"<p>{value:g} {src} = {result:.2f} {dst}</p>")
    return body
