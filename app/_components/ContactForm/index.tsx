"use client";

import { useEffect } from 'react';

const initialState = {
  status: "",
  message: "",
}

export default function ContactForm() {
  useEffect(() => {
    /*
    <div id="test">
      <script src="https://sdk.form.run/js/v2/embed.js"></script>
      <div
        class="formrun-embed"
        data-formrun-form="@kazuaki-urayama-IJRqxLbyvQ1bsFH4C0iC"
        data-formrun-redirect="true">
      </div>
    </div>
    */
    const contact = document.getElementById("contact");
    const script = document.createElement("script");
    script.setAttribute("src", "https://sdk.form.run/js/v2/embed.js");
    script.async = true;
    contact?.appendChild(script);

    const embed = document.createElement("div");
    embed.className = "formrun-embed";
    embed.setAttribute("data-formrun-form", "@kazuaki-urayama-IJRqxLbyvQ1bsFH4C0iC");
    embed.setAttribute("data-formrun-redirect", "true");
    contact?.appendChild(embed);

    const script2 = document.createElement("script");
    script2.textContent = 'console.log("Voila!")';
    contact?.appendChild(script2);

    return () => {
      contact?.removeChild(script);
      contact?.removeChild(script2);
    }
  }, []);

  return (
    <>
      <div id="contact"></div>
    </>
  );
}
