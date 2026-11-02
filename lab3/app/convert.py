UNITS = ("C", "F", "K")


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
