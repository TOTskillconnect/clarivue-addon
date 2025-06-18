# Converting AntD JSX to Google Apps Script CardService

This guide helps convert React/AntD components to Google Apps Script CardService equivalents.

## 🔄 Component Mappings

### AntD Card → CardService DecoratedText
```jsx
// AntD JSX
<Card style={{ marginBottom: 12, borderRadius: 8 }}>
  {question}
</Card>
```

```javascript
// Apps Script CardService
CardService.newDecoratedText()
  .setText(question)
  .setWrapText(true)
```

### AntD Tabs → CardService ButtonSet + Navigation
```jsx
// AntD JSX
<Tabs defaultActiveKey="1">
  <TabPane tab="Questions" key="1">...</TabPane>
  <TabPane tab="Cues" key="2">...</TabPane>
</Tabs>
```

```javascript
// Apps Script CardService
CardService.newButtonSet()
  .addButton(
    CardService.newTextButton()
      .setText("Questions")
      .setOnClickAction(CardService.newAction().setFunctionName("showQuestions"))
  )
  .addButton(
    CardService.newTextButton()
      .setText("Cues") 
      .setOnClickAction(CardService.newAction().setFunctionName("showCues"))
  )
```

### AntD Typography → CardService TextParagraph
```jsx
// AntD JSX
<h2>Live Meeting Assistant</h2>
<p>Description text</p>
```

```javascript
// Apps Script CardService
CardService.newTextParagraph()
  .setText("<b>Live Meeting Assistant</b><br>Description text")
```

### AntD Button → CardService TextButton
```jsx
// AntD JSX
<Button type="primary" onClick={handleClick}>
  Use Question
</Button>
```

```javascript
// Apps Script CardService
CardService.newTextButton()
  .setText("Use Question")
  .setOnClickAction(
    CardService.newAction()
      .setFunctionName("handleClick")
      .setParameters({"data": "value"})
  )
```

## 🎨 Styling Equivalents

### Colors
```javascript
// Use HTML color codes in setText()
.setText("<font color='#1890ff'>Primary Blue</font>")
.setText("<font color='#52c41a'>Success Green</font>")
.setText("<font color='#faad14'>Warning Orange</font>")
.setText("<font color='#ff4d4f'>Error Red</font>")
```

### Typography
```javascript
// Bold text
.setText("<b>Bold Text</b>")

// Italic text  
.setText("<i>Italic Text</i>")

// Large text
.setText("<font size='4'>Large Text</font>")

// Combined
.setText("<b><font color='#1890ff' size='4'>Large Blue Bold</font></b>")
```

### Spacing & Layout
```javascript
// Add spacing between elements
CardService.newTextParagraph().setText("<br>")

// Divider line
CardService.newTextParagraph()
  .setText("<font color='#e8e8e8'>────────────────────</font>")

// Empty space
CardService.newTextParagraph().setText("&nbsp;")
```

## 📱 Layout Patterns

### Card Layout
```javascript
function createCardLayout(title, content, actions) {
  return CardService.newDecoratedText()
    .setText(`<b>${title}</b>`)
    .setBottomLabel(content)
    .setWrapText(true)
    .setButton(
      CardService.newTextButton()
        .setText(actions.label)
        .setOnClickAction(actions.action)
    );
}
```

### Section with Header
```javascript
function createSection(header, widgets) {
  const section = CardService.newCardSection()
    .setHeader(header)
    .setCollapsible(false);
  
  widgets.forEach(widget => section.addWidget(widget));
  return section;
}
```

### Navigation Pattern
```javascript
function createNavigation(buttons) {
  const buttonSet = CardService.newButtonSet();
  
  buttons.forEach(btn => {
    buttonSet.addButton(
      CardService.newTextButton()
        .setText(btn.text)
        .setOnClickAction(btn.action)
    );
  });
  
  return buttonSet;
}
```

## 🚀 Quick Conversion Examples

### QuestionCard Component
```jsx
// Original AntD Component
function QuestionCard({ question }) {
  return (
    <Card style={{ marginBottom: 12, borderRadius: 8 }}>
      {question}
    </Card>
  );
}
```

```javascript
// Converted Apps Script
function createQuestionCard(question) {
  return CardService.newDecoratedText()
    .setText(`<b>${question}</b>`)
    .setWrapText(true)
    .setButton(
      CardService.newTextButton()
        .setText("Use Question")
        .setOnClickAction(
          CardService.newAction()
            .setFunctionName("useQuestion")
            .setParameters({"question": question})
        )
    );
}
```

### CueCard Component
```jsx
// Original AntD Component
function CueCard({ title, content }) {
  return (
    <Card style={{ marginBottom: 12, borderRadius: 8 }}>
      <h4>{title}</h4>
      <p>{content}</p>
    </Card>
  );
}
```

```javascript
// Converted Apps Script
function createCueCard(title, content) {
  return CardService.newDecoratedText()
    .setText(`<b>💡 ${title}</b>`)
    .setBottomLabel(content)
    .setWrapText(true)
    .setButton(
      CardService.newTextButton()
        .setText("Apply Cue")
        .setOnClickAction(
          CardService.newAction()
            .setFunctionName("applyCue")
            .setParameters({
              "title": title,
              "content": content
            })
        )
    );
}
```

## 🛠️ Cursor AI Prompt

Use this prompt in Cursor to auto-convert components:

```
/convert this AntD JSX layout to Google Apps Script CardService

Rules:
- Replace <Card> with CardService.newDecoratedText()
- Replace <Tabs> with CardService.newButtonSet() for navigation
- Replace <Button> with CardService.newTextButton()
- Use setText() with HTML for styling
- Add .setOnClickAction() for interactivity
- Wrap in CardService sections and builders
```

## 📚 CardService Reference

### Available Widgets
- `CardService.newDecoratedText()` - Rich text with buttons
- `CardService.newTextParagraph()` - Simple text
- `CardService.newTextButton()` - Clickable button
- `CardService.newButtonSet()` - Group of buttons
- `CardService.newImage()` - Images
- `CardService.newDivider()` - Horizontal line

### Card Structure
```javascript
const card = CardService.newCardBuilder()
  .setHeader(CardService.newCardHeader().setTitle("Title"))
  .addSection(CardService.newCardSection()
    .setHeader("Section Header")
    .addWidget(widget1)
    .addWidget(widget2)
  )
  .build();
``` 