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
  duration: {
    type: Number,
    required: true,
    min: 15,
    max: 1440
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
