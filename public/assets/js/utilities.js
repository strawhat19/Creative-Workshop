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

const createWebhook = async () => {
    try {
        const response = await fetch(`https://api.trello.com/1/webhooks/`, {
            method: `POST`,
            headers: {
                'Content-Type': `application/json`
            },
            body: JSON.stringify({
                key: trelloAPIKey,
                idModel: testBoardID,
                token: trelloAPIToken,
                callbackURL: `https://smasherscape.vercel.app/api/webhook?type=board`,
                description: `My Trello Webhook For Test Board`
            })
        });
    
        const latestBoardData = await response.json();
        console.log(`Latest Board Data`, latestBoardData);
        return latestBoardData;
    } catch (error) {
        if (error.response) {
            console.log(`Response data`, await error.response.text());
        } else {
            console.log(`Error fetching Board Cards data: `, error);
        }
    }
}

const isValid = (item) => {
    if (typeof item == `string`) {
      if (!item || item == `` || item.trim() == `` || item == undefined || item == null) {
        return false;
      } else {
        return true;
      }
    } else if (typeof item == `number`) {
      if (isNaN(item) || item == undefined || item == null) {
        return false;
      } else {
        return true;
      }
    } else if (typeof item == `object` && item != undefined && item != null) {
      if (Object.keys(item).length == 0 || item == undefined || item == null) {
        return false;
      } else {
        return true;
      }
    } else if (Array.isArray(item) && item != undefined && item != null) {
      return item.length > 0;
    } else {
      if (item == undefined || item == null) {
        return false;
      } else {
        return true;
      }
    }
}