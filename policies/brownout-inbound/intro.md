The brownout policy allows performing scheduled downtime on your API. This can
be useful for helping notify clients of an impending deprecation or for
scheduling maintenance.

This policy uses [cron schedules](https://crontab.guru/) to check if a request
should experience a brownout or not. When a request falls into a scheduled
brownout an error response will be return. The error response can be customized
by setting the `problem` properties.

For more information using brownouts to alert clients on impending API
changes/deprecations see our blog post
[How to version an API](https://zuplo.com/blog/2022/05/17/how-to-version-an-api)
