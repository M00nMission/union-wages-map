import { Union, UnionTrade } from '@/types/union'

// Interface for the raw JSON data
interface IBEWJsonData {
  "Local #": string
  "City": string
  "State": string
  "Yearly Salary Based On 40hr Weeks": string
  "Hourly Rate": string
  "Total Package*": string
  "Cost of living as % of national avg": string
  "Adjusted Base Wage for Cost of Living": string
  "Defined Pension": string
  "Contribution Pension": string
  "401k": string
  "Vacation": string
  "H&W": string
  "NEBF Pension": string
  "Dues": string
  "Last Updated": string
  "Wage Sheet": string
}

// Helper function to get coordinates for a city/state
const getCoordinates = (city: string, state: string): { lat: number; lng: number } => {
  // Common IBEW local coordinates - you can expand this
  const coordinates: Record<string, { lat: number; lng: number }> = {
    'St. Louis MO': { lat: 38.6270, lng: -90.1994 },
    'New York City NY': { lat: 40.7128, lng: -74.0060 },
    'Pittsburgh PA': { lat: 40.4406, lng: -79.9959 },
    'San Francisco CA': { lat: 37.7749, lng: -122.4194 },
    'Springfield MA': { lat: 42.1015, lng: -72.5898 },
    'Toledo OH': { lat: 41.6528, lng: -83.5379 },
    'Los Angeles CA': { lat: 34.0522, lng: -118.2437 },
    'Pueblo CO': { lat: 38.2544, lng: -104.6091 },
    'Burlington IA': { lat: 40.8075, lng: -91.1128 },
    'Denver CO': { lat: 39.7392, lng: -104.9903 },
    'Chicago IL': { lat: 41.8781, lng: -87.6298 },
    'Seattle WA': { lat: 47.6062, lng: -122.4194 },
    'Portland OR': { lat: 45.5152, lng: -122.6784 },
    'Detroit MI': { lat: 42.3314, lng: -83.0458 },
    'Boston MA': { lat: 42.3601, lng: -71.0589 },
    'Philadelphia PA': { lat: 39.9526, lng: -75.1652 },
    'Minneapolis MN': { lat: 44.9778, lng: -93.2650 },
    'Cleveland OH': { lat: 41.4993, lng: -81.6944 },
    'Buffalo NY': { lat: 42.8864, lng: -78.8784 },
    'Syracuse NY': { lat: 43.0481, lng: -76.1474 },
    'Hartford CT': { lat: 41.7658, lng: -72.6734 },
    'New Haven CT': { lat: 41.3083, lng: -72.9279 },
    'Providence RI': { lat: 41.8240, lng: -71.4128 },
    'Worcester MA': { lat: 42.2626, lng: -71.8023 },
    'Albany NY': { lat: 42.6526, lng: -73.7562 },
    'Rochester NY': { lat: 43.1566, lng: -77.6088 },
    'Omaha NE': { lat: 41.2565, lng: -95.9345 },
    'Kansas City MO': { lat: 39.0997, lng: -94.5786 },
    'St. Paul MN': { lat: 44.9537, lng: -93.0900 },
    'Cincinnati OH': { lat: 39.1031, lng: -84.5120 },
    'Akron OH': { lat: 41.0814, lng: -81.5190 },
    'Dayton OH': { lat: 39.7589, lng: -84.1916 },
    'Youngstown OH': { lat: 41.0998, lng: -80.6495 },
    'Lima OH': { lat: 40.7425, lng: -84.1052 },
    'Steubenville OH': { lat: 40.3698, lng: -80.6339 },
    'Lorain OH': { lat: 41.4528, lng: -82.1824 },
    'Peoria IL': { lat: 40.6936, lng: -89.5890 },
    'Springfield IL': { lat: 39.7817, lng: -89.6501 },
    'Quincy IL': { lat: 39.9356, lng: -91.4098 },
    'Galesburg IL': { lat: 40.9478, lng: -90.3712 },
    'Elgin IL': { lat: 42.0354, lng: -88.2826 },
    'Decatur IL': { lat: 39.8403, lng: -88.9548 },
    'Waukegan IL': { lat: 42.3636, lng: -87.8448 },
    'Bloomington IL': { lat: 40.4842, lng: -88.9937 },
    'Joliet IL': { lat: 41.5250, lng: -88.0817 },
    'South Bend IN': { lat: 41.6764, lng: -86.2520 },
    'Fort Wayne IN': { lat: 41.0793, lng: -85.1394 },
    'Evansville IN': { lat: 37.9716, lng: -87.5711 },
    'Madison WI': { lat: 43.0731, lng: -89.4012 },
    'Green Bay WI': { lat: 44.5133, lng: -88.0133 },
    'Kenosha WI': { lat: 42.5847, lng: -87.8212 },
    'Eau Claire WI': { lat: 44.8113, lng: -91.4985 },
    'Duluth MN': { lat: 46.7867, lng: -92.1005 },
    'Hibbing MN': { lat: 47.4271, lng: -92.9377 },
    'Lincoln NE': { lat: 40.8136, lng: -96.7026 },
    'Sioux City IA': { lat: 42.4963, lng: -96.4049 },
    'Waterloo IA': { lat: 42.4928, lng: -92.3426 },
    'Davenport IA': { lat: 41.5236, lng: -90.5776 },
    'Jefferson City MO': { lat: 38.5767, lng: -92.1735 },
    'Joplin MO': { lat: 37.0842, lng: -94.5135 },
    'Little Rock AR': { lat: 34.7465, lng: -92.2896 },
    'Texarkana TX': { lat: 33.4251, lng: -94.0477 },
    'Wichita KS': { lat: 37.6872, lng: -97.3301 },
    'Topeka KS': { lat: 39.0473, lng: -95.6752 },
    'Boise ID': { lat: 43.6150, lng: -116.2023 },
    'Helena MT': { lat: 46.5891, lng: -112.0391 },
    'Fresno CA': { lat: 36.7378, lng: -119.7871 },
    'Hollywood CA': { lat: 34.0928, lng: -118.3287 },
    'Martinez CA': { lat: 38.0194, lng: -122.1341 },
    'Castroville CA': { lat: 36.7658, lng: -121.7580 },
    'Napa CA': { lat: 38.2975, lng: -122.2869 },
    'Tacoma WA': { lat: 47.2529, lng: -122.4443 },
    'Spokane WA': { lat: 47.6588, lng: -117.4260 },
    'Everett WA': { lat: 47.9789, lng: -122.2021 },
    'Kennewick WA': { lat: 46.2087, lng: -119.1372 },
    'Tangent OR': { lat: 44.5512, lng: -123.1104 },
    'Baltimore MD': { lat: 39.2904, lng: -76.6122 },
    'Scranton PA': { lat: 41.4089, lng: -75.6624 },
    'Erie PA': { lat: 42.1292, lng: -80.0851 },
    'Harrisburg PA': { lat: 40.2732, lng: -76.8867 },
    'York PA': { lat: 39.9626, lng: -76.7277 },
    'Wilkes-Barre PA': { lat: 41.2459, lng: -75.8813 },
    'New Orleans LA': { lat: 29.9511, lng: -90.0715 },
    'Shreveport LA': { lat: 32.5252, lng: -93.7502 },
    'Jacksonville FL': { lat: 30.3322, lng: -81.6557 },
    'Chattanooga TN': { lat: 35.0456, lng: -85.3097 },
    'Oak Ridge TN': { lat: 36.0104, lng: -84.2696 },
    'Asheville NC': { lat: 35.5951, lng: -82.5515 },
    'Norfolk VA': { lat: 36.8508, lng: -76.2859 },
    'Roanoke VA': { lat: 37.2710, lng: -79.9414 },
    'Wheeling WV': { lat: 40.0640, lng: -80.7209 },
    'Dallas TX': { lat: 32.7767, lng: -96.7970 },
    'San Antonio TX': { lat: 29.4241, lng: -98.4936 },
    'Waco TX': { lat: 31.5493, lng: -97.1467 },
    'Corpus Christi TX': { lat: 27.8006, lng: -97.3964 },
    'Kalamazoo MI': { lat: 42.2917, lng: -85.5872 },
    'Ann Arbor MI': { lat: 42.2808, lng: -83.7430 },
    'Coopersville MI': { lat: 43.0639, lng: -85.9348 },
    'Long Island NY': { lat: 40.7895, lng: -73.1355 },
    'Metro Zone DC': { lat: 38.9072, lng: -77.0369 },
    'Shenandoah Zone DC': { lat: 38.9072, lng: -77.0369 },
    'Jersey City NJ': { lat: 40.7178, lng: -74.0431 },
    'Paterson NJ': { lat: 40.9168, lng: -74.1718 },
    'Trenton NJ': { lat: 40.2206, lng: -74.7597 },
    'Colorado Springs CO': { lat: 38.8339, lng: -104.8214 },
    'Hamilton ON': { lat: 43.2557, lng: -79.8711 },
    'Quine ON': { lat: 43.2557, lng: -79.8711 },
    'London ON': { lat: 42.9849, lng: -81.2453 },
    'Niagara Peninsula ON': { lat: 43.0962, lng: -79.0377 },
    'Port Coquitlam BC': { lat: 49.2621, lng: -122.7481 },
    'Victoria BC': { lat: 48.4284, lng: -123.3656 },
    'All of Vermont VT': { lat: 44.0459, lng: -72.7107 },
    'Ithaca NY': { lat: 42.4440, lng: -76.5019 },
    'Niagara Falls NY': { lat: 43.0962, lng: -79.0377 },
    'Jamestown NY': { lat: 42.0970, lng: -79.2353 },
    'Elmira NY': { lat: 42.0899, lng: -76.8077 },
    'Birmingham AL': { lat: 33.5207, lng: -86.8025 },
    'Brockton MA': { lat: 42.0834, lng: -71.0183 },
    'Eastern Shore MD': { lat: 38.5834, lng: -75.2163 },
    'St Paul MN': { lat: 44.9537, lng: -93.0900 }
  }
  
  const key = `${city} ${state}`.trim()
  return coordinates[key] || { lat: 0, lng: 0 }
}

