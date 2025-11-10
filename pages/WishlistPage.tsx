import React, { useEffect, useState, useMemo } from 'react';
import { ProductGrid } from '../components/UsersTable';
import { getProducts } from '../services/dataService';
import { Product } from '../types';
import { useWishlist } from '../hooks/useRegions';
import { GoogleGenAI, Type } from "@google/genai";

interface WishlistPageProps {
  onProductSelect: (product: Product) => void;
}

const WishlistPage: React.FC<WishlistPageProps> = ({ onProductSelect }) => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { wishlist } = useWishlist();

  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const product_data = await getProducts();
        setAllProducts(product_data);
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const wishlistedProducts = useMemo(() => {
    return allProducts.filter(product => wishlist.includes(product._id));
  }, [allProducts, wishlist]);

  const handleGetRecommendations = async () => {
    if (wishlistedProducts.length === 0) return;

    setIsGenerating(true);
    setError(null);
    setRecommendations([]);

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        const wishlistedItems = wishlistedProducts.map(p => `${p.name} by ${p.brand}`).join(', ');
        const availableItems = allProducts
            .filter(p => !wishlist.includes(p._id))
            .map(p => `id: ${p._id}, name: ${p.name}, brand: ${p.brand}, description: ${p.description}`)
            .join('; ');
            
        const prompt = `You are a shoe expert stylist. Based on the items in this user's wishlist, recommend exactly 3 other shoes from the provided list of available products.
        
        The user's wishlist contains: ${wishlistedItems}.
        
        The available products to choose from are: ${availableItems}.
        
        Only recommend products that are NOT already in the user's wishlist. Your recommendations should be diverse and complement the user's existing style.
        
        Return your answer as a JSON object with a single key "recommendations" which is an array of product IDs (as strings). For example: {"recommendations": ["60d21b4667d0d8992e610c85", "60d21b4667d0d8992e610c86"]}.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        recommendations: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.STRING,
                            },
                        },
                    },
                },
            },
        });

        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);
        
        const recommendedIds: string[] = result.recommendations;
        
        const recommendedProducts = allProducts.filter(p => recommendedIds.includes(p._id));
        setRecommendations(recommendedProducts);

    } catch (e) {
        console.error("Error generating recommendations:", e);
        setError("Sorry, I couldn't generate recommendations at this time. Please try again later.");
    } finally {
        setIsGenerating(false);
    }
  };


  if (loading) {
    return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-theme-primary"></div>
        </div>
    )
  }

  return (
    <div className="bg-theme-bg-primary shadow-lg rounded-xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
            <h1 className="text-3xl font-bold text-theme-text-base">Your Wishlist</h1>
            {wishlistedProducts.length > 0 && (
                <button 
                    onClick={handleGetRecommendations}
                    disabled={isGenerating}
                    className="px-4 py-2 text-sm font-medium text-white bg-theme-primary hover:bg-theme-primary-hover rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isGenerating ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Getting Recommendations...
                        </>
                    ) : (
                       'Get AI Recommendations'
                    )}
                </button>
            )}
        </div>
        {wishlistedProducts.length === 0 ? (
            <p className="text-theme-text-muted">You haven't liked any products yet. Start exploring to find your favorites!</p>
        ) : (
            <ProductGrid products={wishlistedProducts} onProductSelect={onProductSelect} />
        )}
         { (error || recommendations.length > 0 || isGenerating) && (
            <div className="mt-12">
                <h2 className="text-2xl font-bold text-theme-text-base mb-6">You Might Also Like</h2>
                {isGenerating && (
                    <div className="flex justify-center items-center h-40">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-theme-primary"></div>
                    </div>
                )}
                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">{error}</div>}
                {recommendations.length > 0 && !isGenerating && (
                    <ProductGrid products={recommendations} onProductSelect={onProductSelect} />
                )}
            </div>
        )}
    </div>
  );
};

export default WishlistPage;
