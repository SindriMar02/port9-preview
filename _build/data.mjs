/* ═══════════════════════════════════════════════════════════════════════════
   PORT 9 WINEBAR - Veghúsastígur 7-9, 101 Reykjavík. Content source of truth.

   EVERY string here is either (a) verbatim from Port 9's own published material,
   or (b) written by us and marked. Nothing about the business is invented.

   PRIMARY SOURCES (all fetched 2026-08-21 from port9.is, which is a Squarespace
   site whose whole wine list is thirteen IMAGES on /vinseill - the list below was
   transcribed from those images, glass by glass)
   -------------------------------------------------------------------------
   • Wines by the glass, bottle list, cocktails, mocktails, beers, happy hour and
     the food menu - /vinseill (13 images, 1414x2000 each). Grapes, appellations,
     regions, producers, cuvées, vintages and prices are THEIRS; the bands drawn in
     each glass are the grapes they print under every wine.
   • The green highlight: their printed list sets certain wines in green. Those are
     carried as `pick: true` and shown as the house picks, nothing more claimed.
   • About text (IS + EN), hours, address, contact, "Borðabókanir í gegnum Dineout"
     - /home-2 and /new-index-1.
   • Wine tasting packages and prices - /winetasting and /vinsmokkun.
   • Exhibitions and concerts, the artist names - /events and /new-index-1.
   • Company - fyrirtækjaskrá: Port 9 ehf., kt. 5102161130 (já.is lists it as
     "Port 9 ehf - Sútarinn"), Veghúsastíg 9. Owners Arnar Þórisson and Þórir
     Kjartansson, 50/50. Ársreikningum skilað 2016-2024.
   • Photographs - their own Squarespace library, thirteen frames, harvested at
     source size. No stock, nothing generated.

   NOT CLAIMED ANYWHERE ON THE PAGE
   --------------------------------
   • No tasting notes we wrote. No "award" beyond the one line they print themselves
     ("Reykjavik Best Non-Alc Negroni 2025", under The Pennedi).
   • No staff names. The EN about text says "all our managers have recognised wine
     degrees" and that sentence is quoted, not expanded.
   • "Mistery Wine" is spelled that way on their sheet; the page prints "Mystery
     Wine" and the deviation is recorded here.
   ═════════════════════════════════════════════════════════════════════════ */

export const biz = {
  name: 'Port 9',
  full: 'Port 9 winebar',
  street: 'Veghúsastígur 7-9',
  postal: '101',
  city: 'Reykjavík',
  phone: '832 2929',
  phoneHref: '+3548322929',
  email: 'info@port9.is',
  instagram: 'port9wine',
  booking: 'https://www.dineout.is/port9',
  bookingLine: 'Borðabókanir í gegnum Dineout.',
  since: '2016',
  tagIs: 'Ef þú ratar einusinni, þá ratarðu aftur.',
  tagEn: 'If you find us once, you’ll find us again',
  company: 'Port 9 ehf. · kt. 510216-1130'
};

export const hours = {
  closed: 'Lokað á mánudögum.',
  open: 'Opið þriðjudaga - sunnudaga 16:00-23:00.',
  happy: 'Happy hour þriðjudaga - sunnudaga 16:00-18:00',
  rows: [
    { k: 'Mánudagar', v: 'Lokað', shut: true },
    { k: 'Þriðjudagar - sunnudagar', v: '16:00 - 23:00' },
    { k: 'Happy hour', v: '16:00 - 18:00' }
  ]
};

