import Appointment from "../models/appointment.model.js";

export const getStaffSchedule = async (req, res) => {
  try {
    // req.user.staffProfile is populated in login (authContoller line number 73)
    const staffId = req.user.staffProfile;

    const appointments = await Appointment.find({ staff: staffId })
      .populate("userId", "name phone")
      .populate("services.serviceId", "name duration")
      .sort({ date: 1, timeSlot: 1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
