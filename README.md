# KeyStream-Gemini

KeyStream-Gemini is a high-performance reverse proxy designed to optimize Google Gemini API usage through intelligent key rotation and real-time monitoring. It ensures high availability and bypasses rate limits by dynamically managing a pool of API keys.
<img width="2534" height="1299" alt="58b66edb-f990-45f2-b895-52d8953cac59" src="https://github.com/user-attachments/assets/b4262ecd-47b1-4357-9183-8eac19659c55" />

## Core Features

- **Dynamic Key Rotation**: Automatically cycles through API keys to maintain continuous service availability.
- **Real-time Observability**: Web-based dashboard featuring traffic metrics, key health status, and backend logs.
- **Model Synchronization**: Automated discovery and update of available Gemini models via Google API.
- **Native Streaming Support**: Optimized handling of Server-Sent Events (SSE) for fluid AI interactions.
- **OpenAI Compatibility**: Standardized interface for seamless integration with tools like Continue.dev.

## 📺 Video Tutorial & Demo
<div align="center">
  <a href="https://www.youtube.com/watch?v=C7CeLLUwUDg">
    <img src="https://i.postimg.cc/RhdzH2sF/image-(1).png" alt="Watch Setup Guide" width="100%" style="max-width: 600px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
  </a>
  <p><i>See how to bypass rate limits and integrate with Unity in 5 minutes.</i></p>
</div>

## Installation

### Prerequisites

- Node.js 18 or higher
- npm or Yarn
- Google Gemini API Keys

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/billtruong003/KeyStream-Gemini.git
   cd KeyStream-Gemini
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Initialize the key store**
   Create a `keys.json` file in the root directory:
   - macOS/Linux: `echo "[]" > keys.json`
   - Windows: `Set-Content -Path ".\keys.json" -Value "[]"`

4. **Start the server**
   ```bash
   npm start
   ```
   The gateway will be accessible at `http://localhost:13337`.


## Integration

KeyStream-Gemini provides an OpenAI-compatible endpoint. To integrate with your AI tools, use the following configuration:

- **Base URL**: `http://localhost:13337/v1`
- **API Key**: `sk-keystream` (The proxy handles actual authentication)

### Example Configuration (Continue.dev)

```yaml
models:
  - name: "⚡ gemini-3-pro-preview"
    model: "gemini-3-pro-preview"
    provider: openai
    apiBase: "http://localhost:13337/v1"
    apiKey: "sk-local-proxy"
    contextLength: 128000
```

## Development

To run the server in development mode with auto-reload:

```bash
npm install -g nodemon
nodemon server.js
```

## License

Distributed under the MIT License.

## Frequently Asked Questions (FAQ)

**1. Why should I use KeyStream-Gemini instead of Cursor Pro or other proxy tools?**
* **Plug-and-Play:** This is a "5-minute setup" solution. While other tools might require complex Terminal configurations or DevOps knowledge, KeyStream-Gemini is designed for developers who want to focus on coding (like Game Devs or Web Devs) rather than environment troubleshooting. Just `npm install/start` and you're good to go.
* **Total Control:** This is a **Local Proxy**. Your keys and data stay on your machine. You aren't dependent on any third-party middleman servers that might go down or lag.
* **Stability:** If an error occurs, you can see exactly why in your own logs and fix it instantly.

**2. How does this handle Google's strict Rate Limits (Quota)?**
* The core of this tool is **Intelligent Key Rotation**. 
* **Pro Tip:** By setting up a few "clone" accounts and enabling the Google Cloud Billing (to claim the $300 Free Trial), you can bypass the standard free tier limits. With a pool of 5-10 "Billing-enabled" keys, you will have thousands of requests per day—more than enough to build complex features all day long without hitting a wall.

**3. Is my data secure?**
* **100% Secure.** Since the proxy runs locally on your hardware, your API keys (stored in `keys.json`) and your source code never leave your environment. Data is sent directly from your machine to Google’s official APIs.

**4. Can I use this with other AI tools besides Continue.dev?**
* Yes! Because KeyStream-Gemini provides an **OpenAI-compatible endpoint**, you can use it with any tool that allows a custom `apiBase` or `baseURL`, including VS Code extensions, CLI tools, or even your own custom Python/Node.js scripts.

**5. Why did you build this instead of using existing open-source proxies?**
* I built this for myself first. I tried several complex open-source proxies, but they often took hours to set up, crashed unexpectedly, or were too "heavy" for simple local use. I wanted something lightweight that I could fix myself if it broke. I shared it because my friends found it useful, and I hope you do too!

---
*If you have ideas for new features or "underground" tips for optimizing Gemini usage, feel free to open an Issue or a Pull Request!*
