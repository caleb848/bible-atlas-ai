import { en } from '../text'
import type { Journey } from '../types'

export const birthAndChildhoodOfJesus: Journey = {
  id: 'birth-and-childhood-of-jesus',
  type: 'collection',
  eraId: 'life-of-jesus',
  title: en('The Birth and Childhood of Jesus'),
  shortTitle: en('Birth of Jesus'),
  subtitle: en('Nazareth, Bethlehem, Jerusalem and Egypt in the accounts of Luke and Matthew'),
  summary: en(
    'Luke and Matthew each tell of Jesus’ birth and early years, recording different episodes. Luke follows the family from Nazareth to Bethlehem and the temple; Matthew tells of the wise men, the flight to Egypt and the settling in Nazareth.',
  ),
  passages: ['LUK 1:26-38', 'LUK 2:1-52', 'MAT 2:1-23'],
  period: {
    label: en('c. 6–4 BC'),
    note: en(
      'Matthew sets the birth in the days of King Herod (Matthew 2:1). Most scholars place it between 6 and 4 BC; Herod’s death is usually dated to 4 BC, though some argue for 1 BC.',
    ),
  },
  orderingNote: en('Grouped by Gospel and listed in each account’s order. The two accounts are not merged into a single route.'),
  sections: [
    { id: 'luke', title: en('Luke’s account'), description: en('Luke 1–2') },
    { id: 'matthew', title: en('Matthew’s account'), description: en('Matthew 2') },
  ],
  stops: [
    { sectionId: 'luke', placeId: 'nazareth', eventIds: ['annunciation'], passage: 'LUK 1:26-38' },
    { sectionId: 'luke', placeId: 'bethlehem', eventIds: ['birth-in-bethlehem', 'shepherds-visit'], passage: 'LUK 2:1-20' },
    { sectionId: 'luke', placeId: 'temple-mount', eventIds: ['presentation-in-the-temple'], passage: 'LUK 2:22-38' },
    { sectionId: 'luke', placeId: 'nazareth', eventIds: ['return-to-nazareth'], passage: 'LUK 2:39-40' },
    { sectionId: 'luke', placeId: 'temple-mount', eventIds: ['boy-jesus-in-the-temple'], passage: 'LUK 2:41-52' },
    { sectionId: 'matthew', placeId: 'jerusalem', eventIds: ['wise-men-in-jerusalem'], passage: 'MAT 2:1-8' },
    { sectionId: 'matthew', placeId: 'bethlehem', eventIds: ['wise-men-worship'], passage: 'MAT 2:9-12' },
    { sectionId: 'matthew', placeId: 'egypt', eventIds: ['flight-to-egypt'], passage: 'MAT 2:13-15' },
    { sectionId: 'matthew', placeId: 'bethlehem', eventIds: ['herods-order'], passage: 'MAT 2:16-18' },
    { sectionId: 'matthew', placeId: 'nazareth', eventIds: ['settling-in-nazareth'], passage: 'MAT 2:19-23' },
  ],
  tags: ['jesus', 'nativity', 'birth', 'christmas', 'childhood', 'early life', 'born', 'magi', 'wise men'],
  featured: false,
}
