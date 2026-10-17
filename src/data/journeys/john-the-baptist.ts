import { en } from '../text'
import type { Journey } from '../types'

export const johnTheBaptist: Journey = {
  id: 'john-the-baptist',
  type: 'collection',
  eraId: 'life-of-jesus',
  title: en('John the Baptist'),
  shortTitle: en('John the Baptist'),
  subtitle: en('From the temple to the Jordan: the places of John’s birth and ministry'),
  summary: en(
    'Luke tells how John’s birth was announced to his father Zacharias in the temple, and how Mary visited Elizabeth in the hill country of Judea before he was born. Matthew, Mark and Luke set his preaching in the wilderness and around the Jordan; John’s Gospel names Bethany beyond the Jordan and Enon near Salim.',
  ),
  passages: ['LUK 1:5-80', 'MAT 3:1-17', 'JHN 1:19-42', 'JHN 3:22-30'],
  orderingNote: en(
    'Grouped into his birth and his ministry and listed in the order of the narratives. The places are not joined by a route, because the Gospels do not say how John moved between them. Luke does not name the town in the hill country of Judea where Elizabeth lived, so that marker is a representative point for the region. Not mapped, because the text does not say where they took place: his imprisonment and death (Mark 6:17–29).',
  ),
  sections: [
    { id: 'birth', title: en('His birth'), description: en('Luke 1') },
    { id: 'ministry', title: en('His ministry'), description: en('The wilderness and the Jordan') },
  ],
  stops: [
    {
      sectionId: 'birth',
      placeId: 'temple-mount',
      eventIds: ['zacharias-in-the-temple'],
      passage: 'LUK 1:5-25',
      quote: { ref: 'LUK 1:13', text: 'Your wife, Elizabeth, will bear you a son, and you shall call his name John.' },
    },
    {
      sectionId: 'birth',
      placeId: 'judean-hill-country',
      eventIds: ['mary-visits-elizabeth', 'birth-of-john-the-baptist'],
      passage: 'LUK 1:39-80',
      note: en('Luke names only the hill country and a city of Judah; the marker is a representative point for the region.'),
      quote: { ref: 'LUK 1:39', text: 'went into the hill country with haste, into a city of Judah' },
    },
    {
      sectionId: 'ministry',
      placeId: 'judea-wilderness',
      eventIds: ['john-preaches-in-the-wilderness'],
      passage: 'MAT 3:1-4',
      quote: { ref: 'MAT 3:1', text: 'John the Baptizer came, preaching in the wilderness of Judea' },
    },
    {
      sectionId: 'ministry',
      placeId: 'jordan-river',
      eventIds: ['john-preaches-in-the-wilderness', 'baptism-of-jesus'],
      passage: 'MAT 3:5-17',
      note: en('People were baptized by John in the Jordan, and Jesus came from Galilee to be baptized by him.'),
    },
    {
      sectionId: 'ministry',
      placeId: 'jordan-river',
      eventIds: ['johns-testimony-beyond-the-jordan', 'first-disciples-follow-jesus'],
      passage: 'JHN 1:19-42',
      note: en(
        'John 1:28 names Bethany beyond the Jordan. Its site is debated; the Jordan River marker shows Al-Maghtas, one proposed site.',
      ),
      quote: { ref: 'JHN 1:28', text: 'These things were done in Bethany beyond the Jordan, where John was baptizing.' },
    },
    {
      sectionId: 'ministry',
      placeId: 'aenon',
      eventIds: ['john-baptizes-at-enon'],
      passage: 'JHN 3:22-30',
      quote: { ref: 'JHN 3:23', text: 'John also was baptizing in Enon near Salim, because there was much water there.' },
    },
  ],
  tags: ['john the baptist', 'baptism', 'jordan', 'wilderness', 'elizabeth', 'zacharias'],
  featured: false,
}
