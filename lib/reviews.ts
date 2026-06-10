export type Review = {
  id: string;
  name: string;
  date: string;
  rating: 5;
  text: string;
};

export const reviews: Review[] = [
  {
    id: "kevin-2019-06-12",
    name: "Kevin",
    date: "12 juin 2019",
    rating: 5,
    text: "Commande reçue rapidement, les bracelets rendent vraiment bien et sont conformes à la photo. En bonus, un petit cadeau était joint à la commande. Je recommande cette boutique !"
  },
  {
    id: "corinne-2019-06-05",
    name: "Corinne",
    date: "05 juin 2019",
    rating: 5,
    text: "Envoi ultra rapide et joli bracelet. Du choix sur les couleurs et bonne communication avant l’achat. Merci pour le cadeau 😊."
  },
  {
    id: "chantal-2019-02-18",
    name: "chantal",
    date: "18 févr. 2019",
    rating: 5,
    text: "Commande reçue dans les temps. Les bracelets semblent solides et bien faits. Petit cadeau livré avec la commande, merci, et belle présentation ! je recommande cette boutique."
  },
  {
    id: "pauline-2019-01-27",
    name: "Pauline",
    date: "27 janv. 2019",
    rating: 5,
    text: "Très bon rapport qualité prix, une multitude de choix en mixant les modèles et les cordes. Délais de livraison respectés. Je recommande!"
  },
  {
    id: "gaulin-2019-01-16",
    name: "GAULIN",
    date: "16 janv. 2019",
    rating: 5,
    text: "Identique à la photo, bonne qualité et un petit cadeau"
  },
  {
    id: "adrien-2018-12-14",
    name: "ADRIEN",
    date: "14 déc. 2018",
    rating: 5,
    text: "Bracelets reçus rapidement. Ils sont très jolis, facile à mettre et à enlever. Merci pour le bracelet de Noël offert avec la commande! Cela fera un beau cadeau surprise sous le sapin"
  },
  {
    id: "acheteur-etsy-dutch-marina-2018-11-18",
    name: "Acheteur Etsy",
    date: "18 nov. 2018",
    rating: 5,
    text: "Le bracelet se marie bien avec le Dutch Marina que j’ai aussi"
  },
  {
    id: "acheteur-etsy-saint-patrick-2018-11-18",
    name: "Acheteur Etsy",
    date: "18 nov. 2018",
    rating: 5,
    text: "Très sympa la couleur du bracelet!"
  },
  {
    id: "acheteur-etsy-dutch-marina-photos-2018-11-18",
    name: "Acheteur Etsy",
    date: "18 nov. 2018",
    rating: 5,
    text: "La commande est arrivée dans les temps, les bracelets sont très beaux et conformes aux photos. Faciles à enlever si besoin. Quelques photos en plus seraient utiles pour bien voir le produit 😊"
  }
];
