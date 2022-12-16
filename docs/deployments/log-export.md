---
title: Log Export
---

:::note

The log export option is available only to customers on a Zuplo enterprise plan. For more information contact [sales@zuplo.com](mailto:sales@zuplo.com).

:::

In addition to viewing logs in the the portal, it may be useful to have logs pushed to you so that they can be used in your monitoring, alerting, and troubleshooting processes.

Zuplo supports pushing logs to the following sources:

- AWS S3
- Azure Blob Storage
- Google Cloud Storage
- Cloudflare R2

Logs are batched and sent withing one minute (not guaranteed, but generally less than one minute). Batches will typically contain no more than 10,000 records, but depending on volume of your API a batch could have up to 100,000 records.

Logs are send as compressed gzip files. Each gzip file has a single text file with each log line containing a log entry serialized as JSON. For example a single file would look like the below.

```
{"ClientIP":"2a16:95c0:3300::103","ClientRequestHost":"api.example.com","ClientRequestMethod":"PO...}
{"ClientIP":"35.243.129.13","ClientRequestHost":"api.example.com","ClientRequestMethod":"GET","Cl...}
{"ClientIP":"11.156.176.11","ClientRequestHost":"api.zuplo.com","ClientRequestMethod":"GET","Clie...}
{"ClientIP":"35.159.80.14","ClientRequestHost":"api.example.com","ClientRequestMethod":"GET","Cli...}
{"ClientIP":"2a06:18c0:3200::103","ClientRequestHost":"api.example.com","ClientRequestMethod":"PO...}
{"ClientIP":"171.105.191.118","ClientRequestHost":"api.example.com","ClientRequestMethod":"GET","...}
{"ClientIP":"171.105.191.118","ClientRequestHost":"zuplo.com","ClientRequestMethod":"GET","Client...}
{"ClientIP":"104.187.31.241","ClientRequestHost":"tenant-api.zuplo.com","ClientRequestMethod":"GE...}
{"ClientIP":"2a06:92c0:3300::103","ClientRequestHost":"api.example.com","ClientRequestMethod":"PO...}
{"ClientIP":"35.192.218.61","ClientRequestHost":"api.example.com","ClientRequestMethod":"GET","Cl...}
{"ClientIP":"2a01:98c0:3300::103","ClientRequestHost":"api.example.com","ClientRequestMethod":"PO...}
{"ClientIP":"35.228.4.7","ClientRequestHost":"api.zuplo.com","ClientRequestMethod":"GET","ClientR...}
{"ClientIP":"185.135.171.21","ClientRequestHost":"api.example.com","ClientRequestMethod":"GET","C...}
{"ClientIP":"35.221.12.249","ClientRequestHost":"api.example.com","ClientRequestMethod":"GET","Cl...}
{"ClientIP":"35.199.23.186","ClientRequestHost":"api.example.com","ClientRequestMethod":"GET","Cl...}
```

To send the logs into the system of your choice, run a job on either a schedule or based on events from your storage provider.

In order to activate log export for your account, contact your support.

You will need to provide us with the following information:

1. The credentials to your storage account - typically something like an access key and secret.
2. The url of the storage account

Note, the storage account that you provide to us only needs permission to write files. We don't need to list or delete buckets or objects. If you would like to clean up objects, we recommend doing that after you ingest the logs or through expiration policies on the storage bucket itself.
