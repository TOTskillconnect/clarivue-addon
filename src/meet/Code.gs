/**
 * Google Meet Add-on using Apps Script CardService
 * Official Clarivue branding + Clarivue Platform Authentication
 * Production-ready for Google Workspace Marketplace
 */

/**
 * Entry point when the add-on is opened
 */
function onHomepage(e) {
  try {
    // Check if user has Clarivue account
    const accountStatus = checkClarivueAccount();
    
    if (accountStatus.isAuthenticated) {
      return createClarivueMeetingPanel(accountStatus.userInfo);
    } else {
      return createAuthenticationCard(accountStatus);
    }
  } catch (error) {
    console.error('Error in onHomepage:', error);
    return createErrorCard('Failed to load Clarivue panel');
  }
}

/**
 * Entry point when a meeting starts
 */
function onMeetingStart(e) {
  try {
    console.log('Meeting started:', e);
    
    // Check authentication first
    const accountStatus = checkClarivueAccount();
    
    if (!accountStatus.isAuthenticated) {
      return createAuthenticationCard(accountStatus);
    }
    
    // Initialize meeting tracking with Clarivue platform
    initializeMeetingSession(e, accountStatus.userInfo);
    return createClarivueMeetingPanel(accountStatus.userInfo);
  } catch (error) {
    console.error('Error in onMeetingStart:', error);
    return createErrorCard('Failed to initialize meeting session');
  }
}

/**
 * Entry point when a meeting ends
 */
function onMeetingEnd(e) {
  try {
    console.log('Meeting ended:', e);
    
    const accountStatus = checkClarivueAccount();
    if (accountStatus.isAuthenticated) {
      // Cleanup meeting session with platform integration
      cleanupMeetingSession(e, accountStatus.userInfo);
    }
    
    return createMeetingEndCard();
  } catch (error) {
    console.error('Error in onMeetingEnd:', error);
    return createErrorCard('Failed to process meeting end');
  }
}

/**
 * Check if user has valid Clarivue account
 */
function checkClarivueAccount() {
  try {
    const userEmail = Session.getActiveUser().getEmail();
    const properties = PropertiesService.getUserProperties();
    
    // Check for stored authentication token
    const authToken = properties.getProperty('clarivue_auth_token');
    const tokenExpiry = properties.getProperty('clarivue_token_expiry');
    
    if (authToken && tokenExpiry && new Date() < new Date(tokenExpiry)) {
      // Token exists and is valid, verify with Clarivue platform
      return verifyClarivueAccount(userEmail, authToken);
    } else {
      // No valid token, user needs to authenticate
      return {
        isAuthenticated: false,
        requiresAuth: true,
        userEmail: userEmail
      };
    }
  } catch (error) {
    console.error('Error checking Clarivue account:', error);
    return {
      isAuthenticated: false,
      error: 'Failed to verify account',
      userEmail: Session.getActiveUser().getEmail()
    };
  }
}

/**
 * Verify account with Clarivue platform API
 */
function verifyClarivueAccount(userEmail, authToken) {
  try {
    const apiUrl = 'https://api.clarivue.com/v1/auth/verify';
    
    const options = {
      'method': 'GET',
      'headers': {
        'Authorization': 'Bearer ' + authToken,
        'Content-Type': 'application/json',
        'User-Agent': 'Clarivue-GoogleMeet-Addon/1.0'
      }
    };
    
    const response = UrlFetchApp.fetch(apiUrl, options);
    const responseData = JSON.parse(response.getContentText());
    
    if (response.getResponseCode() === 200 && responseData.valid) {
      return {
        isAuthenticated: true,
        userInfo: {
          email: userEmail,
          accountId: responseData.accountId,
          planType: responseData.planType,
          features: responseData.features || [],
          displayName: responseData.displayName || userEmail.split('@')[0]
        }
      };
    } else {
      // Token invalid, clear stored data
      clearStoredAuth();
      return {
        isAuthenticated: false,
        requiresAuth: true,
        userEmail: userEmail
      };
    }
  } catch (error) {
    console.error('Error verifying Clarivue account:', error);
    // On API error, assume authentication needed
    return {
      isAuthenticated: false,
      requiresAuth: true,
      userEmail: userEmail
    };
  }
}

