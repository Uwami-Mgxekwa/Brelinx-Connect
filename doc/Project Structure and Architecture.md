Brelinx Connect - Project Structure & System Architecture
📁 Project Structure
brelinx-connect/
│
├── src/                           # SOURCE FILES (you work here)
│   ├── index.html                 # Main entry point
│   │
│   ├── pages/                     # HTML pages
│   │   ├── auth/
│   │   │   ├── login.html
│   │   │   ├── register.html
│   │   │   └── reset-password.html
│   │   │
│   │   ├── dashboard/
│   │   │   └── dashboard.html
│   │   │
│   │   ├── projects/
│   │   │   ├── projects-list.html
│   │   │   ├── project-detail.html
│   │   │   └── project-timeline.html
│   │   │
│   │   ├── chat/
│   │   │   ├── conversations.html
│   │   │   └── chat-room.html
│   │   │
│   │   ├── files/
│   │   │   ├── files-list.html
│   │   │   └── file-viewer.html
│   │   │
│   │   ├── meetings/
│   │   │   ├── calendar.html
│   │   │   └── meeting-details.html
│   │   │
│   │   ├── payments/
│   │   │   ├── invoices.html
│   │   │   ├── payment-history.html
│   │   │   └── make-payment.html
│   │   │
│   │   ├── feedback/
│   │   │   └── submit-feedback.html
│   │   │
│   │   └── profile/
│   │       ├── profile.html
│   │       └── settings.html
│   │
│   ├── css/
│   │   ├── variables.css          # CSS variables (colors, spacing)
│   │   ├── global.css             # Global styles
│   │   ├── components/            # Component-specific styles
│   │   │   ├── cards.css
│   │   │   ├── buttons.css
│   │   │   ├── forms.css
│   │   │   ├── navigation.css
│   │   │   └── modals.css
│   │   └── pages/                 # Page-specific styles
│   │       ├── auth.css
│   │       ├── dashboard.css
│   │       ├── projects.css
│   │       ├── chat.css
│   │       └── profile.css
│   │
│   ├── js/
│   │   ├── app.js                 # Main app initialization
│   │   ├── router.js              # Client-side routing
│   │   │
│   │   ├── services/              # Business logic & API calls
│   │   │   ├── api.service.js     # Base API service
│   │   │   ├── auth.service.js    # Authentication
│   │   │   ├── project.service.js # Project operations
│   │   │   ├── chat.service.js    # Chat/messaging
│   │   │   ├── file.service.js    # File operations
│   │   │   ├── payment.service.js # Payment operations
│   │   │   └── websocket.service.js # Real-time WebSocket
│   │   │
│   │   ├── utils/                 # Helper functions
│   │   │   ├── storage.js         # LocalStorage/SessionStorage
│   │   │   ├── validation.js      # Form validation
│   │   │   ├── date.js            # Date formatting
│   │   │   ├── notifications.js   # Push notifications
│   │   │   └── helpers.js         # General utilities
│   │   │
│   │   ├── components/            # Reusable JS components
│   │   │   ├── modal.js
│   │   │   ├── toast.js
│   │   │   ├── loader.js
│   │   │   └── file-uploader.js
│   │   │
│   │   └── pages/                 # Page-specific JavaScript
│   │       ├── auth.js
│   │       ├── dashboard.js
│   │       ├── projects.js
│   │       ├── chat.js
│   │       └── profile.js
│   │
│   ├── assets/
│   │   ├── images/
│   │   │   ├── logo.svg
│   │   │   ├── icons/
│   │   │   └── placeholders/
│   │   │
│   │   └── fonts/                 # Custom fonts (if any)
│   │
│   └── manifest.json              # PWA manifest
│
├── www/                           # BUILT FILES (auto-generated - DON'T EDIT)
│   ├── index.html                 # Compiled/optimized HTML
│   ├── build/                     # Minified JS/CSS bundles
│   │   ├── main.js
│   │   └── main.css
│   └── assets/                    # Optimized images
│
├── capacitor.config.json          # Capacitor configuration
├── ionic.config.json              # Ionic configuration
├── package.json                   # Dependencies
├── .gitignore                     # Git ignore (include www/ folder)
└── README.md                      # Project documentation________________________________________
🏗️ System Architecture
Architecture Overview
┌─────────────────────────────────────────────────────────────┐
│                    MOBILE APP (Ionic)                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Presentation Layer                       │  │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐ │  │
│  │  │  HTML   │  │   CSS   │  │ Ionic   │  │ Assets  │ │  │
│  │  │  Pages  │  │ Styles  │  │  UI     │  │ Images  │ │  │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘ │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Application Layer                        │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐ │  │
│  │  │   Router    │  │  Components  │  │    Utils    │ │  │
│  │  │  (Pages)    │  │   (Modals)   │  │  (Helpers)  │ │  │
│  │  └─────────────┘  └──────────────┘  └─────────────┘ │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Business Logic Layer                     │  │
│  │  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌───────┐ │  │
│  │  │ Auth │  │Project│  │ Chat │  │ File │  │Payment│ │  │
│  │  │Service│  │Service│  │Service│  │Service│  │Service│ │  │
│  │  └──────┘  └──────┘  └──────┘  └──────┘  └───────┘ │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Data Access Layer                        │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │  │
│  │  │  API Service │  │  WebSocket   │  │   Local    │ │  │
│  │  │  (REST API)  │  │  (Real-time) │  │  Storage   │ │  │
│  │  └──────────────┘  └──────────────┘  └────────────┘ │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Native Layer (Capacitor Plugins)              │  │
│  │  ┌───────┐  ┌───────┐  ┌──────────┐  ┌──────────┐  │  │
│  │  │Camera │  │ Files │  │Push Notify│  │Biometric │  │  │
│  │  └───────┘  └───────┘  └──────────┘  └──────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↕
                    ┌──────────────────┐
                    │   HTTPS / WSS    │
                    └──────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                     BACKEND SERVER                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              API Gateway / Load Balancer              │  │
