import { Injectable } from '@angular/core';

export interface Package {
  name: string;
  price: string | number;
  description?: string;
  features: string[];
  isPopular?: boolean; // Nieuw: om het 'Meest gekozen' pakket te markeren
}

export interface ServicePage {
  id: string;
  title: string;
  description: string;
  popularOrder: number; // Nieuw: om de volgorde van de services te bepalen (1 = meest populair)
  imageUrl?: string;
  themeColor?: string;
  packages: Package[];
  extraOptions?: { name: string; price: string }[];
  importantNotes: {
    minimumOrder?: string;
    dryingTime: string;
    resultInfo: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  // De data als private property
private readonly cleaningServices: Record<string, ServicePage> = {
    stoelen: {
      id: "stoelen-fauteuils",
      title: "Stoelen en Fauteuils",
      description: "Diepe reiniging van uw stoelen of fauteuils voor een frisse uitstraling in huis.",
      popularOrder: 2, // Tweede meest populair
      imageUrl: "chair.jpg",
      themeColor: "#c1c1c166", // Nieuw: een blauwe kleur die past bij stoelen
      packages: [
        {
          name: "Eetkamerstoelen Set",
          price: 75,
          description: "Volledige set (4–6 stuks)",
          features: ["Voorinspectie stof", "Dieptereiniging", "Bacteriën verwijderen", "Uitsluitend complete set"],
          isPopular: true // Markeer deze als populair
        },
        {
          name: "Fauteuil",
          price: 75,
          features: ["Dieptereiniging", "Geurverwijdering", "Licht vochtig na behandeling"]
        }
      ],
      importantNotes: { minimumOrder: "€75", dryingTime: "4–8 uur", resultInfo: "Afhankelijk van vervuiling" }
    },
    bank: {
      id: "bankreiniging",
      title: "Bankreiniging",
      description: "Diepe reiniging van uw bank om vlekken te verwijderen, of gewoon om de bank weer een nieuw leven in te blazen.",
      popularOrder: 3, // Derde meest populair
      imageUrl: "couch.jpg",
      packages: [
        {
          name: "Standaard Bank",
          price: "Vanaf €75",
          features: ["2-zits (€75)", "3-zits (€95)", "4-zits (€115)"],
          isPopular: true
        },
        {
          name: "Hoekbank",
          price: "Vanaf €125",
          features: ["Klein (€125)", "Middel (€145)", "Groot/U-vorm (€165+)"]
        }
      ],
      importantNotes: { minimumOrder: "€75", dryingTime: "4–8 uur", resultInfo: "Resultaat afhankelijk van stof" }
    },
    auto: {
      id: "auto-interieur",
      title: "Auto Interieur",
      description: "Complete opfrisbeurt voor uw auto interieur voor een fris en nieuw gevoel tijdens het rijden.",
      popularOrder: 1, // Meest populair
      imageUrl: "car.jpg",
      packages: [
        {
          name: "Interieur Basis Clean",
          price: 100,
          features: ["Stofzuigen", "Dashboard & panelen", "Ramen binnenzijde", "Luchtroosters"]
        },
        {
          name: "Interieur Deep Clean",
          price: 150,
          features: ["Alles van Basis Clean", "Dieptereiniging stoelen", "Leder behandeling", "Geurverbetering"],
          isPopular: true // De 'Meest gekozen' van de auto pagina
        },
        {
          name: "Stoel & Vlekken Clean",
          price: 60,
          features: ["Dieptereiniging zitplekken", "Stofzuigen", "Vlek & geurverwijdering"]
        }
      ],
      importantNotes: { dryingTime: "ca. 2 uur", resultInfo: "Prijzen incl. btw voor particulieren" }
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