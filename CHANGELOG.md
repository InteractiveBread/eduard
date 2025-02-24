# Eduard - Changelog

## 0.1.5 (2025-02-24)

- aktuelle Gagen und Überstundensätze
- maximale tägliche Arbeitszeit

## 0.1.4 (2025-02-02)

### eduard.js / index.html / style.css
- Layout-Update

### eduard.js
- Input-Feld für freie Eingabe der Gage

## 0.1.3 (2025-02-02)

### eduard.js / style.css
- Style-/Layout-Update

## 0.1.2 (2025-01-29)

### index.html / style.css
- Style-Update
- erweiterte Farbpalette

### eduard.js
- kleinere Bugfixes beim Neuberechnen der täglichen Überstunden
- Unterstützung der erweiterten Farbpalette (CSS-Klassen)

## 0.1.1 (2025-01-29)

### eduard.js
- Darstellung der täglichen Überstunden in der Wochenübersicht

## 0.1.0 (2025-01-29)

Berechnung der täglichen und wöchentlichen Überstunden und des Wochenlohns.

### constants.js
- Testwerte für Lohn und Überstunden

### eduard.js
- `EdeDay` - Ermittlung der täglichen Überstunden
- `Eduard` - Ermittlung der wöchentlichen Überstunden und Berechnug des gesamten Wochenlohns

## 0.0.1 (2025-01-28)

Arbeitszeiten der einzelnen Tage werden ermittelt und für die Woche zusammengerechnet.

### index.html / style.css
- grobes Layout

### constants.js
- angelegt
- noch keine Konstanten hinzugefügt

### eduard.js
- Hauptklasse `Eduard`
  - verarbeitet `CustomEvent`
  - rechnet Wochenarbeitszeit zusammen
- Custom Element für einzelne Tage `EdeDay`
  - `input`-Element für Start- und Endzeit
  - Ermittlung der täglichen Arbeitszeit
  - `CustomEvent`-Dispatch bei Eingabe der Uhrzeiten
