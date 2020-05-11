const mongoose = require ('mongoose');
const PostSchema = new mongoose.Schema({
    Name:{
        type: String,
        required: true        
    },
    Place:{
        type: String,
        required: true        
    },
    Ip:{
        type: String,
        required: true        
    },
    Description: {
        type: String,
        required: true        
    },
    State: {
        type: Boolean,
        required: true        
    },
    Date:{
        type: Date,
        default: Date.now        
    }
});

module.exports = mongoose.model('IoTStatus', PostSchema);
// IoTStatus is the collection name of the database
//This method pluralizes the name, collection name: iotstatuses