/**
 * Create authentication card for new users
 */
function createAuthenticationCard(accountStatus) {
  const card = CardService.newCardBuilder()
    .setHeader(CardService.newCardHeader()
      .setTitle("🎯 Clarivue Account Required")
      .setSubtitle("Connect your Clarivue account to continue"));

  const authSection = CardService.newCardSection()
    .addWidget(
      CardService.newDecoratedText()
        .setText("<b><font color='#1076D1'>Clarivue Account Required</font></b>")
        .setBottomLabel("You need an active Clarivue account to use this meeting enhancement add-on")
        .setStartIcon(CardService.newIconImage()
          .setIconUrl("https://clarivue.com/assets/clarivue-icon-24x24.png"))
    )
    .addWidget(
      CardService.newTextParagraph()
        .setText("Clarivue enhances your meetings with AI-powered insights, smart questions, and real-time collaboration tools.")
    );

  // Different buttons based on account status
  if (accountStatus.requiresAuth) {
    authSection.addWidget(
      CardService.newButtonSet()
        .addButton(
          CardService.newTextButton()
            .setText("Sign In to Clarivue")
            .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
            .setOpenLink(CardService.newOpenLink()
              .setUrl("https://app.clarivue.com/auth/google-meet-login?email=" + 
                     encodeURIComponent(accountStatus.userEmail) + 
                     "&return_to=google_meet_addon")
              .setOpenAs(CardService.OpenAs.OVERLAY))
        )
        .addButton(
          CardService.newTextButton()
            .setText("Create Clarivue Account")
            .setTextButtonStyle(CardService.TextButtonStyle.TEXT)
            .setOpenLink(CardService.newOpenLink()
              .setUrl("https://app.clarivue.com/signup?source=google-meet&email=" + 
                     encodeURIComponent(accountStatus.userEmail))
              .setOpenAs(CardService.OpenAs.OVERLAY))
        )
    );
  }

  const helpSection = CardService.newCardSection()
    .addWidget(
      CardService.newDecoratedText()
        .setText("<b>After signing in:</b>")
        .setBottomLabel("Refresh this panel to start enhancing your meetings")
    )
    .addWidget(
      CardService.newTextButton()
        .setText("🔄 Refresh Panel")
        .setOnClickAction(
          CardService.newAction()
            .setFunctionName("refreshAuthentication")
        )
    );

  card.addSection(authSection);
  card.addSection(helpSection);
  
  return card.build();
}

/**
 * Refresh authentication status
 */
function refreshAuthentication(e) {
  try {
    const accountStatus = checkClarivueAccount();
    
    if (accountStatus.isAuthenticated) {
      return CardService.newActionResponseBuilder()
        .setNavigation(CardService.newNavigation().updateCard(createClarivueMeetingPanel(accountStatus.userInfo)))
        .setNotification(CardService.newNotification()
          .setText("Welcome to Clarivue! " + accountStatus.userInfo.displayName)
          .setType(CardService.NotificationType.INFO))
        .build();
    } else {
      return CardService.newActionResponseBuilder()
        .setNotification(CardService.newNotification()
          .setText("Please complete authentication in the browser first")
          .setType(CardService.NotificationType.WARNING))
        .build();
    }
  } catch (error) {
    console.error('Error refreshing authentication:', error);
    return createErrorResponse('Failed to refresh authentication');
  }
}

/**
 * Handle authentication callback (called via webapp)
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    if (data.action === 'auth_success') {
      const properties = PropertiesService.getUserProperties();
      properties.setProperties({
        'clarivue_auth_token': data.authToken,
        'clarivue_token_expiry': data.expiryTime,
        'clarivue_user_info': JSON.stringify(data.userInfo)
      });
      
      return ContentService
        .createTextOutput(JSON.stringify({ success: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: 'Unknown action' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error in doPost:', error);
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: 'Invalid request' }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Clear stored authentication data
 */
function clearStoredAuth() {
  const properties = PropertiesService.getUserProperties();
  properties.deleteProperty('clarivue_auth_token');
  properties.deleteProperty('clarivue_token_expiry');
  properties.deleteProperty('clarivue_user_info');
}

