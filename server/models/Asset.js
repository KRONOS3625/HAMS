const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema(
{

    assetId:{
        type:String,
        unique:true,
        required:true
    },

    assetName:{
        type:String,
        required:true
    },

    category:{
        type:String,
        required:true
    },

    brand:{
        type:String,
        required:true
    },

    purchaseDate:{
        type:Date,
        required:true
    },

    warrantyExpiry:{
        type:Date,
        required:true
    },

    assignedEmployee:{
        type:String,
        default:"Unassigned"
    }

},
{
    timestamps:true
});

module.exports = mongoose.model("Asset",assetSchema);