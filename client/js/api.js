const api = {

    headers(data) {

        const token = localStorage.getItem("token");
        const headers = {};

        if (!(data instanceof FormData)) {
            headers["Content-Type"] = "application/json";
        }

        if (token) {
            headers.Authorization = "Bearer " + token;
        }

        return headers;

    },

    body(data) {

        if (data === undefined) return undefined;
        return data instanceof FormData ? data : JSON.stringify(data);

    },

    async request(endpoint, options = {}) {

        const response = await fetch(BASE_URL + endpoint, options);
        const payload = await response.json().catch(() => ({
            success: false,
            message: "Invalid server response."
        }));

        if (!response.ok || payload.success === false) {
            throw new Error(payload.message || "Request failed.");
        }

        return payload;

    },

    get(endpoint) {

        return this.request(endpoint, {
            headers: this.headers()
        });

    },

    post(endpoint, data) {

        return this.request(endpoint, {
            method: "POST",
            headers: this.headers(data),
            body: this.body(data)
        });

    },

    put(endpoint, data) {

        return this.request(endpoint, {
            method: "PUT",
            headers: this.headers(data),
            body: this.body(data)
        });

    },

    delete(endpoint) {

        return this.request(endpoint, {
            method: "DELETE",
            headers: this.headers()
        });

    }

};
