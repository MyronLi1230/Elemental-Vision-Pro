import { Language } from '../types';

export interface Description {
  en: string;
  zh: string;
}

export const GROUP_DESCRIPTIONS: Record<number, Description> = {
  1: {
    en: "Group 1 includes hydrogen and the alkali metals, which have one electron in their outermost s sub-shell. The alkali metals are soft, highly reactive metals, and their reactivity increases down the group. Hydrogen behaves very differently from elements in the lower periods and so scientists disagree over whether it should belong to group 1 or 17.",
    zh: "第1族包括氢和碱金属，它们的最外层s亚层只有一个电子。碱金属是质软、高活性的金属，其活性随周期增加而增强。氢的行为与较低周期的元素截然不同，因此科学家们对于它应该属于第1族还是第17族存在分歧。"
  },
  2: {
    en: "The group 2 elements are also called the ‘alkaline earth metals’. They are all reactive metals with distinctive flame colours. In general they are harder, denser and have higher melting points than each alkali metal in the same period. Group 2 elements have two electrons in their outermost s sub-shell.",
    zh: "第2族元素也被称为“碱土金属”。它们都是具有独特焰色的活性金属。通常情况下，它们比同一周期的碱金属更硬、密度更大、熔点更高。第2族元素在其最外层s亚层有两个电子。"
  },
  3: {
    en: "Group 3 is a family of transition metal elements. They each have a valence electron configuration of d1s2. They are most often found in the +3 oxidation state. Scientists do not always agree whether lanthanum and actinium, or lutetium and lawrencium, should be included in this group.",
    zh: "第3族是过渡金属元素家族。它们的价电子排布均为d1s2。它们最常以+3氧化态存在。科学家们对于镧和锕，还是镥和铹应该被包含在该族中并不总是达成一致。"
  },
  4: {
    en: "Group 4 is a group of transition metal elements with high melting points. They typically have a valence electron configuration of d2s2.",
    zh: "第4族是一组具有高熔点的过渡金属元素。它们的价电子排布通常为d2s2。"
  },
  5: {
    en: "Group 5 is a group of reactive transition metal elements with high melting points. They typically have a valence electron configuration of d3s2.",
    zh: "第5族是一组具有高熔点的活性过渡金属元素。它们的价电子排布通常为d3s2。"
  },
  6: {
    en: "Group 6 is a group of transition metal elements. The aufbau principle predicts that they will each have a valence electron configuration of d4s2. However, chromium and molybdenum are exceptions to this rule and have a valence electron configuration of d5s1.",
    zh: "第6族是一组过渡金属元素。构造原理预测它们的价电子排布均为d4s2。然而，铬和钼是这一规则的例外，它们的价电子排布为d5s1。"
  },
  7: {
    en: "Group 7 is a group of transition metal elements containing manganese, technetium, rhenium and bohrium. They typically have a valence electron configuration of d5s2.",
    zh: "第7族是一组过渡金属元素，包含锰、锝、铼和𬭛。它们的价电子排布通常为d5s2。"
  },
  8: {
    en: "Note: If you’re looking for the Halogens, click on group 17. Group 8 is a group of shiny, silvery transition metals containing iron, ruthenium, osmium and hassium. They typically have a valence electron configuration of d6s2.",
    zh: "注意：如果您在寻找卤素，请点击第17族。第8族是一组闪亮的银白色过渡金属，包含铁、钌、锇和𬭶。它们的价电子排布通常为d6s2。"
  },
  9: {
    en: "Note: If you’re looking for the Noble gases, click on group 18. Group 9 is a group of silvery-white transition metal elements with high melting points. The group contains cobalt, rhodium, iridium and meitnerium. They typically have a valence electron configuration of d7s2.",
    zh: "注意：如果您在寻找稀有气体，请点击第18族。第9族是一组具有高熔点的银白色过渡金属元素。该族包含钴、铑、铱和𬭚。它们的价电子排布通常为d7s2。"
  },
  10: {
    en: "Group 10 is a group of white to light grey transition metal elements. The group contains nickel, palladium, platinum and darmstadtium. The aufbau principle predicts that they will each have a valence electron configuration of d8s2, however, palladium, platinum and darmstadtium are all exceptions to this rule.",
    zh: "第10族是一组白色至浅灰色的过渡金属元素。该族包含镍、钯、铂和𬭼。构造原理预测它们的价电子排布均为d8s2，然而，钯、铂和𬭼都是这一规则的例外。"
  },
  11: {
    en: "Group 11 is a group of transition metals. The group includes copper, silver and gold, which are sometimes called the 'coinage metals'. They typically have a valence electron configuration of d10s1.",
    zh: "第11族是一组过渡金属。该族包括铜、银和金，有时被称为“造币金属”。它们的价电子排布通常为d10s1。"
  },
  12: {
    en: "Group 12 is a group of metals. They each have a full d sub-shell. The elements in this group tend to have low melting points and mercury is the only metal that is a liquid at room temperature.",
    zh: "第12族是一组金属。它们都具有充满的d亚层。该族元素往往具有较低的熔点，汞是唯一在室温下呈液态的金属。"
  },
  13: {
    en: "Group 13 is the boron group. All the elements in this group are metals except for boron, which is a metalloid. Boron and aluminium each have three electrons in their outer electron shell.",
    zh: "第13族是硼族。除硼（类金属）外，该族所有元素均为金属。硼和铝的外层电子层各有三个电子。"
  },
  14: {
    en: "Group 14 is the carbon group. It contains a combination of non-metals, metalloids and metals. Carbon and silicon each have four electrons in their outer electron shell.",
    zh: "第14族是碳族。它包含非金属、类金属和金属的组合。碳和硅的外层电子层各有四个电子。"
  },
  15: {
    en: "Group 15 is called the pnictogens or nitrogen group. It contains a combination of non-metals, metalloids and metals. Nitrogen and phosphorus each have five electrons in their outer electron shell.",
    zh: "第15族被称为氮族。它包含非金属、类金属和金属的组合。氮和磷的外层电子层各有五个电子。"
  },
  16: {
    en: "Group 16 is called the chalcogens, or oxygen family. It contains a combination of non-metals, metalloids and metals. Oxygen and sulfur have six electrons in their outer electron shell.",
    zh: "第16族被称为氧族。它包含非金属、类金属和金属的组合。氧和硫的外层电子层各有六个电子。"
  },
  17: {
    en: "Group 17 is called the halogens. This is a group of highly reactive non-metals. This is the only group that contains elements in all three states of matter at room temperature and pressure. Fluorine and chlorine are gases, bromine is a liquid and iodine is a solid. Fluorine and chlorine have seven electrons in their outer electron shell.",
    zh: "第17族被称为卤素。这是一组高活性的非金属。这是唯一一个在室温常压下包含所有三种物质状态元素的族。氟和氯是气体，溴是液体，碘是固体。氟和氯的外层电子层各有七个电子。"
  },
  18: {
    en: "The group 18 elements are commonly known as the noble gases. They are typically unreactive. At one time they were known as the inert gases, but some compounds (particularly of Xe) are now known. Reactivity increases down the group with radon being the most reactive. The noble gases each have a full outer electron shell.",
    zh: "第18族元素通常被称为稀有气体。它们通常不活泼。曾一度被称为惰性气体，但现在已知一些化合物（特别是氙的化合物）。活性随周期增加而增强，氡是其中活性最强的。稀有气体都具有完整的核外电子层。"
  }
};

