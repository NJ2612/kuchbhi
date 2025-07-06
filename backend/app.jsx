// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");
// const PDFDocument = require("pdfkit");
// const moment = require("moment");
// const path = require("path");

// const Listing = require("./models/listing.js");
// const User = require("./models/user.js");

// const app = express();
// const port = process.env.PORT || 8000;

// // Connect to MongoDB
// const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/Event";
// mongoose.connect(mongoURI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const db = mongoose.connection;
// db.on("error", (error) => console.error("MongoDB connection error:", error));
// db.once("open", () => {
//   console.log("Connected to MongoDB");

//   // Middleware
//   app.use(cors());
//   app.use(express.json());

//   // ✅ Login Route
//   app.post("/api/login", async (req, res) => {
//     const { email, password } = req.body;
//     try {
//       const user = await User.findOne({ email: email.trim() });
//       if (!user || user.password.trim() !== password.trim()) {
//         return res.status(401).json({ message: "Invalid email or password" });
//       }
//       res.json({ token: "mock-jwt-token" });
//     } catch (err) {
//       res.status(500).json({ message: "Login failed", error: err.message });
//     }
//   });

//   // ✅ Signup Route
//   app.post("/api/signup", async (req, res) => {
//     const { username, email, password } = req.body;

//     if (!username || !email || !password) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     try {
//       const existingUser = await User.findOne({ email });
//       if (existingUser) {
//         return res.status(409).json({ message: "Email already exists" });
//       }

//       const newUser = new User({ username, email, password });
//       await newUser.save();

//       res.status(201).json({ message: "Signup successful" });
//     } catch (err) {
//       console.error("Signup error:", err);
//       res.status(500).json({ message: "Server error during signup" });
//     }
//   });

//   // POST /api/events - Add new event
//   app.post("/api/events", async (req, res) => {
//     try {
//       const event = new Listing(req.body);
//       await event.save();
//       res.status(201).json({ message: "Event saved successfully" });
//     } catch (error) {
//       res.status(500).json({ message: "Failed to save event", error });
//     }
//   });

//   // GET /api/reports/download - Generate PDF or Excel report
//   app.get("/api/reports/download", async (req, res) => {
//     try {
//       const { range, format } = req.query;
//       let startDate, endDate;

//       const today = moment();
//       switch (range) {
//         case "week":
//           startDate = today.clone().startOf("week").format("YYYY-MM-DD");
//           endDate = today.clone().endOf("week").format("YYYY-MM-DD");
//           break;
//         case "month":
//           startDate = today.clone().startOf("month").format("YYYY-MM-DD");
//           endDate = today.clone().endOf("month").format("YYYY-MM-DD");
//           break;
//         case "year":
//           startDate = today.clone().startOf("year").format("YYYY-MM-DD");
//           endDate = today.clone().endOf("year").format("YYYY-MM-DD");
//           break;
//         default:
//           try {
//             const rangeObj = JSON.parse(range);
//             startDate = moment(rangeObj.start).format("YYYY-MM-DD");
//             endDate = moment(rangeObj.end).format("YYYY-MM-DD");
//           } catch {
//             startDate = today.format("YYYY-MM-DD");
//             endDate = today.format("YYYY-MM-DD");
//           }
//       }

//       const listings = await Listing.find({
//         date: { $gte: startDate, $lte: endDate },
//       });

//       if (format === "excel") {
//         // Generate Excel report
//         const XLSX = require("xlsx");
//         const data = listings.map((listing) => ({
//           Title: listing.title,
//           Organizer: listing.organizer,
//           Date: listing.date,
//           Time: listing.time,
//           Location: listing.location,
//           Description: listing.description,
//         }));

//         const worksheet = XLSX.utils.json_to_sheet(data);
//         const workbook = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(workbook, worksheet, "Events");

//         const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

//         res.setHeader("Content-Disposition", "attachment; filename=event-report.xlsx");
//         res.setHeader(
//           "Content-Type",
//           "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//         );
//         return res.send(buffer);
//       } else {
//         // Generate PDF report
//         const pdfDoc = new PDFDocument();
//         res.setHeader("Content-Disposition", `attachment; filename=event-report.pdf`);
//         res.setHeader("Content-Type", "application/pdf");