/* their own about copy, verbatim */
export const about = {
  is: [
    'Port 9 opnaði sínar dyr árið 2016. Frumkvöðull í íslenskri vínmenningu, síðan þá höfum við bætt við vínúrvalið okkar. Það er okkar hjartans mál að bjóða upp á vín frá öllum heimshornum.',
    'Vín í boði á glasi breytist á vikulega, það er mikilvægt að kíkja reglulega til okkar til þess að vera með puttann á púlsinum.',
    'Okkar sýn er að bjóða upp á framúrskarandi og hraða þjónustu, ásamt góðri þekkingu á víni. Finnið okkur, segið hæ og njótið vínglass umvafin kertaljósum í afslöppuðu andrúmslofti.'
  ],
  en: [
    'Port 9 first opened in 2016 and is the oldest wine bar in Iceland. All our managers have recognised wine degrees and are here to help you navigate our menu.',
    'It is our pride to offer wine from every corner of the world with excellent service in our laid back atmosphere.',
    'We are also very proud to participate to Icelandic culture life. We regularly host art exhibitions as well as concerts to marry wine with its best pairing : an exceptional night.'
  ],
  rotation: 'Our wines by the glass change every other week, don‘t forget to come back to try more !'
};

/* ── pour colours (illustrative, stated on the page) ─────────────────────── */
export const W = {
  red: '#7A1E2F', redDeep: '#5C1624', white: '#E9D98C', whiteDeep: '#D9C470',
  rose: '#E8A4A8', orange: '#D68A3B', spark: '#EEE4B5', sparkRose: '#EFC9C4',
  port: '#4A1423', vine: '#8C9A6C', grape: '#6E4F7E',
  // spirits, for the six cocktails
  aperol: '#E4622A', prosecco: '#EEE4B5', soda: '#DCE6E6', limoncello: '#E8D35A',
  gin: '#DDE4DA', vermouth: '#B4713F', campari: '#C0202B', vodka: '#E7EAE4',
  coffee: '#3A2416', coldbrew: '#5A3A22', baileys: '#D9B89A', tiramisu: '#C9A574'
};

/* ── Á GLASI - the rotating list, as printed 2026-08 ──────────────────────
   `g` = glass price, `b` = bottle price (their "2.200 // 10.900" notation).
   `grapes` are their own varietal lines; each becomes one band in the glass.
   `pick` = set in green on their sheet. */
