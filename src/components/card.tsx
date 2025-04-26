import "@/styles/card.css";

interface CardProps {
  image?: string;
  text: string;
  link: string;
  middle?: boolean;
}

export default function Card({ image, text, link, middle }: CardProps) {
  return (
    <div className={`card ${middle ? "middle" : ""}`}>
      <a href={link}>
        <div className="image">
          <img className="photo" src={image} />
        </div>
        <div className="info">{text}</div>
      </a>
    </div>
  );
}
