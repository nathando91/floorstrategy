import { useState, useMemo } from 'react';
import { NFTCard, NFT } from './components/NFTCard';
import { NFTFilters } from './components/NFTFilters';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useNFTData } from './hooks/useNFTData';
import { Button } from './components/ui/button';
import { Alert, AlertDescription } from './components/ui/alert';
import { Skeleton } from './components/ui/skeleton';
import { RefreshCw, Database, TrendingUp, AlertCircle } from 'lucide-react';

function AppContent() {
  const { nfts, loading, error, refetch } = useNFTData();
  const [sortBy, setSortBy] = useState('price-asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCollection, setSelectedCollection] = useState('all');

  // Get unique collections for filter
  const collections = useMemo(() => {
    const uniqueCollections = Array.from(new Set(nfts.map(nft => nft.slug)));
    return uniqueCollections.sort();
  }, [nfts]);

  // Filter and sort NFTs
  const filteredAndSortedNFTs = useMemo(() => {
    let filtered = nfts.filter((nft) => {
      const matchesSearch = nft.collectionName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           nft.strategyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           nft.slug.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCollection = selectedCollection === 'all' || nft.slug === selectedCollection;
      
      return matchesSearch && matchesCollection;
    });

    // Sort the filtered results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.floorPrice - b.floorPrice;
        case 'price-desc':
          return b.floorPrice - a.floorPrice;
        case 'name-asc':
          return (a.collectionName || a.strategyName).localeCompare(b.collectionName || b.strategyName);
        case 'name-desc':
          return (b.collectionName || b.strategyName).localeCompare(a.collectionName || a.strategyName);
        case 'collection':
          return a.slug.localeCompare(b.slug);
        default:
          return 0;
      }
    });

    return filtered;
  }, [nfts, searchTerm, selectedCollection, sortBy]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalCollections = collections.length;
    const totalNFTs = nfts.length;
    const averageFloorPrice = nfts.length > 0 ? 
      nfts.reduce((sum, nft) => sum + nft.floorPrice, 0) / nfts.length : 0;
    
    return { totalCollections, totalNFTs, averageFloorPrice };
  }, [nfts, collections]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            {/* Header skeleton */}
            <div className="text-center space-y-4">
              <Skeleton className="h-12 w-64 mx-auto" />
              <Skeleton className="h-4 w-96 mx-auto" />
            </div>
            
            {/* Stats skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
            
            {/* Filters skeleton */}
            <Skeleton className="h-20 w-full" />
            
            {/* Grid skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-square w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="flex items-center justify-center gap-2">
              <Database className="w-8 h-8" />
              NFT Floor Price Dashboard
            </h1>
            <p className="text-muted-foreground">
              Theo dõi giá sàn của các collection NFT hàng đầu
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card border rounded-lg p-4 text-center">
              <div className="text-2xl font-mono">{stats.totalCollections}</div>
              <div className="text-muted-foreground text-sm">Collections</div>
            </div>
            <div className="bg-card border rounded-lg p-4 text-center">
              <div className="text-2xl font-mono">{stats.totalNFTs}</div>
              <div className="text-muted-foreground text-sm">NFTs Tracked</div>
            </div>
            <div className="bg-card border rounded-lg p-4 text-center">
              <div className="text-2xl font-mono">{stats.averageFloorPrice.toFixed(2)} ETH</div>
              <div className="text-muted-foreground text-sm">Avg Floor Price</div>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between w-full">
                <span>
                  Lỗi khi tải dữ liệu từ API: {error}
                  <br />
                  <span className="text-xs opacity-80">Đang hiển thị dữ liệu demo với hình ảnh thật từ OpenSea</span>
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={refetch}
                  className="ml-2 shrink-0"
                  disabled={loading}
                >
                  {loading ? (
                    <LoadingSpinner size="sm" className="mr-1" />
                  ) : (
                    <RefreshCw className="w-4 h-4 mr-1" />
                  )}
                  Thử lại
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Filters */}
          <NFTFilters
            sortBy={sortBy}
            onSortChange={setSortBy}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            collections={collections}
            selectedCollection={selectedCollection}
            onCollectionChange={setSelectedCollection}
          />

          {/* Results Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <p className="text-muted-foreground">
              Hiển thị {filteredAndSortedNFTs.length} NFTs
              {selectedCollection !== 'all' && ` trong collection "${selectedCollection}"`}
              {searchTerm && ` cho "${searchTerm}"`}
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span>Dữ liệu từ OpenSea & Floor API</span>
            </div>
          </div>

          {/* NFT Grid */}
          {filteredAndSortedNFTs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Không tìm thấy NFT nào phù hợp với bộ lọc.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSortedNFTs.map((nft, index) => (
                <NFTCard key={`${nft.slug}-${nft.floorTokenId}-${index}`} nft={nft} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}