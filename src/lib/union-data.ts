import { Union, UnionTrade } from '@/types/union'

export const unionData: Union[] = [
  {
    id: 'ibew-local-3',
    name: 'International Brotherhood of Electrical Workers Local 3',
    shortName: 'IBEW Local 3',
    city: 'New York',
    state: 'NY',
    lat: 40.7128,
    lng: -74.0060,
    baseWage: 65.50,
    fringeBenefits: 45.20,
    totalPackage: 110.70,
    members: 27000,
    logoPath: '/union-logos/ibew-local-3.png',
    website: 'https://ibewlocal3.org',
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
    id: 'ua-local-1',
    name: 'United Association Local 1',
    shortName: 'UA Local 1',
    city: 'Chicago',
    state: 'IL',
    lat: 41.8781,
    lng: -87.6298,
    baseWage: 58.75,
    fringeBenefits: 38.90,
    totalPackage: 97.65,
    members: 12500,
    logoPath: '/union-logos/ua-local-1.png',
    website: 'https://ualocal1.org',
    description: 'Plumbers and pipefitters union serving the greater Chicago metropolitan area.',
    trade: UnionTrade.PLUMBING,
    established: 1889,
    jurisdiction: 'Chicago and surrounding Cook County areas',
    contactInfo: {
      phone: '(312) 421-1010',
      address: '1340 W Washington Blvd, Chicago, IL 60607'
    },
    benefits: {
      healthInsurance: true,
      pension: true,
      vacation: 12,
      apprenticeship: true
    }
  },
  {
    id: 'laborers-local-261',
    name: 'Laborers International Union Local 261',
    shortName: 'LiUNA Local 261',
    city: 'Los Angeles',
    state: 'CA',
    lat: 34.0522,
    lng: -118.2437,
    baseWage: 52.30,
    fringeBenefits: 35.80,
    totalPackage: 88.10,
    members: 8200,
    logoPath: '/union-logos/laborers-local-261.png',
    description: 'Construction laborers union representing workers in building construction, highway construction, and utility work.',
    trade: UnionTrade.LABORERS,
    established: 1903,
    jurisdiction: 'Los Angeles County',
    contactInfo: {
      phone: '(213) 385-2185',
      address: '2161 W Temple St, Los Angeles, CA 90026'
    },
    benefits: {
      healthInsurance: true,
      pension: true,
      vacation: 10,
      apprenticeship: true
    }
  },
  {
    id: 'iuoe-local-139',
    name: 'International Union of Operating Engineers Local 139',
    shortName: 'IUOE Local 139',
    city: 'Milwaukee',
    state: 'WI',
    lat: 43.0389,
    lng: -87.9065,
    baseWage: 48.25,
    fringeBenefits: 32.15,
    totalPackage: 80.40,
    members: 5800,
    logoPath: '/union-logos/iuoe-local-139.png',
    description: 'Heavy equipment operators union representing crane operators, bulldozer operators, and other heavy machinery operators.',
    trade: UnionTrade.OPERATING_ENGINEERS,
    established: 1912,
    jurisdiction: 'Wisconsin and Upper Peninsula Michigan',
    contactInfo: {
      phone: '(414) 321-4139',
      address: '575 S Barstow St, Eau Claire, WI 54701'
    },
    benefits: {
      healthInsurance: true,
      pension: true,
      vacation: 14,
      apprenticeship: true
    }
  },
  {
    id: 'carpenters-local-144',
    name: 'United Brotherhood of Carpenters Local 144',
    shortName: 'UBC Local 144',
    city: 'Boston',
    state: 'MA',
    lat: 42.3601,
    lng: -71.0589,
    baseWage: 55.80,
    fringeBenefits: 41.20,
    totalPackage: 97.00,
    members: 9500,
    logoPath: '/union-logos/carpenters-local-144.png',
    website: 'https://ubclocal144.org',
    description: 'Carpenters union representing workers in residential, commercial, and industrial construction.',
    trade: UnionTrade.CARPENTRY,
    established: 1881,
    jurisdiction: 'Greater Boston metropolitan area',
    contactInfo: {
      phone: '(617) 268-3400',
      address: '750 Dorchester Ave, Boston, MA 02125'
    },
    benefits: {
      healthInsurance: true,
      pension: true,
      vacation: 15,
      apprenticeship: true
    }
  },
  {
    id: 'teamsters-local-804',
    name: 'International Brotherhood of Teamsters Local 804',
    shortName: 'Teamsters Local 804',
    city: 'Atlanta',
    state: 'GA',
    lat: 33.7490,
    lng: -84.3880,
    baseWage: 44.50,
    fringeBenefits: 28.90,
    totalPackage: 73.40,
    members: 15200,
    logoPath: '/union-logos/teamsters-local-804.png',
    description: 'Truck drivers and logistics workers union serving the transportation industry.',
    trade: UnionTrade.TEAMSTERS,
    established: 1935,
    jurisdiction: 'Atlanta metropolitan area and North Georgia',
    contactInfo: {
      phone: '(404) 344-8040',
      address: '2170 Piedmont Rd NE, Atlanta, GA 30324'
    },
    benefits: {
      healthInsurance: true,
      pension: true,
      vacation: 12,
      apprenticeship: false
    }
  },
  {
    id: 'ironworkers-local-40',
    name: 'International Association of Bridge, Structural, Ornamental and Reinforcing Iron Workers Local 40',
    shortName: 'Ironworkers Local 40',
    city: 'New York',
    state: 'NY',
    lat: 40.7589,
    lng: -73.9851,
    baseWage: 71.25,
    fringeBenefits: 52.80,
    totalPackage: 124.05,
    members: 3200,
    logoPath: '/union-logos/ironworkers-local-40.png',
    website: 'https://local40.org',
    description: 'Ironworkers union representing structural steel workers, reinforcing steel workers, and ornamental ironworkers.',
    trade: UnionTrade.IRONWORKERS,
    established: 1896,
    jurisdiction: 'Manhattan, Bronx, and parts of Long Island',
    contactInfo: {
      phone: '(212) 420-1800',
      address: '147-27 94th Ave, Jamaica, NY 11435'
    },
    benefits: {
      healthInsurance: true,
      pension: true,
      vacation: 20,
      apprenticeship: true
    }
  },
  {
    id: 'roofers-local-149',
    name: 'United Union of Roofers, Waterproofers and Allied Workers Local 149',
    shortName: 'Roofers Local 149',
    city: 'Detroit',
    state: 'MI',
    lat: 42.3314,
    lng: -83.0458,
    baseWage: 46.75,
    fringeBenefits: 29.60,
    totalPackage: 76.35,
    members: 2800,
    logoPath: '/union-logos/roofers-local-149.png',
    description: 'Roofers and waterproofers union representing workers in commercial and residential roofing.',
    trade: UnionTrade.ROOFERS,
    established: 1919,
    jurisdiction: 'Southeastern Michigan',
    contactInfo: {
      phone: '(313) 894-2149',
      address: '26677 W 12 Mile Rd, Southfield, MI 48034'
    },
    benefits: {
      healthInsurance: true,
      pension: true,
      vacation: 10,
      apprenticeship: true
    }
  }
]

// Helper functions for data manipulation
export const getUnionsByState = (state: string): Union[] => {
  return unionData.filter(union => union.state === state)
}

export const getUnionsByTrade = (trade: UnionTrade): Union[] => {
  return unionData.filter(union => union.trade === trade)
}

export const getUniqueStates = (): string[] => {
  return [...new Set(unionData.map(union => union.state))].sort()
}

export const getUniqueTrades = (): UnionTrade[] => {
  return [...new Set(unionData.map(union => union.trade))]
}

export const getAverageWageByTrade = (trade: UnionTrade): number => {
  const unionsInTrade = getUnionsByTrade(trade)
  return unionsInTrade.reduce((sum, union) => sum + union.baseWage, 0) / unionsInTrade.length
}