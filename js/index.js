// Charger les contacts et les libellés depuis le localStorage ou créer des tableaux vides s'ils sont inexistants

const contacts = JSON.parse(localStorage.getItem('contacts')) || [];
const labels = JSON.parse(localStorage.getItem('labels')) || [];
let frequentContacts = JSON.parse(localStorage.getItem('frequentContacts')) || [];

// DOM Elements
const totalContactsEls = document.querySelectorAll('.total-contacts');
const saveContactButton = document.getElementById('saveContact');
const searchInput = document.getElementById('searchInput');
const createContactBtn = document.getElementById('create-contact-btn');
const formSection = document.getElementById('form-section');
const contactListSection = document.getElementById('contact-list-section');
const contactList = document.getElementById('contact-list');
const createContactForm = document.getElementById('createContactForm');
const frequentBtn = document.getElementById('frequent-btn');
const labelsContainer = document.getElementById('labels-container');
const contactLabelSelect = document.getElementById('contactLabel');
const saveLabelButton = document.getElementById('saveLabel');
const container__return = document.getElementById('container__retour');
const img__silhouette = document.getElementById('img__silhouette');
const btn__libellé = document.getElementById('btn__libellé');
const contactBtn = document.getElementById('contact-btn');

// Ajouter un écouteur d'événement pour le bouton Contact
contactBtn.addEventListener('click', () => {
      // Appliquer une couleur de fond à contact-btn
      contactBtn.style.backgroundColor = '#b7dcfa'; // Couleur pour Contact
      frequentBtn.style.backgroundColor = ''; // Remettre la couleur par défaut pour frequent-btn
      // Afficher la liste des contacts
        contactList.classList.remove('d-none');  // Supprime la classe 'd-none' pour afficher la liste
        formSection.classList.add('d-none'); 
        createContactForm.classList.add('d-none');
        container__return.classList.add('d-none') 
        img__silhouette.classList.add('d-none');
        btn__libellé.classList.add('d-none');  // Masquer le formulaire de création de contact
      renderContacts();                        // Rendre les contacts si nécessaires
});

// Ajouter un écouteur d'événement pour le bouton Contact
createContactBtn.addEventListener('click', () => {
    contactList.classList.add('d-none');  // Supprime la classe 'd-none' pour afficher la liste
    formSection.classList.remove('d-none'); 
    createContactForm.classList.remove('d-none');
    container__return.classList.remove('d-none') 
    img__silhouette.classList.remove('d-none');
    btn__libellé.classList.remove('d-none');  // Masquer le formulaire de création de contact
    // formSection();                        // Rendre les contacts si nécessaires
});

    // Ajouter un écouteur d'événement pour le bouton Fréquent
    frequentBtn.addEventListener('click', () => {
      // Appliquer une couleur de fond à frequent-btn
      frequentBtn.style.backgroundColor = '#b7dcfa'; // Couleur pour Fréquent
      contactBtn.style.backgroundColor = ''; // Remettre la couleur par défaut pour contact-btn
    });

// Initialisation des événements
function initEvents() {
    // Afficher la section de contact
    document.getElementById('contact-btn').addEventListener('click', () => {
    contactListSection.classList.remove('d-none');
    formSection.classList.remove('d-none');
    renderContacts();
});

// Afficher le formulaire pour créer un nouveau contact
    createContactBtn.addEventListener('click', () => {
    contactListSection.classList.add('d-none');
    formSection.classList.remove('d-none');
});

// Sauvegarder un nouveau contact
    saveContactButton.addEventListener('click', saveContact);
    // Sauvegarder un libellé
    saveLabelButton.addEventListener('click', saveLabel);
    // Recherche de contacts
    searchInput.addEventListener('input', handleSearch);
    // Filtrer les contacts fréquents
    frequentBtn.addEventListener('click', () => {
    renderContactList(frequentContacts);
});

    // Afficher le modal de création de libellé
    document.getElementById('text_libellé').addEventListener('click', () => {
    document.body.classList.add('modal-open');
    const modal = new bootstrap.Modal(document.getElementById('createLabelModal'));
    modal.show();
});
}

