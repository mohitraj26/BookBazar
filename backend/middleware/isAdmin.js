export const isAdmin = (req, res, next) => {
    console.log(req.user.role);
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ message: "Access denied. Admins only." });
    }
};