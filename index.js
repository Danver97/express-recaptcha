const https = require('https');
const querystring = require('querystring');
const RecaptchaError = require('./recaptcha.error');

const SITE_SECRET_FAKE = "6LfeHx4UAAAAAFWXGh_xcL0B8vVcXnhn9q_SnQ1b"; // localhost validation only
const SITE_VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify';
const CAPTCHA_DEFAULT_PROPERTY = 'g-recaptcha-response';


let siteSecret;
let captchaProperty;


function post(url, data) {
    return new Promise((resolve, reject) => {
        const req = https.request(url, {
            method: 'POST'
        }, res => {
            let body = '';
            res.setEncoding('utf8');
            res.on('data', chunk => {
                body += chunk;
            });
            res.on('end', () => {
                resolve(JSON.parse(body));
            });
        });

        req.on('error', (e) => {
            reject(e);
        });

        if (data)
            req.write(data);
        req.end();
    });
}
/**
 * @typedef {Object} Response
 * @property {boolean} success The X Coordinate
 * @property {string} challenge_ts timestamp of the challenge load
 * @property {string} hostname the hostname of the site where the reCAPTCHA was solved
 * @property {string[]} error-codes 
 */
/**
 * Issues a validation request towars the reCAPTCHA APIs, returning the json response.
 * @param {string} gRecaptchaResponse The reCAPTCHA challenge response
 * @returns {Promise<Response>}
 */
async function verifyCaptchaResponse(gRecaptchaResponse) {
    const verifyRequestParams = {
        response: gRecaptchaResponse,
        secret: siteSecret,
    };
    const paramString = querystring.stringify(verifyRequestParams);
    const response = await post(`${SITE_VERIFY_URL}?${paramString}`);
    return response;
}

async function middleware(req, res, next) {
    const gRecaptchaResponse = req.headers[captchaProperty] || req.query[captchaProperty] || req.body[captchaProperty] || req[captchaProperty];

    const response = await verifyCaptchaResponse(gRecaptchaResponse);

    if (response.success)
        return next();
    const err = RecaptchaError.fromCode(response['error-codes'][0]);
    next(err);
}


middleware.verifyCaptchaResponse = verifyCaptchaResponse;
middleware.RecaptchaError = RecaptchaError;

/**
 * @param {object} options 
 * @param {object} [options.siteSecret] 
 * @param {object} [options.captchaProperty] 
 * @returns {function} The express-compatible middleware
 */
module.exports = function (options = {}) {
    siteSecret = options.siteSecret || SITE_SECRET_FAKE;
    captchaProperty = options.captchaProperty || CAPTCHA_DEFAULT_PROPERTY

    return middleware;
}
