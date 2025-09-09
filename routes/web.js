const express = require('express');
const route = express.Router();

const TechnologyController = require('../controller/TeachnologyController');
const PortfolioController = require('../controller/PortfolioController');
const EventController = require('../controller/EventController');
const TeamController = require('../controller/TeamController');
const ContactController = require('../controller/ContactController');
const AdminController = require('../controller/AdminController');
const checkAuth = require('../middleware/checkAuth');
const SliderController = require('../controller/SliderController');
const CourseController = require('../controller/CourseController');
const internshipController = require('../controller/InternshipController');
const learningController = require('../controller/LearningController');
const ExperienceController = require('../controller/ExperienceController');
const StudentController = require('../controller/StudentController');
const ContactCardController = require('../controller/ContactCardController');
const CourseEnquiryController = require('../controller/CourseEnquiryController');

// ================= ADMIN =================
route.post('/admin/register', AdminController.register);
route.post('/admin/login', AdminController.login);
route.put('/changePassword/:id', checkAuth, AdminController.changePassword);
route.post('/admin/logout', checkAuth, AdminController.logOut);
route.get('/dashboard', checkAuth, AdminController.dashboard);
route.get('/admin/profile', checkAuth, AdminController.profile);
route.get('/getusers', checkAuth, AdminController.getUsers);
route.put('/updateProfile/:id', checkAuth, AdminController.updateProfile);


// ================= CONTACT =================
route.post('/contactCreate', ContactController.contact);
route.get('/contactDisplay', ContactController.display);
route.get('/contactView/:id', ContactController.view);
route.delete('/deleteContact/:id', ContactController.delete);
route.put('/updateContact/:id', ContactController.update);

// ================= CONTACT CARD =================
route.post('/contactCardCreate', ContactCardController.insert);
route.get('/contactCardDisplay', ContactCardController.display);
route.get('/contactCardView/:id', ContactCardController.view);
route.delete('/deleteCardContact/:id', ContactCardController.delete);
route.put('/updateContactCard/:id', ContactCardController.update);

// ================= TECHNOLOGY =================
route.post('/createTechnology', TechnologyController.insert);
route.get('/displayTechnology', TechnologyController.display);
route.get('/viewTechnology/:id', TechnologyController.view);
route.delete('/deleteTechnology/:id', TechnologyController.delete);
route.put('/updateTechnology/:id', TechnologyController.update);

// ================= PORTFOLIO =================
route.post('/portfolioCreate', PortfolioController.insert);
route.get('/portfolioDisplay', PortfolioController.display);
route.get('/portfolioView/:id', PortfolioController.view);
route.delete('/portfolioDelete/:id', PortfolioController.delete);
route.put('/portfolioUpdate/:id', PortfolioController.update);

// ================= EVENTS =================
route.post('/eventCreate', EventController.insert);
route.get('/eventDisplay', EventController.display);
route.get('/viewEvent/:id', EventController.view); // 
route.delete('/deleteEvent/:id', EventController.delete);
route.put('/updateEvent/:id', EventController.update);

// ================= TEAM =================
route.post('/teamCreate', TeamController.insert);
route.get('/teamDisplay', TeamController.display);
route.get('/teamView/:id', TeamController.view);
route.delete('/deleteTeam/:id', TeamController.delete);
route.put('/updateTeam/:id', TeamController.update);

// ================= EXPERIENCE =================
route.post('/experienceCreate', ExperienceController.insert);
route.get('/experienceDisplay', ExperienceController.display);
route.get('/experienceView/:id', ExperienceController.view);
route.delete('/deleteExperience/:id', ExperienceController.delete);
route.put('/updateExperience/:id', ExperienceController.update);

// ================= STUDENT =================
route.post('/studentCreate', StudentController.insert);
route.get('/studentDisplay', StudentController.display);
route.get('/studentView/:id', StudentController.view);
route.delete('/deleteStudent/:id', StudentController.delete);
route.put('/updateStudent/:id', StudentController.update);

// ================= LEARNING =================
route.post('/learningCreate', learningController.insert);
route.get('/learningDisplay', learningController.display);
route.get('/learningView/:id', learningController.view);
route.delete('/deleteLearning/:id', learningController.delete);
route.put('/updateLearning/:id', learningController.update);

// ================= SLIDER =================
route.post('/createSlide', SliderController.sliderInsert);
route.get('/displaySlider', SliderController.sliderDisplay);
route.get('/viewSlider/:id', SliderController.sliderView);
route.delete('/deleteSlide/:id', SliderController.sliderDelete);
route.put('/updateSlider/:id', SliderController.sliderUpdate);

// ================= COURSES =================
route.post('/courseCreate', CourseController.courseInsert);
route.get('/courseDisplay', CourseController.courseDisplay);
route.get('/courseView/:id', CourseController.viewCourse);
route.put('/updateCourse/:id', CourseController.courseUpdate);
route.delete('/deleteCourse/:id', CourseController.courseDelete);

// ================= COURSE ENQUIRY =================
route.post('/createEnquiry', CourseEnquiryController.createEnquiry);
route.get('/displayEnquiry', CourseEnquiryController.getAllEnquiries);
route.get('/viewEnquiry/:id', CourseEnquiryController.getEnquiryById);
route.delete('/deleteEnquiry/:id', CourseEnquiryController.deleteEnquiry);
route.put('/updateEnquiry/:id', CourseEnquiryController.updateEnquiry);

// ================= INTERNSHIP =================
route.post('/internshipCreate', internshipController.internshipInsert);
route.get('/internshipDisplay', internshipController.internshipDisplay);
route.get('/internshipView/:id', internshipController.viewInternship);
route.put('/updateInternship/:id', internshipController.internshipUpdate);
route.delete('/deleteInternship/:id', internshipController.internshipDelete);
route.delete('/deleteInternships', internshipController.internshipBulkDelete);
route.get('/internshipStatus/:status', internshipController.internshipByStatus);
route.put('/updateInternshipStatus/:id', internshipController.updateStatus);

// Accept / Reject Internship
route.put('/internshipAccept/:id', internshipController.acceptInternship);
route.put('/internshipReject/:id', internshipController.rejectInternship);

module.exports = route;
