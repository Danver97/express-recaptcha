const ExtendableError = require('./extendable_error');

const errors = {
    missingInputSecret: {
        code: 'missing-input-secret',
        defaultMessage: 'The secret parameter is missing.',
    },
    invalidInputSecret: {
        code: 'invalid-input-secret',
        defaultMessage: 'The secret parameter is invalid or malformed.',
    },
    missingInputResponse: {
        code: 'missing-input-response',
        defaultMessage: 'The response parameter is missing.',
    },
    invalidInputResponse: {
        code: 'invalid-input-response',
        defaultMessage: 'The response parameter is invalid or malformed.',
    },
    badRequest: {
        code: 'bad-request',
        defaultMessage: 'The request is invalid or malformed.',
    },
    timeoutOrDuplicate: {
        code: 'timeout-or-duplicate',
        defaultMessage: 'The response is no longer valid: either is too old or has been used previously.',
    },
};

class RecaptchaError extends ExtendableError {

    static fromCode(code, msg) {
        for (let k of Object.keys(errors)) {
            const err = errors[k];
            if (err.code === code)
                return RecaptchaError[k](msg);
        }
        throw new Error(`'code' ${code} is not supported`);
    }

    static missingInputSecret(msg) {
        return new RecaptchaError(msg || errors.missingInputSecret.defaultMessage, RecaptchaError.missingInputSecretCode);
    }

    static get missingInputSecretCode() {
        return  errors.missingInputSecret.code
    }

    static invalidInputSecret(msg) {
        return new RecaptchaError(msg || errors.invalidInputSecret.defaultMessage, RecaptchaError.invalidInputSecretCode);
    }

    static get invalidInputSecretCode() {
        return  errors.invalidInputSecret.code;
    }

    static missingInputResponse(msg) {
        return new RecaptchaError(msg || errors.missingInputResponse.defaultMessage, RecaptchaError.missingInputResponseCode);
    }

    static get missingInputResponseCode() {
        return  errors.missingInputResponse.code;
    }

    static invalidInputResponse(msg) {
        return new RecaptchaError(msg || errors.invalidInputResponse.defaultMessage, RecaptchaError.invalidInputResponseCode);
    }

    static get invalidInputResponseCode() {
        return  errors.invalidInputResponse.code;
    }

    static badRequest(msg) {
        return new RecaptchaError(msg || errors.badRequest.defaultMessage, RecaptchaError.badRequestCode);
    }

    static get badRequestCode() {
        return  errors.badRequest.code;
    }

    static timeoutOrDuplicate(msg) {
        return new RecaptchaError(msg || errors.timeoutOrDuplicate.defaultMessage, RecaptchaError.timeoutOrDuplicateCode);
    }

    static get timeoutOrDuplicateCode() {
        return  errors.timeoutOrDuplicate.code;
    }
}

module.exports = RecaptchaError;
