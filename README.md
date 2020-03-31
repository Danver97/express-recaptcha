# reCAPTCHA.js

This library has been developed to help you validate reCAPTCHA responses in Node.js.

## Install
```
npm install recaptcha --save
```


## Usage
```js
const recaptcha = require('recaptcha');

const expressMiddlerware = recaptcha({
    siteSecret: 'string', // Required. The site secret created in the admin console.
    captchaProperty: 'string' // Optional. The name of the property used to store the recaptcha response. More info later
});

app.post('/endpoint', recaptchaMiddleware, (req, res) => {
    res.json({ message: 'SUCCESS' });
});
```

`expressMiddleware` contains also 2 properties:
- `verifyCaptchaResponse`: a function you can use to validare directly your captcha response. It returns the raw json response from the reCAPTCHA APIs.
- `RecaptchaError`: the class of the errors thrown by the `recaptchaMiddleware`.


Using `verifyCaptchaResponse` you can build your own validation logic as the following.
```js 
app.post('/endpoint', (req, res, next) => {
    const response = await verifyCaptchaResponse(req.body.captcha['g-recaptcha-response']);
    if (response.success){
        res.json({ message: 'SUCCESS' });
        return;
    }
    next(new Error('recaptcha challenge failed'));
});

```


## Documentation

### recaptcha(options)
`options` is an object with 2 parameters:
- `siteSecret`: **required**, the site secret created in the admin console.
- `captchaProperty`: **optional**, the name of the property used to store the recaptcha response

The middleware by default look for the recaptcha response under the `g-recaptcha-response` property of the following objects in the given order:
1. `req.headers`
2. `req.query`
3. `req.body`
4. `req`
where `req` is the express request passed to the middleware.

If your backend is not receiving the recaptcha response under that property you can override this behaviour by changing the name of the property or create your custom logic.

The function returns a function which is your express ready middleware.  
The middleware has 2 properties:
- `verifyCaptchaResponse`
- `RecaptchaError`

### verifyCaptchaResponse(gRecaptchaResponse)
`gRecaptchaResponse`: the recaptcha response. Must be a string.

Returns a Promise that resolves to the json response returned by the reCAPTCHA APIs.
The returned object from the promise has the following properties:
- `success`: boolean, indicates if the validation was successful
- `challenge_ts`: timestamp of the challenge load (ISO format yyyy-MM-dd'T'HH:mm:ssZZ)
- `hostname`: the hostname of the site where the reCAPTCHA was solved
- `error-codes`: an array of strings representing the error codes. You can parse these strings using `RecaptchaError.fromCode` in order to get more info.


### RecaptchaError
The error class used by the library. All the errors thrown by the middleware are instances of this class.

It provides the utility method `fromCode(code, msg)` useful for getting more info from the `error-codes` returned from the `verifyCaptchaResponse` function. The `msg` parameter overrides the default error, this was designed for an internal use.

Example:
```js
const recaptcha = require('recaptcha');

const RecaptchaError = recaptcha({ siteSecret }).RecaptchaError;

async function run() {
    const response = await verifyCaptchaResponse(gRecaptchaResponse);
    if (!response.successful) {
        const errCode = response[`error-codes`][0];
        const err = RecaptchaError.fromCode(errCode);

        console.log(err.code);
        console.log(err.message); // Tells more about the errorCode
        throw err;
    }
    //...
}
```

