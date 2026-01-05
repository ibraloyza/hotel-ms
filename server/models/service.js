import mongoose from "mongoose";


const serviceSchema =  new mongoose.Schema({
    serviceName: {type:String,required: true,unique:true},
    category: {
        type:String,required:true, 
        enum: ['Room','Hall','Office'],
        required:true
    },
    type: {
        type:String,
        required: true
    },
    price: {
        type:Number,
        required: true
    },
    isAvailable: {
        type:Boolean,
        default: true
    },
    description: {
        type:String,
        required: true
    }
},{timestamps:true})


export default mongoose.model('Service',serviceSchema);