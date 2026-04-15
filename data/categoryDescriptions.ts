import { ElementCategory, Classification } from '../types';

export interface CategoryDescription {
  en: string;
  zh: string;
}

export const CLASSIFICATION_DESCRIPTIONS: Record<Classification, CategoryDescription> = {
  metal: {
    en: "Metals are elements characterized by their lustrous appearance, high density, and excellent thermal and electrical conductivity. Most metals are solids at room temperature (mercury is a notable exception) and possess high melting points. They are generally malleable (can be hammered into sheets) and ductile (can be drawn into wires). Chemically, metals tend to have low ionization energies and electronegativities, leading them to lose electrons easily and form positive ions (cations) in chemical reactions. They typically form basic oxides when reacted with oxygen.",
    zh: "金属是具有光泽、高密度以及优异导热性和导电性的元素。大多数金属在室温下为固体（汞是一个显著的例外），并具有较高的熔点。它们通常具有良好的延展性（可以锤成薄片）和韧性（可以拉成细丝）。在化学性质上，金属倾向于具有较低的电离能和电负性，这使得它们在化学反应中容易失去电子并形成正离子（阳离子）。当与氧反应时，它们通常形成碱性氧化物。"
  },
  'non-metal': {
    en: "Non-metals are elements that lack the physical and chemical characteristics of metals. They exhibit a wide range of physical states at room temperature, including gases (like oxygen and nitrogen), liquids (bromine), and brittle solids (like sulfur and phosphorus). Non-metals are generally poor conductors of heat and electricity and have relatively low melting and boiling points compared to metals. Chemically, they have high electronegativities and ionization energies, tending to gain or share electrons to form negative ions (anions) or covalent bonds. Their oxides are typically acidic or neutral.",
    zh: "非金属是缺乏金属性质和化学特征的元素。它们在室温下表现出广泛的物理状态，包括气体（如氧和氮）、液体（溴）和脆性固体（如硫和磷）。非金属通常是热和电的不良导体，与金属相比，其熔点和沸点相对较低。在化学性质上，它们具有较高的电负性和电离能，倾向于获得或共享电子以形成负离子（阴离子）或共价键。它们的氧化物通常是酸性或中性的。"
  },
  metalloid: {
    en: "Metalloids, also known as semi-metals, possess properties that are intermediate between those of metals and non-metals. They often have a metallic luster but are physically brittle, lacking the malleability of true metals. One of their most significant characteristics is their semi-conductivity; their electrical conductivity increases with temperature, which is the opposite of how metals behave. This unique property makes metalloids like silicon and germanium indispensable in the electronics and semiconductor industries. Chemically, they can behave as either metals or non-metals depending on the elements they react with.",
    zh: "类金属（又称半金属）具有介于金属和非金属之间的性质。它们通常具有金属光泽，但物理性质较脆，缺乏真金属的延展性。它们最显著的特征之一是半导电性；它们的电导率随温度升高而增加，这与金属的行为相反。这种独特的性质使得硅和锗等类金属在电子和半导体工业中不可或缺。在化学性质上，它们可以根据与之反应的元素表现为金属或非金属。"
  }
};

