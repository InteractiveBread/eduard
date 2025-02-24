class Eduard {
	constructor() {
		console.info('Constructing Eduard instance');
		
		// Custom Elements registrieren
		new CustomElementRegistrar();
		
		// Wrapper-Div
		// + enthält Divs für Einstellungen ("Settings"), Tage ("Days") und Berechungen ("Calculation")
		// + verarbeitet das Update-Event
		this.wrapper = document.querySelector('div.wrapper');
		
		// Settings-Div (= Eintellungen)
		this.settings = document.querySelector('div.settings');
		// Auswahl des Wochengehalts
		this.salary = 0;
		var salary_wrapper = document.querySelector('div.salary');
		var salary_select_label = document.createElement('label');
		var salary_select = document.querySelector('select[name="salary_select"]');
		let null_option = document.createElement('option');
		null_option.value = 0;
		null_option.innerText = '[ Auswahl ]';
		null_option.setAttribute('selected','');
		salary_select.append(null_option);
		for (let job_title in SALARIES) {
			let option = document.createElement('option');
			option.value = SALARIES[job_title];
			option.innerText = `${job_title} (${SALARIES[job_title]} €)`;
			salary_select.append(option);
		}
		salary_select.addEventListener(
			'input',
			(e) => {
				this.salary = e.target.value;
				this.recalculateDays();
			}
		);
		var salary_input = document.querySelector('input[name="salary_input"]');
		salary_input.addEventListener(
			'input',
			(e) => {
				this.salary = e.target.value;
				this.recalculateDays();
			}
		);
		// Auswahl des Start- und Enddatums
		var date_wrapper = document.querySelector('div.date');
		
		// Days-Div
		// + hier werden die einzelnen Tage aufgelistet (Custom Element "EdeDay")
		this.days = document.querySelector('div.days');
		// Tege zum Wrapper hinzufügen
		// + bislang: irgendeine Woche von Montag bis Sonntag
		// + später evtl. Auswahl des Start- und Endtermins über Date-Input
		[
			new Date('2025-01-27'),
			new Date('2025-01-28'),
			new Date('2025-01-29'),
			new Date('2025-01-30'),
			new Date('2025-01-31'),
			new Date('2025-02-01'),
			new Date('2025-02-02')
		].forEach(
			(e) => {
				this.days.append(new EdeDay(e, this.salary))
			}
		);
		
		// Info-Div mit Stundenzahlen und Rechnung
		this.info_box = document.querySelector('div.calculation');
		this.info_hours = this.info_box
			.appendChild(document.createElement('div'));
		this.info_calculation = this.info_box
			.appendChild(document.createElement('div'));
		
		// Aktualisierung eines einzelnen Tages -> Gesamtsumme neu berechnen
		document.addEventListener(
			'dayupdate',
			(e) => this.calculateWeeklyHours()
		);
	}
	
	calculateWeeklyHours() {
		let weekly_hours = 0;
		let daily_overtime = {};
		let weekends_and_holidays = {};
		for (let day of this.days.children) {
			weekly_hours += day.duration;
			for (let threshold in OT_DAILY) {
				let factor = OT_DAILY[threshold];
				if (factor > 1) {
					if (!Boolean(daily_overtime[factor])) {
						daily_overtime[factor] = 0;
					}
					if (Boolean(day.hours[factor])) {
						daily_overtime[factor] += day.hours[factor]
					}
				}
			}
			if (day.weekend_or_holiday) {
				if (!Boolean(weekends_and_holidays[day.weekend_or_holiday])) {
					weekends_and_holidays[day.weekend_or_holiday] = day.duration;
				} else {
					weekends_and_holidays[day.weekend_or_holiday] += day.duration;
				}
			}
		}
		// Wöchentliche Überstunden berechnen
		var hours = {};
		let prev_thresh = 0;
		if (weekly_hours/60 < 50) {
			var weekly_salary = 50;
			this.info_hours.innerHTML = `<p>Wochenarbeitszeit: <s>${(weekly_hours/60).toFixed(2)} Stunden</s> <span class="warning2"><b>50 Stunden</b> angerechnet!</span></p>`;
		} else {
			var weekly_salary = weekly_hours/60;
			this.info_hours.innerHTML = `<p>Wochenarbeitszeit: <b>${(weekly_hours/60).toFixed(2)} Stunden</b></p>`;
		}
		this.info_calculation.innerHTML = `(${this.salary} / 50) &middot; (<b>${(weekly_salary).toFixed(2)}</b>`;
		for (let hourly_threshold in OT_WEEKLY) {
			let factor = OT_WEEKLY[hourly_threshold];
			hours[factor] = Math.min((weekly_hours / 60)-prev_thresh, hourly_threshold-prev_thresh);
			if (factor > 1) {
				weekly_salary += hours[factor] * (factor-1);
				this.info_hours.innerHTML += `<p class="attn2-1"><b>${hours[factor].toFixed(2)}</b> wöchentliche Überstunde(n) ab Stunde ${Number(prev_thresh)+1}: <span class="underlined">+${Math.round((factor-1)*100)}%</span>`;
				this.info_calculation.innerHTML += ` + <span class="attn2-1"><b>${hours[factor].toFixed(2)}</b> &middot; <span class="underlined">${(factor-1).toFixed(2)}</span></span>`;
			}
			prev_thresh = hourly_threshold;
			if (weekly_hours / 60 <= hourly_threshold) {
				break;
			}
		}
		// Tägliche Überstunden berechnen
		prev_thresh = 0;
		for (let thresh in OT_DAILY) {
			let factor = OT_DAILY[thresh];
			if (factor > 1 && daily_overtime[factor] > 0) {
				weekly_salary += daily_overtime[factor] * (factor-1);
				this.info_hours.innerHTML += `<p class="attn1-1"><b>${daily_overtime[factor].toFixed(2)}</b> tägliche Überstunde(n) ab Stunde  ${Number(prev_thresh)+1}: <span class="underlined">+${Math.round((factor-1)*100)}%</span>`;
				this.info_calculation.innerHTML += ` + <span class="attn1-1"><b>${daily_overtime[factor].toFixed(2)}</b> &middot; <span class="underlined">${(factor-1).toFixed(2)}</span></span>`;
			}
			prev_thresh = thresh;
		}
		// Wochenend- und Feiertagszuschläge berechnen
		for (let wh in OT_WEEKENDS_HOLIDAYS) {
			if (Boolean(weekends_and_holidays[wh])) {
				let factor = OT_WEEKENDS_HOLIDAYS[wh];
				let hrs = weekends_and_holidays[wh] / 60;
				let label = 'Zuschlag';
				if (wh == 'sat') {
					label = 'Samstagszuschlag';
				} else if (wh == 'sun') {
					label = 'Sonntagszuschlag';
				} else if (wh == 'hol') {
					label = 'Feiertagszuschlag';
				}
				weekly_salary += hrs * (factor-1);
				this.info_hours.innerHTML += `<p class="attn1-2"><b>${hrs.toFixed(2)}</b> Stunde(n) ${label}: <span class="underlined">+${Math.round((factor-1)*100)}%</span>`;
				this.info_calculation.innerHTML += ` + <span class="attn1-2"><b>${hrs.toFixed(2)}</b> &middot; <span class="underlined">${(factor-1).toFixed(2)}</span></span>`;
			}
		}
		weekly_salary *= (this.salary / 50)
		this.info_calculation.innerHTML += `) = ${weekly_salary.toFixed(2)} €</p>`;
	}
	
	recalculateDays() {
		for (let day of this.days.children) {
			day.salary = this.salary;
			day.calculateHours();
		}
		this.calculateWeeklyHours();
	}
}

