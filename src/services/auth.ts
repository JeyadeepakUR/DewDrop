import { supabase, userService } from './supabase';

interface User {
  id: string;
  email?: string;
  wallet_address?: string;
  username: string;
  created_at: string;
}

class AuthService {
  private currentUser: User | null = null;

  async getCurrentUser(): Promise<User | null> {
    try {
      // Check if Supabase is properly configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      const isConfigured = supabaseUrl && 
                          supabaseKey && 
                          supabaseUrl !== 'https://placeholder.supabase.co' && 
                          supabaseKey !== 'placeholder-key' &&
                          supabaseUrl.includes('supabase.co');

      if (!isConfigured) {
        console.log('Supabase not configured');
        return null;
      }

      // First check if we have a valid session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session?.user) {
        this.currentUser = null;
        return null;
      }

      const authUser = session.user;

      // If we have a cached user and the IDs match, return it
      if (this.currentUser && this.currentUser.id === authUser.id) {
        return this.currentUser;
      }

      // Get user profile from database
      const { data: userProfile, error } = await userService.getUserProfile(authUser.id);
      
      if (error) {
        console.error('Error getting user profile:', error);
        this.currentUser = null;
        return null;
      }

      // If no profile exists, try to create one
      if (!userProfile && authUser.email) {
        const { data: newProfile, error: createError } = await supabase
          .from('users')
          .insert({
            id: authUser.id,
            email: authUser.email,
            username: authUser.user_metadata?.username || authUser.email.split('@')[0],
            is_verified: false,
            total_earnings: 0,
            follower_count: 0,
            following_count: 0
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating user profile:', createError);
          this.currentUser = null;
          return null;
        }

        this.currentUser = newProfile;
        return newProfile;
      }

      this.currentUser = userProfile;
      return this.currentUser;
    } catch (error) {
      console.error('Error getting current user:', error);
      this.currentUser = null;
      return null;
    }
  }

  async signUp(email: string, password: string, username: string): Promise<{ data?: User; error?: any }> {
    try {
      const { data, error } = await userService.signUp(email, password, username);
      
      if (error) {
        return { error };
      }

      // Wait a moment for the trigger to create the profile
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Get the created user profile
      if (data.user) {
        const { data: userProfile, error: profileError } = await userService.getUserProfile(data.user.id);
        
        if (profileError || !userProfile) {
          // If profile doesn't exist, create it manually
          const { data: newProfile, error: createError } = await supabase
            .from('users')
            .insert({
              id: data.user.id,
              email: data.user.email,
              username: username,
              is_verified: false,
              total_earnings: 0,
              follower_count: 0,
              following_count: 0
            })
            .select()
            .single();

          if (createError) {
            return { error: createError };
          }

          this.currentUser = newProfile;
          return { data: newProfile };
        }

        this.currentUser = userProfile;
        return { data: userProfile };
      }

      return { error: 'Failed to create user profile' };
    } catch (error) {
      return { error };
    }
  }

  async signIn(email: string, password: string): Promise<{ data?: User; error?: any }> {
    try {
      const { data, error } = await userService.signIn(email, password);
      
      if (error) {
        return { error };
      }

      // Get user profile
      if (data.user) {
        const { data: userProfile, error: profileError } = await userService.getUserProfile(data.user.id);
        
        if (profileError || !userProfile) {
          // If profile doesn't exist, create it
          const { data: newProfile, error: createError } = await supabase
            .from('users')
            .insert({
              id: data.user.id,
              email: data.user.email,
              username: data.user.email?.split('@')[0] || 'user',
              is_verified: false,
              total_earnings: 0,
              follower_count: 0,
              following_count: 0
            })
            .select()
            .single();

          if (createError) {
            return { error: createError };
          }

          this.currentUser = newProfile;
          return { data: newProfile };
        }

        this.currentUser = userProfile;
        return { data: userProfile };
      }

      return { error: 'Failed to get user profile' };
    } catch (error) {
      return { error };
    }
  }

  async signInWithWallet(walletAddress: string): Promise<{ data?: User; error?: any }> {
    try {
      const { data, error } = await userService.signInWithWallet(walletAddress);
      
      if (error) {
        return { error };
      }

      // Get user profile
      if (data.user) {
        const { data: userProfile, error: profileError } = await userService.getUserProfile(data.user.id);
        
        if (profileError || !userProfile) {
          return { error: 'Failed to create wallet user profile' };
        }

        this.currentUser = userProfile;
        return { data: userProfile };
      }

      return { error: 'Failed to create wallet user profile' };
    } catch (error) {
      return { error };
    }
  }

  async signOut(): Promise<void> {
    try {
      await supabase.auth.signOut();
      this.currentUser = null;
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  async updateProfile(updates: Partial<User>): Promise<{ data?: User; error?: any }> {
    try {
      if (!this.currentUser) {
        return { error: 'No authenticated user' };
      }

      const { data, error } = await userService.updateProfile(this.currentUser.id, updates);
      
      if (error) {
        return { error };
      }

      this.currentUser = data;
      return { data };
    } catch (error) {
      return { error };
    }
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return !!session?.user;
    } catch (error) {
      console.error('Auth check failed:', error);
      return false;
    }
  }
}

export const authService = new AuthService();