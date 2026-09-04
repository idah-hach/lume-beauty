import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
);

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const token = authHeader.replace("Bearer ", "");

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        message: "Invalid or expired token",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);

    return res.status(500).json({
      message: "Authentication failed",
    });
  }
};

//
// ADMIN AUTHORIZATION
//

export const requireAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    if (req.user.email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({
        message: "Admin access required",
      });
    }

    next();
  } catch (error) {
    console.error("Admin authorization error:", error);

    return res.status(500).json({
      message: "Authorization failed",
    });
  }
};