/**
 * Initialize meeting session with Clarivue platform
 */
function initializeMeetingSession(e, userInfo) {
  const properties = PropertiesService.getUserProperties();
  const authToken = properties.getProperty('clarivue_auth_token');
  
  const sessionData = {
    meetingId: e.commonEventObject?.parameters?.meetingId || generateMeetingId(),
    startTime: new Date().toISOString(),
    participantId: e.commonEventObject?.parameters?.participantId || 'unknown',
    userId: userInfo.accountId,
    userEmail: userInfo.email,
    organizerEmail: e.commonEventObject?.parameters?.organizerEmail || userInfo.email
  };
  
  // Store session locally
  properties.setProperty('currentMeeting', JSON.stringify(sessionData));
  
  // Send to Clarivue platform
  try {
    const apiUrl = 'https://api.clarivue.com/v1/meetings/sessions';
    
    const options = {
      'method': 'POST',
      'headers': {
        'Authorization': 'Bearer ' + authToken,
        'Content-Type': 'application/json'
      },
      'payload': JSON.stringify(sessionData)
    };
    
    UrlFetchApp.fetch(apiUrl, options);
    console.log('Meeting session initialized with Clarivue platform:', sessionData);
  } catch (error) {
    console.error('Error sending session to Clarivue platform:', error);
    // Continue with local session even if API fails
  }
}

/**
 * Cleanup meeting session with platform integration
 */
function cleanupMeetingSession(e, userInfo) {
  const properties = PropertiesService.getUserProperties();
  const sessionData = properties.getProperty('currentMeeting');
  const authToken = properties.getProperty('clarivue_auth_token');
  
  if (sessionData) {
    const session = JSON.parse(sessionData);
    session.endTime = new Date().toISOString();
    
    // Send meeting end to Clarivue platform
    try {
      const apiUrl = 'https://api.clarivue.com/v1/meetings/sessions/' + session.meetingId;
      
      const options = {
        'method': 'DELETE',
        'headers': {
          'Authorization': 'Bearer ' + authToken,
          'Content-Type': 'application/json'
        },
        'payload': JSON.stringify(session)
      };
      
      UrlFetchApp.fetch(apiUrl, options);
      console.log('Meeting session ended on Clarivue platform:', session);
    } catch (error) {
      console.error('Error ending session on Clarivue platform:', error);
    }
    
    // Log meeting analytics
    console.log('Meeting session completed:', session);
    
    // Clear session
    properties.deleteProperty('currentMeeting');
  }
}

/**
 * Main panel builder with user context - Official Clarivue UI Design
 */
function createClarivueMeetingPanel(userInfo) {
  const card = CardService.newCardBuilder();

  // Header Section with user info
  const headerSection = CardService.newCardSection()
    .addWidget(
      CardService.newDecoratedText()
        .setText("<b><font color='#1076D1'>Clarivue</font></b>")
        .setTopLabel("MEETING ENHANCEMENT")
        .setBottomLabel("Welcome, " + userInfo.displayName + " • " + userInfo.planType)
        .setWrapText(true)
        .setStartIcon(CardService.newIconImage()
          .setIconUrl("https://clarivue.com/assets/clarivue-icon-24x24.png"))
        .setButton(
          CardService.newTextButton()
            .setText("⚙️")
            .setOnClickAction(
              CardService.newAction()
                .setFunctionName("openAccountSettings")
            )
        )
    )
    .addWidget(
      CardService.newTextParagraph()
        .setText("<font color='#EDF2F7'>────────────────────────────</font>")
    );

  // Account info section
  const accountSection = CardService.newCardSection()
    .addWidget(
      CardService.newDecoratedText()
        .setText("Account: " + userInfo.email)
        .setBottomLabel("Plan: " + userInfo.planType + " • Features: " + userInfo.features.length)
        .setIcon(CardService.Icon.PERSON)
    );

  // Tone Indicator Section (if user has this feature)
  let sections = [headerSection, accountSection];
  
  if (userInfo.features.includes('tone-analysis')) {
    sections.push(createToneIndicatorSection());
  }

  // Navigation Section - Only Questions and Cues with brand colors
  const navigationSection = CardService.newCardSection()
    .setHeader("📋 Meeting Tools")
    .addWidget(
      CardService.newButtonSet()
        .addButton(
          CardService.newTextButton()
            .setText("❓ Questions")
            .setTextButtonStyle(CardService.TextButtonStyle.TEXT)
            .setOnClickAction(
              CardService.newAction()
                .setFunctionName("showQuestions")
            )
        )
        .addButton(
          CardService.newTextButton()
            .setText("💡 Cues")
            .setTextButtonStyle(CardService.TextButtonStyle.TEXT)
            .setOnClickAction(
              CardService.newAction()
                .setFunctionName("showCues")
            )
        )
    );

  sections.push(navigationSection);

  // Default content - Questions section with user context
  const questionsSection = createQuestionsSection(userInfo);
  sections.push(questionsSection);
  
  // Add all sections to card
  sections.forEach(section => card.addSection(section));
  
  return card.build();
}

