// Wöchentliche Gehälter (50 Stunden)
// + Keys: Berufsbezeichnungen
// + Values: Gehälter
const SALARIES = {
	'Regie-Assistenz' : 1553,
	'2. Regie-Assistenz' : 943,
	'Script Continuity' : 1292,
	'Herstellungsleitung' : 2643,
	'Produktionsleitung' : 2003,
	'Produktionsleitungs-Assistenz' : 1472,
	'1. Aufnahmeleitung' : 1553,
	'2. Aufnahmeleitung' : 1160,
	'Motiv-Aufnahmeleitung' : 1160,
	'Set-AL Assistenz' : 943,
	'Filmgeschäftsführung' : 1518,
	'Assistenz der Filmgeschäftsführung' : 1160,
	'Filmbuchhaltung inkl. Kassenführung' : 1160,
	'Produktions-Sekretariat / Team-Assistenz' : 1134,
	'Produktionsfahrer (mit Produktionserfahrung)' : 896,
	'Kameramann/-frau' : 3151,
	'Kamera-Schwenker (nicht lichtsetzend)' : 1791,
	'1. Kamera-Assistenz /DIT (Digital Imaging Technican)' : 1542,
	'2. Kamera-Assistenz / Daten-Assistenz' : 1160,
	'Material-Assistenz' : 1160,
	'Data Wrangler (HD)' : 1160,
	'Oberbeleuchter' : 1742,
	'Lichttechniker' : 1322,
	'Lichtassistenz (mit Produktionserfahrung)' : 943,
	'1. Kamerabühne' : 1636,
	'Kamerabühnen-Assistenz' : 1064,
	'Schnitt (Filmeditor)' : 1696,
	'1. Schnitt-Assistenz' : 1064,
	'2. Schnitt-Assistenz' : 943,
	'Szenenbild' : 1906,
	'Szenenbild-Assistenz' : 1326,
	'Außen-Requisite' : 1434,
	'Setrequisite (vorher Innen-Requisite)' : 1292,
	'Requisiten-Assistenz' : 943,
	'Location-Scouting' : 1160,
	'Kostümbild' : 1696,
	'Kostümbild-Assistenz' : 1254,
	'Kostümberatung' : 1482,
	'Garderobe/Gewand' : 1224,
	'Maskenbild' : 1482,
	'Ton' : 1782,
	'Ton-Assistenz' : 1292,
	'2. Ton-Assistenz' : 943,
	'Sounddesign' : 1636,
};

// Tägliche Überstunden
// + Keys: Stundenobergrenzen
// + Values: Faktor für den Stundenlohn
// z.B.
//   + 10 : 1 -> Bis 10 Stunden normaler Lohn
//   + 11 : 1.25 -> 11. Stunde +25% (Faktor: 1.25)
//   + 12 : 1.5 -> 12. Stunde +50%
//
//   Alles ab Stunde 13 eigentlich nicht mehr erlaubt.
//   Im Tarifvertrag stehn da keine gesonderten Zuschläge (?)
//   + 13 : 1.6 -> 13. Stunde +60% (????) (NUR IN AUSNAHMEFÄLLEN MÖGLICH!)
//   + 24 : 2 -> jede weitere Stunde +100% (????) (NUR IN AUSNAHMEFÄLLEN MÖGLICH!)
const OT_DAILY = {
	10 : 1,
	11 : 1.25,
	24 : 1.5,
	//~ 12 : 1.5,
	//~ 13 : 1.6,
	//~ 24 : 2
};

// Obergrenze tägl. Arbeitszeit: 12 Stunden!
//   + in Ausnahmefällen Mehrarbeit möglich
const OT_DAILY_CUTOFF = 12;

// Nachtarbeit
// + zwischen 22:00 und 06:00 Uhr -> +25%
const OT_NIGHT = {
	'start' : '22:00',
	'end' : '06:00',
	'factor' : 1.25,
};

// Wochenenden und Feiertage
// + Samstage -> +25%
// + Sonntage -> +75%
// + Feiertage -> +100%
const OT_WEEKENDS_HOLIDAYS = {
	'sat' : 1.25,
	'sun' : 1.75,
	'hol' : 2
};

// Pausen
// + fixe Pause von 45 Minuten pro Tag = 0,75 Stunden
const BREAK = 0.75;

// Ruhezeiten
// + bis 11 Stunden Arbeitszeit -> 11 Stunden
// + bei über 11 Stunden Arbeitszeit -> 11,5 Stunden
const REST_PERIOD = {
	11 : 11,
	24 : 11.5,
};

// Wöchentliche Überstunden
// + 50 Stunden -> regulär
// + 51 - 55 -> +25%
// + jede weitere -> +50%
const OT_WEEKLY = {
	50 : 1,
	55 : 1.25,
	168 : 1.5,
};

// Obergrenze wöchentl. Arbeitszeit: 60 Stunden
const OT_WEEKLY_CUTOFF = 60;

console.info('Constants defined');
