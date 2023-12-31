let board;
let dayFormat = `dddd`;
let timeFormat = `h:mm:ss A`;
let dateFormat = `MM/DD/YYYY`;
dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);
let browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
let defaultTimezone = browserTimezone || `America/New_York`;
let fullDateTimeFormat = `${timeFormat}, ${dayFormat}, ${dateFormat}`;
let deleteCardButtons = document.querySelectorAll(`.cardDeleteButton`);

const testBoardID = `CoKhGhy5`;
const creativeWorkshopBoardID = `vHDa20Za`;
const boardToShowID = creativeWorkshopBoardID;
const creativeWorkshopOrderTypeFormID = `eoAJiOwq`;
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
const creativeWorkshopOrderTypeFormToken = `tfp_DoXWJw6CyKQSeBhQUvpZJ2WTLhzLaYJFXxpVyvjeZgVF_e4s9Btb98fZ6`;
const paperclipIcon = `<svg title="Attachments" width="24" height="24" role="presentation" focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.6426 17.9647C10.1123 19.46 7.62736 19.4606 6.10092 17.9691C4.57505 16.478 4.57769 14.0467 6.10253 12.5566L13.2505 5.57184C14.1476 4.6952 15.5861 4.69251 16.4832 5.56921C17.3763 6.44184 17.3778 7.85135 16.4869 8.72199L9.78361 15.2722C9.53288 15.5172 9.12807 15.5163 8.86954 15.2636C8.61073 15.0107 8.60963 14.6158 8.86954 14.3618L15.0989 8.27463C15.4812 7.90109 15.4812 7.29546 15.0989 6.92192C14.7167 6.54838 14.0969 6.54838 13.7146 6.92192L7.48523 13.0091C6.45911 14.0118 6.46356 15.618 7.48523 16.6163C8.50674 17.6145 10.1511 17.6186 11.1679 16.6249L17.8712 10.0747C19.5274 8.45632 19.5244 5.83555 17.8676 4.2165C16.2047 2.59156 13.5266 2.59657 11.8662 4.21913L4.71822 11.2039C2.42951 13.4404 2.42555 17.083 4.71661 19.3218C7.00774 21.5606 10.7323 21.5597 13.0269 19.3174L19.7133 12.7837C20.0956 12.4101 20.0956 11.8045 19.7133 11.431C19.331 11.0574 18.7113 11.0574 18.329 11.431L11.6426 17.9647Z" fill="#9fadbc"></path></svg>`;
const commentsIcon = `<svg title="Comments" width="24" height="24" role="presentation" focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M16 17H12.5L8.28037 20.4014C6.97772 21.4869 5 20.5606 5 18.865V16.1973C3.2066 15.1599 2 13.2208 2 11C2 7.68629 4.68629 5 8 5H16C19.3137 5 22 7.68629 22 11C22 14.3137 19.3137 17 16 17ZM16 7H8C5.79086 7 4 8.79086 4 11C4 12.8638 5.27477 14.4299 7 14.874V19L12 15H16C18.2091 15 20 13.2091 20 11C20 8.79086 18.2091 7 16 7Z" fill="#9fadbc"></path></svg>`;

const getPercentage = (percent, number) => (percent / 100) * number;

const getTypeformResponses = async (formID) => {
    try {
        const getTypeformResponsesRes = await fetch(`https://api.typeform.com/forms/${formID}/responses?page_size=1000`, {
            headers: {
                Authorization: `Bearer ${creativeWorkshopOrderTypeFormToken}`
            }
        });
        if (!getTypeformResponsesRes.ok) console.log(`Error Getting Typeform Responses`, getTypeformResponsesRes.status);
        const typeFormResponsesData = await getTypeformResponsesRes.json();
        return typeFormResponsesData;
    } catch (error) {
        console.log(`Error Getting Typeform Responses`, error);
    }
}

const getTrelloBatchAPI = async (boardID) => {
    try {
        const trelloBatchResponse = await fetch(`https://api.trello.com/1/batch?urls=/boards/${boardID},/boards/${boardID}/lists,/boards/${boardID}/cards/all&key=${trelloAPIKey}&token=${trelloAPIToken}`);
        if (!trelloBatchResponse.ok) console.log(`Error Getting Batch Trello Data for Board`, trelloBatchResponse.status);
        const boardsBatchData = await trelloBatchResponse.json();
        return boardsBatchData;
    } catch (error) {
        console.log(`Error Getting Batch Trello Data for Board`, error);
    }
}

