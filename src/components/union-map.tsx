'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { Union, MapCoordinates, UnionFilters as UnionFiltersType } from '@/types/union'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { UnionModal } from '@/components/union-modal'
import { UnionFilters } from '@/components/union-filters'
import { MapPin, DollarSign, Users, Building2, TrendingUp } from 'lucide-react'

interface UnionMapProps {
  unions: Union[]
}

export function UnionMap({ unions }: UnionMapProps) {
  const [selectedUnion, setSelectedUnion] = useState<Union | null>(null)
  const [hoveredUnion, setHoveredUnion] = useState<string | null>(null)
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

  // Convert lat/lng to SVG map coordinates
  const convertToMapCoordinates = (lat: number, lng: number): MapCoordinates => {
    // Simplified projection for US map - you may want to use a more accurate projection
    // Use Math.round to ensure consistent results between server and client
    const x = Math.round(((lng + 125) / 60) * 900 + 50)
    const y = Math.round(((50 - lat) / 25) * 500 + 50)
    return { x, y }
  }

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
            <svg 
              viewBox="0 0 1000 600" 
              className="w-full h-auto bg-slate-50 rounded-lg border"
              style={{ minHeight: '400px' }}
            >
            {/* US States Outline (simplified - you'd want actual state paths) */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="1" opacity="0.3"/>
              </pattern>
            </defs>
            
            {/* Background */}
            <rect width="1000" height="600" fill="url(#grid)" />
            
            {/* Simplified US mainland outline */}
            <path
              d="M 100 150 L 150 120 L 200 130 L 300 110 L 400 120 L 500 115 L 600 125 L 700 130 L 800 140 L 850 160 L 900 180 L 920 220 L 900 280 L 880 320 L 850 360 L 800 380 L 750 390 L 700 385 L 650 380 L 600 375 L 550 370 L 500 375 L 450 380 L 400 385 L 350 390 L 300 395 L 250 390 L 200 380 L 150 360 L 120 320 L 100 280 Z"
              fill="#f8fafc"
              stroke="#cbd5e1"
              strokeWidth="2"
            />
            
            {/* Union Location Markers */}
            {isClient && filteredUnions.map(union => {
              const coords = convertToMapCoordinates(union.lat, union.lng)
              const isHovered = hoveredUnion === union.id
              const isSelected = selectedUnion?.id === union.id
              const color = getWageColor(union.baseWage)
              
              return (
                <HoverCard key={union.id}>
                  <HoverCardTrigger asChild>
                    <g className="cursor-pointer">
                      {/* Marker Circle */}
                      <circle
                        cx={coords.x}
                        cy={coords.y}
                        r={isHovered || isSelected ? 12 : 8}
                        fill={color}
                        stroke="white"
                        strokeWidth="3"
                        className="transition-all duration-200 drop-shadow-sm hover:drop-shadow-md"
                        onMouseEnter={() => setHoveredUnion(union.id)}
                        onMouseLeave={() => setHoveredUnion(null)}
                        onClick={() => setSelectedUnion(union)}
                      />
                      
                      {/* Wage Label */}
                      <text
                        x={coords.x}
                        y={coords.y - 20}
                        textAnchor="middle"
                        className="fill-slate-700 text-sm font-semibold pointer-events-none select-none"
                        style={{ fontSize: isHovered ? '14px' : '12px' }}
                      >
                        ${union.baseWage.toFixed(2)}/hr
                      </text>
                      
                      {/* City Label */}
                      <text
                        x={coords.x}
                        y={coords.y + 25}
                        textAnchor="middle"
                        className="fill-slate-600 text-xs pointer-events-none select-none"
                      >
                        {union.city}
                      </text>
                    </g>
                  </HoverCardTrigger>
                  
                  <HoverCardContent className="w-80">
                    <div className="space-y-2">
                      <div className="flex items-start gap-3">
                        <img 
                          src={union.logoPath} 
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
            
            {/* Legend */}
            <g transform="translate(20, 500)">
              <text x="0" y="0" className="fill-slate-700 text-sm font-semibold">Wage Levels:</text>
              <circle cx="15" cy="20" r="6" fill="#059669" />
              <text x="25" y="25" className="fill-slate-600 text-xs">$60+/hr</text>
              <circle cx="15" cy="40" r="6" fill="#2563eb" />
              <text x="25" y="45" className="fill-slate-600 text-xs">$50-60/hr</text>
              <circle cx="15" cy="60" r="6" fill="#7c3aed" />
              <text x="25" y="65" className="fill-slate-600 text-xs">$40-50/hr</text>
              <circle cx="15" cy="80" r="6" fill="#dc2626" />
              <text x="25" y="85" className="fill-slate-600 text-xs">Under $40/hr</text>
            </g>
          </svg>
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
                    src={union.logoPath} 
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