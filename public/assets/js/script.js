const trelloForm = document.querySelector(`.trelloTicketForm`);
let trelloTicketTitleField = document.querySelector(`.trelloTicketTitleField`);

trelloForm.addEventListener(`submit`, (trelloFormSubmitEvent) => {
    trelloFormSubmitEvent.preventDefault();

    let ticketTitle = trelloTicketTitleField?.value;
    console.log(`Trello API Testing`);
    console.log(`Ticket Title`, ticketTitle);
});

const copyrightYear = document.querySelector(`.year`);
const copyrightYearValue = new Date().getFullYear();
copyrightYear.innerHTML = copyrightYearValue;