│  └──────────────────────────────────────────────────────┘  │
│                              ↕                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              REST API Endpoints                       │  │
│  │  /auth  /projects  /chat  /files  /payments          │  │
│  └──────────────────────────────────────────────────────┘  │
│                              ↕                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Business Logic                           │  │
│  │  Authentication | Project Management | Payments       │  │
│  └──────────────────────────────────────────────────────┘  │
│                              ↕                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Database Layer                           │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐           │  │
│  │  │PostgreSQL│  │   Redis  │  │ MongoDB  │           │  │
│  │  │  (Main)  │  │ (Cache)  │  │  (Chat)  │           │  │
│  │  └──────────┘  └──────────┘  └──────────┘           │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                   EXTERNAL SERVICES                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ Firebase │  │  Stripe  │  │   AWS    │  │   Zoom   │  │
│  │  (Push)  │  │(Payment) │  │   S3     │  │  (Video) │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
└─────────────────────────────────────────────────────────────┘
________________________________________
🔧 Technical Architecture Details
1. Frontend Architecture (Ionic App)
Routing Strategy
•	Client-side routing using vanilla JS
•	Hash-based routing for compatibility
•	Navigation guards for authentication
•	Deep linking support for notifications
State Management
•	LocalStorage for persistent data (auth tokens, user preferences)
•	SessionStorage for temporary data
•	JavaScript objects for in-memory state
•	Event-driven updates for real-time features
API Communication Pattern
// services/api.service.js
class ApiService {
  constructor() {
    this.baseURL = 'https://api.brelinx.com';
    this.token = localStorage.getItem('authToken');
  }

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`,
      ...options.headers
    };

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();
  }

  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // ... put, delete methods
}
________________________________________
2. Backend Architecture
API Structure
Backend API Endpoints:

Authentication:
  POST   /api/auth/login
  POST   /api/auth/register
  POST   /api/auth/refresh-token
  POST   /api/auth/logout
  POST   /api/auth/reset-password

Projects:
  GET    /api/projects
  GET    /api/projects/:id
  POST   /api/projects
  PUT    /api/projects/:id
  GET    /api/projects/:id/milestones
  POST   /api/projects/:id/milestones

Chat/Messages:
  GET    /api/conversations
  GET    /api/conversations/:id/messages
  POST   /api/conversations/:id/messages
  WS     /ws/chat (WebSocket connection)

Files:
  GET    /api/files/:projectId
  POST   /api/files/upload
  GET    /api/files/download/:fileId
  DELETE /api/files/:fileId
  POST   /api/files/:fileId/approve

Payments:
  GET    /api/invoices
  GET    /api/invoices/:id
  POST   /api/payments/process
  GET    /api/payments/history

Meetings:
  GET    /api/meetings
  POST   /api/meetings/schedule
  PUT    /api/meetings/:id
  DELETE /api/meetings/:id

Feedback:
  POST   /api/feedback
  GET    /api/feedback/:projectId
Database Schema (Overview)
-- PostgreSQL Database on Neon

-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  company_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'client',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projects
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'active',
  budget DECIMAL(10, 2),
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Milestones
CREATE TABLE milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  due_date DATE,
  status VARCHAR(50) DEFAULT 'pending',
  completion_percentage INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Messages (for chat)
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  attachments JSONB,
  read_status BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Files
CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  uploader_id UUID REFERENCES users(id) ON DELETE SET NULL,
  file_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_size BIGINT,
  file_type VARCHAR(100),
  version INTEGER DEFAULT 1,
  approval_status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Invoices
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  due_date DATE,
  paid_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(100),
  transaction_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'completed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Meetings
CREATE TABLE meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  meeting_link TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Feedback
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  milestone_id UUID REFERENCES milestones(id) ON DELETE SET NULL,
  client_id UUID REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comments TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_projects_client_id ON projects(client_id);
CREATE INDEX idx_milestones_project_id ON milestones(project_id);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_files_project_id ON files(project_id);
CREATE INDEX idx_invoices_project_id ON invoices(project_id);
CREATE INDEX idx_invoices_status ON invoices(status);
________________________________________
3. Real-Time Communication (WebSocket)
// WebSocket Service for Chat
class WebSocketService {
  constructor() {
    this.socket = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  connect(token) {
    this.socket = new WebSocket(`wss://api.brelinx.com/ws/chat?token=${token}`);
    
