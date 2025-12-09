# VOR Tutor

A modern, interactive web application to help student pilots learn VOR (VHF Omnidirectional Range) navigation.

[https://github.com/nlevites/vor-tutor/issues/1#issue-3708601309
](https://private-user-images.githubusercontent.com/104597553/524019931-ffa6101e-b37a-44d6-aa7d-dc600087aa96.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NjUyNDA4ODYsIm5iZiI6MTc2NTI0MDU4NiwicGF0aCI6Ii8xMDQ1OTc1NTMvNTI0MDE5OTMxLWZmYTYxMDFlLWIzN2EtNDRkNi1hYTdkLWRjNjAwMDg3YWE5Ni5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjUxMjA5JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI1MTIwOVQwMDM2MjZaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT1kYWYyYjQxNGI2OGQzYTNmMzFjZjM4ZjM1NGJkODQ4ODQ4MGQzNGY1NzhiNzUwZjIwYmQ5ZDk1ZDg4M2IzYTY2JlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9.JWID9FLINngB2aO7t1IpL1_qHllNx0hI0j1DeNPChLM)
## Features

- **Interactive VOR Instrument**: Realistic simulation of VOR receiver with OBS and CDI
- **Live Map Display**: Visual representation of aircraft position relative to VOR stations
- **Practice Scenarios**: Guided exercises for different VOR navigation techniques
- **Educational Content**: Comprehensive tutorials on VOR theory and usage
- **Modern UI**: Clean, responsive design optimized for all devices

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom aviation-themed components
- **State Management**: Zustand for lightweight, efficient state handling
- **Animations**: Framer Motion for smooth, professional interactions
- **Icons**: Lucide React and Heroicons for modern iconography

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd vor-tutor

# Install dependencies
npm install

# Start development server
npm run dev
```

### Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## VOR Navigation Concepts

This application teaches the fundamental concepts of VOR navigation:

- **VOR Stations**: Ground-based radio navigation aids broadcasting on specific frequencies
- **Radials**: 360 degree lines extending from a VOR station
- **OBS (Omnibearing Selector)**: Allows pilot to select desired course
- **CDI (Course Deviation Indicator)**: Shows aircraft position relative to selected course
- **TO/FROM Flag**: Indicates whether the selected course leads to or from the VOR station

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## License

MIT License - see LICENSE file for details.
