const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RoomSchema = new Schema({
    guid: String,
    description : String,
    university : String,
    degree : String,
    subject : String,
    starting_time : Date,
    ending_time : Date,
    price_per_hour : Number,
    is_private : {
        type : Boolean,
        default : false
    },
    id_user : String,
    room_url : String,
    /*
    domain : String,
    options : {
        roomName : String,
        width : Number,
        height: Number,
        parentNode: String
    }
    */
});

const room = mongoose.model("rooms", RoomSchema);

const getRooms = function (db, fechaActual) {
	return new Promise((resolve, reject) => {
    
		try {
      
			const roomCollection = db.db('studybuddies').collection('rooms');
      
			const query = {}

      
			//if (fechaActual){
			//	query.fecha_fin = { $gte: fechaActual };
            //}
			const document = roomCollection.find().toArray(function (err, result) {
        
				if (err){ 
                    reject(err)
                }

        
				resolve(result);
      
			});
    
		} catch (err) {

		      reject(err);
    
		}
  
	}
)
}

module.exports = {
    room,
    getRooms
}