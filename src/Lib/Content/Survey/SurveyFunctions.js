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
            startDate     -> (int) the timestamp in seconds to start filtering for entries (inclusive)
            endDate       -> (int) the timestamp in seconds to stop filtering for entries (inclusive)
        Return:
            object -> all the survey results with the questions as the keys
    */
    getQuestionResults: function(surveyEntries, startDate, endDate) {
        let results = {};
        for (let portfolioId in surveyEntries) {
            results[portfolioId] = {};
            for (let courseId in surveyEntries[portfolioId]["courses"]) {
                results[portfolioId][courseId] = initResultObj();
                const courseEntries = surveyEntries[portfolioId]["courses"][courseId]["entries"];
                getCourseSurveyResults(results, portfolioId, courseId, courseEntries, startDate, endDate);
            }
        }

        return results;
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
        startDate     -> (int) the timestamp in seconds to start filtering for entries (inclusive)
        endDate       -> (int) the timestamp in seconds to stop filtering for entries (inclusive)
    Return:
        undefined
*/
function getCourseSurveyResults(results, portfolioId, courseId, courseEntries, startDate, endDate) {
    getYesNoResults(results, courseEntries, portfolioId, courseId, startDate, endDate);
    getMultChoiceResults(results, courseEntries, portfolioId, courseId, startDate, endDate);
    getFrqResults(results, courseEntries, portfolioId, courseId, startDate, endDate);
    getScaleResults(results, courseEntries, portfolioId, courseId, startDate, endDate);
}

/*
    True if the date the entry was submitted is within the given dates. False
    otherwise.
    Params:
        submissionDate -> (int) the timestamp the entry was submitted in seconds
        startDate      -> (int) the timestamp in seconds to start filtering for entries (inclusive)
        endDate      -> (int) the timestamp in seconds to stop filtering for entries (inclusive)
*/
function entryWithinDate(submissionDate, startDate, endDate) {
    return (submissionDate >= startDate) && (submissionDate <= endDate);
}

/*
    Get the course's survey results for the Yes/No section
    Params:
        results       -> (object) where the survey results are stored
        courseEntries -> (object) the survey results for the course
        portfolioId   -> (int) the portfolio/school id
        courseId      -> (int) the course id
        startDate     -> (int) the timestamp in seconds to start filtering for entries (inclusive)
        endDate       -> (int) the timestamp in seconds to stop filtering for entries (inclusive)
    Return:
        undefined
*/
function getYesNoResults(results, courseEntries, portfolioId, courseId, startDate, endDate) {
    const yesNoQuestions = [
        "I learned something new as a result of this training.",
        "The information presented was relevant to my goals.",
        "After taking this course, I will use what I learned.",
        "I would recommend PsychArmor training to someone else.",
        "Would you participate in more detailed evaluation?"
    ];
    for (let i = 0; i < courseEntries.length; ++i) {
        if (entryWithinDate(courseEntries[i]["dateSubmitted"], startDate, endDate)) {
            const entryResults = courseEntries[i]["results"];
            for (let i = 0; i < yesNoQuestions.length; ++i) {
                const question = yesNoQuestions[i];
                if (entryResults[question] === "Yes") {
                    ++results[portfolioId][courseId][question]["yes"];
                }
                else {
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
        startDate     -> (int) the timestamp in seconds to start filtering for entries (inclusive)
        endDate       -> (int) the timestamp in seconds to stop filtering for entries (inclusive)
    Return:
        undefined
*/
function getMultChoiceResults(results, courseEntries, portfolioId, courseId, startDate, endDate) {
    for (let i = 0; i < courseEntries.length; ++i) {
        if (entryWithinDate(courseEntries[i]["dateSubmitted"], startDate, endDate)) {
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
        startDate     -> (int) the timestamp in seconds to start filtering for entries (inclusive)
        endDate       -> (int) the timestamp in seconds to stop filtering for entries (inclusive)
    Return:
        undefined
*/
function getScaleResults(results, courseEntries, portfolioId, courseId, startDate, endDate) {
    const questions = [
        "Knowledge in this area",
        "Skills related to topic",
        "Confidence with topic"
    ];

    for (let i = 0; i < courseEntries.length; ++i) {
        if (entryWithinDate(courseEntries[i]["dateSubmitted"], startDate, endDate)) {
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
        startDate     -> (int) the timestamp in seconds to start filtering for entries (inclusive)
        endDate       -> (int) the timestamp in seconds to stop filtering for entries (inclusive)
    Return:
        undefined
*/
function getFrqResults(results, courseEntries, portfolioId, courseId, startDate, endDate) {
    const tokenizer = new natural.AggressiveTokenizer();

    let tokenCount = {
        "What aspects of the course did you find especially helpful": {},
        "What aspects of the course would you like to see changed": {},
        "Application: We are interested in understanding how you applied the content": {},
        "Would you be interested in having your name entered into a drawing for FREE follow-up coaching sessions?": {}
    };
    for (let i = 0; i < courseEntries.length; ++i) {
        if (entryWithinDate(courseEntries[i]["dateSubmitted"], startDate, endDate)) {
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
