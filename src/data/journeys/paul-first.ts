import { en } from '../text'
import type { Journey } from '../types'

export const paulFirstJourney: Journey = {
  id: 'paul-first-missionary-journey',
  type: 'route',
  eraId: 'apostolic-age',
  title: en('Paul’s First Missionary Journey'),
  shortTitle: en('First Journey'),
  subtitle: en('With Barnabas to Cyprus and the cities of southern Asia Minor'),
  summary: en(
    'Set apart at Antioch and sent out by the Holy Spirit, Barnabas and Saul sailed to Cyprus, crossed to the mainland and preached in Antioch of Pisidia, Iconium, Lystra and Derbe, then retraced their steps to strengthen the new churches.',
  ),
  passages: ['ACT 13:1-14:28'],
  period: {
    label: en('c. AD 46–49'),
    note: en('Acts gives no dates. This is a common scholarly estimate; some chronologies date the journey earlier.'),
  },
  stops: [
    { placeId: 'antioch-syria', eventIds: ['sent-from-antioch'], passage: 'ACT 13:1-3' },
    {
      placeId: 'seleucia',
      eventIds: ['sail-to-cyprus'],
      passage: 'ACT 13:4',
      arrival: { mode: 'unspecified', certainty: 'stated' },
    },
    {
      placeId: 'salamis',
      eventIds: ['salamis-synagogues'],
      passage: 'ACT 13:4-5',
      arrival: { mode: 'sea', certainty: 'stated' },
    },
    {
      placeId: 'paphos',
      eventIds: ['proconsul-believes'],
      passage: 'ACT 13:6-12',
      arrival: { mode: 'land', certainty: 'stated', note: en('Acts says they went through the island to Paphos.') },
    },
    {
      placeId: 'perga',
      eventIds: ['mark-turns-back'],
      passage: 'ACT 13:13',
      arrival: { mode: 'sea', certainty: 'stated' },
    },
    {
      placeId: 'antioch-pisidia',
      eventIds: ['pisidian-antioch-synagogue'],
      passage: 'ACT 13:14-52',
      arrival: { mode: 'unspecified', certainty: 'stated' },
    },
    {
      placeId: 'iconium',
      eventIds: ['iconium-divided'],
      passage: 'ACT 13:51-14:6',
      arrival: { mode: 'unspecified', certainty: 'stated' },
    },
    {
      placeId: 'lystra',
      eventIds: ['lystra-healing', 'paul-stoned'],
      passage: 'ACT 14:6-20',
      arrival: { mode: 'unspecified', certainty: 'stated' },
    },
    {
      placeId: 'derbe',
      eventIds: ['derbe-disciples'],
      passage: 'ACT 14:20-21',
      arrival: { mode: 'unspecified', certainty: 'stated' },
    },
    {
      placeId: 'lystra',
      eventIds: ['strengthening-the-churches'],
      passage: 'ACT 14:21-23',
      arrival: { mode: 'unspecified', certainty: 'stated' },
      note: en('The return trip retraces the outward route.'),
    },
    {
      placeId: 'iconium',
      eventIds: ['strengthening-the-churches'],
      passage: 'ACT 14:21-23',
      arrival: { mode: 'unspecified', certainty: 'stated' },
    },
    {
      placeId: 'antioch-pisidia',
      eventIds: ['strengthening-the-churches'],
      passage: 'ACT 14:21-23',
      arrival: { mode: 'unspecified', certainty: 'stated' },
    },
    {
      placeId: 'perga',
      eventIds: ['perga-word'],
      passage: 'ACT 14:24-25',
      arrival: {
        mode: 'unspecified',
        certainty: 'stated',
        note: en('Acts says they passed through Pisidia and came to Pamphylia.'),
      },
    },
    {
      placeId: 'attalia',
      eventIds: ['attalia-sailing'],
      passage: 'ACT 14:25',
      arrival: { mode: 'unspecified', certainty: 'stated' },
    },
    {
      placeId: 'antioch-syria',
      eventIds: ['antioch-report'],
      passage: 'ACT 14:26-28',
      arrival: { mode: 'sea', certainty: 'stated' },
    },
  ],
  tags: ['paul', 'barnabas', 'first', '1st', 'one', 'missionary journey', 'cyprus', 'galatia', 'asia minor', 'turkey'],
  featured: false,
}