// Sauvegarder un contact
function saveContact() {
    const firstName = document.getElementById('contactFirstName').value;
    const lastName = document.getElementById('contactLastName').value;
    const company = document.getElementById('contactCompany').value;
    const jobTitle = document.getElementById('contactJobTitle').value;
    const email = document.getElementById('contactEmail').value;
    const additionalEmail = document.getElementById('additionalEmail').value;
    const phone = document.getElementById('contactPhone').value;
    const selectedLabel = document.getElementById('contactLabelSelect').value;  // Assurez-vous que cet élément existe


    if (firstName && lastName && email && phone) {
        contacts.push({ firstName, lastName,company,jobTitle, email, additionalEmail, phone, selectedLabel });
        localStorage.setItem('contacts', JSON.stringify(contacts));
        renderContacts();
        formSection.classList.add('d-none');
        createContactForm.reset();
    }
}

// Sauvegarder un libellé
function saveLabel() {
    const label = document.getElementById('labelInput').value.trim();
    if (label && !labels.includes(label)) {
    labels.push(label);
    localStorage.setItem('labels', JSON.stringify(labels));
    
      // Actualiser l'affichage des libellés dans le conteneur et le menu déroulant
    renderLabels();
      // Fermer le modal après la création
        const modal = bootstrap.Modal.getInstance(document.getElementById('createLabelModal'));
        modal.hide();
      // Réinitialiser le champ d'input
        document.getElementById('labelInput').value = '';
    }
}

  // Recherche de contacts
function handleSearch(event) {
    const searchValue = event.target.value.toLowerCase();
    const filteredContacts = contacts.filter(contact =>
    contact.firstName.toLowerCase().includes(searchValue) ||
    contact.lastName.toLowerCase().includes(searchValue)
    );
    renderContactList(filteredContacts);
}

function renderContacts() {
    const totalContactsCount = contacts.length;
    totalContactsEls.forEach(el => el.textContent = `(${totalContactsCount})`);
    if (totalContactsCount > 0) {
          contactList.classList.remove('d-none');  // Afficher la liste des contacts
          contactListSection.classList.add('d-none');  // Masquer la section des contacts fréquents
          renderContactList(contacts);  // Rendre la liste des contacts
    } else {
          contactList.classList.add('d-none');  // Masquer la liste si aucun contact n'existe
          contactListSection.classList.remove('d-none');  // Afficher une autre section si nécessaire
    }
}

function renderContactList(contactArray) {
    const contactListBody = document.getElementById('contact-list-body');
    contactListBody.innerHTML = '';
    // Fonction pour générer des couleurs vives sans blanc
    function getVibrantColor(name) {
    const hash = Array.from(name).reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const hue = hash % 360; // Teinte (H) entre 0 et 360
      const saturation = 100; // Saturation à 100% pour des couleurs vives
      const lightness = 40;  // Luminosité à 40% pour éviter des couleurs trop claires
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }
    contactArray.forEach((contact, index) => {
      const firstLetter = contact.firstName.charAt(0).toUpperCase(); // Première lettre du prénom
      const bgColor = getVibrantColor(contact.firstName); // Générer une couleur vive basée sur le prénom
    const row = `
        <tr style="background-color: #fff;"> <!-- Fond blanc pour chaque ligne -->
        <td style="display: flex; align-items: center; height: 72px; min-width: 150px;"> <!-- Aligner au centre -->
            <div class="contact-initial" style="background-color: ${bgColor}; font-size: 20px;
    font-weight: 500;">
            ${firstLetter}
            </div>
            <div style="display: flex; align-items: center;">
            ${contact.firstName} ${contact.lastName}
            </div>
        </td>
        <td style="min-width: 200px;">${contact.email}</td>
        <td style="min-width: 150px;">${contact.phone}</td>
        <td style="min-width: 150px;">${contact.jobTitle}, ${contact.company}</td>
        <td style="display: flex; gap: 10px; padding: 18px; min-width: 160px;">
            <div class="label-box">
            ${contact.selectedLabel || 'Aucun libellé'}
            </div>
            <div class="label-box">
            ${contact.otherLabel || 'Libellé 2'}
            </div>
        </td>
        </tr>
    `;
    contactListBody.insertAdjacentHTML('beforeend', row);
    });
}
  // Rendre la liste des libellés
