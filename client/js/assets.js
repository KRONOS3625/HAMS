const assets = {

    list: [],

    async renderPage() {

        document.getElementById("pageContent").innerHTML = `
            <section class="section">
                <div class="toolbar">
                    <div>
                        <h3>Assets</h3>
                        <p class="muted">Asset inventory from the backend.</p>
                    </div>
                    <button id="addAsset" class="primary-button" type="button">Add Asset</button>
                </div>
                <div id="assetTable">${loading()}</div>
            </section>
        `;

        await this.load();
        this.bindEvents();

    },

    async load() {

        try {
            const response = await api.get("/assets");
            this.list = response.assets || [];
            this.renderTable();
        } catch (error) {
            showMessage(error.message, "error");
        }

    },

    renderTable() {

        const container = document.getElementById("assetTable");

        if (!this.list.length) {
            container.innerHTML = `<p class="muted">No assets found.</p>`;
            return;
        }

        container.innerHTML = `
            <div class="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Brand</th>
                            <th>Purchase</th>
                            <th>Warranty</th>
                            <th>Assigned To</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.list.map(asset => `
                            <tr>
                                <td><strong>${escapeHtml(asset.assetId)}</strong></td>
                                <td>${escapeHtml(asset.assetName)}</td>
                                <td>${escapeHtml(asset.category)}</td>
                                <td>${escapeHtml(asset.brand)}</td>
                                <td>${formatDate(asset.purchaseDate)}</td>
                                <td>${formatDate(asset.warrantyExpiry)}</td>
                                <td>${escapeHtml(asset.assignedEmployee || "Unassigned")}</td>
                                <td class="button-row">
                                    <button class="secondary-button" data-edit-asset="${asset._id}" type="button">Edit</button>
                                    <button class="danger-button" data-delete-asset="${asset._id}" type="button">Delete</button>
                                </td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            </div>
        `;

    },

    bindEvents() {

        document.getElementById("pageContent").onclick = async event => {
            const button = event.target.closest("button");
            if (!button) return;

            if (button.id === "addAsset") this.openForm();
            if (button.dataset.editAsset) this.openForm(button.dataset.editAsset);
            if (button.dataset.deleteAsset) await this.remove(button.dataset.deleteAsset);
        };

    },

    openForm(id = "") {

        const asset = this.list.find(item => item._id === id) || {
            assetName: "",
            category: "Laptop",
            brand: "",
            purchaseDate: "",
            warrantyExpiry: "",
            assignedEmployee: ""
        };

        Modal.show(`
            <h2>${id ? "Edit" : "Add"} Asset</h2>
            <form id="assetForm" class="form-panel-grid">
                <label>Name<input name="assetName" value="${escapeHtml(asset.assetName)}" required></label>
                <label>Category<input name="category" value="${escapeHtml(asset.category)}" required></label>
                <label>Brand<input name="brand" value="${escapeHtml(asset.brand)}" required></label>
                <label>Assigned Employee<input name="assignedEmployee" value="${escapeHtml(asset.assignedEmployee || "")}"></label>
                <label>Purchase Date<input name="purchaseDate" type="date" value="${asset.purchaseDate ? String(asset.purchaseDate).slice(0, 10) : ""}" required></label>
                <label>Warranty Expiry<input name="warrantyExpiry" type="date" value="${asset.warrantyExpiry ? String(asset.warrantyExpiry).slice(0, 10) : ""}" required></label>
                <div class="span-2"><button class="primary-button" type="submit">Save Asset</button></div>
            </form>
        `);

        document.getElementById("assetForm").addEventListener("submit", async event => {
            event.preventDefault();
            const data = Object.fromEntries(new FormData(event.target));

            try {
                if (id) await api.put(`/assets/${id}`, data);
                else await api.post("/assets", data);
                Modal.close();
                showToast("Asset saved.");
                await this.load();
            } catch (error) {
                showToast(error.message);
            }
        });

    },

    async remove(id) {

        if (!confirm("Delete this asset?")) return;

        try {
            await api.delete(`/assets/${id}`);
            showToast("Asset deleted.");
            await this.load();
        } catch (error) {
            showToast(error.message);
        }

    }

};
