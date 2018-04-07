// Options for map
var options = {
    lat: 0,
    lng: 0,
    zoom: 1.5,
    style: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png'
}

// Create an instance of Leaflet
var mappa = new Mappa('Leaflet');

var myMap;
var canvas;
let table;
let minimumTourist;
let maximumTourist;
let tourists;
let yearCheckBox;
let years;
let selectedYears = [];
let months;
let selectedMonths = [];

// let selectedYearsAndMonths

function preload() {

    //load the data
    table = loadTable('../../data/data.csv', 'csv', 'header')

}

function setup() {
    canvas = createCanvas(800, 700);
    // textAlign(CENTER);
    let divYear = createDiv('');
    let years = createDiv('Year: ');
    divYear.id('year-main-div');
    years.parent('year-main-div');
    years.class('year');


    let divMonth = createDiv('');
    let months = createDiv('Month: ');
    divMonth.id('month-main-div');
    months.parent('month-main-div');
    months.class('month');


    textSize(16)
    textAlign(CENTER);
    text('Year', 50, 50);
    background(200);

    // Create a tile map and overlay the canvas on top.
    myMap = mappa.tileMap(options);
    myMap.overlay(canvas);
    console.log(table.rows[0].obj.Tourists);
    years = [... new Set(table.rows.map(row => row.obj.Year))];
    months = [... new Set(table.rows.map(row => row.obj.Month))];
    for (i = 0; i < years.length; i++) {
        yearCheckBox = createCheckbox(years[i], years[i]);
        console.log(yearCheckBox)

        // div.html(yearCheckBox.elt.innerHTML, true);
        yearCheckBox.changed(yearCheckedEvent);
        yearCheckBox.parent('year-main-div');
        yearCheckBox.id(years[i]);
        yearCheckBox.class('year');
        yearCheckBox.value(years[i])
    }
    for (i = 0; i < months.length; i++) {
        monthCheckBox = createCheckbox(months[i], months[i]);
        monthCheckBox.changed(yearCheckedEvent);
        monthCheckBox.parent('month-main-div');
        monthCheckBox.id(months[i]);
        monthCheckBox.class('month');
        monthCheckBox.value(months[i])
    }

    console.log(years);
    tourists = table.rows.map(row => parseFloat(row.obj.Tourists));
    minimumTourist = Math.min(...tourists);
    maximumTourist = Math.max(...tourists);


    // Only redraw the meteorites when the map change and not every frame.
    myMap.onChange(drawMap);

    fill(70, 203, 31);
    stroke(100);
}

// The draw loop is fully functional but we are not using it for now.
function draw() {
}

function yearCheckedEvent() {
    var year = this.checked();
    if (year) {
        console.log(this);
        let value = this.value();
        console.log(value)
        selectedYears.push(value);
    } else {
        let value = this.value();
        let index = selectedYears.indexOf(value);
        if (index > -1) {
            selectedYears.splice(index, 1)
        }
    }
    console.log(selectedYears)

}

function drawMap() {
    // Clear the canvas
    clear();
    for (var i = 0; i < table.getRowCount(); i++) {
        // Get the lat/lng of each Tourism
        var latitude = Number(table.getString(i, 'Latitude'));
        var longitude = Number(table.getString(i, 'Longitude'));

        // Only draw them if the position is inside the current map bounds. We use a
        // Leaflet method to check if the lat and lng are contain inside the current
        // map. This way we draw just what we are going to see and not everything. See
        // getBounds() in http://leafletjs.com/reference-1.1.0.html
        if (myMap.map.getBounds().contains({lat: latitude, lng: longitude})) {
            // Transform lat/lng to pixel position
            var pos = myMap.latLngToPixel(latitude, longitude);
            // Get the density of tourism and map it.
            var size = table.getString(i, 'Tourists');

            size = map(size, minimumTourist, maximumTourist, 1, 10) + myMap.zoom();
            ellipse(pos.x, pos.y, size, size);
        }
    }
}