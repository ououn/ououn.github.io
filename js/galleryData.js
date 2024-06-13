//////////////////////////////////////entries

const entryTemplate = { series: ["collection1"], categories: ["type1", "type2"], title: "title", desc: "description", url: "google img direct link", objPos: "center" };

/*
const entriesAll = [
    { title: "Doodle", desc: "tehst som sdmfoin feomf opeiwmfweoifmnweio meiomcfweoi mowemfo ewofmwe iwfwef weiofe, ifjoewf fewf.", url: 'https://lh4.googleusercontent.com/UBp90lloZweQlKfLcmt7tEqeKIQmhyqk35raSiAQaidbhUNSMDROPjHhPO4hE1zqT4Y', objPos: "top" },
    { series: ["Chibi Series"], categories: ["character"], title: "Defeated Shaman", desc: "Skytouched Shama - RAID Shadow Legends", url: 'https://lh5.googleusercontent.com/9LHZ1tbnzmN9uWohXZwk_XnWsoQKbfu4PY6Zh6DUaapaxPAWvQ-v3lbx54WdAbnnsxg' },
    { series: ["Chibi Series"], categories: ["character"], title: "Time to Duel!", desc: "Yugioh characters", url: 'https://lh3.googleusercontent.com/Aek4QrkX0Q4JHDcY-u1gnpTxHAxjbyB-dDQvPhEN0VnQwV5sNxGIJHk5lUHgBZJMXmE', objPos: "center" },
    { categories: ["build"], title: "Doodle", url: 'https://lh5.googleusercontent.com/rpGvDTsT5Eb4tM6tndi63qqY8GrpsS2fk7nweMHflErAdMYYI-p2eTI3VPd_jFu2q0U' },
    { series: ["Blocky Characters"], categories: ["character"], title: "Autumn Crocus", url: 'https://lh3.googleusercontent.com/_c_k0PPq5HyZVKMfHokxzMmfI9d5ogHPO4azwixIewzlV926bcfi8r81S0qWNI1xDUs', objPos: "center" },
    { series: ["Blocky Characters"], categories: ["character"], title: "Sein", url: 'https://lh5.googleusercontent.com/PRgfu_eXVl5Y9hdHaWfBY6j8qJfi7JHyzElaCsnzTlmrYLFJMSwoMCNNCAXLEj3D8Ow', objPos: "center 25%" },
    { series: ["Blocky Characters"], categories: ["character"], title: "Cute Rabbit Lady", desc: "Hanee Baram - Crusaders Quest", url: 'https://lh5.googleusercontent.com/3feYTk83qFZgCSV9dCswz8118KebNuOlpmencXzQE3YFOLDmViz3QVsMK-ktVlofyyg', objPos: "center 25%" },
    { series: ["Blocky Characters"], categories: ["character"], title: "npc1", url: 'https://lh3.googleusercontent.com/FCBQFDoqb8DR7ONzIU5iVTjNgXTwgomStHKyfAIX90uJxfEH20yH31q5u6RjfeXXahc' },
    { series: ["Blocky Characters"], categories: ["character"], title: "Giorno", url: 'https://lh3.googleusercontent.com/5yUHRXCm6luNHSRKaHHvCJeSZodrDc_xT2SlgQoDba6LrLeFkxDR3LaWUYsD8ty8KKI', objPos: "top" },
    { series: ["Dead Ahead"], categories: ["pixel"], title: "Psycho Abby", desc: "Abby skin design from Dead Ahead", url: 'https://lh5.googleusercontent.com/SsBqqJ6C3a7smn4fCH9QDUa8KDlrhNELbM2qQtyZjQZGppsXcEyO8nRODoBGf7FL_Co', objPos: "top" },
    { series: ["Chibi Series"], url: 'https://lh6.googleusercontent.com/ChwA6F4-acFfvAtm4Fsb_drHt6H9kp-kLPZfNLJRoHlqbfjEZQxlO8VJPFk19BGZpu0' },
    { series: ["Chibi Series"], url: 'https://lh4.googleusercontent.com/a8gwZaePLoKvCbwQuzt_S1ldxUH-0j-eOjgBvUyaqeuBaMk5bI8PZQit6wSLokMnSGI' },
    { series: ["Chibi Series"], url: 'https://lh6.googleusercontent.com/N4vCclCiuoPZbg3WzGG0hbfdIFPXqKJfePcgiQH1WvtegYpcRwurDks8xFvlmXVYGl0' }


];
*/

var entriesAll;
var entriesFiltered;
var entriesFilteredTemp;

fetch("../json/galleryData.json")
    .then( response => response.json() )
    .then( data => {
        entriesAll = data
        entriesFiltered = data
        //console.log("in fetch")
        //console.log(entriesAll)
    } );

//console.log("line after fetch");
//console.log(entriesAll);



const categoriesAll = [ ["all"], ["character"], ["item"], ["build", "structure"], ["pixel", "pixel art"] ];
const seriesAll = [
    { title: "Chibi Series", desc: "Chibi characters" },
    { title: "Blocky Characters", desc: "Advance minecraft character model" },
    { title: "Dead Ahead", desc: "Zombie Apo game characters and related" }
];