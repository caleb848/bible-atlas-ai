import { en } from '../text'
import type { Place } from '../types'
import { openBible, pleiades, wikidata } from './sources'

/**
 * Further places: where four Gospel events are set (the country of the Gadarenes, the Decapolis, Gennesaret and Ephraim), and the home towns or home regions the text gives for people in the atlas (Cyrene, Arimathaea, Thyatira, Alexandria, Pontus and Asia).
 */
export const morePlaces: Place[] = [
  // Event places (Gospels)
  {
    id: 'country-of-the-gadarenes',
    name: en('Country of the Gadarenes'),
    searchTerms: ['Gadarenes', 'Gadara', 'Gergesenes', 'Gerasenes', 'Umm Qais', 'Kursi'],
    kind: 'region',
    modern: { name: en('The area around Umm Qais, south-east of the Sea of Galilee') },
    coordinates: [35.679352, 32.655998],
    certainty: 'approximate',
    certaintyNote: en(
      'A district, not a single place. In the WEB, Mark and Luke name it after the people of Gadara, and the marker is the site of that city, Umm Qais, on the heights south-east of the lake (OpenBible.info). The text places the event by the shore but does not name the spot. Matthew’s account in the WEB says the country of the Gergesenes, and many manuscripts and modern translations read Gerasenes in Mark and Luke. Kursi, on the east shore, is a traditional site of the event.',
    ),
    summary: en(
      'Across the sea from Galilee. Mark and Luke say that here a man with an unclean spirit, who lived in the tombs, met Jesus and was healed, and that the people of the district, afraid, asked Jesus to leave.',
    ),
    refs: ['MRK 5:1-20', 'LUK 8:26-39'],
    sources: [openBible('afed46a'), pleiades('678142'), wikidata('Q96379011')],
  },
  {
    id: 'decapolis',
    name: en('Decapolis'),
    kind: 'region',
    modern: { name: en('Parts of northern Jordan, southern Syria and neighboring areas') },
    coordinates: [35.8, 32.716667],
    certainty: 'approximate',
    certaintyNote: en(
      'A region, not a single place: the name means ten cities, most of which lay east of the Jordan. The marker is OpenBible.info’s representative point for the region.',
    ),
    summary: en(
      'Crowds from Decapolis followed Jesus. The man healed in the country of the Gadarenes proclaimed in Decapolis what Jesus had done for him, and Mark says Jesus later came to the sea of Galilee through the middle of the region of Decapolis.',
    ),
    refs: ['MAT 4:25', 'MRK 5:20', 'MRK 7:31'],
    sources: [openBible('ae733a2'), pleiades('678116'), wikidata('Q823244')],
  },
  {
    id: 'gennesaret',
    name: en('Gennesaret'),
    searchTerms: ['Plain of Gennesaret', 'Ginosar', 'el-Ghuweir'],
    kind: 'region',
    ancientRegion: en('Galilee'),
    modern: { name: en('Ginosar Valley (el-Ghuweir), on the north-west shore of the Sea of Galilee'), area: en('Israel') },
    coordinates: [35.507222, 32.860556],
    certainty: 'approximate',
    certaintyNote: en(
      'A district rather than a single site: Gennesaret is usually taken to be the small plain (el-Ghuweir) on the north-west shore of the lake, just north of Magdala. The marker is OpenBible.info’s representative point for the plain. Luke calls the lake itself the lake of Gennesaret (Luke 5:1).',
    ),
    summary: en(
      'After crossing the lake, Jesus and his disciples came to land at Gennesaret. People recognized him and brought their sick, begging to touch the fringe of his garment, and as many as touched him were made well.',
    ),
    refs: ['MRK 6:53-56', 'MAT 14:34-36', 'LUK 5:1'],
    sources: [openBible('a7de69e')],
  },
  {
    id: 'ephraim',
    name: en('Ephraim'),
    searchTerms: ['Taybeh', 'et-Taiyibeh'],
    kind: 'town',
    modern: { name: en('Taybeh (one proposed site)'), area: en('West Bank') },
    coordinates: [35.300278, 31.954444],
    certainty: 'debated',
    certaintyNote: en(
      'John places Ephraim in the country near the wilderness and says no more. It is often identified with Taybeh (et-Taiyibeh), about 20 km north-north-east of Jerusalem, the candidate OpenBible.info favors; Ein Samia, about 5 km further north-east, has also been proposed. Neither is certain.',
    ),
    summary: en(
      'After the chief priests and Pharisees took counsel to put Jesus to death, he no longer walked openly among the Jews. He went to a city called Ephraim, in the country near the wilderness, and stayed there with his disciples.',
    ),
    refs: ['JHN 11:54'],
    sources: [openBible('ad14500'), wikidata('Q5382362')],
  },

  // Home towns the text gives for named people
  {
    id: 'cyrene',
    name: en('Cyrene'),
    searchTerms: ['Shahhat'],
    kind: 'city',
    modern: { name: en('Ruins of Cyrene, near Shahhat'), area: en('Libya') },
    coordinates: [21.851229, 32.820946],
    certainty: 'identified',
    summary: en(
      'A city in North Africa. Simon of Cyrene, who was compelled to carry Jesus’ cross, came from here, as did Lucius of Cyrene, one of the prophets and teachers at Antioch. Acts also tells of men of Cyprus and Cyrene who came to Antioch and spoke to the Hellenists about the Lord Jesus.',
    ),
    refs: ['MAT 27:32', 'MRK 15:21', 'LUK 23:26', 'ACT 11:20', 'ACT 13:1'],
    sources: [openBible('a81cdb5'), wikidata('Q44112')],
  },
  {
    id: 'arimathaea',
    name: en('Arimathaea'),
    alternateNames: ['Arimathea'],
    searchTerms: ['Rantis'],
    kind: 'town',
    modern: { name: en('Rantis (one proposed site)'), area: en('West Bank') },
    coordinates: [35.019444, 32.028056],
    certainty: 'debated',
    certaintyNote: en(
      'Luke calls Arimathaea a city of the Jews but does not say where it was. The marker shows Rantis, north-west of Jerusalem, the candidate OpenBible.info favors; Beit Rima and other sites linked with the Old Testament town of Ramathaim-zophim have also been proposed. No site is certain.',
    ),
    summary: en(
      'Home of Joseph, the council member who asked Pilate for Jesus’ body and laid it in a tomb. Matthew calls him a rich man from Arimathaea, and Luke calls Arimathaea a city of the Jews.',
    ),
    refs: ['MAT 27:57', 'MRK 15:43', 'LUK 23:50-51', 'JHN 19:38'],
    sources: [openBible('af3d9fc'), wikidata('Q2558868')],
  },
  {
    id: 'thyatira',
    name: en('Thyatira'),
    searchTerms: ['Akhisar'],
    kind: 'city',
    modern: { name: en('Akhisar, Manisa Province'), area: en('Turkey') },
    coordinates: [27.83655, 38.92021],
    certainty: 'identified',
    summary: en(
      'Lydia, a seller of purple and a worshiper of God who listened to Paul at Philippi, was of the city of Thyatira. She and her household were baptized.',
    ),
    refs: ['ACT 16:14-15'],
    sources: [openBible('a94b661'), pleiades('550924'), wikidata('Q1135603')],
  },
  {
    id: 'alexandria',
    name: en('Alexandria'),
    kind: 'city',
    modern: { name: en('Alexandria'), area: en('Egypt') },
    coordinates: [29.8965, 31.1825],
    certainty: 'identified',
    summary: en(
      'Apollos, an eloquent Jew mighty in the Scriptures who came to Ephesus, was an Alexandrian by race. On the voyage to Rome, Paul sailed on a ship of Alexandria from Myra and on another from Malta.',
    ),
    refs: ['ACT 18:24', 'ACT 27:6', 'ACT 28:11'],
    sources: [openBible('aee7248'), pleiades('727070'), wikidata('Q87')],
  },
  {
    id: 'pontus',
    name: en('Pontus'),
    kind: 'region',
    modern: { name: en('The Black Sea coast of north-eastern Turkey and its hinterland'), area: en('Turkey') },
    coordinates: [37.83, 40.68],
    certainty: 'approximate',
    certaintyNote: en(
      'A region, not a single place, in northern Asia Minor along the Black Sea. The marker is OpenBible.info’s representative point for the region.',
    ),
    summary: en(
      'Aquila, the tentmaker whom Paul found at Corinth with his wife Priscilla, was a Jew of Pontus by race. Pontus is also among the lands named by the crowd in Jerusalem at Pentecost.',
    ),
    refs: ['ACT 18:2', 'ACT 2:9'],
    sources: [openBible('a83a43e'), pleiades('857287'), wikidata('Q621672')],
  },
  {
    id: 'asia',
    name: en('Asia'),
    searchTerms: ['Province of Asia'],
    kind: 'region',
    modern: { name: en('Western Turkey, along the Aegean coast'), area: en('Turkey') },
    coordinates: [28.3, 38.4],
    certainty: 'approximate',
    certaintyNote: en(
      'The Roman province of Asia, in western Asia Minor, not the continent. A region, not a single place; the marker is OpenBible.info’s representative point for the province.',
    ),
    summary: en(
      'The province in which Ephesus lay. Paul and his companions were once forbidden by the Holy Spirit to speak the word in Asia; later, during Paul’s two years of teaching at Ephesus, all who lived in Asia heard the word. Tychicus and Trophimus, who went with Paul after his months in Greece, were of Asia.',
    ),
    refs: ['ACT 16:6', 'ACT 19:10', 'ACT 19:22', 'ACT 20:4', 'ACT 20:16-18'],
    sources: [openBible('a197f19'), pleiades('981509'), wikidata('Q210718')],
  },
]