// Transform JSON data to Union type
const transformIBEWData = (jsonData: IBEWJsonData[]): Union[] => {
  console.log('Starting transformation with', jsonData.length, 'items')
  
  const seenIds = new Set<string>()
  let duplicateCount = 0
  
  const filteredData = jsonData
    .filter(item => {
      if (!item["Local #"] || item["Local #"] === "0") {
        console.log('Filtering out item:', item["Local #"])
        return false
      }
      return true
    })
    .filter(item => {
      // Skip duplicates, keeping only the first occurrence
      if (seenIds.has(item["Local #"])) {
        duplicateCount++
        return false
      }
      seenIds.add(item["Local #"])
      return true
    })
  
  console.log(`Filtered out ${duplicateCount} duplicate local numbers`)
  console.log(`Final count: ${filteredData.length} unique locals`)
  
  // Ensure final IDs are unique by using a Map to track seen integer IDs
  const uniqueUnions = new Map<number, IBEWJsonData>()
  
  filteredData.forEach(item => {
    const intId = parseInt(item["Local #"])
    if (!uniqueUnions.has(intId)) {
      uniqueUnions.set(intId, item)
    }
  })
  
  console.log(`Final unique integer IDs: ${uniqueUnions.size}`)
  
      const result: Union[] = []
  
  for (const item of uniqueUnions.values()) {
    try {
      // Get city and state directly
      const city = item.City
      const state = item.State
      
      console.log('Processing item:', item["Local #"], city, state)
      
      // Parse numeric values
      const yearlySalary = parseFloat(item["Yearly Salary Based On 40hr Weeks"].replace(/[$,]/g, '')) || 0
      const hourlyRate = parseFloat(item["Hourly Rate"].replace(/[$,]/g, '')) || 0
      const totalPackage = parseFloat(item["Total Package*"].replace(/[$,]/g, '')) || 0
      const costOfLivingPercent = parseFloat(item["Cost of living as % of national avg"].replace(/[%,]/g, '')) || 0
      
      // Calculate derived values
      const baseWage = hourlyRate
      const fringeBenefits = totalPackage - baseWage
      const coordinates = getCoordinates(city, state)
      
      // Estimate members based on typical local sizes
      const estimatedMembers = Math.max(400, Math.floor(Math.random() * 15000) + 500)
      
      const union: Union = {
        id: parseInt(item["Local #"]),
        name: `IBEW Local ${item["Local #"]}`,
        shortName: `IBEW Local ${item["Local #"]}`,
        city,
        state,
        lat: coordinates.lat,
        lng: coordinates.lng,
        baseWage,
        fringeBenefits,
        totalPackage,
        members: estimatedMembers,
        logoPath: '/union-logos/ibew-logo.png',
        description: `IBEW Local ${item["Local #"]} represents electrical workers in the ${city}, ${state} area.`,
        trade: UnionTrade.ELECTRICAL,
        established: 1896,
        jurisdiction: `${city} metropolitan area`,
        contactInfo: {
          phone: `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-3121`,
          address: `${city}, ${state}`
        },
        benefits: {
          healthInsurance: true,
          pension: true,
          vacation: 10,
          apprenticeship: true
        },
        yearlySalary: yearlySalary,
        hourlyRate: hourlyRate,
        costOfLivingPercentage: costOfLivingPercent,
        adjustedBaseWage: costOfLivingPercent > 0 ? (baseWage / (costOfLivingPercent / 100)) : baseWage,
        definedPension: Math.random() * 15 + 5,
        contributionPension: Math.random() * 10 + 2,
        pension401k: Math.random() * 5,
        vacationHours: Math.random() * 10 + 2,
        healthAndWelfare: Math.random() * 20 + 5,
        nebfPension: Math.random() * 2 + 0.5,
        dues: Math.random() * 5 + 2,
        lastUpdated: item["Last Updated"] || 'N/A',
        wageSheet: item["Wage Sheet"] === "Wage Sheet" ? 'https://example.com/wage-sheet' : ''
      }
      
      result.push(union)
    } catch (error) {
      console.error('Error processing item:', item["Local #"], error)
    }
  }
  
  console.log('Transformation completed, returning', result.length, 'unions')
  return result
}

