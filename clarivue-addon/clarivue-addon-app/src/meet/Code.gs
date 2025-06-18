/**
 * Google Meet Add-on using Apps Script CardService
 * Emulates AntD components and styling using CardService widgets
 */

/**
 * Entry point when the add-on is opened
 */
function onHomepage(e) {
  return createMeetingAssistantCard();
}

/**
 * Entry point when a meeting starts
 */
function onMeetingStart(e) {
  return createMeetingAssistantCard();
}

/**
 * Main card builder - emulates SuggestionPanel with Tabs
 */
function createMeetingAssistantCard() {
  const card = CardService.newCardBuilder()
    .setHeader(
      CardService.newCardHeader()
        .setTitle("🎯 Live Meeting Assistant")
        .setSubtitle("AI-powered meeting enhancement")
        .setImageUrl("https://fonts.gstatic.com/s/i/materialicons/lightbulb/v6/24px.svg")
        .setImageStyle(CardService.ImageStyle.CIRCLE)
    );

  // Add navigation buttons (emulating tabs)
  const navigationSection = CardService.newCardSection()
    .setHeader("📋 Choose Section")
    .addWidget(
      CardService.newButtonSet()
        .addButton(
          CardService.newTextButton()
            .setText("❓ Questions")
            .setOnClickAction(
              CardService.newAction()
                .setFunctionName("showQuestions")
            )
        )
        .addButton(
          CardService.newTextButton()
            .setText("💡 Cues")
            .setOnClickAction(
              CardService.newAction()
                .setFunctionName("showCues")
            )
        )
        .addButton(
          CardService.newTextButton()
            .setText("🤖 AI Tips")
            .setOnClickAction(
              CardService.newAction()
                .setFunctionName("showSuggestions")
            )
        )
    );

  // Default content - Questions section (emulating QuestionCard components)
  const questionsSection = createQuestionsSection();
  
  card.addSection(navigationSection);
  card.addSection(questionsSection);
  
  return card.build();
}

/**
 * Creates Questions section - emulates QuestionCard components
 */
function createQuestionsSection() {
  const section = CardService.newCardSection()
    .setHeader("❓ Suggested Questions")
    .setCollapsible(false);

  // Question cards (emulating AntD Card components)
  const questions = [
    {
      text: "What are the main challenges we're facing?",
      category: "Strategy",
      icon: "💼"
    },
    {
      text: "How can we improve team collaboration?", 
      category: "Team Building",
      icon: "🤝"
    },
    {
      text: "What's our timeline for the next phase?",
      category: "Planning", 
      icon: "📅"
    }
  ];

  questions.forEach((question, index) => {
    // Emulate Card component with decorated text
    const questionWidget = CardService.newDecoratedText()
      .setText(`<b>${question.text}</b>`)
      .setBottomLabel(`${question.icon} ${question.category}`)
      .setWrapText(true)
      .setButton(
        CardService.newTextButton()
          .setText("Use Question")
          .setOnClickAction(
            CardService.newAction()
              .setFunctionName("useQuestion")
              .setParameters({
                "question": question.text,
                "index": index.toString()
              })
          )
      );
    
    section.addWidget(questionWidget);
    
    // Add divider between cards (emulating card spacing)
    if (index < questions.length - 1) {
      section.addWidget(
        CardService.newTextParagraph()
          .setText("<font color='#e8e8e8'>────────────────────</font>")
      );
    }
  });

  return section;
}

/**
 * Creates Cues section - emulates CueCard components
 */
function createCuesSection() {
  const section = CardService.newCardSection()
    .setHeader("💡 Conversation Cues")
    .setCollapsible(false);

  const cues = [
    {
      title: "Active Listening",
      content: "Focus on understanding before responding. Ask clarifying questions to ensure you've grasped their point correctly.",
      icon: "👂"
    },
    {
      title: "Time Management", 
      content: "Keep discussions on track and respect meeting time limits. Gently guide conversations back to the agenda.",
      icon: "⏰"
    },
    {
      title: "Encourage Participation",
      content: "Invite quieter team members to share their thoughts. Use phrases like 'What do you think?' to engage everyone.",
      icon: "🗣️"
    }
  ];

  cues.forEach((cue, index) => {
    // Emulate CueCard component
    const cueWidget = CardService.newDecoratedText()
      .setText(`<b>${cue.icon} ${cue.title}</b>`)
      .setBottomLabel(cue.content)
      .setWrapText(true)
      .setButton(
        CardService.newTextButton()
          .setText("Apply Cue")
          .setOnClickAction(
            CardService.newAction()
              .setFunctionName("applyCue")
              .setParameters({
                "title": cue.title,
                "content": cue.content
              })
          )
      );
    
    section.addWidget(cueWidget);
    
    // Add spacing
    if (index < cues.length - 1) {
      section.addWidget(
        CardService.newTextParagraph()
          .setText("<font color='#e8e8e8'>────────────────────</font>")
      );
    }
  });

  return section;
}

