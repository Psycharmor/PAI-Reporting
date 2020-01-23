import stopwords from "./Stopwords";
import natural from "natural";
/*
    All the functions related to Survey view computation/info parsing
*/
const SurveyFunctions = {
    /*
        Get all the results of the survey where the keys are the questions
        Params:
            surveyEntries -> (object) all the survey entries obtained by the api
            filters -> (object) all the additional filters
        Return:
            object -> all the survey results with the questions as the keys
    */
    getQuestionResults: function(surveyEntries, filters) {
        let results = {};
        for (let portfolioId in surveyEntries) {
            results[portfolioId] = {};
            for (let courseId in surveyEntries[portfolioId]["courses"]) {
                results[portfolioId][courseId] = initResultObj();
                const courseEntries = surveyEntries[portfolioId]["courses"][courseId]["entries"];
                getCourseSurveyResults(results, portfolioId, courseId, courseEntries, filters);
            }
        }

        return results;
    },
    /*
        True if the entry passes all filters.
        Params:
            submission   -> (object) the entry
            filters -> (object) all the additional filters
    */
    entryPassesFilters: function entryPassesFilters(submission, filters) {
        return (submission["dateSubmitted"] >= filters["startDate"]) &&
            (submission["dateSubmitted"] <= filters["endDate"]) &&
            (filters["team"] === 0 || (submission["team"] === filters["team"])) &&
            (filters["organization"] === 0 || (submission["organization"] === filters["organization"])) &&
            (filters["role"] === 0 || (submission["roleWithVeterans"] === filters["role"]));
    }
};
export default SurveyFunctions;

/*
    Create the initial object that will hold all the survey results for a
    course
    Params:
        none
    Return:
        undefined
*/
function initResultObj() {
    return {
        "I learned something new as a result of this training.": {yes: 0, no: 0},
        "The information presented was relevant to my goals.": {yes: 0, no: 0},
        "After taking this course, I will use what I learned.": {yes: 0, no: 0},
        "I would recommend PsychArmor training to someone else.": {yes: 0, no: 0},
        "Would you participate in more detailed evaluation?": {yes: 0, no: 0},
        "I am more aware of available resources as a result of this course.": {yes: 0, no: 0},
        "Why did you take this course?": {
            "Interested in topic": 0,
            "To improve performance": 0,
            "Directed to take this course": 0,
            "To earn Continuing Education Credit or Equiv": 0,
            "Other": 0
        },
        "What aspects of the course did you find especially helpful": {},
        "What aspects of the course would you like to see changed": {},
        "Knowledge in this area": {before: [0, 0, 0, 0, 0], now: [0, 0, 0, 0, 0]},
        "Skills related to topic": {before: [0, 0, 0, 0, 0], now: [0, 0, 0, 0, 0]},
        "Confidence with topic": {before: [0, 0, 0, 0, 0], now: [0, 0, 0, 0, 0]},
        "Application: We are interested in understanding how you applied the content": {},
        "Would you be interested in having your name entered into a drawing for FREE follow-up coaching sessions?": {}
    };
}

/*
    Get the survey results of a course and add them to the results parameter
    Params:
        results       -> (object) where the survey results are stored
        courseEntries -> (object) the survey results for the course
        portfolioId   -> (int) the portfolio/school id
        courseId      -> (int) the course id
        filters -> (object) all the additional filters
    Return:
        undefined
*/
function getCourseSurveyResults(results, portfolioId, courseId, courseEntries, filters) {
    getYesNoResults(results, courseEntries, portfolioId, courseId, filters);
    getMultChoiceResults(results, courseEntries, portfolioId, courseId, filters);
    getFrqResults(results, courseEntries, portfolioId, courseId, filters);
    getScaleResults(results, courseEntries, portfolioId, courseId, filters);
}

