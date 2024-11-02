import { activeTabs } from 'constants.js';


document.addEventListener('DOMContentLoaded', () => {
    const urlList = document.getElementById('urlList');
    const clearHistoryButton = document.getElementById('clearHistory');
    console.log("Active Tabs in Popup js " + JSON.stringify(activeTabs));

    // Load stored URLs
    chrome.storage.local.get('urlHistory', (data) => {
        const urlHistory = data.urlHistory || [];
        urlHistory.forEach((entry) => {
            const li = document.createElement('li');
            li.textContent = `${entry.url} - Visited at: ${entry.time} - Time spent: ${entry.timeSpent} seconds`; // Display URL, time, and time spent

            // Add event listener to each URL item
            li.addEventListener('click', () => {
                chrome.tabs.create({ url: entry.url }); // Open the URL in a new tab
            });

            urlList.appendChild(li);
        });
    });

    // Clear history
    clearHistoryButton.addEventListener('click', () => {
        chrome.storage.local.remove('urlHistory', () => {
            urlList.innerHTML = ''; // Clear the displayed list
        });
    });
});
