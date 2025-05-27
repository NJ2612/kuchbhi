const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title:{
    type:String,
    required:true
  },
  organizer:{
    type:String,
    required:true
  },
  date:{
    type:Date,
    required:true
  },
  time: {
  type: String,
  required: true
  },
  location:{
    type:String,
    required:true
  },
  link:{
    type:String,
    required:false
  },
  description:{
    type:String,
    required:true
  },
  type: {
    type: String,
    required: true
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
