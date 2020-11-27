const roomModel = require("../models/userModel");

class RomeService {
    
    /**
     * get all rooms in db
     */
    getRooms() {
        
    }
    
    updateRoom(room) {
        roomModel.update()
    }
    
    deleteRoom(id) {
        roomModel.dete()
    }
    
    getRoom(id) {
        roomModel.findOne(id)
    }
    
}