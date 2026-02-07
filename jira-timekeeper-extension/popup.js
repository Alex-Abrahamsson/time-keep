// Popup logic för TimeKeep Extension

let ticketData = null;
let currentScreen = 'main';

// Kör när popup öppnas
document.addEventListener('DOMContentLoaded', async () => {
    console.log('TimeKeep Extension: Popup öppnad');

    // Ladda sparade inställningar
    await loadSettings();

    // Hämta ticket-data från Jira-sidan
    await fetchTicketData();

    // Setup event listeners
    setupEventListeners();
});

/**
 * Ladda inställningar från Chrome Storage
 */
async function loadSettings() {
    try {
        const data = await chrome.storage.sync.get(['userId', 'apiUrl']);

        if (data.userId) {
            document.getElementById('user-id-input').value = data.userId;
        }

        if (data.apiUrl) {
            document.getElementById('api-url-input').value = data.apiUrl;
        } else {
            // Default URL
            document.getElementById('api-url-input').value =
                'http://localhost:3000';
        }

        console.log('TimeKeep: Inställningar laddade', {
            hasUserId: !!data.userId,
        });
    } catch (error) {
        console.error('TimeKeep: Kunde inte ladda inställningar', error);
    }
}

/**
 * Hämta ticket-data från content script
 */
async function fetchTicketData() {
    try {
        // Hämta den aktiva tabben
        const [tab] = await chrome.tabs.query({
            active: true,
            currentWindow: true,
        });

        // Kolla om vi är på en Jira-sida (både vanlig och Service Desk)
        const isJiraBrowse =
            tab.url && tab.url.includes('atlassian.net/browse/');
        const isJiraServiceDesk =
            tab.url && tab.url.includes('atlassian.net/jira/servicedesk/');

        if (!isJiraBrowse && !isJiraServiceDesk) {
            showStatus(
                'Du måste vara på en Jira-ticket-sida (vanlig Jira eller Service Desk)',
                'error',
            );
            disableButtons();
            return;
        }

        // Skicka meddelande till content script
        chrome.tabs.sendMessage(
            tab.id,
            { action: 'extractTicket' },
            (response) => {
                if (chrome.runtime.lastError) {
                    console.error(
                        'TimeKeep: Runtime error',
                        chrome.runtime.lastError,
                    );
                    showStatus(
                        'Kunde inte läsa ticket-data. Prova att refresha Jira-sidan (F5) och försök igen.',
                        'error',
                    );
                    disableButtons();
                    return;
                }

                if (!response || !response.key) {
                    showStatus(
                        'Kunde inte hitta ticket-information på sidan. Kontrollera att du är på en ticket-sida.',
                        'error',
                    );
                    disableButtons();
                    return;
                }

                ticketData = response;
                displayTicket(ticketData);
                enableButtons();
            },
        );
    } catch (error) {
        console.error('TimeKeep: Fetch error', error);
        showStatus('Något gick fel: ' + error.message, 'error');
        disableButtons();
    }
}

/**
 * Visa ticket-information i UI
 */
function displayTicket(data) {
    document.getElementById('ticket-key').textContent =
        data.key || 'Okänd ticket';
    document.getElementById('ticket-summary').textContent =
        data.summary || 'Ingen sammanfattning hittades';
    document.getElementById('ticket-project').textContent =
        data.project || 'Okänt projekt';
    document.getElementById('ticket-type').textContent =
        data.issueType || 'Okänd typ';
}

/**
 * Setup alla event listeners
 */
function setupEventListeners() {
    // Lägg till utan att starta
    document
        .getElementById('add-btn')
        .addEventListener('click', () => addTicket(false));

    // Lägg till och starta timer
    document
        .getElementById('add-start-btn')
        .addEventListener('click', () => addTicket(true));

    // Visa inställningar
    document
        .getElementById('settings-btn')
        .addEventListener('click', showSettings);

    // Spara inställningar
    document
        .getElementById('save-settings-btn')
        .addEventListener('click', saveSettings);

    // Tillbaka från inställningar
    document.getElementById('back-btn').addEventListener('click', showMain);
}

/**
 * Kategorisera baserat på Jira issue type
 */
function mapIssueTypeToCategory(issueType) {
    if (!issueType) return 'Utveckling';

    const lower = issueType.toLowerCase();
    if (lower.includes('bug') || lower.includes('bugg')) return 'Bugg';
    if (
        lower.includes('story') ||
        lower.includes('feature') ||
        lower.includes('utveckling')
    )
        return 'Utveckling';
    if (
        lower.includes('task') ||
        lower.includes('config') ||
        lower.includes('konfiguration')
    )
        return 'Konfiguration';

    return 'Utveckling';
}

