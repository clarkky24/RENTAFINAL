const { default: mongoose } = require('mongoose');
const Maintenance = require('../modelSchema/maintenanceRequestSchema')
const Tenant = require('../modelSchema/tenantSchema');



// get all properties
const getAllMaintenance = async (req, res) => {
    try {
        const maintenanceRequests = await Maintenance.find()
            .populate('tenant', 'name email phone property roomNumber') // Populate specific tenant fields
            .sort({ createdAt: -1 });
        
        res.status(200).json(maintenanceRequests);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// get single properties
const getMaintenanceById = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No Maintenance Request found' });
    }

    try {
        const maintenance = await Maintenance.findById(id)
            .populate('tenant', 'name email phone property roomNumber');
        
        if (!maintenance) {
            return res.status(404).json({ error: 'Maintenance request not found' });
        }

        res.status(200).json(maintenance);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// create new  properties
const createMaintenance = async (req, res) => {
    const { tenantId, description, priority } = req.body;
  
    try {
      // Find tenant by tenantId
      const tenant = await Tenant.findById(tenantId).select('roomNumber property name');
      if (!tenant) {
        return res.status(404).json({ error: 'Tenant not found' });
      }
  
      // Create maintenance request object
      const maintenanceData = {
        tenant: tenant._id,
        tenantName: tenant.name,
        roomNumber: tenant.roomNumber,
        property: tenant.property,
        description,
        priority,
        status: 'pending',
      };
  
      // Check if there's a file upload
      if (req.file) {
        maintenanceData.picture = req.file.path; // Store the file path
      }
  
      // Save the new maintenance request
      const maintenance = new Maintenance(maintenanceData);
      await maintenance.save();
  
      res.status(201).json(maintenance);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  


// update properties
const updateMaintenance = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "No Maintenance Request match" });
    }

    try {
        const maintenance = await Maintenance.findOneAndUpdate(
            { _id: id },
            { ...req.body, updatedAt: Date.now() }, // Update the maintenance request and set updatedAt
            { new: true } // Return the updated document
        );

        if (!maintenance) {
            return res.status(404).json({ error: 'Maintenance Request not found' });
        }

        res.status(200).json(maintenance); // Return the updated maintenance request
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
// delete properties
const deleteExistingMaintenance = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "No Maintenance Request match" });
    }

    try {
        const maintenance = await Maintenance.findOneAndDelete({ _id: id });

        if (!maintenance) {
            return res.status(404).json({ error: 'Maintenance Request not found' });
        }

        res.status(200).json({ message: 'Maintenance Request deleted successfully', maintenance });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports ={
    getAllMaintenance,
    getMaintenanceById,
    deleteExistingMaintenance,
    createMaintenance,
    updateMaintenance
}



