import { en } from '../text'
import type { Person } from '../types'

/**
 * The church in Acts 1–12 and the Jerusalem council (Acts 15), with Paul’s own account in Galatians 1. Summaries are editorial paraphrases of the cited passage; the passage itself (World English Bible) is always one tap away.
 */
export const earlyChurchPeople: Person[] = [
  {
    id: 'matthias',
    name: en('Matthias'),
    role: en('Chosen by lot to replace Judas'),
    summary: en(
      'Put forward with Joseph Barsabbas to take the place Judas had left among the apostles. The lot fell on him, and he was counted with the eleven apostles.',
    ),
    refs: ['ACT 1:23-26'],
    groups: ['early-church'],
    identityNote: en(
      'Matthias was not one of the Twelve whom Jesus chose in the Gospels. Acts says that after the lot fell on him he “was counted with the eleven apostles” (Acts 1:26).',
    ),
  },
  {
    id: 'joseph-barsabbas',
    name: en('Joseph Barsabbas'),
    alternateNames: ['Justus'],
    searchTerms: ['Barsabbas', 'Joseph called Barsabbas'],
    role: en('Candidate to replace Judas'),
    summary: en('One of the two men put forward to take Judas’ place among the apostles; the lot fell on Matthias.'),
    refs: ['ACT 1:23'],
    groups: ['early-church'],
    identityNote: en(
      'Acts calls him Joseph called Barsabbas, who was also called Justus. He is a different person from Judas called Barsabbas (Acts 15:22); Acts does not say whether they were related.',
    ),
  },
  {
    id: 'stephen',
    name: en('Stephen'),
    role: en('One of the seven, stoned outside Jerusalem'),
    summary: en(
      'A man full of faith and of the Holy Spirit, chosen as one of the seven. Accused before the council, he answered with a long speech and was stoned outside the city, while Saul consented to his death.',
    ),
    refs: ['ACT 6:5', 'ACT 6:8-15', 'ACT 7:54-60', 'ACT 22:20'],
    groups: ['early-church'],
  },
  {
    id: 'gamaliel',
    name: en('Gamaliel'),
    role: en('Pharisee and teacher of the law'),
    summary: en(
      'A Pharisee in the council, honored by all the people. He advised the council to leave the apostles alone, since a work of men would fail and a work of God could not be overthrown.',
    ),
    refs: ['ACT 5:34-39', 'ACT 22:3'],
    groups: ['authorities'],
    identityNote: en(
      'Paul says he was brought up in Jerusalem at the feet of Gamaliel (Acts 22:3); this is usually taken to be the same Gamaliel.',
    ),
  },
  {
    id: 'ananias-husband-of-sapphira',
    name: en('Ananias, husband of Sapphira'),
    searchTerms: ['Ananias'],
    role: en('Kept back part of the price of land'),
    summary: en(
      'With his wife Sapphira he sold a possession, kept back part of the price and laid the rest at the apostles’ feet. When Peter said he had lied to God, he fell down and died.',
    ),
    refs: ['ACT 5:1-6'],
    groups: ['acts-figures'],
    identityNote: en('A different person from Ananias of Damascus (Acts 9:10) and from Ananias the high priest (Acts 23:2).'),
  },
  {
    id: 'sapphira',
    name: en('Sapphira'),
    role: en('Wife of Ananias'),
    summary: en(
      'She knew that her husband had kept back part of the price of their land. Coming in about three hours after his death, she told Peter the land had been sold for the amount he named, and she too fell down and died.',
    ),
    refs: ['ACT 5:1-2', 'ACT 5:7-10'],
    groups: ['women', 'acts-figures'],
  },
  {
    id: 'simon-the-sorcerer',
    name: en('Simon the sorcerer'),
    searchTerms: ['Simon'],
    role: en('Sorcerer in Samaria'),
    summary: en(
      'He had long amazed the people of Samaria with his sorcery. He believed and was baptized after Philip’s preaching, but when he offered Peter and John money for the power to give the Holy Spirit, Peter rebuked him.',
    ),
    refs: ['ACT 8:9-13', 'ACT 8:18-24'],
    groups: ['acts-figures'],
    identityNote: en(
      'Acts calls him Simon, who practiced sorcery. The name Simon Magus (Simon the magician) comes from later Christian writers, not from Acts.',
    ),
  },
  {
    id: 'ethiopian-official',
    name: en('The Ethiopian official'),
    searchTerms: ['Ethiopian eunuch', 'eunuch'],
    role: en('Treasurer of Candace, queen of the Ethiopians'),
    summary: en(
      'A eunuch of great authority under Candace, queen of the Ethiopians, returning from worship in Jerusalem. Philip preached Jesus to him from the passage of Isaiah he was reading and baptized him on the way.',
    ),
    refs: ['ACT 8:27-39'],
    groups: ['acts-figures', 'authorities'],
    identityNote: en('Acts does not give his name.'),
  },
  {
    id: 'ananias-of-damascus',
    name: en('Ananias of Damascus'),
    searchTerms: ['Ananias'],
    role: en('Disciple in Damascus sent to Saul'),
    summary: en(
      'In a vision the Lord sent him to Saul of Tarsus, who was praying in the house of Judah on the street called Straight. He laid his hands on Saul, who received his sight and was baptized.',
    ),
    refs: ['ACT 9:10-17', 'ACT 22:12-16'],
    groups: ['early-church'],
    identityNote: en('A different person from Ananias, husband of Sapphira (Acts 5:1), and from Ananias the high priest (Acts 23:2).'),
    origins: [{ placeId: 'damascus', ref: 'ACT 9:10' }],
  },
  {
    id: 'aeneas',
    name: en('Aeneas'),
    role: en('Paralyzed man healed at Lydda'),
    summary: en(
      'He had been bedridden for eight years. Peter told him that Jesus Christ healed him, and he got up at once; all who lived at Lydda and in Sharon saw him and turned to the Lord.',
    ),
    refs: ['ACT 9:33-35'],
    groups: ['acts-figures'],
  },
  {
    id: 'tabitha',
    name: en('Tabitha'),
    alternateNames: ['Dorcas'],
    role: en('Disciple at Joppa raised by Peter'),
    summary: en(
      'A disciple at Joppa, full of good works and acts of mercy. When she died, the disciples sent for Peter; he prayed and told her to get up, and she sat up.',
    ),
    refs: ['ACT 9:36-41'],
    groups: ['women', 'early-church'],
    identityNote: en('Acts gives both names: Tabitha, which translated means Dorcas (Acts 9:36).'),
    origins: [{ placeId: 'joppa', ref: 'ACT 9:36' }],
  },
  {
    id: 'simon-the-tanner',
    name: en('Simon the tanner'),
    searchTerms: ['Simon'],
    role: en('Tanner in Joppa who hosted Peter'),
    summary: en(
      'Peter stayed many days at his house in Joppa, which was by the seaside. The messengers of Cornelius found Peter there.',
    ),
    refs: ['ACT 9:43', 'ACT 10:6', 'ACT 10:17-18', 'ACT 10:32'],
    groups: ['acts-figures'],
    origins: [{ placeId: 'joppa', ref: 'ACT 9:43' }],
  },
  {
    id: 'cornelius',
    name: en('Cornelius'),
    role: en('Centurion at Caesarea'),
    summary: en(
      'A devout centurion of the Italian Regiment who feared God with all his household. After a vision he sent for Peter, and while Peter spoke at his house the Holy Spirit fell on all who heard; Peter commanded that they be baptized.',
    ),
    refs: ['ACT 10:1-8', 'ACT 10:24-48', 'ACT 11:13-14'],
    groups: ['authorities', 'early-church'],
    origins: [{ placeId: 'caesarea', ref: 'ACT 10:1' }],
  },
  {
    id: 'herod-agrippa-i',
    name: en('Herod Agrippa I'),
    alternateNames: ['Herod', 'King Herod'],
    role: en('King who killed James and imprisoned Peter'),
    summary: en(
      'Acts calls him King Herod. He killed James the brother of John with the sword and imprisoned Peter, and later died at Caesarea after the people hailed his speech as the voice of a god.',
    ),
    refs: ['ACT 12:1-6', 'ACT 12:19-23'],
    groups: ['authorities'],
    identityNote: en(
      'Acts 12 calls him only Herod or King Herod; the name Agrippa does not appear there. He is usually identified with Herod Agrippa I, king of Judea in the early 40s AD, whose sudden death at Caesarea the Jewish historian Josephus also records. He is a different ruler from the Herod of Matthew 2, from Herod the tetrarch, and from King Agrippa of Acts 25–26.',
    ),
  },
  {
    id: 'rhoda',
    name: en('Rhoda'),
    role: en('Servant girl at the house of Mary'),
    summary: en(
      'When Peter knocked at the gate after his escape from prison, she recognized his voice and, for joy, ran in to tell the others without opening the gate.',
    ),
    refs: ['ACT 12:13-15'],
    groups: ['women', 'acts-figures'],
  },
  {
    id: 'mary-mother-of-john-mark',
    name: en('Mary, mother of John Mark'),
    searchTerms: ['Mary'],
    role: en('Mother of John Mark'),
    summary: en('Many were gathered praying at her house when Peter came there after an angel freed him from prison.'),
    refs: ['ACT 12:12'],
    groups: ['women', 'early-church'],
  },
  {
    id: 'james-brother-of-jesus',
    name: en('James, brother of Jesus'),
    alternateNames: ['James, the Lord’s brother'],
    searchTerms: ['James'],
    role: en('Brother of Jesus; spoke at the Jerusalem council'),
    summary: en(
      'Paul calls him the Lord’s brother and saw him when he went up to Jerusalem to visit Peter. In Acts, Peter sent word of his escape to James, James gave his judgment at the council, and Paul went in to see him on his last visit to Jerusalem.',
    ),
    refs: ['MRK 6:3', 'ACT 12:17', 'ACT 15:13', 'ACT 21:18', 'GAL 1:19'],
    groups: ['early-church'],
    identityNote: en(
      'Acts does not call this James the Lord’s brother; identifying him with James, the Lord’s brother, whom Paul met in Jerusalem (Galatians 1:19), is the usual reading. He is not James son of Zebedee, whose death Acts 12:2 records. Tradition has sometimes identified him with James son of Alphaeus, one of the Twelve; the text does not.',
    ),
  },
  {
    id: 'judas-barsabbas',
    name: en('Judas Barsabbas'),
    searchTerms: ['Judas', 'Barsabbas', 'Judas called Barsabbas'],
    role: en('Prophet sent from Jerusalem to Antioch'),
    summary: en(
      'One of the chief men among the brothers in Jerusalem, chosen with Silas to carry the council’s letter to Antioch. Being a prophet, he encouraged and strengthened the brothers there before being sent back in peace.',
    ),
    refs: ['ACT 15:22', 'ACT 15:27', 'ACT 15:32-33'],
    groups: ['early-church'],
    identityNote: en(
      'Acts calls him Judas called Barsabbas. He is a different person from Joseph called Barsabbas (Acts 1:23), from Judas Iscariot and from Judas son of James; Acts does not say whether he was related to Joseph.',
    ),
  },
]
