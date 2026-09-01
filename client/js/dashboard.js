const dashboard = {

    async renderPage() {

        const content = document.getElementById("pageContent");
        content.innerHTML = `
            <div id="dashboardCards" class="metrics-grid">${loading()}</div>
            <div class="grid-two">
                <section class="section">
                    <div class="section-title">
                        <h3>Recent Complaints</h3>
                    </div>
                    <div class="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Category</th>
                                    <th>Priority</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody id="recentComplaints"></tbody>
                        </table>
                    </div>
                </section>
                <section class="chart-card">
                    <h3>Category Load</h3>
                    <div id="categoryChart"></div>
                    <h3 style="margin-top:22px">Department Trend</h3>
                    <div id="departmentChart"></div>
                </section>
            </div>
        `;

        await this.load();

    },

    async load() {

        try {

            const [
                overview,
                recent,
                category,
                department
            ] = await Promise.all([

                api.get("/dashboard"),

                api.get("/dashboard/recent"),

                api.get("/dashboard/category"),

                api.get("/dashboard/department")

            ]);

            this.renderCards(overview.dashboard || {});
            this.renderRecent(recent.complaints || []);
            this.renderChart("categoryChart", category.data || []);
            this.renderChart("departmentChart", department.data || []);

        }

        catch (err) {

            showMessage(err.message, "error");

        }

    },

    renderCards(data) {

        const cards = [
            ["Total", data.totalComplaints],
            ["Open", data.openComplaints],
            ["Assigned", data.assignedComplaints],
            ["In Progress", data.inProgressComplaints],
            ["Resolved", data.resolvedComplaints],
            ["Closed", data.closedComplaints]
        ];

        if (data.totalUsers !== undefined) {
            cards.push(
                ["Users", data.totalUsers],
                ["Employees", data.totalEmployees],
                ["Technicians", data.totalTechnicians],
                ["Assets", data.totalAssets]
            );
        }

        document.getElementById("dashboardCards").innerHTML = cards.map(([label, value]) => `
            <article class="metric-card">
                <span>${label}</span>
                <strong>${value ?? 0}</strong>
            </article>
        `).join("");

    },

    renderRecent(complaints) {

        const tbody = document.getElementById("recentComplaints");

        if (!complaints.length) {
            tbody.innerHTML = `<tr><td colspan="5" class="muted">No complaints found.</td></tr>`;
            return;
        }

        tbody.innerHTML = complaints.map(c => `
            <tr>
                <td><strong>${escapeHtml(c.complaintId)}</strong></td>
                <td>${escapeHtml(c.category)}</td>
                <td>${priorityBadge(c.priority)}</td>
                <td>${badge(c.status)}</td>
                <td>${formatDate(c.createdAt)}</td>
            </tr>
        `).join("");

    },

    renderChart(id, data) {

        const container = document.getElementById(id);

        if (!data.length) {
            container.innerHTML = `<p class="muted">No data available.</p>`;
            return;
        }

        const max = Math.max(...data.map(item => item.count), 1);

        container.innerHTML = `
            <div class="bars">
                ${data.map(item => `
                    <div class="bar-row">
                        <span>${escapeHtml(item._id || "Unspecified")}</span>
                        <span class="bar-track">
                            <span class="bar-fill" style="width:${Math.max(8, item.count / max * 100)}%"></span>
                        </span>
                        <strong>${item.count}</strong>
                    </div>
                `).join("")}
            </div>
        `;

    }

};
