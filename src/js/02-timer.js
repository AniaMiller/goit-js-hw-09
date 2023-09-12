import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import Notiflix, { Notify } from 'notiflix';

const refs = {
  BtnStartEl: document.querySelector('button[data-start]'),
  inputDays: document.querySelector('.field [data-days]'),
  inputHours: document.querySelector('.field [data-hours]'),
  inputMinutes: document.querySelector('.field [data-minutes]'),
  inputSeconds: document.querySelector('.field [data-seconds]'),
};

const DELAY = 1000;
refs.BtnStartEl.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0] <= Date.now()) {
      Notify.failure('Please check the date and pick one from the future');
      refs.BtnStartEl.disabled = true;
    } else {
      refs.BtnStartEl.disabled = false;
    }
  },
};

const datePicker = flatpickr('#datetime-picker', options);

function renderInterface(time) {
  refs.inputDays.textContent = time.days;
  refs.inputHours.textContent = time.hours;
  refs.inputMinutes.textContent = time.minutes;
  refs.inputSeconds.textContent = time.seconds;
}

class Timer {
  constructor({ onTick }) {
    this.intervalId = null;
    this.isActive = false;
    this.onTick = onTick;
  }

  start() {
    if (this.isActive) {
      return;
    }

    const startTime = datePicker.selectedDates[0].getTime();
    this.isActive = true;

    this.intervalId = setInterval(() => {
      const currentTime = Date.now();
      const countdownTime = startTime - currentTime;

      if (countdownTime < 0) {
        clearInterval(this.intervalId);
        return;
      }

      const time = this.convertMs(countdownTime);
      this.onTick(time);
    }, DELAY);
  }

  addLeadingZero(value) {
    return `${value}`.padStart(2, '0');
  }

  convertMs(ms) {
    // Number of milliseconds per unit of time
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    // Remaining days
    const days = Math.floor(ms / day);
    // Remaining hours
    const hours = Math.floor((ms % day) / hour);
    // Remaining minutes
    const minutes = Math.floor(((ms % day) % hour) / minute);
    // Remaining seconds
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
  }
}

const timer = new Timer({
  onTick: renderInterface,
});

refs.BtnStartEl.addEventListener('click', timer.start.bind(timer));