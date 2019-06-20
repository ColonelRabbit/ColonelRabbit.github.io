// function openTab(evt, cityName) {
// var i, tabcontent, tablinks;
// tabcontent = document.getElementsByClassName("tabcontent");
// for (i = 0; i < tabcontent.length; i++) {
//   tabcontent[i].style.display = "none";
// }
// tablinks = document.getElementsByClassName("tablinks");
// for (i = 0; i < tablinks.length; i++) {
//   tablinks[i].className = tablinks[i].className.replace(" active", "");
// }
// document.getElementById(cityName).style.display = "block";
// evt.currentTarget.className += " active";
// }

var character;
var charLevel;
var proficiencyBonus;

var editLocked = true;
const charSheet = $("#charsheet");
const lockIcon = $("#lockicon");
const dice = $(".statdice");
const alphaSortButton = $("#name-sort-icon");
const modSortButton = $("#mod-sort-icon");
const skillSortButton = $("#skill-sort-icon");
const proficiencies = $(".prof");
const statnumbers = $(".statnumbers");
const skills=$("#allskills div.skillboxwrapper").get();
const saves=$("#allsaves div.staboxwrapper").get();
const loadcharSubmit = $("#loadChar-submit");
const savecharSumbit = $("#saveChar-submit");
const loadcharInput = $("#loadChar-idinput");

const proficiency_types = ['notproficient', 'proficient', 'expert', 'jack'];
const proficiency_multiplier = [0, 1, 2, 0.5];
const proficiency_icons = [
	{
		"type": "far",
		"icon": "fa-circle"
	},
	{
		"type": "fas",
		"icon": "fa-circle"
	},
	{
		"type": "far",
		"icon": "fa-dot-circle"
	},
	{
		"type": "fas",
		"icon": "fa-adjust"
	}
]

const jsonPath = "data/charsheets/chardata.json";
//const jsonSavePath = "data/charsheets/newchardata.json";
var charData;

$('document').ready(()=> {
	charSheet.hide();
	$('#classStuff').hide();
});

loadcharSubmit.click(loadCharacter);
loadcharInput.keypress((e)=> {
	if (e.which === 13) {
		loadcharSubmit.click();
	}
});

function loadCharacter() {
	DataUtil.loadJSON(jsonPath, onCharLoad);
}

//savecharSumbit.click(onCharSave);


function onCharLoad(data) {
	let charId = loadcharInput.val();

	let char = data.characters.find(o => o.id === charId);
	if (char) {
		character = char;
	} else {
		alert('Invalid Character ID');
		return false;
	}
	$(`#charname`)[0].innerText = character.name;
	$(`#race`)[0].innerText = character.race.subrace ? `${character.race.main} (${character.race.subrace})` : character.race.main ;

	let classText = ``;
	let classes = character.classes;
	for (let charclass in classes) {
		if (classText != ``) {
			classText += `, `;
		}
		classText += classes[charclass].class;
		if (classes[charclass].subclass) {
			classText += ` (${classes[charclass].subclass}) `;
		}
		classText += ` ${classes[charclass].level}`;
	}
	$(`#class`)[0].innerText = classText;
	$(`#charportrait`)[0].src = character.portrait.path;
	charLevel = character.totallevel;
	proficiencyBonus = Math.floor((charLevel-1)/4)+2;
	//console.log(data);
	for (let skill in character.skills) {
		let prof = proficiency_types.indexOf(character.skills[skill]);
		const profIcon = $(`#${skill}prof`);
		profIcon.addClass(proficiency_types[prof]);
		profIcon[0].classList.replace('far', proficiency_icons[prof].type);
		profIcon[0].classList.replace('fa-circle', proficiency_icons[prof].icon);
	}
	for (let save in character.saves) {
		let prof = proficiency_types.indexOf(character.saves[save]);
		const profIcon = $(`#${save}saveprof`);
		profIcon.addClass(proficiency_types[prof]);
		profIcon[0].classList.replace('far', proficiency_icons[prof].type);
		profIcon[0].classList.replace('fa-circle', proficiency_icons[prof].icon);
	}
	for (let stat in character.stats) {
		$(`#${stat}stat`)[0].innerText = character.stats[stat];
		updateStat(stat);
	}

	charSheet.show();
}


function updateStat(stat) {
	const statScore = parseInt($(`#${stat}stat`)[0].innerText);
	const mod = Math.floor((statScore - 10)/2);
	const mod_text = (mod > 0) ? `+${mod}` : mod;
	$(`#${stat}mod`)[0].innerText = mod_text;
	updateSave(`${stat}save`);
	updateAllSkills();
}


function editStat() {
	let stat = $(this)[0].id.split('stat')[0];
	let new_stat = parseInt(prompt(`Enter new stat for ${stat}: `, "10"));
	$(`#${stat}stat`)[0].innerText = new_stat;
	updateStat(stat);
}

