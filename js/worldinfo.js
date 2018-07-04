"use strict";

const JSON_URL = "data/worldinfo.json";

window.onload = function load () {
	DataUtil.loadJSON(JSON_URL, onJsonLoad);
};

let list;
const sourceFilter = getSourceFilter();
const typeFilter = new Filter({
	header: "Type",
	items: [STR_NONE]
});
const locationFilter = new Filter({
  header: "Location",
  items: [STR_NONE],
  displayFn: Parser.locationAbvToFull
});
const raceFilter = new Filter({
  header: "Race",
  items: [STR_NONE]
});

let filterBox;
function onJsonLoad (data) {

	list = ListUtil.search({
		valueNames: ["name", "type", "location", "race", "symbol"],
		listClass: "deities",
		sortFunction: SortUtil.listSort
	});


	filterBox = initFilterBox(sourceFilter, locationFilter, typeFilter, raceFilter);

	list.on("updated", () => {
		filterBox.setCount(list.visibleItems.length, list.items.length);
	});
	// filtering function
	$(filterBox).on(
		FilterBox.EVNT_VALCHANGE,
		handleFilterChange
	);

	RollerUtil.addListRollButton();
	addListShowHide();

	const subList = ListUtil.initSublist({
		valueNames: ["name", "type", "location", "race", "id"],
		listClass: "subdeities",
		getSublistRow: getSublistItem
	});
	ListUtil.initGenericPinnable();

	addInfo(data);
	BrewUtil.addBrewData(addInfo);
	BrewUtil.makeBrewButton("manage-brew");
	BrewUtil.bind({list, filterBox, sourceFilter});

	History.init();
	handleFilterChange();
	RollerUtil.addListRollButton();
	addListShowHide();
}

let deitiesList = [];
let dtI = 0;
function addInfo (data) {
	if (!data.info || !data.info.length) return;

	deitiesList = deitiesList.concat(data.info);

	let tempString = "";
	for (; dtI < deitiesList.length; dtI++) {
		const g = deitiesList[dtI];
		const abvSource = Parser.sourceJsonToAbv(g.source);

		g.location.sort(SortUtil.locationSort);
		if (!g.race) g.race = [STR_NONE];
		g.race.sort(SortUtil.ascSort);

		tempString += `
			<li class="row" ${FLTR_ID}="${dtI}" onclick="ListUtil.toggleSelected(event, this)" oncontextmenu="ListUtil.openContextMenu(event, this)">
				<a id="${dtI}" href="#${UrlUtil.autoEncodeHash(g)}" title="${g.name}">
					<span class="name col-xs-3">${g.name}</span>
					<span class="type col-xs-3 text-align-center">${g.type}</span>
					<span class="location col-xs-3 text-align-center">${g.location.join(", ")}</span>
					<span class="race col-xs-3 text-align-center ${g.race[0] === STR_NONE ? `list-entry-none` : ""}">${g.race.join(", ")}</span>
				</a>
			</li>
		`;

		sourceFilter.addIfAbsent(g.source);
		typeFilter.addIfAbsent(g.type);
    for (let race in g.race) {
      raceFilter.addIfAbsent(g.race[race]);
    }
    for (let location in g.location) {
      locationFilter.addIfAbsent(g.location[location]);
    }
	}
	const lastSearch = ListUtil.getSearchTermAndReset(list);
	$(`#deitiesList`).append(tempString);
	// sort filters
	sourceFilter.items.sort(SortUtil.ascSort);

	list.reIndex();
	if (lastSearch) list.search(lastSearch);
	list.sort("name");
	filterBox.render();
	handleFilterChange();

	ListUtil.setOptions({
		itemList: deitiesList,
		getSublistRow: getSublistItem,
		primaryLists: [list]
	});
	ListUtil.bindPinButton();
	EntryRenderer.hover.bindPopoutButton(deitiesList);
	UrlUtil.bindLinkExportButton(filterBox);
	ListUtil.bindDownloadButton();
	ListUtil.bindUploadButton();
	ListUtil.loadState();
}

function handleFilterChange () {
	const f = filterBox.getValues();
	list.filter(function (item) {
		const g = deitiesList[$(item.elm).attr(FLTR_ID)];
		return filterBox.toDisplay(
			f,
			g.source,
			g.location,
			g.type,
			g.race
		);
	});
	FilterBox.nextIfHidden(deitiesList);
}

function getSublistItem (g, pinId) {
	return `
		<li class="row" ${FLTR_ID}="${pinId}" oncontextmenu="ListUtil.openSubContextMenu(event, this)">
			<a href="#${UrlUtil.autoEncodeHash(g)}" title="${g.name}">
				<span class="name col-xs-4">${g.name}</span>
				<span class="type col-xs-2">${g.type}</span>
				<span class="location col-xs-2">${g.location.join(", ")}</span>
				<span class="race col-xs-4 ${g.race[0] === STR_NONE ? `list-entry-none` : ""}">${g.race.join(", ")}</span>
				<span class="id hidden">${pinId}</span>
			</a>
		</li>
	`;
}

const renderer = new EntryRenderer();
function loadhash (jsonIndex) {
	const info = deitiesList[jsonIndex];

	const renderStack = [];
	if (info.entries) renderer.recursiveEntryRender({entries: info.entries}, renderStack);
  const infoTitle = info.title ? `, ${info.title.toTitleCase()}` : "";
	const $content = $(`#pagecontent`);
	$content.html(`
		${EntryRenderer.utils.getBorderTr()}
		${EntryRenderer.utils.getNameTr(info, false, "", infoTitle)}
		<tr><td colspan="6"><span class="bold">Type: </span>${info.type}</td></tr>
		<tr><td colspan="6"><span class="bold">Location: </span>${info.location.join(", ")}</td></tr>
		<tr><td colspan="6"><span class="bold">Race: </span>${info.race.join(", ")}</td></tr>
		${info.altNames ? `<tr><td colspan="6"><span class="bold">Alternate Names: </span>${info.altNames.join(", ")}</td></tr>` : ""}
		${info.symbol ? `<tr><td colspan="6"><span class="bold">Symbol: </span>${info.symbol}</td></tr>` : ""}
		${info.symbolImg ? `<tr><td colspan="6">${renderer.renderEntry({entries: [info.symbolImg]})}</td></tr>` : ""}
		${renderStack.length ? `<tr class="text"><td colspan="6">${renderStack.join("")}</td></tr>` : ""}
		${EntryRenderer.utils.getPageTr(info)}
		${EntryRenderer.utils.getBorderTr()}
	`);
}

function loadsub (sub) {
	filterBox.setFromSubHashes(sub);
	ListUtil.setFromSubHashes(sub);
}