const deleteTrelloCard = async (cardID) => {
    try {
        const deleteTrelloCardResponse = await fetch(`https://api.trello.com/1/cards/${cardID}?key=${trelloAPIKey}&token=${trelloAPIToken}`, {
            method: `DELETE`
        });
        if (!deleteTrelloCardResponse.ok) console.log(`Error Deleting Trello Card`, deleteTrelloCardResponse.status);
        const deletedTrelloCardData = await deleteTrelloCardResponse.json();
        refreshBoard(boardToShowID);
        return deletedTrelloCardData;
    } catch (error) {
        console.log(`Error Deleting Trello Card`, error);
    }
}

const addAttachmentToCard = async (cardID, attachmentURL) => {
    try {
        const addAttachmentToCardURL = `https://api.trello.com/1/cards/${cardID}/attachments?key=${trelloAPIKey}&token=${trelloAPIToken}&url=${encodeURIComponent(attachmentURL)}`;
        const addAttachmentToCardResponse = await fetch(addAttachmentToCardURL, {
            method: `POST`,
            headers: {
                Accept: `application/json`
            },
        });
        if (!addAttachmentToCardResponse.ok) {
            console.log(`Error Adding Attachment to Trello Card`, addAttachmentToCardResponse.status);
            return;
        }
        const attachmentData = await addAttachmentToCardResponse.json();
        return attachmentData?.id;
    } catch (error) {
        console.log(`Error Adding Attachment to Trello Card`, error);
    }
}

const setCardCover = async (cardID, attachmentID) => {
    try {
        const setCardCoverURL = `https://api.trello.com/1/cards/${cardID}?key=${trelloAPIKey}&token=${trelloAPIToken}&idAttachmentCover=${attachmentID}`;
        const setCardCoverResponse = await fetch(setCardCoverURL, {
            method: `PUT`,
            headers: {
                Accept: `application/json`
            },
        });
        if (!setCardCoverResponse.ok) {
            console.log(`Error Setting Card Cover`, setCardCoverResponse.status);
        } else {
            refreshBoard(boardToShowID);
        }
    } catch (error) {
        console.log(`Error Setting Card Cover`, error);
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
        if (!createTrelloCardResponse.ok) console.log(`Create Trello Card Error`, createTrelloCardResponse.status);
        const createdTrelloCard = await createTrelloCardResponse.json();
        if (attachmentURL) {
            const attachmentID = await addAttachmentToCard(createdTrelloCard.id, attachmentURL);
            if (attachmentID) await setCardCover(createdTrelloCard.id, attachmentID);
        } else {
            refreshBoard(boardToShowID);
        };
        return createdTrelloCard;
    } catch (error) {
        console.log(`Error Getting Batch Trello Data`, error);
    }
}

