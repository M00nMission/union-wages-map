'use client'

import React, { useMemo } from 'react'
import { Union, UnionTrade } from '@/types/union'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Filter, X, TrendingUp, MapPin, Briefcase, DollarSign } from 'lucide-react'

interface UnionFilters {
  trade?: UnionTrade
  state?: string
  minWage?: number
  maxWage?: number
}

interface UnionFiltersProps {
  filters: UnionFilters
  onFiltersChange: (filters: UnionFilters) => void
  unions: Union[]
}

export function UnionFilters({ filters, onFiltersChange, unions }: UnionFiltersProps) {
  // Get unique values for filter options
  const { uniqueStates, uniqueTrades, wageRanges } = useMemo(() => {
    const states = [...new Set(unions.map(union => union.state))].sort()
    const trades = [...new Set(unions.map(union => union.trade))].sort()
    
    const wages = unions.map(union => union.baseWage).sort((a, b) => a - b)
    const minWage = Math.floor(wages[0] / 5) * 5 // Round down to nearest 5
    const maxWage = Math.ceil(wages[wages.length - 1] / 5) * 5 // Round up to nearest 5
    
    const ranges = [
      { label: 'Under $30/hr', min: 0, max: 30 },
      { label: '$30 - $40/hr', min: 30, max: 40 },
      { label: '$40 - $50/hr', min: 40, max: 50 },
      { label: '$50 - $60/hr', min: 50, max: 60 },
      { label: '$60 - $70/hr', min: 60, max: 70 },
      { label: 'Over $70/hr', min: 70, max: 999 }
    ]
    
    return { 
      uniqueStates: states, 
      uniqueTrades: trades, 
      wageRanges: ranges 
    }
  }, [unions])

  // Count active filters
  const activeFiltersCount = Object.values(filters).filter(Boolean).length

  // Clear all filters
  const clearAllFilters = () => {
    onFiltersChange({})
  }

  // Update specific filter
  const updateFilter = (key: keyof UnionFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value === 'all' ? undefined : value
    })
  }

  // Set wage range filter
  const setWageRange = (min?: number, max?: number) => {
    onFiltersChange({
      ...filters,
      minWage: min,
      maxWage: max === 999 ? undefined : max
    })
  }

  // Get current wage range label
  const getCurrentWageRangeLabel = () => {
    if (!filters.minWage && !filters.maxWage) return 'All Wages'
    
    const range = wageRanges.find(r => 
      r.min === filters.minWage && 
      (r.max === 999 ? !filters.maxWage : r.max === filters.maxWage)
    )
    
    return range?.label || 'Custom Range'
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Filter size={18} />
            Filter Unions
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount} active
              </Badge>
            )}
          </CardTitle>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-slate-500 hover:text-slate-700"
            >
              <X size={14} className="mr-1" />
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Trade Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
              <Briefcase size={14} />
              Trade Type
            </label>
            <Select
              value={filters.trade || 'all'}
              onValueChange={(value) => updateFilter('trade', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Trades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Trades</SelectItem>
                {uniqueTrades.map(trade => (
                  <SelectItem key={trade} value={trade}>
                    {trade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* State Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
              <MapPin size={14} />
              State
            </label>
            <Select
              value={filters.state || 'all'}
              onValueChange={(value) => updateFilter('state', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All States" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                {uniqueStates.map(state => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Wage Range Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
              <DollarSign size={14} />
              Wage Range
            </label>
            <Select
              value={`${filters.minWage || 0}-${filters.maxWage || 999}`}
              onValueChange={(value) => {
                if (value === 'all') {
                  setWageRange(undefined, undefined)
                } else {
                  const [min, max] = value.split('-').map(Number)
                  setWageRange(min || undefined, max === 999 ? undefined : max)
                }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Wages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Wages</SelectItem>
                {wageRanges.map(range => (
                  <SelectItem 
                    key={`${range.min}-${range.max}`} 
                    value={`${range.min}-${range.max}`}
                  >
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quick Stats */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
              <TrendingUp size={14} />
              Results
            </label>
            <div className="bg-slate-50 rounded-md p-3 text-center">
              <div className="text-2xl font-bold text-slate-900">
                {unions.filter(union => {
                  if (filters.trade && union.trade !== filters.trade) return false
                  if (filters.state && union.state !== filters.state) return false
                  if (filters.minWage && union.baseWage < filters.minWage) return false
                  if (filters.maxWage && union.baseWage > filters.maxWage) return false
                  return true
                }).length}
              </div>
              <div className="text-xs text-slate-600">Unions Found</div>
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200">
            <span className="text-sm text-slate-600">Active filters:</span>
            
            {filters.trade && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Briefcase size={12} />
                {filters.trade}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                  onClick={() => updateFilter('trade', undefined)}
                >
                  <X size={10} />
                </Button>
              </Badge>
            )}
            
            {filters.state && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <MapPin size={12} />
                {filters.state}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                  onClick={() => updateFilter('state', undefined)}
                >
                  <X size={10} />
                </Button>
              </Badge>
            )}
            
            {(filters.minWage || filters.maxWage) && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <DollarSign size={12} />
                {getCurrentWageRangeLabel()}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                  onClick={() => setWageRange(undefined, undefined)}
                >
                  <X size={10} />
                </Button>
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}