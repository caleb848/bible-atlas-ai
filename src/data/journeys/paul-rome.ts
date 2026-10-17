import { en } from '../text'
import type { Journey } from '../types'

export const paulJourneyToRome: Journey = {
  id: 'paul-journey-to-rome',
  type: 'route',
  eraId: 'apostolic-age',
  title: en('Paul’s Journey to Rome'),
  shortTitle: en('Journey to Rome'),
  subtitle: en('A prisoner’s voyage: storm, shipwreck on Malta and arrival in Rome'),
  summary: en(
    'Having appealed to Caesar, Paul sailed for Italy as a prisoner in the care of the centurion Julius. Late in the sailing season a violent storm drove the ship for fourteen days until it ran aground on Malta. Three months later the travelers sailed on to Puteoli and continued to Rome.',
  ),
  passages: ['ACT 27:1-28:31'],
  period: {
    label: en('c. AD 59–60'),
    note: en('Acts gives no dates. Most chronologies place the voyage around AD 59–60, with Paul reaching Rome about AD 60.'),
  },
  stops: [
    { placeId: 'caesarea', eventIds: ['departure-for-italy'], passage: 'ACT 27:1-2' },
    {
      placeId: 'sidon',
      eventIds: ['friends-at-sidon'],
      passage: 'ACT 27:3',
      arrival: { mode: 'sea', certainty: 'stated' },
    },
    {
      placeId: 'myra',
      eventIds: ['new-ship-at-myra'],
      passage: 'ACT 27:4-6',
      arrival: {
        mode: 'sea',
        certainty: 'stated',
        note: en('They sailed under the shelter of Cyprus and across the sea off Cilicia and Pamphylia (Acts 27:4–5).'),
      },
    },
    {
      placeId: 'cnidus',
      eventIds: ['slow-going-off-cnidus'],
      passage: 'ACT 27:7',
      arrival: { mode: 'sea', certainty: 'stated' },
      presence: 'passed',
    },
    {
      placeId: 'salmone',
      eventIds: ['under-the-lee-of-crete'],
      passage: 'ACT 27:7',
      arrival: { mode: 'sea', certainty: 'stated' },
      presence: 'passed',
    },
    {
      placeId: 'fair-havens',
      eventIds: ['warning-at-fair-havens'],
      passage: 'ACT 27:8-13',
      arrival: { mode: 'sea', certainty: 'stated' },
    },
    {
      placeId: 'cauda',
      eventIds: ['storm-near-cauda'],
      passage: 'ACT 27:13-17',
      arrival: {
        mode: 'sea',
        certainty: 'stated',
        note: en('The storm struck while the ship was sailing along Crete toward Phoenix, where they had hoped to winter (Acts 27:12–15).'),
      },
      presence: 'passed',
    },
    {
      placeId: 'malta',
      eventIds: ['fourteen-days-adrift', 'shipwreck', 'viper-on-malta'],
      passage: 'ACT 27:18-28:10',
      arrival: {
        mode: 'sea',
        certainty: 'uncertain',
        note: en('For fourteen days the ship was driven by the storm. Its course is unknown, so this leg is drawn as uncertain.'),
      },
    },
    {
      placeId: 'syracuse',
      eventIds: ['three-days-at-syracuse'],
      passage: 'ACT 28:11-12',
      arrival: { mode: 'sea', certainty: 'stated' },
    },
    {
      placeId: 'rhegium',
      eventIds: ['waiting-at-rhegium'],
      passage: 'ACT 28:13',
      arrival: { mode: 'sea', certainty: 'stated' },
    },
    {
      placeId: 'puteoli',
      eventIds: ['believers-at-puteoli'],
      passage: 'ACT 28:13-14',
      arrival: { mode: 'sea', certainty: 'stated' },
    },
    {
      placeId: 'forum-of-appius',
      eventIds: ['welcome-on-the-appian-way'],
      passage: 'ACT 28:15',
      arrival: {
        mode: 'unspecified',
        certainty: 'implied',
        note: en(
          'Acts says believers came to meet Paul as far as the Market of Appius and the Three Taverns; their order here follows their positions on the road to Rome.',
        ),
      },
    },
    {
      placeId: 'three-taverns',
      eventIds: ['welcome-on-the-appian-way'],
      passage: 'ACT 28:15',
      arrival: { mode: 'unspecified', certainty: 'implied' },
    },
    {
      placeId: 'rome',
      eventIds: ['two-years-in-rome'],
      passage: 'ACT 28:16-31',
      arrival: { mode: 'unspecified', certainty: 'stated' },
    },
  ],
  tags: ['paul', 'rome', 'trip to rome', 'voyage', 'shipwreck', 'malta', 'prisoner', 'storm', 'italy', 'fourth', '4th'],
  featured: true,
}