/*
    Get the course's survey results for the Yes/No section
    Params:
        results       -> (object) where the survey results are stored
        courseEntries -> (object) the survey results for the course
        portfolioId   -> (int) the portfolio/school id
        courseId      -> (int) the course id
        filters -> (object) all the additional filters
    Return:
        undefined
*/
function getYesNoResults(results, courseEntries, portfolioId, courseId, filters) {
    const yesNoQuestions = [
        "I learned something new as a result of this training.",
        "The information presented was relevant to my goals.",
        "After taking this course, I will use what I learned.",
        "I would recommend PsychArmor training to someone else.",
        "Would you participate in more detailed evaluation?",
        "I am more aware of available resources as a result of this course."
    ];
    for (let i = 0; i < courseEntries.length; ++i) {
        if (SurveyFunctions.entryPassesFilters(courseEntries[i], filters)) {
            const entryResults = courseEntries[i]["results"];
            for (let i = 0; i < yesNoQuestions.length; ++i) {
                const question = yesNoQuestions[i];
                if (entryResults[question] === "Yes") {
                    ++results[portfolioId][courseId][question]["yes"];
                }
                else if (entryResults[question] === "No") {
                    ++results[portfolioId][courseId][question]["no"];
                }
            }
        }
    }
}

/*
    Get the course's survey results for the multiple choice questions
    Params:
        results       -> (object) where the survey results are stored
        courseEntries -> (object) the survey results for the course
        portfolioId   -> (int) the portfolio/school id
        courseId      -> (int) the course id
        filters -> (object) all the additional filters
    Return:
        undefined
*/
function getMultChoiceResults(results, courseEntries, portfolioId, courseId, filters) {
    for (let i = 0; i < courseEntries.length; ++i) {
        if (SurveyFunctions.entryPassesFilters(courseEntries[i], filters)) {
            const entryResults = courseEntries[i]["results"];
            const question = "Why did you take this course?";
            for (let j = 0; j < entryResults[question].length; ++j) {
                ++results[portfolioId][courseId][question][entryResults[question][j]];
            }
        }
    }
}

/*
    Get the course's survey results for the 1-5 scale before and now questions
    Params:
        results       -> (object) where the survey results are stored
        courseEntries -> (object) the survey results for the course
        portfolioId   -> (int) the portfolio/school id
        courseId      -> (int) the course id
        filters -> (object) all the additional filters
    Return:
        undefined
*/
function getScaleResults(results, courseEntries, portfolioId, courseId, filters) {
    const questions = [
        "Knowledge in this area",
        "Skills related to topic",
        "Confidence with topic"
    ];

    for (let i = 0; i < courseEntries.length; ++i) {
        if (SurveyFunctions.entryPassesFilters(courseEntries[i], filters)) {
            const entryResults = courseEntries[i]["results"];
            for (let j = 0; j < questions.length; ++j) {
                const question = questions[j];
                if (entryResults[question]["before"] !== "") {
                    const index = parseInt(entryResults[question]["before"]) - 1;
                    ++results[portfolioId][courseId][question]["before"][index];
                }
                if (entryResults[question]["now"] !== "") {
                    const index = parseInt(entryResults[question]["now"]) - 1;
                    ++results[portfolioId][courseId][question]["now"][index];
                }
            }
        }
    }
}

/*
    Get the course's results for the free response questions
    Params:
        results       -> (object) where the survey results are stored
        courseEntries -> (object) the survey results for the course
        portfolioId   -> (int) the portfolio/school id
        courseId      -> (int) the course id
        filters -> (object) all the additional filters
    Return:
        undefined
*/
function getFrqResults(results, courseEntries, portfolioId, courseId, filters) {
    const tokenizer = new natural.AggressiveTokenizer();

    let tokenCount = {
        "What aspects of the course did you find especially helpful": {},
        "What aspects of the course would you like to see changed": {},
        "Application: We are interested in understanding how you applied the content": {},
        "Would you be interested in having your name entered into a drawing for FREE follow-up coaching sessions?": {}
    };
    for (let i = 0; i < courseEntries.length; ++i) {
        if (SurveyFunctions.entryPassesFilters(courseEntries[i], filters)) {
            const entryResults = courseEntries[i]["results"];
            for (let question in tokenCount) {
                const tokens = tokenizer.tokenize(entryResults[question].toLowerCase()) || [];
                for (let j = 0; j < tokens.length; ++j) {
                    if (!stopwords.includes(tokens[j])) {
                        if(!(tokens[j] in tokenCount[question])) {
                            tokenCount[question][tokens[j]] = 0;
                        }
                        ++tokenCount[question][tokens[j]];
                    }
                }
            }
        }
    }
    for (let question in tokenCount) {
        results[portfolioId][courseId][question] = tokenCount[question];
    }
}
