# Apna Journey - Gaya's Local Jobs & News Platform

A comprehensive Next.js platform built specifically for the Gaya community, providing local job opportunities and news updates.

## 🌟 Features

### For Job Seekers
- Browse local job opportunities in Gaya and nearby areas
- Advanced filtering by category, job type, location, and salary
- Easy job application process with resume upload
- User dashboard to track applications
- Job alerts and notifications

### For Employers
- Post job openings for free
- Manage job postings from dashboard
- Review and manage applications
- Company profile management

### For News Readers
- Latest news from Gaya and Bihar
- Bilingual content (English & Hindi)
- Category-based news filtering
- Featured articles and trending news
- Mobile-responsive design

### Admin Panel
- Complete content management system
- User and job moderation
- News article creation and editing
- Analytics and statistics dashboard
- Email notifications system

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens with bcrypt
- **File Storage**: Cloudinary for images
- **Email**: Nodemailer with Gmail SMTP
- **UI Components**: Lucide React icons, Custom components

## 📁 Project Structure

```
apna-journey/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (frontend)/         # Public pages
│   │   ├── admin/              # Admin panel
│   │   └── api/                # API routes
│   ├── components/             # React components
│   │   ├── frontend/           # Public components
│   │   ├── admin/              # Admin components
│   │   └── shared/             # Shared components
│   ├── lib/                    # Utilities and configurations
│   │   ├── constants/          # App constants
│   │   ├── db/                 # Database connection
│   │   ├── middleware/         # Auth middleware
│   │   ├── models/             # Mongoose models
│   │   ├── services/           # External services
│   │   └── utils/              # Utility functions
│   ├── types/                  # TypeScript type definitions
│   └── hooks/                  # Custom React hooks
├── scripts/                    # Database seeding
└── public/                     # Static assets
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- Gmail account for email service
- Cloudinary account for image storage

### 1. Clone the Repository
```bash
git clone <repository-url>
cd apna-journey
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/apna-journey
# or MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/apna-journey

# JWT Secrets
JWT_SECRET=your-super-secret-jwt-key-here-min-32-chars
ADMIN_JWT_SECRET=your-admin-jwt-secret-here-min-32-chars

# Cloudinary (for image storage)
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name

# Email (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# App Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-min-32-chars
```

### 4. Database Setup
```bash
# Seed the database with sample data
npm run seed
```

### 5. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 📊 Database Seeding

The seed script creates sample data including:
- Admin user (admin@apnajourney.com / admin123)
- Regular users with different roles
- Sample job postings
- News articles in English and Hindi
- Job applications

## 🔐 Default Login Credentials

### Admin Panel
- **Email**: admin@apnajourney.com
- **Password**: admin123

### Regular Users
- **Email**: rajesh@example.com
- **Password**: password123

## 🎨 Key Features Implementation

### Authentication System
- JWT-based authentication for users and admins
- Password hashing with bcrypt
- Protected routes and middleware
- Role-based access control

### Job Management
- CRUD operations for job postings
- Advanced filtering and search
- Application tracking system
- Admin moderation workflow

### News System
- Multi-language support (English/Hindi)
- Category-based organization
- Featured articles
- SEO optimization

### Admin Dashboard
- Real-time statistics
- Content management
- User management
- Activity monitoring

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables
4. Deploy

### Other Platforms
- Ensure Node.js 18+ support
- Set up MongoDB connection
- Configure environment variables
- Build and deploy

## 📱 Mobile Responsiveness

The platform is fully responsive and optimized for:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🔧 Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run seed         # Seed database with sample data
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Contact: support@apnajourney.com

## 🎯 Future Enhancements

- [ ] Real-time notifications
- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] Payment integration
- [ ] Multi-language support expansion
- [ ] Social media integration
- [ ] Job recommendation system
- [ ] Company profiles
- [ ] Event management
- [ ] Community forums

---

**Built with ❤️ for the Gaya community**