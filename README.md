# Union Wages Map

An interactive web application that displays labor union wages and benefits across the United States. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Interactive USA Map**: Clean, realistic map using react-simple-maps with proper state boundaries
- **Union Data Visualization**: Color-coded markers showing wage levels across different locations
- **Advanced Filtering**: Filter by trade type, state, and wage ranges
- **Detailed Union Information**: Hover cards and modal dialogs with comprehensive union details
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Statistics**: Dynamic calculations based on filtered data

## Map Implementation

The map uses [react-simple-maps](https://github.com/zcreativelabs/react-simple-maps) with:
- **USA TopoJSON Data**: High-quality geographic data from us-atlas
- **Proper Projection**: Albers USA projection for accurate representation
- **Interactive Features**: Zoom, pan, and hover interactions
- **Color-coded Markers**: Wage levels represented by different colors
- **Responsive Design**: Adapts to different screen sizes

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Maps**: react-simple-maps
- **Icons**: Lucide React
- **Package Manager**: pnpm

## Getting Started

First, install dependencies:

```bash
pnpm install
```

Then, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── union-map.tsx   # Main map component
│   ├── union-filters.tsx # Filter controls
│   └── union-modal.tsx # Union detail modal
├── lib/                # Utility functions and data
│   └── union-data.ts   # Sample union data
└── types/              # TypeScript type definitions
    └── union.ts        # Union data types
```

## Data Structure

The application uses a comprehensive Union interface that includes:
- Basic information (name, location, contact details)
- Wage data (base wage, fringe benefits, total package)
- Trade classification and jurisdiction
- Member count and establishment date
- Benefits information

## Contributing

This project is open to contributions. Please ensure all code follows the existing patterns and includes proper TypeScript types.

## License

This project is licensed under the MIT License.
