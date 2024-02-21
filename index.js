import express from "express";
import mongoose from "mongoose";
import User from "./schema/userSchema.js";
import multer from "multer"
import cors from "cors"; // Import cors package
const app = express();

const port = 5000;
app.use(express.json())
app.use(cors());

// Connect to MongoDB Atla
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
mongoose.connect("mongodb+srv://arjuntripathi31:arjun1234@hustlers.3k2lisf.mongodb.net/", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB Atlas:", error);
  });
 
// Define a schema for your data
const dataSchema = new mongoose.Schema({
  name: String,
  email: String,
});

// Create a model based on the schema
const Data = mongoose.model("Data", dataSchema);
const mediaSchema = new mongoose.Schema({
    filename: String,
    data: Buffer
  });
  
  // Create a model based on the schema
  const Media = mongoose.model('Media', mediaSchema);


app.get("/", (req, res) => {
  console.log(req.url);
  res.send("Hello Express js");
});

app.get("/help", (req, res) => {
  console.log(req.url);
  res.send("This is help page");
});

// Example route to save data to MongoDB
app.get("/save-data", async (req, res) => {
  try {
    const newData = new Data({
      name: "Arjun",
      email: "Arjun31@gmail.com"
    });
    await newData.save();
    res.send("Data saved to MongoDB Atlas");
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).send("Error saving data to MongoDB Atlas");
  }
});

app.post('/signup',async (req,res)=>{
    
    const {name,email,password,phoneNumber} = req.body
    try {
        const user = new User({
            name: name,
            email,
            password,
            phoneNumber
        })
        await user.save()
        res.send("Account created successfully")
    } catch (error) {
        console.log(error);
    }
})
app.post('/upload', upload.single('file'), async (req, res) => {
    console.log("abcd",req.body);
    try {
      const newMedia = new Media({
        filename: req.file.originalname,
        data: req.file.buffer
      });
      await newMedia.save();
      const mediaURL = `${req.protocol}://${req.get('host')}/media/${newMedia._id}`;
      res.send(mediaURL);
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(404).send('Error uploading file');
    }
  });
  app.get('/media/:id', async (req, res) => {
    try {
      const media = await Media.findById(req.params.id);
      if (!media) {
        return res.status(404).send('Media not found');
      }
      res.set('Content-Type', 'image/jpeg'); // Set appropriate content type
      res.send(media.data);
    } catch (error) {
      console.error('Error fetching media:', error);
      res.status(500).send('Error fetching media');
    }
  });

app.listen(port, () => {
  console.log("Server started");
});