function renderLabels() {
    labelsContainer.innerHTML = ''; // On vide le conteneur avant de le remplir
    labels.forEach((label, index) => {
    const labelHTML = `
        <div class="d-flex justify-content-between align-items-center label-item">
        <div class="d-flex align-items-center" style="
    gap: 17px;
">
        <img src="assets/images/libelle.svg" alt="Libellé" class="label-svg">
        <p class="mb-0 label-name">${label}</p>
        </div>
        <div class="label-actions ">
            <span class="material-symbols-outlined pointer me-2" data-action="edit-label" data-index="${index}">edit</span>
            <span class="material-symbols-outlined pointer" data-action="delete-label" data-index="${index}">delete</span>
        </div>
        </div>
    `;
    labelsContainer.insertAdjacentHTML('beforeend', labelHTML);
    });
    // Ajouter les événements d'édition et de suppression après avoir affiché les libellés
    const editButtons = document.querySelectorAll('[data-action="edit-label"]');
    const deleteButtons = document.querySelectorAll('[data-action="delete-label"]');
    editButtons.forEach(button => button.addEventListener('click', handleEditLabel));
    deleteButtons.forEach(button => button.addEventListener('click', handleDeleteLabel));
}

  // Fonction pour gérer l'édition d'un libellé
function handleEditLabel(event) {
    const index = event.target.getAttribute('data-index');
    const newLabel = prompt('Modifier le libellé:', labels[index]);
    if (newLabel && newLabel.trim() !== '') {
    labels[index] = newLabel.trim();
    localStorage.setItem('labels', JSON.stringify(labels));
    renderLabels();
    }
}


  // Fonction pour supprimer un contact
  let contactIndexToDelete; // Variable pour stocker l'index du contact à supprimer
  // Fonction pour supprimer un contact avec modal de confirmation
function deleteContact(index) {
    contactIndexToDelete = index; // Stocker l'index pour le supprimer après confirmation
    const modal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
    modal.show(); // Afficher le modal de confirmation
}
  // Lorsqu'on clique sur "Confirmer" dans le modal
document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
    // Supprimer le contact à l'index donné
    contacts.splice(contactIndexToDelete, 1);
    
    // Mettre à jour le localStorage
    localStorage.setItem('contacts', JSON.stringify(contacts));
    
    // Re-rendre la liste des contacts
    renderContacts();
    // Fermer le modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('confirmDeleteModal'));
    modal.hide();
});

  // Fonction pour gérer la suppression d'un libellé avec confirmation
function handleDeleteLabel(event) {
    const index = event.target.getAttribute('data-index');
    if (confirm('Êtes-vous sûr de vouloir supprimer ce libellé ?')) {
      // Supprimer le libellé à l'index donné
    labels.splice(index, 1);
      // Mettre à jour le localStorage
    localStorage.setItem('labels', JSON.stringify(labels));
      // Re-rendre la liste des libellés
    renderLabels();
    }
}


  // Ajouter les événements pour la modification et la suppression des libellés
function initLabelActions() {
    // Sélectionner toutes les icônes de suppression et d'édition
    const editIcons = document.querySelectorAll('.edit-icon');
    const deleteIcons = document.querySelectorAll('.delete-icon');

    editIcons.forEach((icon, index) => {
    icon.addEventListener('click', () => {
        const labelName = icon.closest('.label-item').querySelector('span').innerText;
        // Action de modification ici
        console.log(`Modifier le libellé : ${labelName}`);
    });
    });

    deleteIcons.forEach((icon, index) => {
    icon.addEventListener('click', () => {
        const labelName = icon.closest('.label-item').querySelector('span').innerText;
        // Action de suppression ici
        if (confirm(`Voulez-vous vraiment supprimer le libellé : ${labelName} ?`)) {
        icon.closest('.label-item').remove();
        console.log(`Libellé supprimé : ${labelName}`);
        }
});
    });
}

  // Appelez la fonction d'initialisation au chargement de la page ou après la création des libellés
initLabelActions();

// Initialisation
initEvents();
renderContacts();
renderLabels();