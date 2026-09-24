import supabase from "../config/supabase.js";

export const requireRole = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", req.user.id)
        .single();

      if (error || !data) {
        return res.status(403).json({
          success: false,
          message: "User profile not found",
        });
      }

      if (!allowedRoles.includes(data.role)) {
        return res.status(403).json({
          success: false,
          message: "You do not have permission",
        });
      }

      req.profile = data;

      next();
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Authorization failed",
      });
    }
  };
};
