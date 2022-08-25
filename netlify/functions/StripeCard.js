const headers = {
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST",
};

exports.handler = async function (event) {
  const secret = process.env.STRIPE_SK;
  const body = JSON.parse(event.body);
  const stripe = require("stripe")(secret);

  const paymentMethod = await stripe.paymentMethods.retrieve(body.pm);

  const res = JSON.stringify(paymentMethod);

  return {
    statusCode: 200,
    body: res,
  };
};
