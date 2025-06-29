export interface User {
  id: string;
  wallet_address?: string;
  username: string;
  email: string;
  avatar_url?: string;
  bio?: string;
  is_verified: boolean;
  created_at: string;
  total_earnings: number;
  follower_count: number;
  following_count: number;
}

export interface Creation {
  id: string;
  title: string;
  description?: string;
  creator_id: string;
  creator: User;
  file_url: string;
  thumbnail_url?: string;
  duration: number;
  type: 'audio' | 'video' | 'mixed';
  tags: string[];
  is_nft: boolean;
  nft_contract_address?: string;
  nft_token_id?: string;
  price?: number;
  currency: 'ETH' | 'MATIC' | 'USD';
  likes_count: number;
  comments_count: number;
  shares_count: number;
  plays_count: number;
  created_at: string;
  updated_at: string;
  ai_generated_tags?: string[];
  ai_enhancement_applied: boolean;
}

export interface Comment {
  id: string;
  creation_id: string;
  user_id: string;
  user: User;
  content: string;
  created_at: string;
  likes_count: number;
}

export interface Analytics {
  total_plays: number;
  total_likes: number;
  total_earnings: number;
  top_countries: Array<{ country: string; plays: number }>;
  daily_stats: Array<{ date: string; plays: number; earnings: number }>;
  audience_demographics: {
    age_groups: Array<{ range: string; percentage: number }>;
    gender_split: Array<{ gender: string; percentage: number }>;
  };
}

export interface AIEnhancement {
  type: 'auto_tag' | 'audio_enhance' | 'thumbnail_generate' | 'description_generate';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: any;
  created_at: string;
}

export interface Collaboration {
  id: string;
  title: string;
  description: string;
  creator_id: string;
  collaborators: User[];
  status: 'open' | 'in_progress' | 'completed';
  created_at: string;
  deadline?: string;
}

export interface Web3Config {
  chainId: number;
  rpcUrl: string;
  contractAddresses: {
    nft: string;
    marketplace: string;
    royalty: string;
  };
}