export const CATEGORY_DESCRIPTIONS: Record<ElementCategory, CategoryDescription> = {
  'alkali-metal': {
    en: "Alkali metals (Group 1, excluding Hydrogen) are the most reactive metals in the periodic table. They are soft enough to be cut with a knife and have a shiny, silvery appearance when freshly cut, though they tarnish quickly in air. They have a single valence electron (ns¹ configuration), which they lose very easily to form +1 ions. Due to their extreme reactivity, they are never found free in nature and react vigorously, sometimes explosively, with water to produce hydrogen gas and strong alkaline hydroxides. They also exhibit low densities and low melting points compared to other metals.",
    zh: "碱金属（第1族，不包括氢）是元素周期表中活性最强的金属。它们非常柔软，可以用小刀切割，切开时具有闪亮的银色外观，但在空气中会迅速变暗。它们有一个价电子（ns¹ 构型），非常容易失去电子形成 +1 价离子。由于其极高的活性，它们在自然界中从未以游离态存在，并且与水剧烈反应（有时会发生爆炸），产生氢气和强碱性氢氧化物。与其他金属相比，它们还具有较低的密度和较低的熔点。"
  },
  'alkaline-earth-metal': {
    en: "Alkaline earth metals (Group 2) are shiny, silvery-white metals that are somewhat less reactive than alkali metals but still highly reactive. They possess two valence electrons (ns² configuration), which they lose to form +2 ions. These elements are generally harder, denser, and have higher melting points than the alkali metals in the same period. While they do react with water (except for beryllium), the reactions are generally less violent. Many of these elements are found in common minerals in the Earth's crust, and their oxides are basic (alkaline) in nature.",
    zh: "碱土金属（第2族）是闪亮的银白色金属，其活性略低于碱金属，但仍具有很高的活性。它们拥有两个价电子（ns² 构型），失去电子后形成 +2 价离子。这些元素通常比同一周期的碱金属更硬、密度更大，且熔点更高。虽然它们确实会与水反应（铍除外），但反应通常不那么剧烈。这些元素中的许多存在于地壳的常见矿物中，其氧化物本质上是碱性的。"
  },
  'transition-metal': {
    en: "Transition metals (Groups 3-12) are characterized by the filling of their d-orbitals. They are typically hard, strong, and dense metals with high melting and boiling points. Unlike Groups 1 and 2, transition metals often exhibit multiple oxidation states (e.g., Iron as +2 or +3) and frequently form brightly colored compounds. Many transition metals and their compounds are excellent catalysts for chemical reactions. They also possess high tensile strength and are good conductors of heat and electricity. This group includes well-known metals like gold, silver, iron, and copper.",
    zh: "过渡金属（第3-12族）的特征是d轨道的填充。它们通常是坚硬、坚固且致密的金属，具有高熔点和高沸点。与第1族和第2族不同，过渡金属通常表现出多种氧化态（例如铁为 +2 或 +3），并经常形成颜色鲜艳的化合物。许多过渡金属及其化合物是化学反应的优异催化剂。它们还具有高抗拉强度，是热和电的良导体。该组包括黄金、白银、铁和铜等著名金属。"
  },
  'post-transition-metal': {
    en: "Post-transition metals are located between the transition metals and the metalloids. While they are metallic, they tend to be softer and have lower melting points than transition metals. They also exhibit higher electronegativities and their valence electrons are more tightly bound. This group includes elements like aluminum, tin, and lead. Unlike transition metals, they generally do not show variable oxidation states as frequently, and their compounds are often less colored. They are sometimes referred to as 'poor metals' due to their lower mechanical strength compared to transition metals.",
    zh: "后过渡金属位于过渡金属和类金属之间。虽然它们具有金属性，但与过渡金属相比，它们往往更软且熔点更低。它们还表现出较高的电负性，其价电子结合得更紧密。该组包括铝、锡和铅等元素。与过渡金属不同，它们通常不那么频繁地表现出可变氧化态，且其化合物通常颜色较淡。由于其机械强度低于过渡金属，它们有时被称为“贫金属”。"
  },
  'metalloid': {
    en: "Metalloids (or semi-metals) have properties that are a blend of metallic and non-metallic characteristics. They are typically solid at room temperature and have a metallic appearance, but they are brittle rather than malleable. Their most defining feature is their semi-conductivity, which allows them to conduct electricity better than insulators but not as well as metals. This property is highly tunable, making them the backbone of modern electronics, particularly in the fabrication of computer chips and solar cells. Common metalloids include silicon, germanium, arsenic, and antimony.",
    zh: "类金属（或半金属）具有金属和非金属特征混合的性质。它们在室温下通常为固体，具有金属外观，但性质较脆而非延展。它们最明确的特征是半导电性，这使得它们比绝缘体导电更好，但不如金属。这种性质是高度可调的，使它们成为现代电子工业的支柱，特别是在计算机芯片和太阳能电池的制造中。常见的类金属包括硅、锗、砷和锑。"
  },
  'reactive-nonmetal': {
    en: "Reactive nonmetals are elements that readily participate in chemical reactions, typically by gaining or sharing electrons. This diverse group includes the halogens (Group 17), which are the most reactive nonmetals, as well as elements essential for life like carbon, nitrogen, oxygen, phosphorus, and sulfur. They have high electronegativities and generally form covalent bonds with each other or ionic bonds with metals. At room temperature, they exist in various states: oxygen and nitrogen are gases, bromine is a liquid, and carbon and sulfur are solids. They are vital in biological processes and industrial chemistry.",
    zh: "活泼非金属是容易参与化学反应的元素，通常通过获得或共享电子来实现。这个多样化的群体包括卤素（第17族），它们是活性最强的非金属，以及碳、氮、氧、磷和硫等生命必需元素。它们具有较高的电负性，通常彼此形成共价键，或与金属形成离子键。在室温下，它们以各种状态存在：氧和氮是气体，溴是液体，碳和硫是固体。它们在生物过程和工业化学中至关重要。"
  },
  'noble-gas': {
    en: "Noble gases (Group 18) are characterized by their extreme chemical stability and low reactivity. This is due to their full valence electron shells (a complete octet, except for Helium which has a full duet), which makes them energetically stable. They are all colorless, odorless, and tasteless monatomic gases at room temperature. Because of their inertness, they were once called 'inert gases.' They have very low boiling and melting points. Noble gases find use in lighting (neon signs), welding (argon shielding), and cryogenics (liquid helium). Under extreme conditions, heavier noble gases like xenon can form compounds.",
    zh: "稀有气体（第18族）的特征是极高的化学稳定性和低活性。这是由于它们具有完整的价电子层（完整的八隅体，氦除外，它具有完整的二隅体），这使得它们在能量上非常稳定。它们在室温下都是无色、无味、无嗅的单原子气体。由于其惰性，它们曾被称为“惰性气体”。它们具有极低的沸点和熔点。稀有气体广泛用于照明（霓虹灯）、焊接（氩气保护）和低温学（液氦）。在极端条件下，较重的稀有气体（如氙）可以形成化合物。"
  },
  'lanthanide': {
    en: "Lanthanides are a series of 15 metallic elements with atomic numbers 57 through 71. Often called 'rare earth elements,' they are actually relatively abundant in the Earth's crust but difficult to separate from their ores. They are silvery-white metals that tarnish when exposed to air and are relatively soft. Lanthanides are known for their high magnetic susceptibility and unique optical properties, making them essential in high-tech applications such as powerful permanent magnets (neodymium), lasers, camera lenses, and phosphors for television and computer screens. They typically form +3 oxidation states.",
    zh: "镧系元素是原子序数为57至71的15种金属元素。它们通常被称为“稀土元素”，实际上它们在地壳中相对丰富，但很难从矿石中分离出来。它们是银白色金属，暴露在空气中会变暗，且相对较软。镧系元素以其高磁化率和独特的光学性质而闻名，使其在高科技应用中不可或缺，如强力永磁体（钕）、激光器、照相机镜头以及电视和电脑屏幕的荧光粉。它们通常形成 +3 氧化态。"
  },
  'actinide': {
    en: "Actinides consist of 15 metallic elements with atomic numbers 89 through 103. All actinides are radioactive and have very large atomic radii. While thorium and uranium occur naturally in significant quantities, most other actinides are synthetic elements produced in nuclear reactors or particle accelerators. They are typically dense, silvery metals that react with boiling water or dilute acids to release hydrogen gas. Actinides exhibit a wide range of oxidation states. Elements like uranium and plutonium are critical as fuel in nuclear power plants and in the production of nuclear weapons.",
    zh: "锕系元素由原子序数为89至103的15种金属元素组成。所有锕系元素都具有放射性，并具有非常大的原子半径。虽然钍和铀在自然界中大量存在，但大多数其他锕系元素是在核反应堆或粒子加速器中产生的人工合成元素。它们通常是致密的银色金属，与沸水或稀酸反应释放氢气。锕系元素表现出广泛的氧化态。铀和钚等元素作为核电站燃料和核武器生产至关重要。"
  },
  'unknown': {
    en: "Unknown elements refer to those whose physical and chemical properties have not yet been experimentally verified or fully characterized. These are typically superheavy elements with very high atomic numbers that are highly unstable and have extremely short half-lives (often measured in milliseconds or less). Because they can only be produced in minute quantities through complex nuclear synthesis, scientists must rely on theoretical models and periodic trends to predict their behavior. As research continues, these elements may eventually be assigned to specific chemical groups.",
    zh: "未知元素是指其物理和化学性质尚未经过实验验证或完全表征的元素。这些通常是具有极高原子序数的超重元素，它们高度不稳定且半衰期极短（通常以毫秒或更短的时间计）。由于它们只能通过复杂的核合成以极微小的量产生，科学家必须依靠理论模型和周期性趋势来预测它们的行为。随着研究的深入，这些元素最终可能会被分配到特定的化学组。"
  }
};
