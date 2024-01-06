rm -rf temp
RANDOM=$(curl https://uuid.new)
curl https://cdn.zuplo.com/policies/runtime/policies.zip -o runtime.zip
curl https://cdn.zuplo.com/policies/graphql/policies.zip -o graphql.zip
unzip -q graphql.zip -d temp 
unzip -q runtime.zip -d temp 
rm graphql.zip
rm runtime.zip