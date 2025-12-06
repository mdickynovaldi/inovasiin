import { supabase } from './supabase'
import { PortfolioWithRelations } from '@/types/database'

export async function getFeaturedPortfolios(): Promise<PortfolioWithRelations[]> {
  try {
    const { data: portfolios, error } = await supabase
      .from('portfolios')
      .select('*')
      .eq('is_featured', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    if (!portfolios || portfolios.length === 0) return []

    // Fetch related data for each portfolio
    const portfoliosWithRelations = await Promise.all(
      portfolios.map(async (portfolio) => {
        const [mediaRes, statsRes, tagsRes, techRes, testimonialRes] = await Promise.all([
          supabase.from('portfolio_media').select('*').eq('portfolio_id', portfolio.id).order('order_index'),
          supabase.from('portfolio_stats').select('*').eq('portfolio_id', portfolio.id).order('order_index'),
          supabase.from('portfolio_tags').select('*').eq('portfolio_id', portfolio.id),
          supabase.from('portfolio_technologies').select('*').eq('portfolio_id', portfolio.id),
          supabase.from('portfolio_testimonials').select('*').eq('portfolio_id', portfolio.id).single(),
        ])

        return {
          ...portfolio,
          media: mediaRes.data || [],
          stats: statsRes.data || [],
          tags: tagsRes.data || [],
          technologies: techRes.data || [],
          testimonial: testimonialRes.data || null,
        }
      })
    )

    return portfoliosWithRelations
  } catch (error) {
    console.error('Error fetching featured portfolios:', error)
    return []
  }
}

export async function getAllPortfolios(): Promise<PortfolioWithRelations[]> {
  try {
    const { data: portfolios, error } = await supabase
      .from('portfolios')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    if (!portfolios || portfolios.length === 0) return []

    // Fetch related data for each portfolio
    const portfoliosWithRelations = await Promise.all(
      portfolios.map(async (portfolio) => {
        const [mediaRes, statsRes, tagsRes, techRes, testimonialRes] = await Promise.all([
          supabase.from('portfolio_media').select('*').eq('portfolio_id', portfolio.id).order('order_index'),
          supabase.from('portfolio_stats').select('*').eq('portfolio_id', portfolio.id).order('order_index'),
          supabase.from('portfolio_tags').select('*').eq('portfolio_id', portfolio.id),
          supabase.from('portfolio_technologies').select('*').eq('portfolio_id', portfolio.id),
          supabase.from('portfolio_testimonials').select('*').eq('portfolio_id', portfolio.id).single(),
        ])

        return {
          ...portfolio,
          media: mediaRes.data || [],
          stats: statsRes.data || [],
          tags: tagsRes.data || [],
          technologies: techRes.data || [],
          testimonial: testimonialRes.data || null,
        }
      })
    )

    return portfoliosWithRelations
  } catch (error) {
    console.error('Error fetching all portfolios:', error)
    return []
  }
}

export async function getPortfolioById(id: string): Promise<PortfolioWithRelations | null> {
  try {
    const { data: portfolio, error } = await supabase
      .from('portfolios')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    if (!portfolio) return null

    const [mediaRes, statsRes, tagsRes, techRes, testimonialRes] = await Promise.all([
      supabase.from('portfolio_media').select('*').eq('portfolio_id', id).order('order_index'),
      supabase.from('portfolio_stats').select('*').eq('portfolio_id', id).order('order_index'),
      supabase.from('portfolio_tags').select('*').eq('portfolio_id', id),
      supabase.from('portfolio_technologies').select('*').eq('portfolio_id', id),
      supabase.from('portfolio_testimonials').select('*').eq('portfolio_id', id).single(),
    ])

    return {
      ...portfolio,
      media: mediaRes.data || [],
      stats: statsRes.data || [],
      tags: tagsRes.data || [],
      technologies: techRes.data || [],
      testimonial: testimonialRes.data || null,
    }
  } catch (error) {
    console.error('Error fetching portfolio:', error)
    return null
  }
}

