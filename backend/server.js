const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { Long } = require('bson');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const mongoUri = 'mongodb+srv://Mannan:626626@cluster0.ieg8t9z.mongodb.net/KPSIAJ';
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });


mongoose.connection.on('connected', () => {
  console.log('--->Connected to DB:', mongoose.connection.name);
});

const MemberSchema = new mongoose.Schema({
  JCIC: mongoose.Schema.Types.Mixed, // stored as NumberLong (int64)
  number: String,
  email: String,
  // New fields for profile
  name: String,
  "Father/Husband": String, // add this
  Surname: String,           // add this
  CNIC: String,              // add this
  FaceID: String,            // <-- add this for profile image
  BloodGroup: String,        // <-- add this for blood group
  DOB: String,               // <-- add this for date of birth
  IslamicDOB: String,        // <-- add this for Islamic date of birth
  education: [
    {
      institution: String,
      year: String,
      description: String,
    },
  ],
  business: [
    {
      name: String,
      description: String,
      services: String,
      contact: {
        phone: String,
        email: String,
      },
      address: String,
    },
  ],
});
const AppUserSchema = new mongoose.Schema({
  JCIC: String, // store as string for login compatibility
  number: String,
  email: String,
  password: String,
});
const OtpSchema = new mongoose.Schema({
  JCIC: String, // keep as string here to make it easy
  otp: String,
  createdAt: { type: Date, default: Date.now, expires: 300 },
});

const Member = mongoose.model('Member', MemberSchema, 'Members');
const AppUser = mongoose.model('AppUser', AppUserSchema, 'AppUsers');
const Otp = mongoose.model('Otp', OtpSchema);

// Email setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your.email@gmail.com',
    pass: process.env.EMAIL_PASS || 'yourpassword',
  },
});

