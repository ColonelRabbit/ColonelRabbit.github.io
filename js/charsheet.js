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
var char_level = 3;
var editLocked = true;
const lockIcon = $("#lockicon");
const dice = $(".statdice");
const alphaSortButton = $("#name-sort-icon");
const modSortButton = $("#mod-sort-icon");
const profDots = $(".prof-dot");
const statnumbers = $(".statnumbers");
const skills=$("#allskills div.skillboxwrapper").get();
const saves=$("#allsaves div.staboxwrapper").get();
var proficiencyBonus = Math.floor((char_level-1)/4)+2;

const proficiency_types = ['notproficient', 'proficient', 'jack', 'expert'];
const proficiency_multiplier = [0, 1, 0.5, 2];

$(document).ready(()=>{
	updateStat('str');
	updateStat('dex');
	updateStat('con');
	updateStat('int');
	updateStat('wis');
	updateStat('cha');
});

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

function toggleProficiency() {
  const toggler = $(this)[0];
  proficient = toggler.classList.contains('proficient');
  if (proficient) {
    toggler.classList.replace('proficient', 'notproficient');
    toggler.classList.replace('fas', 'far');
  } else {
    toggler.classList.replace('notproficient', 'proficient');
    toggler.classList.replace('far', 'fas');
  }
  updateMod(toggler);
}
//BROKEN
function updateMod(abilityProf) {
  const ability = abilityProf.id.split('prof')[0];
  console.log(ability);
  if (abilityProf.classList.contains('proficient')) {
    modifier = 2 + 1;
  } else {
    modifier = -1;
  }
  const modifierText = (modifier > 0) ? `+${modifier}` : modifier;
  $(`#${ability}mod`)[0].innerText=modifierText;
}

alphaSortButton.click(sortByName);
modSortButton.click(sortByMod);

dice.click(rollDice);

function rollDice() {
  console.log($(this));
  const rollFor = $(this)[0].id;
  const mod = parseInt($(`#${rollFor}mod`)[0].innerText);
  console.log(`Rolling 1d20+${mod} = ${parseInt(Math.random()*20)+mod+1} for ${rollFor}`);
}


lockIcon.click(lockUnlock);

function lockEdit() {
  lockIcon.removeClass('fa-lock-open');
  lockIcon.addClass('fa-lock');
  profDots.off('click');
}

function unlockEdit() {
  lockIcon.removeClass('fa-lock');
  lockIcon.addClass('fa-lock-open');
  profDots.click(toggleProficiency);
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

//MASONRY GRID
$('.mason-container').masonry({
  itemSelector : '.mason-grid'
});
