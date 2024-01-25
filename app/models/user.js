import mongoose, {Schema} from 'mongoose'
import bcrypt from 'bcrypt-nodejs';

class UserSchema extends Schema {
  constructor() {

    const user = super({
      email: {type: String, unique: true, lowercase: true, trim: true},
      password: String,
      userType: {type: String, default: 'user'}
    });

    user.methods.generateHash = this.generateHash;
    user.methods.validPassword = this.validPassword;

    return user
  }

  generateHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)

  validPassword(password) {
    return bcrypt.compareSync(password, this.password)
  }

}

export default mongoose.model('User', new UserSchema) // eslint-disable-line
