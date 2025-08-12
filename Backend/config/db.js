const mongoose=require('mongoose');
const dbConnection=async()=>{
    try {
        await mongoose.connect("mongodb://localhost:27017/task-db");
        console.log("Db connected");
    } catch (error) {
        console.log("Failed to connect to db");
    }
}

module.exports=dbConnection;
