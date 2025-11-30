import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const startBtn = document.querySelector("[data-start]");
startBtn.disabled = true;
const timerFields = document.querySelectorAll(".timer-field");
let countdownInterval = null;
let userSelectedDate = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
 onClose(selectedDates) {
  const selectedDate = selectedDates[0];
  const now = new Date();

  if (selectedDate > now) {
    startBtn.disabled = false;
    userSelectedDate = selectedDate;
  } else {
    startBtn.disabled = true;
    iziToast.error({
      title: "Error",
      message: "Please choose a date in the future",
      position: "topRight",
    });
  }
}
};

flatpickr("#datetime-picker", options);


startBtn.addEventListener("click", () => {
  const now = new Date();
  const timeDifference = userSelectedDate - now;

  if (timeDifference <= 0) {
    iziToast.error({
      title: 'Error',
      message: 'Please choose a date in the future',
    });
    return;
  }

  startCountdown(timeDifference);
});



function startCountdown(duration) {
  clearInterval(countdownInterval);
  startBtn.disabled = true; // 

  let remainingTime = duration;
  countdownInterval = setInterval(() => {
    if (remainingTime <= 0) {
      clearInterval(countdownInterval);
      iziToast.success({
        title: 'Success',
        message: 'Countdown finished!',
      });
      startBtn.disabled = false; // 
      return;
    }

    const timeComponents = convertMs(remainingTime);
    document.querySelector("[data-days]").textContent = String(timeComponents.days).padStart(2, '0');
    document.querySelector("[data-hours]").textContent = String(timeComponents.hours).padStart(2, '0');
    document.querySelector("[data-minutes]").textContent = String(timeComponents.minutes).padStart(2, '0');
    document.querySelector("[data-seconds]").textContent = String(timeComponents.seconds).padStart(2, '0');
    remainingTime -= 1000;
  }, 1000);
}




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