export const byGlass = {
  red: { title: 'Rautt', en: 'Red', v: 'red', items: [
    { prod: 'Burgo Viejo', cuv: 'Crianza', app: 'D.O. Rioja', reg: 'Rioja, Spánn', grapes: ['Tempranillo'], g: '2.200', b: '10.900', pick: true },
    { prod: 'Joel Gott', cuv: 'Zinfandel 2017', app: 'St. Helena VA', reg: 'California, Bandaríkin', grapes: ['Grenache', 'Syrah', 'Mourvèdre'], g: '2.500', b: '11.900' },
    { prod: 'Viberti', cuv: 'Langhe Nebiollo', app: 'Langhe DOC Nebbiolo', reg: 'Piemonte, Ítalía', grapes: ['Nebiollo'], g: '2.900', b: '14.900' },
    { prod: 'l’Hortus', cuv: 'Le loup dans la bergerie', app: 'Saint-Guilhem le désert', reg: 'Roussillon, Frakkland', grapes: ['Grenache', 'Syrah', 'Mourvèdre'], g: '2.300', b: '10.900' },
    { prod: 'Nicolas Potel', cuv: 'Pinot Noir', app: 'AOP Bourgogne', reg: 'Bourgogne, Frakkland', grapes: ['Pinot Noir'], g: '3.200', b: '15.900' }
  ]},
  white: { title: 'Hvítt', en: 'White', v: 'white', items: [
    { prod: 'José Pariente', cuv: 'Verdejo', app: 'D.O. Rueda', reg: 'Castilla y León, Spánn', grapes: ['Verdejo'], g: '2.200', b: '10.900', pick: true },
    { prod: 'Artazu', cuv: 'Santa Cruz De Artazu 2015', app: 'Navarra D.O.', reg: 'Navarra, Spánn', grapes: ['White Garnacha'], g: '2.500', b: '11.900' },
    { prod: 'Brotte', cuv: 'Baies Dorrées', app: 'Pays D’Oc IGP', reg: 'Occitanie, Frakkland', grapes: ['Viognier'], g: '2.500', b: '11.900' },
    { prod: 'Beykush', cuv: 'Mr. Albarino', app: 'Odessa', reg: 'Odessa, Ukraínu', grapes: ['Albarino'], g: '2.900', b: '14.900' },
    { prod: 'Gérard Bertrand', cuv: 'Cigalus Blanc', app: 'IGP Aude Hauterive', reg: 'Corbières, Frakkland', grapes: ['Chardonnay', 'Sauvignon blanc', 'Viognier'], g: '3.200', b: '15.900' }
  ]},
  rose: { title: 'Rósavín', en: 'Rosé', v: 'white', items: [
    { prod: 'Gueissard', cuv: 'Les Papilles', app: 'AOP Cotes de Provence', reg: 'Provence, Frakkland', grapes: ['Mourvedre', 'Grenache', 'Cinsault'], g: '2.500', b: '11.900' }
  ]},
  orange: { title: 'Appelsínuvín', en: 'Orange', v: 'white', items: [
    { prod: 'Le temps des cerises', cuv: '“La Capitulation Ne Paie Pas”', app: 'Languedoc', reg: 'Occitanie, Frakkland', grapes: ['Cinsault'], g: '2.200', b: '10.900' }
  ]},
  spark: { title: 'Freyðivín', en: 'Sparkling', v: 'flute', items: [
    { prod: 'Llopart', cuv: 'Reserva Brut', app: 'Corpinnat', reg: 'Subirats, Katalónía', grapes: ['Macabeu', 'Parrellada', 'Xarel-lo'], g: '2.500', b: '11.900', pick: true },
    { prod: 'Camille Giroud', cuv: 'Guérin & Blois', app: 'Crémant de Bourgogne AOC', reg: 'Bourgogne, Frakkland', grapes: ['Pinot Noir', 'Chardonnay', 'Aligoté'], g: '2.200', b: '10.900' },
    { prod: 'Nino Franco', cuv: 'Prosseco Brut', app: 'Valdobbiadene DOCG', reg: 'Valdobbiadene, Ítalía', grapes: ['Glera'], g: '3.200', b: '15.900' },
    { prod: 'Simpsons', cuv: 'Chalklands', app: 'Great British Classic Method Blend', reg: 'Kent, Bretland', grapes: ['Chardonnay', 'Pinot Noir', 'Pinot Meunier'], g: '3.200', b: '15.900' },
    { prod: 'Simpsons', cuv: 'Canterburry Rosé', app: 'Great British Classic Method Blend', reg: 'Kent, Bretland', grapes: ['Pinot Noir'], g: '3.200', b: '15.900', rose: true }
  ]},
  port: { title: 'Sterkt', en: 'Fortified', v: 'port', items: [
    { prod: 'Quinta Do Pégo', cuv: 'Port LBV 2019', app: 'LBV Port', reg: 'Douro Valley, Portúgal', grapes: ['Touriga Nacional', 'Touriga Franca', 'Tinta Roriz', 'Tinto Cão', 'Sousão'], g: '2.500' }
  ]}
};

/* their game, verbatim price line: "2.500,- / FREE" */
export const mystery = { name: 'Mystery Wine', sheet: 'Mistery Wine', price: '2.500,- / FREE' };

/* ── KOKTEILAR - six, each with their own ingredient lines ───────────────── */
export const cocktails = [
  { n: 'Aperol Spritz', p: '2.390', v: 'white', ing: [['Aperol', W.aperol], ['Sparkling Wine', W.prosecco], ['Soda', W.soda]] },
  { n: 'Sarti or Limoncello Spritz', p: '2.590', v: 'white', ing: [['Sarti / Limoncello', W.limoncello], ['Sparkling Wine', W.prosecco], ['Soda', W.soda]] },
  { n: 'House Negroni', p: '2.950', v: 'rocks', ing: [['Himbrimi London Dry Gin', W.gin], ['Himbrimi Old Tom Gin', W.gin], ['Jarabe De Palo Vermouth', W.vermouth], ['Campari', W.campari]] },
  { n: 'House Espresso Martini', p: '2.950', v: 'coupe', ing: [['Zubrovka Vodka', W.vodka], ['Giffard Honduras Coffee Liquor', W.coffee], ['Homemade Cold Brew', W.coldbrew]] },
  { n: 'House Tiramisu Martini', p: '2.950', v: 'coupe', ing: [['Tiramisu Liquor', W.tiramisu], ['Bailey’s', W.baileys], ['Giffard Honduras Coffee Liquor', W.coffee], ['Homemade Cold Brew', W.coldbrew]] }
];

