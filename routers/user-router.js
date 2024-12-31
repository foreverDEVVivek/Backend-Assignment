const express = require("express");
const Router = express.Router();
const userController=require('../controllers/user-controller.js');
const {validateAuthToken,validateRegister}=require('../middleware/auth-middleware.js')
const {authorizeRole}=require('../middleware/roleCheck-middleware.js');
const {isUserValid}=require('../middleware/user-middleware.js')

//Manager Router
// 1. get all tasks of your team
Router.route('/manager/:managerId/tasks')
.get(validateAuthToken,authorizeRole(["manageTeamTasks"]),isUserValid,userController.getManagerTasks);

// 2. to update and delete tasks to your team
Router.route('/manager/:managerId/tasks/:taskId')
.put(validateAuthToken,authorizeRole(["manageTeamTasks"]),isUserValid,userController.updateTasks)
.delete(validateAuthToken,authorizeRole(["manageTeamTasks"]),isUserValid,userController.deleteTasks);

// 3. to get all team profile 
Router.route('/manager/:managerId/team-members')
.get(validateAuthToken,authorizeRole(["viewTeamProfiles"]),isUserValid,userController.getAllYourTeamMembers);

// 4. to assign tasks to team members
Router.post('/manager/:managerId/tasks/assign', validateAuthToken, authorizeRole(['assignTasks']),userController.assignTask);


// Normal User Router
// 1. To get your own details e.g. profile and it can be accessed by any kind of user,admin,manager
Router.route('/:userId')
.get(validateAuthToken,isUserValid,userController.getProfileDetails)

// 2. To get your assigned Tasks
Router.route('/:userId/tasks')
.get(validateAuthToken,authorizeRole(["manageOwnTasks"]),isUserValid,userController.getUserTasks);


module.exports=Router;