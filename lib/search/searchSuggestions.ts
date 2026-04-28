import type { ProductSearchDocument, SearchSuggestionDocument, SearchSuggestionResult } from '@/types/search'
import { buildSuggestionId, normalizeSearchQuery } from './searchUtils'
  
  function createSuggestion(params: {
    text: string
    type: SearchSuggestionDocument['type']
    weight: number
    sourceId?: string | null
  }): SearchSuggestionDocument | null {
    const normalizedText = normalizeSearchQuery(params.text)
  
    if (!normalizedText) {
      return null
    }
  
    return {
      id: buildSuggestionId(normalizedText, params.type),
      text: normalizedText,
      type: params.type,
      weight: params.weight,
      source_id: params.sourceId ?? null,
    }
  }
  
  export function buildSuggestionsFromProducts(
    products: ProductSearchDocument[]
  ): SearchSuggestionDocument[] {
    const suggestionMap = new Map<string, SearchSuggestionDocument>()
  
    for (const product of products) {
      const productNameSuggestion = createSuggestion({
        text: product.name,
        type: 'product_name',
        weight: 100,
        sourceId: product.id,
      })
  
      if (productNameSuggestion) {
        suggestionMap.set(productNameSuggestion.id, productNameSuggestion)
      }
  
      if (product.category_name) {
        const categorySuggestion = createSuggestion({
          text: product.category_name,
          type: 'category',
          weight: 70,
          sourceId: product.category_id,
        })
  
        if (categorySuggestion) {
          suggestionMap.set(categorySuggestion.id, categorySuggestion)
        }
      }
  
      for (const categoryName of product.category_path) {
        const categoryPathSuggestion = createSuggestion({
          text: categoryName,
          type: 'category',
          weight: 60,
          sourceId: product.category_id,
        })
  
        if (categoryPathSuggestion) {
          suggestionMap.set(categoryPathSuggestion.id, categoryPathSuggestion)
        }
      }
  
      for (const tag of product.tags) {
        const tagSuggestion = createSuggestion({
          text: tag,
          type: 'tag',
          weight: 80,
          sourceId: product.id,
        })
  
        if (tagSuggestion) {
          suggestionMap.set(tagSuggestion.id, tagSuggestion)
        }
      }
    }
  
    return Array.from(suggestionMap.values())
  }
  
  export function mapSuggestionDocumentsToResults(
    suggestions: SearchSuggestionDocument[]
  ): SearchSuggestionResult[] {
    return suggestions.map((suggestion) => ({
      text: suggestion.text,
      type: suggestion.type,
    }))
  }