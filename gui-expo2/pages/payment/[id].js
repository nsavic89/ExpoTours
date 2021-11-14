import React from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { server } from '../../config'



// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function Payment({trv}) {
  React.useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);

    if (query.get('success')) {
      console.log('Order placed! You will receive an email confirmation.');
    }

    if (query.get('canceled')) {
      console.log('Order canceled -- continue to shop around and checkout when you’re ready.');
    }
  }, []);

  return (
    <form action={`/api/checkout_session/${trv.price_id}`} method="POST">
      <section>
        <div><h1>ExpoTours.ch</h1></div>
        <div style={{ marginBottom: 25 }}>
            <strong>
                Vous êtes invité pour un paiement.
                Veuillez cliquer sur le bouton ci-dessous pour accéder
                à la page de paiement.
            </strong>
        </div>
        <div>
          <button type="submit" role="link">
              Procéder au paiement
          </button>
        </div>
        <div>
          <br/><br/>
          <img alt='no-img' src='/logo_light.png' height={300} />
        </div>
      </section>
      <style jsx>
        {`
          section {
            background: #ffffff;
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            border-radius: 6px;
            justify-content: center;
            align-items: center;
          }
          button {
            height: 36px;
            background: #556cd6;
            border-radius: 4px;
            color: white;
            border: 0;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0px 4px 5.5px 0px rgba(0, 0, 0, 0.07);
          }
          button:hover {
            opacity: 0.8;
          }
        `}
      </style>
    </form>
  );
}

// This function gets called at build time
export async function getStaticPaths() {
  // Call an external API endpoint to get posts
  const res = await fetch(`${server}/travellers/`)
  const trv = await res.json()

  // Get the paths we want to pre-render based on posts
  let paths = []

  for (let i = 0; i < trv.length; i++) {
      paths.push({ params: { id: trv[i].id.toString() }, locale: 'fr' })
      paths.push({ params: { id: trv[i].id.toString() }, locale: 'en' })
  }

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false }
}

// load events
export async function getStaticProps(context) {
  const res = await fetch(`${server}/travellers/${context.params.id}`)
  const trv = await res.json()

  return {
      props: {trv}
  };
}