// Replace with your own publishable key: https://dashboard.stripe.com/test/apikeys
var PUBLISHABLE_KEY = 'pk_live_51I3Ag1JGU9L1heDL481U7m8I240HzQeMvVM4XcaHwFbbjuyKhExGdsqXmHPPshasdq19tuHMxou8ONwEjOSzFKMS005hz8UiyD';
// Replace with the domain you want your users to be redirected back to after payment
var DOMAIN = location.href.replace(/[^/]*$/, '');

if (PUBLISHABLE_KEY === 'pk_live_51I3Ag1JGU9L1heDL481U7m8I240HzQeMvVM4XcaHwFbbjuyKhExGdsqXmHPPshasdq19tuHMxou8ONwEjOSzFKMS005hz8UiyD') {
  console.log(
    'Replace the hardcoded publishable key with your own publishable key: https://dashboard.stripe.com/test/apikeys'
  );
}

var stripe = Stripe(PUBLISHABLE_KEY);

// Handle any errors from Checkout
var handleResult = function (result) {
  if (result.error) {
    var displayError = document.getElementById('error-message');
    displayError.textContent = result.error.message;
  }
};

document.querySelectorAll('button').forEach(function (button) {
  button.addEventListener('click', function (e) {
    var mode = e.target.dataset.checkoutMode;
    var priceId = e.target.dataset.priceId;
    var items = [{ price: priceId, quantity: 1 }];

    // Make the call to Stripe.js to redirect to the checkout page
    // with the sku or plan ID.
    stripe
      .redirectToCheckout({
        mode: mode,
        lineItems: items,
        successUrl:
          DOMAIN + 'success.html?session_id={CHECKOUT_SESSION_ID}',
        cancelUrl:
          DOMAIN + 'canceled.html?session_id={CHECKOUT_SESSION_ID}',
      })
      .then(handleResult);
  });
});