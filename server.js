const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: '.env.local' });

const app = express();
const port = process.env.PORT || 3000;

const schools = require('./schools');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

function getPackPrice(school, grade, type) {
    for (let pack of school.packs) {
        if ((Array.isArray(pack.grades) && pack.grades.includes(grade)) || pack.grades === grade) {
            if (Array.isArray(pack.packs)) {
                const subPack = pack.packs.find(sp => sp.type === type);
                if (subPack) {
                    return parseFloat(subPack.price.replace(/[^\d.-]/g, ''));
                }
            } else if (pack.type === type) {
                return parseFloat(pack.price.replace(/[^\d.-]/g, ''));
            }
        }
    }
    return null;
}

app.get('/', (req, res) => {
    res.render('index', { schools });
});

app.get('/grades', (req, res) => {
    const schoolId = parseInt(req.query.schoolId, 10);
    const selectedSchool = schools.find(school => school.id === schoolId);
    if (!selectedSchool) {
        return res.status(404).send('School not found.');
    }
    res.render('grades', { school: selectedSchool });
});


    app.get('/price', (req, res) => {
    const schoolId = parseInt(req.query.schoolId, 10);
    const packs = JSON.parse(decodeURIComponent(req.query.packs));

    console.log('schoolId:', schoolId);
    console.log('packs:', packs);

    if (isNaN(schoolId) || !Array.isArray(packs)) {
        return res.status(400).send('Invalid parameters. Please provide valid schoolId and packs.');
    }

    const school = schools.find(s => s.id === schoolId);
    if (!school) {
        return res.status(404).send('School not found.');
    }

    let totalCost = 0;
    const orderedPacks = [];
    const MAX_QUANTITY = 100000000;


    for (let pack of packs) {
        const quantity = Math.min(parseInt(pack.quantity, 10), 10);
        const grade = pack.grade;
        const type = pack.type;

        if (isNaN(quantity) || !grade || !type) {
            return res.status(400).send('Invalid pack data.');
        }
        const packPrice = getPackPrice(school, grade, type);
        if (packPrice !== null) {
            totalCost += quantity * packPrice;
            orderedPacks.push({ grade, type, quantity });
        } else {
            return res.status(400).send('Invalid pack data.');
        }
    }

    console.log('totalCost:', totalCost);
    console.log('orderedPacks:', orderedPacks);

    res.render('total', {
        schoolName: school.name,
        orderedPacks,
        result: totalCost.toFixed(2)
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});