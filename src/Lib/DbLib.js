import axios from "axios";

export default class DbLib {
    constructor(apiInfo) {
        this.url = apiInfo["url"];
        this.options = {
            headers: {
                Authorization: "Bearer " + apiInfo["token"]
            }
        };
    }

    initializeDb(db, oldVersion, newVersion, transaction) {
        db.createObjectStore("groups");
        db.createObjectStore("users");
        db.createObjectStore("courses");
        db.createObjectStore("portfolios");
        db.createObjectStore("activities");
        db.createObjectStore("surveys");
    }

    async loadDb(db) {
        await Promise.all([
            this.getApiData(db, this.url + "wp-json/pai/v2/groups/?", "groups", 1000),
            this.getApiData(db, this.url + "wp-json/pai/v2/users/?", "users", 3000),
            this.getApiData(db, this.url + "wp-json/pai/v2/courses/?", "courses", 1000),
            this.getApiData(db, this.url + "wp-json/pai/v2/portfolios/?", "portfolios", 1000),
            this.getApiData(db, this.url + "wp-json/pai/v2/course-activities/?", "activities", 50000),
            this.getApiData(db, this.url + "wp-json/pai/v2/surveys/?", "surveys", 3000),
            this.getApiData(db, this.url + "wp-json/pai/v2/surveys/?caregivers=1&", "surveys", 3000)
        ]);
    }

    async getApiData(db, url, storeName, limit) {
        let offset = 0;
        let count = 0;
        let results = {};
        do {
            if (!localStorage.getItem("USER")) {
                break;
            }
            const result = await axios.get(url + "limit=" + limit + "&offset=" + offset, this.options);
            count = Object.keys(result["data"]).length;
            results = {...results, ...result["data"]};
            offset += count;
        }
        while (count >= limit);

        await this.storeApiResult(db, storeName, results)
    }

    async storeApiResult(db, storeName, result) {
        const objectStore = db.transaction(storeName, "readwrite").objectStore(storeName);
        for (let key in result) {
            objectStore.add(result[key], key);
        }
    }

    async fetchDbStore(db, storeName) {
        let data = {};
        await this.getEntries(data, db, storeName);

        return data;
    }

    async getEntries(data, db, storeName) {
        let cursor = await db.transaction(storeName).store.openCursor();
        for (; cursor; cursor = await cursor.continue()) {
            data[cursor.key] = cursor.value;
        }
    }
};
