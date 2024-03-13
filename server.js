// const express = require("express");
// const cors = require("cors");
// const { Storage } = require("@google-cloud/storage");
// const multer = require('multer');
const { format } = require("util")
// const upload = multer({ dest: 'uploads/' });
// const { 
    
//  } = require("util");

// const app = express();
// const port = process.env.PORT || 3000;

// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cors());

// app.use(function (req, res, next) {

//     // Website you wish to allow to connect
//     res.setHeader('Access-Control-Allow-Origin', '*');

//     // Request methods you wish to allow
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

//     // Request headers you wish to allow
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

//     // Set to true if you need the website to include cookies in the requests sent
//     // to the API (e.g. in case you use sessions)
//     res.setHeader('Access-Control-Allow-Credentials', true);

//     // Pass to next layer of middleware
//     next();
// });

// const storage = new Storage({
//     keyFilename: "ferrous-plating-416607-1999004f6335.json",
//   });
//   const bucket = storage.bucket("resume-best-match-poc");
// // const multer = Multer({
// //     storage: Multer.memoryStorage(),
// //     limits: {
// //       fileSize: 25 * 1024 * 1024, // no larger than 5mb, you can change as needed.
// //     },
// //   });

//   app.post('/upload', upload.single('file'), async (req, res) => {
//     const { originalname, mimetype, size } = req.file;
//     const blob = bucket.file(originalname);
  
//     const blobStream = blob.createWriteStream({
//       resumable: false,
//       contentType: mimetype,
//     });
  
//     blobStream.on('error', (err) => {
//       console.log(err);
//       res.status(500).send('Error uploading file');
//     });
  
//     blobStream.on('finish', async () => {
//       // Set the file to be publicly readable
//       await blob.makePublic();
  
//       const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
//       res.status(200).send({ message: 'File uploaded successfully', url: publicUrl });
//     });
  
//     blobStream.end(req.file.buffer);
//   });
  
  // app.post("/upload", multer.single("file"), (req, res) => {
  //   try {
  //     if (!req.file) {
  //       return res.status(400).send({ message: "Please upload a file!" });
  //     }
  
  //     const blob = bucket.file(req.file.originalname);
  //     const blobStream = blob.createWriteStream({
  //       resumable: false,
  //     });
  
  //     blobStream.on("error", (err) => {
  //       res.status(500).send({ message: err.message });
  //     });
  
  //     blobStream.on("finish", async (data) => {
  //       // create a url to access file
  //       const publicURL = format(
  //         `https://storage.googleapis.com/${bucket.name}/${blob.name}`
  //       );
  
  //       try {
  //         await bucket.file(req.file.originalname).makePublic();
  //       } catch {
  //         return res.status(500).send({
  //           message: `Uploaded the file successfully: ${req.file.originalname}, but public access is denied!`,
  //           url: publicURL,
  //         });
  //       }
  
  //       res.status(200).send({
  //         message: "Uploaded the file successfully: " + req.file.originalname,
  //         url: publicURL,
  //       });
  //     });
  //     blobStream.end(req.file.buffer);
  //   } catch (err) {
  //     if (err.code == "LIMIT_FILE_SIZE") {
  //       return res.status(500).send({
  //         message: "File size cannot be larger than 25MB!",
  //       });
  //     }
  
  //     res.status(500).send({
  //       message: `Could not upload the file: ${req.file.originalname}. ${err}`,
  //     });
  //   }
  // });

// app.listen(port, () => {
//   console.log("server is listening on port 3000");
// });

const express = require("express");
const cors = require('cors')
const Multer = require("multer");
const app = express();
const port = 3000;
const path = require("path");
const { Storage } = require("@google-cloud/storage");
const src = path.join(__dirname, "public");
app.use(express.static(src));
app.use(cors())
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    // res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // No larger than 5mb, change as you need
  },
});

let projectId = "ferrous-plating-416607"; // Get this from Google Cloud
let keyFilename = "ferrous-plating-416607-1999004f6335.json"; // Get this from Google Cloud -> Credentials -> Service Accounts
const storage = new Storage({
  projectId,
  keyFilename,
});
const bucket = storage.bucket("resume-best-match-poc"); // Get this from Google Cloud -> Storage

// Gets all files in the defined bucket
app.get("/upload", async (req, res) => {
  try {
    const [files] = await bucket.getFiles();
    res.send([files]);
    console.log("Success");
  } catch (error) {
    res.send("Error:" + error);
  }
});
// Streams file upload to Google Storage
// app.post("/upload", multer.single("imgfile"), (req, res) => {
//   console.log("Made it /upload");
//   try {
//     if (req.file) {
//       console.log("File found, trying to upload...");
//       const blob = bucket.file(req.file.originalname);
//       const blobStream = blob.createWriteStream();

//       blobStream.on("finish", () => {
//         res.status(200).send("Success");
//         console.log("Success");
//       });
//       blobStream.end(req.file.buffer);
//     } else throw "error with img";
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });
 app.post("/upload", multer.single("file"), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).send({ message: "Please upload a file!" });
      }
  
      const blob = bucket.file(req.file.originalname);
      const blobStream = blob.createWriteStream({
        resumable: false,
      });
  
      blobStream.on("error", (err) => {
        res.status(500).send({ message: err.message });
      });
  
      blobStream.on("finish", async (data) => {
        // create a url to access file
        const publicURL = format(
          `https://storage.googleapis.com/${bucket.name}/${blob.name}`
        );
  
        try {
          await bucket.file(req.file.originalname).makePublic();
        } catch {
          return res.status(500).send({
            message: `Uploaded the file successfully: ${req.file.originalname}, but public access is denied!`,
            url: publicURL,
          });
        }
  
        res.status(200).send({
          message: "Uploaded the file successfully: " + req.file.originalname,
          url: publicURL,
        });
      });
      blobStream.end(req.file.buffer);
    } catch (err) {
      if (err.code == "LIMIT_FILE_SIZE") {
        return res.status(500).send({
          message: "File size cannot be larger than 25MB!",
        });
      }
  
      res.status(500).send({
        message: `Could not upload the file: ${req.file.originalname}. ${err}`,
      });
    }
  });
// Get the main index html file
// app.get("/", (req, res) => {
//   res.sendFile(src + "/index.html");
// });
// Start the server on port 8090 or as defined
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