export const PERIOD_DESCRIPTIONS: Record<string | number, Description> = {
  1: {
    en: "Period 1: The shortest period in the periodic table, containing only two elements: Hydrogen and Helium. These elements fill the 1s orbital. Hydrogen is unique as it can behave like both an alkali metal and a halogen. Helium is the most stable and least reactive element. Despite its simplicity, Period 1 elements make up over 99% of the visible matter in the universe, primarily in stars and gas giants.",
    zh: "第一周期：周期表中最短的周期，仅包含两个元素：氢和氦。这些元素填充1s轨道。氢的独特之处在于它既表现出碱金属的性质，又表现出卤素的性质。氦是已知最稳定、活性最低的元素。尽管结构简单，但第一周期元素构成了宇宙中超过99%的可见物质，主要存在于恒星和气态巨行星中。"
  },
  2: {
    en: "Period 2: Contains 8 elements, from Lithium to Neon. These elements fill the 2s and 2p orbitals. This period includes the fundamental building blocks of life: Carbon, Nitrogen, and Oxygen. It shows a clear trend from highly reactive metals (Li, Be) to metalloids (B), then to non-metals (C, N, O, F), and finally to a noble gas (Ne). Period 2 elements are characterized by their small atomic radii and high electronegativities compared to heavier elements in their respective groups.",
    zh: "第二周期：包含从锂到氖的8个元素。这些元素填充2s和2p轨道。该周期包含了生命的基础构建块：碳、氮和氧。它表现出从高活性金属（锂、铍）到类金属（硼），再到非金属（碳、氮、氧、氟），最后到稀有气体（氖）的清晰趋势。与同族中较重的元素相比，第二周期元素的特点是原子半径小、电负性高。"
  },
  3: {
    en: "Period 3: Contains 8 elements, from Sodium to Argon, filling the 3s and 3p orbitals. Like Period 2, it follows the octet rule for stability. This period includes vital industrial and biological elements such as Aluminum (the most common metal in Earth's crust), Silicon (the basis of modern electronics), Phosphorus, and Sulfur. The elements in Period 3 begin to show more complex chemistry, such as the ability of P and S to expand their valence shells beyond eight electrons.",
    zh: "第三周期：包含从钠到氩的8个元素，填充3s和3p轨道。与第二周期类似，它遵循八隅体规则。该周期包括重要的工业和生物元素，如铝（地壳中最常见的金属）、硅（现代电子工业的基础）、磷和硫。第三周期元素开始表现出更复杂的化学性质，例如磷和硫能够将其价电子层扩展到八个电子以上。"
  },
  4: {
    en: "Period 4: The first 'long period,' containing 18 elements from Potassium to Krypton. It marks the introduction of the d-block as the 3d orbitals begin to fill, creating the first series of transition metals (Sc to Zn). This period includes essential metals like Iron, Copper, and Zinc, as well as biologically important elements like Selenium and Potassium. The inclusion of transition metals adds significant complexity to the chemical and physical properties observed across the period.",
    zh: "第四周期：第一个“长周期”，包含从钾到氪的18个元素。随着3d轨道的开始填充，它引入了d区，形成了第一系列过渡金属（钪到锌）。该周期包括铁、铜、锌等重要金属，以及硒和钾等具有生物重要性的元素。过渡金属的加入显著增加了该周期内元素化学和物理性质的复杂性。"
  },
  5: {
    en: "Period 5: Contains 18 elements, from Rubidium to Xenon, filling the 5s, 4d, and 5p orbitals. It mirrors the structure of Period 4, containing a second series of transition metals (Y to Cd). This period includes technologically critical elements like Zirconium, Niobium, Molybdenum, and Silver, as well as Iodine, which is essential for human health. The elements in Period 5 often exhibit similar chemical properties to their counterparts in Period 4 but with larger atomic sizes and lower ionization energies.",
    zh: "第五周期：包含从铷到氙的18个元素，填充5s、4d和5p轨道。它的结构与第四周期相似，包含第二系列过渡金属（钇到镉）。该周期包括锆、铌、钼、银等技术关键元素，以及对人体健康至关重要的碘。第五周期元素通常表现出与其在第四周期对应元素相似的化学性质，但原子尺寸更大，电离能更低。"
  },
  6: {
    en: "Period 6: A 'very long period' containing 32 elements, from Cesium to Radon. It includes the Lanthanide series (atomic numbers 57-71), which are placed separately below the table. This period fills the 6s, 4f, 5d, and 6p orbitals. It contains some of the most stable and valuable metals, such as Gold and Platinum, as well as the densest elements, Osmium and Iridium. Period 6 is also notable for 'relativistic effects' that influence the properties of heavy elements like Mercury and Gold.",
    zh: "第六周期：一个“极长周期”，包含从铯到氡的32个元素。它包括镧系元素（原子序数57-71），通常单独列于表下方。该周期填充6s、4f、5d和6p轨道。它包含一些最稳定且昂贵的金属（如金和铂），以及密度最大的元素（锇和铱）。第六周期的显著特点是“相对论效应”，这影响了汞和金等重元素的性质。"
  },
  7: {
    en: "Period 7: Contains 32 elements, from Francium to Oganesson, including the Actinide series (atomic numbers 89-103). It fills the 7s, 5f, 6d, and 7p orbitals. All elements in this period are radioactive. While the first few (Fr to Am) occur naturally or are long-lived, most of the heavier elements are synthetic and have extremely short half-lives. This period concludes with Oganesson, the heaviest known element, completing the current structure of the periodic table.",
    zh: "第七周期：包含从钫到鿫的32个元素，包括锕系元素（原子序数89-103）。它填充7s、5f、6d和7p轨道。该周期中的所有元素都具有放射性。虽然前几个元素（钫到镅）存在于自然界或具有较长寿命，但大多数较重的元素是人工合成的，且半衰期极短。该周期以目前已知最重的元素鿫结束，完成了周期表的当前结构。"
  },
  lanthanide: {
    en: "Lanthanides: A series of 15 metallic elements from Lanthanum (57) to Lutetium (71). They are characterized by the filling of the 4f orbital. Often called 'rare earth elements,' they are actually relatively abundant in the Earth's crust but difficult to separate. They are all silvery-white metals with very similar chemical properties, typically forming +3 ions. Lanthanides are vital for modern technology, used in powerful magnets, lasers, camera lenses, and television screens.",
    zh: "镧系元素：从镧(57)到镥(71)的15种金属元素系列。它们的特征是填充4f轨道。虽然常被称为“稀土元素”，但它们在地壳中的含量实际上相对丰富，只是难以分离。它们都是银白色金属，化学性质非常相似，通常形成+3价离子。镧系元素对现代技术至关重要，广泛用于制造强力磁铁、激光器、相机镜头和电视屏幕。"
  },
  actinide: {
    en: "Actinides: A series of 15 metallic elements from Actinium (89) to Lawrencium (103). They are characterized by the filling of the 5f orbital. All actinides are radioactive and have high atomic numbers. Uranium and Thorium are the only actinides found in significant quantities in nature; others are primarily synthetic. They are known for their complex oxidation states and are fundamental to nuclear power and nuclear weapons research. Elements beyond Plutonium are called transuranium elements.",
    zh: "锕系元素：从锕(89)到铹(103)的15种金属元素系列。它们的特征是填充5f轨道。所有锕系元素都具有放射性，且原子序数很高。铀和钍是自然界中仅有的两种大量存在的锕系元素，其它的主要是人工合成的。它们以复杂的氧化态著称，是核能发电和核武器研究的基础。钚以后的元素被称为超铀元素。"
  }
};

