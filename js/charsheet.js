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

var editLocked = true;
const lockIcon = $("#lockicon");
const dice = $(".statdice");
const alphaSortButton = $("#name-sort-icon");
const modSortButton = $("#mod-sort-icon");

alphaSortButton.click(sortByName);
modSortButton.click(sortByMod);

dice.click(rollDice);

function rollDice() {
  alert(`${parseInt(Math.random()*20)+1}`);
}


lockIcon.click(lockUnlock);

function lockEdit() {
  lockIcon.removeClass('fa-lock-open');
  lockIcon.addClass('fa-lock');
}

function unlockEdit() {
  lockIcon.removeClass('fa-lock');
  lockIcon.addClass('fa-lock-open');

}

function lockUnlock() {
  editLocked = !editLocked;
  if (editLocked) {
    lockEdit();
  } else {
    unlockEdit();
  }
}

$('.mason-container').masonry({
  itemSelector : '.mason-grid'
});

var alphaSort=true;
var numberSort=false;
const skills=$("#allskills div.skillboxwrapper").get();

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
