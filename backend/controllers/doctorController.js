import doctorModel from "../models/doctorModel.js";

const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;

    const docData = await doctorModel.findById(docId);
    await doctorModel.findByIdAndUpdate(docId, {
      availability: !docData.availability,
    });
    res.status(200).json({
      success: true,
      message: "Availability changed successfully",
    });
  } catch (error) {
    console.log(
      "Error while changing availability status of doctor: ",
      error.message,
    );
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password -email");

    res.status(200).json({
      success: true,
      doctors,
      message: "Successfully fetched all doctors",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Not able to fetch doctors",
    });
  }
};
export { changeAvailability, doctorList };
