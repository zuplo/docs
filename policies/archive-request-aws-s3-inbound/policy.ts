import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { ZuploContext, ZuploRequest } from "@zuplo/runtime";

type PolicyOptions = {
  region: string;
  bucketName: string;
  path: string;
  accessKeyId: string;
  accessKeySecret: string;
};
export default async function (
  request: ZuploRequest,
  context: ZuploContext,
  options: PolicyOptions,
  policyName: string,
) {
  // NOTE: policy options should be validated, but to keep the sample short,
  // we are skipping that here.

  // Initialize the S3 client
  const s3Client = new S3Client({
    region: options.region,
    credentials: {
      accessKeyId: options.accessKeyId,
      secretAccessKey: options.accessKeySecret,
    },
  });

  // Create the file
  const file = `${options.path}/${Date.now()}-${crypto.randomUUID()}.req.txt`;

  // because we will read the body, we need to
  // create a clone of this request first, otherwise
  // there may be two attempts to read the body
  // causing a runtime error
  const clone = request.clone();

  // In this example we assume the body could be text, but you could also
  // request the blob() to handle binary data types like images.
  //
  // This example loads the entire body into memory. This is fine for
  // small payloads, but if you have a large payload you should instead
  // save the body via streaming.
  const body = await clone.text();

  // Create the S3 command
  const command = new PutObjectCommand({
    Bucket: options.bucketName,
    Key: file,
    Body: body,
  });

  // Use the S3 client to save the object
  await s3Client.send(command);

  // Continue the request
  return request;
}
