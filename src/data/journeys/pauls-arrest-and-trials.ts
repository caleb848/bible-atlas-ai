import { en } from '../text'
import type { Journey } from '../types'

export const paulsArrestAndTrials: Journey = {
  id: 'pauls-arrest-and-trials',
  type: 'route',
  eraId: 'apostolic-age',
  title: en('Paul’s Arrest and Trials'),
  shortTitle: en('Arrest and Trials'),
  subtitle: en('Seized in Jerusalem, held at Caesarea, appealing to Caesar'),
  summary: en(
    'Paul was seized in the temple at Jerusalem and taken into Roman custody. After he addressed the crowd and the council and a plot against his life came to light, soldiers took him by night through Antipatris to Caesarea. There he was held for two years under Felix, appealed to Caesar before Festus and made his defense before King Agrippa.',
  ),
  passages: ['ACT 21:17-26:32'],
  stops: [
    {
      placeId: 'jerusalem',
      eventIds: [
        'arrival-in-jerusalem',
        'paul-meets-james',
        'paul-seized-in-the-temple',
        'defense-on-the-stairs',
        'paul-before-the-council',
        'the-lord-stands-by-paul',
        'plot-against-paul',
      ],
      passage: 'ACT 21:17-23:30',
      quote: { ref: 'ACT 23:11', text: 'as you have testified about me at Jerusalem, so you must testify also at Rome' },
    },
    {
      placeId: 'antipatris',
      eventIds: ['night-ride-to-antipatris'],
      passage: 'ACT 23:31-32',
      arrival: {
        mode: 'land',
        certainty: 'stated',
        note: en(
          'Soldiers, horsemen and spearmen escorted Paul by night, and mounts were provided for him to ride (Acts 23:23–24, 31).',
        ),
      },
      quote: { ref: 'ACT 23:31', text: 'took Paul and brought him by night to Antipatris' },
    },
    {
      placeId: 'caesarea',
      eventIds: [
        'delivered-to-felix',
        'trial-before-felix',
        'felix-and-drusilla',
        'paul-appeals-to-caesar',
        'paul-before-agrippa-and-bernice',
      ],
      passage: 'ACT 23:33-26:32',
      arrival: {
        mode: 'land',
        certainty: 'stated',
        note: en('The next day the soldiers returned to the barracks, and the horsemen went on with Paul to Caesarea (Acts 23:32–33).'),
      },
      quote: { ref: 'ACT 25:11', text: 'I appeal to Caesar!' },
    },
  ],
  tags: ['paul', 'arrest', 'trial', 'prisoner', 'caesarea', 'antipatris', 'felix', 'festus', 'agrippa', 'appeal to caesar'],
  featured: false,
}
