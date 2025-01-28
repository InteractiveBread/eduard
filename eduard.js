class Eduard {
	constructor() {
		console.info('Constructing Eduard instance');
		// Registering custom elements
		new CustomElementRegistrar();
		// Wrapper-Div
		// + contains settings, days and calculation
		// + listens to update events
		this.wrapper = document.querySelector('main')
			.appendChild(document.createElement('div'));
		this.wrapper.classList.add('wrapper');
		// Settings-Div
		this.settings = this.wrapper
			.appendChild(document.createElement('div'));
		this.settings.classList.add('settings');
		// Days-Div
		this.days = this.wrapper
			.appendChild(document.createElement('div'));
		this.days.classList.add('days');
		// Calculation-Div
		this.calculation = this.wrapper
			.appendChild(document.createElement('div'));
		this.calculation.classList.add('calculation');
		
		// Appending days to Days-Wrapper
		// + for now just a random week: Mon - Sun
		// + later we can use date inputs to determine the start and end date
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
				this.days.append(new EdeDay(e))
			}
		);
		
		document.addEventListener(
			'dayupdate',
			(e) => this.calculate()
		);
	}
	
	calculate() {
		console.log('AAA');
		let total_time = 0;
		for (let day of this.days.children) {
			total_time += day.duration;
		}
		this.calculation.innerText = total_time;
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
		
		this.start = date;
		this.end = date;
		this.duration = 0;
		
		var days = [
			'Sonntag',
			'Montag',
			'Dienstag',
			'Mittwoch',
			'Donnerstag',
			'Freitag',
			'Samstag'
		];
		this.innerText = days[date.getDay()];
		
		this.start_input = this.appendChild(
			document.createElement('input')
		);
		this.start_input.type = 'time';
		this.start_input.addEventListener(
			'input',
			(e) => this.calculateTime(e)
		);
		
		this.end_input = this.appendChild(
			document.createElement('input')
		);
		this.end_input.type = 'time';
		this.end_input.addEventListener(
			'input',
			(e) => this.calculateTime(e)
		);
		
		this.info_text = this.appendChild(
			document.createElement('div')
		);
	}
	
	calculateTime(e) {
		var [start_hrs, start_min] = this.start_input.value.split(':');
		this.start = new Date();
		this.start.setHours(start_hrs,start_min,0);
		var [end_hrs, end_min] = this.end_input.value.split(':');
		this.end = new Date();
		this.end.setHours(end_hrs,end_min,0);
		if (!isNaN(this.start) && !isNaN(this.end)) {
			this.duration = Math.round(((this.end - this.start) / 1000) / 60);
			if (this.duration >= 0) {
				let hrs = Math.floor(this.duration / 60);
				let mins = this.duration%60;
				this.info_text.innerText = `${hrs}:${mins}`;
			} else {
				this.info_text.innerText = 'Ende liegt vor dem Start!';
				this.duration = 0;
			}
		} else {
			this.info_text.innerText = '';
			this.duration = 0;
		}
		document.dispatchEvent(
			new CustomEvent(
				'dayupdate', {}
			)
		);
	}
}

new Eduard();
