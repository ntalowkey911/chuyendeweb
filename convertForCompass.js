const fs = require('fs');

try {
    const data = fs.readFileSync('products_data.json', 'utf8');
    const products = JSON.parse(data);

    const compassProducts = products.map(p => {
        const { id, imageUrls, ...rest } = p;
        return {
            _id: { "$oid": id },
            imageUrls: [rest.imageUrl], // Overwrite imageUrls with the new imageUrl
            ...rest
        };
    });

    fs.writeFileSync('products_import.json', JSON.stringify(compassProducts, null, 2), 'utf8');
    console.log("Created products_import.json successfully!");
} catch (e) {
    console.error(e);
}
