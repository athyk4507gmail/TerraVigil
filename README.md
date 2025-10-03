# TerraVigil - AI-Powered Mining Detection Website

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

A modern, production-ready website inspired by Palantir's design, built with Next.js, TypeScript, and TailwindCSS. Features advanced mining detection capabilities with interactive maps, 3D visualization, and AI-powered analysis.

## 🚀 Features

- **Modern Design**: Palantir-inspired dark theme with glass effects and cyber aesthetics
- **Interactive Dashboard**: Real-time mining statistics and monitoring
- **Geospatial Intelligence**: Interactive maps with legal/illegal mining detection
- **3D Terrain Analysis**: Immersive 3D visualization of mining pits
- **AI Analysis**: Upload satellite imagery for automated mining detection
- **Responsive Design**: Fully responsive across desktop, tablet, and mobile
- **Smooth Animations**: Framer Motion animations throughout
- **Dark/Light Mode**: Theme toggle support

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS with custom animations
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **3D Graphics**: Three.js
- **Maps**: Leaflet
- **UI Components**: Custom components with shadcn/ui patterns

## 📁 Project Structure

```
terravigil-website/
├── app/                          # Next.js App Router
│   ├── globals.css              # Global styles and TailwindCSS
│   ├── layout.tsx               # Root layout with providers
│   └── page.tsx                 # Home page
├── components/                   # Reusable components
│   ├── sections/                # Page sections
│   │   ├── hero-section.tsx     # Hero with animations
│   │   ├── dashboard-section.tsx # Intelligence dashboard
│   │   ├── map-section.tsx      # Geospatial intelligence
│   │   ├── 3d-section.tsx       # 3D terrain analysis
│   │   ├── analysis-section.tsx # AI mining analysis
│   │   ├── features-section.tsx # Feature showcase
│   │   ├── stats-section.tsx    # Statistics display
│   │   └── cta-section.tsx      # Call-to-action
│   ├── ui/                      # UI components
│   │   └── button.tsx           # Button component
│   ├── navbar.tsx               # Navigation bar
│   ├── footer.tsx               # Footer
│   ├── theme-provider.tsx       # Theme context
│   └── theme-toggle.tsx         # Theme switcher
├── lib/                         # Utilities
│   └── utils.ts                 # Helper functions
├── public/                      # Static assets
│   └── grid.svg                 # Background pattern
├── package.json                 # Dependencies
├── tailwind.config.js           # TailwindCSS config
├── tsconfig.json                # TypeScript config
└── next.config.js               # Next.js config
```

## 🎨 Customization Guide

### Content Customization

#### 1. **Text Content**
- **Hero Section**: Edit `components/sections/hero-section.tsx`
  - Main headline and subtitle
  - CTA button text
  - Feature pills

- **Dashboard**: Edit `components/sections/dashboard-section.tsx`
  - Statistics values
  - Location information
  - Status indicators

- **Features**: Edit `components/sections/features-section.tsx`
  - Feature descriptions
  - Icons and colors

#### 2. **Images and Assets**
- **Logo**: Replace in `components/navbar.tsx` and `components/footer.tsx`
- **Background**: Update `public/grid.svg` or modify CSS in `app/globals.css`
- **Icons**: Replace Lucide React icons throughout components

#### 3. **Colors and Branding**
- **Primary Colors**: Update in `tailwind.config.js`
  - Blue gradient: `from-blue-600 to-cyan-600`
  - Accent colors for different sections
- **Theme**: Modify CSS variables in `app/globals.css`

#### 4. **Navigation**
- **Menu Items**: Edit `navItems` array in `components/navbar.tsx`
- **Footer Links**: Update `footerLinks` object in `components/footer.tsx`

### Technical Customization

#### 1. **Animations**
- **Framer Motion**: Modify animation props in section components
- **Custom Animations**: Add to `tailwind.config.js` keyframes

#### 2. **Layout**
- **Sections**: Add/remove sections in `app/page.tsx`
- **Spacing**: Adjust padding/margins in TailwindCSS classes

#### 3. **Functionality**
- **File Upload**: Implement in `components/sections/analysis-section.tsx`
- **Map Integration**: Add real Leaflet map in `components/sections/map-section.tsx`
- **3D Visualization**: Enhance Three.js scene in `components/sections/3d-section.tsx`

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd terravigil-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
npm run build
npm start
```

## 🎯 Key Features Explained

### 1. **Hero Section**
- Animated background with floating elements
- Gradient text effects
- Smooth scroll indicators
- Responsive CTA buttons

### 2. **Dashboard**
- Real-time statistics display
- Location information
- Status indicators with color coding
- Interactive elements

### 3. **Map Section**
- Interactive map placeholder
- Location markers
- Layer controls
- Legend display

### 4. **3D Section**
- 3D terrain visualization
- Mining pit markers
- Interactive controls
- Statistics overlay

### 5. **Analysis Section**
- File upload interface
- Analysis options
- Progress tracking
- Results display

## 🔧 Advanced Customization

### Adding New Sections
1. Create component in `components/sections/`
2. Add to `app/page.tsx`
3. Update navigation in `components/navbar.tsx`

### Styling Modifications
- **Colors**: Update CSS variables in `app/globals.css`
- **Animations**: Modify TailwindCSS config
- **Layout**: Adjust component structure

### Functionality Extensions
- **API Integration**: Add fetch calls in components
- **State Management**: Implement React Context or Redux
- **Database**: Connect to backend services

## 📱 Responsive Design

The website is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

## 🌙 Dark/Light Mode

Theme switching is implemented with:
- `next-themes` for theme management
- CSS variables for color schemes
- Smooth transitions between modes

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
# Deploy to Vercel
```

### Other Platforms
- **Netlify**: Build and deploy
- **AWS**: Use Amplify or S3
- **Docker**: Create Dockerfile

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📞 Support

For questions or support:
- Email: contact@terravigil.com
- Documentation: `/docs`
- Issues: GitHub Issues

---

**Built with ❤️ using Next.js, TypeScript, and TailwindCSS**