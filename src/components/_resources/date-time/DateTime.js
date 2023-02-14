// Date & Time (format) for moment.js (only text format)

export let moment_locale = localStorage.getItem('language');

// English (United States) [en]
export let moment_format_date_time_long = 'LLL';

switch (moment_locale) {

    // Italian [it]
    case "it":
        moment_locale = "it";
        break;

    // English [en]
    default:
        moment_locale = "en";
        break;
}
