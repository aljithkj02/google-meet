# Google Meet-like Webinar Application

This project is a Google Meet-like application designed specifically for webinars, where only the host is visible to viewers. It leverages WebRTC for real-time communication, enabling direct browser-to-browser connections without relying on intermediary servers.

## Features
- **Real-Time Communication:** Facilitates low-latency audio, video, and data sharing between users.
- **Host-Only Visibility:** Viewers can only see the host, making it ideal for webinars.
- **Secure Connection:** End-to-end encryption ensures that media and data are securely shared between peers.

## Architecture
The application is built with two primary systems:
1. **Frontend:** Handles the user interface and interaction.
2. **Signaling Server:** A WebSocket server that manages the exchange of offers, answers, and ICE candidates to establish the WebRTC connection.

Once the WebRTC connection is established, users communicate directly through their browsers.

## Getting Started
To explore the code or contribute, you can clone the repository:

```bash
git clone https://github.com/aljithkj02/google-meet.git
