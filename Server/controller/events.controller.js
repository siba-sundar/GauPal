const admin = require('firebase-admin');
const db = admin.firestore();

// Controller to fetch all events with pagination
exports.getAllEvents = async (req, res) => {
    try {
        // Get query parameters with defaults
        const category = req.query.category;
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        
        // Calculate starting index for pagination
        const startAt = (page - 1) * limit;
        
        // Create a query reference to the events collection
        let query = db.collection('events');
        
        // Apply category filter if provided
        if (category) {
            query = query.where('category', '==', category);
        }
        
        // Get the total count for pagination info
        const countSnapshot = await query.count().get();
        const totalEvents = countSnapshot.data().count;
        
        // Execute the query with pagination using limit and offset
        const snapshot = await query
            .limit(limit)
            .offset(startAt)
            .get();
        
        // Check if any events exist
        if (snapshot.empty) {
            return res.status(404).json({
                error: 'No Events Found',
                message: category
                    ? `No events found with category: ${category}`
                    : 'No events are currently available'
            });
        }
        
        // Map documents to an array
        const events = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        
        // Return response with pagination details
        res.status(200).json({
            message: 'Events retrieved successfully',
            pagination: {
                total: totalEvents,
                currentPage: page,
                totalPages: Math.ceil(totalEvents / limit),
                perPage: limit
            },
            count: events.length,
            data: events
        });
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Unable to retrieve events',
            details: error.message
        });
    }
};

// Controller to fetch event by ID
exports.getEventById = async (req, res) => {
    try {
        const eventId = req.params.eventId;

        // Validate event ID input
        if (!eventId) {
            return res.status(400).json({
                error: 'Event ID is required',
                message: 'Please provide a valid event ID'
            });
        }

        // Reference to the specific document using the Firestore auto-generated ID
        const eventRef = db.collection('events').doc(eventId);

        // Fetch the document
        const doc = await eventRef.get();

        // Check if document exists
        if (!doc.exists) {
            return res.status(404).json({
                error: 'Event Not Found',
                message: `No event found with ID: ${eventId}`,
                requestedId: eventId
            });
        }

        // Return the document data with its ID
        res.status(200).json({
            message: 'Event retrieved successfully',
            data: {
                id: doc.id,
                ...doc.data()
            }
        });
    } catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Unable to retrieve the event',
            details: error.message
        });
    }
};