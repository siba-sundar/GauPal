const admin = require('firebase-admin');
const db = admin.firestore();

// Controller for Farmer Dashboard
const farmerDashboardController = {
  // Get farmer dashboard metrics
  getDashboardMetrics: async (req, res) => {
    try {
      const { farmerId } = req.params;

      if (!farmerId) {
        return res.status(400).json({ success: false, message: 'Farmer ID is required' });
      }

      // Metrics to collect
      const metrics = {
        totalCattle: 0,
        activeOrders: 0,
        totalRevenue: 0,
        mostSoldProduct: null,
        recentOrders: [],
        cattleHealthSummary: {
          healthy: 0,
          sick: 0,
          needsCheckup: 0
        },
        upcomingVaccinations: []
      };

      // Get total cattle count
      const cattleSnapshot = await db.collection('cattle')
        .where('farmerId', '==', farmerId)
        .get();

      metrics.totalCattle = cattleSnapshot.size;

      // Process cattle health data
      const currentDate = new Date();
      const checkupDueDate = new Date();
      checkupDueDate.setMonth(currentDate.getMonth() - 3); // Checkup due if last checkup > 3 months ago

      cattleSnapshot.forEach(doc => {
        const cattle = doc.data();

        // Analyze health status
        if (cattle.healthStatus === 'healthy') {
          metrics.cattleHealthSummary.healthy++;
        } else if (cattle.healthStatus === 'sick') {
          metrics.cattleHealthSummary.sick++;
        }

        // Check if checkup is needed
        const lastCheckup = cattle.lastCheckupDate?.toDate() || new Date(0);
        if (lastCheckup < checkupDueDate) {
          metrics.cattleHealthSummary.needsCheckup++;
        }

        // Check for upcoming vaccinations
        const nextMonth = new Date();
        nextMonth.setMonth(currentDate.getMonth() + 1);

        cattle.vaccinations?.forEach(vaccination => {
          const nextDueDate = vaccination.nextDueDate?.toDate();
          if (nextDueDate && nextDueDate <= nextMonth && nextDueDate >= currentDate) {
            metrics.upcomingVaccinations.push({
              cattleId: cattle.cattleId,
              cattleName: cattle.name,
              vaccineName: vaccination.name,
              dueDate: nextDueDate
            });
          }
        });
      });

      // Get active orders
      const ordersSnapshot = await db.collection('orders')
        .where('sellerId', '==', farmerId)
        .where('status', 'in', ['pending', 'processing', 'shipped'])
        .get();

      metrics.activeOrders = ordersSnapshot.size;

      // Get recent orders for the dashboard
      const recentOrdersSnapshot = await db.collection('orders')
        .where('sellerId', '==', farmerId)
        .orderBy('createdAt', 'desc')
        .limit(5)
        .get();

      recentOrdersSnapshot.forEach(doc => {
        const order = doc.data();
        metrics.recentOrders.push({
          orderId: order.orderId,
          buyerId: order.buyerId,
          totalAmount: order.totalAmount,
          status: order.status,
          createdAt: order.createdAt,
          items: order.items
        });
      });

      // Calculate total revenue from all completed orders
      const revenueSnapshot = await db.collection('orders')
        .where('sellerId', '==', farmerId)
        .where('status', '==', 'delivered')
        .get();

      revenueSnapshot.forEach(doc => {
        const order = doc.data();
        metrics.totalRevenue += order.totalAmount;
      });

      // Find most sold product
      const productSales = {};
      const allOrdersSnapshot = await db.collection('orders')
        .where('sellerId', '==', farmerId)
        .get();

      allOrdersSnapshot.forEach(doc => {
        const order = doc.data();
        order.items.forEach(item => {
          if (!productSales[item.productId]) {
            productSales[item.productId] = {
              productId: item.productId,
              name: item.name,
              totalQuantity: 0,
              totalRevenue: 0
            };
          }
          productSales[item.productId].totalQuantity += item.quantity;
          productSales[item.productId].totalRevenue += item.subtotal;
        });
      });

      // Convert to array and find most sold product
      const productSalesArray = Object.values(productSales);
      if (productSalesArray.length > 0) {
        metrics.mostSoldProduct = productSalesArray.reduce((max, product) =>
          max.totalQuantity > product.totalQuantity ? max : product
        );
      }

      res.status(200).json({
        success: true,
        data: metrics
      });
    } catch (error) {
      console.error('Error getting farmer dashboard metrics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get dashboard metrics',
        error: error.message
      });
    }
  },

  // Get all cattle for a farmer
  getAllCattle: async (req, res) => {
    try {
      const { farmerId } = req.params;

      if (!farmerId) {
        return res.status(400).json({ success: false, message: 'Farmer ID is required' });
      }

      const cattleSnapshot = await db.collection('cattle')
        .where('farmerId', '==', farmerId)
        .get();

      const cattle = [];
      cattleSnapshot.forEach(doc => {
        cattle.push({
          id: doc.id,
          ...doc.data()
        });
      });

      res.status(200).json({
        success: true,
        count: cattle.length,
        data: cattle
      });
    } catch (error) {
      console.error('Error getting cattle:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get cattle',
        error: error.message
      });
    }
  },

  // Get single cattle details
  getCattleDetails: async (req, res) => {
    try {
      const { cattleId } = req.params;

      if (!cattleId) {
        return res.status(400).json({ success: false, message: 'Cattle ID is required' });
      }

      const cattleDoc = await db.collection('cattle').doc(cattleId).get();

      if (!cattleDoc.exists) {
        return res.status(404).json({ success: false, message: 'Cattle not found' });
      }

      res.status(200).json({
        success: true,
        data: {
          id: cattleDoc.id,
          ...cattleDoc.data()
        }
      });
    } catch (error) {
      console.error('Error getting cattle details:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get cattle details',
        error: error.message
      });
    }
  },

  // Add new cattle
  addCattle: async (req, res) => {
    try {
      const cattleData = req.body;
      const { farmerId } = req.params;
  
      if (!farmerId) {
        return res.status(400).json({ success: false, message: 'Farmer ID is required' });
      }
  
      // Validate required fields
      if (!cattleData.name || !cattleData.breed) {
        return res.status(400).json({
          success: false,
          message: 'Name and breed are required fields'
        });
      }
  
      // Generate a unique ID for the cattle
      const cattleId = db.collection('cattle').doc().id;
  
      // Prepare cattle data with comprehensive details and timestamps
      const newCattle = {
        // Basic information
        name: cattleData.name,
        breed: cattleData.breed,
        age: cattleData.age || null,
        gender: cattleData.gender || null,
        dateOfBirth: cattleData.dateOfBirth ? 
          admin.firestore.Timestamp.fromDate(new Date(cattleData.dateOfBirth)) : null,
        
        // Physical characteristics
        weight: cattleData.weight || null,
        height: cattleData.height || null,
        color: cattleData.color || null,
        
        // Health information
        healthStatus: cattleData.healthStatus || 'healthy',
        lastVeterinaryCheckup: cattleData.lastVeterinaryCheckup ? 
          admin.firestore.Timestamp.fromDate(new Date(cattleData.lastVeterinaryCheckup)) : null,
        disease: cattleData.disease || 'None',
        customDisease: cattleData.customDisease || null,
        
        // Breeding information
        isBreedingStock: cattleData.isBreedingStock || false,
        lastCalvingDate: cattleData.lastCalvingDate ? 
          admin.firestore.Timestamp.fromDate(new Date(cattleData.lastCalvingDate)) : null,
        numberOfCalves: cattleData.numberOfCalves || 0,
        
        // Identification
        earTag: cattleData.earTag || null,
        microchipNumber: cattleData.microchipNumber || null,
        
        // Management details
        paddockLocation: cattleData.paddockLocation || null,
        feedType: cattleData.feedType || null,
        specialNotes: cattleData.specialNotes || null,
        
        // System metadata
        cattleId,
        farmerId,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        
        // Initialize vaccinations if provided
        vaccinations: Array.isArray(cattleData.vaccinations) ? 
          cattleData.vaccinations.map(vax => ({
            ...vax,
            date: vax.date ? admin.firestore.Timestamp.fromDate(new Date(vax.date)) : null,
            nextDueDate: vax.nextDueDate ? 
              admin.firestore.Timestamp.fromDate(new Date(vax.nextDueDate)) : null
          })) : []
      };
  
      // Add to Firestore
      await db.collection('cattle').doc(cattleId).set(newCattle);
  
      res.status(201).json({
        success: true,
        message: 'Cattle added successfully',
        data: {
          id: cattleId,
          ...newCattle
        }
      });
    } catch (error) {
      console.error('Error adding cattle:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to add cattle',
        error: error.message
      });
    }
  },

  // Update cattle
  updateCattle: async (req, res) => {
    try {
      const { cattleId } = req.params;
      const updateData = req.body;

      if (!cattleId) {
        return res.status(400).json({ success: false, message: 'Cattle ID is required' });
      }

      // Check if cattle exists
      const cattleDoc = await db.collection('cattle').doc(cattleId).get();

      if (!cattleDoc.exists) {
        return res.status(404).json({ success: false, message: 'Cattle not found' });
      }

      // Add updated timestamp
      updateData.updatedAt = admin.firestore.FieldValue.serverTimestamp();

      // Update in Firestore
      await db.collection('cattle').doc(cattleId).update(updateData);

      res.status(200).json({
        success: true,
        message: 'Cattle updated successfully',
        data: {
          id: cattleId,
          ...updateData
        }
      });
    } catch (error) {
      console.error('Error updating cattle:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update cattle',
        error: error.message
      });
    }
  },

  // Delete cattle
  deleteCattle: async (req, res) => {
    try {
      const { cattleId } = req.params;

      if (!cattleId) {
        return res.status(400).json({ success: false, message: 'Cattle ID is required' });
      }

      // Check if cattle exists
      const cattleDoc = await db.collection('cattle').doc(cattleId).get();

      if (!cattleDoc.exists) {
        return res.status(404).json({ success: false, message: 'Cattle not found' });
      }

      // Delete from Firestore
      await db.collection('cattle').doc(cattleId).delete();

      res.status(200).json({
        success: true,
        message: 'Cattle deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting cattle:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete cattle',
        error: error.message
      });
    }
  },

  // Add vaccination record
  addVaccination: async (req, res) => {
    try {
      const { cattleId } = req.params;
      const vaccinationData = req.body;

      if (!cattleId) {
        return res.status(400).json({ success: false, message: 'Cattle ID is required' });
      }

      // Validate required fields
      if (!vaccinationData.name || !vaccinationData.date) {
        return res.status(400).json({
          success: false,
          message: 'Vaccination name and date are required'
        });
      }

      // Check if cattle exists
      const cattleDoc = await db.collection('cattle').doc(cattleId).get();

      if (!cattleDoc.exists) {
        return res.status(404).json({ success: false, message: 'Cattle not found' });
      }

      const cattleData = cattleDoc.data();
      const vaccinations = cattleData.vaccinations || [];

      // Add new vaccination
      vaccinations.push({
        ...vaccinationData,
        date: admin.firestore.Timestamp.fromDate(new Date(vaccinationData.date)),
        nextDueDate: vaccinationData.nextDueDate ?
          admin.firestore.Timestamp.fromDate(new Date(vaccinationData.nextDueDate)) : null
      });

      // Update in Firestore
      await db.collection('cattle').doc(cattleId).update({
        vaccinations,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      res.status(200).json({
        success: true,
        message: 'Vaccination record added successfully'
      });
    } catch (error) {
      console.error('Error adding vaccination record:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to add vaccination record',
        error: error.message
      });
    }
  }
};

module.exports = farmerDashboardController;