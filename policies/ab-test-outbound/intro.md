This example shows how to perform an action on incoming requests based on the
result of a randomly generated number. A/B tests could also be performed on
properties such as the `request.user`.

A/B tests can also be combined with other policies by passing data to downstream
policies. For example, you could set `context.custom.myProperty` based on the
results of the A/B test and use that value in a later policy to modify the
request.
