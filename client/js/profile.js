const profile = {

    async renderPage() {

        const user = currentUser();

        document.getElementById("pageContent").innerHTML = `
            <section class="profile-card">
                <strong>${escapeHtml(user?.name || "")}</strong>
                <span class="role-pill">${escapeHtml(user?.role || "")}</span>
                <p class="muted">
                    ${escapeHtml(user?.department || "")}
                    ${user?.email ? " - " + escapeHtml(user.email) : ""}
                    ${user?.mobile ? " - " + escapeHtml(user.mobile) : ""}
                </p>
                <p><b>User ID</b><br>${escapeHtml(user?.userId || user?.id || "")}</p>
            </section>
        `;

    }

};
