export interface Union {
    id: string
    name: string
    shortName: string
    city: string
    state: string
    lat: number
    lng: number
    baseWage: number
    fringeBenefits: number
    totalPackage: number
    members: number
    logoPath: string
    website?: string
    description: string
    trade: UnionTrade
    established?: number
    jurisdiction: string
    contactInfo?: {
      phone?: string
      email?: string
      address?: string
    }
    benefits?: {
      healthInsurance: boolean
      pension: boolean
      vacation: number // days per year
      apprenticeship: boolean
    }
  }
  
  export enum UnionTrade {
    ELECTRICAL = 'Electrical',
    PLUMBING = 'Plumbing & Pipefitting',
    CARPENTRY = 'Carpentry',
    LABORERS = 'Laborers',
    OPERATING_ENGINEERS = 'Operating Engineers',
    TEAMSTERS = 'Teamsters',
    IRONWORKERS = 'Ironworkers',
    MASONRY = 'Masonry',
    ROOFERS = 'Roofers',
    PAINTERS = 'Painters',
    OTHER = 'Other'
  }
  
  export interface UnionFilters {
    trade?: UnionTrade
    state?: string
    minWage?: number
    maxWage?: number
  }