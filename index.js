const http = require('http');
const querystring = require('querystring');

const SITE_SECRET_FAKE = "6LfeHx4UAAAAAFWXGh_xcL0B8vVcXnhn9q_SnQ1b"; // localhost validation only
const SITE_VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify';
const CAPTCHA_DEFAULT_PROPERTY = 'g-recaptcha-response';


let siteSecret;
let captchaProperty;


function post(url, data) {
    return new Promise((resolve, reject) => {
        const req = http.request(url, {
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

async function verifyCaptchaResponse(gRecaptchaResponse) {
    const verifyRequestParams = {
        response: gRecaptchaResponse,
        secret: '',
    };
    const response = await post(`${SITE_VERIFY_URL}?${querystring.stringify(verifyRequestParams)}`);
    return response;
}

async function middleware(req, res, next) {
    const gRecaptchaResponse = req.headers[captchaProperty] || req.query[captchaProperty] || req.body[captchaProperty] || req[captchaProperty];

    const response = await verifyCaptchaResponse(gRecaptchaResponse);

    if (response.success) {
        next();
        return;
    }
    throw new Error();
}

/**
 * @param {object} options 
 * @param {object} [options.siteSecret] 
 * @param {object} [options.captchaProperty] 
 */
module.exports = function (options = {}) {
    siteSecret = options.siteSecret || SITE_SECRET_FAKE;
    captchaProperty = options.captchaProperty || CAPTCHA_DEFAULT_PROPERTY

    return middleware;
}
