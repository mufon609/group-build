// Claude feature catalog, 68 entries from official Claude docs. Each has text-message signals + source_url.
const CATALOG = [
  {
    "id": "projects",
    "feature": "Projects",
    "category": "core",
    "what_it_does": "Projects let you organize related conversations together with a shared knowledge base of uploaded documents, text, and instructions so Claude always has the same context.",
    "signals": [
      "client list",
      "all my clients",
      "keep track of everyone",
      "spreadsheet of clients",
      "everyone's schedule",
      "different clients",
      "so many people texting me",
      "hard to keep track",
      "organize my",
      "client info"
    ],
    "suggestion": "Set up a Claude Project for your coaching business with all client info, schedules and pricing as reference so Claude always has full context when you ask for help.",
    "example_persona": "Tennis coach with 12 clients",
    "source_url": "https://support.claude.com/en/articles/9517075-what-are-projects",
    "technical": false
  },
  {
    "id": "artifacts",
    "feature": "Artifacts",
    "category": "core",
    "what_it_does": "Artifacts are substantial, self-contained pieces of content Claude creates alongside the chat, such as an interactive app or dashboard, that you can edit, iterate on, and share with a link.",
    "signals": [
      "tracker",
      "who paid",
      "who still owes me",
      "booking schedule",
      "keep a list of",
      "build me something",
      "app to track",
      "calendar of sessions",
      "dashboard",
      "spreadsheet of who"
    ],
    "suggestion": "Have Claude build an interactive HTML tracker of your clients, session times and payment status as an Artifact.",
    "example_persona": "Tennis coach juggling bookings and payments over text",
    "source_url": "https://support.claude.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them",
    "technical": false
  },
  {
    "id": "memory",
    "feature": "Memory",
    "category": "core",
    "what_it_does": "Claude saves memory as individual topics while you chat and automatically recalls relevant context from past conversations in new chats, or you can tell it to remember something directly.",
    "signals": [
      "like i told you",
      "remember when",
      "same as last time",
      "usual time",
      "her usual spot",
      "as always",
      "like before",
      "same as before"
    ],
    "suggestion": "Ask Claude to remember each client's usual booking time and preferences so you don't repeat context every time you text.",
    "example_persona": "Coach managing recurring weekly bookings",
    "source_url": "https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context",
    "technical": false
  },
  {
    "id": "chat-search",
    "feature": "Chat search",
    "category": "core",
    "what_it_does": "Claude can search through your previous conversations to find and reference relevant information in a new chat.",
    "signals": [
      "what did i say",
      "did i already tell you",
      "find that conversation",
      "when did we talk about",
      "what did i quote",
      "look back at",
      "what was the price i said"
    ],
    "suggestion": "Ask Claude to search past chats to pull up what you quoted a client last month before you text them again.",
    "example_persona": "Coach who forgets past pricing or scheduling details",
    "source_url": "https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context",
    "technical": false
  },
  {
    "id": "file-upload-analysis",
    "feature": "Upload and analyze files",
    "category": "core",
    "what_it_does": "Claude can analyze uploaded files including PDFs, Word docs, Excel spreadsheets, CSVs, and images, reading both text and visual content in PDFs up to 100 pages.",
    "signals": [
      "screenshot of",
      "here's my venmo",
      "attached the schedule",
      "my spreadsheet",
      "sent you the pdf",
      "check this invoice",
      "here's a pic of",
      "csv export",
      "photo of the receipt"
    ],
    "suggestion": "Upload your payment screenshots or spreadsheet and have Claude reconcile who's paid and who still owes you.",
    "example_persona": "Coach with messy Venmo and cash payment records",
    "source_url": "https://support.claude.com/en/articles/8241126-upload-files-to-claude",
    "technical": false
  },
  {
    "id": "web-search",
    "feature": "Web search",
    "category": "core",
    "what_it_does": "Claude can search the live web to ground its answers in current information and provides citations for the sources it uses.",
    "signals": [
      "what time does",
      "closest court",
      "weather this weekend",
      "current price of",
      "is the park open",
      "look up",
      "what's the address",
      "is it raining"
    ],
    "suggestion": "Ask Claude to check the weather or court availability before confirming an outdoor session with a client.",
    "example_persona": "Coach scheduling outdoor sessions around weather",
    "source_url": "https://support.claude.com/en/articles/10684626-enable-and-use-web-search",
    "technical": false
  },
  {
    "id": "research-mode",
    "feature": "Research",
    "category": "core",
    "what_it_does": "Research has Claude run multi-step, agentic web searches to compile a comprehensive, cited report, with most reports completing in 5 to 15 minutes.",
    "signals": [
      "should i raise my rates",
      "how much do other coaches charge",
      "what's the going rate",
      "compare prices",
      "best way to price",
      "worth doing research on"
    ],
    "suggestion": "Use Research to find what other local tennis coaches charge before texting clients about a rate increase.",
    "example_persona": "Coach deciding whether to raise session prices",
    "source_url": "https://support.claude.com/en/articles/11106443-using-research",
    "technical": false
  },
  {
    "id": "skills-custom-tone",
    "feature": "Skills",
    "category": "core",
    "what_it_does": "Skills let you customize how Claude communicates, including applying communication patterns based on your own writing and adjusting the tone and format of responses, activated whenever relevant.",
    "signals": [
      "can you write it like me",
      "make it sound like me",
      "more professional",
      "keep it short",
      "sounds too robotic",
      "in my voice",
      "friendlier tone"
    ],
    "suggestion": "Create a custom Skill from your past texts so Claude drafts client messages in your own voice and tone.",
    "example_persona": "Coach who wants consistent, on-brand client texts",
    "source_url": "https://support.claude.com/en/articles/12512176-what-are-skills",
    "technical": false
  },
  {
    "id": "voice-mode",
    "feature": "Voice mode",
    "category": "core",
    "what_it_does": "Voice mode lets you have full spoken conversations with Claude, speaking your message and hearing Claude's response, and switch seamlessly between text and voice in the same chat.",
    "signals": [
      "driving right now",
      "hands full",
      "can't type",
      "at practice",
      "on court",
      "quick voice note",
      "call you back"
    ],
    "suggestion": "Use Claude's voice mode to talk through and confirm replies to clients when your hands are full between lessons.",
    "example_persona": "Coach texting between back-to-back lessons",
    "source_url": "https://support.claude.com/en/articles/11101966-use-voice-mode",
    "technical": false
  },
  {
    "id": "dictation",
    "feature": "Dictation",
    "category": "core",
    "what_it_does": "Claude Mobile supports dictation so you can speak your message instead of typing it.",
    "signals": [
      "driving",
      "on the go",
      "quick note",
      "typing is slow",
      "hands full",
      "between clients",
      "can't text right now"
    ],
    "suggestion": "Dictate quick scheduling replies into Claude on your phone instead of typing between sessions.",
    "example_persona": "Coach replying to clients while on the move",
    "source_url": "https://support.claude.com/en/articles/10065434-use-dictation-on-claude-mobile",
    "technical": false
  },
  {
    "id": "mobile-app-integrations",
    "feature": "Claude Mobile app integrations",
    "category": "core",
    "what_it_does": "The Claude mobile app can connect to native and third-party apps like Messages, Mail, Calendar, Reminders, and Maps to draft messages, manage events, and find locations directly from a conversation.",
    "signals": [
      "add to my calendar",
      "set a reminder",
      "text him back",
      "send her an email",
      "where's the court",
      "block off my schedule",
      "remind me to"
    ],
    "suggestion": "Let Claude on your phone add confirmed sessions straight to your calendar and draft the reply text for you.",
    "example_persona": "Coach managing scheduling entirely from his phone",
    "source_url": "https://support.claude.com/en/articles/11869619-use-claude-with-ios-apps",
    "technical": false
  },
  {
    "id": "create-edit-files",
    "feature": "Create and edit files",
    "category": "core",
    "what_it_does": "Claude can create and edit Excel spreadsheets, Word documents, PowerPoint presentations, and PDF files directly in conversation using a sandboxed code execution environment.",
    "signals": [
      "invoice",
      "send me a schedule",
      "make a spreadsheet",
      "email him the pdf",
      "write up a contract",
      "need a flyer",
      "need a report",
      "session log",
      "payment tracker"
    ],
    "suggestion": "Have Claude generate a formatted Excel payment tracker or a PDF invoice you can send straight to clients.",
    "example_persona": "Coach who needs invoices and schedules as real files",
    "source_url": "https://support.claude.com/en/articles/12111783-create-and-edit-files-with-claude",
    "technical": false
  },
  {
    "id": "google-calendar-connector",
    "feature": "Google Calendar connector",
    "category": "connectors",
    "what_it_does": "Lets Claude view events and calendars, create/update/delete events, and find mutual availability across attendees directly from a conversation.",
    "signals": [
      "can we reschedule",
      "what time works for you",
      "are you free",
      "let's find a time",
      "double booked",
      "same time next week",
      "add it to my calendar",
      "when works best"
    ],
    "suggestion": "Connect Google Calendar so Claude can check everyone's availability and put the new booking straight on your calendar instead of you texting back and forth about times.",
    "example_persona": "Tennis coach juggling 12 clients' lesson times",
    "source_url": "https://support.claude.com/en/articles/10166901-use-google-workspace-connectors",
    "technical": false
  },
  {
    "id": "gmail-connector",
    "feature": "Gmail connector",
    "category": "connectors",
    "what_it_does": "Lets Claude search and read emails, draft new emails, and send, reply to, or forward emails with your approval.",
    "signals": [
      "check your email",
      "did you get my email",
      "i'll email you",
      "send me the invoice",
      "check your inbox",
      "i sent the confirmation",
      "email me the details",
      "did you see my message"
    ],
    "suggestion": "Connect Gmail so Claude can draft and send those repetitive booking-confirmation and payment-reminder emails for you.",
    "example_persona": "Tennis coach emailing invoices to 12 clients",
    "source_url": "https://support.claude.com/en/articles/10166901-use-google-workspace-connectors",
    "technical": false
  },
  {
    "id": "google-drive-connector",
    "feature": "Google Drive connector",
    "category": "connectors",
    "what_it_does": "Lets Claude search and retrieve Google Docs, Sheets, Slides, PDFs and other files, upload files, and save Claude-generated content directly to Drive.",
    "signals": [
      "i'll send you the doc",
      "check the spreadsheet",
      "here's the schedule",
      "the sign up sheet",
      "upload the waiver",
      "where's the file",
      "share the folder",
      "send me the form"
    ],
    "suggestion": "Connect Google Drive so Claude can pull up your client roster or lesson-schedule spreadsheet and save updates back without you hunting for the file.",
    "example_persona": "Tennis coach tracking client roster in a Google Sheet",
    "source_url": "https://support.claude.com/en/articles/10166901-use-google-workspace-connectors",
    "technical": false
  },
  {
    "id": "slack-connector",
    "feature": "Slack connector",
    "category": "connectors",
    "what_it_does": "Lets Claude send messages, create canvases, and fetch data from a connected Slack workspace.",
    "signals": [
      "post it in slack",
      "check the group chat",
      "i'll message the team",
      "let the group know",
      "slack me",
      "ping the channel"
    ],
    "suggestion": "If you coordinate lessons or subs with other coaches over Slack, connect it so Claude can post schedule changes to the channel for you.",
    "example_persona": "Coach coordinating court subs with other instructors in a Slack workspace",
    "source_url": "https://claude.com/connectors",
    "technical": false
  },
  {
    "id": "notion-connector",
    "feature": "Notion connector",
    "category": "connectors",
    "what_it_does": "Connects a Notion workspace so Claude can search and update pages and databases to power workflows across tools.",
    "signals": [
      "it's in my notion",
      "check the notes doc",
      "i keep a client list",
      "let me pull up my notes",
      "i track that in a doc",
      "update the tracker"
    ],
    "suggestion": "If you keep client notes or a booking tracker in Notion, connect it so Claude can look up and update client details while replying to texts.",
    "example_persona": "Coach keeping client contact info and lesson history in Notion",
    "source_url": "https://claude.com/connectors",
    "technical": false
  },
  {
    "id": "microsoft-365-connector",
    "feature": "Microsoft 365 connector",
    "category": "connectors",
    "what_it_does": "Lets Claude access a connected account's SharePoint, OneDrive, Outlook, and Teams directly in conversation.",
    "signals": [
      "check outlook",
      "it's on my onedrive",
      "send it through teams",
      "in my sharepoint",
      "check my work email"
    ],
    "suggestion": "If you run your coaching business through Outlook and OneDrive instead of Google, connect Microsoft 365 so Claude can read and send from those directly.",
    "example_persona": "Coach who runs scheduling through an Outlook/Teams account",
    "source_url": "https://claude.com/connectors",
    "technical": false
  },
  {
    "id": "hubspot-connector",
    "feature": "HubSpot connector",
    "category": "connectors",
    "what_it_does": "Connects a HubSpot CRM so Claude can pull CRM context into answers and take actions against it.",
    "signals": [
      "add them as a new client",
      "who hasn't paid",
      "how many clients do i have",
      "follow up with leads",
      "track my clients"
    ],
    "suggestion": "If your client list has grown past a spreadsheet, connect HubSpot so Claude can track leads, bookings, and follow-ups for you like a real CRM.",
    "example_persona": "Coach scaling past casual texting into a real client pipeline",
    "source_url": "https://claude.com/connectors",
    "technical": false
  },
  {
    "id": "asana-connector",
    "feature": "Asana connector",
    "category": "connectors",
    "what_it_does": "Connects Asana so Claude can coordinate tasks, projects, and goals from within a conversation.",
    "signals": [
      "i need to remember to",
      "put that on my to-do list",
      "don't let me forget",
      "add it to my tasks",
      "follow up on this"
    ],
    "suggestion": "Connect Asana so Claude can turn texted requests like reschedules or equipment orders into tracked tasks instead of relying on memory.",
    "example_persona": "Coach juggling admin to-dos alongside lesson bookings",
    "source_url": "https://claude.com/connectors",
    "technical": false
  },
  {
    "id": "claude-in-chrome",
    "feature": "Claude in Chrome",
    "category": "connectors",
    "what_it_does": "A Chrome browser extension that lets Claude read, click, navigate, and fill forms on websites on the user's behalf, with built-in knowledge of sites like Slack, Google Calendar, Gmail, Google Docs, and GitHub.",
    "signals": [
      "book the court",
      "fill out the form",
      "sign up on the website",
      "renew my membership",
      "check the booking site",
      "pay through the app",
      "look it up online"
    ],
    "suggestion": "Use Claude in Chrome to have Claude actually go book the court, fill out registration forms, or check payment status on your club's website for you.",
    "example_persona": "Coach who books courts through a club's reservation website",
    "source_url": "https://support.claude.com/en/articles/12012173-get-started-with-claude-in-chrome",
    "technical": false
  },
  {
    "id": "claude-for-excel",
    "feature": "Claude for Excel",
    "category": "connectors",
    "what_it_does": "An Excel add-in letting Claude answer questions about an open workbook, adjust assumptions while preserving formulas, debug errors, and build or populate spreadsheet models without leaving Excel.",
    "signals": [
      "let me check the spreadsheet",
      "update my payment tracker",
      "who still owes me",
      "how much did i make this month",
      "track everyone's lesson credits"
    ],
    "suggestion": "Use Claude for Excel to keep a live spreadsheet of who's paid, who owes, and lesson credits remaining, updated as you text clients.",
    "example_persona": "Coach tracking 12 clients' payments and lesson packages in Excel",
    "source_url": "https://support.claude.com/en/articles/12650343-use-claude-for-excel",
    "technical": false
  },
  {
    "id": "claude-for-powerpoint",
    "feature": "Claude for PowerPoint",
    "category": "connectors",
    "what_it_does": "A PowerPoint add-in that lets Claude build decks from scratch, edit specific slides, convert bullets into diagrams and native charts, and iterate while preserving the template.",
    "signals": [
      "can you make a flyer",
      "need a summer camp brochure",
      "put together a pricing sheet",
      "make a slideshow for parents"
    ],
    "suggestion": "Use Claude for PowerPoint to turn your lesson packages and pricing into a polished handout or slide deck to text new clients.",
    "example_persona": "Coach putting together a summer camp pricing flyer",
    "source_url": "https://support.claude.com/en/articles/13521390-use-claude-for-powerpoint",
    "technical": false
  },
  {
    "id": "custom-remote-mcp-connector",
    "feature": "Custom remote MCP connectors",
    "category": "connectors",
    "what_it_does": "Lets a user connect Claude to any MCP server reachable over the public internet, including services not verified by Anthropic, beyond the built-in Connectors Directory.",
    "signals": [
      "we use this booking app",
      "our scheduling software",
      "the app we use for payments",
      "our own system",
      "custom tool we built"
    ],
    "suggestion": "If you use a booking or payments app that isn't a built-in connector, Claude can connect to it directly via a custom remote MCP connector if it exposes one.",
    "example_persona": "Coach using a niche court-booking or payment app not in the standard directory",
    "source_url": "https://support.claude.com/en/articles/11176164-use-connectors-to-extend-claude-s-capabilities",
    "technical": true
  },
  {
    "id": "cowork-desktop-agent",
    "feature": "Claude Cowork",
    "category": "automation",
    "what_it_does": "Claude Cowork is a desktop AI agent that works directly in a person's files and folders to complete multi-step tasks like organizing documents, creating spreadsheets, and reports, without writing code.",
    "signals": [
      "so behind on paperwork",
      "can someone just do this for me",
      "too many spreadsheets",
      "i hate doing invoices",
      "clean up my files",
      "organize this folder",
      "make me a report",
      "every week i have to",
      "so much admin",
      "no time for this"
    ],
    "suggestion": "Point Cowork at your booking or invoice folder and describe the task in plain English -- it will organize files, build spreadsheets, and draft documents for you.",
    "example_persona": "Tennis coach with 12 clients juggling schedules and invoices",
    "source_url": "https://support.claude.com/en/articles/13345190-get-started-with-claude-cowork",
    "technical": false
  },
  {
    "id": "cowork-scheduled-tasks",
    "feature": "Scheduled tasks in Claude Cowork",
    "category": "automation",
    "what_it_does": "Lets a person save a task once and have Claude Cowork run it automatically on a recurring schedule (hourly, daily, weekly, weekdays, or on demand), even when the computer is asleep or the app is closed.",
    "signals": [
      "every monday",
      "same as last week",
      "every week i have to send",
      "can you remind everyone",
      "weekly recap",
      "every morning",
      "send this out every friday",
      "do this automatically",
      "don't want to keep doing this manually",
      "on repeat"
    ],
    "suggestion": "Set up a scheduled Cowork task once, like 'every Monday at 9am text my clients this week's court times,' and it runs on its own from then on.",
    "example_persona": "Tennis coach who sends the same weekly schedule reminder to all clients",
    "source_url": "https://support.claude.com/en/articles/13854387-schedule-recurring-tasks-in-claude-cowork",
    "technical": false
  },
  {
    "id": "cowork-projects",
    "feature": "Projects in Claude Cowork",
    "category": "automation",
    "what_it_does": "Groups related recurring tasks into a persistent workspace with its own instructions, files, scheduled tasks, and memory that carries over between tasks in that project.",
    "signals": [
      "keep forgetting who paid",
      "same clients every time",
      "wish it remembered",
      "have to re-explain this every time",
      "all my client stuff",
      "everything for the club",
      "my coaching business"
    ],
    "suggestion": "Create one Cowork project for 'client billing' so Claude remembers each client's rate and history instead of you re-explaining it every time.",
    "example_persona": "Tennis coach managing recurring billing and scheduling for the same roster of clients",
    "source_url": "https://support.claude.com/en/articles/14116274-organize-your-tasks-with-projects-in-claude-cowork",
    "technical": false
  },
  {
    "id": "cowork-dispatch",
    "feature": "Dispatch in Claude Cowork",
    "category": "automation",
    "what_it_does": "Lets a person message Claude from their phone to run a task on their desktop computer using local files and apps, then sends a push notification when it's done or needs approval.",
    "signals": [
      "i'm at the courts",
      "not near my laptop",
      "can you handle this while i'm out",
      "on the go",
      "driving right now",
      "in the middle of a lesson",
      "text me when it's done",
      "away from my computer"
    ],
    "suggestion": "Text a task to Claude from your phone between lessons -- it runs on your desktop and pings you when it's finished.",
    "example_persona": "Tennis coach handling admin between back-to-back lessons on the court",
    "source_url": "https://support.claude.com/en/articles/13947068-assign-tasks-from-anywhere-in-claude-cowork",
    "technical": false
  },
  {
    "id": "claude-code",
    "feature": "Claude Code",
    "category": "automation",
    "what_it_does": "An agentic coding tool that reads a codebase, edits files, runs commands, and automates repetitive development work like tests, lint fixes, dependency updates, and release notes.",
    "signals": [
      "my website is broken",
      "need to fix a bug",
      "can you build me an app",
      "my booking site",
      "the code is broken again",
      "update my website",
      "add a feature to my site"
    ],
    "suggestion": "If you or a friend maintain a booking website or app, Claude Code can find and fix bugs, add features, and handle the tedious upkeep automatically.",
    "example_persona": "Tennis coach who also runs a small booking website for lessons",
    "source_url": "https://code.claude.com/docs/en/overview",
    "technical": true
  },
  {
    "id": "claude-code-desktop-scheduled-tasks",
    "feature": "Scheduled tasks in Claude Code Desktop",
    "category": "automation",
    "what_it_does": "Starts a new Claude Code session automatically on a schedule (hourly, daily, weekdays, weekly, or a one-time reminder) to handle recurring work, with local file access and a minimum interval of one minute.",
    "signals": [
      "remind me tomorrow at",
      "don't let me forget",
      "every morning check",
      "set a reminder",
      "one time thing",
      "next week remind me",
      "check this every day"
    ],
    "suggestion": "Ask Claude to 'remind me at 3pm tomorrow to confirm court bookings' and it creates a one-time or recurring task that fires automatically.",
    "example_persona": "Tennis coach who forgets to follow up on pending bookings",
    "source_url": "https://code.claude.com/docs/en/desktop-scheduled-tasks",
    "technical": true
  },
  {
    "id": "claude-code-routines",
    "feature": "Routines (Claude Code cloud automation)",
    "category": "automation",
    "what_it_does": "Saves a prompt, repositories, and connectors as a routine that runs automatically in the cloud on a schedule, via an API call, or in response to GitHub events, and keeps running even when the computer is off.",
    "signals": [
      "even when my computer is off",
      "keeps running",
      "automatically whenever",
      "trigger this when",
      "runs by itself",
      "24/7",
      "without me having to open my laptop"
    ],
    "suggestion": "A cloud Routine keeps your automation running even when your laptop is closed -- useful if your booking system needs round-the-clock monitoring.",
    "example_persona": "Small business owner automating backend checks that must run overnight",
    "source_url": "https://code.claude.com/docs/en/routines",
    "technical": true
  },
  {
    "id": "claude-code-cloud-web",
    "feature": "Claude Code on the web / cloud sessions",
    "category": "automation",
    "what_it_does": "Runs Claude Code sessions on Anthropic-managed cloud infrastructure so a person can start long-running tasks from a browser, phone, or desktop app, check on them later, and run several tasks in parallel.",
    "signals": [
      "kick this off and i'll check later",
      "run this while i sleep",
      "start it and come back to it",
      "doing three things at once",
      "too much going on at once",
      "check back later",
      "start it now finish later"
    ],
    "suggestion": "Kick off a long task from your phone or browser and check back later -- it keeps running in the cloud without your computer staying on.",
    "example_persona": "Freelancer juggling several client projects that each take hours to run",
    "source_url": "https://code.claude.com/docs/en/claude-code-on-the-web",
    "technical": true
  },
  {
    "id": "claude-code-channels",
    "feature": "Channels (Claude Code)",
    "category": "automation",
    "what_it_does": "Lets messages from Telegram, Discord, iMessage, or a webhook get pushed directly into a running Claude Code session so Claude can react to and act on events happening outside the terminal.",
    "signals": [
      "just text me",
      "can i message you about it",
      "ping me on telegram",
      "send it to my discord",
      "text me when",
      "imessage me",
      "just dm claude",
      "message you directly"
    ],
    "suggestion": "Set up a Channel so you or your clients can text Claude directly on iMessage or Telegram and have it act on the message automatically.",
    "example_persona": "Coach who wants clients to text booking requests straight to an automated assistant",
    "source_url": "https://code.claude.com/docs/en/channels-reference",
    "technical": true
  },
  {
    "id": "agent-skills",
    "feature": "Agent Skills (Custom Skills)",
    "category": "automation",
    "what_it_does": "Packaged folders of instructions and scripts that Claude loads automatically to perform a specialized, repeatable task consistently, such as following a specific template or workflow every time.",
    "signals": [
      "same format every time",
      "the way i always do it",
      "my template",
      "do it like i showed you",
      "follow the same steps",
      "same thing i always send",
      "in my style"
    ],
    "suggestion": "Create a Skill once with your invoice format or lesson-recap template, and Claude follows it exactly every time you ask, without you re-explaining.",
    "example_persona": "Tennis coach who sends the same styled invoice and recap to every client",
    "source_url": "https://support.claude.com/en/articles/12512176-what-are-skills",
    "technical": false
  },
  {
    "id": "weekly-calendar-inbox-prep",
    "feature": "Microsoft 365 Connector",
    "category": "use-case",
    "what_it_does": "Claude reads your calendar and inbox together to build a weekly overview, flagging meetings that need prep, scheduling conflicts, and open blocks for focus time.",
    "signals": [
      "what's my week look like",
      "am i double booked",
      "when am i free",
      "so many things this week",
      "can we find a time",
      "back to back all week",
      "when's a good time to meet"
    ],
    "suggestion": "Have Claude scan your calendar and inbox every Sunday night to flag conflicts and prep work before the week starts.",
    "example_persona": "Freelancer juggling client calls and errands all week",
    "source_url": "https://academy.claude.com/use-cases/quickly-prep-for-your-week",
    "technical": false
  },
  {
    "id": "compare-vendor-quotes",
    "feature": "Document analysis (Claude.ai)",
    "category": "use-case",
    "what_it_does": "Upload competing quotes or proposals and Claude builds a side-by-side comparison of pricing, terms, and features to speed up a decision.",
    "signals": [
      "got 3 quotes",
      "which one is cheaper",
      "comparing prices",
      "not sure which to pick",
      "sending over the estimates",
      "can you look at these quotes"
    ],
    "suggestion": "Forward the quotes you're comparing to Claude and ask for a side-by-side pricing and terms breakdown.",
    "example_persona": "Person choosing between contractor bids for a home repair",
    "source_url": "https://academy.claude.com/use-cases/compare-and-analyze-competing-options",
    "technical": false
  },
  {
    "id": "diy-portfolio-booking-page",
    "feature": "Artifacts",
    "category": "use-case",
    "what_it_does": "Claude turns a resume or business info into a live, interactive webpage using Artifacts, no coding required.",
    "signals": [
      "need a website",
      "should make a page for this",
      "people keep asking where to book",
      "don't have a site yet",
      "can you send me a link",
      "need somewhere to send people"
    ],
    "suggestion": "Ask Claude to build you a simple booking/info page with Artifacts, then share the link with clients instead of texting details one by one.",
    "example_persona": "Tennis coach who has no website for new clients to find booking info",
    "source_url": "https://academy.claude.com/use-cases/create-a-custom-webpage",
    "technical": false
  },
  {
    "id": "auto-organize-local-files",
    "feature": "Claude Cowork",
    "category": "use-case",
    "what_it_does": "Cowork reads through a messy folder of files on your computer and sorts everything into a clean folder structure, then reports back a summary.",
    "signals": [
      "my files are a mess",
      "can't find that pdf",
      "where did i save that",
      "desktop is chaos",
      "so many random files",
      "need to clean this up"
    ],
    "suggestion": "Point Claude Cowork at your messy folder of client files and let it sort them into a clean structure automatically.",
    "example_persona": "Small business owner with years of client paperwork dumped on the desktop",
    "source_url": "https://academy.claude.com/use-cases/organize-files-by-whats-in-them",
    "technical": false
  },
  {
    "id": "compare-products-across-tabs",
    "feature": "Claude in Chrome",
    "category": "use-case",
    "what_it_does": "Claude in Chrome reads specs from multiple open product pages, normalizes the data, and builds a comparison table in Google Sheets.",
    "signals": [
      "which one should i buy",
      "comparing a few options",
      "can't decide between these",
      "found a couple options",
      "which is the better deal",
      "trying to pick the right one"
    ],
    "suggestion": "Open the product pages you're comparing and let Claude in Chrome build a spec-and-price comparison table for you.",
    "example_persona": "Parent comparing strollers across three retailer sites",
    "source_url": "https://academy.claude.com/use-cases/compare-products-across-sites",
    "technical": false
  },
  {
    "id": "meeting-calendar-prep",
    "feature": "Claude in Chrome",
    "category": "use-case",
    "what_it_does": "Claude scans your calendar and email to flag meetings needing prep, surface relevant context, and book missing rooms or video links.",
    "signals": [
      "what's tomorrow look like",
      "need to prep for this",
      "forgot to send a link",
      "do we have a call time",
      "what time works",
      "sending the invite now"
    ],
    "suggestion": "Let Claude in Chrome sweep your calendar each morning and flag which meetings still need prep or a missing video link.",
    "example_persona": "Consultant with back-to-back client calls all week",
    "source_url": "https://academy.claude.com/use-cases/prepare-and-plan-from-your-calendar",
    "technical": false
  },
  {
    "id": "gmail-promo-cleanup",
    "feature": "Claude in Chrome",
    "category": "use-case",
    "what_it_does": "Claude scans Gmail to identify promotional emails and newsletters, groups them by sender, and deletes them in bulk once you approve.",
    "signals": [
      "inbox is out of control",
      "so many unread emails",
      "unsubscribe from all this",
      "inbox zero",
      "too many newsletters",
      "need to clean out my email"
    ],
    "suggestion": "Have Claude in Chrome sort your promo emails by sender so you can approve a bulk cleanup in one pass.",
    "example_persona": "Anyone drowning in newsletter and promo email clutter",
    "source_url": "https://academy.claude.com/use-cases/clean-up-promotional-emails",
    "technical": false
  },
  {
    "id": "google-drive-cleanup",
    "feature": "Claude in Chrome",
    "category": "use-case",
    "what_it_does": "Claude navigates Google Drive to build a logical folder structure, move files into place, and flag duplicates or outdated files for review.",
    "signals": [
      "drive is a mess",
      "can't find that doc",
      "so many random files in drive",
      "where's that file",
      "need to organize this folder",
      "duplicate files everywhere"
    ],
    "suggestion": "Let Claude in Chrome sort your Google Drive into folders and flag duplicates for you to approve.",
    "example_persona": "Small business owner with years of shared docs piled in one Drive folder",
    "source_url": "https://academy.claude.com/use-cases/organize-files-in-google-drive",
    "technical": false
  },
  {
    "id": "daily-briefing-across-tools",
    "feature": "Claude Cowork",
    "category": "use-case",
    "what_it_does": "Claude pulls urgent items, relevant discussions, and upcoming tasks from across your work tools into one prioritized morning briefing.",
    "signals": [
      "what did i miss",
      "catching up this morning",
      "what's urgent today",
      "too many apps to check",
      "need to catch up on everything",
      "what's on my plate today"
    ],
    "suggestion": "Set up a Cowork daily briefing that pulls your priorities from all your tools into one morning summary.",
    "example_persona": "Small business owner juggling messages across email, Slack, and a booking app",
    "source_url": "https://academy.claude.com/use-cases/build-a-daily-briefing-across-your-tools",
    "technical": false
  },
  {
    "id": "research-to-presentation",
    "feature": "File uploads + Canva/Google Drive integration",
    "category": "use-case",
    "what_it_does": "Claude analyzes an uploaded research paper or document and produces a structured slide deck outline with speaker notes.",
    "signals": [
      "have to present this",
      "need slides for class",
      "presenting tomorrow",
      "turning this into a deck",
      "due for my presentation",
      "gotta make slides"
    ],
    "suggestion": "Upload your notes or paper and have Claude draft a slide outline with speaker notes ready to drop into Canva.",
    "example_persona": "Student turning a research paper into a class presentation",
    "source_url": "https://academy.claude.com/use-cases/turn-research-into-presentations",
    "technical": false
  },
  {
    "id": "daily-travel-itinerary",
    "feature": "Web search + Artifacts",
    "category": "use-case",
    "what_it_does": "Claude researches current recommendations and builds a mobile-friendly daily itinerary with timing, addresses, and backup options.",
    "signals": [
      "what should we do each day",
      "need an itinerary",
      "trip is coming up",
      "what's the plan for saturday",
      "figuring out our days there",
      "so much to see, not enough time"
    ],
    "suggestion": "Ask Claude to research and build a day-by-day itinerary with backup plans, formatted for your phone.",
    "example_persona": "Group planning a long weekend trip together",
    "source_url": "https://academy.claude.com/use-cases/create-a-daily-travel-itinerary",
    "technical": false
  },
  {
    "id": "compare-travel-destinations",
    "feature": "Web search + spreadsheet generation",
    "category": "use-case",
    "what_it_does": "Claude researches multiple destinations and builds a formatted comparison spreadsheet with ratings, costs, and links.",
    "signals": [
      "where should we go",
      "can't decide on a destination",
      "comparing a few places",
      "torn between two spots",
      "where's cheaper to go",
      "deciding where to vacation"
    ],
    "suggestion": "Have Claude research and build a comparison sheet of your destination options with costs and ratings side by side.",
    "example_persona": "Couple deciding between destinations for an anniversary trip",
    "source_url": "https://academy.claude.com/use-cases/research-and-compare-travel-destinations",
    "technical": false
  },
  {
    "id": "on-brand-marketing-content",
    "feature": "Claude Cowork (Marketing plugin)",
    "category": "use-case",
    "what_it_does": "From one campaign brief, Claude produces a consistent set of on-brand content — blog post, landing page, email sequence, and ad copy.",
    "signals": [
      "need to post about this",
      "should promote the new class",
      "writing a promo email",
      "need a caption",
      "trying to get more clients",
      "want to advertise this"
    ],
    "suggestion": "Give Claude a quick brief and have it draft your promo post, email, and ad copy together so they sound consistent.",
    "example_persona": "Solo business owner marketing a new class or offer without a marketing team",
    "source_url": "https://academy.claude.com/use-cases/on-brand-content",
    "technical": false
  },
  {
    "id": "lead-qualification-autoreply",
    "feature": "Claude for Small Business (HubSpot connector)",
    "category": "use-case",
    "what_it_does": "Claude qualifies new inquiries, drafts replies with available meeting times, and logs the contact automatically.",
    "signals": [
      "do you have any openings",
      "interested in signing up",
      "how much does it cost",
      "can i book a session",
      "new person asking about lessons",
      "wants to know availability"
    ],
    "suggestion": "Let Claude draft replies to new inquiries with your open time slots so you're not typing the same answer over and over.",
    "example_persona": "Tennis coach fielding repeated texts from prospective clients asking about openings and pricing",
    "source_url": "https://claude.com/solutions/small-business",
    "technical": false
  },
  {
    "id": "invoice-and-followup-automation",
    "feature": "Claude for Small Business (scheduled tasks)",
    "category": "use-case",
    "what_it_does": "Claude runs recurring reminders for invoices, follow-ups, and reorders on a schedule, without manual chasing.",
    "signals": [
      "still waiting on payment",
      "haven't paid yet",
      "gotta remind them again",
      "chasing invoices",
      "can you send the invoice",
      "forgot to pay you"
    ],
    "suggestion": "Set up Claude to automatically send payment reminders on a schedule instead of manually texting clients who owe you.",
    "example_persona": "Tennis coach chasing multiple clients for lesson payments each week",
    "source_url": "https://claude.com/solutions/small-business",
    "technical": false
  },
  {
    "id": "proposal-generation",
    "feature": "Claude for Small Business (Canva/Drive/DocuSign connectors)",
    "category": "use-case",
    "what_it_does": "Claude builds a customized proposal from templates, voice memos, and photos for a prospective client.",
    "signals": [
      "can you send me a proposal",
      "need something in writing",
      "put together a quote",
      "what's included in the package",
      "send over the details",
      "need this signed"
    ],
    "suggestion": "Have Claude turn your voice memo about the job into a polished proposal ready to send and sign.",
    "example_persona": "Independent contractor sending a custom quote to a new client",
    "source_url": "https://claude.com/solutions/small-business",
    "technical": false
  },
  {
    "id": "cash-flow-monday-brief",
    "feature": "Claude for Small Business (financial connectors)",
    "category": "use-case",
    "what_it_does": "Claude delivers a Monday brief with current cash position and the week-ahead outlook pulled from your accounting and payment platforms.",
    "signals": [
      "how much did we make this month",
      "money's tight right now",
      "checking the books",
      "what's coming in this week",
      "need to see where we stand financially",
      "cash flow is rough"
    ],
    "suggestion": "Ask Claude to send you a weekly cash position summary pulled straight from your accounting and payment apps.",
    "example_persona": "Small business owner who only checks their finances in a panic",
    "source_url": "https://claude.com/solutions/small-business",
    "technical": false
  },
  {
    "id": "social-content-calendar",
    "feature": "Claude for Small Business (Shopify connector)",
    "category": "use-case",
    "what_it_does": "Claude creates a posting calendar with images, captions, and graphics staged for approval each week.",
    "signals": [
      "haven't posted in a while",
      "need content for instagram",
      "should post about the new schedule",
      "gotta keep up the socials",
      "need captions for these photos",
      "what should i post this week"
    ],
    "suggestion": "Have Claude stage a week's worth of social posts with captions ready for you to approve instead of scrambling each time.",
    "example_persona": "Small business owner who wants a consistent social presence but has no time to plan it",
    "source_url": "https://claude.com/solutions/small-business",
    "technical": false
  },
  {
    "id": "tennis-coach-client-tracker",
    "feature": "Artifacts",
    "category": "persona",
    "what_it_does": "Claude can build a persistent interactive HTML tool directly in a chat that stores and updates structured data across sessions.",
    "signals": [
      "lesson tomorrow at 4?",
      "can we reschedule to saturday",
      "sent the invoice",
      "still waiting on payment for last week",
      "court booked for thursday",
      "same time next week?",
      "how many lessons left in the package",
      "paid via venmo",
      "can you fit me in this weekend",
      "missed our session today"
    ],
    "suggestion": "Have Claude build an HTML tracker of your clients, lesson times, package balances and payments that updates as you paste in new texts.",
    "example_persona": "Tennis coach with 12 clients texting about lessons and payments",
    "source_url": "https://support.claude.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them",
    "technical": false
  },
  {
    "id": "tutor-progress-project",
    "feature": "Projects",
    "category": "persona",
    "what_it_does": "Projects let you upload documents and set instructions so Claude retains context about each client or student across every conversation.",
    "signals": [
      "how'd the quiz go",
      "struggling with fractions again",
      "next session tuesday 5pm",
      "can we do an extra hour before the exam",
      "sent over the worksheet",
      "parent asked for a progress update",
      "same rate as last month?",
      "need to catch up on chapter 4"
    ],
    "suggestion": "Set up a Project with session notes as knowledge so Claude can draft accurate progress updates from your text history with each student.",
    "example_persona": "Math tutor juggling 8 students across grade levels",
    "source_url": "https://support.claude.com/en/articles/9517075-what-are-projects",
    "technical": false
  },
  {
    "id": "trainer-calendar-connector",
    "feature": "Google Calendar connector",
    "category": "persona",
    "what_it_does": "Connecting Google Calendar lets Claude read and manage your calendar directly from a conversation to check availability and add events.",
    "signals": [
      "are you free at 6am",
      "need to swap thursday's session",
      "double booked, can we move it",
      "training at the park again?",
      "can i get a friday slot",
      "session count for this month",
      "let's do 7am instead"
    ],
    "suggestion": "Connect Google Calendar so Claude can check for scheduling conflicts and draft replies to clients asking for new time slots.",
    "example_persona": "Personal trainer scheduling sessions with 15+ clients by text",
    "source_url": "https://support.claude.com/en/articles/10166901-use-google-workspace-connectors",
    "technical": false
  },
  {
    "id": "salon-gmail-triage",
    "feature": "Gmail connector",
    "category": "persona",
    "what_it_does": "The Gmail connector lets Claude search, read, and draft or send emails so it can triage booking requests and confirmations without leaving the chat.",
    "signals": [
      "do you have anything open saturday",
      "running 10 min late",
      "need to cancel my appointment",
      "can i switch to sam instead of you",
      "confirming my 2pm",
      "how much for balayage",
      "deposit required?"
    ],
    "suggestion": "Connect Gmail so Claude can triage booking emails, draft confirmations, and flag no-show risks alongside your text threads.",
    "example_persona": "Salon owner managing bookings over text and email",
    "source_url": "https://support.claude.com/en/articles/10166901-use-google-workspace-connectors",
    "technical": false
  },
  {
    "id": "contractor-invoice-followup-task",
    "feature": "Scheduled tasks (Claude Cowork)",
    "category": "persona",
    "what_it_does": "Scheduled tasks let Claude run a recurring job automatically (hourly, daily, weekly) that reads your records and drafts follow-ups without being re-prompted.",
    "signals": [
      "still owe you for the job",
      "when's the balance due",
      "can you send the invoice again",
      "check's in the mail",
      "job's done, what do i owe",
      "deposit sent",
      "waiting on the final payment"
    ],
    "suggestion": "Schedule a weekly Claude Cowork task that scans your invoice list and drafts polite follow-ups for anything overdue by 7+ days.",
    "example_persona": "Contractor chasing payments across a dozen ongoing jobs",
    "source_url": "https://support.claude.com/en/articles/13854387-schedule-recurring-tasks-in-claude-cowork",
    "technical": false
  },
  {
    "id": "landlord-rent-tracker-excel",
    "feature": "File creation (Excel)",
    "category": "persona",
    "what_it_does": "Claude can generate a working .xlsx spreadsheet with formulas directly from a conversation or pasted data.",
    "signals": [
      "rent is late again",
      "sent the rent",
      "ac is broken",
      "lease renewal coming up",
      "can i pay half now half later",
      "deposit for damages",
      "when's rent due"
    ],
    "suggestion": "Ask Claude to turn your rent-related texts into an Excel rent roll tracking who's paid, who's late, and lease renewal dates.",
    "example_persona": "Landlord with several rental units texting tenants directly",
    "source_url": "https://support.claude.com/en/articles/12111783-create-and-edit-files-with-claude",
    "technical": false
  },
  {
    "id": "freelancer-proposal-docx",
    "feature": "File creation (Word/PDF)",
    "category": "persona",
    "what_it_does": "Claude can generate formatted Word documents and PDFs from a description, past examples, or notes shared in chat.",
    "signals": [
      "can you send over a quote",
      "what would this cost",
      "need a proposal by friday",
      "how much for the full package",
      "send me something in writing",
      "can you email the estimate"
    ],
    "suggestion": "Have Claude draft a formatted PDF proposal from your text description of the job, pulling pricing from past deals.",
    "example_persona": "Freelance designer or contractor quoting jobs over text",
    "source_url": "https://claude.com/blog/create-files",
    "technical": false
  },
  {
    "id": "shop-owner-price-research",
    "feature": "Research",
    "category": "persona",
    "what_it_does": "Research has Claude run multiple agentic web searches that build on each other to compile a cited, thorough answer on a topic.",
    "signals": [
      "do you price match",
      "cheaper down the street",
      "what's a fair price for this",
      "competitor has a sale",
      "customer asked why we're more expensive"
    ],
    "suggestion": "Use Research to compile current local competitor pricing and market rates before responding to a customer's price question.",
    "example_persona": "Small shop owner fielding price-comparison questions from customers",
    "source_url": "https://support.claude.com/en/articles/11088861-use-research-on-claude",
    "technical": false
  },
  {
    "id": "photographer-chrome-booking",
    "feature": "Claude for Chrome",
    "category": "persona",
    "what_it_does": "Claude in Chrome lets Claude act inside a real browser tab, filling forms and checking availability on booking sites on your behalf.",
    "signals": [
      "is the venue free that day",
      "need to book the studio",
      "check if they have an opening",
      "can you hold the date",
      "still deciding on venue"
    ],
    "suggestion": "Use Claude for Chrome to check a venue's booking site for open dates while you're texting back and forth with a client.",
    "example_persona": "Wedding or event photographer coordinating venue availability by text",
    "source_url": "https://support.claude.com/en/articles/12012173-get-started-with-claude-in-chrome",
    "technical": false
  },
  {
    "id": "contractor-quickbooks-reconcile",
    "feature": "QuickBooks connector (Claude for Small Business)",
    "category": "persona",
    "what_it_does": "The QuickBooks integration lets Claude handle reconciliation, monthly close, and cash-flow forecasting directly against your accounting data.",
    "signals": [
      "paid you in cash",
      "zelle sent",
      "need a receipt",
      "how much do i owe total",
      "did that check clear",
      "job cost more than quoted"
    ],
    "suggestion": "Connect QuickBooks so Claude can reconcile texted payment confirmations against your books and flag mismatches.",
    "example_persona": "Contractor tracking cash, Zelle and check payments mentioned in texts",
    "source_url": "https://www.anthropic.com/news/claude-for-small-business",
    "technical": false
  },
  {
    "id": "salon-canva-social",
    "feature": "Canva connector (Claude for Small Business)",
    "category": "persona",
    "what_it_does": "The Canva connector lets Claude create, collaborate on, and publish design assets like social posts directly from Claude.",
    "signals": [
      "post the new style pics",
      "need something for instagram",
      "can you promote the opening",
      "slow week, need more bookings",
      "flash sale this weekend"
    ],
    "suggestion": "Connect Canva so Claude can turn a slow-booking week into a ready-to-post promo graphic without opening a design tool.",
    "example_persona": "Salon or beauty business owner promoting openings via social media",
    "source_url": "https://www.anthropic.com/news/claude-for-small-business",
    "technical": false
  },
  {
    "id": "contractor-docusign-tracking",
    "feature": "Docusign connector (Claude for Small Business)",
    "category": "persona",
    "what_it_does": "The Docusign connector lets Claude track contract signing status and manage related files.",
    "signals": [
      "did you sign the contract",
      "still need your signature",
      "haven't gotten the paperwork back",
      "can you resend the agreement",
      "signed and sent back"
    ],
    "suggestion": "Connect Docusign so Claude can check which clients still owe a signature and draft a nudge text.",
    "example_persona": "Contractor or freelancer waiting on signed contracts before starting work",
    "source_url": "https://www.anthropic.com/news/claude-for-small-business",
    "technical": false
  },
  {
    "id": "club-organizer-live-dashboard",
    "feature": "Live Artifacts",
    "category": "persona",
    "what_it_does": "Live Artifacts are persistent dashboards in Claude that pull fresh data from a connected source, such as a spreadsheet, every time they're opened.",
    "signals": [
      "did everyone pay their fees",
      "who's signed up for saturday",
      "need a headcount",
      "still owe the team fee",
      "roster for the tournament",
      "who hasn't paid yet"
    ],
    "suggestion": "Build a Live Artifact dashboard pulling from a signup spreadsheet so you can see who's registered and paid at a glance.",
    "example_persona": "Youth sports club or team organizer tracking roster and fees",
    "source_url": "https://support.claude.com/en/articles/14729249-use-artifacts-in-claude-cowork",
    "technical": false
  },
  {
    "id": "freelancer-hubspot-lead-triage",
    "feature": "HubSpot connector (Claude for Small Business)",
    "category": "persona",
    "what_it_does": "The HubSpot integration lets Claude triage inbound leads, score them, and log them into your CRM automatically.",
    "signals": [
      "interested in your services",
      "how much do you charge",
      "do you have availability",
      "saw your work, want to hire you",
      "can we hop on a call"
    ],
    "suggestion": "Connect HubSpot so Claude can triage inbound texted leads and log qualified ones straight into your CRM.",
    "example_persona": "Freelance consultant fielding inbound inquiries by text",
    "source_url": "https://www.anthropic.com/news/claude-for-small-business",
    "technical": false
  },
  {
    "id": "student-study-tracker-artifact",
    "feature": "Artifacts",
    "category": "persona",
    "what_it_does": "Claude can build an interactive study tool, such as flashcards or a deadline tracker, as a shareable artifact from a description of upcoming work.",
    "signals": [
      "exam is next tuesday",
      "study group at the library",
      "did you finish the reading",
      "notes for chapter 5?",
      "quiz on friday",
      "project due at midnight"
    ],
    "suggestion": "Ask Claude to turn your group-chat deadline chatter into a shared study schedule or flashcard artifact.",
    "example_persona": "Student coordinating exam prep with classmates over text",
    "source_url": "https://support.claude.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them",
    "technical": false
  },
  {
    "id": "photographer-drive-gallery",
    "feature": "Google Drive connector",
    "category": "persona",
    "what_it_does": "The Google Drive connector lets Claude search, open, and organize files stored in your Drive from within a conversation.",
    "signals": [
      "can you resend the gallery link",
      "photos still not up",
      "which folder are my pics in",
      "did you get the raw files",
      "when will the edits be done"
    ],
    "suggestion": "Connect Google Drive so Claude can find and organize client galleries when they text asking where their photos are.",
    "example_persona": "Photographer managing client galleries and delivery over text",
    "source_url": "https://support.claude.com/en/articles/10166901-use-google-workspace-connectors",
    "technical": false
  }
];

if (typeof module !== 'undefined') module.exports = CATALOG;
