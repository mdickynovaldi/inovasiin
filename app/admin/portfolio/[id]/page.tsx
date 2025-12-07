"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import PortfolioForm from "@/components/admin/PortfolioForm";
import { supabase } from "@/lib/supabase";
import { PortfolioWithRelations } from "@/types/database";

export default function EditPortfolioPage() {
  const params = useParams();
  const [portfolio, setPortfolio] = useState<PortfolioWithRelations | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchPortfolio(params.id as string);
    }
  }, [params.id]);

  async function fetchPortfolio(id: string) {
    try {
      // Fetch portfolio
      const { data: portfolioData, error: portfolioError } = await supabase
        .from("portfolios")
        .select("*")
        .eq("id", id)
        .single();

      if (portfolioError) throw portfolioError;

      // Fetch related data
      const [mediaRes, statsRes, tagsRes, techRes, testimonialRes] =
        await Promise.all([
          supabase
            .from("portfolio_media")
            .select("*")
            .eq("portfolio_id", id)
            .order("order_index"),
          supabase
            .from("portfolio_stats")
            .select("*")
            .eq("portfolio_id", id)
            .order("order_index"),
          supabase.from("portfolio_tags").select("*").eq("portfolio_id", id),
          supabase
            .from("portfolio_technologies")
            .select("*")
            .eq("portfolio_id", id),
          supabase
            .from("portfolio_testimonials")
            .select("*")
            .eq("portfolio_id", id)
            .single(),
        ]);

      setPortfolio({
        ...(portfolioData as PortfolioWithRelations),
        media: mediaRes.data || [],
        stats: statsRes.data || [],
        tags: tagsRes.data || [],
        technologies: techRes.data || [],
        testimonial: testimonialRes.data || null,
      });
    } catch (err) {
      console.error("Error fetching portfolio:", err);
      setError("Portfolio tidak ditemukan");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#f97316]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-[#1e3a5f] mb-2">Error</h2>
        <p className="text-[#1e3a5f]/60">{error}</p>
      </div>
    );
  }

  return <PortfolioForm initialData={portfolio} />;
}
