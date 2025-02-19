#!/bin/bash
export NODE_ENV=production
export API=https://7267-61-216-117-67.ngrok-free.app
export RAG_API=http://localhost:8080
export NEXT_PUBLIC_DOMAIN=http://localhost:3000

node .next/standalone/server.js
