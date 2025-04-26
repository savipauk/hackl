import { useState } from "react";
import Card from "./card";
import "@/styles/carousel.css";

export default function Carousel() {
  const cards = [
    { text: "NOGOMET", image: "nogomet.png", link: "#" },
    { text: "ODBOJKA", image: "odbojka.jpg", link: "#" },
    { text: "HOKEJ NA TRAVI", image: "hokejNaTravi.png", link: "#" },
    { text: "ŠAH", image: "sah.png", link: "#" },
    { text: "RAGBI", image: "ragbi.jpg", link: "#" },
  ];

  const [startIndex, setStartIndex] = useState(0);

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    if (startIndex + 3 < cards.length) {
      setStartIndex((prev) => prev + 1);
    }
  };

  const visibleCards = cards.slice(startIndex, startIndex + 3);

  return (
    <div className="carousel">
      <a
        onClick={handlePrev}
        style={{ cursor: startIndex === 0 ? "not-allowed" : "pointer" }}
      >
        <img src="/arrowLeft.svg" alt="Previous" />
      </a>

      {visibleCards.map((card, idx) => (
        <Card
          key={startIndex + idx}
          text={card.text}
          image={card.image}
          link={card.link}
          middle={idx === 1}
        />
      ))}

      <a
        onClick={handleNext}
        style={{
          cursor: startIndex + 3 >= cards.length ? "not-allowed" : "pointer",
        }}
      >
        <img src="/arrowRight.svg" alt="Next" />
      </a>
    </div>
  );
}
