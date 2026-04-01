import { Injectable } from '@angular/core';

interface CleaningPackage {
  id: string; // Unieke ID voor elk pakket (bijv. "basis-clean", "deep-clean")
  name: string;
  price: number;
  priceLabel?: string; // Voor "Vanaf" of "Setprijs"
  description?: string;
  features: string[];
  options?: Option[]; // Voor variaties binnen een pakket (bijv. "2-zits (€75)", "3-zits (€95)")
  optionalExtras?: Option[]; // Voor extra's die los toegevoegd kunnen worden (bijv. "Vlekverwijdering +€20")
  isPopular?: boolean;
}

export interface ServicePage {
  id: string;
  title: string;
  description: string;
  popularOrder: number;
  imageUrl: string;
  themeColor: string; // Maak deze verplicht voor consistente UI
  packages: CleaningPackage[];
  importantNotes: {
    minimumOrder?: string;
    dryingTime: string;
    resultInfo: string;
  };
}

export interface Option {
  description: string;
  price: number;
}

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  // De data als private property
private readonly cleaningServices: Record<string, ServicePage> = {
  auto: {
    id: "auto-interieur",
    title: "Auto Interieur",
    description: "Complete opfrisbeurt voor uw auto interieur voor een fris en nieuw gevoel tijdens het rijden.",
    popularOrder: 1,
    imageUrl: "car.jpg",
    themeColor: "#e3f2fd", // Lichtblauw/grijs
    packages: [
      {
        id: "basis-clean",
        name: "Interieur Basis Clean",
        price: 100,
        features: ["Stofzuigen", "Dashboard & panelen", "Ramen binnenzijde", "Luchtroosters"]
      },
      {
        id: "deep-clean",
        name: "Interieur Deep Clean",
        price: 150,
        features: ["Alles van Basis Clean", "Dieptereiniging stoelen", "Leder behandeling", "Geurverbetering"],
        isPopular: true
      },
      {
        id: "stoel-vlekken-clean",
        name: "Stoel & Vlekken Clean",
        price: 60,
        features: ["Dieptereiniging zitplekken", "Stofzuigen", "Vlek & geurverwijdering"]
      }
    ],
    importantNotes: { dryingTime: "ca. 2 uur", resultInfo: "Prijzen incl. btw voor particulieren" }
  },
  stoelen: {
    id: "stoelen",
    title: "Stoelen",
    description: "Diepe reiniging van uw stoelen of fauteuils voor een frisse uitstraling in huis.",
    popularOrder: 2,
    imageUrl: "chair.jpg",
    themeColor: "#c1c1c166",
    packages: [
      {
        id: "eetkamerstoelen",
        name: "Eetkamerstoelen",
        price: 75,
        priceLabel: "Vanaf",
        description: "Uitsluitend volledige set (4-6 stuks)",
        features: ["Voorinspectie stof", "Dieptereiniging", "Bacteriën verwijderen", "Geurverwijdering"],
        isPopular: true
      },
      {
        id: "fauteuil",
        name: "Zitmeubels",
        description: "Individuele stoelen, fauteuils of kleine zitmeubels",
        priceLabel: "Vanaf",
        price: 75,
        features: ["Voorinspectie stof", "Dieptereiniging", "Bacteriën verwijderen", "Geurverwijdering"]
      }
    ],
    importantNotes: { minimumOrder: "€75", dryingTime: "4-8 uur", resultInfo: "Afhankelijk van vervuiling & soort stof" }
  },
  bank: {
    id: "bankreiniging",
    title: "Bankreiniging",
    description: "Diepe reiniging van uw bank om vlekken te verwijderen, of gewoon om de bank weer een nieuw leven in te blazen.",
    popularOrder: 3,
    imageUrl: "couch.jpg",
    themeColor: "#f5f5f5",
    packages: [
      {
        id: "standaard-bank",
        name: "Standaard Bank",
        price: 75,
        priceLabel: "Vanaf",
        features: ["Grondige stofzuigbeurt", "Dieptereiniging", "Vlekherstel", "Geurverwijdering"],
        optionalExtras: [
          { description: "Intensieve vlekbehandeling", price: 20 },
          { description: "Huisdieren en geuren", price: 15 }
        ],
        options: [
          { description: "2-zits", price: 75 },
          { description: "3-zits", price: 95 },
          { description: "4-zits", price: 115 }
        ],
        isPopular: true
      },
      {
        id: "hoekbank",
        name: "Hoekbank",
        price: 125,
        priceLabel: "Vanaf",
        features: ["Grondige stofzuigbeurt", "Dieptereiniging", "Vlekherstel", "Geurverwijdering"],
        optionalExtras: [
          { description: "Intensieve vlekbehandeling", price: 20 },
          { description: "Huisdieren en geuren", price: 15 }
        ],
        options: [
          { description: "Klein", price: 125 },
          { description: "Middel", price: 145 },
          { description: "Groot/U-vorm", price: 165 }
        ]
      }
    ],
    importantNotes: { minimumOrder: "€75", dryingTime: "4-8 uur", resultInfo: "Resultaat afhankelijk van stof" }
  }
};

  constructor() { }

  /**
   * Geeft alle services terug als een array (handig voor loops)
   */
  getAllServices(): ServicePage[] {
    return Object.values(this.cleaningServices);
  }

  /**
   * Zoek een specifieke service op basis van ID (bijv. voor een detailpagina)
   */
  getServiceById(id: string): ServicePage | undefined {
    return this.getAllServices().find(service => service.id === id);
  }
}