rm -rf temp
if [[ -z "${LOCAL_POLICIES_ROOT_DIR}" ]]; then
  curl https://cdn.zuplo.com/policies/runtime/policies.zip -o runtime.zip
  curl https://cdn.zuplo.com/policies/graphql/policies.zip -o graphql.zip
else
  cp $LOCAL_POLICIES_ROOT_DIR/packages/runtime/policies.zip runtime.zip
  cp $LOCAL_POLICIES_ROOT_DIR/packages/graphql/policies.zip graphql.zip
fi
unzip -q graphql.zip -d temp 
unzip -q runtime.zip -d temp 
rm graphql.zip
rm runtime.zip