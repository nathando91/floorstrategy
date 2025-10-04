interface OpenSeaAsset {
  token_id: string;
  image_url: string | null;
  image_preview_url: string | null;
  image_thumbnail_url: string | null;
  name: string | null;
  collection: {
    name: string;
    slug: string;
  };
}

interface OpenSeaCollection {
  name: string;
  slug: string;
  image_url: string | null;
  featured_image_url: string | null;
}

// OpenSea API endpoints
const OPENSEA_API_BASE = 'https://api.opensea.io';

// Contract addresses for major collections
const CONTRACT_ADDRESSES: { [key: string]: string } = {
  'pudgypenguins': '0xbd3531da5cf5857e7cfaa92426877b022e612cf8',
  'boredapeyachtclub': '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d',
  'meebits': '0x7bd29408f11d2bfc23c34f18275bbf23bb716bc7',
  'cryptodickbutts-s3': '0x42069abfe407c60cf4ae4112bedead391dba1cdb',
  'azuki': '0xed5af388653567af2f388e6224dc7c4b3241c544',
  'cryptopunks': '0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb',
  'mutant-ape-yacht-club': '0x60e4d786628fea6478f785a6d7e704777c86a7c6'
};

// Fallback images from reliable sources
const FALLBACK_IMAGES: { [key: string]: string } = {
  'pudgypenguins': 'https://i.seadn.io/gae/yNi-XdGxsgQCPpqSio4o31ygAV6wURdIdInWRcFIl46UjUQ1eV7BEndGe8L661OoG-clRi7EgInLX4LPu9Jfw4fq0bnVYHqg7RFi?auto=format&dpr=1&w=384',
  'boredapeyachtclub': 'https://i.seadn.io/gae/Ju9CkWtV-1Okvf45wo8UctR-M9He2PjILP0oOvxE89AyiPPGtrR3gysu1Zgy0hjd2xKIgjJJtWIc0ybj4Vd7wv8t3pxDGHoJBzDB?auto=format&dpr=1&w=384',
  'meebits': 'https://i.seadn.io/gae/7B0qai02OdHA8P_EOVK672qUliyjQdQDGNrACxs7WnTgZAkJa_wWURnIFKeOh5VTf8cfTqW3wQpozGedaC9mteKphEOtztls02UlHQ?auto=format&dpr=1&w=384',
  'cryptodickbutts-s3': 'https://i.seadn.io/gae/YM_mXgsSRFM8wJaqO0FNI6YOPLFHQHSlS6-ELYo1z2zAh8TQvRHIw8pWxalKTmJGFpIY5Ry8aYd_UhAPgWFX9Aw38XZUIEsJXpY?auto=format&dpr=1&w=384',
  'azuki': 'https://i.seadn.io/gae/H8jOCJuQokNqGBpkBN5wk1oZwO7LM8bNnrHCaekV2nKjnCqw6UB5oaH8XyNeBDj6bA_n1mjejzhFQUP3O1NfjFLHr3FOaeHcTOOT?auto=format&dpr=1&w=384',
  'cryptopunks': 'https://i.seadn.io/gae/BdxvLseXcfl57BiuQcQYdJ64v-aI8din7WPk0Pgo3qQFhAUH-B6i-dCqqc_mCkRIzULmwzwecnohLhrcH8A9mpWIZqA7ygc52Sr4?auto=format&dpr=1&w=384',
  'mutant-ape-yacht-club': 'https://i.seadn.io/gae/lHexKRMpw-aoSyB1WdqzLhHt1WNcVrZjBxtQIEyBDC9zjMYvJKbUNQOjTHOLJbfX9YVb7dqPlERQOqjLjGMkI5ZB5JHhNGsKcZmn?auto=format&dpr=1&w=384'
};

export async function fetchNFTImage(slug: string, tokenId: string): Promise<string> {
  const contractAddress = CONTRACT_ADDRESSES[slug];

  if (!contractAddress) {
    return FALLBACK_IMAGES[slug] || generatePlaceholderImage(slug);
  }

  try {
    // Try to fetch from OpenSea API (note: may require API key in production)
    const response = await fetch(
      `${OPENSEA_API_BASE}/api/v1/asset/${contractAddress}/${tokenId}`,
      {
        headers: {
          'Accept': 'application/json',
        }
      }
    );

    if (response.ok) {
      const asset: OpenSeaAsset = await response.json();
      return asset.image_url || asset.image_preview_url || asset.image_thumbnail_url || FALLBACK_IMAGES[slug] || generatePlaceholderImage(slug);
    }
  } catch (error) {
    console.warn(`Failed to fetch image for ${slug} #${tokenId}:`, error);
  }

  // Return fallback image
  return FALLBACK_IMAGES[slug] || generatePlaceholderImage(slug);
}

export async function fetchCollectionImage(slug: string): Promise<string> {
  try {
    // Try to fetch collection info from OpenSea API
    const response = await fetch(
      `${OPENSEA_API_BASE}/api/v1/collection/${slug}`,
      {
        headers: {
          'Accept': 'application/json',
        }
      }
    );

    if (response.ok) {
      const data = await response.json();
      const collection: OpenSeaCollection = data.collection;
      return collection.image_url || collection.featured_image_url || FALLBACK_IMAGES[slug] || generatePlaceholderImage(slug);
    }
  } catch (error) {
    console.warn(`Failed to fetch collection image for ${slug}:`, error);
  }

  // Return fallback image
  return FALLBACK_IMAGES[slug] || generatePlaceholderImage(slug);
}

function generatePlaceholderImage(slug: string): string {
  const colors = ['6366f1', 'ef4444', '10b981', 'f59e0b', '8b5cf6', 'ec4899'];
  const colorIndex = slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  const color = colors[colorIndex];

  return `https://via.placeholder.com/400x400/${color}/ffffff?text=${encodeURIComponent(slug.toUpperCase())}`;
}

// Collection metadata
export const COLLECTION_INFO: { [key: string]: { name: string; contractAddress: string } } = {
  'pudgypenguins': { name: 'Pudgy Penguins', contractAddress: CONTRACT_ADDRESSES['pudgypenguins'] },
  'boredapeyachtclub': { name: 'Bored Ape Yacht Club', contractAddress: CONTRACT_ADDRESSES['boredapeyachtclub'] },
  'meebits': { name: 'Meebits', contractAddress: CONTRACT_ADDRESSES['meebits'] },
  'cryptodickbutts-s3': { name: 'CryptoDickbutts S3', contractAddress: CONTRACT_ADDRESSES['cryptodickbutts-s3'] },
  'azuki': { name: 'Azuki', contractAddress: CONTRACT_ADDRESSES['azuki'] },
  'cryptopunks': { name: 'CryptoPunks', contractAddress: CONTRACT_ADDRESSES['cryptopunks'] },
  'mutant-ape-yacht-club': { name: 'Mutant Ape Yacht Club', contractAddress: CONTRACT_ADDRESSES['mutant-ape-yacht-club'] }
};