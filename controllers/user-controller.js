const User = require("../models/users.js");
const Team= require('../models/teams.js');
const Task = require("../models/tasks.js")

const getUserTasks = async(req,res)=>{
  try {
    const { userId } = req.params;
    const tasks = await User.findById(userId ).populate("tasks");
    res.status(200).json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

//Get your profile information
const getProfileDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select({ password: 0 });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getManagerTasks = async (req, res) => {
  try {
    const { managerId } = req.params; 
    // Find the team(s) managed by this manager
    const teams = await Team.find({ manager: managerId }).select("_id");
    if (!teams.length) {
      return res
        .status(404)
        .json({ success: false, message: "No teams found for this manager." });
    }

    const teamIds = teams.map((team) => team._id);
    const tasks = await Task.find({ teamId: { $in: teamIds } })
      .populate("createdBy", "name email username") 
      .populate("assignedTo", "name email username") 
      .lean(); // Convert documents to plain objects for performance

    if (!tasks.length) {
      return res
        .status(404)
        .json({ success: false, message: "No tasks found for this manager's teams." });
    }

    res.status(200).json({
      success: true,
      tasks,
      count: tasks.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteTasks = async (req, res) => {
  try {
    const { managerId, taskId } = req.params;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    const team = await Team.findOne({ manager: managerId, _id: task.teamId });
    if (!team) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized to delete this task" });
    }

    // Delete the task
    const deletedTask = await Task.findByIdAndDelete(taskId);
    res.status(200).json({ success: true, message: "Task deleted successfully", task: deletedTask });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Task deletion failed", error: error.message });
  }
};

const updateTasks = async (req, res) => {
  try {
    const { taskId, managerId } = req.params;

    // Fetch the task to verify its existence
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    // Check if the task belongs to a team managed by the manager
    const team = await Team.findOne({ _id: task.teamId, manager: managerId });
    if (!team) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized to update this task" });
    }

    // Update the task with all provided fields
    const updatedTask = await Task.findByIdAndUpdate(taskId, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Enforce schema validation
    });

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Task update failed",
      error: error.message,
    });
  }
};

const getAllYourTeamMembers = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find all teams managed by the user and populate their members
    const teams = await Team.find({ manager: userId }).populate("members");

    if (!teams || teams.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No teams found for this manager" });
    }

    // Extract all unique team members across the manager's teams
    const allTeamMembers = teams.reduce((acc, team) => {
      team.members.forEach((member) => {
        if (!acc.find((m) => m._id.equals(member._id))) {
          acc.push(member);
        }
      });
      return acc;
    }, []);

    res.status(200).json({
      success: true,
      message: "Team members retrieved successfully",
      teamMembers: allTeamMembers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve team members",
      error: error.message,
    });
  }
};

const assignTask = async (req, res) => {
  try {
    const { managerId } = req.params;
    const { taskId, userId } = req.body;

    // Validate required fields
    if (!taskId || !userId) {
      return res.status(400).json({
        success: false,
        message: "Both taskId and userId are required",
      });
    }

    // Fetch the task to ensure it exists
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Fetch the team managed by the manager
    const team = await Team.findOne({ manager: managerId });
    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Manager does not manage any team",
      });
    }

    const isMember = team.members.some((memberId) => memberId.toString() === userId.toString());

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "Manager can only assign tasks to their team members",
      });
    }

    // Assign the task to the user
    task.assignedTo = userId;
    await task.save();

    res.status(200).json({
      success: true,
      message: "Task assigned successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to assign task",
      error: error.message,
    });
  }
};


module.exports = {
  getProfileDetails,
  getUserTasks,
  // manager controller exports 
  getManagerTasks,
  deleteTasks,
  updateTasks,
  getAllYourTeamMembers,
  assignTask,
};
