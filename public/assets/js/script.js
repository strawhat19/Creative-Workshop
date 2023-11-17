let board;
dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);

let timezones = {
    america_US_NewYork: `America/New_York`,
    asia_Taiwan_Taipei: `Asia/Taipei`,
    asia_Japan_Tokyo: `Asia/Tokyo`,
}

let browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
let defaultTimezone = browserTimezone || timezones.america_US_NewYork;

let dayFormat = `dddd`;
let timeFormat = `h:mm:ss A`;
let dateFormat = `MM/DD/YYYY`;
let fullDateTimeFormat = `${timeFormat}, ${dayFormat}, ${dateFormat}`;

let deleteCardButtons = document.querySelectorAll(`.cardDeleteButton`);

const testBoardID = `CoKhGhy5`;
const creativeWorkshopBoardID = `vHDa20Za`;
const boardToShowID = creativeWorkshopBoardID;
const cardsNum = document.querySelector(`.cardsNum`);
const trelloAPIKey = `9c38cf9f33ed47f5b4023cf0abaa7bb0`;
const lastUpdated = document.querySelector(`.lastUpdated`);
const nextUpdateIn = document.querySelector(`.nextUpdateIn`);
const trelloForm = document.querySelector(`.trelloTicketForm`);
const cardsContainer = document.querySelector(`.cardsContainer`);
const refreshBoardButton = document.querySelector(`.refreshBoardButton`);
const trelloTicketTitleField = document.querySelector(`.trelloTicketTitleField`);
const trelloTicketAttachmentField = document.querySelector(`.trelloTicketAttachmentField`);
const trelloAPISecret = `ab406d5ee169689f283c6c45594de45a4d3091f6f13e2d6f6098adf325c1a9e9`;
const trelloTicketDescriptionField = document.querySelector(`.trelloTicketDescriptionField`);
const trelloAPIToken = `ATTA66b1ce6ba14d4eceb263827501181da8062d575eafa5510d055c2c246f56eede75D5CE72`;

const getPercentage = (percent, number) => (percent / 100) * number;

const getTrelloBatchAPI = async (boardID) => {
    try {
        const trelloBatchResponse = await fetch(`https://api.trello.com/1/batch?urls=/boards/${boardID},/boards/${boardID}/lists,/boards/${boardID}/cards/all&key=${trelloAPIKey}&token=${trelloAPIToken}`);
        if (!trelloBatchResponse.ok) console.log(`HTTP error! status: ${trelloBatchResponse.status}`);
        const boardsBatchData = await trelloBatchResponse.json();
        return boardsBatchData;
    } catch (error) {
        console.log(`Error getting batch trello data`, error);
    }
}

const deleteTrelloCard = async (cardID) => {
    try {
        const deleteTrelloCardResponse = await fetch(`https://api.trello.com/1/cards/${cardID}?key=${trelloAPIKey}&token=${trelloAPIToken}`, {
            method: `DELETE`
        });
        if (!deleteTrelloCardResponse.ok) console.log(`HTTP error! status: ${deleteTrelloCardResponse.status}`);
        const deletedTrelloCardData = await deleteTrelloCardResponse.json();
        refreshBoard(boardToShowID);
        return deletedTrelloCardData;
    } catch (error) {
        console.log(`Error getting batch trello data`, error);
    }
}

const addAttachmentToCard = async (cardID, attachmentURL) => {
    try {
        const attachURL = `https://api.trello.com/1/cards/${cardID}/attachments?key=${trelloAPIKey}&token=${trelloAPIToken}&url=${encodeURIComponent(attachmentURL)}`;
        const response = await fetch(attachURL, {
            method: `POST`,
            headers: {
                Accept: `application/json`
            },
        });
        if (!response.ok) {
            console.log(`HTTP error! status: ${response.status}`);
            return;
        }
        const attachmentData = await response.json();
        return attachmentData?.id;
    } catch (error) {
        console.log(`Error adding attachment to Trello card`, error);
    }
}

const setCardCover = async (cardID, attachmentID) => {
    try {
        const coverUrl = `https://api.trello.com/1/cards/${cardID}?key=${trelloAPIKey}&token=${trelloAPIToken}&idAttachmentCover=${attachmentID}`;
        const response = await fetch(coverUrl, {
            method: `PUT`,
            headers: {
                Accept: `application/json`
            },
        });
        if (!response.ok) {
            console.log(`HTTP error! status: ${response.status}`);
        } else {
            refreshBoard(boardToShowID);
        }
    } catch (error) {
        console.log(`Error setting card cover`, error);
    }
}

const createTrelloCard = async (name, description, attachmentURL, listID) => {
    try {
        let noURLSource = `https://api.trello.com/1/cards?name=${encodeURIComponent(name)}&desc=${encodeURIComponent(description)}&idList=${listID}&key=${trelloAPIKey}&token=${trelloAPIToken}`;
        const createTrelloCardResponse = await fetch(noURLSource, {
            method: `POST`,
            headers: {
                Accept: `application/json`
            },
        });
        if (!createTrelloCardResponse.ok) console.log(`HTTP error! status: ${createTrelloCardResponse.status}`);
        const createdTrelloCard = await createTrelloCardResponse.json();
        if (attachmentURL) {
            const attachmentID = await addAttachmentToCard(createdTrelloCard.id, attachmentURL);
            if (attachmentID) await setCardCover(createdTrelloCard.id, attachmentID);
        } else {
            refreshBoard(boardToShowID);
        };
        return createdTrelloCard;
    } catch (error) {
        console.log(`Error getting batch trello data`, error);
    }
}

