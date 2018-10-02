export interface RoomDataData {
    description?: string;
    sections: { title: string; description?: string; recettes?: RecetteData[]; levels: { text: string, image?:string }[] }[];
}
export interface RoomData {
    color: string;
    title: string;
    thumbnail?: string;
    icon?: string;
    data?: RoomDataData;
}

export interface RecetteData {
    text: string;
    title: string;
    image: string;
}

export const rooms = [
    {
        color: '#EAEDC8',
        title: 'cuisine',
        thumbnail: '~/images/banner_cuisine.png',
        data: {
            // description:'',
            sections: [
                {
                    title: 'Aliments',
                    levels: [
                        {
                            text:
                                "<b>J'évite les plats préparés</b> souvent trop salés et qui contiennent de nombreux conservateurs. Si je dois en acheter je choisis ceux dont la liste d'ingrédients est la plus courte, avec le moins de conservateurs.  "
                        },
                        {
                            text:
                                "Je préfère des <b>fruits et légumes de saison</b> qui ont moins de risque d'avoir parcouru beaucoup de kilomètres ou d'avoir poussé sous serre avec un excès de pesticides. De préférence <b>non sur-emballés</b>. Je <b>limite le gaspillage</b> en achetant juste ce dont j'ai besoin (c'est bon pour le budget !). Je préfère des produits certifiés <b>d'origine biologique et/ou locaux</b>."
                        },
                        {
                            text:
                                'Pour limiter les déchets j\'achète mes produits " en vrac " en amenant mes contenants chez les commerçants. Pour les viandes et le poisson qui coûtent plus cher, <b>je préfère la qualité à la quantité</b>. Je choisis des viandes élevées sans antibiotiques, et / ou certifiées biologiques. Je limite la consommation de poissons gras (saumon par ex) qui accumulent les métaux lourds dans leur graisse. Je pense au compost.'
                        }
                    ]
                },
                {
                    title: 'Et pour bébé',
                    levels: [
                        {
                            text:
                                "Je choisis les petits pots ou plats préparés qui contiennent la liste d'ingrédients la plus courte, avec de préférence des ingrédients d'origine biologique. <b>J'évite les biberons en plastique</b> qui ne contiennent plus de bisphénol A, mais souvent des bisphénols F et S, tout aussi toxiques."
                        },
                        {
                            text:
                                'Je fais mes petits pots maison avec des <b>fruits et légumes de saison</b>, de préférence biologiques. Je les conserve dans des <b>pots en verre</b>. Je choisis un <b>biberon en verre</b>.'
                        }
                    ]
                },
                {
                    title: 'Contenants',
                    levels: [
                        {
                            text:
                                "<b>J'évite</b> au maximum les <b>contenants en plastique, téflon et aluminium</b> qui ne sont pas des matériaux stables. <b>Je n'utilise plus les casseroles si le téflon est éraflé, je ne chauffe jamais d'aliments dans un récipient en plastique</b>, cela accélère la diffusion d'éléments tels que le bisphénol A-S et F vers les aliments, qui sont des perturbateurs endocriniens connus. <b>Je bannis le film alimentaire</b> qui contient aussi des bisphénols."
                        },
                        {
                            text: '<b>Je préfère</b>  les <b>ustensiles et contenants en bois, verre, céramique</b> ou <b>acier inoxydable</b>.'
                        }
                    ]
                },
                {
                    title: 'Nettoyants',
                    levels: [
                        {
                            text:
                                "<b>Je limite</b> à son minimum <b>l'usage de détergents</b> et nettoyants issus de la chimie dans la cuisine. Lorsque j'en utilise je rince abondamment ensuite et  j'aère pendant 10 minutes la cuisine. Je choisis un <b>produit vaisselle certifié biologique</b>."
                        },
                        {
                            text:
                                "<b>Je nettoie</b> le réfrigérateur et/ou l'évier régulièrement <b>avec du vinaigre blanc. Je remplace mon produit vaisselle par un bloc de savon de Marseille</b> (testé et fortement approuvé par Caroline)"
                        },
                        {
                            text: 'Je fabrique mon éponge maison (" Tawashi ") avec des tissus hors d\'usage : increvable ! Testé et approuvé par Lucie'
                        }
                    ]
                }
            ]
        }
    },
    {
        color: '#FFF7C7',
        title: 'chambre de bébé',
        thumbnail: '~/images/banner_chambre.png',
        data: {
            sections: [
                {
                    title: 'Environnement de la chambre',
                    levels: [
                        {
                            text: '<b>J\'aère la chambre</b> au minimum 10minutes par jour pour limiter les Composés Organiques Volatils, le formaldéhyde, les moisissures, la poussière etc.... Je fais le ménage régulièrement pour éviter les moisissures et la poussière.'
                        },
                        {
                            text: '<b>J\'évite la diffusion d\'huiles essentielles</b> à proximité de bébé avant ses 3ans. <b>Pas de désodorisants ou de parfums</b> dans la chambre de bébé.'
                        },
                        {
                            text: '<b>Je limite l\'exposition de bébé aux ondes électromagnétiques</b> : j\'éloigne la base du téléphone sans fil, je l\'éloigne des téléphones portables, tablettes, ordinateurs, je mets le babyphone au moins à 1 mètre des pieds du lit, je désactive le wifi la nuit.'
                        }
                    ]
                },
                {
                    title: 'Meubles',
                    levels: [
                        {
                            text: '<b>Je prépare la chambre de bébé plusieurs semaines à l\'avance afin d\'aérer au maximum les meubles, matelas, poussette ou couffin</b>.'
                        },
                        {
                            text: '<b>J\'évite les meubles en contreplaqué ou en aggloméré</b> qui contiennent plus de colle et d\'autres sources de Composés Organiques Volatils. De préférence je choisis des meubles et matelas fabriqués en Europe voire en France, les réglementations étant souvent plus strictes. Je choisis de préférence des meubles labellisés (par exemple : Ecolabel européen, label FSC, Ange bleu)'
                        },
                        {
                            text: '<b>Je choisis des meubles en bois massif sans vernis</b>, et/ou <b>d\'occasion</b> qui rejetteront beaucoup moins de Composés Organiques Volatils (et moins chers !).'
                        }
                    ]
                },{
                    title: 'Travaux',
                    levels: [
                        {
                            text: '<b>Enceinte je ne réalise pas moi-même de travaux de rénovation</b>. Je réalise les travaux plusieurs semaines avant l\'arrivée de bébé afin d\'<b>aérer au maximum. Je choisis une rénovation sobre : le moins de nouveaux meubles, le moins de peintures, colles, sol en PVC...c\'est un risque moindre d\'exposition</b> aux hydrocarbures aromatiques, aux aldéhydes, solvants, PVC, phtalates et autres Composés Organiques Volatils.'
                        },
                        {
                            text: 'La personne qui réalise les travaux prend les <b>précautions nécessaires</b> : port de gants pour la peinture, aération autant que possible, retrait du papier peint à la vapeur plutôt qu\'en le grattant, <b>appel à un professionnel en cas de présence d\'amiante ou de plomb</b> (peintures datant d\'avant 1949).'
                        },
                        {
                            text: 'Je choisis des <b>matériaux labellisés</b> (plutôt que de me fier aux allégations du produit). Je regarde sur les étiquettes <b>les émissions dans l\'air intérieur</b>.'
                        }
                    ]
                },{
                    title: 'Vêtements',
                    levels: [
                        {
                            text: '<b>Je lave toujours les vêtements avant un premier usage</b>. Si un vêtement perd toujours de la couleur au 2e lavage je ne l\'utilise pas.'
                        },
                        {
                            text: '<b>J\'évite les motifs ou imprimés en plastique</b>, et les vêtements qui ont subi de nombreux traitements : <b>anti feu, anti bactérien, usage facile, imperméabilisation</b>, imprimés en PVC qui peuvent contenir des phtalates, teinture allergènes.... '
                        },
                        {
                            text: '<b>Je préfère des vêtements labélisés</b> (par exemple Oeko-tex)'
                        }
                    ]
                },{
                    title: 'Jouets',
                    levels: [
                        {
                            text: '<b>J\'évite les articles de décoration, cadeaux publicitaires ou poupées miniatures</b> dont la réglementation est moins stricte que pour les jouets. <b>J\'aère ou je lave (si possible) tous les jouets</b> avant utilisation. J\'évite les jouets qui dégagent une odeur forte de plastique.'
                        },
                        {
                            text: '<b>J\'évite les jouets électroniques, tablettes et jouets connectés</b> qui augmentent l\'exposition aux ondes électromagnétiques. Les piles contiennent des retardateurs de flammes et des fluides toxiques. Les écrans sont eux déconseillés par le Conseil Supérieur de l\'Audiovisuel avant 3ans.'
                        },
                        {
                            text: '<b>Je préfère les jouets en bois</b>, idéalement brut, sans vernis. Si j\'opte pour des jouets <b>en plastique</b> je les choisis sans phtalates et sans PVC.'
                        }
                    ]
                }
            ]
        }
    },
    {
        color: '#FDD4BA',
        title: 'buanderie',
        thumbnail: '~/images/banner_buanderie.png',
        data: {
            description: 'Le placard à produits ménagers est la pièce de la maison où l\'on retrouve le plus de toxiques pour la santé. Il est important de <b>lutter contre les moisissures</b> et la poussière, mais attention aux produits utilisés ! <b>La chasse effrénée aux bactéries</b> n\'est pas nécessaire et <b>peut s\'avérer dangereuse</b> : nous faisons souvent de vrais cocktails chimiques en faisant le ménage. Dans ces produits on peut retrouver des cancérigènes comme le formaldéhyde, des agents génotoxiques, reprotoxiques, perturbateurs hormonaux, allergènes, irritants, etc.<br/><b>Les bactéries</b> de l\'environnement <b>sont nécessaires</b> au développement de <b>l\'immunité de l\'enfant</b>, les éliminer peut favoriser les allergies.<br/><b>Les ingrédients à éviter</b> : <font color="red">javel, formaldéhyde, triclosan, composés d\'isothiazolinone, éthers de glycol, azurants optiques, phtalates DEHP, DEP, muscs, octaméthylcyclotétrasiloxane,  octylphenol éthoxylate, sodium laureth sulfate</font>.<br/><b>Attention !</b> Ne jamais mélanger des produits ménagers sans précautions, certains mélanges peuvent s\'avérer toxiques ! Conserver les produits ménagers hors de portée des enfants dans un lieu sec et aéré.',
            sections: [
                {
                    title: 'Nettoyant multi-usage (éviers, lavabos, robinetterie, frigo, plans de travail, douche, vitres...)',
                    levels: [
                        {
                            text: 'J\'évite les nettoyants classiques, qui contiennent un ou plusieurs des ingrédients à éviter et/ou qui ont un pictogramme d\'alerte : ',
                            image:'~/images/pictos.png'
                        },
                        {
                            text: '<b>Je choisis un nettoyant multi-usage</b> (plutôt que plusieurs produits différents pour chaque usage) <b>sans parfum, éco certifié</b> de préférence. Je l\'utilise avec un tissu en micro-fibre qui limite la quantité de nettoyant nécessaire ou mon éponge faite maison.'
                        },
                        {
                            text: 'Je prépare mon propre nettoyant multi usage fait maison.'
                        }
                    ],
                    recettes:[{
                        title:'<b>Nettoyant multi usage fait maison</b>',
                        image:'~/images/recettes/nettoyant.jpg',
                        text:'Versez <b>1 cuillère à soupe de bicarbonate de soude</b> dans un récipient. Ajoutez <b>1 litre d\'eau chaude</b> et <b>1 cuillère à soupe de vinaigre blanc</b>. Mélangez. Vous pouvez ajouter une dizaine de gouttes d\'huile essentielle au mélange pour l\'odeur.'
                    }]
                },{
                    title: 'Nettoyant pour les toilettes',
                    levels: [
                        {
                            text: '<b>J\'évite</b> les produits qui contiennent de <b>la javel</b> ou des <b>produits antibactériens</b> qui favorisent la résistance bactérienne, par ailleurs la javel est toxique pour l\'homme et contient du chlore toxique pour l\'environnement. La désinfection des toilettes n\'est pas nécessaire, un nettoyage régulier est préférable. <b>J\'évite les désodorisants / pots-pourris / bougies parfumées</b>...etc'
                        },
                        {
                            text: 'J\'utilise un nettoyant pour toilettes certifié écologique.'
                        },
                        {
                            text: 'J\'utilise un nettoyant pour toilettes fait maison.'
                        }
                    ],
                    recettes:[{
                        title:'<b>Nettoyant pour toilette fait maison</b>',
                        image:'~/images/recettes/nettoyant_toilettes.jpg',
                        text:'Saupoudrez un peu de bicarbonate de soude sur la cuvette et directement dans l\'eau des toilettes. Versez ou pulvérisez ensuite du vinaigre d\'alcool aux mêmes endroits. Le contact entre les deux produits va produire une mousse détartrante, il ne reste qu\'à frotter avec la brosse.'
                    }]
                },{
                    title: 'Nettoyant pour le sol',
                    levels: [
                        {
                            text: 'J\'évite les produits spécifiques pour le sol qui ne sont pas nécessaires et peuvent s\'avérer toxiques.'
                        },
                        {
                            text: 'Je nettoie les sols (parquets, carrelage, PVC) avec une cuillère à soupe de savon noir dans un seau d\'eau chaude.'
                        }
                    ]
                },{
                    title: 'Produit pour lave-vaisselle et/ou produit vaisselle',
                    levels: [
                        {
                            text: '<b>J\'évite</b> les produits qui contiennent des <b>colorants et des parfums</b> qui favorisent les allergies. Depuis 2016, les produits ne doivent plus contenir de <b>phosphates, polluants de l\'eau</b>, je m\'en assure en vérifiant leur composition.'
                        },
                        {
                            text: 'Si je fais la vaisselle à la main je ne fais pas couler l\'eau en continu.'
                        },
                        {
                            text: '<b>Je fais la vaisselle avec du savon de Marseille</b> tout simplement (c\'est très efficace et adopté par Caroline). Pour réduire les déchets je peux faire ma propre éponge ou " Tawashi " avec de vieux bas par exemple.'
                        }
                    ]
                },{
                    title: 'Lessive',
                    levels: [
                        {
                            text: 'Je respecte les doses de lessive recommandées et je choisis un rinçage long. Je n\'utilise pas d\'adoucissants, d\'antibactériens ou de détachants.'
                        },
                        {
                            text: 'Je préfère les lessives en poudre qui contiennent moins d\'agents de surface. Le lavage à 30° est le plus souvent suffisant, le prélavage est rarement utile.'
                        },
                        {
                            text: 'Si je dois faire un prélavage je le fais avec du savon  noir ou de Marseille. Je fabrique ma lessive maison selon la recette testée et adoptée par Léa.'
                        }
                    ],
                    recettes:[{
                        title:'<b>Lessive faite maison</b>',
                        image:'~/images/recettes/lessive.jpg',
                        text:'Sur une planche à découper réduire <b>100gr de savon de Marseille</b> (à l\'huile d\'olive bio) en miettes avec un couteau. Mélanger à <b>1L d\'eau</b> dans une grande casserole sur feu moyen, jusqu\'à ce que l\'eau bout presque. Ajouter <b>3 cuillères à soupe de bicarbonate de soude</b> (ça va mousser !). Laisser reposer 1h. Délayer avec <b>1L d\'eau</b>. Secouer s\'il y a des grumeaux. C\'est prêt !<br/><br/>Recette issue du site " consommons sainement "'
                    }]
                },{
                    title: 'Dégraissants, détachants, décapant pour le four, adoucissants, anticalcaire, désinfectants...',
                    levels: [
                        {
                            text: 'Je fais du tri dans ces produits spécifiques, la plupart ne sont pas utiles, et peuvent facilement être remplacés par des produits plus simples et beaucoup moins toxiques. Je ne garde que ceux qui me semblent irremplaçables.'
                        }
                    ]
                }
            ]
        }
    },
    {
        color: '#E3DFEF',
        title: 'salle de bain - côté maman',
        thumbnail: '~/images/banner_salledebain.png',
        data: {
            description:
                "De manière générale je n'utilise que les produits qui me sont vraiment nécessaires, c'est l'occasion de faire un peu de tri dans les nombreux produits qui traînent dans la salle de bain. Je choisis les produits dont la composition est la plus simple (avec la liste d'ingrédients la plus courte), et/ou les produits les plus naturels, de préférence certifiés biologiques.",
            sections: [
                {
                    title: 'Déodorant',
                    levels: [
                        {
                            text: "<b>J'évite les déodorants en spray</b> qui contiennent des Composés Organiques Volatiles dangereux pour la santé et l'environnement, <b>je préfère les sticks</b>."
                        },
                        {
                            text: "Je choisis un déodorant <b>sans alcool, ni sels d'aluminium</b> fortement suspectés de favoriser le cancer du sein."
                        },
                        {
                            text: "J'utilise notre recette <b>huile de coco et bicarbonate</b>."
                        }
                    ],
                    recettes: [
                        {
                            title: '<b>Déodorant maison</b> (testé et adopté par Lucie)',
                            image: '~/images/recettes/deodorant-maison.jpg',
                            text:
                                'Faire fondre 40 gr d\'huile de coco et 10 gr de cire d\'abeille au bain marie, mélanger et verser dans un pot hermétique et propre. Ajouter petit à petit 30gr de bicarbonate de soude et 20gr de fécule de maïs en mélangeant vigoureusement pour éliminer tous les grumeaux. 10min au frigo pour solidifier le mélange. Se conserve plusieurs mois. Recette issue du livre " Famille presque zéro déchet "'
                        }
                    ]
                },
                {
                    title: 'Savon',
                    levels: [
                        {
                            text:
                                "<b>J'évite</b> les gels douches (et savons) qui contiennent des <b>parabens</b> - perturbateurs endocriniens connus-,  des <b>parfums / arômes</b> -allergènes- ou du <b>triclosan</b> - perturbateur endocrinien, toxique environnemental, probable cancérigène, suspecté de développer la résistance bactérienne-. Je <b>bannis les produits exfoliants</b> qui contiennent des microbilles de plastique qui polluent ensuite les cours d'eau et océans, je retourne au bon vieux gant de crin."
                        },
                        {
                            text: "J'utilise un <b>pain de savon à base végétale</b> (de Marseille, d'Alep....etc.) dont la liste de composants est courte, de préférence d'origine biologique."
                        },
                        {
                            text: 'Je choisis un pain de savon à base végétale (cf. 2) vendu sans emballage. '
                        }
                    ]
                },
                {
                    title: 'Shampoing',
                    levels: [
                        {
                            text:
                                "J'évite les shampoings qui contiennent des parabens -perturbateurs endocriniens-,  des parfums / arômes -allergènes-. Si j'utilise un après-shampoing je le rince abondamment."
                        },
                        {
                            text: 'Je choisis un shampoing dont la liste de composants est courte, avec des ingrédients certifiés biologiques de préférence.'
                        },
                        {
                            text: 'Je choisis un shampoing solide certifié biologique, sans emballage.'
                        }
                    ]
                }
            ]
        }
    },
    {
        color: '#E3DFEF',
        title: 'salle de bain - côté bébé',
        thumbnail: '~/images/banner_salledebain.png',
        data: {
            description:
                'De manière générale je n\'utilise que les produits qui sont absolument nécessaires, je choisis les produits dont la composition est la plus simple (avec la liste d\'ingrédients la plus courte), et/ou les produits les plus naturels, certifiés biologiques de préférence. <b><font color="red">A éviter</font></b> : les allergènes comme <b><font color="red">les senteurs / arômes</font></b> et <b><font color="red">musques</font></b> des produits d\'hygiène, les <b><font color="red">eaux de toilettes et parfums</font></b> pour bébé.',
            sections: [
                {
                    title: 'Soins du siège',
                    levels: [
                        {
                            text:
                                "<b>J'évite les lingettes à usage unique</b> dont la composition retrouve souvent des produits dangereux pour la santé de bébé et qui produisent beaucoup de déchets. Si j'en utilise je les jette dans la poubelle, jamais dans les toilettes."
                        },
                        {
                            text: "J'utilise de <b>l'eau et du savon ou du liniment</b>, acheté ou fabriqué maison selon notre recette, sur des cotons."
                        },
                        {
                            text: "J'utilise des <b>gants de toilette</b> ou <b>pièces de coton lavables et réutilisables</b>."
                        }
                    ],
                    recettes: [
                        {
                            title: '<b>Liniment maison</b>',
                            image: '~/images/recettes/liniment.jpg',
                            text:
                                "Versez <b>125 mL d'huile d'olive</b> (idéalement vierge extra et biologique) dans un récipient, ajoutez doucement <b>125mL d'eau de chaux</b> (se trouve en pharmacie, pure elle est à manipuler avec des gants), mélangez quelques minutes. Vous pouvez rajouter <b>une cuillère à soupe de cire d'abeille</b> fondue au bain marie pour garder le mélange homogène. Le liniment maison se conserve 1 mois."
                        }
                    ]
                },
                {
                    title: 'Choix des couches',
                    levels: [
                        {
                            text:
                                'Je choisis des couches sans traces de composés organiques volatiles, chlore ou pesticides (cf. les conseils du magazine 60 millions de consommateurs par exemple, fév. 2017).'
                        },
                        {
                            text: 'Je préfère utiliser des couches lavables '
                        }
                    ]
                },
                {
                    title: 'Massage bébé et/ou hydratation de la peau',
                    levels: [
                        {
                            text:
                                "<b>J'évite</b> les crèmes ou huiles qui contiennent des <b>senteurs / arômes / parfums / fragrances</b> qui sont allergènes. <b>J'évite</b> les produits contenants <b>parabens, phénoxyéthanol ou isothiazolinone</b>."
                        },
                        {
                            text: "Je préfère une crème ou huile de massage / d'hydratation dont la liste de composants est courte, de préférence certifiée biologique."
                        },
                        {
                            text: "J'utilise une huile végétale d'origine biologique : huile d'olive ou beurre de karité par exemple."
                        }
                    ]
                },
                {
                    title: 'Savon / Shampoing',
                    levels: [
                        {
                            text:
                                "<b>J'utilise le moins de produit possible</b>, je rince abondamment, je sèche bien, surtout les plis. Un shampoing une fois par semaine est habituellement suffisant."
                        },
                        {
                            text:
                                "<b>J'évite</b> les savons et/ou shampoings qui contiennent des <b>senteurs / arômes / parfums / fragrances</b> qui sont allergènes. Je choisis un produit <b>sans parabens, sans phénoxyéthanol, ni Sodium Laureth Sulfate (SLS)</b> qui dessèche et irrite la peau."
                        },
                        {
                            text: 'Je préfère un savon/shampoing dont la liste de composants est courte, de préférence certifié biologique. Je préfère un produit qui contient une huile végétale.'
                        }
                    ]
                },
                {
                    title: 'Dentifrice',
                    levels: [
                        {
                            text: "<b>Avant 3 ans</b> je choisis un dentifrice <b>sans fluor</b> dont l'accumulation au quotidien peut entraîner une atteinte de l'émail."
                        },
                        {
                            text: 'Je préfère un dentifrice <b>sans Sodium Laureth Sulfate, sans Triclosan, et sans " goût sucré "</b>.'
                        },
                        {
                            text: 'Je choisis un dentifrice adapté aux enfants et certifié biologique.'
                        }
                    ]
                }
            ]
        }
    }
] as RoomData[];
