

const classURL = "data/classes.json";
const raceURL = "data/races.json";
const dataURLs = [
	"data/classes.json",
	"data/races.json",
	"data/items.json",
	"data/spells/roll20.json",
	"data/spells/spells-3pp-bols.json",
	"data/backgrounds.json"
];


let allData = {};
let dataList = {};

$(window).on('load', ()=> {

	dataURLs.forEach((url) => {
		DataUtil.loadJSON(url, onJsonLoad);
		console.log(url);
	});
});



function onJsonLoad (data) {
	let dataType = Object.keys(data)[0];
	if (allData[dataType]) {
		allData[dataType] = allData[dataType].concat(data[dataType]);
	} else {
		allData[dataType] = data[dataType];
	}
	dataList[dataType] = makeList(dataType);
}


function makeList (type) {
	let input = allData[type];
	let list = [];
	for (let i=0; i<input.length; i++) {
		list.push(input[i].name);
	}
	return list;
}

function fillRaces() {
	$.each(allData.race, (index, value) => {
		$('#racesSelect').append(
			$('<option></option>').val(value.name).html(value.name)
		);
	});
}

function x(sel) {
	console.log(sel.value);
}

$('#racesSelect').on("change", function() {
	const subraces = allData.race[dataList.race.indexOf($(this).val())].subraces;
	$('#subracesSelect').empty();
	$.each(subraces, (index, value) => {
		if (value.name) {
			$('#subracesSelect').append(
				$('<option></option>').val(value.name).html(value.name)
			);
		}
	});
});
