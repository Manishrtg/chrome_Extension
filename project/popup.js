document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get('timeSpent', (data) => {
        const timeList = document.getElementById('timeList');
        const timeSpent = data.timeSpent || {};

        for (const [url, seconds] of Object.entries(timeSpent)) {
            const li = document.createElement('li');
            li.textContent = `${url}: ${Math.floor(seconds / 60)} minutes ${seconds % 60} seconds`;
            timeList.appendChild(li);
        }
    });
});
