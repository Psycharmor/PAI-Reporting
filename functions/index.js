const axios = require("axios");
const async = require("async");
const firebase = require("firebase-admin");
const functions = require("firebase-functions");
const superFunction = functions.runWith({
	timeoutSeconds: 540,
	memory: "4GB",
});

firebase.initializeApp({
	databaseURL: "https://reporting-b5318-default-rtdb.firebaseio.com/",
});

const url = "https://psycharmor.org";
const fetch = async (endpoint, limit, params) => {
	console.log(`Starting => ${endpoint}`);

	const user = await axios.post(url + "/wp-json/jwt-auth/v1/token/",
		{
			username: "reporting@psycharmor.org",
			password: "rm9&p^&yR9TmtY6pSSGgM0n^",
		},
	);

	const userToken = user.data.token;
	const {data} = await axios({
		method: "GET",
		url: `${url}/wp-json/pai/v2/${endpoint}`,
		params: {
			limit: limit ? limit : 3000,
			...params,
		},
		headers: {
			"Authorization": `Bearer ${userToken}`,
		},
	});

	// Let's get rid of dots [.], dollar sign [$] and colons [:] in keys
	const stringData = JSON.stringify(data);
	const replacedData = stringData.replace(/\./g, "").replace(/\$/g, "").replace(/here:/g, "here");
	const parsedData = JSON.parse(replacedData);

	const chunks = makeChunks(parsedData, 10000);
	await async.eachOf(chunks, async (chunk) => {
		await firebase.database().ref(endpoint).update(chunk);
	});

	const size = Object.keys(parsedData).length;
	console.log(`Finished => ${endpoint}; Requested => ${limit}; Got => ${size}`);
};

const fetchAll1 = async () => {
	await fetch("groups", 10000);
	await fetch("users", 100000);
	await fetch("courses", 10000);
	await fetch("portfolios", 10000);
};
const fetchAll2 = async () => {
	await fetch("course-activities", 1000000);
	await fetch("surveys", 100000);
	await fetch("surveys", 30000, {caregivers: 1});
	await fetch("surveys", 30000, {caregiverscg: 1});
};

exports.autoFetchFromWP1 = superFunction.pubsub.schedule("every 12 hours").onRun(fetchAll1);
exports.autoFetchFromWP2 = superFunction.pubsub.schedule("every 12 hours").onRun(fetchAll2);
exports.manualFetchFromWP1 = superFunction.https.onRequest(async (req, res) => {
	await fetchAll1();
	res.send("OK");
});
exports.manualFetchFromWP2 = superFunction.https.onRequest(async (req, res) => {
	await fetchAll2();
	res.send("OK");
});

function makeChunks(object, chunk_size) {
	const values = Object.values(object);
	const final = [];
	let counter = 0;
	let portion = {};

	for (let key in object) {
		if (counter !== 0 && counter % chunk_size === 0) {
			final.push(portion);
			portion = {};
		}
		portion[key] = values[counter];
		counter++;
	}

	final.push(portion);
	return final;
}
