import { en } from '../text'
import type { Journey } from '../types'

export const finalWeekInJerusalem: Journey = {
  id: 'final-week-in-jerusalem',
  type: 'collection',
  eraId: 'life-of-jesus',
  title: en('The Final Week in Jerusalem'),
  shortTitle: en('Final Week'),
  subtitle: en('From Bethany to the empty tomb: the Gospels’ account of Jesus’ last days'),
  summary: en(
    'The Gospels slow down for the last week of Jesus’ life: the anointing at Bethany, the entry into Jerusalem, days of teaching in the temple, the Last Supper, the arrest in Gethsemane, the crucifixion at Golgotha and the empty tomb, followed by appearances and the ascension.',
  ),
  passages: ['JHN 12:1-8', 'MAT 21:1-16', 'MRK 14:12-50', 'MRK 15:22-47', 'MAT 28:1-7', 'LUK 24:13-35', 'ACT 1:9-12'],
  period: {
    label: en('c. AD 30–36'),
    note: en('The Gospels give no year. Scholars generally date the crucifixion between AD 30 and AD 36.'),
  },
  orderingNote: en(
    'Listed in the order of the Gospel narratives. These are separate sites in and around Jerusalem, not a traced route, and several are traditional identifications.',
  ),
  sections: [
    { id: 'before', title: en('Before the Passover') },
    { id: 'passion', title: en('The supper, the arrest and the cross') },
    { id: 'resurrection', title: en('Resurrection and ascension') },
  ],
  stops: [
    {
      sectionId: 'before',
      placeId: 'bethany',
      eventIds: ['anointing-at-bethany'],
      passage: 'JHN 12:1-8',
      note: en(
        'John places this supper six days before the Passover; Mark narrates an anointing at Bethany right after noting that it was two days before the Passover (Mark 14:1–3).',
      ),
    },
    { sectionId: 'before', placeId: 'bethphage', eventIds: ['preparing-the-entry'], passage: 'MAT 21:1-7' },
    { sectionId: 'before', placeId: 'jerusalem', eventIds: ['entry-into-jerusalem'], passage: 'MAT 21:8-11' },
    {
      sectionId: 'before',
      placeId: 'temple-mount',
      eventIds: ['clearing-the-temple', 'teaching-in-the-temple'],
      passage: 'MAT 21:12-16',
    },
    { sectionId: 'before', placeId: 'mount-of-olives', eventIds: ['on-the-mount-of-olives'], passage: 'MAT 24:1-3' },
    { sectionId: 'passion', placeId: 'jerusalem', eventIds: ['last-supper'], passage: 'MRK 14:12-26' },
    { sectionId: 'passion', placeId: 'gethsemane', eventIds: ['prayer-and-arrest'], passage: 'MRK 14:32-50' },
    { sectionId: 'passion', placeId: 'golgotha', eventIds: ['crucifixion', 'burial'], passage: 'MRK 15:22-47' },
    { sectionId: 'resurrection', placeId: 'golgotha', eventIds: ['empty-tomb'], passage: 'MAT 28:1-7' },
    { sectionId: 'resurrection', placeId: 'emmaus', eventIds: ['road-to-emmaus'], passage: 'LUK 24:13-35' },
    { sectionId: 'resurrection', placeId: 'mount-of-olives', eventIds: ['ascension'], passage: 'ACT 1:9-12' },
  ],
  tags: ['jesus', 'holy week', 'passion', 'easter', 'jerusalem', 'crucifixion', 'resurrection', 'last supper', 'final week'],
  featured: true,
}
