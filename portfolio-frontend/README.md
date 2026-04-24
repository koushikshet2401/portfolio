# 🚀 Portfolio Frontend (Next.js)

Modern full-stack portfolio built with Next.js 14, featuring smooth animations and dynamic content management.

## ✨ Features

- **Client-Side Portfolio**: Beautiful, animated portfolio with smooth scrolling (Lenis) and 3D effects (Three.js)
- **Admin Panel**: Full-featured dashboard for managing projects, messages, and profile
- **Dynamic Content**: All content fetched from backend API
- **Visitor Tracking**: Track and analyze visitor behavior
- **Authentication**: Secure JWT-based admin access
- **Responsive Design**: Works perfectly on all devices

## 📁 Project Structure

```
portfolio-frontend/
├── app/                    # Next.js App Router pages
│   ├── layout.js          # Root layout
│   ├── page.js            # Homepage
│   └── admin/             # Admin panel pages
│       ├── layout.js
│       ├── page.js        # Dashboard
│       ├── projects/      # Projects management
│       ├── messages/      # Messages inbox
│       ├── profile/       # Profile editor
│       └── login/         # Admin login
├── components/
│   ├── layout/            # Navbar, ThemeToggle
│   ├── sections/          # Hero, About, Skills, etc.
│   ├── animations/        # ThreeBackground, SmoothScroll
│   └── admin/             # Admin components
├── lib/
│   ├── api.js             # API client
│   └── tracking.js        # Visitor tracking
├── public/                # Static assets
│   ├── imgs/             # Images (ADD YOUR IMAGES HERE)
│   ├── certificates/     # Certificates (ADD YOUR CERTIFICATES HERE)
│   └── resume/           # Resume PDF (ADD YOUR RESUME HERE)
└── styles/
    ├── globals.css        # Main styles
    └── admin.css          # Admin panel styles
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- Backend API running (see backend folder)

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Add Your Assets**
   ```bash
   # Add your images to public/imgs/
   # Add your certificates to public/certificates/
   # Add your resume PDF to public/resume/
   ```

3. **Configure Environment**
   ```bash
   # Edit .env.local file
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

5. **Open Browser**
   ```
   Portfolio: http://localhost:3000
   Admin Panel: http://localhost:3000/admin/login
   ```

## 🎨 Customization

### Update Your Information

1. **Images**: Replace images in `/public/imgs/`
   - `gib.jpg` - Your profile photo
   - Project screenshots

2. **Certificates**: Add certificates to `/public/certificates/`

3. **Resume**: Add your resume PDF to `/public/resume/`

### Update Content

All content is managed through the admin panel once the backend is running:
- Projects: `/admin/projects`
- Profile: `/admin/profile`
- Messages: `/admin/messages`

## 🔧 Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Set Environment Variables**
   - Go to Vercel Dashboard
   - Add environment variables:
     - `NEXT_PUBLIC_API_URL`: Your backend API URL
     - `NEXT_PUBLIC_SITE_URL`: Your frontend URL

4. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## 📋 Admin Panel

### Access Admin Panel

1. Go to `http://localhost:3000/admin/login`
2. Enter admin credentials (configured in backend)
3. Access dashboard features:
   - **Dashboard**: View statistics
   - **Projects**: Add/Edit/Delete projects
   - **Messages**: View contact messages
   - **Profile**: Edit your profile information

### Default Admin Credentials

Set in backend `.env` file:
```
ADMIN_EMAIL=admin@youremail.com
ADMIN_PASSWORD_HASH=<bcrypt_hash>
```

## 🎯 Features in Detail

### Animations
- **Three.js**: 250 white particles, 8 colored shapes
- **Lenis**: Smooth scroll with 1.0s duration
- **Optimized**: 45fps cap, smart pause on fast scroll

### API Integration
- All projects loaded from backend
- Contact form submits to backend
- Visitor tracking automatic
- Admin CRUD operations

### Visitor Tracking
- Unique visitor ID (UUID)
- Stored in localStorage + cookies
- Tracks page visits
- Analytics in admin dashboard

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Animations**: Three.js, Lenis
- **API**: Axios
- **Styling**: Custom CSS
- **Icons**: Font Awesome
- **Fonts**: Google Fonts (Inter, Space Grotesk)

## 📝 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## 🔍 Troubleshooting

### Images Not Loading
- Check that images are in `/public/imgs/`
- Ensure correct file names in code
- Restart dev server

### API Calls Failing
- Verify backend is running
- Check `.env.local` has correct `NEXT_PUBLIC_API_URL`
- Check CORS settings in backend

### Animations Not Working
- Clear browser cache
- Check Three.js console errors
- Verify Lenis library loaded

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Three.js Documentation](https://threejs.org/docs)
- [Lenis GitHub](https://github.com/studio-freight/lenis)

## 🤝 Support

If you encounter issues:
1. Check the troubleshooting section
2. Review backend connection
3. Check browser console for errors

## 📄 License

This project is for personal portfolio use.

---

**Built with ❤️ using Next.js 14**
