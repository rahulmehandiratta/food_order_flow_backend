import mongoose, {Schema} from 'mongoose'

class customerSchema extends Schema {
  constructor() {
    const obj = super({
     
      name: String,
      mobileNo: String,
      address: String,
    
    })
    return obj
  }
}

export default mongoose.model('customer', new customerSchema)