const setBoardsData = (board) => {
    let { lists, cards } = board;
    if (cards.length > 0) {
        cardsContainer.innerHTML = ``;
        cardsNum.innerHTML = `(${cards.length})`;
        cards.forEach((card, cardIndex) => {
            let status;
            let orderIndex = cardIndex + 1;
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
            let cardFooter = document.createElement(`div`);
            let footerLeft = document.createElement(`div`);
            let footerRight = document.createElement(`div`);
            let labelsElement = document.createElement(`div`);

            let firstStatusTier = getPercentage(25, lists.length);
            let secondStatusTier = getPercentage(50, lists.length);
            if (statusLevel <= firstStatusTier) {
                status = `todo`;
            } else if (statusLevel > firstStatusTier && statusLevel < secondStatusTier) {
                status = `inProgress`;
            } else {
                status = `done`;
            }

            let orderTitleAndStatus = `${card?.name} - ${card?.status}`;
            cardElement.classList.add(`card`, `cardElement`, `relative`);
            cardElement.id = `card-${orderIndex}-${card?.id}`;

            cardTitle.classList.add(`cardTitle`, `flex`, `spaceBetween`, `gap5`);
            cardTitle.title = orderTitleAndStatus;
            cardLeft.classList.add(`cardLeft`, `textOverflow`);
            cardRight.classList.add(`cardRight`, `flex`, `gap10`, `alignCenter`, `justifyEnd`);

            cardLeft.innerHTML = `${orderIndex}) ${card?.name}`;
            cardStatus.classList.add(`status`, status, `ttc`, `p15x`, `h100`, `flex`, `alignCenter`, `borderRadius`, `textOverflow`);
            cardStatus.innerHTML = card?.status;

            cardContent.classList.add(`cardContent`, `p15nb`);
            cardContent.innerHTML = card?.description?.replace(/\n/g, `<br>`);
            
            cardDeleteButton.id = `delete-card-${orderIndex}-${card?.id}`;
            cardDeleteButton.classList.add(`cardDeleteButton`, `invertOnHover`, `p5`);
            cardDeleteButton.title = `Delete Order #${orderIndex} ${orderTitleAndStatus}`;
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

            cardFooter.classList.add(`cardFooter`, `absolute`, `flex`, `spaceBetween`, `gap5`, `alignCenter`, `w100`);
            footerLeft.classList.add(`footerLeft`, `textOverflow`, `label`, `p15x`, `borderRadius`);

            if (card?.labels?.length > 0) {
                labelsElement.classList.add(`labelsElement`, `textOverflow`, `tflow100`);
                labelsElement.innerHTML = [...new Set(card?.labels.map(lbl => lbl.name))].join(`, `);
                footerLeft.append(labelsElement);
            }

            footerRight.classList.add(`footerRight`, `flex`, `gap5`, `alignCenter`, `justifyCenter`);
            footerRight.title = `${card?.attachments > 0 ? `Attachments: ${card?.attachments}` : ``}${card?.comments > 0 ? `Comments: ${card?.comments}` : ``}`;
            footerRight.innerHTML = `${card?.attachments > 0 ? `${paperclipIcon} ${card?.attachments}` : ``}${card?.comments > 0 ? `${commentsIcon} ${card?.comments}` : ``}`;

            cardFooter.append(footerLeft);
            cardFooter.append(footerRight);

            cardElement.append(cardTitle);
            if (card?.description != ``) cardElement.append(cardContent);
            if (card?.cover) cardElement.append(cardCover);
            cardElement.append(cardFooter);

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

    // console.log(`Raw Orders From Database`, trelloCards);

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
            email: crd?.email,
            url: crd?.shortUrl,
            position: crd?.pos,
            index: crd?.idShort,
            labels: crd?.labels,
            description: crd?.desc,
            comments: crd?.badges.comments,
            lastUpdated: crd?.dateLastActivity,
            attachments: crd?.badges.attachments,
            ...(crd?.cover?.idAttachment != null && {
                cover: `https://trello.com/1/cards/${crd?.id}/attachments/${crd?.cover?.idAttachment}/download/`,
            })
        }
    });

    board = {
        orders: cards,
        ...board,
        lists,
        cards,
    }

    nextUpdateIn.innerHTML = 25;
    lastUpdated.innerHTML = dayjs().tz(defaultTimezone).format(timeFormat);
    console.log(`Updated Creative Workshop Orders`, board);

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

if (trelloForm) {
    trelloForm.addEventListener(`submit`, (trelloFormSubmitEvent) => {
        trelloFormSubmitEvent.preventDefault();
        let ticketTitle = trelloTicketTitleField?.value;
        let ticketDescription = trelloTicketDescriptionField?.value;
        let ticketAttachment = trelloTicketAttachmentField?.value;
        createTrelloCard(ticketTitle, ticketDescription, ticketAttachment, board?.lists[0]?.id);
        trelloForm.reset();
    });
} 
// else {
//     let creativeWorkshopOrderTypeFormResponses = await getTypeformResponses(creativeWorkshopOrderTypeFormID);
//     console.log(`Creative Workshop Order TypeForm Responses`, creativeWorkshopOrderTypeFormResponses);
// }

const copyrightYear = document.querySelector(`.year`);
const copyrightYearValue = new Date().getFullYear();
copyrightYear.innerHTML = copyrightYearValue;