/**
 * Lägg till ticket i TimeKeep
 */
async function addTicket(startTimer) {
    if (!ticketData) {
        showStatus('Ingen ticket-data tillgänglig', 'error');
        return;
    }

    // Hämta inställningar
    const { userId, apiUrl } = await chrome.storage.sync.get([
        'userId',
        'apiUrl',
    ]);

    if (!userId) {
        showStatus(
            'Du måste konfigurera ditt User ID i inställningar först',
            'error',
        );
        return;
    }

    const url = apiUrl || 'http://localhost:3000';

    showLoading(true);

    try {
        // Skapa assignment-objekt
        const assignment = {
            Id: Date.now(),
            UserId: userId,
            Costumer: ticketData.project || 'Okänd kund',
            TicketName: `${ticketData.key}: ${ticketData.summary}`,
            Status: startTimer ? 'Active' : 'Stopped',
            CreatedDate: new Date().toISOString(),
            Description: ticketData.description || '',
            ActualTime: 0,
            Sessions: startTimer
                ? [
                      {
                          Start: new Date().toISOString(),
                          End: null,
                          BillableTime: null,
                      },
                  ]
                : [],
            Category: mapIssueTypeToCategory(ticketData.issueType),
            Completed: false,
            JiraKey: ticketData.key,
            JiraUrl: ticketData.url,
        };

        console.log('TimeKeep: Skickar assignment:', assignment);

        // Skicka till TimeKeep API
        const response = await fetch(`${url}/api/add-ticket`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(assignment),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                errorData.error ||
                    `HTTP ${response.status}: ${response.statusText}`,
            );
        }

        const result = await response.json();
        console.log('TimeKeep: Ticket tillagd:', result);

        showLoading(false);
        showMain();
        showStatus(
            startTimer
                ? '✅ Ticket tillagd & timer startad!'
                : '✅ Ticket tillagd!',
            'success',
        );

        // Stäng popup efter 1.5 sekunder
        setTimeout(() => {
            window.close();
        }, 1500);
    } catch (error) {
        console.error('TimeKeep: Add ticket error', error);
        showLoading(false);
        showMain();
        showStatus('❌ Fel: ' + error.message, 'error');
    }
}

/**
 * Spara inställningar
 */
async function saveSettings() {
    const userId = document.getElementById('user-id-input').value.trim();
    const apiUrl = document.getElementById('api-url-input').value.trim();

    if (!userId) {
        showSettingsStatus('Du måste ange ett User ID', 'error');
        return;
    }

    try {
        await chrome.storage.sync.set({ userId, apiUrl });
        showSettingsStatus('✅ Inställningar sparade!', 'success');

        setTimeout(() => {
            showMain();
        }, 1000);
    } catch (error) {
        console.error('TimeKeep: Save settings error', error);
        showSettingsStatus('❌ Kunde inte spara: ' + error.message, 'error');
    }
}

/**
 * UI Helper functions
 */
function showMain() {
    currentScreen = 'main';
    document.getElementById('main-screen').style.display = 'block';
    document.getElementById('loading-screen').classList.remove('show');
    document.getElementById('settings-screen').classList.remove('show');
    hideStatus();
}

function showSettings() {
    currentScreen = 'settings';
    document.getElementById('main-screen').style.display = 'none';
    document.getElementById('settings-screen').classList.add('show');
    hideSettingsStatus();
}

function showLoading(show) {
    if (show) {
        document.getElementById('main-screen').style.display = 'none';
        document.getElementById('loading-screen').classList.add('show');
    } else {
        showMain();
    }
}

function showStatus(message, type) {
    const statusEl = document.getElementById('status');
    statusEl.textContent = message;
    statusEl.className = 'status show ' + type;
}

function hideStatus() {
    const statusEl = document.getElementById('status');
    statusEl.classList.remove('show');
}

function showSettingsStatus(message, type) {
    const statusEl = document.getElementById('settings-status');
    statusEl.textContent = message;
    statusEl.className = 'status show ' + type;
}

function hideSettingsStatus() {
    const statusEl = document.getElementById('settings-status');
    statusEl.classList.remove('show');
}

function disableButtons() {
    document.getElementById('add-btn').disabled = true;
    document.getElementById('add-start-btn').disabled = true;
}

function enableButtons() {
    document.getElementById('add-btn').disabled = false;
    document.getElementById('add-start-btn').disabled = false;
}
