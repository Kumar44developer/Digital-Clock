const assert = require('assert');

function formatTimeUnit(val) {
    return Number(val) < 10 ? "0" + Number(val) : String(val);
}

function getTimeData(date, is12Hour = false) {
    let rawHours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
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
        rawHours: rawHours,
        time24: `${formatTimeUnit(rawHours)}:${formatTimeUnit(minutes)}:${formatTimeUnit(seconds)}`,
        time12: `${formatTimeUnit(displayHours)}:${formatTimeUnit(minutes)}:${formatTimeUnit(seconds)} ${ampm}`.trim()
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

console.log("Running Digital Clock Unit Tests...\n");

// Test 1: formatTimeUnit leading zero padding
assert.strictEqual(formatTimeUnit(0), "00");
assert.strictEqual(formatTimeUnit(5), "05");
assert.strictEqual(formatTimeUnit(9), "09");
assert.strictEqual(formatTimeUnit(10), "10");
assert.strictEqual(formatTimeUnit(23), "23");
console.log("PASS: Leading zeros pad single-digit hours/minutes/seconds properly");

// Test 2: 24-Hour Format Calculations
const midnight = new Date(2026, 8, 20, 0, 5, 9);
const midData = getTimeData(midnight, false);
assert.strictEqual(midData.hours, "00");
assert.strictEqual(midData.minutes, "05");
assert.strictEqual(midData.seconds, "09");
assert.strictEqual(midData.ampm, "");
assert.strictEqual(midData.time24, "00:05:09");
console.log("PASS: 24-Hour midnight displays as '00:05:09'");

const afternoon = new Date(2026, 8, 20, 15, 30, 45);
const aftData = getTimeData(afternoon, false);
assert.strictEqual(aftData.hours, "15");
assert.strictEqual(aftData.minutes, "30");
assert.strictEqual(aftData.seconds, "45");
console.log("PASS: 24-Hour afternoon displays as '15:30:45'");

// Test 3: 12-Hour Format & AM/PM
const mid12 = getTimeData(midnight, true);
assert.strictEqual(mid12.hours, "12");
assert.strictEqual(mid12.minutes, "05");
assert.strictEqual(mid12.seconds, "09");
assert.strictEqual(mid12.ampm, "AM");
assert.strictEqual(mid12.time12, "12:05:09 AM");
console.log("PASS: 12-Hour midnight displays as '12:05:09 AM'");

const noon = new Date(2026, 8, 20, 12, 0, 0);
const noon12 = getTimeData(noon, true);
assert.strictEqual(noon12.hours, "12");
assert.strictEqual(noon12.ampm, "PM");
console.log("PASS: 12-Hour noon displays as '12:00:00 PM'");

const aft12 = getTimeData(afternoon, true);
assert.strictEqual(aft12.hours, "03");
assert.strictEqual(aft12.minutes, "30");
assert.strictEqual(aft12.seconds, "45");
assert.strictEqual(aft12.ampm, "PM");
assert.strictEqual(aft12.time12, "03:30:45 PM");
console.log("PASS: 12-Hour afternoon 15:30 displays as '03:30:45 PM'");

// Test 4: Date Formatting
const testDate = new Date(2026, 8, 20); // Sept 20, 2026
const dateInfo = formatDate(testDate);
assert.strictEqual(dateInfo.monthName, "September");
assert.strictEqual(dateInfo.dayNumber, 20);
assert.strictEqual(dateInfo.year, 2026);
assert.strictEqual(dateInfo.formatted, "Sunday, September 20, 2026");
console.log("PASS: Date formatted accurately as 'Sunday, September 20, 2026'");

console.log("\nAll 4 Digital Clock unit test suites passed successfully!");