//         pdfDoc.pipe(res);
//         pdfDoc.fontSize(24).text("Event Report", 100, 80);

//         listings.forEach((listing, index) => {
//           pdfDoc.moveDown();
//           pdfDoc.fontSize(16).text(`Event #${index + 1}`);
//           pdfDoc.fontSize(12).text(`Title: ${listing.title}`);
//           pdfDoc.text(`Organizer: ${listing.organizer}`);
//           pdfDoc.text(`Date: ${listing.date}`);
//           pdfDoc.text(`Time: ${listing.time}`);
//           pdfDoc.text(`Location: ${listing.location}`);
//           pdfDoc.text(`Description: ${listing.description}`);
//         });

//         pdfDoc.end();
//       }
//     } catch (error) {
//       console.error(error);
//       res.status(500).send("Error generating report");
//     }
//   });

//   // GET /api/events - Get all events
//   app.get("/api/events", async (req, res) => {
//     try {
//       const events = await Listing.find({});
//       res.json(events);
//     } catch (error) {
//       res.status(500).json({ message: "Failed to fetch events", error });
//     }
//   });

//   // Serve frontend static files (React build)
//   app.use(express.static(path.join(__dirname, "../Frontend/segment/build")));

//   // Handle all other routes with React index.html (after API routes)
//   app.get(/^\/(?!api).*/, (req, res) => {
//     res.sendFile(path.join(__dirname, "../Frontend/segment/build/index.html"));
//   });

//   // Start server
//   app.listen(port, () => {
//     console.log(`Backend server is running on http://localhost:${port}`);
//   });
// });

//2nd Code

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const port = 8000;
const moment=require("moment");
const PDFDocument = require("pdfkit");
//models
const Listing = require("./models/listing.js");
const User = require("./models/user.js");
const permission = require("./models/permission.js");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
const MONGO_URL = "mongodb://127.0.0.1:27017/Event";
async function main() {
  await mongoose.connect(MONGO_URL);
}
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/api/events", async (req, res) => {
  try{
  const events = await Listing.find(); 
  res.json(events);
  }
  catch(error){
    console.log("error");
    res.status(500).json({ message: "Failed to fetch events", error });
  }
});

// POST to Add Event
app.post("/api/events", async(req, res) => {
  try {
    const { date, time, duration, location } = req.body;
    
    // Check for venue and time clashes
    const existingEvents = await Listing.find({ 
      location: location,
      date: date 
    });
    
    // Helper function to convert time string to minutes for comparison
    const timeToMinutes = (timeStr) => {
      if (!timeStr) return 0;
      const time = timeStr.toLowerCase();
      
      // Handle "All Day" events
      if (time.includes('all day') || time.includes('all-day')) {
        return 0; // Start of day
      }
      
      // Handle AM/PM format
      if (time.includes('am') || time.includes('pm')) {
        const match = time.match(/(\d{1,2}):?(\d{2})?\s*(am|pm)/i);
        if (match) {
          let hours = parseInt(match[1]);
          const minutes = match[2] ? parseInt(match[2]) : 0;
          const period = match[3].toLowerCase();
          
          if (period === 'pm' && hours !== 12) hours += 12;
          if (period === 'am' && hours === 12) hours = 0;
          
          return hours * 60 + minutes;
        }
      }
      
      // Handle 24-hour format (HH:MM)
      const match = time.match(/(\d{1,2}):(\d{2})/);
      if (match) {
        const hours = parseInt(match[1]);
        const minutes = parseInt(match[2]);
        return hours * 60 + minutes;
      }
      
      return 0;
    };
    
    const newEventStartMinutes = timeToMinutes(time);
    const newEventEndMinutes = newEventStartMinutes + (parseInt(duration) || 60); // Default 60 minutes if no duration
    
    for (const existingEvent of existingEvents) {
      const existingEventStartMinutes = timeToMinutes(existingEvent.time);
      const existingEventEndMinutes = existingEventStartMinutes + (existingEvent.duration || 60);
      
      // Check if time ranges overlap
      const overlap = Math.max(0, Math.min(newEventEndMinutes, existingEventEndMinutes) - Math.max(newEventStartMinutes, existingEventStartMinutes));
      
      if (overlap > 0) {
        return res.status(409).json({ 
          message: "Event clash detected! There's already an event at this venue that overlaps with your event time.",
          conflictingEvent: {
            title: existingEvent.title,
            time: existingEvent.time,
            duration: existingEvent.duration,
            location: existingEvent.location,
            date: existingEvent.date
          }
        });
      }
    }
    
    // If no clashes found, save the event
    const event = new Listing(req.body);
    await event.save();
    res.status(201).json({ message: "Event saved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to save event", error });
  }
});

