// controllers/articleController.js
const admin = require('firebase-admin');


const db = admin.firestore();

// Controller to fetch article by article name
exports.getArticleByName = async (req, res) => {
    try {
        const articleName = req.params.articleName;

        // Validate article name input
        if (!articleName) {
            return res.status(400).json({
                error: 'Article name is required',
                message: 'Please provide a valid article name'
            });
        }

        // Reference to the specific document using the article name as the key
        const articleRef = db.collection('articles').doc(articleName);

        // Fetch the document
        const doc = await articleRef.get();

        // Check if document exists
        if (!doc.exists) {
            return res.status(404).json({
                error: 'Article Not Found',
                message: `No article found with name: ${articleName}`,
                requestedArticle: articleName
            });
        }

        // Return the document data
        res.status(200).json({
            message: 'Article retrieved successfully',
            data: doc.data()
        });
    } catch (error) {
        console.error('Error fetching article:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Unable to retrieve the article',
            details: error.message
        });
    }
};

// Controller to fetch all breed articles
exports.getAllBreedArticles = async (req, res) => {
    try {
        // Fetch all documents from the articles collection
        const snapshot = await db.collection('articles').get();

        // Check if any articles exist
        if (snapshot.empty) {
            return res.status(404).json({
                error: 'No Articles Found',
                message: 'No breed articles are currently available'
            });
        }

        // Map documents to an array
        const articles = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.status(200).json({
            message: 'Articles retrieved successfully',
            count: articles.length,
            data: articles
        });
    } catch (error) {
        console.error('Error fetching all articles:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Unable to retrieve articles',
            details: error.message
        });
    }
};


// Controller to fetch 3 random breed articles
exports.getRandomArticles = async (req, res) => {
    try {
        // Fetch all documents from the articles collection
        const snapshot = await db.collection('articles').get();

        // Check if any articles exist
        if (snapshot.empty) {
            return res.status(404).json({
                error: 'No Articles Found',
                message: 'No breed articles are currently available'
            });
        }

        // Convert snapshot to array of articles
        const allArticles = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Shuffle the articles array using Fisher-Yates algorithm
        const shuffleArray = (array) => {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        };

        // Shuffle and slice to get 3 random articles
        const randomArticles = shuffleArray(allArticles).slice(0, 4);

        res.status(200).json({
            message: 'Random articles retrieved successfully',
            count: randomArticles.length,
            data: randomArticles
        });
    } catch (error) {
        console.error('Error fetching random articles:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Unable to retrieve random articles',
            details: error.message
        });
    }
};


exports.getArticleByCategory = async ( req, res) =>{
    const categoryName = req.params.categroy;

    if(!categoryName){
        return res.status(400).json({
            error:'Article catrgory is required',
            message:'Please provide catrgory',
    })


    const categroyRef = db.collection('articles').doc()
    }
}













//   breed specific 

exports.getRandomBreeds = async (req, res) => {
    try {
        const firestore = admin.firestore();
        const breedsRef = firestore.collection('cow-breeds');

        // Get all breed documents
        const snapshot = await breedsRef.get();
        const breeds = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Randomly select 3 breeds
        const randomBreeds = breeds
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);

        res.status(200).json({
            status: 'success',
            data: randomBreeds
        });
    } catch (error) {
        console.error('Error fetching random breeds:', error);
        res.status(500).json({
            status: 'error',
            message: 'Unable to fetch random breeds'
        });
    }
};






exports.getAllBreeds = async (req, res) => {
    try {
        const firestore = admin.firestore();
        const breedsRef = firestore.collection('cow-breeds');

        // Get all breed documents
        const snapshot = await breedsRef.get();
        const breeds = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.status(200).json({
            status: 'success',
            count: breeds.length,
            data: breeds
        });
    } catch (error) {
        console.error('Error fetching all breeds:', error);
        res.status(500).json({
            status: 'error',
            message: 'Unable to fetch breeds'
        });
    }
};

exports.getBreedByName = async (req, res) => {
    try {
        const { breedName } = req.params;

        if (!breedName) {
            return res.status(400).json({
                status: 'error',
                message: 'Breed name is required'
            });
        }

        const firestore = admin.firestore();
        const breedRef = firestore.collection('cow-breeds').doc(breedName.toLowerCase());

        const doc = await breedRef.get();

        if (!doc.exists) {
            return res.status(404).json({
                status: 'error',
                message: 'Breed not found'
            });
        }

        const breedData = {
            id: doc.id,
            ...doc.data()
        };

        res.status(200).json({
            status: 'success',
            data: breedData
        });
    } catch (error) {
        console.error('Error fetching breed details:', error);
        res.status(500).json({
            status: 'error',
            message: 'Unable to fetch breed details'
        });
    }
};

exports.searchBreeds = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({
                status: 'error',
                message: 'Search query is required'
            });
        }

        const firestore = admin.firestore();
        const breedsRef = firestore.collection('cow-breeds');

        // Perform case-insensitive search across multiple fields
        const snapshot = await breedsRef.get();
        const breeds = snapshot.docs
            .map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            .filter(breed =>
                breed.breed.toLowerCase().includes(query.toLowerCase()) ||
                breed.introduction.content.toLowerCase().includes(query.toLowerCase()) ||
                breed.headings.some(heading =>
                    heading.content.toLowerCase().includes(query.toLowerCase())
                )
            );

        res.status(200).json({
            status: 'success',
            count: breeds.length,
            data: breeds
        });
    } catch (error) {
        console.error('Error searching breeds:', error);
        res.status(500).json({
            status: 'error',
            message: 'Unable to search breeds'
        });
    }
};