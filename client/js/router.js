const Router = {

    routes: {

        dashboard: () => dashboard.renderPage(),
        raise: () => complaints.renderRaisePage(),
        complaints: () => complaints.renderPage(),
        assets: () => assets.renderPage(),
        users: () => users.renderPage(),
        reports: () => reports.renderPage(),
        profile: () => profile.renderPage()

    },

    async navigate(page) {

        const fn = this.routes[page];

        if (!fn) {

            document.getElementById("pageContent").innerHTML =
                "<h2>404 Page Not Found</h2>";

            return;
        }

        document
            .querySelectorAll(".nav-link")
            .forEach(link => {

                link.classList.remove("active");

                if (link.dataset.page === page)
                    link.classList.add("active");

            });

        document.getElementById("pageTitle").innerText =
            page.charAt(0).toUpperCase() + page.slice(1);

        await fn();

    }

};
