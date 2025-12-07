import { supabase } from "./supabase";
import { PortfolioWithRelations } from "@/types/database";

export async function getFeaturedPortfolios(): Promise<
  PortfolioWithRelations[]
> {
  try {
    const { data: portfolios, error } =
      await // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (supabase.from("portfolios") as any)
        .select("*")
        .eq("is_featured", true)
        .order("created_at", { ascending: false });

    if (error) throw error;
    if (!portfolios || portfolios.length === 0) return [];

    // Fetch related data for each portfolio
    const portfoliosWithRelations = await Promise.all(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      portfolios.map(async (portfolio: any) => {
        const [mediaRes, statsRes, tagsRes, techRes, testimonialRes] =
          await Promise.all([
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (supabase.from("portfolio_media") as any)
              .select("*")
              .eq("portfolio_id", portfolio.id)
              .order("order_index"),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (supabase.from("portfolio_stats") as any)
              .select("*")
              .eq("portfolio_id", portfolio.id)
              .order("order_index"),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (supabase.from("portfolio_tags") as any)
              .select("*")
              .eq("portfolio_id", portfolio.id),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (supabase.from("portfolio_technologies") as any)
              .select("*")
              .eq("portfolio_id", portfolio.id),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (supabase.from("portfolio_testimonials") as any)
              .select("*")
              .eq("portfolio_id", portfolio.id)
              .single(),
          ]);

        return {
          ...portfolio,
          media: mediaRes.data || [],
          stats: statsRes.data || [],
          tags: tagsRes.data || [],
          technologies: techRes.data || [],
          testimonial: testimonialRes.data || null,
        };
      })
    );

    return portfoliosWithRelations;
  } catch (error) {
    console.error("Error fetching featured portfolios:", error);
    return [];
  }
}

export async function getAllPortfolios(): Promise<PortfolioWithRelations[]> {
  try {
    const { data: portfolios, error } =
      await // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (supabase.from("portfolios") as any)
        .select("*")
        .order("created_at", { ascending: false });

    if (error) throw error;
    if (!portfolios || portfolios.length === 0) return [];

    // Fetch related data for each portfolio
    const portfoliosWithRelations = await Promise.all(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      portfolios.map(async (portfolio: any) => {
        const [mediaRes, statsRes, tagsRes, techRes, testimonialRes] =
          await Promise.all([
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (supabase.from("portfolio_media") as any)
              .select("*")
              .eq("portfolio_id", portfolio.id)
              .order("order_index"),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (supabase.from("portfolio_stats") as any)
              .select("*")
              .eq("portfolio_id", portfolio.id)
              .order("order_index"),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (supabase.from("portfolio_tags") as any)
              .select("*")
              .eq("portfolio_id", portfolio.id),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (supabase.from("portfolio_technologies") as any)
              .select("*")
              .eq("portfolio_id", portfolio.id),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (supabase.from("portfolio_testimonials") as any)
              .select("*")
              .eq("portfolio_id", portfolio.id)
              .single(),
          ]);

        return {
          ...portfolio,
          media: mediaRes.data || [],
          stats: statsRes.data || [],
          tags: tagsRes.data || [],
          technologies: techRes.data || [],
          testimonial: testimonialRes.data || null,
        };
      })
    );

    return portfoliosWithRelations;
  } catch (error) {
    console.error("Error fetching all portfolios:", error);
    return [];
  }
}

export async function getPortfolioById(
  id: string
): Promise<PortfolioWithRelations | null> {
  try {
    const { data: portfolio, error } =
      await // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (supabase.from("portfolios") as any).select("*").eq("id", id).single();

    if (error) throw error;
    if (!portfolio) return null;

    const [mediaRes, statsRes, tagsRes, techRes, testimonialRes] =
      await Promise.all([
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (supabase.from("portfolio_media") as any)
          .select("*")
          .eq("portfolio_id", id)
          .order("order_index"),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (supabase.from("portfolio_stats") as any)
          .select("*")
          .eq("portfolio_id", id)
          .order("order_index"),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (supabase.from("portfolio_tags") as any)
          .select("*")
          .eq("portfolio_id", id),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (supabase.from("portfolio_technologies") as any)
          .select("*")
          .eq("portfolio_id", id),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (supabase.from("portfolio_testimonials") as any)
          .select("*")
          .eq("portfolio_id", id)
          .single(),
      ]);

    return {
      ...portfolio,
      media: mediaRes.data || [],
      stats: statsRes.data || [],
      tags: tagsRes.data || [],
      technologies: techRes.data || [],
      testimonial: testimonialRes.data || null,
    };
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    return null;
  }
}
