const fetch = require("node-fetch");
const convert = require("xml-js");

exports.handler = async function (event) {
  const urlParams = new URLSearchParams(event.rawQuery);

  var transresponse = urlParams.get("result");
  var pxpayuser = process.env.PXPAY_USER;
  var pxpaykey = process.env.PXPAY_KEY;

  var raw =
    "<ProcessResponse>\r\n<PxPayUserId>" +
    pxpayuser +
    "</PxPayUserId>\r\n<PxPayKey>" +
    pxpaykey +
    "</PxPayKey>\r\n<Response>" +
    transresponse +
    "</Response>\r\n</ProcessResponse>";

  var requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/xml" },
    body: raw,
    redirect: "follow",
  };

  const res = await fetch(
    "https://sec.windcave.com/pxaccess/pxpay.aspx",
    requestOptions
  )
    .then((response) => response.text())
    .catch((error) => console.log("error", error));

  let json = convert.xml2json(res, { compact: true });
  json = JSON.parse(json).Response;

  if (!json.Success._text == 1) {
    return { statusCode: 202 };
  }

  let params = {
    method: "confirmpayment",
    reservationref: urlParams.get("resref"),
    amount: json.AmountSettlement._text,
    success: json.Success._text,
    paytype: json.CardName._text,
    paydate:
      json.DateSettlement._text.slice(6, 8) +
      "/" +
      json.DateSettlement._text.slice(4, 6) +
      "/" +
      json.DateSettlement._text.slice(0, 4),
    supplierid: 2,
    transactid: json.DpsBillingId._text,
    dpstxnref: json.DpsTxnRef._text,
    cardholder: json.CardHolderName._text,
    paysource: `Checkin Backend Windcave ${json.TxnType._text}`,
    cardnumber: json.CardNumber._text,
    cardexpiry:
      json.DateExpiry._text.slice(0, 2) + "/" + json.DateExpiry._text.slice(2),
    transtype: json.TxnType._text == 'Auth' ? 'Auth' : 'Payment',
  };

  let token = await fetch("https://checkin.wickedcampers.co.nz/.netlify/functions/getToken", {
    method: "POST",
  })
    .then((response) => response.text())
    .then((response) => {
      let res = JSON.parse(response);
      return res.access_token;
    })
    .catch((error) => console.log("error", error));

  fetch("https://api.rentalcarmanager.com/v32/api", {
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(params),
  })
    .then((response) => response.text())
    .then((response) => {
      console.log(JSON.parse(response));
    });

  return {
    statusCode: 200,
  };
};
