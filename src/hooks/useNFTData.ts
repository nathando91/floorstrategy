import { useState, useEffect } from 'react';
import { NFT } from '../components/NFTCard';
import { fetchNFTImage, fetchCollectionImage, COLLECTION_INFO } from '../services/openSeaService';

export function useNFTData() {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch data from the API
        const response = await fetch('http://188.166.231.5:4000/api/floor/all', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!data.success || !data.data) {
          throw new Error('API returned invalid data structure');
        }

        // Process NFT data and fetch images
        const enhancedNFTs = await Promise.all(
          data.data.map(async (nft: any) => {
            const collectionInfo = COLLECTION_INFO[nft.slug];
            let imageUrl: string;

            try {
              // Try to get specific NFT image first, fallback to collection image
              imageUrl = await fetchNFTImage(nft.slug, nft.floorTokenId);

              // If NFT image fails, try collection image
              if (!imageUrl || imageUrl.includes('placeholder')) {
                imageUrl = await fetchCollectionImage(nft.slug);
              }
            } catch (imgError) {
              console.warn(`Failed to fetch image for ${nft.slug}:`, imgError);
              // Use fallback based on collection
              imageUrl = await fetchCollectionImage(nft.slug);
            }

            return {
              ...nft,
              collectionName: collectionInfo?.name || nft.strategyName || nft.slug,
              imageUrl,
              contractAddress: collectionInfo?.contractAddress || nft.strategyAddress
            } as NFT;
          })
        );

        setNfts(enhancedNFTs);
        console.log('Successfully loaded NFTs:', enhancedNFTs.length);

      } catch (err) {
        console.error('Error fetching NFT data:', err);
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);

        // Fallback to demo data with real images
        try {
          const fallbackNFTs = await Promise.all([
            {
              strategyName: "Pudgy Penguins Strategy",
              strategyAddress: "0xbd3531da5cf5857e7cfaa92426877b022e612cf8",
              slug: "pudgypenguins",
              floorPrice: 9.97,
              floorTokenId: "3325",
              hasTransactionData: true,
              listings: [{
                tokenId: "3325",
                price: 9.97,
                orderHash: "0x000",
                updatedAt: new Date().toISOString()
              }],
              collectionName: "Pudgy Penguins",
              imageUrl: await fetchCollectionImage("pudgypenguins"),
              contractAddress: "0xbd3531da5cf5857e7cfaa92426877b022e612cf8"
            },
            {
              strategyName: "Bored Ape Strategy",
              strategyAddress: "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d",
              slug: "boredapeyachtclub",
              floorPrice: 8.32,
              floorTokenId: "7112",
              hasTransactionData: true,
              listings: [{
                tokenId: "7112",
                price: 8.32,
                orderHash: "0x001",
                updatedAt: new Date().toISOString()
              }],
              collectionName: "Bored Ape Yacht Club",
              imageUrl: await fetchCollectionImage("boredapeyachtclub"),
              contractAddress: "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d"
            },
            {
              strategyName: "Meebits Strategy",
              strategyAddress: "0x7bd29408f11d2bfc23c34f18275bbf23bb716bc7",
              slug: "meebits",
              floorPrice: 0.85,
              floorTokenId: "16177",
              hasTransactionData: true,
              listings: [{
                tokenId: "16177",
                price: 0.85,
                orderHash: "0x002",
                updatedAt: new Date().toISOString()
              }],
              collectionName: "Meebits",
              imageUrl: await fetchCollectionImage("meebits"),
              contractAddress: "0x7bd29408f11d2bfc23c34f18275bbf23bb716bc7"
            }
          ]);

          setNfts(fallbackNFTs);
        } catch (fallbackError) {
          console.error('Failed to load fallback data:', fallbackError);
          setNfts([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNFTs();
  }, []);

  const refetch = () => {
    setLoading(true);
    setError(null);
    // Trigger useEffect by updating a dependency
    window.location.reload();
  };

  return { nfts, loading, error, refetch };
}