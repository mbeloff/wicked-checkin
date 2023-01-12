const fetch = require("node-fetch");
const convert = require("xml-js");
const headers = {
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST",
};

exports.handler = async function (event) {
  let body = JSON.parse(event.body);
  var pxpayuser = process.env.PXPAY_USER;
  var pxpaykey = process.env.PXPAY_KEY;
  var currency = body.currency;
  var amount = body.amount;
  var transType = body.transtype;
  var ref = body.resref;
  var returnURL = body.baseurl + "/checkpayment?ref=" + ref;
  var callback = "https://InsertValidUrlForCallback";
  var callback =
    "https://checkin.wickedcampers.com.au/.netlify/functions/windcavecallback?resref=" +
    ref;

  var raw =
    "<GenerateRequest>\r\n<PxPayUserId>" +
    pxpayuser +
    "</PxPayUserId>\r\n<PxPayKey>" +
    pxpaykey +
    "</PxPayKey>\r\n<TxnType>" +
    transType +
    "</TxnType>\r\n<EnableAddBillCard>1</EnableAddBillCard>\r\n<RecurringMode>unscheduledcredentialonfileinitial</RecurringMode>\r\n<AmountInput>" +
    amount +
    "</AmountInput>\r\n<CurrencyInput>" +
    currency +
    "</CurrencyInput>\r\n<MerchantReference>" +
    ref +
    "</MerchantReference>\r\n<UrlSuccess>" +
    returnURL +
    "</UrlSuccess>\r\n<UrlFail>" +
    returnURL +
    "</UrlFail>\r\n<UrlCallback>" +
    callback +
    "</UrlCallback>\r\n</GenerateRequest>";

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
