import { Metadata } from 'next'
import { UnionMap } from '@/components/union-map'
import { unionData } from '@/lib/union-data'
import { Union } from '@/types/union'

// This enables SSR with static generation
export const metadata: Metadata = {
  title: 'IBEW Electrician Wages Map - Union Wages Across America',
  description: 'Explore IBEW electrician wages and fringe benefits by location across the United States.',
  keywords: 'IBEW, electrician wages, electrical union, fringe benefits, construction wages, trade unions',
  openGraph: {
    title: 'IBEW Electrician Wages Map - Union Wages Across America',
    description: 'Explore IBEW electrician wages and fringe benefits by location across the United States.',
    type: 'website',
    url: 'https://your-domain.vercel.app',
  },
}

// This function runs at build time for SSG, or at request time for SSR
async function getUnionData(): Promise<Union[]> {
  // In production, you might fetch from an API or database
  // For now, we'll use static data
  return unionData
}

export default async function HomePage() {
  // This enables SSR - data is fetched on the server
  const unions = await getUnionData()

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            IBEW Electrician Wages Across America
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Explore IBEW electrician wages and fringe benefits by location. 
            Interactive map showing current wage data for electrical workers across the United States.
          </p>
        </div>

        {/* Map Component */}
        <UnionMap unions={unions} />
        
        {/* Statistics Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Total IBEW Locals</h3>
            <p className="text-3xl font-bold text-blue-600">{unions.length}</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Avg. Base Wage</h3>
            <p className="text-3xl font-bold text-green-600">
              ${(unions.reduce((sum, union) => sum + union.baseWage, 0) / unions.length).toFixed(2)}/hr
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Total Members</h3>
            <p className="text-3xl font-bold text-purple-600">
              {unions.reduce((sum, union) => sum + union.members, 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
