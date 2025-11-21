import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const refs = {
  btn: document.querySelector('[data-start]'),
  date: document.querySelector('#datetime-picker'),
  days: document.querySelector('[data-days]'),
  hrs: document.querySelector('[data-hours]'),
  min: document.querySelector('[data-minutes]'),
  sec: document.querySelector('[data-seconds]'),
};

function convertMs(ms) {
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

let userSelectedDate;
const addLeadingZero = num => num.toString().padStart(2, '0');

const dateFlatPickr = flatpickr(refs.date, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];
    //pastDate
    if (userSelectedDate < new Date()) {
      iziToast.show({
        message: 'Please choose a date in the future',
        class: 'toast',
        position: 'topRight',
      });
      refs.btn.setAttribute('disabled', '');
      return;
    }
    refs.btn.removeAttribute('disabled', '');
  },
});
const timer = date => {
  const intervalId = setInterval(() => {
    const timeDiff = date - new Date();
    const time = convertMs(timeDiff);

    const { days, hours, minutes, seconds } = time;
    refs.days.textContent = addLeadingZero(days);
    refs.hrs.textContent = addLeadingZero(hours);
    refs.min.textContent = addLeadingZero(minutes);
    refs.sec.textContent = addLeadingZero(seconds);

    if (timeDiff < 1000) {
      clearInterval(intervalId);
      refs.date.removeAttribute('disabled', '');
    }
  }, 1000);
};

refs.btn.setAttribute('disabled', '');

refs.btn.addEventListener('click', () => {
  timer(userSelectedDate);
  refs.btn.setAttribute('disabled', '');
  refs.date.setAttribute('disabled', '');
});
