let is12HourFormat = false;
let blinkEnabled = true;

function formatTimeUnit(val) {
    return Number(val) < 10 ? "0" + Number(val) : String(val);
}

function getTimeData(date, is12Hour = false) {
    const rawHours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    let ampm = "";

    let displayHours = rawHours;
    if (is12Hour) {
        ampm = rawHours >= 12 ? "PM" : "AM";
        displayHours = rawHours % 12;
        if (displayHours === 0) displayHours = 12;
    }

    return {
        hours: formatTimeUnit(displayHours),
        minutes: formatTimeUnit(minutes),
        seconds: formatTimeUnit(seconds),
        ampm: ampm,
        rawHours: rawHours
    };
}

function formatDate(date) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    return {
        dayName: days[date.getDay()],
        monthName: months[date.getMonth()],
        dayNumber: date.getDate(),
        year: date.getFullYear(),
        formatted: `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
    };
}

function getTimezoneString() {
    try {
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "Local";
        const offset = -new Date().getTimezoneOffset();
        const sign = offset >= 0 ? "+" : "-";
        const offsetHours = Math.floor(Math.abs(offset) / 60);
        const offsetMins = Math.abs(offset) % 60;
        const formattedOffset = `GMT${sign}${offsetHours}:${offsetMins < 10 ? '0' : ''}${offsetMins}`;
        return `${timeZone} (${formattedOffset})`;
    } catch (e) {
        return "Local Timezone";
    }
}

function updateClock() {
    const now = new Date();
    const timeData = getTimeData(now, is12HourFormat);

    const hoursElement = document.getElementById("hours");
    const minutesElement = document.getElementById("minutes");
    const secondsElement = document.getElementById("seconds");

    if (hoursElement) hoursElement.textContent = timeData.hours;
    if (minutesElement) minutesElement.textContent = timeData.minutes;
    if (secondsElement) secondsElement.textContent = timeData.seconds;

    const ampmElement = document.getElementById("ampm");
    if (ampmElement) {
        if (is12HourFormat) {
            ampmElement.textContent = timeData.ampm;
            ampmElement.style.display = "inline-block";
        } else {
            ampmElement.style.display = "none";
        }
    }

    const dateElement = document.getElementById("date-display");
    if (dateElement) {
        const dateInfo = formatDate(now);
        dateElement.textContent = dateInfo.formatted;
    }

    const tzElement = document.getElementById("timezone-display");
    if (tzElement && !tzElement.dataset.set) {
        tzElement.textContent = getTimezoneString();
        tzElement.dataset.set = "true";
    }
}

function toggleFormat() {
    is12HourFormat = !is12HourFormat;
    const btn = document.getElementById("formatToggleBtn");
    if (btn) {
        btn.textContent = is12HourFormat ? "Format: 12-Hour" : "Format: 24-Hour";
    }
    updateClock();
}

function toggleBlink() {
    blinkEnabled = !blinkEnabled;
    const colons = document.querySelectorAll(".colon-element");
    colons.forEach(colon => {
        if (blinkEnabled) {
            colon.classList.add("blink");
        } else {
            colon.classList.remove("blink");
        }
    });
    const btn = document.getElementById("blinkToggleBtn");
    if (btn) {
        btn.textContent = blinkEnabled ? "Blink: ON" : "Blink: OFF";
    }
}

function copyCurrentTime() {
    const now = new Date();
    const timeData = getTimeData(now, is12HourFormat);
    const dateInfo = formatDate(now);
    const tz = getTimezoneString();
    const timeStr = is12HourFormat 
        ? `${timeData.hours}:${timeData.minutes}:${timeData.seconds} ${timeData.ampm}`
        : `${timeData.hours}:${timeData.minutes}:${timeData.seconds}`;
    const copyText = `${timeStr} | ${dateInfo.formatted} | ${tz}`;

    navigator.clipboard.writeText(copyText).then(() => {
        const toast = document.getElementById("toast");
        if (toast) {
            toast.textContent = "Time copied to clipboard!";
            toast.classList.add("show");
            setTimeout(() => {
                toast.classList.remove("show");
            }, 2000);
        }
    }).catch(() => {
        const toast = document.getElementById("toast");
        if (toast) {
            toast.textContent = "Copied: " + timeStr;
            toast.classList.add("show");
            setTimeout(() => {
                toast.classList.remove("show");
            }, 2000);
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    updateClock();
    setInterval(updateClock, 1000);

    const formatBtn = document.getElementById("formatToggleBtn");
    if (formatBtn) formatBtn.addEventListener("click", toggleFormat);

    const blinkBtn = document.getElementById("blinkToggleBtn");
    if (blinkBtn) blinkBtn.addEventListener("click", toggleBlink);

    const copyBtn = document.getElementById("copyTimeBtn");
    if (copyBtn) copyBtn.addEventListener("click", copyCurrentTime);
});

if (typeof module !== "undefined" && module.exports) {
    module.exports = { formatTimeUnit, getTimeData, formatDate, getTimezoneString, updateClock };
}
