import DutchBlitz from "./dutchBlitz/DutchBlitz";
import dutchBlitzArtwork from "../assets/images/games/duth_blitz__logo.png";

export const gameRegistry = [
  {
    id: "dutch-blitz",
    name: "Dutch Blitz",
    component: DutchBlitz,
    description: "Fast-paced score tracking for Dutch Blitz rounds.",
    image: dutchBlitzArtwork
  }
];

export function getGameById(gameId) {
  return gameRegistry.find((game) => game.id === gameId) ?? null;
}