    this.socket.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
    };

    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.handleMessage(message);
    };

    this.socket.onclose = () => {
      this.handleReconnect();
    };
  }

  sendMessage(conversationId, content) {
    const message = {
      type: 'chat_message',
      conversation_id: conversationId,
      content: content,
      timestamp: new Date().toISOString()
    };
    
    this.socket.send(JSON.stringify(message));
  }

  handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      setTimeout(() => {
        this.reconnectAttempts++;
        this.connect(localStorage.getItem('authToken'));
      }, 2000 * this.reconnectAttempts);
    }
  }
}
________________________________________
4. Authentication Flow
1. User Login:
   Mobile App → POST /api/auth/login
   ↓
   Backend validates credentials
   ↓
   Returns: { token, refreshToken, user }
   ↓
   App stores tokens in localStorage
   ↓
   App navigates to Dashboard

2. API Requests:
   Every request includes: Authorization: Bearer {token}
   ↓
   Backend validates token
   ↓
   If expired: Use refreshToken to get new token
   ↓
   If refresh fails: Redirect to login

3. Token Refresh (Automatic):
   App checks token expiry before each request
   ↓
   If expiring soon: POST /api/auth/refresh-token
   ↓
   Update stored token
   ↓
   Continue with original request
________________________________________
5. File Upload Flow
1. User selects file
   ↓