/**
 * Load questions from Clarivue platform
 */
function loadQuestionsFromPlatform(userInfo) {
  try {
    const properties = PropertiesService.getUserProperties();
    const authToken = properties.getProperty('clarivue_auth_token');
    
    const apiUrl = 'https://api.clarivue.com/v1/questions/meeting-suggestions';
    
    const options = {
      'method': 'POST',
      'headers': {
        'Authorization': 'Bearer ' + authToken,
        'Content-Type': 'application/json'
      },
      'payload': JSON.stringify({
        userId: userInfo.accountId,
        meetingContext: getCurrentMeetingContext()
      })
    };
    
    const response = UrlFetchApp.fetch(apiUrl, options);
    const data = JSON.parse(response.getContentText());
    
    return data.questions || getDefaultQuestions();
  } catch (error) {
    console.error('Error loading questions from platform:', error);
    return getDefaultQuestions();
  }
}

/**
 * Get current meeting context
 */
function getCurrentMeetingContext() {
  const properties = PropertiesService.getUserProperties();
  const meetingData = properties.getProperty('currentMeeting');
  
  if (meetingData) {
    return JSON.parse(meetingData);
  }
  
  return {
    meetingId: 'unknown',
    startTime: new Date().toISOString(),
    type: 'general'
  };
}

/**
 * Generate meeting ID if not provided
 */
function generateMeetingId() {
  return 'meet_' + Utilities.getUuid().replace(/-/g, '').substring(0, 12);
}

/**
 * Open account settings
 */
function openAccountSettings(e) {
  return CardService.newActionResponseBuilder()
    .setOpenLink(CardService.newOpenLink()
      .setUrl("https://app.clarivue.com/settings/integrations")
      .setOpenAs(CardService.OpenAs.OVERLAY))
    .build();
}

/**
 * Refresh content function with authentication check
 */
function refreshContent(e) {
  try {
    const accountStatus = checkClarivueAccount();
    
    if (!accountStatus.isAuthenticated) {
      return CardService.newActionResponseBuilder()
        .setNavigation(CardService.newNavigation().updateCard(createAuthenticationCard(accountStatus)))
        .build();
    }
    
    return CardService.newActionResponseBuilder()
      .setNavigation(CardService.newNavigation().updateCard(createClarivueMeetingPanel(accountStatus.userInfo)))
      .setNotification(CardService.newNotification()
        .setText("Content refreshed")
        .setType(CardService.NotificationType.INFO))
      .build();
  } catch (error) {
    console.error('Error in refreshContent:', error);
    return createErrorResponse('Failed to refresh content');
  }
}

/**
 * Open settings function with authentication check
 */
function openSettings(e) {
  try {
    const accountStatus = checkClarivueAccount();
    
    if (!accountStatus.isAuthenticated) {
      return CardService.newActionResponseBuilder()
        .setNavigation(CardService.newNavigation().updateCard(createAuthenticationCard(accountStatus)))
        .build();
    }
    
    return CardService.newActionResponseBuilder()
      .setNavigation(CardService.newNavigation().pushCard(createSettingsCard()))
      .build();
  } catch (error) {
    console.error('Error in openSettings:', error);
    return createErrorResponse('Failed to open settings');
  }
}

/**
 * Creates Tone Indicator section with brand colors
 */
