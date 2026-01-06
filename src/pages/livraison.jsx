// src/pages/Delivery.jsx
import React from "react";
import { useTranslation } from "react-i18next";

const Delivery = () => {
  const { t } = useTranslation();

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        padding: "2rem",
        maxWidth: "800px",
        margin: "0 auto",
        lineHeight: "1.6",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>
        {t("delivery.title")}
      </h1>

      <section style={{ marginBottom: "1.5rem" }}>
        <p>{t("delivery.intro")}</p>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h2>{t("delivery.timeTitle")}</h2>
        <ul style={{ paddingLeft: "1.5rem" }}>
          <li>{t("delivery.timeCI")}</li>
          <li>{t("delivery.timeAfrica")}</li>
          <li>{t("delivery.timeInternational")}</li>
        </ul>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h2>{t("delivery.feesTitle")}</h2>
        <p>{t("delivery.feesText")}</p>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h2>{t("delivery.trackingTitle")}</h2>
        <p>{t("delivery.trackingText")}</p>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h2>{t("delivery.packagingTitle")}</h2>
        <p>{t("delivery.packagingText")}</p>
      </section>

      <section>
        <p style={{ fontStyle: "italic" }}>
          {t("delivery.conclusion")}
        </p>
      </section>
    </div>
  );
};

export default Delivery;
