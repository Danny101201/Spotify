
import jwt from 'jsonwebtoken'

export default (req, res, next) => {
  const token = req.headers['x-auth-token'];
  if (!token) return res.status('400').json({ message: 'unAuthorization ' })
  jwt.verify(token, process.env.REFRESH_TOKEN_PRIVATE_KEY, (error, validToken) => {
    if (error) {
      return res.status(400).send({ message: "Invalid token" })
    } else {
      req.user = validToken
      next();
    }
  })
}