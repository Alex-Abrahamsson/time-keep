export async function showWorkStatusNotification(
    ticketName: string,
    status: "Aktiv" | "Stoppad"
) {
    if (typeof window === "undefined") return;
    if (!("Notification" in window)) return;

    const permission = await Notification.requestPermission();
    if (permission !== "granted") return;

    const reg = await navigator.serviceWorker.ready;

    reg.showNotification("⏱ Uppdragsstatus", {
        body: `Ticket: ${ticketName}\nStatus: ${status}`,
        tag: "work-status",
        // renotify: true,
        requireInteraction: status === "Aktiv"
    });
}