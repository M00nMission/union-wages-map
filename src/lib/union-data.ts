import { Union, UnionTrade } from '@/types/union'
import { ibewData } from './ibew-data'

export const unionData: Union[] = [
  // IBEW Electrician data from unionpayscales.com
  ...ibewData,
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