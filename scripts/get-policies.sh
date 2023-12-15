rm -rf temp
curl https://cdn.zuplo.com/policies/runtime.zip -o runtime.zip
curl https://cdn.zuplo.com/policies/graphql.zip -o graphql.zip
unzip -q graphql.zip -d temp 
unzip -q runtime.zip -d temp 
rm graphql.zip
rm runtime.zip