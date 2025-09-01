'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { Union, UnionFilters as UnionFiltersType, UnionTrade } from '@/types/union'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { UnionModal } from '@/components/union-modal'
import { UnionFilters } from '@/components/union-filters'
import { MapPin, DollarSign, Users, Building2, TrendingUp } from 'lucide-react'
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup
} from 'react-simple-maps'

// USA TopoJSON data - simplified for better performance
const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json"

// Helper function to get the correct logo path
const getUnionLogoPath = (union: Union): string => {
  // Use IBEW logo for all electrical unions
  if (union.trade === UnionTrade.ELECTRICAL) {
    return '/union-logos/ibew-logo.png'
  }
  // Use the specified logo path for other unions
  return union.logoPath
}

interface UnionMapProps {
  unions: Union[]
}

export function UnionMap({ unions }: UnionMapProps) {
  const [selectedUnion, setSelectedUnion] = useState<Union | null>(null)
  const [hoveredUnion, setHoveredUnion] = useState<number | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [filters, setFilters] = useState<UnionFiltersType>({
    trade: undefined,
    state: undefined,
    minWage: undefined,
    maxWage: undefined,
  })

  // Ensure client-side rendering after hydration
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Filter unions based on current filters
  const filteredUnions = useMemo(() => {
    return unions.filter(union => {
      if (filters.trade && union.trade !== filters.trade) return false
      if (filters.state && union.state !== filters.state) return false
      if (filters.minWage && union.baseWage < filters.minWage) return false
      if (filters.maxWage && union.baseWage > filters.maxWage) return false
      return true
    })
  }, [unions, filters])

  // Get color based on wage level
  const getWageColor = (baseWage: number) => {
    if (baseWage >= 60) return '#059669' // green-600
    if (baseWage >= 50) return '#2563eb' // blue-600
    if (baseWage >= 40) return '#7c3aed' // violet-600
    return '#dc2626' // red-600
  }

  // Calculate statistics for filtered unions
  const statistics = useMemo(() => {
    const totalUnions = filteredUnions.length
    const avgWage = totalUnions > 0 
      ? filteredUnions.reduce((sum, union) => sum + union.baseWage, 0) / totalUnions
      : 0
    const totalMembers = filteredUnions.reduce((sum, union) => sum + union.members, 0)
    const avgBenefits = totalUnions > 0
      ? filteredUnions.reduce((sum, union) => sum + union.fringeBenefits, 0) / totalUnions
      : 0

    return {
      totalUnions,
      avgWage: Number(avgWage.toFixed(2)),
      totalMembers,
      avgBenefits: Number(avgBenefits.toFixed(2))
    }
  }, [filteredUnions])

  return (
    <div className="space-y-6">
      {/* Filters */}
      <UnionFilters 
        filters={filters} 
        onFiltersChange={setFilters} 
        unions={unions}
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{statistics.totalUnions}</div>
            <div className="text-sm text-slate-600">Unions Found</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">${statistics.avgWage}/hr</div>
            <div className="text-sm text-slate-600">Avg. Base Wage</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{statistics.totalMembers.toLocaleString()}</div>
            <div className="text-sm text-slate-600">Total Members</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">${statistics.avgBenefits}/hr</div>
            <div className="text-sm text-slate-600">Avg. Benefits</div>
          </div>
        </Card>
      </div>

      {/* Map Container */}
      <Card className="p-6">
        <div className="relative">
          {!isClient && (
            <div className="flex items-center justify-center h-96">
              <div className="text-slate-500">Loading map...</div>
            </div>
          )}
          {isClient && (
            <div className="w-full h-[600px] bg-slate-50 rounded-lg border overflow-hidden relative touch-pan-x touch-pan-y touch-pinch-zoom cursor-grab active:cursor-grabbing map-container">
              <ComposableMap
                projection="geoAlbersUsa"
                projectionConfig={{
                  scale: 1000,
                  center: [0, 0]
                }}
                style={{
                  width: "100%",
                  height: "100%"
                }}
              >
                <ZoomableGroup zoom={1} maxZoom={4} minZoom={0.8}>
                  <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                      geographies.map(geo => (
                                                 <Geography
                           key={geo.rsmKey}
                           geography={geo}
                           fill="#f8fafc"
                           stroke="#64748b"
                           strokeWidth={1.5}
                           style={{
                             default: { outline: 'none' },
                             hover: { 
                               fill: '#e2e8f0',
                               outline: 'none',
                               stroke: '#475569',
                               strokeWidth: 2
                             },
                             pressed: { outline: 'none' }
                           }}
                         />
                      ))
                    }
                  </Geographies>
                  
                  {/* Union Location Markers */}
                  {filteredUnions.map(union => {
                    const isHovered = hoveredUnion === union.id
                    const isSelected = selectedUnion?.id === union.id
                    const color = getWageColor(union.baseWage)
                    
                    return (
                      <HoverCard key={union.id}>
                        <HoverCardTrigger asChild>
                          <Marker coordinates={[union.lng, union.lat]}>
                            <g className="cursor-pointer">
                              {/* Marker Circle */}
                              <circle
                                r={isHovered || isSelected ? 12 : 8}
                                fill={color}
                                stroke="white"
                                strokeWidth={3}
                                className="transition-all duration-200 drop-shadow-sm hover:drop-shadow-md"
                                onMouseEnter={() => setHoveredUnion(union.id)}
                                onMouseLeave={() => setHoveredUnion(null)}
                                onClick={() => setSelectedUnion(union)}
                              />
                              
                              {/* Wage Label */}
                              <text
                                y={-25}
                                textAnchor="middle"
                                className="fill-slate-700 text-sm font-semibold pointer-events-none select-none"
                                style={{ 
                                  fontSize: isHovered ? '14px' : '12px',
                                  fontWeight: '600'
                                }}
                              >
                                ${union.baseWage.toFixed(2)}/hr
                              </text>
                              
                              {/* City Label */}
                              <text
                                y={15}
                                textAnchor="middle"
                                className="fill-slate-600 text-xs pointer-events-none select-none"
                                style={{ fontSize: '11px' }}
                              >
                                {union.city}
                              </text>
                            </g>
                          </Marker>
                        </HoverCardTrigger>
                        
                        <HoverCardContent className="w-80">
                          <div className="space-y-2">
                            <div className="flex items-start gap-3">
                              <img 
                                src={getUnionLogoPath(union)} 
                                alt={union.name}
                                className="w-12 h-12 rounded-lg object-cover bg-slate-100"
                                onError={(e) => {
                                  e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iOCIgZmlsbD0iIzk0YTNiOCIvPgo8cGF0aCBkPSJNMTYgMTZIMzJWMzJIMTZWMTZaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K'
                                }}
                              />
                              <div>
                                <h4 className="font-semibold text-slate-900">{union.shortName}</h4>
                                <p className="text-sm text-slate-600">{union.city}, {union.state}</p>
                                <div className="flex items-center gap-4 mt-1">
                                  <span className="text-sm font-medium text-green-600">
                                    ${union.baseWage.toFixed(2)}/hr
                                  </span>
                                  <span className="text-xs text-slate-500">
                                    {union.members.toLocaleString()} members
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-slate-500">Benefits:</span>
                                <span className="font-medium ml-1">${union.fringeBenefits}/hr</span>
                              </div>
                              <div>
                                <span className="text-slate-500">Total:</span>
                                <span className="font-medium ml-1">${union.totalPackage}/hr</span>
                              </div>
                            </div>
                            
                            <Badge variant="outline" className="text-xs">
                              {union.trade}
                            </Badge>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    )
                  })}
                </ZoomableGroup>
                              </ComposableMap>

                {/* Subtle Zoom Instructions */}
                <div className="absolute top-4 left-4 z-10">
                  <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-600 shadow-sm">
                    <div className="font-medium mb-1 text-slate-700">🗺️ Map Controls</div>
                    <div className="text-slate-500">• Pinch fingers to zoom in/out</div>
                    <div className="text-slate-500">• Drag to pan around</div>
                    <div className="text-slate-500">• Mouse wheel to zoom (desktop)</div>
                  </div>
                </div>
              </div>
          )}
        </div>
        
        <div className="mt-4 flex justify-center">
          <div className="flex items-center gap-6 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Union Location</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign size={16} />
              <span>Hourly Base Wage</span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={16} />
              <span>Click for Details</span>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex justify-center">
          <div className="flex items-center gap-4 text-xs">
            <span className="text-slate-600 font-medium">Wage Levels:</span>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-600"></div>
              <span className="text-slate-600">$60+/hr</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-blue-600"></div>
              <span className="text-slate-600">$50-60/hr</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-purple-600"></div>
              <span className="text-slate-600">$40-50/hr</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-red-600"></div>
              <span className="text-slate-600">Under $40/hr</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Union Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">
            Union Directory ({filteredUnions.length} unions)
          </h2>
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-slate-500" />
            <span className="text-sm text-slate-600">
              Sorted by wage (highest first)
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isClient && filteredUnions
            .sort((a, b) => b.baseWage - a.baseWage)
            .map(union => (
            <Card 
              key={union.id}
              className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
              onClick={() => setSelectedUnion(union)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <img 
                    src={getUnionLogoPath(union)} 
                    alt={union.name}
                    className="w-12 h-12 rounded-lg object-cover bg-slate-100 flex-shrink-0"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iOCIgZmlsbD0iIzk0YTNiOCIvPgo8cGF0aCBkPSJNMTYgMTZIMzJWMzJIMTZWMTZaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K'
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 text-sm leading-tight mb-1">
                      {union.shortName}
                    </h3>
                    <div className="flex items-center gap-1 mb-2">
                      <MapPin size={12} className="text-slate-400 flex-shrink-0" />
                      <span className="text-xs text-slate-600">{union.city}, {union.state}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {union.trade}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 text-sm">Base Wage:</span>
                    <span className="font-semibold text-green-600">${union.baseWage.toFixed(2)}/hr</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 text-sm">Benefits:</span>
                    <span className="font-semibold text-blue-600">${union.fringeBenefits}/hr</span>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-slate-100">
                    <span className="text-slate-600 text-sm">Total Package:</span>
                    <span className="font-bold text-purple-600">${union.totalPackage}/hr</span>
                  </div>
                  <div className="flex items-center gap-1 pt-1">
                    <Users size={12} className="text-slate-400" />
                    <span className="text-xs text-slate-500">{union.members.toLocaleString()} members</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* No results message */}
      {isClient && filteredUnions.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="text-slate-400 mb-4">
              <Building2 size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No unions found</h3>
            <p className="text-slate-500 mb-4">
              Try adjusting your filters to see more results.
            </p>
            <Button 
              variant="outline" 
              onClick={() => setFilters({
                trade: undefined,
                state: undefined,
                minWage: undefined,
                maxWage: undefined,
              })}
              className="mx-auto"
            >
              Clear All Filters
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Union Modal */}
      <UnionModal 
        union={selectedUnion} 
        open={!!selectedUnion} 
        onOpenChange={(open) => !open && setSelectedUnion(null)} 
      />
    </div>
  )
}