const testBoardID = `CoKhGhy5`;
const trelloAPIKey = `9c38cf9f33ed47f5b4023cf0abaa7bb0`;
const trelloForm = document.querySelector(`.trelloTicketForm`);
const cardsContainer = document.querySelector(`.cardsContainer`);
const trelloTicketTitleField = document.querySelector(`.trelloTicketTitleField`);
const trelloAPISecret = `ab406d5ee169689f283c6c45594de45a4d3091f6f13e2d6f6098adf325c1a9e9`;
const trelloAPIToken = `ATTA66b1ce6ba14d4eceb263827501181da8062d575eafa5510d055c2c246f56eede75D5CE72`;

const getTrelloBoard = async (boardID) => {
    try {
        const trelloBoardResponse = await fetch(`https://api.trello.com/1/boards/${boardID}?key=${trelloAPIKey}&token=${trelloAPIToken}`);
        if (!trelloBoardResponse.ok) console.log(`HTTP error! status: ${trelloBoardResponse.status}`);
        const boardData = await trelloBoardResponse.json();
        return boardData;
    } catch (error) {
        console.log(`Error fetching Board data: `, error);
    }
}

const getTrelloBoardsLists = async (boardID) => {
    try {
        const trelloBoardsListResponse = await fetch(`https://api.trello.com/1/boards/${boardID}/lists?key=${trelloAPIKey}&token=${trelloAPIToken}`);
        if (!trelloBoardsListResponse.ok) console.log(`HTTP error! status: ${trelloBoardsListResponse.status}`);
        const boardsListsData = await trelloBoardsListResponse.json();
        return boardsListsData;
    } catch (error) {
        console.log(`Error fetching Board Lists data: `, error);
    }
}

const getTrelloCardsInBoard = async (boardID) => {
    try {
        const trelloCardsInBoardResponse = await fetch(`https://api.trello.com/1/boards/${boardID}/cards/all?key=${trelloAPIKey}&token=${trelloAPIToken}`);
        if (!trelloCardsInBoardResponse.ok) console.log(`HTTP error! status: ${trelloCardsInBoardResponse.status}`);
        const boardCardsData = await trelloCardsInBoardResponse.json();
        return boardCardsData;
    } catch (error) {
        console.log(`Error fetching Board Cards data: `, error);
    }
}

const setCardsData = (cards) => {
    if (cards.length > 0) {
        cardsContainer.innerHTML = ``;
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
    let trelloBoard = await getTrelloBoard(boardID);
    let trelloLists = await getTrelloBoardsLists(boardID);
    let trelloCards = await getTrelloCardsInBoard(boardID);

    // let boardData = {
    //     trelloBoard,
    //     trelloLists,
    //     trelloCards
    // }

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

    if (cards.length > 0) setCardsData(cards);

    console.log(`Board`, board);
}

getBoard(testBoardID);

trelloForm.addEventListener(`submit`, (trelloFormSubmitEvent) => {
    trelloFormSubmitEvent.preventDefault();

    let ticketTitle = trelloTicketTitleField?.value;
    console.log(`Trello API Testing`);
    console.log(`Ticket Title`, ticketTitle);
});

const copyrightYear = document.querySelector(`.year`);
const copyrightYearValue = new Date().getFullYear();
copyrightYear.innerHTML = copyrightYearValue;