"use strict";

let activeWindowId = chrome.windows.WINDOW_ID_NONE;
let lastDuplicateTabs = {};
let closePopup = false;
let environment = "";
let currentPopupHeight = 600;

/* Show/Hide the AutoClose option */
const changeAutoCloseOptionState = (state, resize) => {
    $("#onRemainingTabGroup").toggleClass("hidden", state !== "A");
    if (resize) resizeDuplicateTabsPanel();
};

const toggleShrunkMode = (checked) => {
    $(".list-group-form").toggleClass("shrunk", checked);
};

const toggleExpendOptions = (resize) => {
    $("#optionHeader").toggleClass("collapsed");
    if (resize) resizeDuplicateTabsPanel();
};

const toggleExpendGroup = (eventId, isTitleClickEvent, pinned, resize) => {
    if (isTitleClickEvent) {
        const groupId = eventId.replace("Title", "Group");
        $(`#${groupId}`).toggleClass("collapsed");
        resizeDuplicateTabsPanel();
    }
    else {
        const groupId = eventId.replace("Pinned", "Group");
        $(".pinned").last().removeClass("last-list-group");
        $(`#${groupId}`).toggleClass("collapsed", !pinned).toggleClass("pinned", pinned);
        if (resize) resizeDuplicateTabsPanel();
        $(".pinned").last().addClass("last-list-group");
    }
};

const setDuplicateTabsTable = (duplicateTabs) => {
    if (areSameArrays(duplicateTabs, lastDuplicateTabs)) return;
    lastDuplicateTabs = duplicateTabs ? Array.from(duplicateTabs) : null;
    $("#duplicateTabsTableBody").empty();
    if (duplicateTabs) {
        let tableRows = "";
        duplicateTabs.forEach(duplicateTab => {
            const containerStyle = duplicateTab.containerColor ? `style='text-decoration:underline; text-decoration-color: ${duplicateTab.containerColor};'` : "";
            const title = (duplicateTab.windowId === activeWindowId) ? duplicateTab.title : `<em>${duplicateTab.title}</em>`;
            const tdTabIcon = `<td class='td-tab-icon'><img src='${duplicateTab.icon}' alt=''></td>`;
            const tdTabTitle = `<td class='td-tab-title' ${containerStyle}>${title}</td>`;
            const tdCloseButton = "<td class='td-close-button'><button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button></td>";
            tableRows += `<tr tabId='${duplicateTab.id}' windowId='${duplicateTab.windowId}'>${tdTabIcon}${tdTabTitle}${tdCloseButton}</tr>`;
        });
        $("#duplicateTabsTableBody").append(tableRows);
        $("#closeDuplicateTabsBtn").removeClass("disabled");
    }
    else {
        $("#duplicateTabsTableBody").append(`<td class='td-tab-text'>✓ ${chrome.i18n.getMessage("noDuplicateTabs")}</td>`);
        $("#closeDuplicateTabsBtn").addClass("disabled");
    }
    resizeDuplicateTabsPanel(true);
};

const resizeDuplicateTabsPanel = (refresh) => {
    const rowHeight = 26;
    const minRow = 2;
    const nbRows = lastDuplicateTabs ? lastDuplicateTabs.length : 1;
    
    // Calculate precise remaining space for rows based on dynamic height
    // Margin/Padding buffer is around 100px (header 40px, footer 40px, gaps 20px)
    let availableTableHeight = currentPopupHeight - $("#optionsCard").height() - 100;
    
    let calculatedMaxRows = Math.floor(availableTableHeight / rowHeight);
    if (calculatedMaxRows < minRow) calculatedMaxRows = minRow;
    
    const maxRows = Math.min(nbRows, calculatedMaxRows);

    $("#duplicateTabsTableContainer").toggleClass("table-scrollable-overflow", nbRows > maxRows);
    if (refresh && (nbRows > maxRows)) highlightBottomScrollShadow();
    
    // Give a slightly taller row for the empty state to prevent clipping
    const finalHeight = (!lastDuplicateTabs || lastDuplicateTabs.length === 0) ? 35 : maxRows * rowHeight;
    $("#duplicateTabsTableContainer").css("height", finalHeight);
};

