const headers = {
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST",
};

exports.handler = async function (event) {
  const body = JSON.parse(event.body);
  let sk = null;
  if (body.currency == "AUD") {
    sk = process.env.STRIPE_SK_AU;
  } else if (body.currency == "NZD") {
    sk = process.env.STRIPE_SK_NZ;
  }
  const stripe = require("stripe")(sk);

  const paymentMethod = await stripe.paymentMethods.retrieve(body.pm);

  const res = JSON.stringify(paymentMethod);

  return {
    statusCode: 200,
    body: res,
  };
};
