# React Frontend Structure for Business Directory

```
react/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── vite.svg
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── common/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Loading.jsx
│   │   │   ├── ErrorMessage.jsx
│   │   │   └── SearchBar.jsx
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx
│   │   │   ├── RegisterForm.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── company/
│   │   │   ├── CompanyCard.jsx
│   │   │   ├── CompanyList.jsx
│   │   │   ├── CompanyForm.jsx
│   │   │   ├── CompanyDetails.jsx
│   │   │   └── CompanySearch.jsx
│   │   ├── service/
│   │   │   ├── ServiceCard.jsx
│   │   │   ├── ServiceList.jsx
│   │   │   ├── ServiceForm.jsx
│   │   │   └── ServiceDetails.jsx
│   │   ├── blog/
│   │   │   ├── BlogCard.jsx
│   │   │   ├── BlogList.jsx
│   │   │   ├── BlogForm.jsx         # SuperAdmin only
│   │   │   ├── BlogDetails.jsx
│   │   │   └── BlogComments.jsx
│   │   └── dashboard/
│   │       ├── DashboardSidebar.jsx
│   │       ├── StatsCard.jsx
│   │       ├── UserManagement.jsx   # SuperAdmin only
│   │       └── CompanyManagement.jsx
│   ├── pages/               # Main page components
│   │   ├── Home.jsx
│   │   ├── Companies.jsx
│   │   ├── CompanyDetail.jsx
│   │   ├── Services.jsx
│   │   ├── ServiceDetail.jsx
│   │   ├── Blogs.jsx
│   │   ├── BlogDetail.jsx
│   │   ├── Auth/
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   └── Dashboard/
│   │       ├── DashboardHome.jsx
│   │       ├── MyCompanies.jsx      # Owner only
│   │       ├── MyServices.jsx       # Owner only
│   │       ├── BlogManagement.jsx   # SuperAdmin only
│   │       └── UserManagement.jsx   # SuperAdmin only
│   ├── services/            # API service functions
│   │   ├── api.js           # Base API configuration
│   │   ├── authService.js   # Authentication APIs
│   │   ├── companyService.js
│   │   ├── serviceService.js
│   │   ├── blogService.js
│   │   └── userService.js
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.js
│   │   ├── useApi.js
│   │   ├── useCompanies.js
│   │   ├── useBlogs.js
│   │   └── useLocalStorage.js
│   ├── context/             # React Context for state
│   │   ├── AuthContext.jsx
│   │   ├── CompanyContext.jsx
│   │   └── ThemeContext.jsx
│   ├── utils/               # Utility functions
│   │   ├── formatters.js    # Date, currency formatters
│   │   ├── validators.js    # Form validation
│   │   ├── constants.js     # App constants
│   │   └── helpers.js       # General helper functions
│   ├── styles/              # CSS/Styling
│   │   ├── globals.css
│   │   ├── components.css
│   │   ├── pages.css
│   │   └── variables.css
│   ├── assets/              # Static assets
│   │   ├── images/
│   │   │   ├── logo.png
│   │   │   ├── placeholder.jpg
│   │   │   └── icons/
│   │   └── fonts/
│   ├── App.jsx              # Main App component
│   ├── main.jsx             # Entry point
│   └── router.jsx           # Route configuration
├── package.json
├── vite.config.js
├── index.html
└── README.md
```

## 🎨 **Page Breakdown:**

### **Public Pages (No Auth Required):**
1. **Home** - Hero section, featured companies, recent blogs
2. **Companies** - Browse/search companies with filters
3. **Company Detail** - Company info, services, contact
4. **Services** - Browse all services/products
5. **Service Detail** - Individual service details
6. **Blogs** - Public blog listing
7. **Blog Detail** - Read blog posts and comments
8. **Login/Register** - Authentication forms

### **Protected Pages (Auth Required):**

#### **For All Users:**
- **Profile** - User profile management
- **Comments** - Manage own comments

#### **For Owners:**
- **Dashboard** - Owner overview
- **My Companies** - Manage owned companies
- **My Services** - Manage company services
- **Company Analytics** - View company stats

#### **For SuperAdmins:**
- **Admin Dashboard** - System overview
- **Blog Management** - Create/edit/delete blogs
- **User Management** - Manage all users
- **System Settings** - Platform configuration

## 🔧 **Key Features by Role:**

### **Public Users:**
- Browse companies and services
- Read blogs and add comments
- Search and filter functionality
- Contact companies

### **Regular Users:**
- All public features
- Comment on blogs
- Manage profile

### **Owners:**
- Manage their companies
- Add/edit services
- View company analytics
- Respond to inquiries

### **SuperAdmins:**
- Full blog management
- User management
- System oversight
- Platform analytics

## 📱 **Responsive Design:**
- Mobile-first approach
- Tablet and desktop layouts
- Touch-friendly navigation
- Optimized loading

Would you like me to start creating any specific part of this structure or help you plan the implementation order?