const saveActiveWindowId = async () => {
    activeWindowId = await getActiveWindowId();
};

const requestCloseDuplicateTabs = () => sendMessage("closeDuplicateTabs", { "windowId": activeWindowId });

const saveOption = (name, value, refresh) => sendMessage("setStoredOption", { "name": name, "value": value, "refresh": refresh });

const requestGetDuplicateTabs = () => sendMessage("getDuplicateTabs", { "windowId": activeWindowId });

const applyPopupTheme = (accentColor, width, height) => {
    if (accentColor) {
        document.documentElement.style.setProperty('--accent-color', accentColor);
    }
    if (width) {
        document.body.style.width = width + "px";
    }
    if (height) {
        currentPopupHeight = height;
        document.body.style.minHeight = height + "px";
        document.documentElement.style.maxHeight = height + "px";
        
        // Ensure options body doesn't push the bottom card out of bounds
        // leaving space for top header (40px) and minimum bottom card (135px) + 5px margin
        const optionsBodyMaxHeight = height - 180;
        const style = document.createElement('style');
        style.innerHTML = `#optionsBody { max-height: ${optionsBodyMaxHeight}px !important; }`;
        document.head.appendChild(style);
    }
};

const setPanelOptions = async () => {
    const response = await sendMessage("getStoredOptions");
    const storedOptions = response.data.storedOptions;
    const lockedKeys = response.data.lockedKeys;
    let collapseOptions = true;
    let accentColor = null;
    let popupWidth = null;
    let popupHeight = null;
    for (const storedOption in storedOptions) {
        const value = storedOptions[storedOption].value;
        const isLockedKey = lockedKeys.includes(storedOption);
        if (storedOption === "environment") {
            environment = value;
            if (value === "chrome") $(".containerItem").toggleClass("hidden", true);
        }
        else if (storedOption === "popupAccentColor") {
            accentColor = value;
        }
        else if (storedOption === "popupWidth") {
            popupWidth = value;
        }
        else if (storedOption === "popupHeight") {
            popupHeight = value;
        }
        else {
            // checkbox
            if (typeof (value) === "boolean") {
                $(`#${storedOption}`).prop("checked", value);
                if (storedOption.endsWith("Pinned") && storedOption !== "customizationPinned") {
                    toggleExpendGroup(storedOption, false, value, false);
                    // eslint-disable-next-line max-depth
                    if (value) collapseOptions = false;
                }
                else if (storedOption === "shrunkMode") toggleShrunkMode(value);
                else if (storedOption === "closePopup") closePopup = value;
            }
            // color value
            else if (typeof (value) === "string" && value.startsWith("#")) {
                $(`#${storedOption}`).prop("value", value);
            }
            // textarea
            else if (storedOption === "whiteList") {
                $(`#${storedOption}`).val(value);
            }
            // combobox
            else if (typeof (value) === "string") {
                $(`#${storedOption} option[value='${value}']`).prop("selected", true);
                if (storedOption === "onDuplicateTabDetected") changeAutoCloseOptionState(value, false);
            }
            if (isLockedKey) $(`#${storedOption}`).prop("disabled", true);
        }
    }
    applyPopupTheme(accentColor, popupWidth, popupHeight);
    if (collapseOptions) toggleExpendOptions(false);
};

const handleMessage = (message) => {
    if (message.action === "updateDuplicateTabsTable") setDuplicateTabsTable(message.data.duplicateTabs);
};

chrome.runtime.onMessage.addListener(handleMessage);

let highlightBottomScrollShadowTimer = null;
const highlightBottomScrollShadow = () => {
    clearTimeout(highlightBottomScrollShadowTimer);
    $("#duplicateTabsTableContainer").toggleClass("table-scrollable-shadow", true);
    highlightBottomScrollShadowTimer = setTimeout(() => $("#duplicateTabsTableContainer").toggleClass("table-scrollable-shadow", false), 400);
};

