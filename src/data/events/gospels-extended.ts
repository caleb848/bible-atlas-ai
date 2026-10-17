import { en } from '../text'
import type { BiblicalEvent } from '../types'

/**
 * Further Gospel places, people and events: John the Baptist, the Twelve, the trials, the resurrection appearances. Each event cites one account; parallels are in relatedRefs.
 */
export const gospelsExtendedEvents: BiblicalEvent[] = [
  // John the Baptist: birth (Luke 1)
  {
    id: 'zacharias-in-the-temple',
    title: en('Zacharias in the temple'),
    summary: en(
      'While the priest Zacharias burned incense in the temple, the angel Gabriel told him that his wife Elizabeth would bear a son, to be named John. Because he did not believe, he was unable to speak. Afterward Elizabeth conceived and hid herself for five months.',
    ),
    placeIds: ['temple-mount'],
    personIds: ['zechariah', 'elizabeth'],
    passage: 'LUK 1:5-25',
    excerpt: 'LUK 1:11-14',
    tags: ['zechariah', 'angel gabriel', 'temple', 'incense', 'john the baptist'],
  },
  {
    id: 'mary-visits-elizabeth',
    title: en('Mary visits Elizabeth'),
    summary: en(
      'Mary went with haste into the hill country, to a city of Judah, and greeted Elizabeth in the house of Zacharias. The baby leaped in Elizabeth’s womb, and Elizabeth, filled with the Holy Spirit, blessed Mary, who praised God. Mary stayed about three months and then returned home.',
    ),
    placeIds: ['judean-hill-country'],
    locationNote: en(
      'Luke says only that Mary went into the hill country, to a city of Judah; the town is not named. The marker is a representative point for the hill country of Judea.',
    ),
    personIds: ['mary-mother', 'elizabeth'],
    passage: 'LUK 1:39-56',
    excerpt: 'LUK 1:39-42',
    tags: ['visitation', 'magnificat', 'elizabeth', 'hill country'],
  },
  {
    id: 'birth-of-john-the-baptist',
    title: en('The birth of John'),
    summary: en(
      'Elizabeth gave birth to a son. When those who came to circumcise him would have named him Zacharias, Elizabeth said he would be called John, and Zacharias wrote, “His name is John.” His mouth was opened, and, filled with the Holy Spirit, he prophesied. The child grew and was in the desert until his public appearance to Israel.',
    ),
    placeIds: ['judean-hill-country'],
    locationNote: en(
      'Luke does not name the town. Mary had visited Elizabeth in a city of Judah in the hill country (Luke 1:39–40), and these things were talked about throughout all the hill country of Judea (1:65). The marker is a representative point for the region.',
    ),
    personIds: ['elizabeth', 'zechariah', 'john-the-baptist'],
    passage: 'LUK 1:57-80',
    excerpt: 'LUK 1:59-64',
    tags: ['john the baptist', 'birth', 'circumcision', 'benedictus', 'naming'],
  },

  // John the Baptist: ministry
  {
    id: 'john-preaches-in-the-wilderness',
    title: en('John preaches in the wilderness'),
    summary: en(
      'John the Baptizer preached in the wilderness of Judea, calling people to repent because the Kingdom of Heaven was at hand. People from Jerusalem, Judea and the region around the Jordan were baptized by him in the Jordan, confessing their sins. He warned the Pharisees and Sadducees and spoke of one mightier coming after him.',
    ),
    placeIds: ['judea-wilderness', 'jordan-river'],
    locationNote: en(
      'Matthew says John preached in the wilderness of Judea and baptized in the Jordan; neither spot is identified more closely. The wilderness marker is a representative point.',
    ),
    personIds: ['john-the-baptist'],
    passage: 'MAT 3:1-12',
    excerpt: 'MAT 3:1-6',
    relatedRefs: ['MRK 1:2-8', 'LUK 3:2-18'],
    tags: ['john the baptist', 'repentance', 'baptism', 'wilderness', 'jordan'],
  },
  {
    id: 'johns-testimony-beyond-the-jordan',
    title: en('John’s testimony beyond the Jordan'),
    summary: en(
      'When priests and Levites from Jerusalem asked John who he was, he said he was not the Christ but the voice of one crying in the wilderness. The next day he saw Jesus coming and called him the Lamb of God, testifying that he had seen the Spirit descend and remain on him.',
    ),
    placeIds: ['jordan-river'],
    locationNote: en(
      'John 1:28 names Bethany beyond the Jordan, where John was baptizing. Its site is debated; the Jordan River marker shows Al-Maghtas, one proposed site. The next day’s testimony (1:29–34) is not separately located.',
    ),
    personIds: ['john-the-baptist', 'jesus'],
    passage: 'JHN 1:19-34',
    excerpt: 'JHN 1:26-29',
    relatedRefs: ['MRK 1:7-8', 'LUK 3:15-16'],
    tags: ['john the baptist', 'lamb of god', 'bethany beyond the jordan', 'testimony'],
  },
  {
    id: 'first-disciples-follow-jesus',
    title: en('The first disciples follow Jesus'),
    summary: en(
      'The next day John looked at Jesus and called him the Lamb of God. Two of John’s disciples heard him, followed Jesus and stayed with him that day. One of them, Andrew, brought his brother Simon to Jesus, who said he would be called Cephas, that is, Peter.',
    ),
    placeIds: ['jordan-river'],
    locationNote: en(
      'John does not name the place. The preceding verses set John the Baptist at Bethany beyond the Jordan (John 1:28), which the Jordan River marker represents.',
    ),
    personIds: ['john-the-baptist', 'jesus', 'andrew', 'peter'],
    passage: 'JHN 1:35-42',
    excerpt: 'JHN 1:35-39',
    relatedRefs: ['MRK 1:16-18'],
    tags: ['disciples', 'andrew', 'cephas', 'lamb of god', 'calling'],
  },
  {
    id: 'john-baptizes-at-enon',
    title: en('John baptizes at Enon'),
    summary: en(
      'While Jesus and his disciples were in Judea, John was baptizing at Enon near Salim, where there was much water. When his disciples told him that everyone was going to Jesus, John answered that he was not the Christ but had been sent before him, and that Jesus must increase while he decreased.',
    ),
    placeIds: ['aenon'],
    personIds: ['john-the-baptist'],
    passage: 'JHN 3:22-30',
    excerpt: 'JHN 3:23-26',
    tags: ['john the baptist', 'baptism', 'enon', 'aenon', 'salim'],
  },

  // Ministry
  {
    id: 'nicodemus-comes-by-night',
    title: en('Nicodemus comes by night'),
    summary: en(
      'Nicodemus, a Pharisee and a ruler of the Jews, came to Jesus by night and called him a teacher come from God. Jesus told him that unless one is born anew he cannot see God’s Kingdom, and spoke of being born of water and Spirit.',
    ),
    placeIds: ['jerusalem'],
    locationNote: en('John does not name the place; the preceding verses place Jesus in Jerusalem at the Passover (John 2:23).'),
    personIds: ['jesus', 'nicodemus'],
    passage: 'JHN 3:1-21',
    excerpt: 'JHN 3:1-4',
    relatedRefs: ['JHN 7:50-52', 'JHN 19:39'],
    tags: ['nicodemus', 'born anew', 'born again', 'pharisee', 'night'],
  },
  {
    id: 'jesus-settles-in-capernaum',
    title: en('Jesus makes his home in Capernaum'),
    summary: en(
      'When Jesus heard that John had been delivered up, he withdrew into Galilee. Leaving Nazareth, he went to live in Capernaum by the sea, and from that time he began to preach that people should repent, because the Kingdom of Heaven was at hand.',
    ),
    placeIds: ['capernaum'],
    personIds: ['jesus'],
    passage: 'MAT 4:12-17',
    excerpt: 'MAT 4:12-13',
    relatedRefs: ['MRK 1:14-15', 'LUK 4:31'],
    tags: ['capernaum', 'galilee', 'preaching', 'kingdom of heaven'],
  },
  {
    id: 'peters-mother-in-law-healed',
    title: en('Peter’s mother-in-law healed'),
    summary: en(
      'Coming out of the synagogue in Capernaum, Jesus went with Simon, Andrew, James and John into the house of Simon and Andrew, where Simon’s wife’s mother lay sick with a fever. He took her by the hand and raised her up; the fever left her, and she served them.',
    ),
    placeIds: ['capernaum'],
    locationNote: en('Mark says they went from the synagogue in Capernaum (Mark 1:21) to the house of Simon and Andrew.'),
    personIds: ['jesus', 'peter', 'andrew', 'james-zebedee', 'john-zebedee', 'peters-mother-in-law'],
    passage: 'MRK 1:29-31',
    relatedRefs: ['MAT 8:14-15', 'LUK 4:38-39'],
    tags: ['healing', 'fever', 'miracle', 'capernaum'],
  },
  {
    id: 'call-of-matthew',
    title: en('The call of Matthew'),
    summary: en(
      'Jesus saw Matthew sitting at the tax collection office and told him to follow him, and Matthew got up and followed. When many tax collectors and sinners ate with Jesus and his disciples in the house, Jesus told the Pharisees who objected that he came to call sinners, not the righteous.',
    ),
    placeIds: ['capernaum'],
    locationNote: en(
      'Matthew places this as Jesus went on from his own city, which he had reached by boat (Matthew 9:1, 9); Matthew earlier says Jesus went to live in Capernaum (4:13). Mark and Luke call the tax collector Levi; Mark places the call beside the sea after Jesus returned to Capernaum (Mark 2:1, 13–14).',
    ),
    personIds: ['jesus', 'matthew'],
    passage: 'MAT 9:9-13',
    excerpt: 'MAT 9:9-10',
    relatedRefs: ['MRK 2:13-17', 'LUK 5:27-32'],
    tags: ['tax collector', 'levi', 'calling', 'sinners'],
  },
  {
    id: 'appointing-the-twelve',
    title: en('Appointing the Twelve'),
    summary: en(
      'Jesus went up into the mountain and appointed twelve to be with him and to be sent out to preach: Simon, whom he named Peter; James son of Zebedee and his brother John; Andrew; Philip; Bartholomew; Matthew; Thomas; James son of Alphaeus; Thaddaeus; Simon the Zealot; and Judas Iscariot.',
    ),
    placeIds: ['galilee'],
    locationNote: en(
      'Mark says only that Jesus went up into the mountain, after withdrawing to the sea with his disciples (Mark 3:7, 13); Luke also says the mountain (Luke 6:12). Neither names it. Mark’s account is set in Galilee here, so the marker is a representative point for the region.',
    ),
    personIds: [
      'jesus',
      'peter',
      'james-zebedee',
      'john-zebedee',
      'andrew',
      'philip-apostle',
      'bartholomew',
      'matthew',
      'thomas',
      'james-alphaeus',
      'thaddaeus',
      'simon-zealot',
      'judas-iscariot',
    ],
    passage: 'MRK 3:13-19',
    excerpt: 'MRK 3:13-15',
    relatedRefs: ['MAT 10:1-4', 'LUK 6:12-16', 'ACT 1:13'],
    tags: ['twelve', 'apostles', 'disciples', 'calling'],
  },
  {
    id: 'sermon-on-the-mount',
    title: en('The Sermon on the Mount'),
    summary: en(
      'Seeing the crowds, Jesus went up onto the mountain and sat down, and his disciples came to him. He taught them, beginning with a series of blessings. When he had finished, the crowds were astonished, because he taught with authority and not like the scribes.',
    ),
    placeIds: ['galilee'],
    locationNote: en(
      'Matthew says only that Jesus went up onto the mountain while going about Galilee (Matthew 4:23–5:1); afterward he entered Capernaum (8:5). The mountain is not named, and the marker is a representative point for Galilee.',
    ),
    personIds: ['jesus'],
    passage: 'MAT 5:1-7:29',
    excerpt: 'MAT 5:1-3',
    relatedRefs: ['LUK 6:17-49'],
    tags: ['sermon on the mount', 'beatitudes', 'teaching', 'mountain'],
  },
  {
    id: 'jairus-daughter',
    title: en('Jairus’ daughter raised'),
    summary: en(
      'By the sea, Jairus, a synagogue ruler, begged Jesus to heal his dying daughter. On the way a woman who had bled for twelve years touched his clothes and was healed. Though the girl was reported dead, Jesus went to the house with Peter, James and John, took her by the hand, and she rose.',
    ),
    placeIds: ['sea-of-galilee'],
    locationNote: en(
      'Mark says only that Jesus had crossed back over by boat and was by the sea when Jairus came (Mark 5:21); the town where Jairus lived is not named.',
    ),
    personIds: ['jesus', 'jairus', 'woman-with-a-flow-of-blood', 'peter', 'james-zebedee', 'john-zebedee'],
    passage: 'MRK 5:21-43',
    excerpt: 'MRK 5:21-24',
    relatedRefs: ['MAT 9:18-26', 'LUK 8:40-56'],
    tags: ['jairus', 'raised from the dead', 'healing', 'miracle', 'faith'],
  },
  {
    id: 'sign-demanded-near-magdala',
    title: en('A sign demanded near Magdala'),
    summary: en(
      'After Jesus came by boat into the borders of Magdala, Pharisees and Sadducees came to test him by asking for a sign from heaven. He said they could read the sky but not the signs of the times, and that no sign would be given except the sign of Jonah. Then he left them.',
    ),
    placeIds: ['magdala'],
    locationNote: en(
      'Matthew says Jesus came into the borders of Magdala (Matthew 15:39); many manuscripts and modern translations read Magadan. Mark’s parallel names the region of Dalmanutha (Mark 8:10).',
    ),
    personIds: ['jesus'],
    passage: 'MAT 15:39-16:4',
    excerpt: 'MAT 16:1-4',
    relatedRefs: ['MRK 8:10-13'],
    tags: ['sign', 'pharisees', 'sadducees', 'jonah', 'magdala'],
  },
  {
    id: 'greeks-ask-to-see-jesus',
    title: en('Greeks ask to see Jesus'),
    summary: en(
      'Some Greeks who had come up to worship at the feast told Philip, of Bethsaida, that they wanted to see Jesus. Philip and Andrew told Jesus, who answered that the time had come for the Son of Man to be glorified, and spoke of a grain of wheat that dies and bears much fruit.',
    ),
    placeIds: ['jerusalem'],
    locationNote: en(
      'John does not say where the Greeks approached Philip; they had come up to worship at the feast, after Jesus entered Jerusalem (John 12:12–20).',
    ),
    personIds: ['philip-apostle', 'andrew', 'jesus'],
    passage: 'JHN 12:20-26',
    excerpt: 'JHN 12:20-23',
    tags: ['greeks', 'philip', 'andrew', 'grain of wheat', 'feast'],
  },

  // The arrest, trials and crucifixion
  {
    id: 'jesus-before-annas',
    title: en('Jesus before Annas'),
    summary: en(
      'Jesus was bound and taken first to Annas, father-in-law of Caiaphas, the high priest that year. Let into the court, Peter told the maid at the door he was not one of Jesus’ disciples. The high priest questioned Jesus about his disciples and teaching, an officer struck him, and Annas sent him bound to Caiaphas.',
    ),
    placeIds: ['jerusalem'],
    locationNote: en('John speaks of the court of the high priest (John 18:15) but does not locate it.'),
    personIds: ['jesus', 'annas', 'peter'],
    passage: 'JHN 18:12-24',
    excerpt: 'JHN 18:12-14',
    relatedRefs: ['JHN 18:25-27'],
    tags: ['trial', 'annas', 'high priest', 'peter'],
  },
  {
    id: 'jesus-before-caiaphas',
    title: en('Jesus before Caiaphas'),
    summary: en(
      'Jesus was led to Caiaphas the high priest, where the scribes and elders had gathered, and Peter followed at a distance into the court. When Jesus answered the high priest’s demand to say whether he was the Christ, the high priest said he had spoken blasphemy, and they declared him worthy of death.',
    ),
    placeIds: ['jerusalem'],
    locationNote: en('Matthew speaks of the court of the high priest (Matthew 26:58) but does not locate it.'),
    personIds: ['jesus', 'caiaphas', 'peter'],
    passage: 'MAT 26:57-68',
    excerpt: 'MAT 26:62-64',
    relatedRefs: ['MRK 14:53-65', 'LUK 22:63-71'],
    tags: ['trial', 'caiaphas', 'high priest', 'council', 'blasphemy'],
  },
  {
    id: 'peters-denial',
    title: en('Peter denies Jesus'),
    summary: en(
      'When Jesus was taken to the high priest’s house, Peter followed at a distance and sat by a fire in the courtyard. Three times people said he had been with Jesus, and three times he denied it. As a rooster crowed, the Lord turned and looked at Peter, and he went out and wept bitterly.',
    ),
    placeIds: ['jerusalem'],
    locationNote: en('Luke speaks of the high priest’s house and its courtyard (Luke 22:54–55) but does not locate them.'),
    personIds: ['peter', 'jesus'],
    passage: 'LUK 22:54-62',
    excerpt: 'LUK 22:59-62',
    relatedRefs: ['MAT 26:69-75', 'MRK 14:66-72', 'JHN 18:15-18', 'JHN 18:25-27'],
    tags: ['denial', 'peter', 'rooster', 'courtyard'],
  },
  {
    id: 'jesus-before-pilate',
    title: en('Jesus before Pilate'),
    summary: en(
      'In the morning the chief priests and the council bound Jesus and handed him over to Pilate, who asked whether he was the King of the Jews. Stirred up by the chief priests, the crowd asked for Barabbas to be released instead. Pilate released Barabbas, had Jesus flogged and handed him over to be crucified.',
    ),
    placeIds: ['jerusalem'],
    locationNote: en(
      'Mark does not say where Pilate heard the case; afterward the soldiers led Jesus into the court called the Praetorium (Mark 15:16).',
    ),
    personIds: ['jesus', 'pontius-pilate', 'barabbas'],
    passage: 'MRK 15:1-15',
    excerpt: 'MRK 15:1-5',
    relatedRefs: ['MAT 27:11-26', 'LUK 23:1-5', 'LUK 23:13-25', 'JHN 18:28-19:16'],
    tags: ['trial', 'pilate', 'barabbas', 'king of the jews'],
  },
  {
    id: 'jesus-before-herod',
    title: en('Jesus before Herod'),
    summary: en(
      'Learning that Jesus was under Herod’s jurisdiction, Pilate sent him to Herod, who was also in Jerusalem. Herod questioned him at length, but Jesus gave no answers while the chief priests and scribes accused him. Herod and his soldiers mocked him and sent him back to Pilate, and that day Herod and Pilate became friends.',
    ),
    placeIds: ['jerusalem'],
    personIds: ['jesus', 'herod-antipas', 'pontius-pilate'],
    passage: 'LUK 23:6-12',
    excerpt: 'LUK 23:6-9',
    relatedRefs: ['LUK 9:9', 'ACT 4:27'],
    tags: ['trial', 'herod', 'pilate', 'mocking'],
  },
  {
    id: 'simon-carries-the-cross',
    title: en('Simon of Cyrene carries the cross'),
    summary: en(
      'As Jesus was led out to be crucified, the soldiers compelled a passer-by coming from the country, Simon of Cyrene, the father of Alexander and Rufus, to go with them and carry his cross.',
    ),
    placeIds: ['jerusalem'],
    locationNote: en(
      'Mark says this happened as Jesus was led out to be crucified, before they brought him to Golgotha (Mark 15:20–22); the spot is not identified.',
    ),
    personIds: ['simon-of-cyrene', 'jesus'],
    passage: 'MRK 15:21',
    relatedRefs: ['MAT 27:32', 'LUK 23:26', 'JHN 19:17'],
    tags: ['simon of cyrene', 'cross', 'crucifixion', 'cyrene'],
  },
  {
    id: 'mother-of-jesus-at-the-cross',
    title: en('Jesus’ mother at the cross'),
    summary: en(
      'Standing by the cross were Jesus’ mother, his mother’s sister, Mary the wife of Clopas, and Mary Magdalene. Seeing his mother and the disciple whom he loved, Jesus told her that the disciple was her son, and told the disciple that she was his mother; from that hour the disciple took her into his home.',
    ),
    placeIds: ['golgotha'],
    personIds: ['jesus', 'mary-mother', 'mary-wife-of-clopas', 'mary-magdalene', 'beloved-disciple'],
    passage: 'JHN 19:25-27',
    relatedRefs: ['MRK 15:40-41', 'LUK 23:49'],
    tags: ['cross', 'mary', 'beloved disciple', 'crucifixion'],
  },

  // Resurrection and ascension
  {
    id: 'women-report-the-empty-tomb',
    title: en('The women report the empty tomb'),
    summary: en(
      'At dawn the women found the stone rolled away and the body gone, and two men in dazzling clothing told them he had risen. Mary Magdalene, Joanna, Mary the mother of James and others told the apostles, who did not believe them. Peter ran to the tomb and saw the linen strips lying by themselves.',
    ),
    placeIds: ['golgotha'],
    locationNote: en(
      'Luke does not say where the tomb was or where the apostles were when the women returned to them. John places the tomb in a garden at the place of the crucifixion (John 19:41); the marker shows the traditional site.',
    ),
    personIds: ['mary-magdalene', 'joanna', 'mary-mother-of-james', 'peter'],
    passage: 'LUK 24:1-12',
    excerpt: 'LUK 24:9-12',
    relatedRefs: ['MAT 28:1-8', 'MRK 16:1-8', 'JHN 20:1-10'],
    tags: ['empty tomb', 'resurrection', 'women', 'angels', 'easter'],
  },
  {
    id: 'appearance-to-mary-magdalene',
    title: en('Jesus appears to Mary Magdalene'),
    summary: en(
      'Mary Magdalene stood weeping outside the tomb and saw two angels where the body had lain. Turning, she saw Jesus but took him for the gardener until he called her by name. He sent her to his brothers, and she told the disciples that she had seen the Lord.',
    ),
    placeIds: ['golgotha'],
    locationNote: en(
      'John says the tomb was in a garden at the place where Jesus was crucified (John 19:41–42); the marker shows the traditional site.',
    ),
    personIds: ['mary-magdalene', 'jesus'],
    passage: 'JHN 20:11-18',
    excerpt: 'JHN 20:14-16',
    relatedRefs: ['MAT 28:9-10'],
    tags: ['resurrection appearance', 'mary magdalene', 'gardener', 'rabboni', 'easter'],
  },
  {
    id: 'jesus-meets-the-women',
    title: en('Jesus meets the women'),
    summary: en(
      'Leaving the tomb with fear and great joy, Mary Magdalene and the other Mary ran to tell the disciples. Jesus met them on the way; they took hold of his feet and worshiped him, and he told them to tell his brothers to go to Galilee, where they would see him.',
    ),
    placeIds: ['golgotha'],
    locationNote: en(
      'Matthew says Jesus met the women after they left the tomb, on their way to the disciples; the place is not named. The marker shows the traditional site of the tomb.',
    ),
    personIds: ['mary-magdalene', 'jesus'],
    passage: 'MAT 28:8-10',
    relatedRefs: ['JHN 20:14-18'],
    tags: ['resurrection appearance', 'women', 'easter', 'galilee'],
  },
  {
    id: 'risen-jesus-among-the-disciples',
    title: en('Jesus stands among the disciples'),
    summary: en(
      'In Jerusalem, while Cleopas and his companion were telling the Eleven and those with them what had happened, Jesus stood among them. He showed them his hands and feet, ate broiled fish before them, opened their minds to the Scriptures, and told them to wait in the city until clothed with power from on high.',
    ),
    placeIds: ['jerusalem'],
    locationNote: en('Luke says the two returned to Jerusalem and found the Eleven gathered together (Luke 24:33); the house is not identified.'),
    personIds: ['jesus', 'cleopas'],
    passage: 'LUK 24:36-49',
    excerpt: 'LUK 24:36-40',
    relatedRefs: ['JHN 20:19-23'],
    tags: ['resurrection appearance', 'disciples', 'peace be to you', 'scriptures'],
  },
  {
    id: 'thomas-sees-the-risen-jesus',
    title: en('Thomas sees the risen Jesus'),
    summary: en(
      'Thomas, absent when Jesus first came to the disciples, said he would not believe unless he saw and touched the marks of the nails and Jesus’ side. Eight days later, with the doors locked, Jesus came again and told Thomas to reach out his hand, and Thomas called him his Lord and his God.',
    ),
    placeIds: ['jerusalem'],
    locationNote: en(
      'John does not name the city or the house; the disciples were meeting behind locked doors (John 20:19, 26). Jerusalem, near which John places the cross and the tomb (John 19:20, 41–42), is the implied setting.',
    ),
    personIds: ['jesus', 'thomas'],
    passage: 'JHN 20:24-29',
    excerpt: 'JHN 20:26-29',
    tags: ['resurrection appearance', 'thomas', 'doubt', 'my lord and my god'],
  },
  {
    id: 'breakfast-by-the-sea-of-tiberias',
    title: en('Breakfast by the Sea of Tiberias'),
    summary: en(
      'Peter, Thomas, Nathanael, the sons of Zebedee and two other disciples fished all night and caught nothing. At dawn Jesus, unrecognized on the beach, told them where to cast the net, and it filled with fish. The disciple whom Jesus loved said it was the Lord, and Jesus gave them bread and fish.',
    ),
    placeIds: ['sea-of-galilee'],
    locationNote: en('John calls the lake the sea of Tiberias (John 21:1); the scene is in the boat and on the shore.'),
    personIds: ['jesus', 'peter', 'thomas', 'nathanael', 'james-zebedee', 'john-zebedee', 'beloved-disciple'],
    passage: 'JHN 21:1-14',
    excerpt: 'JHN 21:4-7',
    tags: ['resurrection appearance', 'fishing', 'breakfast', 'sea of tiberias', '153 fish'],
  },
  {
    id: 'mountain-in-galilee',
    title: en('On the mountain in Galilee'),
    summary: en(
      'The eleven disciples went to the mountain in Galilee where Jesus had sent them. When they saw him they bowed down, though some doubted. Jesus told them to make disciples of all nations, baptizing and teaching them, and said he would be with them always, to the end of the age.',
    ),
    placeIds: ['galilee'],
    locationNote: en('Matthew does not name the mountain (Matthew 28:16). The marker is a representative point for Galilee.'),
    personIds: ['jesus'],
    passage: 'MAT 28:16-20',
    excerpt: 'MAT 28:16-19',
    relatedRefs: ['MAT 26:32', 'MAT 28:7'],
    tags: ['great commission', 'resurrection appearance', 'galilee', 'mountain'],
  },
  {
    id: 'ascension-in-luke',
    title: en('The ascension in Luke’s Gospel'),
    summary: en(
      'Jesus led the disciples out as far as Bethany, lifted up his hands and blessed them, and while blessing them withdrew from them and was carried up into heaven. They worshiped him, returned to Jerusalem with great joy, and were continually in the temple praising God.',
    ),
    placeIds: ['bethany'],
    locationNote: en(
      'Luke says Jesus led them out as far as Bethany (Luke 24:50) but does not give the exact spot. Acts tells the ascension separately and names the mountain called Olivet (Acts 1:9–12).',
    ),
    personIds: ['jesus'],
    passage: 'LUK 24:50-53',
    excerpt: 'LUK 24:50-51',
    relatedRefs: ['ACT 1:9-12'],
    tags: ['ascension', 'bethany', 'blessing', 'taken up'],
  },
]
