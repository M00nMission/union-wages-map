'use client'

import React from 'react'
import { Union, UnionTrade } from '@/types/union'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { 
  DollarSign, 
  Heart, 
  Building2, 
  Users, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Calendar,
  Shield,
  GraduationCap,
  Plane,
  Clock
} from 'lucide-react'

interface UnionModalProps {
  union: Union | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UnionModal({ union, open, onOpenChange }: UnionModalProps) {
  if (!union) return null

  // Helper function to get the correct logo path
  const getUnionLogoPath = (union: Union): string => {
    // Use IBEW logo for all electrical unions
    if (union.trade === UnionTrade.ELECTRICAL) {
      return '/union-logos/ibew-logo.png'
    }
    // Use the specified logo path for other unions
    return union.logoPath
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }
  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '')
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`
    }
    return phone
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-4 mb-4">
            <img 
              src={getUnionLogoPath(union)} 
              alt={union.name}
              className="w-16 h-16 rounded-lg object-cover bg-slate-100 flex-shrink-0"
              onError={(e) => {
                e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iOCIgZmlsbD0iIzk0YTNiOCIvPgo8cGF0aCBkPSJNMjAgMjBINDRWNDRIMjBWMjBaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K'
              }}
            />
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-xl font-bold text-slate-900 mb-1 leading-tight">
                {union.name}
              </DialogTitle>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <MapPin size={12} />
                  {union.city}, {union.state}
                </Badge>
                <Badge variant="outline">
                  {union.trade}
                </Badge>
                {union.established && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Calendar size={12} />
                    Est. {union.established}
                  </Badge>
                )}
              </div>
              <DialogDescription className="text-slate-600 text-sm">
                {union.description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Wage Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="text-green-600" size={20} />
                  <span className="font-semibold text-green-800">Base Wage</span>
                </div>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(union.baseWage)}/hr
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="text-blue-600" size={20} />
                  <span className="font-semibold text-blue-800">Fringe Benefits</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(union.fringeBenefits)}/hr
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-purple-200 bg-purple-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="text-purple-600" size={20} />
                  <span className="font-semibold text-purple-800">Total Package</span>
                </div>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(union.totalPackage)}/hr
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Annual Earnings Projection */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Clock size={18} />
                Annual Earnings (2,080 hours/year)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-slate-600">Base Salary:</span>
                  <p className="text-lg font-semibold text-slate-900">
                    {formatCurrency(union.baseWage * 2080)}
                  </p>
                </div>
                <div>
                  <span className="text-slate-600">Benefits Value:</span>
                  <p className="text-lg font-semibold text-slate-900">
                    {formatCurrency(union.fringeBenefits * 2080)}
                  </p>
                </div>
                <div>
                  <span className="text-slate-600">Total Package:</span>
                  <p className="text-xl font-bold text-slate-900">
                    {formatCurrency(union.totalPackage * 2080)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Union Details */}
            <Card>
              <CardContent className="p-4 space-y-4">
                <h3 className="font-semibold text-slate-900 mb-3">Union Details</h3>
                
                <div className="flex items-center gap-2">
                  <Users className="text-slate-500" size={16} />
                  <span className="text-slate-600">Members:</span>
                  <span className="font-medium">{union.members.toLocaleString()}</span>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="text-slate-500 mt-0.5" size={16} />
                  <div>
                    <span className="text-slate-600 block">Jurisdiction:</span>
                    <span className="font-medium text-sm">{union.jurisdiction}</span>
                  </div>
                </div>

                {union.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="text-slate-500" size={16} />
                    <a 
                      href={union.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardContent className="p-4 space-y-4">
                <h3 className="font-semibold text-slate-900 mb-3">Contact Information</h3>
                
                {union.contactInfo?.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="text-slate-500" size={16} />
                    <span className="text-slate-600">Phone:</span>
                    <a 
                      href={`tel:${union.contactInfo.phone}`}
                      className="font-medium text-blue-600 hover:text-blue-800"
                    >
                      {formatPhoneNumber(union.contactInfo.phone)}
                    </a>
                  </div>
                )}

                {union.contactInfo?.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="text-slate-500" size={16} />
                    <span className="text-slate-600">Email:</span>
                    <a 
                      href={`mailto:${union.contactInfo.email}`}
                      className="font-medium text-blue-600 hover:text-blue-800"
                    >
                      {union.contactInfo.email}
                    </a>
                  </div>
                )}

                {union.contactInfo?.address && (
                  <div className="flex items-start gap-2">
                    <Building2 className="text-slate-500 mt-0.5" size={16} />
                    <div>
                      <span className="text-slate-600 block">Address:</span>
                      <span className="font-medium text-sm">{union.contactInfo.address}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Benefits Information */}
          {union.benefits && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Shield size={18} />
                  Member Benefits
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${union.benefits.healthInsurance ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className="text-sm text-slate-600">Health Insurance</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${union.benefits.pension ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className="text-sm text-slate-600">Pension Plan</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Plane className="text-slate-500" size={14} />
                    <span className="text-sm text-slate-600">{union.benefits.vacation} days vacation</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${union.benefits.apprenticeship ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className="text-sm text-slate-600">Apprenticeship</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}