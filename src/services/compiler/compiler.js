const axios = require('axios');
const config = require('../../config').cfg;
const appUtils = require("../../appUtils");

const apiKey = config.Judge0_API_key;
const endpt = config.Judge0_endpoint;
const statusCodes = {
    1: { code: 1, name: "In Queue" },
    2: { code: 2, name: "Processing" },
    3: { code: 3, name: "Accepted" },
    4: { code: 4, name: "Wrong Answer" },
    5: { code: 5, name: "Time Limit Exceeded" },
    6: { code: 6, name: "Compilation Error" },
    7: { code: 7, name: "Runtime Error (SIGSEGV)" },
    8: { code: 8, name: "Runtime Error (SIGXFSZ)" },
    9: { code: 9, name: "Runtime Error (SIGFPE)" },
    10: { code: 10, name: "Runtime Error (SIGABRT)" },
    11: { code: 11, name: "Runtime Error (NZEC)" },
    12: { code: 12, name: "Runtime Error (Other)" },
    13: { code: 13, name: "Internal Error" },
    14: { code: 14, name: "Exec Format Error" }
};

// Submit a batch of test cases with Base64 encoding
async function submitBatchTestCases(source_code, language_id, testCases) {
    const submissions = testCases.map((testCase) => ({
        source_code: Buffer.from(source_code).toString('base64'),
        language_id,
        stdin: Buffer.from(testCase.input).toString('base64')
    }));
    const batchSubmission = await axios.post(`${endpt}/submissions/batch?base64_encoded=true`, {
        submissions: submissions
    }, {
        headers: {
            'X-Judge0-Key': apiKey,
            'X-Judge0-Host': 'super-compiler.prepinsta.com',
            'Content-Type': 'application/json'
        }
    });
    return batchSubmission.data.map(item => item.token); // Return all tokens
}

// Fetch batch results with Base64 decoding
async function getBatchResults(tokens) {
    let allResultsFetched = false;
    let results;

    while (!allResultsFetched) {
        // Poll every 2 seconds
        await new Promise(resolve => setTimeout(resolve, 2000));

        const result = await axios.get(`${endpt}/submissions/batch?base64_encoded=true&tokens=${tokens.join(',')}`, {
            headers: {
                'X-Judge0-Key': apiKey,
                'X-Judge0-Host': 'super-compiler.prepinsta.com',
                'Content-Type': 'application/json'
            }
        });

        results = result.data.submissions;

        // Decode base64 results
        results.forEach(submission => {
            submission.stdout = submission.stdout ? Buffer.from(submission.stdout, 'base64').toString('utf-8'): ""; 
            submission.stderr = submission.stderr ? Buffer.from(submission.stderr, 'base64').toString('utf-8'): "";
            submission.compile_output = submission.compile_output ?  Buffer.from(submission.compile_output, 'base64').toString('utf-8'): "";
            submission.message = submission.message ?  Buffer.from(submission.message, 'base64').toString('utf-8'): "";

        });

        // Check if all results are processed
        allResultsFetched = results.every(submission => submission.status.id >= 3); // Status 3 means finished
    }

    return results;
}

function processResults(testCases, submissions) {
    return testCases.map((testCase, index) => {
        const submission = submissions[index];
        const actualOutput = submission.stdout ? submission.stdout.trim() : "";
        const expectedOutput = testCase.output.trim();
        const isAccepted = actualOutput === expectedOutput;
        const status = isAccepted
            ? statusCodes[3] // Output matches, "Accepted"
            : submission.status.id > 3
                ? statusCodes[submission.status.id] // Use the actual status for errors like Time Limit Exceeded, Compilation Error, etc.
                : statusCodes[4]; // Output doesn't match, "Wrong Answer"

        return {
            number: index,
            input: testCase.input,
            output: testCase.output,
            submissionToken: submission.token,
            stderr: submission.stderr,
            compile_output: submission.compile_output || "",
            message: submission.message || "",
            status,
            time: parseFloat(submission.time),
            memory: submission.memory
        };
    });
}

// Main function to compile code, submit batch, and process results
async function compileCode(source_code, language_id, testCases) {
    try {
        const tokens = await submitBatchTestCases(source_code, language_id, testCases);
        const results = await getBatchResults(tokens);

        const processedResults = processResults(testCases, results);
        return processedResults;
    } catch (error) {
        appUtils.logError({moduleName:"services" , methodName : "compileCode",err:error });
        throw error;
    }
}

//========================== Export Module Start ==============================

module.exports = {
    compileCode
};

//========================== Export Module End ===============================
