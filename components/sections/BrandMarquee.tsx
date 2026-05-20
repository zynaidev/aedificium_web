import Container from "@/components/ui/Container";

const BRANDS = [
  "101 Copenhagen","41Zero42","A-N-D","ABK Group","Adea","Adriani e Rossi","Agape","Agape Casa","Albed","Alice Ceramica","Alivar","Almalight","Alonpi","Altrenotti","Antique Mirror","Antrax IT","Aquaelite","Armony","Artelinea","Aster Cucine","Atlas Concorde","Axolight","Bang&Olufsen","Barausse","Barovier&Toso","Belarte Studio","Bertocci","Birex","Bizzotto","Boca do Lobo","BOMMA","Bosa","BRABBU","Brokis","BuzziSpace","Calligaris","Cappellini","Carpet Edition","Casabath","Cattelan Italia","CEA Design","Ceramica Cielo","Ceramica Flaminia","Cinier","Connubia","Cosentino","CTO Lighting","Dallagnese","DEDAR","DelightFULL","Desalto","Diabla","District Eight","Driade","Edra","Élitis","Enrico Pellizzoni","Essential Home","Ethimo","Expormim","Fantini","FLOS","Flou","Fontana Arte","Forestier","Fredericia Furniture","Gaggenau","GAN Rugs","Gandia Blasco","Gervasoni","Ghidini 1961","Glass Design","Gloster","Henge Kitchens","House Nordic","IdeaGroup","Ideal Lux","Il Fanale","Imola Ceramiche","KARMAN","Kartell","Kave Home","La Palma","LAMINAM","LEMA Mobili","Les Jardins","Listone Giordano","LUXXU","Maison Valentina","Mattiazzi","Meridiani","Moooi","Muuto","NEMO Lighting","Nordic Knots","Norr11","Paola Lenti","Pedrali","Petite Friture","FLOS","Rubelli","Saba Italia","Scavolini","Seletti","SICIS","Talenti","Tonelli Design","TUBES","Vibia","Viccarbe","Visionnaire","Warm Nordic","Zanotta","Zucchetti"
];

const ROW1 = BRANDS.slice(0, 36);
const ROW2 = BRANDS.slice(36, 72);
const ROW3 = BRANDS.slice(72);

function MarqueeRow({ brands, reverse }: { brands: string[]; reverse?: boolean }) {
  const items = [...brands, ...brands];
  return (
    <div style={{ overflow: "hidden", maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" }}>
      <div className={reverse ? "marquee-right" : "marquee-left"} style={{ display: "flex", width: "max-content", gap: "0" }}>
        {items.map((brand, i) => (
          <span key={i} style={{ fontFamily: "var(--font-inter)", fontSize: "12px", letterSpacing: "0.08em", color: "var(--text-secondary)", whiteSpace: "nowrap", padding: "0 20px" }}>
            {brand} <span style={{ color: "var(--text-tertiary)", margin: "0 4px" }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function BrandMarquee() {
  return (
    <section style={{ padding: "var(--space-section-desktop) 0", borderTop: "1px solid var(--border-hairline)" }}>
      <Container>
        <p style={{ fontFamily: "var(--font-inter)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-tertiary)", marginBottom: "40px" }}>
          Selected brands in the AEDIFICIUM network
        </p>
      </Container>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <MarqueeRow brands={ROW1} />
        <MarqueeRow brands={ROW2} reverse />
        <MarqueeRow brands={ROW3} />
      </div>
    </section>
  );
}