class CustomElementRegistrar {
	constructor() {
		console.info('Registering custom elements');
		customElements.define('ede-day', EdeDay, { extends : 'div' })
	}
}

class EdeDay extends HTMLDivElement {
	constructor(date) {
		super()
		this.classList.add('day');
		
		this.date = date;
		this.start = date;
		this.end = date;
		this.duration = 0;
		this.hours = {};
		this.is_a_holiday = false;
		this.weekend_or_holiday = this.getWeekendOrHoliday();
		
		var days = [
			'Sonntag',
			'Montag',
			'Dienstag',
			'Mittwoch',
			'Donnerstag',
			'Freitag',
			'Samstag'
		];
		var label = this.appendChild(document.createElement('div'));
		label.classList.add('label');
		label.innerText = days[date.getDay()];
		
		this.start_input = this.appendChild(
			document.createElement('input')
		);
		this.start_input.type = 'time';
		this.start_input.addEventListener(
			'input',
			(e) => this.calculateHours(e)
		);
		
		this.append(document.createTextNode(' - '));
		
		this.end_input = this.appendChild(
			document.createElement('input')
		);
		this.end_input.type = 'time';
		this.end_input.addEventListener(
			'input',
			(e) => this.calculateHours(e)
		);
		
		this.holiday_checkbox = document.createElement('input');
		this.holiday_checkbox.type = 'checkbox';
		this.holiday_checkbox.checked = false;
		this.holiday_checkbox.addEventListener(
			'input',
			(e) => {
				this.is_a_holiday = e.target.checked;
				this.weekend_or_holiday = this.getWeekendOrHoliday();
				this.calculateHours(e);
			}
		)
		this.append(this.holiday_checkbox);
		this.append(document.createTextNode(' Feiertag'));
		
		var info_box = this.appendChild(
			document.createElement('div')
		);
		this.info_hours = info_box.appendChild(
			document.createElement('div')
		);
	}
	