/* ── ÁFENGISLAUST ────────────────────────────────────────────────────────── */
export const zero = {
  cocktails: [
    { n: 'The Pennedi by Lyne Tissot', p: '1.500', note: 'Reykjavik Best Non-Alc Negroni 2025', pick: true },
    { n: 'Gin Tonic', p: '1.500' },
    { n: 'Spritz', p: '1.500' }
  ],
  spark: [{ n: 'Rosafreyðivin', p: '1.250' }, { n: 'Chardonnay Freyðivin', p: '1.250' }],
  beer: [{ n: 'Stella', p: '850' }, { n: 'Brio', p: '850' }],
  soft: [['Mango', '750'], ['Watermelon', '750'], ['Grapefruit', '750'], ['Ginger Beer', '750'], ['Pepsi', '590'], ['Pepsi Max', '590'], ['Appelsin', '590'], ['7up 0%', '590'], ['Kristall', '590'], ['San Pellegrino 750ml', '990']]
};

/* ── HAPPY HOUR, verbatim ─────────────────────────────────────────────────── */
export const happy = { time: '16:00 - 18:00', house: 'House wines', gl: '1.690,- gl', fl: '7.500,- fl', beer: 'Estrella', beerP: '1.290,-' };

/* ── MATUR, with their own "best paired with" lines ──────────────────────── */
export const food = [
  { n: 'Bakaður Brie', served: 'served with Sandholt bread', what: 'Brie cheese, pecan nuts, dates, honey', p: '2.700', pair: 'Gérard Bertrand, Cigalus' },
  { n: 'Ólífur', p: '790' },
  { n: 'Hnetur Mix', p: '590' },
  { n: 'Maxi Platti', served: 'served with Sandholt bread and crackers', what: 'Audur cheese, Freykir cheese, Paté en croute, Iberico jamon, olives, honey', p: '4.190', pair: 'Viberti, Nebbiolo', vegan: true },
  { n: 'French Macarons coupe', served: 'served with whipped cream and chocolate chips', p: '1.890', pair: 'Simpsons Chalklands, Chardonnay' }
];

/* ── FLÖSKUR - the bottle list by country and region, as printed ─────────
   `c` = wine colour for the glass; `y` = vintage as printed (NM = non-vintage). */
