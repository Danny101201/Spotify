import jwt from 'jsonwebtoken'
import UserToken from '../module/RefreshToken.js'

export const generateRefreshTokens = async (user)=>{
  try{

    const payload = { _id: user._id, email: user.email }
    const refreshtoken = jwt.sign(
      payload,
      process.env.REFRESH_TOKEN_PRIVATE_KEY,
      { expiresIn: '30d' }
    )

    const userToken = await UserToken.deleteMany({uid:user._id})

    await UserToken.create({ uid: user._id, refreshtoken })
    return Promise.resolve({ refreshtoken })
    }catch(err){
      return Promise.reject(err)
    }
}