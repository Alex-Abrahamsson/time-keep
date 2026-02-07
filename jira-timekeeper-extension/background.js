// Background service worker för TimeKeep Extension
// Används för att hantera långvariga processer och meddelanden

console.log('TimeKeep Extension: Background service worker aktiv');

// Installationsevent - körs när extension installeras första gången
chrome.runtime.onInstalled.addListener((details) => {
    console.log('TimeKeep Extension installerad:', details.reason);

    if (details.reason === 'install') {
        // Första gången extension installeras
        console.log('TimeKeep: Första installation - Välkommen!');

        // Öppna en welcome-tab (optional)
        // chrome.tabs.create({ url: 'welcome.html' });
    } else if (details.reason === 'update') {
        // Extension uppdaterades
        console.log(
            'TimeKeep: Extension uppdaterad till version',
            chrome.runtime.getManifest().version,
        );
    }
});

// Hantera meddelanden från content scripts och popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('TimeKeep Background: Mottog meddelande', request);

    // Lägg till custom hantering här om behövs i framtiden

    return true; // Håller meddelande-kanalen öppen
});

// Optional: Lyssna på tab-uppdateringar för att detektera Jira-sidor
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // När en tab laddas klart
    if (changeInfo.status === 'complete' && tab.url) {
        // Kolla om det är en Jira-ticket-sida (både vanlig och Service Desk)
        if (
            tab.url.includes('atlassian.net/browse/') ||
            tab.url.includes('atlassian.net/jira/servicedesk/')
        ) {
            // Här kan vi i framtiden lägga till en badge på extension-ikonen
            // chrome.action.setBadgeText({ text: '!', tabId: tabId });
            // chrome.action.setBadgeBackgroundColor({ color: '#10b981', tabId: tabId });
        }
    }
});

// Optional: Command shortcuts (Alt+T)
chrome.commands.onCommand.addListener((command) => {
    console.log('TimeKeep: Command triggered:', command);

    if (command === '_execute_action') {
        // Detta öppnar popup:en automatiskt
        console.log('TimeKeep: Öppnar popup via keyboard shortcut');
    }
});
