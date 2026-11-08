// Map Module: Leaflet map centered on Hyderabad with warm tile filter,
// custom pins, pulsing matcha halos, and bounce drop animation.

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { content } from "../data/content.js";

gsap.registerPlugin(ScrollTrigger);

export function initMap() {
  const mapEl = document.getElementById("cafe-map");
  if (!mapEl) return;

  const mapData = content.findUs.map;
  const locations = content.findUs.locations;

  // Initialize Leaflet Map
  const map = L.map(mapEl, {
    center: [mapData.lat, mapData.lng],
    zoom: mapData.zoom,
    scrollWheelZoom: false, // scroll-wheel zoom disabled as required
    zoomControl: true,
    attributionControl: true
  });

  // OpenStreetMap Tile Layer with standard attribution
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors'
  }).addTo(map);

  // Custom Matcha Halo Marker Icon
  const createCustomIcon = (name) => {
    return L.divIcon({
      className: "custom-cafe-marker",
      html: `
        <div class="marker-halo" aria-hidden="true"></div>
        <div class="marker-pin" title="${name}"></div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 22],
      popupAnchor: [0, -22]
    });
  };

  const markers = [];

  locations.forEach((loc) => {
    const marker = L.marker([loc.lat, loc.lng], {
      icon: createCustomIcon(loc.name),
      title: loc.name
    }).addTo(map);

    marker.bindPopup(`
      <div style="font-family: var(--font-body); padding: 4px;">
        <strong style="font-family: var(--font-display); font-size: 16px; color: #2A1B12; display: block; margin-bottom: 4px;">${loc.name}</strong>
        <p style="font-size: 13px; color: #6B5444; margin-bottom: 8px; line-height: 1.4;">${loc.address}</p>
        <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.mapsQuery)}" target="_blank" rel="noopener noreferrer" style="color: #C8643B; font-weight: 600; font-size: 13px; text-decoration: none;">Get Directions &rarr;</a>
      </div>
    `);

    markers.push(marker);
  });

  // Fit bounds nicely so all 3 Hyderabad locations are visible
  const group = new L.featureGroup(markers);
  map.fitBounds(group.getBounds().pad(0.25));

  // Marker drop animation with short bounce when map enters view
  ScrollTrigger.create({
    trigger: "#find-us",
    start: "top 70%",
    once: true,
    onEnter: () => {
      // Invalidate size to ensure Leaflet renders all tiles cleanly
      map.invalidateSize();

      const pins = mapEl.querySelectorAll(".marker-pin");
      gsap.fromTo(
        pins,
        { y: -24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.12,
          ease: "back.out(1.7)"
        }
      );
    }
  });

  return map;
}