// Signup POST route
app.post("/api/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if email exists in permission table
    const isPermitted = await permission.findOne({ email });
    if (!isPermitted) {
      return res.status(403).json({ message: "Permission denied" });
    }
    // Optional: check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }
    // Create and save the new user
    const newUser = new User({ username, email, password });
    await newUser.save();
    return res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Signup Error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Login POST route
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && user.password === password) {
      // Success - user is authenticated
      return res.status(200).json({ message: "Login successful", user });
    } else {
      return res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

//Download route
app.get("/api/reports/download", async (req, res) => {
  try {
    const { range, format, start, end } = req.query;
    let startDate, endDate;

    const today = moment();
    if (start && end) {
      startDate = moment(start).format("YYYY-MM-DD");
      endDate = moment(end).format("YYYY-MM-DD");
    } else {
      switch (range) {
        case "week":
          startDate = today.clone().startOf("week").format("YYYY-MM-DD");
          endDate = today.clone().endOf("week").format("YYYY-MM-DD");
          break;
        case "month":
          startDate = today.clone().startOf("month").format("YYYY-MM-DD");
          endDate = today.clone().endOf("month").format("YYYY-MM-DD");
          break;
        case "year":
          startDate = today.clone().startOf("year").format("YYYY-MM-DD");
          endDate = today.clone().endOf("year").format("YYYY-MM-DD");
          break;
        default:
          try {
            const rangeObj = JSON.parse(range);
            startDate = moment(rangeObj.start).format("YYYY-MM-DD");
            endDate = moment(rangeObj.end).format("YYYY-MM-DD");
          } catch (e) {
            startDate = today.format("YYYY-MM-DD");
            endDate = today.format("YYYY-MM-DD");
          }
      }
    }

    const listings = await Listing.find({
      date: { $gte: startDate, $lte: endDate },
    });

    if (format === "excel") {
      // Generate Excel report
      const XLSX = require("xlsx");
      const data = listings.map((listing) => ({
        Title: listing.title,
        Organizer: listing.organizer,
        Date: listing.date,
        Time: listing.time,
        Location: listing.location,
        Description: listing.description,
      }));

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Events");

      const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

      res.setHeader("Content-Disposition", "attachment; filename=event-report.xlsx");
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      return res.send(buffer);
    } else {
      // Generate PDF report
      const pdfDoc = new PDFDocument();
      res.setHeader("Content-Disposition", "attachment; filename=event-report.pdf");
      res.setHeader("Content-Type", "application/pdf");

      pdfDoc.pipe(res);
      pdfDoc.fontSize(24).text("Event Report", 100, 80);

      listings.forEach((listing, index) => {
        pdfDoc.moveDown();
        pdfDoc.fontSize(16).text(`Event #${index + 1}`);
        pdfDoc.fontSize(12).text(`Title: ${listing.title}`);
        pdfDoc.text(`Organizer: ${listing.organizer}`);
        pdfDoc.text(`Date: ${listing.date}`);
        pdfDoc.text(`Time: ${listing.time}`);
        pdfDoc.text(`Location: ${listing.location}`);
        pdfDoc.text(`Description: ${listing.description}`);
      });

      pdfDoc.end();
    }
  } catch (err) {
    console.error("Error generating report:", err);
    res.status(500).send("Error generating report");
  }
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});