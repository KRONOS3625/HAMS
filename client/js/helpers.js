function formatDate(date) {

    return new Date(date).toLocaleDateString();

}

function badge(status) {

    return `
        <span class="status status-${String(status || "")
            .toLowerCase()
            .replace(/\s/g, "-")}">
            ${escapeHtml(status || "-")}
        </span>
    `;

}

function priorityBadge(priority) {

    return `
        <span class="priority priority-${String(priority || "").toLowerCase()}">
            ${escapeHtml(priority || "-")}
        </span>
    `;

}

function loading() {

    return `

        <div class="loading">

            Loading...

        </div>

    `;

}

function escapeHtml(value) {

    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "'": "&#039;"
    }[char]));

}

function statusClass(status) {

    return String(status || "")
        .toLowerCase()
        .replace(/\s+/g, "-");

}

function showMessage(message, type = "info") {

    const content = document.getElementById("pageContent");
    if (!content) return;

    content.innerHTML = `
        <section class="section">
            <p class="${type === "error" ? "form-message" : "muted"}">
                ${escapeHtml(message)}
            </p>
        </section>
    `;

}

function showToast(message) {

    if (window.Toast) {
        window.Toast.show(message);
    } else {
        alert(message);
    }

}

function csvDownload(filename, rows) {

    const csv = rows
        .map(row => row.map(value => `"${String(value ?? "").replace(/"/g, "\"\"")}"`).join(","))
        .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);

}