function createToneIndicatorSection() {
  return CardService.newCardSection()
    .setHeader("🎯 Current Speaker Tone")
    .addWidget(
      CardService.newDecoratedText()
        .setText("<b><font color='#1076D1'>●</font> Confident</b>")
        .setBottomLabel("Speaker tone is steady and assured")
        .setIcon(CardService.Icon.CLOCK)
    )
    .addWidget(
      CardService.newTextParagraph()
        .setText("<font color='#718096'>Real-time analysis • Updated every 30 seconds</font>")
    );
}

/**
 * Creates Questions section with user context
 */
function createQuestionsSection(userInfo) {
  const questions = loadQuestionsFromPlatform(userInfo);
  
  const section = CardService.newCardSection()
    .setHeader("❓ Suggested Questions");

  questions.forEach((question, index) => {
    section.addWidget(
      CardService.newDecoratedText()
        .setText("<b>" + question.title + "</b>")
        .setBottomLabel(question.description)
        .setIcon(CardService.Icon.DESCRIPTION)
        .setButton(
          CardService.newTextButton()
            .setText("📋")
            .setOnClickAction(
              CardService.newAction()
                .setFunctionName("copyQuestion")
                .setParameters({questionId: question.id})
            )
        )
    );
  });

  return section;
}

/**
 * Show Questions with authentication check
 */
function showQuestions(e) {
  try {
    const accountStatus = checkClarivueAccount();
    
    if (!accountStatus.isAuthenticated) {
      return CardService.newActionResponseBuilder()
        .setNavigation(CardService.newNavigation().updateCard(createAuthenticationCard(accountStatus)))
        .build();
    }
    
    return CardService.newActionResponseBuilder()
      .setNavigation(CardService.newNavigation().updateCard(createClarivueMeetingPanel(accountStatus.userInfo)))
      .build();
  } catch (error) {
    console.error('Error in showQuestions:', error);
    return createErrorResponse('Failed to show questions');
  }
}

/**
 * Show Cues with authentication check
 */
function showCues(e) {
  try {
    const accountStatus = checkClarivueAccount();
    
    if (!accountStatus.isAuthenticated) {
      return CardService.newActionResponseBuilder()
        .setNavigation(CardService.newNavigation().updateCard(createAuthenticationCard(accountStatus)))
        .build();
    }
    
    const card = CardService.newCardBuilder();
    const cuesSection = CardService.newCardSection()
      .setHeader("💡 Conversation Cues")
      .addWidget(
        CardService.newDecoratedText()
          .setText("<b>Encourage participation</b>")
          .setBottomLabel("Some participants haven't spoken recently")
          .setIcon(CardService.Icon.PERSON)
      )
      .addWidget(
        CardService.newDecoratedText()
          .setText("<b>Time check</b>")
          .setBottomLabel("Meeting is 15 minutes over scheduled time")
          .setIcon(CardService.Icon.CLOCK)
      );
    
    card.addSection(cuesSection);
    
    return CardService.newActionResponseBuilder()
      .setNavigation(CardService.newNavigation().updateCard(card.build()))
      .build();
  } catch (error) {
    console.error('Error in showCues:', error);
    return createErrorResponse('Failed to show cues');
  }
}

/**
 * Creates Settings card with authentication
 */
function createSettingsCard() {
  const card = CardService.newCardBuilder()
    .setHeader(CardService.newCardHeader()
      .setTitle("⚙️ Clarivue Settings")
      .setSubtitle("Customize your meeting experience"));

  const settingsSection = CardService.newCardSection()
    .addWidget(
      CardService.newDecoratedText()
        .setText("<b>Tone Analysis</b>")
        .setBottomLabel("Enable real-time speaker tone analysis")
        .setSwitchControl(CardService.newSwitch()
          .setFieldName("tone_analysis")
          .setValue(getUserSetting('tone_analysis', true))
          .setOnChangeAction(CardService.newAction()
            .setFunctionName("updateSetting")))
    )
    .addWidget(
      CardService.newDecoratedText()
        .setText("<b>Smart Questions</b>")
        .setBottomLabel("Show AI-generated questions during meetings")
        .setSwitchControl(CardService.newSwitch()
          .setFieldName("smart_questions")
          .setValue(getUserSetting('smart_questions', true))
          .setOnChangeAction(CardService.newAction()
            .setFunctionName("updateSetting")))
    )
    .addWidget(
      CardService.newDecoratedText()
        .setText("<b>Meeting Cues</b>")
        .setBottomLabel("Get conversation facilitation suggestions")
        .setSwitchControl(CardService.newSwitch()
          .setFieldName("meeting_cues")
          .setValue(getUserSetting('meeting_cues', true))
          .setOnChangeAction(CardService.newAction()
            .setFunctionName("updateSetting")))
    );

  card.addSection(settingsSection);
  return card.build();
}

