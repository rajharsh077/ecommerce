const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
       name:String,
       email:{
        type:String,
        unique:true
       },
       phone:{
        type:Number,
        unique:true
       },

       password:String,

       cart:[
            {
                productId:{
                    type:String,
                },
                name:String,
                quantity:{
                    type:Number,
                    default:1,
                },
                price: { type: Number, required: true },
            }
       ],


       orders:[
            {
               productId: { type: String, required: true },
               name:String,
             quantity: { type: Number, required: true },
            price: { type: Number, required: true },
            date: { type: Date, default: Date.now },
            deliveryPartner: { type: String, required: true }
            }
       ]

       

})

module.exports=mongoose.model("user",userSchema);