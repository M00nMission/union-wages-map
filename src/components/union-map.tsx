'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { Union, UnionFilters as UnionFiltersType, UnionTrade } from '@/types/union'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { UnionModal } from '@/components/union-modal'
import { UnionFilters } from '@/components/union-filters'
import { MapPin, DollarSign, Users, Building2, TrendingUp, ZoomIn, ZoomOut, RotateCcw, Maximize2, Minimize2 } from 'lucide-react'
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

// Helper function to format currency with proper commas (no cents)
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

interface UnionMapProps {
  unions: Union[]
}

export function UnionMap({ unions }: UnionMapProps) {
  const [selectedUnion, setSelectedUnion] = useState<Union | null>(null)
  const [hoveredUnion, setHoveredUnion] = useState<number | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [mapPosition, setMapPosition] = useState({
    zoom: 1,
    center: [-98.5795, 39.8283] as [number, number] // Center of USA
  })
  const [selectedState, setSelectedState] = useState<string | null>(null)
  const [isMapInViewport, setIsMapInViewport] = useState(false)
  const [mapRef, setMapRef] = useState<HTMLDivElement | null>(null)
  const [isHovering, setIsHovering] = useState(false)
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

  // Intersection Observer to detect when map is in viewport
  useEffect(() => {
    if (!mapRef || !isClient) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsMapInViewport(entry.isIntersecting)
        })
      },
      {
        threshold: 0.1, // Trigger when 10% of map is visible
        rootMargin: '0px'
      }
    )

    observer.observe(mapRef)

    return () => {
      observer.disconnect()
    }
  }, [mapRef, isClient])


  // Keyboard shortcuts for zoom controls - only when map is in viewport
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle shortcuts when map is in viewport and not typing in input fields
      if (!isMapInViewport || event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return
      }

      switch (event.key) {
        case '+':
        case '=':
          event.preventDefault()
          zoomIn()
          break
        case '-':
          event.preventDefault()
          zoomOut()
          break
        case '0':
          event.preventDefault()
          zoomToFit()
          break
        case 'Escape':
          event.preventDefault()
          setSelectedUnion(null)
          setHoveredUnion(null)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isMapInViewport])

  // Global wheel event listener for zoom when map is in viewport
  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      // Only handle wheel events when map is in viewport
      if (!isMapInViewport) return

      // Check if the wheel event is over the map component
      if (mapRef && mapRef.contains(event.target as Node)) {
        event.preventDefault()
        
        // Zoom towards the center of the map
        const delta = event.deltaY > 0 ? 0.9 : 1.1
        const newZoom = Math.max(0.8, Math.min(8, mapPosition.zoom * delta))
        
        setMapPosition(prev => ({
          zoom: newZoom,
          center: prev.center
        }))
      }
    }

    // Use passive: false to allow preventDefault
    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [isMapInViewport, mapRef, mapPosition.zoom])

  // Auto-zoom to selected state when filter changes
  useEffect(() => {
    if (filters.state && filters.state !== selectedState) {
      setSelectedState(filters.state)
      zoomToState(filters.state)
    } else if (!filters.state && selectedState) {
      setSelectedState(null)
      resetMapView()
    }
  }, [filters.state, selectedState])


  // Function to reset map to default view
  const resetMapView = () => {
    setMapPosition({
      zoom: 1,
      center: [-98.5795, 39.8283] // Center of USA
    })
  }

  // Handle map position changes
  const handleMapMove = (position: { coordinates: [number, number]; zoom: number }) => {
    setMapPosition({
      zoom: position.zoom,
      center: position.coordinates
    })
  }

  // Zoom control functions with smooth transitions and higher max zoom
  const zoomIn = () => {
    setMapPosition(prev => ({
      zoom: Math.min(prev.zoom * 1.3, 8), // Increased from 4 to 8
      center: prev.center
    }))
  }

  const zoomOut = () => {
    setMapPosition(prev => ({
      zoom: Math.max(prev.zoom / 1.3, 0.8),
      center: prev.center
    }))
  }

  const zoomToFit = () => {
    setMapPosition({
      zoom: 1,
      center: [-98.5795, 39.8283] // Center of USA
    })
  }

  const zoomToState = (stateCode: string) => {
    // State center coordinates (approximate)
    const stateCenters: Record<string, [number, number]> = {
      'AL': [-86.7911, 32.8067], 'AK': [-149.4937, 63.5887], 'AZ': [-111.4312, 33.7298],
      'AR': [-92.3731, 34.9697], 'CA': [-119.6816, 36.7783], 'CO': [-105.3111, 39.5501],
      'CT': [-72.7554, 41.6032], 'DE': [-75.5071, 39.3185], 'FL': [-81.6868, 27.6648],
      'GA': [-83.6431, 33.0406], 'HI': [-157.4983, 19.8968], 'ID': [-114.4789, 44.2405],
      'IL': [-88.9861, 40.3495], 'IN': [-86.1349, 39.8494], 'IA': [-93.2105, 42.0329],
      'KS': [-96.7265, 38.5266], 'KY': [-84.6701, 37.6681], 'LA': [-91.8678, 31.1695],
      'ME': [-69.3812, 44.6939], 'MD': [-76.6413, 39.0639], 'MA': [-71.5301, 42.2304],
      'MI': [-84.5363, 43.3266], 'MN': [-93.9000, 46.7296], 'MS': [-89.6785, 32.7416],
      'MO': [-92.2884, 38.4561], 'MT': [-110.4544, 46.8797], 'NE': [-99.9018, 41.4925],
      'NV': [-117.0554, 38.8026], 'NH': [-71.5639, 43.1939], 'NJ': [-74.2179, 40.0583],
      'NM': [-106.0189, 34.5199], 'NY': [-74.2179, 42.1657], 'NC': [-79.0193, 35.7596],
      'ND': [-99.7840, 47.5515], 'OH': [-82.7937, 40.4173], 'OK': [-96.9289, 35.0078],
      'OR': [-120.5542, 43.8041], 'PA': [-77.7996, 40.5908], 'RI': [-71.5118, 41.6809],
      'SC': [-80.9450, 33.8569], 'SD': [-99.4388, 44.2998], 'TN': [-86.6923, 35.7478],
      'TX': [-99.9018, 31.9686], 'UT': [-111.8624, 39.3210], 'VT': [-72.7107, 44.0459],
      'VA': [-78.1697, 37.4316], 'WA': [-121.4904, 47.4009], 'WV': [-80.7939, 38.5976],
      'WI': [-89.6165, 44.2685], 'WY': [-107.3025, 42.7475]
    }

    const stateCenter = stateCenters[stateCode]
    if (stateCenter) {
      setMapPosition({
        zoom: 3.5, // Zoom level appropriate for state view
        center: stateCenter
      })
    }
  }

  // Quick zoom presets with higher max zoom
  const zoomPresets = [
    { name: 'Country', zoom: 1, center: [-98.5795, 39.8283] as [number, number] },
    { name: 'Region', zoom: 2, center: [-98.5795, 39.8283] as [number, number] },
    { name: 'State', zoom: 3.5, center: [-98.5795, 39.8283] as [number, number] },
    { name: 'City', zoom: 5, center: [-98.5795, 39.8283] as [number, number] },
    { name: 'Detail', zoom: 7, center: [-98.5795, 39.8283] as [number, number] }
  ]

  const applyZoomPreset = (preset: typeof zoomPresets[0]) => {
    setMapPosition({
      zoom: preset.zoom,
      center: preset.center
    })
  }


  // Handle map container hover for cursor management
  const handleMapContainerMouseEnter = () => {
    setIsHovering(true)
  }

  const handleMapContainerMouseLeave = () => {
    setIsHovering(false)
  }




  // Function to handle state click
  const handleStateClick = (geo: { properties: { STUSPS: string } }) => {
    const stateCode = geo.properties.STUSPS
    if (stateCode) {
      setSelectedState(stateCode)
      setFilters(prev => ({ ...prev, state: stateCode }))
      zoomToState(stateCode)
    }
  }


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

  // Clustering logic for nearby unions
  const clusteredUnions = useMemo(() => {
    if (mapPosition.zoom < 1.5) {
      // At low zoom levels, cluster nearby unions
      const clusters: Array<{
        id: string
        unions: Union[]
        centerLat: number
        centerLng: number
        avgWage: number
        totalMembers: number
        isCluster: boolean
      }> = []
      
      const processed = new Set<number>()
      const clusterRadius = 0.5 // degrees
      
      filteredUnions.forEach(union => {
        if (processed.has(union.id)) return
        
        const nearbyUnions = filteredUnions.filter(other => {
          if (processed.has(other.id) || other.id === union.id) return false
          const distance = Math.sqrt(
            Math.pow(union.lat - other.lat, 2) + Math.pow(union.lng - other.lng, 2)
          )
          return distance < clusterRadius
        })
        
        if (nearbyUnions.length > 0) {
          // Create cluster
          const clusterUnions = [union, ...nearbyUnions]
          const centerLat = clusterUnions.reduce((sum, u) => sum + u.lat, 0) / clusterUnions.length
          const centerLng = clusterUnions.reduce((sum, u) => sum + u.lng, 0) / clusterUnions.length
          const avgWage = clusterUnions.reduce((sum, u) => sum + u.baseWage, 0) / clusterUnions.length
          const totalMembers = clusterUnions.reduce((sum, u) => sum + u.members, 0)
          
          clusters.push({
            id: `cluster-${union.id}`,
            unions: clusterUnions,
            centerLat,
            centerLng,
            avgWage,
            totalMembers,
            isCluster: true
          })
          
          clusterUnions.forEach(u => processed.add(u.id))
        } else {
          // Single union
          clusters.push({
            id: `single-${union.id}`,
            unions: [union],
            centerLat: union.lat,
            centerLng: union.lng,
            avgWage: union.baseWage,
            totalMembers: union.members,
            isCluster: false
          })
          processed.add(union.id)
        }
      })
      
      return clusters
    } else {
      // At high zoom levels, show individual unions
      return filteredUnions.map(union => ({
        id: `single-${union.id}`,
        unions: [union],
        centerLat: union.lat,
        centerLng: union.lng,
        avgWage: union.baseWage,
        totalMembers: union.members,
        isCluster: false
      }))
    }
  }, [filteredUnions, mapPosition.zoom])

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

  // Calculate clustering statistics
  const clusteringStats = useMemo(() => {
    const totalClusters = clusteredUnions.length
    const clusteredUnionsCount = clusteredUnions.filter(c => c.isCluster).length
    const singleUnionsCount = clusteredUnions.filter(c => !c.isCluster).length
    
    return {
      totalClusters,
      clusteredUnionsCount,
      singleUnionsCount,
      clusteringActive: mapPosition.zoom < 1.5
    }
  }, [clusteredUnions, mapPosition.zoom])

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
            <div className="text-2xl font-bold text-green-600">{formatCurrency(statistics.avgWage)}/hr</div>
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
            <div className="text-2xl font-bold text-orange-600">{formatCurrency(statistics.avgBenefits)}/hr</div>
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
              <div 
                ref={setMapRef}
                className={`w-full h-[600px] bg-slate-50 rounded-lg border overflow-hidden relative touch-pan-x touch-pan-y touch-pinch-zoom map-container select-none transition-all duration-300 ${
                  isMapInViewport ? 'ring-2 ring-blue-200' : ''
                }`}
                onMouseEnter={handleMapContainerMouseEnter}
                onMouseLeave={handleMapContainerMouseLeave}
                style={{
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  MozUserSelect: 'none',
                  msUserSelect: 'none',
                  WebkitTouchCallout: 'none',
                  WebkitTapHighlightColor: 'transparent',
                  touchAction: 'pan-x pan-y pinch-zoom', // Allow touch gestures but control them
                  cursor: isHovering ? 'grab' : 'default'
                }}
              >
                {/* Reset Button - Prominent */}
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
                  <Button
                    onClick={zoomToFit}
                    className="bg-white/95 backdrop-blur-sm border border-slate-200 shadow-lg hover:bg-white hover:shadow-xl transition-all duration-200 px-4 py-2 cursor-pointer"
                    variant="outline"
                  >
                    <RotateCcw size={16} className="mr-2" />
                    <span className="font-medium">Reset View</span>
                  </Button>
                </div>

                {/* Unified Zoom Controls */}
                <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
                  {/* Zoom Controls - Same for all devices */}
                  <div className="flex gap-1 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-lg shadow-lg p-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={zoomIn}
                      disabled={mapPosition.zoom >= 8}
                      className="h-10 w-10 p-0 touch-manipulation cursor-pointer"
                    >
                      <ZoomIn size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={zoomOut}
                      disabled={mapPosition.zoom <= 0.8}
                      className="h-10 w-10 p-0 touch-manipulation cursor-pointer"
                    >
                      <ZoomOut size={16} />
                    </Button>
                  </div>

                  {/* Zoom Level Indicator */}
                  <div className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-600 shadow-lg">
                    <div className="font-medium">Zoom: {Math.round(mapPosition.zoom * 100)}%</div>
                    <div className="text-slate-500">
                      {mapPosition.zoom < 1.5 ? 'Clustered' : 'Individual'}
                    </div>
                    {isMapInViewport && (
                      <div className="text-green-600 font-medium mt-1">
                        🎯 Active
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Zoom Presets */}
                <div className="absolute bottom-4 right-4 z-20">
                  <div className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-lg shadow-lg p-2">
                    <div className="text-xs font-medium text-slate-700 mb-2">Quick Views</div>
                    <div className="flex flex-col gap-1">
                      {zoomPresets.map((preset, index) => (
                        <Button
                          key={preset.name}
                          variant="ghost"
                          size="sm"
                          onClick={() => applyZoomPreset(preset)}
                          className={`h-6 text-xs justify-start touch-manipulation cursor-pointer ${
                            Math.abs(mapPosition.zoom - preset.zoom) < 0.1 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'hover:bg-slate-100'
                          }`}
                        >
                          {preset.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>


                {/* Debug Info - Only in development */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="absolute bottom-2 left-2 z-30 pointer-events-none">
                    <div className="bg-black/80 text-white px-2 py-1 rounded text-xs font-mono shadow-lg">
                      <div>Zoom: {Math.round(mapPosition.zoom * 100)}%</div>
                      <div>Center: [{mapPosition.center[0].toFixed(1)}, {mapPosition.center[1].toFixed(1)}]</div>
                      <div>Viewport: {isMapInViewport ? 'YES' : 'NO'}</div>
                    </div>
                  </div>
                )}
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
                <ZoomableGroup 
                  zoom={mapPosition.zoom} 
                  center={mapPosition.center} 
                  onMoveEnd={handleMapMove}
                  minZoom={0.8}
                  maxZoom={8}
                  translateExtent={[[-500, -500], [500, 500]]}
                  filterZoomEvent={(event: any) => {
                    // Allow pinch-to-zoom and wheel events when map is in viewport
                    return event.type === 'touchstart' || event.type === 'touchmove' || (event.type === 'wheel' && isMapInViewport)
                  }}
                >
                  <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                      geographies.map(geo => {
                        const stateCode = geo.properties.STUSPS
                        const isSelected = selectedState === stateCode
                        const hasUnions = filteredUnions.some(union => union.state === stateCode)
                        
                        return (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            fill={isSelected ? '#3b82f6' : hasUnions ? '#f1f5f9' : '#f8fafc'}
                            stroke={isSelected ? '#1d4ed8' : '#64748b'}
                            strokeWidth={isSelected ? 2.5 : 1.5}
                            style={{
                              default: { outline: 'none', cursor: 'pointer' },
                              hover: { 
                                fill: isSelected ? '#60a5fa' : '#e2e8f0',
                                outline: 'none',
                                stroke: isSelected ? '#1d4ed8' : '#475569',
                                strokeWidth: isSelected ? 2.5 : 2
                              },
                              pressed: { outline: 'none' }
                            }}
                            onClick={() => handleStateClick(geo)}
                          />
                        )
                      })
                    }
                  </Geographies>
                  
                  {/* Union Location Markers - Now with clustering */}
                  {clusteredUnions.map(cluster => {
                    const primaryUnion = cluster.unions[0]
                    const isHovered = hoveredUnion === primaryUnion.id
                    const isSelected = selectedUnion?.id === primaryUnion.id
                    const color = getWageColor(cluster.avgWage)
                    
                    // Dynamic marker sizes based on zoom and cluster size - smaller for better readability
                    const zoomFactor = Math.max(0.3, 1 / mapPosition.zoom) // More aggressive scaling for text
                    const textZoomFactor = Math.max(0.2, 1 / (mapPosition.zoom * 1.5)) // Even more aggressive for text
                    const baseMarkerSize = cluster.isCluster 
                      ? Math.min((6 + cluster.unions.length * 0.3) * zoomFactor, 8) 
                      : Math.max(3, 4 * zoomFactor)
                    const hoveredMarkerSize = baseMarkerSize + 1
                    const selectedMarkerSize = baseMarkerSize + 2
                    
                    // Improved label visibility based on zoom and density - more conservative
                    const showWageLabel = mapPosition.zoom > 2.5
                    const showCityLabel = mapPosition.zoom > 3.5
                    const showClusterCount = cluster.isCluster && mapPosition.zoom > 1.8
                    
                    // Calculate marker size based on state
                    let markerSize = baseMarkerSize
                    if (isSelected) markerSize = selectedMarkerSize
                    else if (isHovered) markerSize = hoveredMarkerSize
                    
                    return (
                      <HoverCard key={cluster.id}>
                        <HoverCardTrigger asChild>
                          <Marker coordinates={[cluster.centerLng, cluster.centerLat]}>
                            <g className="cursor-pointer">
                              {/* Background circle for better text readability */}
                              {(showWageLabel || showClusterCount) && (
                                <circle
                                  r={markerSize + 10}
                                  fill="rgba(255, 255, 255, 0.95)"
                                  stroke="rgba(255, 255, 255, 0.9)"
                                  strokeWidth={1.5}
                                  className="pointer-events-none"
                                />
                              )}
                              
                              {/* Main Marker Circle */}
                              <circle
                                r={markerSize}
                                fill={color}
                                stroke="white"
                                strokeWidth={cluster.isCluster ? 3 : 2}
                                className="transition-all duration-200 drop-shadow-md hover:drop-shadow-lg"
                                onMouseEnter={() => setHoveredUnion(primaryUnion.id)}
                                onMouseLeave={() => setHoveredUnion(null)}
                                onClick={() => setSelectedUnion(primaryUnion)}
                              />
                              
                              {/* Cluster count indicator */}
                              {showClusterCount && cluster.isCluster && (
                                <text
                                  y={markerSize * 0.3}
                                  textAnchor="middle"
                                  className="fill-white font-bold pointer-events-none select-none"
                                  style={{ 
                                    fontSize: Math.max(6, Math.min(markerSize * 0.8, 10) * textZoomFactor),
                                    fontWeight: '700',
                                    textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                                  }}
                                >
                                  {cluster.unions.length}
                                </text>
                              )}
                              
                              {/* Wage Label - Clean, readable positioning with zoom-based sizing */}
                              {showWageLabel && (
                                <text
                                  y={-markerSize - 8}
                                  textAnchor="middle"
                                  className="fill-slate-800 font-semibold pointer-events-none select-none"
                                  style={{ 
                                    fontSize: Math.max(6, (cluster.isCluster ? 9 : 10) * textZoomFactor),
                                    fontWeight: '600',
                                    textShadow: '0 1px 3px rgba(255,255,255,0.9)'
                                  }}
                                >
                                  {formatCurrency(cluster.avgWage)}/hr
                                </text>
                              )}
                              
                              {/* City Label - Below marker for clarity with zoom-based sizing */}
                              {showCityLabel && !cluster.isCluster && (
                                <text
                                  y={markerSize + 10}
                                  textAnchor="middle"
                                  className="fill-slate-600 font-medium pointer-events-none select-none"
                                  style={{ 
                                    fontSize: Math.max(5, 8 * textZoomFactor),
                                    textShadow: '0 1px 2px rgba(255,255,255,0.9)'
                                  }}
                                >
                                  {primaryUnion.city}
                                </text>
                              )}
                              
                              {/* Cluster area indicator */}
                              {cluster.isCluster && mapPosition.zoom > 2.0 && (
                                <circle
                                  r={markerSize + 15}
                                  fill="none"
                                  stroke={color}
                                  strokeWidth={1}
                                  strokeDasharray="3,3"
                                  opacity={0.4}
                                  className="pointer-events-none"
                                />
                              )}
                            </g>
                          </Marker>
                        </HoverCardTrigger>
                        
                        <HoverCardContent className="w-80">
                          <div className="space-y-2">
                            {cluster.isCluster ? (
                              // Cluster hover card
                              <div>
                                <div className="flex items-start gap-3 mb-3">
                                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                                    {cluster.unions.length}
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-slate-900">
                                      {cluster.unions.length} Unions in Area
                                    </h4>
                                    <p className="text-sm text-slate-600">
                                      Average wage: {formatCurrency(cluster.avgWage)}/hr
                                    </p>
                                    <div className="flex items-center gap-4 mt-1">
                                      <span className="text-sm font-medium text-green-600">
                                        {cluster.totalMembers.toLocaleString()} total members
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="space-y-1 max-h-32 overflow-y-auto">
                                  {cluster.unions.slice(0, 5).map(union => (
                                    <div key={union.id} className="flex justify-between items-center text-xs py-1 border-b border-slate-100 last:border-b-0">
                                      <span className="font-medium">{union.shortName}</span>
                                      <span className="text-green-600">{formatCurrency(union.baseWage)}/hr</span>
                                    </div>
                                  ))}
                                  {cluster.unions.length > 5 && (
                                    <div className="text-xs text-slate-500 text-center py-1">
                                      +{cluster.unions.length - 5} more unions
                                    </div>
                                  )}
                                </div>
                                
                                <Badge variant="outline" className="text-xs mt-2">
                                  {cluster.unions[0].trade}
                                </Badge>
                              </div>
                            ) : (
                              // Single union hover card
                              <div>
                            <div className="flex items-start gap-3">
                              <img 
                                    src={getUnionLogoPath(primaryUnion)} 
                                    alt={primaryUnion.name}
                                className="w-12 h-12 rounded-lg object-cover bg-slate-100"
                                onError={(e) => {
                                  e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iOCIgZmlsbD0iIzk0YTNiOCIvPgo8cGF0aCBkPSJNMTYgMTZIMzJWMzJIMTZWMTZaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K'
                                }}
                              />
                              <div>
                                    <h4 className="font-semibold text-slate-900">{primaryUnion.shortName}</h4>
                                    <p className="text-sm text-slate-600">{primaryUnion.city}, {primaryUnion.state}</p>
                                <div className="flex items-center gap-4 mt-1">
                                  <span className="text-sm font-medium text-green-600">
                                        {formatCurrency(primaryUnion.baseWage)}/hr
                                  </span>
                                  <span className="text-xs text-slate-500">
                                        {primaryUnion.members.toLocaleString()} members
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-slate-500">Benefits:</span>
                                    <span className="font-medium ml-1">{formatCurrency(primaryUnion.fringeBenefits)}/hr</span>
                              </div>
                              <div>
                                <span className="text-slate-500">Total:</span>
                                    <span className="font-medium ml-1">{formatCurrency(primaryUnion.totalPackage)}/hr</span>
                              </div>
                            </div>
                            
                            <Badge variant="outline" className="text-xs">
                                  {primaryUnion.trade}
                            </Badge>
                              </div>
                            )}
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    )
                  })}
                </ZoomableGroup>
                              </ComposableMap>

                {/* Map Instructions and State Info */}
                <div className="absolute top-4 left-4 z-10 space-y-2">
                  <div className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-600 shadow-lg">
                    <div className="font-medium mb-2 text-slate-700">🗺️ Map Controls</div>
                    <div className="space-y-1 text-slate-500">
                      <div className="font-medium text-slate-600">All Devices:</div>
                      <div>• Drag to pan smoothly</div>
                      <div>• Pinch to zoom (touch devices)</div>
                      <div>• Mouse wheel to zoom (when map is visible)</div>
                      <div>• Use zoom buttons</div>
                      <div>• +/- keys to zoom (when map is visible)</div>
                      <div>• 0 key to reset view</div>
                      <div>• ESC to clear selection</div>
                      <div className="font-medium text-slate-600 mt-2">General:</div>
                      <div>• Click states to zoom in</div>
                      <div>• Hover over markers for details</div>
                      {isMapInViewport && (
                        <div className="text-green-600 font-medium">• Map is active - zoom controls enabled</div>
                      )}
                      {clusteringStats.clusteringActive && (
                        <div className="text-blue-600 font-medium">• Zoom in to see individual unions</div>
                      )}
                    </div>
                  </div>
                  
                  {/* Union Density Info */}
                  <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-xs text-green-700 shadow-lg">
                    <div className="font-medium mb-1">📊 Union Coverage</div>
                    <div className="text-green-600">
                      {filteredUnions.length} unions • {new Set(filteredUnions.map(u => u.state)).size} states
                    </div>
                    {clusteringStats.clusteringActive && (
                      <div className="text-green-600 mt-1">
                        {clusteringStats.clusteredUnionsCount} clusters • {clusteringStats.singleUnionsCount} individual
                      </div>
                    )}
                  </div>
                  
                  {selectedState && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-xs text-blue-700 shadow-lg">
                      <div className="font-medium mb-1">📍 Selected State: {selectedState}</div>
                      <div className="text-blue-600">
                        {filteredUnions.filter(u => u.state === selectedState).length} unions found
                      </div>
                      <button 
                        onClick={resetMapView}
                        className="text-blue-600 hover:text-blue-800 underline mt-1"
                      >
                        Reset view
                      </button>
                    </div>
                  )}
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

        {/* Enhanced Legend */}
        <div className="mt-6 p-4 bg-slate-50 rounded-lg border">
          <div className="text-center mb-3">
            <h3 className="text-sm font-semibold text-slate-700 mb-2">Wage Level Legend</h3>
            <p className="text-xs text-slate-500">Click on markers to see detailed information</p>
            {clusteringStats.clusteringActive && (
              <p className="text-xs text-blue-600 font-medium mt-1">
                🔗 Clustering active - zoom in to see individual unions
              </p>
            )}
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-600 shadow-sm"></div>
              <div className="text-xs">
                <div className="font-medium text-slate-700">$60+/hr</div>
                <div className="text-slate-500">Premium</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-600 shadow-sm"></div>
              <div className="text-xs">
                <div className="font-medium text-slate-700">$50-60/hr</div>
                <div className="text-slate-500">High</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-purple-600 shadow-sm"></div>
              <div className="text-xs">
                <div className="font-medium text-slate-700">$40-50/hr</div>
                <div className="text-slate-500">Medium</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-600 shadow-sm"></div>
              <div className="text-xs">
                <div className="font-medium text-slate-700">Under $40/hr</div>
                <div className="text-slate-500">Entry</div>
              </div>
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
                    <span className="font-semibold text-green-600">{formatCurrency(union.baseWage)}/hr</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 text-sm">Benefits:</span>
                    <span className="font-semibold text-blue-600">{formatCurrency(union.fringeBenefits)}/hr</span>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-slate-100">
                    <span className="text-slate-600 text-sm">Total Package:</span>
                    <span className="font-bold text-purple-600">{formatCurrency(union.totalPackage)}/hr</span>
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