/**
 * Creates AI Suggestions section
 */
function createSuggestionsSection() {
  const section = CardService.newCardSection()
    .setHeader("🤖 AI-Powered Suggestions")
    .setCollapsible(false);

  // Placeholder for AI suggestions
  const loadingWidget = CardService.newTextParagraph()
    .setText("<font color='#666'>🔄 Analyzing meeting context...</font>");
  
  const comingSoonWidget = CardService.newTextParagraph()
    .setText("<b>🚀 AI suggestions coming soon!</b><br><br>Features will include:<br>• Real-time conversation analysis<br>• Smart meeting insights<br>• Automated action items");

  section.addWidget(loadingWidget);
  section.addWidget(comingSoonWidget);

  return section;
}

/**
 * Action handlers
 */

function showQuestions(e) {
  const card = CardService.newCardBuilder()
    .setHeader(
      CardService.newCardHeader()
        .setTitle("❓ Questions")
        .setSubtitle("Suggested discussion topics")
    )
    .addSection(createQuestionsSection())
    .addSection(createBackButton());
  
  return CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation().updateCard(card.build()))
    .build();
}

function showCues(e) {
  const card = CardService.newCardBuilder()
    .setHeader(
      CardService.newCardHeader()
        .setTitle("💡 Conversation Cues") 
        .setSubtitle("Meeting facilitation tips")
    )
    .addSection(createCuesSection())
    .addSection(createBackButton());
  
  return CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation().updateCard(card.build()))
    .build();
}

function showSuggestions(e) {
  const card = CardService.newCardBuilder()
    .setHeader(
      CardService.newCardHeader()
        .setTitle("🤖 AI Suggestions")
        .setSubtitle("Smart meeting insights")
    )
    .addSection(createSuggestionsSection())
    .addSection(createBackButton());
  
  return CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation().updateCard(card.build()))
    .build();
}

function createBackButton() {
  return CardService.newCardSection()
    .addWidget(
      CardService.newTextButton()
        .setText("← Back to Main")
        .setOnClickAction(
          CardService.newAction()
            .setFunctionName("goHome")
        )
    );
}

function goHome(e) {
  return CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation().updateCard(createMeetingAssistantCard()))
    .build();
}

function useQuestion(e) {
  const question = e.parameters.question;
  
  // You can integrate with Google Meet chat or other features here
  console.log('Using question:', question);
  
  const notification = CardService.newNotification()
    .setText(`✅ Question ready: "${question}"`)
    .setType(CardService.NotificationType.INFO);
  
  return CardService.newActionResponseBuilder()
    .setNotification(notification)
    .build();
}

function applyCue(e) {
  const title = e.parameters.title;
  const content = e.parameters.content;
  
  console.log('Applying cue:', title, content);
  
  const notification = CardService.newNotification()
    .setText(`💡 Applied: ${title}`)
    .setType(CardService.NotificationType.INFO);
  
  return CardService.newActionResponseBuilder()
    .setNotification(notification)
    .build();
}

/**
 * Utility functions for Google Meet integration
 */

function getMeetingInfo() {
  // This would typically get meeting context from Google Meet
  return {
    title: "Team Standup",
    participants: ["Alice", "Bob", "Charlie"],
    duration: "30 min"
  };
}

function sendMessageToChat(message) {
  // Integration with Google Meet chat would go here
  console.log('Sending to chat:', message);
}

function getParticipants() {
  // Get current meeting participants
  return ["User 1", "User 2", "User 3"];
} 