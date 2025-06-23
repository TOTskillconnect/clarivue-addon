# 🚀 Google Meet Add-on Publishing Guide

Complete guide to publish Clarivue Meeting Enhancement add-on to Google Workspace Marketplace.

## 📋 Prerequisites

### 1. Google Cloud Project Setup
- [ ] **Google Cloud Project** with billing enabled
- [ ] **Google Workspace Marketplace SDK** enabled
- [ ] **Google Apps Script API** enabled
- [ ] **Meet Add-ons API** enabled

### 2. Required Assets
- [ ] **Logo Files**:
  - 128x128px PNG for Marketplace listing
  - 64x64px PNG for add-on header (`clarivue-logo-64x64.png`)
  - 24x24px PNG for inline icons (`clarivue-icon-24x24.png`)
- [ ] **Screenshots**: 5-8 high-quality screenshots showing add-on in action
- [ ] **Privacy Policy** URL (required)
- [ ] **Terms of Service** URL (required)

## 📁 Required Files Structure

```
clarivue-meet-addon/
├── src/meet/
│   ├── Code.gs                    # ✅ Production-ready Apps Script
│   └── appsscript.json           # ✅ Updated manifest
├── publishing/
│   ├── privacy-policy.md         # 📝 Required
│   ├── terms-of-service.md       # 📝 Required
│   ├── marketplace-listing.md    # 📝 Required
│   └── assets/
│       ├── clarivue-logo-128.png # 📝 Required
│       ├── clarivue-logo-64.png  # 📝 Required
│       ├── clarivue-icon-24.png  # 📝 Required
│       └── screenshots/          # 📝 Required (5-8 images)
└── GOOGLE_MEET_PUBLISHING_GUIDE.md
```

## 🔧 Step-by-Step Publishing Process

### Step 1: Google Apps Script Project Setup

1. **Create Apps Script Project**:
   ```bash
   # Navigate to: https://script.google.com
   # Create new project: "Clarivue Meeting Enhancement"
   ```

2. **Copy Production Code**:
   - Copy content from `src/meet/Code.gs` to Apps Script editor
   - Copy content from `src/meet/appsscript.json` to manifest

3. **Deploy as Add-on**:
   ```bash
   # In Apps Script:
   # Deploy > New Deployment > Type: Add-on
   # Description: "Clarivue Meeting Enhancement v1.0"
   ```

### Step 2: Google Cloud Console Configuration

1. **Enable Required APIs**:
   ```bash
   # Enable in Google Cloud Console:
   # - Google Workspace Marketplace SDK
   # - Google Apps Script API
   # - Google Meet Add-ons API (if available)
   ```

2. **OAuth Consent Screen**:
   - **App name**: "Clarivue - Meeting Enhancement"
   - **User support email**: support@clarivue.com
   - **Logo**: Upload 120x120px Clarivue logo
   - **App domain**: clarivue.com
   - **Privacy policy**: https://clarivue.com/privacy
   - **Terms of service**: https://clarivue.com/terms

3. **OAuth Scopes** (Required):
   ```
   https://www.googleapis.com/auth/script.external_request
   https://www.googleapis.com/auth/script.storage
   https://www.googleapis.com/auth/userinfo.email
   ```

### Step 3: Google Workspace Marketplace Listing

1. **Navigate to Marketplace SDK**:
   ```
   https://console.cloud.google.com/apis/library/marketplace.googleapis.com
   ```

2. **Create App Configuration**:
   - **App name**: "Clarivue - Meeting Enhancement"
   - **Short description**: "AI-powered meeting assistant with smart questions, conversation cues, and real-time tone analysis"
   - **Long description**: See `marketplace-listing.md`
   - **Category**: "Productivity"
   - **Pricing**: Free (or your pricing model)

3. **Add-on Configuration**:
   - **Add-on type**: "Google Meet Add-on"
   - **Apps Script project ID**: [Your project ID]
   - **Apps Script deployment ID**: [Your deployment ID]

### Step 4: Asset Upload

1. **Required Images**:
   - **App icon**: 128x128px PNG (clarivue-logo-128.png)
   - **Screenshots**: 1280x800px PNG (5-8 images showing functionality)
   - **Promotional images**: Various sizes for marketing

2. **Documentation**:
   - **Privacy policy**: Must be publicly accessible
   - **Terms of service**: Must be publicly accessible
   - **Support documentation**: Help articles and FAQs

### Step 5: Testing & Verification

1. **Domain Verification**:
   ```bash
   # Verify ownership of clarivue.com domain
   # Add DNS TXT record or upload HTML file
   ```

