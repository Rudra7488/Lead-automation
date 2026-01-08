const leadService = require('../services/leadService');

const leadController = {
  // Process a batch of names
  async processBatch(req, res) {
    try {
      const { names } = req.body;
      
      // Validate input
      if (!names || !Array.isArray(names) || names.length === 0) {
        return res.status(400).json({ 
          error: 'Names array is required and cannot be empty' 
        });
      }
      
      // Process the batch
      const results = await leadService.processBatch(names);
      
      res.status(200).json({
        success: true,
        message: `${results.length} leads processed successfully`,
        data: results
      });
    } catch (error) {
      console.error('Error processing batch:', error);
      res.status(500).json({ 
        error: 'Internal server error while processing batch' 
      });
    }
  },

  
  async getLeads(req, res) {
    try {
      const { status } = req.query;
      let filter = {};
      
      if (status) {
        if (['Verified', 'To Check'].includes(status)) {
          filter.status = status;
        } else {
          return res.status(400).json({ 
            error: 'Invalid status. Use "Verified" or "To Check"' 
          });
        }
      }
      
      const leads = await leadService.getLeads(filter);
      
      res.status(200).json({
        success: true,
        data: leads
      });
    } catch (error) {
      console.error('Error fetching leads:', error);
      res.status(500).json({ 
        error: 'Internal server error while fetching leads' 
      });
    }
  }
};

module.exports = leadController;