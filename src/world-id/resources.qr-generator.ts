import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import * as nodeCanvas from "canvas";
import QRCodeStyling from "qr-code-styling-node";

// TODO: export that from World ID JS SDK
import svgLogo from "./assets/worldcoin-logo.svg";

const qrCode = new QRCodeStyling({
  // @ts-expect-error -- broken types
  nodeCanvas,
  image: svgLogo,
  width: 190,
  height: 190,
  margin: 3,
  cornersSquareOptions: {
    type: "extra-rounded",
  },
  cornersDotOptions: {
    type: "dot",
  },
  dotsOptions: {
    color: "#000",
    type: "extra-rounded",
  },
  imageOptions: {
    margin: 4,
    hideBackgroundDots: true,
  },
});

/**
 * Lambda function that will be invoked via Function URL and serve a generated
 * QR code image
 *
 * @see {@link https://docs.aws.amazon.com/lambda/latest/dg/urls-invocation.html}
 */
export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const uri = event.queryStringParameters?.uri;
  if (!uri)
    return { statusCode: 400, body: "Missing required query parameter" };

  qrCode.update({ data: uri });
  const buffer = (await qrCode.getRawData("png")) as Buffer;
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": `private,  max-age=${15 * 60}, immutable`,
    },
    body: buffer.toString("base64"),
    isBase64Encoded: true,
  };
};
