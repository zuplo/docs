rm -rf temp
RANDOM=$(curl https://uuid.new)
curl https://cdn.zuplo.com/policies/runtime.zip?$RANDOM -o runtime.zip
curl https://cdn.zuplo.com/policies/graphql.zip?$RANDOM  -o graphql.zip
unzip -q -o graphql.zip -d policies 
unzip -q -o runtime.zip -d policies 
rm graphql.zip
rm runtime.zip