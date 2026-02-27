#!/bin/bash
zip -r project.zip . -x ".git/*" "node_modules/*" "bun.lockb" "package-lock.json" ".gitignore"
echo "Created project.zip"
