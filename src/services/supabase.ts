import { createClient } from '@supabase/supabase-js';
import type { User, Creation, Comment, Analytics } from '../types';

// Environment variables from .env.local
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Create Supabase client - will work even with placeholder values
export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function to check if Supabase is properly configured
const isSupabaseConfigured = () => {
  return supabaseUrl !== 'https://placeholder.supabase.co' && 
         supabaseKey !== 'placeholder-key' &&
         supabaseUrl.includes('supabase.co');
};

// User Management Service
export const userService = {
  async getCurrentUser() {
    try {
      if (!isSupabaseConfigured()) {
        return null;
      }
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    } catch (error) {
      console.error('Supabase getCurrentUser failed:', error);
      return null;
    }
  },

  async signUp(email: string, password: string, username: string) {
    try {
      if (!isSupabaseConfigured()) {
        return { 
          data: null, 
          error: { message: 'Supabase not configured. Please set up your environment variables.' } 
        };
      }

      // Validate password length
      if (password.length < 6) {
        return { 
          data: null, 
          error: { message: 'Password must be at least 6 characters long' } 
        };
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username },
          emailRedirectTo: undefined // Disable email confirmation
        }
      });

      // The trigger will automatically create the user profile
      return { data, error };
    } catch (error) {
      console.error('Supabase signUp failed:', error);
      return { data: null, error };
    }
  },

  async signIn(email: string, password: string) {
    try {
      if (!isSupabaseConfigured()) {
        return { 
          data: null, 
          error: { message: 'Supabase not configured. Please set up your environment variables.' } 
        };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      return { data, error };
    } catch (error) {
      console.error('Supabase signIn failed:', error);
      return { data: null, error };
    }
  },

  async signInWithWallet(walletAddress: string) {
    try {
      if (!isSupabaseConfigured()) {
        return { 
          data: null, 
          error: { message: 'Supabase not configured. Please set up your environment variables.' } 
        };
      }

      // Check if user with this wallet already exists
      const { data: existingUsers, error: queryError } = await supabase
        .from('users')
        .select('id')
        .eq('wallet_address', walletAddress);

      if (queryError) {
        console.error('Error checking existing wallet user:', queryError);
        return { data: null, error: queryError };
      }

      const existingUser = existingUsers && existingUsers.length > 0 ? existingUsers[0] : null;

      if (existingUser) {
        // Sign in existing user
        const { data, error } = await supabase.auth.signInAnonymously();
        if (error) return { data: null, error };

        // Update the auth user to link with existing profile
        const { error: updateError } = await supabase
          .from('users')
          .update({ id: data.user.id })
          .eq('wallet_address', walletAddress);

        if (updateError) {
          console.error('Error linking wallet user:', updateError);
        }

        return { data, error: null };
      } else {
        // Create new anonymous user
        const { data, error } = await supabase.auth.signInAnonymously();
        
        if (data.user && !error) {
          // Create user profile with wallet address
          const { error: profileError } = await supabase
            .from('users')
            .insert({
              id: data.user.id,
              wallet_address: walletAddress,
              username: `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
              is_verified: false,
              total_earnings: 0,
              follower_count: 0,
              following_count: 0
            });

          if (profileError) {
            console.error('Error creating wallet user profile:', profileError);
            return { data: null, error: profileError };
          }
        }

        return { data, error };
      }
    } catch (error) {
      console.error('Wallet sign-in error:', error);
      return { data: null, error };
    }
  },

  async updateProfile(userId: string, updates: Partial<User>) {
    try {
      if (!isSupabaseConfigured()) {
        return { 
          data: null, 
          error: { message: 'Supabase not configured' } 
        };
      }

      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select();

      if (error) {
        return { data: null, error };
      }

      if (!data || data.length === 0) {
        return { data: null, error: { message: 'User not found' } };
      }

      return { data: data[0], error: null };
    } catch (error) {
      console.error('Supabase updateProfile failed:', error);
      return { data: null, error };
    }
  },

  async getUserProfile(userId: string) {
    try {
      if (!isSupabaseConfigured()) {
        return { data: null, error: { message: 'Supabase not configured' } };
      }

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId);

      if (error) {
        return { data: null, error };
      }

      if (!data || data.length === 0) {
        return { data: null, error: null };
      }

      return { data: data[0], error: null };
    } catch (error) {
      console.error('Supabase getUserProfile failed:', error);
      return { data: null, error };
    }
  }
};

// Content Management Service
export const contentService = {
  async getCreations(limit = 20, offset = 0) {
    try {
      if (!isSupabaseConfigured()) {
        return { data: null, error: { message: 'Supabase not configured' } };
      }

      const { data, error } = await supabase
        .from('creations')
        .select(`
          *,
          creator:users(*)
        `)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
      return { data, error };
    } catch (error) {
      console.error('Supabase getCreations failed:', error);
      return { data: null, error };
    }
  },

  async getCreationById(id: string) {
    try {
      if (!isSupabaseConfigured()) {
        return { data: null, error: { message: 'Supabase not configured' } };
      }

      const { data, error } = await supabase
        .from('creations')
        .select(`
          *,
          creator:users(*)
        `)
        .eq('id', id);

      if (error) {
        return { data: null, error };
      }

      if (!data || data.length === 0) {
        return { data: null, error: { message: 'Creation not found' } };
      }

      return { data: data[0], error: null };
    } catch (error) {
      console.error('Supabase getCreationById failed:', error);
      return { data: null, error };
    }
  },

  async createContent(creation: Omit<Creation, 'id' | 'created_at' | 'updated_at'>) {
    try {
      if (!isSupabaseConfigured()) {
        return { data: null, error: { message: 'Supabase not configured' } };
      }

      const { data, error } = await supabase
        .from('creations')
        .insert({
          ...creation,
          likes_count: 0,
          comments_count: 0,
          shares_count: 0,
          plays_count: 0
        })
        .select(`
          *,
          creator:users(*)
        `);

      if (error) {
        return { data: null, error };
      }

      if (!data || data.length === 0) {
        return { data: null, error: { message: 'Failed to create content' } };
      }

      return { data: data[0], error: null };
    } catch (error) {
      console.error('Supabase createContent failed:', error);
      return { data: null, error };
    }
  },

  async updateCreation(id: string, updates: Partial<Creation>) {
    try {
      if (!isSupabaseConfigured()) {
        return { data: null, error: { message: 'Supabase not configured' } };
      }

      const { data, error } = await supabase
        .from('creations')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          creator:users(*)
        `);

      if (error) {
        return { data: null, error };
      }

      if (!data || data.length === 0) {
        return { data: null, error: { message: 'Creation not found' } };
      }

      return { data: data[0], error: null };
    } catch (error) {
      console.error('Supabase updateCreation failed:', error);
      return { data: null, error };
    }
  },

  async deleteCreation(id: string, userId: string) {
    try {
      if (!isSupabaseConfigured()) {
        return { data: null, error: { message: 'Supabase not configured' } };
      }

      const { data, error } = await supabase
        .from('creations')
        .delete()
        .eq('id', id)
        .eq('creator_id', userId);
      return { data, error };
    } catch (error) {
      console.error('Supabase deleteCreation failed:', error);
      return { data: null, error };
    }
  },

  async uploadFile(file: File, bucket: string = 'creations') {
    try {
      if (!isSupabaseConfigured()) {
        return { data: null, error: { message: 'Supabase not configured' } };
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (error) return { data: null, error };

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return { data: { path: filePath, url: publicUrl }, error: null };
    } catch (error) {
      console.error('Supabase uploadFile failed:', error);
      return { data: null, error };
    }
  },

  async incrementPlayCount(creationId: string) {
    try {
      if (!isSupabaseConfigured()) {
        return { data: null, error: { message: 'Supabase not configured' } };
      }

      // Use a simple update instead of RPC to avoid potential issues
      const { data, error } = await supabase
        .from('creations')
        .update({ 
          plays_count: supabase.sql`plays_count + 1` 
        })
        .eq('id', creationId);
      return { data, error };
    } catch (error) {
      console.error('Supabase incrementPlayCount failed:', error);
      return { data: null, error };
    }
  }
};

// Likes Service
export const likesService = {
  async likeCreation(creationId: string, userId: string) {
    try {
      if (!isSupabaseConfigured()) {
        return { data: null, error: { message: 'Supabase not configured' } };
      }

      const { data, error } = await supabase
        .from('likes')
        .insert({ creation_id: creationId, user_id: userId });
      
      if (!error) {
        // Increment likes count on creation
        await supabase
          .from('creations')
          .update({ 
            likes_count: supabase.sql`likes_count + 1` 
          })
          .eq('id', creationId);
      }
      
      return { data, error };
    } catch (error) {
      console.error('Supabase likeCreation failed:', error);
      return { data: null, error };
    }
  },

  async unlikeCreation(creationId: string, userId: string) {
    try {
      if (!isSupabaseConfigured()) {
        return { data: null, error: { message: 'Supabase not configured' } };
      }

      const { data, error } = await supabase
        .from('likes')
        .delete()
        .eq('creation_id', creationId)
        .eq('user_id', userId);
      
      if (!error) {
        // Decrement likes count on creation
        await supabase
          .from('creations')
          .update({ 
            likes_count: supabase.sql`GREATEST(likes_count - 1, 0)` 
          })
          .eq('id', creationId);
      }
      
      return { data, error };
    } catch (error) {
      console.error('Supabase unlikeCreation failed:', error);
      return { data: null, error };
    }
  },

  async getUserLikes(userId: string) {
    try {
      if (!isSupabaseConfigured()) {
        return { data: null, error: { message: 'Supabase not configured' } };
      }

      const { data, error } = await supabase
        .from('likes')
        .select(`
          *,
          creation:creations(*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      return { data, error };
    } catch (error) {
      console.error('Supabase getUserLikes failed:', error);
      return { data: null, error };
    }
  },

  async checkUserLiked(creationId: string, userId: string) {
    try {
      if (!isSupabaseConfigured()) {
        return { data: false, error: { message: 'Supabase not configured' } };
      }

      const { data, error } = await supabase
        .from('likes')
        .select('id')
        .eq('creation_id', creationId)
        .eq('user_id', userId);

      if (error) {
        return { data: false, error };
      }

      // Return true if any likes were found, false otherwise
      return { data: data && data.length > 0, error: null };
    } catch (error) {
      console.error('Supabase checkUserLiked failed:', error);
      return { data: false, error };
    }
  }
};

// Comments Service
export const commentsService = {
  async getComments(creationId: string) {
    try {
      if (!isSupabaseConfigured()) {
        return { data: null, error: { message: 'Supabase not configured' } };
      }

      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          user:users(*)
        `)
        .eq('creation_id', creationId)
        .order('created_at', { ascending: true });
      return { data, error };
    } catch (error) {
      console.error('Supabase getComments failed:', error);
      return { data: null, error };
    }
  },

  async addComment(creationId: string, userId: string, content: string) {
    try {
      if (!isSupabaseConfigured()) {
        return { data: null, error: { message: 'Supabase not configured' } };
      }

      const { data, error } = await supabase
        .from('comments')
        .insert({
          creation_id: creationId,
          user_id: userId,
          content: content
        })
        .select(`
          *,
          user:users(*)
        `);
      
      if (!error && data && data.length > 0) {
        // Increment comments count on creation
        await supabase
          .from('creations')
          .update({ 
            comments_count: supabase.sql`comments_count + 1` 
          })
          .eq('id', creationId);
        
        return { data: data[0], error: null };
      }
      
      return { data: null, error };
    } catch (error) {
      console.error('Supabase addComment failed:', error);
      return { data: null, error };
    }
  },

  async deleteComment(commentId: string, userId: string) {
    try {
      if (!isSupabaseConfigured()) {
        return { data: null, error: { message: 'Supabase not configured' } };
      }

      const { data, error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', userId);
      return { data, error };
    } catch (error) {
      console.error('Supabase deleteComment failed:', error);
      return { data: null, error };
    }
  }
};

// Notifications Service
export const notificationsService = {
  async getUserNotifications(userId: string) {
    try {
      if (!isSupabaseConfigured()) {
        return { data: null, error: { message: 'Supabase not configured' } };
      }

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      return { data, error };
    } catch (error) {
      console.error('Supabase getUserNotifications failed:', error);
      return { data: null, error };
    }
  },

  async createNotification(notification: {
    user_id: string;
    type: string;
    title: string;
    message: string;
    data?: any;
  }) {
    try {
      if (!isSupabaseConfigured()) {
        return { data: null, error: { message: 'Supabase not configured' } };
      }

      const { data, error } = await supabase
        .from('notifications')
        .insert(notification)
        .select();

      if (error) {
        return { data: null, error };
      }

      if (!data || data.length === 0) {
        return { data: null, error: { message: 'Failed to create notification' } };
      }

      return { data: data[0], error: null };
    } catch (error) {
      console.error('Supabase createNotification failed:', error);
      return { data: null, error };
    }
  },

  async markAsRead(notificationId: string) {
    try {
      if (!isSupabaseConfigured()) {
        return { data: null, error: { message: 'Supabase not configured' } };
      }

      const { data, error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);
      return { data, error };
    } catch (error) {
      console.error('Supabase markAsRead failed:', error);
      return { data: null, error };
    }
  },

  async markAllAsRead(userId: string) {
    try {
      if (!isSupabaseConfigured()) {
        return { data: null, error: { message: 'Supabase not configured' } };
      }

      const { data, error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false);
      return { data, error };
    } catch (error) {
      console.error('Supabase markAllAsRead failed:', error);
      return { data: null, error };
    }
  }
};

// Transcripts Service
export const transcriptsService = {
  async saveTranscript(data: {
    creation_id?: string;
    meeting_id?: string;
    content: string;
    participants?: string[];
    creativity_scores?: any;
    insights?: any;
  }) {
    try {
      if (!isSupabaseConfigured()) {
        return { data: null, error: { message: 'Supabase not configured' } };
      }

      const { data: transcript, error } = await supabase
        .from('transcripts')
        .insert(data)
        .select();

      if (error) {
        return { data: null, error };
      }

      if (!transcript || transcript.length === 0) {
        return { data: null, error: { message: 'Failed to save transcript' } };
      }

      return { data: transcript[0], error: null };
    } catch (error) {
      console.error('Supabase saveTranscript failed:', error);
      return { data: null, error };
    }
  },

  async getTranscript(id: string) {
    try {
      if (!isSupabaseConfigured()) {
        return { data: null, error: { message: 'Supabase not configured' } };
      }

      const { data, error } = await supabase
        .from('transcripts')
        .select('*')
        .eq('id', id);

      if (error) {
        return { data: null, error };
      }

      if (!data || data.length === 0) {
        return { data: null, error: { message: 'Transcript not found' } };
      }

      return { data: data[0], error: null };
    } catch (error) {
      console.error('Supabase getTranscript failed:', error);
      return { data: null, error };
    }
  },

  async getCreationTranscripts(creationId: string) {
    try {
      if (!isSupabaseConfigured()) {
        return { data: null, error: { message: 'Supabase not configured' } };
      }

      const { data, error } = await supabase
        .from('transcripts')
        .select('*')
        .eq('creation_id', creationId)
        .order('created_at', { ascending: false });
      return { data, error };
    } catch (error) {
      console.error('Supabase getCreationTranscripts failed:', error);
      return { data: null, error };
    }
  }
};

// Ownership Tokens Service (NFT)
export const ownershipService = {
  async createOwnershipToken(data: {
    creation_id: string;
    owner_id: string;
    token_id: string;
    contract_address: string;
    blockchain: string;
    transaction_hash: string;
    metadata?: any;
  }) {
    try {
      if (!isSupabaseConfigured()) {
        return { data: null, error: { message: 'Supabase not configured' } };
      }

      const { data: token, error } = await supabase
        .from('ownership_tokens')
        .insert(data)
        .select();

      if (error) {
        return { data: null, error };
      }

      if (!token || token.length === 0) {
        return { data: null, error: { message: 'Failed to create ownership token' } };
      }

      return { data: token[0], error: null };
    } catch (error) {
      console.error('Supabase createOwnershipToken failed:', error);
      return { data: null, error };
    }
  },

  async getOwnershipToken(creationId: string) {
    try {
      if (!isSupabaseConfigured()) {
        return { data: null, error: { message: 'Supabase not configured' } };
      }

      const { data, error } = await supabase
        .from('ownership_tokens')
        .select(`
          *,
          owner:users(*),
          creation:creations(*)
        `)
        .eq('creation_id', creationId);

      if (error) {
        return { data: null, error };
      }

      if (!data || data.length === 0) {
        return { data: null, error: null };
      }

      return { data: data[0], error: null };
    } catch (error) {
      console.error('Supabase getOwnershipToken failed:', error);
      return { data: null, error };
    }
  },

  async getUserTokens(userId: string) {
    try {
      if (!isSupabaseConfigured()) {
        return { data: null, error: { message: 'Supabase not configured' } };
      }

      const { data, error } = await supabase
        .from('ownership_tokens')
        .select(`
          *,
          creation:creations(*)
        `)
        .eq('owner_id', userId)
        .order('created_at', { ascending: false });
      return { data, error };
    } catch (error) {
      console.error('Supabase getUserTokens failed:', error);
      return { data: null, error };
    }
  },

  async transferOwnership(tokenId: string, newOwnerId: string, transactionHash: string) {
    try {
      if (!isSupabaseConfigured()) {
        return { data: null, error: { message: 'Supabase not configured' } };
      }

      const { data, error } = await supabase
        .from('ownership_tokens')
        .update({
          owner_id: newOwnerId,
          transaction_hash: transactionHash,
          updated_at: new Date().toISOString()
        })
        .eq('id', tokenId)
        .select();

      if (error) {
        return { data: null, error };
      }

      if (!data || data.length === 0) {
        return { data: null, error: { message: 'Token not found' } };
      }

      return { data: data[0], error: null };
    } catch (error) {
      console.error('Supabase transferOwnership failed:', error);
      return { data: null, error };
    }
  }
};

// Analytics Service
export const analyticsService = {
  async getCreatorAnalytics(userId: string): Promise<{ data: Analytics | null, error: any }> {
    try {
      if (!isSupabaseConfigured()) {
        // Return mock data when Supabase is not configured
        const mockData: Analytics = {
          total_plays: 15420,
          total_likes: 3240,
          total_earnings: 1250.50,
          top_countries: [
            { country: 'United States', plays: 5420 },
            { country: 'United Kingdom', plays: 3210 },
            { country: 'Canada', plays: 2890 }
          ],
          daily_stats: Array.from({ length: 30 }, (_, i) => ({
            date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            plays: Math.floor(Math.random() * 500) + 100,
            earnings: Math.floor(Math.random() * 50) + 10
          })),
          audience_demographics: {
            age_groups: [
              { range: '18-24', percentage: 35 },
              { range: '25-34', percentage: 40 },
              { range: '35-44', percentage: 20 },
              { range: '45+', percentage: 5 }
            ],
            gender_split: [
              { gender: 'Male', percentage: 55 },
              { gender: 'Female', percentage: 42 },
              { gender: 'Other', percentage: 3 }
            ]
          }
        };
        return { data: mockData, error: null };
      }

      // Get total stats - use array-based approach
      const { data: creations, error: creationsError } = await supabase
        .from('creations')
        .select('plays_count, likes_count')
        .eq('creator_id', userId);

      if (creationsError) {
        console.error('Error fetching creations:', creationsError);
        return { data: null, error: creationsError };
      }

      const totalPlays = creations?.reduce((sum, c) => sum + (c.plays_count || 0), 0) || 0;
      const totalLikes = creations?.reduce((sum, c) => sum + (c.likes_count || 0), 0) || 0;

      // Get user earnings - use array-based approach
      const { data: userProfiles, error: userError } = await supabase
        .from('users')
        .select('total_earnings')
        .eq('id', userId);

      if (userError) {
        console.error('Error fetching user profile:', userError);
        return { data: null, error: userError };
      }

      const userProfile = userProfiles && userProfiles.length > 0 ? userProfiles[0] : null;

      // Mock daily stats - would be replaced with actual analytics data
      const dailyStats = Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        plays: Math.floor(Math.random() * 500) + 100,
        earnings: Math.floor(Math.random() * 50) + 10
      }));

      const analytics: Analytics = {
        total_plays: totalPlays,
        total_likes: totalLikes,
        total_earnings: userProfile?.total_earnings || 0,
        top_countries: [
          { country: 'United States', plays: Math.floor(totalPlays * 0.35) },
          { country: 'United Kingdom', plays: Math.floor(totalPlays * 0.20) },
          { country: 'Canada', plays: Math.floor(totalPlays * 0.15) }
        ],
        daily_stats: dailyStats,
        audience_demographics: {
          age_groups: [
            { range: '18-24', percentage: 35 },
            { range: '25-34', percentage: 40 },
            { range: '35-44', percentage: 20 },
            { range: '45+', percentage: 5 }
          ],
          gender_split: [
            { gender: 'Male', percentage: 55 },
            { gender: 'Female', percentage: 42 },
            { gender: 'Other', percentage: 3 }
          ]
        }
      };

      return { data: analytics, error: null };
    } catch (error) {
      console.error('Analytics error:', error);
      return { data: null, error };
    }
  },

  async trackEvent(eventType: string, data: any) {
    try {
      if (!isSupabaseConfigured()) {
        return { data: null, error: { message: 'Supabase not configured' } };
      }

      const { data: event, error } = await supabase
        .from('analytics_events')
        .insert({
          event_type: eventType,
          data: data,
          timestamp: new Date().toISOString()
        });
      return { data: event, error };
    } catch (error) {
      console.error('Supabase trackEvent failed:', error);
      return { data: null, error };
    }
  }
};

// AI Enhancement Service
export const aiService = {
  async enhanceAudio(audioUrl: string) {
    // This would integrate with your AI service
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          enhanced_url: audioUrl,
          improvements: ['noise_reduction', 'volume_normalization', 'eq_optimization']
        });
      }, 3000);
    });
  },

  async generateTags(content: string, audioUrl?: string) {
    // This would integrate with your LLM service
    const mockTags = ['electronic', 'ambient', 'experimental', 'synthesizer', 'atmospheric'];
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockTags.slice(0, Math.floor(Math.random() * 3) + 2));
      }, 1500);
    });
  },

  async generateDescription(title: string, tags: string[]) {
    // This would integrate with your LLM service
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`An innovative ${tags.join(' and ')} composition that showcases creative artistry and technical excellence.`);
      }, 2000);
    });
  },

  async analyzeCreativity(content: string, type: 'text' | 'audio' | 'video' = 'text') {
    // This would integrate with your LLM service for creativity analysis
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          score: Math.random() * 10,
          novelty_score: Math.random() * 10,
          insights: ['Shows innovative thinking', 'Demonstrates originality'],
          suggestions: ['Consider exploring deeper themes', 'Try different approaches'],
          category: type === 'text' ? 'literary' : type === 'audio' ? 'musical' : 'visual'
        });
      }, 2000);
    });
  }
};

// Real-time subscriptions
export const subscriptions = {
  subscribeToCreations(callback: (payload: any) => void) {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, skipping subscription');
      return { unsubscribe: () => {} };
    }

    return supabase
      .channel('creations')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'creations' }, 
        callback
      )
      .subscribe();
  },

  subscribeToComments(creationId: string, callback: (payload: any) => void) {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, skipping subscription');
      return { unsubscribe: () => {} };
    }

    return supabase
      .channel(`comments:${creationId}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'comments',
          filter: `creation_id=eq.${creationId}`
        }, 
        callback
      )
      .subscribe();
  },

  subscribeToNotifications(userId: string, callback: (payload: any) => void) {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, skipping subscription');
      return { unsubscribe: () => {} };
    }

    return supabase
      .channel(`notifications:${userId}`)
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        }, 
        callback
      )
      .subscribe();
  }
};