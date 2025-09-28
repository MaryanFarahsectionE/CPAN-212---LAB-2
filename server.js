const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

function simulateDelay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const userData = {
    id: 12345,
    name: 'Maryan Farah'
};

app.get('/callback', (req, res) => {
    console.log('Callback endpoint called');
    
    setTimeout((error, data) => {
        if (error) {
            console.error('Callback error:', error);
            return res.status(500).json({ 
                error: 'Callback failed',
                message: error.message 
            });
        }
        
        console.log('Callback success:', data);
        res.json({
            method: 'callback',
            message: 'Data fetched successfully using callback',
            data: data,
            timestamp: new Date().toISOString()
        });
    }, 1000, null, userData);
});

app.get('/promise', (req, res) => {
    console.log('Promise endpoint called');
    
    const fetchDataPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() > 0.1) {
                resolve(userData);
            } else {
                reject(new Error('Promise rejected: Simulated API failure'));
            }
        }, 1000);
    });
    
    fetchDataPromise
        .then(data => {
            console.log('Promise resolved:', data);
            res.json({
                method: 'promise',
                message: 'Data fetched successfully using Promise',
                data: data,
                timestamp: new Date().toISOString()
            });
        })
        .catch(error => {
            console.error('Promise error:', error);
            res.status(500).json({
                error: 'Promise failed',
                message: error.message
            });
        });
});

app.get('/async', async (req, res) => {
    console.log('Async/await endpoint called');
    
    try {
        const fetchData = () => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (Math.random() > 0.1) {
                        resolve(userData);
                    } else {
                        reject(new Error('Async operation failed: Simulated API failure'));
                    }
                }, 1000);
            });
        };
        
        const data = await fetchData();
        console.log('Async operation success:', data);
        
        res.json({
            method: 'async/await',
            message: 'Data fetched successfully using async/await',
            data: data,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Async error:', error);
        res.status(500).json({
            error: 'Async operation failed',
            message: error.message
        });
    }
});

app.get('/file', async (req, res) => {
    console.log('File reading endpoint called');
    
    try {
        const filePath = path.join(__dirname, 'sample.txt');
        const sampleContent = `Sample file content for CPAN 212 Lab 2
User ID: ${userData.id}
User Name: ${userData.name}
Created at: ${new Date().toISOString()}
This file demonstrates asynchronous file reading with fs.promises`;
        
        await fs.writeFile(filePath, sampleContent);
        const fileContent = await fs.readFile(filePath, 'utf8');
        console.log('File read successfully');
        
        res.json({
            method: 'fs.promises',
            message: 'File read successfully using fs.promises',
            filePath: filePath,
            content: fileContent,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('File reading error:', error);
        res.status(500).json({
            error: 'File reading failed',
            message: error.message
        });
    }
});

app.get('/chain', async (req, res) => {
    console.log('Chain operations endpoint called');
    
    try {
        const results = {
            steps: [],
            totalTime: 0
        };
        
        const startTime = Date.now();
        
        console.log('Step 1: Simulating login...');
        await simulateDelay(800);
        results.steps.push({
            step: 1,
            action: 'login',
            message: 'User login successful',
            timestamp: new Date().toISOString()
        });
        
        console.log('Step 2: Fetching user data...');
        await simulateDelay(1200);
        results.steps.push({
            step: 2,
            action: 'fetch_data',
            message: 'User data fetched successfully',
            data: userData,
            timestamp: new Date().toISOString()
        });
        
        console.log('Step 3: Rendering data...');
        await simulateDelay(600);
        results.steps.push({
            step: 3,
            action: 'render',
            message: 'Data rendered successfully',
            timestamp: new Date().toISOString()
        });
        
        const endTime = Date.now();
        results.totalTime = endTime - startTime;
        
        console.log('All chain operations completed successfully');
        
        res.json({
            method: 'chained operations',
            message: 'All operations completed successfully',
            results: results,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Chain operations error:', error);
        res.status(500).json({
            error: 'Chain operations failed',
            message: error.message
        });
    }
});

app.get('/', (req, res) => {
    res.json({
        message: 'CPAN 212 Lab 2 - Async Programming Demo',
        author: 'Maryan Farah',
        endpoints: [
            'GET /callback - Demonstrates callback pattern',
            'GET /promise - Demonstrates Promise pattern', 
            'GET /async - Demonstrates async/await pattern',
            'GET /file - Demonstrates file reading with fs.promises',
            'GET /chain - Demonstrates chained operations with simulateDelay'
        ],
        instructions: 'Visit any endpoint to see the respective async pattern in action'
    });
});

app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: err.message
    });
});

app.use((req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        message: `The endpoint ${req.path} was not found`,
        availableEndpoints: ['/', '/callback', '/promise', '/async', '/file', '/chain']
    });
});

app.listen(PORT, () => {
    console.log(`🚀 CPAN 212 Lab 2 server running on http://localhost:${PORT}`);
    console.log('📋 Available endpoints:');
    console.log('   GET / - Root endpoint with instructions');
    console.log('   GET /callback - Callback demonstration');
    console.log('   GET /promise - Promise demonstration');
    console.log('   GET /async - Async/await demonstration');
    console.log('   GET /file - File reading demonstration');
    console.log('   GET /chain - Chained operations demonstration');
});

process.on('SIGINT', () => {
    console.log('\n🛑 Server shutting down gracefully...');
    process.exit(0);
});

module.exports = app;