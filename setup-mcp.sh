#!/bin/bash

# Supabase MCP Setup Script
# This script helps you set up the Supabase MCP server for your project

echo "🚀 Setting up Supabase MCP Server..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js is installed: $(node -v)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "✅ npm is installed: $(npm -v)"

# Test the MCP server installation
echo "🔧 Testing Supabase MCP server installation..."

# Try to install the latest version
npm install -g @supabase/mcp-server-supabase@latest

if [ $? -eq 0 ]; then
    echo "✅ Supabase MCP server installed successfully!"
else
    echo "⚠️  Global installation failed, but local build is available."
fi

echo ""
echo "📋 Next steps:"
echo "1. Create a Personal Access Token (PAT) at: https://supabase.com/dashboard/account/tokens"
echo "2. Replace 'YOUR_PERSONAL_ACCESS_TOKEN_HERE' in mcp-config.json with your actual PAT"
echo "3. Configure your MCP client (Cursor, Claude, etc.) to use the mcp-config.json file"
echo ""
echo "📁 Configuration files created:"
echo "   - mcp-config.json (recommended - uses published version)"
echo "   - mcp-config-local.json (alternative - uses local build)"
echo "   - .env.mcp (environment variables for reference)"
echo ""
echo "🔒 Security recommendations:"
echo "   - Use --read-only flag (already configured)"
echo "   - Use --project-ref flag (already configured)"
echo "   - Don't use in production environments"
echo "   - Always review tool calls before executing"
echo ""
echo "✨ Setup complete! Your Supabase MCP server is ready to use."