const setBoardsData = (board) => {
    let { lists, cards } = board;
    if (cards.length > 0) {
        cardsContainer.innerHTML = ``;
        cardsNum.innerHTML = `(${cards.length})`;
        cards.forEach((card, cardIndex) => {
            let status;
            let cardsIndex = cardIndex + 1;
            let statusLevel = card?.statusLevel;
            let cardCover = document.createElement(`div`);
            let cardCoverImage = document.createElement(`img`);
            let cardTitle = document.createElement(`div`);
            let cardContent = document.createElement(`div`);
            let cardStatus = document.createElement(`div`);
            let cardElement = document.createElement(`div`);
            let cardLeft = document.createElement(`div`);
            let cardRight = document.createElement(`div`);
            let cardDeleteButton = document.createElement(`button`);

            let firstStatusTier = getPercentage(25, lists.length);
            let secondStatusTier = getPercentage(50, lists.length);
            if (statusLevel <= firstStatusTier) {
                status = `todo`;
            } else if (statusLevel > firstStatusTier && statusLevel < secondStatusTier) {
                status = `inProgress`;
            } else {
                status = `done`;
            }

            cardElement.classList.add(`card`, `cardElement`);
            cardElement.id = `card-${cardsIndex}-${card?.id}`;

            cardTitle.classList.add(`cardTitle`, `flex`, `spaceBetween`);
            cardLeft.classList.add(`cardLeft`, `textOverflow`);
            cardRight.classList.add(`cardRight`, `flex`, `gap10`, `alignCenter`, `justifyEnd`);

            cardLeft.innerHTML = `${cardsIndex}) ${card?.name}`;
            cardStatus.classList.add(`status`, status, `ttc`, `p15x`, `h100`, `flex`, `alignCenter`, `borderRadius`, `textOverflow`);
            cardStatus.innerHTML = card?.status;

            cardContent.classList.add(`cardContent`, `p15nb`);
            cardContent.append(card?.description);
            
            cardDeleteButton.id = `delete-card-${cardsIndex}-${card?.id}`;
            cardDeleteButton.classList.add(`cardDeleteButton`, `invertOnHover`, `p5`);
            cardDeleteButton.innerHTML = `<i class="fas fa-trash-alt"></i>`;
            cardDeleteButton.addEventListener(`click`, deleteButtonClickEvent => {
                let cardToDeleteID = cardDeleteButton?.id?.split(`-`).pop();
                deleteTrelloCard(cardToDeleteID);
            })

            cardRight.append(cardStatus);
            cardRight.append(cardDeleteButton);
            cardTitle.append(cardLeft);
            cardTitle.append(cardRight);

            cardCover.classList.add(`cardCover`, `flex`, `p15nb`, `justifyCenter`, `alignCenter`);
            
            if (card?.cover) {
                cardCoverImage.src = card?.cover;
                cardCoverImage.alt = `Card Cover Image`;
                cardCoverImage.classList.add(`cardCoverImage`);
                cardCover.append(cardCoverImage);
            }

            cardElement.append(cardTitle);
            if (card?.description != ``) cardElement.append(cardContent);
            if (card?.cover) cardElement.append(cardCover);

            cardsContainer.append(cardElement);
        })
    } else {
        cardsContainer.innerHTML = `No Card(s) Yet...`;
    }
}

const refreshBoard = async (boardID) => {
    let batchBoardData = await getTrelloBatchAPI(boardID);
    let trelloBoard = batchBoardData[0][200];
    let trelloLists = batchBoardData[1][200];
    let trelloCards = batchBoardData[2][200];

    board = {
        id: trelloBoard?.id,
        name: trelloBoard?.name,
        url: trelloBoard?.shortUrl,
        description: trelloBoard?.desc,
        organization: trelloBoard?.idOrganization,
    }

    let lists = trelloLists.map((lst, lstIndex) => {
        return {
            id: lst?.id,
            name: lst?.name,
            position: lstIndex + 1,
        }
    })

    let cards = trelloCards.map((crd, crdIndex) => {
        let list = lists.find(ls => ls.id == crd?.idList);
        let status = list?.name;
        let statusLevel = list?.position;
        return {
            status,
            statusLevel,
            id: crd?.id,
            name: crd?.name,
            url: crd?.shortUrl,
            position: crd?.pos,
            labels: crd?.labels,
            description: crd?.desc,
            ...(crd?.cover?.idAttachment != null && {
                cover: `https://trello.com/1/cards/${crd?.id}/attachments/${crd?.cover?.idAttachment}/download/`,
            })
        }
    });

    board = {
        ...board,
        lists,
        cards,
    }

    nextUpdateIn.innerHTML = 25;
    lastUpdated.innerHTML = dayjs().tz(defaultTimezone).format(timeFormat);
    console.log(`Updated Board`, board);

    setBoardsData(board);
}

refreshBoard(boardToShowID);
setInterval(() => {
    if (parseInt(nextUpdateIn.innerHTML) <= 0) {
        refreshBoard(boardToShowID);
    } else {
        nextUpdateIn.innerHTML = parseInt(nextUpdateIn.innerHTML) - 1;
    }
}, 1000);

refreshBoardButton.addEventListener(`click`, (refreshBoardButtonClickEvent) => {
    refreshBoard(boardToShowID);
})

trelloForm.addEventListener(`submit`, (trelloFormSubmitEvent) => {
    trelloFormSubmitEvent.preventDefault();
    let ticketTitle = trelloTicketTitleField?.value;
    let ticketDescription = trelloTicketDescriptionField?.value;
    let ticketAttachment = trelloTicketAttachmentField?.value;
    createTrelloCard(ticketTitle, ticketDescription, ticketAttachment, board?.lists[0]?.id);
    trelloForm.reset();
});

const copyrightYear = document.querySelector(`.year`);
const copyrightYearValue = new Date().getFullYear();
copyrightYear.innerHTML = copyrightYearValue;