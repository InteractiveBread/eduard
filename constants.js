// Wöchentliche Gehälter (50 Stunden)
// + Keys: Berufsbezeichnungen
// + Values: Gehälter
const SALARIES = {
	'Test 1' : 1234,
	'Test 2' : 2345,
	'Test 3' : 3456,
};

// Tägliche Überstunden
// + Keys: Stundenobergrenzen
// + Values: Faktor für den Stundenlohn
// z.B.
//   + 10 : 1 -> Bis 10 Stunden normaler Lohn
//   + 12 : 1.5 -> Bis 12 Stunden 50% Zuschlag (Faktor 1.5)
const OT_DAILY = {
	12 : 1,
	13 : 1.6,
	24 : 2
}

// Wöchentliche Überstunden
const OT_WEEKLY = {
	50 : 1,
	60 : 1.25,
	168 : 1.5,
}

console.info('Constants defined');
