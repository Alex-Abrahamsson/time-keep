// Content script som körs på Jira-sidor för att extrahera ticket-information

console.log('TimeKeep Extension: Content script loaded');

/**
 * Funktion som extraherar all relevant ticket-information från Jira-sidan
 */
function extractJiraTicket() {
    console.log('TimeKeep: Extraherar ticket-data från:', window.location.href);

    try {
        // Hämta ticket-key från URL (mest pålitligt)
        // Stödjer både vanlig Jira (/browse/PROJ-123) och Service Desk (/TICKET-60982)
        let ticketKey = null;
        const browseMatch = window.location.href.match(
            /\/browse\/([A-Z]+-\d+)/,
        );
        const serviceDeskMatch = window.location.href.match(
            /\/([A-Z]+-\d+)(?:[\/\?#]|$)/,
        );

        if (browseMatch) {
            ticketKey = browseMatch[1];
            console.log(
                'TimeKeep: Hittade ticket-key från browse URL:',
                ticketKey,
            );
        } else if (serviceDeskMatch) {
            ticketKey = serviceDeskMatch[1];
            console.log(
                'TimeKeep: Hittade ticket-key från Service Desk URL:',
                ticketKey,
            );
        }

        if (!ticketKey) {
            console.warn('TimeKeep: Kunde inte hitta ticket-key i URL');
        }

        // Försök hitta summary/titel - inkluderar Service Desk selectors
        let summary = '';
        const summarySelectors = [
            // Service Desk selectors (testar först)
            'h1[data-test-id="issue.views.issue-base.foundation.summary.heading"]',
            'h1[id*="summary"]',
            '[data-testid="issue.views.issue-base.foundation.summary.heading"]',
            // Vanlig Jira selectors
            '[data-test-id="issue.views.issue-base.foundation.summary.heading"]',
            '#summary-val',
            '[data-testid="issue.views.field.rich-text.summary"]',
            'h1[data-test-id*="summary"]',
            // Fallback - första h1 på sidan
            'h1:first-of-type',
        ];

        for (const selector of summarySelectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent.trim()) {
                summary = element.textContent.trim();
                console.log(
                    'TimeKeep: Hittade summary med selector:',
                    selector,
                    '→',
                    summary.substring(0, 50),
                );
                break;
            }
        }

        if (!summary) {
            console.warn('TimeKeep: Kunde inte hitta summary');
        }

        // Hämta beskrivning
        let description = '';
        const descriptionSelectors = [
            // Service Desk
            '[data-testid="issue.views.field.rich-text.description"]',
            '[id*="description"]',
            // Vanlig Jira
            '#description-val',
            '[data-testid="issue-view.common.description.view"] .ak-renderer-document',
            '.description .user-content-block',
        ];

        for (const selector of descriptionSelectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent.trim()) {
                description = element.textContent.trim();
                console.log(
                    'TimeKeep: Hittade beskrivning med selector:',
                    selector,
                );
                break;
            }
        }

        // Hämta projekt-namn - extrahera från URL för Service Desk
        let projectName = '';

        // Försök från URL först (mest pålitligt för Service Desk)
        const projectUrlMatch =
            window.location.href.match(/\/projects\/([A-Z]+)/);
        if (projectUrlMatch) {
            projectName = projectUrlMatch[1];
            console.log('TimeKeep: Hittade projekt från URL:', projectName);
        }

        // Annars sök i DOM
        if (!projectName) {
            const projectSelectors = [
                '[data-testid="issue.views.field.select.project"]',
                'a[href*="/projects/"]',
                '[data-test-id*="project"]',
                '[data-testid="issue.fields.project"]',
            ];

            for (const selector of projectSelectors) {
                const element = document.querySelector(selector);
                if (element && element.textContent.trim()) {
                    projectName = element.textContent.trim();
                    console.log(
                        'TimeKeep: Hittade projekt från DOM:',
                        projectName,
                    );
                    break;
                }
            }
        }

        // Hämta issue type (Bug, Story, Task, Request etc.)
        let issueType = '';
        const typeSelectors = [
            // Service Desk
            '[data-testid="issue.views.field.select.issuetype"]',
            '[data-testid="issue.fields.issuetype"]',
            // Vanlig Jira
            '#type-val',
            '[data-test-id*="issuetype"]',
            'a[href*="issuetype"]',
        ];

        for (const selector of typeSelectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent.trim()) {
                issueType = element.textContent.trim();
                console.log('TimeKeep: Hittade issue type:', issueType);
                break;
            }
        }

        // Defaulta till "Service Request" för Service Desk om inget hittas
        if (!issueType && window.location.href.includes('/servicedesk/')) {
            issueType = 'Service Request';
            console.log(
                'TimeKeep: Defaultar till Service Request för Service Desk',
            );
        }

        // Hämta assignee
        let assignee = '';
        const assigneeSelectors = [
            '[data-testid="issue.views.field.user.assignee"]',
            '[data-testid="issue.fields.assignee"]',
            '#assignee-val',
            '[data-test-id*="assignee"]',
        ];

        for (const selector of assigneeSelectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent.trim()) {
                assignee = element.textContent.trim();
                console.log('TimeKeep: Hittade assignee:', assignee);
                break;
            }
        }

        // Hämta kund (via label-JQL-länk)
        let customer = '';
        const customerSelectors = [
            'a[href*="jql=labels"]',           // ✅ Primär (din Jira)
            '[data-testid="issue.views.field.labels"] a', // fallback
            '#labels-val a',                   // legacy Jira
            '[data-test-id*="labels"] a',      // generell fallback
        ];

        for (const selector of customerSelectors) {
            const elements = document.querySelectorAll(selector);
            if (elements.length) {
                const customers = [...elements]
                    .map(el => el.innerText.trim())
                    .filter(Boolean);

                console.log('TimeKeep: Hittade kund-labels:', customers);

                customer = customers[0] || '';
                break;
            }
        }

        if (!customer) {
            console.warn('TimeKeep: ⚠️ Kunde inte hitta kund');
        }

        const ticketData = {
            key: ticketKey,
            summary: summary,
            description: description,
            project: projectName,
            issueType: issueType,
            assignee: assignee,
            customer: customer,
            url: window.location.href,
        };

        console.log(
            'TimeKeep: ✅ Ticket-data extraherad framgångsrikt:',
            ticketData,
        );

        // Varna om viktiga fält saknas
        if (!ticketKey) console.error('TimeKeep: ⚠️ Ticket-key saknas!');
        if (!summary) console.warn('TimeKeep: ⚠️ Summary saknas!');
        if (!projectName) console.warn('TimeKeep: ⚠️ Projekt-namn saknas!');

        return ticketData;
    } catch (error) {
        console.error('TimeKeep: Fel vid extraktion:', error);
        return {
            key: null,
            summary: '',
            description: '',
            project: '',
            issueType: '',
            assignee: '',
            customer: '',
            url: window.location.href,
            error: error.message,
        };
    }
}

// Lyssna på meddelanden från popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('TimeKeep: Mottog meddelande:', request);

    if (request.action === 'extractTicket') {
        const ticketData = extractJiraTicket();
        sendResponse(ticketData);
    }

    return true; // Håller meddelande-kanalen öppen för async svar
});

// Visa notifikation när sidan laddas
if (
    window.location.href.includes('/browse/') ||
    window.location.href.includes('/servicedesk/')
) {
    console.log('TimeKeep: ✅ Jira-sida detekterad, extension redo!');
    console.log('TimeKeep: URL:', window.location.href);
}
