const headers = {
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST",
};

exports.handler = async function (event) {
  const body = JSON.parse(event.body);
  const secret =
    body.currency == "USD" ? process.env.STRIPE_SK_USA : process.env.STRIPE_SK;
  const stripe = require("stripe")(secret);

  const paymentMethod = await stripe.paymentMethods.retrieve(body.pm);

  const res = JSON.stringify(paymentMethod);

  return {
    statusCode: 200,
    body: res,
  };
};
