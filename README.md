
<<<<<<< HEAD
A modern, responsive client portal built with vanilla JavaScript, HTML, and CSS.

## 🚀 Live Demo

Visit the live application: [https://yourusername.github.io/Brelinx-Connect/](https://yourusername.github.io/Brelinx-Connect/)

## 📱 Features

- **Responsive Design**: Optimized for all devices and screen sizes
- **Mobile-First**: Prevents zoom on input focus, handles virtual keyboards
- **Authentication Flow**: Login, Register, and Password Reset pages
- **Modern UI**: Clean, professional design following Brelinx design system
- **Single Page Application**: Client-side routing with smooth transitions

## 🛠️ GitHub Pages Setup

This project is configured to work with GitHub Pages out of the box.

### Automatic Deployment

1. **Fork or clone this repository**
2. **Go to your repository settings**
3. **Navigate to "Pages" section**
4. **Set source to "Deploy from a branch"**
5. **Select "main" branch and "/ (root)" folder**
6. **Click "Save"**

Your site will be available at: `https://yourusername.github.io/repository-name/`

### Troubleshooting

**If you get "GitHub Actions" errors:**
- Use the "Deploy from a branch" method instead (simpler and more reliable)
- Make sure your repository is public or you have GitHub Pro for private repos
- Wait 2-3 minutes after enabling Pages for the first deployment

**If logos don't show:**
- Check that `src/assets/images/logo.png` exists
- Verify all paths in auth pages use `src/assets/images/logo.png`
- Clear browser cache and refresh

### Manual Setup

If you prefer manual setup:

1. Ensure `index.html` is in the root directory ✅
2. All assets are properly referenced with `src/` prefix ✅
3. No server-side dependencies ✅
4. All paths are relative ✅

## 📁 Project Structure

```
Brelinx-Connect/
├── index.html                 # Main entry point (GitHub Pages serves this)
├── src/
│   ├── assets/
│   │   └── images/
│   │       └── logo.png
│   ├── css/
│   │   ├── variables.css
│   │   ├── global.css
│   │   └── components/
│   ├── js/
│   │   ├── app.js
│   │   ├── router.js
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   ├── pages/
│   │   └── auth/
│   │       ├── login.html
│   │       ├── register.html
│   │       └── reset-password.html
│   └── manifest.json
└── README.md
```

## 🎨 Design System

- **Primary Color**: #2d8a5f (Monochromatic Green)
- **Typography**: System fonts (-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto)
- **Responsive Breakpoints**: 480px, 768px, 1024px
- **Mobile Optimized**: 16px font-size prevents iOS zoom

## 📱 Mobile Features

- **Viewport Optimization**: Prevents unwanted zooming
- **Virtual Keyboard Handling**: Smooth input focus and scrolling
- **Touch-Friendly**: Proper touch targets and gestures
- **Orientation Support**: Works in both portrait and landscape

## 🔧 Development

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/Brelinx-Connect.git
   cd Brelinx-Connect
   ```

2. **Serve locally**
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using Live Server (VS Code extension)
   # Right-click index.html -> "Open with Live Server"
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

### File Structure Notes

- **index.html**: Root entry point for GitHub Pages
- **src/**: Contains all source files
- **Routing**: Hash-based routing (#/auth/login, #/dashboard, etc.)
- **Assets**: All images and static files in src/assets/

## 🌐 Browser Support

- **Chrome**: ✅ Latest 2 versions
- **Firefox**: ✅ Latest 2 versions  
- **Safari**: ✅ Latest 2 versions
- **Edge**: ✅ Latest 2 versions
- **Mobile Safari**: ✅ iOS 12+
- **Chrome Mobile**: ✅ Android 8+

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on multiple devices
5. Submit a pull request

---

**Note**: This is a client-side only application. For production use, you'll need to implement proper backend authentication and API endpoints.
=======
>>>>>>> 565ab165299ce4e09f483d43bb50b08830a4dd00
