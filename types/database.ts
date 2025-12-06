export interface Portfolio {
  id: string
  title: string
  subtitle: string
  description: string
  thumbnail_url: string | null
  category: string
  industry: string
  year: string
  client: string
  duration: string
  challenge: string
  solution: string
  result: string
  is_featured: boolean
  created_at: string
  updated_at: string
}

export interface PortfolioMedia {
  id: string
  portfolio_id: string
  type: 'image' | 'youtube'
  url: string
  order_index: number
  created_at: string
}

export interface PortfolioStat {
  id: string
  portfolio_id: string
  icon: string
  value: string
  label: string
  order_index: number
}

export interface PortfolioTag {
  id: string
  portfolio_id: string
  name: string
}

export interface PortfolioTechnology {
  id: string
  portfolio_id: string
  name: string
}

export interface PortfolioTestimonial {
  id: string
  portfolio_id: string
  quote: string
  author: string
  role: string
}

export interface Database {
  public: {
    Tables: {
      portfolios: {
        Row: Portfolio
        Insert: Omit<Portfolio, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Portfolio, 'id' | 'created_at' | 'updated_at'>>
      }
      portfolio_media: {
        Row: PortfolioMedia
        Insert: Omit<PortfolioMedia, 'id' | 'created_at'>
        Update: Partial<Omit<PortfolioMedia, 'id' | 'created_at'>>
      }
      portfolio_stats: {
        Row: PortfolioStat
        Insert: Omit<PortfolioStat, 'id'>
        Update: Partial<Omit<PortfolioStat, 'id'>>
      }
      portfolio_tags: {
        Row: PortfolioTag
        Insert: Omit<PortfolioTag, 'id'>
        Update: Partial<Omit<PortfolioTag, 'id'>>
      }
      portfolio_technologies: {
        Row: PortfolioTechnology
        Insert: Omit<PortfolioTechnology, 'id'>
        Update: Partial<Omit<PortfolioTechnology, 'id'>>
      }
      portfolio_testimonials: {
        Row: PortfolioTestimonial
        Insert: Omit<PortfolioTestimonial, 'id'>
        Update: Partial<Omit<PortfolioTestimonial, 'id'>>
      }
    }
  }
}

// Full portfolio with all relations
export interface PortfolioWithRelations extends Portfolio {
  media: PortfolioMedia[]
  stats: PortfolioStat[]
  tags: PortfolioTag[]
  technologies: PortfolioTechnology[]
  testimonial: PortfolioTestimonial | null
}

