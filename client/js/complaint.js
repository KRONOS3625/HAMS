const complaints = {

    list: [],
    assets: [],
    technicians: [],

    user() {

        return currentUser() || {};

    },

    async renderPage() {

        document.getElementById("pageContent").innerHTML = `
            <section class="section">
                <div class="toolbar">
                    <div>
                        <h3>${this.user().role === "employee" ? "My Complaints" : "Complaint Register"}</h3>
                        <p class="muted">Live data from the helpdesk API.</p>
                    </div>
                    <div class="toolbar-group">
                        <select id="statusFilter">
                            <option value="">All statuses</option>
                            <option>Open</option>
                            <option>Assigned</option>
                            <option>In Progress</option>
                            <option>Resolved</option>
                            <option>Closed</option>
                        </select>
                        <button id="exportComplaints" class="secondary-button" type="button">Export CSV</button>
                    </div>
                </div>
                <div id="complaintTable">${loading()}</div>
            </section>
        `;

        await this.load();
        this.bindListEvents();

    },

    async renderRaisePage() {

        if (this.user().role !== "employee") {
            showMessage("Only employees can raise complaints.", "error");
            return;
        }

        await this.loadAssets();

        document.getElementById("pageContent").innerHTML = `
            <section class="section">
                <div class="section-title">
                    <h3>Raise Complaint</h3>
                </div>
                <form id="complaintForm" class="form-panel-grid">
                    <label>Category
                        <select name="category" required>
                            <option>Laptop</option>
                            <option>Desktop</option>
                            <option>Printer</option>
                            <option>Network</option>
                            <option>Software</option>
                            <option>Other</option>
                        </select>
                    </label>
                    <label>Asset
                        <select name="assetId" required>
                            <option value="">Select asset</option>
                            ${this.assets.map(asset => `
                                <option value="${escapeHtml(asset.assetId)}">
                                    ${escapeHtml(asset.assetId)} - ${escapeHtml(asset.assetName)}
                                </option>
                            `).join("")}
                        </select>
                    </label>
                    <label>Priority
                        <select name="priority" required>
                            <option>Low</option>
                            <option selected>Medium</option>
                            <option>High</option>
                        </select>
                    </label>
                    <label>Attachment
                        <input name="attachment" type="file">
                    </label>
                    <label class="span-2">Description
                        <textarea name="description" minlength="20" required></textarea>
                    </label>
                    <div class="span-2 button-row">
                        <button class="primary-button" type="submit">Submit Complaint</button>
                        <button class="secondary-button" type="reset">Clear</button>
                    </div>
                </form>
            </section>
        `;

        document.getElementById("complaintForm").addEventListener("submit", async event => {
            event.preventDefault();
            await this.create(new FormData(event.target));
        });

    },

    async load(status = "") {

        try {

            const response = await api.get(`/complaints${status ? `?status=${encodeURIComponent(status)}` : ""}`);
            this.list = response.complaints || [];
            this.renderTable(this.list);

        }

        catch (err) {

            showMessage(err.message, "error");

        }

    },

    async loadAssets() {

        const response = await api.get("/assets");
        this.assets = response.assets || [];

    },

    async loadTechnicians() {

        const response = await api.get("/users");
        this.technicians = (response.users || [])
            .filter(user => user.role === "technician")
            .sort((a, b) => a.name.localeCompare(b.name));

    },

    renderTable(items) {

        const container = document.getElementById("complaintTable");
        if (!container) return;

        if (!items.length) {
            container.innerHTML = `<p class="muted">No complaints found.</p>`;
            return;
        }

        container.innerHTML = `
            <div class="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Employee</th>
                            <th>Asset</th>
                            <th>Category</th>
                            <th>Priority</th>
                            <th>Status</th>
                            <th>Technician</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${items.map(c => `
                            <tr>
                                <td><strong>${escapeHtml(c.complaintId)}</strong></td>
                                <td>${escapeHtml(c.employeeName)}<br><span class="small-text">${escapeHtml(c.department)}</span></td>
                                <td>${escapeHtml(c.assetId || c.asset?.assetId || "-")}<br><span class="small-text">${escapeHtml(c.assetName || c.asset?.assetName || "")}</span></td>
                                <td>${escapeHtml(c.category)}</td>
                                <td>${priorityBadge(c.priority)}</td>
                                <td>${badge(c.status)}</td>
                                <td>${escapeHtml(c.technicianName || "Not assigned")}</td>
                                <td>${formatDate(c.createdAt)}</td>
                                <td class="button-row">${this.actions(c)}</td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            </div>
        `;

    },

    actions(c) {

        const role = this.user().role;
        const actions = [`<button class="secondary-button" data-view="${c._id}" type="button">View</button>`];

        if (role === "employee" && c.status === "Open" && !c.technician) {
            actions.push(`<button class="secondary-button" data-edit="${c._id}" type="button">Edit</button>`);
        }

        if (role === "admin") {
            if (c.status !== "Closed") actions.push(`<button class="primary-button" data-assign="${c._id}" type="button">Assign</button>`);
            if (c.status === "Resolved") actions.push(`<button class="danger-button" data-close="${c._id}" type="button">Close</button>`);
            actions.push(`<button class="danger-button" data-delete="${c._id}" type="button">Delete</button>`);
        }

        if (role === "technician" && c.status !== "Closed") {
            actions.push(`<button class="primary-button" data-status="${c._id}" type="button">Update</button>`);
        }

        return actions.join("");

    },

    bindListEvents() {

        const content = document.getElementById("pageContent");

        content.onclick = async event => {
            const button = event.target.closest("button");
            if (!button) return;

            if (button.dataset.view) await this.view(button.dataset.view);
            if (button.dataset.edit) await this.edit(button.dataset.edit);
            if (button.dataset.assign) await this.assign(button.dataset.assign);
            if (button.dataset.status) await this.updateStatus(button.dataset.status);
            if (button.dataset.close) await this.close(button.dataset.close);
            if (button.dataset.delete) await this.remove(button.dataset.delete);
            if (button.id === "exportComplaints") this.export();
        };

        content.onchange = event => {
            if (event.target.id === "statusFilter") {
                this.load(event.target.value);
            }
        };

    },

    async create(formData) {

        try {
            await api.post("/complaints", formData);
            showToast("Complaint submitted.");
            Router.navigate("complaints");
        } catch (error) {
            showToast(error.message);
        }

    },

    async view(id) {

        try {
            const response = await api.get(`/complaints/${id}`);
            const c = response.complaint;
            Modal.show(`
                <h2>${escapeHtml(c.complaintId)}</h2>
                <div class="form-panel-grid">
                    <p><b>Category</b><br>${escapeHtml(c.category)}</p>
                    <p><b>Status</b><br>${badge(c.status)}</p>
                    <p><b>Priority</b><br>${priorityBadge(c.priority)}</p>
                    <p><b>Asset</b><br>${escapeHtml(c.assetId)} - ${escapeHtml(c.assetName)}</p>
                    <p class="span-2"><b>Description</b><br>${escapeHtml(c.description)}</p>
                    <p><b>Technician</b><br>${escapeHtml(c.technicianName || "Not assigned")}</p>
                    <p><b>Attachment</b><br>${escapeHtml(c.attachment || "None")}</p>
                    <p class="span-2"><b>Admin Remarks</b><br>${escapeHtml(c.adminRemarks || "-")}</p>
                    <p class="span-2"><b>Resolution</b><br>${escapeHtml(c.resolutionNotes || "-")}</p>
                    <div class="span-2">
                        <b>History</b>
                        <div class="activity-list">
                            ${(c.history || []).map(item => `
                                <div class="activity-item">
                                    ${escapeHtml(item.action)}<br>
                                    <span class="small-text">${escapeHtml(item.performedBy)} - ${formatDate(item.date)}</span>
                                </div>
                            `).join("") || `<p class="muted">No history.</p>`}
                        </div>
                    </div>
                </div>
            `);
        } catch (error) {
            showToast(error.message);
        }

    },

    async edit(id) {

        await this.loadAssets();
        const c = this.list.find(item => item._id === id);
        if (!c) return;

        Modal.show(`
            <h2>Edit ${escapeHtml(c.complaintId)}</h2>
            <form id="editComplaintForm" class="form-panel-grid">
                <label>Category<input name="category" value="${escapeHtml(c.category)}" required></label>
                <label>Asset
                    <select name="assetId" required>
                        ${this.assets.map(asset => `
                            <option value="${escapeHtml(asset.assetId)}" ${asset.assetId === c.assetId ? "selected" : ""}>
                                ${escapeHtml(asset.assetId)} - ${escapeHtml(asset.assetName)}
                            </option>
                        `).join("")}
                    </select>
                </label>
                <label>Priority
                    <select name="priority">
                        ${["Low", "Medium", "High"].map(p => `<option ${p === c.priority ? "selected" : ""}>${p}</option>`).join("")}
                    </select>
                </label>
                <label>Attachment<input name="attachment" type="file"></label>
                <label class="span-2">Description<textarea name="description" minlength="20" required>${escapeHtml(c.description)}</textarea></label>
                <div class="span-2"><button class="primary-button" type="submit">Save Changes</button></div>
            </form>
        `);

        document.getElementById("editComplaintForm").addEventListener("submit", async event => {
            event.preventDefault();
            try {
                await api.put(`/complaints/${id}`, new FormData(event.target));
                Modal.close();
                showToast("Complaint updated.");
                await this.load();
            } catch (error) {
                showToast(error.message);
            }
        });

    },

    async assign(id) {

        await this.loadTechnicians();
        const c = this.list.find(item => item._id === id);

        Modal.show(`
            <h2>Assign ${escapeHtml(c?.complaintId || "Complaint")}</h2>
            <form id="assignComplaintForm" class="form-panel-grid">
                <label>Technician
                    <select name="technicianId" required>
                        <option value="">Select technician</option>
                        ${this.technicians.length ? this.technicians.map(user => `
                            <option value="${escapeHtml(user.userId)}" ${user.userId === c?.technicianId ? "selected" : ""}>
                                ${escapeHtml(user.name)} (${escapeHtml(user.userId)})
                            </option>
                        `).join("") : `<option value="" disabled>No technicians found</option>`}
                    </select>
                </label>
                <label class="span-2">Admin Remarks<textarea name="remarks">${escapeHtml(c?.adminRemarks || "")}</textarea></label>
                <div class="span-2"><button class="primary-button" type="submit">Assign Technician</button></div>
            </form>
        `);

        document.getElementById("assignComplaintForm").addEventListener("submit", async event => {
            event.preventDefault();
            try {
                await api.put(`/complaints/assign/${id}`, Object.fromEntries(new FormData(event.target)));
                Modal.close();
                showToast("Technician assigned.");
                await this.load();
            } catch (error) {
                showToast(error.message);
            }
        });

    },

    async updateStatus(id) {

        const c = this.list.find(item => item._id === id);

        Modal.show(`
            <h2>Update ${escapeHtml(c?.complaintId || "Complaint")}</h2>
            <form id="statusComplaintForm" class="form-panel-grid">
                <label>Status
                    <select name="status" required>
                        ${["Assigned", "In Progress", "Resolved"].map(status => `<option ${status === c?.status ? "selected" : ""}>${status}</option>`).join("")}
                    </select>
                </label>
                <label class="span-2">Resolution Notes<textarea name="resolutionNotes">${escapeHtml(c?.resolutionNotes || "")}</textarea></label>
                <div class="span-2"><button class="primary-button" type="submit">Update Status</button></div>
            </form>
        `);

        document.getElementById("statusComplaintForm").addEventListener("submit", async event => {
            event.preventDefault();
            try {
                await api.put(`/complaints/status/${id}`, Object.fromEntries(new FormData(event.target)));
                Modal.close();
                showToast("Complaint updated.");
                await this.load();
            } catch (error) {
                showToast(error.message);
            }
        });

    },

    async close(id) {

        try {
            await api.put(`/complaints/close/${id}`, {});
            showToast("Complaint closed.");
            await this.load();
        } catch (error) {
            showToast(error.message);
        }

    },

    async remove(id) {

        if (!confirm("Delete this complaint?")) return;

        try {
            await api.delete(`/complaints/${id}`);
            showToast("Complaint deleted.");
            await this.load();
        } catch (error) {
            showToast(error.message);
        }

    },

    export() {

        csvDownload("complaints.csv", [
            ["ID", "Employee", "Department", "Asset", "Category", "Priority", "Status", "Technician", "Created"],
            ...this.list.map(c => [
                c.complaintId,
                c.employeeName,
                c.department,
                c.assetId,
                c.category,
                c.priority,
                c.status,
                c.technicianName,
                c.createdAt
            ])
        ]);

    }

};
