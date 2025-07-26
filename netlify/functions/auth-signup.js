const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js');

// Configurazione Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Genera JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: 'Method not allowed' })
    };
  }

  try {
    const { email, password } = JSON.parse(event.body);

    // Validazione input
    if (!email || !password) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: "Email e password sono richiesti" })
      };
    }

    if (password.length < 6) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: "Password deve essere almeno 6 caratteri" })
      };
    }

    // Validazione email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: "Email non valida" })
      };
    }

    // Controlla se utente esiste già
    const { data: existingUser } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", email.toLowerCase())
      .single();

    if (existingUser) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: "Utente già registrato con questa email" })
      };
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crea nuovo utente
    const { data: user, error } = await supabaseAdmin
      .from("users")
      .insert([
        {
          email: email.toLowerCase(),
          password: hashedPassword,
        },
      ])
      .select("id, email, created_at")
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ message: "Errore durante la registrazione" })
      };
    }

    // Genera token
    const token = generateToken(user.id);

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({
        message: "Utente registrato con successo",
        token,
        user: {
          id: user.id,
          email: user.email,
        },
      })
    };
  } catch (error) {
    console.error("Errore signup:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: "Errore server durante registrazione" })
    };
  }
};
