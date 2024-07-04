const fs = require('fs');

// Function to remove empty or null values
function removeEmptyValues(obj) {
    if (Array.isArray(obj)) {
        return obj.map(removeEmptyValues).filter(v => v !== null);
    } else if (typeof obj === 'object' && obj !== null) {
        return Object.fromEntries(
            Object.entries(obj)
                .map(([k, v]) => [k, removeEmptyValues(v)])
                .filter(([_, v]) => v != null && v !== '' && (typeof v !== 'object' || Object.keys(v).length !== 0))
        );
    }
    return obj;
}

// Read the input file name from command line arguments
const inputFile = process.argv[2];

if (!inputFile) {
    console.error('Please provide an input GeoJSON file path.');
    process.exit(1);
}

// Read and parse the GeoJSON file
fs.readFile(inputFile, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    try {
        const geojson = JSON.parse(data);
        const cleanedGeojson = removeEmptyValues(geojson);

        // Write the cleaned GeoJSON to a new file
        const outputFile = inputFile.replace('.geojson', '_cleaned.geojson');
        fs.writeFile(outputFile, JSON.stringify(cleanedGeojson, null, 2), (err) => {
            if (err) {
                console.error('Error writing file:', err);
            } else {
                console.log(`Cleaned GeoJSON saved to ${outputFile}`);
            }
        });
    } catch (error) {
        console.error('Error parsing GeoJSON:', error);
    }
});