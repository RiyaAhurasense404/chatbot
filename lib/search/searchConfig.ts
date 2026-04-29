export const SEARCH_INDEXES = {
    PRODUCTS: 'products',
    SUGGESTIONS: 'search_suggestions',
  } as const
  
  export const SEARCH_CONFIG = {
    MIN_QUERY_LENGTH: 3,
    MAX_QUERY_LENGTH: 80,
  
    PUBLIC_PRODUCT_LIMIT: 8,
    PUBLIC_SUGGESTION_LIMIT: 5,
    ADMIN_PRODUCT_LIMIT: 20,
  
    PUBLIC_SEARCH_TTL_SECONDS: 120,
    PUBLIC_SUGGESTION_TTL_SECONDS: 60,
    ADMIN_SEARCH_TTL_SECONDS: 30,
  
    DEFAULT_SEARCH_VERSION: 1,
  } as const
  
  export const PRODUCT_SEARCHABLE_ATTRIBUTES = [
    'name',
    'tags',
    'category_name',
    'category_path',
    'tag_text',
  ] as const
  
export const PRODUCT_FILTERABLE_ATTRIBUTES = [
    'is_active',
    'category_id',
    'category_name',
    'tags',
    'price',
    'final_price',
    'stock_status',
    'stock',
    'stock_rank',
    'popularity_score',
    'order_count',
    'cart_add_count',
    'search_click_count',
    'view_count',
  ] as const
  
export const PRODUCT_SORTABLE_ATTRIBUTES = [
    'price',
    'final_price',
    'created_at',
    'display_order',
    'stock',
    'stock_rank',
    'popularity_score',
    'order_count',
    'cart_add_count',
    'search_click_count',
    'view_count',
  ] as const
  
  export const PRODUCT_RANKING_RULES = [
    'words',
    'typo',
    'proximity',
    'attribute',
    'sort',
    'exactness',
    'stock_rank:desc',
    'popularity_score:desc',
    'order_count:desc',
    'cart_add_count:desc',
    'search_click_count:desc',
    'view_count:desc',
    'display_order:asc',
    'created_at:desc',
  ] as const
  
  export const PRODUCT_SYNONYMS = {
    atta: ['flour', 'aata'],
    flour: ['atta', 'aata'],
  
    ghee: ['clarified butter'],
    'clarified butter': ['ghee'],
  
    dal: ['lentils', 'pulses'],
    lentils: ['dal', 'pulses'],
    pulses: ['dal', 'lentils'],
  
    chana: ['chickpea'],
    chickpea: ['chana'],
  
    haldi: ['turmeric'],
    turmeric: ['haldi'],
  
    mirchi: ['chili', 'chilli'],
    chili: ['mirchi', 'chilli'],
    chilli: ['mirchi', 'chili'],
  
    jeera: ['cumin'],
    cumin: ['jeera'],
  
    dhaniya: ['coriander'],
    coriander: ['dhaniya'],
  
    chawal: ['rice'],
    rice: ['chawal'],
  
    aata: ['atta', 'flour'],
  } as const
  
  export const SUGGESTION_SEARCHABLE_ATTRIBUTES = [
    'text',
    'type',
  ] as const
  
  export const SUGGESTION_FILTERABLE_ATTRIBUTES = [
    'type',
    'source_id',
  ] as const
  
  export const SUGGESTION_SORTABLE_ATTRIBUTES = [
    'weight',
  ] as const
  
  export const SUGGESTION_RANKING_RULES = [
    'words',
    'typo',
    'proximity',
    'attribute',
    'sort',
    'exactness',
    'weight:desc',
  ] as const