export const bottles = [
  { country: 'Frakkland', en: 'France', groups: [
    { head: 'Rautt', c: 'red', items: [
      { reg: 'Bordeaux', prod: 'Chateau Cantenac Brown', cuv: '"Cantennac Brown" 2016', app: 'Grand Cru Classé 1855', place: 'Margaux, Frakkland', grapes: ['Cabernet Sauvignon', 'Merlot'], p: '29.900' },
      { reg: 'Bordeaux', prod: 'Chateau Cantenac Brown', cuv: '"BriO de Cantennac Brown" 2017', app: 'AOC Margaux', place: 'Margaux, Frakkland', grapes: ['Cabernet Sauvignon', 'Merlot', 'Cabernet Franc'], p: '20.900' },
      { reg: 'Cotes du Rhône', prod: 'E. Guigal', cuv: '"Hermitage" 2019', app: 'AOC Hermitage', place: 'Hermitage, Frakkland', grapes: ['Syrah'], p: '29.900' },
      { reg: 'Alsace', prod: 'Famille Hugel', cuv: '"Pinot Gris Vendanges Tardives" 1998', app: 'AOC Alsace', place: 'Riquewihr, Frakkland', grapes: ['Pinot Gris'], p: '27.900', c: 'white' },
      { reg: 'Bourgogne', prod: 'Camille Giroud', cuv: '"Maranges Le Croix Moines" 2022', app: 'AOC Maranges 1er Cru', place: 'Maranges, Frakkland', grapes: ['Pinot Noir'], p: '23.900' },
      { reg: 'Bourgogne', prod: 'Camille Giroud', cuv: '"Volnay" 2021', app: 'AOC Volnay', place: 'Volnay, Frakkland', grapes: ['Pinot Noir'], p: '24.900' },
      { reg: 'Bourgogne', prod: 'Domaine Sorine', cuv: '"Vieilles-Vignes" 2021', app: 'AOC Chassagne-Montrachet', place: 'Chassagne-Montrachet, Frakkland', grapes: ['Pinot Noir'], p: '27.900' },
      { reg: 'Bourgogne', prod: 'Christophe Violot-Guillemard', cuv: '"Clos Derrière Saint-Jean, Monopole" 2021', app: 'AOC Pommard', place: 'Pommard, Frakkland', grapes: ['Pinot Noir'], p: '29.900' },
      { reg: 'Bourgogne', prod: 'Domaine Maldant Pauvelot', cuv: '"Savigny-Les-Beaunes Aux Gravins" 2018', app: 'AOC Aux Gravins 1er Cru', place: 'Savigny-Les-Beaunes, Frakkland', grapes: ['Pinot Noir'], p: '33.900' },
      { reg: 'Bourgogne', prod: 'Bruno Desaunay-Bissey', cuv: '"Vosnes-Romanée" 2022', app: 'AOC Vosnes-Romanée', place: 'Vosnes, Frakkland', grapes: ['Pinot Noir'], p: '33.900' }
    ]},
    { head: 'Hvítt', c: 'white', items: [
      { reg: 'Bourgogne', prod: 'Arnaud Baillot', cuv: '"A Ma Fille Mahaut" 2023', app: 'AOC Pernand-Vergelesses', place: 'Bourgogne, Frakkland', grapes: ['Chardonnay'], p: '20.900' },
      { reg: 'Bourgogne', prod: 'Olivier Leflaive', cuv: '"Les deux rives" 2023', app: 'AOC Chablis', place: 'Bourgogne, Frakkland', grapes: ['Chardonnay'], p: '16.900' },
      { reg: 'Bourgogne', prod: 'François D’allaines', cuv: '"Tête de Cuvée" 2020', app: 'AOC Meursault', place: 'Bourgogne, Frakkland', grapes: ['Chardonnay'], p: '15.900' },
      { reg: 'Alsace', prod: 'Famille Hugel', cuv: '"Pinot Gris Vendanges Tardives" 1998', app: 'AOC Alsace', place: 'Riquewihr, Frakkland', grapes: ['Pinot Gris'], p: '27.900', pick: true },
      { reg: 'Occitanie', prod: 'Maison Wessman', cuv: '"Saint-Cernin N°1" 2019', app: 'AOC Limoux', place: 'Limoux, Frakkland', grapes: ['Chardonnay'], p: '21.900' },
      { reg: 'Cotes du Rhône', prod: 'E. Guigal', cuv: '"Condrieu" 2019', app: 'AOC Condrieu', place: 'Rhône, Frakkland', grapes: ['Viognier'], p: '22.900' }
    ]},
    { head: 'Kampavín', c: 'flute', items: [
      { reg: 'Non-Millésimé', prod: 'Piper-Heidsieck', cuv: '"Brut Rosé" NM', app: 'Reims, Frakkland', place: 'Dosage 8g/L', grapes: ['Chardonnay', 'Pinot Noir', 'Pinot Meunier'], p: '21.900', rose: true },
      { reg: 'Non-Millésimé', prod: 'Drappier', cuv: '"Carte d’Or Brut" NM', app: 'Urville, Frakkland', place: 'Dosage 6.5g/L', grapes: ['Chardonnay', 'Pinot Noir', 'Pinot Meunier'], p: '15.900' },
      { reg: 'Millésimé', prod: 'Philipponnat', cuv: '"Royale Réserve Brut" 2020', app: 'Mareuil-sur-Ay, Frakkland', place: 'Dosage 8g/L', grapes: ['Chardonnay', 'Pinot Noir', 'Pinot Meunier'], p: '21.900' },
      { reg: 'Millésimé', prod: 'Moët et Chandon', cuv: '"Dom Pérignon" 1990', app: 'Epernay, Frakkland', place: 'Dosage 6g/L', grapes: ['Chardonnay', 'Pinot Noir'], p: '50.000' }
    ]}
  ]},
  { country: 'Spánn', en: 'Spain', groups: [
    { head: 'Corpinnat', c: 'flute', items: [
      { reg: 'Penedès', prod: 'Llopart', cuv: '"Leopardi" 2017', app: 'Corpinnat Vinyes de Muntanya', place: 'Barcelona, Spánn', grapes: ['Xarel-lo', 'Macabeo', 'Parrelada'], p: '16.900' },
      { reg: 'Penedès', prod: 'Llopart', cuv: '"Llopart Original 1887" 2012', app: 'Corpinnat Vinyes Velles de Muntanya', place: 'Barcelona, Spánn', grapes: ['Montònega', 'Xarel-Lo', 'Macabeo'], p: '25.900' }
    ]},
    { head: 'Rautt', c: 'red', items: [
      { reg: 'Katalónía', prod: 'Torres', cuv: 'Purgatori 2020', app: 'DO Costers del Segre', place: 'Katalónía, Spánn', grapes: ['Cariñena', 'Garnacha'], p: '17.900' },
      { reg: 'Ribera del Duero', prod: 'Carmelo Rodero', cuv: '"Pago de Valarreña" 2020', app: 'Ribera del Duero DO', place: 'Burgos, Spánn', grapes: ['Tempranillo'], p: '29.900' },
      { reg: 'Ribera del Duero', prod: 'Cruz de Alba', cuv: '"Finca los Hoyales" 2017', app: 'Ribera del Duero DO', place: 'Los Hoyales, Spánn', grapes: ['Tempranillo'], p: '23.900' },
      { reg: 'Rioja', prod: 'Bodegas Muga', cuv: '"Prado Enea Gran Reserva" 2016', app: 'Rioja DOCa Gran Reserva', place: 'Rioja, Spánn', grapes: ['Tempranillo', 'Carignan', 'Garnacha', 'Graciano'], p: '29.900' }
    ]},
    { head: 'Hvítt', c: 'white', items: [
      { reg: 'Bierzo', prod: 'Merayo', cuv: '"La Gineta" 2022', app: 'Bierzo DO', place: 'Bierzo, Spánn', grapes: ['Godello Viejo'], p: '16.900' }
    ]}
  ]},
  { country: 'Ítalía', en: 'Italy', groups: [
    { head: 'Rautt', c: 'red', items: [
      { reg: 'Piemonte', prod: 'Viberti', cuv: '"Langhe Nebiollo" 2021', app: 'Langhe DOC', place: 'Langhe, Ítalía', grapes: ['Nebiollo'], p: '12.900' },
      { reg: 'Piemonte', prod: 'Luciano Sandrone', cuv: '"Aleste" 2019', app: 'Barollo DOCG', place: 'Cannubi, Ítalía', grapes: ['Nebiollo'], p: '41.900' },
      { reg: 'Puglia', prod: 'Varvaglione', cuv: '"Papale" 2019', app: 'Primitivo di Manduria DOP', place: 'Leporano, Ítalía', grapes: ['Primitivo'], p: '23.900' },
      { reg: 'Veneto', prod: 'Pasqua', cuv: '"Valpolicella Ripasso Black Label" 2021', app: 'Valpolicella Ripasso DOC', place: 'Valpantena, Ítalía', grapes: ['Corvinone', 'Corvina', 'Rondinella'], p: '19.900' },
      { reg: 'Toscana', prod: 'Castello Banfi', cuv: '"Brunello di Montalcino" 2018', app: 'Brunello di Montalcino DOCG', place: 'Montalcino, Ítalía', grapes: ['Sangiovese'], p: '12.900' }
    ]},
    { head: 'Hvítt', c: 'white', items: [
      { reg: 'Sardinía', prod: 'Cantina Santadi', cuv: '"Villa Solais" 2022', app: 'Vermentino di Sardegna DOC', place: 'Basso Sulcis, Ítalía', grapes: ['Vermentino', 'Nuragus'], p: '9.900' },
      { reg: 'Sardinía', prod: 'Audarya', cuv: '"Vermentino" 2023', app: 'Vermentino di Sardegna DOC', place: 'Su Stani, Ítalía', grapes: ['Vermentino'], p: '11.900' },
      { reg: 'Alto Adige', prod: 'Sanct Valentin', cuv: '"Pinot Grigio" 2021', app: 'Alto Adige DOC', place: 'Oltradige, Ítalía', grapes: ['Ruländer (Pinot Grigio)'], p: '19.900' },
      { reg: 'Trentino', prod: 'Conti Bossi Fedriogotti', cuv: '"Vin’Asmara" 2022', app: 'Vigneti Deele Dolomitti IGT', place: 'Dolomites, Ítalía', grapes: ['Chardonnay'], p: '12.900' }
    ]}
  ]},
  { country: 'Austurríki og Þýskaland', en: 'Austria & Germany', groups: [
    { head: 'Hvítt', c: 'white', items: [
      { reg: 'Pfalz', prod: 'Basserman-Jordan', cuv: '"Forster Jesuitengarten GG Riesling" 2020', app: 'VDP Grosse Lage', place: 'Mittelhaardt, Þýskaland', grapes: ['Riesling'], p: '20.900' },
      { reg: 'Wachau', prod: 'Pichler', cuv: '"Loibner Ried Burgstall" 2024', app: 'Wachau DAC Qualitätswein', place: 'Wachau, Austurríki', grapes: ['Riesling'], p: '16.900' }
    ]}
  ]},
  { country: 'Georgía', en: 'Georgia', groups: [
    { head: 'Hvítt og Gylt', c: 'orange', items: [
      { reg: 'Kakheti', prod: 'Tbilvino', cuv: '"Qvevris Kisi" 2016', app: 'Kakheti PDO', place: 'Kakheti, Georgía', grapes: ['Kisi'], p: '11.900' },
      { reg: 'Kakheti', prod: 'Marani', cuv: '"Tsinandali" 2022', app: 'Kakheti PDO', place: 'Kakheti, Georgía', grapes: ['Rkatsitseli', 'Mtsvasne'], p: '11.900', c: 'white' }
    ]},
    { head: 'Rautt', c: 'red', items: [
      { reg: 'Kakheti', prod: 'Marani', cuv: '"Qvevris Saperavi" 2022', app: 'Kakheti PDO', place: 'Kakheti, Georgía', grapes: ['Saperavi'], p: '11.900' },
      { reg: 'Kakheti', prod: 'Papari Valley', cuv: '"5 Qvevris Terraces" 2020', app: 'Kakheti PDO', place: 'Kakheti, Georgía', grapes: ['Saperavi'], p: '14.900' }
    ]}
  ]},
  { country: 'Grikkland', en: 'Greece', groups: [
    { head: 'Rautt', c: 'red', items: [
      { reg: 'Naoussa', prod: 'Kir-Yianni', cuv: '"Diaporos" 2018', app: 'PGI Imathia', place: 'Diaporos, Grikkland', grapes: ['Xinomavro', 'Syrah'], p: '19.900' }
    ]}
  ]},
  { country: 'Líbanon', en: 'Lebanon', groups: [
    { head: 'Rautt', c: 'red', items: [
      { reg: 'Bekaa Valley', prod: 'Gaston Hochar', cuv: '"Chateau Musar" 2017', app: 'Bekaa Wine', place: 'Bekaa Valley, Líbanon', grapes: ['Cabernet Sauvignon', 'Cinsault', 'Carignan'], p: '20.900' }
    ]}
  ]}
];