function sendOtpEmail(email, otp) {
  return transporter.sendMail({
    from: process.env.EMAIL_USER || 'your.email@gmail.com',
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${otp}`,
  });
}


//DUMMY SMS
function sendOtpSms(number, otp) {
  //console.log(`Send OTP ${otp} to phone ${number}`);
  return Promise.resolve();
}

// ACTUAL SMS OTP ONCE TWILIO IS SETUP
/* 
const twilio = require('twilio');
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

function sendOtpSms(number, otp) {
  return twilioClient.messages.create({
    body: `Your OTP code is: ${otp}`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: number.startsWith('+') ? number : `+${number}`,
  })
  .then(message => {
    console.log(`SMS sent to ${number}, SID: ${message.sid}`);
  })
  .catch(err => {
    console.error(`Failed to send SMS to ${number}`, err.message);
  });
}
*/






// STEP 1: INITIATE SIGNUP
app.post('/signup/initiate', async (req, res) => {
  let { JCIC } = req.body;
  //console.log('JCIC entered:', JCIC);

  let parsedJCIC;
  try {
    parsedJCIC = Long.fromString(JCIC);
  } catch (e) {
    return res.status(400).json({ error: 'Invalid JCIC format' });
  }

  let member = await Member.findOne({ JCIC: parsedJCIC });
  if (!member) return res.status(404).json({ error: 'Invalid JCIC' });

  const otp = (Math.floor(100000 + Math.random() * 900000)).toString();
  await Otp.deleteMany({ JCIC: JCIC }); // use string version in OTP collection
  await Otp.create({ JCIC, otp });
  await sendOtpEmail(member.email, otp);
  await sendOtpSms(member.number, otp);
  res.json({ message: 'OTP sent', email: member.email, number: member.number });
});

// STEP 2: VERIFY OTP & CREATE ACCOUNT
app.post('/signup/verify', async (req, res) => {
  let { JCIC, password, otp } = req.body;
  //console.log('JCIC entered (verify):', JCIC);

  let parsedJCIC;
  try {
    parsedJCIC = Long.fromString(JCIC);
  } catch (e) {
    return res.status(400).json({ error: 'Invalid JCIC format' });
  }

  let member = await Member.findOne({ JCIC: parsedJCIC });
  if (!member) return res.status(404).json({ error: 'Invalid JCIC' });

  const otpDoc = await Otp.findOne({ JCIC, otp });
  if (!otpDoc) return res.status(400).json({ error: 'Invalid OTP' });

  const hash = await bcrypt.hash(password, 10);
  await AppUser.create({
    JCIC, // store as string for login compatibility
    number: member.number,
    email: member.email,
    password: hash,
  });

  await Otp.deleteMany({ JCIC });
  res.json({ message: 'Signup successful' });
});

// USER LOGIN
app.post('/login', async (req, res) => {
  const { JCIC, password } = req.body;
  const user = await AppUser.findOne({ JCIC });
  if (!user) return res.status(404).json({ error: 'User not found' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: 'Invalid password' });

  res.json({
    message: 'Login successful',
    user: {
      JCIC: user.JCIC,
      email: user.email,
      number: user.number,
    },
  });
});

// ADMIN LOGIN ENDPOINT
app.post('/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'Admin123' && password === '0000') {
    return res.json({ message: 'Admin login successful' });
  } else {
    return res.status(401).json({ error: 'Invalid admin credentials' });
  }
});

// RESET PASSWORD REQUEST (send OTP)
app.post('/reset-password/request', async (req, res) => {
  const { JCIC } = req.body;
  let parsedJCIC;
  try {
    parsedJCIC = Long.fromString(JCIC);
  } catch (e) {
    return res.status(400).json({ error: 'Invalid JCIC format' });
  }

  const member = await Member.findOne({ JCIC: parsedJCIC });
  if (!member) return res.status(404).json({ error: 'Invalid JCIC' });

  const otp = (Math.floor(100000 + Math.random() * 900000)).toString();
  await Otp.deleteMany({ JCIC }); // Remove old OTPs
  await Otp.create({ JCIC, otp });
  await sendOtpEmail(member.email, otp);
  await sendOtpSms(member.number, otp);
  res.json({ message: 'OTP sent', email: member.email, number: member.number });
});

// RESET PASSWORD VERIFY (reset password with OTP)
app.post('/reset-password/verify', async (req, res) => {
  const { JCIC, otp, password } = req.body;
  // Validate OTP
  const otpDoc = await Otp.findOne({ JCIC, otp });
  if (!otpDoc) return res.status(400).json({ error: 'Invalid or expired OTP' });

  // Find user
  let user = await AppUser.findOne({ JCIC });
  if (!user) return res.status(404).json({ error: 'User not found' });

  // Hash new password and update
  const hash = await bcrypt.hash(password, 10);
  user.password = hash;
  await user.save();

  // Remove OTP after use
  await Otp.deleteMany({ JCIC });

  res.json({ message: 'Password reset successful' });
});

// GET PROFILE DATA
app.get('/profile/:jcic', async (req, res) => {
  let { jcic } = req.params;
  let member = null;
  let tried = [];
  // Try as Long
  try {
    const parsedLong = Long.fromString(jcic);
    member = await Member.findOne({ JCIC: parsedLong });
    tried.push('Long');
  } catch (e) {}
  // Try as string
  if (!member) {
    member = await Member.findOne({ JCIC: jcic });
    tried.push('String');
  }
  // Try as number
  if (!member) {
    try {
      const asNum = parseInt(jcic);
      if (!isNaN(asNum)) {
        member = await Member.findOne({ JCIC: asNum });
        tried.push('Number');
      }
    } catch (e) {}
  }
  // Try as stringified number
  if (!member) {
    try {
      const asNumStr = String(parseInt(jcic));
      member = await Member.findOne({ JCIC: asNumStr });
      tried.push('Stringified Number');
    } catch (e) {}
  }
  // Try as stringified Long
  if (!member) {
    try {
      const asLong = Long.fromString(jcic);
      member = await Member.findOne({ JCIC: asLong.toString() });
      tried.push('Stringified Long');
    } catch (e) {}
  }
  if (!member) {
    return res.status(404).json({ error: 'User not found', jcicReceived: jcic, tried });
  }
  res.json({
    name: member.name,
    jcic: member.JCIC,
    email: member.email,
    number: member.number,
    education: member.education || [],
    business: member.business || [],
    fatherHusband: member['Father/Husband'],
    surname: member.Surname,
    cnic: member.CNIC,
    FaceID: member.FaceID, // <-- add this line to include FaceID in the response
    BloodGroup: member.BloodGroup, // <-- add this line
    DOB: member.DOB, // <-- add this line
    IslamicDOB: member.IslamicDOB, // <-- add this line
  });
});

// ADD EDUCATION
app.post('/profile/:jcic/education', async (req, res) => {
  let { jcic } = req.params;
  const { institution, year, description } = req.body;
  let parsedJCIC;
  try {
    parsedJCIC = Long.fromString(jcic);
  } catch (e) {
    parsedJCIC = null;
  }
  const member = await Member.findOne({ $or: [ { JCIC: parsedJCIC }, { JCIC: jcic } ] });
  if (!member) return res.status(404).json({ error: 'User not found' });
  member.education = member.education || [];
  member.education.push({ institution, year, description });
  await member.save();
  res.json({ message: 'Education added', education: member.education });
});

// PUT endpoint to update all education entries for a member
app.put('/profile/:jcic/education', async (req, res) => {
  let { jcic } = req.params;
  const { education } = req.body;
  let parsedJCIC;
  try {
    parsedJCIC = Long.fromString(jcic);
  } catch (e) {
    parsedJCIC = null;
  }
  const member = await Member.findOne({ $or: [ { JCIC: parsedJCIC }, { JCIC: jcic } ] });
  if (!member) return res.status(404).json({ error: 'User not found' });
  member.education = education;
  await member.save();
  res.json({ message: 'Education updated', education: member.education });
});

// ADD BUSINESS
app.post('/profile/:jcic/business', async (req, res) => {
  let { jcic } = req.params;
  const { name, description, services, contact, address } = req.body; // removed packages
  let parsedJCIC;
  try {
    parsedJCIC = Long.fromString(jcic);
  } catch (e) {
    parsedJCIC = null;
  }
  const member = await Member.findOne({ $or: [ { JCIC: parsedJCIC }, { JCIC: jcic } ] });
  if (!member) return res.status(404).json({ error: 'User not found' });
  member.business = member.business || [];
  member.business.push({ name, description, services, contact, address }); // removed packages
  await member.save();
  res.json({ message: 'Business added', business: member.business });
});

// PUT endpoint to update all business entries for a member
app.put('/profile/:jcic/business', async (req, res) => {
  let { jcic } = req.params;
  const { business } = req.body;
  let parsedJCIC;
  try {
    parsedJCIC = Long.fromString(jcic);
  } catch (e) {
    parsedJCIC = null;
  }
  const member = await Member.findOne({ $or: [ { JCIC: parsedJCIC }, { JCIC: jcic } ] });
  if (!member) return res.status(404).json({ error: 'User not found' });
  // Remove packages from each business entry before saving
  const cleanedBusiness = (business || []).map(biz => {
    const { name, description, services, contact, address } = biz;
    return { name, description, services, contact, address };
  });
  member.business = cleanedBusiness;
  await member.save();
  res.json({ message: 'Business updated', business: member.business });
});

// GET ALL BUSINESSES WITH OWNER INFO
app.get('/businesses', async (req, res) => {
  try {
    // Get all members with at least one business
    const members = await Member.find({ business: { $exists: true, $not: { $size: 0 } } });
    // Flatten businesses with owner info
    const businesses = [];
    members.forEach(member => {
      (member.business || []).forEach(biz => {
        const plainBiz = typeof biz.toObject === 'function' ? biz.toObject() : biz;
        businesses.push({
          ownerName: member.name,
          ownerJCIC: member.JCIC,
          ownerEmail: member.email,
          ownerNumber: member.number,
          ...plainBiz,
        });
      });
    });
    res.json(businesses); // <-- FIXED: send businesses array as response
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch businesses', details: err.message });
  }
});

// SEARCH BUSINESSES BY NAME, OWNER, OR WORK DESCRIPTION
app.get('/businesses/search', async (req, res) => {
  const { query, work } = req.query;
  try {
    const members = await Member.find({ business: { $exists: true, $not: { $size: 0 } } });
    let businesses = [];
    members.forEach(member => {
      (member.business || []).forEach(biz => {
        const plainBiz = typeof biz.toObject === 'function' ? biz.toObject() : biz;
        businesses.push({
          ownerName: member.name,
          ownerJCIC: member.JCIC,
          ownerEmail: member.email,
          ownerNumber: member.number,
          ...plainBiz,
        });
      });
    });
    // Filter by business/owner name
    if (query) {
      const q = query.toLowerCase();
      businesses = businesses.filter(biz =>
        (biz.name && biz.name.toLowerCase().includes(q)) ||
        (biz.ownerName && biz.ownerName.toLowerCase().includes(q))
      );
    }
    // Improved: Filter by work description (keyword match in services/description), ignoring stopwords
    if (work) {
      // List of common stopwords to ignore
      const stopwords = new Set([
        'i', 'want', 'to', 'buy', 'the', 'a', 'an', 'for', 'of', 'and', 'in', 'on', 'with', 'at', 'by', 'from', 'is', 'are', 'that', 'this', 'it', 'as', 'be', 'can', 'you', 'me', 'we', 'us', 'my', 'our', 'your', 'please', 'need', 'would', 'like', 'get', 'find', 'show', 'looking', 'search', 'order', 'some', 'any', 'all', 'do', 'does', 'have', 'has', 'had', 'was', 'were', 'will', 'shall', 'should', 'could', 'may', 'might', 'must', 'if', 'or', 'but', 'so', 'just', 'about', 'more', 'less', 'than', 'then', 'now', 'today', 'tomorrow', 'yesterday', 'also', 'too', 'very', 'much', 'many', 'few', 'lot', 'lots', 'only', 'not', 'no', 'yes', 'which', 'who', 'whom', 'whose', 'how', 'what', 'when', 'where', 'why'
      ]);
      let keywords = work.toLowerCase().split(/\s+/).filter(Boolean);
      keywords = keywords.filter(word => !stopwords.has(word));
      if (keywords.length > 0) {
        businesses = businesses.filter(biz => {
          const text = ((biz.services || '') + ' ' + (biz.description || '')).toLowerCase();
          return keywords.some(word => text.includes(word));
        });
      }
    }
    res.json(businesses);
  } catch (err) {
    res.status(500).json({ error: 'Failed to search businesses', details: err.message });
  }
});

// FAMILY MEMBER ADD: INITIATE
app.post('/family/add/initiate', async (req, res) => {
  const { userJCIC, familyJCIC } = req.body;
  // For now, always return true (in future, check relationship)
  let parsedFamilyJCIC;
  try {
    parsedFamilyJCIC = Long.isLong(familyJCIC) ? familyJCIC : Long.fromString(String(familyJCIC));
  } catch (e) {
    return res.status(400).json({ error: 'Invalid JCIC' });
  }
  const member = await Member.findOne({ JCIC: parsedFamilyJCIC });
  if (!member) return res.status(404).json({ error: 'Member not found' });
  // Always return true for now
  // Send OTP to family member's email/phone
  const otp = (Math.floor(100000 + Math.random() * 900000)).toString();
  await Otp.deleteMany({ JCIC: String(familyJCIC) });
  await Otp.create({ JCIC: String(familyJCIC), otp });
  await sendOtpEmail(member.email, otp);
  await sendOtpSms(member.number, otp);
  res.json({ success: true, email: member.email, number: member.number });
});

// FAMILY MEMBER ADD: VERIFY
app.post('/family/add/verify', async (req, res) => {
  const { familyJCIC, otp } = req.body;
  // Check OTP
  const otpDoc = await Otp.findOne({ JCIC: String(familyJCIC), otp });
  if (!otpDoc) return res.status(400).json({ error: 'Incorrect otp' });
  // Optionally, you could mark this familyJCIC as verified for the userJCIC in a new collection
  res.json({ success: true });
});

app.get('/', (req, res) => {
  res.send('Backend is up and running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
