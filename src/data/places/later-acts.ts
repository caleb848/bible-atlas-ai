import { en } from '../text'
import type { Place } from '../types'
import { openBible, pleiades, wikidata } from './sources'

/**
 * Acts 18–28 beyond the journey stops (Apollos, Paul’s arrest and trials) and the movements of Paul’s companions that only his letters record. Summaries are editorial paraphrases of the cited passage.
 */
export const laterActsPlaces: Place[] = [
  {
    id: 'antipatris',
    name: en('Antipatris'),
    searchTerms: ['Aphek', 'Tel Afek', 'Tel Aphek', 'Ras el-Ain'],
    kind: 'town',
    modern: { name: en('Tel Afek (Ras el-Ain), near Rosh HaAyin'), area: en('Israel') },
    coordinates: [34.930417, 32.105],
    certainty: 'identified',
    certaintyNote: en(
      'Identified with Tel Afek (Tell Ras el-Ain). OpenBible.info records the site under its Old Testament name, Aphek.',
    ),
    summary: en(
      'Soldiers taking Paul from Jerusalem to the governor at Caesarea brought him here by night. The next day the horsemen went on with him to Caesarea.',
    ),
    refs: ['ACT 23:31-32'],
    sources: [openBible('a7b2e63'), wikidata('Q682612')],
  },
  {
    id: 'crete',
    name: en('Crete'),
    kind: 'island',
    modern: { name: en('Crete'), area: en('Greece') },
    coordinates: [24.893333, 35.309722],
    certainty: 'identified',
    certaintyNote: en('The marker is a representative point for the island; Titus 1:5 names no town.'),
    summary: en(
      'A large island in the Mediterranean. Paul’s ship sailed along its coast on the voyage to Rome, and Paul wrote that he had left Titus in Crete to appoint elders in every city.',
    ),
    refs: ['ACT 27:7-13', 'ACT 27:21', 'TIT 1:5'],
    sources: [openBible('a26aa94'), pleiades('589748'), wikidata('Q34374')],
  },
]
