function transformMessage(message) {
    return {
        field: message.path,
        message: message.message
    };
}

/**
 * Transform validations messagens from Sequelize to remove
 * unnecessary and unwanted properties
 * @param messages {Array} The message array from Sequelize `validate` function
 */
function transformValidation(messages) {
    return messages.map(transformMessage);
}

module.exports = transformValidation;