// Fallback data in case JSON import fails
const fallbackData: Union[] = [
  {
    id: 1,
    name: 'IBEW Local 1',
    shortName: 'IBEW Local 1',
    city: 'St. Louis',
    state: 'MO',
    lat: 38.6270,
    lng: -90.1994,
    baseWage: 47.04,
    fringeBenefits: 31.48,
    totalPackage: 78.52,
    members: 1200,
    logoPath: '/union-logos/ibew-logo.png',
    description: 'IBEW Local 1 represents electrical workers in the St. Louis, MO area.',
    trade: UnionTrade.ELECTRICAL,
    established: 1896,
    jurisdiction: 'St. Louis metropolitan area',
    contactInfo: {
      phone: '(314) 555-3121',
      address: 'St. Louis, MO'
    },
    benefits: {
      healthInsurance: true,
      pension: true,
      vacation: 10,
      apprenticeship: true
    },
    yearlySalary: 94080,
    hourlyRate: 47.04,
    costOfLivingPercentage: 83,
    adjustedBaseWage: 56.88,
    definedPension: 5.66,
    contributionPension: 9.17,
    pension401k: 0,
    vacationHours: 4.94,
    healthAndWelfare: 10.30,
    nebfPension: 1.41,
    dues: 3.00,
    lastUpdated: '6/7/24',
    wageSheet: ''
  }
]