/* ── VÍNSMÖKKUN - their three packages, verbatim ─────────────────────────── */
export const tasting = {
  intro: 'Port 9 býður upp á vínsmökkun fyrir hópa. Okkar markmið er að smakka vín í afslöppuðu andrúmslofti, við förum yfir grundvallar atriði í víngerð, ferðumst um heiminn með bragðlaukunum og lyktarskyninu. Njótum þess að eiga lærdómsríkt spjall, hlægja og hafa gaman.',
  packages: [
    { n: 'Package 1', wines: 6, line: 'Við smökkum saman 6 vín', dur: 'Smökkunin stendur yfir í 1.5 - 2 klst (fer eftir stærð hópsins)', p: '11.900kr á mann' },
    { n: 'Package 2', wines: 4, line: 'Við smökkum saman 4 vín', dur: 'Smökkunin stendur yfir í 1 - 1.5 klst (fer eftir stærð hópsins)', p: '9.900kr á mann' },
    { n: 'Duo Package', wines: 2, line: 'Ef þú átt sérstakt tilefni með einhverjum sérstökum, þá sníðum við sérstaka vínsmökkun fyrir þig.', dur: '', p: 'Verð eftir beiðni.' }
  ]
};

/* ── MENNING - exhibitions + concerts, their own names ────────────────────── */
export const culture = {
  exhibitions: ['Joi Borgvins', 'Ester Borg', 'Eeriee', 'Rakel Tómas', 'Zuzanna Wrona'],
  concerts: ['Hera Lind', 'Laglegt', 'Cameron Anderton', 'Ásalaus', 'Lúpína'],
  callExhib: 'You are a plastic artist and you want to see your art in a vibrant place in downtown Reykjavik? Prints, paintings, sculpture, we might be interested!',
  callConcert: 'Our walls can host intimate concerts, regardless of the genre! Pop, ambient, dark, folk, everybody is welcome.',
  captions: ['Zuzanna Wrona - 2024', 'Hekla - 2025']
};

