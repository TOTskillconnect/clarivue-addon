# Clarivue Addon

A comprehensive meeting enhancement addon frontend for Google Meet, Zoom, and Microsoft Teams that provides AI-powered conversation cues, suggested questions, and real-time meeting insights.

## 🚀 Features

- **Multi-Platform Support**: Works with Google Meet, Zoom, and Microsoft Teams
- **Unified Design**: Consistent Clarivue branding and UI across all platforms
- **Smart Questions**: AI-generated questions based on meeting context and participants
- **Conversation Cues**: Real-time suggestions to improve meeting facilitation
- **Tone Analysis**: Live speaker tone indicator with visual feedback
- **Modern UI**: Beautiful Ant Design interface with official Clarivue color system
- **Frontend Focus**: Pure frontend implementation with API-based backend connectivity

## 📁 Project Structure

```
clarivue-addon-app/
├── src/
│   ├── components/           # Reusable AntD-based UI components
│   │   ├── QuestionCard.tsx
│   │   ├── CueCard.tsx
│   │   ├── ToneIndicator.tsx
│   │   ├── SimplifiedSuggestionPanel.tsx  # Unified Questions + Cues only
│   │   └── SidePanelLayout.tsx            # Official Clarivue branding
│   ├── meet/                 # Google Meet implementation (Apps Script)
│   │   ├── Code.gs           # CardService-based UI for Google Meet
│   │   ├── MeetApp.tsx       # React component for Meet
│   │   ├── appsscript.json   # Apps Script manifest
│   │   └── ConversionGuide.md # AntD to CardService conversion guide
│   ├── zoom/                 # Zoom SDK app with unified design
│   │   └── ZoomApp.tsx
│   ├── teams/                # Teams SDK app with unified design  
│   │   └── TeamsApp.tsx
│   ├── utils/                # Utility functions and API helpers
│   ├── App.tsx               # Platform router with Clarivue demo selector
│   └── index.tsx
├── manifest/                 # Platform manifest files
│   ├── teams-manifest.json
│   └── meet-manifest.json
├── public/
│   ├── clarivue-logo-new.png # Official Clarivue logo
│   └── COLOR-DESIGN-SYSTEM.md # Official color guidelines
├── scripts/                  # Setup and build scripts
├── package.json
└── README.md
```

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **UI Framework**: Ant Design 5.x with Clarivue color system
- **Backend**: API-based (to be connected later)
- **Build Tool**: Create React App
- **Platform SDKs**: 
  - Google Meet Apps Script (CardService)
  - Zoom Web SDK (@zoom/appssdk)
  - Microsoft Teams SDK (@microsoft/teams-js)

## 🎨 Unified Design System

### **Official Clarivue Branding:**
- **Logo**: Official `clarivue-logo-new.png` across all platforms
- **Colors**: Full compliance with `COLOR-DESIGN-SYSTEM.md`
  - Primary Blue: `#1076D1` - Main brand color
  - Secondary Purple-Blue: `#5F9DF7` - Secondary elements
  - Gray Scale: Semantic usage from gray.50 to gray.900
  - Status Colors: Success `#38A169`, Warning `#ED8936`, Error `#E53E3E`

### **Consistent UI Structure:**
1. **Header**: Official Clarivue logo + connection status
2. **Tone Indicator**: Circular visualization with brand colors
3. **Tabbed Content**: Questions and Cues only (AI tab removed)

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

4. **View the demo**
   - Visit `http://localhost:3001`
   - Use the platform selector to test all implementations
   - Experience unified Clarivue design across Meet, Zoom, and Teams

## 📦 Platform Implementation

### Google Meet (Apps Script + React)
- **Apps Script**: `src/meet/Code.gs` with Clarivue-branded CardService components
- **React**: `src/meet/MeetApp.tsx` with official logo and colors
- Uses `SimplifiedSuggestionPanel` (Questions + Cues only)

### Zoom (React + Web SDK)
- **Component**: `src/zoom/ZoomApp.tsx`
- Integrates with Zoom Web SDK (@zoom/appssdk)
- Unified Clarivue branding and simplified tabbed interface

### Microsoft Teams (React + Teams SDK)
- **Component**: `src/teams/TeamsApp.tsx`  
- Integrates with Microsoft Teams SDK (@microsoft/teams-js)
- Consistent design with Meet and Zoom implementations

## 🔧 Development

### Component Structure

- **SidePanelLayout**: Unified layout with official Clarivue branding
- **ToneIndicator**: Circular tone visualization with brand colors
- **SimplifiedSuggestionPanel**: Questions and Cues tabs only
- **QuestionCard**: Individual question components
- **CueCard**: Conversation facilitation tips

### Platform Routing

The app uses pathname-based routing in `App.tsx`:
- `/zoom/*` routes → ZoomApp component
- `/teams/*` routes → TeamsApp component  
- `/meet/*` routes → MeetApp component
- Development mode → Platform selector with demo environment

## 🎯 Design Philosophy

- **Consistency First**: Identical user experience across all platforms
- **Brand Compliance**: Official Clarivue visual identity
- **Focused Functionality**: Core features (Questions + Cues) without distractions
- **Accessibility**: WCAG 2.1 AA compliant color combinations
- **Professional Polish**: Enterprise-ready visual presentation

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
- **Cues API**: GET `/api/cues?participants={count}&topic={topic}`
- **Tone Analysis API**: GET `/api/tone/live` with real-time updates
- **Analytics API**: POST `/api/analytics/meeting-events`

Backend implementation will be handled separately via REST APIs.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Follow Clarivue design system guidelines
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@clarivue.com or create an issue in this repository.

## 🔮 Roadmap

- [x] Unified Clarivue branding across all platforms
- [x] Official color design system implementation
- [x] Simplified UI (Questions + Cues focus)
- [x] Real-time tone analysis visualization
- [ ] API backend integration
- [ ] Real-time transcription integration  
- [ ] Advanced AI suggestions via API
- [ ] Meeting analytics dashboard
- [ ] Custom question templates
- [ ] Multi-language support
- [ ] Offline mode support

---

Made with ❤️ by the Clarivue Team 