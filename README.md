# QR Code Generator

A modern, customizable QR code generator built with Next.js 15 and the App Router. This project was created as a learning exercise to explore Next.js App Router features while building a practical utility application.

## ✨ Features

- **Real-time QR Code Generation**: Generate QR codes instantly as you type
- **Customizable Colors**: Choose custom background and foreground colors
- **Watermark Support**: Add custom watermark images to your QR codes
- **Download Functionality**: Download generated QR codes as PNG images with hover-to-reveal download button
- **Responsive Design**: Modern UI built with Tailwind CSS and shadcn/ui components
- **TypeScript**: Fully typed for better development experience

## 🚀 Demo

Enter any text or URL to generate a QR code. Customize colors and add watermarks to make it your own!

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (built on Radix UI)
- **QR Generation**: qrcode library with HTML5 Canvas
- **Icons**: Lucide React

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd qrcode-generator
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
bun install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🎯 Usage

1. **Enter Content**: Type any text or URL in the input field
2. **Customize Colors**: Use the color pickers to change background and foreground colors
3. **Add Watermark** (optional): Enter an image URL to add a watermark to the center of your QR code
4. **Download**: Hover over the generated QR code and click the download button to save as PNG

## 🏗️ Project Structure

```
src/
├── app/
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/
│   ├── home/
│   │   ├── Page.tsx      # Main page component
│   │   └── QRCode.tsx    # QR code generator component
│   └── ui/               # shadcn/ui components
│       ├── button.tsx
│       ├── input.tsx
│       └── label.tsx
└── lib/
    └── utils.ts          # Utility functions
```

## 🎨 Customization

The QR code component accepts several props for customization:

```tsx
interface QRCodeProps {
  value: string;                              // Text/URL to encode
  size?: number;                              // Size in pixels (default: 300)
  bgColor?: string;                           // Background color (default: #ffffff)
  fgColor?: string;                           // Foreground color (default: #000000)
  watermarkImage?: string;                    // Watermark image URL
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H'; // Error correction level
}
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📚 Learning Objectives

This project explores:

- **Next.js App Router**: File-based routing, layouts, and server components
- **React Hooks**: useState, useEffect, useRef for state management
- **Canvas API**: HTML5 Canvas for QR code rendering and image manipulation
- **TypeScript**: Type safety and interfaces
- **Modern CSS**: Tailwind CSS utilities and component composition
- **Component Architecture**: Reusable UI components with shadcn/ui

## 🤝 Contributing

This is a learning project, but contributions are welcome! Feel free to:

- Report bugs
- Suggest new features
- Submit pull requests
- Share feedback

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [qrcode](https://github.com/soldair/node-qrcode) - QR code generation library
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Next.js](https://nextjs.org/) - The React framework for production
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
