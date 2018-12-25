/**
 * @typedef {Object} ValidationMessage
 * @property {string} field The name of the field with error
 * @property {string} message The error message corresponding to the field
 * 
 * @typedef {Object} SeqError 
 * @property {string} path The path to the property with error
 * @property {string} message The message error
 */

/**
 * Extract the useful information from the validation object returned by Sequelize
 * @param {SeqError} message The validation returned by Sequelize
 * @returns {ValidationMessage} Returns an object with just the important information
 */
function transformMessage(message) {
    return {
        field: message.path,
        message: message.message
    };
}

/**
 * Transform validations messagens from Sequelize to remove
 * unnecessary and unwanted properties
 * @param {Array} messages The message array from Sequelize `validate` function
 * @returns {ValidationMessage[]} Returns the list of transformed messages
 */
function transformValidation(messages) {
    return messages.map(transformMessage);
}

module.exports = transformValidation;