import { en } from '../text'
import type { Journey } from '../types'

export const paulThirdJourney: Journey = {
  id: 'paul-third-missionary-journey',
  type: 'route',
  eraId: 'apostolic-age',
  title: en('Paul’s Third Missionary Journey'),
  shortTitle: en('Third Journey'),
  subtitle: en('A long stay in Ephesus, then a final voyage to Jerusalem'),
  summary: en(
    'Paul strengthened the disciples of Galatia and Phrygia, then spent more than two years in Ephesus until a riot broke out. After visiting Macedonia and Greece he sailed down the coast of Asia, said farewell to the Ephesian elders at Miletus and pressed on to Jerusalem despite repeated warnings.',
  ),
  passages: ['ACT 18:23-21:17'],
  period: {
    label: en('c. AD 53–57'),
    note: en('Acts gives no dates. Most chronologies place this journey in the mid-50s AD, ending around AD 57; some use AD 54–58.'),
  },
  stops: [
    { placeId: 'antioch-syria', eventIds: ['third-journey-sets-out'], passage: 'ACT 18:22-23' },
    {
      placeId: 'ephesus',
      eventIds: ['ephesus-twelve-disciples', 'school-of-tyrannus', 'riot-at-ephesus'],
      passage: 'ACT 19:1-41',
      arrival: {
        mode: 'unspecified',
        certainty: 'uncertain',
        note: en(
          'Acts says Paul went through the region of Galatia and Phrygia and “the upper country” before reaching Ephesus, without naming towns (Acts 18:23; 19:1).',
        ),
      },
    },
    {
      placeId: 'macedonia',
      eventIds: ['through-macedonia'],
      passage: 'ACT 20:1-2',
      arrival: { mode: 'unspecified', certainty: 'uncertain', note: en('Acts names only the region.') },
    },
    {
      placeId: 'greece',
      eventIds: ['three-months-in-greece'],
      passage: 'ACT 20:2-3',
      arrival: { mode: 'unspecified', certainty: 'uncertain', note: en('Acts names only the region.') },
    },
    {
      placeId: 'philippi',
      eventIds: ['sailing-from-philippi'],
      passage: 'ACT 20:3-6',
      arrival: {
        mode: 'unspecified',
        certainty: 'uncertain',
        note: en('Paul returned through Macedonia (Acts 20:3); the route is not described.'),
      },
    },
    {
      placeId: 'troas',
      eventIds: ['companions-wait-at-troas', 'eutychus'],
      passage: 'ACT 20:6-12',
      arrival: { mode: 'sea', certainty: 'stated', note: en('The crossing from Philippi took five days (Acts 20:6).') },
    },
    {
      placeId: 'assos',
      eventIds: ['overland-to-assos'],
      passage: 'ACT 20:13-14',
      arrival: { mode: 'land', certainty: 'stated', note: en('Paul went by land while his companions sailed (Acts 20:13).') },
    },
    {
      placeId: 'mitylene',
      eventIds: ['calling-at-mitylene'],
      passage: 'ACT 20:14',
      arrival: { mode: 'sea', certainty: 'stated' },
    },
    {
      placeId: 'chios',
      eventIds: ['passing-chios'],
      passage: 'ACT 20:15',
      arrival: { mode: 'sea', certainty: 'stated' },
      presence: 'passed',
    },
    {
      placeId: 'samos',
      eventIds: ['touching-at-samos'],
      passage: 'ACT 20:15',
      arrival: { mode: 'sea', certainty: 'stated' },
    },
    {
      placeId: 'trogyllium',
      eventIds: ['staying-at-trogyllium'],
      passage: 'ACT 20:15',
      arrival: { mode: 'sea', certainty: 'stated' },
      note: en('Named in the WEB; omitted in many modern translations.'),
    },
    {
      placeId: 'miletus',
      eventIds: ['farewell-at-miletus'],
      passage: 'ACT 20:15-38',
      arrival: { mode: 'sea', certainty: 'stated' },
    },
    {
      placeId: 'cos',
      eventIds: ['straight-course-to-cos'],
      passage: 'ACT 21:1',
      arrival: { mode: 'sea', certainty: 'stated' },
    },
    {
      placeId: 'rhodes',
      eventIds: ['reaching-rhodes'],
      passage: 'ACT 21:1',
      arrival: { mode: 'sea', certainty: 'stated' },
    },
    {
      placeId: 'patara',
      eventIds: ['ship-for-phoenicia'],
      passage: 'ACT 21:1-2',
      arrival: { mode: 'sea', certainty: 'stated' },
    },
    {
      placeId: 'tyre',
      eventIds: ['seven-days-at-tyre'],
      passage: 'ACT 21:3-6',
      arrival: { mode: 'sea', certainty: 'stated', note: en('The ship passed Cyprus, leaving it on the left (Acts 21:3).') },
    },
    {
      placeId: 'ptolemais',
      eventIds: ['a-day-at-ptolemais'],
      passage: 'ACT 21:7',
      arrival: { mode: 'sea', certainty: 'stated' },
    },
    {
      placeId: 'caesarea',
      eventIds: ['agabus-warning'],
      passage: 'ACT 21:8-14',
      arrival: { mode: 'unspecified', certainty: 'stated' },
    },
    {
      placeId: 'jerusalem',
      eventIds: ['arrival-in-jerusalem'],
      passage: 'ACT 21:15-17',
      arrival: { mode: 'unspecified', certainty: 'stated' },
    },
  ],
  tags: ['paul', 'third', '3rd', 'three', 'missionary journey', 'ephesus', 'miletus', 'aegean'],
  featured: false,
}
