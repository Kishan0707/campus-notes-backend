export const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.headers["x-user-role"];
    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: " permissions denied" });
    }
    next();
  };
};

export const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ message: "Access denied" });
  }
  next();
};
