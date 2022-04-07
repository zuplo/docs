#!/bin/bash
ln -s $PWD/../docs/media $PWD/public/media

npm run reference:ci

echo "Local setup complete"