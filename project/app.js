const TRACKER_STORAGE_KEY = "youtube_time_tracker_data";
const HEARTBIT = 6; // seconds

function log(output) {
  console.log(output);
}

function todayDate() {
  return new Date().toISOString().slice(0, 10);
}

function persistData(timer) {
  chrome.storage.local.set({ [TRACKER_STORAGE_KEY]: timer }, () => {
    log('YouTube Time Tracker saved:', timer);
  });
}

function readData(callback) {
  chrome.storage.local.get([TRACKER_STORAGE_KEY], (result) => {
    const timer = result[TRACKER_STORAGE_KEY] || {};
    callback(timer);
  });
}

function incrementTime(increment) {
  if (document.visibilityState === "hidden") return;

  readData((timer) => {
    const today = todayDate();
    timer[today] = (timer[today] || 0) + increment / 60; // increment in minutes
    persistData(timer);
    renderTimer(timer);
  });
}

function renderTimer(timerData) {
  const existingTimerDisplay = document.getElementById('youtube-time-tracker');
  if (existingTimerDisplay) {
    existingTimerDisplay.remove();
  }

  const timeSpent = timerData[todayDate()] || 0;
  const timerDisplay = document.createElement('div');
  timerDisplay.id = 'youtube-time-tracker';
  timerDisplay.innerHTML = `Time spent today: ${timeSpent.toFixed(2)} minutes`;
  document.body.appendChild(timerDisplay);
}

// Initialize
setInterval(() => incrementTime(HEARTBIT), HEARTBIT * 1000);
