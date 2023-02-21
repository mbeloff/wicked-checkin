const fetch = require("node-fetch");
const convert = require("xml-js");
const headers = {
  // 'Access-Control-Allow-Origin': process.env.VITE_HOST,
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST",
};

exports.handler = async function (event) {
  let body = JSON.parse(event.body);
  var transresponse = body.transresponse;
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
  const json = convert.xml2json(res, { compact: true });

  return {
    statusCode: 200,
    headers,
    body: json,
  };
};
