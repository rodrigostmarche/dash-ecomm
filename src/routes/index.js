const express = require('express');
const router = express.Router();
const { fetchAllOrders } = require('../services/shopifyService');
const { countByField, getDateFromRangeOption } = require('../utils/helpers');
const renderHTML = require('../views/renderHTML');
const renderStatusTable = require('../views/renderStatusTable');
const renderOrderDetails = require('../views/renderOrderDetails');

router.get('/', async (req, res) => {
  try {
    const range = req.query.range || 'last3days';
    const startDate = getDateFromRangeOption(range);
    const orders = await fetchAllOrders(startDate);

    const totalOrders = orders.length;
    const financialCounts = countByField(orders, 'displayFinancialStatus');
    const fulfillmentCounts = countByField(orders, 'displayFulfillmentStatus');
    const statusCounts = countByField(orders, 'orderStatus');
    const invoiceStatus = countByField(orders, 'invoiceStatus');

    const fulfilledNotPaidOrders = orders.filter(
      o => o.displayFulfillmentStatus === 'FULFILLED' && o.displayFinancialStatus !== 'PAID'
    );

    res.send(
      renderHTML(
        `Resumo de Pedidos Shopify (${range})`,
        totalOrders,
        financialCounts,
        fulfillmentCounts,
        statusCounts,
        invoiceStatus,
        fulfilledNotPaidOrders,
        range
      )
    );
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao consultar pedidos.');
  }
});

router.get('/status/:type/:value', async (req, res) => {
  const { type, value } = req.params;
  const range = req.query.range || 'last3days';
  const startDate = getDateFromRangeOption(range);

  try {
    const orders = await fetchAllOrders(startDate);
    const filtered = orders.filter(o => {
      const fieldValue = o[type] || '';
      return fieldValue.toString().trim().toUpperCase() === value.toString().trim().toUpperCase();
    });

    res.send(renderStatusTable(type, value, filtered, range));
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao filtrar pedidos.');
  }
});

router.get('/order/:name', async (req, res) => {
  const { name } = req.params;
  const range = req.query.range || 'last3days';
  const startDate = getDateFromRangeOption(range);

  try {
    const orders = await fetchAllOrders(startDate);
    const order = orders.find(o => o.name === name);

    if (!order) {
      return res.status(404).send('Pedido não encontrado.');
    }

    res.send(renderOrderDetails(order));
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao consultar pedido.');
  }
});

module.exports = router;