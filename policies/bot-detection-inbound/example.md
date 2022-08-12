```json
{
  "export": "BotDetectionInbound",
  "module": "$import(@zuplo/runtime)",
  "options": {
    "blockScoresBelow": 40
  }
}
```

Detect known and suspected bots based on sophisticated traffic analysis. The option `blockScoresBelow` can be used to automatically block any bots with a score below that number.