export const BLOCK_DESCRIPTIONS: Record<string, Description> = {
  s: {
    en: "The s block includes the alkali metals and alkaline earth metals. These are soft and reactive metals. The s block also contains hydrogen and helium, which are non-metals and gases. The elements of the s block have their valence electrons in s orbitals. The s sub-shell can contain a maximum of two electrons. This explains why the block is two columns wide.",
    zh: "s区包括碱金属和碱土金属。它们是质软且活泼的金属。s区还包含氢和氦，它们是非金属和气体。s区元素的价电子位于s轨道。s亚层最多可容纳两个电子，这解释了为什么该区有两个纵列宽。"
  },
  p: {
    en: "The p block consists of elements with quite varied properties. It contains non-metals, metalloids and metals. Metalloids are elements with properties that are in between those of metals and non-metals. The p sub-shell can hold a maximum of six electrons, in three distinct orbitals.",
    zh: "p区由性质差异很大的元素组成。它包含非金属、类金属和金属。类金属是性质介于金属和非金属之间的元素。p亚层最多可容纳六个电子，分布在三个不同的轨道上。"
  },
  d: {
    en: "The d block is also commonly known as the 'transition metals'. It contains metals that are typically hard and dense, and good conductors of heat and electricity. They are less reactive than the s-block metals, and they often form coloured compounds. The d sub-shell can hold a maximum of ten electrons, in five distinct orbitals.",
    zh: "d区通常也被称为“过渡金属”。它包含通常坚硬、致密且是热和电的良导体的金属。它们的活性低于s区金属，且通常形成有色化合物。d亚层最多可容纳十个电子，分布在五个不同的轨道上。"
  },
  f: {
    en: "The f block consists of the lanthanides and actinides. These are all soft metals and many are radioactive. Most of the lanthanides can be found naturally on Earth, but the actinides are typically made in nuclear reactors and not found in nature. The f sub-shell can contain up to 14 electrons, in seven distinct orbitals.",
    zh: "f区由镧系和锕系元素组成。它们都是质软的金属，许多具有放射性。大多数镧系元素可以在地球上自然发现，但锕系元素通常是在核反应堆中制造的，在自然界中并不常见。f亚层最多可容纳14个电子，分布在七个不同的轨道上。"
  }
};