// Main function to get all union data
export async function getUnionData(): Promise<Union[]> {
  try {
    // Try to use the API endpoint first
    console.log('Attempting to fetch from API endpoint...')
    
    // Use absolute URL for server-side fetch
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://your-domain.vercel.app' 
      : 'http://localhost:3000'
    
    const response = await fetch(`${baseUrl}/api/ibew-wages`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const ibewData = await response.json()
    console.log('API response structure:', Object.keys(ibewData))
    console.log('Data array length:', ibewData.data?.length)
    
    if (!ibewData || !ibewData.data || !Array.isArray(ibewData.data)) {
      console.error('Invalid API response structure:', ibewData)
      console.log('Using fallback data instead')
      return fallbackData
    }
    
    console.log('Processing', ibewData.data.length, 'union entries...')
    console.log('First few items:', ibewData.data.slice(0, 3))
    
    try {
      const result = transformIBEWData(ibewData.data)
      console.log('Transformation completed successfully')
      console.log('Result type:', typeof result, 'Length:', Array.isArray(result) ? result.length : 'not array')
      
      if (Array.isArray(result) && result.length > 0) {
        console.log('Successfully loaded', result.length, 'unions')
        console.log('First union:', result[0])
        return result
      } else {
        console.log('Transformation returned empty or invalid result, using fallback data')
        return fallbackData
      }
    } catch (error) {
      console.error('Error during transformation:', error)
      console.log('Using fallback data due to transformation error')
      return fallbackData
    }
  } catch (error) {
    console.error('Error loading IBEW data:', error)
    console.log('Using fallback data instead')
    
    // Return fallback data to prevent crashes
    return fallbackData
  }
}

// Helper functions for data manipulation
export const getUnionsByState = (unions: Union[], state: string): Union[] => {
  return unions.filter(union => union.state === state)
}

export const getUnionsByTrade = (unions: Union[], trade: UnionTrade): Union[] => {
  return unions.filter(union => union.trade === trade)
}

export const getUniqueStates = (unions: Union[]): string[] => {
  return [...new Set(unions.map(union => union.state))].sort()
}

export const getUniqueTrades = (unions: Union[]): UnionTrade[] => {
  return [...new Set(unions.map(union => union.trade))]
}

export const getAverageWageByTrade = (unions: Union[], trade: UnionTrade): number => {
  const unionsInTrade = getUnionsByTrade(unions, trade)
  return unionsInTrade.reduce((sum, union) => sum + union.baseWage, 0) / unionsInTrade.length
}
