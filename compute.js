jQuery(document).ready(function ($) {

    // Our JavaScript simply needs to register a 'submit' handler on the <form>
    // element of findex.html. The .on('submit'.... below
    // calls the search() function whenever the form is submitted:

    $('#userInputs').on('submit', computeCosts)
});

// Create currency number formatter (source: https://stackoverflow.com/a/16233919)
var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    // minimumSignificantDigits: 1
    // the default value for minimumFractionDigits depends on the currency
    // and is usually already 2
});

function computeCosts(event) {

    // A <form> will refresh the page by default when the data is submitted. We need to prevent
    // this default behavior when we are submitting data to our own page with preventDefault();
    event.preventDefault();

    // hide the keyboard on mobile by taking focus away (using .blur()) from the search box
    // jQuery('#addressInput').blur();

    // Average state + local combined rate (source: https://taxfoundation.org/state-and-local-sales-tax-rates-2016/)
    var taxRates = {
        'AL': 8.97,
        'AK': 1.78,
        'AZ': 8.25,
        'AR': 9.30,
        'CA': 8.48,
        'CO': 7.52,
        'CT': 6.35,
        'DE': 0,
        'FL': 6.66,
        'GA': 7.01,
        'HI': 4.35,
        'ID': 6.03,
        'IL': 8.64,
        'IN': 7.00,
        'IA': 6.79,
        'KS': 8.60,
        'KY': 6.00,
        'LA': 9.00,
        'ME': 5.50,
        'MD': 6.00,
        'MA': 6.25,
        'MI': 6.00,
        'MN': 7.27,
        'MS': 7.07,
        'MO': 7.86,
        'MT': 0,
        'NE': 6.87,
        'NV': 7.98,
        'NH': 0,
        'NJ': 6.97,
        'NM': 7.51,
        'NY': 8.49,
        'NC': 6.90,
        'ND': 6.82,
        'OH': 7.14,
        'OK': 8.82,
        'OR': 0,
        'PA': 6.34,
        'RI': 7.00,
        'SC': 7.22,
        'SD': 5.84,
        'TN': 9.46,
        'TX': 8.17,
        'UT': 6.69,
        'VT': 6.17,
        'VA': 5.63,
        'WA': 8.89,
        'WV': 6.20,
        'WI': 5.41,
        'WY': 5.42,
        'D.C.': 5.75
    }

    // Assign the entered values to variables
    var phoneSalePrice = 1 * jQuery('#phoneSalePrice').val();
    var state = jQuery('#statelist').val();
    var salesTax = taxRates[state];
    var keepDuration = 1 * jQuery('#keepDuration').val();
    var useNumber = 1 * jQuery('#useNumber').val();
    var useDuration = 1 * jQuery('#useDuration').val();

    // Assign iPhone prices
    var phones = ["iPhone 8, 64 GB",
        "iPhone 8, 256 GB",
        "iPhone 8 Plus, 64 GB",
        "iPhone 8 Plus, 256 GB",
        "iPhone X, 64 GB",
        "iPhone X, 256 GB"];

    var price = [699, 849, 799, 949, 999, 1149];

    var nphones = price.length
    var taxPrice = new Array(nphones); // price after tax
    var effPrice = new Array(nphones); // effective price after sale + tax
    var effPricePerMonth = new Array(nphones); // effective price per month after sale + tax based on estimated ownership duration
    var effPricePerDay = new Array(nphones); // effective price per day after sale + tax based on estimated ownership duration
    var effPricePerMinute = new Array(nphones); // effective price per minute after sale + tax based on estimated ownership duration
    var effPricePerUse = new Array(nphones); // effective price per use after sale + tax based on estimated ownership duration
    var rows = new Array(nphones); // will hold each row of data

    // Get total prices with sales tax
    for (var i = 0; i < price.length; i++) {
        taxPrice[i] = price[i] * (1 + salesTax / 100)
        effPrice[i] = taxPrice[i] - phoneSalePrice
        effPricePerMonth[i] = effPrice[i] / keepDuration
        effPricePerDay[i] = effPrice[i] / (365 * keepDuration / 12)
        effPricePerMinute[i] = effPricePerDay[i] / useDuration
        effPricePerUse[i] = effPricePerDay[i] / useNumber

        //rows[i] = [phones[i], price[i], taxPrice[i], effPrice[i], effPricePerMonth[i], effPricePerDay[i],
        // effPricePerMinute[i], effPricePerUse[i]]
    }

    // Reformat all numbers
    for (var i = 0; i < price.length; i++) {
        price[i] = formatter.format(price[i])
        taxPrice[i] = formatter.format(taxPrice[i])
        effPrice[i] = formatter.format(effPrice[i])
        effPricePerMonth[i] = formatter.format(effPricePerMonth[i])
        effPricePerDay[i] = formatter.format(effPricePerDay[i])
        effPricePerMinute[i] = formatter.format(effPricePerMinute[i])
        effPricePerUse[i] = formatter.format(effPricePerUse[i])

        rows[i] = [phones[i], price[i], taxPrice[i], effPrice[i], effPricePerMonth[i], effPricePerDay[i],
        effPricePerMinute[i], effPricePerUse[i]]
    }

    var headers = ['Model', 'Retail Price', 'Retail Price After Tax', 'Effective Price', 'Effective Price Per Month',
        'Effective Price Per Day', 'Effective Price Per Minute', 'Effective Price Per Use']

    // Generate table
    // table headers
    var html = '<table><thead><tr>';
    for (var i = 0; i < headers.length; i++) {
        html += '<th>';
        html += headers[i];
        html += '</th>';
    }
    html += '</tr></thead> <tbody>';

    // table rows
    for (var i = 0, len = rows.length; i < len; ++i) {
        html += '<tr>';
        for (var j = 0, rowLen = rows[i].length; j < rowLen; ++j) {
            html += '<td>' + rows[i][j] + '</td>';
        }
        html += "</tr>";
    }
    html += '</tbody></table>';

    // clear existing table, if any, and print new table
    jQuery('#results').empty();
    jQuery(html).appendTo('#results');

}