// text format only

export const language = localStorage.getItem('language');

// Loading
export let text_info_Loading = "Loading...";

// Success
export let text_success_Added = "Added";
export let text_success_Updated = "Updated";
export let text_success_Deleted = "Deleted";

// Errors
export let text_error = "Error";
export let text_error_LoadData = "Failed to load data";



switch (language) {

  case "it":

    // Loading
    text_info_Loading = "Caricamento in corso...";

    // Success
    text_success_Added = "Aggiunto";
    text_success_Updated = "Aggiornato";
    text_success_Deleted = "Elimianto";

    // Errors
    text_error = "Errore"
    text_error_LoadData = "Impossibile caricare i dati";

    break;

}