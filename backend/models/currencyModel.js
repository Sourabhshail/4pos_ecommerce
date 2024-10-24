const { Schema, model } = require('mongoose');

const currencySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    symbol: {
        type: String,
        required: true
    }
});

module.exports = model('Currency', currencySchema);