// eslint-disable-next-line max-lines-per-function
const loadListenerEvents = () => {

    /* Save checkbox settings */
    $("input[type='checkbox'").on("change", function () {
        if (this.id.endsWith("Pinned")) toggleExpendGroup(this.id, false, this.checked, true);
        else if (this.id === "shrunkMode") toggleShrunkMode(this.checked);
        const refresh = this.className.includes("checkbox-filter");
        saveOption(this.id, this.checked, refresh);
    });

    // Helper to clean whitelist
    const cleanUpWhiteList = (whiteList) => {
        const whiteListCleaned = new Set();
        const whiteListLines = whiteList.split(/[\n,]/);
        for (let whiteListLine of whiteListLines) {
            whiteListLine = whiteListLine.trim();
            if (whiteListLine.length !== 0) whiteListCleaned.add(whiteListLine);
        }
        return Array.from(whiteListCleaned).join("\n");
    };

    /* Save textarea settings */
    $("textarea").on("change", function () {
        let val = $(this).val();
        if (this.id === "whiteList") {
            val = cleanUpWhiteList(val);
            $(this).val(val);
        }
        saveOption(this.id, val, false);
    });

    /* Save combobox settings */
    $(".list-group select").on("change", function (event) {
        event.stopPropagation();
        const refresh = this.id === "scope";
        saveOption(this.id, this.value, refresh);
        if (this.id === "onDuplicateTabDetected") changeAutoCloseOptionState(this.value, true);
    });

    /* Open Option tab */
    $(".fa-cog").on("click", (event) => {
        event.stopPropagation();
        chrome.runtime.openOptionsPage();
    });

    /* Active selected tab */
    $("#duplicateTabsTable").on("click", ".td-tab-title", function () {
        const tabId = parseInt($(this).parent().attr("tabId"), 10);
        const windowId = parseInt($(this).parent().attr("windowId"), 10);
        focusTab(tabId, windowId);
    });

    /* Close selected tab */
    $("#duplicateTabsTable").on("click", ".td-close-button", function () {
        const tabId = parseInt($(this).parent().attr("tabId"), 10);
        removeTab(tabId);
    });

    /* Close all */
    $("#closeDuplicateTabsBtn").on("click", function () {
        if (!$(this).hasClass("disabled")) requestCloseDuplicateTabs();
        if (closePopup) window.close();
    });

    /* Toggle options panel */
    $("#optionsTitle").on("click", () => {
        toggleExpendOptions(true);
    });

    /* Toggle subitem panels */
    $(".list-group-item-title").on("click", function () {
        toggleExpendGroup(this.id, true);
    });

};

const localizePopup = () => {
    const node = document.documentElement;
    const attribute = "i18n-content";
    const elements = node.querySelectorAll(`[${attribute}]`);
    elements.forEach(element => {
        const value = element.getAttribute(attribute);
        element.textContent = chrome.i18n.getMessage(value);
    });

    const tooltipAttribute = "Title";
    const tooltipElements = node.querySelectorAll(`[${tooltipAttribute}]`);
    tooltipElements.forEach(tooltipElement => {
        const value = tooltipElement.getAttribute(tooltipAttribute);
        tooltipElement.setAttribute(tooltipAttribute, chrome.i18n.getMessage(value));
    });
};

const startObserver = () => {
    const firefoxOverflowClass = "list-group-item-overflow-firefox";
    const chromeOverflowClass = "list-group-item-overflow-chrome";
    const overflowClass = environment == "firefox" ? firefoxOverflowClass : chromeOverflowClass;
        const observer = new ResizeObserver(entries => {
            for (const entry of entries) {
                const overflow = `${entry.contentRect.bottom + 1}px` === $("#optionsBody").css("max-height");
                $("#optionsBody").toggleClass(overflowClass, overflow);
            }
        });
    const optionsBody = document.querySelector("#optionsBody");
    observer.observe(optionsBody);
};

const setVersion = () => {
    try {
        const manifest = chrome.runtime.getManifest();
        if (manifest && manifest.version) {
            document.getElementById("appVersion").textContent = "v" + manifest.version;
        }
    } catch (e) {}
};

const initialize = async () => {
    await Promise.all([setPanelOptions(), saveActiveWindowId()]);
    requestGetDuplicateTabs();
    localizePopup();
    setVersion();
    startObserver();
    loadListenerEvents();
};


document.addEventListener("DOMContentLoaded", initialize);