const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    store_amount: {type: Number, required: true},
    utm_id: {type: String, required: true},
    productName: {type: String, required: true},
    utm_source: {type: String, required: true, default: "UAA"},
    coupon: {type: String},
    tran_date: {type: Date, required: true}
}, {timestamps: true})
const transaction= mongoose.model('Transaction', transactionSchema)
module.exports = transaction