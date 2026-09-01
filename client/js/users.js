const users = {

    list: [],

    async renderPage() {

        document.getElementById("pageContent").innerHTML = `
            <div class="users-layout">
                <section class="section user-form-card">
                    <div class="section-title">
                        <div>
                            <h3>Add User</h3>
                            <p>Create accounts for employees, technicians, and admins.</p>
                        </div>
                    </div>
                    <form id="userForm" class="form-panel-grid">
                        <label>Full Name<input name="name" placeholder="Ananya Rao" required></label>
                        <label>Email<input name="email" type="email" placeholder="name@company.com" required></label>
                        <label>Password<input name="password" type="password" minlength="8" placeholder="Minimum 8 characters" required></label>
                        <label>Mobile<input name="mobile" placeholder="9876543210" required></label>
                        <label>Department<input name="department" placeholder="Information Technology" required></label>
                        <label>Role
                            <select name="role" required>
                                <option value="employee">Employee</option>
                                <option value="technician">Technician</option>
                                <option value="admin">Administrator</option>
                            </select>
                        </label>
                        <div class="span-2 button-row form-actions">
                            <button class="primary-button" type="submit">Add User</button>
                            <button class="secondary-button" type="reset">Clear</button>
                        </div>
                    </form>
                </section>

                <section class="section user-summary-card">
                    <div class="section-title">
                        <div>
                            <h3>User Directory</h3>
                            <p>Account overview from the database.</p>
                        </div>
                    </div>
                    <div id="userStats" class="mini-stats">
                        <article><span>Total</span><strong>0</strong></article>
                        <article><span>Employees</span><strong>0</strong></article>
                        <article><span>Technicians</span><strong>0</strong></article>
                        <article><span>Admins</span><strong>0</strong></article>
                    </div>
                </section>
            </div>

            <section class="section">
                <div class="toolbar">
                    <div>
                        <h3>Users</h3>
                        <p class="muted">All active helpdesk accounts.</p>
                    </div>
                </div>
                <div id="userTable">${loading()}</div>
            </section>
        `;

        await this.load();
        document.getElementById("userForm").addEventListener("submit", async event => {
            event.preventDefault();
            await this.create(Object.fromEntries(new FormData(event.target)));
            event.target.reset();
        });

    },

    async load() {

        try {
            const response = await api.get("/users");
            this.list = response.users || [];
            this.renderStats();
            this.renderTable();
        } catch (error) {
            showMessage(error.message, "error");
        }

    },

    renderStats() {

        const container = document.getElementById("userStats");
        if (!container) return;

        const countByRole = role =>
            this.list.filter(user => user.role === role).length;

        const stats = [
            ["Total", this.list.length],
            ["Employees", countByRole("employee")],
            ["Technicians", countByRole("technician")],
            ["Admins", countByRole("admin")]
        ];

        container.innerHTML = stats.map(([label, value]) => `
            <article>
                <span>${label}</span>
                <strong>${value}</strong>
            </article>
        `).join("");

    },

    renderTable() {

        const container = document.getElementById("userTable");

        if (!this.list.length) {
            container.innerHTML = `<p class="muted">No users found.</p>`;
            return;
        }

        container.innerHTML = `
            <div class="table-wrap">
                <table>
                    <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Department</th><th>Role</th><th>Mobile</th></tr></thead>
                    <tbody>
                        ${this.list.map(user => `
                            <tr>
                                <td><strong>${escapeHtml(user.userId)}</strong></td>
                                <td>${escapeHtml(user.name)}</td>
                                <td>${escapeHtml(user.email)}</td>
                                <td>${escapeHtml(user.department)}</td>
                                <td><span class="role-pill">${escapeHtml(user.role)}</span></td>
                                <td>${escapeHtml(user.mobile)}</td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            </div>
        `;

    },

    async create(data) {

        try {
            await api.post("/users", data);
            showToast("User created.");
            await this.load();
        } catch (error) {
            showToast(error.message);
        }

    }

};
