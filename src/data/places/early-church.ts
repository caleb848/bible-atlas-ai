import { en } from '../text'
import type { Place } from '../types'
import { openBible, pleiades, wikidata } from './sources'

/**
 * The church in Acts 1–12 and the Jerusalem council (Acts 15), with Paul’s own account in Galatians 1. Summaries are editorial paraphrases of the cited passage; the passage itself (World English Bible) is always one tap away.
 */
export const earlyChurchPlaces: Place[] = [
  {
    id: 'damascus',
    name: en('Damascus'),
    searchTerms: ['Straight Street'],
    kind: 'city',
    modern: { name: en('Damascus'), area: en('Syria') },
    coordinates: [36.30639, 33.511112],
    certainty: 'identified',
    summary: en(
      'Saul was nearing Damascus with letters to arrest followers of the Way when a light from the sky shone around him. In the city Ananias laid hands on him, and Saul preached in the synagogues until he escaped by being let down through the wall in a basket.',
    ),
    refs: ['ACT 9:2-25', 'ACT 22:5-16', 'ACT 26:12', '2CO 11:32-33', 'GAL 1:17'],
    sources: [openBible('a69c1d4'), wikidata('Q3766')],
  },
  {
    id: 'tarsus',
    name: en('Tarsus'),
    kind: 'city',
    ancientRegion: en('Cilicia'),
    modern: { name: en('Tarsus, Mersin Province'), area: en('Turkey') },
    coordinates: [34.892056, 36.913028],
    certainty: 'identified',
    summary: en(
      'Paul’s birthplace, a city of Cilicia that he called no insignificant city. The believers sent Saul off to Tarsus from Caesarea, and Barnabas later went there to look for him and brought him to Antioch.',
    ),
    refs: ['ACT 9:11', 'ACT 9:30', 'ACT 11:25', 'ACT 21:39', 'ACT 22:3'],
    sources: [openBible('a666ea0'), wikidata('Q134287')],
  },
  {
    id: 'samaria',
    name: en('Samaria'),
    kind: 'region',
    modern: { name: en('Central hill country north of Jerusalem'), area: en('West Bank') },
    coordinates: [35.195, 32.276111],
    certainty: 'approximate',
    certaintyNote: en(
      'A region, not a single place. The marker is OpenBible.info’s representative point for the region, which lies at the ancient city of Samaria (Sebaste). Acts 8:5 speaks of “the city of Samaria” without naming it further; OpenBible.info reads the verse as referring to the region.',
    ),
    summary: en(
      'Philip proclaimed the Christ in the city of Samaria, and the apostles in Jerusalem sent Peter and John to pray for those who had believed. Paul and Barnabas later passed through Phoenicia and Samaria on their way to Jerusalem.',
    ),
    refs: ['ACT 1:8', 'ACT 8:1', 'ACT 8:5-25', 'ACT 9:31', 'ACT 15:3'],
    sources: [openBible('a282dce'), pleiades('678369'), wikidata('Q1294629')],
  },
  {
    id: 'gaza',
    name: en('Gaza'),
    kind: 'city',
    modern: { name: en('Gaza City'), area: en('Gaza Strip') },
    coordinates: [34.4644, 31.504],
    certainty: 'identified',
    certaintyNote: en(
      'Acts names Gaza only as the destination of the road on which Philip met the Ethiopian official. The marker shows the ancient city, not the place of the meeting.',
    ),
    summary: en(
      'An angel sent Philip to the road that goes down from Jerusalem to Gaza, where he met and baptized an Ethiopian official.',
    ),
    refs: ['ACT 8:26'],
    sources: [openBible('aa8edd2'), wikidata('Q47492')],
  },
  {
    id: 'azotus',
    name: en('Azotus'),
    alternateNames: ['Ashdod'],
    searchTerms: ['Tel Ashdod'],
    kind: 'city',
    modern: { name: en('Tel Ashdod, near modern Ashdod'), area: en('Israel') },
    coordinates: [34.6578, 31.7572],
    certainty: 'identified',
    summary: en(
      'After the baptism of the Ethiopian official, Philip was found at Azotus, and from there he preached in all the cities until he came to Caesarea.',
    ),
    refs: ['ACT 8:40'],
    sources: [openBible('a30c937'), wikidata('Q171639')],
  },
  {
    id: 'lydda',
    name: en('Lydda'),
    alternateNames: ['Lod'],
    kind: 'town',
    modern: { name: en('Lod'), area: en('Israel') },
    coordinates: [34.9, 31.95],
    certainty: 'identified',
    summary: en(
      'Peter came down to the saints at Lydda and healed Aeneas, who had been paralyzed for eight years. Because Lydda was near Joppa, the disciples at Joppa sent for him there when Tabitha died.',
    ),
    refs: ['ACT 9:32-38'],
    sources: [openBible('a2c5cc7'), wikidata('Q207540')],
  },
  {
    id: 'joppa',
    name: en('Joppa'),
    searchTerms: ['Jaffa', 'Yafo'],
    kind: 'port',
    modern: { name: en('Jaffa, in Tel Aviv-Yafo'), area: en('Israel') },
    coordinates: [34.753039, 32.054481],
    certainty: 'identified',
    summary: en(
      'Peter raised Tabitha here and stayed many days with Simon the tanner, whose house was by the seaside. On its housetop he saw the vision of a great sheet let down from heaven, and from here he went with Cornelius’ messengers to Caesarea.',
    ),
    refs: ['ACT 9:36-43', 'ACT 10:5-23', 'ACT 11:5'],
    sources: [openBible('ae023a9'), wikidata('Q180294')],
  },
  {
    id: 'phoenicia',
    name: en('Phoenicia'),
    kind: 'region',
    modern: { name: en('The coast of Lebanon and neighboring areas') },
    coordinates: [35.25, 33.25],
    certainty: 'approximate',
    certaintyNote: en(
      'A coastal region, not a single place. The marker is the representative point Pleiades gives for the region; OpenBible.info’s point for Phoenicia is the city of Tyre itself.',
    ),
    summary: en(
      'Believers scattered by the persecution after Stephen’s death traveled as far as Phoenicia, and Paul and Barnabas later passed through it on their way to Jerusalem. At the end of his third journey Paul boarded a ship crossing over to Phoenicia and landed at Tyre.',
    ),
    refs: ['ACT 11:19', 'ACT 15:3', 'ACT 21:2-3'],
    sources: [pleiades('678334'), openBible('a33d53e'), wikidata('Q41642')],
  },
  {
    id: 'arabia',
    name: en('Arabia'),
    kind: 'region',
    coordinates: [35.35, 30.07],
    certainty: 'approximate',
    certaintyNote: en(
      'A region, not a single place. Paul does not say where in Arabia he went; the marker is OpenBible.info’s representative point for the region (Arabia Petraea).',
    ),
    summary: en('Paul writes that after God revealed his Son in him, he went away into Arabia and then returned to Damascus.'),
    refs: ['GAL 1:17', 'GAL 4:25'],
    sources: [openBible('a0f4ea8'), pleiades('746711'), wikidata('Q221353')],
  },
  {
    id: 'cyprus',
    name: en('Cyprus'),
    kind: 'island',
    modern: { name: en('Cyprus'), area: en('Cyprus') },
    coordinates: [33, 35],
    certainty: 'identified',
    certaintyNote: en('The marker shows the middle of the island; Acts 11:19 does not name a town.'),
    summary: en(
      'Barnabas was a man of Cyprus by race. Believers scattered after Stephen’s death spoke the word as far as Cyprus, and Barnabas and Saul later sailed there at the start of their first journey.',
    ),
    refs: ['ACT 4:36', 'ACT 11:19-20', 'ACT 13:4', 'ACT 15:39'],
    sources: [openBible('a2e7601'), pleiades('707498'), wikidata('Q229')],
  },
  {
    id: 'syria',
    name: en('Syria'),
    kind: 'region',
    modern: { name: en('Parts of modern Syria, Lebanon and southern Turkey') },
    coordinates: [37.5, 37.5],
    certainty: 'approximate',
    certaintyNote: en(
      'A region, not a single place. The marker is the representative point Pleiades gives for the Roman province of Syria; OpenBible.info’s point for Syria is the city of Damascus itself.',
    ),
    summary: en(
      'Paul writes that after visiting Peter in Jerusalem he came to the regions of Syria and Cilicia. The council’s letter was addressed to Gentile believers in Antioch, Syria and Cilicia, and Paul later went through Syria and Cilicia strengthening the churches.',
    ),
    refs: ['GAL 1:21', 'ACT 15:23', 'ACT 15:41', 'ACT 18:18', 'ACT 21:3'],
    sources: [pleiades('981550'), openBible('a890adf'), wikidata('Q207118')],
  },
  {
    id: 'cilicia',
    name: en('Cilicia'),
    kind: 'region',
    modern: { name: en('The region around Adana and Mersin'), area: en('Turkey') },
    coordinates: [34.18127, 37.038152],
    certainty: 'approximate',
    certaintyNote: en(
      'A region, not a single place. The marker is the representative point Pleiades gives for Cilicia; OpenBible.info’s point for the region is the city of Tarsus itself.',
    ),
    summary: en(
      'Paul called himself a Jew from Tarsus in Cilicia. After his visit to Peter in Jerusalem he came to the regions of Syria and Cilicia, and he later went through Cilicia again strengthening the churches.',
    ),
    refs: ['ACT 21:39', 'ACT 22:3', 'ACT 15:23', 'ACT 15:41', 'GAL 1:21'],
    sources: [pleiades('981514'), openBible('ad63819'), wikidata('Q4819648')],
  },
]
