# Clarivue Addon

A comprehensive meeting enhancement addon frontend for Google Meet, Zoom, and Microsoft Teams that provides AI-powered conversation cues, suggested questions, and real-time meeting insights.

## 🚀 Features

- **Multi-Platform Support**: Works with Google Meet, Zoom, and Microsoft Teams
- **Smart Questions**: AI-generated questions based on meeting context and participants
- **Conversation Cues**: Real-time suggestions to improve meeting facilitation
- **AI Suggestions**: Intelligent recommendations for better meeting outcomes
- **Modern UI**: Beautiful Ant Design interface with responsive design
- **Frontend Focus**: Pure frontend implementation with API-based backend connectivity

## 📁 Project Structure

```
clarivue-addon-app/
├── src/
│   ├── components/           # Reusable AntD-based UI components
│   │   ├── QuestionCard.tsx
│   │   ├── CueCard.tsx
│   │   └── SuggestionPanel.tsx
│   ├── meet/                 # Google Meet implementation (Apps Script)
│   │   ├── Code.gs           # CardService-based UI for Google Meet
│   │   ├── appsscript.json   # Apps Script manifest
│   │   └── ConversionGuide.md # AntD to CardService conversion guide
│   ├── zoom/                 # Zoom SDK app with AntD
│   │   └── ZoomApp.tsx
│   ├── teams/                # Teams SDK app with AntD  
│   │   └── TeamsApp.tsx
│   ├── utils/                # Utility functions and API helpers
│   ├── App.tsx               # Platform router based on URL pathname
│   └── index.tsx
├── manifest/                 # Platform manifest files
│   ├── teams-manifest.json
│   └── meet-manifest.json
├── public/
├── scripts/                  # Setup and build scripts
├── package.json
└── README.md
```

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **UI Framework**: Ant Design 5.x
- **Backend**: API-based (to be connected later)
- **Build Tool**: Create React App
- **Platform SDKs**: 
  - Google Meet Apps Script (CardService)
  - Zoom Web SDK (@zoom/appssdk)
  - Microsoft Teams SDK (@microsoft/teams-js)

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm 8+
- Platform-specific developer accounts (Google, Zoom, Microsoft)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/clarivue-addon.git
   cd clarivue-addon-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

## 📦 Platform Implementation

### Google Meet (Apps Script)
- Uses Google Apps Script CardService for UI rendering
- Implemented in `src/meet/Code.gs` with complete CardService components
- Emulates Ant Design components using CardService widgets
- See `ConversionGuide.md` for AntD to CardService conversion patterns

### Zoom (React + Web SDK)
- React-based UI using Ant Design components
- Integrates with Zoom Web SDK (@zoom/appssdk)
- Supports Zoom's embedded app framework

### Microsoft Teams (React + Teams SDK)
- React-based UI using Ant Design components  
- Integrates with Microsoft Teams SDK (@microsoft/teams-js)
- Uses modern Teams app initialization patterns

## 🔧 Development

### Component Structure

- **QuestionCard**: Displays suggested questions in a clean card format
- **CueCard**: Shows conversation cues and facilitation tips
- **SuggestionPanel**: Tabbed interface with Questions, Suggestions, and Cues sections

### Platform Routing

The app uses pathname-based routing in `App.tsx`:
- `/zoom/*` routes → ZoomApp component
- `/teams/*` routes → TeamsApp component  
- Other paths → "Unsupported platform" message

### API Integration (Future)

The frontend is designed to connect to backend services via API calls:
- Question generation endpoints
- Meeting context analysis
- User preference management
- Real-time suggestion streaming

## 🚀 Deployment

### Google Meet
1. Copy `src/meet/Code.gs` to Google Apps Script project
2. Upload `src/meet/appsscript.json` as manifest
3. Configure Meet addon permissions

### Zoom
1. Build React app: `npm run build`
2. Deploy to web hosting service
3. Configure Zoom app integration settings

### Microsoft Teams
1. Build React app: `npm run build`
2. Package with Teams manifest
3. Deploy to Teams app catalog

## 🔮 Backend Integration (Planned)

The frontend is prepared for API-based backend connectivity:

- **Question API**: GET `/api/questions?context={meeting_context}`
- **Suggestions API**: POST `/api/suggestions` with meeting data
- **Cues API**: GET `/api/cues?participants={count}&topic={topic}`
- **Analytics API**: POST `/api/analytics/meeting-events`

Backend implementation will be handled separately via REST APIs.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@clarivue.com or create an issue in this repository.

## 🔮 Roadmap

- [ ] API backend integration
- [ ] Real-time transcription integration  
- [ ] Advanced AI suggestions via API
- [ ] Meeting analytics dashboard
- [ ] Custom question templates
- [ ] Multi-language support
- [ ] Offline mode support

---

Made with ❤️ by the Clarivue Team 