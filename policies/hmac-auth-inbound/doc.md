## Signing a Value

The example below demonstrates how you could sign a value in order to create an
HMAC signature for use with this policy.

```ts
const token = await sign("my data", environment.MY_SECRET);

async function sign(
  key: string | ArrayBuffer,
  val: string
): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    typeof key === "string" ? encoder.encode(key) : key,
    { name: "HMAC", hash: { name: "SHA-256" } },
    false,
    ["sign"]
  );
  const token = await crypto.subtle.sign(
    "HMAC",
    cryptoKey,
    encoder.encode(val)
  );
  return Array.prototype.map
    .call(new Uint8Array(token), (x) => ("0" + x.toString(16)).slice(-2))
    .join("");
}
```