	calculateHours(e) {
		var [start_hrs, start_min] = this.start_input.value.split(':');
		this.start = new Date();
		this.start.setHours(start_hrs,start_min,0);
		var [end_hrs, end_min] = this.end_input.value.split(':');
		this.end = new Date();
		this.end.setHours(end_hrs,end_min,0);
		this.hours = {};
		if (!isNaN(this.start) && !isNaN(this.end)) {
			this.duration = Math.round(((this.end - this.start) / 1000) / 60);
			if (this.duration <= 0) {
				// Negative Stundenzahl?
				this.duration = 0;
				this.info_hours.innerText = 'Ende liegt vor dem Start!';
			} else {
				let hrs = (this.duration / 60).toFixed(2);
				this.info_hours.innerHTML = `<p>Tägliche Arbeitszeit: ${hrs} Stunden`;
				if (this.duration < 480) {
					// Weniger als 8 Stunden?
					this.duration = 480;
					this.info_hours.innerHTML += ' <span class="warning2">(Mit <b>8 Stunden</b> angerechnet!)</span>';
				} else if (this.duration > OT_DAILY_CUTOFF * 60) {
					// Mehr als die täglich erlaubte Arbeitszeit?
					this.info_hours.innerHTML += `<span class="warning3">Tägliche Höchstarbeitszeit (<b>${OT_DAILY_CUTOFF} Stunden</b>) überschritten!<br><i>(In Ausnahmefällen möglich)</i></span>`;
				}
				this.info_hours.innerHTML += '</p>';
				// Überstunden und Zulagen berechnen
				// 1. Abgestufte Überstundensätze
				let prev_thresh = 0;
				for (let hourly_threshold in OT_DAILY) {
					let factor = OT_DAILY[hourly_threshold];
					this.hours[factor] = Math.min((this.duration / 60)-prev_thresh, hourly_threshold-prev_thresh);
					if (factor > 1) {
						this.info_hours.innerHTML += `<p class="attn1-1"><b>${this.hours[factor].toFixed(2)}</b> Überstunde(n) ab Stunde ${Number(prev_thresh)+1}: <span class="underlined">+${Math.round((factor-1)*100)}%</span>`;
					}
					prev_thresh = hourly_threshold;
					if (this.duration / 60 <= hourly_threshold) {
						break;
					}
				}
				// 2. Nachzuschläge
				// @TODO
				// 3. Wochenend- und Feiertagszuschläge
				if (this.weekend_or_holiday) {
					let factor = OT_WEEKENDS_HOLIDAYS[this.weekend_or_holiday]-1
					let label = 'Zuschlag';
					if (this.weekend_or_holiday == 'sat') {
						label = 'Samstagszuschlag';
					} else if (this.weekend_or_holiday == 'sun') {
						label = 'Sonntagszuschlag';
					} else if (this.weekend_or_holiday == 'hol') {
						label = 'Feiertagszuschlag';
					}
					this.info_hours.innerHTML += `<p class="attn1-2"><b>${label}:</b> <span class="underlined">+${factor*100}%</span></p>`;
				}
				// 4. Ruhezeiten
				for (let threshold in REST_PERIOD) {
					if (this.duration / 60 <= threshold) {
						this.rest_period = REST_PERIOD[threshold];
						break;
					}
				} 
				this.info_hours.innerHTML += `<p class="mute">(Ruhezeit: <b>${this.rest_period}</b> Stunden)</p>`;
			}
		} else {
			this.duration = 0;
			this.info_hours.innerHTML = '';
		}
		document.dispatchEvent(
			new CustomEvent(
				'dayupdate', {}
			)
		);
	}
	
	getWeekendOrHoliday() {
		// Wochenende oder Feiertag?
		if (this.is_a_holiday) {
			// Feiertag
			return'hol';
		} else if (this.date.getDay() == 0) {
			// Sonntag
			return 'sun';
		} else if (this.date.getDay() == 6) {
			// Samstag
			return 'sat';
		} else {
			return false;
		}
	}
}

new Eduard();
