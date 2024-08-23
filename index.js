const express = require('express');
const app = express();
const mongoose = require('mongoose'); ``
const { queryParser } = require('express-query-parser')
const port = 3000;
const cors = require('cors');
const Transaction = require('./models/transactions')
require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use(queryParser({
    parseNull: true,
    parseUndefined: true,
    parseBoolean: true,
    parseNumber: true
}))
mongoose.connect(process.env.MONGODB_URI).then(() => console.log('[INFO] MONGODB CONNECTED'))
// Mock API endpoints
app.get('/', async (req, res) => {
    let startDate = req.query?.range?.start ? req.query.range.start.toString() : "1970-01-01";
    let endDate = req.query?.range?.end ? req.query.range.end.toString() : Date.now();
    let by = req.query.by
    let search = new RegExp(req.query.q, 'i')

    if (by == 'product') {
        let result = await Transaction.find({
            productName: search, tran_date: {
                $gte: startDate,
                $lt: endDate
            }
        })
            .sort({ tran_date: -1 })
            .exec()
            .catch(err => console.error(err))
        let revenue = 0;
        result.map((item, index) => {
            revenue += Number.parseInt(item.store_amount);
        })
        return res.json({ data: result, revenue: revenue, totalSales: result.length})
    }


    if (by == 'agent') {
        const result = await Transaction.find({
            utm_id: search, tran_date: {
                $gte: startDate,
                $lt: endDate
            }
        })
            .sort({ tran_date: -1 })
            .exec()
            .catch(err => res.json(err))
        let revenue = 0;
        result.map((item, index) => {
            revenue += item.store_amount;
        })
        return res.json({ data: result, revenue: revenue, totalSales: result.length})
    }
    let result = await Transaction.find({tran_date: {
        $gte: startDate,
        $lt: endDate
    }})
    .sort({ tran_date: -1 })
    .exec()
    let revenue = 0;
    result.map((item, index) => {
        revenue += item.store_amount;
    })
    return res.json({ data: result, revenue: revenue, totalSales: result.length})
    
})

app.post('/aggregate', async (req, res) => {
    let object = req.body
    object.map((item, index) => {
        let transaction = new Transaction(item)
        transaction.save()
        console.log("Saved:", index)
    })
})

app.listen(port, () => { console.log('[INFO] SERVER STARTED') })