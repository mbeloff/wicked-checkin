const headers = {
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST",
};

exports.handler = async function (event) {
  
  const body = JSON.parse(event.body);
  const secret = body.currency == "USD" ? process.env.STRIPE_SK_USA : process.env.STRIPE_SK;
  const stripe = require("stripe")(secret);
  const customer = await stripe.customers.create(body.customer);
  const params = {
    customer: customer.id,
    setup_future_usage: "off_session",
    amount: body.amount,
    currency: body.currency,
  };
  const paymentIntent = await stripe.paymentIntents.create(params);
  const res = JSON.stringify({
    secret: paymentIntent.client_secret,
    cid: customer.id,
  });
  return {
    statusCode: 200,
    body: res,
  };
};
