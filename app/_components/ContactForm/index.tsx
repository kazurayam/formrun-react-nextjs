"use client";

import { useEffect } from 'react';

const initialState = {
  status: "",
  message: "",
}

export default function ContactForm() {
  if (!process.env.NEXT_PUBLIC_FORMRUN_FORM_URL_PATH) {
    throw new Error("NEXT_PUBLIC_FORMRUN_FORM_URL_PATH is required");
  }
  useEffect(() => {
    /* generate the following stuff in the DOM
    <div id="contact">
      <script src="https://sdk.form.run/js/v2/embed.js"></script>
      <div
        class="formrun-embed"
        data-formrun-form=`${NEXT_PUBLIC_FORMRUN_FORM_URL_PATH}`
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
    embed.setAttribute("data-formrun-form", `${process.env.NEXT_PUBLIC_FORMRUN_FORM_URL_PATH}`);
    embed.setAttribute("data-formrun-redirect", "true");
    contact?.appendChild(embed);

    return () => {
      contact?.removeChild(script);
    }
  }, []);

  return (
    <>
      <div id="contact"></div>
    </>
  );
}
