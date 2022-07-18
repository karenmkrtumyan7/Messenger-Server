function verifyRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.role) {
      return res.sendStatus(401);
    }
    if (!allowedRoles.includes(req.role)) {
      return res.sendStatus(401);
    }
    next();
  }
}

module.exports = verifyRole;