/* photographs, all theirs */
export const P = {
  hero:     { src: 'assets/img/hero-bar.jpg', w: 2000, h: 1334, alt: 'Barinn á Port 9, flöskuveggurinn upplýstur af lömpum, gestir við borðið' },
  facade:   { src: 'assets/img/facade.jpg', w: 1316, h: 2048, alt: 'Svartklædd framhliðin við Veghúsastíg með ljósaseríu yfir dyrunum' },
  sofa:     { src: 'assets/img/sofa.jpg', w: 2000, h: 1334, alt: 'Hópur í grænum sófum við steinsteypuvegginn' },
  laugh:    { src: 'assets/img/laugh.jpg', w: 1773, h: 1182, alt: 'Gestur hlær með vínglas í hendi í lampaljósi' },
  bucket:   { src: 'assets/img/bucket.jpg', w: 2000, h: 1334, alt: 'Flaska í klakafötu á barnum, tveir gestir við borðið' },
  redglass: { src: 'assets/img/redglass.jpg', w: 2000, h: 1125, alt: 'Rauðvínsglas lyft yfir ljósin á barnum' },
  coupleBw: { src: 'assets/img/couple-bw.jpg', w: 2000, h: 1334, alt: 'Tvö við lítið borð, svarthvít mynd' },
  twoMen:   { src: 'assets/img/two-men.jpg', w: 2000, h: 1334, alt: 'Tveir gestir skála við steinsteypuvegginn' },
  night:    { src: 'assets/img/facade-night.jpg', w: 1733, h: 2600, alt: 'Húsið að kvöldi, ljósin í glugganum' },
  barWomen: { src: 'assets/img/bar-women.jpg', w: 1400, h: 934, alt: 'Tveir gestir við barinn, flöskuveggurinn fyrir aftan' },
  tasting:  { src: 'assets/img/tasting.jpg', w: 2000, h: 1334, alt: 'Vínsmökkun í gangi, hópur við borðið' },
  exhib:    { src: 'assets/img/exhibition.jpg', w: 1270, h: 844, alt: 'Sýning í salnum, gestir skoða verk á veggnum' },
  concert:  { src: 'assets/img/concert.jpg', w: 1184, h: 1056, alt: 'Tónleikar á Port 9 í rauðu ljósi' }
};
