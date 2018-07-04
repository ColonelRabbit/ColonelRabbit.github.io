"use strict";

const JSON_URL = "data/deities.json";

window.onload = function load () {
	DataUtil.loadJSON(JSON_URL, onJsonLoad);
};

let list;
const sourceFilter = getSourceFilter();
const categoryFilter = new Filter({
	header: "Category",
	items: [
		STR_NONE,
	]
});
let filterBox;
function onJsonLoad (data) {
	list = ListUtil.search({
		valueNames: ["name", "category", "alignment", "domains", "symbol", "source"],
		listClass: "deities",
		sortFunction: SortUtil.listSort
	});

	const alignmentFilter = new Filter({
		header: "Alignment",
		items: ["C", "E", "G", "L", "N"],
		displayFn: Parser.alignmentAbvToFull
	});
	const domainFilter = new Filter({
		header: "Domain",
		items: ["Arcana", "Death", "Forge", "Grave", "Knowledge", "Life", "Light", "Nature", STR_NONE, "Tempest", "Trickery", "War"]
	});

	filterBox = initFilterBox(sourceFilter, alignmentFilter, categoryFilter, domainFilter);

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
		valueNames: ["name", "category", "alignment", "domains", "id"],
		listClass: "subdeities",
		getSublistRow: getSublistItem
	});
	ListUtil.initGenericPinnable();

	addDeities(data);
	BrewUtil.addBrewData(addDeities);
	BrewUtil.makeBrewButton("manage-brew");
	BrewUtil.bind({list, filterBox, sourceFilter});

	History.init();
	handleFilterChange();
	RollerUtil.addListRollButton();
	addListShowHide();
}

let deitiesList = [];
let dtI = 0;
function addDeities (data) {
	if (!data.deity || !data.deity.length) return;

	deitiesList = deitiesList.concat(data.deity);

	let tempString = "";
	for (; dtI < deitiesList.length; dtI++) {
		const g = deitiesList[dtI];
		const abvSource = Parser.sourceJsonToAbv(g.source);

		g.alignment.sort(SortUtil.alignmentSort);
		if (!g.category) g.category = STR_NONE;
		if (!g.domains) g.domains = [STR_NONE];
		g.domains.sort(SortUtil.ascSort);

		tempString += `
			<li class="row" ${FLTR_ID}="${dtI}" onclick="ListUtil.toggleSelected(event, this)" oncontextmenu="ListUtil.openContextMenu(event, this)">
				<a id="${dtI}" href="#${UrlUtil.autoEncodeHash(g)}" title="${g.name}">
					<span class="name col-xs-3">${g.name}</span>
					<span class="category col-xs-2 text-align-center">${g.category}</span>
					<span class="alignment col-xs-2 text-align-center">${g.alignment.join("")}</span>
					<span class="domains col-xs-3 ${g.domains[0] === STR_NONE ? `list-entry-none` : ""}">${g.domains.join(", ")}</span>
					<span class="source col-xs-2 source${abvSource}" title="${Parser.sourceJsonToFull(g.source)}">${abvSource}</span>
				</a>
			</li>
		`;

		sourceFilter.addIfAbsent(g.source);
		categoryFilter.addIfAbsent(g.category);
	}
	const lastSearch = ListUtil.getSearchTermAndReset(list);
	$(`#deitiesList`).append(tempString);
	// sort filters
	sourceFilter.items.sort(SortUtil.ascSort);
	categoryFilter.items.sort();

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
			g.alignment,
			g.category,
			g.domains
		);
	});
	FilterBox.nextIfHidden(deitiesList);
}

function getSublistItem (g, pinId) {
	return `
		<li class="row" ${FLTR_ID}="${pinId}" oncontextmenu="ListUtil.openSubContextMenu(event, this)">
			<a href="#${UrlUtil.autoEncodeHash(g)}" title="${g.name}">
				<span class="name col-xs-4">${g.name}</span>
				<span class="category col-xs-2">${g.category}</span>
				<span class="alignment col-xs-2">${g.alignment.join("")}</span>
				<span class="domains col-xs-4 ${g.domains[0] === STR_NONE ? `list-entry-none` : ""}">${g.domains.join(", ")}</span>
				<span class="id hidden">${pinId}</span>
			</a>
		</li>
	`;
}

const renderer = new EntryRenderer();
function loadhash (jsonIndex) {
	const deity = deitiesList[jsonIndex];

	const renderStack = [];
	if (deity.entries) renderer.recursiveEntryRender({entries: deity.entries}, renderStack);

	const $content = $(`#pagecontent`);
	$content.html(`
		${EntryRenderer.utils.getBorderTr()}
		${EntryRenderer.utils.getNameTr(deity, false, "", `, ${deity.title.toTitleCase()}`)}
		${deity.category ? `<tr><td colspan="6"><span class="bold">Category: </span>${deity.category}</td></tr>` : ""}
		<tr><td colspan="6"><span class="bold">Alignment: </span>${deity.alignment.map(a => Parser.alignmentAbvToFull(a)).join(" ")}</td></tr>
		<tr><td colspan="6"><span class="bold">Domains: </span>${deity.domains.join(", ")}</td></tr>
		${deity.altNames ? `<tr><td colspan="6"><span class="bold">Alternate Names: </span>${deity.altNames.join(", ")}</td></tr>` : ""}
		<tr><td colspan="6"><span class="bold">Symbol: </span>${deity.symbol}</td></tr>
		${deity.symbolImg ? `<tr><td colspan="6">${renderer.renderEntry({entries: [deity.symbolImg]})}</td></tr>` : ""}
		${renderStack.length ? `<tr class="text"><td colspan="6">${renderStack.join("")}</td></tr>` : ""}
		${EntryRenderer.utils.getPageTr(deity)}
		${EntryRenderer.utils.getBorderTr()}
	`);
}

function loadsub (sub) {
	filterBox.setFromSubHashes(sub);
	ListUtil.setFromSubHashes(sub);
}