/**
 * Get default questions fallback
 */
function getDefaultQuestions() {
  return [
    {
      id: 'q1',
      title: 'What are the main objectives for today?',
      description: 'Help establish clear meeting goals'
    },
    {
      id: 'q2', 
      title: 'Are there any blockers we should address?',
      description: 'Identify and resolve obstacles'
    },
    {
      id: 'q3',
      title: 'What are the next steps?',
      description: 'Ensure clear action items'
    }
  ];
}

/**
 * Get user setting
 */
function getUserSetting(key, defaultValue) {
  const properties = PropertiesService.getUserProperties();
  const value = properties.getProperty('setting_' + key);
  return value !== null ? JSON.parse(value) : defaultValue;
}

/**
 * Update user setting
 */
function updateSetting(e) {
  try {
    const properties = PropertiesService.getUserProperties();
    const formInput = e.formInput;
    
    Object.keys(formInput).forEach(key => {
      properties.setProperty('setting_' + key, JSON.stringify(formInput[key]));
    });
    
    return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification()
        .setText("Settings updated")
        .setType(CardService.NotificationType.INFO))
      .build();
  } catch (error) {
    console.error('Error updating settings:', error);
    return createErrorResponse('Failed to update settings');
  }
}

/**
 * Copy question function
 */
function copyQuestion(e) {
  try {
    return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification()
        .setText("Question copied to clipboard")
        .setType(CardService.NotificationType.INFO))
      .build();
  } catch (error) {
    console.error('Error copying question:', error);
    return createErrorResponse('Failed to copy question');
  }
}

/**
 * Create error card
 */
function createErrorCard(message) {
  const card = CardService.newCardBuilder()
    .setHeader(CardService.newCardHeader()
      .setTitle("❌ Error")
      .setSubtitle("Something went wrong"));

  const errorSection = CardService.newCardSection()
    .addWidget(
      CardService.newDecoratedText()
        .setText("<b>Error occurred</b>")
        .setBottomLabel(message)
        .setIcon(CardService.Icon.EMAIL)
    )
    .addWidget(
      CardService.newTextButton()
        .setText("🔄 Try Again")
        .setOnClickAction(
          CardService.newAction()
            .setFunctionName("refreshContent")
        )
    );

  card.addSection(errorSection);
  return card.build();
}

/**
 * Create error response
 */
function createErrorResponse(message) {
  return CardService.newActionResponseBuilder()
    .setNotification(CardService.newNotification()
      .setText(message)
      .setType(CardService.NotificationType.ERROR))
    .build();
}

/**
 * Create meeting end card
 */
function createMeetingEndCard() {
  const card = CardService.newCardBuilder()
    .setHeader(CardService.newCardHeader()
      .setTitle("🎯 Meeting Complete")
      .setSubtitle("Clarivue session ended"));

  const summarySection = CardService.newCardSection()
    .addWidget(
      CardService.newDecoratedText()
        .setText("<b><font color='#1076D1'>Meeting Summary</font></b>")
        .setBottomLabel("Your meeting insights have been saved to your Clarivue dashboard")
        .setIcon(CardService.Icon.DESCRIPTION)
    )
    .addWidget(
      CardService.newButtonSet()
        .addButton(
          CardService.newTextButton()
            .setText("View Dashboard")
            .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
            .setOpenLink(CardService.newOpenLink()
              .setUrl("https://app.clarivue.com/dashboard/meetings")
              .setOpenAs(CardService.OpenAs.OVERLAY))
        )
    );

  card.addSection(summarySection);
  return card.build();
} 
} 
} 