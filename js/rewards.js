"use strict";

const JSON_URL = "data/rewards.json";

let tableDefault;

window.onload = function load () {
	DataUtil.loadJSON(JSON_URL, onJsonLoad);
};

let list;
const sourceFilter = getSourceFilter();
let filterBox;
function onJsonLoad (data) {
	tableDefault = $("#pagecontent").html();

	const typeFilter = new Filter({
		header: "Type",
		items: [
			"Blessing",
			"Boon",
			"Charm"
		]
	});

	filterBox = initFilterBox(sourceFilter, typeFilter);

	list = ListUtil.search({
		valueNames: ["name", "source"],
		listClass: "rewards"
	});
	list.on("updated", () => {
		filterBox.setCount(list.visibleItems.length, list.items.length);
	});

	// filtering function
	$(filterBox).on(
		FilterBox.EVNT_VALCHANGE,
		handleFilterChange
	);

	const subList = ListUtil.initSublist({
		valueNames: ["name", "id"],
		listClass: "subrewards",
		getSublistRow: getSublistItem
	});

	addRewards(data);
	BrewUtil.addBrewData(addRewards);
	BrewUtil.makeBrewButton("manage-brew");
	BrewUtil.bind({list, filterBox, sourceFilter});

	History.init();
	handleFilterChange();
	RollerUtil.addListRollButton();
}

let rewardList = [];
let rwI = 0;
function addRewards (data) {
	if (!data.reward || !data.reward.length) return;

	rewardList = rewardList.concat(data.reward);

	let tempString = "";
	for (; rwI < rewardList.length; rwI++) {
		const reward = rewardList[rwI];

		tempString += `
			<li class='row' ${FLTR_ID}='${rwI}' onclick="ListUtil.toggleSelected(event, this)" oncontextmenu="ListUtil.openContextMenu(event, this)">
				<a id='${rwI}' href='#${UrlUtil.autoEncodeHash(reward)}' title='${reward.name}'>
					<span class='name col-xs-10'>${reward.name}</span>
					<span class='source col-xs-2 source${Parser.sourceJsonToAbv(reward.source)}' title='${Parser.sourceJsonToFull(reward.source)}'>${Parser.sourceJsonToAbv(reward.source)}</span>
				</a>
			</li>`;

		// populate filters
		sourceFilter.addIfAbsent(reward.source);
	}
	const lastSearch = ListUtil.getSearchTermAndReset(list);
	$("ul.rewards").append(tempString);

	// sort filters
	sourceFilter.items.sort(SortUtil.ascSort);

	list.reIndex();
	if (lastSearch) list.search(lastSearch);
	list.sort("name");
	filterBox.render();
	handleFilterChange();

	ListUtil.setOptions({
		itemList: rewardList,
		getSublistRow: getSublistItem,
		primaryLists: [list]
	});
	ListUtil.bindPinButton();
	EntryRenderer.hover.bindPopoutButton(rewardList);
	UrlUtil.bindLinkExportButton(filterBox);
	ListUtil.bindDownloadButton();
	ListUtil.bindUploadButton();
	ListUtil.loadState();
}

function handleFilterChange () {
	const f = filterBox.getValues();
	list.filter(function (item) {
		const r = rewardList[$(item.elm).attr(FLTR_ID)];
		return filterBox.toDisplay(
			f,
			r.source,
			r.type
		);
	});
	FilterBox.nextIfHidden(rewardList);
}

function getSublistItem (reward, pinId) {
	return `
		<li class="row" ${FLTR_ID}="${pinId}" oncontextmenu="ListUtil.openSubContextMenu(event, this)">
			<a href="#${UrlUtil.autoEncodeHash(reward)}" title="${reward.name}">
				<span class="name col-xs-12">${reward.name}</span>		
				<span class="id hidden">${pinId}</span>				
			</a>
		</li>
	`;
}

function loadhash (id) {
	$("#pagecontent").html(tableDefault);
	const reward = rewardList[id];

	$("th.name").html(`<span class="stats-name">${reward.name}</span><span class="stats-source source${reward.source}" title="${Parser.sourceJsonToFull(reward.source)}">${Parser.sourceJsonToAbv(reward.source)}</span>`);

	$("tr.text").remove();
	$("tr#text").after(EntryRenderer.reward.getRenderedString(reward));
}

function loadsub (sub) {
	filterBox.setFromSubHashes(sub);
	ListUtil.setFromSubHashes(sub);
}
