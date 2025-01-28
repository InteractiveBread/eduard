# Eduard - Changelog

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