function updateSave(save) {
	const mod_box = $(`#${save}mod`)[0];
	let mod = parseInt($(`#${save.split('save')[0]}mod`)[0].innerText);
	const skill_prof = $(`#${save}prof`)[0];
	for (let prof_type in proficiency_types) {
		if (skill_prof.classList.contains(proficiency_types[prof_type])) {
			mod += Math.floor(proficiencyBonus*proficiency_multiplier[prof_type]);
			break;
		}
	}
	const mod_text = (mod > 0) ? `+${mod}` : mod;
	mod_box.innerText = mod_text;
}
function updateSkill(skill) {
	const mod_box = $(`#${skill}mod`)[0];
	const skill_mod = mod_box.classList[1].split('skill')[0];
	let mod = parseInt($(`#${skill_mod}mod`)[0].innerText);
	const skill_prof = $(`#${skill}prof`)[0];
	for (let prof_type in proficiency_types) {
		if (skill_prof.classList.contains(proficiency_types[prof_type])) {
			mod += Math.floor(proficiencyBonus*proficiency_multiplier[prof_type]);
			break;
		}
	}
	const mod_text = (mod > 0) ? `+${mod}` : mod;
	mod_box.innerText = mod_text;
}


//BADLY WRITTEN AND NOT SUPER FUNCTIONAL
function toggleProf() {
	const prof = $(this)[0];
	let profType = 0;
	let new_profType = 0;
	for (let prof_type in proficiency_types) {
		if (prof.classList.contains(proficiency_types[prof_type])) {
			profType = parseInt(prof_type);
			new_profType = (profType+1)%4;
			break;
		}
	}
	prof.classList.replace(proficiency_types[profType], proficiency_types[new_profType]);
	prof.classList.replace(proficiency_icons[profType].icon, proficiency_icons[new_profType].icon,)
	prof.classList.replace(proficiency_icons[profType].type, proficiency_icons[new_profType].type,)
	prof_id = prof.id.split('prof')[0];
	if (prof.classList.contains('save')) {
		updateSave(prof_id);
		character.saves[prof_id.substring(0,3)] = proficiency_types[new_profType];
	} else if (prof.classList.contains('skill')) {
		updateSkill(prof_id);
		character.skills[prof_id] = proficiency_types[new_profType];
		console.log(character.skills[prof_id]);
	}
}


alphaSortButton.click(sortByName);
modSortButton.click(sortByMod);
skillSortButton.click(sortBySkill);

dice.click(rollDice);

function rollDice() {
	let result;
	const rollFor = $(this)[0].id;
	const mod = parseInt($(`#${rollFor}mod`)[0].innerText);
	let roll = parseInt(Math.random()*20)+1;

	if (character.classes.find(x => {return x.subclass === 'Inquisitive'}) && rollFor == "insight")  {
		roll = Math.max(roll, 8);
	}
	if (character.classes.find(x => {return (x.class === 'Rogue' && x.level === 11)}) && $(this)[0].classList.contains('skill'))  {
		roll = Math.max(roll, 10);
	}
	result = roll+mod;
	console.log(`Rolling 1d20+${mod} = ${result} for ${rollFor}`);
}

lockIcon.click(lockUnlock);

function lockEdit() {
	lockIcon.removeClass('fa-lock-open');
	lockIcon.addClass('fa-lock');
	proficiencies.off('click');
}

function unlockEdit() {
	lockIcon.removeClass('fa-lock');
	lockIcon.addClass('fa-lock-open');
	proficiencies.click(toggleProf);
	statnumbers.click(editStat);
}

function lockUnlock() {
	editLocked = !editLocked;
	if (editLocked) {
		lockEdit();
	} else {
		unlockEdit();
	}
}

var alphaSort=true;
var numberSort=false;

function updateStatMod() {


	updateAllSaves();
	updateAllSkills();
}

function updateAllSaves() {
	for (let x in saves) {
		const save = saves[x].id.split('box')[0];
		updateSave(save);
	}
}

function updateAllSkills() {
	for (let x in skills) {
		const skill = skills[x].id.split('box')[0];
		updateSkill(skill);
	}
}


/* ______________________________________________ */
//SORT SKILLS
function sortByName() {
	skills.sort(function (a, b){
		return ((a.id < b.id) ? -1 : ((a.id > b.id) ? 1 : 0));
	});

	let icon = $("#name-sort-icon");
	if (alphaSort) {
		skills.reverse();

		icon.removeClass('fa-sort-alpha-down');
		icon.addClass('fa-sort-alpha-up-alt');
	} else {
		icon.removeClass('fa-sort-alpha-up-alt');
		icon.addClass('fa-sort-alpha-down');
	}
	alphaSort= !alphaSort;

	$.each(skills,function(){
		$("#allskills").append(this);
	});
}
function sortByMod() {
	skills.sort(function (a, b){
		a_ = parseInt(a.children[0].children[0].children[3].children[0].innerText);
		b_ = parseInt(b.children[0].children[0].children[3].children[0].innerText);
		return ((a_ < b_) ? -1 : ((a_ > b_) ? 1 : 0));
	});
	skills.reverse();

	let icon = $("#mod-sort-icon");
	if (numberSort) {
		skills.reverse();
		icon.removeClass('fa-sort-numeric-down-alt');
		icon.addClass('fa-sort-numeric-up');
	} else {
		icon.removeClass('fa-sort-numeric-up');
		icon.addClass('fa-sort-numeric-down-alt');
	}
	numberSort= !numberSort;
	$.each(skills,function(){
		$("#allskills").append(this);
	});
}
function sortBySkill() {
	console.log("not implemented yet");
}

//MASONRY GRID
$('.mason-container').masonry({
  itemSelector : '.mason-grid'
});
