import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ExternalLink, Eye } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export interface NFT {
  strategyName: string;
  strategyAddress: string;
  slug: string;
  floorPrice: number;
  floorTokenId: string;
  hasTransactionData: boolean;
  transactionData?: any;
  listings: Array<{
    tokenId: string;
    price: number;
    orderHash: string;
    updatedAt: string;
  }>;
  imageUrl?: string;
  collectionName?: string;
  contractAddress?: string;
}

interface NFTCardProps {
  nft: NFT;
}

export function NFTCard({ nft }: NFTCardProps) {
  const contractAddress = nft.contractAddress || nft.strategyAddress;
  const etherscanUrl = `https://etherscan.io/address/${contractAddress}`;
  const openseaUrl = `https://opensea.io/collection/${nft.slug}`;
  const specificNFTUrl = `https://opensea.io/assets/ethereum/${contractAddress}/${nft.floorTokenId}`;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className="aspect-square relative overflow-hidden bg-muted">
        <ImageWithFallback
          src={nft.imageUrl || `https://via.placeholder.com/400x400/6366f1/ffffff?text=${encodeURIComponent(nft.slug.toUpperCase())}`}
          alt={`${nft.collectionName || nft.strategyName} #${nft.floorTokenId}`}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
        />
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="bg-black/80 text-white backdrop-blur-sm">
            #{nft.floorTokenId}
          </Badge>
        </div>
        <div className="absolute bottom-2 left-2">
          <Badge variant="outline" className="bg-white/90 backdrop-blur-sm text-xs">
            {nft.slug}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="truncate">{nft.collectionName || nft.strategyName}</h3>
            <p className="text-muted-foreground text-sm truncate">{nft.slug}</p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Floor Price</p>
              <p className="font-mono text-lg">{nft.floorPrice.toFixed(4)} ETH</p>
              <p className="text-xs text-muted-foreground">
                ≈ ${(nft.floorPrice * 2500).toLocaleString('vi-VN')} USD
              </p>
            </div>
            <div className="text-right">
              <p className="text-muted-foreground text-sm">Listed</p>
              <p className="text-lg">{nft.listings.length}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              asChild
            >
              <a href={etherscanUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-3 h-3 mr-1" />
                Etherscan
              </a>
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              asChild
            >
              <a href={openseaUrl} target="_blank" rel="noopener noreferrer">
                <Eye className="w-3 h-3 mr-1" />
                Collection
              </a>
            </Button>
          </div>

          <Button
            className="w-full"
            asChild
          >
            <a href={specificNFTUrl} target="_blank" rel="noopener noreferrer">
              View on OpenSea
              <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}