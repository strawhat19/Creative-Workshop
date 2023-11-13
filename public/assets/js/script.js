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

const testBoardID = `CoKhGhy5`;
const cardsNum = document.querySelector(`.cardsNum`);
const trelloAPIKey = `9c38cf9f33ed47f5b4023cf0abaa7bb0`;
const lastUpdated = document.querySelector(`.lastUpdated`);
const nextUpdateIn = document.querySelector(`.nextUpdateIn`);
const trelloForm = document.querySelector(`.trelloTicketForm`);
const cardsContainer = document.querySelector(`.cardsContainer`);
const trelloTicketTitleField = document.querySelector(`.trelloTicketTitleField`);
const trelloAPISecret = `ab406d5ee169689f283c6c45594de45a4d3091f6f13e2d6f6098adf325c1a9e9`;
const trelloAPIToken = `ATTA66b1ce6ba14d4eceb263827501181da8062d575eafa5510d055c2c246f56eede75D5CE72`;

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

const setCardsData = (cards) => {
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

            if (statusLevel <= 1) {
                status = `todo`;
            } else if (statusLevel > 1 && statusLevel < 3) {
                status = `inProgress`;
            } else {
                status = `done`;
            }

            cardElement.classList.add(`card`, `cardElement`);
            cardElement.id = `card-${cardsIndex}-${card?.id}`;

            cardTitle.classList.add(`cardTitle`, `flex`, `spaceBetween`);
            cardLeft.classList.add(`cardLeft`);
            cardRight.classList.add(`cardRight`);

            cardLeft.innerHTML = `${cardsIndex}) ${card?.name}`;
            cardStatus.classList.add(`status`, status, `ttc`, `p15x`, `borderRadius`);
            cardStatus.innerHTML = card?.status;

            cardContent.classList.add(`cardContent`, `p15nb`);
            cardContent.append(card?.description);

            cardRight.append(cardStatus);
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
    }
}

const getBoard = async (boardID) => {
    let batchBoardData = await getTrelloBatchAPI(boardID);
    let trelloBoard = batchBoardData[0][200];
    let trelloLists = batchBoardData[1][200];
    let trelloCards = batchBoardData[2][200];

    let board = {
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
            position: lst?.pos,
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

    lastUpdated.innerHTML = dayjs().tz(defaultTimezone).format(timeFormat);
    console.log(`Board`, board);

    if (cards.length > 0) setCardsData(cards);
}

getBoard(testBoardID);
setInterval(() => {
    if (parseInt(nextUpdateIn.innerHTML) <= 0) {
        nextUpdateIn.innerHTML = 25;
        getBoard(testBoardID);
    } else {
        nextUpdateIn.innerHTML = parseInt(nextUpdateIn.innerHTML) - 1;
    }
}, 1000);

trelloForm.addEventListener(`submit`, (trelloFormSubmitEvent) => {
    trelloFormSubmitEvent.preventDefault();

    let ticketTitle = trelloTicketTitleField?.value;
    console.log(`Trello API Testing`);
    console.log(`Ticket Title`, ticketTitle);
});

const copyrightYear = document.querySelector(`.year`);
const copyrightYearValue = new Date().getFullYear();
copyrightYear.innerHTML = copyrightYearValue;