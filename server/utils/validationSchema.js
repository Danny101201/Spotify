import Joi from "joi";
import passwordComplexity from "joi-password-complexity";


export const validateUserSignUp = (user) => {
  const schema = Joi.object({
    name: Joi.string().min(5).max(10).required(),
    email: Joi.string().email().required(),
    password: passwordComplexity().required(),
    month: Joi.string().required(),
    date: Joi.string().required(),
    year: Joi.string().required(),
    gender: Joi.string().valid("male", "female", "non-binary").required(),
  });

  return schema.validate(user)
}
export const validateUserSignIn = (user) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  return schema.validate(user)
}

export const validateSongInfo = (song) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    artist: Joi.string().required(),
    song: Joi.string().required(),
    img: Joi.string().required(),
    duration: Joi.number().required(),
  });

  return schema.validate(song)
}

export const validatePlayListInfo = (playList)=>{
  const schema = Joi.object({
    name:Joi.string().required(),
    userID:Joi.string().required(),
    desc:Joi.string().allow(""),
    songs:Joi.array().items(Joi.string()),
    img: Joi.string().allow(""),
  })
  return schema.valid(playList)
}
