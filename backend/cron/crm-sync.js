const cron = require('node-cron');
const leadService = require('../services/leadService');

// Schedule the CRM sync job to run every 5 minutes
// The cron expression "*/5 * * * *" means every 5 minutes
const task = cron.schedule('*/5 * * * *', async () => {
  console.log('[CRM Sync Job] Starting CRM sync process...');
  
  try {
    // Find verified leads that haven't been synced yet
    const unsyncedLeads = await leadService.getUnsyncedVerifiedLeads();
    
    if (unsyncedLeads.length === 0) {
      console.log('[CRM Sync Job] No unsynced verified leads found.');
      return;
    }
    
    console.log(`[CRM Sync Job] Found ${unsyncedLeads.length} verified leads to sync.`);
    
    // Process each lead
    for (const lead of unsyncedLeads) {
      console.log(`[CRM Sync] Sending verified lead ${lead.name} to Sales Team...`);
      
      // In a real implementation, you would integrate with your CRM system here
      // For example, making an API call to Salesforce, HubSpot, etc.
      // await crmService.createContact(lead);
    }
    
    // Mark all processed leads as synced
    const leadIds = unsyncedLeads.map(lead => lead._id);
    await leadService.markAsSynced(leadIds);
    
    console.log(`[CRM Sync Job] Successfully synced ${unsyncedLeads.length} leads.`);
  } catch (error) {
    console.error('[CRM Sync Job] Error during sync process:', error);
  }
}, {
  scheduled: false // We'll control when to start the task
});

// Export the task so we can start it from server.js
module.exports = {
  start: () => {
    console.log('[CRM Sync Job] Starting scheduled CRM sync task...');
    task.start();
  },
  stop: () => {
    console.log('[CRM Sync Job] Stopping scheduled CRM sync task...');
    task.stop();
  }
};