2. **OAuth Verification**:
   - Submit for OAuth verification (if using sensitive scopes)
   - Provide security assessment documentation
   - Demonstrate principle of least privilege

3. **Functional Testing**:
   - Test all add-on functions in Google Meet
   - Verify error handling and edge cases
   - Test with different user permissions

## 📋 Marketplace Review Requirements

### Technical Requirements
- [ ] **Functional**: All features work as described
- [ ] **Error Handling**: Graceful error messages and recovery
- [ ] **Performance**: Fast loading and responsive UI
- [ ] **Security**: Proper OAuth implementation and data handling

### Content Requirements
- [ ] **Clear Description**: Accurate feature descriptions
- [ ] **Screenshots**: Current and representative images
- [ ] **Privacy Policy**: Compliant with Google policies
- [ ] **Support Info**: Valid contact information

### Policy Compliance
- [ ] **Data Usage**: Clear explanation of data collection/use
- [ ] **Permissions**: Request only necessary permissions
- [ ] **Content Policy**: Follow Google Workspace Marketplace policies
- [ ] **User Experience**: Intuitive and professional interface

## 🔒 Security & Privacy Considerations

### Data Handling
```javascript
// Example: Secure data storage
function storeUserSetting(key, value) {
  const properties = PropertiesService.getUserProperties();
  // Only store necessary data
  // Encrypt sensitive information
  properties.setProperty(key, JSON.stringify(value));
}
```

### API Calls
```javascript
// Example: Secure external API calls
function callClarivueAPI(endpoint, data) {
  const url = 'https://api.clarivue.com/v1/' + endpoint;
  
  const options = {
    'method': 'POST',
    'headers': {
      'Authorization': 'Bearer ' + getAPIKey(),
      'Content-Type': 'application/json'
    },
    'payload': JSON.stringify(data)
  };
  
  return UrlFetchApp.fetch(url, options);
}
```

## 📈 Publishing Timeline

| Phase | Duration | Tasks |
|-------|----------|-------|
| **Preparation** | 1-2 weeks | Asset creation, documentation |
| **Development** | Complete | Production-ready code ✅ |
| **Testing** | 1 week | Internal testing and QA |
| **Submission** | 1 day | Marketplace submission |
| **Review** | 2-4 weeks | Google review process |
| **Launch** | 1 day | Public availability |

## 🎯 Pre-Launch Checklist

### Technical
- [ ] Apps Script deployment tested and working
- [ ] All manifest permissions justified and minimal
- [ ] Error handling implemented for all functions
- [ ] Performance optimized (< 30s execution time)
- [ ] Security review completed

### Legal & Compliance
- [ ] Privacy policy published and compliant
- [ ] Terms of service published and compliant
- [ ] Data processing agreements in place
- [ ] GDPR compliance (if applicable)
- [ ] OAuth consent screen approved

### Marketing Assets
- [ ] High-quality screenshots (1280x800px)
- [ ] App icon in multiple sizes
- [ ] Compelling app description
- [ ] Feature highlight videos (optional)
- [ ] Support documentation ready

### Business
- [ ] Pricing strategy defined
- [ ] Support processes established
- [ ] Analytics/monitoring set up
- [ ] Launch communication plan
- [ ] User onboarding flow tested

## 🚨 Common Rejection Reasons & Solutions

### 1. **Insufficient Permissions Justification**
- **Issue**: Requesting unnecessary OAuth scopes
- **Solution**: Use minimal permissions, document each scope usage

### 2. **Poor User Experience**
- **Issue**: Confusing UI or broken functionality
- **Solution**: Comprehensive testing, clear error messages

### 3. **Privacy Policy Issues**
- **Issue**: Missing or non-compliant privacy policy
- **Solution**: Lawyer-reviewed privacy policy, clear data usage

### 4. **Misleading Descriptions**
- **Issue**: Features described but not implemented
- **Solution**: Accurate feature descriptions, current screenshots

## 📞 Support & Resources

- **Google Workspace Marketplace Developer Guide**: [Link](https://developers.google.com/workspace/marketplace)
- **Apps Script Documentation**: [Link](https://developers.google.com/apps-script)
- **Google Meet Add-ons Documentation**: [Link](https://developers.google.com/meet/add-ons)
- **OAuth Verification Process**: [Link](https://support.google.com/cloud/answer/13463073)

## 🎉 Post-Launch

1. **Monitor Performance**: Use Google Analytics and Apps Script logs
2. **Gather Feedback**: Monitor user reviews and support requests
3. **Iterate**: Regular updates based on user feedback
4. **Scale**: Plan for increased usage and feature expansion

---

**Ready to publish!** 🚀 Follow this guide step-by-step for successful Google Workspace Marketplace publication. 