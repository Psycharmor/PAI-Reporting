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
        db.createObjectStore("comments");
    }

    async loadDb(db) {
        const user = JSON.parse(sessionStorage.getItem("USER"));
        if (user["user_role"].includes("administrator")) {
            await Promise.all([
                this.getApiData(db, this.url + "wp-json/pai/v2/groups/?", "groups", 1000),
                this.getApiData(db, this.url + "wp-json/pai/v2/users/?", "users", 3000),
                this.getApiData(db, this.url + "wp-json/pai/v2/courses/?", "courses", 1000),
                this.getApiData(db, this.url + "wp-json/pai/v2/portfolios/?", "portfolios", 1000),
                this.getApiData(db, this.url + "wp-json/pai/v2/course-activities/?", "activities", 50000),
                this.getApiData(db, this.url + "wp-json/pai/v2/surveys/?", "surveys", 3000),
                this.getApiData(db, this.url + "wp-json/pai/v2/surveys/?caregivers=1&", "surveys", 3000),
                this.getApiData(db, this.url + "wp-json/pai/v2/surveys/?caregiverscg=1&", "surveys", 3000),
                // this.getApiData(db, this.url + "wp-json/pai/v1/comments/?", "comments", 50000)
            ]);
        }
        else if (user["user_role"].includes("group_leader")) {
            for (let i = 0; i < user["group"].length; ++i) {
                const groupId = user["group"][i]["id"];
                await Promise.all([
                    this.getApiData(db, this.url + "wp-json/pai/v2/groups/?groupid=" + groupId + "&", "groups", 1000),
                    this.getApiData(db, this.url + "wp-json/pai/v2/users/?groupid=" + groupId + "&", "users", 3000),
                    this.getApiData(db, this.url + "wp-json/pai/v2/courses/?groupid=" + groupId + "&", "courses", 1000),
                    this.getApiData(db, this.url + "wp-json/pai/v2/course-activities/?groupid=" + groupId + "&", "activities", 50000)
                ]);
            }
        }
    }

    async getApiData(db, url, storeName, limit) {
        let offset = 0;
        let count = 0;
        let results = {};
        do {
            if (!sessionStorage.getItem("USER")) {
                break;
            }
            const result = await axios.get(url + "limit=" + limit + "&offset=" + offset, this.options);
            count = Object.keys(result["data"]).length;
            results = {...results, ...result["data"]};
            offset += count;
        }
        while (count >= limit);

        await this.storeApiResult(db, storeName, results);
    }

    async storeApiResult(db, storeName, result) {
        const objectStore = db.transaction(storeName, "readwrite").objectStore(storeName);
        for (let key in result) {
            objectStore.put(result[key], key);
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
