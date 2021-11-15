import { Button } from "antd";
import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../AppContext";






const Message = ({ message }) => (
  <section>
    <p>{message}</p>
  </section>
);

export default function Payment() {
    const id = useParams().id;
    const context = useContext(AppContext);
    const server = context.API;
    const [message, setMessage] = useState("");

    useEffect(() => {
        // Check to see if this is a redirect back from Checkout
        const query = new URLSearchParams(window.location.search);

        if (query.get("success")) {
        setMessage("Order placed! You will receive an email confirmation.");
        }

        if (query.get("canceled")) {
        setMessage(
            "Order canceled -- continue to shop around and checkout when you're ready."
        );
        }
  }, []);

  return message ? (
    <Message message={message} />
  ) : (
    <section style={{
        textAlign: 'center'
    }}>
        <div>
        <img
            src="/logo_light.png"
            alt="No logo"
            width={200}
        />
        <div className="description"><br/>
        <h3>Veuillez cliquer sur le boutton ci-dessous pour procéder au paiement</h3>
        </div>
        </div>
        <form action={`${server}/payment/${id}`} method="POST">
        <Button type="primary" htmlType="submit">
            Payer
        </Button>
        </form>
    </section>
  );
}