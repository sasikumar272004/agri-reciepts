import { createClient } from '@supabase/supabase-js';

// Use your Supabase project URL and service role key here (keep service role key secret)
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export async function createUserHandler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { email, password, full_name, role, committee_id } = req.body;

  if (!email || !password || !full_name || !role || !committee_id) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  try {
    // Create user in Supabase Auth with admin privileges
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        full_name,
        role,
        committee_id,
      },
    });

    if (authError) {
      res.status(400).json({ error: authError.message });
      return;
    }

    // Insert profile with user ID from auth creation
    const profileData = {
      id: authData.user.id,
      full_name,
      email,
      role,
      committee_id,
    };

    const { error: profileError } = await supabaseAdmin.from('profiles').insert([profileData]);

    if (profileError) {
      res.status(400).json({ error: profileError.message });
      return;
    }

    res.status(200).json({ message: 'User created successfully', user: profileData });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
