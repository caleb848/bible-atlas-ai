import { en } from '../text'
import type { BiblicalEvent } from '../types'

/**
 * Further places: where four Gospel events are set (the country of the Gadarenes, the Decapolis, Gennesaret and Ephraim), and the home towns or home regions the text gives for people in the atlas (Cyrene, Arimathaea, Thyatira, Alexandria, Pontus and Asia).
 */
export const morePlacesEvents: BiblicalEvent[] = [
  {
    id: 'healing-among-the-gadarenes',
    title: en('Healing among the Gadarenes'),
    summary: en(
      'In the country of the Gadarenes a man with an unclean spirit met Jesus out of the tombs. When Jesus asked his name, the reply was Legion, for they were many. With Jesus’ permission the spirits entered about two thousand pigs, which drowned in the sea, and the man proclaimed in Decapolis what Jesus had done.',
    ),
    placeIds: ['country-of-the-gadarenes'],
    locationNote: en(
      'Mark says they came to the other side of the sea, into the country of the Gadarenes, and that the herd rushed down the steep bank into the sea; the spot is not named. Luke also has the country of the Gadarenes, opposite Galilee; Matthew’s account, which tells of two men, has the country of the Gergesenes. The marker is a representative point for the district.',
    ),
    personIds: ['jesus'],
    passage: 'MRK 5:1-20',
    excerpt: 'MRK 5:6-9',
    relatedRefs: ['MAT 8:28-34', 'LUK 8:26-39'],
    tags: ['healing', 'unclean spirit', 'legion', 'pigs', 'gadarenes', 'gerasenes'],
  },
  {
    id: 'deaf-man-in-decapolis',
    title: en('A deaf man healed'),
    summary: en(
      'After Jesus came to the sea of Galilee through the region of Decapolis, people brought him a deaf man with a speech impediment. Jesus took him aside, put his fingers into his ears, touched his tongue and told him to be opened, and he heard and spoke clearly. Though told to tell no one, they proclaimed it all the more.',
    ),
    placeIds: ['decapolis', 'sea-of-galilee'],
    locationNote: en(
      'Mark says Jesus left the borders of Tyre and Sidon and came to the sea of Galilee through the middle of the region of Decapolis (Mark 7:31); he does not say exactly where the man was brought to him. Both are marked; the Decapolis marker is a representative point for the region.',
    ),
    personIds: ['jesus'],
    passage: 'MRK 7:31-37',
    excerpt: 'MRK 7:32-35',
    relatedRefs: ['MAT 15:29-31'],
    tags: ['healing', 'deaf', 'ephphatha', 'decapolis', 'miracle'],
  },
  {
    id: 'healings-at-gennesaret',
    title: en('Healings at Gennesaret'),
    summary: en(
      'After crossing the lake, Jesus and his disciples came to land at Gennesaret. People recognized him and brought the sick from all that region; wherever he went, in villages, cities or the country, they laid the sick in the marketplaces and begged to touch the fringe of his garment, and all who touched him were made well.',
    ),
    placeIds: ['gennesaret'],
    locationNote: en(
      'Mark says they came to land at Gennesaret and moored to the shore, and that the sick were brought to Jesus wherever he went in that region; Matthew speaks of the land of Gennesaret. The marker is a representative point for Gennesaret.',
    ),
    personIds: ['jesus'],
    passage: 'MRK 6:53-56',
    relatedRefs: ['MAT 14:34-36'],
    tags: ['healing', 'gennesaret', 'fringe of his garment', 'marketplaces', 'sick'],
  },
  {
    id: 'withdrawal-to-ephraim',
    title: en('Jesus withdraws to Ephraim'),
    summary: en(
      'After the chief priests and Pharisees took counsel to put him to death, Jesus no longer walked openly among the Jews. He went into the country near the wilderness, to a city called Ephraim, and stayed there with his disciples.',
    ),
    placeIds: ['ephraim'],
    locationNote: en(
      'John names a city called Ephraim in the country near the wilderness and gives no further location. Its site is uncertain; the marker shows Taybeh, about 20 km north-north-east of Jerusalem, one proposed site.',
    ),
    personIds: ['jesus'],
    passage: 'JHN 11:53-54',
    relatedRefs: ['JHN 11:47-52'],
    tags: ['ephraim', 'wilderness', 'withdrawal', 'disciples', 'plot'],
  },
]