2. App reads file (using Capacitor FileSystem API)
   ↓
3. Convert to Base64 or FormData
   ↓
4. POST /api/files/upload with metadata
   ↓
5. Backend uploads to AWS S3
   ↓
6. Backend saves file metadata to database
   ↓
7. Returns file URL and metadata
   ↓
8. App displays uploaded file
________________________________________
6. Push Notifications Architecture
Firebase Cloud Messaging (FCM)
   ↓
1. App registers device token on login
   ↓
2. Sends token to backend: POST /api/devices/register
   ↓
3. Backend stores: { user_id, device_token, platform }
   ↓
4. When event occurs (new message, payment due):
   Backend → FCM → User's Device
   ↓
5. App receives notification
   ↓
6. User taps notification
   ↓
7. App opens relevant page (deep linking)
________________________________________
7. Offline Support Strategy
// Service Worker for offline caching
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('brelinx-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/css/global.css',
        '/js/app.js',
        '/assets/logo.svg'
      ]);
    })
  );
});

// Offline data sync
class OfflineQueue {
  constructor() {
    this.queue = JSON.parse(localStorage.getItem('offlineQueue') || '[]');
  }

  add(request) {
    this.queue.push({
      url: request.url,
      method: request.method,
      body: request.body,
      timestamp: Date.now()
    });
    localStorage.setItem('offlineQueue', JSON.stringify(this.queue));
  }

  async sync() {
    if (navigator.onLine) {
      for (const request of this.queue) {
        try {
          await fetch(request.url, {
            method: request.method,
            body: request.body
          });
          // Remove from queue on success
          this.queue = this.queue.filter(r => r.timestamp !== request.timestamp);
        } catch (error) {
          console.error('Sync failed:', error);
        }
      }
      localStorage.setItem('offlineQueue', JSON.stringify(this.queue));
    }
  }
}
________________________________________
🔐 Security Architecture
Security Measures
1.	Authentication
o	JWT tokens with expiration
o	Refresh token rotation
o	Secure token storage (not in plain localStorage - consider encryption)
o	Biometric authentication option
2.	API Security
o	HTTPS only
o	Rate limiting
o	Input validation
o	CORS configuration
o	SQL injection prevention
3.	Data Protection
o	Encrypted file storage
o	Encrypted communication (TLS)
o	Secure payment processing (PCI compliance)
o	Regular security audits
4.	App Security
o	Certificate pinning
o	Jailbreak/Root detection
o	Code obfuscation
o	Secure key storage
________________________________________
📊 Performance Optimization
1.	Lazy Loading
o	Load pages only when needed
o	Defer non-critical JavaScript
o	Progressive image loading
2.	Caching Strategy
o	Service Worker for offline support
o	Cache API responses
o	Cache static assets
3.	Code Splitting
o	Separate page-specific JS files
o	Load features on demand
4.	Asset Optimization
o	Compress images
o	Minify CSS/JS
o	Use CDN for static assets
________________________________________
🚀 Deployment Architecture
Development:
  Local development → Ionic Serve
  ↓
  Hot reload for rapid development

Staging:
  Build app → Capacitor build
  ↓
  Deploy to TestFlight (iOS) / Internal Testing (Android)
  ↓
  QA Testing

Production:
  Final build → Capacitor build --prod
  ↓
  Code signing
  ↓
  App Store (iOS) / Play Store (Android)
  ↓
  Live app available to clients
________________________________________
📱 Platform-Specific Considerations
iOS
•	iOS 13+ support
•	App Store guidelines compliance
•	Push notification certificates
•	Apple Developer account
Android
•	Android 8.0+ support
•	Play Store guidelines compliance
•	Firebase integration for push notifications
•	Google Play Console account
Web (PWA)
•	Service Worker for offline
•	Add to Home Screen
•	Web manifest
•	Browser compatibility (Chrome, Safari, Firefox)