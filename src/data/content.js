// Central source of truth for all content, copy, prices, addresses, and images.
// The HTML and JS templates consume this data to keep the site modular and reusable.

export const content = {
  meta: {
    title: "Demo Cafe | Iced coffee and cold drinks",
    description:
      "Independent specialty cafe serving freshly brewed iced coffee, ceremonial matcha, and fruit coolers in Hyderabad. Made to order with filtered water ice.",
    url: "https://demo-cafe.vercel.app",
    ogImage: "/images/og-image.jpg"
  },

  brand: {
    name: "Demo Cafe",
    tagline: "Specialty iced drinks & calm spaces",
    phone: "+91 98765 43210",
    phoneRaw: "919876543210",
    email: "hello@democafe.in",
    currency: "₹"
  },

  nav: {
    brand: "Demo Cafe",
    links: [
      { label: "Menu", href: "#menu" },
      { label: "Why Visit", href: "#visit" },
      { label: "Gallery", href: "#gallery" },
      { label: "Find us", href: "#find-us" },
      { label: "Offers", href: "#offer" }
    ],
    cta: {
      label: "Order on WhatsApp",
      message: "Hi, I would like to order from Demo Cafe."
    }
  },

  hero: {
    heading: "ICED COFFEE",
    scriptAccent: "summer edition",
    subline: "Cold drinks brewed fresh to order, in the middle of the city.",
    primaryCta: {
      label: "View the menu",
      href: "#menu"
    },
    secondaryCta: {
      label: "Get 15% off",
      href: "#offer"
    },
    cups: [
      {
        id: "hero-latte",
        src: "/images/drink-iced-latte.webp",
        alt: "Iced latte with swirling milk over ice",
        name: "Iced Latte",
        speed: 0.16
      }
    ]
  },

  feature: {
    label: "01 / Crave",
    heading: "WHEN YOU CRAVE SOMETHING COLD",
    scriptAccent: "anytime",
    body: "Long day, hot streets, a meeting that ran over? Our iced drinks are made to order with freshly pulled espresso, real fruit, and ice made from filtered water. The last sip should taste like the first.",
    facts: [
      {
        title: "Made to order",
        description: "Never pre-poured or held in morning pitchers. Pulled fresh as soon as you order."
      },
      {
        title: "Filtered water ice",
        description: "Dense, crystal-clear ice blocks that chill evenly without rapid watery dilution."
      },
      {
        title: "Oat and dairy milk",
        description: "Silky whole dairy from regional farms or rich barista-grade oat milk alternatives."
      }
    ],
    image: {
      src: "/images/feature-iced-coffee.webp",
      alt: "Tall glass of iced coffee with swirling milk next to a glass carafe",
      width: 1100,
      height: 1375
    }
  },

  menu: {
    label: "02 / Menu",
    heading: "CHOOSE YOUR FLAVOUR",
    scriptAccent: "favourite",
    items: [
      { id: "caramel-latte", index: "01", name: "Iced Caramel Latte", description: "Double espresso, cold milk, house caramel, poured over ice.", price: 220, cutout: "/images/drink-caramel-latte.webp", alt: "Iced Caramel Latte in a tall glass with a golden caramel swirl", badge: "House Favorite" },
      { id: "cold-brew", index: "02", name: "Cold Brew", description: "Steeped for 18 hours. Smooth and low in acid.", price: 230, cutout: "/images/drink-cold-brew.webp", alt: "Cold brew coffee in a tall glass with milk swirling through", badge: "18h Steep" },
      { id: "matcha-latte", index: "03", name: "Iced Matcha Latte", description: "Ceremonial matcha whisked with oat milk over crushed ice.", price: 250, cutout: "/images/drink-matcha.webp", alt: "Iced matcha latte with ice cubes in a clear cup", badge: "Ceremonial" },
      { id: "mango-cooler", index: "04", name: "Mango Cooler", description: "Ripe mango, mint, and lime, shaken over ice.", price: 190, cutout: "/images/drink-mango-cooler.webp", alt: "Mango cooler in a tall glass with a straw and lime", badge: "Seasonal Fruit" },
      { id: "vanilla-iced-coffee", index: "05", name: "Vanilla Iced Coffee", description: "Espresso, vanilla syrup, and cold milk. The classic.", price: 200, cutout: "/images/drink-vanilla-iced-coffee.webp", alt: "Vanilla iced coffee in a clear cup with a straw", badge: "Classic" },
      { id: "iced-latte", index: "06", name: "Iced Latte", description: "Two shots of espresso, cold milk, lots of ice. Simple and smooth.", price: 180, cutout: "/images/drink-iced-latte.webp", alt: "Iced latte with swirling milk over ice", badge: "Everyday" },
      { id: "cold-chocolate", index: "07", name: "Cold Chocolate", description: "Dark cocoa, milk, and a pinch of cinnamon, served chilled.", price: 210, cutout: "/images/drink-cold-chocolate.webp", alt: "Cold chocolate topped with whipped cream and a cookie", badge: "70% Dark Cocoa" },
      { id: "lemon-iced-tea", index: "08", name: "Lemon Iced Tea", description: "Black tea brewed cold, fresh lemon, a touch of honey.", price: 150, cutout: "/images/drink-lemon-iced-tea.webp", alt: "Cold black tea in a highball glass with lemon and mint", badge: "Cold Steeped" }
    ]
  },

  visit: {
    label: "03 / Visit",
    heading: "WHY YOU SHOULD STOP BY",
    scriptAccent: "stay a while",
    features: [
      {
        id: "brewed-to-order",
        title: "Brewed to order",
        description: "Every drink is made when you order it, not batched in the morning.",
        icon: "brewed"
      },
      {
        id: "easy-to-reach",
        title: "Easy to reach",
        description: "On the main road, with parking nearby and a short walk from the bus stop.",
        icon: "reach"
      },
      {
        id: "room-to-work",
        title: "Room to work",
        description: "Quiet corners, fast Wi-Fi, and a plug point at every table.",
        icon: "work"
      }
    ],
    image: {
      src: "/images/visit-cafe-interior.webp",
      alt: "Bright cafe interior with large windows, sunlight, and green plants",
      width: 1200,
      height: 900
    }
  },

  gallery: {
    label: "04 / Gallery",
    heading: "A COOL CORNER FOR YOUR DAY",
    scriptAccent: "come in",
    tiles: [
      { id: "g1", caption: "Window seats", src: "/images/gallery-1.webp", alt: "Cozy sunlit cafe table by the window with plants" },
      { id: "g2", caption: "Siphon brew", src: "/images/gallery-2.webp", alt: "Barista pouring siphon-brewed coffee into a cup" },
      { id: "g3", caption: "Latte art", src: "/images/gallery-latte-art.webp", alt: "Latte art in a teal cup seen from above" },
      { id: "g4", caption: "The bar", src: "/images/gallery-4.webp", alt: "Stylish cafe interior with a wooden counter and stools" },
      { id: "g5", caption: "Our baristas", src: "/images/gallery-barista.webp", alt: "Smiling barista in an apron behind the espresso bar" },
      { id: "g6", caption: "Terrace", src: "/images/gallery-terrace.webp", alt: "Cobblestone cafe terrace with a chalkboard menu" },
      { id: "g7", caption: "Late afternoons", src: "/images/gallery-5.webp", alt: "Two friends talking over coffee at a wooden table" }
    ]
  },

  findUs: {
    label: "05 / Find us",
    heading: "FIND US IN HYDERABAD",
    scriptAccent: "nearby",
    hours: "Monday to Sunday, 8:00 AM to 11:00 PM",
    map: {
      lat: 17.3850,
      lng: 78.4867,
      zoom: 12
    },
    locations: [
      {
        name: "Jubilee Hills",
        address: "Shop 4, Ground Floor, Road No. 36, Jubilee Hills, Hyderabad",
        lat: 17.4319,
        lng: 78.4073,
        mapsQuery: "Road No 36, Jubilee Hills, Hyderabad"
      },
      {
        name: "Banjara Hills",
        address: "Plot 12, Ground Floor, Road No. 10, Banjara Hills, Hyderabad",
        lat: 17.4156,
        lng: 78.4350,
        mapsQuery: "Road No 10, Banjara Hills, Hyderabad"
      },
      {
        name: "Hitec City",
        address: "Tower B Courtyard, Mindspace Tech Park, Hitec City, Hyderabad",
        lat: 17.4474,
        lng: 78.3762,
        mapsQuery: "Mindspace Tech Park, Hitec City, Hyderabad"
      }
    ]
  },

  offer: {
    label: "06 / Offer",
    heading: "DON'T MISS YOUR",
    scriptAccent: "first sip",
    body: "Message us on WhatsApp to get 15% off your first order. Mention this website.",
    cta: "Claim 15% off on WhatsApp",
    badgeText: "15% OFF FIRST ORDER • DEMO CAFE • ",
    message: "Hi, I saw your website and would like the 15% off first order."
  },

  footer: {
    wordmark: "Demo Cafe",
    tagline: "Cold drinks brewed fresh to order, in the middle of the city.",
    menuLinks: [
      { label: "Iced Caramel Latte", href: "#menu" },
      { label: "Cold Brew", href: "#menu" },
      { label: "Iced Matcha Latte", href: "#menu" },
      { label: "Mango Cooler", href: "#menu" },
      { label: "Vanilla Iced Coffee", href: "#menu" }
    ],
    visitInfo: {
      hours: "Monday to Sunday, 8:00 AM to 11:00 PM",
      phone: "+91 98765 43210",
      email: "hello@democafe.in"
    },
    socials: [
      { label: "Instagram", href: "https://instagram.com", handle: "@democafe.hyd" },
      { label: "Facebook", href: "https://facebook.com", handle: "Demo Cafe Hyderabad" }
    ],
    bottomLine: "2026 Demo Cafe. Sample website."
  }
};

// Export named constants for modules
export const BRAND = {
  ...content.brand,
  whatsappDefaultMessage: "Hi Demo Cafe! I would like to order fresh iced coffee."
};

export const MENU_ITEMS = content.menu.items.map(item => ({
  ...item,
  image: item.cutout || item.image
}));
