import { activeTabs } from 'constants.js';

chrome.tabs.onActivated.addListener((activeInfo) => {
    const tabId = activeInfo.tabId;
    console.log("Active Tabs in Backgroup js " + JSON.stringify(activeTabs));
    console.log("On Action tabs " + JSON.stringify(chrome.tabs));
    chrome.tabs.get(tabId, (tab) => {
        const url = tab.url;

        // Mark the start time for the active tab
        if (url) {
            activeTabs[tabId] = { url, startTime: Date.now() };
        }
    });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    console.log("Url on update " + tab.url);
    console.log("Url on update change info " + JSON.stringify(changeInfo));
    console.log("Active Tabs in Backgroup js " + JSON.stringify(activeTabs));

    if (changeInfo.status === 'complete' && tab.url) {
        const visitTime = new Date().toLocaleString();

        // Save the time spent when the tab is completed
        if (activeTabs[tabId]) {
            const timeSpent = Date.now() - activeTabs[tabId].startTime; // Calculate time spent
            const timeSpentInSeconds = Math.floor(timeSpent / 1000); // Convert to seconds
            
            chrome.storage.local.get('urlHistory', (data) => {
                const urlHistory = data.urlHistory || [];
                const existingEntry = urlHistory.find(entry => entry.url === tab.url);
                
                if (existingEntry) {
                    existingEntry.timeSpent += timeSpentInSeconds; // Update existing entry
                } else {
                    // Create a new entry with initialized timeSpent
                    urlHistory.push({ url: tab.url, time: visitTime, timeSpent: timeSpentInSeconds });
                }
                
                chrome.storage.local.set({ urlHistory });
            });
        }
    }
});

chrome.tabs.onRemoved.addListener((tabId) => {
    // Remove active tab tracking when a tab is closed
    console.log("Active Tabs in Backgroup js " + JSON.stringify(activeTabs));

    console.log("Url on remove listener " + (activeTabs[tabId]?.url || ''));
    delete activeTabs[tabId];
});
