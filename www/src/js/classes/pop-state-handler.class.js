export default class PopStateHandler {
  // Note: Only instantiate PopStateHandler once!

  constructor () {
    // Add event handlers for a.pop-links once
    this.addEventHandler();
    // Call changePage on initial page load
    this.changePage();
    // Call changePage on pop events
    // (the user clicks the forward or backward button)
    // from an arrow function to keep "this"
    // inside changePage pointing to the PopStateHandler object
    window.addEventListener('popstate', () => this.changePage());
  }

  addEventHandler () {
    // make "that" the PopStateHandler object
    // (since this will be the a tag inside the click function)
    let that = this;

    $(document).on('click', 'a.pop', function (e) {
      // Create a push state event
      let href = $(this).attr('href');
      history.pushState(null, null, href);

      // Call the changePage function
      that.changePage();

      // Stop the browser from starting a page reload
      e.preventDefault();
    });
  }

  changePage () {
    // React on page changed
    // (replace part of the DOM etc.)

    // Get the current url
    let url = location.pathname;

    // Change which menu link that is active
    $('header a').removeClass('active');
    $(`header a[href="${url}"]`).addClass('active');

    // A small "dictionary" of what method to call
    // on which url
    let urls = {
      '/': 'start',
      '/spel': 'spel',
      '/kontakt': 'contact'
    };

    // Call the right method
    let methodName = urls[url] || 'start';
    this[methodName]();
  }

  start () {
    $('main').html(`
        <h1>Välkommen</h1>
        <p>Du är på min fina startsida</p>
      `);
  }

  spel () {
    $('main').html('Du vill spela ett spel!');
  }

  contact () {
    $('main').html('Här finns kontaktuppgifter!');
  }
}

// Create an instance of the class
new PopStateHandler();
