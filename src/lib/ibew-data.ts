import { Union, UnionTrade } from '@/types/union'

// IBEW Electrician wage data from unionpayscales.com
export const ibewData: Union[] = [
  {
    id: 'ibew-local-1',
    name: 'IBEW Local 1',
    shortName: 'IBEW Local 1',
    city: 'St. Louis',
    state: 'MO',
    lat: 38.6270,
    lng: -90.1994,
    baseWage: 47.04,
    fringeBenefits: 31.48, // Total package - base wage
    totalPackage: 78.52,
    members: 8500, // Estimated
    logoPath: '/union-logos/placeholder.png', // Will be overridden by helper function
    description: 'IBEW Local 1 represents electrical workers in the St. Louis metropolitan area.',
    trade: UnionTrade.ELECTRICAL,
    established: 1891,
    jurisdiction: 'St. Louis metropolitan area',
    contactInfo: {
      phone: '(314) 644-4700',
      address: '5850 Elizabeth Ave, St. Louis, MO 63110'
    },
    benefits: {
      healthInsurance: true,
      pension: true,
      vacation: 10,
      apprenticeship: true
    }
  },
  {
    id: 'ibew-local-3',
    name: 'IBEW Local 3',
    shortName: 'IBEW Local 3',
    city: 'New York City',
    state: 'NY',
    lat: 40.7128,
    lng: -74.0060,
    baseWage: 62.00,
    fringeBenefits: 53.78, // Total package - base wage
    totalPackage: 115.78,
    members: 27000,
    logoPath: '/union-logos/ibew-logo.png',
    description: 'The largest electrical workers union in NYC, representing electricians in construction, maintenance, and telecommunications.',
    trade: UnionTrade.ELECTRICAL,
    established: 1896,
    jurisdiction: 'New York City, Westchester, Putnam, Dutchess, Orange, Rockland, and Sullivan Counties',
    contactInfo: {
      phone: '(212) 227-3800',
      email: 'info@ibewlocal3.org',
      address: '158-11 Harry Van Arsdale Jr Ave, Flushing, NY 11365'
    },
    benefits: {
      healthInsurance: true,
      pension: true,
      vacation: 15,
      apprenticeship: true
    }
  },
  {
    id: 'ibew-local-5',
    name: 'IBEW Local 5',
    shortName: 'IBEW Local 5',
    city: 'Pittsburgh',
    state: 'PA',
    lat: 40.4406,
    lng: -79.9959,
    baseWage: 48.11,
    fringeBenefits: 32.84, // Total package - base wage
    totalPackage: 80.95,
    members: 12000, // Estimated
    logoPath: '/union-logos/ibew-logo.png',
    description: 'IBEW Local 5 represents electrical workers in the Pittsburgh metropolitan area.',
    trade: UnionTrade.ELECTRICAL,
    established: 1891,
    jurisdiction: 'Pittsburgh metropolitan area',
    contactInfo: {
      phone: '(412) 321-4200',
      address: '5 Hot Metal St, Pittsburgh, PA 15203'
    },
    benefits: {
      healthInsurance: true,
      pension: true,
      vacation: 12,
      apprenticeship: true
    }
  },
  {
    id: 'ibew-local-6',
    name: 'IBEW Local 6',
    shortName: 'IBEW Local 6',
    city: 'San Francisco',
    state: 'CA',
    lat: 37.7749,
    lng: -122.4194,
    baseWage: 91.25,
    fringeBenefits: 43.59, // Total package - base wage
    totalPackage: 134.84,
    members: 15000, // Estimated
    logoPath: '/union-logos/ibew-logo.png',
    description: 'IBEW Local 6 represents electrical workers in the San Francisco Bay Area.',
    trade: UnionTrade.ELECTRICAL,
    established: 1896,
    jurisdiction: 'San Francisco Bay Area',
    contactInfo: {
      phone: '(415) 621-2491',
      address: '1660 Mission St, San Francisco, CA 94103'
    },
    benefits: {
      healthInsurance: true,
      pension: true,
      vacation: 15,
      apprenticeship: true
    }
  },
  {
    id: 'ibew-local-7',
    name: 'IBEW Local 7',
    shortName: 'IBEW Local 7',
    city: 'Springfield',
    state: 'MA',
    lat: 42.1015,
    lng: -72.5898,
    baseWage: 52.16,
    fringeBenefits: 34.54, // Total package - base wage
    totalPackage: 86.70,
    members: 3500, // Estimated
    logoPath: '/union-logos/ibew-logo.svg',
    description: 'IBEW Local 7 represents electrical workers in the Springfield, Massachusetts area.',
    trade: UnionTrade.ELECTRICAL,
    established: 1896,
    jurisdiction: 'Springfield metropolitan area',
    contactInfo: {
      phone: '(413) 781-1500',
      address: '95 Industry Ave, Springfield, MA 01104'
    },
    benefits: {
      healthInsurance: true,
      pension: true,
      vacation: 12,
      apprenticeship: true
    }
  },
  {
    id: 'ibew-local-8',
    name: 'IBEW Local 8',
    shortName: 'IBEW Local 8',
    city: 'Toledo',
    state: 'OH',
    lat: 41.6528,
    lng: -83.5379,
    baseWage: 51.04,
    fringeBenefits: 21.25, // Total package - base wage
    totalPackage: 72.29,
    members: 2800, // Estimated
    logoPath: '/union-logos/ibew-logo.svg',
    description: 'IBEW Local 8 represents electrical workers in the Toledo metropolitan area.',
    trade: UnionTrade.ELECTRICAL,
    established: 1896,
    jurisdiction: 'Toledo metropolitan area',
    contactInfo: {
      phone: '(419) 243-8161',
      address: '1946 S Byrne Rd, Toledo, OH 43614'
    },
    benefits: {
      healthInsurance: true,
      pension: true,
      vacation: 10,
      apprenticeship: true
    }
  },
  {
    id: 'ibew-local-11',
    name: 'IBEW Local 11',
    shortName: 'IBEW Local 11',
    city: 'Los Angeles',
    state: 'CA',
    lat: 34.0522,
    lng: -118.2437,
    baseWage: 63.50,
    fringeBenefits: 35.75, // Total package - base wage
    totalPackage: 99.25,
    members: 18000, // Estimated
    logoPath: '/union-logos/ibew-logo.svg',
    description: 'IBEW Local 11 represents electrical workers in the Los Angeles metropolitan area.',
    trade: UnionTrade.ELECTRICAL,
    established: 1896,
    jurisdiction: 'Los Angeles metropolitan area',
    contactInfo: {
      phone: '(213) 749-9111',
      address: '6029 W Pico Blvd, Los Angeles, CA 90035'
    },
    benefits: {
      healthInsurance: true,
      pension: true,
      vacation: 15,
      apprenticeship: true
    }
  },
  {
    id: 'ibew-local-12',
    name: 'IBEW Local 12',
    shortName: 'IBEW Local 12',
    city: 'Pueblo',
    state: 'CO',
    lat: 38.2544,
    lng: -104.6091,
    baseWage: 31.90,
    fringeBenefits: 13.86, // Total package - base wage
    totalPackage: 45.76,
    members: 1200, // Estimated
    logoPath: '/union-logos/ibew-logo.svg',
    description: 'IBEW Local 12 represents electrical workers in the Pueblo, Colorado area.',
    trade: UnionTrade.ELECTRICAL,
    established: 1896,
    jurisdiction: 'Pueblo metropolitan area',
    contactInfo: {
      phone: '(719) 543-8000',
      address: 'Pueblo, CO'
    },
    benefits: {
      healthInsurance: true,
      pension: true,
      vacation: 10,
      apprenticeship: true
    }
  },
  {
    id: 'ibew-local-13',
    name: 'IBEW Local 13',
    shortName: 'IBEW Local 13',
    city: 'Burlington',
    state: 'IA',
    lat: 40.8075,
    lng: -91.1128,
    baseWage: 40.02,
    fringeBenefits: 20.58, // Total package - base wage
    totalPackage: 60.60,
    members: 1800, // Estimated
    logoPath: '/union-logos/ibew-logo.svg',
    description: 'IBEW Local 13 represents electrical workers in the Burlington, Iowa area.',
    trade: UnionTrade.ELECTRICAL,
    established: 1896,
    jurisdiction: 'Burlington metropolitan area',
    contactInfo: {
      phone: '(319) 754-8000',
      address: 'Burlington, IA'
    },
    benefits: {
      healthInsurance: true,
      pension: true,
      vacation: 10,
      apprenticeship: true
    }
  },
  {
    id: 'ibew-local-1547',
    name: 'IBEW Local 1547',
    shortName: 'IBEW Local 1547',
    city: 'Anchorage',
    state: 'AK',
    lat: 61.2181,
    lng: -149.9003,
    baseWage: 53.44,
    fringeBenefits: 29.32, // Total package - base wage
    totalPackage: 82.76,
    members: 3200, // Estimated
    logoPath: '/union-logos/ibew-logo.svg',
    description: 'IBEW Local 1547 represents electrical workers in Alaska.',
    trade: UnionTrade.ELECTRICAL,
    established: 1946,
    jurisdiction: 'State of Alaska',
    contactInfo: {
      phone: '(907) 272-6571',
      address: '3333 Denali St, Anchorage, AK 99503'
    },
    benefits: {
      healthInsurance: true,
      pension: true,
      vacation: 15,
      apprenticeship: true
    }
  },
  {
    id: 'ibew-local-1579',
    name: 'IBEW Local 1579',
    shortName: 'IBEW Local 1579',
    city: 'Augusta',
    state: 'GA',
    lat: 33.4735,
    lng: -82.0105,
    baseWage: 33.75,
    fringeBenefits: 17.05, // Total package - base wage
    totalPackage: 50.80,
    members: 2100, // Estimated
    logoPath: '/union-logos/ibew-logo.svg',
    description: 'IBEW Local 1579 represents electrical workers in the Augusta, Georgia area.',
    trade: UnionTrade.ELECTRICAL,
    established: 1946,
    jurisdiction: 'Augusta metropolitan area',
    contactInfo: {
      phone: '(706) 722-8000',
      address: 'Augusta, GA'
    },
    benefits: {
      healthInsurance: true,
      pension: true,
      vacation: 10,
      apprenticeship: true
    }
  },
  {
    id: 'ibew-local-1701',
    name: 'IBEW Local 1701',
    shortName: 'IBEW Local 1701',
    city: 'Owensboro',
    state: 'KY',
    lat: 37.7719,
    lng: -87.1111,
    baseWage: 32.37,
    fringeBenefits: 17.61, // Total package - base wage
    totalPackage: 49.98,
    members: 1500, // Estimated
    logoPath: '/union-logos/ibew-logo.svg',
    description: 'IBEW Local 1701 represents electrical workers in the Owensboro, Kentucky area.',
    trade: UnionTrade.ELECTRICAL,
    established: 1946,
    jurisdiction: 'Owensboro metropolitan area',
    contactInfo: {
      phone: '(270) 684-8000',
      address: 'Owensboro, KY'
    },
    benefits: {
      healthInsurance: true,
      pension: true,
      vacation: 10,
      apprenticeship: true
    }
  },
  {
    id: 'ibew-local-1925',
    name: 'IBEW Local 1925',
    shortName: 'IBEW Local 1925',
    city: 'Martin',
    state: 'TN',
    lat: 36.3434,
    lng: -88.8503,
    baseWage: 25.60,
    fringeBenefits: 14.37, // Total package - base wage
    totalPackage: 39.97,
    members: 800, // Estimated
    logoPath: '/union-logos/ibew-local-1925.png',
    description: 'IBEW Local 1925 represents electrical workers in the Martin, Tennessee area.',
    trade: UnionTrade.ELECTRICAL,
    established: 1946,
    jurisdiction: 'Martin metropolitan area',
    contactInfo: {
      phone: '(731) 587-8000',
      address: 'Martin, TN'
    },
    benefits: {
      healthInsurance: true,
      pension: true,
      vacation: 10,
      apprenticeship: true
    }
  },
  {
    id: 'ibew-local-1531',
    name: 'IBEW Local 1531',
    shortName: 'IBEW Local 1531',
    city: 'Albany',
    state: 'GA',
    lat: 31.5785,
    lng: -84.1557,
    baseWage: 29.50,
    fringeBenefits: 14.59, // Total package - base wage
    totalPackage: 44.09,
    members: 1200, // Estimated
    logoPath: '/union-logos/ibew-local-1531.png',
    description: 'IBEW Local 1531 represents electrical workers in the Albany, Georgia area.',
    trade: UnionTrade.ELECTRICAL,
    established: 1946,
    jurisdiction: 'Albany metropolitan area',
    contactInfo: {
      phone: '(229) 432-8000',
      address: 'Albany, GA'
    },
    benefits: {
      healthInsurance: true,
      pension: true,
      vacation: 10,
      apprenticeship: true
    }
  },
  {
    id: 'ibew-local-1516',
    name: 'IBEW Local 1516',
    shortName: 'IBEW Local 1516',
    city: 'Jonesboro',
    state: 'AR',
    lat: 35.8423,
    lng: -90.7043,
    baseWage: 31.01,
    fringeBenefits: 15.03, // Total package - base wage
    totalPackage: 46.04,
    members: 1100, // Estimated
    logoPath: '/union-logos/ibew-local-1516.png',
    description: 'IBEW Local 1516 represents electrical workers in the Jonesboro, Arkansas area.',
    trade: UnionTrade.ELECTRICAL,
    established: 1946,
    jurisdiction: 'Jonesboro metropolitan area',
    contactInfo: {
      phone: '(870) 935-8000',
      address: 'Jonesboro, AR'
    },
    benefits: {
      healthInsurance: true,
      pension: true,
      vacation: 10,
      apprenticeship: true
    }
  }
]

// Helper function to get all IBEW data
export const getAllIBEWData = (): Union[] => {
  return ibewData
}

// Helper function to get IBEW data by state
export const getIBEWDataByState = (state: string): Union[] => {
  return ibewData.filter(union => union.state === state)
}

// Helper function to get IBEW data by city
export const getIBEWDataByCity = (city: string): Union[] => {
  return ibewData.filter(union => union.city.toLowerCase() === city.toLowerCase())
}
